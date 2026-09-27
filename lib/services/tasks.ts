import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { fixtureTasks } from "@/lib/services/fixtures";
import { mapTaskRow } from "@/lib/services/mappers";
import type { Database } from "@/lib/types/database";
import type { Task } from "@/lib/types/domain";
import type { CreateTaskInput, UpdateTaskInput } from "@/lib/validation/task";

export async function getAllTasks(): Promise<Task[]> {
  if (!isSupabaseConfigured) {
    return fixtureTasks;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .is("deleted_at", null)
    .order("position", { ascending: true });

  if (error) throw error;
  return data.map(mapTaskRow);
}

export async function createTask(userId: string, input: CreateTaskInput): Promise<Task> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured — cannot persist new tasks in fixture mode.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description ?? null,
      list_id: input.listId ?? null,
      priority: input.priority,
      scheduled_date: input.scheduledDate ?? null,
      scheduled_time: input.scheduledTime ?? null,
      due_date: input.dueDate ?? null,
      estimated_minutes: input.estimatedMinutes ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapTaskRow(data);
}

export async function updateTask(input: UpdateTaskInput): Promise<Task> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured — cannot persist task updates in fixture mode.");
  }

  const supabase = await createClient();
  const { id, ...rest } = input;
  const patch: Database["public"]["Tables"]["tasks"]["Update"] = {};
  if (rest.title !== undefined) patch.title = rest.title;
  if (rest.description !== undefined) patch.description = rest.description;
  if (rest.listId !== undefined) patch.list_id = rest.listId;
  if (rest.priority !== undefined) patch.priority = rest.priority;
  if (rest.status !== undefined) {
    patch.status = rest.status;
    patch.completed_at = rest.status === "completed" ? new Date().toISOString() : null;
  }
  if (rest.scheduledDate !== undefined) patch.scheduled_date = rest.scheduledDate;
  if (rest.scheduledTime !== undefined) patch.scheduled_time = rest.scheduledTime;
  if (rest.dueDate !== undefined) patch.due_date = rest.dueDate;
  if (rest.estimatedMinutes !== undefined) patch.estimated_minutes = rest.estimatedMinutes;

  const { data, error } = await supabase.from("tasks").update(patch).eq("id", id).select("*").single();

  if (error) throw error;
  return mapTaskRow(data);
}

export async function deleteTask(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured — cannot delete tasks in fixture mode.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}
