// Station visualization: why the product inserts a cheap image-preview layer
// before the expensive video step. Rebuilt as two horizontal PIPELINE tracks
// (a "wrong path" and a "right path") that read left→right, so the comparison
// scans as flow rather than a stack of nested boxes. The source was a raster
// diagram that blurred when scaled; this is crisp coded UI.
// Decorative content is aria-hidden; the root aria-label carries the meaning.
//
// Design language matches the rest of the Vicino case page (tokens inherited
// from .vicino-case-page): near-black surfaces, hairline borders, mono/gold
// eyebrows. Verdict is carried by the track heads alone (✗ warm-red /
// ✓ teal condensed titles) plus a faint warm tint on the failing cells —
// no single-edge color bars (owner rule: that pattern reads generic-AI).
// The warm-red is deliberately NOT var(--seal-red).

const tracks = [
  {
    tone: "wrong" as const,
    mark: "✗",
    label: "Direct to video",
    steps: [
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
    ],
  },
  {
    tone: "right" as const,
    mark: "✓",
    label: "Image preview first",
    steps: [
      {
        title: "Prompt → Image",
        body:
          "Generate an image in seconds. Costs a fraction of video. See the composition, character, and scene before committing.",
        tint: false,
      },
      {
        title: "Fix at the image layer",
        body:
          "Wrong framing? Wrong look? Adjust and regenerate — fast and cheap. Most problems are content problems, not motion problems.",
        tint: false,
      },
      {
        title: "Video with confidence",
        body:
          "Keyframes already confirmed. The expensive step happens with intention. Only duration, movement, and bounce are decided here.",
        tint: false,
      },
    ],
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
  gap: var(--v-gutter, 24px);
  padding: var(--v-gutter, 24px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  /* a piece of the product's Work Space: near-black canvas + faint dot grid;
     panels above it are frosted glass */
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.065) 1px, transparent 1.4px) 0 0 / 26px 26px,
    #0a0a0c;
}
.vz-chk-head {
  display: grid;
  gap: 10px;
  justify-items: center;
  text-align: center;
}
.vz-chk-eyebrow {
  margin: 0;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: var(--text-label, 13px);
  letter-spacing: var(--track-label, 0.14em);
  text-transform: uppercase;
  color: var(--accent-gold, #d9a441);
}
.vz-chk-intro {
  margin: 0;
  max-width: 56ch;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-body, 17px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}

/* --- one track = header + a left→right flow of cells --- */
.vz-chk-track {
  display: grid;
  gap: 14px;
}
.vz-chk-track-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.vz-chk-badge {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 999px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12px;
  line-height: 1;
}
/* track heads speak in the family's condensed display voice */
.vz-chk-track-title {
  font-family: var(--font-condensed, "Saira Condensed", system-ui, sans-serif);
  font-size: clamp(21px, 1.9vw, 27px);
  font-weight: 300;
  line-height: 1.05;
  letter-spacing: var(--track-display, -0.05em);
  text-transform: uppercase;
}
.vz-chk-track.is-wrong .vz-chk-badge {
  border-color: rgba(224, 122, 90, 0.55);
  color: rgba(224, 122, 90, 0.9);
}
.vz-chk-track.is-wrong .vz-chk-track-title {
  color: rgba(224, 122, 90, 0.9);
}
.vz-chk-track.is-right .vz-chk-badge {
  border-color: rgba(139, 214, 217, 0.6);
  color: #8bd6d9;
}
.vz-chk-track.is-right .vz-chk-track-title {
  color: #8bd6d9;
}

.vz-chk-flow {
  display: flex;
  align-items: stretch;
  /* cells resolve to three equal fields; the connector occupies the gutter */
  gap: calc(var(--v-gutter, 24px) / 2);
}
.vz-chk-conn {
  flex: 0 0 auto;
  align-self: center;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 17px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.32);
}
.vz-chk-conn::before {
  content: "→";
}

.vz-chk-cell {
  flex: 1 1 0;
  min-width: 0;
  display: grid;
  gap: 7px;
  align-content: start;
  padding: 16px 18px;
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
.vz-chk-track.is-wrong .vz-chk-cell.is-tint {
  background: color-mix(in srgb, rgba(224, 122, 90, 1) 7%, rgba(32, 32, 36, 0.55));
}
.vz-chk-idx {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.14em;
}
.vz-chk-track.is-wrong .vz-chk-idx {
  color: rgba(224, 122, 90, 0.7);
}
.vz-chk-track.is-right .vz-chk-idx {
  color: rgba(139, 214, 217, 0.75);
}
.vz-chk-cell h4 {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-body, 17px);
  font-weight: 500;
  line-height: 1.3;
  color: var(--paper, #f4f1ea);
}
.vz-chk-cell p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}

/* --- design-principle footer: a divider, not another box --- */
.vz-chk-footer {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-top: clamp(16px, 1.8vw, 20px);
  border-top: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
}
.vz-chk-corner {
  flex: 0 0 auto;
  margin-top: 1px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 15px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.5);
}
.vz-chk-footer-body {
  display: grid;
  gap: 6px;
}
.vz-chk-footer-title {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 500;
  color: var(--paper, #f4f1ea);
}
.vz-chk-footer-body p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}

@media (prefers-reduced-motion: no-preference) {
  .vz-chk-conn::before {
    display: inline-block;
    animation: vz-chk-flow 2.6s ease-in-out infinite;
  }
  @keyframes vz-chk-flow {
    0%, 100% { opacity: 0.35; transform: translateX(-1px); }
    50% { opacity: 0.7; transform: translateX(1px); }
  }
}

@media (max-width: 980px) {
  .vz-chk-flow {
    flex-direction: column;
    align-items: stretch;
  }
  .vz-chk-conn {
    align-self: center;
  }
  .vz-chk-conn::before {
    content: "↓";
  }
}
@media (max-width: 720px) {
  .vz-chk {
    padding: 20px 16px 22px;
    gap: 22px;
  }
}
`,
        }}
      />
      <div className="vz-chk-head" aria-hidden="true">
        <p className="vz-chk-eyebrow">AI Limits · Product Logic</p>
        <p className="vz-chk-intro">
          Why not generate video directly? Because inserting a cheaper, faster
          image layer before the expensive step changed everything.
        </p>
      </div>

      {tracks.map((track) => (
        <div className={`vz-chk-track is-${track.tone}`} key={track.label} aria-hidden="true">
          <div className="vz-chk-track-head">
            <span className="vz-chk-badge">{track.mark}</span>
            <span className="vz-chk-track-title">{track.label}</span>
          </div>
          <div className="vz-chk-flow">
            {track.steps.flatMap((step, i) => {
              const cell = (
                <div
                  className={`vz-chk-cell${step.tint ? " is-tint" : ""}`}
                  key={step.title}
                >
                  <span className="vz-chk-idx">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </div>
              );
              return i === 0
                ? [cell]
                : [
                    <span
                      className="vz-chk-conn"
                      key={`conn-${step.title}`}
                    />,
                    cell,
                  ];
            })}
          </div>
        </div>
      ))}

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
