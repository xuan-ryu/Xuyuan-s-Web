// Station-02 visualization: who actually uses the product, and why the real
// gap is methodology — not the interface. Rebuilt as crisp coded UI (the source
// was a raster diagram that blurred when scaled). Static, decorative content is
// aria-hidden; the surrounding copy carries the meaning for assistive tech.
//
// Design language matches the rest of the Vicino case page (tokens inherited
// from .vicino-case-page): near-black surfaces, hairline borders, mono/gold
// eyebrows, condensed display, one restrained accent per moment.

const personas = [
  {
    tone: "veteran",
    label: "Creative-production veteran",
    trait: "Brings a methodology — shot switching, scene language, pacing.",
  },
  {
    tone: "newcomer",
    label: "Marketing intern",
    trait: "New to production — no framing or scene language yet.",
  },
] as const;

export function VicinoAudienceViz() {
  return (
    <div className="vz-aud" role="img" aria-label="Users span creative-production veterans to marketing interns; AI generation is new to all of them, so the real gap is methodology, which the front of the workflow supplies.">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.vz-aud {
  display: grid;
  gap: 18px;
  padding: 22px clamp(16px, 2vw, 26px) 24px;
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 14px;
  background:
    radial-gradient(120% 140% at 50% -20%, rgba(255, 255, 255, 0.035), transparent 60%),
    rgba(255, 255, 255, 0.015);
}
.vz-aud-eyebrow {
  margin: 0;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12px;
  letter-spacing: var(--track-label, 0.14em);
  text-transform: uppercase;
  color: var(--accent-gold, #d9a441);
}
.vz-aud-personas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(12px, 1.6vw, 20px);
}
.vz-aud-persona {
  display: grid;
  gap: 8px;
  align-content: start;
  padding: 16px;
  border: 1px solid var(--v-line, rgba(255, 255, 255, 0.1));
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.02);
}
.vz-aud-persona-top {
  display: flex;
  align-items: center;
  gap: 9px;
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
  border: 1px solid rgba(255, 255, 255, 0.4);
}
.vz-aud-persona h4 {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(15px, 1.2vw, 17px);
  font-weight: 500;
  color: var(--paper, #f4f1ea);
}
.vz-aud-persona p {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.62));
}
/* the equalizer — both backgrounds converge on one starting line */
.vz-aud-equalizer {
  position: relative;
  display: flex;
  justify-content: center;
}
.vz-aud-equalizer::before {
  content: "";
  position: absolute;
  left: 12%;
  right: 12%;
  top: 50%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--accent-amber, #e0902f) 22%,
    var(--accent-amber, #e0902f) 78%,
    transparent
  );
  opacity: 0.5;
}
.vz-aud-equalizer span {
  position: relative;
  padding: 7px 16px;
  border: 1px solid color-mix(in srgb, var(--accent-amber, #e0902f) 45%, transparent);
  border-radius: 999px;
  background: var(--ink-950, #08080a);
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: 13px;
  letter-spacing: 0.01em;
  color: color-mix(in srgb, var(--accent-amber, #e0902f) 88%, white);
}
.vz-aud-gap {
  margin: 0;
  font-family: var(--font-text, var(--font-sans, system-ui));
  font-size: clamp(14px, 1.15vw, 15px);
  font-weight: 300;
  line-height: 1.55;
  color: var(--v-body-ink, rgba(255, 255, 255, 0.72));
}
.vz-aud-gap b {
  font-weight: 500;
  color: var(--paper, #f4f1ea);
}
@media (max-width: 720px) {
  .vz-aud-personas {
    grid-template-columns: 1fr;
  }
  .vz-aud-equalizer::before {
    left: 4%;
    right: 4%;
  }
}
`,
        }}
      />
      <p className="vz-aud-eyebrow" aria-hidden="true">
        Who&rsquo;s actually using it
      </p>
      <div className="vz-aud-personas" aria-hidden="true">
        {personas.map((p) => (
          <div className={`vz-aud-persona is-${p.tone}`} key={p.label}>
            <span className="vz-aud-persona-top">
              <span className="vz-aud-dot" />
              <h4>{p.label}</h4>
            </span>
            <p>{p.trait}</p>
          </div>
        ))}
      </div>
      <div className="vz-aud-equalizer" aria-hidden="true">
        <span>Whatever their background, AI generation is new to all of them</span>
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
