# Daily OS — Design System

**Direction: "The Ledger, warmed."** A time-proportional timeline (not a task list, not a calendar grid) as the structural spine of the product, rendered in a warm, editorial, near-monochrome palette with exactly one functional accent color. Chosen after a comparative UX study of Things 3, Linear, Notion Calendar, Sunsama, Akiflow, Superhuman, Raycast, Apple's own Reminders/Calendar/Mail, Structured, Morgen, Todoist, Fantastical, Arc, and Craft — see the research summary folded into this document's rationale below. Full reasoning lives in the project's design research notes; this file is the enforceable contract for anything shipped.

Structure alone is not enough to avoid the generic-AI-app look — it's enforced here at the token level: no purple/indigo, no gradients, no `rounded-2xl` card-soup, no default Inter, no drop shadows as the primary depth cue.

## 1. Core concept

- The **timeline is the day**: calendar events render as blocks positioned and sized by actual time (position = start time, height = duration). Untimed tasks live in a docked rail beside/below it, promotable onto the timeline.
- **Hairline dividers, not shadows or cards**, separate content. A card is used only where content is genuinely a discrete, draggable object (a timeline block, a task chip) — never as a generic content wrapper.
- **One accent color, functionally reserved**: urgency, the "now" marker, and overdue state. Never used decoratively (no accent buttons for neutral actions, no accent backgrounds on informational chips).
- Calendar-source and label color-coding uses a **capped 5-hue muted palette**, applied only as small dots / left-border strokes / low-saturation chips — never as full surface backgrounds.

## 2. Typography

Three-family editorial pairing, loaded via `next/font/google` (self-hosted by Next.js, zero runtime request):

| Role | Family | Notes |
|---|---|---|
| Display / day headers / section titles | **Fraunces** (opsz + wght variable) | Warm serif with real personality; used sparingly — greeting line, day/date header, empty-state headlines |
| UI / body / labels | **Public Sans** | Neutral, humanist grotesque; carries all interactive UI, list content, forms |
| Time, durations, keyboard hints | **IBM Plex Mono** | Tabular figures for all clock times ("09:00", "45m") — a deliberate, ownable metadata convention |

CSS variables: `--font-display`, `--font-sans`, `--font-mono`.

Scale (rem, 16px root):

| Token | Size | Use |
|---|---|---|
| `text-display` | 1.75rem / 2rem mobile–desktop | Greeting + date header on Today |
| `text-title` | 1.25rem | Section titles ("Agenda", "Priority tasks") |
| `text-body` | 0.9375rem | Default UI text |
| `text-body-sm` | 0.8125rem | Secondary metadata, list secondary lines |
| `text-micro` | 0.6875rem | Overline labels, badges (uppercase, tracked) |
| `text-time` (mono) | 0.8125rem | Clock times, durations |

Weight is the primary hierarchy tool on top of size — avoid introducing a 4th type family or leaning on color for hierarchy.

## 3. Color

Defined as OKLCH tokens in `app/globals.css` under `:root` / `.dark`. Warm paper base, not stark white/black; single functional accent (`--accent-signal`, a warm terracotta/rust — deliberately not red-as-error-red, not purple).

| Token | Role |
|---|---|
| `--background` | Warm paper surface |
| `--foreground` | Warm near-black ink |
| `--muted-foreground` | Secondary ink (dates, metadata) |
| `--border` | Hairline dividers (~1px, low contrast) |
| `--accent-signal` | Urgent priority, overdue, the "now" line — functional only |
| `--surface-raised` | The *only* elevated surface (command bar, sheets, popovers) — everything else sits flush on `--background` |
| `--source-1..5` | Capped muted hue set for calendar/label dot-coding |

Never introduce a new color token inline in a component — extend this table first.

## 4. Spacing & layout

- Base unit: **4px**. Ladder: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
- Structural separation is hairline dividers (`border-border`, ~1px) rather than gaps + shadows.
- Content max-width on desktop: timeline column caps at `~640px` for readability; the untimed-task rail and detail panel share the remaining width — never a single edge-to-edge full-bleed list on large screens.

## 5. Radius & elevation

- Radius is small and consistent: `--radius-sm: 6px`, `--radius-md: 8px`, `--radius-lg: 10px`. No `2xl`/`3xl` radius scale — that ladder is exactly the "AI template" tell and is intentionally not defined.
- Elevation is used sparingly: only the command bar, bottom sheets, popovers, and the slide-out detail panel get `--surface-raised` + a soft 1-step shadow. Timeline blocks and task rows never float above the page.

## 6. Iconography

Lucide Icons throughout, stroke width 1.75, sized 16/18/20px. Icons are functional (status, action affordance) — never purely decorative filler.

## 7. Semantic treatment

- **Priority**: `urgent` → `--accent-signal` dot + left border on the task chip. `high` → same hue at reduced opacity. `normal`/`low` → no color, weight/position only.
- **Events**: solid timeline block, source-hue left border (from the capped 5-hue set), title in `font-sans` medium, time range in `font-mono`.
- **Overdue**: `--accent-signal`, small overline label "OVERDUE", never a red badge blob.
- **Completed**: strikethrough + reduced opacity, kept visible until end of day rather than disappearing instantly (Things-3-style satisfying but non-destructive completion).
- **"Now" marker**: a thin `--accent-signal` line across the timeline at the current time, the single most important use of the accent color on the whole screen.

## 8. Motion

Fast, discrete, physical — never decorative. Timeline block drag has a live snap preview; checkbox completion has a short strike-through + fade; bottom sheets spring in from the bottom with a drag handle; command bar fades+scales in under 120ms. No page-transition flourishes.

## 9. Navigation model

- **Desktop**: slim icon rail (Today / Tasks / Calendar / Inbox / Settings), ⌘K / Ctrl+K command bar as the primary action surface, a slide-out contextual detail panel (not a modal) for editing a task/event/email in place.
- **Mobile**: bottom tab bar, 5 items max (Today / Tasks / Calendar / Inbox / More), safe-area aware. No FAB — quick-add is a persistent bottom capture bar on Today, and a bottom sheet elsewhere. Swipe actions always paired with a visible affordance (never gesture-only).

## 10. Mobile / iPhone specifics

- `viewport-fit=cover` + `env(safe-area-inset-*)` on the bottom tab bar and any fixed bottom bar.
- Dynamic viewport height (`100dvh`) for full-height screens, never `100vh`.
- Touch targets ≥ 44×44px.
- Inputs use `font-size: 16px` minimum to prevent iOS Safari auto-zoom.
- Bottom sheets use drag handles with detents (compact/expanded), not raw fixed-height modals.

## 11. What is explicitly banned

No purple/indigo/violet gradients. No `rounded-2xl`+soft-shadow card-soup as a default content wrapper. No default unmodified shadcn palette. No decorative accent-colored buttons for neutral actions. No circular bottom-right FAB. No stock hero illustrations. No unexplained multi-hue palettes outside the capped 5-hue source set.
