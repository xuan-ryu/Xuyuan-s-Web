// Station-02 visualization: per-stage pairing of what the AI accelerates with
// where the user can intervene. Rebuilt as crisp coded UI (the source was a
// raster diagram that blurred when scaled). Static, decorative content is
// aria-hidden; the root aria-label carries the meaning for assistive tech.
//
// Design language matches the rest of the Vicino case page (tokens inherited
// from .vicino-case-page): near-black surfaces, hairline borders, mono/gold
// eyebrows, one restrained accent reserved for elsewhere on the page.

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
      aria-label="Every one of the four generation stages pairs what the AI accelerates with where the user can intervene; neither half is optional."
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.vz-int {
  display: grid;
  gap: 18px;
  padding: 22px clamp(16px, 2vw, 26px) 24px;
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 14px;
  background:
    radial-gradient(120% 140% at 50% -20%, rgba(255, 255, 255, 0.035), transparent 60%),
    rgba(255, 255, 255, 0.015);
}
.vz-int-eyebrow {
  margin: 0;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12px;
  letter-spacing: var(--track-label, 0.14em);
  text-transform: uppercase;
  color: var(--accent-gold, #d9a441);
}
.vz-int-intro {
  margin: 0 auto;
  max-width: 62ch;
  text-align: center;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(14px, 1.15vw, 15px);
  font-weight: 300;
  line-height: 1.55;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
}
.vz-int-legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(16px, 3vw, 32px);
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: 13px;
  font-weight: 300;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
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
  background: rgba(255, 255, 255, 0.55);
}
.vz-int-mark.is-user {
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.4);
}
.vz-int-rows {
  position: relative;
  display: grid;
  gap: clamp(12px, 1.6vw, 18px);
}
.vz-int-rows::before {
  content: "";
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 50%;
  width: 1px;
  transform: translateX(-0.5px);
  background: var(--v-line, rgba(255, 255, 255, 0.1));
  opacity: 0.6;
}
.vz-int-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(12px, 1.6vw, 20px);
}
.vz-int-cell {
  position: relative;
  display: grid;
  gap: 8px;
  align-content: start;
  padding: 16px clamp(38px, 5vw, 44px) 16px 16px;
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.02);
}
.vz-int-cell-mark {
  position: absolute;
  top: 17px;
  right: 16px;
}
.vz-int-cell h4 {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(15px, 1.2vw, 17px);
  font-weight: 500;
  color: var(--paper, #f4f1ea);
}
.vz-int-cell p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
}
.vz-int-footer {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.02);
}
.vz-int-footer-arrow {
  flex: 0 0 auto;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 15px;
  line-height: 1.4;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.4));
}
.vz-int-footer-body {
  display: grid;
  gap: 6px;
}
.vz-int-footer-label {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: 14px;
  font-weight: 500;
  color: var(--paper, #f4f1ea);
}
.vz-int-footer p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: 13px;
  font-weight: 300;
  line-height: 1.55;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
}
@media (max-width: 720px) {
  .vz-int-row {
    grid-template-columns: 1fr;
  }
  .vz-int-rows::before {
    display: none;
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
        {stages.map((stage) => (
          <div className="vz-int-row" key={stage.ai.title}>
            <div className="vz-int-cell is-ai">
              <span className="vz-int-mark is-ai vz-int-cell-mark" />
              <h4>{stage.ai.title}</h4>
              <p>{stage.ai.body}</p>
            </div>
            <div className="vz-int-cell is-user">
              <span className="vz-int-mark is-user vz-int-cell-mark" />
              <h4>{stage.user.title}</h4>
              <p>{stage.user.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="vz-int-footer" aria-hidden="true">
        <span className="vz-int-footer-arrow">{"↳"}</span>
        <div className="vz-int-footer-body">
          <span className="vz-int-footer-label">Design principle</span>
          <p>
            Every step has two halves: what AI can generate, and where users can
            intervene. Neither half is optional. The left column makes starting
            easy; the right column makes quality possible.
          </p>
        </div>
      </div>
    </div>
  );
}
