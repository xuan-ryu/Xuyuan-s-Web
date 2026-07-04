// Station visualization: every generation stage has two halves — what the AI
// accelerates, and where the user steps in. Laid as a table: one row per stage,
// two aligned columns (AI | You) so each stage's two halves read side by side
// and the correspondence is obvious. Open on the canvas — no card frame, no dot
// grid (owner: these info UIs are not cards; keep density low). Decorative
// content is aria-hidden; the root aria-label carries the meaning.

const stages = [
  {
    n: "01",
    stage: "Script",
    ai: "Expands a sentence into a multi-scene script.",
    user: "Rewrite, merge, split, or re-time any scene.",
  },
  {
    n: "02",
    stage: "Storyboard",
    ai: "Rough frames per scene — auto, or one by one.",
    user: "Swap, regenerate, or open a frame in an Image node.",
  },
  {
    n: "03",
    stage: "Shot & keyframe",
    ai: "High-fidelity keyframes from shot specs.",
    user: "Set camera, angle, lighting, and timing per shot.",
  },
  {
    n: "04",
    stage: "Video",
    ai: "Clips from confirmed keyframes, or a full stitch.",
    user: "Reshoot one clip, re-edit, or step back a stage.",
  },
] as const;

export function VicinoInterventionViz() {
  return (
    <div
      className="vz-int"
      role="img"
      aria-label="Every generation stage has two halves. Script: AI expands a sentence into a multi-scene script; you rewrite, merge, split, or re-time. Storyboard: AI generates rough frames; you swap, regenerate, or open one in an Image node. Shot and keyframe: AI generates keyframes from specs; you set camera, angle, lighting, and timing. Video: AI generates clips from keyframes; you reshoot one, re-edit, or step back. Neither half is optional."
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.vz-int {
  /* open on the canvas — no card frame, no dot grid; density stays low */
  display: grid;
  gap: calc(var(--v-gutter, 24px) * 1.4);
}
.vz-int-intro {
  margin: 0;
  max-width: 60ch;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-body, 18px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}
/* one grid: a stage rail + the two halves as aligned columns */
.vz-int-grid {
  display: grid;
  grid-template-columns: minmax(140px, 0.6fr) 1fr 1fr;
  column-gap: var(--v-gutter, 24px);
  row-gap: clamp(18px, 2.2vw, 26px);
  align-items: start;
}
.vz-int-colhead {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
}
.vz-int-colhead.is-spacer {
  border-bottom: 0;
}
.vz-int-mark {
  flex: 0 0 auto;
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
/* the stage label anchors each row */
.vz-int-stage-label {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.vz-int-stage-label em {
  font-style: normal;
  font-family: var(--font-condensed, "Saira Condensed", system-ui, sans-serif);
  font-size: clamp(24px, 2vw, 30px);
  font-weight: 300;
  line-height: 1;
  color: var(--accent-gold, #d9a441);
}
.vz-int-stage-label span {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-body, 17px);
  font-weight: 500;
  line-height: 1.2;
  color: var(--paper, #f4f1ea);
}
.vz-int-cell {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 300;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
  align-self: center;
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
  font-size: var(--text-meta, 15px);
  font-weight: 500;
  color: var(--paper, #f4f1ea);
  white-space: nowrap;
}
.vz-int-footer p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}
@media (max-width: 860px) {
  .vz-int-grid {
    grid-template-columns: 1fr 1fr;
    row-gap: 22px;
  }
  .vz-int-colhead.is-spacer { display: none; }
  .vz-int-colhead:not(.is-spacer):first-of-type { display: none; }
  .vz-int-stage-label { grid-column: 1 / -1; }
}
@media (max-width: 520px) {
  .vz-int-grid { grid-template-columns: 1fr; }
  .vz-int-colhead { display: none; }
}
`,
        }}
      />
      <p className="vz-int-intro" aria-hidden="true">
        A smart workflow reduces friction without taking away control — it
        accelerates the start, never the judgment.
      </p>

      <div className="vz-int-grid" aria-hidden="true">
        <span className="vz-int-colhead is-spacer" />
        <span className="vz-int-colhead">
          <span className="vz-int-mark is-ai" />
          AI accelerates
        </span>
        <span className="vz-int-colhead">
          <span className="vz-int-mark is-user" />
          Where you step in
        </span>

        {stages.map((s) => (
          <div key={s.n} style={{ display: "contents" }}>
            <div className="vz-int-stage-label">
              <em>{s.n}</em>
              <span>{s.stage}</span>
            </div>
            <p className="vz-int-cell">{s.ai}</p>
            <p className="vz-int-cell">{s.user}</p>
          </div>
        ))}
      </div>

      <div className="vz-int-footer" aria-hidden="true">
        <strong>Design principle</strong>
        <p>
          Every stage has two halves — what AI generates, and where you step in.
          Neither is optional: the left makes starting easy, the right makes
          quality possible.
        </p>
      </div>
    </div>
  );
}
