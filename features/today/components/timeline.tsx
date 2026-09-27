"use client";

import { useEffect, useState } from "react";
import { MapPin, Video } from "lucide-react";
import type { CalendarEvent } from "@/lib/types/domain";
import { computeTimelineRange, eventBlockStyle, hourMarks, nowOffsetPx, timelineHeightPx } from "@/features/today/lib/timeline-layout";
import { formatClock } from "@/lib/utils/time";

const SOURCE_HUES = ["source-1", "source-2", "source-3", "source-4", "source-5"] as const;

/** Width reserved for the hour-label gutter. Event blocks and dividers start after it. */
const GUTTER = 48;

function hueForCalendar(calendarName: string | null): string {
  const key = calendarName ?? "default";
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) % SOURCE_HUES.length;
  return SOURCE_HUES[hash];
}

export function Timeline({ events }: { events: CalendarEvent[] }) {
  const [now, setNow] = useState<number | null>(null);
  const range = computeTimelineRange(events);
  const height = timelineHeightPx(range);
  const marks = hourMarks(range);

  useEffect(() => {
    const update = () => setNow(nowOffsetPx(range));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events.length]);

  if (events.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border px-4 py-8 text-center text-body-sm text-muted-foreground">
        No meetings today. Connect Google Calendar in Settings to see your agenda here.
      </div>
    );
  }

  return (
    <div className="relative" style={{ height }}>
      {marks.map((minutes) => (
        <div key={minutes} className="absolute inset-x-0" style={{ top: (minutes - range.startMinutes) * 1.1 }}>
          <span
            className="font-mono-time absolute left-0 top-[-6px] text-right text-[11px] text-muted-foreground"
            style={{ width: GUTTER - 8 }}
          >
            {String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:00
          </span>
          <div className="absolute right-0 border-t border-border/70" style={{ left: GUTTER }} />
        </div>
      ))}

      {now !== null && (
        <div className="absolute inset-x-0 z-10" style={{ top: now }}>
          <span
            className="absolute left-0 top-[-7px] text-right text-[11px] font-medium text-accent-signal"
            style={{ width: GUTTER - 8 }}
          >
            now
          </span>
          <div className="absolute right-2 flex items-center" style={{ left: GUTTER }}>
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-signal" />
            <div className="h-px flex-1 bg-accent-signal" />
          </div>
        </div>
      )}

      {events.map((event) => {
        const style = eventBlockStyle(event, range);
        const hue = hueForCalendar(event.calendarName);
        return (
          <div
            key={event.id}
            className="absolute right-1 overflow-hidden rounded-md border-l-2 bg-secondary/60 px-3 py-1.5"
            style={{ top: style.top, height: style.height, left: GUTTER, borderLeftColor: `var(--${hue})` }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-body-sm font-medium">{event.title}</p>
              <span className="font-mono-time shrink-0 text-[11px] text-muted-foreground">
                {formatClock(event.startAt)}
              </span>
            </div>
            {style.height > 44 && (event.location || event.meetingUrl) && (
              <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                {event.meetingUrl ? <Video size={11} /> : <MapPin size={11} />}
                {event.meetingUrl ? "Video call" : event.location}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
