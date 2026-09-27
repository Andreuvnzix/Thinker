import { z } from "zod";

export const taskStatusSchema = z.enum(["pending", "in_progress", "completed", "cancelled"]);
export const taskPrioritySchema = z.enum(["low", "normal", "high", "urgent"]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).optional(),
  listId: z.string().uuid().nullish(),
  priority: taskPrioritySchema.default("normal"),
  scheduledDate: z.iso.date().nullish(),
  scheduledTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullish(),
  dueDate: z.iso.date().nullish(),
  estimatedMinutes: z.number().int().positive().max(24 * 60).nullish(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string().uuid(),
  status: taskStatusSchema.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
