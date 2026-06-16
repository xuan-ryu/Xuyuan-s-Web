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

### Typography

| Role | Family | Current usage | Rule |
| --- | --- | --- | --- |
| Display serif | `var(--font-serif)` | Hero greeting, page titles, case chapter banners, CTA marquee. | Use for large titles from 48px upward. Weight stays light/regular. |
| Reading serif | `var(--font-newsreader)` | Body copy, captions, second-page/card treatment. | Use for long-form copy and elegant meta text. Line height 1.55 to 1.7. |
| Compact UI | `var(--font-sans)` | Nav, labels, small controls, CJK microcopy. | Use for uppercase labels, form labels, mobile controls. Keep letter spacing intentional. |
| Brush | `var(--font-brush)` | Logo, signature, seal-like wordmarks. | Brand moments only. Never use for paragraphs or controls. |
| Mono | `var(--font-mono)` | Technical labels and tiny coordinate-like UI. | Use sparingly for numeric or system microcopy. |

Type scale anchors:

| Token name | Size | Use |
| --- | --- | --- |
| Display 1 | `clamp(82px, 12vw, 168px)` | About/Hongyadong hero scale. |
| Display 2 | `clamp(58px, 8.4vw, 120px)` | Page and case major titles. |
| Display 3 | `clamp(52px, 7.8vw, 112px)` | Chapter banners and CTA marquee. |
| Heading | `clamp(42px, 5.1vw, 55px)` | Editorial section headings. |
| Lead | `clamp(20px, 1.95vw, 28px)` | Section lead paragraphs. |
| Body | `clamp(18px, 1.55vw, 22px)` | Long-form copy. |
| Meta | `12px` to `17px` | Labels, captions, nav, dates. |

Rules:

- Do not use viewport-only font scaling. Always use `clamp()` with stable min and max.
- Letter spacing defaults to `0`. Add tracking only for labels, vertical text, and uppercase UI.
- Long-form text should not exceed about `68ch` unless it is a measured Framer clone.
- Center display type only for poster-style moments. Most content sections should be left or right anchored.

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
| `4px` to `8px` | local | Buttons, chips, controls, exact Framer clones. |

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

### Breakpoints

Framer export maps to:

- Desktop: `min-width: 1080px`
- Tablet: `810px` to `1079.98px`
- Phone: `max-width: 809.98px`

Use those thresholds when translating Framer variants. Tailwind utilities are
allowed, but CSS media queries should follow these breakpoints for Framer parity.

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

### Buttons And Links

Source: Framer form button, nav item, link-with-arrow; current CTA/contact/work links.

Contract:

- Primary button: dark ink fill, 4px radius, serif or compact UI text, uppercase
  only when the label is a command.
- Hover: darken to `--ink-700` or invert on dark surfaces.
- Active: slight `translateY(1px)` or scale within the same transform stack.
- States required for forms: default, loading, success, error, disabled.
- Links inside body copy use text underline or amber hover, not button styling.

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

### CTA Marquee

Source: Framer closing marquee; current `CtaBlock`.

Contract:

- Serif all-caps marquee, red seal between repetitions.
- Centered black `GET IN TOUCH` button.
- This closes home and about pages.
- Motion should be continuous but calm; pause or simplify under reduced motion.

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
| Medium | Button/link variants exist in Framer but not as Next primitives. | Add small `ButtonLike`/`TextLink` conventions or CSS classes before more pages are added. |
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
- If this touches a measured section, did we compare against `DESIGN.md`?
