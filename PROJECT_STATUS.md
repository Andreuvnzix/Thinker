# Project status

_Last updated: 2026-09-27_

## Current phase

**Phase 6 (Today) complete; Phases 5, 7, 8, 15 partially complete. Supabase is now live** (project `goznihyrnosucammlcbp`, schema applied 2026-09-27). Today/Tasks/Calendar/Inbox/Settings are all real, interactive, and visually reviewed on desktop and mobile (375–430px) in both light and dark theme, built and QA'd against local fixture data — now that Supabase is connected, the proxy enforces real auth, and **sign-in is blocked until the Google provider is enabled in Supabase** (see Blocked, below). Until then, local development against real data isn't possible; fixture mode is no longer reachable either, since demo mode was only a stand-in for *no* Supabase configuration.

## Completed

- Phase 0–1 — Product design research (see the UX research summary folded into DESIGN_SYSTEM.md's rationale) and the "Ledger, warmed" design system.
- Phase 2 — Next.js 16 + TypeScript strict + Tailwind v4 + shadcn/ui (Base UI) bootstrap.
- Phase 3 — Supabase schema (full migration, RLS on every table), browser/server clients, session-refresh proxy — inert until a project exists.
- Phase 4 — Desktop shell (icon rail) + mobile shell (bottom tab bar, top bar with search) + Cmd/Ctrl+K command bar with a touch-accessible equivalent.
- Phase 5 (partial) — Tasks: quick-add, filters (Today/Upcoming/Overdue/All), complete/toggle. Not done: edit dialog, labels, drag-and-drop, duplicate/reschedule actions.
- Phase 6 — Today: time-proportional agenda timeline (with a live "now" line), day summary counts, priority tasks, important emails, tomorrow preview, and a working rule-based "Plan my day" sheet.
- Phase 7 (partial) — Inbox: quick capture (bottom bar on Today + dedicated page), dismiss. Not done: convert-to-task/note/event.
- Phase 8 (partial) — Calendar: day view (reuses the Today timeline component) with prev/next navigation. Not done: week/month views.
- Phase 15 (partial) — Settings: integration status cards (Google Calendar/Gmail, correctly disabled pending OAuth setup), working light/dark/system theme toggle. Not done: profile, notifications, preferences sections.
- Phase 16 (partial) — PWA manifest, `viewport-fit=cover`, safe-area utilities, `100dvh`, 16px-minimum inputs (no iOS zoom-on-focus), touch targets ≥44px. Not done: real multi-size icons, service worker.
- Phase 17 (partial) — Vitest unit tests for the planner and time utilities; ESLint + `tsc --noEmit` both clean; manual visual QA at 375/390/430px and desktop.

## In progress / next up

Phases 9–14 (real Google Calendar/Gmail sync, Daily Briefing, persisting an accepted daily plan) and completing Phases 5/7/8/15 — see TODO.md for the itemized list, ordered roughly by what unblocks the most value next:

1. Task edit view + labels (closes out Phase 5).
2. Persist an accepted "Plan my day" to `daily_plans`/`daily_plan_blocks`.
3. Global search + wiring the command bar's capture/new-task deep links.
4. Google OAuth incremental-consent route + Calendar sync (Phase 9), once credentials exist.
5. Gmail sync + email→task conversion (Phase 11), once credentials exist.

## Blocked (requires user action)

Nothing in the codebase is blocked — everything buildable without external credentials has been built. Two things require the user to create accounts/credentials before the corresponding features can go live:

### Supabase — done

1. ~~Create a project at supabase.com~~ — done (`goznihyrnosucammlcbp`, region eu-central-1).
2. ~~Fill in `.env.local`~~ — done (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` set; `SUPABASE_SERVICE_ROLE_KEY` still blank — only needed for future cron sync jobs).
3. ~~Apply the migration~~ — done via `supabase db push` against the session pooler (the direct `db.<ref>.supabase.co` host is IPv6-only and wasn't reachable from the dev machine — use the pooler connection string for any future CLI/db work).
4. **Not done — currently blocking sign-in entirely**: enable the Google provider in Supabase Auth settings (Authentication → Providers → Google), which itself needs a Google Cloud OAuth Client ID/Secret pasted in. See Google Cloud OAuth below — its first 3 steps are a prerequisite for this, not just for Calendar/Gmail sync.

### Google Cloud OAuth — not started (now the only thing blocking sign-in)

1. Create a project in Google Cloud Console, enable the Calendar API and Gmail API.
2. Create an OAuth 2.0 Client ID (Web application).
3. Add `https://goznihyrnosucammlcbp.supabase.co/auth/v1/callback` as an authorized redirect URI in the Google Cloud client (this is Supabase's own callback, required for step 4 below — separate from this app's `${NEXT_PUBLIC_SITE_URL}/auth/callback`, which handles the redirect *after* Supabase finishes the OAuth exchange).
4. Paste that Client ID/Secret into Supabase → Authentication → Providers → Google, and enable it. This is what unblocks `/login` — confirmed by testing: the button correctly reaches Supabase Auth and fails with `"Unsupported provider: provider is not enabled"`, i.e. everything on this app's side is wired correctly.
5. Fill in `GOOGLE_OAUTH_CLIENT_ID` / `GOOGLE_OAUTH_CLIENT_SECRET` in `.env.local` (same client, reused for the incremental-consent Calendar/Gmail data-access flow — see INTEGRATIONS.md).

### Vercel (deployment, Phase 22 — not started)

Not yet needed for local development; deploying requires a Vercel account and the same environment variables configured as project secrets, plus `CRON_SECRET` once sync cron routes exist.

## Known issues

See TODO.md for the full, categorized list. Highlights: quick-capture on Today and the Inbox page don't share state in demo mode (separate component instances; resolves itself once Supabase is connected); no drag-and-drop; Calendar day-view-only; PWA icon is a placeholder.

## Design decisions

- **Visual direction**: "The Ledger, warmed" — a time-proportional timeline as the structural spine, warm paper palette, one functional accent color, serif/sans/mono editorial type pairing (Fraunces / Public Sans / IBM Plex Mono). Chosen over two alternative directions ("The Console," a dense Linear/Raycast-style command feed, and "The Notebook," a softer Things-3-like list) by combining the timeline's structural strength with the Notebook's warmth and the Console's interaction discipline (command bar, hairline dividers, no card-soup). Full rationale in DESIGN_SYSTEM.md §1.
- **No FAB, no generic bottom-right circle button** — quick-add is a persistent bottom capture bar on Today and inline elsewhere, per the research finding that a circular FAB is itself becoming an "AI-scaffolded app" tell.
- **Radius kept small (6–10px) with no `2xl`/`3xl` scale** — deliberately removed the shadcn default oversized-radius ladder, identified as a generic-template signal.

## Technical decisions

- **Fixture bridge instead of blocking on Supabase**: every `lib/services/*` function checks `isSupabaseConfigured` and returns fixture data otherwise; client mutation hooks (`use-tasks.ts`, `use-inbox.ts`) mirror this with local React state. This is a deliberate, temporary bridge — not a mock/testing layer — that disappears in behavior (not in code) once real credentials are set.
- **Rule-based planner first**: `features/planning/lib/generate-plan.ts` is a pure, deterministic function (gap-filling by priority) so it's fully unit-testable and has no external dependency. Its output shape (`DailyPlanBlock[]`) is exactly what an LLM-based planner would need to produce later — see Roadmap.
- **Server Actions over API routes** for mutations (tasks, inbox capture) — colocated with the services they call, revalidate the relevant paths directly, and avoid a fetch waterfall from the client.
- **Base UI, not Radix**, underlies `components/ui/*` (a shadcn registry detail, not a deliberate choice) — see ARCHITECTURE.md for the `render=` composition pattern this requires. One generated file (`components/ui/command.tsx`) had a bug (its `CommandDialog` never wrapped children in the `Command` context provider, causing a hard crash on open) that was fixed during integration — worth double-checking other generated primitives if they start behaving strangely.
- **Next.js 16 uses `proxy.ts`, not `middleware.ts`** — migrated via `@next/codemod` during bootstrap; keep this in mind since most existing documentation/training data still refers to `middleware.ts`.

## Roadmap (architecture already accommodates these; not built)

AI Daily Planner (LLM-based `DailyPlan` generation from tasks/events/emails/deadlines, replacing/augmenting the rule-based generator — provider-agnostic by design), email classification & summarization, automatic deadline extraction, push notifications, a real service worker for offline support, voice capture, Telegram/WhatsApp capture, Outlook/Microsoft Calendar, Slack, Notion, recurring tasks, smart reminders, home-screen widgets.
