"use client";

import Link from "next/link";
import { TaskRow } from "@/features/tasks/components/task-row";
import { useTasks } from "@/features/tasks/lib/use-tasks";
import type { Task } from "@/lib/types/domain";

export function PriorityTasks({ tasks }: { tasks: Task[] }) {
  const { tasks: liveTasks, toggleComplete } = useTasks(tasks);

  if (liveTasks.length === 0) {
    return (
      <p className="text-body-sm text-muted-foreground">Nothing left for today. Enjoy the quiet.</p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {liveTasks.map((task) => (
        <TaskRow key={task.id} task={task} onToggle={toggleComplete} overdue={isOverdue(task)} />
      ))}
      <div className="pt-2">
        <Link href="/tasks" className="text-body-sm text-muted-foreground underline-offset-4 hover:underline">
          View all tasks
        </Link>
      </div>
    </div>
  );
}

function isOverdue(task: Task): boolean {
  if (task.status === "completed") return false;
  if (!task.dueDate) return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
}
