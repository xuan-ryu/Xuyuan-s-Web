---
name: xuyuan-portfolio-design-usage
description: Apply and review the Xuyuan portfolio visual system across Next.js pages, case studies, interactive scenes, screenshots, and local design drafts. Use when changing portfolio UI, layout, typography, color, motion, project storytelling, case-study presentation, or when the user asks to unify, polish, critique, or align the site's visual style.
---

# Xuyuan Portfolio Design Usage

Use this before reviewing, adapting, or implementing visual work in the repo.

The site should feel like Xuyuan's ink-and-paper editorial portfolio, even when
a case study contains product UI, 3D, canvas, or AI-tool material.

## Read First

1. `docs/design-system.md` for reusable tokens, type roles, page families,
   component contracts, motion rules, and review checklist.
2. `DESIGN.md` for measured original-site geometry, reference choreography,
   pinned artwork, exact live-reference spacing, and template behavior.
3. Current implementation files before editing:
   - `app/globals.css` for active tokens, font aliases, breakpoints, and global
     patterns.
   - The route/component being changed.
   - `data/projects.ts` for story, copy, metadata, and case sequencing.

The local repo is the current truth.

## Portfolio Overrides

- Favor editorial composition over SaaS dashboard structure.
- Use ink, paper, warm off-white, hairlines, black bands, seal red, amber/gold
  details, and media-derived imagery. Do not add a new accent palette.
- Build hierarchy with scale, spacing, tone, image placement, and rules before
  adding cards, boxes, glow, or borders.
- Keep bold rare. Prefer weight 300-500, opacity, spacing, or size changes.
- Large type is allowed, but it should feel calm and spacious, not loud.
- Product UI may keep its own interface color inside screenshots, canvas nodes,
  and prototypes; the surrounding page still belongs to the portfolio.
- Cards are rare: media frames, forms, footer/summary panels, and intentional
  glass overlays only. Do not put cards inside cards.

## First Pass

1. Inspect the artifact: route, screenshot, component, or draft.
2. Identify the page family: home scrolltelling, work index, editorial case
   study, poster case, about, contact, or design-system page.
3. Name the reading path: first visual signal, primary text, supporting media,
   next section hint, and action.
4. Classify the task: polish, story/content, interaction, reference-parity repair,
   or new component/pattern.
5. Make the smallest useful change in the right layer.

## Visual Rules

- New/touched CSS should use tokens from `app/globals.css` for ink, paper,
  lines, radii, and easing.
- Letter spacing defaults to zero. Add tracking only for labels, nav, vertical
  text, and compact uppercase UI.
- Large display titles (section headers, big editorial titles) may use the
  condensed face `var(--font-condensed)` (Saira Condensed) in uppercase, light
  weight (300), tight tracking (`-0.05em`) — the wordmark's look. This is the
  one sanctioned negative tracking; elsewhere tracking stays 0.
- Long prose should stay calm: about 55-68ch, line-height 1.5-1.7, no dense
  blocks pressed against media.
- Dark surfaces use ink tones, subtle hairlines, and soft shadows. Avoid neon
  glow.
- Work index list mode is an editorial index: left-align condensed uppercase
  project titles in ink, reserve seal red for the hover/focus indicator line,
  reveal the preview from the right, and keep descriptions/buttons out of the
  resting row.
- Media preview shadows should be light ink-tinted lifts, not heavy cards or
  glow.
- Visual assets should show the real project, material, object, or prototype.
- Mobile collapses to a readable single column with no horizontal scroll.

## Muller-Brockmann Grid System

- Before changing layout, design the grid first: name the container, margins,
  columns, rows/modules, gutters, and baseline rhythm. Do not begin by placing
  cards or eyeballing offsets.
- Use a modular grid, not a decorative overlay. Desktop editorial pages default
  to 12 columns; case-study or poster sections may use 8, 16, 24, or 32 grid
  fields when the content needs larger or finer modules.
- Pick the shell by page family: reading sections can use the existing
  1080px `.container`; editorial/case shells can use 1408-1440px; art-directed
  full-bleed scenes may ignore the outer shell only if they keep internal
  alignment rails.
- Gutters separate fields. Text, media, controls, and rules should begin and
  end on column/module edges, not in the gutter.
- Use row modules and baseline rhythm for vertical order. Type and grid are
  one system: long text follows the role tokens and line-height; section gaps
  should be multiples of the same rhythm rather than arbitrary padding.
- Prefer asymmetric spans that still resolve to the grid: 5/7, 4/8, 3/9,
  2/10, or offset single columns. Avoid centered equal cards unless the content
  actually requires comparison.
- On tablet, reduce to 8 or 6 columns. On phone, use 4 columns only for small
  structure and collapse reading content to one column.
- During review, ask: what is the container, where are the margins, which
  columns does each element span, what baseline is text using, and did any
  element land in a gutter?

## Motion Rules

- Motion should reveal, transition, drag, or explain state.
- Animate `transform` and `opacity`; avoid layout-thrashing properties.
- Effect components must clean up RAFs, listeners, observers, timers, and
  external subscriptions.
- Respect reduced motion and avoid replaying entrance animations on ordinary
  re-render.

## Case Study Rules

- Case studies are editorial documents, not product landing pages.
- Hero content must make the project/object visible in the first viewport.
- Explain design work through decisions, workflow, artifacts, and tradeoffs.
- Use full-width media and generous sequence gaps before explanatory cards.
- Interactive canvases, node graphs, and product UI must be big enough to
  inspect, with breathing room and story alignment.

## Case Study Hierarchy

- Use the Pulse-style discipline, not the Pulse visual style: inspect the
  artifact, name the reading path, subtract repeated information, then set the
  title ladder before adding decoration.
- Titles must follow document order. H1 is the project entrance, H2 is the
  section claim, H3 is the local decision or object, and support text follows
  below. Do not use a tiny uppercase eyebrow as the visible title of a section.
- Eyebrows, labels, tags, and indices are metadata only. They may support a
  title, but they should not be the first or strongest thing the reader sees.
- Keep title copy concrete and editorial. Avoid AI-showcase words such as
  "magic", "powerful", "seamless", "next-gen", "supercharged", or generic
  "AI workflow" phrasing unless quoting a real product label.
- Product names can include AI, but the story should describe artifacts,
  decisions, workflow responsibility, and team alignment rather than making
  the model or automation feel like the protagonist.
- Before finishing a case-study pass, run a redundancy check: if a section
  title, row label, tag, or paragraph repeats the same idea, delete or demote
  one of them.

## Validation

- For UI code changes, run `npx.cmd next build`.
- For visual work, inspect a local browser screenshot at desktop; add mobile
  screenshots when layout risk is material.
- Run `git diff --check` on touched files before finishing.
- Report files changed, checks run, and any screenshot or mobile risk left open.

## Do Not

- Do not copy Pulse's visual style into this portfolio. Reuse the skill shape,
  not the product aesthetic.
- Do not make marketing-style heroes for project/case pages.
- Do not add new accent colors, dense bento grids, nested cards, or generic SaaS
  dashboards unless a project artifact requires that inside media.
- Do not rewrite measured original-site geometry as cleanup unless asked for parity or
  redesign.
- Do not hide product evidence behind dark, blurred, tiny, or decorative media.
