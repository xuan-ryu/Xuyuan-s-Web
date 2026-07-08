"use client";

/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from "react";

// ONE lotus arrangement, shared by the moon-gate crossing and the koi pond's
// static frame, so the handoff is seamless (no split): the crossing fills the
// whole viewport with a canopy (COVER), then parts center -> both sides back to
// the FRAME positions, dissolves, and the identical KoiLotusFrame fades in at
// those same FRAME positions. Same assets, same geometry, same coordinates.
export type LotusPad = {
  asset: number;
  side: "left" | "right" | "top";
  // frame: the koi-pond edge arrangement — the parted end state AND the static
  // KoiLotusFrame. Pads live on the left + right columns, center stays open.
  fx: number;
  fy: number;
  fsize: number;
  frot: number;
  fopacity: number;
  // cover: where the pad sits when the canopy fills the screen (pre-part). The
  // union of all cover boxes blankets the viewport; left-side pads reach in
  // from the left, right-side pads from the right, overlapping in the middle so
  // the part reads as the canopy opening from the center outward.
  cx: number;
  cy: number;
  csize: number;
  crot: number;
  // arrival order 0..1, scattered — pads pop in like raindrops across the
  // pond (owner preferred this over any linear sweep)
  rain: number;
  // mirror the artwork — combined with full-turn rotations it breaks the
  // "same leaf stamped everywhere" uniformity
  flip?: boolean;
  depth?: "back" | "front";
};

const LOTUS_ASSETS = [
  "/media/home/lotus/generated/single-transparent/01-large-leaf-flower-left-alpha.webp",
  "/media/home/lotus/generated/single-transparent/02-medium-leaf-top-alpha.webp",
  "/media/home/lotus/generated/single-transparent/03-medium-light-leaf-top-right-alpha.webp",
  "/media/home/lotus/generated/single-transparent/04-medium-leaf-center-alpha.webp",
  "/media/home/lotus/generated/single-transparent/05-small-leaf-right-alpha.webp",
  "/media/home/lotus/generated/single-transparent/06-medium-light-leaf-bottom-left-alpha.webp",
  "/media/home/lotus/generated/single-transparent/07-rolled-young-leaf-alpha.webp",
  "/media/home/lotus/generated/single-transparent/08-large-leaf-flower-bottom-center-alpha.webp",
  "/media/home/lotus/generated/single-transparent/09-medium-leaf-bottom-right-alpha.webp",
] as const;

// ---- deterministic bank generator ------------------------------------------
// The reference photo's banks are CONTINUOUS masses — pads overlapping 40-60%
// down each column, four shingled columns per bank. That's ~29 pads per bank,
// beyond sensible hand-tuning, so the banks are generated from a per-column
// recipe. A fixed jitter table (no Math.random) keeps SSR and client output
// identical while breaking the grid's regularity.
// 23 entries (prime) so the different phase-offsets below never line up —
// consecutive pads draw unrelated jitter and the banks read hand-scattered
const J = [
  0.31, -0.42, 0.18, -0.11, 0.44, -0.29, 0.07, -0.38, 0.23, -0.17, 0.39,
  -0.05, 0.47, -0.33, 0.12, -0.46, 0.28, -0.08, 0.41, -0.22, 0.03, -0.49,
  0.35,
];
const jit = (i: number, amp: number) => J[i % J.length] * amp;

// plain-leaf assets only; the flowers + rolled leaves are nested by the
// overrides below, like the reference (2 flowers per bank)
const LEAF_SEQ = [2, 1, 5, 8, 3, 4, 8, 2, 5, 1, 3, 8, 4, 2, 1, 5];

type BankCol = {
  x: number; // column centre (left-bank %; the right bank mirrors it)
  count: number; // pads down the column
  size: number; // base size (vmin)
  depth?: "back" | "front";
  opacity: number;
  shift: number; // cover state: how far the column slides toward the channel
  grow: number; // cover state: size multiplier
};

// four shingled columns per bank: large outer edge -> small channel edge.
// Inner columns slide well past the centre line in cover, so the two banks
// interleave and the canopy closes over the middle of the pond. Sizes and
// column positions are tuned SMALL and NARROW (owner: the first cut read too
// big and too wide) — the dense mass ends ~30%, leaving a ~35%-wide channel.
const BANK_COLS: BankCol[] = [
  { x: 0,  count: 8, size: 28, depth: "front", opacity: 0.95, shift: 7,  grow: 1.12 },
  { x: 11, count: 8, size: 21,                 opacity: 0.90, shift: 17, grow: 1.3 },
  { x: 21, count: 7, size: 15, depth: "back",  opacity: 0.86, shift: 26, grow: 1.5 },
  { x: 29, count: 6, size: 11, depth: "back",  opacity: 0.80, shift: 33, grow: 1.8 },
];

function buildBank(side: "left" | "right"): LotusPad[] {
  const pads: LotusPad[] = [];
  const mirror = side === "right";
  let i = mirror ? 7 : 0; // phase-offset the jitter so the banks differ
  for (const col of BANK_COLS) {
    const step = 108 / col.count;
    for (let r = 0; r < col.count; r += 1, i += 1) {
      // generous jitter on every dimension — real pads don't grow in rows.
      // Position scatters up to a third of the row spacing / half the column
      // gap; size swings ±30% so big and small pads mingle within a column.
      const fy = -4 + step * (r + 0.5) + jit(i, step * 0.32);
      const fxRaw = col.x + jit(i + 4, 4.5);
      const fx = mirror ? 100 - fxRaw : fxRaw;
      const fsize = col.size * (1 + jit(i + 2, 0.6));
      // FULL-turn orientation (±~176°): the pads are round radial leaves, so
      // small angles read identical — only a full spin (plus the mirror
      // below) makes each stamp of the same asset look like its own leaf
      const frot = jit(i + 1, 360);
      const shift = (mirror ? -1 : 1) * (col.shift + jit(i + 5, 5));
      pads.push({
        asset: LEAF_SEQ[i % LEAF_SEQ.length],
        side,
        fx,
        fy,
        fsize,
        frot,
        fopacity: Math.min(1, col.opacity + jit(i + 8, 0.05)),
        cx: fx + shift,
        cy: fy + jit(i + 3, 6),
        csize: fsize * (col.grow + jit(i + 7, 0.12)),
        crot: frot + jit(i + 6, 40),
        rain: Math.min(0.98, Math.max(0.02, 0.5 + jit(i + 9, 1))),
        flip: J[(i + 11) % J.length] > 0,
        depth: col.depth,
      });
    }
  }
  return pads;
}

const LEFT_BANK = buildBank("left");
const RIGHT_BANK = buildBank("right");
// nest the flowers (assets 0/7) and one rolled young leaf (asset 6) into each
// bank — outer/middle columns, staggered heights, exactly like the reference
LEFT_BANK[1] = { ...LEFT_BANK[1], asset: 0 }; // outer column, upper
LEFT_BANK[12] = { ...LEFT_BANK[12], asset: 7 }; // middle column, lower
LEFT_BANK[17] = { ...LEFT_BANK[17], asset: 6 }; // channel edge, rolled leaf
RIGHT_BANK[3] = { ...RIGHT_BANK[3], asset: 7 }; // outer column, lower-mid
RIGHT_BANK[10] = { ...RIGHT_BANK[10], asset: 0 }; // middle column, upper
RIGHT_BANK[25] = { ...RIGHT_BANK[25], asset: 6 }; // channel edge, rolled leaf

// canopy-only fillers: the jittered bank layout leaves a few black seams at
// full cover — these plug them. Their frame home is the SAME spot at
// fopacity 0, so during the part they sink away in place (shrinking as they
// fade) and never appear in the koi frame. Positions verified against the
// full-canopy screenshot at 1536×960.
// prettier-ignore
const CANOPY_FILLERS: LotusPad[] = [
  { asset: 3, side: "top", fx: 17, fy: 22, fsize: 19, frot: -142, fopacity: 0, cx: 17, cy: 22, csize: 26, crot: -128, rain: 0.14, flip: true,  depth: "back" },
  { asset: 1, side: "top", fx: 37, fy: 20, fsize: 19, frot: 118,  fopacity: 0, cx: 37, cy: 20, csize: 26, crot: 132,  rain: 0.55, depth: "back" },
  { asset: 8, side: "top", fx: 36, fy: 47, fsize: 16, frot: 37,   fopacity: 0, cx: 36, cy: 47, csize: 22, crot: 51,   rain: 0.32, flip: true,  depth: "back" },
  { asset: 5, side: "top", fx: 38, fy: 74, fsize: 19, frot: -64,  fopacity: 0, cx: 38, cy: 74, csize: 26, crot: -48,  rain: 0.78, depth: "back" },
  { asset: 4, side: "top", fx: 44, fy: 5,  fsize: 15, frot: 155,  fopacity: 0, cx: 44, cy: 5,  csize: 20, crot: 141,  rain: 0.42, flip: true,  depth: "back" },
  { asset: 2, side: "top", fx: 65, fy: 4,  fsize: 15, frot: -23,  fopacity: 0, cx: 65, cy: 4,  csize: 20, crot: -37,  rain: 0.88, depth: "back" },
  { asset: 8, side: "top", fx: 60, fy: 70, fsize: 19, frot: 96,   fopacity: 0, cx: 60, cy: 70, csize: 26, crot: 82,   rain: 0.22, depth: "back" },
  { asset: 3, side: "top", fx: 60, fy: 93, fsize: 15, frot: -108, fopacity: 0, cx: 60, cy: 93, csize: 20, crot: -92,  rain: 0.62, flip: true,  depth: "back" },
  { asset: 1, side: "top", fx: 81, fy: 40, fsize: 18, frot: 71,   fopacity: 0, cx: 81, cy: 40, csize: 24, crot: 85,   rain: 0.48, depth: "back" },
  { asset: 5, side: "top", fx: 97, fy: 45, fsize: 19, frot: -177, fopacity: 0, cx: 97, cy: 45, csize: 26, crot: -161, rain: 0.05, flip: true,  depth: "back" },
  { asset: 2, side: "top", fx: 18, fy: 92, fsize: 16, frot: 12,   fopacity: 0, cx: 18, cy: 92, csize: 22, crot: 26,   rain: 0.95, depth: "back" },
  { asset: 8, side: "top", fx: 17, fy: 55, fsize: 18, frot: 84,   fopacity: 0, cx: 17, cy: 55, csize: 24, crot: 98,   rain: 0.38, flip: true,  depth: "back" },
  { asset: 4, side: "top", fx: 41, fy: 40, fsize: 14, frot: -49,  fopacity: 0, cx: 41, cy: 40, csize: 18, crot: -63,  rain: 0.68, depth: "back" },
  { asset: 1, side: "top", fx: 41, fy: 94, fsize: 14, frot: 133,  fopacity: 0, cx: 41, cy: 94, csize: 18, crot: 119,  rain: 0.12, flip: true,  depth: "back" },
  { asset: 3, side: "top", fx: 83, fy: 82, fsize: 15, frot: -91,  fopacity: 0, cx: 83, cy: 82, csize: 20, crot: -105, rain: 0.85, depth: "back" },
];

export const LOTUS_PADS: LotusPad[] = [
  ...LEFT_BANK,
  ...RIGHT_BANK,
  // strays closing the bottom of the channel
  { asset: 6, side: "top", fx: 46, fy: 100, fsize: 12, frot: 137, fopacity: 0.78, cx: 43, cy: 97, csize: 17, crot: 121, rain: 0.72, flip: true, depth: "back" },
  { asset: 4, side: "top", fx: 55, fy: 102, fsize: 14, frot: -59, fopacity: 0.80, cx: 57, cy: 99, csize: 19, crot: -43, rain: 0.28, depth: "back" },
  ...CANOPY_FILLERS,
];

function LotusPadSpan({
  pad,
  index,
  className,
}: {
  pad: LotusPad;
  index: number;
  className: string;
}) {
  return (
    <span
      className={className}
      style={
        {
          "--fx": `${pad.fx}%`,
          "--fy": `${pad.fy}%`,
          "--fsize": `${pad.fsize}vmin`,
          "--frot": `${pad.frot}deg`,
          "--fop": pad.fopacity,
          "--i": index,
        } as CSSProperties
      }
    >
      <img
        src={LOTUS_ASSETS[pad.asset]}
        alt=""
        draggable={false}
        // mirror on the img, NOT the wrapper — GSAP owns the wrapper's
        // transform during the crossing and would overwrite a flip there
        style={pad.flip ? { transform: "scaleX(-1)" } : undefined}
      />
    </span>
  );
}

export function FgLotusLayer() {
  return (
    <div className="fgl-layer" aria-hidden="true">
      {/* the pond water the pads rest on — same recipe as the koi pond it
          hands off to (base #041114 + a soft radial teal lift), faded in by
          the crossing timeline so the pads never float on flat black */}
      <span className="fgl-water" aria-hidden="true" />
      {LOTUS_PADS.map((pad, index) => (
        <LotusPadSpan
          key={`${pad.asset}-${index}`}
          pad={pad}
          index={index}
          className={`fgl-cluster is-${pad.depth ?? "mid"}`}
        />
      ))}
      <style>{`
        .fgl-layer {
          position: absolute;
          /* SAME box as .koi-lotus-frame (inset 0) so a pad at its frame
             coordinates renders pixel-identically in both — the crossing
             dissolves onto the koi frame with no jump */
          inset: 0;
          z-index: 3;
          pointer-events: none;
          overflow: hidden;
          opacity: 1;
          contain: layout paint;
        }
        .fgl-water {
          position: absolute; inset: -12vh -6vw; z-index: 0;
          opacity: 0;
          /* BLACK water (owner decision), same ink as the koi section's own
             background (#020305) — only a whisper of teal lifts the centre so
             the pads still read as floating rather than pasted on a void */
          background:
            radial-gradient(ellipse 70% 62% at 50% 44%,
              rgba(8, 32, 38, 0.34) 0%,
              rgba(4, 16, 20, 0.16) 48%,
              rgba(2, 5, 8, 0) 100%),
            #020305;
        }
        /* pads rest at their FRAME home; the timeline pushes them out to the
           canopy on arrival and pulls them back here on the part */
        .fgl-cluster {
          position: absolute;
          left: var(--fx);
          top: var(--fy);
          width: min(var(--fsize), 420px);
          aspect-ratio: 1 / 1;
          opacity: 0;
          z-index: 2;
          transform: translate3d(-50%, -50%, 0) rotate(var(--frot));
          transform-origin: 50% 50%;
          will-change: transform, opacity;
          /* seat pads in the water with brightness depth grading (cheap) —
             front pads catch light, back pads recede. No per-pad blur filter:
             it re-rasterizes every scrubbed frame and stalls the scroll. */
          filter: saturate(1.03) brightness(1.0);
        }
        .fgl-cluster.is-front { z-index: 3; filter: saturate(1.05) brightness(1.09); }
        .fgl-cluster.is-back  { z-index: 1; filter: saturate(1.0) brightness(0.88); }
        .fgl-cluster img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
        }
        /* match KoiLotusFrame's wide-screen sizing so the handoff stays exact */
        @media (min-width: 1900px) {
          .fgl-cluster { width: min(calc(var(--fsize) * 1.08), 520px); }
        }
      `}</style>
    </div>
  );
}

export function KoiLotusFrame() {
  return (
    <div className="koi-lotus-frame" aria-hidden="true">
      {LOTUS_PADS.map((pad, index) => (
        <LotusPadSpan
          key={`${pad.side}-${pad.asset}-${index}`}
          pad={pad}
          index={index}
          className={`koi-lotus-cluster is-${pad.side} is-${pad.depth ?? "mid"}`}
        />
      ))}
      <style>{`
        .koi-lotus-frame {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
          overflow: hidden;
          opacity: 0;
          transition: opacity 520ms ease;
          contain: layout paint;
        }
        .home-koi-section.koi-lotus-visible .koi-lotus-frame {
          opacity: 1;
        }
        /* identical geometry to .fgl-cluster's frame home — the crossing pads
           dissolve exactly onto these, so revealing the frame is a pure
           crossfade (no drift, no offset, no size jump) */
        .koi-lotus-cluster {
          position: absolute;
          left: var(--fx);
          top: var(--fy);
          width: min(var(--fsize), 420px);
          aspect-ratio: 1 / 1;
          opacity: 0;
          transform: translate3d(-50%, -50%, 0) rotate(var(--frot));
          transform-origin: 50% 50%;
          transition: opacity 620ms ease;
          filter: saturate(1.03) brightness(1.0);
        }
        .koi-lotus-cluster.is-front { filter: saturate(1.05) brightness(1.09); }
        .koi-lotus-cluster.is-back  { filter: saturate(1.0) brightness(0.88); }
        .home-koi-section.koi-lotus-visible .koi-lotus-cluster {
          opacity: var(--fop);
        }
        .koi-lotus-cluster img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
        }
        @media (min-width: 1900px) {
          .koi-lotus-cluster { width: min(calc(var(--fsize) * 1.08), 520px); }
        }
        @media (max-width: 740px) {
          .koi-lotus-frame { opacity: 0.92; }
          .koi-lotus-cluster { width: calc(var(--fsize) * 1.45); }
          /* phones keep only the outer/middle banks — the small inner pads
             and channel strays crowd a narrow pond */
          .koi-lotus-cluster.is-top,
          .koi-lotus-cluster.is-back { display: none; }
        }
      `}</style>
    </div>
  );
}
