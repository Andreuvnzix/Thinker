# Daily OS

A daily-planning command center: Today, Tasks, Calendar, and Email unified into one screen, designed to answer "what do I need to do today?" instantly — on desktop and, especially, on iPhone.

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for the visual direction ("The Ledger, warmed"), [ARCHITECTURE.md](./ARCHITECTURE.md) for the technical structure, [PROJECT_STATUS.md](./PROJECT_STATUS.md) for what's built vs. pending, and [TODO.md](./TODO.md) for known gaps.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui (Base UI) · Supabase (Postgres, Auth, RLS) · Zod · Vitest

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). **Without any environment variables set, the app runs in local demo mode**: every page renders from fixture data in `lib/services/fixtures.ts`, and task/inbox mutations apply to in-memory React state instead of a database. This is intentional — see `lib/env.ts` — and lets the UI be built and reviewed before a Supabase project or Google OAuth app exists.

## Connecting real data (REQUIRES USER ACTION)

1. Create a project at [supabase.com](https://supabase.com), copy `.env.example` to `.env.local`, and fill in `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`.
2. Apply the schema: `supabase db push` (or run `supabase/migrations/20260927000000_init.sql` directly in the SQL editor).
3. Create a Google Cloud OAuth 2.0 client with the Calendar and Gmail APIs enabled, add it to Supabase Auth's Google provider, and fill in `GOOGLE_OAUTH_CLIENT_ID` / `GOOGLE_OAUTH_CLIENT_SECRET`.

Full details in [PROJECT_STATUS.md](./PROJECT_STATUS.md#requires-user-action).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run unit tests once (Vitest) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run format` | Prettier write |

## Project docs

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — tokens, typography, the "Ledger, warmed" direction, mobile rules
- [ARCHITECTURE.md](./ARCHITECTURE.md) — folder layout, data flow, rendering strategy
- [DATA_MODEL.md](./DATA_MODEL.md) — Supabase schema and relationships
- [INTEGRATIONS.md](./INTEGRATIONS.md) — Google Calendar / Gmail OAuth and sync plan
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) — phase-by-phase status, decisions, blockers
- [TODO.md](./TODO.md) — known gaps by severity
- [CLAUDE.md](./CLAUDE.md) — conventions for AI-assisted work in this repo
