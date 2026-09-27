@AGENTS.md

# Daily OS

Daily-planning app unifying Today/Tasks/Calendar/Email. Read [PROJECT_STATUS.md](./PROJECT_STATUS.md) first — it says what's built, what's blocked, and what's next.

## Architecture

Domain-modular: `features/<domain>/{components,lib}` for each product area, `lib/{services,actions,validation,types}` for cross-cutting data logic, `components/{ui,shared}` for shadcn primitives and app chrome. Full layout and data-flow diagram in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Commands

```bash
npm run dev         # dev server
npm run build        # production build
npm run lint          # ESLint — must be clean
npm run typecheck  # tsc --noEmit — must be clean
npm test                # Vitest unit tests
```

Run lint + typecheck + test before considering any change done.

## Conventions

- **No Supabase project exists yet.** Every data function in `lib/services/*` must check `isSupabaseConfigured` (`lib/env.ts`) and fall back to `lib/services/fixtures.ts`. Don't remove this branch or assume a live database.
- **Server Components by default.** Only add `"use client"` to the smallest component that actually needs interactivity/state — see any `features/*/components/*.tsx` for the pattern (page = RSC, small child = client).
- **Mutations go through `lib/actions/*.ts` Server Actions**, not new API routes, unless the work is genuinely a webhook/OAuth callback (`app/api/`).
- **Design tokens only** — never hardcode a color, radius, or font. Extend `app/globals.css`'s `@theme` block and DESIGN_SYSTEM.md's token table first. No `rounded-2xl`, no gradients, no colored badge blobs — see DESIGN_SYSTEM.md §11 for the explicit ban list.
- **shadcn/ui components are generated from a Base UI–backed registry**, not Radix. Polymorphic composition uses `render={<Component/>}`, not `asChild`. Check the generated file's existing pattern before wiring a new one — one generated file (`command.tsx`) shipped with a real bug (missing `Command` context wrapper); don't assume generated code is correct without a smoke test.
- **This Next.js version is ahead of most training data** — it uses `proxy.ts` (not `middleware.ts`), and other APIs may differ from what looks "standard." When something doesn't behave as expected, check `node_modules/next/dist/docs/` before assuming a bug in this codebase.
- **Mobile is not an afterthought.** Any new screen needs its own mobile layout pass (bottom-nav-aware spacing, `pb-20`/safe-area classes, 16px-minimum input font size, ≥44px touch targets) — don't just let desktop layout reflow.

## Testing

Vitest unit tests live in `tests/unit/`, limited to pure logic (the planner, time utilities) — no component/integration tests yet (see TODO.md). Visually verify UI changes in the browser at both desktop and a mobile width (375–430px) before calling a UI change done; this project has already hit one bug (timeline hour labels) that only appeared at mobile width.
