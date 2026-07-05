# Home Koi-Pond — Lotus Bud→Bloom + Radial Part Animation Spec

**For:** Codex (implementer)
**Grounded in:** `portfolio/components/featured-gate.tsx`, `portfolio/components/fg-lotus-layer.tsx`, `portfolio/components/koi-pond.tsx`, `portfolio/app/page.tsx:46–73`, `portfolio/app/globals.css:2685–2705`.
**Status of prerequisites:** only the 8 leaf PNGs exist (`public/media/home/lotus/individual/lotus-leaf-01..08.png`, ~330–370 px square, ~200 KB each). **No flower assets exist yet — nothing renders until they are produced (Section 6); until then the crossing/frame draw 404'd `alt=""` imgs (blank gaps).**

---

## 1. Goal & one-sentence effect

As the visitor scrolls through the pinned Selected-Work "moon gate" crossing, a full top-down lotus pond of leaves settles over the ink, closed lotus **buds nestled near its center swell and open into full blooms**, and the whole field then **parts radially from the center outward** — leaves retreat across the full canopy and the blooms arc up and out to crown the perimeter, the middle clears to reveal the live koi pond, and the transient crossing layer **soft-dissolves into the persistent static lotus frame behind it**, all scrubbed by scroll (nothing autoplays).

**Additive, non-regressing principle:** flowers are a *new, parallel* type — new config array, new render pass, new GSAP loop. The leaf type (`FgLeafCfg`), `FG_LEAVES`, the leaf render map, and the leaf timeline loop stay **behaviorally unchanged**, so the existing crossing cannot regress. The *only* deliberate edit to shared code is one CSS scope tightening (`will-change`, Section 7) that is visually identical and does not touch leaf animation.

---

## 2. Scene architecture + layer stack

The scene is **two sibling DOM trees**, plus a transient crossing overlay that pins on top during the scroll and dissolves into the pond.

**Canvas vs DOM:**
- **Canvas (koi):** `#fishCanvas` (opaque `alpha:false`, per-frame `#020305` fill — nothing under it shows) and disabled `#padCanvas` (`showLilyPads=false`, dead/reserved). Both live inside `.koi-container` which is `isolation:isolate; z-index:0` — a **sealed stacking context**; its internal z-order (vignette 9, noise 10, hero-ui/FEED pill 30, feed-cursor 1000) never escapes.
- **DOM (lotus):** PNG `<img>` leaves/flowers, **not** on canvas. Two instances of `LotusField`:
  - `KoiLotusFrame` → `.koi-lotus-frame` (`z-index:2`; **CSS `position:absolute; inset:0`**), the **persistent static decoration** mounted in `app/page.tsx:65`, a sibling *after* `<KoiPondScene>`. Its coordinate box is the **full `.home-koi-section` (`height:1555px`)**, not the viewport. It is passed the `fixed` **prop**, which is a *data-layout flag* only (renders each element at `frameX/frameY` with an inline `transform`), **not** CSS `position:fixed`.
  - `FgLotusLayer` → `.fgl-layer` (`z-index:3`; **CSS `position:absolute; inset:0`** inside the pinned `.fg-section`, ~100vh), the **transient crossing layer** in `featured-gate.tsx:520`, mounted only desktop + motion-safe.

> **Coordinate-box mismatch (load-bearing — see Section 3 handoff + Open Questions):** because `.koi-lotus-frame` resolves its `frameX/frameY` percentages against a 1555 px box while `.fgl-layer` resolves the same percentages against a ~100vh box, an element's animated landing point and its static-frame resting point are **not the same screen position**. The gap grows with `frameY`. This is the shipped leaf behaviour; the flowers work *with* it (upper-band `frameY`, soft cross-dissolve) rather than pretending to a frozen freeze.

**Effective z-order (bottom→top) during the crossing:** koi wrapper (z0, sealed, contains opaque fish canvas + FEED pill) → `.koi-lotus-frame` (z2, static bloomed decoration) → pinned `.fg-section` (z2, wall/moon-gate/ink) → `.fgl-layer` (z3, animating leaves+flowers). After the crossing the `.fg-section` and `.fgl-layer` have faded, leaving koi + `.koi-lotus-frame`.

**How the center reveals the koi:** *by omission, not masking.* Every element's parted/frame position sits at the perimeter; the central rectangle (≈ `x 25–75, y 25–75`) is deliberately left empty, so the koi + centered FEED pill show through. The lotus is `pointer-events:none` (at `.fgl-layer`/`.koi-lotus-frame`) + `aria-hidden` with `alt=""` imgs — it never intercepts feeding and adds no AT noise.

---

## 3. Scroll choreography (pinned scrub, progress 0→1 of `PIN_END="+=270%"`)

All positions are **fractions of the timeline** (`tl.to({}, {duration:1}, 0)` master span). Existing beats are unchanged; new flower beats slot into the empty `~0.46→0.50` window and the `0.50→~0.86` part window.

| progress | wall / moon gate (existing) | leaves (existing, unchanged) | **flowers (NEW)** |
|---|---|---|---|
| **0 → 0.09** | free runway — rest, read, hover the index. **No snap below `SNAP_FREE=0.13`.** No lotus visible. | — | — |
| **0.09 → 0.37** | gate scales (`power2.in`) until the round opening swallows the viewport; left+head fade | — | — |
| **0.13 → 0.31** | ink veil fades to solid `#050505` (this ink *is* the pond water surface) | — | — |
| **0.33 → ~0.47** | (held ink) | **condense:** each leaf fades in + settles `scale 1.12→1` at its full-canopy grid cell (`LEAF_IN + inOrder·0.04`) | **seed buds:** each flower fades in **as a small closed bud** (`scale 0.45`) packed near center (`LEAF_IN + inOrder·LEAF_IN_SPREAD`) |
| **~0.47 → 0.50** | "full pond" beat: canopy complete, buds closed | settled | settled buds |
| **~0.46 → ~0.62** | — | — | **BLOOM:** buds open — bud→half→full opacity crossfade + `scale 0.45→frameScale` (`BLOOM_AT + order·BLOOM_STAGGER`). All six blooms fire in a tight ~0.46 window (low `order`) then finish ~0.62, overlapping into the part |
| **0.50 → ~0.86** | — | **part:** center leaves translate to their `frameX/Y` first, edges last (`PART_AT + order·0.07`, `sine.inOut`, `PART_DUR=0.34`); full canopy range | **part outward:** flowers (low `order`, central start) travel among the first, blooming as they go; land in the **upper garland band** (top + upper sides) |
| **0.88 → 0.97** | `bg` (white wall) + `gate` `autoAlpha:0`; pond has risen (`marginTop:-100vh`); `pointerEvents` released past 0.85 | (arrived, resting) | (arrived, open, resting) |
| **0.975 → 1.0** | — | **`.fgl-layer autoAlpha:0`** — the whole crossing layer soft-dissolves into the live `.koi-lotus-frame` behind (duration `0.035`) | rides the same layer dissolve |

**Handoff at 0.975 — honest description:** this is a **soft cross-dissolve, not a frozen freeze.** Because of the coordinate-box mismatch (Section 2), each element's animated landing sits slightly *higher* on screen than its static-frame twin; the dissolve reads as a gentle settle. Flowers are kept in the **upper band (`frameY ≤ ~28`)** so this offset stays small (≈60–200 px) and reads clean — exactly as the dark, blurred leaves already do in production. **Codex must verify in the running scene and nudge any flower's `frameY` lower if it "pops."** (See Open Questions for the frozen-border alternative.)

**Final states (must each be a finished, readable page):**
- **Reduced-motion (JS on):** the pin, `FgLotusLayer`, and all GSAP never mount (`CROSSING_MEDIA = "(min-width:901px) and (prefers-reduced-motion:no-preference)"` gates both the timeline and `lotusOn`). `KoiLotusFrame` renders statically: leaves at `frameX/Y`, flowers at their **full-open image** at `frameScale` — a correct bloomed pond decoration framing the koi, with zero animation JS. The koi canvas still runs; reduced-motion only drops `qualityTier` to 0 (~30 fps) — **fish keep swimming.**
- **Genuine no-JS:** SSR emits the static `KoiLotusFrame` markup + inline `<style>`, so the bloomed frame renders over the dark `#020305` water. **But the fish are canvas-2D drawn by `animate()` and require JS — with JS off there are no fish and the FEED pill is inert.** Do not claim "koi visible" for no-JS; it is a still, dark, lotus-framed pond.
- **`≤740px`:** `.koi-lotus-frame { display:none }` — plain koi pond, no lotus. FEED THE FISH unaffected. **`741–900px`:** `CROSSING_MEDIA` (≥901px) blocks the crossing, but the static frame still shows; the perimeter `frameX` + vmin sizing keep the center clear — **verify at ~768 px** that the koi hero + FEED pill stay clear (if the frame feels unjustified without a crossing, optionally extend `display:none` to `≤900px`; note that also hides the existing leaf frame in that band).
- The animation only ever *rewinds+replays* on scrub; reading is never blocked (matches the site's progressive-enhancement pattern).

---

## 4. Bud→bloom mechanism — Option B (recommended), Option A noted

A single scaled sprite cannot open petals, so bloom must be an image swap.

- **Option A — 2-state crossfade (bud → full) + scale.** 2 states × 3 variants = **6 PNGs.** *Weakness:* the crossfade midpoint is a 50/50 ghost of a closed silhouette over a fully-open flower — under slow scrub it reads as a dissolve, not a mechanical opening.
- **Option B — 3-frame sequence (bud → half → full), scrubbed. ✅ RECOMMENDED, and this spec is written for it.** 3 states × 3 variants = **9 PNGs.** Each crossfade is between *adjacent* geometries, so ghosting is minimal and the scrub reads as genuine petals spreading — the "opening from center outward" gesture, holding up under slow back-and-forth scrub. The extra 3 PNGs are a small cost at this scale/dimming.

*(The A-vs-B choice is a genuine owner decision — see Open Questions. The rest of this spec assumes B.)*

**DOM (per flower, inside `LotusField`).** The item **must** be sized (`width/height = cfg.size vmin`) exactly like the leaf branch — the three imgs are `position:absolute; inset:0` and collapse to 0×0 without it. **In `fixed` (frame) mode render ONLY the `-full` img** (perf, Section 7): the static frame never needs bud/half, and this trims 12 img nodes/decodes off the desktop double-mount.

```jsx
// layer mode (fixed === false):
<div className="fgl-item fgl-flower"
     style={{ left:`${c.x}%`, top:`${c.y}%`, width:`${c.size}vmin`, height:`${c.size}vmin` }}>
  <img className="fgl-asset fgl-f-bud"  src={flowerSrc(c.variant,"bud")}  alt="" draggable={false} decoding="async" />
  <img className="fgl-asset fgl-f-half" src={flowerSrc(c.variant,"half")} alt="" draggable={false} decoding="async" />
  <img className="fgl-asset fgl-f-full" src={flowerSrc(c.variant,"full")} alt="" draggable={false} decoding="async" />
</div>

// frame mode (fixed === true) — FULL only, lazy/low-priority (below the fold):
<div className="fgl-item fgl-flower"
     style={{ left:`${c.frameX}%`, top:`${c.frameY}%`, width:`${c.size}vmin`, height:`${c.size}vmin`,
              transform:`translate(-50%,-50%) rotate(${c.frameRot}deg) scale(${c.frameScale})` }}>
  <img className="fgl-asset fgl-f-full" src={flowerSrc(c.variant,"full")} alt="" draggable={false}
       decoding="async" loading="lazy" fetchPriority="low" />
</div>
```

**CSS (append before `</style>`, ~line 152):**
```css
.fgl-flower { z-index: 1; }                 /* flowers above sibling leaves in the layer */
/* gate: only the bud shows at start; the base .fgl-asset rule already gives it var(--leaf-alpha) */
.fgl-layer .fgl-f-half,
.fgl-layer .fgl-f-full { opacity: 0; }
/* static frame needs NO flower-specific opacity rule: it renders only .fgl-f-full,
   which inherits opacity:var(--leaf-alpha) from base .fgl-asset (0.72) × item 0.78 = 0.56,
   identical to the leaves. */
```

**GSAP per flower (append to the SAME `tl`, inside the existing `if (layer) {…}` block, after the leaf loop (~line 318) and before the layer dissolve (line 320)). Opacity is crossfaded between `0` and `0.82` — the layer's `--leaf-alpha` — NOT `0`↔`1`, so an open flower matches leaf brightness (item 1 × asset 0.82 = 0.82) and the 0.82→0.56 layer→frame step equals the leaves'. Hardcode `0.82` (GSAP cannot reliably tween to a `var()` string; the animating layer is always `.fgl-layer`).**

```ts
const flowers = gsap.utils.toArray<HTMLElement>(".fgl-flower", layer);
flowers.forEach((el, i) => {
  const cfg = FG_FLOWERS[i];
  if (!cfg) return;
  const bud  = el.querySelector<HTMLElement>(".fgl-f-bud");
  const half = el.querySelector<HTMLElement>(".fgl-f-half");
  const full = el.querySelector<HTMLElement>(".fgl-f-full");

  // small closed bud, packed near center
  gsap.set(el,   { xPercent:-50, yPercent:-50, rotation:cfg.rot, scale:0.45, transformOrigin:"50% 50%" });
  gsap.set(bud,  { opacity: 0.82 });   // deterministic on rebuild
  gsap.set(half, { opacity: 0 });
  gsap.set(full, { opacity: 0 });

  const B = BLOOM_AT + cfg.order * BLOOM_STAGGER + (cfg.bloomAt ?? 0);

  // appear AS a bud (opacity only; stays scale 0.45)
  tl.to(el, { opacity: 1, duration: LEAF_IN_DUR }, LEAF_IN + cfg.inOrder * LEAF_IN_SPREAD);

  // bloom stage 1: bud → half
  tl.to(bud,  { opacity: 0,    duration: BLOOM_DUR * 0.5 }, B);
  tl.to(half, { opacity: 0.82, duration: BLOOM_DUR * 0.5 }, B);
  // bloom stage 2: half → full
  tl.to(half, { opacity: 0,    duration: BLOOM_DUR * 0.5 }, B + BLOOM_DUR * 0.5);
  tl.to(full, { opacity: 0.82, duration: BLOOM_DUR * 0.5 }, B + BLOOM_DUR * 0.5);

  // swell — scale is owned ONLY by this bloom tween; the part tween must NOT set scale
  tl.to(el, { scale: cfg.frameScale, duration: BLOOM_DUR }, B);

  // part — translate + rotation only (function-based px so invalidateOnRefresh recomputes on resize)
  tl.to(el, {
    x: () => ((cfg.frameX - cfg.x) / 100) * window.innerWidth,
    y: () => ((cfg.frameY - cfg.y) / 100) * window.innerHeight,
    rotation: cfg.frameRot,
    duration: PART_DUR,
    ease: "sine.inOut",
  }, PART_AT + cfg.order * PART_STAGGER);
});
```

The swell (`scale`) and part (`x/y/rotation`) overlap in time (~0.50–0.62) but animate **disjoint properties**, so GSAP's default `overwrite:false` runs both — the flower grows *and* travels = blooming while parting. Do not create a second ScrollTrigger; do not touch the leaf loop or the master span.

**New constants (add after `featured-gate.tsx:58`):**
```ts
const BLOOM_AT      = 0.46; // buds begin opening — 0.04 before PART_AT so "open, then spread"
const BLOOM_STAGGER = 0.02; // × cfg.order — negligible spread at these low orders (blooms ~simultaneous)
const BLOOM_DUR     = 0.16; // per-flower open (overlaps into the part)
```
**Timing sanity:** earliest bloom 0.46 → ~0.62; latest part end `0.50 + 0.24·0.07 + 0.34 ≈ 0.857` — before `FADE_AT=0.88` and the `0.975` dissolve, and ≥ `SNAP_FREE=0.13`. **Note:** the timeline total is ~**1.01** (the `0.975 + 0.035` dissolve extends past the `duration:1` master span), so scrub maps progress→time ~1% early and these margins are ~1% tighter than the raw fractions; keep new beats off `FADE_AT`. All the above clears it.

---

## 5. Radial "part from center" math + data-model extension

**Translate formula (identical mechanism to leaves — MUST be function-based px so `invalidateOnRefresh:true` recomputes on resize):** shown in the loop above. Each element sits at `left:x% / top:y%` and GSAP translates it by the `%`-delta to `frameX/frameY`, converted to px against the live viewport; `rotation → frameRot`; **scale is owned by the bloom tween, never the part tween.**

**Why it clears the center:**
1. **Start** (`x,y`) is near the middle — leaves fill a full canopy grid; **flowers are packed tighter (`x∈45–55, y∈45–52`)**, a center bouquet.
2. **End** (`frameX,frameY`) is on the perimeter. Leaves keep their full-range frame (all four edges). **Flowers land in the upper band** (top + upper-left/right, `frameY ≤ 28`) — the zone where the layer→frame handoff offset is smallest (Section 3) and where the blooms arc *over* the revealed koi hero.
3. **`order`** keys the stagger (center-first, edges-last). Flowers start most-central, so they get **low `order` (0.02–0.24)** and clear early with the center leaves.
4. No `frame*` lands a body inside the central koi/pill window → the koi is revealed by omission.

**Flowers differ from leaves in exactly three ways:** they **start packed near center**, they **bloom** (crossfade + swell) while parting, and they **land in the upper garland band** (not the full four-edge range). Everything else (translate formula, stagger, eases, dissolve) is shared.

**Data-model extension — add after `FgLeafCfg` (after line 20). Do NOT modify `FgLeafCfg` or `FG_LEAVES`.**
```ts
export type FgFlowerCfg = FrameTarget & {   // reuse FrameTarget (frameX/Y/Rot/Scale, lines 5–10)
  x: number; y: number;   // packed-near-center start, % of container
  size: number;           // vmin (flowers ≈ half a leaf)
  rot: number;            // closed-bud rotation
  order: number;          // 0–1 part-stagger key (low = center = parts first)
  inOrder: number;        // 0–1 appear-stagger key
  bloomAt?: number;       // optional per-flower jitter added to bloom start (default 0)
  variant: 1 | 2 | 3;     // selects the bud/half/full PNG trio
};
```

**Concrete array — add after `FG_LEAVES` + `leafSrc` (after line 65). 6 flowers, each variant reused twice at different rot/scale; all `frameY ≤ 28`, all `frameX` off the vertical centerline and clear of the left dock zone (`x<20 && y 40–60`):**
```ts
export const FG_FLOWERS: FgFlowerCfg[] = [
  // x/y = center bouquet;  frameX/Y = upper-garland gaps between the leaf frame
  { x: 49, y: 45, size: 15, rot:  -6, order: 0.02, inOrder: 0.20, variant: 2, frameX: 34, frameY:  8, frameRot:  -8, frameScale: 0.60 }, // top, left-of-center
  { x: 51, y: 45, size: 15, rot:   6, order: 0.05, inOrder: 0.35, variant: 3, frameX: 66, frameY:  8, frameRot:  10, frameScale: 0.60 }, // top, right-of-center
  { x: 45, y: 47, size: 16, rot: -14, order: 0.10, inOrder: 0.55, variant: 1, frameX:  9, frameY: 18, frameRot: -18, frameScale: 0.70 }, // top-left corner
  { x: 55, y: 47, size: 16, rot:  14, order: 0.13, inOrder: 0.70, variant: 2, frameX: 91, frameY: 18, frameRot:  18, frameScale: 0.70 }, // top-right corner
  { x: 46, y: 52, size: 15, rot:  18, order: 0.20, inOrder: 0.85, variant: 3, frameX:  6, frameY: 28, frameRot:  22, frameScale: 0.66 }, // upper-left edge
  { x: 54, y: 52, size: 15, rot: -18, order: 0.24, inOrder: 0.45, variant: 1, frameX: 94, frameY: 28, frameRot: -22, frameScale: 0.66 }, // upper-right edge
];

const flowerSrc = (v: FgFlowerCfg["variant"], state: "bud" | "half" | "full") =>
  `/media/home/lotus/individual/lotus-flower-${String(v).padStart(2, "0")}-${state}.png`;
```
**Invariants:** keep `FG_FLOWERS[i]` ↔ `.fgl-flower` DOM index 1:1 (own array, own map — does not touch the load-bearing `leaves[i] ↔ FG_LEAVES[i]` pairing). Keep all `frame*` off the central window; keep flowers `frameY ≤ ~28`; keep left-side flowers out of the docked-pill zone (Section 7). These `frameX/Y` + small `frameScale` keep each bloom's body visible in the upper frame. **All frame positions are provisional — Codex verifies against the running scene and nudges for legibility of the koi title, FEED pill, and scroll tip (Section 7).**

---

## 6. ASSET SPEC (critical — produce these before implementing)

**What exists:** 8 leaf PNGs only — genuine top-down photographs, tightly cropped (~95% of frame), transparent (straight alpha), muted green with rust edges, radial vein center, **no baked contact shadow**, ~330–370 px near-square, tuned so the CSS filter `saturate(0.66–0.72) brightness(0.6–0.62) contrast(0.82–0.86) blur(0.28–0.46px)` lands them in the dark pond palette. Match this look.

**What to produce — 9 flower PNGs (Option B): 3 states × 3 variants.**

**States (per variant), with an explicit footprint rule (resolves the "consistent padding" vs "tight bud" contradiction):** encode the opening as **modest intrinsic growth**, all three states **concentric on the seed-pod pivot**, so the crossfade itself reads as petals pushing outward — independent of, and reinforcing, the code's `scale 0.45→frameScale` swell (which is weak on its own: several flowers grow only ~1.3–1.5×):
- `bud` — petals fully furled, viewed **straight down the vertical axis: a tight concentric rosette of pointed petal tips converging to a central point** (NOT a side-view teardrop). Silhouette ≈ **55–65%** of the frame's inner envelope.
- `half` — outer petals spread, inner petals still cupped toward the center, seed pod partly visible. Silhouette ≈ **75%** (roughly the geometric mean of bud and full, so both crossfade legs bridge evenly).
- `full` — fully open, petals fanned to a radial circle, round central seed pod. Silhouette ≈ **95%**.

**Variants (3):** **v1 pale pink**, **v2 white/cream**, **v3 deep rose** — realistic lotus range, modest saturation (the CSS filter dims them further). Each PNG is **reused at two placements** (six `FG_FLOWERS`, three variants), so make the three variants visually distinct enough to read as variety; do not over-produce.

**Format / resolution / weight:**
- Transparent PNG, **straight (non-premultiplied) alpha**, **8-bit RGBA with dithering**, run through **oxipng** (and pngquant only if it does not band).
- **512 × 512 px**, subject **centered on the seed-pod**, displayed at 14–16 vmin (scaled ≤ `frameScale`).
- **Target ~150–200 KB each** (NOT ≤120 KB — that is too tight for 512² soft pink gradients and bands in the dark tones the `brightness≈0.6` filter produces). **Check banding in the dimmed running scene, not on white.**
- **No baked shadow** (matches the leaves; the near-black water + blur hides grounding, and a baked shadow would fringe).

**Naming (matches `flowerSrc`):** `lotus-flower-01-bud.png`, `-01-half.png`, `-01-full.png`, … `-03-full.png`.
**Folder:** `this Next.js repo\public\media\home\lotus\individual\` (same as leaves).
**Extra leaf states:** **none** — the leaf loop only condenses + translates, never crossfades; the existing 8 PNGs are reused unchanged.

### Generation pipeline — reference-locked (mandatory)

Three independent text-to-image generations yield three *different* flowers, not one flower opening — crossfades would jump in hue, petal count, and framing. So: **generate `full` first, then derive `half` and `bud` from that same image via img2img / inpaint (or an image-edit model with `full` as the reference), holding hue, petal count, and center fixed.** Text-to-image from scratch per state is not acceptable.

**Universal suffix — append to EVERY prompt:**
> *single isolated lotus blossom viewed straight down the vertical axis; no stem, no leaves, no water droplets, no reflections, no cast shadow; flat even studio lighting; isolated on a flat, evenly-lit neutral mid-gray (or chroma) background for clean masking; square 1:1; subject centered on the seed pod and filling the frame at a consistent scale; photoreal botanical macro.*

(The pond darkness is added later by the CSS filter — **never bake a dark/pond background in**; a pale bloom cut off dark water masks badly and fringes.)

1. **FULL (text-to-image), v1:** `Top-down overhead photograph of a fully open lotus blossom seen straight from above, concentric rows of petals fanned into a radial circle, a round yellow-green central seed pod, pale pink petals` + universal suffix.
2. **HALF (img2img from the v1 full):** `The same lotus blossom half-open: outer petals spread outward but inner petals still cupped toward the center, seed pod partly visible; identical pale-pink hue, petal count, and center position as the reference` + universal suffix.
3. **BUD (img2img from the v1 full/half):** `The same lotus blossom fully closed into a bud, viewed straight down its vertical axis: a tight concentric rosette of pointed, furled petal tips converging to a central point; no side profile; identical hue and center position as the reference` + universal suffix.
4. **Repeat the full→half→bud chain for v2** (`white/cream petals`) **and v3** (`deep rose petals`), each chain reference-locked to its own `full`.

### Post-processing (required)

- **Cutout:** remove background to clean transparent alpha (remove.bg / SAM / manual). Feather edges 1–2 px.
- **Defringe / matte-decontaminate:** kill any light halo — a pale rim glows against the near-black `#020305` pond.
- **Pivot registration:** align all three states of a variant on the **seed-pod (petal-radiation) center — NOT the bounding-box center** (a bud's bbox center is not its pod). Overlay-verify the pod pixel is identical across bud/half/full, or the crossfade and the `rot`/`frameRot` rotation will slide.
- **Tone match:** open a finished `lotus-leaf-0N.png` beside each flower; because the filter darkens (`brightness≈0.6`), make sources **a bit brighter/more saturated** than the desired final. Verify a full-open flower next to a leaf **in the running, filtered scene.**

---

## 7. Performance + accessibility

- **PNG budget:** 8 leaves + 9 flowers = **17 unique PNGs (~3.2 MB total)** at ~200 KB / ~175 KB each. Flowers load only where the layer mounts (desktop motion-safe) and in the static frame (desktop ≥741px).
- **Desktop double-mount:** on ≥901px motion-safe, **both** `FgLotusLayer` and `KoiLotusFrame` mount `LotusField` at once. With the **fixed-mode full-only optimization (Section 4, now required)** the totals are: layer = 34 leaf + 18 flower (6×3) = **52 imgs**; frame = 34 leaf + 6 flower (full only) = **40 imgs** → ~92 img nodes, ~17 unique srcs (network dedupes; decoded-bitmap memory is the real cost — the full-only frame trims 12 decodes).
- **Compositor-only:** animate **transform (`x/y/scale/rotation`) on `.fgl-item`** and **opacity on the child imgs** — never width/height/left/top at runtime. Static frame sets `left/top%` + inline transform once (no runtime layout).
- **`will-change` scope (the one deliberate shared-CSS edit — safe, visually identical):** the current `.fgl-item { will-change: transform, opacity }` (line 131) promotes ~40 compositor layers in the *static* frame that never animate (×2 with the crossing layer). **Move it to `.fgl-layer .fgl-item` only:**
  ```css
  .fgl-item { position:absolute; opacity:0; transform-origin:50% 50%; } /* drop will-change here */
  .fgl-layer .fgl-item { will-change: transform, opacity; }            /* animating layer keeps it */
  ```
  The animating leaves/flowers still get `will-change`; the crossing is unaffected; only the idle frame stops promoting dead layers. Do **not** add `will-change` to the 18 flower imgs.
- **Decode safety (fetch-safe ≠ decode-safe):** the imgs are in the DOM at opacity 0 so they *fetch* early, but flipping opacity 0→1 during scrub can force a synchronous decode → dropped frames. Add **`decoding="async"`** to every flower img (and, safely, to the leaf imgs). Optionally warm the crossing layer with `img.decode()` on mount. Escalate to `<link rel=preload>` for the `-full` variants only if a first-scroll flash appears.
- **Initial-load priority:** the **frame** copy is below the fold — give its imgs **`loading="lazy"` + `fetchPriority="low"`** (shown in Section 4) so ~3 MB of lotus does not compete with the hero/video previews. Keep the **crossing layer eager** so it is ready when the pin plays.
- **Canvas coexistence:** lotus is DOM above the opaque `#fishCanvas`; never under it. Keep `.koi-container` `isolation:isolate; z-index:0` and the fish canvas `alpha:false` untouched.
- **FEED THE FISH — untouched, but keep it visually clear:** markup, `role/tabIndex/aria-label/aria-pressed`, click+keyboard toggle, `.feed-mode`, `#feed-cursor`, `--dock-x/--dock-s`, `koi:feed`/`koi:how-reveal`/Escape all live in the untouched koi file. Lotus stays `pointer-events:none` + `aria-hidden`, so the pill is never *intercepted*. **But it can be visually occluded:** after the first feed, `#hero-ui` docks to the **left edge, mid-height** (`--dock-x`, `top:50%`), under z2 left-edge frame elements. The flower `frameX/Y` are chosen to stay out of that dock zone (`x<20 && y 40–60`) — **verify the docked chip stays legible.**
- **Center-chrome legibility:** the frame paints above the pond, so verify against the running scene that the top-center flowers (`frameX 34/66, frameY 8`) do not clip the koi title/eyebrow (`heroBoxXvw=50`) and that nothing covers `#scroll-tip` (`bottom:36px; left:50%`) — nudge `frameY`/`frameScale` if so. (No flower sits on the vertical centerline or at the bottom center, so both risks are already minimized.)
- **Reduced-motion / no-JS:** no timeline, no `FgLotusLayer`; static `KoiLotusFrame` shows the bloomed frame. Reduced-motion keeps the fish swimming (`qualityTier 0`); **no-JS shows the frame over still dark water with no fish** (Section 3).
- **A11y:** lotus is `aria-hidden` with `alt=""` decorative imgs; the added flower imgs create no focusable nodes and no AT noise.
- **Mobile:** `.koi-lotus-frame { display:none }` ≤740px stays; `CROSSING_MEDIA` (≥901px) blocks the crossing. Verify the 741–900px static-frame band (Section 3).

---

## 8. Files to touch + build order for Codex

1. **Produce assets** → 9 PNGs into `this Next.js repo\public\media\home\lotus\individual\` per Section 6. (Nothing renders until these exist.)
2. **`portfolio/components/fg-lotus-layer.tsx`** (additive + one CSS scope edit):
   a. Add `FgFlowerCfg` type after line 20; add `FG_FLOWERS` array + `flowerSrc` helper after line 65 (Section 5).
   b. In `LotusField`, add a **second `.map`** after the leaf map (ends ~line 105) rendering `.fgl-item.fgl-flower` — with `width/height = c.size vmin` on the item, and **three stacked imgs in layer mode / the `-full` img only in `fixed` mode** (Section 4). Add `decoding="async"` to all; add `loading="lazy" fetchPriority="low"` to the frame img.
   c. Append flower CSS before `</style>` (~line 152): `.fgl-flower{z-index:1}` and the gate default `.fgl-layer .fgl-f-half,.fgl-layer .fgl-f-full{opacity:0}` (no frame-specific flower opacity rule needed — full-only inherits `var(--leaf-alpha)`).
   d. **Scope `will-change`:** remove it from `.fgl-item`, add `.fgl-layer .fgl-item{will-change:transform,opacity}` (Section 7). Optionally add `decoding="async"` to the existing leaf imgs.
3. **`portfolio/components/featured-gate.tsx`** (additive only):
   a. Import: `import { FgLotusLayer, FG_LEAVES, FG_FLOWERS } from "@/components/fg-lotus-layer"` (line 35).
   b. Add `BLOOM_AT / BLOOM_STAGGER / BLOOM_DUR` after line 58.
   c. Add the **flower loop** inside the existing `if (layer) {…}` block, **after the leaf loop (~line 318) and before the layer dissolve (line 320)** — same `tl`, no second ScrollTrigger, leaf loop and master span untouched (Section 4).
4. **No changes to** `koi-pond.tsx`, `koi-pond-lazy.tsx`, or `app/page.tsx` — `KoiLotusFrame` (page.tsx:65) and `FgLotusLayer` (featured-gate.tsx:520) already mount `LotusField`, which now includes flowers; the `[lotusOn]` effect already rebuilds the timeline against the mounted DOM. *(This holds only under the additive/soft-dissolve default; the frozen-border alternative in Open Questions would require editing this file.)*

**Verify (desktop ≥901px, motion-safe):** scrub the crossing slowly forward and back; watch the 0.975 handoff for any flower "pop" (nudge `frameY` lower). Then test ≤740px (no lotus), ~768px (static frame — center clear?), the docked FEED chip's legibility after a feed, and `prefers-reduced-motion:reduce` (static bloomed frame, fish swim). Mind the Turbopack globals HMR lag and the Playwright chromium mismatch per project memory when screenshotting. **One `next dev` on :3000 only.**

---

## 9. Acceptance checklist

- [ ] 9 flower PNGs exist at the named paths; each is top-down, transparent, defringed, tone-matched to the leaves in the filtered scene; the 3 states of each variant share the seed-pod pivot and show 55%→75%→95% intrinsic growth; ~150–200 KB, no banding in the dimmed scene, no baked shadow.
- [ ] `FgLeafCfg`, `FG_LEAVES`, the leaf render map, and the leaf timeline loop are behaviorally unchanged (diff shows only additions + the `will-change` scope edit); the existing crossing behaves exactly as before.
- [ ] At `~0.47–0.50` the pond reads as a full canopy of leaves with **closed buds** packed near center.
- [ ] From `~0.46` the buds visibly **open** (bud→half→full) — a real petal-spread under slow scrub, not a muddy dissolve — fully open by `~0.62`; open flowers sit at the same brightness as the leaves (crossfade to 0.82, not 1.0).
- [ ] From `0.50` the field **parts from the center**: center clears first; leaves retreat across the full canopy and the blooms arc up into the **upper garland**; the koi + centered FEED pill are revealed in the cleared middle.
- [ ] The `0.975` handoff reads as a clean soft cross-dissolve (a gentle settle, no visible flower "pop"); no flower node lingers when the koi pond takes over.
- [ ] Reverse scroll cleanly rewinds bloom+part (scrubbed; nothing autoplays); `SNAP_FREE`/two-state snap and Lenis sync still work; timeline rebuilds correctly on the `[lotusOn]` boundary and on resize (function-based px recompute via `invalidateOnRefresh`).
- [ ] **Reduced-motion (JS on):** static `KoiLotusFrame` shows a finished bloomed lotus frame around a clear koi center; **fish still swim** (`qualityTier 0`).
- [ ] **No-JS / SSR:** static bloomed frame renders over still dark `#020305` water; **koi and the FEED pill require JS** (documented, not claimed to work).
- [ ] `≤740px`: no lotus, plain koi pond. `741–900px`: static frame keeps the koi center + FEED pill clear at ~768px.
- [ ] FEED THE FISH fully works (click + Enter/Space, dock, `koi:feed`, feed cursor); lotus never intercepts pointer events; the **docked** chip (left-edge) and the koi title / scroll-tip stay legible under the frame.
- [ ] Compositor-only (transform/opacity); `will-change` scoped to the animating layer; no console errors.

---

## Open questions for the owner

1. **Handoff fidelity (architectural).** This spec's default is the **additive soft cross-dissolve** — no changes to `koi-pond.tsx`/`app/page.tsx`, flowers kept to the upper band so the layer→frame settle stays small. A **truly seamless, frozen four-edge border** (blooms freezing in place and persisting all around the pond) is *not* achievable additively, because `.koi-lotus-frame` resolves its percentages against a 1555 px section while `.fgl-layer` uses ~100vh. Getting it would require **editing `koi-pond`/`page` to give `.koi-lotus-frame` a viewport (100vh / sticky-to-first-screen) basis** — breaking Section 8's "no container changes" and touching the shipped leaf frame too. Ship the soft dissolve, or approve the container edit for the frozen border?
2. **Bloom mechanism — B vs A.** B (3-frame bud→half→full, **9 PNGs**, recommended) gives a genuine mechanical opening under scrub; A (2-frame bud→full, **6 PNGs**) is cheaper but the crossfade midpoint reads as a dissolve. Confirm B, or drop to A to save 3 assets?
3. **Number of flower variants / flowers.** Current plan: **3 variants across 6 placements** (each PNG reused twice). More variants = more visual variety but more assets to produce; fewer flowers = a lighter garland. Keep 3×6, or adjust the variant/flower count?