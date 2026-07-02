"use client";

// Lotus arrival — the layer the moon-gate crossing lands on. Once the gate
// has sunk to ink, this layer covers the viewport in lotus leaves; continued
// scroll parts them from the center along per-leaf radial vectors while a
// lotus blossom blooms, and what emerges beneath is the koi pond (the ink
// veil doubles as the water until the real pond has risen behind it).
//
// The leaves borrow the koi pond's own visual language verbatim (see
// drawLilyPads in components/koi-pond.tsx, READ-ONLY reference): the same
// notched-circle silhouette (1 - cos(a/2)^20 * 0.3), the same dual-sine edge
// ripple, the same muted green (170,215,155) fill with lighter (200,240,180)
// radial vein lines that skip the notch. Phase is frozen at 0 — this layer
// has ZERO idle animation; every movement is scroll-scrubbed from
// featured-gate.tsx, so reversing the scroll folds the pond shut again.
//
// The pond has no lotus-flower precedent, so the blossom is designed in the
// same flat-ink register: two rings of pointed-oval petals (6 outer + 4
// inner) in pale pink-white with a hairline midrib, around a muted-gold
// seedpod. All geometry is deterministic (no Math.random at render) so the
// markup is SSR/hydration safe — though in practice featured-gate only
// mounts this layer on desktop, motion-safe contexts.
//
// This component renders geometry only. featured-gate.tsx owns every tween
// (initial rotations, fade-in, parting, bloom) via the FG_LEAVES config
// exported below; index order here matches DOM order.

export type FgLeafCfg = {
  x: number; // center, % of viewport width
  y: number; // center, % of viewport height
  r: number; // radius, vmin (pond pads sized off min(w,h) too)
  rot: number; // resting rotation, deg (turns the notch like the pond's rot)
  alpha: number; // fill opacity — the pond's muted range, denser for cover
  seed: number; // silhouette + vein wobble (pond-style seeds)
  partAng: number; // parting direction, deg (≈ its bearing from center)
  travel: number; // parting distance, fraction of viewport (0.6–1.3)
  drot: number; // extra rotation while drifting out, deg
  order: number; // 0 = center leaf (parts first) … 1 = edge leaf
  inOrder: number; // fade-in stagger 0..1 (scattered, not concentric)
  veins: number; // vein count (bigger pads carry more, like the pond)
};

// ~20 pads laid as three loose rows plus gap fillers so a 1536×830 viewport
// reads fully covered (Σ area ≈ 1.15× viewport; slivers of ink between pads
// are wanted — that's how the pond's own canopy sits on the water).
export const FG_LEAVES: FgLeafCfg[] = [
  // — top row —
  { x: 8, y: 14, r: 17, rot: -28, alpha: 0.36, seed: 27.7, partAng: -140, travel: 0.72, drot: -24, order: 0.85, inOrder: 0.3, veins: 9 },
  { x: 28, y: 10, r: 19, rot: 74, alpha: 0.4, seed: 52.1, partAng: -118, travel: 0.78, drot: 18, order: 0.6, inOrder: 0.75, veins: 9 },
  { x: 50, y: 13, r: 20, rot: -102, alpha: 0.42, seed: 63.4, partAng: -90, travel: 0.82, drot: -20, order: 0.45, inOrder: 0.1, veins: 11 },
  { x: 71, y: 9, r: 18, rot: 12, alpha: 0.38, seed: 41.6, partAng: -62, travel: 0.8, drot: 26, order: 0.65, inOrder: 0.55, veins: 9 },
  { x: 91, y: 15, r: 18, rot: 156, alpha: 0.38, seed: 92.3, partAng: -40, travel: 0.72, drot: -18, order: 0.9, inOrder: 0.4, veins: 9 },
  // — middle row (the big center pad is the first to part) —
  { x: 4, y: 52, r: 18, rot: -64, alpha: 0.38, seed: 11.2, partAng: 178, travel: 0.66, drot: 22, order: 0.7, inOrder: 0.85, veins: 9 },
  { x: 24, y: 46, r: 21, rot: 38, alpha: 0.44, seed: 44.8, partAng: 189, travel: 0.9, drot: -16, order: 0.2, inOrder: 0.5, veins: 11 },
  { x: 46, y: 50, r: 24, rot: -12, alpha: 0.5, seed: 88.6, partAng: 180, travel: 1.15, drot: 20, order: 0, inOrder: 0.2, veins: 11 },
  { x: 68, y: 55, r: 22, rot: 118, alpha: 0.46, seed: 73.2, partAng: 15, travel: 0.95, drot: -22, order: 0.1, inOrder: 0.65, veins: 11 },
  { x: 90, y: 49, r: 19, rot: -88, alpha: 0.4, seed: 18.9, partAng: -2, travel: 0.68, drot: 16, order: 0.75, inOrder: 0.05, veins: 9 },
  // — bottom row —
  { x: 10, y: 88, r: 18, rot: 82, alpha: 0.38, seed: 35.7, partAng: 137, travel: 0.72, drot: -26, order: 0.85, inOrder: 0.9, veins: 9 },
  { x: 31, y: 92, r: 19, rot: -148, alpha: 0.4, seed: 19.1, partAng: 114, travel: 0.78, drot: 18, order: 0.6, inOrder: 0.35, veins: 9 },
  { x: 52, y: 87, r: 21, rot: 8, alpha: 0.44, seed: 37.5, partAng: 88, travel: 0.82, drot: -14, order: 0.4, inOrder: 0.7, veins: 11 },
  { x: 73, y: 91, r: 19, rot: -58, alpha: 0.4, seed: 15.6, partAng: 61, travel: 0.8, drot: 24, order: 0.65, inOrder: 0.15, veins: 9 },
  { x: 93, y: 85, r: 17, rot: 132, alpha: 0.36, seed: 56.4, partAng: 39, travel: 0.68, drot: -20, order: 0.95, inOrder: 0.6, veins: 9 },
  // — gap fillers between the rows —
  { x: 17, y: 68, r: 14, rot: -172, alpha: 0.3, seed: 29.7, partAng: 151, travel: 0.7, drot: 20, order: 0.5, inOrder: 0.45, veins: 7 },
  { x: 60, y: 71, r: 15, rot: 48, alpha: 0.32, seed: 66.1, partAng: 65, travel: 0.85, drot: -18, order: 0.25, inOrder: 0.95, veins: 7 },
  { x: 83, y: 70, r: 14, rot: -96, alpha: 0.3, seed: 77.3, partAng: 31, travel: 0.66, drot: 22, order: 0.7, inOrder: 0.25, veins: 7 },
  { x: 37, y: 28, r: 15, rot: 164, alpha: 0.32, seed: 71.9, partAng: -121, travel: 0.88, drot: -24, order: 0.3, inOrder: 0.8, veins: 7 },
  { x: 62, y: 30, r: 14, rot: -34, alpha: 0.3, seed: 33.3, partAng: -59, travel: 0.85, drot: 18, order: 0.3, inOrder: 0, veins: 7 },
  { x: 86, y: 27, r: 13, rot: 58, alpha: 0.3, seed: 48.4, partAng: -33, travel: 0.7, drot: -18, order: 0.6, inOrder: 0.5, veins: 7 },
  { x: 4, y: 74, r: 13, rot: -118, alpha: 0.3, seed: 58.2, partAng: 153, travel: 0.68, drot: 20, order: 0.8, inOrder: 0.65, veins: 7 },
];

const TWO_PI = Math.PI * 2;

// The pond's pad silhouette (drawLilyPads), phase frozen at 0: a circle with
// a wedge notch at local angle 0 and a soft dual-sine ripple, in a 100-unit
// radius space (max excursion 104.5 → viewBox 106).
function leafOutline(seed: number): string {
  const SEGS = 64;
  let d = "";
  for (let i = 0; i <= SEGS; i++) {
    const a = (i / SEGS) * TWO_PI;
    const notch = 1 - Math.pow(Math.cos(a / 2), 20) * 0.3;
    const ripple =
      1 + Math.sin(a * 4 + seed) * 0.03 + Math.sin(a * 7 + seed * 1.5) * 0.015;
    const r = 100 * ripple * notch;
    d += `${i === 0 ? "M" : "L"}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  }
  return d + "Z";
}

// The pond's vein fan: quadratic curves from the pad center to 0.83 of the
// rim, skipping ±0.42rad around the notch, control points wobbled by seed.
function leafVeins(seed: number, count: number): string {
  const skip = 0.42;
  const span = TWO_PI - skip * 2;
  let d = "";
  for (let v = 0; v < count; v++) {
    const va = skip + ((v + 0.5) / count) * span;
    const vNotch = 1 - Math.pow(Math.cos(va / 2), 20) * 0.3;
    const vRipple =
      1 +
      Math.sin(va * 4 + seed) * 0.03 +
      Math.sin(va * 7 + seed * 1.5) * 0.015;
    const edgeR = 100 * vRipple * vNotch * 0.83;
    const cpA = va + Math.sin(v * 1.7 + seed) * 0.07;
    d += `M0 0Q${(Math.cos(cpA) * edgeR * 0.48).toFixed(1)} ${(Math.sin(cpA) * edgeR * 0.48).toFixed(1)} ${(Math.cos(va) * edgeR).toFixed(1)} ${(Math.sin(va) * edgeR).toFixed(1)}`;
  }
  return d;
}

const LEAF_PATHS = FG_LEAVES.map((c) => ({
  outline: leafOutline(c.seed),
  veins: leafVeins(c.seed, c.veins),
}));

// ── the blossom ──────────────────────────────────────────────────────────
// Top-down mandala lotus, matching the top-down pond. Each petal is drawn
// UNROTATED (base at the flower center, tip pointing up) inside a static
// <g transform="rotate(fanAngle)"> — featured-gate then blooms the petal
// group itself with plain scale/rotation about its bbox base
// (transformOrigin "50% 100%"), which is exactly the flower center. No
// svgOrigin involved: its global-coordinate math displaced petals when the
// viewBox had a negative min (learned the hard way).

// Pointed-oval petal pointing up from the origin.
function petalPath(len: number, w: number): string {
  const p: [number, number][] = [
    [0, 0],
    [-w * 0.78, -len * 0.1],
    [-w * 1.16, -len * 0.34],
    [-w, -len * 0.56],
    [-w * 0.78, -len * 0.82],
    [-w * 0.3, -len * 0.94],
    [0, -len],
    [w * 0.3, -len * 0.94],
    [w * 0.78, -len * 0.82],
    [w, -len * 0.56],
    [w * 1.16, -len * 0.34],
    [w * 0.78, -len * 0.1],
    [0, 0],
  ];
  const f = (pt: [number, number]) => `${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`;
  return (
    `M${f(p[0])}` +
    `C${f(p[1])} ${f(p[2])} ${f(p[3])}` +
    `C${f(p[4])} ${f(p[5])} ${f(p[6])}` +
    `C${f(p[7])} ${f(p[8])} ${f(p[9])}` +
    `C${f(p[10])} ${f(p[11])} ${f(p[12])}Z`
  );
}

// A single hairline midrib — the petal's answer to the pads' vein lines.
function petalRib(len: number): string {
  return `M0 ${(-len * 0.1).toFixed(1)}Q1.4 ${(-len * 0.42).toFixed(1)} 0 ${(-len * 0.72).toFixed(1)}`;
}

// 5 + 5 rings on a shared five-fold symmetry (inner offset half a step) —
// denser and more lotus-like than mixed symmetries, which read clematis.
// Slight per-petal jitter in angle/length/width keeps it off clip-art.
const OUTER_PETALS = [
  { ang: 0, len: 52, w: 13 },
  { ang: 70, len: 50, w: 12.4 },
  { ang: 144, len: 53, w: 13.4 },
  { ang: 217, len: 51, w: 12.6 },
  { ang: 288, len: 49, w: 12.9 },
];
const INNER_PETALS = [
  { ang: 36, len: 34, w: 11.4 },
  { ang: 109, len: 32, w: 10.8 },
  { ang: 180, len: 35, w: 11.7 },
  { ang: 252, len: 33, w: 11 },
  { ang: 325, len: 34, w: 11.2 },
];
const POD_DOTS = [18, 90, 162, 234, 306].map((a) => {
  const t = (a * Math.PI) / 180;
  return { cx: +(Math.cos(t) * 3.4).toFixed(2), cy: +(Math.sin(t) * 3.4).toFixed(2) };
});

export function FgLotusLayer() {
  return (
    <div className="fgl-layer" aria-hidden="true">
      {FG_LEAVES.map((c, i) => (
        <div
          key={i}
          className="fgl-leaf"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `${c.r * 2}vmin`,
            height: `${c.r * 2}vmin`,
          }}
        >
          <svg viewBox="-106 -106 212 212">
            <path
              d={LEAF_PATHS[i].outline}
              fill="rgb(170,215,155)"
              fillOpacity={c.alpha}
            />
            <path
              d={LEAF_PATHS[i].veins}
              fill="none"
              stroke="rgb(200,240,180)"
              strokeOpacity={c.alpha * 0.55}
              strokeWidth={0.7}
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}

      <div className="fgl-lotus">
        <svg viewBox="-60 -60 120 120">
          {OUTER_PETALS.map((p) => (
            <g key={`o${p.ang}`} transform={`rotate(${p.ang})`}>
              <g className="fgl-petal fgl-petal-o">
                <path d={petalPath(p.len, p.w)} fill="#f3e2de" fillOpacity={0.9} />
                <path
                  d={petalRib(p.len)}
                  fill="none"
                  stroke="rgba(151,109,105,0.4)"
                  strokeWidth={0.6}
                  strokeLinecap="round"
                />
              </g>
            </g>
          ))}
          {INNER_PETALS.map((p) => (
            <g key={`i${p.ang}`} transform={`rotate(${p.ang})`}>
              <g className="fgl-petal fgl-petal-i">
                <path d={petalPath(p.len, p.w)} fill="#faf0ec" fillOpacity={0.95} />
                <path
                  d={petalRib(p.len)}
                  fill="none"
                  stroke="rgba(158,116,112,0.32)"
                  strokeWidth={0.55}
                  strokeLinecap="round"
                />
              </g>
            </g>
          ))}
          <g className="fgl-heart">
            <circle r={6.8} fill="#d9b36a" fillOpacity={0.95} />
            <circle r={6.8} fill="none" stroke="rgba(10,10,10,0.32)" strokeWidth={0.7} />
            {POD_DOTS.map((d, k) => (
              <circle key={k} cx={d.cx} cy={d.cy} r={1.05} fill="rgba(96,70,26,0.6)" />
            ))}
            <circle r={1.05} fill="rgba(96,70,26,0.6)" />
          </g>
        </svg>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .fgl-layer {
          position: absolute; inset: 0; z-index: 3;
          /* the whole arrival is scenery: never intercept the gate link or
             the pond beneath (the section handles its own pe handoff) */
          pointer-events: none;
        }
        .fgl-leaf {
          position: absolute;
          opacity: 0; /* featured-gate's scrubbed timeline fades pads in */
          will-change: transform, opacity;
        }
        .fgl-leaf svg, .fgl-lotus svg {
          display: block; width: 100%; height: 100%; overflow: visible;
        }
        .fgl-lotus {
          position: absolute; left: 50%; top: 50%;
          width: 34vmin; height: 34vmin;
          opacity: 0;
          will-change: transform, opacity;
        }
      `,
        }}
      />
    </div>
  );
}
