import type { CalendarEvent, DailyPlanBlock, Task } from "@/lib/types/domain";
import { minutesSinceMidnight } from "@/lib/utils/time";

/**
 * Deterministic, rule-based v1 planner: fills the gaps between today's calendar
 * events with pending tasks (highest priority first), respecting working hours.
 * Architected to be swapped for an LLM-based planner later (see ROADMAP in
 * PROJECT_STATUS.md) without changing the DailyPlanBlock shape callers consume.
 */
export function generateDailyPlan(
  tasks: Task[],
  events: CalendarEvent[],
  options: { workingHoursStart?: string; workingHoursEnd?: string; defaultTaskMinutes?: number } = {},
): DailyPlanBlock[] {
  const dayStart = toMinutes(options.workingHoursStart ?? "09:00");
  const dayEnd = toMinutes(options.workingHoursEnd ?? "18:00");
  const defaultMinutes = options.defaultTaskMinutes ?? 30;

  const busy = events
    .map((e) => ({ start: minutesSinceMidnight(e.startAt), end: minutesSinceMidnight(e.endAt) }))
    .sort((a, b) => a.start - b.start);

  const gaps: { start: number; end: number }[] = [];
  let cursor = dayStart;
  for (const interval of busy) {
    if (interval.start > cursor) gaps.push({ start: cursor, end: Math.min(interval.start, dayEnd) });
    cursor = Math.max(cursor, interval.end);
  }
  if (cursor < dayEnd) gaps.push({ start: cursor, end: dayEnd });

  const pendingTasks = [...tasks]
    .filter((t) => t.status === "pending" || t.status === "in_progress")
    .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority));

  const blocks: DailyPlanBlock[] = events.map((e, i) => ({
    id: `plan-event-${e.id}`,
    type: "event",
    title: e.title,
    startAt: e.startAt,
    endAt: e.endAt,
    taskId: null,
    calendarEventId: e.id,
    status: "accepted",
    position: i * 10,
  }));

  let position = events.length * 10 + 5;
  for (const gap of gaps) {
    let gapCursor = gap.start;
    while (gapCursor < gap.end && pendingTasks.length > 0) {
      const duration = Math.min(pendingTasks[0].estimatedMinutes ?? defaultMinutes, gap.end - gapCursor);
      if (duration < 10) break;
      const task = pendingTasks.shift()!;
      blocks.push({
        id: `plan-task-${task.id}`,
        type: "task",
        title: task.title,
        startAt: fromMinutesToday(gapCursor),
        endAt: fromMinutesToday(gapCursor + duration),
        taskId: task.id,
        calendarEventId: null,
        status: "suggested",
        position: position++,
      });
      gapCursor += duration;
    }
  }

  return blocks.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
}

function priorityWeight(p: Task["priority"]): number {
  return { urgent: 3, high: 2, normal: 1, low: 0 }[p];
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutesToday(minutes: number): string {
  const d = new Date();
  d.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return d.toISOString();
}
