// Chapter 1-2 visualization: the same creative depth of a traditional film
// crew, reorganized into a four-step path a single person can navigate (and
// loop back through). Rebuilt as crisp coded UI — the source was a raster
// diagram that blurred when scaled. Decorative content is aria-hidden; the
// root aria-label carries the meaning for assistive tech.
//
// The traditional side is a chain of specialists, each on a rail with a small
// tool pictogram (pen nib, storyboard grid, clapperboard, camera, splice,
// color drop). The Vicino side is headed by a single profile-bust figure — one
// person — and a subtle six-to-one convergence cue bridges the two.
//
// Design language matches the rest of the Vicino case page (tokens inherited
// from .vicino-case-page): near-black surfaces, hairline borders, mono/gold
// eyebrow, one restrained amber accent reserved for the Vicino path.

const traditionalSteps = [
  {
    role: "Screenwriter",
    icon: (
      <svg className="vz-pipe-glyph" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M5 3 H11 L9.2 10.4 L8 13 L6.8 10.4 Z" />
        <circle cx="8" cy="5.6" r="0.9" />
        <path d="M8 7.4 V12.2" />
      </svg>
    ),
  },
  {
    role: "Storyboard artist",
    icon: (
      <svg className="vz-pipe-glyph" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="2.8" y="3.5" width="10.4" height="9" rx="1.4" />
        <path d="M8 3.5 V12.5" />
        <path d="M2.8 8 H13.2" />
      </svg>
    ),
  },
  {
    role: "Director",
    icon: (
      <svg className="vz-pipe-glyph" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="2.6" y="6" width="10.8" height="7" rx="1.2" />
        <rect x="2.6" y="2.9" width="10.8" height="3.1" rx="0.7" />
        <path d="M5 2.9 L6.4 6" />
        <path d="M8.3 2.9 L9.7 6" />
        <path d="M11.6 2.9 L13 6" />
      </svg>
    ),
  },
  {
    role: "Cinematographer",
    icon: (
      <svg className="vz-pipe-glyph" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="5.4" cy="4.8" r="2.1" />
        <circle cx="9.2" cy="4.8" r="2.1" />
        <rect x="2.4" y="6.8" width="8.4" height="5.4" rx="1.1" />
        <path d="M10.8 8.2 L13.4 7.1 L13.4 11.9 L10.8 10.8 Z" />
      </svg>
    ),
  },
  {
    role: "Editor",
    icon: (
      <svg className="vz-pipe-glyph" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="5.4" cy="11" r="1.7" />
        <circle cx="10.6" cy="11" r="1.7" />
        <path d="M6.4 9.6 L11 3.4" />
        <path d="M9.6 9.6 L5 3.4" />
      </svg>
    ),
  },
  {
    role: "Colorist / VFX",
    icon: (
      <svg className="vz-pipe-glyph" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 2.4 C 10.6 6, 12 8.2, 12 10.2 C 12 12.6, 10.2 14, 8 14 C 5.8 14, 4 12.6, 4 10.2 C 4 8.2, 5.4 6, 8 2.4 Z" />
        <path d="M6 10.8 C 6 12.1, 6.9 12.9, 8.1 12.9" />
      </svg>
    ),
  },
];

const vicinoSteps = [
  { title: "Script", note: "Organize intent" },
  { title: "Storyboard", note: "Shape pacing" },
  { title: "Image", note: "Refine keyframes" },
  { title: "Video", note: "Final generation" },
] as const;

const index2 = (i: number) => (i + 1).toString().padStart(2, "0");

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
  /* density stays LOW (skill: Density & Anchors) */
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
.vz-pipe-eyebrow {
  margin: 0;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: var(--text-label, 13px);
  letter-spacing: var(--track-label, 0.14em);
  text-transform: uppercase;
  color: var(--accent-gold, #d9a441);
}
.vz-pipe-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* two 6-col fields separated by a double gutter */
  column-gap: calc(var(--v-gutter, 24px) * 2);
  row-gap: var(--v-gutter, 24px);
  align-items: start;
}
.vz-pipe-col {
  display: grid;
  gap: 16px;
  align-content: start;
}
.vz-pipe-head {
  display: grid;
  gap: 3px;
  min-width: 0;
}
.vz-pipe-head-fig {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 64px;
}
/* the column heads are this block's anchors — Pulse-style big sentence-case
   captions (all-caps condensed stays at station/page display level) */
.vz-pipe-sublabel {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(22px, 1.9vw, 28px);
  font-weight: 500;
  line-height: 1.15;
  color: rgba(244, 241, 234, 0.92);
}
.vz-pipe-col.is-vicino .vz-pipe-sublabel {
  color: var(--accent-amber, #e0902f);
}
.vz-pipe-faint {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 300;
  line-height: 1.4;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
}

/* shared line-art */
.vz-pipe-glyph {
  fill: none;
  stroke: rgba(244, 241, 234, 0.88);
  stroke-linecap: round;
  stroke-linejoin: round;
}
.vz-pipe-chip svg { width: 18px; height: 18px; display: block; stroke-width: 1.4; }
.vz-pipe-figure svg { display: block; height: 64px; width: auto; stroke-width: 1.6; }
.vz-pipe-frame { stroke: rgba(244, 241, 234, 0.42); }
.vz-pipe-gold { stroke: var(--accent-gold, #d9a441); }
.vz-pipe-figure { flex: 0 0 auto; line-height: 0; }

/* LEFT: specialists on a rail */
.vz-pipe-list {
  position: relative;
  display: grid;
  gap: 10px;
}
.vz-pipe-list::before {
  content: "";
  position: absolute;
  left: 15.5px;
  top: 21px;
  bottom: 21px;
  width: 1px;
  background: var(--v-line, rgba(255, 255, 255, 0.1));
}
.vz-pipe-role {
  position: relative;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 7px 2px;
}
.vz-pipe-chip {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(32, 32, 36, 0.6);
  -webkit-backdrop-filter: blur(6px) saturate(120%);
  backdrop-filter: blur(6px) saturate(120%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
.vz-pipe-role-name {
  flex: 1 1 auto;
  min-width: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-body, 17px);
  font-weight: 400;
  line-height: 1.35;
  color: var(--paper, #f4f1ea);
}
.vz-pipe-role-n {
  flex: 0 0 auto;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: var(--track-label, 0.14em);
  color: color-mix(in srgb, var(--v-body-ink, rgba(255, 255, 255, 0.62)) 58%, transparent);
}

/* RIGHT: Vicino steps */
.vz-pipe-body {
  display: flex;
  align-items: stretch;
  gap: 10px;
}
/* the four steps sit OPEN on the canvas — text and hairlines, no cards
   (boxes are reserved for genuine product-UI recreations) */
.vz-pipe-stack {
  flex: 1 1 auto;
  display: grid;
  min-width: 0;
}
.vz-pipe-step {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 16px 0;
}
.vz-pipe-step + .vz-pipe-step {
  border-top: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
}
.vz-pipe-step-copy {
  display: grid;
  gap: 4px;
}
.vz-pipe-cell-n {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: var(--track-label, 0.14em);
  color: color-mix(in srgb, var(--v-body-ink, rgba(255, 255, 255, 0.62)) 62%, transparent);
}
.vz-pipe-cell-title {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-body, 17px);
  font-weight: 500;
  color: var(--paper, #f4f1ea);
}
.vz-pipe-cell-note {
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 300;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
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
  font-size: var(--text-meta, 15px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}

@media (max-width: 980px) {
  .vz-pipe-cols {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
@media (max-width: 720px) {
  .vz-pipe {
    padding: 20px 16px;
    gap: 20px;
  }
  .vz-pipe-figure svg { height: 48px; }
  .vz-pipe-head-fig { min-height: 48px; }
}
`,
        }}
      />
      <p className="vz-pipe-eyebrow" aria-hidden="true">
        Same depth, reorganized
      </p>
      <div className="vz-pipe-cols" aria-hidden="true">
        <div className="vz-pipe-col is-traditional">
          <div className="vz-pipe-head-fig">
            <div className="vz-pipe-head">
              <p className="vz-pipe-sublabel">Traditional production</p>
              <p className="vz-pipe-faint">one specialist per step</p>
            </div>
          </div>
          <div className="vz-pipe-list">
            {traditionalSteps.map((item, i) => (
              <div className="vz-pipe-role" key={item.role}>
                <span className="vz-pipe-chip">{item.icon}</span>
                <span className="vz-pipe-role-name">{item.role}</span>
                <span className="vz-pipe-role-n">{index2(i)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="vz-pipe-col is-vicino">
          <div className="vz-pipe-head-fig">
            <span className="vz-pipe-figure" aria-hidden="true">
              <svg className="vz-pipe-glyph" viewBox="0 0 56 56" aria-hidden="true">
                <circle className="vz-pipe-frame" cx="28" cy="28" r="26" />
                <path d="M26 13 C 22 13, 18.5 14.5, 17.5 19 C 16.8 22, 16.8 26, 18 29 C 19 31, 21 32.2, 24 32.8 C 26.5 33.3, 28.5 33.2, 30.5 32 C 31.2 31.5, 31 30.4, 31 29.4 C 33 28.6, 35 27.3, 35.2 26 C 35.3 25, 33.5 24.6, 32.6 23.6 C 32 21, 33 18, 31 15.5 C 29.5 13.8, 27.5 13, 26 13 Z" />
                <path d="M20.5 31.5 L20.5 37.5" />
                <path d="M29.5 32.5 L29.5 37.5" />
                <path d="M12 46 C 13.5 40, 17 37.5, 20.5 37.5 L 29.5 37.5 C 33 37.5, 40.5 40.5, 42 46" />
                <path className="vz-pipe-gold" d="M25.5 37.5 L28 40 L30.5 37.5" />
              </svg>
            </span>
            <div className="vz-pipe-head">
              <p className="vz-pipe-sublabel">In Vicino</p>
              <p className="vz-pipe-faint">one person, flexible path</p>
            </div>
          </div>
          <div className="vz-pipe-body">
            <div className="vz-pipe-stack">
              {vicinoSteps.map((step, i) => (
                <div className="vz-pipe-step" key={step.title}>
                  <span className="vz-pipe-cell-n">{index2(i)}</span>
                  <div className="vz-pipe-step-copy">
                    <span className="vz-pipe-cell-title">{step.title}</span>
                    <span className="vz-pipe-cell-note">{step.note}</span>
                  </div>
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
