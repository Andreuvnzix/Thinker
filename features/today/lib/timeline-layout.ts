import type { CalendarEvent } from "@/lib/types/domain";
import { minutesBetween, minutesSinceMidnight } from "@/lib/utils/time";

export const PX_PER_MINUTE = 1.1;
export const MIN_BLOCK_HEIGHT = 30;

export interface TimelineRange {
  startMinutes: number;
  endMinutes: number;
}

/** Visible window: 07:00–21:00, widened to fit any event that falls outside it. */
export function computeTimelineRange(events: CalendarEvent[]): TimelineRange {
  let start = 7 * 60;
  let end = 21 * 60;
  for (const event of events) {
    start = Math.min(start, minutesSinceMidnight(event.startAt));
    end = Math.max(end, minutesSinceMidnight(event.endAt));
  }
  return { startMinutes: start, endMinutes: end };
}

export function timelineHeightPx(range: TimelineRange): number {
  return (range.endMinutes - range.startMinutes) * PX_PER_MINUTE;
}

export function eventBlockStyle(event: CalendarEvent, range: TimelineRange) {
  const startOffset = minutesSinceMidnight(event.startAt) - range.startMinutes;
  const duration = Math.max(minutesBetween(event.startAt, event.endAt), 1);
  return {
    top: startOffset * PX_PER_MINUTE,
    height: Math.max(duration * PX_PER_MINUTE, MIN_BLOCK_HEIGHT),
  };
}

export function hourMarks(range: TimelineRange): number[] {
  const marks: number[] = [];
  const firstHour = Math.floor(range.startMinutes / 60);
  const lastHour = Math.ceil(range.endMinutes / 60);
  for (let h = firstHour; h <= lastHour; h++) marks.push(h * 60);
  return marks;
}

export function nowOffsetPx(range: TimelineRange): number | null {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (nowMinutes < range.startMinutes || nowMinutes > range.endMinutes) return null;
  return (nowMinutes - range.startMinutes) * PX_PER_MINUTE;
}
