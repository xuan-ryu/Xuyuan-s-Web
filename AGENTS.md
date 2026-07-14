<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Engineering skill gate

Before build/tooling/dependency/asset/refactor work, running checks or
screenshots, or touching the WebGL scene components, read and follow:

- `skills/xuyuan-portfolio-engineering/SKILL.md`

It carries the dev-server rules (ONE `next dev` on :3000 — a second one or an
in-tree `next build` corrupts the Turbopack cache), the validation workflow,
the `scripts/_pw.mjs` screenshot tooling, the asset policy, the data-layer
conventions, and the scene lifecycle contracts.

## Design skill gate

Before changing portfolio UI, visual hierarchy, typography, color, motion,
project storytelling, case-study presentation, screenshots, or local design
drafts, read and follow:

- `skills/xuyuan-portfolio-design-usage/SKILL.md`

Use `docs/design-system.md` as the reusable system layer and `DESIGN.md` for
measured original-site/reference geometry. State that the design skill was
loaded before making visual changes.

For layout work, follow the Muller-Brockmann grid rules in the design skill and
`docs/design-system.md`: define the container, margins, columns/modules,
gutters, and baseline before placing content. Align elements to grid fields, not
gutters.

## Structure & comments gate (all agents — Claude Code and Codex)

Before creating, splitting, or renaming any source file or agent-facing doc,
and before writing or editing comments, read and follow:

- `skills/xuyuan-portfolio-naming/SKILL.md` — four-layer structure (L0 axiom /
  L1 device / L2 process / L3 diplomacy), the ≤200-line file rule,
  module-prefix naming, planning-doc pagination (index + pages; always-loaded
  docs stay ≤ ~1k tokens).
- `skills/xuyuan-portfolio-comments/SKILL.md` — mandatory file-header
  summaries, grep-able section banners for slice-reading, inline-comment
  rules, shipped-CSS comment bans.

Rationale: agents pay tokens per read (~1k lines ≈ 10k tokens). Names route
for free, headers make files skippable, banners make the legacy giants
sliceable.

## Case-page lessons (all agents — Claude Code and Codex)

Hard-won fixing a case page a previous pass got wrong (2026-07-05). These bind
whether or not you loaded the skills above:

- **Before ADDING a section or figure, check what already exists.** Do not
  duplicate the cover (in the hero AND as Fig. 1), and do not add a block that
  restates numbers/story already on the page — a stats band + an overview
  paragraph + a diagram all reciting the same figures is triple redundancy.
  Reframe new material onto the page's ONE thesis; don't bolt on a competing
  section.
- **Wide media is shown WHOLE.** Product screenshots/recordings are wide
  (dashboards ~2.2:1, screen recordings 16:9). Full-width, or a box matching
  the asset's real aspect — never a narrow tall column, which crops it to an
  unreadable vertical slice. Check the asset's real dimensions first.
- **Baked-in black bars** on recordings are cropped with an `object-position`
  bias on `object-fit: cover`, never `object-fit: contain` (double-letterbox).
- **A caption describes the actual image, not the section title** — open the
  image before captioning or relabeling it.
- **Never put internal source identifiers** (repo names, local paths, a
  product's component/file names) in served CSS comments or copy; this is a
  public repo (source + git history included).

The CSS mechanics + confidentiality detail live in the two skills; load them for
case-page work.
