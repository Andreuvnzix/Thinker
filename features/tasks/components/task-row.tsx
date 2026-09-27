"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { PriorityMark } from "@/features/tasks/components/priority-icon";
import { cn } from "@/lib/utils";
import { formatDurationMinutes } from "@/lib/utils/time";
import type { Task } from "@/lib/types/domain";

export function TaskRow({
  task,
  onToggle,
  overdue,
}: {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  overdue?: boolean;
}) {
  const completed = task.status === "completed";

  return (
    <div className="flex min-h-11 items-stretch gap-3 py-1.5">
      <PriorityMark priority={task.priority} />
      <Checkbox
        checked={completed}
        onCheckedChange={(checked) => onToggle(task.id, checked === true)}
        className="mt-0.5 h-5 w-5 shrink-0 self-start"
        aria-label={`Mark "${task.title}" as ${completed ? "not done" : "done"}`}
      />
      <div className="min-w-0 flex-1">
        <p className={cn("text-body leading-snug", completed && "text-muted-foreground line-through")}>
          {task.title}
        </p>
        {(task.scheduledTime || task.estimatedMinutes || overdue) && (
          <p className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
            {overdue && <span className="font-medium text-accent-signal">OVERDUE</span>}
            {task.scheduledTime && <span className="font-mono-time">{task.scheduledTime}</span>}
            {task.estimatedMinutes && <span className="font-mono-time">{formatDurationMinutes(task.estimatedMinutes)}</span>}
          </p>
        )}
      </div>
    </div>
  );
}
