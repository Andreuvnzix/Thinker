import "server-only";
import { isSupabaseConfigured } from "@/lib/env";
import { fixtureEmails } from "@/lib/services/fixtures";
import type { Email } from "@/lib/types/domain";

// TODO(gmail-sync, Phase 11): once a Gmail OAuth account is connected, read from
// the `emails` table (synced via the Gmail API + history.list) instead of fixtures.

export async function getImportantEmails(): Promise<Email[]> {
  if (!isSupabaseConfigured) return fixtureEmails.filter((e) => e.isImportant);
  return [];
}

export async function getInboxEmails(): Promise<Email[]> {
  if (!isSupabaseConfigured) return fixtureEmails;
  return [];
}
