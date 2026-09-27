"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Timeline } from "@/features/today/components/timeline";
import { formatDayHeader } from "@/lib/utils/time";
import type { CalendarEvent } from "@/lib/types/domain";

export function CalendarDayView({ events }: { events: CalendarEvent[] }) {
  const [offset, setOffset] = useState(0);
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const { weekday, dateLabel } = formatDayHeader(date);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-display text-title">{weekday}</p>
          <p className="text-body-sm text-muted-foreground">{dateLabel}</p>
        </div>
        <div className="flex gap-1">
          <button
            aria-label="Previous day"
            onClick={() => setOffset((o) => o - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Next day"
            onClick={() => setOffset((o) => o + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      {offset === 0 ? (
        <Timeline events={events} />
      ) : (
        <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-body-sm text-muted-foreground">
          Connect Google Calendar to browse other days.
        </p>
      )}
    </div>
  );
}
