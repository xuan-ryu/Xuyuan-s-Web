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
