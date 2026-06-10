# Framer to React Migration Audit

Current visual source of truth:

- `https://xuyuan.framer.website/`
- `https://quick-lion-6d85a.rehost.site/`
- Live/rehost screenshots are the visual baseline for layout, scroll timing, and interaction order.

Local asset/export source:

- `local Framer exportpackage`
- Framer export via NoCodeXport
- 9 exported pages
- Used primarily as the asset pool and fallback HTML reference.

React target:

- `this Next.js repo`
- Next.js App Router
- Static routes plus generated project detail pages

## Page Map

| Original page | React route | Status |
| --- | --- | --- |
| `/` | `/` | Live homepage section order restored through Featured/Koi/CTA; needs detail-level visual tuning |
| `/about` | `/about` | Main copy aligned to source export, needs visual/interaction diff |
| `/work` | `/work` | First viewport migrated toward source layout; needs remaining card/page diff |
| `/contact` | `/contact` | First viewport migrated toward source layout; needs full form/bottom diff |
| `/work/vicino-ai` | `/work/vicino-ai` | Built from dynamic project route |
| `/work/froghire-ai` | `/work/froghire-ai` | Built from dynamic project route |
| `/work/roper-center` | `/work/roper-center` | Built from dynamic project route |
| `/work/hunger1942` | `/work/hunger1942` | Built from dynamic project route |
| `/work/vr-education` | `/work/vr-education` | Built from dynamic project route |

## Current Engineering Baseline

- `npm.cmd run build` passes.
- Next generated 12 static pages, including all 5 project slugs.
- Source asset mirror exists at `public/assets`.
- Asset audit covers all source-export assets that actually exist in the export package.

## First Findings

1. PowerShell renders some UTF-8 text as mojibake in command output.
   - Node verified that source files are valid UTF-8.
   - Use Node or browser rendering, not PowerShell text output, as the source-of-truth when checking multilingual copy.

2. Current React content is not always the same version as the original export.
   - Home hero copy has been aligned to the original Framer text.
   - About intro, bio, and essay copy have been aligned to the original Framer text.
   - Work/project summaries need source-of-truth comparison per page.

3. Visual parity needs screenshot-based verification.
   - Compare original and React at desktop, tablet, and mobile widths.
   - Capture first viewport, mid-scroll, and page bottom for long interactive pages.
   - Prioritize `/` and `/about` because they carry the custom hero/canvas interactions.

## Migration Order

1. Align text with the original export.
2. Run both sites locally and capture baseline screenshots.
3. Diff `/` hero and loader behavior first.
4. Diff `/about` Hongyadong and koi pond sections next.
5. Diff work listing and project detail pages.
6. Clean up unused assets after visual parity is stable.

## Asset Audit

- Source HTML files scanned: 9.
- Referenced `/assets/...` entries: 438.
- Source assets found and mirrored into React: 437.
- Target missing assets: 0.
- Source missing assets: 1.
  - `/assets/framerusercontent.com/assets/VXxmU8xrCkbdBVKix29pBF2kVeY.pdf`
  - This PDF is referenced by the source About page but is not present in the original export package.
- Current report: `MIGRATION_ASSET_AUDIT.json`.

## Screenshot Audit

- Script: `scripts/capture-migration-matrix.mjs`.
- Command: `npm run audit:screenshots`.
- Output: `audit-screenshots/matrix/`.
- Captures source and React for:
  - Desktop `1440x1000`.
  - Mobile `390x844`.
  - `/`, `/about`, `/work`, `/contact`, and all 5 project detail routes.

## Completed This Pass

- Pivoted migration baseline from the local export alone to the live/rehosted Framer site.
- Captured live baselines under `audit-screenshots/live-baseline/`.
- Rebuilt the React homepage after the hero to match the live narrative sequence:
  - Black intro/profile screen copy and portrait.
  - Roof transition using mirrored Framer assets.
  - `Featured Project` section using the live half-window composition.
  - Koi/fish interaction section.
  - `How I Work` section.
  - Black `Let's Work Together` CTA.
- Recalibrated `HeroScene` scroll length so the roof transition starts around `2046px` and Featured starts around `3586px` on a `1440x1100` viewport, matching the live scroll checkpoints much more closely.
- Restarted the Next dev server and cleared `.next` after Turbopack served stale visual assets.
- Verified latest homepage pass with desktop screenshots under `audit-screenshots/live-check-12/`.
- Added mobile-specific Featured Project overrides and verified no horizontal overflow under `audit-screenshots/mobile-check-2/`.
- Fixed corrupted project detail navigation JSX and verified production build.
- Aligned home hero copy with `components/hero-scene.tsx` Framer defaults from the export.
- Aligned About hero intro, bio, and essay copy with the source export.
- Verified `npm.cmd run build` passes after edits.
- Ran the original Framer export locally with asset path mapping at `http://127.0.0.1:4101`.
- Captured local screenshot baselines under `audit-screenshots/` for manual visual comparison.
- Fixed home hero reveal so text cannot stay permanently transparent if `document.fonts.ready` stalls.
- Restyled the global header toward the Framer source: black logo block, black nav strip, and desktop HOME link.
- Shifted the home hero text block down to match the source export's first viewport placement.
- Matched the home hero greeting copy and measured the first viewport text positions against the source export:
  - `Welcome,` at `x=86.390625`, `y=405.40625`, `font-size=82px`.
  - `欢迎,` at `x=86.390625`, `y=503.40625`, `font-size=82px`.
  - `ようこそ。` at `x=86.390625`, `y=601.40625`, `font-size=82px`.
- Re-ran `npm.cmd run build` after the visual fixes.
- Mirrored the original Framer export asset tree into `public/assets`, preserving original `/assets/...` URL paths for images, videos, fonts, and Framer runtime assets.
- Re-ran the asset audit and reduced target missing assets from 335 to 0.
- Migrated Contact first viewport toward the source layout:
  - Large uppercase title.
  - Left intro paragraph.
  - Center black contact card with original red image mark.
  - Right portrait image using the original Framer asset path.
  - Form starts at the first viewport bottom like the source page.
- Migrated Work first viewport toward the source layout:
  - Large uppercase title and view-control icons.
  - Full-width dark project card.
  - Overlaid Vicino AI title, long description, and `VIEW PROJECT` button.
- Added automated source-vs-React screenshot matrix capture for all exported routes and desktop/mobile viewports.
- Migrated mobile Work listing toward the source layout:
  - Centered black mobile nav.
  - Small centered `MY WORK` title.
  - Compact 342px-wide project card with left overlay text and bottom button.
- Migrated project detail first viewports:
  - Desktop now uses a source-style title band, orange divider, and framed cover image.
  - Mobile now uses source-style title spacing, short cover image, and black `PROJECT SUMMARY` block.
- Disabled Next dev indicators so local visual screenshots are not polluted by the development badge.
- Cleared a corrupted Turbopack dev cache and verified the dev server returns `/work` successfully again.
- Re-ran `npm.cmd run build`; production build passes.

## Current Visual Gap Notes

- Home now follows the live/rehosted site's main section order through Featured Project and Koi.
- Remaining home gaps are mostly detail-level:
  - Logo brush font shape differs from the Framer export.
  - Ink particle field is stochastic and will not be pixel-identical frame-to-frame.
  - Roof composition still needs pixel-level parallax/position tuning.
  - Featured project typography/window layout is structurally close but not exact to Framer.
  - Mobile Featured is now readable and contained, but still needs source mobile checkpoint matching.
- Contact first viewport is structurally close, but the local brush logo font still differs from the Framer-export font metrics.
- Work first viewport is structurally close, but remaining differences include exact title font metrics, overlay text weight, and subsequent project cards.
- Project detail first viewports are structurally close on desktop and mobile for the shared layout.
- Remaining detail-page work is deeper page content: section order, embedded media, long-form copy, and per-project custom assets below the first viewport.
- Mobile header is structurally aligned with the source black pill, but the local brush/font metrics still differ from the Framer export.
