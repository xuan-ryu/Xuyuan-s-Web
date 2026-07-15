import { Fragment } from "react";
import Image from "next/image";
import type { CaseSection, Project } from "@/data/projects";
import { CaseNext } from "@/components/case-next";
import { PulseScroll } from "./pulse-scroll";
import { PulsePartSwitch } from "./pulse-part-switch";
import { PulseComponentBrowser } from "./pulse-component-browser";
import { PulseCreativeBrief } from "./pulse-creative-brief";
import { PulseTokenChips } from "./pulse-token-chips";
import { Cta } from "./ui/cta";
import { InteractiveCue } from "./ui/interactive-cue";
import { OffscreenVideo } from "./ui/offscreen-video";
import { stripCssComments } from "@/lib/css-sanitize";
import { pulseForkCss } from "@/components/pulse-fork-styles";
import { pulseAssemblyCss } from "@/components/pulse-assembly-styles";
import {
  SHOT_W,
  SHOT_H,
  acts,
  meleeSources,
  ramps,
  typeScale,
  spacingTicks,
  tickerRows,
  ciSteps,
  proofTells,
  gateSteps,
  doctrineQuote,
  fileQuote,
} from "./pulse-content";

// Pulse case page — L2 composer (white editorial, product-first).
//
// The page: hero (product frame + proof band) → overview → the FORK (two
// door cards pick a reading track; both tracks render for no-JS/crawlers,
// the client switch hides one — rail part labels switch too) → Part 1 ·
// Product / Part 2 · Design engineering on the sticky case-map rail → the
// Turn (always visible) → adjacent case. Copy comes verbatim and POSITIONALLY from
// data/projects.ts (11 chapters — Part 1: 1.1/1.2/1.3, Part 2:
// 2.1/2.2/2.2A/2.2B/2.3/2.4/2.4A/2.5 — plus moment); this file only
// attaches evidence. Specimen data and
// verified numbers live in pulse-content.ts (L0). One figure rule: each
// claim gets its single strongest artifact — no restating a chapter's copy
// as a diagram, no showing the hero shot twice (2026-07-14 lean pass).
// Figures number per part like the chapter eyebrows (Fig. 1.n / Fig. 2.n;
// the shared Turn figure is unnumbered) so neither reading track ever
// shows a numbering jump.
//
// Grid: container = shared work shell (max 1440, --work-gutter, 12 cols,
// --work-grid-gap). Rail cols 1-2 (sticky, desktop); chapters in cols 3-12
// as a 10-col grid — copy 1-7 (≤62ch), asides 7-11, insets/full 1-11.
// Baseline 8px; authored values even px (1px hairlines + measured product
// recreations exempt; Pulse's fully-rounded pills are a product idiom).
//
// One-typeface rule: everything Manrope + tabular numerals; real mono ONLY
// for literal code (the commit ticker). Case accent = Pulse cyan
// (--case-accent #49e0f5 marks, --case-detail #0d7685 text — the 500 stop
// fails AA on the pale stage). ONE seal-red moment: the Turn's human gates.
//
// Choreography lives in <PulseScroll /> (scrubs + counters) and the
// [data-fade] assembly CSS. SERVER MARKUP IS THE FINAL STATE — reduced
// motion and no-JS read a finished page; motion only rewinds and replays.
// This file ships NO client JS of its own; the interactive artifacts
// (component browser, creative brief, token chips) are imported client
// components — don't inline them here.

/* ---- pulse css string ---- */
// One served stylesheet for the whole page (dangerouslySetInnerHTML via
// stripCssComments). Interior `── ` comments mark its own sections — grep
// them to slice; never add TSX banners inside the literal.
const pulseCss = `
/* ── Pulse case page — white editorial on the product's pale stage ──────
   Ground #f4f7f7 with faint cyan blooms; white cards, ink chrome, slate
   shadows. Product values scoped as --pp-*; case accent = Pulse cyan
   (--case-accent #49e0f5 for marks, --case-detail #0d7685 for text — the
   500 base fails AA as text on light ground, so text uses the 700 stop). */
.pulse-case-page {
  /* Pulse stage + surfaces */
  --pp-stage: #f4f7f7;
  --pp-canvas: #ffffff;
  --pp-ink: #1d1d1f;
  --pp-text-2: #44464a;
  --pp-text-3: #5f6369;
  /* faintest label tier — deep enough for AA (≥4.5:1) on the #f4f7f7 stage;
     the earlier #8a8e95 measured ~3.1:1 and failed on every 10-11px label */
  --pp-text-4: #6b6f75;
  /* hairlines in the same cool slate as the shadows — one light source */
  --pp-line: rgba(15, 23, 42, 0.08);
  --pp-line-strong: rgba(15, 23, 42, 0.16);
  --pp-glass: rgba(255, 255, 255, 0.38);
  /* global elevation triad geometry (globals.css --shadow-card/--shadow-lift),
     kept in Pulse's cool slate tint with alphas a step calmer for the pale
     stage — same physics, the page's own light. Media adds a third, deeper
     tier: real product evidence floats above page furniture. */
  --pp-shadow-rest: 0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.05);
  --pp-shadow-lift: 0 2px 6px rgba(15, 23, 42, 0.05), 0 16px 32px rgba(15, 23, 42, 0.07);
  --pp-shadow-media: 0 2px 4px rgba(15, 23, 42, 0.04), 0 12px 28px rgba(15, 23, 42, 0.07), 0 36px 72px rgba(15, 23, 42, 0.07);

  /* Pulse semantics */
  --pp-cyan: #49e0f5;
  --pp-cyan-600: #0ea5b8;
  --pp-cyan-dark: #0d7685;
  --pp-cyan-soft: #e5fbff;
  --pp-cyan-line: #b8f3fb;
  --pp-cyan-ring: rgba(73, 224, 245, 0.42);
  --pp-green: #43ba51;
  --pp-green-dark: #207d32;
  --pp-green-soft: #eff9f1;
  --pp-green-line: #abe2b3;
  --pp-blue-dark: #1a57b0;
  --pp-blue-soft: #eff5fe;
  --pp-blue-line: #b0cdfa;
  --pp-purple-dark: #4338ca;
  --pp-purple-soft: #f1f1fe;
  --pp-purple-line: #c7c9f8;
  --pp-amber-dark: #a1640b;
  --pp-amber-soft: #fef6e7;
  --pp-amber-line: #f7ce84;

  /* Case accent contract (owner rule 2026-07-05) */
  --case-accent: #49e0f5;
  --case-detail: var(--pp-cyan-dark);
  --icue-accent: var(--case-accent);

  /* One typeface (owner 字体统一 rule, 2026-07-04 + Pulse's own doctrine:
     the product literally aliases --font-mono to its sans and relies on
     tabular numerals). Every label/index/caption on this page renders in
     the text face; --pulse-mono exists so literal CODE artifacts (the
     commit stream) can opt back into real mono. */
  --pulse-mono: var(--font-text);

  position: relative;
  background: var(--pp-stage);
  color: var(--pp-ink);
}
.pulse-case-page > :not(.pulse-blooms):not(.pulse-navscrim) {
  position: relative;
  z-index: 1;
}
/* content fades out under the fixed transparent nav instead of colliding
   with its links (QA worst-defect; page-local — the header stays untouched).
   Sits above page content (z1) and blooms (z0), below the site header. */
.pulse-navscrim {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* balance point (owner bug report, two iterations): 96px ghosted
     headlines far below the links; 64px let cards interleave with them.
     72px with a 58% solid core covers the whole nav band and leaves only
     a ~30px transition — big type reads as sliding under a bar instead
     of growing a long ghost. */
  height: 72px;
  z-index: 50;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    var(--pp-stage) 58%,
    rgba(244, 247, 247, 0) 100%
  );
}
.pulse-case-page p {
  text-wrap: pretty;
}
.pulse-case-page figure {
  margin: 0;
}
.pulse-case-page [data-fade].is-visible {
  animation-delay: var(--d, 0ms);
}

/* ── The blooms: Pulse's soft cyan light, drifting very slowly ─────────── */
.pulse-blooms {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.pulse-bloom {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(73, 224, 245, 0.14), transparent 70%);
}
@media (prefers-reduced-motion: no-preference) {
  .pulse-bloom {
    animation: pulseBloomDrift 46s ease-in-out infinite alternate;
  }
}
.pulse-bloom:nth-child(1) { width: 780px; height: 780px; top: -240px; right: -180px; }
.pulse-bloom:nth-child(2) { width: 640px; height: 640px; top: 32%; left: -260px; animation-delay: -18s; }
.pulse-bloom:nth-child(3) { width: 560px; height: 560px; bottom: 4%; right: -140px; opacity: 0.8; animation-delay: -32s; }
@keyframes pulseBloomDrift {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-48px, 64px, 0); }
}

/* ── Hero: H1 + lede + meta (product frame styled in the 2026 edit) ────── */
.pulse-case-page .case-study-hero h1 {
  grid-column: 4 / 10;
  grid-row: 1;
  align-self: start;
  /* one-typeface rule: the H1 speaks the product's own display voice
     (Manrope 600), not the site's condensed poster face */
  font-family: var(--font-text);
  font-weight: 600;
  letter-spacing: -0.02em;
  text-transform: none;
  line-height: 0.98;
}
.pulse-case-page .case-hero-lede {
  grid-column: 4 / 9;
  grid-row: 2;
  max-width: 60ch;
}
.pulse-fig {
  font-style: normal;
  color: var(--case-detail);
  margin-right: 0.65em;
}

/* ── Summary + figures ledger ───────────────────────────────────────────── */
/* the shared summary slab is paper-white globally; on the Pulse stage it
   reads as an accidental seam — sit it directly on the stage instead.
   Its rules are redrawn as background strokes inset by the gutter: the
   real borders ran shell-edge to shell-edge, past the content column */
.pulse-case-page .proj-summary {
  background:
    linear-gradient(var(--pp-line-strong), var(--pp-line-strong))
      center top / calc(100% - 2 * var(--work-gutter)) 1px no-repeat,
    linear-gradient(var(--pp-line-strong), var(--pp-line-strong))
      center bottom / calc(100% - 2 * var(--work-gutter)) 1px no-repeat;
  border-top: 0;
  border-bottom: 0;
}

/* ── The acts: one shell, one persistent rail (cols 1-2), chapters in a
   10-col main (cols 3-12) ─────────────────────────────────────────────── */
.pulse-acts {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  margin: 0 auto;
  padding: 0 var(--work-gutter);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
}
.pulse-acts-main {
  grid-column: 3 / -1;
  min-width: 0;
}
.pulse-chapter {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  row-gap: clamp(56px, 6.5vw, 96px); /* must exceed the 44px intra-section gap */
  padding: calc(var(--gap-section) / 2) 0;
}
/* rail anchor targets land below the fixed nav band (72px scrim + air) */
.pulse-chapter[id],
.pulse-turn-wrap[id] {
  scroll-margin-top: 88px;
}
/* the rail's grid item stretches to the chapter's full height; the card
   inside it is the sticky element (sticky needs travel room) */
.pulse-rail {
  grid-column: 1 / 3;
  align-self: stretch;
}
.pulse-rail-card {
  position: sticky;
  top: clamp(96px, 12vh, 140px);
  box-sizing: border-box;
  padding: 14px 16px;
  border: 1px solid var(--pp-line);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.55);
}
.pulse-rail-head {
  display: block;
  font-family: var(--pulse-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-rail-card ol {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
}
.pulse-rail-part {
  display: block;
  margin: 14px 0 2px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  font-family: var(--font-text);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--case-detail);
  transition: color 0.2s var(--ease-silk);
}
.pulse-rail-part:hover {
  color: var(--pp-ink);
}
.pulse-rail-part:focus-visible {
  outline: 2px solid var(--pp-cyan-600);
  outline-offset: 2px;
}
.pulse-rail-part:first-child {
  margin-top: 8px;
}
.pulse-rail-part + ol {
  margin-top: 0;
}
.pulse-rail li {
  display: flex;
  align-items: baseline;
  padding: 5px 0;
  font-family: var(--pulse-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.04em;
  /* pending acts read at the AA label tier — the rail is real navigation
     now, so even its quietest state stays legible */
  color: var(--pp-text-4);
}
/* the rail is anchor navigation: each act links to its chapter */
.pulse-rail li a {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  align-items: baseline;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  border-radius: 4px;
  transition: color 0.2s var(--ease-silk);
}
.pulse-rail li a:hover {
  color: var(--pp-ink);
}
.pulse-rail li a:focus-visible {
  outline: 2px solid var(--pp-cyan-600);
  outline-offset: 2px;
}
.pulse-rail li i {
  font-style: normal;
  width: 24px;
  flex: none;
}
.pulse-rail li.is-done { color: var(--pp-text-3); }
.pulse-rail li.is-done::after {
  content: "✓";
  margin-left: auto;
  color: var(--pp-green-dark);
}
.pulse-rail li.is-run { color: var(--pp-cyan-dark); }
.pulse-rail li.is-run::after {
  content: "●";
  margin-left: auto;
}
.pulse-chapter-head {
  grid-column: 1 / -1;
  display: grid;
  row-gap: clamp(14px, 1.6vw, 22px);
}
.pulse-chapter-index {
  margin: 0;
  font-family: var(--pulse-mono);
  font-size: var(--text-label);
  letter-spacing: var(--track-eyebrow);
  text-transform: uppercase;
  color: var(--case-detail);
}
.pulse-chapter-claim {
  margin: 0;
  max-width: 24em;
  font-family: var(--font-text);
  font-size: var(--text-display-3);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: 0;
  color: var(--pp-ink);
  text-wrap: balance;
}
.pulse-chapter-headrule {
  height: 1px;
  margin-top: clamp(8px, 1.2vw, 16px);
  background: var(--pp-line-strong);
}

/* ── Sections inside a chapter: copy 1-7 · aside 7-11 · inset/full 1-11 ── */
.pulse-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  row-gap: clamp(28px, 3.2vw, 44px);
  align-items: start;
}
.pulse-section-copy {
  grid-column: 1 / 7;
}
.pulse-section-tags {
  margin: 0 0 12px;
  font-size: var(--text-label);
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-section-copy h3 {
  margin: 0 0 clamp(16px, 2vw, 26px);
  font-family: var(--font-text);
  font-size: var(--text-title);
  font-weight: 500;
  line-height: 1.28;
  color: var(--pp-ink);
}
.pulse-section-copy p {
  margin: 0;
  max-width: 62ch;
  font-size: var(--text-body);
  line-height: 1.62;
  color: rgba(29, 29, 31, 0.82);
}
.pulse-section-copy p + p {
  margin-top: 22px;
}
.pulse-section-aside {
  grid-column: 7 / -1;
}
.pulse-section-inset {
  grid-column: 1 / -1;
  max-width: 1080px;
}
/* multi-node flow diagrams: full-row placement at a reading width —
   they are the act's anchor, not a sidebar card */
.pulse-inset-medium {
  grid-column: 1 / -1;
  max-width: 760px;
}
.pulse-section-full {
  grid-column: 1 / -1;
}
.pulse-fig-caption {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
  margin: 12px 0 0;
  font-family: var(--pulse-mono);
  font-size: var(--text-micro);
  line-height: 1.5;
  color: var(--pp-text-3);
}

/* ── Cards / bentos / shots (Pulse surface language) ────────────────────── */
.pulse-card {
  box-sizing: border-box;
  border: 1px solid var(--pp-line);
  border-radius: 12px;
  background: var(--pp-canvas);
  box-shadow: var(--pp-shadow-rest);
}
.pulse-specpad {
  padding: clamp(16px, 1.4vw, 22px);
}
.pulse-spec-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-family: var(--pulse-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-shot {
  overflow: hidden;
  border: 1px solid var(--pp-line);
  border-radius: 12px;
  background: var(--pp-canvas);
  box-shadow: var(--pp-shadow-rest);
}
.pulse-shot img {
  display: block;
}
.pulse-shot-head {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--pp-line);
  font-size: var(--text-micro);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-shot-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--work-grid-gap);
}
/* before/after takeover pair — a labeled column per state */
.pulse-shot-labeled {
  display: grid;
  gap: 8px;
  align-content: start;
}
/* per-column build annotation under the takeover pair — the intake/base
   facts live on the card itself (merged from the former flow figure) */
.pulse-shot-note {
  margin: 0;
  font-family: var(--pulse-mono);
  font-size: var(--text-micro);
  line-height: 1.5;
  color: var(--pp-text-3);
}
/* ── Ch. 01 — the calendar recording, shown whole ────────────────────────
   source is 1280×720 with ~34px pillarbox bars baked into each side
   (measured 2026-07-08); the 1212/720 box + cover crops exactly the bars */
.pulse-video-wide,
.pulse-video-hd {
  position: relative;
}
.pulse-video-wide {
  aspect-ratio: 1212 / 720;
}
/* full-frame 1920×1080 capture — no baked bars, no crop */
.pulse-video-hd {
  aspect-ratio: 1920 / 1080;
}
.pulse-video-wide video,
.pulse-video-hd video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* ── Ch. 01 — the operating-loop map. The chain rides the pflow idiom on
   grid row 3; Signal sits a row above and drops into the Strategy→Campaign
   link (dashed = information from outside); the green return rail below is
   the argument — the next cycle starts smarter. ── */
.pulse-map .pflow-node,
.pulse-map .pflow-line {
  grid-row: 3;
}
.pulse-map .pflow-loop {
  grid-row: 4;
  grid-column: 3 / 10;
}
.pulse-map-signal {
  grid-row: 1;
  grid-column: 3 / 6;
  justify-self: center;
  box-sizing: border-box;
  min-width: 132px;
  padding: 8px 14px;
  border: 1px dashed var(--pp-cyan-600);
  border-radius: 10px;
  background: var(--pp-canvas);
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--pp-ink);
}
.pulse-map-signal em {
  display: block;
  margin-top: 2px;
  font-style: normal;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.35;
  color: var(--pp-text-3);
}
/* the fork: Signal lands on BOTH Strategy and Campaign (owner review) */
.pulse-map-fork {
  position: relative;
  grid-row: 2;
  grid-column: 3 / 6;
  height: 20px;
}
.pulse-map-fork i {
  position: absolute;
  display: block;
}
.pulse-map-fork .is-stem {
  left: 50%;
  top: 0;
  height: 8px;
  border-left: 2px dashed var(--pp-cyan-600);
}
.pulse-map-fork .is-bar {
  top: 8px;
  left: 24%;
  right: 24%;
  border-top: 2px dashed var(--pp-cyan-600);
}
.pulse-map-fork .is-l {
  left: 24%;
  top: 8px;
  height: 12px;
  border-left: 2px dashed var(--pp-cyan-600);
}
.pulse-map-fork .is-r {
  right: 24%;
  top: 8px;
  height: 12px;
  border-left: 2px dashed var(--pp-cyan-600);
}
/* the return rail comes back UP into Strategy — the arrow says so */
.pulse-map .pflow-loop {
  position: relative;
}
.pulse-map .pflow-loop::before {
  content: "";
  position: absolute;
  left: -6px;
  top: -8px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 8px solid var(--pp-green);
}
/* phone: the five-node chain stacks vertically; connectors turn upright */
@media (max-width: 809px) {
  .pulse-map .pflow-grid {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  .pulse-map .pflow-node,
  .pulse-map .pflow-line {
    grid-row: auto;
    grid-column: 1;
  }
  .pulse-map .pflow-line {
    justify-self: center;
    min-width: 0;
    width: 2px;
    height: 18px;
  }
  .pulse-map .pflow-line::before {
    left: 50%;
    top: -2px;
    transform: translateX(-50%);
  }
  .pulse-map .pflow-line::after {
    right: auto;
    left: 50%;
    top: auto;
    bottom: -2px;
    transform: translateX(-50%);
  }
  .pulse-map .pflow-loop {
    display: none;
  }
  .pulse-map-signal {
    grid-row: 1;
    grid-column: 1;
    justify-self: stretch;
    margin-bottom: 8px;
  }
  .pulse-map-fork {
    display: none;
  }
}
.pulse-shot-label {
  font-family: var(--pulse-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.pulse-shot-label.is-before { color: var(--pp-amber-dark); }
.pulse-shot-label.is-after { color: var(--pp-green-dark); }

/* ── Ch. 03 — the melee grid ────────────────────────────────────────────── */
.pulse-melee {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.pulse-melee-cell {
  display: grid;
  gap: 10px;
  align-content: start;
  padding: 14px;
  border: 1px solid var(--pp-line);
  border-radius: 12px;
  background: var(--pp-canvas);
  box-shadow: var(--pp-shadow-rest);
}
.pulse-melee-wire {
  display: grid;
  gap: 4px;
}
.pulse-melee-wire i {
  display: block;
  height: 6px;
  border-radius: 2px;
  background: rgba(29, 29, 31, 0.1);
}
.pulse-melee-wire i:first-child {
  height: 14px;
  background: rgba(29, 29, 31, 0.16);
}

/* ── the guts: each source's characteristic UI idiom, drawn (tool
   categories, not brands). Big + tinted on purpose — these scenes are the
   act's visual anchor. ── */
.pulse-melee-scene {
  position: relative;
  height: 140px;
  border: 1px solid var(--pp-line);
  border-radius: 8px;
  background: var(--pp-stage);
  overflow: hidden;
}
/* canvas: artboards with selection chrome on a dotted ground */
.pulse-melee-scene.is-canvas {
  background-image: radial-gradient(rgba(29, 29, 31, 0.14) 1px, transparent 1px);
  background-size: 12px 12px;
}
.mc-frame {
  position: absolute;
  left: 16px;
  top: 18px;
  width: 34%;
  height: 66%;
  background: #ffffff;
  border: 2px solid #3987f3;
  border-radius: 2px;
  box-shadow: var(--pp-shadow-rest);
}
.mc-frame::before,
.mc-frame::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 7px;
  background: #ffffff;
  border: 2px solid #3987f3;
}
.mc-frame::before { left: -5px; top: -5px; }
.mc-frame::after { right: -5px; bottom: -5px; }
.mc-frame2 {
  left: 52%;
  top: 36px;
  width: 36%;
  height: 52%;
  border-color: var(--pp-line-strong);
}
.mc-frame2::before,
.mc-frame2::after {
  border-color: var(--pp-line-strong);
}
.mc-cursor {
  position: absolute;
  right: 18%;
  bottom: 16px;
  width: 0;
  height: 0;
  border-left: 12px solid var(--pp-ink);
  border-bottom: 7px solid transparent;
  border-top: 7px solid transparent;
  transform: rotate(-64deg);
}
/* builder export: one file of inlined-style soup; the last "line" runs
   past the edge — the million-character line */
.pulse-melee-scene.is-builder {
  padding: 14px;
}
.mc-soup {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-content: flex-start;
  height: 100%;
}
.mc-soup i {
  display: block;
  height: 10px;
  border-radius: 3px;
  background: rgba(29, 29, 31, 0.12);
}
.mc-soup i:nth-child(5n + 1) { width: 34px; }
.mc-soup i:nth-child(5n + 2) { width: 18px; background: #d7e6fd; }
.mc-soup i:nth-child(5n + 3) { width: 46px; background: #fce7be; }
.mc-soup i:nth-child(5n + 4) { width: 26px; background: #e2e3fc; }
.mc-soup i:nth-child(5n) { width: 38px; background: #d5f0da; }
.mc-soup i:nth-child(7n) { width: 58px; }
.mc-soup i:last-child {
  width: 200%;
  background: repeating-linear-gradient(
    90deg,
    #f9c9c9 0 26px,
    #fce7be 26px 54px,
    #d7e6fd 54px 84px,
    #e2e3fc 84px 108px
  );
}
/* model chat: an ink prompt bubble, a wall of generated code below */
.mc-bubble {
  position: absolute;
  right: 14px;
  top: 14px;
  width: 44%;
  height: 20px;
  border-radius: 10px 10px 3px 10px;
  background: var(--pp-ink);
}
.mc-code {
  position: absolute;
  left: 14px;
  right: 30%;
  top: 48px;
  bottom: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #23272c;
  display: grid;
  gap: 6px;
  align-content: start;
}
.mc-code i {
  display: block;
  height: 5px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
}
.mc-code i:nth-child(1) { width: 42%; background: #7fd68c; }
.mc-code i:nth-child(2) { width: 88%; }
.mc-code i:nth-child(3) { width: 96%; background: #a5a8f7; }
.mc-code i:nth-child(4) { width: 64%; }
/* image composite: photos pretending to be screens */
.mc-photo {
  position: absolute;
  left: 16px;
  top: 18px;
  width: 46%;
  height: 60%;
  border: 1px solid var(--pp-line-strong);
  border-radius: 4px;
  background: linear-gradient(180deg, #e5fbff 0 58%, #d5f0da 58% 100%);
  box-shadow: var(--pp-shadow-rest);
  overflow: hidden;
}
.mc-photo::before {
  content: "";
  position: absolute;
  left: 12%;
  bottom: -8%;
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 34px solid #43ba51;
  opacity: 0.55;
}
.mc-photo::after {
  content: "";
  position: absolute;
  right: 14%;
  top: 14%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #f19a08;
}
.mc-photo2 {
  left: 44%;
  top: 34px;
  transform: rotate(5deg);
}
.pulse-melee-made {
  margin: 0;
  font-size: var(--text-label);
  line-height: 1.4;
  color: rgba(29, 29, 31, 0.8);
}
.pulse-melee-trace {
  margin: 0;
  padding-top: 8px;
  border-top: 1px dashed var(--pp-line-strong);
  font-family: var(--pulse-mono);
  font-size: 12px;
  line-height: 1.5;
  color: var(--pp-text-3);
}
@media (max-width: 720px) {
  .pulse-melee {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


/* ── Ch. 05 — the monolith splits ───────────────────────────────────────── */
.pulse-monolith {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: clamp(24px, 4vw, 48px);
  padding: 8px 0;
}
.pulse-monolith-col {
  display: grid;
  gap: 10px;
  justify-items: center;
}
.pulse-monolith-bar {
  width: 76px;
  height: 264px;
  border: 1px solid var(--pp-line-strong);
  border-radius: 4px;
  /* code stripes with tangled style-bands bleeding through — the mess is
     tinted on purpose */
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(29, 29, 31, 0.14) 0 1px,
      transparent 1px 5px
    ),
    linear-gradient(
      to bottom,
      transparent 0 18%,
      #fce7be 18% 21%,
      transparent 21% 38%,
      #d7e6fd 38% 41%,
      transparent 41% 58%,
      #f9c9c9 58% 61%,
      transparent 61% 80%,
      #e2e3fc 80% 83%,
      transparent 83%
    );
  transform-origin: bottom;
}
.pulse-monolith-folder {
  display: grid;
  gap: 10px;
}
.pulse-monolith-chip {
  display: flex;
  align-items: center;
  gap: 10px;
}
/* a real folder glyph, tinted per row (the split's payoff is colorful) */
.pulse-monolith-chip i {
  position: relative;
  display: block;
  width: 36px;
  height: 24px;
  border: 1px solid var(--pp-line-strong);
  border-radius: 3px;
  background: var(--pp-canvas);
}
.pulse-monolith-chip i::before {
  content: "";
  position: absolute;
  left: -1px;
  top: -6px;
  width: 14px;
  height: 6px;
  border: 1px solid var(--pp-line-strong);
  border-bottom: 0;
  border-radius: 3px 3px 0 0;
  background: inherit;
}
.pulse-monolith-chip:nth-child(1) i { background: var(--pp-cyan-soft); border-color: var(--pp-cyan-line); }
.pulse-monolith-chip:nth-child(1) i::before { border-color: var(--pp-cyan-line); }
.pulse-monolith-chip:nth-child(2) i { background: var(--pp-green-soft); border-color: var(--pp-green-line); }
.pulse-monolith-chip:nth-child(2) i::before { border-color: var(--pp-green-line); }
.pulse-monolith-chip:nth-child(3) i { background: var(--pp-purple-soft); border-color: var(--pp-purple-line); }
.pulse-monolith-chip:nth-child(3) i::before { border-color: var(--pp-purple-line); }
.pulse-monolith-chip:nth-child(4) i { background: var(--pp-amber-soft); border-color: var(--pp-amber-line); }
.pulse-monolith-chip:nth-child(4) i::before { border-color: var(--pp-amber-line); }
.pulse-monolith-chip em {
  font-style: normal;
  font-size: 13px;
  font-weight: 500;
  color: var(--pp-text-2);
}
.pulse-monolith-label {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  color: var(--pp-text-3);
}
.pulse-monolith-label strong {
  display: block;
  font-size: 20px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--pp-ink);
}

/* ── Ch. 06 — commit stream + loss card ─────────────────────────────────── */
.pulse-ticker {
  overflow: hidden;
  display: grid;
  gap: 8px;
  padding: clamp(16px, 1.4vw, 22px) 0;
  /* the stream fades at both edges instead of clipping chips mid-glyph */
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}
.pulse-ticker-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  width: max-content;
  margin-left: -3%;
}
.pulse-ticker-chip {
  flex: none;
  padding: 6px 12px;
  border: 1px solid var(--pp-line);
  border-radius: 8px;
  background: var(--pp-canvas);
  /* literal code content — the one place real mono stays; everything
     UI on this page is the text face */
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  white-space: nowrap;
  color: var(--pp-text-2);
  box-shadow: var(--pp-shadow-rest);
}
.pulse-ticker-stats {
  display: flex;
  align-items: baseline;
  gap: clamp(20px, 3vw, 40px);
  flex-wrap: wrap;
  padding-bottom: 14px;
}
.pulse-ticker-stats strong {
  font-family: var(--pulse-mono);
  font-size: var(--text-heading);
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--pp-ink);
}
.pulse-ticker-stats span {
  display: block;
  margin-top: 6px;
  font-family: var(--pulse-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}

/* ── kv rows (loss card, npm plate, roles) ──────────────────────────────── */
.pulse-kv {
  margin-top: 12px;
  border-top: 1px solid var(--pp-line);
}
.pulse-kv-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--pp-line);
}
.pulse-kv-row span {
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--pp-text-4);
}
.pulse-kv-row em {
  font-family: var(--pulse-mono);
  font-style: normal;
  font-size: 11px;
  text-align: right;
  overflow-wrap: anywhere;
  color: var(--pp-text-2);
}
.pulse-spec-foot {
  margin: 12px 0 0;
  font-family: var(--pulse-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--pp-text-4);
}

/* ── Ch. 07 — token sheet, ramps, inventory, CI chain ───────────────────── */
.pulse-spec-chips {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}
.pulse-spec-chip i {
  display: block;
  height: 26px;
  border: 1px solid rgba(29, 29, 31, 0.1);
  border-radius: var(--radius-thumb);
}
.pulse-spec-chip span {
  display: block;
  margin-top: 5px;
  font-family: var(--pulse-mono);
  font-size: 10px;
  color: var(--pp-text-4);
  transition: color 0.25s var(--ease-silk);
}
.pulse-spec-chip:hover span {
  color: var(--pp-ink);
}
.pulse-ramps {
  display: grid;
  row-gap: 10px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--pp-line);
}
.pulse-ramp-row {
  display: grid;
  grid-template-columns: minmax(70px, auto) minmax(0, 1fr) minmax(52px, auto);
  align-items: center;
  column-gap: 12px;
}
.pulse-ramp-row > span {
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-ramp-stops {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  height: 16px;
  overflow: hidden;
  border-radius: 3px;
}
.pulse-ramp-stops i {
  display: block;
  height: 100%;
}
.pulse-ramp-row > em {
  font-family: var(--pulse-mono);
  font-style: normal;
  font-size: 10px;
  text-align: right;
  color: var(--pp-text-4);
}
.pulse-spec-type {
  margin-top: 16px;
  border-top: 1px solid var(--pp-line);
}
.pulse-spec-type-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--pp-line);
}
.pulse-spec-type-row strong {
  font-family: var(--font-text);
  font-weight: 600;
  line-height: 1;
  color: var(--pp-ink);
}
.pulse-spec-type-row span {
  font-family: var(--pulse-mono);
  font-size: var(--text-micro);
  color: var(--pp-text-4);
}
.pulse-spec-ruler {
  margin-top: 16px;
}
.pulse-spec-ruler-label {
  font-family: var(--pulse-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-spec-ruler-track {
  position: relative;
  height: 26px;
  margin-top: 8px;
  border-top: 1px solid rgba(29, 29, 31, 0.38);
}
.pulse-spec-ruler-track i {
  position: absolute;
  top: -1px;
  width: 1px;
  height: 7px;
  background: rgba(29, 29, 31, 0.38);
}
.pulse-spec-ruler-track i em {
  position: absolute;
  top: 9px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--pulse-mono);
  font-style: normal;
  font-size: 10px;
  color: var(--pp-text-4);
}
.pulse-chain-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr auto 1fr;
  align-items: center;
  column-gap: 0;
}
.pulse-chain-row.is-approvals {
  grid-template-columns: 1fr auto 1fr auto 1fr;
}
.pulse-chain-cell {
  display: grid;
  gap: 6px;
  min-width: 0;
  padding: clamp(12px, 1.2vw, 18px);
  border: 1px solid var(--pp-line);
  border-radius: 12px;
  background: var(--pp-canvas);
  box-shadow: var(--pp-shadow-rest);
}
.pulse-chain-cell i {
  font-family: var(--pulse-mono);
  font-style: normal;
  font-size: var(--text-micro);
  color: var(--pp-text-4);
}
.pulse-chain-cell strong {
  font-size: var(--text-meta);
  font-weight: 500;
  color: var(--pp-ink);
}
.pulse-chain-cell em {
  font-style: normal;
  font-family: var(--pulse-mono);
  font-size: 10px;
  color: var(--pp-text-4);
}
.pulse-chain-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0 8px;
  font-family: var(--pulse-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--pp-text-4);
}
.pulse-chain-link::before,
.pulse-chain-link::after {
  content: "";
  width: clamp(8px, 1vw, 18px);
  height: 1px;
  background: var(--pp-line-strong);
}
/* unlabeled links (the CI chain) draw one continuous line — the labeled
   two-dash form only exists to hold a word in its gap */
.pulse-chain-link:empty {
  gap: 0;
}
.pulse-chain-link:empty::before {
  width: clamp(20px, 2.4vw, 40px);
}
.pulse-chain-link:empty::after {
  display: none;
}

/* ── Quote artifacts — the rule is the case detail ──────────────────────── */
.pulse-doc-quote {
  margin-top: clamp(4px, 0.8vw, 10px);
  padding-left: clamp(18px, 2vw, 28px);
  border-left: 2px solid var(--case-detail);
}
.pulse-doc-quote blockquote {
  margin: 0;
  max-width: 46ch;
  font-family: var(--font-text);
  font-size: var(--text-title);
  font-weight: 500;
  line-height: 1.32;
  color: var(--pp-ink);
}
.pulse-doc-quote figcaption {
  margin-top: 12px;
  max-width: 56ch;
  font-size: var(--text-meta);
  line-height: 1.55;
  color: var(--pp-text-3);
}


/* ── Ch. 01 — product artifacts (brief, chat, guardrail) ────────────────── */
.pulse-artifact {
  overflow: hidden;
  border: 1px solid var(--pp-line);
  border-radius: var(--radius-media);
  background: var(--pp-stage);
  box-shadow: var(--pp-shadow-rest);
}
.pulse-brief {
  padding: clamp(18px, 1.6vw, 26px);
  font-family: var(--font-text);
  color: var(--pp-ink);
}
.pulse-brief-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.pulse-brief-head strong {
  font-size: 15px;
  font-weight: 600;
}
.pulse-brief-chip {
  padding: 4px 10px;
  border: 1px solid var(--pp-cyan-ring);
  border-radius: 9999px;
  background: var(--pp-cyan-soft);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  color: var(--pp-cyan-dark);
}
.pulse-brief-field {
  margin-top: 10px;
  padding: 9px 13px;
  border: 1px solid var(--pp-line);
  border-radius: 12px;
  background: #ffffff;
}
.pulse-brief-field.is-editing {
  border-color: transparent;
  box-shadow: 0 0 0 3px var(--pp-cyan-ring);
}
.pulse-brief-field span {
  display: block;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-brief-field p {
  margin: 3px 0 0;
  font-size: 15px;
  line-height: 1.45;
  color: var(--pp-ink);
}
.pulse-brief-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
}
.pulse-brief-budget {
  font-size: 12.5px;
  color: var(--pp-text-3);
}
.pulse-brief-approve {
  padding: 10px 16px;
  border-radius: 10px;
  background: #141416;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  color: #ffffff;
  white-space: nowrap;
}

/* ── The Turn — glass bento; the spine carries the one seal-red moment ──── */
.pulse-turn-wrap {
  /* lives inside the acts main — the shell/gutter come from .pulse-acts.
     Top rides a QUARTER gap: the glass card's own interior padding supplies
     the rest of the air (the full half-gap read as a hole above the card) */
  padding: calc(var(--gap-section) / 4) 0 calc(var(--gap-section) / 2);
}
.pulse-turn {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  row-gap: clamp(26px, 3vw, 42px);
  padding: clamp(40px, 5vw, 80px) clamp(28px, 4vw, 72px);
  border: 1px solid var(--pp-line);
  border-radius: 16px;
  background: var(--pp-glass);
  backdrop-filter: blur(var(--blur-scrim));
  -webkit-backdrop-filter: blur(var(--blur-scrim));
  box-shadow: var(--pp-shadow-lift);
}
.pulse-turn-eyebrow {
  grid-column: 1 / 5;
  margin: 0;
  font-size: var(--text-label);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-turn-claim {
  grid-column: 1 / 9;
  margin: 0;
  font-family: var(--font-text);
  font-size: var(--text-heading);
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: 0;
  color: var(--pp-ink);
  text-wrap: balance;
}
.pulse-turn-copy {
  grid-column: 1 / 8;
}
.pulse-turn-copy p {
  margin: 0;
  max-width: 60ch;
  font-size: var(--text-body);
  line-height: 1.62;
  color: rgba(29, 29, 31, 0.82);
}
.pulse-turn-copy p + p {
  margin-top: 22px;
}
.pulse-spine {
  grid-column: 1 / -1;
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  margin-top: clamp(20px, 2.6vw, 40px);
  padding-top: 10px;
}
.pulse-spine::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 20px;
  height: 1px;
  background: var(--pp-line-strong);
}
.pulse-spine-step {
  position: relative;
}
.pulse-spine-step:last-child::after {
  content: "";
  position: absolute;
  left: 20px;
  right: 0;
  top: 10px;
  height: 1px;
  background: var(--pp-stage);
}
.pulse-spine-node {
  position: relative;
  z-index: 1;
  display: block;
  width: 20px;
  height: 20px;
  margin-bottom: 16px;
  border: 1px solid var(--pp-line-strong);
  border-radius: 50%;
  background: var(--pp-canvas);
}
.pulse-spine-step.is-human .pulse-spine-node {
  border: 0;
  border-radius: 2px;
  /* the page's single red moment: the human-gate stamps */
  background: var(--seal-red);
}
.pulse-spine-label {
  display: block;
  font-size: var(--text-label);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pp-ink);
}
.pulse-spine-note {
  display: block;
  margin-top: 7px;
  max-width: 22ch;
  font-family: var(--pulse-mono);
  font-size: var(--text-micro);
  line-height: 1.5;
  color: var(--pp-text-3);
}
.pulse-spine-step:nth-child(2) { --d: 80ms; }
.pulse-spine-step:nth-child(3) { --d: 160ms; }
.pulse-spine-step:nth-child(4) { --d: 240ms; }
.pulse-spine-step:nth-child(5) { --d: 320ms; }
.pulse-spine-step:nth-child(6) { --d: 400ms; }
.pulse-spine-step.is-visible .pulse-spine-node {
  animation: pulseNodeIn 0.5s var(--ease-spring) both;
  animation-delay: calc(var(--d, 0ms) + 140ms);
}
@keyframes pulseNodeIn {
  from {
    opacity: 0;
    transform: scale(0.7);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.pulse-spine-caption {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: clamp(6px, 1vw, 14px);
  font-family: var(--pulse-mono);
  font-size: var(--text-micro);
  color: var(--pp-text-3);
}
.pulse-spine-legend {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.pulse-spine-legend i {
  display: inline-block;
  width: 9px;
  height: 9px;
  border: 1px solid var(--pp-line-strong);
  border-radius: 50%;
  background: var(--pp-canvas);
}
.pulse-spine-legend i.is-stamp {
  border: 0;
  border-radius: 1px;
  background: var(--seal-red);
  margin-left: 14px;
}


/* ── Tablet (Framer breakpoint) ─────────────────────────────────────────── */
@media (max-width: 1079px) {
  .pulse-case-page .case-study-hero h1 {
    grid-column: 3 / -1;
    grid-row: auto;
  }
  .pulse-case-page .case-hero-lede {
    grid-column: 3 / -1;
    grid-row: auto;
    max-width: 66ch;
  }
  .pulse-acts {
    display: block;
  }
  .pulse-rail {
    display: none;
  }
  .pulse-chapter {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
  .pulse-section {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
  .pulse-section-copy {
    grid-column: 1 / 6;
  }
  .pulse-section-aside {
    grid-column: 6 / -1;
  }
  /* multi-node flow diagrams don't survive the narrow tablet aside —
     they drop to full width instead */
  .pulse-aside-wide {
    grid-column: 1 / -1;
    max-width: 560px;
  }
  .pulse-section-inset,
  .pulse-section-full {
    grid-column: 1 / -1;
  }
  .pulse-chapter-claim {
    max-width: none;
  }
}

/* ── Phone ──────────────────────────────────────────────────────────────── */
@media (max-width: 809px) {
  .pulse-case-page .case-study-hero h1,
  .pulse-case-page .case-hero-lede {
    grid-column: 1;
  }
  .pulse-chapter,
  .pulse-section {
    grid-template-columns: minmax(0, 1fr);
  }
  .pulse-section-copy,
  .pulse-section-aside,
  .pulse-section-inset,
  .pulse-section-full {
    grid-column: 1;
  }
  .pulse-ticker {
    mask-image: none;
    -webkit-mask-image: none;
  }
  .pulse-ticker-row {
    flex-wrap: wrap;
    width: auto;
    margin-left: 0;
  }
  .pulse-ticker-chip {
    white-space: normal;
  }
  .pulse-chain-row,
  .pulse-chain-row.is-approvals {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0;
  }
  .pulse-chain-link {
    padding: 10px 0;
  }
  .pulse-chain-link::before,
  .pulse-chain-link::after {
    width: 12px;
  }
  .pulse-shot-pair {
    grid-template-columns: minmax(0, 1fr);
  }
  .pulse-turn {
    grid-template-columns: minmax(0, 1fr);
    padding: 28px 22px;
  }
  .pulse-turn-eyebrow,
  .pulse-turn-claim,
  .pulse-turn-copy,
  .pulse-spine,
  .pulse-spine-caption {
    grid-column: 1;
  }
  .pulse-spine {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 24px;
    padding-top: 0;
  }
  .pulse-spine::before {
    left: 10px;
    right: auto;
    top: 4px;
    bottom: 4px;
    width: 1px;
    height: auto;
  }
  .pulse-spine-step {
    display: grid;
    grid-template-columns: 20px minmax(0, 1fr);
    column-gap: 14px;
    align-items: start;
  }
  .pulse-spine-node {
    grid-row: 1 / span 2;
    margin-bottom: 0;
    margin-top: 1px;
  }
  .pulse-spine-note {
    grid-column: 2;
    max-width: none;
  }
  .pulse-spine-step:last-child::after {
    display: none;
  }
}

/* ── Flow diagrams — the Pulse node idiom, light: white chips with typed
   port dots on plain connection lines (no arrowheads; direction reads
   left-to-right), and dashed loops whose SIZE is the argument. Loops are
   amber (= attention in Pulse semantics — red stays reserved for declining
   data); confident paths are green, neutral paths cyan. ── */
.pflow {
  display: grid;
  row-gap: clamp(20px, 2.2vw, 30px);
  padding: 14px 0 4px;
}
.pflow-lane {
  display: grid;
  row-gap: 10px;
}
.pflow-grid {
  display: grid;
  align-items: center;
  column-gap: 0;
}
.pflow-node {
  position: relative;
  box-sizing: border-box;
  padding: 12px 18px;
  border: 1px solid var(--pp-line-strong);
  border-radius: 10px;
  background: var(--pp-canvas);
  box-shadow: var(--pp-shadow-rest);
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: var(--pp-ink);
}
.pflow-node em {
  display: block;
  margin-top: 3px;
  font-style: normal;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.35;
  color: var(--pp-text-3);
}
/* four-node rows ride a compact scale so every word fits its track */
.pflow-grid.is-tight .pflow-node {
  padding: 10px 12px;
  font-size: 14px;
}
.pflow-grid.is-tight .pflow-node em {
  font-size: 11px;
}
/* stage tints — Pulse's own semantics carried into the diagrams:
   cyan = ready/neutral work, purple = generating/in-flight, amber = the
   risky step, green = confirmed good */
.pflow-node.is-cyan { background: var(--pp-cyan-soft); border-color: var(--pp-cyan-line); }
.pflow-node.is-purple { background: var(--pp-purple-soft); border-color: var(--pp-purple-line); }
.pflow-node.is-amber { background: var(--pp-amber-soft); border-color: var(--pp-amber-line); }
.pflow-node.is-green { background: var(--pp-green-soft); border-color: var(--pp-green-line); }
.pflow-line {
  position: relative;
  height: 2px;
  min-width: 20px;
  background: currentColor;
}
/* typed ports: out = filled dot, in = ring */
.pflow-line::before,
.pflow-line::after {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
}
.pflow-line::before {
  left: -2px;
  width: 7px;
  height: 7px;
  background: currentColor;
}
.pflow-line::after {
  right: -2px;
  width: 4px;
  height: 4px;
  background: var(--pp-canvas);
  border: 2px solid currentColor;
}
.pflow-line.is-cyan { color: var(--pp-cyan-600); }
.pflow-line.is-green { color: var(--pp-green); }
.pflow-line.is-amber { color: #cc7f06; }
.pflow-loop {
  box-sizing: border-box;
  height: 26px;
  margin-top: -4px;
  border: 2px dashed #cc7f06;
  border-top: 0;
  border-radius: 0 0 12px 12px;
}
/* the one loop you keep: harness control's feedback loop is a good loop */
.pflow-loop.is-green {
  border-color: var(--pp-green);
}
.pflow-note {
  margin: 0;
  font-size: var(--text-label);
  font-weight: 500;
  line-height: 1.5;
  color: var(--pp-text-3);
}
.pflow-note.is-amber { color: var(--pp-amber-dark); }
.pflow-note.is-green { color: var(--pp-green-dark); }
.pflow-note.is-center { text-align: center; }
.pflow-note i {
  font-style: normal;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  border-radius: 50%;
  border: 1px solid currentColor;
  font-size: 10px;
  line-height: 1;
  vertical-align: -4px;
}
@media (max-width: 809px) {
  .pflow-node { padding: 8px 10px; font-size: 13px; }
}

/* ── One-typeface support: the former mono labels hold their shape in the
   text face via weight + tabular numerals (placed last so it wins ties) ── */
.pulse-spec-head,
.pulse-rail-head,
.pulse-chapter-index,
.pulse-fig,
.pulse-spec-foot,
.pulse-kv-row span,
.pulse-ticker-stats span,
.pulse-spine-legend,
.pulse-rail li i,
.pulse-ticker-stats strong,
.pulse-kv-row em,
.pulse-ramp-row > em,
.pulse-monolith-label strong {
  font-variant-numeric: tabular-nums;
}
.pulse-case-page .icue {
  font-family: var(--pulse-mono);
  font-weight: 500;
}

${pulseAssemblyCss}

/* ── Reduced motion: render final state; kill scoped loops ──────────────── */
@media (prefers-reduced-motion: reduce) {
  .pulse-case-page [data-fade] {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .pulse-spine-step .pulse-spine-node {
    animation: none !important;
    opacity: 1;
    transform: none;
  }
  .pulse-spec-chip span {
    transition: none;
  }
}


/* ── 2026 case-study edit: product-first, editorial, and quieter ───────── */
.pulse-bloom {
  opacity: 0.5;
  animation: none !important;
}
.pulse-case-page .case-study-hero {
  min-height: min(900px, 100dvh);
  padding: clamp(112px, 10vw, 152px) var(--work-gutter)
    clamp(72px, 7vw, 104px);
  row-gap: clamp(20px, 2vw, 32px);
  align-items: start;
}
.pulse-case-page .case-hero-kicker {
  grid-column: 1 / 6;
  grid-row: 1;
  margin: 0;
  color: var(--case-detail);
}
.pulse-case-page .case-study-hero h1 {
  grid-column: 1 / 6;
  grid-row: 2;
  align-self: end;
  font-size: clamp(64px, 7vw, 112px);
  line-height: 0.9;
}
.pulse-case-page .case-hero-lede {
  grid-column: 1 / 6;
  grid-row: 3;
  max-width: 42ch;
  margin: 0;
  color: var(--pp-text-2);
}
.pulse-case-page .case-hero-meta {
  grid-column: 1 / 6;
  grid-row: 4;
  align-self: end;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  border-top: 1px solid var(--pp-line-strong);
}
.pulse-case-page .case-hero-meta div {
  padding: 12px 0;
  border-bottom-color: var(--pp-line);
}
.pulse-hero-product {
  grid-column: 6 / -1;
  grid-row: 1 / 5;
  align-self: center;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--pp-line-strong);
  border-radius: 20px;
  background: var(--pp-canvas);
  box-shadow: var(--pp-shadow-rest);
}
.pulse-hero-product-head {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--pp-line);
  font-size: var(--text-micro);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-hero-product > img {
  display: block;
  background: var(--pp-stage);
}
.pulse-hero-proof {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--pp-line);
}
.pulse-hero-proof span {
  min-width: 0;
  padding: 18px;
  font-size: var(--text-label);
  line-height: 1.35;
  color: var(--pp-text-3);
}
.pulse-hero-proof span + span {
  border-left: 1px solid var(--pp-line);
}
.pulse-hero-proof strong {
  display: block;
  margin-bottom: 6px;
  font-size: clamp(24px, 2.4vw, 36px);
  font-weight: 500;
  line-height: 1;
  color: var(--pp-ink);
}
.pulse-case-page .proj-summary {
  padding: clamp(80px, 8vw, 120px) var(--work-gutter);
  row-gap: 32px;
}
.pulse-case-page .proj-summary h2 {
  grid-column: 1 / 6;
  max-width: 12ch;
  font-family: var(--font-text);
  font-weight: 500;
  letter-spacing: -0.02em;
}
.pulse-case-page .proj-summary-copy {
  grid-column: 7 / -1;
  max-width: 68ch;
}
.pulse-case-page .proj-summary p {
  font-family: var(--font-text);
  color: var(--pp-text-2);
}
.pulse-rail-card {
  /* natural position drops to the part opener's own top offset — flush
     against the acts seam the card's rule collided with the fork above */
  margin-top: calc(var(--gap-section) / 2);
  padding: 12px 0;
  border: 0;
  border-top: 1px solid var(--pp-line-strong);
  border-radius: 0;
  background: transparent;
}
.pulse-rail li.is-done::after {
  content: "";
  width: 6px;
  height: 6px;
  align-self: center;
  border-radius: 50%;
  background: var(--pp-line-strong);
}
.pulse-rail li.is-run::after {
  content: "";
  width: 6px;
  height: 6px;
  align-self: center;
  border-radius: 50%;
  background: var(--pp-cyan-600);
}
/* chapter boundaries ride the site's ONE section standard (half above,
   half below); subchapters tuck closer to their parent */
.pulse-chapter {
  padding: calc(var(--gap-section) / 2) 0;
}
.pulse-chapter.is-subchapter {
  padding-top: 48px;
  padding-bottom: calc(var(--gap-section) / 2);
}
.pulse-chapter.is-subchapter .pulse-chapter-head {
  grid-column: 1 / 8;
}
.pulse-chapter.is-subchapter .pulse-chapter-claim {
  max-width: 18em;
  font-size: clamp(36px, 4vw, 56px);
}
.pulse-chapter.is-subchapter .pulse-chapter-headrule {
  background: var(--pp-line);
}
.pulse-chapter-claim {
  max-width: 18em;
  font-size: clamp(48px, 5.4vw, 80px);
  letter-spacing: -0.025em;
}
/* part openers — the page's two acts (owner structure 2026-07-14) */
.pulse-part {
  padding: calc(var(--gap-section) / 2) 0 0;
}
.pulse-part-index {
  margin: 0 0 12px;
  font-size: var(--text-label);
  letter-spacing: var(--track-eyebrow);
  text-transform: uppercase;
  color: var(--case-detail);
}
.pulse-part-claim {
  margin: 0;
  max-width: 22em;
  font-family: var(--font-text);
  font-size: clamp(28px, 3vw, 44px);
  font-weight: 500;
  line-height: 1.15;
  color: var(--pp-ink);
  text-wrap: balance;
}
.pulse-part-pulse {
  display: block;
  width: 100%;
  height: 40px;
  margin-top: clamp(12px, 1.6vw, 24px);
}
.pulse-part-pulse path {
  fill: none;
  stroke: var(--pp-cyan-600);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
${pulseForkCss}
/* end-of-track handoff — a station in the site's own next-stop idiom:
   strong rule, eyebrow, display title, and the ONE real CTA slab */
.pulse-next-part {
  padding-bottom: calc(var(--gap-section) / 2);
}
.pulse-handoff {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: var(--work-grid-gap);
  row-gap: 8px;
  align-items: center;
  padding-top: clamp(24px, 2.6vw, 36px);
  border-top: 1px solid var(--pp-line-strong);
}
.pulse-handoff-eyebrow {
  grid-column: 1 / -1;
  margin: 0;
  font-size: var(--text-label);
  letter-spacing: var(--track-eyebrow);
  text-transform: uppercase;
  color: var(--case-detail);
}
.pulse-handoff-title {
  margin: 0;
  font-family: var(--font-text);
  font-size: clamp(30px, 3.2vw, 46px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: var(--pp-ink);
}
.pulse-handoff-desc {
  grid-column: 1;
  margin: 0;
  max-width: 52ch;
  font-size: var(--text-meta);
  line-height: 1.5;
  color: var(--pp-text-3);
}
.pulse-handoff-cta {
  grid-column: 2;
  grid-row: 2 / span 2;
  align-self: center;
}
@media (max-width: 809px) {
  .pulse-handoff {
    grid-template-columns: minmax(0, 1fr);
  }
  .pulse-handoff-cta {
    grid-column: 1;
    grid-row: auto;
    justify-self: start;
    margin-top: 8px;
  }
}
/* view gating — the attribute exists only once the fork mounts (JS);
   no-JS readers and crawlers get both tracks stacked. The rail keeps BOTH
   part labels visible (they switch tracks); only the inactive chapter
   list collapses. */
.pulse-case-page[data-view="product"] .pulse-view[data-view-panel="system"],
.pulse-case-page[data-view="system"] .pulse-view[data-view-panel="product"] {
  display: none;
}
.pulse-case-page[data-view="product"] [data-rail] [data-view-panel="system"] ol,
.pulse-case-page[data-view="system"] [data-rail] [data-view-panel="product"] ol {
  display: none;
}
.pulse-case-page[data-view="product"] .pulse-next-part[data-view-panel="system"],
.pulse-case-page[data-view="system"] .pulse-next-part[data-view-panel="product"] {
  display: none;
}

/* ── 2026-07-14 · premium-SaaS finish pass ───────────────────────────────
   Same physics, better glass. Product evidence floats on the deeper media
   shadow tier; the hero frame carries the product's live-sync dot; the rail
   behaves like the product's own nav (hover rows, the running act in a soft
   cyan pill); selection is the product's cyan ring, not an ink border; the
   Turn's glass gets a real edge. Pulse's own palette only; even px. */
.pulse-hero-product {
  box-shadow: var(--pp-shadow-media);
}
.pulse-hero-product-head span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.pulse-hero-product-head span:first-child::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--pp-cyan-600);
  box-shadow: 0 0 0 4px rgba(73, 224, 245, 0.16);
}
.pulse-shot,
.pulse-artifact {
  box-shadow: var(--pp-shadow-media);
}
.pulse-shot-head {
  background: rgba(15, 23, 42, 0.02);
}
.pulse-section-copy h3 {
  letter-spacing: -0.01em;
}
.pulse-rail li {
  padding: 2px 0;
}
.pulse-rail li a {
  padding: 4px 8px;
  margin-left: -8px;
  border-radius: 6px;
  transition:
    color 0.2s var(--ease-silk),
    background-color 0.2s var(--ease-silk);
}
.pulse-rail li a:hover {
  background: rgba(15, 23, 42, 0.04);
}
.pulse-rail li.is-run a {
  background: var(--pp-cyan-soft);
  color: var(--pp-cyan-dark);
}
.pulse-turn {
  background: rgba(255, 255, 255, 0.5);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    inset 0 0 0 1px rgba(255, 255, 255, 0.35),
    var(--pp-shadow-lift);
}

@media (max-width: 1079px) {
  .pulse-case-page .case-study-hero {
    min-height: 0;
  }
  .pulse-case-page .case-hero-kicker,
  .pulse-case-page .case-study-hero h1,
  .pulse-case-page .case-hero-lede,
  .pulse-case-page .case-hero-meta {
    grid-column: 1 / 6;
  }
  .pulse-hero-product {
    grid-column: 6 / -1;
  }
}

@media (max-width: 809px) {
  .pulse-case-page .case-study-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    padding-top: 112px;
    padding-bottom: 72px;
  }
  .pulse-case-page .case-hero-kicker,
  .pulse-case-page .case-study-hero h1,
  .pulse-case-page .case-hero-lede,
  .pulse-case-page .case-hero-meta,
  .pulse-hero-product {
    grid-column: 1;
    grid-row: auto;
  }
  .pulse-case-page .case-hero-kicker { order: 1; }
  .pulse-case-page .case-study-hero h1 { order: 2; font-size: clamp(64px, 22vw, 88px); }
  .pulse-case-page .case-hero-lede { order: 3; }
  .pulse-hero-product { order: 4; margin-top: 16px; border-radius: 14px; }
  .pulse-case-page .case-hero-meta { order: 5; grid-template-columns: minmax(0, 1fr); }
  .pulse-hero-product-head {
    padding: 12px 14px;
  }
  .pulse-hero-product-head span:last-child {
    display: none;
  }
  .pulse-hero-proof {
    grid-template-columns: minmax(0, 1fr);
  }
  .pulse-hero-proof span {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 12px 14px;
  }
  .pulse-hero-proof span + span {
    border-left: 0;
    border-top: 1px solid var(--pp-line);
  }
  .pulse-hero-proof strong {
    min-width: 40px;
    margin: 0;
    font-size: 24px;
  }
  .pulse-case-page .proj-summary {
    grid-template-columns: minmax(0, 1fr);
    padding-top: 72px;
    padding-bottom: 72px;
  }
  .pulse-case-page .proj-summary h2,
  .pulse-case-page .proj-summary-copy {
    grid-column: 1;
    max-width: none;
  }
  .pulse-chapter,
  .pulse-chapter.is-subchapter {
    padding: 80px 0;
  }
  .pulse-chapter.is-subchapter .pulse-chapter-head {
    grid-column: 1;
  }
  .pulse-chapter-claim,
  .pulse-chapter.is-subchapter .pulse-chapter-claim {
    font-size: clamp(38px, 12vw, 54px);
  }
}
`;

/* ---- chapter head component ---- */
// Chapter head: mono index above the claim (title outweighs index).
function ChapterHead({ number, title }: { number: string; title: string }) {
  return (
    <header className="pulse-chapter-head" data-fade>
      <p className="pulse-chapter-index">{number}</p>
      <h2 className="pulse-chapter-claim">{title}</h2>
      <div className="pulse-chapter-headrule" aria-hidden="true" />
    </header>
  );
}

/* ---- run rail component ---- */
// The case-map rail — ONE persistent spine beside all the acts (QA: the old
// per-chapter copies read as nine duplicate cards). Server markup renders
// the FINAL state (all acts done — the run finished); when motion is
// allowed, PulseScroll rewinds it and drives done/running live from the
// chapter positions. Each entry is a real anchor link (keyboard-reachable;
// Lenis takes over native hash clicks for the smooth ride), so the rail is
// navigation now — no aria-hidden.
function RunRail() {
  const groups: Array<[string | null, typeof acts, string | undefined]> = [
    ["Part 1 · Product", acts.filter((a) => a.part === 1), "product"],
    ["Part 2 · Design engineering", acts.filter((a) => a.part === 2), "system"],
    [null, acts.filter((a) => a.part === 0), undefined],
  ];
  return (
    <aside className="pulse-rail">
      <nav
        className="pulse-rail-card"
        aria-label="Case study chapters"
        data-fade
      >
        <span className="pulse-rail-head">Case map</span>
        <div data-rail>
          {groups.map(([label, list, panel]) => (
            <div key={label ?? "coda"} data-view-panel={panel}>
              {label && (
                <button
                  type="button"
                  className="pulse-rail-part"
                  data-rail-switch={panel}
                >
                  {label}
                </button>
              )}
              <ol>
                {list.map((act, i) => (
                  <li key={act.id} className="is-done">
                    <a href={`#${act.id}`}>
                      {/* part-scoped index (1.1 … 2.5) matching the chapter
                          eyebrows — a single reading track never jumps;
                          the Reflection coda is unnumbered */}
                      {act.part !== 0 && (
                        <i aria-hidden="true">{`${act.part}.${i + 1}`}</i>
                      )}
                      {act.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}

/* ---- section prose component ---- */
// Section prose: eyebrow tags + heading + body (copy rail, cols 1-7 of the
// chapter's 10). Figures attach after this, per section, in the caller.
function SectionProse({ section }: { section: CaseSection }) {
  return (
    <div className="pulse-section-copy" data-fade>
      <p className="pulse-section-tags">{section.tags}</p>
      <h3>{section.heading}</h3>
      {section.body.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/* ---- PulseCaseLayout assembly ---- */
// The page itself: hero → overview → the acts (rail + ten chapters) → the
// Turn → adjacent case. Chapters come positionally from data/projects.ts;
// each JSX chapter below carries its own `── NN ·` banner.
export function PulseCaseLayout({ project }: { project: Project }) {
  const meta = [
    ["Role", project.role],
    ["Duration", project.duration],
    ["Type", project.type],
    ["Teams", project.teams],
  ];
  // Chapters from data/projects.ts, positionally — Part 1: 1.1 Product /
  // 1.2 My surfaces / 1.3 Design language; Part 2: 2.1 Fragmentation /
  // 2.2 Convergence (+2.2A Map, 2.2B Rebuild) / 2.3 System /
  // 2.4 Operating model (+2.4A Interfaces) / 2.5 Proof.
  const [loop, surfaces, look, melee, bet, wakeup, rescue, base, skills, iface, proof] =
    project.chapters ?? [];
  const moment = project.moment;

  return (
    <article className="case-study-page pulse-case-page" data-has-cover="false">
      <style
        dangerouslySetInnerHTML={{
          __html: stripCssComments(pulseCss),
        }}
      />
      <PulseScroll />
      <div className="pulse-blooms" aria-hidden="true">
        <i className="pulse-bloom" />
        <i className="pulse-bloom" />
        <i className="pulse-bloom" />
      </div>
      <div className="pulse-navscrim" aria-hidden="true" />

      {/* ── Hero: the product first, with the system proof beside it ── */}
      <section className="case-study-hero" id="header">
        <p className="case-hero-kicker" data-fade>
          Product design · Design systems · Design engineering
        </p>
        <h1 data-fade>{project.title}</h1>
        <p className="case-hero-lede" data-fade>
          {project.oneliner}
        </p>
        <figure className="pulse-hero-product" data-fade>
          <div className="pulse-hero-product-head">
            <span>Pulse / Home</span>
            <span>Unified product runtime</span>
          </div>
          <Image
            src="/media/work/pulse/pulse-app-home.png"
            alt="Pulse Home showing action items, the content queue, and live signals in one workspace"
            width={SHOT_W}
            height={SHOT_H}
            priority
            sizes="(max-width: 809px) 100vw, 62vw"
            style={{ width: "100%", height: "auto" }}
          />
          <figcaption className="pulse-hero-proof">
            <span><strong data-count="6">6</strong> product surfaces</span>
            <span><strong data-count="62">62</strong> canonical components</span>
            <span><strong data-count="981">981</strong> commits, six tools to one system</span>
          </figcaption>
        </figure>
        <dl className="case-hero-meta" data-fade>
          {meta.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Overview: assignment and expanded scope, once ── */}
      <section className="proj-summary" aria-labelledby="project-summary">
        <h2 id="project-summary" data-fade>
          The assignment became the operating system
        </h2>
        <div className="proj-summary-copy">
          {(project.summary ?? [project.blurb]).map((p) => (
            <p key={p} data-fade>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ── The fork: two doors into the case (client switch enhances) ── */}
      <div className="pulse-fork" data-fade>
        <PulsePartSwitch />
      </div>

      {/* ── The case map: two reading tracks on one sticky rail ── */}
      <div className="pulse-acts">
        <RunRail />
        <div className="pulse-acts-main">

      {/* ---- reading track: product ---- */}
      <div className="pulse-view" id="pulse-view-product" data-view-panel="product">

      {/* ── Part 1 · Product ── */}
      <header className="pulse-part" data-fade>
        <p className="pulse-part-index">Part 1 · Product</p>
        <p className="pulse-part-claim">The marketing system Pulse runs for a brand.</p>
        <svg
          className="pulse-part-pulse"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 20 H440 L452 20 460 4 472 36 482 12 490 20 H1200"
            pathLength={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </header>

      {/* ── 1.1 · Product ── */}
      {loop && (
        <section className="case-chapter pulse-chapter" id="act-product" data-act="0">
            <ChapterHead number={loop.number} title={loop.title} />
            {loop.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={loop.sections[0]} />
                {/* the anchor figure: the whole operating loop in one drawing —
                    Signal drops in from outside, performance returns beneath */}
                <figure className="pulse-section-inset" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>the operating loop &middot; one brand at a time</span>
                    </header>
                    <div
                      className="pflow pulse-map"
                      role="img"
                      aria-label="Pulse's operating loop. Onboarding learns the brand; a ratified brand report becomes a 90-day strategy; campaigns turn strategy into briefs and content; the calendar schedules and publishes; analytics reads performance. Signal watches the market daily from outside, and performance returns beneath the chain — strategy and the next campaign absorb both."
                    >
                      <div
                        className="pflow-grid"
                        aria-hidden="true"
                        style={{
                          gridTemplateColumns:
                            "minmax(0, 1fr) 24px minmax(0, 1fr) 24px minmax(0, 1fr) 24px minmax(0, 1fr) 24px minmax(0, 1fr)",
                        }}
                      >
                        <span className="pflow-node">
                          Onboarding
                          <em>learns the brand</em>
                        </span>
                        <span className="pflow-line is-cyan" />
                        <span className="pflow-node is-cyan">
                          Strategy
                          <em>the 90-day contract</em>
                        </span>
                        <span className="pflow-line is-cyan" />
                        <span className="pflow-node is-purple">
                          Campaign
                          <em>plan &middot; brief &middot; produce</em>
                        </span>
                        <span className="pflow-line is-cyan" />
                        <span className="pflow-node">
                          Calendar
                          <em>schedule &middot; publish</em>
                        </span>
                        <span className="pflow-line is-green" />
                        <span className="pflow-node is-green">
                          Analytics
                          <em>reads performance</em>
                        </span>
                        <span className="pflow-loop is-green" />
                        <span className="pulse-map-signal">
                          Signal
                          <em>the market, daily</em>
                        </span>
                        <span className="pulse-map-fork" aria-hidden="true">
                          <i className="is-stem" />
                          <i className="is-bar" />
                          <i className="is-l" />
                          <i className="is-r" />
                        </span>
                      </div>
                      <p className="pflow-note is-green is-center" aria-hidden="true">
                        <i>↺</i>performance returns &mdash; strategy and the
                        next campaign absorb both
                      </p>
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 1.1</em>The operating loop
                      &mdash; Pulse learns a brand, runs its cycle, and starts
                      the next one smarter
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
            {loop.sections[1] && (
              <div className="pulse-section">
                <SectionProse section={loop.sections[1]} />
              </div>
            )}
        </section>
      )}

      {/* ── 1.2 · My surfaces ── */}
      {surfaces && (
        <section className="case-chapter pulse-chapter" id="act-surfaces" data-act="1">
            <ChapterHead number={surfaces.number} title={surfaces.title} />
            {surfaces.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={surfaces.sections[0]} />
              </div>
            )}
            {surfaces.sections[1] && (
              <div className="pulse-section">
                <SectionProse section={surfaces.sections[1]} />
                {/* the hero shows Home still; the recording shows it deciding */}
                <figure className="pulse-section-full" data-fade>
                  <div className="pulse-shot">
                    <div className="pulse-shot-head">
                      <span>Pulse / Home</span>
                      <span>The daily command deck</span>
                    </div>
                    <div className="pulse-video-hd">
                      <OffscreenVideo
                        src="/media/work/pulse/preview.mp4"
                        aria-label="Pulse Home walkthrough: action items with one primary action each, the live content queue, and the prioritized signal feed"
                      />
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 1.2</em>Home, recorded
                      &mdash; the day&rsquo;s decisions above the brand&rsquo;s
                      vital signs
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
            {surfaces.sections[2] && (
              <div className="pulse-section">
                <SectionProse section={surfaces.sections[2]} />
                <div className="pulse-section-aside">
                  <figure data-fade>
                    <div className="pulse-artifact">
                      <PulseCreativeBrief />
                    </div>
                    <figcaption className="pulse-fig-caption">
                      <span>
                        <em className="pulse-fig">Fig. 1.3</em>The Creative
                        Brief &mdash; a person shapes the AI draft
                      </span>
                      <InteractiveCue>edit a field, then approve</InteractiveCue>
                    </figcaption>
                  </figure>
                </div>
                <figure className="pulse-section-full" data-fade>
                  <div className="pulse-shot">
                    <div className="pulse-shot-head">
                      <span>Pulse / Campaign</span>
                      <span>Strategy becomes production</span>
                    </div>
                    <div className="pulse-video-wide">
                      <OffscreenVideo
                        src="/media/work/pulse/gate-flow.mp4"
                        poster="/media/work/pulse/gate-flow-poster.jpg"
                        aria-label="The Campaign flow recorded end to end: a plan is approved, a Creative Brief is reviewed, content generates per platform, a person reviews each post, and only then does it publish"
                      />
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 1.4</em>The Campaign flow,
                      recorded end to end &mdash; plan, brief, generation,
                      review, publish; a person signs at every gate
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
            {surfaces.sections[3] && (
              <div className="pulse-section">
                <SectionProse section={surfaces.sections[3]} />
                {/* recorded, whole, bars cropped */}
                <figure className="pulse-section-full" data-fade>
                  <div className="pulse-shot">
                    <div className="pulse-shot-head">
                      <span>Pulse / Calendar</span>
                      <span>The control plane</span>
                    </div>
                    <div className="pulse-video-wide">
                      <OffscreenVideo
                        src="/media/work/pulse/calendar-run.mp4"
                        poster="/media/work/pulse/calendar-run-poster.jpg"
                        aria-label="Pulse Calendar walkthrough: day, week, month and list views with the schedule-health rail and scheduling queue"
                      />
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 1.5</em>Calendar as the
                      control plane &mdash; approved work flows to schedule on
                      its own; a person can still drag, hold, or reshuffle
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      {/* ── 1.3 · Design language ── */}
      {look && (
        <section className="case-chapter pulse-chapter" id="act-look" data-act="2">
            <ChapterHead number={look.number} title={look.title} />
            {look.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={look.sections[0]} />
                <figure className="pulse-section-full" data-fade>
                  <div className="pulse-shot-pair">
                    <div className="pulse-shot">
                      <Image
                        src="/media/work/pulse/accent-study.png"
                        alt="Pulse accent study: two identical dashboards rendered side by side, one with the cyan candidate accent and one with green"
                        width={SHOT_W}
                        height={SHOT_H}
                        sizes="(max-width: 809px) 100vw, (max-width: 1080px) 50vw, 520px"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                    <div className="pulse-shot">
                      <Image
                        src="/media/work/pulse/cyan-experiment.png"
                        alt="Pulse home dashboard experiment with the winning cyan accent applied across signals, decision queue, and weekly report"
                        width={SHOT_W}
                        height={SHOT_H}
                        sizes="(max-width: 809px) 100vw, (max-width: 1080px) 50vw, 520px"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 1.6</em>The accent study
                      &mdash; identical dashboards, candidate accents side by
                      side; then the cyan experiment on a full Home
                    </span>
                  </figcaption>
                </figure>
                <figure className="pulse-section-inset" data-fade>
                  <div className="pulse-shot">
                    <Image
                      src="/media/work/pulse/foundations-rules.png"
                      alt="Pulse design-system foundations: the 'Neutral first, color with meaning' section with named swatches, status chips, semantics rules, and the ten-stop lightness ramp"
                      width={SHOT_W}
                      height={SHOT_H}
                      sizes="(max-width: 1080px) 100vw, 1030px"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 1.7</em>The rules, written
                      down &mdash; the foundations page every hue answers to
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      </div>

      {/* ---- reading track: design engineering ---- */}
      <div className="pulse-view" id="pulse-view-system" data-view-panel="system">

      {/* ── Part 2 · Design engineering ── */}
      <header className="pulse-part" data-fade>
        <p className="pulse-part-index">Part 2 · Design engineering</p>
        <p className="pulse-part-claim">
          The system I built so the team &mdash; and its AI &mdash; could keep
          building Pulse.
        </p>
        {/* the system is the second heartbeat — a double beat on purpose */}
        <svg
          className="pulse-part-pulse"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 20 H400 L412 20 420 6 430 34 438 16 446 20 H560 L572 20 580 4 592 36 602 12 610 20 H1200"
            pathLength={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </header>

      {/* ── 2.1 · Fragmentation ── */}
      {melee && (
        <section className="case-chapter pulse-chapter" id="act-melee" data-act="3">
            <ChapterHead number={melee.number} title={melee.title} />
            {melee.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={melee.sections[0]} />
                <figure className="pulse-section-full" data-fade>
                  <div
                    className="pulse-melee"
                    role="img"
                    aria-label="Four prototypes share the same wireframe face, but each comes from a different kind of source: one drawn in a design canvas (frames and selection handles, no code), one exported by an AI page-builder (a single file of inlined styles), one pasted from a model chat (it runs but reads as a wall of generated code), one composited from images (screens as pictures, nothing wired)."
                  >
                    {meleeSources.map((cell) => (
                      <div
                        className="pulse-melee-cell"
                        key={cell.made}
                        aria-hidden="true"
                      >
                        <div className="pulse-melee-wire">
                          <i />
                          <i />
                        </div>
                        <div className={`pulse-melee-scene is-${cell.kind}`}>
                          {cell.kind === "canvas" && (
                            <>
                              <i className="mc-frame" />
                              <i className="mc-frame mc-frame2" />
                              <i className="mc-cursor" />
                            </>
                          )}
                          {cell.kind === "builder" && (
                            <span className="mc-soup">
                              {Array.from({ length: 26 }).map((_, i) => (
                                <i key={i} />
                              ))}
                            </span>
                          )}
                          {cell.kind === "chat" && (
                            <>
                              <i className="mc-bubble" />
                              <span className="mc-code">
                                <i />
                                <i />
                                <i />
                                <i />
                              </span>
                            </>
                          )}
                          {cell.kind === "image" && (
                            <>
                              <i className="mc-photo" />
                              <i className="mc-photo mc-photo2" />
                            </>
                          )}
                        </div>
                        <p className="pulse-melee-made">{cell.made}</p>
                        <p className="pulse-melee-trace">{cell.trace}</p>
                      </div>
                    ))}
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.1</em>Four prototypes,
                      one face &mdash; and four sources that cannot be merged
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      {/* ── 2.2 · Convergence ── */}
      {bet && (
        <section className="case-chapter pulse-chapter" id="act-bet" data-act="4">
            <ChapterHead number={bet.number} title={bet.title} />
            {bet.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={bet.sections[0]} />
                <figure className="pulse-section-aside" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>the bet &middot; two routes</span>
                    </header>
                    <div
                      className="pflow"
                      role="img"
                      aria-label="Two routes to a pitch. Boards produce stills — they look right but cannot run or be recorded. Code, seeded with a thin style pass, produces a runnable flow you can click, record, and pitch in days."
                    >
                      <div className="pflow-lane" aria-hidden="true">
                        <div
                          className="pflow-grid"
                          style={{
                            gridTemplateColumns:
                              "minmax(0, 1fr) 32px minmax(0, 1fr)",
                          }}
                        >
                          <span className="pflow-node">Boards</span>
                          <span className="pflow-line is-amber" />
                          <span className="pflow-node is-amber">Stills</span>
                        </div>
                        <p className="pflow-note is-amber">
                          <i>✗</i>looks &mdash; can&rsquo;t run, can&rsquo;t
                          record
                        </p>
                      </div>
                      <div className="pflow-lane" aria-hidden="true">
                        <div
                          className="pflow-grid"
                          style={{
                            gridTemplateColumns:
                              "minmax(0, 1fr) 32px minmax(0, 1fr)",
                          }}
                        >
                          <span className="pflow-node is-cyan">
                            Code
                            <em>+ a thin style pass</em>
                          </span>
                          <span className="pflow-line is-green" />
                          <span className="pflow-node is-green">Runnable flow</span>
                        </div>
                        <p className="pflow-note is-green">
                          <i>✓</i>click, record, pitch &mdash; in days
                        </p>
                      </div>
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.2</em>The bet &mdash;
                      the style pass made six efforts rhyme; it was a look,
                      not a system
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      {/* ── 2.2A · The map ── */}
      {wakeup && (
        <section className="case-chapter pulse-chapter is-subchapter" id="act-wakeup" data-act="4">
            <ChapterHead number={wakeup.number} title={wakeup.title} />
            {wakeup.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={wakeup.sections[0]} />
                <figure className="pulse-section-aside pulse-monolith-fig" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>one prototype file</span>
                    </header>
                    <div className="pulse-monolith" aria-hidden="true">
                      <div className="pulse-monolith-col">
                        <div className="pulse-monolith-bar" />
                        <p className="pulse-monolith-label">
                          <strong>
                            <span
                              className="pulse-monolith-count"
                              data-peak="10180"
                            >
                              10,180
                            </span>{" "}
                            lines
                          </strong>
                          one file
                        </p>
                      </div>
                      <div className="pulse-monolith-col">
                        <div className="pulse-monolith-folder">
                          {["Button/", "Card/", "SignalRow/", "AIPanel/"].map(
                            (name) => (
                              <div className="pulse-monolith-chip" key={name}>
                                <i />
                                <em>{name}</em>
                              </div>
                            ),
                          )}
                        </div>
                        <p className="pulse-monolith-label">
                          <strong>one folder each</strong>one HTML &middot; one
                          CSS
                        </p>
                      </div>
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.3</em>The wake-up file
                      against the shape that replaced it &mdash; scroll runs
                      the split
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
            {wakeup.sections[1] && (
              <div className="pulse-section">
                <SectionProse section={wakeup.sections[1]} />
                <figure className="pulse-inset-medium" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>own file first &middot; then the bar</span>
                    </header>
                    <div
                      className="pflow"
                      role="img"
                      aria-label="Three steps: engineer my own file (split, structure, dead code out), ask engineering what shape they would accept, then hand over rebuilt in React on their conventions."
                    >
                      <div
                        className="pflow-grid"
                        aria-hidden="true"
                        style={{
                          gridTemplateColumns:
                            "minmax(0, 1fr) 28px minmax(0, 1fr) 28px minmax(0, 1fr)",
                        }}
                      >
                        <span className="pflow-node is-cyan">
                          My file
                          <em>split &middot; structure</em>
                        </span>
                        <span className="pflow-line is-cyan" />
                        <span className="pflow-node">
                          Their bar
                          <em>&ldquo;what would you accept?&rdquo;</em>
                        </span>
                        <span className="pflow-line is-green" />
                        <span className="pflow-node is-green">
                          React
                          <em>handed over clean</em>
                        </span>
                      </div>
                      <p className="pflow-note is-green" aria-hidden="true">
                        <i>✓</i>one page maintainable &mdash; the rest of the
                        product not yet
                      </p>
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.4</em>Engineer my own
                      page, then ask engineering
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      {/* ── 2.2B · The rebuild ── */}
      {rescue && (
        <section className="case-chapter pulse-chapter is-subchapter" id="act-rescue" data-act="4">
            <ChapterHead number={rescue.number} title={rescue.title} />
            {rescue.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={rescue.sections[0]} />
                <figure className="pulse-section-full" data-fade>
                  {/* Activity counts stay here, in the evidence that explains
                      them, instead of competing with the product outcome. */}
                  <div className="pulse-ticker-stats">
                    <div>
                      <strong data-count="308">308</strong>
                      <span>structural commits</span>
                    </div>
                    <div>
                      <strong data-count="1905" data-count-format="comma">
                        1,905
                      </strong>
                      <span>dead lines removed</span>
                    </div>
                  </div>
                  <div className="pulse-ticker" aria-hidden="true">
                    {tickerRows.map((row, i) => (
                      <div className="pulse-ticker-row" key={i}>
                        {row.map((subject) => (
                          <span className="pulse-ticker-chip" key={subject}>
                            {subject}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.5</em>The commit stream,
                      paraphrased from the repo&rsquo;s own log &mdash; no
                      hashes, no names
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
            {rescue.sections[1] && (
              <div className="pulse-section">
                <SectionProse section={rescue.sections[1]} />
              </div>
            )}
        </section>
      )}

      {/* ── 2.3 · System ── */}
      {base && (
        <section className="case-chapter pulse-chapter" id="act-base" data-act="5">
            <ChapterHead number={base.number} title={base.title} />
            {base.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={base.sections[0]} />
                <figure className="pulse-section-aside" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>Pulse &middot; token sheet</span>
                    </header>
                    <PulseTokenChips />
                    <div className="pulse-ramps">
                      {ramps.map((ramp) => (
                        <div className="pulse-ramp-row" key={ramp.role}>
                          <span>{ramp.role}</span>
                          <div className="pulse-ramp-stops" aria-hidden="true">
                            {ramp.stops.map((hex) => (
                              <i key={hex} style={{ background: hex }} />
                            ))}
                          </div>
                          <em>{ramp.base}</em>
                        </div>
                      ))}
                    </div>
                    <div className="pulse-spec-type">
                      {typeScale.map((row) => (
                        <div className="pulse-spec-type-row" key={row.px}>
                          <strong style={{ fontSize: row.size }}>Aa</strong>
                          <span>
                            {row.px} &middot; {row.role}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pulse-spec-ruler">
                      <span className="pulse-spec-ruler-label">
                        spacing &middot; 8-base
                      </span>
                      <div className="pulse-spec-ruler-track" aria-hidden="true">
                        {spacingTicks.map((v) => (
                          <i key={v} style={{ left: `${(v / 48) * 96}%` }}>
                            <em>{v}</em>
                          </i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.6</em>The canonical
                      token sheet &mdash; six ramps, one scale, one rhythm
                    </span>
                    <InteractiveCue>click / tap a chip to copy its hex</InteractiveCue>
                  </figcaption>
                </figure>
                <figure className="pulse-section-inset" data-fade>
                  <div className="pulse-chain-row">
                    {ciSteps.map(([label, note], i) => (
                      <Fragment key={label}>
                        {i > 0 && <span className="pulse-chain-link" aria-hidden="true" />}
                        <div className="pulse-chain-cell">
                          <i>{String(i + 1).padStart(2, "0")}</i>
                          <strong>{label}</strong>
                          <em>{note}</em>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.7</em>The CI guard checks
                      &mdash; inventory, tokens, hand-edits, and text contrast,
                      reconciled on every merge
                    </span>
                  </figcaption>
                </figure>
                <figure className="pulse-doc-quote pulse-section-inset" data-fade>
                  <blockquote>{doctrineQuote}</blockquote>
                  <figcaption>
                    The single-source doctrine, from the migration plan &mdash;
                    every layer has one owner, and a check keeps them honest.
                  </figcaption>
                </figure>
              </div>
            )}
            {base.sections[1] && (
              <div className="pulse-section">
                <SectionProse section={base.sections[1]} />
                <figure className="pulse-doc-quote pulse-section-aside" data-fade>
                  <blockquote>{fileQuote}</blockquote>
                  <figcaption>
                    Verbatim from the repo&rsquo;s README &mdash; the floor,
                    written into law.
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      {/* ── 2.4 · Operating model ── */}
      {skills && (
        <section className="case-chapter pulse-chapter" id="act-skills" data-act="6">
            <ChapterHead number={skills.number} title={skills.title} />
            {skills.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={skills.sections[0]} />
                <figure className="pulse-section-aside pulse-aside-wide" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>where systems go to die</span>
                    </header>
                    <div
                      className="pflow"
                      role="img"
                      aria-label="Two loops. Without a skill: prompt, generate, then re-type the rules — every single time, a repetition loop that never ends. With a skill: the rules load once before generation, and output is on-system by construction."
                    >
                      <div className="pflow-lane" aria-hidden="true">
                        <div
                          className="pflow-grid"
                          style={{
                            gridTemplateColumns:
                              "minmax(0, 1fr) 32px minmax(0, 1fr)",
                          }}
                        >
                          <span className="pflow-node">Prompt</span>
                          <span className="pflow-line is-amber" />
                          <span className="pflow-node is-amber">Generate</span>
                          <span
                            className="pflow-loop"
                            style={{ gridColumn: "1 / -1" }}
                          />
                        </div>
                        <p className="pflow-note is-amber is-center">
                          <i>↺</i>re-type the rules &mdash; every single time
                        </p>
                      </div>
                      <div className="pflow-lane" aria-hidden="true">
                        <div
                          className="pflow-grid"
                          style={{
                            gridTemplateColumns:
                              "minmax(0, 1fr) 32px minmax(0, 1fr)",
                          }}
                        >
                          <span className="pflow-node is-cyan">
                            Skill loads
                            <em>once, before the work</em>
                          </span>
                          <span className="pflow-line is-green" />
                          <span className="pflow-node is-green">
                            Generate
                            <em>on-system by construction</em>
                          </span>
                        </div>
                        <p className="pflow-note is-green">
                          <i>✓</i>no loop &mdash; the rule lives in the repo
                        </p>
                      </div>
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.8</em>The repetition
                      loop a skill deletes
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
            {skills.sections[1] && (
              <div className="pulse-section">
                <SectionProse section={skills.sections[1]} />
                <figure className="pulse-inset-medium" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>harness control &middot; the loop that stays</span>
                    </header>
                    <div
                      className="pflow"
                      role="img"
                      aria-label="A four-step feedback loop: decide, write the decision into the skill's markdown where the AI reads it, generate with the skill loaded, review the output. When review catches a drift, the fix goes back into the markdown — so every later generation starts from a higher floor."
                    >
                      <div
                        className="pflow-grid"
                        aria-hidden="true"
                        style={{
                          gridTemplateColumns:
                            "minmax(0, 1fr) 28px minmax(0, 1fr) 28px minmax(0, 1fr) 28px minmax(0, 1fr)",
                        }}
                      >
                        <span className="pflow-node">Decide</span>
                        <span className="pflow-line is-cyan" />
                        <span className="pflow-node is-cyan">
                          Write the md
                          <em>where the AI reads</em>
                        </span>
                        <span className="pflow-line is-cyan" />
                        <span className="pflow-node is-purple">Generate</span>
                        <span className="pflow-line is-green" />
                        <span className="pflow-node is-green">Review</span>
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                        <span
                          className="pflow-loop is-green"
                          style={{ gridColumn: "3 / 8" }}
                        />
                      </div>
                      <p className="pflow-note is-green is-center" aria-hidden="true">
                        <i>↺</i>drift found, edit the md &mdash; the floor
                        rises for everything after
                      </p>
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.9</em>Harness control
                      &mdash; the feedback loop that stays
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      {/* ── 2.4A · Interfaces ── */}
      {iface && (
        <section className="case-chapter pulse-chapter is-subchapter" id="act-interface" data-act="6">
            <ChapterHead number={iface.number} title={iface.title} />
            {iface.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={iface.sections[0]} />
                <figure className="pulse-section-full" data-fade>
                  <PulseComponentBrowser />
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.10</em>The component
                      browser, rebuilt live &mdash; real components from the
                      Pulse registry; the shipped browser holds all 62
                    </span>
                    <InteractiveCue>
                      click through the registry &mdash; every state runs
                    </InteractiveCue>
                  </figcaption>
                </figure>
                <figure className="pulse-section-inset" data-fade>
                  <div className="pulse-shot">
                    <Image
                      src="/media/work/pulse/figma-board-campaign.png"
                      alt="Figma component board: PostChip state matrix and a labeled campaign anatomy map"
                      width={SHOT_W}
                      height={SHOT_H}
                      sizes="(max-width: 1080px) 100vw, 1030px"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.11</em>The sliced Figma
                      board &mdash; deliberately non-interactive, built to be
                      imported into design review
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
            {iface.sections[1] && (
              <div className="pulse-section">
                <SectionProse section={iface.sections[1]} />
                <figure className="pulse-section-inset" data-fade>
                  <div className="pulse-shot">
                    <Image
                      src="/media/work/pulse/react-playground.png"
                      alt="Pulse React component library playground: AIPanel rendered from the package, with copyable usage code"
                      width={SHOT_W}
                      height={SHOT_H}
                      sizes="(max-width: 1080px) 100vw, 1030px"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.12</em>The real
                      playground &mdash; the published AIPanel rendered live,
                      with per-component knobs and a JSON data editor
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      {/* ── 2.5 · Proof ── */}
      {proof && (
        <section className="case-chapter pulse-chapter" id="act-proof" data-act="7">
            <ChapterHead number={proof.number} title={proof.title} />
            {proof.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={proof.sections[0]} />
                {/* the tells card sits beside the copy (the copy makes the
                    claim, the card is the checklist); the before/after pair
                    lands full-width below it */}
                <figure className="pulse-section-aside" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>generated-ui tells &middot; the rule against each</span>
                    </header>
                    <div className="pulse-kv">
                      {proofTells.map(([tell, rule]) => (
                        <div className="pulse-kv-row" key={tell}>
                          <span>{tell}</span>
                          <em>{rule}</em>
                        </div>
                      ))}
                    </div>
                    <p className="pulse-spec-foot">
                      held by tokens, skills, and the CI checks &mdash; not by
                      taste
                    </p>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.13</em>The tells &mdash;
                      what gives generated UI away, and what forbids it here
                    </span>
                  </figcaption>
                </figure>
                {/* before/after + the build annotation, one card (2026-07-08
                    review: the separate intake/base flow figure re-told this
                    pair) — each column carries its own build facts */}
                <figure className="pulse-section-full" data-fade>
                  <div className="pulse-shot-pair">
                    <div className="pulse-shot-labeled">
                      <span className="pulse-shot-label is-before">
                        Before &middot; the teammate&rsquo;s vibe-code
                      </span>
                      <div className="pulse-shot">
                        <Image
                          src="/media/work/pulse/campaign-before.png"
                          alt="The rough campaign prototype: a flat Campaign Library — a KPI strip, filter tabs, search, and a scroll of campaign cards, with the assistant collapsed to a chat pill"
                          width={SHOT_W}
                          height={SHOT_H}
                          sizes="(max-width: 809px) 100vw, (max-width: 1080px) 50vw, 560px"
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                      <p className="pulse-shot-note">
                        one 4,000-line HTML file &middot; styles inline
                        &middot; images as base64 &middot; no system
                      </p>
                    </div>
                    <div className="pulse-shot-labeled">
                      <span className="pulse-shot-label is-after">
                        After &middot; rebuilt on the base
                      </span>
                      <div className="pulse-shot">
                        <Image
                          src="/media/work/pulse/campaign-after.png"
                          alt="The rebuilt campaign page: a decision-first Overview with an approvals card, a segmented production queue, and a Pulse-suggests rail of signal-driven campaign directions"
                          width={SHOT_W}
                          height={SHOT_H}
                          sizes="(max-width: 809px) 100vw, (max-width: 1080px) 50vw, 560px"
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                      <p className="pulse-shot-note">
                        shared tokens &middot; 10 CSS + 15 JS modules &middot;
                        3 DS components &middot; 207 commits, ~2.5 weeks
                      </p>
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 2.14</em>Same brief, rebuilt
                      &mdash; a browse-first Campaign Library became a
                      decision-first Overview
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      </div>

      {/* ── The Turn — reflective climax, OUTSIDE the switch (it closes both
          tracks); the spine carries the page's one seal-red moment ── */}
      {moment && (
        <div className="pulse-turn-wrap" id="act-turn" data-act="8">
          <section className="pulse-turn" aria-labelledby="pulse-turn-title">
            <p className="pulse-turn-eyebrow" data-fade>
              Reflection
            </p>
            <h2 className="pulse-turn-claim" id="pulse-turn-title" data-fade>
              {moment.title}
            </h2>
            <div className="pulse-turn-copy" data-fade>
              {moment.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="pulse-spine">
              {gateSteps.map((step) => (
                <div
                  className={`pulse-spine-step${step.human ? " is-human" : ""}`}
                  key={step.label}
                  data-fade
                >
                  <i className="pulse-spine-node" aria-hidden="true" />
                  <span className="pulse-spine-label">{step.label}</span>
                  <span className="pulse-spine-note">{step.note}</span>
                </div>
              ))}
            </div>
            <footer className="pulse-spine-caption" data-fade>
              {/* unnumbered on purpose — the Turn closes BOTH tracks, so a
                  sequential number would jump in one of them */}
              <span>
                <em className="pulse-fig">Create-with-AI</em>where a person
                stays in the loop
              </span>
              <span className="pulse-spine-legend">
                <i aria-hidden="true" /> ai step
                <i className="is-stamp" aria-hidden="true" /> human gate
              </span>
            </footer>
          </section>
        </div>
      )}

      {/* ── After the Reflection: the terminal station for each track — the
          reader leaves the case's close and only THEN gets "what's next",
          so the Reflection can never read as the other part's opening ── */}
      <div className="pulse-next-part" data-view-panel="product" data-fade>
        <div className="pulse-handoff">
          <p className="pulse-handoff-eyebrow">Up next &middot; Part 2</p>
          <p className="pulse-handoff-title">Design engineering</p>
          <p className="pulse-handoff-desc">
            How six prototypes became the system that keeps Pulse shipping.
          </p>
          <Cta
            variant="solid"
            large
            className="pulse-handoff-cta"
            data-rail-switch="system"
          >
            Read Part 2
          </Cta>
        </div>
      </div>
      <div className="pulse-next-part" data-view-panel="system" data-fade>
        <div className="pulse-handoff">
          <p className="pulse-handoff-eyebrow">Revisit &middot; Part 1</p>
          <p className="pulse-handoff-title">Product</p>
          <p className="pulse-handoff-desc">
            The operating loop, and the three surfaces where it meets a person.
          </p>
          <Cta
            variant="solid"
            large
            className="pulse-handoff-cta"
            data-rail-switch="product"
          >
            Read Part 1
          </Cta>
        </div>
      </div>

        </div>
      </div>

      {/* ── Adjacent case — quiet close ── */}
      <CaseNext slug={project.slug} />
    </article>
  );
}
