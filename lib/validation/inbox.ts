import { z } from "zod";

export const captureInboxItemSchema = z.object({
  content: z.string().trim().min(1).max(500),
});

export type CaptureInboxItemInput = z.infer<typeof captureInboxItemSchema>;
