# Xuyuan Portfolio Design System

This document turns the original Framer site and the current Next.js rebuild
into one working design system. `DESIGN.md` remains the measured reference for
exact live geometry. This file is the reusable system layer: tokens, component
contracts, motion rules, and migration gaps.

## Source Comparison

| Area | Original Framer | Current Next.js rebuild | System decision |
| --- | --- | --- | --- |
| Visual model | Ink-wash editorial canvas with white paper, near-black ink, persimmon accent, red seal, garden cut-outs, and large serif type. | Same concept is preserved, with custom Three.js/Canvas scenes and Framer assets served locally. | Preserve the editorial ink-and-paper language. New work should feel like a crafted portfolio, not a generic product site. |
| Layout | Individually pinned Framer layers. Many objects anchor to viewport edges or center rather than a single page container. | Global CSS recreates measured absolute geometry for hero, roof, featured windows, koi, about, and case pages. | Keep measured sections as art-directed compositions. Use system primitives only for repeatable UI and text/content sections. |
| Tokens | Framer token IDs resolve mostly to `#050505`, `#0a0a0a`, `#ffffff`, `#fe8411`, `#d4941e`, glass blacks, and hairlines. | `app/globals.css` now exposes canonical Tailwind v4 `@theme` variables and older aliases. Many rules still use hard-coded values. | New or touched CSS must use canonical tokens first. Do not mass-rewrite measured legacy geometry just to replace values. |
| Typography | Cormorant Garamond and EB Garamond carry display/body. Murecho, Newsreader, Plus Jakarta Sans, and Marcellus appear in UI/supporting roles. | Cormorant, Newsreader, Murecho, brush fonts, and local Framer font assets are loaded in `globals.css`. Some current data/components still contain old placeholder copy patterns. | Use Cormorant for large editorial display, Newsreader for refined body/meta, Murecho for compact UI and CJK labels, brush fonts only for brand marks. |
| Components | Framer has explicit variants for navigation items, project cards, links, form buttons, desktop/tablet/mobile layouts, loading/success/error button states. | Next has real components for header, footer, work cards, case/poster layouts, CTA, forms, loader, and scroll scenes. States are uneven, especially forms/buttons. | Treat Framer variants as behavioral requirements and Next components as implementation truth. Backfill missing states in reusable UI. |
| Motion | Framer uses spring entrance motion, hover variants, smooth scroll, and art-directed scroll choreography. | Lenis, Three.js, Canvas, CSS transitions, and requestAnimationFrame recreate the scrolltelling. | Use CSS/Lenis/Three.js for isolated scroll scenes. Use transform and opacity only. Every animation must have cleanup and reduced-motion behavior. |

## Design Principles

1. Paper before chrome. The base page is a white paper field with ink, not a UI dashboard.
2. One accent only. Persimmon amber is the active/hover accent; gold is for dates, rules, and formal details.
3. Editorial scale, not marketing scale. Big serif titles are allowed, but they should feel calm, low, and spacious.
4. Objects bleed. Garden images, roofs, screens, bamboo, rocks, and brush marks may leave the viewport edge.
5. Cards are rare. Use cards for framed media, glass method panels, forms, and footer/summary blocks. Use spacing and rules elsewhere.
6. Motion is choreography. Scroll scenes can be cinematic; ordinary UI motion should be short, tactile, and readable.
7. Keep the craft visible. Prefer measured asymmetry, custom imagery, and typography over generic bento/card sections.

## Canonical Tokens

These tokens live in `app/globals.css` under `@theme`.

### Color

| Token | Value | Use |
| --- | --- | --- |
| `--ink-950` | `#050505` | Deepest text, black sections, loader base. |
| `--ink-900` | `#0a0a0a` | Nav, buttons, footer surfaces, dark UI panels. |
| `--ink-800` | `#1c1c1c` | Secondary dark panels and rich text surfaces. |
| `--ink-700` | `#262626` | Hover darks, subdued dark blocks. |
| `--paper` | `#ffffff` | Main background. |
| `--paper-warm` | `#fafafa` | Koi frame, soft paper cards, pale panels. |
| `--mist` | `#e5e5e5` | Hairlines and light dividers. |
| `--stone` | `#a3a3a3` | Muted labels and secondary rules. |
| `--accent-amber` | `#fe8411` | Active nav, hover links, small calls to action. |
| `--accent-gold` | `#d4941e` | Dates, formal dividers, detail accents. |

Operational rule: if a touched rule needs black, white, orange, gold, or a
hairline, use a token. Hard-coded values stay only when they are measured
art-direction or Canvas/WebGL internals.

#### Per-case palettes (owner rule, 2026-07-05)

Case and poster pages derive their accent palette from THEIR OWN work — the
product's UI colors, the artwork's tones, the brand — instead of the site
gold/amber. Contract:

- Scoped tokens on the page root class: `--case-accent` (the one
  interactive/emphasis color), `--case-accent-soft` (a `color-mix` wash of
  it), optional `--case-detail` (a second, static-detail color only if the
  work clearly offers one).
- That page's eyebrows/indices, accent rules, hover/focus emphasis, and
  diagram marks hang on these tokens.
- Invariants: site neutrals (ink/paper/hairline/stone), the ONE seal-red
  moment per page, contrast (colored reading-size text ≥ 4.5:1 or move the
  color to marks/rules). Gold/amber remain the default accents on non-case
  surfaces (home, about, contact, work index).
- Reference: the Vicino case uses the product's typed-connection colors
  (text pink `#F1A0FA`, storyboard/image teal `#6EDDB3`/`#8BD6D9`, video
  amber `#FFB347`).

### Typography

| Role | Family | Usage | Rule |
| --- | --- | --- | --- |
| Text / display | `var(--font-sans)` / `--font-serif` / `--font-newsreader` (all = **Manrope**) | Body copy, UI, labels, and page/section titles. | Manrope is a humanist sans tuned for long reading. The three aliases all resolve to the same Manrope stack so the ~90 legacy call sites switch together. |
| Condensed display | `var(--font-condensed)` (**Saira Condensed**) | The hero wordmark + `PORTFOLIO` label, and **large display titles** (section headers, big editorial titles). | Tall narrow display. Uppercase, **light weight (300)**, **tight tracking (`-0.05em`)** — the wordmark's look. Not for body/controls. |
| Brush | `var(--font-brush)` (LiuJian Mao Cao) | Logo, signature, seal-like marks. | Brand moments only. Never paragraphs or controls. |
| Mono | `var(--font-mono)` | Technical / coordinate-like microcopy. | Use sparingly. |

All CJK glyphs fall through to Noto Sans SC / Murecho after the Latin face (no tofu).

#### Type scale

Every `font-size` uses a **role token** from `app/globals.css` `:root` — set
`font-size: var(--text-…)`, never a raw pixel/clamp invented per section. Fluid
steps are `clamp(min, vw, max)`; small UI text is fixed px.

| Token | Value | Role |
| --- | --- | --- |
| `--text-display-1` | `clamp(72px, 11vw, 144px)` | Hero / About opener — the single biggest title on a page. |
| `--text-display-2` | `clamp(56px, 8vw, 110px)` | Page + case major titles. |
| `--text-display-3` | `clamp(48px, 6.5vw, 80px)` | Chapter banners, CTA marquee, large section display. |
| `--text-heading` | `clamp(32px, 3.4vw, 46px)` | Editorial section headings (the real `<h2>`/`<h3>`). |
| `--text-title` | `clamp(24px, 2vw, 28px)` | Card and sub-section titles. |
| `--text-lead` | `clamp(21px, 1.55vw, 26px)` | Section lead paragraphs. |
| `--text-body` | `clamp(17px, 1.25vw, 20px)` | Long-form reading copy. |
| `--text-meta` | `15px` | Captions, secondary text, dates. |
| `--text-label` | `13px` | Uppercase labels, nav, eyebrows, tags. |
| `--text-micro` | `11px` | Fine print, indices, legal. |

Rules:

- Pick by **role**, not by eyeballing a pixel value. One heading size, one body size — reuse a token instead of inventing a new `clamp()`.
- Letter spacing defaults to `0`. Add tracking only for `--text-label` / `--text-micro` uppercase, vertical text, and compact UI.
- **Large display titles** may set `font-family: var(--font-condensed)` (Saira Condensed), uppercase, `font-weight: 300`, `letter-spacing: -0.05em` — the wordmark's tight condensed look. This is the one sanctioned negative tracking, and the one place condensed steps outside the wordmark.
- Long-form text stays about `68ch` unless it is a measured Framer clone.
- Center display type only for poster moments. Most content is left/right anchored.
- Measured Framer-clone geometry may keep literal sizes; everything else uses a token.

### Motion

| Token | Curve | Use |
| --- | --- | --- |
| `--ease-silk` | `cubic-bezier(0.16, 1, 0.3, 1)` | Signature reveal, hover, nav, card transitions. |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Utility fades. |
| `--ease-soft` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Gentle drifts. |
| `--ease-reveal` | `cubic-bezier(0.22, 1, 0.36, 1)` | Text entrances. |
| `--ease-spring` | `cubic-bezier(0.34, 1.52, 0.64, 1)` | Small overshoot interactions. |

Motion rules:

- Animate `transform` and `opacity`; avoid `top`, `left`, `width`, and `height`.
- Continuous scenes must be isolated client components with strict cleanup.
- Scroll choreography belongs in `HeroScene`, `RoofTransition`, `FeaturedWindows`,
  `KoiPondScene`, `HongyadongFramer`, and small parallax helpers only.
- Ordinary content reveal uses `[data-fade]` plus `FadeReveal`.
- Respect reduced motion. If a scene cannot be reduced cleanly, provide a static fallback.

### Radii And Surfaces

| Token | Value | Use |
| --- | --- | --- |
| `--radius-major` | `36px` | Footer card, large inset editorial surfaces. |
| `--radius-media` | `26px` | Media frames, preview panels. |
| `--radius-glass` | `18px` | Glass method cards and floating overlays. |
| `--radius-card` | `12px` | Smaller generic cards and form surfaces. |
| `--radius-thumb` | `8px` | Small media thumbs, inner panels. |
| `--radius-control` | `4px` | Buttons, inputs, chips (exact Framer clones may keep literals). |

Pill radius (`999px`) is retired for rectangular controls; `50%` stays
reserved for true circles (view toggles, dots, the moon gate).

Surface rules:

- Paper sections use `--paper` or `--paper-warm`.
- Dark bands use `--ink-950` or `--ink-900`, not pure black in new code.
- Glass uses black alpha plus blur, a 1px inner edge, and no bright outer glow.
- Media cards may cast a soft ink-tinted shadow. Text-only sections should not.

## Layout System

### Page Families

| Family | Current files | Layout contract |
| --- | --- | --- |
| Home scrolltelling | `app/page.tsx`, `hero-scene.tsx`, `roof-transition.tsx`, `featured-windows.tsx`, `koi-pond.tsx`, `value-card.tsx` | Art-directed sequence. Preserve measured geometry and section order. |
| Work index | `app/work/page.tsx`, `work-card.tsx` | Stacked project cards with image, title, body, and action overlay. Avoid generic grid cards. |
| Case study | `case-study-layout.tsx` | Title band, cover, black summary, solution banner, memorable moment, chapter banners, full-width figures. |
| Poster case | `poster-layout.tsx` | Centered title/lede, tall poster, black details, essay body, tall gallery, adjacent nav. |
| About | `app/about/page.tsx`, `hongyadong.tsx` | Interactive opening scene followed by editorial essays, logo wall, dark shutter band, activities, testimonials, habits. |
| Contact | `app/contact/page.tsx`, `contact-form.tsx` | Large title, intro, contact card, portrait, form. Needs better states. |

### Spacing

- Full art sections can use absolute positioning and viewport-based height.
- Editorial content sections use `.container` and `.section` only when they are
  not trying to reproduce Framer's pinned geometry.
- Desktop content may be asymmetric and edge-pinned. Mobile must collapse to a
  single readable column with no horizontal scroll.
- Use rules and empty space before adding boxes.

#### Section rhythm (owner rule, 2026-07-05)

Two gap standards, each ONE value site-wide (`app/globals.css` `@theme`):

| Token | Value | Meaning |
| --- | --- | --- |
| `--gap-section` | `clamp(144px, 16vw, 272px)` | Major section → next section. Each section pads half of it above and half below its boundary, so the visible gap is always exactly one `--gap-section`. |
| `--gap-block` | `clamp(40px, 5vw, 64px)` | Blocks inside a section: title → content, stacked artifacts/figures. |

Artifact-INTERNAL spacing (inside a coded viz/board) rides the local gutter
per the design skill's Density & Anchors rules — not these tokens. Do not
invent per-section paddings; wire page rhythm vars to these (see
`--v-pad-top/--v-pad-bottom/--v-head-gap` in `vicino-case-layout.tsx`).

### Muller-Brockmann Editorial Grid

The working grid is adapted from Josef Muller-Brockmann's Swiss grid practice:
structure comes before decoration. For every non-measured layout pass, define
the container, margins, columns, rows/modules, gutters, and baseline before
placing content.

Use these defaults unless a measured Framer section says otherwise:

| Surface | Grid | Shell | Use |
| --- | --- | --- | --- |
| Reading section | 6 or 8 columns | Existing 1080px `.container` | Essays, intros, body copy, contact text. |
| Editorial/case shell | 12 columns | 1408-1440px | Case studies, work index, media/text pairings. |
| Dense artifact panel | 16, 24, or 32 fields | Local media frame | Diagrams, node canvases, image sequences, annotated UI. |
| Tablet | 6 or 8 columns | Viewport with margins | Preserve spans, then simplify. |
| Phone | 4 columns, then single reading column | Viewport with safe gutters | Keep structure; collapse prose. |

Rules:

- Design the grid first. Do not start from generic cards or center alignment.
- Let gutters separate fields; never start or end text, media, rules, or
  controls inside the gutter.
- Align text and media to column/module edges. Use spans like 5/7, 4/8, 3/9,
  2/10, or offset single columns for asymmetric editorial balance.
- Treat type as part of the grid. Long text uses the role tokens and their
  line-height; vertical gaps should follow the same baseline rhythm.
- Full-bleed art scenes may break the outer shell, but they still need internal
  rails so adjacent sections feel related.
- If a layout feels wrong, diagnose the grid before adding color, shadows, or
  new components.

### Breakpoints

Framer export maps to:

- Desktop: `min-width: 1080px`
- Tablet: `810px` to `1079.98px`
- Phone: `max-width: 809.98px`

Use those thresholds when translating Framer variants. Tailwind utilities are
allowed, but CSS media queries should follow these breakpoints for Framer parity.

### Large / wide screens

The editorial shell caps at 1408-1440px for reading measure, but on a 27-32in
display that strands art-directed home sections in the middle with dead margins.
For those hero/showcase sections (not reading columns), keep scaling past the
cap instead of freezing:

- Let the shell keep widening — e.g. `width: min(1800px, 100% - 2 * <margin>)`
  — so the composition fills more of the viewport.
- Drive display type with `clamp(min, vw, max)` and set the `max` high enough to
  keep growing on wide screens (the featured section's title runs to `208px`),
  rather than a `max` that freezes near 1440px.
- Scale the key art (the moon gate uses `clamp(380px, 40vw, 720px)`) and section
  gaps with it, so type, media, and whitespace grow together.

Reading/body columns still hold their measure — only art-directed sections chase
the viewport.

## Component Contracts

### Navigation

Source: Framer `Navigation / Nav Item` and current `Header`.

Contract:

- Fixed overlay, transparent page shell, black logo block.
- Desktop nav is a compact black strip; active item uses `--accent-amber`.
- Mobile nav is a black block with a simple menu toggle and full-screen drawer.
- Labels stay short: `HOME`, `WORK`, `ABOUT`, `CONTACT`.
- Hover changes color/background using `--ease-silk`.

Gap:

- Current header uses the correct structure but still mixes some hard-coded
  black/white/orange values in CSS.

### Call To Action

Source: current standalone CTAs across the site (`All Work`, `View Project`,
`GET IN TOUCH`, contact submit) unified into one primitive.

The site has a single CTA affordance: the `.cta` classes in `app/globals.css`,
wrapped by `<Cta variant>` in `components/ui/cta.tsx`. Do not hand-roll a new
CTA look per section — reach for this and pick the emphasis level.

Contract:

- **No arrows.** `→`/`&rarr;` glyphs read as generic and AI-generated. The
  slab, the hairline rectangle, or the seal-red rule carries the affordance
  instead.
- **No pills.** The lozenge/pill CTA is retired (owner decision); it also
  contradicted this document's own radii table. Controls use
  `--radius-control` (4px) — the shape the rest of the site already used
  (work-card button, resume link, form submit, the ds specimens).
- Emphasis ladder (one component, three variants):
  - `solid` — filled ink slab (`--ink-900` on `--paper`), 52px tall,
    `--radius-control`. The primary page action. Hover is `--accent-amber`
    fill flipping the label to ink (never white-on-amber).
  - `line` — hairline rectangle (`1px var(--rule)`), transparent; fills to ink
    on hover. The secondary action (e.g. `All Work` beside a section title).
  - `quiet` — no box; an uppercase label with a seal-red rule that wipes in on
    hover/focus. Contextual actions, including a label inside a row that is
    itself a link (apply `cta cta--quiet` to a `span`, not a nested `<a>`).
- Type: `--font-text`, uppercase, weight 500, `var(--track-label)` (0.14em).
  `.cta--lg` bumps the label from `--text-label` to `--text-meta` for
  prominent placements; `.cta--full` stretches form submits.
- Renders as `<Link>` with `href`, `<button>` without (`type="submit"` for
  forms); the disabled state ships with the component.
- Every variant shares one `:focus-visible` contract: `var(--focus-ring)`
  (2px amber) at `var(--focus-offset)`.
- Seal red is reserved for the `quiet` indicator rule (see the skill's hover
  /focus-indicator rule); amber is the `solid` hover accent. No new colors.
- Links inside body copy still use a plain text underline or amber hover, not
  the CTA classes.

### Forms

- Primary form button: dark ink fill, 4px radius, compact UI text, uppercase
  only when the label is a command. Hover darkens or inverts on dark surfaces;
  active nudges within the same transform stack.
- States required for forms: default, loading, success, error, disabled.

Gap:

- `ContactForm` currently has only a sent state. It should get loading,
  validation, and error copy before being treated as a reusable form pattern.

### Work Card

Source: Framer `Work / Project Card`; current `WorkCard`.

Contract:

- The project image is the card. Text overlays are dark translucent panels.
- Desktop card can be wide and cinematic; mobile becomes a stacked image/card.
- Required slots: title, short description, action, optional cover image.
- Overlay body should remain scrollable only if the measured Framer behavior
  requires it; otherwise text should fit the card.
- Radius is 15px to 16px; title and description panels use glass black.

Gap:

- Current `WorkCard` is close, but card action/title/description should be
  codified as a reusable overlay primitive before adding more project cards.

### Featured Windows

Source: Framer home featured composition; current `FeaturedWindows`.

Contract:

- This is not a card grid. It is a garden-stage interaction.
- Window panes reveal project previews on hover/focus.
- Decorative roof, bamboo, rocks, tree, and grass are part of the component
  contract, not optional background decoration.
- Keyboard focus should expose the same preview state as pointer hover.

Gap:

- Verify focus behavior whenever this component is touched.

### Value Card

Source: Framer glass method cards plus current `ValueCard`.

Contract:

- Dark translucent surface, ink/brush texture behind or inside.
- Three text tiers: title, subtitle, body.
- The card may have spotlight/hover polish, but no generic glow.
- Width and text scale should be generous; previous direction favored larger,
  lower, wider typography over conservative increments.

### Forms

Source: Framer form components; current `ContactForm`.

Contract:

- Label above control.
- Helper/error text below control.
- Filled paper-gray fields with 4px to 6px radius.
- Submit button supports default, loading, success, error, disabled.
- Mailto fallback is acceptable, but UI state must tell the user what happened.

### Footer

Source: Framer footer; current `Footer`.

Contract:

- Black rounded inset card on white page.
- Social links in top corners, seal centered, nav row under seal, copyright low.
- No extra columns unless the content model changes.

### Case And Poster Templates

Contract:

- Case studies are editorial documents, not SaaS case grids.
- Chapter numbers and solution banners use oversized serif.
- Summary and poster detail blocks are dark formal panels.
- Full-width figures are preferred over nested cards.
- Adjacent project nav is subdued and thumbnail-led.

### Scroll Scenes

Source: Framer smooth-scroll/scroll choreography; current custom scenes.

Contract:

- Scene components own their rendering engine and cleanup.
- Shared scroll should be Lenis-aware where pinning must sync to smooth scroll.
- Canvas/WebGL values can use local color constants when they are shader or
  painting internals; UI shell values should use tokens.
- Do not mix scene logic into ordinary layout components.

## Implementation Rules

1. Before adding CSS, search `app/globals.css` for an existing class or token.
2. Before adding a component, check whether the shape belongs to an existing
   contract above.
3. Do not add new accent colors. If a new color feels necessary, document the
   role first.
4. New/touched UI CSS uses tokens for colors, easing, and radii.
5. Keep measured Framer geometry stable unless the task is explicitly visual
   parity or redesign.
6. Client components with effects must clean up every listener, RAF, observer,
   timeout, and external subscription.
7. Use `next/image` for static assets unless the scene engine needs raw canvas
   or WebGL access.
8. New form-like controls must include loading, disabled, success, and error
   states.
9. New interactive hover states must also have focus-visible states.
10. Visual verification should compare Framer/live reference and local Next at
    desktop and mobile, but code-only changes can stop at build/static review
    when requested.

## Current Gaps To Close

| Priority | Gap | Suggested path |
| --- | --- | --- |
| High | Form states are not system-complete. | Upgrade `ContactForm` with explicit status machine and accessible errors. |
| High | Token adoption is partial. | When touching CSS, replace local hard-coded color/ease/radius values with canonical tokens. |
| Medium | Standalone CTAs are being migrated to the `<Cta>` primitive. | `.cta` classes + `components/ui/cta.tsx` exist and are used in the featured section; migrate contact submit next. |
| Medium | Work card overlay behavior is repeated as local CSS. | Extract a reusable overlay contract or class group for project previews. |
| Medium | Focus states lag behind hover states in art-directed components. | Audit `FeaturedWindows`, `WorkCard`, nav drawer, and CTA for keyboard parity. |
| Low | Some older aliases duplicate canonical tokens. | Keep aliases for compatibility; slowly migrate touched rules to canonical names. |

## Design Review Checklist

- Does this still read as ink, paper, seal, garden, and editorial craft?
- Are colors limited to ink, paper, amber, gold, and media-derived imagery?
- Is the type role clear: display serif, reading serif, compact UI, or brush?
- Is the layout intentionally asymmetric rather than accidentally misaligned?
- Is every interactive state available by keyboard?
- Does every effect clean up after itself?
- Does mobile collapse into a calm, readable single column?
- Did we avoid adding a generic card where a rule, image, or empty space works?
- Did we define the Muller-Brockmann grid: container, margins, columns/modules,
  gutters, and baseline?
- If this touches a measured section, did we compare against `DESIGN.md`?
