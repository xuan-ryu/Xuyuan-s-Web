import Image from "next/image";
import { type CaseSection, type Project } from "@/data/projects";
import { CaseNext } from "./case-next";
import { NymaScroll } from "./nyma-scroll";
import {
  NymaDirections,
  NymaColorRoles,
  NymaWardrobes,
} from "./nyma-interactives";
import { NymaDrafts } from "./nyma-drafts";
import { NymaPhone } from "./nyma-phone";
import { NymaSystemBoard } from "./nyma-system-board";
import { InteractiveCue } from "./ui/interactive-cue";
import { OutcomeBand } from "./ui/outcome-band";
import { CaseMap } from "./ui/case-map";
import { stripCssComments } from "@/lib/css-sanitize";

// Nyma — "The Archive Thread". The one case page that steps inside Nyma's
// own brand system (the Pulse "Studio Bloom" precedent, applied to a brand
// project): parchment ground (#f2efea), Ceramic Black containment, the
// manual's archival page furniture (mono "Topic — / Page no. —" headers over
// drawn hairlines), Murecho as the page voice, and a thread — νήμα — that
// literally stitches the chapters together down the left rail.
//
// Color law comes from the product itself and happens to rhyme with the
// site's: Activation Blue (#0d5eaf) is the case accent and appears ONLY on
// interactive/active things; Ceramic Yellow (#cf882e) is the material trace
// and stays static (the site's gold role); the ONE seal-red moment is the
// red stitch at the Turn. Any use of color outside its role is misuse —
// the manual's own sentence, enforced on the page about it.
//
// Grid: the shared work shell (max 1440, --work-gutter margins, 12 cols,
// --work-grid-gap). Thread rail cols 1–2 (sticky, desktop); chapters cols
// 3–12, internally a 10-col grid — copy 1–6 (≤62ch), aside artifacts 7–11,
// full plates 1–11. Rhythm: --gap-section between chapters, --gap-block
// inside. 8px baseline, even-px values (1px hairlines exempt).
//
// One-typeface rule, the Nyma reading: the page speaks Murecho — and speaks
// it the way Nyma does: THIN + REGULAR (owner note 2026-07-07 — bold is
// nearly absent from the brand; the editorial voice comes from light large
// type, not weight). Display/claims wear 300, working headings 400, 500
// exists only as the ladder's hover step. Real mono (--font-mono) is allowed
// exactly where Nyma's own UI uses it — system data: lot numbers, topic
// headers, condition rows, captions (mono 700 stays only where the manual
// itself bolds its header slot, and on product-idiom prices).
//
// Copy: verbatim from data/projects.ts (deck slides 22–27 — inheritance →
// thread → rulebook → pages → codification → handoff; the Turn carries the
// νήμα discovery and the honest reflections). Figures are numbered as
// plates ("Pl. 01") in the trace color, the way an archive numbers its
// objects. Confidentiality: agency credit and mock personal data are cropped
// or repainted out of every plate on this page (manual-cover-v2.png scrubs
// the cover's bottom-right agency credit; the rename busts stale caches).
//
// Choreography lives in <NymaScroll /> (GSAP + ScrollTrigger over the
// Scroll Behaviour). Server markup is always the FINAL state — reduced motion and
// no-JS read a finished page; motion only rewinds and replays it.
//
// This file is the server layout only: markup plus the page-scoped CSS
// string. It holds no state and no effects — every interactive specimen
// (directions, color roles, wardrobes, drafts, phone, system board) is an
// imported client module, and all scroll work stays in NymaScroll.

/* ---- nyma page css ---- */
// One page-scoped stylesheet in a single template literal, injected via
// stripCssComments so its internal /* section */ comments never ship to
// view-source. Navigate it by the ── seam comments inside the literal.
const nymaCss = `
/* ── Nyma case page — The Archive Thread ─────────────────────────────── */
/* Real Murecho weights, page-scoped. The site's murecho-latin.woff2 is a
   STATIC 300 declared as 300–600 (a fallback face --font-text never
   reaches), so true 400/500/700 instances load here under their own family;
   requesting 300 falls through to the site face — the wordmark stays light,
   like the manual's. */
@font-face {
  font-family: "Murecho Nyma";
  src: url("/media/work/nyma/fonts/murecho-v17-latin-300.woff2") format("woff2");
  font-display: swap;
  font-style: normal;
  font-weight: 300;
}
@font-face {
  font-family: "Murecho Nyma";
  src: url("/media/work/nyma/fonts/murecho-v17-latin-regular.woff2") format("woff2");
  font-display: swap;
  font-style: normal;
  font-weight: 400;
}
@font-face {
  font-family: "Murecho Nyma";
  src: url("/media/work/nyma/fonts/murecho-v17-latin-500.woff2") format("woff2");
  font-display: swap;
  font-style: normal;
  font-weight: 500;
}
.nyma-case-page {
  /* Nyma surfaces (manual topic 3.1) */
  /* owner 2026-07-13: the page ground moves from Parchment to Archival
     White — parchment survives only inside product recreations that
     genuinely use it */
  --ny-stage: #ffffff;      /* Archival White — the page ground */
  --ny-canvas: #ffffff;     /* Archival White — cards, plates */
  --ny-chrome: #f5f5f5;     /* Soft Archive */
  /* owner 2026-07-14: page chrome black is plain PURE black + neutral
     grays — Ceramic Black (#1c1a17) survives only as literals inside the
     product recreations (lot card, direction scenes, color-law swatch),
     where it is the shipped product's own value */
  --ny-ink: #000000;
  --ny-text-2: #464646;
  --ny-text-3: #6a6a6a;
  /* faintest text stop still clears 4.5:1 on white under 11–12px mono */
  --ny-text-4: #6f6f6f;
  --ny-line: rgba(0, 0, 0, 0.11);
  --ny-line-strong: rgba(0, 0, 0, 0.22);
  --ny-shadow-rest: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.05);
  --ny-shadow-lift: 0 2px 6px rgba(0, 0, 0, 0.06), 0 16px 32px rgba(0, 0, 0, 0.09);

  /* Nyma semantics — role-based, never decorative */
  --ny-blue: #0d5eaf;       /* Activation Blue — interactive states ONLY */
  --ny-blue-dark: #0a4c8f;
  --ny-blue-soft: #eaf1fa;
  --ny-blue-line: #b9d2ec;
  --ny-trace: #cf882e;      /* Ceramic Yellow — material trace, static */
  --ny-trace-dark: #8f5c17; /* AA text stop for the trace */
  --ny-trace-soft: #f8efe1;

  /* Case accent contract (owner rule 2026-07-05) */
  --case-accent: var(--ny-blue);
  --case-detail: var(--ny-blue-dark);
  --icue-accent: var(--ny-blue);

  /* One page voice: Murecho (true 400/500/700 above; the site's static 300
     serves the light wordmark). Mono = system data. */
  --ny-display: "Murecho Nyma", "Murecho", var(--font-text);
  --ny-mono: var(--font-mono);

  position: relative;
  background: var(--ny-stage);
  color: var(--ny-ink);
  font-family: var(--ny-display);
  /* belt-and-braces: no descendant may open a horizontal scroll */
  overflow-x: clip;
}
.nyma-case-page > :not(.ny-navscrim) {
  position: relative;
  z-index: 1;
}
/* content slides under the transparent nav instead of colliding with it
   (pulse navscrim precedent, white flavored) */
.ny-navscrim {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  z-index: 50;
  pointer-events: none;
  background: linear-gradient(180deg, var(--ny-stage) 58%, rgba(255, 255, 255, 0) 100%);
  /* hidden by default (no-JS/reduced-motion never show it); NymaScroll turns
     it on only while NO ink band sits under the nav — the parchment fog over
     the dark hero/Turn was the owner's worst-read artifact */
  opacity: 0;
  transition: opacity 0.4s var(--ease-silk);
}
.ny-navscrim.is-on {
  opacity: 1;
}
.nyma-case-page p {
  text-wrap: pretty;
}
.nyma-case-page figure {
  margin: 0;
}
/* (standalone figures carry NO margins — the chapter grid's row-gap is the
   ONE block rhythm, 2026-07-14 audit; a caption still reads as its own
   plate's because it sits 14px under the plate vs a full gap above the
   next block) */
.nyma-case-page [data-fade].is-visible {
  animation-delay: var(--d, 0ms);
}

/* archival hairline — drawn on enter; final state = drawn */
.ny-hairline {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--ny-ink);
  opacity: 0.72;
}

/* plate captions — mono system data; plate numbers wear the trace */
.ny-caption {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin-top: 14px;
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  line-height: 1.5;
  color: var(--ny-text-3);
}
.ny-pl {
  font-style: normal;
  /* text is black/gray only (owner 2026-07-14) — the plate index leads in
     ink, the caption body stays gray */
  color: var(--ny-ink);
  margin-right: 0.65em;
}

/* ── Hero — a page from the manual, at architecture scale ─────────────── */
.ny-hero {
  padding-top: clamp(120px, 13vw, 172px);
}
.ny-hero-head {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  margin: 0 auto;
  padding: 0 var(--work-gutter) 18px;
}
.ny-archhead {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  font-family: var(--ny-mono);
  font-size: 12px;
  line-height: 1.55;
  letter-spacing: 0.03em;
  color: var(--ny-text-2);
  padding-bottom: 10px;
}
.ny-archhead-title {
  text-align: left;
}
.ny-archhead-title em {
  font-style: normal;
  color: var(--ny-text-4);
}
.ny-archhead-right {
  text-align: right;
  color: var(--ny-text-4);
}

/* the Ceramic Black band; the wordmark is cropped by its bottom edge —
   the manual cover, rebuilt live */
.ny-hero-band {
  position: relative;
  width: 100%;
  height: clamp(340px, 42vw, 600px);
  background: var(--ny-ink);
  overflow: hidden;
}
.ny-hero-band-shell {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  height: 100%;
  margin: 0 auto;
  padding: 0 var(--work-gutter);
}
.ny-hero-word {
  position: absolute;
  left: var(--work-gutter);
  bottom: -0.17em;
  margin: 0;
  font-family: var(--ny-display);
  font-size: clamp(132px, 19vw, 288px);
  /* the manual's wordmark is light — the site's static-300 Murecho is
     exactly right here */
  font-weight: 300;
  letter-spacing: 0.02em;
  line-height: 1;
  color: #ffffff;
  overflow: hidden;
}
.ny-hero-word span {
  display: block;
}
@media (prefers-reduced-motion: no-preference) {
  .ny-hero-word span {
    animation: nyWordRise 1s var(--ease-silk) 0.2s backwards;
  }
}
@keyframes nyWordRise {
  from { transform: translateY(64%); }
  to { transform: translateY(0); }
}
.ny-hero-tags {
  position: absolute;
  right: var(--work-gutter);
  bottom: 30px;
  margin: 0;
  min-height: 1.4em;
  font-family: var(--ny-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.62);
}
.ny-hero-trace {
  position: absolute;
  top: clamp(48px, 6vw, 88px);
  right: var(--work-gutter);
  width: clamp(160px, 22vw, 320px);
  height: 2px;
  background: var(--ny-trace);
}

/* below the band: lede + contents card + meta */
.ny-hero-below {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  margin: 0 auto;
  /* bottom padding: the meta values were sitting ~12px off the outcome
     band's top rule (owner 2026-07-14) */
  padding: clamp(48px, 6vw, 88px) var(--work-gutter) clamp(32px, 4vw, 56px);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  row-gap: clamp(32px, 4vw, 56px);
}
.ny-hero-lede {
  grid-column: 1 / 8;
  margin: 0;
  max-width: 62ch;
  font-size: var(--text-lead, 20px);
  font-weight: 400;
  line-height: 1.55;
  color: var(--ny-text-2);
}
.ny-hero-meta {
  grid-column: 1 / -1;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  border-top: 1px solid var(--ny-line-strong);
}
.ny-hero-meta div {
  padding: 14px 0 0;
}
.ny-hero-meta dt {
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ny-text-4);
  margin-bottom: 8px;
}
.ny-hero-meta dd {
  margin: 0;
  font-size: var(--text-label, 14px);
  line-height: 1.5;
  color: var(--ny-text-2);
}

/* (the black TOC card is retired — owner 2026-07-13: the hero row carried
   too many small labels, and the sticky thread rail already IS the page's
   index navigation) */
/* keyboard: every clickable specimen control takes the site focus ring */
.ny-dir-tab:focus-visible,
.ny-ward-tab:focus-visible,
.ny-roles-chip:focus-visible,
.ny-draft:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

/* ── Overview + ledger ─────────────────────────────────────────────────── */
.nyma-case-page .proj-summary {
  background: transparent;
  color: inherit;
  /* the global slab's full-shell top/bottom rules doubled the outcome
     band's content-width rule into a second, wider line (owner
     2026-07-14); the band's rule is the ONE separator here */
  border: 0;
  border-radius: 0;
  margin: 0 auto;
  padding: clamp(54px, 6vw, 82px) var(--work-gutter) calc(var(--gap-section) / 2);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  row-gap: var(--gap-block);
  overflow: visible;
}
.nyma-case-page .proj-summary::before {
  display: none;
}
.nyma-case-page .proj-summary h2 {
  grid-column: 1 / 3;
  margin: 0;
  font-family: var(--ny-mono);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1.6;
  color: var(--ny-text-4);
}
.nyma-case-page .proj-summary .proj-summary-copy {
  grid-column: 3 / 9;
  display: grid;
  gap: 1em;
}
.nyma-case-page .proj-summary p {
  margin: 0;
  max-width: 62ch;
  font-family: var(--ny-display);
  font-size: var(--text-body, 18px);
  font-weight: 400;
  line-height: 1.62;
  color: var(--ny-text-2);
}
/* (the 4/3/2/1 summary ledger is retired with the TOC card — same
   2026-07-13 cleanup: decorative counts plus their mono labels were more
   furniture than fact; the at-a-glance band keeps the real numbers) */

/* ── The acts: thread rail + chapters ──────────────────────────────────── */
.ny-acts {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  margin: 0 auto;
  padding: 0 var(--work-gutter);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
}
.ny-rail {
  grid-column: 1 / 3;
  align-self: stretch;
}
.ny-rail-card {
  position: sticky;
  top: 96px;
  padding: 18px 0;
}
.ny-rail-head {
  display: block;
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  /* no text-transform: νήμα must not be uppercased into ΝΉΜΑ */
  color: var(--ny-text-4);
  margin-bottom: 16px;
}
.ny-rail-body {
  display: flex;
  gap: 14px;
}
/* the thread itself: a stitch track the fill sews down as acts pass */
.ny-thread {
  position: relative;
  width: 3px;
  border-radius: 2px;
  background-image: repeating-linear-gradient(
    180deg,
    var(--ny-line-strong) 0 6px,
    transparent 6px 12px
  );
}
.ny-thread-fill {
  position: absolute;
  inset: 0;
  border-radius: 2px;
  background: var(--ny-trace);
  transform-origin: top center;
}
.ny-rail ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}
.ny-rail li {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-family: var(--ny-mono);
  font-size: 12px;
  letter-spacing: 0.02em;
  color: var(--ny-text-4);
  transition: color 0.3s var(--ease-silk);
}
.ny-rail li i {
  font-style: normal;
  min-width: 30px;
  color: var(--ny-text-4);
  transition: color 0.3s var(--ease-silk);
}
.ny-rail li.is-done {
  color: var(--ny-text-2);
}
.ny-rail li.is-run {
  color: var(--ny-ink);
}
.ny-rail li.is-run i {
  color: var(--ny-ink); /* b/w text rule — the amber stitch bar carries state */
}
.ny-acts-main {
  grid-column: 3 / -1;
  min-width: 0;
}

/* ── Chapter furniture ─────────────────────────────────────────────────── */
/* 0.35 per side (0.7 gap at each seam): the old /2 stacked into 300–400px
   of empty parchment at every chapter crossing — tightened half a step,
   still low-density (2026-07-08 audit) */
.ny-chapter {
  padding: calc(var(--gap-section) * 0.35) 0;
  scroll-margin-top: 88px;
}
.nyma-case-page .case-chapter {
  max-width: none;
  margin: 0;
  /* ONE chapter rhythm (2026-07-14 audit: block gaps ran 64/80 mixed via
     scattered per-block margins and collapse-through) — the chapter is a
     single column with exactly one --gap-block between blocks; the blocks
     themselves carry no vertical margins. */
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: var(--gap-block);
}
.nyma-case-page .case-chapter:last-of-type {
  padding-bottom: calc(var(--gap-section) * 0.35);
}
/* ch1: the condition card runs taller than its copy — center the copy so
   the left column doesn't read as a hole */
#ny-ch1 .ny-section {
  align-items: center;
}
/* (the ch4 white SHEET is retired with the white page ground — owner
   2026-07-13: a boxed white sheet around the body read as a giant card.
   Plates now carry the stronger hairline globally instead.) */
.ny-chapter-head {
  margin-bottom: 0; /* the chapter's row-gap owns the rhythm */
}
.ny-chapter-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  font-family: var(--ny-mono);
  font-size: 12px;
  line-height: 1.55;
  letter-spacing: 0.03em;
  color: var(--ny-text-3);
  padding-bottom: 10px;
}
.ny-chapter-claim {
  margin: clamp(24px, 3vw, 40px) 0 0;
  max-width: 24ch;
  font-family: var(--ny-display);
  /* Nyma speaks thin + regular — big claims wear 300, never bold */
  font-size: clamp(38px, 4.4vw, 64px);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.01em;
  text-wrap: balance;
}

/* section: 10-col internal grid — copy 1–6, aside 7–11 */
.ny-section {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  row-gap: var(--gap-block);
}
.ny-copy {
  grid-column: 1 / 7;
  min-width: 0;
}
.ny-copy h3 {
  margin: 0 0 16px;
  font-family: var(--ny-display);
  font-size: var(--text-title, clamp(24px, 2.2vw, 28px));
  font-weight: 400;
  line-height: 1.3;
  text-wrap: balance;
}
.ny-copy p {
  margin: 0 0 1em;
  max-width: 62ch;
  font-size: var(--text-body, 18px);
  line-height: 1.62;
  color: var(--ny-text-2);
}
.ny-copy p:last-child {
  margin-bottom: 0;
}
.ny-aside {
  grid-column: 7 / -1;
  min-width: 0;
  align-self: start;
}
/* rows whose aside WALKS (the full-length page / codified-artifact scrubs
   run ~2 viewports past their short copy): keep the copy in view beside the
   walk instead of leaving cols 1-6 as a dead half-viewport (2026-07-13
   audit). Desktop only — below 1080 the columns stack. */
@media (min-width: 1081px) {
  .ny-walkrow .ny-copy {
    position: sticky;
    top: clamp(96px, 16vh, 180px);
    align-self: start;
  }
}
.ny-full {
  grid-column: 1 / -1;
  min-width: 0;
}

/* plates: framed objects on the white ground — the stronger hairline keeps
   their object edge now that canvas and stage share the same white */
.ny-plate {
  background: var(--ny-canvas);
  border: 1px solid var(--ny-line-strong);
  box-shadow: var(--ny-shadow-rest);
}
.ny-plate img {
  display: block;
  width: 100%;
  height: auto;
  /* lazy-load placeholder: an on-system ground instead of a blank sheet
     (phone audit: ch4's white plates left whole viewports pure white) */
  background: var(--ny-chrome);
}
/* ── Ch 1 · condition report card ──────────────────────────────────────── */
.ny-condition {
  box-sizing: border-box;
  background: var(--ny-canvas);
  border: 1px solid var(--ny-line);
  box-shadow: var(--ny-shadow-rest);
  padding: 18px 20px 16px;
  font-family: var(--ny-mono);
}
.ny-condition header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ny-text-4);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ny-line);
}
.ny-condition-lot {
  margin: 14px 0 10px;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--ny-ink);
}
.ny-condition ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.ny-condition li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  padding: 9px 0;
  border-bottom: 1px solid var(--ny-line);
  font-size: 12px;
  color: var(--ny-text-2);
}
.ny-condition li em {
  font-style: normal;
  white-space: nowrap;
}
.ny-condition li[data-state="ok"] em {
  color: var(--ny-text-3);
}
.ny-condition li[data-state="ok"] em::before {
  content: "✓ ";
}
.ny-condition li[data-state="worn"] em,
.ny-condition li[data-state="missing"] em {
  color: var(--ny-ink); /* b/w text rule — the ~ / ✕ glyphs carry the state */
}
.ny-condition li[data-state="worn"] em::before {
  content: "~ ";
}
.ny-condition li[data-state="missing"] em::before {
  content: "✕ ";
}
.ny-condition footer {
  padding-top: 12px;
  font-size: 11px;
  line-height: 1.6;
  color: var(--ny-text-4);
}

/* ── Ch 2 · fates, etymology, moodboard table, field, directions ──────── */
.ny-fates {
  grid-column: 7 / -1; /* the one aside width — same rail as every aside */
}
.ny-fates .ny-plate {
  background: var(--ny-ink);
  border-color: transparent;
}

/* the etymology band — the finding, staged big */
.ny-etym {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: baseline;
  column-gap: clamp(24px, 3vw, 48px);
  row-gap: 10px;
  padding: clamp(40px, 5vw, 64px) 0;
  margin: 0;
  border-top: 1px solid var(--ny-line-strong);
  border-bottom: 1px solid var(--ny-line-strong);
}
.ny-etym-greek {
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-size: clamp(80px, 10vw, 160px);
  font-weight: 400;
  line-height: 0.9;
  color: var(--ny-ink);
}
.ny-etym-thread {
  align-self: center;
  height: 2px;
  background-image: repeating-linear-gradient(
    90deg,
    var(--ny-trace) 0 10px,
    transparent 10px 18px
  );
}
.ny-etym-name {
  font-family: var(--ny-display);
  font-size: clamp(48px, 6.2vw, 92px);
  font-weight: 300;
  letter-spacing: 0.05em;
  line-height: 1;
}
.ny-etym-def {
  grid-column: 1 / -1;
  margin: 0;
  /* the Greek sits at line-height 0.9, so its descenders (μ, ή) reach well
     below its grid row — give the definition real clearance (2026-07-13
     audit: the caption collided with the wordmark) */
  padding-top: clamp(16px, 2.4vw, 32px);
  font-family: var(--ny-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  line-height: 1.6;
  color: var(--ny-text-3);
}

/* the moodboard table — a long desk the page scrolls sideways.
   Hand-scrollable by default so no-JS and reduced-motion still reach all
   five boards; the GSAP walk clips it only once motion is actually running
   (.ny-motion is set by NymaScroll after its reduced-motion gate). */
.ny-strip {
  position: relative;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
@media (min-width: 769px) {
  .ny-motion .ny-strip {
    overflow: hidden;
  }
}
.ny-strip-track {
  display: flex;
  align-items: flex-start;
  gap: clamp(16px, 2vw, 28px);
  width: max-content;
  will-change: transform;
}
.ny-strip-track .ny-plate {
  flex: none;
}
.ny-strip-track .ny-plate img {
  width: auto;
  height: clamp(360px, 46vw, 600px);
}
.ny-strip-foot {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin-top: 14px;
}
/* cue wording tells the truth for the current mode: scrub phrasing shows
   only while the GSAP walk is actually driving (.ny-motion + desktop for
   the strip); hover phrasing only where hover exists */
.ny-cue-scrub {
  display: none;
}
.ny-motion .ny-pagescroll-foot .ny-cue-scrub {
  display: inline;
}
.ny-motion .ny-pagescroll-foot .ny-cue-hand {
  display: none;
}
@media (min-width: 769px) {
  .ny-motion .ny-strip-foot .ny-cue-scrub {
    display: inline;
  }
  .ny-motion .ny-strip-foot .ny-cue-hand {
    display: none;
  }
}
@media (hover: none) {
  .ny-ladder-foot .ny-cue-hover {
    display: none;
  }
}
@media (hover: hover) {
  .ny-ladder-foot .ny-cue-tap {
    display: none;
  }
}

/* the field — competitor flows, layered; full width so the board reads */
.ny-competitive {
  grid-column: 1 / -1;
  position: relative; /* the section's row-gap owns the space above */
}
.ny-competitive-zoom {
  position: absolute;
  right: clamp(16px, 3vw, 48px);
  bottom: 44px;
  width: 30%;
  border: 1px solid var(--ny-line-strong);
  box-shadow: var(--ny-shadow-lift);
}
.ny-competitive-zoom img {
  display: block;
  width: 100%;
  height: auto;
}

/* the direction board */
/* specimen wrappers sit OPEN on the white ground (owner 2026-07-13: a white
   box around the whole specimen read as a card around body content) — only
   the product recreations inside keep their frames */
.ny-dir {
  padding: 0;
}
.ny-dir-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--ny-line);
}
.ny-dir-tab {
  appearance: none;
  border: 1px solid var(--ny-line-strong);
  background: transparent;
  color: var(--ny-text-2);
  font-family: var(--ny-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  padding: 8px 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s var(--ease-silk), border-color 0.2s var(--ease-silk),
    background 0.2s var(--ease-silk), transform 0.2s var(--ease-silk);
}
.ny-dir-tab:hover {
  border-color: var(--ny-blue);
  color: var(--ny-blue-dark);
}
.ny-dir-tab:active {
  transform: translateY(1px) scale(0.99);
}
.ny-dir-tab.is-on {
  background: var(--ny-ink);
  border-color: var(--ny-ink);
  color: #f2efea;
}
.ny-dir-tab i {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--ny-trace);
}
.ny-dir-stage {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: clamp(20px, 3vw, 48px);
  /* the legend column runs shorter than the card — center it so the gap
     reads as air, not as a hole (same call as #ny-ch1, 2026-07-13 audit) */
  align-items: center;
  padding: clamp(20px, 2.6vw, 32px) 0;
  border-bottom: 1px solid var(--ny-line);
}
/* the four drafts each render in their OWN art direction — a depicted
   artifact, so each may break the page voice inside this frame only */
.ny-dir-mock {
  position: relative;
  height: clamp(320px, 36vw, 420px);
  overflow: hidden;
  border: 1px solid var(--ny-line-strong);
  background: #ffffff;
}
/* — editorial: masthead, serif italic cover line, credited image — */
.dm-ed {
  height: 100%;
  padding: 18px 22px;
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 14px;
}
.dm-ed header {
  display: grid;
  grid-template-columns: 1fr auto auto auto 1fr;
  align-items: center;
  gap: 12px;
}
.dm-ed header i {
  height: 1px;
  background: var(--ny-ink);
}
.dm-ed header span {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 15px;
  letter-spacing: 0.34em;
}
.dm-ed header em {
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-size: 11px;
  color: var(--ny-text-3);
}
.dm-ed-head {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(34px, 3.8vw, 54px);
  line-height: 1.04;
  letter-spacing: -0.01em;
}
.dm-ed-media {
  position: relative;
  overflow: hidden;
  background: #211d19;
}
.dm-ed-media img {
  object-fit: cover;
  object-position: 50% 18%;
}
.dm-ed-media em {
  z-index: 1;
  position: absolute;
  left: 12px;
  bottom: 10px;
  font-family: var(--ny-mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  color: rgba(242, 239, 234, 0.72);
}
/* — archival: ruled lot sheet, mono ledger, small centered object — */
.dm-ar {
  height: 100%;
  padding: 16px 20px;
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  gap: 12px;
  font-family: var(--ny-mono);
}
.dm-ar header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--ny-text-3);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--ny-ink);
}
.dm-ar-obj {
  display: grid;
  place-items: center;
  border: 1px solid var(--ny-line);
  background: var(--ny-chrome);
  overflow: hidden;
  min-height: 0;
}
.dm-ar-obj img {
  height: 92%;
  width: auto;
  max-width: 90%;
  object-fit: contain;
}
.dm-ar-title {
  margin: 0;
  font-family: var(--ny-display);
  font-weight: 400;
  font-size: clamp(17px, 1.6vw, 22px);
}
.dm-ar dl {
  margin: 0;
  border-top: 1px solid var(--ny-line-strong);
}
.dm-ar dl div {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid var(--ny-line);
  font-size: 10px;
  letter-spacing: 0.06em;
}
.dm-ar dt {
  text-transform: uppercase;
  color: var(--ny-text-4);
}
.dm-ar dd {
  margin: 0;
  color: var(--ny-text-2);
}
/* — transactional: promo bar, dense discount grid, loud CTA — */
.dm-tx {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  font-family: var(--ny-mono);
}
.dm-tx-bar {
  padding: 8px 12px;
  background: var(--ny-ink);
  color: #f2efea;
  font-size: 9px;
  letter-spacing: 0.1em;
  white-space: nowrap;
  overflow: hidden;
}
.dm-tx-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  padding: 10px;
}
.dm-tx-grid > div {
  position: relative;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 6px;
  border: 1px solid var(--ny-line);
  padding: 6px;
}
.dm-tx-ph {
  position: relative;
  display: block;
  min-height: 56px;
  overflow: hidden;
  background: #e8e4dd;
}
.dm-tx-ph img {
  object-fit: cover;
}
.dm-tx-grid b {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 6px;
  background: var(--ny-trace);
  color: #1c1a17;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
}
.dm-tx-grid span {
  font-size: 10px;
  letter-spacing: 0.02em;
}
.dm-tx-grid s {
  color: var(--ny-text-4);
}
.dm-tx-cta {
  margin: 0 10px 12px;
  padding: 12px 0;
  text-align: center;
  background: var(--ny-trace);
  color: #1c1a17;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
}
/* — fashion-forward: inverted campaign, oversized cropped display — */
.dm-fw {
  position: relative;
  height: 100%;
  background: #121110;
  overflow: hidden;
}
.dm-fw-img {
  position: absolute;
  inset: 0;
}
.dm-fw-img img {
  object-fit: cover;
  object-position: 50% 20%;
  filter: grayscale(1) contrast(1.05);
  opacity: 0.56;
}
.dm-fw-nav {
  position: absolute;
  top: 16px;
  left: 20px;
  font-family: var(--ny-mono);
  font-size: 9px;
  letter-spacing: 0.22em;
  color: rgba(242, 239, 234, 0.6);
}
.dm-fw-head {
  position: absolute;
  left: 18px;
  bottom: -0.18em;
  margin: 0;
  font-family: var(--ny-display);
  font-weight: 300;
  font-size: clamp(72px, 8vw, 120px);
  line-height: 0.86;
  letter-spacing: -0.01em;
  color: #f2efea;
}
.dm-fw-pop {
  position: absolute;
  top: -40px;
  right: -60px;
  width: 220px;
  height: 220px;
  transform: rotate(18deg);
  background: var(--ny-trace);
}
.ny-dir-legend {
  min-width: 0;
  align-self: center;
}
.ny-dir-voice {
  margin: 0 0 16px;
  max-width: 40ch;
  font-family: var(--ny-display);
  font-size: var(--text-title, 22px);
  font-weight: 300;
  line-height: 1.42;
  color: var(--ny-ink);
}
.ny-dir-traits {
  margin: 0 0 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.ny-dir-traits span {
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  padding: 5px 10px;
  border: 1px solid var(--ny-line-strong);
  color: var(--ny-text-3);
}
.ny-dir-verdict {
  margin: 0;
  font-family: var(--ny-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--ny-text-3);
}
.ny-dir-verdict.is-chosen {
  color: var(--ny-ink); /* b/w text rule — the ✓ carries the verdict */
}
.ny-dir-verdict.is-chosen::before {
  content: "✓ ";
}
/* (the specimen footers are retired — cues live in the caption row) */

/* ── Ch 3 · manual stack, color roles, type ladder ─────────────────────── */
/* four openings of the manual, fanned like documents on a desk */
.ny-stack {
  position: relative;
}
.ny-stack-pages {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(16px, 2vw, 28px);
}
.ny-stack-page {
  transition: transform 0.9s var(--ease-silk), box-shadow 0.4s var(--ease-silk);
}
.ny-stack-page:hover {
  box-shadow: var(--ny-shadow-lift);
  transform: translateY(-4px) rotate(0deg) !important;
}
.ny-stack:not(.is-open) .ny-stack-page:nth-child(1) { transform: translate(30%, 6%) rotate(-1.2deg); }
.ny-stack:not(.is-open) .ny-stack-page:nth-child(2) { transform: translate(-26%, 10%) rotate(1.4deg); }
.ny-stack:not(.is-open) .ny-stack-page:nth-child(3) { transform: translate(24%, -8%) rotate(0.8deg); }
.ny-stack:not(.is-open) .ny-stack-page:nth-child(4) { transform: translate(-30%, -12%) rotate(-1.6deg); }
.ny-stack.is-open .ny-stack-page:nth-child(1) { transform: rotate(-0.4deg); }
.ny-stack.is-open .ny-stack-page:nth-child(2) { transform: rotate(0.5deg); }
.ny-stack.is-open .ny-stack-page:nth-child(3) { transform: rotate(0.3deg); }
.ny-stack.is-open .ny-stack-page:nth-child(4) { transform: rotate(-0.5deg); }

/* color roles specimen */
.ny-roles {
  padding: 0; /* open on the ground — see the .ny-dir note */
}
.ny-roles-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--ny-line);
}
.ny-roles-chip {
  appearance: none;
  border: 1px solid var(--ny-line);
  background: transparent;
  padding: 7px 12px 7px 8px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  font-family: var(--ny-mono);
  transition: border-color 0.2s var(--ease-silk), transform 0.2s var(--ease-silk);
}
.ny-roles-chip:hover {
  border-color: var(--ny-blue);
}
.ny-roles-chip:active {
  transform: translateY(1px) scale(0.99);
}
.ny-roles-chip.is-on {
  border-color: var(--ny-ink);
}
.ny-roles-chip i {
  width: 18px;
  height: 18px;
  border: 1px solid var(--ny-line-strong);
  flex: none;
}
.ny-roles-chip span {
  display: grid;
  text-align: left;
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--ny-text-2);
  line-height: 1.35;
}
.ny-roles-chip span em {
  font-style: normal;
  color: var(--ny-text-4);
}
.ny-roles-stage {
  display: grid;
  grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
  gap: clamp(20px, 3vw, 40px);
  align-items: center; /* legend centers beside the taller lot card */
  padding: clamp(20px, 2.6vw, 32px) 0 18px;
}
/* the lot card — every part tagged with the color it is allowed to use */
.ny-lotcard {
  background: var(--ny-canvas);
  border: 1px solid var(--ny-line-strong);
  font-family: var(--ny-mono);
}
.ny-lotcard [data-c] {
  transition: opacity 0.3s var(--ease-silk), box-shadow 0.3s var(--ease-silk);
}
.ny-roles[data-role] .ny-lotcard [data-c] {
  opacity: 0.32;
}
.ny-roles[data-role="black"] .ny-lotcard [data-c="black"],
.ny-roles[data-role="white"] .ny-lotcard [data-c="white"],
.ny-roles[data-role="parchment"] .ny-lotcard [data-c="parchment"],
.ny-roles[data-role="yellow"] .ny-lotcard [data-c="yellow"],
.ny-roles[data-role="blue"] .ny-lotcard [data-c="blue"],
.ny-roles[data-role="grey"] .ny-lotcard [data-c="grey"] {
  opacity: 1;
  box-shadow: 0 0 0 2px var(--ny-blue-line);
}
.ny-lotcard-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid #d9d9d9;
}
.ny-lotcard-brand {
  font-size: 12px;
  letter-spacing: 0.3em;
  color: #1c1a17;
}
.ny-lotcard-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8f5c17;
}
.ny-lotcard-live i {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #cf882e;
}
.ny-lotcard-img {
  position: relative;
  height: 120px;
  background:
    linear-gradient(180deg, rgba(28, 26, 23, 0.05), rgba(28, 26, 23, 0.02)),
    #ffffff;
  border-bottom: 1px solid #d9d9d9;
}
.ny-lotcard-img span {
  position: absolute;
  left: 10px;
  bottom: 10px;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 8px;
  background: #f8efe1;
  color: #8f5c17;
}
.ny-lotcard-body {
  padding: 12px 14px;
}
.ny-lotcard-lot {
  margin: 0 0 6px;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: #6d6960;
}
.ny-lotcard-title {
  margin: 0 0 10px;
  font-family: var(--ny-display);
  font-size: 15px;
  font-weight: 400;
  color: #1c1a17;
}
.ny-lotcard-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}
.ny-lotcard-price {
  font-size: 14px;
  font-weight: 700;
  color: #1c1a17;
}
.ny-lotcard-ends {
  font-size: 12px;
  color: #8f5c17;
}
.ny-lotcard-meta {
  margin: 6px 0 12px;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: #6d6960;
}
.ny-lotcard-actions {
  display: flex;
  gap: 8px;
}
.ny-lotcard-bid,
.ny-lotcard-buy {
  flex: 1;
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.1em;
  padding: 9px 0;
}
.ny-lotcard-bid {
  background: #0d5eaf;
  color: #ffffff;
}
.ny-lotcard-buy {
  background: #1c1a17;
  color: #f2efea;
}
.ny-lotcard-ground {
  padding: 9px 14px;
  background: #f2efea;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: #6d6960;
}
.ny-roles-legend {
  min-width: 0;
}
.ny-roles-name {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 10px;
  font-family: var(--ny-display);
  font-size: var(--text-title, 24px);
  font-weight: 400;
}
.ny-roles-name i {
  width: 22px;
  height: 22px;
  border: 1px solid var(--ny-line-strong);
  flex: none;
}
.ny-roles-name em {
  font-style: normal;
  font-family: var(--ny-mono);
  font-size: 12px;
  color: var(--ny-text-4);
}
.ny-roles-desc {
  margin: 0 0 14px;
  max-width: 44ch;
  font-size: var(--text-meta, 16px);
  line-height: 1.6;
  color: var(--ny-text-2);
}
.ny-roles-law {
  margin: 0;
  max-width: 48ch;
  font-family: var(--ny-mono);
  font-size: 11px;
  line-height: 1.65;
  color: var(--ny-text-4);
}
/* the type ladder */
.ny-ladder {
  border-top: 1px solid var(--ny-line-strong);
}
.ny-ladder-row {
  display: grid;
  grid-template-columns: minmax(120px, 180px) 1fr;
  align-items: baseline;
  column-gap: var(--work-grid-gap);
  padding: clamp(16px, 2vw, 26px) 0;
  border-bottom: 1px solid var(--ny-line);
}
.ny-ladder-px {
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--ny-text-4);
  transition: color 0.2s var(--ease-silk);
}
.ny-ladder-word {
  font-family: var(--ny-display);
  font-weight: 400;
  line-height: 1.05;
  color: var(--ny-ink);
}
.ny-ladder-row:hover .ny-ladder-word {
  font-weight: 500;
}
.ny-ladder-row:hover .ny-ladder-px {
  color: var(--ny-blue-dark);
}
.ny-ladder-row[data-px="64"] .ny-ladder-word { font-size: clamp(40px, 4.4vw, 64px); font-weight: 300; }
.ny-ladder-row[data-px="48"] .ny-ladder-word { font-size: clamp(32px, 3.3vw, 48px); font-weight: 300; }
.ny-ladder-row[data-px="36"] .ny-ladder-word { font-size: clamp(26px, 2.5vw, 36px); }
.ny-ladder-row[data-px="24"] .ny-ladder-word { font-size: clamp(19px, 1.7vw, 24px); }
.ny-ladder-foot {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 14px;
}

/* ── Ch 4 · tally, plate wall, page-scroll frame ───────────────────────── */
.ny-tally {
  box-sizing: border-box;
  border-top: 1px solid var(--ny-line-strong);
  padding-top: 18px;
}
.ny-tally strong {
  display: block;
  font-family: var(--ny-display);
  font-size: clamp(56px, 6.5vw, 96px);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
}
.ny-tally span {
  display: block;
  margin-top: 10px;
  font-size: var(--text-meta, 16px);
  line-height: 1.5;
  color: var(--ny-text-2);
}
.ny-tally em {
  display: block;
  margin-top: 12px;
  font-style: normal;
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  line-height: 1.7;
  color: var(--ny-text-4);
}

.ny-wall-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(20px, 2.6vw, 40px);
  align-items: start;
}
.ny-wall-col {
  display: grid;
  gap: clamp(20px, 2.6vw, 40px);
  min-width: 0;
}
.ny-wall-col:nth-child(2) {
  margin-top: clamp(48px, 6vw, 96px);
}
/* (no hover/active on the wall plates — they aren't clickable, and a lift
   that answers nothing is a false affordance; 2026-07-08 audit) */
.ny-wall .ny-plate > figcaption {
  padding: 10px 12px;
  border-top: 1px solid var(--ny-line);
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ny-text-3);
}

/* the frame a full-length mock walks through on scroll; without motion
   (reduced-motion, no-JS) the frame is simply scrollable, so the whole
   length stays reachable */
.ny-pagescroll-frame {
  position: relative;
  height: clamp(500px, 68vh, 780px);
  overflow-y: auto;
  background: var(--ny-canvas);
  border: 1px solid var(--ny-line-strong);
  box-shadow: var(--ny-shadow-rest);
}
.ny-motion .ny-pagescroll-frame {
  overflow: hidden;
}
.ny-pagescroll-frame img {
  display: block;
  width: 100%;
  height: auto;
  will-change: transform;
}
.ny-pagescroll-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--ny-chrome);
  border: 1px solid var(--ny-line-strong);
  border-bottom: 0;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ny-text-4);
}
.ny-pagescroll-bar i {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  border: 1px solid var(--ny-line-strong);
}
.ny-pagescroll-foot {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 14px;
}

/* the inclusivity test — three wardrobes, one shell */
.ny-ward {
  padding: 0; /* open on the ground — see the .ny-dir note */
}
.ny-ward-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--ny-line);
}
.ny-ward-tab {
  appearance: none;
  border: 1px solid var(--ny-line-strong);
  background: transparent;
  color: var(--ny-text-2);
  font-family: var(--ny-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 8px 16px;
  cursor: pointer;
  transition: color 0.2s var(--ease-silk), border-color 0.2s var(--ease-silk),
    background 0.2s var(--ease-silk), transform 0.2s var(--ease-silk);
}
.ny-ward-tab:hover {
  border-color: var(--ny-blue);
  color: var(--ny-blue-dark);
}
.ny-ward-tab:active {
  transform: translateY(1px) scale(0.99);
}
.ny-ward-tab.is-on {
  background: var(--ny-ink);
  border-color: var(--ny-ink);
  color: #f2efea;
}
.ny-ward-stage {
  display: grid;
  grid-template-columns: minmax(0, 340px) minmax(0, 1fr);
  gap: clamp(20px, 3vw, 48px);
  align-items: center; /* legend centers beside the taller wardrobe card */
  padding: clamp(20px, 2.6vw, 32px) 0 18px;
}
.ny-ward-card {
  border: 1px solid var(--ny-line-strong);
  font-family: var(--ny-mono);
  background: var(--ny-canvas);
}
.ny-ward-card header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid #d9d9d9;
  font-size: 11px;
  letter-spacing: 0.24em;
  color: var(--ny-ink);
}
.ny-ward-maison {
  letter-spacing: 0.1em;
  color: var(--ny-text-3);
}
.ny-ward-img {
  position: relative;
  height: 210px;
  border-bottom: 1px solid #d9d9d9;
  overflow: hidden;
  background: var(--ny-chrome);
}
.ny-ward-img img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 40%;
}
.ny-ward-img span {
  z-index: 1;
  position: absolute;
  left: 10px;
  bottom: 10px;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 8px;
  background: var(--ny-trace-soft);
  color: var(--ny-trace-dark);
}
.ny-ward-body {
  padding: 14px;
}
.ny-ward-meta {
  margin: 0 0 8px;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--ny-text-3);
}
.ny-ward-title {
  margin: 0 0 10px;
  font-family: var(--ny-display);
  font-size: 17px;
  font-weight: 400;
  color: var(--ny-ink);
}
.ny-ward-price {
  font-size: 15px;
  font-weight: 700;
  color: var(--ny-ink);
}
.ny-ward-format {
  margin: 10px 0 0;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--ny-text-3);
}
.ny-ward-legend {
  min-width: 0;
}
.ny-ward-note {
  margin: 0 0 20px;
  max-width: 46ch;
  font-family: var(--ny-display);
  font-size: var(--text-title, 24px);
  font-weight: 300;
  line-height: 1.4;
  color: var(--ny-ink);
}
.ny-ward-ledger {
  border-top: 1px solid var(--ny-line-strong);
  max-width: 52ch;
}
.ny-ward-ledger > div {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--ny-line);
}
.ny-ward-ledger span {
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ny-text-4);
}
.ny-ward-ledger em {
  font-style: normal;
  font-family: var(--ny-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--ny-text-2);
}
@media (max-width: 768px) {
  .ny-ward-stage {
    grid-template-columns: 1fr;
  }
  .ny-dir-stage {
    grid-template-columns: 1fr;
  }
}

/* ── Ch 5 · workflow loop, drafts pair ─────────────────────────────────── */
/* the working loop, drawn AS a loop (owner 2026-07-14: four text columns
   with dash fragments read as rows, not a cycle) — ONE closed thread (the
   νήμα motif) runs through four stations on its top edge and returns along
   its bottom edge; small ticks point the direction of travel. Text stays
   black/gray; the thread is the page's one colored mark. */
.ny-loop {
  position: relative;
  padding: 0 0 64px;
}
.ny-loop-track {
  position: absolute;
  top: 5px;
  left: 8px;
  right: 8px;
  bottom: 16px;
  pointer-events: none;
}
/* the thread itself is an SVG stroke so it can MARCH: the dashes travel
   clockwise — left-to-right along the stations, right-to-left home along
   the return edge — which animates the loop's direction of travel */
.ny-loop-thread {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  display: block;
}
.ny-loop-thread-path {
  x: 0px;
  y: 0px;
  width: 100%;
  height: 100%;
  rx: 24px;
  fill: none;
  stroke: var(--ny-trace);
  stroke-width: 1;
  stroke-dasharray: 4 7;
}
@media (prefers-reduced-motion: no-preference) {
  .ny-loop-thread-path {
    animation: nyThreadMarch 9s linear infinite;
  }
}
@keyframes nyThreadMarch {
  to {
    stroke-dashoffset: -110px;
  }
}
/* direction ticks riding the thread — forward along the top, back along
   the bottom (recreated product geometry: 8px triangles on a 1px line) */
.ny-loop-tick {
  position: absolute;
  top: -4px;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 7px solid var(--ny-trace);
}
.ny-loop-tick:nth-of-type(1) { left: 32%; }
.ny-loop-tick:nth-of-type(2) { left: 56%; }
.ny-loop-tick:nth-of-type(3) { left: 80%; }
.ny-loop-tick.is-back {
  top: auto;
  bottom: -4px;
  border-left: 0;
  border-right: 7px solid var(--ny-trace);
}
.ny-loop-tick.is-back:nth-of-type(4) { left: 24%; }
.ny-loop-row {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: clamp(16px, 2vw, 32px);
  padding: 0 clamp(28px, 3.4vw, 52px);
}
.ny-loop-node {
  position: relative;
  padding: 24px 0 0;
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 10px;
  row-gap: 8px;
  align-content: start;
}
/* the station: a point ON the thread — hollow until its turn comes */
.ny-loop-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--ny-canvas);
  border: 1px solid var(--ny-trace);
  transition: background 0.4s var(--ease-silk);
}
.ny-loop-node.is-on .ny-loop-dot {
  background: var(--ny-trace);
}
/* with motion, a station pops as its turn arrives (the sequence itself is
   driven by NymaScroll re-adding .is-on in order) */
@media (prefers-reduced-motion: no-preference) {
  .ny-loop-node.is-on .ny-loop-dot {
    animation: nyLoopDotPop 0.5s var(--ease-spring);
  }
}
@keyframes nyLoopDotPop {
  from {
    transform: scale(0.4);
  }
  to {
    transform: scale(1);
  }
}
/* ── the mini artifact windows: terminal → canvas → rule sheet → live
   storefront. Product-frame recreations, so they keep their own inner
   geometry; everything b/w except the ONE amber rule line in the code
   sheet (the written design rule travelling the loop). ── */
.ny-loop-scene {
  grid-column: 1 / -1;
  grid-row: 1;
  position: relative;
  height: 112px;
  margin-bottom: 6px;
  border: 1px solid var(--ny-line-strong);
  background: var(--ny-canvas);
  overflow: hidden;
}
/* 01 — the prototype terminal: ink panel, lines typed in, caret blinking */
.ny-loop-scene.is-proto {
  background: var(--ny-ink);
  border-color: var(--ny-ink);
  padding: 16px 14px;
  display: grid;
  gap: 10px;
  align-content: start;
}
.ny-loop-scene.is-proto b {
  display: block;
  height: 6px;
  background: rgba(255, 255, 255, 0.32);
  transform-origin: left center;
}
.ny-loop-scene.is-proto b:nth-of-type(1) { width: 56%; background: rgba(255, 255, 255, 0.6); }
.ny-loop-scene.is-proto b:nth-of-type(2) { width: 84%; }
.ny-loop-scene.is-proto b:nth-of-type(3) { width: 38%; }
.ny-loop-scene.is-proto b:nth-of-type(4) {
  width: 9px;
  height: 11px;
  background: rgba(255, 255, 255, 0.75);
}
/* 02 — the canvas: dotted ground, a selected frame with corner handles */
.ny-loop-scene.is-figma {
  background-image: radial-gradient(rgba(0, 0, 0, 0.16) 1px, transparent 1px);
  background-size: 12px 12px;
}
.ny-loop-scene.is-figma b {
  position: absolute;
  background: var(--ny-canvas);
}
.ny-loop-scene.is-figma b:nth-of-type(1) {
  left: 18%;
  top: 20%;
  width: 38%;
  height: 60%;
  border: 1.5px solid var(--ny-ink);
}
.ny-loop-scene.is-figma b:nth-of-type(1)::before,
.ny-loop-scene.is-figma b:nth-of-type(1)::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 7px;
  background: var(--ny-canvas);
  border: 1.5px solid var(--ny-ink);
}
.ny-loop-scene.is-figma b:nth-of-type(1)::before { left: -5px; top: -5px; }
.ny-loop-scene.is-figma b:nth-of-type(1)::after { right: -5px; bottom: -5px; }
.ny-loop-scene.is-figma b:nth-of-type(2) {
  left: 64%;
  top: 32%;
  width: 24%;
  height: 42%;
  border: 1px solid var(--ny-line-strong);
}
/* 03 — the rule sheet: code lines draw in; ONE line is the written rule */
.ny-loop-scene.is-code {
  padding: 16px 14px;
  display: grid;
  gap: 11px;
  align-content: start;
}
.ny-loop-scene.is-code b {
  display: block;
  height: 5px;
  background: rgba(0, 0, 0, 0.14);
  transform-origin: left center;
}
.ny-loop-scene.is-code b:nth-of-type(1) { width: 88%; }
.ny-loop-scene.is-code b:nth-of-type(2) { width: 62%; }
.ny-loop-scene.is-code b.is-rule { width: 34%; background: var(--ny-trace); }
.ny-loop-scene.is-code b:nth-of-type(4) { width: 76%; }
.ny-loop-scene.is-code b:nth-of-type(5) { width: 48%; }
/* 04 — live: the storefront reduced to its bones + a solid ink LIVE tag */
.ny-loop-scene.is-live {
  padding: 14px 14px 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  align-content: start;
}
.ny-loop-scene.is-live b {
  display: block;
  height: 26px;
  background: rgba(0, 0, 0, 0.1);
}
.ny-loop-scene.is-live b.is-mark {
  grid-column: 1 / -1;
  height: 10px;
  width: 44px;
  background: var(--ny-ink);
}
.ny-loop-scene.is-live::after {
  content: "LIVE";
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 6px;
  background: var(--ny-ink);
  color: #ffffff;
  font-family: var(--ny-mono);
  font-size: 8px;
  letter-spacing: 0.1em;
}
/* with motion: a scene assembles piece by piece as its station lights,
   and the terminal caret keeps blinking (final state ships in markup —
   reduced-motion and no-JS read the finished windows) */
@media (prefers-reduced-motion: no-preference) {
  .ny-loop-node.is-on .ny-loop-scene b {
    animation: nyLoopSceneIn 0.55s var(--ease-silk) backwards;
  }
  .ny-loop-node.is-on .ny-loop-scene b:nth-of-type(2) { animation-delay: 0.12s; }
  .ny-loop-node.is-on .ny-loop-scene b:nth-of-type(3) { animation-delay: 0.24s; }
  .ny-loop-node.is-on .ny-loop-scene b:nth-of-type(4) { animation-delay: 0.36s; }
  .ny-loop-node.is-on .ny-loop-scene b:nth-of-type(5) { animation-delay: 0.48s; }
  .ny-loop-node.is-on .ny-loop-scene.is-proto b:nth-of-type(4) {
    animation: nyLoopSceneIn 0.4s var(--ease-silk) 0.36s backwards,
      nyLoopCaret 1.2s steps(2, end) 0.8s infinite;
  }
}
@keyframes nyLoopSceneIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}
@keyframes nyLoopCaret {
  50% {
    opacity: 0;
  }
}
.ny-loop-index {
  grid-column: 1;
  grid-row: 2;
  font-family: var(--ny-mono);
  font-size: 10px;
  line-height: 1.5;
  letter-spacing: 0.08em;
  color: var(--ny-text-4);
}
.ny-loop-node strong {
  grid-column: 2;
  grid-row: 2;
  font-family: var(--ny-mono);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--ny-ink);
}
.ny-loop-node em {
  grid-column: 2;
  font-style: normal;
  font-family: var(--ny-mono);
  font-size: 11px;
  line-height: 1.65;
  letter-spacing: 0.02em;
  color: var(--ny-text-3);
  max-width: 24ch;
}
/* the return label sits ON the bottom edge, knocking the thread out
   behind it */
.ny-loop-return {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  margin: 0;
  padding: 0 14px;
  background: var(--ny-stage);
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--ny-text-4);
}

/* ---- pl.13 drafts desk ---- */
/* two AI drafts as papers on a desk: the front sheet shows whole, the other
   peeks behind, and clicking a sheet shuffles it forward. Poses are
   translate/rotate/scale only (motion rules); translate percentages are
   tuned so the scaled back sheet stays inside the content column. */
.ny-drafts {
  position: relative;
  aspect-ratio: 1.9;
}
.ny-draft {
  position: absolute;
  top: 0;
  left: 0;
  width: 54%;
  padding: 0;
  border: 1px solid var(--ny-line-strong);
  background: var(--ny-canvas);
  box-shadow: var(--ny-shadow-rest);
  cursor: pointer;
  text-align: left;
}
.ny-draft img {
  display: block;
  width: 100%;
  height: auto;
}
.ny-draft-chip {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  padding: 4px 8px;
  background: var(--ny-ink);
  color: #ffffff;
  font-family: var(--ny-mono);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}
.ny-drafts[data-front="a"] .is-a,
.ny-drafts[data-front="b"] .is-b {
  z-index: 2;
  box-shadow: var(--ny-shadow-lift);
}
.ny-drafts[data-front="a"] .is-a {
  transform: translate(4%, 5%) rotate(-0.6deg);
}
.ny-drafts[data-front="a"] .is-b {
  transform: translate(92%, 1%) rotate(1.6deg) scale(0.84);
}
.ny-drafts[data-front="b"] .is-b {
  transform: translate(78%, 5%) rotate(0.6deg);
}
.ny-drafts[data-front="b"] .is-a {
  transform: translate(-1%, 1%) rotate(-1.6deg) scale(0.84);
}
@media (prefers-reduced-motion: no-preference) {
  .ny-draft {
    transition: transform 0.55s var(--ease-silk),
      box-shadow 0.55s var(--ease-silk);
  }
}

/* ---- pl.14 system board ---- */
/* the coded rules rendered live as component specimens — a product-frame
   recreation, so the framed card is earned; Activation Blue stays with the
   interactive law card (pl.07), and the one trace chip is the product's
   own RESERVE MET idiom */
.ny-sysboard {
  border: 1px solid var(--ny-line-strong);
  background: var(--ny-canvas);
  box-shadow: var(--ny-shadow-rest);
  padding: 20px;
  display: grid;
  gap: 22px;
}
/* the document masthead — carries the "one page, generated from the repo"
   fact the retired artifact screenshot used to carry */
.ny-sysboard-mast {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin: -20px -20px 0;
  padding: 12px 14px;
  background: var(--ny-ink);
  color: #ffffff;
}
.ny-sysboard-mast b {
  font-family: var(--ny-mono);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.22em;
}
.ny-sysboard-mast span {
  font-family: var(--ny-mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
  text-align: right;
}
.ny-sysboard-head {
  display: block;
  margin-bottom: 12px;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ny-text-4);
}
.ny-sysboard-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.ny-sysboard-row b {
  font-weight: 400;
  font-family: var(--ny-mono);
}
.ny-sys-btn {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 10px 14px;
}
.ny-sys-btn.is-solid {
  background: var(--ny-ink);
  color: #ffffff;
}
.ny-sys-btn.is-line {
  border: 1px solid var(--ny-ink);
  color: var(--ny-ink);
}
.ny-sys-link {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ny-ink);
  border-bottom: 1px solid var(--ny-ink);
  padding-bottom: 2px;
}
.ny-sys-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ny-ink);
}
.ny-sys-tag i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ny-ink);
}
.ny-sys-chip {
  padding: 4px 8px;
  background: var(--ny-trace-soft);
  color: var(--ny-trace-dark);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.ny-sys-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ny-text-3);
}
.ny-sys-field {
  display: block;
  width: 100%;
  max-width: 300px;
  border: 1px solid var(--ny-line-strong);
  padding: 10px 12px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--ny-text-4);
}
.ny-sysboard-foot {
  margin: 0;
  border-top: 1px solid var(--ny-line);
  padding-top: 12px;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--ny-text-4);
}

/* ---- pl.16 canvas + pl.17 prototype row ---- */
/* the canvas takes the copy columns (a small proof plate, not a reading
   surface) and centers against the taller phone in the aside columns */
.ny-protorow {
  align-items: center;
}
.ny-canvas-fig {
  grid-column: 1 / 7;
  min-width: 0;
}
/* bottom-anchored cover crop: the box is 64 image-px shorter than the
   asset, so the baked-in toggle strip at the top is cut while the
   Onboarding row label keeps its clearance */
.ny-canvas-crop {
  position: relative;
  aspect-ratio: 1440 / 1336;
  overflow: hidden;
}
.ny-canvas-crop img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 100%;
}

/* ── Ch 6 · phones ─────────────────────────────────────────────────────── */
.ny-phones {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(20px, 3vw, 48px);
  align-items: start;
}
.ny-phones .ny-plate:nth-child(2) {
  margin-top: clamp(20px, 2.6vw, 40px);
}
.ny-phones .ny-plate:nth-child(3) {
  margin-top: clamp(40px, 5vw, 80px);
}
/* (.ny-wide no longer needs its own margin — chapter row-gap owns it) */

/* ── The Turn — ink band; the page's ONE seal-red stitch ───────────────── */
.ny-turn-wrap {
  padding: calc(var(--gap-section) * 0.35) 0;
  scroll-margin-top: 88px;
}
.ny-turn {
  box-sizing: border-box;
  /* dark-ground light model: top rim catch-light + faint from-top glow
     (shared treatment with the site footer) — base is pure black now
     (owner 2026-07-14) */
  background: radial-gradient(120% 80% at 50% 0%, #161616, #000000);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  color: #f2efea;
  padding: clamp(48px, 6vw, 88px) clamp(28px, 4vw, 72px);
}
.ny-turn-eyebrow {
  margin: 0 0 18px;
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(242, 239, 234, 0.55);
}
.ny-turn-stitch {
  display: block;
  width: clamp(120px, 16vw, 220px);
  height: 2px;
  margin-bottom: clamp(24px, 3vw, 40px);
  background-image: repeating-linear-gradient(
    90deg,
    var(--accent-red, #7e1f17) 0 10px,
    transparent 10px 17px
  );
}
.ny-turn h2 {
  margin: 0 0 clamp(28px, 3.6vw, 48px);
  max-width: 20ch;
  font-family: var(--ny-display);
  font-size: clamp(36px, 4vw, 58px);
  font-weight: 300;
  line-height: 1.14;
  letter-spacing: -0.005em;
  text-wrap: balance;
}
.ny-turn-copy {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(24px, 4vw, 64px);
  max-width: none;
}
.ny-turn-copy p {
  margin: 0;
  border-top: 1px solid rgba(242, 239, 234, 0.18);
  padding-top: 18px;
  font-size: var(--text-body, 18px);
  line-height: 1.66;
  color: rgba(242, 239, 234, 0.82);
}
.ny-turn-foot {
  margin: clamp(32px, 4vw, 52px) 0 0;
  font-family: var(--ny-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: rgba(242, 239, 234, 0.5);
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 1080px) {
  .ny-rail {
    display: none;
  }
  .ny-acts-main {
    grid-column: 1 / -1;
  }
  .ny-hero-lede,
  .ny-hero-meta {
    grid-column: 1 / -1;
  }
  .nyma-case-page .proj-summary h2 {
    grid-column: 1 / -1;
  }
  .nyma-case-page .proj-summary .proj-summary-copy {
    grid-column: 1 / -1;
  }
  .ny-copy {
    grid-column: 1 / -1;
  }
  .ny-aside,
  .ny-fates,
  .ny-canvas-fig,
  .ny-competitive {
    grid-column: 1 / -1;
  }
}
@media (max-width: 768px) {
  .ny-hero-meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 16px;
  }
  .ny-wall-grid {
    grid-template-columns: 1fr;
  }
  .ny-wall-col:nth-child(2) {
    margin-top: 0;
  }
  .ny-phones {
    grid-template-columns: 1fr;
  }
  .ny-phones .ny-plate:nth-child(2),
  .ny-phones .ny-plate:nth-child(3) {
    margin-top: 0;
  }
  /* phone: the drafts desk stacks — both sheets full width, no shuffle */
  .ny-drafts {
    aspect-ratio: auto;
    display: grid;
    gap: 16px;
  }
  .ny-draft {
    position: static;
    width: 100%;
    transform: none !important;
  }
  .ny-roles-stage {
    grid-template-columns: 1fr;
  }
  /* phone: the racetrack thread hides; stations stack with their dots on a
     left margin and the return label becomes a plain closing row */
  .ny-loop {
    padding-bottom: 0;
  }
  .ny-loop-track {
    display: none;
  }
  .ny-loop-row {
    grid-template-columns: 1fr;
    row-gap: 20px;
    padding: 0;
  }
  .ny-loop-node {
    padding: 0 0 0 24px;
  }
  .ny-loop-dot {
    top: 4px;
  }
  .ny-loop-return {
    position: static;
    transform: none;
    padding: 16px 0 0;
    background: none;
    text-align: left;
  }
  .ny-turn-copy {
    grid-template-columns: 1fr;
  }
  .ny-etym {
    grid-template-columns: 1fr;
    row-gap: 20px;
  }
  .ny-etym-thread {
    width: 120px;
    justify-self: start;
  }
  .ny-competitive-zoom {
    position: static;
    width: 100%;
    margin-top: 12px;
  }
}

/* ── Pl.16 · the phone prototype (markup in nyma-phone.tsx; the styles sit
   here because client modules can't export strings across the server
   boundary). In-screen color is strict monochrome — ink / grey / panel
   only; interaction states speak in black-and-white (solid ink tag, ink
   underline, weight shift). Layout runs on one grid: 24px screen inset,
   an 88px 4:5 image column, gap 16, even-px spacing throughout. ── */
.nyp {
  display: grid;
  gap: 16px;
  justify-items: center;
}
.nyp-tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}
.nyp-tabs-note {
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--ny-text-4);
  margin-left: 8px;
}
/* neutral shell: even-px bezel, no notch theater */
.nyp-shell {
  box-sizing: border-box;
  width: min(100%, 380px);
  padding: 10px;
  border: 2px solid var(--ny-ink);
  border-radius: 48px;
  background: var(--ny-canvas);
  box-shadow: var(--ny-shadow-lift);
}
.nyp-screen {
  --nyp-ink: #111111;
  --nyp-grey: #8a8a8a;
  --nyp-line: #e4e4e4;
  --nyp-panel: #f4f4f4;
  position: relative;
  display: flex;
  flex-direction: column;
  aspect-ratio: 390 / 844;
  border: 1px solid var(--nyp-line);
  border-radius: 38px;
  overflow: hidden;
  background: #ffffff;
  color: var(--nyp-ink);
  font-family: var(--ny-display);
}
/* :where() keeps the reset at zero specificity so the in-screen type rules
   below (nav labels, summary rows) still win the cascade */
:where(.nyp-screen) button {
  appearance: none;
  border: 0;
  background: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.nyp button:focus-visible {
  outline: var(--focus-ring);
  outline-offset: -2px;
}
.nyp-status {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px 4px;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
}
.nyp-head {
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  align-items: center;
  padding: 8px 24px 14px;
}
.nyp-head svg {
  display: block;
}
.nyp-brand {
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.32em;
  text-indent: 0.32em;
}
.nyp-head-btn {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
}
.nyp-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  /* clip, not hidden: hidden boxes still scroll programmatically when a
     clipped child button takes focus, shearing the whole screen upward */
  overflow: clip;
  border-top: 1px solid var(--nyp-line);
}
.nyp-pagehead {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
  padding: 16px 24px 12px;
}
.nyp-title {
  margin: 0;
  font-family: var(--ny-mono);
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1;
}
.nyp-eyebrow {
  margin: 0 0 6px;
  font-family: var(--ny-mono);
  font-size: 9px;
  letter-spacing: 0.18em;
  color: var(--nyp-grey);
}
.nyp-subline {
  margin: 8px 0 0;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--nyp-grey);
}
.nyp-subline b {
  font-weight: 700;
  color: var(--nyp-ink);
}
.nyp-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 2px;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  white-space: nowrap;
}
.nyp-live i {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--nyp-ink);
}
.nyp-sort {
  padding-bottom: 4px;
  font-family: var(--ny-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  color: var(--nyp-ink);
  white-space: nowrap;
}
/* filter rows — depicted state (the mock shows one active cell) */
.nyp-filters {
  display: flex;
  border-top: 1px solid var(--nyp-line);
  border-bottom: 1px solid var(--nyp-line);
  font-family: var(--ny-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  white-space: nowrap;
  overflow: hidden;
}
.nyp-filters span {
  padding: 12px 16px;
  border-right: 1px solid var(--nyp-line);
  color: var(--nyp-ink);
}
/* the first cell's label sits on the shared 24px content inset */
.nyp-filters span:first-child {
  padding-left: 24px;
}
.nyp-filters span.is-on {
  background: var(--nyp-ink);
  color: #ffffff;
}
.nyp-filters b {
  font-weight: 700;
}
/* auction lot rows — tap to watch (added micro-interaction, ink language) */
.nyp-lots {
  flex: 1;
  min-height: 0;
  overflow: clip;
}
.nyp-lot {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 16px;
  width: 100%;
  padding: 8px 24px;
  border-bottom: 1px solid var(--nyp-line);
}
.nyp-lot[aria-pressed="true"] {
  box-shadow: inset 2px 0 0 var(--nyp-ink);
}
/* shared image cell — 88 × 110 (4:5), same ratio as every product crop */
.nyp-thumb {
  position: relative;
  width: 88px;
  height: 110px;
  overflow: hidden;
  background: var(--nyp-panel);
}
.nyp-thumb img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* designed no-image state — hairline frame, two-line mono note */
.nyp-thumb.is-empty {
  display: grid;
  place-content: center;
  background: #ffffff;
  border: 1px solid var(--nyp-line);
}
.nyp-noimg {
  display: grid;
  gap: 4px;
  justify-items: center;
  font-family: var(--ny-mono);
  font-size: 8px;
  letter-spacing: 0.12em;
  color: var(--nyp-grey);
}
.nyp-noimg i {
  font-style: normal;
}
.nyp-noimg i:first-child {
  color: var(--nyp-ink);
}
.nyp-lot-info {
  min-width: 0;
  display: grid;
  gap: 4px;
  align-content: start;
}
.nyp-lot-line {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-family: var(--ny-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  color: var(--nyp-grey);
}
/* watching = solid ink tag (interaction speaks black-and-white) */
.nyp-watch-tag {
  padding: 2px 6px;
  background: var(--nyp-ink);
  color: #ffffff;
  font-weight: 700;
  white-space: nowrap;
}
.nyp-lot-title {
  margin: 0;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.3;
  color: var(--nyp-ink);
}
.nyp-lot-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  margin-top: 4px;
  font-family: var(--ny-mono);
  font-size: 13px;
  font-weight: 700;
}
.nyp-lot-row em {
  font-style: normal;
  font-size: 12px;
  font-weight: 400;
}
/* closing-soon countdown: full ink weight (was the mock's gold) */
.nyp-lot-row em.is-hot {
  font-weight: 700;
}
/* bag — same 88px image column as the auction list, so the text column
   and the right price edge land on the same grid lines across screens */
.nyp-bagitem {
  display: grid;
  grid-template-columns: 88px 1fr 24px;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--nyp-line);
}
.nyp-bag-x {
  align-self: start;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  font-family: var(--ny-mono);
  font-size: 13px;
  color: var(--nyp-ink);
}
.nyp-bag-empty {
  margin: 0;
  padding: 28px 24px;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--nyp-grey);
}
.nyp-bag-restore {
  margin-left: 10px;
  color: var(--nyp-ink);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
  letter-spacing: 0.1em;
}
.nyp-summary {
  margin-top: auto;
  padding: 16px 24px;
  background: var(--nyp-panel);
  font-family: var(--ny-mono);
}
.nyp-summary-head {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--nyp-ink);
  font-size: 9px;
  letter-spacing: 0.16em;
}
.nyp-summary-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 8px 0;
  font-size: 11px;
  letter-spacing: 0.04em;
}
.nyp-summary-row.is-faint {
  color: var(--nyp-grey);
}
.nyp-summary-row em {
  font-style: normal;
}
/* the opt-in is live — ink underline marks it, weight answers the state */
button.nyp-summary-row span em {
  color: var(--nyp-ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}
button.nyp-summary-row > em {
  font-weight: 400;
}
button.nyp-summary-row[aria-pressed="true"] > em {
  font-weight: 700;
}
.nyp-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  padding: 12px 0 0;
  border-top: 1px solid var(--nyp-ink);
  margin-top: 6px;
}
.nyp-total span {
  font-size: 10px;
  letter-spacing: 0.14em;
}
.nyp-total strong {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.nyp-checkout {
  display: grid;
  place-items: center;
  min-height: 54px;
  background: var(--nyp-ink);
  color: #ffffff;
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
}
/* saved grid */
.nyp-grid {
  flex: 1;
  min-height: 0;
  overflow: clip;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: start;
}
.nyp-card {
  min-width: 0;
  border-bottom: 1px solid var(--nyp-line);
}
.nyp-card:nth-child(odd) {
  border-right: 1px solid var(--nyp-line);
}
.nyp-card-img {
  position: relative;
  aspect-ratio: 4 / 5;
  background: var(--nyp-panel);
  overflow: hidden;
}
.nyp-card-img img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.nyp-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  background: #ffffff;
  border: 1px solid var(--nyp-ink);
  font-family: var(--ny-mono);
  font-size: 8px;
  letter-spacing: 0.12em;
  white-space: nowrap;
}
.nyp-clock {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 4px 8px;
  background: var(--nyp-ink);
  color: #ffffff;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
}
.nyp-card-body {
  display: grid;
  gap: 4px;
  padding: 12px 16px 16px;
}
.nyp-card-maison {
  font-family: var(--ny-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  color: var(--nyp-grey);
}
.nyp-card-title {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: var(--nyp-ink);
}
.nyp-card-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  font-family: var(--ny-mono);
  font-size: 12px;
  font-weight: 700;
}
.nyp-card-row em {
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  color: var(--nyp-grey);
  white-space: nowrap;
}
/* bottom nav — AUCTIONS is the one live destination */
.nyp-nav {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-top: 1px solid var(--nyp-line);
  /* zero side padding: five exact fifths, one shared center axis per cell */
  padding: 10px 0 12px;
  background: #ffffff;
}
.nyp-nav > * {
  display: grid;
  justify-items: center;
  gap: 4px;
  padding: 2px 0 0;
  font-family: var(--ny-mono);
  font-size: 8px;
  letter-spacing: 0.1em;
  color: var(--nyp-ink);
}
.nyp-nav i {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: transparent;
}
.nyp-nav .is-here i {
  background: var(--nyp-ink);
}
.nyp-foot {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 14px;
}

/* ── Outcome band — Nyma voice: archival mono labels in neutral ink (the
   color law: Activation Blue stays interactive-only, so the band's eyebrow
   and ticks read in the archive's own greys), Murecho display numeral ── */
.nyma-case-page .ob-band {
  --ob-mono: var(--ny-mono);
  --ob-rule: var(--ny-line-strong);
  --ob-detail: var(--ny-text-3);
  --ob-body: var(--ny-text-2);
  --ob-stat-ink: var(--ny-ink);
  --ob-stat-font: var(--ny-display);
  /* 400, not 500 — the weight ladder keeps 500 as a hover step only */
  --ob-stat-weight: 400;
  /* rules align with the content column (owner 2026-07-14: the band's
     hairlines ran a gutter wider than the hero meta's rule directly above
     — two adjacent rules at two widths read as a slip). The band box
     shrinks to the content width and drops its inner gutter instead. */
  max-width: calc(var(--work-shell-max) - 2 * var(--work-gutter));
  --ob-pad-x: 0px;
}
`;

// ── helpers ─────────────────────────────────────────────────────────────

/* ---- thread rail ---- */
const railTopics = [
  "The gap",
  "The thesis",
  "The language",
  "The product",
  "The framework",
  "The continuity",
  // de-templated 2026-07-07: Pulse ch.10 already closes on "The turn";
  // Nyma's rail/TOC label varies (#ny-turn anchor + the Turn band's
  // reflection closes on the platform system rather than the name alone)
  "One system",
];

function ThreadRail() {
  return (
    <aside className="ny-rail" aria-hidden="true">
      <div className="ny-rail-card" data-fade>
        <span className="ny-rail-head">INDEX — νήμα</span>
        <div className="ny-rail-body">
          <div className="ny-thread">
            <i className="ny-thread-fill" />
          </div>
          <ol data-rail>
            {railTopics.map((label, i) => (
              <li key={label} className="is-done">
                <i>{i + 1}.0</i>
                {label}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </aside>
  );
}

/* ---- topic head ---- */
// The manual's page furniture: "Topic — n.0 / Page no. — NN" over a drawn
// hairline, then the chapter claim.
// One mono line of page furniture, then the claim (owner 2026-07-14: the
// old two-line Topic/Page block + a right-aligned chapter name stacked
// three metadata items over every H2 — and the name duplicated both the
// rail's active entry and the claim below it).
function TopicHead({
  number,
  page,
  title,
}: {
  number: string;
  page: string;
  title: string;
}) {
  const [idx] = number.split("·").map((s) => s.trim());
  return (
    <header className="ny-chapter-head" data-fade>
      <div className="ny-chapter-meta">
        <span>
          Topic — {Number(idx)}.0 · Page no. — {page}
        </span>
      </div>
      <i className="ny-hairline" data-hairline aria-hidden="true" />
      <h2 className="ny-chapter-claim">{title}</h2>
    </header>
  );
}

/* ---- prose and caption ---- */
// No eyebrow tags (owner 2026-07-14: "不同的大的小的标题" — the mono caps
// row above every H3 was a fourth heading tier; the hierarchy is now
// topic line → H2 claim → H3 → body, nothing else).
function Prose({ section }: { section: CaseSection }) {
  return (
    <div className="ny-copy" data-fade>
      <h3>{section.heading}</h3>
      {section.body.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

// One furniture row per figure (owner hierarchy cleanup, 2026-07-13):
// caption left, gesture cue right — the same single row under every
// artifact, never a second stacked mono line.
function Caption({
  pl,
  cue,
  children,
}: {
  pl: string;
  cue?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <figcaption className="ny-caption">
      <span>
        <em className="ny-pl">Pl. {pl}</em>
        {children}
      </span>
      {cue ? <InteractiveCue>{cue}</InteractiveCue> : null}
    </figcaption>
  );
}

/* ---- wall plates data ---- */
// Column split balances the hang: col1 sums 5841, col2 5748 at the shared
// 900 width, so with col2's clamp(48px…96px) drop the two bottoms land
// within ~40px (2026-07-13 audit: the old split left a ~300px hole under
// the right column). The two Sell pages read stacked in col2 on purpose.
const wallPlates: [string, number, number, string][] = [
  // column 1
  ["web-marketplace", 900, 1583, "Marketplace — index"],
  ["web-profile", 900, 1688, "Profile — public"],
  ["web-auction", 900, 1583, "Auctions — index"],
  ["web-message", 900, 987, "Messages"],
  // column 2
  ["web-mkt-listing", 900, 966, "Marketplace — listing intake"],
  ["web-live-auctions", 900, 844, "Auctions — live"],
  ["web-sell", 900, 1969, "Sell — listing intake"],
  ["web-selling-method", 900, 1969, "Sell — method"],
];

// ── the page ────────────────────────────────────────────────────────────

export function NymaCaseLayout({ project }: { project: Project }) {
  const meta = [
    ["Role", project.role],
    ["Duration", project.duration],
    ["Type", project.type],
    ["Teams", project.teams],
  ];
  const [inherit, thread, rulebook, pages, codify, handoff] =
    project.chapters ?? [];
  const moment = project.moment;

  return (
    <article className="case-study-page nyma-case-page" data-has-cover="false">
      <style
        dangerouslySetInnerHTML={{
          __html: stripCssComments(nymaCss),
        }}
      />
      <NymaScroll />
      <div className="ny-navscrim" aria-hidden="true" />
      {/* phone reading aids: progress hairline + chapter index (the page runs
          ~38 phone screens). Labels derive from the chapters' own numbers. */}
      <CaseMap
        chapters={[
          ...(project.chapters ?? []).map((ch, i) => ({
            id: `ny-ch${i + 1}`,
            label: (ch.number.split("·")[1] ?? ch.number).trim(),
          })),
          { id: "ny-turn", label: "One system" },
        ]}
      />

      {/* ── Hero: the manual's page furniture, then the cover band ── */}
      <section className="ny-hero" id="header">
        <div className="ny-hero-head">
          <div className="ny-archhead" data-fade>
            <span>
              Topic — Case
              <br />
              Page no. — 01
            </span>
            <span className="ny-archhead-title">
              Nyma
              <br />
              <em>Platform Brand &amp; Product System</em>
            </span>
            <span className="ny-archhead-right">2025 – 2026</span>
          </div>
          <i className="ny-hairline" data-hairline aria-hidden="true" />
        </div>
        <div className="ny-hero-band">
          <div className="ny-hero-band-shell">
            <h1 className="ny-hero-word" aria-label="Nyma">
              <span>NYMA</span>
            </h1>
            <p
              className="ny-hero-tags"
              data-stream="2C SOCIAL RESALE · DESIGNER · LUXURY · VINTAGE"
            >
              2C SOCIAL RESALE · DESIGNER · LUXURY · VINTAGE
            </p>
            <i className="ny-hero-trace" aria-hidden="true" />
          </div>
        </div>
        <div className="ny-hero-below">
          <p className="ny-hero-lede" data-fade>
            {project.oneliner}
          </p>
          {/* (the manual's black TOC card is retired — 2026-07-13 cleanup;
              the sticky thread rail below is the page's index) */}
          <dl className="ny-hero-meta" data-fade>
            {meta.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── At a glance: the recruiter's skim row (audit #1) ── */}
      {project.outcomes && <OutcomeBand outcomes={project.outcomes} />}

      {/* ── Overview ── */}
      <section className="proj-summary" aria-labelledby="project-summary">
        <h2 id="project-summary" data-fade>
          Project Summary
        </h2>
        <div className="proj-summary-copy">
          {(project.summary ?? [project.blurb]).map((p) => (
            <p key={p} data-fade>
              {p}
            </p>
          ))}
        </div>
        {/* (the 4/3/2/1 ledger is retired — 2026-07-13 cleanup; the
            at-a-glance band above keeps the page's real numbers) */}
      </section>

      {/* ── The acts: the thread stitches the chapters together ── */}
      <div className="ny-acts">
        <ThreadRail />
        <div className="ny-acts-main">
          {/* ── 1.0 · The gap ── */}
          {inherit && (
            <section
              className="case-chapter ny-chapter"
              data-act="0"
              id="ny-ch1"
            >
              <TopicHead number={inherit.number} page="02" title={inherit.title} />
              <div className="ny-section">
                {inherit.sections[0] && <Prose section={inherit.sections[0]} />}
                <aside className="ny-aside" data-fade>
                  <div
                    className="ny-condition"
                    role="img"
                    aria-label="A condition report, as found: marketplace architecture sound, auction architecture sound, website live — but the visual foundation worn, the UI logic in need of service, and the brand rationale undocumented."
                  >
                    <header>
                      <span>Condition report</span>
                      <span>as found</span>
                    </header>
                    <p className="ny-condition-lot">
                      LOT 001 · NYMA · PLATFORM · 2025
                    </p>
                    <ul>
                      <li data-state="ok">
                        <span>marketplace architecture</span>
                        <em>sound</em>
                      </li>
                      <li data-state="ok">
                        <span>auction architecture</span>
                        <em>sound</em>
                      </li>
                      <li data-state="ok">
                        <span>website</span>
                        <em>live</em>
                      </li>
                      <li data-state="worn">
                        <span>visual foundation</span>
                        <em>worn</em>
                      </li>
                      <li data-state="worn">
                        <span>UI logic</span>
                        <em>needs service</em>
                      </li>
                      <li data-state="missing">
                        <span>brand rationale</span>
                        <em>undocumented</em>
                      </li>
                    </ul>
                    <footer>
                      provenance — two founders · one name, meaning unwritten
                    </footer>
                  </div>
                  <Caption pl="01">
                    the platform, catalogued the way it catalogues its objects
                  </Caption>
                </aside>
              </div>
            </section>
          )}

          {/* ── 2.0 · The thesis ── */}
          {thread && (
            <section
              className="case-chapter ny-chapter"
              data-act="1"
              id="ny-ch2"
            >
              <TopicHead number={thread.number} page="03" title={thread.title} />
              <div className="ny-section">
                {thread.sections[0] && <Prose section={thread.sections[0]} />}
                <figure className="ny-fates" data-fade>
                  <div className="ny-plate">
                    <Image
                      src="/media/work/nyma/fates.png"
                      width={750}
                      height={615}
                      alt="Three classical depictions of the Fates pinned together: a painting of the three sisters spinning inside a swirl of thread, a dark painting of a hand lowering scissors toward a single taut thread, and an engraving of the Fates spinning, measuring, and cutting."
                      sizes="(max-width: 1080px) 100vw, 40vw"
                    />
                  </div>
                  <Caption pl="02">
                    the working wall — the Fates spin, measure, and cut
                  </Caption>
                </figure>
              </div>

              <div className="ny-etym" data-fade>
                <span className="ny-etym-greek">νήμα</span>
                <i className="ny-etym-thread" aria-hidden="true" />
                <span className="ny-etym-name">NYMA</span>
                <p className="ny-etym-def">
                  /ˈni.ma/ — Greek: “thread; yarn”
                </p>
              </div>

              <figure className="ny-strip" data-fade>
                <div className="ny-strip-track">
                  <div className="ny-plate">
                    <Image
                      src="/media/work/nyma/moodboard-a.png"
                      width={1440}
                      height={1265}
                      alt="Moodboard slice: Not Just A Label homepage studies with dramatic fashion photography."
                      sizes="60vw"
                    />
                  </div>
                  <div className="ny-plate">
                    <Image
                      src="/media/work/nyma/vase.png"
                      width={500}
                      height={908}
                      alt="A Greek black-figure vase painting of two weavers at a loom, above rows of meander and wave patterns."
                      sizes="24vw"
                    />
                  </div>
                  <div className="ny-plate">
                    <Image
                      src="/media/work/nyma/moodboard-c.png"
                      width={1440}
                      height={920}
                      alt="Moodboard slice: a giant NYMA wordmark test beside early palette chips, resale-platform screenshots, and Greek textile patterns."
                      sizes="70vw"
                    />
                  </div>
                  <div className="ny-plate">
                    <Image
                      src="/media/work/nyma/moodboard-b.png"
                      width={1440}
                      height={1660}
                      alt="Moodboard slice: editorial e-commerce references — product grids, model photography, studio stills."
                      sizes="42vw"
                    />
                  </div>
                  <div className="ny-plate">
                    <Image
                      src="/media/work/nyma/moodboard-d.png"
                      width={1440}
                      height={1178}
                      alt="Moodboard slice: woven textile structure studies arranged as a specimen sheet."
                      sizes="50vw"
                    />
                  </div>
                </div>
                <div className="ny-strip-foot">
                  <Caption pl="03">
                    the moodboard table — cut from a 32,768-px board
                  </Caption>
                  <InteractiveCue>
                    <span className="ny-cue-scrub">
                      keep scrolling — the table slides past
                    </span>
                    <span className="ny-cue-hand">
                      scroll the table sideways — it slides past
                    </span>
                  </InteractiveCue>
                </div>
              </figure>

              <div className="ny-section">
                {thread.sections[1] && <Prose section={thread.sections[1]} />}
                <figure className="ny-competitive" data-fade>
                  <div className="ny-plate">
                    <Image
                      src="/media/work/nyma/competitive-full.png"
                      width={1440}
                      height={881}
                      alt="A wide competitive-analysis board: screen flows of eBay, Grailed, The RealReal, Depop, Vestiaire Collective and others, layered and annotated."
                      sizes="(max-width: 1080px) 100vw, 40vw"
                    />
                  </div>
                  <div className="ny-competitive-zoom" aria-hidden="true">
                    <Image
                      src="/media/work/nyma/competitive-zoom.png"
                      width={1100}
                      height={1129}
                      alt=""
                      sizes="20vw"
                    />
                  </div>
                  <Caption pl="04">
                    the field, layered — what each resale platform teaches
                  </Caption>
                </figure>
              </div>

              <figure className="ny-full" data-fade>
                <NymaDirections />
                <Caption
                  pl="05"
                  cue="click a direction — the same platform, four voices"
                >
                  four AI-drafted directions, kept as conversation material —
                  never as answers
                </Caption>
              </figure>
            </section>
          )}

          {/* ── 3.0 · The language ── */}
          {rulebook && (
            <section
              className="case-chapter ny-chapter"
              data-act="2"
              id="ny-ch3"
            >
              <TopicHead
                number={rulebook.number}
                page="04"
                title={rulebook.title}
              />
              <div className="ny-section">
                {rulebook.sections[0] && <Prose section={rulebook.sections[0]} />}
              </div>

              <figure className="ny-stack is-open" data-fade>
                <div className="ny-stack-pages">
                  {(
                    [
                      [
                        // -v2: agency credit repainted out (2026-07-08)
                        "manual-cover-v2",
                        790,
                        "The manual cover: a white NYMA wordmark cropped by the edge of a black band, above the words Brand Guidance.",
                      ],
                      [
                        "manual-values",
                        810,
                        "The Brand Values page: continuity at the point of sale, structure creates trust, restraint as responsibility, transparency enforced, value circulates.",
                      ],
                      [
                        "manual-palette",
                        810,
                        "The Color Pallet page: a Greek vase weaving scene beside the role-based palette — Ceramic Black, Ceramic Yellow, Activation Blue, and the archival whites.",
                      ],
                      [
                        "manual-type",
                        810,
                        "The Typeface page: Murecho specimens with usage rules — Medium for titles, Regular for body.",
                      ],
                    ] as const
                  ).map(([name, h, alt]) => (
                    <div className="ny-stack-page ny-plate" key={name}>
                      <Image
                        src={`/media/work/nyma/${name}.png`}
                        width={1440}
                        height={h}
                        alt={alt}
                        sizes="(max-width: 1080px) 100vw, 38vw"
                      />
                    </div>
                  ))}
                </div>
                <Caption pl="06">
                  four openings of the seventeen-page manual — it fans open as
                  you arrive
                </Caption>
              </figure>

              <div className="ny-section">
                {rulebook.sections[1] && <Prose section={rulebook.sections[1]} />}
              </div>

              <figure className="ny-full" data-fade>
                <NymaColorRoles />
                <Caption
                  pl="07"
                  cue="click a swatch — the card shows where that color is allowed"
                >
                  the color law, live — role-based, never decorative
                </Caption>
              </figure>

              <figure className="ny-full ny-ladder-wrap" data-fade>
                <div className="ny-ladder">
                  {(
                    [
                      ["64", "Continuity"],
                      ["48", "Provenance"],
                      ["36", "Archive"],
                      ["24", "Reserve met"],
                    ] as const
                  ).map(([px, word]) => (
                    <div className="ny-ladder-row" data-px={px} key={px}>
                      <span className="ny-ladder-px">
                        {px} px · Murecho {px === "64" || px === "48" ? "300" : "400"}
                      </span>
                      <span className="ny-ladder-word">{word}</span>
                    </div>
                  ))}
                </div>
                <div className="ny-ladder-foot">
                  <Caption pl="08">
                    the type ladder — 64 / 48 / 36 / 24, the manual’s scale
                  </Caption>
                  <InteractiveCue>
                    <span className="ny-cue-hover">
                      hover a line — it tries its heavier weight
                    </span>
                    <span className="ny-cue-tap">
                      tap a line — it tries its heavier weight
                    </span>
                  </InteractiveCue>
                </div>
              </figure>
            </section>
          )}

          {/* ── 4.0 · The product ── */}
          {pages && (
            <section
              className="case-chapter ny-chapter"
              data-act="3"
              id="ny-ch4"
            >
              <TopicHead number={pages.number} page="05" title={pages.title} />
              <div className="ny-section">
                {pages.sections[0] && <Prose section={pages.sections[0]} />}
                <aside className="ny-aside" data-fade>
                  {/* ~50 comes from the final Figma export (data note) — the
                      hand-designed 30–40 keeps its one home in the
                      at-a-glance band */}
                  <div className="ny-tally">
                    <strong>~50</strong>
                    <span>
                      mocks in the final Figma export — the key pages,
                      designed and iterated by hand
                    </span>
                    <em>
                      marketplace · auctions · sell · profile · onboarding ·
                      messaging · orders
                    </em>
                  </div>
                </aside>
              </div>

              <figure className="ny-wall" data-fade>
                <div className="ny-wall-grid">
                  {[0, 1].map((col) => (
                    <div
                      className="ny-wall-col"
                      data-drift={col === 1 ? "-1" : "1"}
                      key={col}
                    >
                      {wallPlates
                        .slice(col * 4, col * 4 + 4)
                        .map(([name, w, h, label]) => (
                          <figure className="ny-plate" key={name}>
                            <Image
                              src={`/media/work/nyma/${name}.png`}
                              width={w}
                              height={h}
                              alt={`Nyma desktop mock: ${label}.`}
                              sizes="(max-width: 768px) 100vw, 40vw"
                            />
                            <figcaption>{label}</figcaption>
                          </figure>
                        ))}
                    </div>
                  ))}
                </div>
                <Caption pl="09">
                  the spine of the product, hung as plates — the columns drift
                  as you pass
                </Caption>
              </figure>

              <div className="ny-section ny-walkrow">
                {pages.sections[1] && <Prose section={pages.sections[1]} />}
                <figure className="ny-aside" data-fade>
                  <div className="ny-pagescroll">
                    <div className="ny-pagescroll-bar">
                      <i />
                      <i />
                      <i />
                      <span>nyma — onboarding, full length</span>
                    </div>
                    <div className="ny-pagescroll-frame">
                      <Image
                        src="/media/work/nyma/web-onboarding.png"
                        width={900}
                        height={3786}
                        alt="The Nyma onboarding page at full length: splash imagery, taste selection, size setup, and alert preferences paced editorially down one scroll."
                        sizes="(max-width: 1080px) 100vw, 36vw"
                      />
                    </div>
                    <div className="ny-pagescroll-foot">
                      <Caption pl="10">
                        onboarding, end to end — editorial pacing
                      </Caption>
                      <InteractiveCue>
                        <span className="ny-cue-scrub">
                          keep scrolling — the page walks its own length
                        </span>
                        <span className="ny-cue-hand">
                          scroll inside the frame — the page walks its own
                          length
                        </span>
                      </InteractiveCue>
                    </div>
                  </div>
                </figure>
              </div>

              <figure className="ny-full" data-fade>
                <NymaWardrobes />
                <Caption
                  pl="11"
                  cue="switch the wardrobe — the shell doesn't move"
                >
                  the inclusivity test — three wardrobes that share nothing,
                  one shell that never moves
                </Caption>
              </figure>
            </section>
          )}

          {/* ── 5.0 · The framework ── */}
          {codify && (
            <section
              className="case-chapter ny-chapter"
              data-act="4"
              id="ny-ch5"
            >
              <TopicHead number={codify.number} page="06" title={codify.title} />
              <div className="ny-section">
                {codify.sections[0] && <Prose section={codify.sections[0]} />}
                {/* full row: four columns in a 430px aside wrapped one word
                    per line (owner bug report) — the loop needs air */}
                <figure className="ny-full" data-fade>
                  {/* station order per the owner (2026-07-14): the prototype
                      opens the flow discussion, Figma refines, Claude Code
                      polishes the front-end, and it ships — then around
                      again for the next surface */}
                  <div
                    className="ny-loop"
                    role="img"
                    aria-label="The working loop: a Claude Code and Claude Design prototype opens the flow discussion, Figma refines the visuals, Claude Code polishes the front-end from the written rules, and it ships live — then around again for the next surface."
                  >
                    <i className="ny-loop-track" aria-hidden="true">
                      <svg className="ny-loop-thread">
                        <rect className="ny-loop-thread-path" />
                      </svg>
                      <b className="ny-loop-tick" />
                      <b className="ny-loop-tick" />
                      <b className="ny-loop-tick" />
                      <b className="ny-loop-tick is-back" />
                    </i>
                    {/* each station carries a mini working-artifact window
                        (the Pulse craft — recreate the artifact and let it
                        move — drawn in Nyma's own b/w): terminal → canvas →
                        rule sheet → live storefront. Scenes assemble when
                        the station lights; the final state ships in the
                        markup. */}
                    <div className="ny-loop-row">
                      <div className="ny-loop-node is-on">
                        <i className="ny-loop-dot" aria-hidden="true" />
                        <span
                          className="ny-loop-scene is-proto"
                          aria-hidden="true"
                        >
                          <b />
                          <b />
                          <b />
                          <b />
                        </span>
                        <span className="ny-loop-index">01</span>
                        <strong>CLAUDE CODE · DESIGN</strong>
                        <em>the prototype first — flows discussed on a working artifact</em>
                      </div>
                      <div className="ny-loop-node is-on">
                        <i className="ny-loop-dot" aria-hidden="true" />
                        <span
                          className="ny-loop-scene is-figma"
                          aria-hidden="true"
                        >
                          <b />
                          <b />
                        </span>
                        <span className="ny-loop-index">02</span>
                        <strong>FIGMA</strong>
                        <em>visual refinement · no longer the only truth</em>
                      </div>
                      <div className="ny-loop-node is-on">
                        <i className="ny-loop-dot" aria-hidden="true" />
                        <span
                          className="ny-loop-scene is-code"
                          aria-hidden="true"
                        >
                          <b />
                          <b />
                          <b className="is-rule" />
                          <b />
                          <b />
                        </span>
                        <span className="ny-loop-index">03</span>
                        <strong>CLAUDE CODE</strong>
                        <em>the front-end, polished from written rules</em>
                      </div>
                      <div className="ny-loop-node is-on">
                        <i className="ny-loop-dot" aria-hidden="true" />
                        <span
                          className="ny-loop-scene is-live"
                          aria-hidden="true"
                        >
                          <b className="is-mark" />
                          <b />
                          <b />
                          <b />
                          <b />
                        </span>
                        <span className="ny-loop-index">04</span>
                        <strong>LIVE</strong>
                        <em>shipped — the design rules stay in the repo</em>
                      </div>
                    </div>
                    <p className="ny-loop-return">
                      around again — the next surface
                    </p>
                  </div>
                  <Caption pl="12">
                    one loop — the nodes light in the order a change travels
                  </Caption>
                </figure>
              </div>

              {/* ---- pl.13 drafts desk (two sheets, flip to front) ---- */}
              <figure className="ny-full" data-fade>
                <NymaDrafts />
                <Caption
                  pl="13"
                  cue="click a sheet — the other argument comes forward"
                >
                  two HTML drafts generated from the same written brand
                  language — the shipped site keeps B&rsquo;s structure and
                  A&rsquo;s pacing
                </Caption>
              </figure>

              {/* ---- pl.14 system board (the coded rules, rendered) ---- */}
              <div className="ny-section">
                {codify.sections[1] && <Prose section={codify.sections[1]} />}
                <figure className="ny-aside" data-fade>
                  <NymaSystemBoard />
                  <Caption pl="14">
                    the system, rendered — action slabs, signals, and fields
                    straight from the coded rules
                  </Caption>
                </figure>
              </div>
            </section>
          )}

          {/* ── 6.0 · The continuity ── */}
          {handoff && (
            <section
              className="case-chapter ny-chapter"
              data-act="5"
              id="ny-ch6"
            >
              <TopicHead
                number={handoff.number}
                page="07"
                title={handoff.title}
              />
              <div className="ny-section">
                {handoff.sections[0] && <Prose section={handoff.sections[0]} />}
                <figure className="ny-full" data-fade>
                  <div className="ny-phones">
                    {(
                      [
                        [
                          "mob-splash",
                          "The mobile splash screen: NYMA on Ceramic Black.",
                        ],
                        [
                          "mob-taste",
                          "The Taste onboarding step: style and maison chips the user collects.",
                        ],
                        [
                          "mob-alerts",
                          "The Alerts onboarding step: quiet-by-default notification choices.",
                        ],
                      ] as const
                    ).map(([name, alt]) => (
                      <div className="ny-plate" key={name}>
                        <Image
                          src={`/media/work/nyma/${name}.png`}
                          width={402}
                          height={874}
                          alt={alt}
                          sizes="(max-width: 768px) 100vw, 28vw"
                        />
                      </div>
                    ))}
                  </div>
                  <Caption pl="15">
                    mobile onboarding directions, handed off as starting points
                  </Caption>
                </figure>
              </div>

              {/* ---- pl.16 canvas + pl.17 prototype, one row ---- */}
              {/* the assembled flows (small proof plate, centered against
                  its taller neighbour) beside the working commerce
                  prototype (owner 2026-07-08: "复现成可交互的 prototype，
                  带手机 frame 的放在网页上") — canvas reads first, the
                  interactive is the payoff */}
              <div className="ny-section ny-protorow">
                <figure className="ny-canvas-fig" data-fade>
                  <div className="ny-plate ny-canvas-crop">
                    <Image
                      src="/media/work/nyma/claude-mobile.png"
                      width={1440}
                      height={1400}
                      alt="The mobile prototype canvas: onboarding and core flows laid out as connected screens the team can build against."
                      sizes="(max-width: 1080px) 100vw, 632px"
                    />
                  </div>
                  <Caption pl="16">
                    the mobile flows, assembled on one canvas for the team to
                    build against
                  </Caption>
                </figure>
                <figure className="ny-aside" data-fade>
                  <NymaPhone />
                  <div className="nyp-foot">
                    <Caption pl="17">
                      auctions · bag · saved — the commerce spine, rebuilt as
                      a working prototype; every interface fact from the
                      shipped mobile design
                    </Caption>
                    <InteractiveCue>
                      click through the screens — the lots, bag, and totals
                      respond
                    </InteractiveCue>
                  </div>
                </figure>
              </div>
            </section>
          )}

          {/* ── The Turn — the page's one seal-red stitch ── */}
          {moment && (
            <div className="ny-turn-wrap" data-act="6" id="ny-turn">
              <section className="ny-turn" aria-labelledby="ny-turn-title">
                <p className="ny-turn-eyebrow" data-fade>
                  What changed my practice
                </p>
                <i className="ny-turn-stitch" aria-hidden="true" />
                <h2 id="ny-turn-title" data-fade>
                  {moment.title}
                </h2>
                <div className="ny-turn-copy" data-fade>
                  {moment.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <p className="ny-turn-foot" data-fade>
                  Brand · product · implementation — one system
                </p>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* ── Adjacent case — the shared cross-page contract (label, title,
          cover preview); the earlier text-only quiet close shipped without a
          preview (owner report 2026-07-08) ── */}
      <CaseNext slug={project.slug} />
    </article>
  );
}
