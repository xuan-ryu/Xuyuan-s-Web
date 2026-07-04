// Station visualization: why the product inserts a cheap image-preview layer
// before the expensive video step. The two approaches are laid on the SAME three
// stage columns (start → when it's wrong → the costly step) so the wrong path
// and the right path line up column-for-column and the contrast reads vertically.
// Open on the canvas — no card frame, no dot grid (owner: these info UIs are not
// cards; keep density low, make the correspondence obvious). Decorative content
// is aria-hidden; the root aria-label carries the meaning. Warm-red is NOT
// var(--seal-red); it and the teal are carried by the path labels alone.

const stages = ["The start", "When it's wrong", "The costly step"] as const;

const tracks = [
  {
    tone: "wrong" as const,
    mark: "✗",
    label: "Direct to video",
    steps: [
      { title: "Prompt → Video", body: "Straight to the slow, costly step — no preview." },
      { title: "Wrong composition", body: "Wrong character or angle, found out only after paying." },
      { title: "Regenerate it all", body: "No partial fix — start over, more credits, blind." },
    ],
  },
  {
    tone: "right" as const,
    mark: "✓",
    label: "Image preview first",
    steps: [
      { title: "Prompt → Image", body: "An image in seconds, a fraction of the cost." },
      { title: "Fix at the image layer", body: "Adjust framing and look — fast and cheap." },
      { title: "Video with confidence", body: "Keyframes confirmed; the costly step runs with intent." },
    ],
  },
] as const;

export function VicinoCheckpointViz() {
  return (
    <div
      className="vz-chk"
      role="img"
      aria-label="The two approaches share three stages. Direct to video: prompt straight to the costly step, discover the wrong composition only after paying, then regenerate everything blind. Image preview first: prompt to a cheap image, fix at the image layer, then run the costly video step with confidence."
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.vz-chk {
  /* open on the canvas — no card frame, no dot grid; density stays low */
  display: grid;
  gap: calc(var(--v-gutter, 24px) * 1.4);
}
.vz-chk-intro {
  margin: 0;
  max-width: 60ch;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-body, 18px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}
/* one grid, three stage columns; both paths ride the SAME columns so the
   contrast lines up vertically. A left rail column holds the path labels. */
.vz-chk-grid {
  display: grid;
  grid-template-columns: minmax(150px, 0.7fr) repeat(3, 1fr);
  column-gap: var(--v-gutter, 24px);
  row-gap: clamp(20px, 2.4vw, 30px);
  align-items: start;
}
.vz-chk-colhead {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
}
.vz-chk-colhead.is-spacer {
  border-bottom: 0;
}
/* the path label sits in the rail column, aligned with its row of cells */
.vz-chk-path {
  display: grid;
  gap: 6px;
  align-content: start;
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
  font-size: 12px;
  line-height: 1;
}
.vz-chk-path-title {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(19px, 1.6vw, 23px);
  font-weight: 500;
  line-height: 1.2;
}
.vz-chk-path.is-wrong .vz-chk-path-mark {
  border-color: rgba(224, 122, 90, 0.55);
  color: rgba(224, 122, 90, 0.9);
}
.vz-chk-path.is-wrong .vz-chk-path-title {
  color: rgba(224, 122, 90, 0.9);
}
.vz-chk-path.is-right .vz-chk-path-mark {
  border-color: rgba(139, 214, 217, 0.6);
  color: #8bd6d9;
}
.vz-chk-path.is-right .vz-chk-path-title {
  color: #8bd6d9;
}
/* each cell sits open under its stage column */
.vz-chk-cell {
  display: grid;
  gap: 5px;
  align-content: start;
}
.vz-chk-cell h4 {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-body, 17px);
  font-weight: 500;
  line-height: 1.28;
  color: var(--paper, #f4f1ea);
}
.vz-chk-cell p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 300;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.66);
}
/* design principle — a divider line, not a box */
.vz-chk-footer {
  display: flex;
  gap: 10px;
  padding-top: clamp(14px, 1.6vw, 18px);
  border-top: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
}
.vz-chk-footer strong {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 500;
  color: var(--paper, #f4f1ea);
  white-space: nowrap;
}
.vz-chk-footer p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.66);
}
@media (max-width: 860px) {
  .vz-chk-grid {
    grid-template-columns: 1fr 1fr;
  }
  .vz-chk-colhead { display: none; }
  .vz-chk-path { grid-column: 1 / -1; }
}
@media (max-width: 520px) {
  .vz-chk-grid { grid-template-columns: 1fr; }
}
`,
        }}
      />
      <p className="vz-chk-intro" aria-hidden="true">
        Why not generate video directly? Because inserting a cheaper, faster image
        layer before the expensive step changed everything.
      </p>

      <div className="vz-chk-grid" aria-hidden="true">
        <span className="vz-chk-colhead is-spacer" />
        {stages.map((s) => (
          <span className="vz-chk-colhead" key={s}>
            {s}
          </span>
        ))}

        {tracks.map((track) => (
          <div className="vz-chk-row" key={track.label} style={{ display: "contents" }}>
            <div className={`vz-chk-path is-${track.tone}`}>
              <span className="vz-chk-path-mark">{track.mark}</span>
              <span className="vz-chk-path-title">{track.label}</span>
            </div>
            {track.steps.map((step) => (
              <div className="vz-chk-cell" key={step.title}>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        ))}
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
