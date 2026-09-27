import "server-only";
import { isSupabaseConfigured } from "@/lib/env";
import { fixtureCalendarEvents, fixtureTomorrowEvents } from "@/lib/services/fixtures";
import type { CalendarEvent } from "@/lib/types/domain";

// TODO(calendar-sync, Phase 9): once a Google Calendar OAuth account is connected,
// read from `calendar_events` (synced via the Calendar API) instead of fixtures.
// The Row->domain mapping will mirror lib/services/mappers.ts#mapTaskRow.

export async function getEventsForToday(): Promise<CalendarEvent[]> {
  if (!isSupabaseConfigured) return fixtureCalendarEvents;
  return [];
}

export async function getEventsForTomorrow(): Promise<CalendarEvent[]> {
  if (!isSupabaseConfigured) return fixtureTomorrowEvents;
  return [];
}
