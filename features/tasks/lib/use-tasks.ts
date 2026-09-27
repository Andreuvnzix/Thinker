"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { isSupabaseConfigured } from "@/lib/env";
import { createTaskAction, deleteTaskAction, toggleTaskStatusAction, updateTaskAction } from "@/lib/actions/tasks";
import type { CreateTaskInput, UpdateTaskInput } from "@/lib/validation/task";
import type { Task } from "@/lib/types/domain";

/**
 * Bridges the Tasks UI to persistence. Until a real Supabase project exists
 * (lib/env.ts#isSupabaseConfigured), mutations apply to local state only so
 * the feature can be built and reviewed end-to-end; the same call sites hit
 * the real server actions the moment credentials are configured.
 */
export function useTasks(initialTasks: Task[]) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isPending, startTransition] = useTransition();

  const addTask = useCallback((input: CreateTaskInput) => {
    if (!isSupabaseConfigured) {
      const now = new Date().toISOString();
      setTasks((prev) => [
        ...prev,
        {
          id: `local-${crypto.randomUUID()}`,
          userId: "demo-user",
          listId: input.listId ?? null,
          title: input.title,
          description: input.description ?? null,
          status: "pending",
          priority: input.priority,
          scheduledDate: input.scheduledDate ?? null,
          scheduledTime: input.scheduledTime ?? null,
          dueDate: input.dueDate ?? null,
          estimatedMinutes: input.estimatedMinutes ?? null,
          notes: null,
          labelIds: [],
          position: prev.length,
          createdAt: now,
          updatedAt: now,
          completedAt: null,
        },
        ]);
      return;
    }
    startTransition(async () => {
      const created = await createTaskAction(input);
      setTasks((prev) => [...prev, created]);
    });
  }, []);

  const toggleComplete = useCallback((id: string, completed: boolean) => {
    if (!isSupabaseConfigured) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: completed ? "completed" : "pending", completedAt: completed ? new Date().toISOString() : null }
            : t,
        ),
      );
      return;
    }
    startTransition(async () => {
      await toggleTaskStatusAction(id, completed);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: completed ? "completed" : "pending", completedAt: completed ? new Date().toISOString() : null }
            : t,
        ),
      );
    });
  }, []);

  const updateTask = useCallback((input: UpdateTaskInput) => {
    if (!isSupabaseConfigured) {
      setTasks((prev) => prev.map((t) => (t.id === input.id ? { ...t, ...input, updatedAt: new Date().toISOString() } : t)));
      return;
    }
    startTransition(async () => {
      const updated = await updateTaskAction(input);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    });
  }, []);

  const removeTask = useCallback((id: string) => {
    if (!isSupabaseConfigured) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    startTransition(async () => {
      await deleteTaskAction(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });
  }, []);

  return useMemo(
    () => ({ tasks, isPending, addTask, toggleComplete, updateTask, removeTask }),
    [tasks, isPending, addTask, toggleComplete, updateTask, removeTask],
  );
}
