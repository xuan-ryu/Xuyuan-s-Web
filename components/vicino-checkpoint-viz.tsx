// Station visualization: why the product inserts a cheap image-preview layer
// before the expensive video step. A "wrong vs right" comparison rebuilt as
// crisp coded UI (the source was a raster diagram that blurred when scaled).
// Decorative content is aria-hidden; the root aria-label carries the meaning.
//
// Design language matches the rest of the Vicino case page (tokens inherited
// from .vicino-case-page): near-black surfaces, hairline borders, mono/gold
// eyebrows, one restrained accent per moment. The single warm-red highlight is
// deliberately NOT var(--seal-red) — that accent is reserved elsewhere.

const wrongSteps = [
  {
    title: "Prompt → Video",
    body:
      "User writes a prompt and immediately generates a video. Slow, expensive, no preview of what the content will look like.",
    tint: false,
  },
  {
    title: "Wrong composition?",
    body:
      "Wrong character, wrong angle, wrong scene — user only finds out after waiting and paying.",
    tint: true,
  },
  {
    title: "Regenerate entire video",
    body:
      "No way to fix just the part that's wrong. Start over, spend more credits, wait again. Blind iteration.",
    tint: true,
  },
] as const;

const rightSteps = [
  {
    title: "Prompt → Image",
    body:
      "Generate an image in seconds. Costs a fraction of video. See the composition, character, and scene before committing.",
  },
  {
    title: "Fix at the image layer",
    body:
      "Wrong framing? Wrong look? Adjust and regenerate — fast and cheap. Most problems are content problems, not motion problems.",
  },
  {
    title: "Video with confidence",
    body:
      "Keyframes already confirmed. The expensive step happens with intention. Only duration, movement, and bounce are decided here.",
  },
] as const;

export function VicinoCheckpointViz() {
  return (
    <div
      className="vz-chk"
      role="img"
      aria-label="Generating video directly means paying for the expensive step before knowing if the content is right; inserting a cheap image-preview layer lets users confirm composition first, so the expensive step happens with confidence."
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.vz-chk {
  display: grid;
  gap: 18px;
  padding: 22px clamp(16px, 2vw, 26px) 24px;
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 14px;
  background:
    radial-gradient(120% 140% at 50% -20%, rgba(255, 255, 255, 0.035), transparent 60%),
    rgba(255, 255, 255, 0.015);
}
.vz-chk-eyebrow {
  margin: 0;
  text-align: center;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12px;
  letter-spacing: var(--track-label, 0.14em);
  text-transform: uppercase;
  color: var(--accent-gold, #d9a441);
}
.vz-chk-intro {
  margin: 0 auto;
  max-width: 62ch;
  text-align: center;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(14px, 1.15vw, 15px);
  font-weight: 300;
  line-height: 1.55;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
}
.vz-chk-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(12px, 1.6vw, 20px);
}
.vz-chk-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: clamp(14px, 1.4vw, 18px);
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.012);
}
.vz-chk-col-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.vz-chk-badge {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 999px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  line-height: 1;
}
.vz-chk-badge.is-x {
  border-color: rgba(224, 122, 90, 0.5);
  color: rgba(224, 122, 90, 0.9);
}
.vz-chk-badge.is-check {
  border-color: #8bd6d9;
  color: #8bd6d9;
}
.vz-chk-col-title {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(14px, 1.1vw, 16px);
  font-weight: 500;
  color: var(--paper, #f4f1ea);
}
.vz-chk-col.is-wrong .vz-chk-col-title {
  color: rgba(224, 122, 90, 0.9);
}
.vz-chk-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.vz-chk-step {
  display: contents;
}
.vz-chk-arrow {
  text-align: center;
  font-size: 14px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.3);
}
.vz-chk-cell {
  display: grid;
  gap: 6px;
  padding: clamp(13px, 1.2vw, 16px);
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
}
.vz-chk-cell.is-tint {
  border-color: rgba(224, 122, 90, 0.18);
  background: rgba(224, 122, 90, 0.05);
}
.vz-chk-cell h4 {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(14px, 1.05vw, 16px);
  font-weight: 500;
  color: var(--paper, #f4f1ea);
}
.vz-chk-cell.is-tint h4 {
  color: rgba(224, 122, 90, 0.9);
}
.vz-chk-cell p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
}
.vz-chk-footer {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: clamp(14px, 1.4vw, 18px);
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.012);
}
.vz-chk-corner {
  flex: 0 0 auto;
  margin-top: 1px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 14px;
  line-height: 1.4;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.5));
}
.vz-chk-footer-body {
  display: grid;
  gap: 6px;
}
.vz-chk-footer-title {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(14px, 1.05vw, 15px);
  font-weight: 500;
  color: var(--paper, #f4f1ea);
}
.vz-chk-footer-body p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: 14px;
  font-weight: 300;
  line-height: 1.55;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
}
@media (max-width: 720px) {
  .vz-chk-cols {
    grid-template-columns: 1fr;
  }
}
`,
        }}
      />
      <p className="vz-chk-eyebrow" aria-hidden="true">
        AI Limits · Product Logic
      </p>
      <p className="vz-chk-intro" aria-hidden="true">
        Why not generate video directly? Because inserting a cheaper, faster
        image layer before the expensive step changed everything.
      </p>
      <div className="vz-chk-cols" aria-hidden="true">
        <div className="vz-chk-col is-wrong">
          <div className="vz-chk-col-head">
            <span className="vz-chk-badge is-x">✗</span>
            <span className="vz-chk-col-title">Direct to video</span>
          </div>
          <div className="vz-chk-steps">
            {wrongSteps.map((step, i) => (
              <div className="vz-chk-step" key={step.title}>
                {i > 0 && <span className="vz-chk-arrow">↓</span>}
                <div className={`vz-chk-cell${step.tint ? " is-tint" : ""}`}>
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="vz-chk-col is-right">
          <div className="vz-chk-col-head">
            <span className="vz-chk-badge is-check">✓</span>
            <span className="vz-chk-col-title">Image preview first</span>
          </div>
          <div className="vz-chk-steps">
            {rightSteps.map((step, i) => (
              <div className="vz-chk-step" key={step.title}>
                {i > 0 && <span className="vz-chk-arrow">↓</span>}
                <div className="vz-chk-cell">
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="vz-chk-footer" aria-hidden="true">
        <span className="vz-chk-corner">↳</span>
        <div className="vz-chk-footer-body">
          <h4 className="vz-chk-footer-title">Design principle</h4>
          <p>
            Image is not an extra step — it is a lighter, faster, more
            controllable middle layer. The expensive step should happen with
            confidence, not as a gamble.
          </p>
        </div>
      </div>
    </div>
  );
}
