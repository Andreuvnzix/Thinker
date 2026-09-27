"use client";

import { useMemo, useState } from "react";
import { useTasks } from "@/features/tasks/lib/use-tasks";
import { QuickAddTask } from "@/features/tasks/components/quick-add-task";
import { TaskRow } from "@/features/tasks/components/task-row";
import { cn } from "@/lib/utils";
import { isToday } from "@/lib/utils/time";
import type { Task } from "@/lib/types/domain";

type Filter = "today" | "upcoming" | "overdue" | "all";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "overdue", label: "Overdue" },
  { key: "all", label: "All" },
];

function isOverdue(task: Task): boolean {
  if (task.status === "completed" || task.status === "cancelled") return false;
  if (!task.dueDate) return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
}

export function TasksView({ initialTasks }: { initialTasks: Task[] }) {
  const { tasks, addTask, toggleComplete } = useTasks(initialTasks);
  const [filter, setFilter] = useState<Filter>("today");

  const filtered = useMemo(() => {
    switch (filter) {
      case "today":
        return tasks.filter((t) => (t.scheduledDate && isToday(t.scheduledDate)) || isOverdue(t));
      case "overdue":
        return tasks.filter(isOverdue);
      case "upcoming":
        return tasks.filter((t) => t.scheduledDate && !isToday(t.scheduledDate) && !isOverdue(t));
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const pending = filtered.filter((t) => t.status !== "completed" && t.status !== "cancelled");
  const completed = filtered.filter((t) => t.status === "completed");

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:px-8 md:pt-10">
      <h1 className="font-display text-display">Tasks</h1>

      <div className="mt-4 flex gap-1 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-body-sm text-muted-foreground",
              filter === f.key && "bg-secondary text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <QuickAddTask onAdd={addTask} />

      {pending.length === 0 && completed.length === 0 && (
        <p className="py-10 text-center text-body-sm text-muted-foreground">Nothing here. Add a task above.</p>
      )}

      <div className="divide-y divide-border">
        {pending.map((task) => (
          <TaskRow key={task.id} task={task} onToggle={toggleComplete} overdue={isOverdue(task)} />
        ))}
      </div>

      {completed.length > 0 && (
        <div className="mt-4">
          <p className="text-micro font-medium tracking-wide text-muted-foreground">COMPLETED</p>
          <div className="divide-y divide-border">
            {completed.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={toggleComplete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
