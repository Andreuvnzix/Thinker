"use client";

import { useMemo, useState } from "react";
import { Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { generateDailyPlan } from "@/features/planning/lib/generate-plan";
import { formatClock, formatDurationMinutes, minutesBetween } from "@/lib/utils/time";
import type { CalendarEvent, DailyPlanBlock, Task } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

export function PlanMyDaySheet({ tasks, events }: { tasks: Task[]; events: CalendarEvent[] }) {
  const [open, setOpen] = useState(false);
  const [blocks, setBlocks] = useState<DailyPlanBlock[]>([]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) setBlocks(generateDailyPlan(tasks, events));
  }

  function setStatus(id: string, status: DailyPlanBlock["status"]) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  const acceptedCount = useMemo(() => blocks.filter((b) => b.status !== "discarded").length, [blocks]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={<Button variant="outline" size="sm" className="gap-1.5" />}>
        <Sparkles size={15} />
        Plan my day
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-h-[80vh] max-w-2xl overflow-y-auto rounded-t-lg">
        <SheetHeader>
          <SheetTitle className="font-display text-title">Today, planned</SheetTitle>
          <SheetDescription>
            Built from your calendar and pending tasks. Accept, discard, or leave — nothing is saved until you accept.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-1 px-4 pb-6">
          {blocks.length === 0 && (
            <p className="py-6 text-center text-body-sm text-muted-foreground">
              No free time left today — every gap is booked or every task is placed.
            </p>
          )}
          {blocks.map((block) => (
            <div
              key={block.id}
              className={cn(
                "flex items-center gap-3 rounded-md border-l-2 px-3 py-2",
                block.type === "event" ? "border-source-2 bg-secondary/30" : "border-accent-signal/50",
                block.status === "discarded" && "opacity-40",
              )}
            >
              <div className="w-16 shrink-0 font-mono-time text-[11px] text-muted-foreground">
                {formatClock(block.startAt)}
                <br />
                {formatDurationMinutes(minutesBetween(block.startAt, block.endAt))}
              </div>
              <p className={cn("flex-1 truncate text-body-sm", block.status === "discarded" && "line-through")}>
                {block.title}
              </p>
              {block.type === "task" && block.status !== "discarded" && (
                <button
                  type="button"
                  aria-label="Discard block"
                  onClick={() => setStatus(block.id, "discarded")}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
                >
                  <X size={15} />
                </button>
              )}
              {block.status === "discarded" && (
                <button
                  type="button"
                  aria-label="Restore block"
                  onClick={() => setStatus(block.id, "suggested")}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
                >
                  <Check size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
        {blocks.length > 0 && (
          <div className="border-t border-border px-4 py-3 text-body-sm text-muted-foreground">
            {acceptedCount} of {blocks.length} blocks kept.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
