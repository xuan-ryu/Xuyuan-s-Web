"use client";

import type { CSSProperties } from "react";

// "XUYUAN LIU" in Saira Condensed ExtraLight, letter-spacing -10%, glyph
// outlines via opentype.js. Each cell is a CLIPPED box (nested <svg>) holding
// the letter twice — the live one and a copy one cell to the right — so on hover
// the letter can slide out to the left and the copy slides in from the right,
// all inside the box (nothing flies out). The box also serves as the hover hit
// target. -10% tracking makes adjacent cells overlap slightly.
const TOP = 29.2;
const H = 73.6;
const VIEWBOX = `0.20 ${TOP} 331.30 ${H}`;
const CELLS: { d: string; x: number; w: number }[] = [
  { x: 0, w: 48.1, d: "M46 100L40.800 100L24.300 69.800L23.700 69.800L7.200 100L2.200 100L21.200 65.400L2.400 31.200L7.600 31.200L23.900 61.100L24.400 61.100L40.700 31.200L45.800 31.200L27 65.300" },
  { x: 38.1, w: 51.9, d: "M78.200 31.200L82.800 31.200L82.800 70.500Q82.800 83.700 81.650 89.700Q80.500 95.700 76.650 98.250Q72.800 100.800 64.100 100.800Q55.400 100.800 51.500 98.250Q47.600 95.700 46.450 89.700Q45.300 83.700 45.300 70.500L45.300 31.200L49.900 31.200L49.900 73.600Q49.900 83.900 50.750 88.400Q51.600 92.900 54.500 94.750Q57.400 96.600 64.100 96.600Q70.800 96.600 73.700 94.750Q76.600 92.900 77.400 88.400Q78.200 83.900 78.200 73.600" },
  { x: 80, w: 42.5, d: "M103.500 100L98.900 100L98.900 72.300L80.500 31.200L85.500 31.200L101 66.500L101.600 66.500L117.200 31.200L121.900 31.200L103.500 72.300" },
  { x: 112.5, w: 51.9, d: "M152.600 31.200L157.200 31.200L157.200 70.500Q157.200 83.700 156.050 89.700Q154.900 95.700 151.050 98.250Q147.200 100.800 138.500 100.800Q129.800 100.800 125.900 98.250Q122 95.700 120.850 89.700Q119.700 83.700 119.700 70.500L119.700 31.200L124.300 31.200L124.300 73.600Q124.300 83.900 125.150 88.400Q126 92.900 128.900 94.750Q131.800 96.600 138.500 96.600Q145.200 96.600 148.100 94.750Q151 92.900 151.800 88.400Q152.600 83.900 152.600 73.600" },
  { x: 154.4, w: 49.4, d: "M201.300 100L196.600 100L190.600 78.800L167.400 78.800L161.500 100L156.800 100L176.400 31.200L181.800 31.200L201.300 100M189.400 74.600L179.200 38.300L178.700 38.300L168.500 74.600" },
  { x: 193.8, w: 53.3, d: "M239.200 100L234.300 100L206.500 41.500L206.100 41.500L206.100 100L201.700 100L201.700 31.200L206.700 31.200L234.400 89.500L234.800 89.500L234.800 31.200L239.200 31.200" },
  { x: 246, w: 37.9, d: "M282.500 100L253.800 100L253.800 31.200L258.500 31.200L258.500 95.800L282.500 95.800" },
  { x: 273.9, w: 20.9, d: "M286.700 100L282.100 100L282.100 31.200L286.700 31.200" },
  { x: 284.8, w: 51.9, d: "M324.900 31.200L329.500 31.200L329.500 70.500Q329.500 83.700 328.350 89.700Q327.200 95.700 323.350 98.250Q319.500 100.800 310.800 100.800Q302.100 100.800 298.200 98.250Q294.300 95.700 293.150 89.700Q292 83.700 292 70.500L292 31.200L296.600 31.200L296.600 73.600Q296.600 83.900 297.450 88.400Q298.300 92.900 301.200 94.750Q304.100 96.600 310.800 96.600Q317.500 96.600 320.400 94.750Q323.300 92.900 324.100 88.400Q324.900 83.900 324.900 73.600" },
];

// Sequence: the name draws stroke-by-stroke (staggered), fills, then the stroke
// fades for a clean smooth glyph; once it lands PORTFOLIO slides up from behind
// it. On hover each letter slides out left while its copy slides in from the
// right — clipped to the letter's box. White colours; the parent layer's
// difference blend makes them black on the white day scene, white at night.
export function Wordmark({ style }: { style?: CSSProperties }) {
  return (
    <div className="wm-stack" style={style}>
      <div className="wm-portfolio-mask">
        <div className="wm-portfolio">PORTFOLIO</div>
      </div>
      <svg
        className="wm-draw"
        viewBox={VIEWBOX}
        role="img"
        aria-label="Xuyuan Liu"
        fill="none"
      >
        {CELLS.map((c, i) => {
          // hit box tiles up to the NEXT letter's start (non-overlapping) so the
          // tight -10% tracking doesn't make one hover trigger two letters
          const hitW = i < CELLS.length - 1 ? CELLS[i + 1].x - c.x : c.w;
          return (
            <svg
              className="wm-cell"
              key={i}
              x={c.x}
              y={TOP}
              width={c.w}
              height={H}
              viewBox={`${c.x} ${TOP} ${c.w} ${H}`}
              overflow="hidden"
              style={
                { ["--i" as string]: i, ["--cw" as string]: c.w } as CSSProperties
              }
            >
              <g className="wm-roll">
                <path className="wm-letter" d={c.d} pathLength={1} />
                <path
                  className="wm-letter wm-dup"
                  d={c.d}
                  pathLength={1}
                  transform={`translate(${c.w} 0)`}
                />
              </g>
              <rect
                className="wm-hit"
                x={c.x}
                y={TOP}
                width={hitW}
                height={H}
                fill="transparent"
              />
            </svg>
          );
        })}
      </svg>
      <style>{`
        .wm-stack {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          line-height: 1;
          gap: 0.02em;        /* space between PORTFOLIO and the name */
        }
        /* PORTFOLIO — slides up out of the name once the name has drawn. The
           mask needs vertical room or it clips the caps / round bottoms; the
           negative margin pulls the name back up so the two stay tight. */
        .wm-portfolio-mask {
          overflow: hidden;
          padding: 0.12em 0.05em 0.05em;
        }
        .wm-portfolio {
          font-family: var(--font-condensed);
          font-weight: 200;
          font-size: 0.59em;            /* 288 / 488 ≈ 0.59 of the name */
          letter-spacing: -0.05em;       /* top line -5% */
          color: #fff;
          white-space: nowrap;
          transform: translateY(130%);
          will-change: transform;
        }
        .scene-loaded .wm-portfolio {
          animation: wmSlideUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards 2.6s;
        }
        @keyframes wmSlideUp { to { transform: translateY(0); } }

        /* the name */
        .wm-draw { display: block; width: 100%; height: auto; overflow: visible; }
        .wm-cell { overflow: hidden; }
        .wm-letter {
          fill: #fff;
          fill-opacity: 0;
          stroke: #fff;
          stroke-width: 0.9;
          stroke-opacity: 1;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          pointer-events: none;          /* the hit rect handles hover */
        }
        .wm-hit { pointer-events: all; cursor: pointer; }
        .wm-faded .wm-hit { pointer-events: none; }

        .scene-loaded .wm-letter {
          animation:
            wmDraw 0.6s cubic-bezier(0.65, 0, 0.35, 1) forwards
              calc(var(--i) * 0.13s + 0.2s),
            wmFill 0.5s ease forwards calc(var(--i) * 0.13s + 0.7s),
            wmStrokeOut 0.4s ease forwards calc(var(--i) * 0.13s + 1.2s);
        }
        /* the copy never needs to draw — keep it filled/ready off to the right */
        .wm-dup { stroke-dashoffset: 0; }
        @keyframes wmDraw { to { stroke-dashoffset: 0; } }
        @keyframes wmFill { to { fill-opacity: 1; } }
        @keyframes wmStrokeOut { to { stroke-opacity: 0; } }

        /* per-letter hover — ONE-SHOT on hover-in: the live glyph slides one
           cell-width to the LEFT (clipped by the box) while the copy slides into
           place from the right. Plays once per hover, then holds the copy. */
        .wm-roll { transform: translateX(0); }
        .wm-cell:hover .wm-roll {
          animation: wmSlide 0.5s cubic-bezier(0.5, 0, 0.18, 1) forwards;
        }
        @keyframes wmSlide {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(var(--cw) * -1px)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .wm-letter { stroke-dashoffset: 0; fill-opacity: 1; stroke-opacity: 0; }
          .wm-dup { fill-opacity: 1; }
          .wm-portfolio { transform: none; }
          .scene-loaded .wm-letter, .scene-loaded .wm-portfolio { animation: none; }
          .wm-roll, .wm-cell:hover .wm-roll { transition: none; }
        }
      `}</style>
    </div>
  );
}
