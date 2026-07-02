# Xuyuan Liu — Portfolio

Personal portfolio of Xuyuan Liu (刘栩源), migrated from Framer to a
hand-written Next.js app. The live Framer baseline is
<https://xuyuan.framer.website>; the site stays visually faithful to it except
where a design change is made on purpose (those are documented in
`docs/design-system.md`).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · TypeScript (strict)
- **Tailwind 4** via PostCSS — but nearly all styling is semantic classes in
  `app/globals.css` on top of an `@theme` design-token layer, plus embedded
  `<style>` blocks inside the scene components
- **GSAP** (reveals) · **Lenis** (smooth scroll; single instance shared via
  `lib/lenis-bus.ts`) · **three.js** (WebGL scenes, lazy-imported)

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

> **One dev server only.** Two `next dev` processes sharing `.next` corrupt
> the Turbopack cache. And don't run `npm run build` while the dev server is
> up — build in a git worktree instead (see the engineering skill).

| Command | Purpose |
| --- | --- |
| `npm run check` | Lint + typecheck — run after every change |
| `npm run build` | Production build (worktree only while dev runs) |
| `npm run audit:screenshots` | Live-baseline vs local capture matrix → `audit-screenshots/` |

Node 20+ (`.nvmrc` = 24). CI (`.github/workflows/ci.yml`) runs lint,
typecheck and build on every push/PR to `main`.

## Repository map

| Path | What it is |
| --- | --- |
| `app/` | Routes. Pages are thin server components; content comes from `data/` |
| `app/globals.css` | The stylesheet: `@theme` tokens first, then semantic per-page/per-component classes |
| `components/` | UI components. Heavy WebGL scenes (`hero-scene`, `koi-pond`, `hongyadong`) are `@ts-nocheck` client islands with their own perf machinery |
| `components/ui/` | Design-system primitives — `cta.tsx` owns every button-like affordance |
| `data/` | All site content: `projects.ts` (case studies), `about.ts`, `site.ts` (identity, links, resume URL) |
| `lib/` | Shared runtime helpers (`lenis-bus.ts`) |
| `public/assets/framerusercontent.com/` | Canonical media tree (Framer CDN mirror; referenced via `${IMG}`/`${MEDIA}` constants in `data/`) |
| `public/media/` | Only the five directly-referenced files — don't add duplicates of the assets tree |
| `scripts/` | Playwright capture/measure tooling on a shared `_pw.mjs` bootstrap — see `scripts/README.md`; one-off probes live in `scripts/archive/` |
| `docs/design-system.md` | The design contract: tokens, type roles, CTA spec, radii policy, motion rules |
| `DESIGN.md` | Measured geometry of the original Framer site (parity reference) |
| `skills/` | Agent skill gates (see below) |
| `backups/`, `audit-screenshots/` | Local, gitignored working artifacts — not source |

## Working conventions

Two skill gates route all non-trivial work (wired up in `AGENTS.md` /
`CLAUDE.md` so coding agents load them automatically):

- **Engineering** — `skills/xuyuan-portfolio-engineering/SKILL.md`: toolchain,
  validation workflow, screenshot tooling, asset policy, WebGL scene lifecycle
  contracts, known landmines, and the deferred backlog.
- **Design** — `skills/xuyuan-portfolio-design-usage/SKILL.md`: ink-and-paper
  editorial language, Müller-Brockmann grid rules, motion and case-study
  rules.

The short version:

- **Design canvas is 1440px**; decor may bleed to the viewport. Verify layout
  at **1536px** (the owner's real viewport) as well as 1440.
- **One CTA.** `<Cta variant="solid|line|quiet">` — a 4px ink slab, hairline
  rectangle, or seal-red rule-wipe label. Pills and `→` arrows are banned.
- **Tokens snap on touch.** New CSS uses the `@theme` tokens; untouched rules
  migrate only when edited; measured-Framer literals are exempt.
- **Content lives in `data/`**, never hardcoded in components.
- Verify anything visual with the `scripts/` tooling (`_pw.mjs` handles the
  Chromium executable-path workaround; re-touch `globals.css` + curl before
  screenshotting to beat Turbopack's CSS HMR lag).

## Deploy

Static-friendly (`generateStaticParams` on case studies); no runtime env vars.
`metadataBase` still points at a placeholder domain — fix it (plus OG/sitemap/
robots) when the production domain is settled; the backlog lives at the end of
the engineering skill.
