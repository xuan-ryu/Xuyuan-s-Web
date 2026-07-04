import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { adjacent, type Project } from "@/data/projects";
import { VrmbFlightLine } from "@/components/vrmb-flight-line";
import { VrmbParticleStrip } from "@/components/vrmb-particle-strip";

// VR Monarch Butterfly — "a naturalist's field folio for a virtual migration"
// (art-direction spec: scratchpad specs/spec-vr-butterfly.json).
//
// Reading path: specimen plate hero -> full-bleed colony sky + flight line ->
// embodiment (about + details rail) -> Unity workbench with callouts ->
// skyward diptych -> dark exhibition band -> particle coda -> Plate II
// credits -> adjacent nav.
//
// All derived crops in /media/work/vr were pixel-probed from the original five
// Framer assets (see the probe notes at the bottom of this file). All
// microcopy below is hardcoded here — NOT in data/projects.ts — pending owner
// sign-off on the migration facts and exhibition sentences.
const MEDIA = "/media/work/vr";

const css = `
.vrmb-page {
  /* Case palette — drawn from the specimen itself (owner rule 2026-07-05):
     --case-accent is the monarch's true wing orange, weighted-averaged from
     the vivid highlight pixels across specimen.png (the plate hero image);
     used only for the flight-line's rule/ticks, a graphic mark rather than
     reading text. --case-detail is the same hue and saturation darkened
     until it clears 4.5:1 on paper (raw --case-accent reads ~2.3:1 at
     11px), so the repeating Plate/Fig. index labels stay legible while
     still reading as the butterfly's own color, not site gold. */
  --case-accent: #f7950e;
  --case-detail: #a36105;
  background: var(--paper);
  color: var(--ink-950);
}

.vrmb-shell {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  margin-inline: auto;
  padding-inline: var(--work-gutter);
}

.vrmb-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
}

/* ---- 1 · Specimen plate (hero) ---- */
.vrmb-hero {
  row-gap: 0;
  align-content: start;
  padding-top: clamp(160px, 18vw, 235px);
  padding-bottom: clamp(76px, 8vw, 124px);
}

.vrmb-eyebrow {
  grid-column: 1 / 5;
  grid-row: 1;
  margin: 0 0 clamp(22px, 2.6vw, 38px);
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.48);
}

.vrmb-hero h1 {
  grid-column: 1 / 8;
  grid-row: 2;
  margin: 0;
  font-family: var(--font-condensed);
  font-size: var(--text-display-2);
  font-weight: 300;
  line-height: 0.92;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  text-wrap: balance;
}

.vrmb-plate {
  grid-column: 1 / 8;
  grid-row: 3;
  margin: clamp(16px, 1.8vw, 26px) 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--stone);
}

.vrmb-index {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--case-detail);
}

.vrmb-lede {
  grid-column: 1 / 6;
  grid-row: 4;
  max-width: 46ch;
  margin: clamp(30px, 3.4vw, 52px) 0 0;
  font-family: var(--font-serif);
  font-size: var(--text-lead);
  font-weight: 400;
  line-height: 1.5;
  color: rgba(5, 5, 5, 0.68);
}

.vrmb-meta {
  grid-column: 1 / 4;
  grid-row: 5;
  align-self: start;
  margin: clamp(30px, 3.4vw, 52px) 0 0;
  border-top: 1px solid var(--work-rule);
}

.vrmb-meta div {
  padding: 13px 0;
  border-bottom: 1px solid var(--work-rule);
}

.vrmb-meta dt {
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.48);
}

.vrmb-meta dd {
  margin: 5px 0 0;
  font-size: var(--text-meta);
  font-weight: 400;
  line-height: 1.45;
  color: rgba(5, 5, 5, 0.78);
}

.vrmb-specimen {
  grid-column: 7 / -1;
  grid-row: 1 / 6;
  align-self: start;
  margin: 0;
}

.vrmb-specimen img {
  display: block;
  width: 100%;
  height: auto;
}

/* ---- 2 · The colony ---- */
.vrmb-colony {
  padding-bottom: clamp(76px, 8vw, 124px);
}

.vrmb-colony-media {
  position: relative;
  width: 100%;
  height: clamp(420px, 72vh, 760px);
  background: var(--ink-950);
}

.vrmb-colony-media img {
  object-fit: cover;
  object-position: 50% 42%;
}

.vrmb-cap {
  margin: clamp(14px, 1.6vw, 20px) 0 0;
  max-width: 58ch;
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.55;
  letter-spacing: 0;
  color: rgba(5, 5, 5, 0.6);
}

.vrmb-cap .vrmb-index {
  margin-right: 10px;
}

.vrmb-flightwrap {
  margin-top: clamp(48px, 5.6vw, 84px);
}

.vrmb-flight {
  display: block;
  width: 100%;
  height: 80px;
  overflow: visible;
}

.vrmb-flight text {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.12em;
  fill: var(--stone);
  opacity: 0;
  transition: opacity 0.6s var(--ease-standard) 0.8s;
}

.vrmb-flight-rule {
  stroke: var(--case-accent);
  stroke-width: 1;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 1.2s var(--ease-reveal);
}

.vrmb-flight-tick {
  stroke: var(--case-accent);
  stroke-width: 1;
  opacity: 0;
  transition: opacity 0.6s var(--ease-standard) 0.7s;
}

.vrmb-flight.is-drawn .vrmb-flight-rule {
  stroke-dashoffset: 0;
}

.vrmb-flight.is-drawn text,
.vrmb-flight.is-drawn .vrmb-flight-tick {
  opacity: 1;
}

/* ---- shared chapter anatomy ---- */
.vrmb-chapter {
  border-top: 1px solid var(--work-rule);
  padding-top: clamp(76px, 8vw, 124px);
  padding-bottom: clamp(76px, 8vw, 124px);
  row-gap: clamp(28px, 3vw, 44px);
}

.vrmb-kicker {
  grid-column: 1 / 2;
  grid-row: 1;
  margin: 0;
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.48);
}

.vrmb-h2 {
  grid-column: 1 / 5;
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-heading);
  font-weight: 400;
  line-height: 1.12;
  letter-spacing: 0;
  color: var(--ink-950);
}

.vrmb-copy {
  grid-column: 5 / 10;
}

.vrmb-about .vrmb-copy {
  grid-column: 5 / 9;
}

.vrmb-copy p {
  margin: 0;
  max-width: 68ch;
  font-family: var(--font-serif);
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.62;
  color: rgba(5, 5, 5, 0.76);
}

.vrmb-copy p + p {
  margin-top: 22px;
}

/* ---- figures ---- */
.vrmb-fig {
  grid-column: 1 / -1;
  margin: clamp(24px, 3vw, 48px) 0 0;
}

.vrmb-fig img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--work-rule);
  background: var(--paper-warm);
}

.vrmb-fig figcaption {
  margin: clamp(12px, 1.4vw, 18px) 0 0;
  max-width: 58ch;
  font-size: var(--text-label);
  line-height: 1.55;
  color: rgba(5, 5, 5, 0.6);
}

.vrmb-fig figcaption .vrmb-index {
  margin-right: 10px;
}

.vrmb-half-a {
  grid-column: 1 / 7;
}

.vrmb-half-b {
  grid-column: 7 / -1;
}

.vrmb-half-a img,
.vrmb-half-b img {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.vrmb-pair-cap {
  grid-column: 1 / 7;
}

/* ---- 4 · workbench callouts ---- */
.vrmb-callouts {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  row-gap: 20px;
  margin: clamp(6px, 0.8vw, 12px) 0 clamp(18px, 2.2vw, 32px);
  padding: 0;
  list-style: none;
}

.vrmb-callouts li {
  border-top: 1px solid var(--work-rule);
  padding-top: 14px;
}

.vrmb-callout-title {
  display: block;
  font-size: var(--text-label);
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.72);
}

.vrmb-callout-note {
  display: block;
  margin-top: 6px;
  font-size: var(--text-meta);
  font-weight: 400;
  line-height: 1.5;
  color: rgba(5, 5, 5, 0.6);
}

/* ---- 5 · skyward diptych ---- */
.vrmb-sky {
  padding-top: clamp(54px, 6vw, 84px);
  padding-bottom: clamp(76px, 8vw, 124px);
  row-gap: 0;
}

.vrmb-sky .vrmb-fig {
  margin-top: 0;
}

/* ---- 6 · the dark room ---- */
.vrmb-dark {
  background: var(--ink-950);
  color: var(--paper);
  padding-top: clamp(96px, 10vw, 150px);
  padding-bottom: calc(clamp(96px, 10vw, 150px) + clamp(60px, 8vw, 120px));
}

.vrmb-dark .vrmb-h2 {
  color: var(--paper);
}

.vrmb-dark .vrmb-copy p {
  color: rgba(255, 255, 255, 0.72);
}

.vrmb-exhibit {
  margin: clamp(48px, 6vw, 88px) 0 0;
}

.vrmb-exhibit img {
  display: block;
  width: 100%;
  max-width: 520px;
  height: auto;
}

.vrmb-exhibit figcaption {
  margin: 14px 0 0;
  max-width: 44ch;
  font-size: var(--text-label);
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.65);
}

.vrmb-exhibit-a {
  grid-column: 2 / 6;
}

.vrmb-exhibit-b {
  grid-column: 7 / 11;
  transform: translateY(clamp(60px, 8vw, 120px));
}

/* ---- 7 · coda + particle strip ---- */
.vrmb-coda {
  border-top: 0; /* the ink band above already closes the chapter */
}

.vrmb-strip {
  grid-column: 1 / -1;
  height: clamp(240px, 28vw, 360px);
  margin-top: clamp(24px, 3vw, 48px);
}

.vrmb-particles,
.vrmb-particles canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* ---- 8 · Plate II credits ---- */
.vrmb-credits {
  padding-bottom: clamp(40px, 4.6vw, 72px);
}

.vrmb-credit-list {
  grid-column: 1 / 8;
  align-self: start;
  margin: clamp(24px, 3vw, 48px) 0 0;
  border-top: 1px solid var(--work-rule);
}

.vrmb-credit-list div {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  column-gap: var(--work-grid-gap);
  align-items: baseline;
  padding: 16px 0;
  border-bottom: 1px solid var(--work-rule);
}

.vrmb-credit-list dt {
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.48);
}

.vrmb-credit-list dd {
  margin: 0;
  font-size: var(--text-meta);
  font-weight: 400;
  line-height: 1.45;
  color: rgba(5, 5, 5, 0.82);
}

.vrmb-plate2 {
  grid-column: 9 / -1;
  margin: clamp(24px, 3vw, 48px) 0 0;
}

.vrmb-plate2-frame {
  border: 1px solid var(--work-rule);
  background: var(--paper-warm);
  padding: clamp(12px, 1.4vw, 18px);
}

.vrmb-plate2 img {
  display: block;
  width: 100%;
  height: auto;
}

.vrmb-plate2 figcaption {
  margin: 12px 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1.6;
  color: var(--stone);
}

/* ---- reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .vrmb-flight-rule {
    stroke-dashoffset: 0;
    transition: none;
  }

  .vrmb-flight text,
  .vrmb-flight-tick {
    opacity: 1;
    transition: none;
  }
}

/* ---- tablet (8 col) ---- */
@media (max-width: 1079px) {
  .vrmb-grid {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  .vrmb-eyebrow {
    grid-column: 1 / 6;
  }

  .vrmb-hero h1,
  .vrmb-plate {
    grid-column: 1 / -1;
  }

  .vrmb-lede {
    grid-column: 1 / 5;
  }

  .vrmb-meta {
    grid-column: 1 / 5;
    grid-row: 5;
  }

  .vrmb-specimen {
    grid-column: 5 / -1;
    grid-row: 4 / 6;
    margin-top: clamp(30px, 3.4vw, 52px);
  }

  .vrmb-h2 {
    grid-column: 1 / 4;
  }

  .vrmb-copy,
  .vrmb-about .vrmb-copy {
    grid-column: 4 / -1;
  }

  .vrmb-exhibit-a {
    grid-column: 1 / 5;
  }

  .vrmb-exhibit-b {
    grid-column: 5 / -1;
  }

  .vrmb-credit-list {
    grid-column: 1 / 6;
  }

  .vrmb-plate2 {
    grid-column: 6 / -1;
  }
}

/* ---- phone (single reading column) ---- */
@media (max-width: 809px) {
  .vrmb-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .vrmb-hero {
    padding-top: 132px;
  }

  .vrmb-eyebrow,
  .vrmb-hero h1,
  .vrmb-plate,
  .vrmb-lede,
  .vrmb-meta,
  .vrmb-specimen,
  .vrmb-kicker,
  .vrmb-h2,
  .vrmb-copy,
  .vrmb-about .vrmb-copy,
  .vrmb-fig,
  .vrmb-half-a,
  .vrmb-half-b,
  .vrmb-pair-cap,
  .vrmb-callouts,
  .vrmb-strip,
  .vrmb-exhibit-a,
  .vrmb-exhibit-b,
  .vrmb-credit-list,
  .vrmb-plate2 {
    grid-column: 1;
    grid-row: auto;
  }

  .vrmb-hero h1 {
    font-size: var(--text-display-3);
  }

  /* butterfly first, then the lede and meta */
  .vrmb-eyebrow { order: 1; }
  .vrmb-hero h1 { order: 2; }
  .vrmb-plate { order: 3; }
  .vrmb-specimen { order: 4; margin-top: clamp(24px, 6vw, 40px); }
  .vrmb-lede { order: 5; }
  .vrmb-meta { order: 6; }

  .vrmb-lede {
    font-size: var(--text-body);
  }

  .vrmb-colony-media {
    height: clamp(300px, 52vh, 460px);
  }

  .vrmb-chapter {
    padding-top: 62px;
    padding-bottom: 62px;
  }

  .vrmb-callouts {
    grid-template-columns: minmax(0, 1fr);
  }

  .vrmb-half-b {
    margin-top: clamp(18px, 4vw, 28px);
  }

  .vrmb-sky .vrmb-fig + .vrmb-fig {
    margin-top: clamp(18px, 4vw, 28px);
  }

  .vrmb-dark {
    padding-bottom: 96px;
  }

  .vrmb-exhibit-b {
    transform: none;
  }

  .vrmb-strip {
    height: clamp(180px, 42vw, 260px);
  }
}
`;

export function VrmbPosterLayout({ project }: { project: Project }) {
  const poster = project.poster;
  if (!poster) return null;

  const { prev, next } = adjacent(project.slug);
  const details: [string, ReactNode][] = [
    ["Project:", poster.details.project],
    ["Client:", poster.details.client],
    ["Year:", poster.details.year],
    ["Services:", poster.details.services],
  ];
  // the essay's first paragraph, minus its literal "Synopsis:" prefix
  const benchBody = poster.body[0]?.replace(/^Synopsis:\s*/, "");
  const codaBody = poster.body[1];

  return (
    <article className="poster-page vrmb-page">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* 1 · Specimen plate */}
      <header className="vrmb-shell vrmb-grid vrmb-hero" id="header">
        <p className="vrmb-eyebrow" data-fade>
          Work 05 — VR · Unity
        </p>
        <h1 data-fade>{project.title}</h1>
        <p className="vrmb-plate" data-fade>
          <span className="vrmb-index">Plate I</span> — Danaus plexippus
        </p>
        <p className="vrmb-lede" data-fade>
          {project.oneliner}
        </p>
        <dl className="vrmb-meta" data-fade>
          <div>
            <dt>Role</dt>
            <dd>Scene creation · development</dd>
          </div>
          <div>
            <dt>Term</dt>
            <dd>Winter Term, 12/2023 – 1/2024</dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>3 students, Oberlin College</dd>
          </div>
          <div>
            <dt>Tools</dt>
            <dd>Unity · Blender</dd>
          </div>
        </dl>
        <figure className="vrmb-specimen" data-fade>
          <Image
            src={`${MEDIA}/specimen.png`}
            alt="A monarch butterfly, wings spread, photographed like a pinned specimen on white paper"
            width={851}
            height={606}
            sizes="(max-width: 809px) 100vw, 640px"
            priority
          />
        </figure>
      </header>

      {/* 2 · The colony */}
      <section className="vrmb-colony" aria-label="The overwintering colony">
        <figure className="vrmb-colony-fig" data-fade>
          <div className="vrmb-colony-media">
            <Image
              src={`${MEDIA}/colony-sky.jpg`}
              alt="In-headset view of the VR scene: a colony of monarch butterflies lifting off conifer trees into a clouded blue sky"
              fill
              sizes="100vw"
            />
          </div>
          <figcaption className="vrmb-shell">
            <p className="vrmb-cap">
              <span className="vrmb-index">Fig. 01</span>
              In-headset view — the overwintering colony lifting from the firs.
            </p>
          </figcaption>
        </figure>
        <div className="vrmb-shell vrmb-flightwrap" data-fade>
          <VrmbFlightLine />
        </div>
      </section>

      {/* 3 · Becoming the butterfly */}
      <section
        className="vrmb-shell vrmb-grid vrmb-chapter vrmb-about"
        aria-labelledby="vrmb-about-title"
      >
        <p className="vrmb-kicker" data-fade>
          01
        </p>
        <h2 id="vrmb-about-title" className="vrmb-h2" data-fade>
          Becoming the butterfly
        </h2>
        <div className="vrmb-copy" data-fade>
          {poster.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* details rail — reused verbatim from the poster template */}
        <div className="poster-details" data-fade>
          <div className="poster-details-head">
            <p>Project Details</p>
            <Image
              src="/media/shared/seal.png"
              alt=""
              width={157}
              height={127}
              style={{ width: "clamp(74px, 8vw, 118px)", height: "auto" }}
            />
          </div>
          <dl className="poster-details-list">
            {details.map(([label, value]) => (
              <div key={label as string} className="poster-details-row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="vrmb-fig" data-fade>
          <Image
            src={`${MEDIA}/render-pov.jpg`}
            alt="First-person render from the VR piece: monarch wings at the player's eye line, a forest meadow beyond"
            width={910}
            height={525}
            sizes="(max-width: 809px) 100vw, 1296px"
          />
          <figcaption>
            <span className="vrmb-index">Fig. 02</span>
            You fly as the monarch — wings rendered from the player&rsquo;s eye
            line.
          </figcaption>
        </figure>
      </section>

      {/* 4 · Building the grove */}
      <section
        className="vrmb-shell vrmb-grid vrmb-chapter vrmb-bench"
        aria-labelledby="vrmb-bench-title"
      >
        <h2 id="vrmb-bench-title" className="vrmb-h2" data-fade>
          One winter term, one Unity scene
        </h2>
        <div className="vrmb-copy" data-fade>
          <p>{benchBody}</p>
        </div>

        <figure className="vrmb-fig" data-fade>
          <Image
            src={`${MEDIA}/editor-scene.png`}
            alt="The Unity editor scene view: the grove with audio-source gizmos, a camera preview inset, and the AI navigation panel open"
            width={915}
            height={603}
            sizes="(max-width: 809px) 100vw, 1296px"
          />
          <figcaption>
            <span className="vrmb-index">Fig. 03</span>
            The scene in the Unity editor, camera rig at the meadow&rsquo;s
            edge.
          </figcaption>
        </figure>

        <ul className="vrmb-callouts" data-fade>
          <li>
            <span className="vrmb-callout-title">Audio sources</span>
            <span className="vrmb-callout-note">
              Narration triggers placed through the grove
            </span>
          </li>
          <li>
            <span className="vrmb-callout-title">Camera preview</span>
            <span className="vrmb-callout-note">
              The player rig&rsquo;s view of the meadow
            </span>
          </li>
          <li>
            <span className="vrmb-callout-title">AI navigation</span>
            <span className="vrmb-callout-note">
              Agents steer the butterflies&rsquo; flight paths
            </span>
          </li>
        </ul>

        <figure className="vrmb-fig vrmb-half-a" data-fade>
          <Image
            src={`${MEDIA}/meadow-a.jpg`}
            alt="Ground-level render: a monarch resting in the meadow grass at the edge of the grove"
            width={522}
            height={295}
            sizes="(max-width: 809px) 100vw, 640px"
          />
        </figure>
        <figure className="vrmb-fig vrmb-half-b" data-fade>
          <Image
            src={`${MEDIA}/meadow-b.jpg`}
            alt="Ground-level render: monarchs among wildflowers, forest light falling across the clearing"
            width={519}
            height={294}
            sizes="(max-width: 809px) 100vw, 640px"
          />
        </figure>
        <p className="vrmb-cap vrmb-pair-cap" data-fade>
          <span className="vrmb-index">Fig. 04</span>
          Ground level in the grove — monarchs rest in the meadow between
          flights.
        </p>
      </section>

      {/* 5 · Skyward */}
      <section
        className="vrmb-shell vrmb-grid vrmb-sky"
        aria-label="Rendering passes over the colony"
      >
        <figure className="vrmb-fig vrmb-half-a" data-fade>
          <Image
            src={`${MEDIA}/sky-sun.jpg`}
            alt="Render looking up through the fir canopy into sunlight and fog"
            width={535}
            height={299}
            sizes="(max-width: 809px) 100vw, 640px"
          />
        </figure>
        <figure className="vrmb-fig vrmb-half-b" data-fade>
          <Image
            src={`${MEDIA}/sky-swarm.jpg`}
            alt="Render of the swarm scattered across open blue sky above the treeline"
            width={534}
            height={291}
            sizes="(max-width: 809px) 100vw, 640px"
          />
        </figure>
        <p className="vrmb-cap vrmb-pair-cap" data-fade>
          <span className="vrmb-index">Fig. 05</span>
          Rendering passes over the colony — fog, backlight, open sky.
        </p>
      </section>

      {/* 6 · The dark room */}
      <section className="vrmb-dark" aria-labelledby="vrmb-dark-title">
        <div className="vrmb-shell vrmb-grid">
          <h2 id="vrmb-dark-title" className="vrmb-h2" data-fade>
            Shown in a dark room
          </h2>
          <div className="vrmb-copy" data-fade>
            <p>
              At the Winter Term showing, the headset view was projected for
              the room, so the audience flew wherever the player flew. Costume
              monarch wings on the presenter carried the butterfly out of the
              headset and into the room.
            </p>
          </div>
          <figure className="vrmb-exhibit vrmb-exhibit-a">
            <div data-fade>
              <Image
                src={`${MEDIA}/exhibit-headset.jpg`}
                alt="A dark screening room: silhouettes of the audience watching the projected headset view of the VR grove"
                width={472}
                height={630}
                sizes="(max-width: 809px) 100vw, 472px"
              />
            </div>
            <figcaption data-fade>
              The audience follows the projected headset view.
            </figcaption>
          </figure>
          <figure className="vrmb-exhibit vrmb-exhibit-b">
            <div data-fade>
              <Image
                src={`${MEDIA}/exhibit-wings.jpg`}
                alt="The presenter wearing monarch wings in front of the projected VR scene, audience in the foreground"
                width={469}
                height={625}
                sizes="(max-width: 809px) 100vw, 469px"
              />
            </div>
            <figcaption data-fade>
              Monarch wings on the presenter, the grove projected behind.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 7 · From documentary to instrument */}
      <section
        className="vrmb-shell vrmb-grid vrmb-chapter vrmb-coda"
        aria-labelledby="vrmb-coda-title"
      >
        <p className="vrmb-kicker" data-fade>
          02
        </p>
        <h2 id="vrmb-coda-title" className="vrmb-h2" data-fade>
          From documentary to instrument
        </h2>
        <div className="vrmb-copy" data-fade>
          <p>{codaBody}</p>
        </div>
        <div className="vrmb-strip" data-fade>
          <VrmbParticleStrip />
        </div>
      </section>

      {/* 8 · Plate II — credits */}
      <section
        className="vrmb-shell vrmb-grid vrmb-chapter vrmb-credits"
        aria-labelledby="vrmb-credits-title"
      >
        <h2 id="vrmb-credits-title" className="vrmb-h2" data-fade>
          Made by three students
        </h2>
        <dl className="vrmb-credit-list" data-fade>
          <div>
            <dt>Program development &amp; scene construction</dt>
            <dd>Xuyuan Liu</dd>
          </div>
          <div>
            <dt>Music production</dt>
            <dd>Savino Go</dd>
          </div>
          <div>
            <dt>Art assets</dt>
            <dd>Katherine Chambers</dd>
          </div>
          <div>
            <dt>Institution</dt>
            <dd>Oberlin College</dd>
          </div>
        </dl>
        <figure className="vrmb-plate2" data-fade>
          <div className="vrmb-plate2-frame">
            <Image
              src={poster.image}
              alt="The original credits poster: the specimen butterfly above the title 'VR Emperor Butterfly' and the team credits"
              width={1192}
              height={1507}
              sizes="(max-width: 809px) 100vw, 420px"
            />
          </div>
          <figcaption>
            <span className="vrmb-index">Plate II</span> — original credits
            poster, Winter Term 2023
          </figcaption>
        </figure>
      </section>

      {/* adjacent nav — reused verbatim from the poster template */}
      <nav className="poster-nav" aria-label="Adjacent projects">
        {prev ? (
          <Link href={`/work/${prev.slug}`} className="poster-nav-item prev">
            {prev.cover && (
              <span className="poster-nav-thumb">
                <Image src={prev.cover} alt="" width={120} height={88} />
              </span>
            )}
            <span>
              <span className="poster-nav-label">Previous</span>
              <span className="poster-nav-title">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/work/${next.slug}`} className="poster-nav-item next">
            <span>
              <span className="poster-nav-label">Next</span>
              <span className="poster-nav-title">{next.title}</span>
            </span>
            {next.cover && (
              <span className="poster-nav-thumb">
                <Image src={next.cover} alt="" width={120} height={88} />
              </span>
            )}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

// Derived assets in public/media/work/vr (all crops pixel-probed on 2026-07-02
// with a canvas scan of the original Framer assets; rects are source-pixel
// exact, with measured near-black letterbox bars trimmed):
//   specimen.png        851x606 <- NwtTH2…png  x171 y52   (butterfly bbox
//                       x201-991 y82-627 + white margin; bg is pure #ffffff)
//   editor-scene.png    915x603 <- eBiTIT…png  x48  y103
//   render-pov.jpg      910x525 <- eBiTIT…png  x48  y777
//   meadow-a.jpg        522x295 <- eBiTIT…png  x48  y1331
//   meadow-b.jpg        519x294 <- eBiTIT…png  x605 y1332
//   colony-sky.jpg      902x512 <- zybEC…png   x61  y65
//   sky-sun.jpg         535x299 <- zybEC…png   x54  y600
//   sky-swarm.jpg       534x291 <- zybEC…png   x594 y601
//   exhibit-headset.jpg 472x630 <- WLu4tw…png  x2   y3    (white border cut)
//   exhibit-wings.jpg   469x625 <- q6fhW0…png  x3   y2    (white border cut)
