"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { captureInboxItem } from "@/lib/services/inbox";
import { captureInboxItemSchema, type CaptureInboxItemInput } from "@/lib/validation/inbox";

export async function captureInboxItemAction(input: CaptureInboxItemInput) {
  const parsed = captureInboxItemSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const item = await captureInboxItem(user.id, parsed.content);
  revalidatePath("/inbox");
  return item;
}
