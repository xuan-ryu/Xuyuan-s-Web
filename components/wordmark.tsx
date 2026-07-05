"use client";

import type { CSSProperties } from "react";
import { stripCssComments } from "@/lib/css-sanitize";

// Saira Condensed ExtraLight, -10% tracking, glyph outlines (opentype.js). The
// name is two lines — XUYUAN / LIU — each line a self-contained SVG so the
// letters draw and hover individually. PORTFOLIO sits below (last O in red).
const TOP = 29.2;
const H = 73.6;

type Cell = { d: string; x: number; w: number };

const XUYUAN: { vbX: number; vbW: number; cells: Cell[] } = {
  vbX: 0.3,
  vbW: 240.8,
  cells: [
    { x: 0, w: 48.1, d: "M45.700 100L41.600 100L24.200 69.100L23.700 69.100L6.300 100L2.300 100L21.800 65.400L2.600 31.200L6.700 31.200L23.900 61.800L24.400 61.800L41.500 31.200L45.500 31.200L26.300 65.300" },
    { x: 38.1, w: 52.1, d: "M79.100 31.200L82.700 31.200L82.700 70.600Q82.700 83.800 81.600 89.800Q80.500 95.800 76.650 98.300Q72.800 100.800 64.200 100.800Q55.500 100.800 51.700 98.300Q47.900 95.800 46.750 89.800Q45.600 83.800 45.600 70.600L45.600 31.200L49.200 31.200L49.200 73.600Q49.200 84.200 50.050 88.850Q50.900 93.500 54 95.450Q57.100 97.400 64.200 97.400Q71.300 97.400 74.350 95.450Q77.400 93.500 78.250 88.850Q79.100 84.200 79.100 73.600" },
    { x: 80.2, w: 42.2, d: "M103 100L99.400 100L99.400 71.900L80.900 31.200L84.800 31.200L101.100 67.100L101.600 67.100L117.900 31.200L121.700 31.200L103 71.900" },
    { x: 112.4, w: 52.1, d: "M153.400 31.200L157 31.200L157 70.600Q157 83.800 155.900 89.800Q154.800 95.800 150.950 98.300Q147.100 100.800 138.500 100.800Q129.800 100.800 126 98.300Q122.200 95.800 121.050 89.800Q119.900 83.800 119.900 70.600L119.900 31.200L123.500 31.200L123.500 73.600Q123.500 84.200 124.350 88.850Q125.200 93.500 128.300 95.450Q131.400 97.400 138.500 97.400Q145.600 97.400 148.650 95.450Q151.700 93.500 152.550 88.850Q153.400 84.200 153.400 73.600" },
    { x: 154.5, w: 49.4, d: "M201.200 100L197.400 100L191.100 78.100L167.100 78.100L160.800 100L157.200 100L177.200 31.200L181.100 31.200L201.200 100M190.100 74.700L179.400 37.600L178.900 37.600L168.100 74.700" },
    { x: 193.9, w: 53.4, d: "M239.100 100L235.100 100L205.900 39.600L205.500 39.600L205.500 100L202 100L202 31.200L206.100 31.200L235.200 91.600L235.600 91.600L235.600 31.200L239.100 31.200" },
  ],
};

const LIU: { vbX: number; vbW: number; cells: Cell[] } = {
  vbX: 6.1,
  vbW: 79,
  cells: [
    { x: 0, w: 37.9, d: "M36.400 100L8.100 100L8.100 31.200L11.800 31.200L11.800 96.600L36.400 96.600" },
    { x: 27.9, w: 20.6, d: "M40 100L36.400 100L36.400 31.200L40 31.200" },
    { x: 38.5, w: 52.1, d: "M79.500 31.200L83.100 31.200L83.100 70.600Q83.100 83.800 82 89.800Q80.900 95.800 77.050 98.300Q73.200 100.800 64.600 100.800Q55.900 100.800 52.100 98.300Q48.300 95.800 47.150 89.800Q46 83.800 46 70.600L46 31.200L49.600 31.200L49.600 73.600Q49.600 84.200 50.450 88.850Q51.300 93.500 54.400 95.450Q57.500 97.400 64.600 97.400Q71.700 97.400 74.750 95.450Q77.800 93.500 78.650 88.850Q79.500 84.200 79.500 73.600" },
  ],
};

function NameLine({
  line,
  base,
}: {
  line: { vbX: number; vbW: number; cells: Cell[] };
  base: number;
}) {
  return (
    <svg
      className="wm-draw"
      viewBox={`${line.vbX} ${TOP} ${line.vbW} ${H}`}
      fill="none"
      aria-hidden="true"
    >
      {line.cells.map((c, i) => {
        const hitW =
          i < line.cells.length - 1 ? line.cells[i + 1].x - c.x : c.w;
        return (
          <g
            className="wm-cell"
            key={i}
            style={{ ["--i" as string]: base + i } as CSSProperties}
          >
            <path className="wm-letter" d={c.d} />
            <rect
              className="wm-hit"
              x={c.x}
              y={TOP}
              width={hitW}
              height={H}
              fill="transparent"
            />
          </g>
        );
      })}
    </svg>
  );
}

// Entrance: each letter wipes in left→right (its mostly-vertical strokes appear
// one by one), staggered across both lines; then PORTFOLIO slides up. On hover a
// letter slides out left (clipped) while its copy slides in from the right. Ink
// colour is driven by --wm-ink (black by day, white at night); the final O of
// PORTFOLIO is the cinnabar accent.
export function Wordmark({ style }: { style?: CSSProperties }) {
  return (
    <div className="wm-stack" style={style}>
      <NameLine line={XUYUAN} base={0} />
      <NameLine line={LIU} base={6} />
      <div className="wm-portfolio-mask">
        <div className="wm-portfolio">
          PORTFOLI<span className="wm-o">O</span>
        </div>
      </div>
      <style>{stripCssComments(`
        .wm-stack {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          line-height: 1;
          gap: 0.015em;
        }
        .wm-draw {
          display: block;
          height: 0.736em;   /* glyph height (73.6/100) — equal across lines */
          width: auto;
          overflow: visible;
        }

        .wm-letter {
          fill: var(--wm-ink, #161616);
          stroke: none;
          pointer-events: none;
          clip-path: inset(-10% 100% -10% -10%);   /* hidden, wiped open L→R */
          transition: fill 0.3s ease;
        }
        .wm-hit { pointer-events: all; cursor: pointer; }
        .wm-faded .wm-hit { pointer-events: none; }

        .scene-loaded .wm-letter {
          animation: wmWipe 0.55s cubic-bezier(0.5, 0, 0.2, 1) forwards
            calc(var(--i) * 0.1s + 0.2s);
        }
        @keyframes wmWipe { to { clip-path: inset(-10% -10% -10% -10%); } }

        /* per-letter hover — the thin glyph simply tints to the cinnabar accent
           (the heavy slide didn't suit the hairline weight) */
        .wm-cell:hover .wm-letter { fill: var(--seal-red); }

        /* PORTFOLIO — slides up out of the name once it lands */
        .wm-portfolio-mask {
          overflow: hidden;
          padding: 0.12em 0.05em 0.05em;
          margin-top: -0.1em;
        }
        .wm-portfolio {
          font-family: var(--font-condensed);
          font-weight: 100;
          font-size: 0.5em;
          letter-spacing: -0.05em;
          color: var(--wm-ink, #161616);
          white-space: nowrap;
          transform: translateY(130%);
          will-change: transform;
        }
        .wm-o { color: var(--seal-red); }
        .scene-loaded .wm-portfolio {
          animation: wmSlideUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards 1.7s;
        }
        @keyframes wmSlideUp { to { transform: translateY(0); } }

        @media (prefers-reduced-motion: reduce) {
          .wm-letter { clip-path: inset(-10% -10% -10% -10%); }
          .wm-portfolio { transform: none; }
          .scene-loaded .wm-letter, .scene-loaded .wm-portfolio { animation: none; }
        }
      `)}</style>
    </div>
  );
}
