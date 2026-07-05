// Station visualization: every generation stage has two halves — what the AI
// accelerates and where the user steps in — redrawn as a dual-lane stage
// timeline. One horizontal track of four stage nodes (gold condensed numerals,
// the page's voice) is connected by segments colored by what flows between
// stages, matching the product's shipped connection types used elsewhere on
// this page: text pink into Storyboard, image teal into Shot, video amber into
// Video. The AI lane hangs above the track (filled dot mark), the You lane
// below (outlined square mark), each phrase on a short stem from its node.
// On phone the track rotates vertical along a left rail. Open on the canvas —
// no card frame, no dot grid (owner: these info UIs are not cards). Decorative
// content is aria-hidden; the root aria-label carries the meaning.

import type { CSSProperties } from "react";

const stages = [
  {
    n: "01",
    stage: "Script",
    ai: "Expands a sentence into a multi-scene script.",
    you: "Rewrite, merge, split, or re-time any scene.",
    segIn: "transparent",
    segOut: "#F1A0FA",
  },
  {
    n: "02",
    stage: "Storyboard",
    ai: "Rough frames per scene — auto, or one by one.",
    you: "Swap, regenerate, or open in an Image node.",
    segIn: "#F1A0FA",
    segOut: "#6EDDB3",
  },
  {
    n: "03",
    stage: "Shot & keyframe",
    ai: "High-fidelity keyframes from shot specs.",
    you: "Set camera, angle, lighting, and timing per shot.",
    segIn: "#6EDDB3",
    segOut: "#FFB347",
  },
  {
    n: "04",
    stage: "Video",
    ai: "Clips from confirmed keyframes, or a full stitch.",
    you: "Reshoot one clip, re-edit, or step back a stage.",
    segIn: "#FFB347",
    segOut: "transparent",
  },
] as const;

export function VicinoInterventionViz() {
  return (
    <div
      className="vz-int"
      role="img"
      aria-label="A four-stage timeline: 01 Script, 02 Storyboard, 03 Shot and keyframe, 04 Video — connected by what flows between the stages: text, then images, then video. Above each stage, what the AI accelerates: expanding a sentence into a multi-scene script, rough frames per scene, high-fidelity keyframes from shot specs, clips from confirmed keyframes. Below each stage, where you step in: rewrite or re-time scenes, swap or regenerate frames, set camera and timing per shot, reshoot a clip or step back a stage. Neither lane is optional."
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.vz-int {
  /* open on the canvas — no card frame, no dot grid; density stays low */
  display: grid;
  gap: calc(var(--v-gutter, 24px) * 1.4);
}
/* the artifact's ONE anchor (Density & Anchors rule) — big sentence-case
   caption in the text face; the old body-tone intro promoted */
.vz-int-anchor {
  margin: 0;
  max-width: 44ch;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(22px, 1.9vw, 28px);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0;
  color: rgba(244, 241, 234, 0.92);
}
/* one legend row replaces the old column headers */
.vz-int-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
}
.vz-int-key {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: var(--text-micro, 12px);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}
.vz-int-mark {
  flex: 0 0 auto;
  display: block;
  width: 8px;
  height: 8px;
}
.vz-int-mark.is-ai {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
}
.vz-int-mark.is-user {
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}
/* the chart: four stage columns; rows are AI phrase / stem / track / stem /
   You phrase. Column gap stays 0 so track segments join edge to edge. */
.vz-int-chart {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto 32px 48px 32px auto;
}
.vz-int-stage {
  display: contents;
}
.vz-int-stage > * {
  grid-column: var(--col);
  min-width: 0;
}
.vz-int-phrase {
  margin: 0;
  padding: 0 10px;
  justify-self: center;
  max-width: 26ch;
  text-align: center;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 16px);
  font-weight: 300;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.78);
}
.vz-int-phrase.is-ai {
  grid-row: 1;
  align-self: end;
}
.vz-int-phrase.is-you {
  grid-row: 5;
  align-self: start;
}
/* stems: a short vertical line from the node, ending in the lane mark */
.vz-int-stem {
  justify-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.vz-int-stem.is-up {
  grid-row: 2;
  padding-top: 8px;
}
.vz-int-stem.is-dn {
  grid-row: 4;
  padding-bottom: 8px;
}
.vz-int-stem-line {
  flex: 1 1 auto;
  width: 1px;
  background: var(--v-line, rgba(255, 255, 255, 0.1));
}
/* the track row: half-segments meet at column edges, colored by what flows */
.vz-int-node {
  grid-row: 3;
  display: flex;
  align-items: center;
  height: 48px;
}
.vz-int-seg {
  flex: 1 1 auto;
  height: 2px;
}
.vz-int-seg.is-in { background: var(--seg-in); }
.vz-int-seg.is-out { background: var(--seg-out); }
.vz-int-core {
  flex: 0 0 auto;
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 0 12px;
}
.vz-int-core em {
  font-style: normal;
  font-family: var(--font-condensed, "Saira Condensed", system-ui, sans-serif);
  font-size: clamp(24px, 2vw, 30px);
  font-weight: 300;
  line-height: 1;
  color: var(--accent-gold, #d9a441);
}
.vz-int-core span {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 16px);
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  color: var(--paper, #f4f1ea);
}
/* design principle — a divider line, not a box */
.vz-int-footer {
  display: flex;
  gap: 10px;
  padding-top: clamp(14px, 1.6vw, 18px);
  border-top: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
}
.vz-int-footer strong {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 16px);
  font-weight: 500;
  color: var(--paper, #f4f1ea);
  white-space: nowrap;
}
.vz-int-footer p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 16px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}
/* tablet: keep the track horizontal, tighten the node cores */
@media (max-width: 1079px) and (min-width: 810px) {
  .vz-int-core { gap: 8px; padding: 0 8px; }
  .vz-int-core em { font-size: 24px; }
  .vz-int-core span { font-size: var(--text-label, 14px); }
  .vz-int-phrase { font-size: var(--text-label, 14px); padding: 0 8px; }
}
/* phone: the track rotates vertical along a left rail; phrases stack right
   of each node with their lane marks inline */
@media (max-width: 809px) {
  .vz-int-chart {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    row-gap: 40px;
  }
  .vz-int-stage {
    display: grid;
    position: relative;
    grid-template-columns: 1fr;
    row-gap: 10px;
    padding-left: 26px;
  }
  .vz-int-stage > * {
    grid-column: auto;
    grid-row: auto;
  }
  /* outrank the desktop two-class row pins so auto-placement (node first
     via order) actually runs on phone */
  .vz-int-phrase.is-ai,
  .vz-int-phrase.is-you {
    grid-row: auto;
    align-self: auto;
  }
  /* stage dot on the rail + the rail segment down to the next stage */
  .vz-int-stage::after {
    content: "";
    position: absolute;
    left: 1px;
    top: 12px;
    width: 8px;
    height: 8px;
    transform: translateX(-50%);
    border-radius: 999px;
    background: var(--accent-gold, #d9a441);
  }
  .vz-int-stage::before {
    content: "";
    position: absolute;
    left: 0;
    top: 20px;
    bottom: -52px;
    width: 2px;
    background: var(--seg-out);
  }
  .vz-int-stage:last-child::before {
    display: none;
  }
  .vz-int-stem { display: none; }
  .vz-int-seg { display: none; }
  .vz-int-node {
    order: -1;
    height: auto;
  }
  .vz-int-core { padding: 0; }
  .vz-int-core span { white-space: normal; }
  .vz-int-phrase {
    position: relative;
    justify-self: start;
    max-width: 44ch;
    padding: 0 0 0 18px;
    text-align: left;
  }
  .vz-int-phrase::before {
    content: "";
    position: absolute;
    left: 0;
    top: 6px;
    width: 8px;
    height: 8px;
  }
  .vz-int-phrase.is-ai::before {
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.7);
  }
  .vz-int-phrase.is-you::before {
    border-radius: 2px;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  .vz-int-footer {
    flex-direction: column;
    gap: 4px;
  }
}
/* ── Assembly on arrival ─────────────────────────────────────────────────
   The viz sits in a .vicino-flow-viz[data-fade] wrapper; FadeReveal adds
   .is-visible on enter. The block rises, then the timeline builds stage by
   stage left to right: each stage core drops, its track segments draw, the
   AI/You stems grow out, the phrases settle. Column index (--col, already
   set per stage) drives the left-to-right stagger. Motion-only, so reduced
   motion shows the finished timeline. ── */
@keyframes vziDrop { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes vziDraw { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
@keyframes vziGrow { from { opacity: 0; transform: scaleY(0); } to { opacity: 1; transform: scaleY(1); } }
@media (prefers-reduced-motion: no-preference) {
  .vicino-flow-viz .vz-int-core { opacity: 0; transform: translateY(8px); }
  .vicino-flow-viz .vz-int-seg { opacity: 0; transform: scaleX(0); transform-origin: left; }
  .vicino-flow-viz .vz-int-stem-line { transform: scaleY(0); }
  .vicino-flow-viz .vz-int-stem.is-up .vz-int-stem-line { transform-origin: bottom; }
  .vicino-flow-viz .vz-int-stem.is-dn .vz-int-stem-line { transform-origin: top; }
  .vicino-flow-viz .vz-int-mark { opacity: 0; }
  .vicino-flow-viz .vz-int-phrase { opacity: 0; transform: translateY(6px); }
  /* per-stage timings slowed ~1.4x from the first pass (read too fast) */
  .vicino-flow-viz.is-visible .vz-int-core {
    animation: vziDrop 0.58s var(--ease-spring, ease) forwards;
    animation-delay: calc(300ms + (var(--col, 1) - 1) * 210ms);
  }
  .vicino-flow-viz.is-visible .vz-int-seg {
    animation: vziDraw 0.48s var(--ease-silk, ease) forwards;
    animation-delay: calc(400ms + (var(--col, 1) - 1) * 210ms);
  }
  .vicino-flow-viz.is-visible .vz-int-stem-line {
    animation: vziGrow 0.42s var(--ease-silk, ease) forwards;
    animation-delay: calc(460ms + (var(--col, 1) - 1) * 210ms);
  }
  .vicino-flow-viz.is-visible .vz-int-mark {
    animation: vziDrop 0.42s var(--ease-silk, ease) forwards;
    animation-delay: calc(560ms + (var(--col, 1) - 1) * 210ms);
  }
  .vicino-flow-viz.is-visible .vz-int-phrase {
    animation: vziDrop 0.58s var(--ease-silk, ease) forwards;
    animation-delay: calc(540ms + (var(--col, 1) - 1) * 210ms);
  }
}
`,
        }}
      />
      <p className="vz-int-anchor" aria-hidden="true">
        A smart workflow accelerates the start — never the judgment.
      </p>

      <div className="vz-int-legend" aria-hidden="true">
        <span className="vz-int-key">
          <i className="vz-int-mark is-ai" />
          AI accelerates
        </span>
        <span className="vz-int-key">
          <i className="vz-int-mark is-user" />
          Where you step in
        </span>
      </div>

      <div className="vz-int-chart" aria-hidden="true">
        {stages.map((s, i) => (
          <div
            className="vz-int-stage"
            key={s.n}
            style={
              {
                "--col": String(i + 1),
                "--seg-in": s.segIn,
                "--seg-out": s.segOut,
              } as CSSProperties
            }
          >
            <p className="vz-int-phrase is-ai">{s.ai}</p>
            <span className="vz-int-stem is-up">
              <i className="vz-int-mark is-ai" />
              <i className="vz-int-stem-line" />
            </span>
            <div className="vz-int-node">
              <i className="vz-int-seg is-in" />
              <span className="vz-int-core">
                <em>{s.n}</em>
                <span>{s.stage}</span>
              </span>
              <i className="vz-int-seg is-out" />
            </div>
            <span className="vz-int-stem is-dn">
              <i className="vz-int-stem-line" />
              <i className="vz-int-mark is-user" />
            </span>
            <p className="vz-int-phrase is-you">{s.you}</p>
          </div>
        ))}
      </div>

      <div className="vz-int-footer" aria-hidden="true">
        <strong>Design principle</strong>
        <p>
          Every stage has two halves — what AI generates, and where you step in.
          Neither is optional: one makes starting easy, the other makes quality
          possible.
        </p>
      </div>
    </div>
  );
}
