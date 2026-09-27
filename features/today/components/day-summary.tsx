import type { TodayOverview } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

function Stat({ value, label, signal }: { value: number; label: string; signal?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={cn("text-title font-semibold tabular-nums", signal && value > 0 && "text-accent-signal")}>
        {value}
      </span>
      <span className="text-body-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export function DaySummary({ overview }: { overview: TodayOverview }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 border-y border-border py-3">
      <Stat value={overview.meetingsCount} label={overview.meetingsCount === 1 ? "meeting" : "meetings"} />
      <Stat value={overview.tasksCount} label={overview.tasksCount === 1 ? "task" : "tasks"} />
      <Stat value={overview.importantEmailsCount} label="important emails" />
      <Stat value={overview.overdueTasksCount} label="overdue" signal />
    </div>
  );
}
