# Architecture

## Folder structure

```
app/                    Next.js App Router routes only — thin pages, no business logic
  (app)/                Route group for the authenticated shell (Today/Tasks/Calendar/Inbox/Settings)
  login/, auth/callback/  Auth entry points
  api/                  Route handlers (OAuth token exchange, cron sync — Phase 9+)
components/
  ui/                   shadcn/ui primitives (generated — treat as infra, not identity)
  shared/               App-wide chrome: nav rail, bottom nav, app shell, theme provider
features/<domain>/      One folder per product domain (today, tasks, calendar, email→inbox,
  components/           planning, command-bar, settings). Feature components import from
  lib/                  lib/ for data and from components/ui for primitives — never the reverse.
lib/
  types/                domain.ts (in-memory models) + database.ts (Supabase row types)
  validation/           Zod schemas — the only place inputs are trusted
  services/             Supabase queries (server-only). Each function checks
                         isSupabaseConfigured and falls back to lib/services/fixtures.ts
  actions/              "use server" Server Actions — thin wrappers around services plus
                         auth check + revalidatePath
  supabase/             Browser/server Supabase clients + session-refresh proxy helper
  hooks/, utils/         Cross-feature React hooks and pure helpers
supabase/migrations/    SQL migrations (source of truth for schema)
tests/unit/             Vitest — pure logic only (planner, time utils)
```

Modularity is by **domain**, not by technical layer: everything about Tasks lives under `features/tasks/`, not scattered across a global `components/` and `hooks/`.

## The fixture bridge

No Supabase project exists yet (see PROJECT_STATUS.md → "Requires user action"). Rather than leave the UI unbuildable and unreviewable until credentials arrive, every service function follows one rule:

```ts
if (!isSupabaseConfigured) return fixtureData;
// ...real Supabase query below
```

Client-side mutations (`features/tasks/lib/use-tasks.ts`, `features/inbox/lib/use-inbox.ts`) follow the same split: in demo mode they mutate local React state; once `NEXT_PUBLIC_SUPABASE_URL` is set, the exact same call sites invoke real Server Actions and reconcile with the server response. No component needs to change when real credentials are added — only `.env.local`.

## Rendering strategy

- Pages under `app/(app)/` are **Server Components** that call a `lib/services/*` function directly (no client-side fetch waterfall) and pass plain data down.
- Interactivity (checkboxes, forms, the command bar, the timeline's "now" line) is isolated to small **Client Components** inside `features/*/components/`, following shadcn/RSC convention: push `"use client"` as far down the tree as possible.
- Mutations go through **Server Actions** (`lib/actions/*.ts`) rather than API routes, with `revalidatePath` keeping Today/Tasks in sync after a change.

## Data flow (Today page example)

```
app/(app)/today/page.tsx (RSC)
  → lib/services/today.ts#getTodayOverview()
      → lib/services/tasks.ts, calendar.ts, email.ts   (each: Supabase or fixture)
  → features/today/components/* (mix of RSC and "use client")
      → features/tasks/lib/use-tasks.ts (client mutation bridge)
          → lib/actions/tasks.ts ("use server") → lib/services/tasks.ts → Supabase
```

## Auth & session

`proxy.ts` (Next.js 16's replacement for `middleware.ts`) calls `lib/supabase/middleware.ts#updateSession` on every request to refresh the Supabase session cookie and redirect unauthenticated users to `/login` — but only when `isSupabaseConfigured`; otherwise it's a no-op so the app is usable in demo mode without any auth.

## Why Base UI instead of Radix in `components/ui/*`

The shadcn/ui registry generated these primitives against `@base-ui/react` rather than Radix (a registry-version detail, not a deliberate choice made here). The composition pattern differs: use `render={<Button/>}` instead of `asChild` for polymorphic triggers (see `features/planning/components/plan-my-day-sheet.tsx` for an example). Keep this in mind when adding new shadcn components — check the generated file's pattern before wiring it up.
