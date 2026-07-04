// Station-02 visualization: who actually uses the product, and why the real gap
// is methodology — not the interface. Redesigned from a stacked card grid ("too
// AI") into a SPECTRUM: two profile-bust medallions face each other across an
// amber connector, joined by a faint dashed axis. The busts are editorial line
// art (profiles only, no frontal faces) so the point reads at a glance instead of
// leaning on text alone. Static, decorative content is aria-hidden; the root
// aria-label carries the meaning for assistive tech.
//
// Design language matches the rest of the Vicino case page (tokens inherited from
// .vicino-case-page): near-black surfaces, hairline borders, mono/gold eyebrows,
// one restrained amber accent per moment.

export function VicinoAudienceViz() {
  return (
    <div
      className="vz-aud"
      role="img"
      aria-label="Users span a spectrum from creative-production veterans to marketing interns; AI generation is new to all of them, so the real gap is methodology, which the front of the workflow supplies."
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.vz-aud {
  display: grid;
  /* density stays LOW (skill: Density & Anchors) — block gaps at 1.5x the
     station gutter, interior padding well past 1.25x */
  gap: calc(var(--v-gutter, 24px) * 1.5);
  padding: clamp(32px, 3.2vw, 52px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  /* the container is a piece of the product's Work Space: near-black canvas
     with the faint dot grid; panels above it are frosted glass */
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.065) 1px, transparent 1.4px) 0 0 / 26px 26px,
    #0a0a0c;
}
/* the block's anchor — a big sentence-case caption, not an eyebrow */
.vz-aud-eyebrow {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(22px, 1.9vw, 28px);
  font-weight: 500;
  line-height: 1.15;
  color: rgba(244, 241, 234, 0.92);
}
/* the spectrum band: veteran — connector — newcomer */
.vz-aud-band {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: start;
  gap: var(--v-gutter, 24px);
}
/* faint dashed spectrum axis behind the medallions (medallion centre = 46px) */
.vz-aud-axis {
  position: absolute;
  top: 52px;
  left: 6%;
  right: 6%;
  height: 0;
  border-top: 1px dashed var(--v-line, rgba(255, 255, 255, 0.1));
  opacity: 0.6;
  pointer-events: none;
  z-index: 0;
}
.vz-aud-persona {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}
.vz-aud-medallion {
  width: 104px;
  height: 104px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(32, 32, 36, 0.5);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
  backdrop-filter: blur(8px) saturate(120%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vz-aud-medallion svg {
  width: 84px;
  height: 84px;
  display: block;
}
.vz-aud-name {
  display: flex;
  align-items: center;
  gap: 8px;
}
.vz-aud-name h4 {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  /* the persona names are this block's anchors — lead size, calm weight */
  font-size: var(--text-lead, 21px);
  font-weight: 400;
  color: var(--paper, #f4f1ea);
}
.vz-aud-dot {
  flex: 0 0 auto;
  width: 9px;
  height: 9px;
  border-radius: 999px;
}
.vz-aud-persona.is-veteran .vz-aud-dot {
  background: var(--accent-gold, #d9a441);
}
.vz-aud-persona.is-newcomer .vz-aud-dot {
  border: 1px solid rgba(255, 255, 255, 0.45);
}
.vz-aud-trait {
  margin: 0;
  max-width: 26ch;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}
/* the amber connector — the one highlight moment */
.vz-aud-connector {
  position: relative;
  z-index: 1;
  min-height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vz-aud-pill {
  position: relative;
  max-width: 24ch;
  padding: 13px 22px;
  border: 1px solid color-mix(in srgb, var(--accent-amber, #e0902f) 50%, transparent);
  border-radius: 999px;
  /* amber-tinted frosted glass — the product's panel material, one hairline
     catch-light, no gradient washes */
  background: color-mix(in srgb, var(--accent-amber, #e0902f) 9%, rgba(20, 20, 23, 0.55));
  -webkit-backdrop-filter: blur(10px) saturate(130%);
  backdrop-filter: blur(10px) saturate(130%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    0 12px 30px -18px rgba(0, 0, 0, 0.7);
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-meta, 15px);
  line-height: 1.5;
  text-align: center;
  color: color-mix(in srgb, var(--accent-amber, #e0902f) 82%, white);
}
.vz-aud-pill::before,
.vz-aud-pill::after {
  content: "";
  position: absolute;
  top: 50%;
  width: clamp(10px, 2vw, 28px);
  height: 1px;
  transform: translateY(-50%);
  opacity: 0.6;
}
.vz-aud-pill::before {
  right: 100%;
  background: linear-gradient(to left, var(--accent-amber, #e0902f), transparent);
}
.vz-aud-pill::after {
  left: 100%;
  background: linear-gradient(to right, var(--accent-amber, #e0902f), transparent);
}
.vz-aud-gap {
  margin: 0;
  max-width: 58ch;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: var(--text-body, 17px);
  font-weight: 300;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.72);
}
.vz-aud-gap b {
  font-weight: 500;
  color: var(--paper, #f4f1ea);
}
@media (prefers-reduced-motion: no-preference) {
  .vz-aud-pill::before,
  .vz-aud-pill::after {
    animation: vz-aud-pulse 4.6s ease-in-out infinite;
  }
  @keyframes vz-aud-pulse {
    0%, 100% { opacity: 0.32; }
    50% { opacity: 0.85; }
  }
}
@media (max-width: 980px) {
  .vz-aud-band {
    gap: 12px;
  }
  .vz-aud-medallion {
    width: 92px;
    height: 92px;
  }
  .vz-aud-medallion svg {
    width: 74px;
    height: 74px;
  }
  .vz-aud-axis {
    top: 46px;
  }
  .vz-aud-pill {
    max-width: 19ch;
    font-size: 14px;
  }
  .vz-aud-trait {
    max-width: 20ch;
  }
}
@media (max-width: 720px) {
  .vz-aud-band {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 18px;
  }
  .vz-aud-axis {
    display: none;
  }
  .vz-aud-connector {
    min-height: auto;
  }
  .vz-aud-pill {
    max-width: 34ch;
  }
  .vz-aud-pill::before,
  .vz-aud-pill::after {
    top: auto;
    left: 50%;
    right: auto;
    width: 1px;
    height: clamp(10px, 4vw, 20px);
    transform: translateX(-50%);
  }
  .vz-aud-pill::before {
    bottom: 100%;
    background: linear-gradient(to top, var(--accent-amber, #e0902f), transparent);
  }
  .vz-aud-pill::after {
    top: 100%;
    background: linear-gradient(to bottom, var(--accent-amber, #e0902f), transparent);
  }
}
`,
        }}
      />
      <p className="vz-aud-eyebrow" aria-hidden="true">
        Who&rsquo;s actually using it
      </p>
      <div className="vz-aud-band" aria-hidden="true">
        <span className="vz-aud-axis" />

        <div className="vz-aud-persona is-veteran">
          <span className="vz-aud-medallion">
            <svg viewBox="0 0 92 92" aria-hidden="true" focusable="false">
              <g
                fill="none"
                stroke="rgba(244,241,234,0.88)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 84 C22 70 30 66 32 60 C30 52 28 40 34 30 C40 20 54 18 62 28 C66 33 66 38 66 42 C66 44 65 45 66 46 C70 48 72 50 68 53 C66 54 65 55 65 56 C65 58 64 59 62 60 C60 62 61 64 57 65 C54 66 52 66 51 68 C51 74 52 78 56 84" />
                <path d="M43 67 L49 73 L54 68" />
                <path d="M28 32 C30 18 46 12 62 18" />
                <path d="M45 13 L45 10" />
              </g>
              <path
                d="M62 18 C66 20 66 24 61 27"
                fill="none"
                stroke="var(--accent-gold, #d9a441)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="vz-aud-name">
            <span className="vz-aud-dot" />
            <h4>Creative-production veteran</h4>
          </span>
          <p className="vz-aud-trait">
            Brings a methodology — shot switching, scene language, pacing.
          </p>
        </div>

        <div className="vz-aud-connector">
          <span className="vz-aud-pill">
            Whatever their background, AI generation is new to all of them
          </span>
        </div>

        <div className="vz-aud-persona is-newcomer">
          <span className="vz-aud-medallion">
            <svg viewBox="0 0 92 92" aria-hidden="true" focusable="false">
              <g
                fill="none"
                stroke="rgba(244,241,234,0.88)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M74 84 C70 70 62 66 60 60 C62 52 64 40 58 30 C52 20 38 18 30 28 C26 33 26 38 26 42 C26 44 27 45 26 46 C22 48 20 50 24 53 C26 54 27 55 27 56 C27 58 28 59 30 60 C32 62 31 64 35 65 C38 66 40 66 41 68 C41 74 40 78 36 84" />
                <path d="M57 30 C68 24 76 30 74 40 C72 48 64 48 60 43" />
                <path d="M56 33 L61 33 M56 37 L61 37" />
                <circle cx="28.5" cy="43" r="4.6" />
                <circle cx="39" cy="43" r="4.6" />
                <path d="M33.2 43 L34.4 43" />
                <path d="M43.6 42.6 L48 41.6" />
              </g>
            </svg>
          </span>
          <span className="vz-aud-name">
            <span className="vz-aud-dot" />
            <h4>Marketing intern</h4>
          </span>
          <p className="vz-aud-trait">
            New to production — no framing or scene language yet.
          </p>
        </div>
      </div>
      <p className="vz-aud-gap" aria-hidden="true">
        So the gap that matters isn&rsquo;t the interface — it&rsquo;s{" "}
        <b>methodology</b>: how to switch shots, how to describe a scene. The
        front of the workflow hands that to newcomers and lets veterans map
        their own.
      </p>
    </div>
  );
}
