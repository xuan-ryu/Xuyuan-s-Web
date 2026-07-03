// Chapter 1-2 visualization: the same creative depth of a traditional film
// crew, reorganized into a four-step path a single person can navigate (and
// loop back through). Rebuilt as crisp coded UI — the source was a raster
// diagram that blurred when scaled. Decorative content is aria-hidden; the
// root aria-label carries the meaning for assistive tech.
//
// Design language matches the rest of the Vicino case page (tokens inherited
// from .vicino-case-page): near-black surfaces, hairline borders, mono/gold
// eyebrow, one restrained amber accent reserved for the Vicino path.

const traditionalSteps = [
  "Screenwriter",
  "Storyboard artist",
  "Director",
  "Cinematographer",
  "Editor",
  "Colorist / VFX",
] as const;

const vicinoSteps = [
  { title: "Script", note: "Organize intent" },
  { title: "Storyboard", note: "Shape pacing" },
  { title: "Image", note: "Refine keyframes" },
  { title: "Video", note: "Final generation" },
] as const;

export function VicinoPipelineViz() {
  return (
    <div
      className="vz-pipe"
      role="img"
      aria-label="Traditional production splits work across six specialists; Vicino reorganizes the same creative depth into a four-step path one person can navigate and revisit."
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.vz-pipe {
  display: grid;
  gap: 20px;
  padding: 22px clamp(16px, 2vw, 26px) 22px;
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 14px;
  background:
    radial-gradient(120% 140% at 50% -20%, rgba(255, 255, 255, 0.035), transparent 60%),
    rgba(255, 255, 255, 0.015);
}
.vz-pipe-eyebrow {
  margin: 0;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12px;
  letter-spacing: var(--track-label, 0.14em);
  text-transform: uppercase;
  color: var(--accent-gold, #d9a441);
}
.vz-pipe-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(16px, 3vw, 44px);
  align-items: start;
}
.vz-pipe-col {
  display: grid;
  gap: 14px;
  align-content: start;
}
.vz-pipe-head {
  display: grid;
  gap: 3px;
}
.vz-pipe-sublabel {
  margin: 0;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12px;
  letter-spacing: var(--track-label, 0.14em);
  text-transform: uppercase;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
}
.vz-pipe-col.is-vicino .vz-pipe-sublabel {
  color: var(--accent-amber, #e0902f);
}
.vz-pipe-faint {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: 13px;
  font-weight: 300;
  color: color-mix(in srgb, var(--v-body-ink, rgba(255, 255, 255, 0.62)) 62%, transparent);
}
.vz-pipe-body {
  display: flex;
  align-items: stretch;
  gap: 10px;
}
.vz-pipe-stack {
  flex: 1 1 auto;
  display: grid;
  gap: 6px;
  min-width: 0;
}
.vz-pipe-item {
  display: grid;
  gap: 6px;
}
.vz-pipe-cell {
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  padding: 14px 16px;
  text-align: center;
}
.vz-pipe-cell.is-plain {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(14px, 1.15vw, 15px);
  font-weight: 400;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
}
.vz-pipe-cell.is-step {
  display: grid;
  gap: 3px;
  border-color: rgba(255, 255, 255, 0.14);
  border-left: 2px solid color-mix(in srgb, var(--accent-amber, #e0902f) 70%, transparent);
  background: rgba(255, 255, 255, 0.03);
}
.vz-pipe-cell-title {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(15px, 1.2vw, 17px);
  font-weight: 600;
  color: var(--paper, #f4f1ea);
}
.vz-pipe-cell-note {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: 13px;
  font-weight: 300;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
}
.vz-pipe-arrow {
  justify-self: center;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 14px;
  line-height: 1;
  color: color-mix(in srgb, var(--v-body-ink, rgba(255, 255, 255, 0.62)) 70%, transparent);
}
/* the loop-back rail — the Vicino path can revisit any earlier step */
.vz-pipe-revisit {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-left: 2px;
}
.vz-pipe-revisit-arrow {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 13px;
  line-height: 1;
  color: color-mix(in srgb, var(--accent-amber, #e0902f) 80%, transparent);
}
.vz-pipe-revisit-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: var(--track-label, 0.14em);
  text-transform: uppercase;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
}
.vz-pipe-caption {
  margin: 0;
  text-align: center;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(13px, 1.1vw, 14px);
  font-weight: 300;
  line-height: 1.55;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
}
@media (max-width: 720px) {
  .vz-pipe-cols {
    grid-template-columns: 1fr;
    gap: 26px;
  }
}
`,
        }}
      />
      <p className="vz-pipe-eyebrow" aria-hidden="true">
        Same depth, reorganized
      </p>
      <div className="vz-pipe-cols" aria-hidden="true">
        <div className="vz-pipe-col is-traditional">
          <div className="vz-pipe-head">
            <p className="vz-pipe-sublabel">Traditional production</p>
            <p className="vz-pipe-faint">one specialist per step</p>
          </div>
          <div className="vz-pipe-body">
            <div className="vz-pipe-stack">
              {traditionalSteps.map((step, i) => (
                <div className="vz-pipe-item" key={step}>
                  <div className="vz-pipe-cell is-plain">{step}</div>
                  {i < traditionalSteps.length - 1 && (
                    <span className="vz-pipe-arrow">&darr;</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="vz-pipe-col is-vicino">
          <div className="vz-pipe-head">
            <p className="vz-pipe-sublabel">In Vicino</p>
            <p className="vz-pipe-faint">one person, flexible path</p>
          </div>
          <div className="vz-pipe-body">
            <div className="vz-pipe-stack">
              {vicinoSteps.map((step, i) => (
                <div className="vz-pipe-item" key={step.title}>
                  <div className="vz-pipe-cell is-step">
                    <span className="vz-pipe-cell-title">{step.title}</span>
                    <span className="vz-pipe-cell-note">{step.note}</span>
                  </div>
                  {i < vicinoSteps.length - 1 && (
                    <span className="vz-pipe-arrow">&darr;</span>
                  )}
                </div>
              ))}
            </div>
            <div className="vz-pipe-revisit">
              <span className="vz-pipe-revisit-arrow">&uarr;</span>
              <span className="vz-pipe-revisit-text">Revisit</span>
            </div>
          </div>
        </div>
      </div>
      <p className="vz-pipe-caption" aria-hidden="true">
        Same creative depth &mdash; reorganized so one person can navigate it.
      </p>
    </div>
  );
}
