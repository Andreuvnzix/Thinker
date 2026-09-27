import { describe, expect, it } from "vitest";
import { generateDailyPlan } from "@/features/planning/lib/generate-plan";
import type { CalendarEvent, Task } from "@/lib/types/domain";

function taskAt(id: string, priority: Task["priority"], estimatedMinutes = 30): Task {
  return {
    id,
    userId: "u1",
    listId: null,
    title: id,
    description: null,
    status: "pending",
    priority,
    scheduledDate: null,
    scheduledTime: null,
    dueDate: null,
    estimatedMinutes,
    notes: null,
    labelIds: [],
    position: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  };
}

function eventAt(id: string, startHour: number, endHour: number): CalendarEvent {
  const start = new Date();
  start.setHours(startHour, 0, 0, 0);
  const end = new Date();
  end.setHours(endHour, 0, 0, 0);
  return {
    id,
    userId: "u1",
    calendarAccountId: "acc",
    providerEventId: id,
    calendarName: "Work",
    title: id,
    description: null,
    location: null,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    allDay: false,
    attendees: [],
    meetingUrl: null,
    isCancelled: false,
  };
}

describe("generateDailyPlan", () => {
  it("places tasks in the gaps around events, respecting working hours", () => {
    const events = [eventAt("standup", 9, 10)];
    const tasks = [taskAt("urgent-task", "urgent", 30), taskAt("normal-task", "normal", 30)];

    const blocks = generateDailyPlan(tasks, events, { workingHoursStart: "09:00", workingHoursEnd: "12:00" });

    expect(blocks.some((b) => b.type === "event" && b.calendarEventId === "standup")).toBe(true);
    const taskBlocks = blocks.filter((b) => b.type === "task");
    expect(taskBlocks).toHaveLength(2);
    // Higher priority task should be scheduled first among task blocks.
    expect(taskBlocks[0].taskId).toBe("urgent-task");
    // No task block should overlap the event window (09:00-10:00).
    for (const block of taskBlocks) {
      const start = new Date(block.startAt).getHours();
      expect(start === 9).toBe(false);
    }
  });

  it("skips tasks that no longer fit in any remaining gap", () => {
    const events = [eventAt("full-day", 9, 17)];
    const tasks = [taskAt("t1", "normal", 30)];

    const blocks = generateDailyPlan(tasks, events, { workingHoursStart: "09:00", workingHoursEnd: "17:30" });

    const taskBlocks = blocks.filter((b) => b.type === "task");
    expect(taskBlocks).toHaveLength(1);
    expect(new Date(taskBlocks[0].startAt).getHours()).toBe(17);
  });
});
