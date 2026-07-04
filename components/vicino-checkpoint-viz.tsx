// Station visualization: why the product inserts a cheap image-preview layer
// before the expensive video step — redrawn as a pipeline diagram whose
// argument IS the drawing: the cost of being wrong is the SIZE of the redo
// loop. Two lanes share the same node columns. Direct-to-video carries one
// large dashed warm-red return loop from Video all the way back to Prompt;
// image-preview-first carries a tiny self-loop at the Image node, then one
// confident amber connection into Video. Node chips echo the product's dark
// node idiom (dark chip, 1px hairline, typed port dots — out filled, in ring);
// connections are plain lines with no arrowheads (left-to-right plus loop
// shape carry direction). Open on the canvas — no card frame, no dot grid
// (owner: these info UIs are not cards). Decorative content is aria-hidden;
// the root aria-label carries the meaning. Warm-red is NOT var(--seal-red).

export function VicinoCheckpointViz() {
  return (
    <div
      className="vz-chk"
      role="img"
      aria-label="Two node pipelines drawn as a diagram. Direct to video: a Prompt node connects straight to the Video node, and one large dashed return loop runs from Video all the way back to Prompt — when the result is wrong, you regenerate everything at full cost, blind. Image preview first: Prompt connects to a cheap Image node that carries a small tight loop — wrong? fix it there in seconds — then a single confident connection runs the costly video step once, with intent."
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.vz-chk {
  /* open on the canvas — no card frame, no dot grid; density stays low */
  display: grid;
  gap: calc(var(--v-gutter, 24px) * 1.4);
}
/* the artifact's ONE anchor (Density & Anchors rule) — big sentence-case
   caption in the text face; the old body-tone intro promoted */
.vz-chk-anchor {
  margin: 0;
  max-width: 44ch;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(22px, 1.9vw, 28px);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0;
  color: rgba(244, 241, 234, 0.92);
}
.vz-chk-lanes {
  display: grid;
  gap: clamp(48px, 5vw, 64px);
}
/* each lane: a rail label + the diagram; both lanes use the SAME column
   template so Prompt and Video line up vertically across lanes */
.vz-chk-lane {
  display: grid;
  grid-template-columns: minmax(140px, 0.3fr) 1fr;
  column-gap: calc(var(--v-gutter, 24px) * 1.5);
  align-items: start;
}
.vz-chk-path {
  display: grid;
  gap: 6px;
  align-content: start;
  padding-top: 6px;
}
.vz-chk-path-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 999px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: var(--text-micro, 12px);
  line-height: 1;
}
.vz-chk-path-title {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(18px, 1.6vw, 22px);
  font-weight: 500;
  line-height: 1.2;
}
.vz-chk-lane.is-wrong .vz-chk-path-mark {
  border-color: rgba(224, 122, 90, 0.55);
  color: rgba(224, 122, 90, 0.9);
}
.vz-chk-lane.is-wrong .vz-chk-path-title {
  color: rgba(224, 122, 90, 0.9);
}
.vz-chk-lane.is-right .vz-chk-path-mark {
  border-color: rgba(139, 214, 217, 0.6);
  color: #8bd6d9;
}
.vz-chk-lane.is-right .vz-chk-path-title {
  color: #8bd6d9;
}
/* the diagram grid: node / line / node / line / node columns; row 1 holds the
   over-track label, row 2 the nodes + connections, row 3 the redo loops */
.vz-chk-diagram {
  --chk-node-w: clamp(84px, 8vw, 120px);
  display: grid;
  grid-template-columns:
    var(--chk-node-w) minmax(40px, 1fr) var(--chk-node-w) minmax(40px, 1fr)
    var(--chk-node-w);
  grid-template-rows: auto 40px auto;
  min-width: 0;
}
/* node chips — the product's dark node idiom, scaled to a diagram glyph */
.vz-chk-node {
  position: relative;
  grid-row: 2;
  display: grid;
  place-items: center;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: #191919;
  font-family: var(--font-text, var(--font-sans, system-ui));
  /* measured product node type (recreation ladder) */
  font-size: var(--vicino-node-body, 14px);
  font-weight: 500;
  line-height: 1;
  color: #f5f5f7;
}
/* typed port dots — out-port filled, in-port ring (product handle language) */
.vz-chk-port {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 999px;
}
.vz-chk-port.is-out {
  right: 0;
  transform: translate(50%, -50%);
  background: var(--port-c);
}
.vz-chk-port.is-in {
  left: 0;
  transform: translate(-50%, -50%);
  border: 1px solid var(--port-c);
  background: #0a0a0a;
}
.vz-chk-port.is-red { --port-c: rgba(224, 122, 90, 0.9); }
.vz-chk-port.is-teal { --port-c: #8bd6d9; }
.vz-chk-port.is-amber { --port-c: #ffb347; }
/* connections — plain lines, no arrowheads */
.vz-chk-conn {
  grid-row: 2;
  align-self: center;
  height: 2px;
  min-width: 0;
}
.vz-chk-conn.is-red { background: rgba(224, 122, 90, 0.7); }
.vz-chk-conn.is-teal { background: rgba(139, 214, 217, 0.85); }
.vz-chk-conn.is-amber { background: rgba(255, 179, 71, 0.85); }
/* one over-track label — the confident run into Video */
.vz-chk-over {
  grid-row: 1;
  grid-column: 4;
  justify-self: center;
  padding-bottom: 8px;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-label, 14px);
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
  color: rgba(255, 179, 71, 0.92);
}
/* the LARGE redo loop — Video all the way back to Prompt. Its vertical edges
   rise to the node bottoms (node centers = half a node-width inset). */
.vz-chk-loop-big {
  grid-row: 3;
  grid-column: 1 / -1;
  margin: 0 calc(var(--chk-node-w) / 2);
  min-height: clamp(48px, 4vw, 64px);
  border: 1px dashed rgba(224, 122, 90, 0.6);
  border-top: 0;
  border-radius: 0 0 16px 16px;
  display: grid;
  place-items: center;
  padding: 10px 16px;
}
/* the SMALL redo loop — a tight self-fix at the Image node. width:max-content
   lets the one-line label overflow the node column into the empty neighbors */
.vz-chk-under {
  grid-row: 3;
  grid-column: 3;
  justify-self: center;
  width: max-content;
  display: grid;
  justify-items: center;
  gap: 6px;
}
.vz-chk-loop-small {
  display: block;
  width: 48px;
  height: 20px;
  border: 1px dashed rgba(139, 214, 217, 0.7);
  border-top: 0;
  border-radius: 0 0 10px 10px;
}
.vz-chk-loop-label {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-label, 14px);
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
}
.vz-chk-loop-label.is-red { color: rgba(224, 122, 90, 0.92); }
.vz-chk-loop-label.is-teal { color: #8bd6d9; }
/* design principle — a divider line, not a box */
.vz-chk-footer {
  display: flex;
  gap: 10px;
  padding-top: clamp(14px, 1.6vw, 18px);
  border-top: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
}
.vz-chk-footer strong {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 16px);
  font-weight: 500;
  color: var(--paper, #f4f1ea);
  white-space: nowrap;
}
.vz-chk-footer p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 16px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.66);
}
@media (max-width: 809px) {
  .vz-chk-lane {
    grid-template-columns: 1fr;
    row-gap: 18px;
  }
  .vz-chk-path {
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 10px;
    padding-top: 0;
  }
  .vz-chk-diagram {
    --chk-node-w: clamp(72px, 22vw, 96px);
  }
  /* the phone column above the amber line is too narrow for the label —
     let it ride the right half of the track instead */
  .vz-chk-over {
    grid-column: 3 / 6;
    justify-self: end;
    white-space: nowrap;
    padding-bottom: 6px;
  }
  .vz-chk-footer {
    flex-direction: column;
    gap: 4px;
  }
}
/* ── Assembly on arrival ─────────────────────────────────────────────────
   The viz sits in a .vicino-flow-viz[data-fade] wrapper; FadeReveal adds
   .is-visible on enter. The block rises as a whole, then the pipeline draws
   itself lane by lane — nodes drop, connections draw toward their target,
   the redo loops sweep in last (the loop is the argument, so it lands last).
   Motion-only: hidden states live inside prefers-reduced-motion:no-preference
   so reduced motion shows the finished diagram. ── */
@keyframes vzDrop { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes vzDraw { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
@keyframes vzLoop { from { opacity: 0; transform: scaleY(0.4); } to { opacity: 1; transform: scaleY(1); } }
@media (prefers-reduced-motion: no-preference) {
  .vicino-flow-viz .vz-chk-node { opacity: 0; transform: translateY(10px); }
  .vicino-flow-viz .vz-chk-conn { opacity: 0; transform: scaleX(0); transform-origin: left; }
  .vicino-flow-viz .vz-chk-loop-big,
  .vicino-flow-viz .vz-chk-loop-small { opacity: 0; transform: scaleY(0.4); transform-origin: top; }
  .vicino-flow-viz .vz-chk-over,
  .vicino-flow-viz .vz-chk-loop-label,
  .vicino-flow-viz .vz-chk-path { opacity: 0; }
  .vicino-flow-viz .vz-chk-lane:nth-child(2) { --vlane: 440ms; }
  .vicino-flow-viz.is-visible .vz-chk-path {
    animation: vzDrop 0.42s var(--ease-silk, ease) forwards;
    animation-delay: calc(160ms + var(--vlane, 0ms));
  }
  .vicino-flow-viz.is-visible .vz-chk-node {
    animation: vzDrop 0.42s var(--ease-spring, ease) forwards;
    animation-delay: calc(220ms + var(--vlane, 0ms));
  }
  .vicino-flow-viz.is-visible .vz-chk-conn {
    animation: vzDraw 0.4s var(--ease-silk, ease) forwards;
    animation-delay: calc(360ms + var(--vlane, 0ms));
  }
  .vicino-flow-viz.is-visible .vz-chk-loop-big,
  .vicino-flow-viz.is-visible .vz-chk-loop-small {
    animation: vzLoop 0.44s var(--ease-silk, ease) forwards;
    animation-delay: calc(540ms + var(--vlane, 0ms));
  }
  .vicino-flow-viz.is-visible .vz-chk-over,
  .vicino-flow-viz.is-visible .vz-chk-loop-label {
    animation: vzDrop 0.42s var(--ease-silk, ease) forwards;
    animation-delay: calc(620ms + var(--vlane, 0ms));
  }
}
`,
        }}
      />
      <p className="vz-chk-anchor" aria-hidden="true">
        Why not generate video directly? A cheaper, faster image layer before
        the expensive step changed everything.
      </p>

      <div className="vz-chk-lanes" aria-hidden="true">
        <div className="vz-chk-lane is-wrong">
          <div className="vz-chk-path">
            <span className="vz-chk-path-mark">✗</span>
            <span className="vz-chk-path-title">Direct to video</span>
          </div>
          <div className="vz-chk-diagram">
            <span className="vz-chk-node" style={{ gridColumn: "1" }}>
              Prompt
              <i className="vz-chk-port is-out is-red" />
            </span>
            <span className="vz-chk-conn is-red" style={{ gridColumn: "2 / 5" }} />
            <span className="vz-chk-node" style={{ gridColumn: "5" }}>
              Video
              <i className="vz-chk-port is-in is-red" />
            </span>
            <span className="vz-chk-loop-big">
              <span className="vz-chk-loop-label is-red">
                wrong? regenerate everything — full cost, blind
              </span>
            </span>
          </div>
        </div>

        <div className="vz-chk-lane is-right">
          <div className="vz-chk-path">
            <span className="vz-chk-path-mark">✓</span>
            <span className="vz-chk-path-title">Image preview first</span>
          </div>
          <div className="vz-chk-diagram">
            <span className="vz-chk-over">runs once, with intent</span>
            <span className="vz-chk-node" style={{ gridColumn: "1" }}>
              Prompt
              <i className="vz-chk-port is-out is-teal" />
            </span>
            <span className="vz-chk-conn is-teal" style={{ gridColumn: "2" }} />
            <span className="vz-chk-node" style={{ gridColumn: "3" }}>
              Image
              <i className="vz-chk-port is-in is-teal" />
              <i className="vz-chk-port is-out is-amber" />
            </span>
            <span className="vz-chk-conn is-amber" style={{ gridColumn: "4" }} />
            <span className="vz-chk-node" style={{ gridColumn: "5" }}>
              Video
              <i className="vz-chk-port is-in is-amber" />
            </span>
            <span className="vz-chk-under">
              <i className="vz-chk-loop-small" />
              <span className="vz-chk-loop-label is-teal">
                wrong? fix here — seconds
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="vz-chk-footer" aria-hidden="true">
        <strong>Design principle</strong>
        <p>
          Image is not an extra step — it is a lighter, faster middle layer, so
          the expensive step happens with confidence, not as a gamble.
        </p>
      </div>
    </div>
  );
}
