# Design System — extracted from the original Framer export

Source of truth: `export-…` export package (index.html × 5 pages), Framer
color tokens + computed-style census. This is the canonical vocabulary; new
work references these tokens instead of inventing values.

## Colors

| Token | Value | Framer origin / role |
| --- | --- | --- |
| `--ink-950` | `#050505` | primary text, darkest surfaces |
| `--ink-900` | `#0a0a0a` | buttons, nav, footer card |
| `--ink-800` | `#1c1c1c` | dark panels (light-scheme variant `#fff`) |
| `--ink-700` | `#262626` | secondary dark surface (`99` alpha for glass) |
| `--paper` | `#ffffff` | page background |
| `--paper-warm` | `#fafafa` | koi frame, soft cards |
| `--mist` | `#e5e5e5` | hairlines, dividers |
| `--stone` | `#a3a3a3` | muted text, rules |
| `--accent-amber` | `#fe8411` | active nav, highlights |
| `--accent-gold` | `#d4941e` | seal/gold accents |
| `--accent-link` | `#0080ff` | links (rare) |

Alpha companions used by the export: `#ffffff0d` (glass edge), `#fffc`
(near-white text), `#000000bf/#00000080/#0000001a` (scrims), `#0a0a0acc`
(glass black ~80%), `#26262699` (glass black ~60%).

## Typography

| Family | Role |
| --- | --- |
| Cormorant Garamond | display serif — hero greeting, big headings |
| EB Garamond | long-form body serif, italic quotes |
| Newsreader | meta/UI serif — labels, captions |
| Murecho | sans for spaced uppercase + CJK labels |
| LiuJian-Mao-Cao | brush 行草 — logo, seals, signature moments |
| Plus Jakarta Sans / Marcellus | rare UI accents (buttons, numerals) |

Type scale (px, by frequency): **17** body · **14** meta · 12 caption ·
16/18 secondary body · 20/22/24/25 leads · 30/36 section subtitles ·
48/50 headings · 80+ display.

## Motion

| Token | Curve | Role |
| --- | --- | --- |
| `--ease-silk` | `cubic-bezier(0.16, 1, 0.3, 1)` | THE signature ease (23×) — almost every reveal/hover |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | utility fades |
| `--ease-soft` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | gentle drifts |
| `--ease-reveal` | `cubic-bezier(0.22, 1, 0.36, 1)` | text entrances |
| `--ease-spring` | `cubic-bezier(0.34, 1.52, 0.64, 1)` | playful overshoot (photo, cards) |

GSAP equivalent of `--ease-silk`: register via CustomEase
(`CustomEase.create("silk", "0.16,1,0.3,1")`).

## Radii

36 (major cards) · 26 (media panels) · 18 (glass cards) · 16 (medium) ·
8/4 (chips, buttons).

## Adoption rule

`globals.css` keeps live-measured absolute geometry as-is; **colors, easings,
radii, and fonts in new or touched rules must reference the `:root` tokens**
(progressive migration — don't mass-rewrite measured sections).
