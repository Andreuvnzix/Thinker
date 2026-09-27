# Integrations

## Status: not yet connected (REQUIRES USER ACTION)

Nothing below is implemented beyond schema + UI scaffolding — see PROJECT_STATUS.md. This document records the plan so implementation in later phases doesn't require re-deriving these decisions.

## Google OAuth model

Two separate concerns, easy to conflate:

1. **Identity (sign-in)** — handled by Supabase Auth's built-in Google provider (`supabase.auth.signInWithOAuth({ provider: "google" })`, already wired in `app/login/page.tsx`). Minimal scopes (`openid email profile`).
2. **Data access (Calendar + Gmail)** — a *separate*, incremental OAuth consent requesting `https://www.googleapis.com/auth/calendar.readonly` and `https://www.googleapis.com/auth/gmail.readonly` (read-only; write scopes are not needed for the MVP's read/triage use case). This should NOT be requested at sign-in time — ask for it from Settings when the user chooses to connect Calendar/Gmail, per the principle of least privilege (brief §22).

Store the resulting tokens in `calendar_accounts` / `email_accounts` (not in Supabase Auth's own session), since a user's Google sign-in and their connected Calendar/Gmail account are logically independent (they could sign in with Google but connect a different Google account's Calendar, or none at all).

Planned route: `app/api/auth/google/route.ts` (not yet implemented) initiates the incremental-consent flow with `access_type=offline&prompt=consent` to guarantee a refresh token; `app/auth/callback/route.ts` already handles the Supabase sign-in callback and will need a second callback (or a `state` param branch) for this data-access flow.

## Google Calendar sync

- **Initial sync**: on connect, fetch events via `events.list` for a bounded window (e.g. -7d to +30d) rather than full history.
- **Incremental sync**: store the `nextSyncToken` returned by `events.list`; subsequent syncs pass `syncToken` to get only changed/deleted events. A 410 response means the token expired — fall back to a full initial sync.
- **Refresh strategy**: Vercel Cron (`app/api/cron/`, not yet implemented) hitting a route protected by `CRON_SECRET` on a fixed interval (e.g. every 10–15 min) is simpler to operate than Google push notifications (webhooks) for a first version; push notifications (`watch()` + a public HTTPS endpoint) are a natural upgrade once polling frequency becomes a real cost or latency issue — architecture doesn't block that later.
- **Multiple calendars**: `calendar_accounts` is one row per connected Google *account*; a future `provider_calendar_id` per event (already in the schema) and a small calendar-selection UI would let one account sync more than its primary calendar.

## Gmail sync

- **Initial sync**: `messages.list` with a query like `in:inbox newer_than:30d`, bounded like Calendar.
- **Incremental sync**: store `historyId` (already a column on `email_accounts`) and use `history.list` for subsequent syncs — far cheaper than re-listing messages.
- **"Important" / "needs reply" detection**: v1 can use Gmail's own `IMPORTANT` label plus a simple heuristic (unread + received from a sender the user has replied to before + no reply sent since). Rule-based, matching the same "deterministic first, AI-ready architecture" approach as the planner (see ROADMAP in PROJECT_STATUS.md) — `emails.is_important`/`needs_reply` are plain booleans so a future classifier can just set them differently.
- **Rate limits**: Gmail API quota is per-user per-100-seconds; batch requests (`batch` endpoint) when backfilling message bodies/snippets for more than a handful of messages.

## Token lifecycle

- `token_expires_at` on both `*_accounts` tables drives a "refresh if expiring within 5 minutes" check before each sync call.
- `status: 'error'` on a repeated refresh failure (e.g. token revoked) surfaces as "Needs authorization" in Settings (`features/settings/components/integration-card.tsx` already renders this state) rather than failing silently.
- Refresh tokens are only issued on first consent (`prompt=consent`) — reconnecting after a revoke must re-request `prompt=consent`, not just `prompt=none`.

## What's already wired vs. not

| Piece | Status |
|---|---|
| Supabase Auth Google sign-in | Implemented (`app/login`, `app/auth/callback`), inert until Supabase project + Google OAuth client exist |
| Settings integration cards (Connect/Disconnect UI, status display) | Implemented, buttons disabled until `GOOGLE_OAUTH_CLIENT_ID` is set |
| `calendar_accounts` / `email_accounts` / `calendar_events` / `emails` schema + RLS | Implemented |
| Incremental-consent OAuth route, token storage, sync jobs, cron | Not implemented — Phase 9 (Calendar) / 11 (Gmail) |
