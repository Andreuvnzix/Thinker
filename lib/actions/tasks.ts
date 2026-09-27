"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import * as tasksService from "@/lib/services/tasks";
import { createTaskSchema, updateTaskSchema } from "@/lib/validation/task";
import type { CreateTaskInput, UpdateTaskInput } from "@/lib/validation/task";

async function requireUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export async function createTaskAction(input: CreateTaskInput) {
  const parsed = createTaskSchema.parse(input);
  const userId = await requireUserId();
  const task = await tasksService.createTask(userId, parsed);
  revalidatePath("/today");
  revalidatePath("/tasks");
  return task;
}

export async function updateTaskAction(input: UpdateTaskInput) {
  const parsed = updateTaskSchema.parse(input);
  const task = await tasksService.updateTask(parsed);
  revalidatePath("/today");
  revalidatePath("/tasks");
  return task;
}

export async function deleteTaskAction(id: string) {
  await tasksService.deleteTask(id);
  revalidatePath("/today");
  revalidatePath("/tasks");
}

export async function toggleTaskStatusAction(id: string, completed: boolean) {
  const task = await tasksService.updateTask({
    id,
    status: completed ? "completed" : "pending",
  });
  revalidatePath("/today");
  revalidatePath("/tasks");
  return task;
}
