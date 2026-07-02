---
name: xuyuan-portfolio-engineering
description: Engineering and maintenance conventions for the Xuyuan portfolio repo — toolchain, validation workflow, dev-server rules, scripts tooling, asset policy, WebGL scene lifecycle contracts, and known landmines. Read before build/tooling/dependency/asset/refactor work, when running checks or screenshots, or when touching the heavy scene components. For visual/design changes use xuyuan-portfolio-design-usage instead (both may apply).
---

# Xuyuan Portfolio Engineering

Maintenance handbook for agents working in this repo. The design counterpart
is `skills/xuyuan-portfolio-design-usage/SKILL.md` — visual work goes through
that gate; this skill covers everything else.

## The repo in one paragraph

Next.js 16 (App Router, Turbopack) + React 19 + TypeScript strict. Migrated
from a Framer site; the live baseline is <https://xuyuan.framer.website> and
visual output must not change unless a design change is intentional. Content
lives in `data/`, styling lives in `app/globals.css` (semantic classes +
`@theme` tokens), three heavy WebGL scenes live in `components/` as
`@ts-nocheck` islands. The git repo root is `portfolio/`; the folder above it
holds migration-era leftovers (see the workspace `README.md` one level up).

## Golden rules

1. **One dev server.** A `next dev` usually already runs on `:3000`. Never
   start a second one and never run `next build` in the working tree while it
   runs — the shared `.next` Turbopack cache corrupts (exit 127). To build,
   use a git worktree: `git worktree add <tmp> HEAD && npm ci && npm run build`
   there, or stop the dev server first.
2. **Validate in layers.** `npm run check` (= `eslint .` + `tsc --noEmit`)
   after any code change; a worktree `next build` before declaring a large
   change done; screenshots for anything that could shift rendering.
3. **Don't hand-roll UI primitives.** One CTA component owns every button-like
   affordance (`components/ui/cta.tsx`, contract in `docs/design-system.md`).
   Pills (999px radius) and `→` arrows are banned.
4. **Tokens snap on touch.** New/edited CSS uses the `@theme` tokens
   (`--text-*`, `--track-*`, `--space-*`, `--radius-*`, `--dur-*`, `--rule`,
   `--focus-ring`…). Do not mass-migrate untouched rules; measured-Framer
   geometry literals are exempt and usually carry a comment saying so.
5. **Content changes go in `data/`** (`projects.ts`, `about.ts`, `site.ts`),
   not in components.

## Toolchain

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on `:3000` (check it isn't already running) |
| `npm run check` | Lint + typecheck — the fast pre-flight |
| `npm run lint` / `npm run typecheck` | Individually |
| `npm run build` | Production build — worktree only (rule 1) |
| `npm run audit:screenshots` | Live-baseline vs `:3000` capture matrix → `audit-screenshots/` (gitignored) |

- Node 20+ (`.nvmrc` says 24; `engines` enforces `>=20`).
- CI: `.github/workflows/ci.yml` runs lint + typecheck + build on push/PR to
  `main`. Keep it green.
- ESLint ignores `scripts/`, `public/`, `backups/`, `assets-backup/` on
  purpose — don't "fix" that by linting them.
- `playwright` is a **library** dependency (scripts call `chromium.launch()`);
  it is not a test runner, so don't swap it for `@playwright/test`.

## Screenshot / measurement tooling (`scripts/`)

- Everything goes through `scripts/_pw.mjs`: `launchBrowser()` resolves the
  Chromium `executablePath` (env `PW_EXEC` override → newest `chromium-*` in
  `%LOCALAPPDATA%/ms-playwright`), plus `skipLoader`, `preScroll`,
  `DEFAULT_VIEWPORT`, `routeName`. Never call `chromium.launch()` bare — the
  installed browser revision rarely matches what playwright expects.
- `scripts/README.md` documents every kept script. One-off migration probes
  live in `scripts/archive/` — add new one-off probes there (or delete them
  when done), keep the top level durable.
- Verify layout at **1536px** (the owner's real viewport: 1920 @ 125%) and
  1440; width bugs often show at only one of them.

**Turbopack CSS HMR landmine:** after editing `app/globals.css`, a fresh
Playwright `goto` can still receive the OLD stylesheet. Touch the file again,
`curl` the route a couple of times, wait ~2s, then screenshot.

## WebGL / canvas scene contracts

`hero-scene.tsx`, `koi-pond.tsx`, `hongyadong.tsx` are large `@ts-nocheck`
ports with their own perf machinery (GPU tiers, adaptive DPR, fps caps). When
touching them or adding a scene, the lifecycle contract is:

- Pause all rAF work when `document.hidden` **and** when the scene's root
  leaves the viewport (IntersectionObserver). A scene must cost ~0 while
  scrolled past.
- Every early-return/lite code path must run the SAME teardown as the full
  path: cancel rAFs, remove listeners/observers, **unsubscribe from Lenis**
  (`lib/lenis-bus.ts` subscriptions outlive route changes), remove any body
  classes the scene set, and `dispose()` three.js geometries/materials/
  render-targets/renderer.
- Lazy-load heavy engines (`await import("three")` inside the effect, or a
  `next/dynamic` wrapper like `koi-pond-lazy.tsx`) so they stay out of the
  shared bundle.
- Respect `prefers-reduced-motion` and provide a static fallback.

## Asset policy (`public/`)

- Canonical media tree: `public/assets/framerusercontent.com/**` (the Framer
  CDN mirror, referenced via the `${IMG}`/`${MEDIA}` constants in `data/`).
  `public/media/` holds ONLY the five directly-referenced files
  (hongyadong.png, moon.png, three vicino-*.png) — do not re-add duplicates.
- Everything is git-tracked; deletions are recoverable. Before deleting an
  asset, programmatically cross-grep its path AND basename against `app/`,
  `components/`, `data/`, `lib/`, `docs/` — note that most references are
  built from template-string constants, so resolve those, don't just grep the
  literal URL.
- The resume PDF (`public/assets/framerusercontent.com/assets/VXxmU8…pdf`) was
  recovered from the live Framer CDN and its URL lives in `data/site.ts`
  (`site.resumeUrl`).
- Known heavy spots (deliberate, pending a conscious pass): hongyadong.png is
  a 22MB PNG sampled by canvas code — re-encoding needs pixel verification;
  several project mp4s exceed 5MB; `next.config.ts` ships no cache headers.

## Data layer

- `data/projects.ts` is the case-study source of truth; `projectsBySlug` is
  typed `Record<string, Project | undefined>` — always guard lookups.
- The `Project` type is a flat bag of optionals dispatched on `template` plus
  one slug special-case (`vicino-ai`) — a discriminated-union refactor is on
  the backlog; don't deepen the optional sprawl in the meantime.
- Several poster fields duplicate top-level fields verbatim (summary/blurb
  etc.). If you edit copy, grep for the same sentence elsewhere in the file.

## Known landmines (hard-won)

- ScrollTrigger + Lenis: pins and scrubs work (Lenis drives native window
  scroll; hook `lenis.on("scroll", ScrollTrigger.update)` via the lenis-bus),
  but ScrollTrigger's OWN `snap` tween writes scrollTop against Lenis's rAF
  and stalls on long glides — execute snap glides with `lenis.scrollTo()`
  instead, and make snapping directional (nearest-point snapping traps slow
  scrollers whose per-flick travel is under half a gap). See featured-gate.tsx.
- Entrance reveals must be component-owned state on elements whose className
  React recomputes — the global FadeReveal paints `is-visible` onto the DOM,
  and any re-render that changes that element's class wipes it (observer is
  already disconnected, so it never comes back).
- Two `next dev` processes = corrupted `.next` cache (exit 127).
- `next build` while dev server runs = same corruption. Worktree or stop it.
- Playwright chromium revision mismatch → use `_pw.mjs`, never bare launch.
- Turbopack globals.css HMR lag → re-touch + curl before screenshotting.
- `suppressHydrationWarning` on `<html>`/`<body>` is deliberate (browser
  extensions inject attributes) — don't remove it.
- The Google-fonts `<link>` is script-created outside React on purpose
  (hydration safety) — don't convert it to JSX.
- `--font-serif`/`--font-newsreader` are **aliases of Manrope** (`--font-text`)
  — there is no serif or Newsreader on the site anymore; don't "restore" them.
- `backups/`, `assets-backup/`, `audit-screenshots/` are local working
  snapshots, not source. Don't lint, refactor, or "clean up" from them.

## Deferred backlog (agreed, not yet done)

Design-system phase 2: SectionLabel/CaseMeta/AdjacentNav primitives;
`--color-fg/muted/line` → ink/stone ramp repoint (visible contrast change —
needs owner eyes); `--radius-card` 12→16 repoint; vicino private token ladder
(`--vicino-*`) → global ladder; collapse of globals.css append-only override
passes (one page at a time, pixel-diffed); font loading trim (Oswald unused,
Saira weights); `vicino-case-layout.tsx`'s 42KB CSS string → real stylesheet.
Engineering: discriminated-union `Project` type; `@ts-nocheck` removal from
scenes (they're mostly annotated already); shared `usePausableScene` hook;
media re-encoding (hongyadong.png → WebP + canvas verification, mp4
compression); cache headers in `next.config.ts`; OG/sitemap/robots +
`metadataBase` fix (needs the real domain); vr-education live-preview URL
(needs the owner). Root folder: the 145MB Framer export can be archived
offline once migration is declared done.
