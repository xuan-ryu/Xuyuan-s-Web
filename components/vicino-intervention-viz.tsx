// Station-02 visualization: per-stage pairing of what the AI accelerates with
// where the user can intervene. Rebuilt as a STAGE SPINE — four numbered stage
// rows threaded on a single vertical connector, each row splitting into an AI
// half (filled dot) and a User half (outlined square) so the two read as two
// halves of one stage. Static, decorative content is aria-hidden; the root
// aria-label carries the meaning for assistive tech.
//
// Design language matches the rest of the Vicino case page (tokens inherited
// from .vicino-case-page): near-black surfaces, hairline borders, mono/gold
// eyebrows, one restrained accent reserved for a single moment.

const stages = [
  {
    ai: {
      title: "Script generation",
      body: "AI expands a sentence into a multi-scene script, or splits an uploaded screenplay into scenes automatically.",
    },
    user: {
      title: "Edit, rewrite, restructure",
      body: "User reviews every scene. Can rewrite descriptions, merge or split scenes, adjust durations, add or remove scenes entirely.",
    },
  },
  {
    ai: {
      title: "Storyboard generation",
      body: "AI generates rough visual frames for each scene. Auto mode creates all at once; manual mode lets users prompt each frame individually.",
    },
    user: {
      title: "Swap, regenerate, refine",
      body: "Each frame can be individually replaced, regenerated, or exported to an Image node for deeper editing — then connected back.",
    },
  },
  {
    ai: {
      title: "Shot & keyframe generation",
      body: "AI generates high-fidelity keyframe images based on shot specifications. Produces first frame, last frame, or key moments.",
    },
    user: {
      title: "Define every shot",
      body: "User specifies camera movement, angle, lighting, transition, and timing per shot. Subdivides scenes freely. Full cinematographic control.",
    },
  },
  {
    ai: {
      title: "Video generation",
      body: "AI generates video clips from confirmed keyframes. Can produce segments individually or stitch a full sequence automatically.",
    },
    user: {
      title: "Review, reshoot, re-edit",
      body: "User can view segments individually, regenerate a single clip without touching others, adjust in the video editor, or go back to any earlier step.",
    },
  },
] as const;

export function VicinoInterventionViz() {
  return (
    <div
      className="vz-int"
      role="img"
      aria-label="Four generation stages run down a single spine; each stage pairs what the AI accelerates (a filled marker) with where the user can intervene (an outlined marker), and neither half is optional."
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.vz-int {
  --vz-rail: clamp(48px, 5vw, 58px);
  /* rhythm rides the station's gutter — rows 1.5 gutters apart, the rail tie
     half a gutter, the AI/User pair split by one gutter (skill: Density &
     Anchors — density stays LOW) */
  --vz-row-gap: calc(var(--v-gutter, 24px) * 1.5);
  --vz-row-colgap: calc(var(--v-gutter, 24px) / 2);
  --vz-pair-gap: var(--v-gutter, 24px);
  --vz-node-center: 30px;
  display: grid;
  gap: calc(var(--v-gutter, 24px) * 1.5);
  padding: clamp(32px, 3.2vw, 52px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  /* a piece of the product's Work Space: near-black canvas + faint dot grid;
     panels above it are frosted glass */
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.065) 1px, transparent 1.4px) 0 0 / 26px 26px,
    #0a0a0c;
}
.vz-int-eyebrow {
  margin: 0;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: var(--text-label, 13px);
  letter-spacing: var(--track-label, 0.14em);
  text-transform: uppercase;
  color: var(--accent-gold, #d9a441);
}
.vz-int-intro {
  margin: 0 auto;
  max-width: 58ch;
  text-align: center;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-body, 17px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}
.vz-int-legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(16px, 3vw, 32px);
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.72);
}
.vz-int-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}
.vz-int-mark {
  flex: 0 0 auto;
  display: inline-block;
  width: 9px;
  height: 9px;
}
.vz-int-mark.is-ai {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
}
.vz-int-mark.is-user {
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.45);
}
.vz-int-rows {
  display: grid;
  gap: var(--vz-row-gap);
}
.vz-int-row {
  display: grid;
  grid-template-columns: var(--vz-rail) 1fr;
  column-gap: var(--vz-row-colgap);
  align-items: stretch;
}
.vz-int-rail {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 14px;
}
/* the spine: a segment from this node down to the next node */
.vz-int-rail::before {
  content: "";
  position: absolute;
  left: 50%;
  top: var(--vz-node-center);
  bottom: calc(-1 * (var(--vz-row-gap) + var(--vz-node-center)));
  width: 1px;
  transform: translateX(-0.5px);
  background: var(--v-line, rgba(255, 255, 255, 0.1));
  z-index: 0;
}
.vz-int-row:last-child .vz-int-rail::before {
  display: none;
}
/* short tie from the node out to the paired cells */
.vz-int-rail::after {
  content: "";
  position: absolute;
  left: 50%;
  top: var(--vz-node-center);
  width: calc(var(--vz-rail) / 2 + var(--vz-row-colgap));
  height: 1px;
  transform: translateY(-0.5px);
  background: var(--v-line, rgba(255, 255, 255, 0.1));
  z-index: 0;
}
.vz-int-node {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  padding: 0 4px;
  background: var(--ink-950, #08080a);
  /* the stage numerals are this block's anchors — big condensed wayfinding
     down the spine (the cell titles stay the readable titles) */
  font-family: var(--font-condensed, "Saira Condensed", system-ui, sans-serif);
  font-size: clamp(26px, 2.2vw, 32px);
  font-weight: 300;
  line-height: 1;
  letter-spacing: var(--track-display, -0.05em);
  color: var(--accent-gold, #d9a441);
}
.vz-int-pair {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--vz-pair-gap);
  align-items: stretch;
}
/* connecting tick: the two halves meet across the gap */
.vz-int-pair::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--vz-pair-gap);
  height: 1px;
  transform: translate(-50%, -50%);
  background: var(--v-line, rgba(255, 255, 255, 0.1));
}
.vz-int-cell {
  display: grid;
  gap: 9px;
  align-content: start;
  padding: 18px 20px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  /* frosted glass over the dot grid — the product's panel material */
  background: rgba(32, 32, 36, 0.55);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  backdrop-filter: blur(10px) saturate(120%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 10px 28px -18px rgba(0, 0, 0, 0.6);
}
.vz-int-head {
  display: flex;
  align-items: center;
  gap: 9px;
}
.vz-int-cell h4 {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-body, 17px);
  font-weight: 500;
  line-height: 1.3;
  color: var(--paper, #f4f1ea);
}
.vz-int-cell p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}
.vz-int-footer {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 6px;
  padding: 16px 18px 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  background: rgba(32, 32, 36, 0.55);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  backdrop-filter: blur(10px) saturate(120%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}
.vz-int-footer-label {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: var(--text-label, 13px);
  letter-spacing: var(--track-label, 0.14em);
  text-transform: uppercase;
  color: var(--accent-gold, #d9a441);
}
.vz-int-footer p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}
@media (max-width: 980px) {
  .vz-int-pair {
    grid-template-columns: 1fr;
    gap: var(--vz-row-colgap);
  }
  .vz-int-pair::before {
    display: none;
  }
}
@media (max-width: 720px) {
  .vz-int {
    --vz-rail: 46px;
    --vz-row-gap: 18px;
    gap: 18px;
    padding: 18px 14px 20px;
  }
  .vz-int-cell {
    padding: 14px 15px;
  }
}
@media (prefers-reduced-motion: no-preference) {
  .vz-int-row {
    animation: vz-int-rise 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) both;
  }
  .vz-int-row:nth-child(1) {
    animation-delay: 0.04s;
  }
  .vz-int-row:nth-child(2) {
    animation-delay: 0.12s;
  }
  .vz-int-row:nth-child(3) {
    animation-delay: 0.2s;
  }
  .vz-int-row:nth-child(4) {
    animation-delay: 0.28s;
  }
}
@keyframes vz-int-rise {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
`,
        }}
      />
      <p className="vz-int-eyebrow" aria-hidden="true">
        Human control &middot; Agent support
      </p>
      <p className="vz-int-intro" aria-hidden="true">
        A smart workflow reduces friction without taking away control. At every
        stage, users can inspect, revise, and redirect — the system accelerates
        the start, not the judgment.
      </p>
      <div className="vz-int-legend" aria-hidden="true">
        <span className="vz-int-legend-item">
          <span className="vz-int-mark is-ai" />
          AI accelerates
        </span>
        <span className="vz-int-legend-item">
          <span className="vz-int-mark is-user" />
          User intervenes
        </span>
      </div>
      <div className="vz-int-rows" aria-hidden="true">
        {stages.map((stage, i) => (
          <div className="vz-int-row" key={stage.ai.title}>
            <div className="vz-int-rail">
              <span className="vz-int-node">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="vz-int-pair">
              <div className="vz-int-cell is-ai">
                <div className="vz-int-head">
                  <span className="vz-int-mark is-ai" />
                  <h4>{stage.ai.title}</h4>
                </div>
                <p>{stage.ai.body}</p>
              </div>
              <div className="vz-int-cell is-user">
                <div className="vz-int-head">
                  <span className="vz-int-mark is-user" />
                  <h4>{stage.user.title}</h4>
                </div>
                <p>{stage.user.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="vz-int-footer" aria-hidden="true">
        <span className="vz-int-footer-label">Design principle</span>
        <p>
          Every step has two halves: what AI can generate, and where users can
          intervene. Neither half is optional. The left column makes starting
          easy; the right column makes quality possible.
        </p>
      </div>
    </div>
  );
}
