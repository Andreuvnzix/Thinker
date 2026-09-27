import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { InboxItem } from "@/lib/types/domain";

export async function getInboxItems(): Promise<InboxItem[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inbox_items")
    .select("*")
    .eq("status", "captured")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    userId: row.user_id,
    content: row.content,
    status: row.status,
    convertedToType: row.converted_to_type,
    convertedToId: row.converted_to_id,
    createdAt: row.created_at,
  }));
}

export async function captureInboxItem(userId: string, content: string): Promise<InboxItem> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured — cannot persist inbox captures in fixture mode.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inbox_items")
    .insert({ user_id: userId, content })
    .select("*")
    .single();

  if (error) throw error;
  return {
    id: data.id,
    userId: data.user_id,
    content: data.content,
    status: data.status,
    convertedToType: data.converted_to_type,
    convertedToId: data.converted_to_id,
    createdAt: data.created_at,
  };
}
