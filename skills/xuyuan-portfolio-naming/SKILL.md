---
name: xuyuan-portfolio-naming
description: Naming rules and the four-layer file structure (L0 axiom / L1 device / L2 process / L3 diplomacy) for the Xuyuan portfolio repo — the ≤200-line file rule, layer-based splitting, module-prefix naming, and pagination for planning docs (功能列表/任务进展 style). Read before creating, renaming, or splitting any source file or agent-facing doc, and before adding a new case-page module.
---

# Naming & Four-Layer Structure

Companion to `skills/xuyuan-portfolio-comments/SKILL.md` (comments make files
skippable; this skill makes them small and findable). Engineering/validation
rules live in `skills/xuyuan-portfolio-engineering/SKILL.md`.

## Why this exists: agents pay per read

Agents read files whole, and re-read them across a session. Roughly 1,000
lines ≈ 10k tokens — so one read of a 4,000-line case layout costs ~40k
tokens before any thinking happens. A well-split module turns that same task
into reading one ~150-line file (~1k tokens): a 10× cut, measured on this
owner's other repos (10k → 1k per read after restructuring).

Two consequences drive every rule below:

1. **Names are free documentation.** Routing from `ls` output costs ~0
   tokens; routing by opening files costs thousands. A file name must say
   module + layer + role truthfully.
2. **Small files are cheap files.** The unit an agent must read to do a task
   should be ≤200 lines.

## The four layers

| Layer | 中文 | Contents | May import | Typical home |
| --- | --- | --- | --- | --- |
| **L0 axiom** | 公理层 | Constants, tokens, types, copy, pure data/config. No logic. | other L0 only | `data/*.ts`, `*-tokens.ts`, type files |
| **L1 device** | 器件层 | Leaf components, pure utils, hooks. One part, one job; knows nothing about siblings. | L0 | `components/ui/*`, `lib/*` helpers, `<module>-<part>.tsx` leaves |
| **L2 process** | 流程层 | Module-internal orchestration: composes its OWN module's L1 parts into a flow (a case layout assembling sections, a scroll controller). | its module's L0 + L1, shared L1 | `components/<module>-case-layout.tsx`, `<module>-scroll.tsx` |
| **L3 diplomacy** | 外交层 | Cross-module L2 — the ONLY place modules touch each other: route wiring, shared buses, site chrome. | anything below | `app/**/page.tsx`, `lib/scroll-behavior.ts`, `components/header.tsx` |

Hard rules:

- **Imports flow downhill only** (L3 → L2 → L1 → L0). A lower layer never
  imports a higher one; L0 imports nothing but L0.
- **Two modules never import each other directly.** If pulse code needs
  vicino code, the shared piece moves down (to shared L1/L0) or up (an L3
  file coordinates both). That is what "diplomacy = cross-module L2" means.
- **One file = one layer = one job.** A file mixing its module's constants,
  a leaf diagram, and page orchestration is three files.

## The ≤200-line rule

- New files target **≤200 lines**; treat ~300 as the hard ceiling. When a
  file crosses it, split along layer seams — in this order, because each step
  is mechanical and pixel-safe:
  1. Hoist constants, copy strings, and types into an L0 file
     (`<module>-content.ts` / `<module>-tokens.ts`).
  2. Extract self-contained leaf sections/diagrams into L1 files
     (`<module>-<part>.tsx`).
  3. What remains is a thin L2 composer that imports and arranges.
- Splits must be render-neutral: run `npm run check` and screenshot-verify
  per the engineering skill before declaring one done.
- **Legacy giants** (`pulse-case-layout.tsx` 4.1k lines, `nyma-` 3.6k,
  `vicino-` 3.5k, `cloud-futures-` 3.4k, the three WebGL scenes): no big-bang
  rewrite. **Ratchet rule** — whenever a task touches a section of a giant,
  extract that section into layered files as part of the task; never grow a
  giant. New pages are born split.
- To work inside a giant without paying its full read cost, navigate by
  section banners (see the comments skill): Grep the banner, then Read with
  offset/limit.
- **Mechanized:** `npm run check:size` enforces both rules (new files
  ≤300; giants frozen in `scripts/file-size-baseline.json`, shrink-only —
  `--update` locks in lower ceilings). Runs in `npm run check` and CI.
  Route via `docs/agents/codemap.md` (`npm run codemap`) instead of
  opening files to explore.

## Naming rules

Files (kebab-case, module prefix first):

- `<module>-<role>.tsx` — e.g. `pulse-scroll.tsx`, `vicino-pipeline-viz.tsx`.
  Module prefixes in use: `pulse-`, `vicino-`, `nyma-`, `cloud-futures-`,
  `froghire-`, `roper-`, `vrmb-`, `hunger-`, `fg-`.
- Shared (no module prefix) parts live in `components/ui/` (L1 UI) or `lib/`
  (L1 utils / L3 buses) — a prefix-less file inside `components/` should be
  site chrome or a global behavior, nothing else.
- Established role vocabulary — reuse, don't coin synonyms:
  `-case-layout` (L2 page composer), `-scroll` (L2 scroll choreography),
  `-viz` / `-map` / `-board` / `-canvas` (L1 coded diagrams),
  `-interactives` (L1 interactive bundle), `-lazy` (dynamic-import wrapper),
  `-poster-layout` (L2 poster page). A new role gets ONE word, then that
  word is used site-wide.
- If a correct name needs more than ~4 words, the file has two jobs — split
  it instead of naming the blur.

Symbols:

- Components & types `PascalCase`; functions `camelCase`; hooks `useX`;
  L0 constants `SCREAMING_SNAKE` (module-scoped tables may be `camelCase`
  when they read as data, e.g. `projectsBySlug`).
- CSS: semantic kebab-case classes + `@theme` tokens (see design system);
  page-local `@keyframes` are uniquely prefixed per page (`pAssemble*` is
  Pulse's — never reuse across pages).

## Planning-doc pagination (功能列表 / 任务进展 / any status doc)

The same token math applies to docs an agent loads every session:

- **Any always-loaded doc stays ≤ ~1,000 tokens (~120 lines).** The pattern
  is index + pages: the root file holds one line per item
  (`id — name — status — link`), details live in a sibling folder, one file
  per item or per month.
  - `功能列表.md` → index lines + `功能列表/<id>-<slug>.md` per feature.
  - `任务进展.md` → active items only; finished batches archive to
    `任务进展/2026-07.md`-style monthly pages.
- Repo docs follow suit: `docs/agents/` stays one topic per file; a state
  doc that has gone stale (e.g. a finished wave) gets archived or deleted,
  not appended forever. `MEMORY.md`-style indexes hold pointers, never
  content.
- An agent opens a detail page only when working that item — never "for
  context".
