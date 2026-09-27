# TODO

Tracked honestly rather than hidden behind silent stubs — every gap below has a visible affordance in the UI (a disabled button with a tooltip, an empty state, or a "not yet" message) rather than a broken or fake one.

## BLOCKER (nothing works end-to-end without these)

- **Supabase project doesn't exist.** App runs in local fixture/demo mode (`lib/env.ts#isSupabaseConfigured === false`). No real auth, no persistence. See PROJECT_STATUS.md → "Requires user action".
- **Google OAuth client doesn't exist.** Sign-in and Calendar/Gmail connect buttons are present but inert (`isGoogleOAuthConfigured === false`).

## IMPORTANT

- "Plan my day" generates blocks client-side (`features/planning/lib/generate-plan.ts`) but never persists them to `daily_plans`/`daily_plan_blocks` — there's no "accept this plan" action yet, only per-block discard/restore in the sheet.
- Quick-capture on Today (`features/inbox/components/quick-capture-bar.tsx`) and the Inbox list page use separate local-state instances in demo mode, so a capture on Today won't visibly appear on `/inbox` until Supabase is connected (server persistence + `revalidatePath` fixes this automatically once configured).
- Command bar's "Capture to Inbox" / "New task" items navigate to `/inbox?capture=1` / `/tasks?new=1` but those pages don't yet read the query param to auto-focus their input.
- No task edit view — only quick-add and complete/toggle. Editing description, due date, list, or labels isn't wired to any UI yet (services support it).
- No global search (`/search` is linked from the command bar but the route doesn't exist).
- Calendar has a day view only; week/month views are not implemented.
- Drag-and-drop rescheduling (tasks between days, timeline blocks) is not implemented.
- Email → Task conversion has no UI (schema/`email_task_relations` ready).
- Daily Briefing (Phase 12) is not implemented.
- Google Calendar/Gmail sync jobs, OAuth token exchange route, and Vercel Cron routes are not implemented (see INTEGRATIONS.md) — Settings UI is ready to light up once they exist.
- No E2E tests (Playwright or similar) — only Vitest unit tests for pure logic (`features/planning/lib/generate-plan.ts`, `lib/utils/time.ts`).
- PWA icon is a single placeholder SVG (`public/icon.svg`); proper multi-size PNGs (including a real `apple-touch-icon.png`) would improve the iOS "Add to Home Screen" result.

## IMPROVEMENT

- No swipe gestures on task/email rows (swipe-to-complete, swipe-to-reschedule) — tap-only for now.
- Plan My Day sheet has no native drag-handle/swipe-to-dismiss gesture (uses shadcn Sheet's built-in close only).
- Loading skeletons exist only for `/today`; Tasks/Calendar/Inbox/Settings have no `loading.tsx`.
- No recurring tasks (schema has no recurrence fields).
- Server Action failures aren't caught with a friendly inline message — they'd currently bubble to the nearest error boundary (`app/error.tsx`) instead of, e.g., toasting "couldn't save, retry."
- Mobile "More" tab currently just points at Settings rather than a dedicated More menu aggregating secondary items.

## FUTURE (see PROJECT_STATUS.md → Roadmap)

AI-based daily planning (replacing the rule-based generator), email classification/summarization, push notifications, offline-capable service worker, voice capture, Telegram/WhatsApp capture, Outlook/Microsoft Calendar + Slack + Notion integrations, smart/recurring reminders, home-screen widgets.
