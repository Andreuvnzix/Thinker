# Data model

Source of truth: [`supabase/migrations/20260927000000_init.sql`](./supabase/migrations/20260927000000_init.sql). This file summarizes intent; the migration is authoritative for exact columns/constraints.

Every table has a `user_id uuid references profiles(id)` and Row Level Security restricting all access to `auth.uid() = user_id` (join tables restrict via the parent row instead). `profiles` and `user_preferences` rows are created automatically by an `on_auth_user_created` trigger when a Supabase Auth user signs up.

## Core

- **profiles** — mirrors `auth.users` (email, name, avatar, timezone) for a stable FK target.
- **user_preferences** — working hours, week start, default task duration, theme; feeds the planner and Settings.

## Tasks

- **task_lists** — user-defined lists/projects (e.g. "Work", "Personal").
- **tasks** — the core entity: `status` (pending/in_progress/completed/cancelled), `priority` (low/normal/high/urgent), `scheduled_date`/`scheduled_time`, `due_date`, `estimated_minutes`, soft-deleted via `deleted_at`.
- **task_labels** / **task_label_relations** — many-to-many tagging.

## Inbox

- **inbox_items** — universal quick-capture. `status` moves captured → converted → archived; `converted_to_type`/`converted_to_id` point at the task/note/event it became.

## Calendar

- **calendar_accounts** — one row per connected Google account (OAuth tokens, `status`: connected/disconnected/error/needs_authorization).
- **calendar_events** — synced events, keyed by `(calendar_account_id, provider_event_id)` so re-syncs upsert cleanly. `attendees` is a JSON array; `meeting_url` and `location` are both optional.

## Email

- **email_accounts** — one row per connected Gmail account, including `history_id` for incremental Gmail API sync.
- **emails** — synced messages with `is_important`/`needs_reply` flags for Today's "Important emails" section.
- **email_task_relations** — links an email to the task it was converted into, keeping the original message reachable.

## Planning

- **daily_briefings** — one generated summary per user per day (`summary`, `priorities[]`, `warnings[]`) — Phase 12, not yet generated.
- **daily_plans** / **daily_plan_blocks** — a plan for a given date made of ordered blocks (`type`: task/event/break/buffer; `status`: suggested/accepted/modified/discarded). The current "Plan my day" sheet generates blocks client-side with `features/planning/lib/generate-plan.ts` and does **not** yet persist to these tables (see TODO.md) — accepting a plan is a natural next step once that matters more than reviewing it.

## Integrations & sync bookkeeping

- **integrations** — one row per `(user, provider)` summarizing connection status, independent of the provider-specific `*_accounts` tables (useful once Slack/Notion/etc. are added per the roadmap).
- **sync_logs** — audit trail for each sync run (items synced, errors) — written by the future Vercel Cron sync jobs (Phase 9+).

## Enums

`task_status`, `task_priority`, `inbox_item_status`, `inbox_item_type`, `calendar_provider`, `email_provider`, `integration_status`, `daily_plan_status`, `plan_block_type`, `plan_block_status`, `sync_status` — all defined as Postgres enums in the migration, mirrored as TypeScript union types in `lib/types/database.ts`.

## TypeScript types

- `lib/types/database.ts` — hand-authored stand-in for `supabase gen types typescript`, kept in sync with the migration by hand until a live project exists to generate against.
- `lib/types/domain.ts` — camelCase in-memory models the UI actually consumes; `lib/services/mappers.ts` converts snake_case rows to these.
