import type { Database } from "@/lib/types/database";
import type { Task } from "@/lib/types/domain";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];

export function mapTaskRow(row: TaskRow): Task {
  return {
    id: row.id,
    userId: row.user_id,
    listId: row.list_id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    scheduledDate: row.scheduled_date,
    scheduledTime: row.scheduled_time,
    dueDate: row.due_date,
    estimatedMinutes: row.estimated_minutes,
    notes: row.notes,
    labelIds: [],
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
  };
}
