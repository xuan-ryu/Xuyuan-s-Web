import Image from "next/image";
import type { Project } from "@/data/projects";
import { OffscreenVideo } from "./ui/offscreen-video";
import { RoperGuessVsAmerica } from "./roper-guess-vs-america";
import { RoperCheckpointDiagram } from "./roper-checkpoint-diagram";
import { roperSamplePoll } from "./roper-poll-data";
import { stripCssComments } from "@/lib/css-sanitize";

// "The Ledger and the Weathervane" — Roper Center's bespoke case layout
// (spec-roper.json). The page is a quiet archival ledger: paper ground,
// hairline tabular rhythm, mono numerals, campaign-blue dates. One
// interactive Guess-vs-America module carries the product's pedagogy; one
// hairline diagram shows the signature decision; one full-bleed ink band
// screens the prototype video. All red on the page is the single seal-red
// ACTUAL marker inside the guess module. data/projects.ts is read as-is
// (copy untouched).
//
// PALETTE — derived from Campaign Weathervane's own branding board
// (public/media/work/roper/ch2-4.png, swatches 01–05: #D9534F red,
// #39499E royal blue, #F4E3B8 parchment, #737373 gray, #1C3D6E navy).
// The product's interactive royal blue is the case accent; its deep
// archive navy is the static detail. The brand red stays reserved — the
// page's one red moment remains the seal-red ACTUAL marker.
//
// GRID (named first): container `min(1440px, 100% − 2·clamp(24px,5vw,72px))`,
// 12 columns, gutter clamp(18px,1.6vw,28px), 8px baseline; ledger rows pad
// 40px; sections pad 96–160px. Rails: index cols 1–3, claims cols 4–10,
// copy cols 4–9 (≤60ch), inline figures cols 4–12, full evidence cols 1–12.
// Tablet (810–1079): 8 cols, rails stack. Phone (≤809): one reading column.

const roperCriticalCss = `
.roper-case-page {
  --roper-gutter: clamp(18px, 1.6vw, 28px);
  --roper-margin: clamp(24px, 5vw, 72px);
  /* case palette — Campaign Weathervane brand board (ch2-4.png) */
  --case-accent: #39499e; /* the product's royal blue: buttons, poll bars, logo */
  --case-accent-soft: color-mix(in srgb, var(--case-accent) 14%, transparent);
  --case-detail: #1c3d6e; /* the year-wheel's deep archive navy */
  background: var(--paper);
  color: var(--ink-950);
  overflow: clip;
}
.roper-case-page p { text-wrap: pretty; }
.roper-case-page img,
.roper-case-page video { display: block; }
.roper-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
.roper-shell {
  box-sizing: border-box;
  width: min(1440px, 100% - 2 * var(--roper-margin));
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--roper-gutter);
}

/* ── shared type roles ─────────────────────────────────────────── */
.roper-index {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  font-weight: 400;
  letter-spacing: var(--track-eyebrow);
  text-transform: uppercase;
  color: var(--stone);
}
.roper-h2 {
  margin: 0;
  font-family: var(--font-text);
  font-size: var(--text-heading);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.14;
  color: var(--ink-950);
}
.roper-copy {
  display: grid;
  gap: 18px;
  align-content: start;
}
.roper-copy p {
  margin: 0;
  max-width: 60ch;
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.6;
  color: var(--ink-800);
}
.roper-mono-caption {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  font-weight: 400;
  letter-spacing: var(--track-caps);
  text-transform: uppercase;
  color: var(--stone);
}

/* ── sections scaffold ─────────────────────────────────────────── */
.roper-sec > .roper-shell {
  border-top: 1px solid var(--rule);
  padding-top: clamp(80px, 8.5vw, 120px);
  padding-bottom: clamp(88px, 10vw, 136px);
  row-gap: clamp(32px, 4vw, 52px);
}
.roper-sec > .roper-shell > .roper-index {
  grid-column: 1 / span 3;
  padding-top: 0.5em;
}
.roper-sec > .roper-shell > .roper-h2 {
  grid-column: 4 / span 7;
  max-width: 21em;
}
.roper-sec > .roper-shell > .roper-copy { grid-column: 4 / span 6; }

/* ── 00 · hero masthead ────────────────────────────────────────── */
.roper-hero > .roper-shell {
  padding-top: clamp(120px, 10vw, 168px);
  padding-bottom: clamp(64px, 7vw, 104px);
}
.roper-hero h1 {
  grid-column: 1 / -1;
  grid-row: 1;
  margin: 0 0 clamp(40px, 4.5vw, 64px);
  font-family: var(--font-condensed);
  font-size: var(--text-display-2);
  font-weight: 300;
  letter-spacing: var(--track-display);
  line-height: var(--leading-display);
  text-transform: uppercase;
  color: var(--ink-950);
}
.roper-hero-deck {
  grid-column: 1 / span 5;
  grid-row: 2;
  margin: 0;
  max-width: 24em;
  font-size: var(--text-lead);
  font-weight: 300;
  letter-spacing: 0;
  line-height: 1.45;
  color: var(--ink-800);
}
.roper-hero-media {
  grid-column: 6 / -1;
  grid-row: 2 / span 2;
  min-width: 0;
}
.roper-meta {
  grid-column: 1 / span 5;
  grid-row: 3;
  align-self: end;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: clamp(28px, 3vw, 44px) 0 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}
.roper-meta > div {
  min-width: 0;
  padding: 16px 20px 16px 0;
  border-bottom: 1px solid var(--rule);
}
.roper-meta > div:nth-child(odd) { border-right: 1px solid var(--rule); }
.roper-meta > div:nth-child(even) { padding-left: 20px; }
.roper-meta > div:nth-last-child(-n + 2) { border-bottom: 0; }
.roper-meta dt {
  margin: 0 0 6px;
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--stone);
}
.roper-meta dd {
  margin: 0;
  font-size: var(--text-meta);
  line-height: 1.5;
  color: var(--ink-800);
}
.roper-meta dd.is-accent {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--case-accent);
}
.roper-hero-frame {
  margin: 0;
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px solid var(--rule);
  border-radius: var(--radius-media);
  background: var(--paper-warm);
}
.roper-hero-frame img { object-fit: cover; }
/* PollRule — the 1984 result as a typographic rule (shared constant) */
.roper-pollrule { margin-top: 18px; }
.roper-pollrule-bar {
  display: flex;
  gap: 3px;
  height: 2px;
}
.roper-pollrule-bar span {
  height: 2px;
  background: var(--stone);
  opacity: 0.45;
}
.roper-pollrule-bar span.is-lead {
  background: var(--case-detail);
  opacity: 1;
}
.roper-pollrule-labels {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 10px;
}

/* ── 02 · guess vs. america inset ──────────────────────────────── */
.roper-weathervane > .roper-shell {
  padding-top: clamp(96px, 11vw, 160px);
  padding-bottom: clamp(96px, 11vw, 160px);
}
.roper-guess-inset {
  grid-column: 2 / span 10;
  background: var(--paper-warm);
  border-radius: var(--radius-major);
  padding: clamp(28px, 4.5vw, 72px);
}
.roper-guess-inset > .roper-index { margin-bottom: 20px; }
.roper-guess-head {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.9fr);
  gap: clamp(24px, 4vw, 72px);
  align-items: start;
  margin: 0 0 clamp(36px, 4.5vw, 60px);
}
.roper-guess-head .roper-h2 { max-width: 15em; }
.roper-guess-head .roper-copy p { font-size: var(--text-meta); line-height: 1.65; }
.roper-guess { display: grid; gap: clamp(24px, 3vw, 36px); }
.roper-guess-q {
  margin: 0;
  max-width: 36em;
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.3;
  color: var(--ink-950);
}
.roper-guess-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 20px 40px;
}
.roper-guess-sliderbox { flex: 1 1 320px; max-width: 560px; }
.roper-guess-sliderlabel {
  display: block;
  margin-bottom: 6px;
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--stone);
}
.roper-guess-sliderrow {
  display: flex;
  align-items: center;
  gap: 16px;
}
.roper-guess-range {
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  min-width: 0;
  height: 48px; /* touch/pointer hit area */
  margin: 0;
  background: transparent;
  cursor: pointer;
}
.roper-guess-range:disabled { cursor: default; }
.roper-guess-range::-webkit-slider-runnable-track {
  height: 2px;
  background: var(--case-accent-soft);
}
.roper-guess-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  margin-top: -8px;
  border: 0;
  border-radius: 50%;
  background: var(--case-accent);
}
.roper-guess-range::-moz-range-track {
  height: 2px;
  background: var(--case-accent-soft);
}
.roper-guess-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border: 0;
  border-radius: 50%;
  background: var(--case-accent);
}
.roper-guess-range:focus-visible {
  outline: var(--focus-ring);
  outline-color: var(--case-accent);
  outline-offset: var(--focus-offset);
  border-radius: 2px;
}
.roper-guess-out {
  min-width: 3.5ch;
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  color: var(--ink-950);
}
.roper-guess-bars { display: grid; gap: 22px; margin-top: 6px; }
.roper-guess-bar {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr) 56px;
  align-items: center;
  gap: 18px;
}
.roper-guess-bar.is-lead { margin-block: 14px 6px; }
.roper-guess-bar-label {
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--ink-800);
}
.roper-guess-track { position: relative; height: 14px; }
.roper-guess-track::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: calc(50% - 0.5px);
  height: 1px;
  background: var(--rule);
}
.roper-guess-fill {
  position: absolute;
  left: 0;
  top: calc(50% - 1px);
  width: calc(var(--pct) * 1%);
  height: 2px;
  background: var(--case-accent);
  transform: scaleX(0);
  transform-origin: left center;
}
.roper-guess.is-revealed .roper-guess-fill {
  transform: scaleX(1);
  transition: transform 0.6s var(--ease-reveal);
  transition-delay: calc(var(--i) * 120ms);
}
.roper-guess-num {
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  color: var(--ink-950);
  text-align: right;
  opacity: 0;
}
.roper-guess.is-revealed .roper-guess-num {
  opacity: 1;
  transition: opacity 0.5s var(--ease-standard);
  transition-delay: calc(var(--i) * 120ms + 260ms);
}
.roper-guess-tick {
  position: absolute;
  top: calc(50% - 7px);
  width: 1px;
  height: 14px;
  background: var(--ink-950);
}
.roper-guess-tick::after {
  content: "YOU";
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--stone);
}
/* the page's single red moment — the prototype's 1984 figure landing */
.roper-guess-actual {
  position: absolute;
  top: calc(50% - 9px);
  width: 2px;
  height: 18px;
  background: var(--seal-red);
  opacity: 0;
}
.roper-guess-actual::after {
  content: "ACTUAL";
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--seal-red);
}
.roper-guess.is-revealed .roper-guess-actual {
  opacity: 1;
  transition: opacity 0.4s var(--ease-standard) 0.74s;
}
.roper-guess-verdict {
  margin: 2px 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-caps);
  text-transform: uppercase;
  color: var(--stone);
  opacity: 0;
}
.roper-guess.is-revealed .roper-guess-verdict {
  opacity: 1;
  transition: opacity 0.5s var(--ease-standard) 0.9s;
}
.roper-guess-source {
  margin: clamp(28px, 3vw, 40px) 0 0;
  padding-top: 14px;
  border-top: 1px solid var(--rule);
}

/* ── ledger rows (evidence + decisions) ────────────────────────── */
.roper-ledger {
  grid-column: 1 / -1;
  border-top: 1px solid var(--rule);
}
.roper-row {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--roper-gutter);
  row-gap: 28px;
  padding-block: 40px;
  border-bottom: 1px solid var(--rule);
}
.roper-row-side {
  grid-column: 1 / span 3;
  min-width: 0;
}
.roper-row-index {
  margin: 0 0 12px;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-eyebrow);
  color: var(--ink-950);
}
.roper-row-tags {
  margin: 0;
  max-width: 24ch;
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  line-height: 1.7;
  color: var(--stone);
}
.roper-row h3 {
  grid-column: 4 / span 6;
  margin: 0;
  font-family: var(--font-text);
  font-size: var(--text-title);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.28;
  color: var(--ink-950);
}
.roper-row > .roper-copy { grid-column: 4 / span 6; }

/* matted figures */
.roper-fig {
  grid-column: 4 / -1;
  margin: 0;
  padding: 20px;
  border: 1px solid var(--rule);
  border-radius: var(--radius-thumb);
  background: var(--paper-warm);
}
.roper-fig.is-full { grid-column: 1 / -1; }
.roper-fig img {
  width: 100%;
  height: auto;
  max-height: 640px;
  object-fit: contain;
}
.roper-fig figcaption {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--rule);
}

/* ── 04 · principles table ─────────────────────────────────────── */
.roper-principles-table {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 2px solid var(--ink-950);
  border-bottom: 1px solid var(--rule);
}
.roper-principle {
  position: relative;
  min-width: 0;
  padding: 28px 24px 32px 0;
}
.roper-principle + .roper-principle {
  padding-left: 24px;
}
/* left divider as a scaleY-able bar (a border can't be drawn in) */
.roper-principle + .roper-principle::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--rule);
  transform-origin: top;
}
.roper-principle-index {
  margin: 0 0 14px;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-eyebrow);
  color: var(--case-accent);
}
.roper-principle h3 {
  margin: 0 0 10px;
  font-family: var(--font-text);
  font-size: var(--text-title);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.2;
  color: var(--ink-950);
}
.roper-principle p {
  margin: 0;
  max-width: 24ch;
  font-size: var(--text-meta);
  line-height: 1.5;
  color: var(--stone);
}

/* ── 05 · checkpoint diagram ───────────────────────────────────── */
.roper-checkpoints > .roper-shell {
  padding-top: clamp(96px, 11vw, 160px);
  padding-bottom: clamp(96px, 11vw, 160px);
}
.roper-diagram {
  grid-column: 4 / -1;
  display: grid;
  gap: clamp(32px, 4vw, 48px);
  padding-block: 10px;
}
.roper-lane { min-width: 0; }
.roper-lane-label {
  margin: 0 0 14px;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  font-weight: 400;
  letter-spacing: var(--track-caps);
  text-transform: uppercase;
  color: var(--stone);
}
.roper-lane-track { position: relative; height: 4px; }
.roper-lane-track::before,
.roper-seg::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: calc(50% - 0.5px);
  height: 1px;
  background: var(--rule);
}
.roper-lane-fill {
  position: absolute;
  inset: 0;
  background: var(--ink-950);
  transform: scaleX(0);
  transform-origin: left center;
}
.roper-diagram.is-run .roper-lane-fill.is-before {
  transform: scaleX(1);
  transition: transform 1.2s var(--ease-standard) 0.1s;
}
.roper-lane-segs { display: flex; gap: 10px; }
.roper-seg {
  position: relative;
  flex: 1;
  height: 4px;
}
.roper-seg-fill {
  position: absolute;
  inset: 0;
  background: var(--case-accent);
  transform: scaleX(0);
  transform-origin: left center;
}
.roper-diagram.is-run .roper-seg-fill {
  transform: scaleX(1);
  transition: transform 0.5s var(--ease-reveal);
  transition-delay: calc(var(--i) * 200ms + 350ms);
}
.roper-seg-tick {
  position: absolute;
  right: 2px;
  bottom: calc(100% + 6px);
  width: 12px;
  height: 12px;
  color: var(--case-detail);
  opacity: 0;
  transform: translateY(3px);
}
.roper-diagram.is-run .roper-seg-tick {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.35s var(--ease-standard),
    transform 0.35s var(--ease-standard);
  transition-delay: calc(var(--i) * 200ms + 700ms);
}

/* ── 07 · screening band (full-bleed ink) ──────────────────────── */
.roper-screening {
  background: var(--ink-950);
  color: var(--paper);
}
.roper-screening > .roper-shell {
  border-top: 0;
  padding-top: clamp(88px, 10vw, 128px);
  padding-bottom: clamp(88px, 10vw, 128px);
}
.roper-screening .roper-index { color: rgba(255, 255, 255, 0.6); }
.roper-screening .roper-h2 { color: var(--paper); }
.roper-reel-wrap {
  grid-column: 2 / span 10;
  margin: clamp(12px, 2vw, 24px) 0 0;
  min-width: 0;
}
.roper-reel {
  width: 100%;
  height: auto;
  border: 1px solid var(--rule-dark);
  border-radius: var(--radius-media);
  background: var(--ink-950);
}
.roper-reel-caption {
  margin: 16px 0 0;
  color: rgba(255, 255, 255, 0.5);
}

/* ── 08 · closing ledger ───────────────────────────────────────── */
.roper-close > .roper-shell {
  padding-top: clamp(96px, 11vw, 160px);
  padding-bottom: clamp(110px, 12vw, 170px);
}
.roper-deliverables {
  grid-column: 4 / span 7;
  border-top: 1px solid var(--rule);
}
.roper-deliverable {
  position: relative;
  display: grid;
  grid-template-columns: 56px minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 20px;
  align-items: baseline;
  padding-block: 22px;
}
/* bottom hairline as a scaleX-able bar (a border can't be drawn in) */
.roper-deliverable::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--rule);
  transform-origin: left;
}
.roper-deliverable-index {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-eyebrow);
  color: var(--case-accent);
}
.roper-deliverable h3 {
  margin: 0;
  font-family: var(--font-text);
  font-size: var(--text-title);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.25;
  color: var(--ink-950);
}
.roper-deliverable p {
  margin: 0;
  font-size: var(--text-meta);
  line-height: 1.5;
  color: var(--stone);
}

/* ── tablet (810–1079): rails collapse, 8 cols ─────────────────── */
@media (max-width: 1079.98px) {
  .roper-shell { grid-template-columns: repeat(8, minmax(0, 1fr)); }
  .roper-sec > .roper-shell { row-gap: 28px; }
  .roper-sec > .roper-shell > .roper-index { padding-top: 0; }
  .roper-sec > .roper-shell > .roper-index,
  .roper-sec > .roper-shell > .roper-h2,
  .roper-sec > .roper-shell > .roper-copy,
  .roper-hero-deck,
  .roper-hero-media,
  .roper-meta,
  .roper-guess-inset,
  .roper-diagram,
  .roper-reel-wrap,
  .roper-deliverables {
    grid-column: 1 / -1;
    grid-row: auto;
  }
  .roper-hero-media { margin-top: 8px; }
  .roper-meta { max-width: 640px; }
  .roper-row {
    grid-template-columns: repeat(8, minmax(0, 1fr));
    row-gap: 20px;
  }
  .roper-row-side {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 18px;
  }
  .roper-row-index { margin: 0; }
  .roper-row-tags { max-width: none; }
  .roper-row h3,
  .roper-row > .roper-copy,
  .roper-fig {
    grid-column: 1 / -1;
  }
  .roper-guess-head { grid-template-columns: 1fr; gap: 20px; }
  .roper-principles-table { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .roper-principle { padding: 24px 20px 26px 0; }
  .roper-principle:nth-child(even) { padding-left: 20px; }
  .roper-principle:nth-child(odd) { padding-left: 0; }
  .roper-principle:nth-child(odd)::before { content: none; }
  .roper-principle:nth-child(n + 3) { border-top: 1px solid var(--rule); }
}

/* ── phone (≤809): one reading column ──────────────────────────── */
@media (max-width: 809.98px) {
  .roper-shell { grid-template-columns: minmax(0, 1fr); }
  .roper-hero > .roper-shell { padding-top: 104px; }
  .roper-hero h1 { margin-bottom: 30px; }
  .roper-meta { grid-template-columns: 1fr; max-width: none; }
  .roper-meta > div,
  .roper-meta > div:nth-child(even) {
    padding-left: 0;
    padding-right: 0;
    border-right: 0;
  }
  .roper-meta > div:nth-last-child(-n + 2) { border-bottom: 1px solid var(--rule); }
  .roper-meta > div:last-child { border-bottom: 0; }
  .roper-guess-inset { padding: 24px 20px 28px; border-radius: var(--radius-glass); }
  .roper-guess-bar {
    grid-template-columns: 84px minmax(0, 1fr) 44px;
    gap: 12px;
  }
  .roper-guess-controls { align-items: stretch; flex-direction: column; }
  .roper-guess-sliderbox { max-width: none; }
  .roper-principles-table { grid-template-columns: 1fr; }
  .roper-principle,
  .roper-principle:nth-child(even) {
    padding: 20px 0 22px;
  }
  .roper-principle + .roper-principle::before { content: none; }
  .roper-principle:nth-child(n + 2) { border-top: 1px solid var(--rule); }
  .roper-principle p { max-width: none; }
  .roper-fig { padding: 12px; }
  .roper-fig figcaption { margin-top: 12px; }
  .roper-deliverable {
    grid-template-columns: 40px minmax(0, 1fr);
    row-gap: 6px;
  }
  .roper-deliverable p { grid-column: 2; }
}

/* ── Assembly on arrival ──────────────────────────────────────────
   FadeReveal adds .is-visible to each [data-fade] container on enter;
   the container runs the global fadeUp, then ~200ms later its parts
   assemble in reading order — the hero PollRule segments grow from the
   left (the lead settling last), the four principle cells rise left→
   right with their dividers drawing down, and the closing deliverables
   rise in sequence with each bottom hairline drawing in. Zero new JS,
   transform+opacity only. Every hidden initial state lives inside
   @media (prefers-reduced-motion: no-preference), so reduced motion —
   and the no-JS / forced-visible fallback — shows the finished layout. */
@keyframes roperBarGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes roperCellRise {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes roperVDraw { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes roperRowRise {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes roperHDraw { from { transform: scaleX(0); } to { transform: scaleX(1); } }

@media (prefers-reduced-motion: no-preference) {
  /* 01 · hero PollRule — segments grow from the left, the lead settles last */
  .roper-case-page .roper-hero-media[data-fade] .roper-pollrule-bar span {
    transform: scaleX(0);
    transform-origin: left;
    --pbd: 0ms;
  }
  .roper-case-page .roper-hero-media[data-fade] .roper-pollrule-bar span:nth-child(2) { --pbd: 90ms; }
  .roper-case-page .roper-hero-media[data-fade] .roper-pollrule-bar span:nth-child(3) { --pbd: 180ms; }
  .roper-case-page .roper-hero-media[data-fade] .roper-pollrule-bar span.is-lead { --pbd: 300ms; }
  .roper-case-page .roper-hero-media[data-fade].is-visible .roper-pollrule-bar span {
    animation: roperBarGrow 0.5s var(--ease-silk) forwards;
    animation-delay: calc(240ms + var(--pbd, 0ms));
  }

  /* 04 · principle cells rise left→right, each divider drawing down with it */
  .roper-case-page .roper-principles-table[data-fade] .roper-principle {
    opacity: 0;
    transform: translateY(12px);
  }
  .roper-case-page .roper-principles-table[data-fade] .roper-principle::before {
    transform: scaleY(0);
  }
  .roper-case-page .roper-principles-table[data-fade] .roper-principle:nth-child(2) { --rpd: 100ms; }
  .roper-case-page .roper-principles-table[data-fade] .roper-principle:nth-child(3) { --rpd: 200ms; }
  .roper-case-page .roper-principles-table[data-fade] .roper-principle:nth-child(4) { --rpd: 300ms; }
  .roper-case-page .roper-principles-table[data-fade].is-visible .roper-principle {
    animation: roperCellRise 0.5s var(--ease-spring) forwards;
    animation-delay: calc(200ms + var(--rpd, 0ms));
  }
  .roper-case-page .roper-principles-table[data-fade].is-visible .roper-principle::before {
    animation: roperVDraw 0.44s var(--ease-silk) forwards;
    animation-delay: calc(240ms + var(--rpd, 0ms));
  }

  /* 07 · closing deliverables rise in sequence, each bottom hairline drawing in */
  .roper-case-page .roper-deliverables[data-fade] .roper-deliverable {
    opacity: 0;
    transform: translateY(12px);
  }
  .roper-case-page .roper-deliverables[data-fade] .roper-deliverable::after {
    transform: scaleX(0);
  }
  .roper-case-page .roper-deliverables[data-fade] .roper-deliverable:nth-child(2) { --rdd: 120ms; }
  .roper-case-page .roper-deliverables[data-fade] .roper-deliverable:nth-child(3) { --rdd: 240ms; }
  .roper-case-page .roper-deliverables[data-fade].is-visible .roper-deliverable {
    animation: roperRowRise 0.5s var(--ease-spring) forwards;
    animation-delay: calc(200ms + var(--rdd, 0ms));
  }
  .roper-case-page .roper-deliverables[data-fade].is-visible .roper-deliverable::after {
    animation: roperHDraw 0.44s var(--ease-silk) forwards;
    animation-delay: calc(250ms + var(--rdd, 0ms));
  }
}

/* ── reduced motion: charts render final state, no stagger ─────── */
@media (prefers-reduced-motion: reduce) {
  .roper-guess.is-revealed .roper-guess-fill,
  .roper-guess.is-revealed .roper-guess-num,
  .roper-guess.is-revealed .roper-guess-actual,
  .roper-guess.is-revealed .roper-guess-verdict,
  .roper-diagram.is-run .roper-lane-fill.is-before,
  .roper-diagram.is-run .roper-seg-fill,
  .roper-diagram.is-run .roper-seg-tick {
    transition: none;
  }
}
`;

const principles = [
  // terms + definitions quoted from chapter 1 §4 ("The Moment Complaints
  // Became a Design Compass") in data/projects.ts — no invented data.
  { term: "Clarity", note: "Navigation and progress must be unambiguous." },
  { term: "Feedback", note: "Immediate confirmation of understanding." },
  { term: "Motivation", note: "Gameplay should reinforce effort, not distract." },
  { term: "Outcomes", note: "Design must point back to learning goals." },
];

// figure mats for the evidence ledger (chapter 1, rows 01–03)
const evidenceFigs = [
  {
    caption: "Fig. 01 — Research plan, fall 2024",
    alt: "Project Gantt chart for the Cornell Roper Center engagement: UX research, heuristic evaluation, usability testing, and UX design tracks from September to December 2024.",
    width: 3056,
    height: 1476,
    full: false,
  },
  {
    caption: "Fig. 02 — Annotated heuristic board · Campaign Stop",
    alt: "Annotated heuristic evaluation board for the Campaign Stop page, listing problems in flexibility, documentation, and visibility of system status beside screenshots of the existing tool.",
    width: 2379,
    height: 1332,
    full: true,
  },
  {
    caption: "Fig. 03 — Recruitment, protocols and post-surveys",
    alt: "Research drive of user-testing artifacts: participant protocols, recruitment emails and contact sheets, session recordings, and post-test surveys.",
    width: 3345,
    height: 1236,
    full: false,
  },
];

// figure mats for the decisions ledger (chapter 2, rows 04–05)
const decisionFigs = [
  {
    caption: "Fig. 06 — User testing phase 2 · usability issues",
    alt: "User testing phase two findings: the progress bar misunderstood as a question tracker, repetitive question types reducing engagement, overlooked favorability changes, and unclear navigation.",
    width: 2769,
    height: 1557,
    full: false,
  },
  {
    caption: "Fig. 07 — The reveal screen, hi-fi",
    alt: "Hi-fi reveal screen of Campaign Weathervane: the reader's response beside the actual 1984 poll response, with the Weathervane favorability sign in the center.",
    width: 2244,
    height: 1451,
    full: false,
  },
];

export function RoperCaseLayout({ project }: { project: Project }) {
  const poll = roperSamplePoll;

  // the summary paragraph rendered ONCE, split at its natural sentence break
  // (blurb/summary stay untouched in data/projects.ts — the work index and
  // generateMetadata read them)
  const summary = project.summary?.[0] ?? project.blurb;
  const splitAt = summary.indexOf("I uncovered");
  const briefParas =
    splitAt > 0
      ? [summary.slice(0, splitAt).trim(), summary.slice(splitAt).trim()]
      : [summary];

  const chapter1 = project.chapters?.[0]?.sections ?? [];
  const chapter2 = project.chapters?.[1]?.sections ?? [];
  const evidence = chapter1.slice(0, 3);
  const principlesSection = chapter1[3];
  const checkpointSection = chapter2[0];
  const decisions = chapter2.slice(1, 3);
  const closeSection = chapter2[3];
  const reel = project.moment?.videos?.[0];

  const meta: Array<[string, string, boolean]> = [
    ["Role", project.role, false],
    ["Duration", project.duration, true],
    ["Type", project.type, false],
    ["Teams", project.teams, false],
  ];

  return (
    <article className="roper-case-page">
      <style
        dangerouslySetInnerHTML={{
          __html: stripCssComments(roperCriticalCss),
        }}
      />

      {/* 00 · archive masthead */}
      <header className="roper-hero">
        <div className="roper-shell">
          <h1 data-fade>{project.title}</h1>
          <p className="roper-hero-deck" data-fade>
            Redesigning Campaign Weathervane — the Roper Center’s teaching
            simulation built on decades of real archived polls — from
            quiz-like clicking into structured learning.
          </p>
          <div className="roper-hero-media" data-fade>
            <figure className="roper-hero-frame">
              {project.cover && (
                <Image
                  src={project.cover}
                  alt="Campaign Weathervane welcome screen — “Welcome, Time-Traveler!” above the selected-year wheel set to 1984."
                  fill
                  sizes="(max-width: 1079px) 92vw, 780px"
                  priority
                />
              )}
            </figure>
            <div className="roper-pollrule" aria-hidden="true">
              <div className="roper-pollrule-bar">
                {poll.options.map((option, index) => (
                  <span
                    key={option.label}
                    className={index === poll.leadIndex ? "is-lead" : undefined}
                    style={{ width: `${option.pct}%` }}
                  />
                ))}
              </div>
              <div className="roper-pollrule-labels roper-mono-caption">
                <span>The prototype’s sample poll · 1984</span>
                <span>
                  {poll.options
                    .map((option) => `${option.label} ${option.pct}`)
                    .join(" · ")}
                </span>
              </div>
            </div>
          </div>
          <dl className="roper-meta" data-fade>
            {meta.map(([label, value, accent]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd className={accent ? "is-accent" : undefined}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* 01 · the brief */}
      <section className="roper-sec roper-brief" aria-labelledby="roper-brief-title">
        <div className="roper-shell">
          <p className="roper-index" data-fade>
            01 / The brief
          </p>
          <h2 className="roper-h2" id="roper-brief-title" data-fade>
            The tool measured activity, not comprehension.
          </h2>
          <div className="roper-copy" data-fade>
            {briefParas.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 02 · guess vs. america, 1984 */}
      <section
        className="roper-sec roper-weathervane"
        aria-labelledby="roper-guess-title"
      >
        <div className="roper-shell">
          <div className="roper-guess-inset" data-fade>
            <p className="roper-index">02 / Guess vs. America, 1984</p>
            <div className="roper-guess-head">
              <h2 className="roper-h2" id="roper-guess-title">
                The game asks one honest question: what did America think?
              </h2>
              <div className="roper-copy">
                <p>
                  The product’s core loop, rebuilt in this page’s own ink:
                  read a real question from the archive, commit to a guess,
                  then meet the number America actually gave. The figures
                  below are the prototype’s own sample question — proof of
                  progress a student could believe in.
                </p>
              </div>
            </div>
            <RoperGuessVsAmerica />
            <p className="roper-guess-source roper-mono-caption">{poll.source}</p>
          </div>
        </div>
      </section>

      {/* 03 · evidence ledger */}
      <section className="roper-sec roper-evidence" aria-labelledby="roper-evidence-title">
        <div className="roper-shell">
          <p className="roper-index" data-fade>
            03 / What the audit found
          </p>
          <h2 className="roper-h2" id="roper-evidence-title" data-fade>
            Three passes over the same tool, one verdict.
          </h2>
          <div className="roper-ledger">
            {evidence.map((section, index) => {
              const fig = evidenceFigs[index];
              return (
                <div className="roper-row" key={section.heading} data-fade>
                  <div className="roper-row-side">
                    <p className="roper-row-index">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="roper-row-tags">{section.tags}</p>
                  </div>
                  <h3>{section.heading}</h3>
                  <div className="roper-copy">
                    {section.body.map((para) => (
                      <p key={para.slice(0, 24)}>{para}</p>
                    ))}
                  </div>
                  {section.image && fig && (
                    <figure className={`roper-fig${fig.full ? " is-full" : ""}`}>
                      <Image
                        src={section.image}
                        alt={fig.alt}
                        width={fig.width}
                        height={fig.height}
                        sizes={
                          fig.full
                            ? "(max-width: 809px) 100vw, 1392px"
                            : "(max-width: 809px) 100vw, (max-width: 1079px) 92vw, 1040px"
                        }
                      />
                      <figcaption className="roper-mono-caption">
                        {fig.caption}
                      </figcaption>
                    </figure>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04 · four principles */}
      {principlesSection && (
        <section
          className="roper-sec roper-principles"
          aria-labelledby="roper-principles-title"
        >
          <div className="roper-shell">
            <p className="roper-index" data-fade>
              04 / Four principles
            </p>
            <h2 className="roper-h2" id="roper-principles-title" data-fade>
              {principlesSection.heading}
            </h2>
            <div className="roper-principles-table" data-fade>
              {principles.map((principle, index) => (
                <div className="roper-principle" key={principle.term}>
                  <p className="roper-principle-index">P{index + 1}</p>
                  <h3>{principle.term}</h3>
                  <p>{principle.note}</p>
                </div>
              ))}
            </div>
            {principlesSection.image && (
              <figure className="roper-fig" data-fade>
                <Image
                  src={principlesSection.image}
                  alt="Affinity map from user testing round one: clustered sticky notes on question pages, campaign stops, signifiers, favorability chart, and educational prospects, with a written insights column."
                  width={2760}
                  height={1650}
                  sizes="(max-width: 809px) 100vw, (max-width: 1079px) 92vw, 1040px"
                />
                <figcaption className="roper-mono-caption">
                  Fig. 04 — Affinity map · user testing round 1
                </figcaption>
              </figure>
            )}
          </div>
        </section>
      )}

      {/* 05 · the signature decision */}
      {project.moment && (
        <section
          className="roper-sec roper-checkpoints"
          aria-labelledby="roper-checkpoints-title"
        >
          <div className="roper-shell">
            <p className="roper-index" data-fade>
              05 / The signature decision
            </p>
            <h2 className="roper-h2" id="roper-checkpoints-title" data-fade>
              A progress bar is a promise.
            </h2>
            <div className="roper-copy" data-fade>
              {project.moment.body.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
            <RoperCheckpointDiagram />
            {checkpointSection?.image && (
              <figure className="roper-fig is-full" data-fade>
                <Image
                  src={checkpointSection.image}
                  alt="Nine wireframe screens of Campaign Weathervane: year selection, campaign stop, question and answer flows, customization, and results — with the checkpoint progress bar called out."
                  width={5918}
                  height={4248}
                  sizes="(max-width: 809px) 100vw, 1392px"
                />
                <figcaption className="roper-mono-caption">
                  Fig. 05 — Checkpoint wireframes
                </figcaption>
              </figure>
            )}
          </div>
        </section>
      )}

      {/* 06 · the other decisions */}
      <section className="roper-sec roper-decisions" aria-labelledby="roper-decisions-title">
        <div className="roper-shell">
          <p className="roper-index" data-fade>
            06 / The other decisions
          </p>
          <h2 className="roper-h2" id="roper-decisions-title" data-fade>
            The loops that followed the checkpoints.
          </h2>
          <div className="roper-ledger">
            {decisions.map((section, index) => {
              const fig = decisionFigs[index];
              return (
                <div className="roper-row" key={section.heading} data-fade>
                  <div className="roper-row-side">
                    <p className="roper-row-index">
                      {String(index + 4).padStart(2, "0")}
                    </p>
                    <p className="roper-row-tags">{section.tags}</p>
                  </div>
                  <h3>{section.heading}</h3>
                  <div className="roper-copy">
                    {section.body.map((para) => (
                      <p key={para.slice(0, 24)}>{para}</p>
                    ))}
                  </div>
                  {section.image && fig && (
                    <figure className={`roper-fig${fig.full ? " is-full" : ""}`}>
                      <Image
                        src={section.image}
                        alt={fig.alt}
                        width={fig.width}
                        height={fig.height}
                        sizes="(max-width: 809px) 100vw, (max-width: 1079px) 92vw, 1040px"
                      />
                      <figcaption className="roper-mono-caption">
                        {fig.caption}
                      </figcaption>
                    </figure>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 07 · prototype walkthrough */}
      {reel && (
        <section
          className="roper-sec roper-screening"
          aria-labelledby="roper-screening-title"
        >
          <div className="roper-shell">
            <p className="roper-index" data-fade>
              07 / Prototype walkthrough
            </p>
            <h2 className="roper-h2" id="roper-screening-title" data-fade>
              The redesigned learning loop, from guess to evidence.
            </h2>
            <div className="roper-reel-wrap" data-fade>
              <OffscreenVideo
                className="roper-reel"
                src={reel.src}
                poster={project.cover}
                aria-label="Campaign Weathervane hi-fi prototype walkthrough: year selection, poll questions, and the guess-then-reveal loop."
              />
              <p className="roper-reel-caption roper-mono-caption">
                Campaign Weathervane · hi-fi prototype · fall 2024
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 08 · what roper kept */}
      <section className="roper-sec roper-close" aria-labelledby="roper-close-title">
        <div className="roper-shell">
          <p className="roper-index" data-fade>
            08 / What Roper kept
          </p>
          <h2 className="roper-h2" id="roper-close-title" data-fade>
            Their first evidence-based UX process.
          </h2>
          {closeSection && (
            <div className="roper-copy" data-fade>
              {closeSection.body.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          )}
          <div className="roper-deliverables" data-fade>
            {[
              [
                "Hi-fi prototype",
                "The redesigned simulation — checkpoints, feedback, and the reveal loop.",
              ],
              [
                "UI kit",
                "Branding, palette, type, and component patterns for the client’s team.",
              ],
              [
                "Research report",
                "Every choice traced to a pain point, every feature to a principle.",
              ],
            ].map(([item, note], index) => (
              <div className="roper-deliverable" key={item}>
                <p className="roper-deliverable-index">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3>{item}</h3>
                <p>{note}</p>
              </div>
            ))}
          </div>
          {closeSection?.image && (
            <figure className="roper-fig" data-fade>
              <Image
                src={closeSection.image}
                alt="UI kit and branding board for Campaign Weathervane: answer components, stacked poll bars, pie charts, the red-white-and-blue palette, type specimens, and illustrated campaign characters."
                width={2685}
                height={1413}
                sizes="(max-width: 809px) 100vw, (max-width: 1079px) 92vw, 1040px"
              />
              <figcaption className="roper-mono-caption">
                Fig. 08 — UI kit &amp; branding board
              </figcaption>
            </figure>
          )}
        </div>
      </section>
    </article>
  );
}
