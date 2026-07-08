import Image from "next/image";
import Link from "next/link";
import { adjacent, type CaseSection, type Project } from "@/data/projects";
import { NymaScroll } from "./nyma-scroll";
import {
  NymaDirections,
  NymaColorRoles,
  NymaWardrobes,
} from "./nyma-interactives";
import { InteractiveCue, ICUE_CSS } from "./ui/interactive-cue";
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
// objects. Confidentiality: agency credit and mock personal data are
// cropped out of every plate on this page.
//
// Choreography lives in <NymaScroll /> (GSAP + ScrollTrigger over the
// lenis-bus). Server markup is always the FINAL state — reduced motion and
// no-JS read a finished page; motion only rewinds and replays it.

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
  --ny-stage: #f2efea;      /* Parchment — the page ground */
  --ny-canvas: #ffffff;     /* Archival White — cards, plates */
  --ny-chrome: #f5f5f5;     /* Soft Archive */
  --ny-ink: #1c1a17;        /* Ceramic Black */
  --ny-text-2: #45423d;
  --ny-text-3: #6d6960;
  --ny-text-4: #9a948a;
  --ny-line: rgba(28, 26, 23, 0.11);
  --ny-line-strong: rgba(28, 26, 23, 0.22);
  --ny-shadow-rest: 0 1px 2px rgba(28, 26, 23, 0.04), 0 4px 12px rgba(28, 26, 23, 0.05);
  --ny-shadow-lift: 0 2px 6px rgba(28, 26, 23, 0.06), 0 16px 32px rgba(28, 26, 23, 0.09);

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
   (pulse navscrim precedent, parchment flavored) */
.ny-navscrim {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  z-index: 50;
  pointer-events: none;
  background: linear-gradient(180deg, var(--ny-stage) 58%, rgba(242, 239, 234, 0) 100%);
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
/* standalone figures need real air before the next section's eyebrow —
   audit: captions were reading as the next block's label */
.nyma-case-page .ny-chapter > figure {
  margin: var(--gap-block) 0 calc(var(--gap-block) * 1.25);
}
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
  color: var(--ny-trace-dark);
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
  padding: clamp(48px, 6vw, 88px) var(--work-gutter) 0;
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
  grid-column: 1 / 8;
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

/* the contents card — the manual's black TOC, doubling as page nav */
.ny-toc {
  grid-column: 8 / -1;
  grid-row: 1 / span 2;
  align-self: start;
  box-sizing: border-box;
  background: var(--ny-ink);
  color: #f2efea;
  padding: 22px 24px 18px;
  --icue-text: rgba(242, 239, 234, 0.6);
}
.ny-toc header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  /* no text-transform: νήμα must not be uppercased into ΝΉΜΑ */
  color: rgba(242, 239, 234, 0.55);
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(242, 239, 234, 0.16);
  margin-bottom: 8px;
}
.ny-toc ol {
  list-style: none;
  margin: 0 0 14px;
  padding: 0;
}
.ny-toc li a {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 7px 0;
  font-family: var(--ny-mono);
  font-size: 13px;
  letter-spacing: 0.02em;
  color: #f2efea;
  text-decoration: none;
  transition: color 0.2s var(--ease-silk);
}
.ny-toc li a i {
  font-style: normal;
  color: rgba(242, 239, 234, 0.45);
  min-width: 34px;
  transition: color 0.2s var(--ease-silk);
}
.ny-toc li a:hover,
.ny-toc li a:focus-visible {
  color: #9cc4f0;
}
.ny-toc li a:hover i,
.ny-toc li a:focus-visible i {
  color: #9cc4f0;
}

/* ── Overview + ledger ─────────────────────────────────────────────────── */
.nyma-case-page .proj-summary {
  background: transparent;
  color: inherit;
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
.ny-ledger {
  grid-column: 9 / -1;
  align-self: start;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--ny-line-strong);
}
.ny-ledger > div {
  padding: 16px 0 18px;
  border-bottom: 1px solid var(--ny-line);
}
.ny-ledger strong {
  display: block;
  font-family: var(--ny-display);
  font-size: clamp(36px, 3.6vw, 54px);
  font-weight: 300;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
  color: var(--ny-ink);
}
.ny-ledger span {
  display: block;
  margin-top: 6px;
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  line-height: 1.5;
  color: var(--ny-text-3);
}
.ny-ledger-note {
  grid-column: 1 / -1;
  margin: 12px 0 0;
  font-family: var(--ny-mono);
  font-size: 11px;
  line-height: 1.6;
  color: var(--ny-text-4);
}

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
  color: var(--ny-trace-dark);
}
.ny-acts-main {
  grid-column: 3 / -1;
  min-width: 0;
}

/* ── Chapter furniture ─────────────────────────────────────────────────── */
.ny-chapter {
  padding: calc(var(--gap-section) / 2) 0;
  scroll-margin-top: 88px;
}
.nyma-case-page .case-chapter {
  max-width: none;
  margin: 0;
}
.nyma-case-page .case-chapter:last-of-type {
  padding-bottom: calc(var(--gap-section) / 2);
}
/* ── the white stage (owner 2026-07-07): chapter 4 steps off the archive
   desk onto the product's own ground — Archival White, full-bleed. The
   parchment returns after; the Turn still sinks to ink. Plates get the
   stronger hairline so they keep their object edge on white. ── */
.ny-stage-white {
  position: relative;
}
/* a white SHEET pinned on the desk (owner rev 2: the full-bleed stage read
   wrong and its 100vw caused horizontal scroll) — inset to the content
   column plus half a grid gap, hairline edge; the rail stays on parchment */
.ny-stage-white::before {
  content: "";
  position: absolute;
  inset: 0 calc(var(--work-grid-gap) * -0.5);
  background: #ffffff;
  border: 1px solid var(--ny-line);
  z-index: -1;
}
.ny-stage-white .ny-plate,
.ny-stage-white .ny-ward,
.ny-stage-white .ny-pagescroll-frame,
.ny-stage-white .ny-pagescroll-bar {
  border-color: var(--ny-line-strong);
}
.ny-chapter-head {
  margin-bottom: var(--gap-block);
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
.ny-chapter-name {
  font-weight: 700;
  color: var(--ny-ink);
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
  margin-bottom: var(--gap-block);
}
.ny-section:last-child {
  margin-bottom: 0;
}
.ny-copy {
  grid-column: 1 / 7;
  min-width: 0;
}
.ny-copy-tags {
  margin: 0 0 14px;
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ny-trace-dark);
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
.ny-full {
  grid-column: 1 / -1;
  min-width: 0;
}

/* plates: white cards on the parchment desk */
.ny-plate {
  background: var(--ny-canvas);
  border: 1px solid var(--ny-line);
  box-shadow: var(--ny-shadow-rest);
}
.ny-plate img {
  display: block;
  width: 100%;
  height: auto;
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
  color: var(--ny-trace-dark);
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
  grid-column: 6 / -1;
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
  margin: var(--gap-block) 0;
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
.ny-etym-def,
.ny-etym-read {
  grid-column: 1 / -1;
  margin: 0;
  font-family: var(--ny-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  line-height: 1.6;
  color: var(--ny-text-3);
}
.ny-etym-read {
  max-width: 58ch;
}

/* the moodboard table — a long desk the page scrolls sideways */
.ny-strip {
  position: relative;
  overflow: hidden;
  margin: var(--gap-block) 0;
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
@media (max-width: 768px) {
  .ny-strip {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* the field — competitor flows, layered; full width so the board reads */
.ny-competitive {
  grid-column: 1 / -1;
  position: relative;
  margin-top: var(--gap-block);
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
.ny-dir {
  background: var(--ny-canvas);
  border: 1px solid var(--ny-line);
  box-shadow: var(--ny-shadow-rest);
  padding: 18px 20px;
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
  align-items: start;
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
  color: var(--ny-trace-dark);
}
.ny-dir-verdict.is-chosen::before {
  content: "✓ ";
}
.ny-dir-foot {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 14px;
}
.ny-dir-note {
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--ny-text-4);
}

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
  background: var(--ny-canvas);
  border: 1px solid var(--ny-line);
  box-shadow: var(--ny-shadow-rest);
  padding: 18px 20px;
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
  align-items: start;
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
.ny-roles-foot {
  padding-top: 14px;
  border-top: 1px solid var(--ny-line);
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

.ny-wall {
  margin: var(--gap-block) 0;
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
.ny-wall figure.ny-plate {
  transition: transform 0.4s var(--ease-silk), box-shadow 0.4s var(--ease-silk);
}
.ny-wall figure.ny-plate:hover {
  transform: translateY(-4px);
  box-shadow: var(--ny-shadow-lift);
}
.ny-wall figure.ny-plate:active {
  transform: translateY(1px) scale(0.99);
  box-shadow: var(--ny-shadow-rest);
  transition-duration: 0.2s;
}
.ny-wall figcaption {
  padding: 10px 12px;
  border-top: 1px solid var(--ny-line);
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ny-text-3);
}

/* the frame a full-length mock walks through on scroll */
.ny-pagescroll-frame {
  position: relative;
  height: clamp(500px, 68vh, 780px);
  overflow: hidden;
  background: var(--ny-canvas);
  border: 1px solid var(--ny-line);
  box-shadow: var(--ny-shadow-rest);
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
  border: 1px solid var(--ny-line);
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
  background: var(--ny-canvas);
  border: 1px solid var(--ny-line);
  box-shadow: var(--ny-shadow-rest);
  padding: 18px 20px;
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
  align-items: start;
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
.ny-ward-foot {
  padding-top: 14px;
  border-top: 1px solid var(--ny-line);
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
.ny-loop {
  box-sizing: border-box;
  background: var(--ny-canvas);
  border: 1px solid var(--ny-line);
  box-shadow: var(--ny-shadow-rest);
  padding: 20px;
}
.ny-loop-row {
  display: grid;
  grid-template-columns: 1fr clamp(24px, 3vw, 48px) 1fr clamp(24px, 3vw, 48px) 1fr clamp(24px, 3vw, 48px) 1fr;
  align-items: stretch;
  gap: 8px;
}
.ny-loop-node {
  border: 1px solid var(--ny-line-strong);
  padding: 18px 18px 16px;
  display: grid;
  gap: 10px;
  align-content: start;
  transition: border-color 0.4s var(--ease-silk), background 0.4s var(--ease-silk);
}
.ny-loop-node strong {
  font-family: var(--ny-mono);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--ny-ink);
}
.ny-loop-node em {
  font-style: normal;
  font-family: var(--ny-mono);
  font-size: 11px;
  line-height: 1.65;
  letter-spacing: 0.02em;
  color: var(--ny-text-3);
  max-width: 24ch;
}
/* lit = trace yellow: the loop is a static diagram, and blue is reserved
   for genuinely interactive states (2026-07-07 audit — the page must obey
   its own color law) */
.ny-loop-node.is-on {
  border-color: var(--ny-trace);
  background: var(--ny-trace-soft);
}
.ny-loop-stitch {
  align-self: center;
  height: 2px;
  background-image: repeating-linear-gradient(
    90deg,
    var(--ny-line-strong) 0 6px,
    transparent 6px 11px
  );
}
.ny-loop-return {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ny-text-4);
}
.ny-loop-return i {
  flex: 1;
  height: 2px;
  background-image: repeating-linear-gradient(
    90deg,
    var(--ny-trace) 0 6px,
    transparent 6px 11px
  );
}

/* two drafts, argued against each other — deliberately asymmetric so the
   comparison reads at a glance (owner note: near-identical shots had no
   contrast) */
.ny-pair {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: clamp(20px, 2.6vw, 36px);
  align-items: start;
  margin: var(--gap-block) 0 0;
}
.ny-pair-item header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  padding: 0 0 10px;
}
.ny-pair-item h4 {
  margin: 0;
  font-family: var(--ny-display);
  font-size: clamp(20px, 1.9vw, 26px);
  font-weight: 400;
  line-height: 1.25;
}
.ny-pair-item header span {
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ny-trace-dark);
  white-space: nowrap;
}
.ny-pair-item .ny-plate {
  overflow: hidden;
}
.ny-pair-item p {
  margin: 12px 0 0;
  max-width: 52ch;
  font-family: var(--ny-mono);
  font-size: 11px;
  line-height: 1.65;
  letter-spacing: 0.02em;
  color: var(--ny-text-3);
}
.ny-pair-foot {
  margin-top: 16px;
}

/* ── Ch 6 · phones ─────────────────────────────────────────────────────── */
.ny-phones {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(20px, 3vw, 48px);
  align-items: start;
  margin-top: var(--gap-block);
}
.ny-phones .ny-plate:nth-child(2) {
  margin-top: clamp(20px, 2.6vw, 40px);
}
.ny-phones .ny-plate:nth-child(3) {
  margin-top: clamp(40px, 5vw, 80px);
}
.ny-wide {
  margin: var(--gap-block) 0 0;
}

/* ── The Turn — ink band; the page's ONE seal-red stitch ───────────────── */
.ny-turn-wrap {
  padding: calc(var(--gap-section) / 2) 0;
  scroll-margin-top: 88px;
}
.ny-turn {
  box-sizing: border-box;
  /* dark-ground light model: top rim catch-light + faint from-top glow
     (shared treatment with the site footer) — base stays Ceramic Black */
  background: radial-gradient(120% 80% at 50% 0%, #232019, #1c1a17);
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
  max-width: 26ch;
  font-family: var(--ny-display);
  font-size: clamp(36px, 4vw, 58px);
  font-weight: 300;
  line-height: 1.14;
  letter-spacing: -0.005em;
  text-wrap: balance;
}
.ny-turn-copy {
  display: grid;
  gap: 1em;
  max-width: 66ch;
}
.ny-turn-copy p {
  margin: 0;
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

/* ── Next case ─────────────────────────────────────────────────────────── */
.ny-next {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  margin: 0 auto;
  padding: 0 var(--work-gutter) calc(var(--gap-section) / 2);
  text-align: left;
}
.ny-next-label {
  margin: 0 0 10px;
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ny-text-4);
}
.ny-next-link {
  text-decoration: none;
}
.ny-next-title {
  font-family: var(--ny-display);
  font-size: var(--text-display-3, clamp(48px, 5vw, 80px));
  font-weight: 300;
  letter-spacing: -0.005em;
  color: var(--ny-ink);
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 1080px) {
  .ny-rail {
    display: none;
  }
  .ny-acts-main {
    grid-column: 1 / -1;
  }
  .ny-toc {
    grid-column: 1 / -1;
    grid-row: auto;
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
  .ny-ledger {
    grid-column: 1 / -1;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    column-gap: var(--work-grid-gap);
  }
  .ny-copy {
    grid-column: 1 / -1;
  }
  .ny-aside,
  .ny-fates,
  .ny-competitive {
    grid-column: 1 / -1;
  }
}
@media (max-width: 768px) {
  .ny-hero-meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 16px;
  }
  .ny-ledger {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
  .ny-pair {
    grid-template-columns: 1fr;
  }
  .ny-roles-stage {
    grid-template-columns: 1fr;
  }
  .ny-loop-row {
    grid-template-columns: 1fr;
  }
  .ny-loop-stitch {
    width: 2px;
    height: 16px;
    justify-self: center;
    background-image: repeating-linear-gradient(
      180deg,
      var(--ny-line-strong) 0 5px,
      transparent 5px 9px
    );
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
`;

// ── helpers ─────────────────────────────────────────────────────────────

const railTopics = [
  "Inheritance",
  "Thread",
  "Rulebook",
  "Pages",
  "Codification",
  "Handoff",
  "The turn",
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

// The manual's page furniture: "Topic — n.0 / Page no. — NN" over a drawn
// hairline, then the chapter claim.
function TopicHead({
  number,
  page,
  title,
}: {
  number: string;
  page: string;
  title: string;
}) {
  const [idx, name] = number.split("·").map((s) => s.trim());
  return (
    <header className="ny-chapter-head" data-fade>
      <div className="ny-chapter-meta">
        <span>
          Topic — {Number(idx)}.0
          <br />
          Page no. — {page}
        </span>
        <span className="ny-chapter-name">{name}</span>
      </div>
      <i className="ny-hairline" data-hairline aria-hidden="true" />
      <h2 className="ny-chapter-claim">{title}</h2>
    </header>
  );
}

function Prose({ section }: { section: CaseSection }) {
  return (
    <div className="ny-copy" data-fade>
      <p className="ny-copy-tags">{section.tags}</p>
      <h3>{section.heading}</h3>
      {section.body.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

function Caption({ pl, children }: { pl: string; children: React.ReactNode }) {
  return (
    <figcaption className="ny-caption">
      <span>
        <em className="ny-pl">Pl. {pl}</em>
        {children}
      </span>
    </figcaption>
  );
}

const wallPlates: [string, number, number, string][] = [
  // column 1
  ["web-marketplace", 900, 1583, "Marketplace — index"],
  ["web-sell", 900, 1969, "Sell — listing intake"],
  ["web-auction", 900, 1583, "Auctions — index"],
  ["web-message", 900, 987, "Messages"],
  // column 2
  ["web-mkt-listing", 900, 966, "Marketplace — listing intake"],
  ["web-live-auctions", 900, 844, "Auctions — live"],
  ["web-profile", 900, 1688, "Profile — public"],
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
  const neighbors = adjacent(project.slug);
  const next = neighbors.next ?? neighbors.prev;

  return (
    <article className="case-study-page nyma-case-page" data-has-cover="false">
      <style
        dangerouslySetInnerHTML={{
          __html: stripCssComments(nymaCss + ICUE_CSS),
        }}
      />
      <NymaScroll />
      <div className="ny-navscrim" aria-hidden="true" />

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
              <em>Brand &amp; Design System</em>
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
          <aside className="ny-toc" data-fade aria-label="Contents">
            <header>
              <span>TABLE OF CONTENT</span>
              <span>νήμα — THREAD</span>
            </header>
            <ol>
              {[
                ["#ny-ch1", "The inheritance"],
                ["#ny-ch2", "The thread"],
                ["#ny-ch3", "The rulebook"],
                ["#ny-ch4", "The pages"],
                ["#ny-ch5", "The codification"],
                ["#ny-ch6", "The handoff"],
                ["#ny-turn", "The turn"],
              ].map(([href, label], i) => (
                <li key={href}>
                  <a href={href}>
                    <i>{i + 1}.0</i>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
            <InteractiveCue>click a topic to jump to its page</InteractiveCue>
          </aside>
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
        <aside className="ny-ledger" data-fade aria-label="Project figures">
          <div>
            <strong data-count="17">17</strong>
            <span>brand-manual pages</span>
          </div>
          <div>
            <strong>30–40</strong>
            <span>key pages, by hand</span>
          </div>
          <div>
            <strong data-count="3">3</strong>
            <span>accent roles, enforced</span>
          </div>
          <div>
            <strong>1</strong>
            <span>designer — me</span>
          </div>
          <p className="ny-ledger-note">
            counts come from the working archive: the manual’s own pagination,
            the final Figma export, the manual’s color law
          </p>
        </aside>
      </section>

      {/* ── The acts: the thread stitches the chapters together ── */}
      <div className="ny-acts">
        <ThreadRail />
        <div className="ny-acts-main">
          {/* ── 1.0 · The inheritance ── */}
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

          {/* ── 2.0 · The thread ── */}
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
                    the moodboard table, end to end — 32,768&nbsp;px of it
                  </Caption>
                  <InteractiveCue>
                    keep scrolling — the table slides past
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
                <Caption pl="05">
                  four AI-drafted directions, kept as conversation material —
                  never as answers
                </Caption>
              </figure>
            </section>
          )}

          {/* ── 3.0 · The rulebook ── */}
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
                        "manual-cover",
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
                <Caption pl="07">
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
                    hover a line — it tries its heavier weight
                  </InteractiveCue>
                </div>
              </figure>
            </section>
          )}

          {/* ── 4.0 · The pages ── */}
          {pages && (
            <section
              className="case-chapter ny-chapter ny-stage-white"
              data-act="3"
              id="ny-ch4"
            >
              <TopicHead number={pages.number} page="05" title={pages.title} />
              <div className="ny-section">
                {pages.sections[0] && <Prose section={pages.sections[0]} />}
                <aside className="ny-aside" data-fade>
                  <div className="ny-tally">
                    <strong>30–40</strong>
                    <span>key pages designed and iterated by hand in Figma</span>
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

              <div className="ny-section">
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
                        keep scrolling — the page walks its own length
                      </InteractiveCue>
                    </div>
                  </div>
                </figure>
              </div>

              <figure className="ny-full" data-fade>
                <NymaWardrobes />
                <Caption pl="11">
                  the inclusivity test — three wardrobes that share nothing,
                  one shell that never moves
                </Caption>
              </figure>
            </section>
          )}

          {/* ── 5.0 · The codification ── */}
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
                  <div
                    className="ny-loop"
                    role="img"
                    aria-label="The working loop: Figma for visual refinement, Claude Design for on-system edits, Claude Code for generation, and the front-end repo where the design rules live — re-export and refine, around again."
                  >
                    <div className="ny-loop-row">
                      <div className="ny-loop-node is-on">
                        <strong>FIGMA</strong>
                        <em>visual refinement · no longer the only truth</em>
                      </div>
                      <i className="ny-loop-stitch" aria-hidden="true" />
                      <div className="ny-loop-node is-on">
                        <strong>CLAUDE DESIGN</strong>
                        <em>edit the artifact, on-system</em>
                      </div>
                      <i className="ny-loop-stitch" aria-hidden="true" />
                      <div className="ny-loop-node is-on">
                        <strong>CLAUDE CODE</strong>
                        <em>generate · refine from written rules</em>
                      </div>
                      <i className="ny-loop-stitch" aria-hidden="true" />
                      <div className="ny-loop-node is-on">
                        <strong>FRONT-END REPO</strong>
                        <em>where the design rules live</em>
                      </div>
                    </div>
                    <div className="ny-loop-return">
                      <span>re-export</span>
                      <i aria-hidden="true" />
                      <span>refine · around again</span>
                    </div>
                  </div>
                  <Caption pl="12">
                    one loop — the nodes light in the order a change travels
                  </Caption>
                </figure>
              </div>

              <figure className="ny-full" data-fade>
                <div className="ny-pair">
                  <div className="ny-pair-item">
                    <header>
                      <h4>Draft A — the editorial argument</h4>
                      <span>color · commerce-forward</span>
                    </header>
                    <div className="ny-plate">
                      <Image
                        src="/media/work/nyma/ai-draft-njal.png"
                        width={1440}
                        height={1230}
                        alt="An AI-generated HTML draft: colorful live-auction and marketplace product rows under bold section headers."
                        sizes="(max-width: 768px) 100vw, 48vw"
                      />
                    </div>
                    <p>
                      argues with imagery — colorful lots, magazine grids, the
                      platform as a shop window
                    </p>
                  </div>
                  <div className="ny-pair-item">
                    <header>
                      <h4>Draft B — the structural argument</h4>
                      <span>mono · system-forward</span>
                    </header>
                    <div className="ny-plate">
                      <Image
                        src="/media/work/nyma/ai-draft-platform.png"
                        width={1440}
                        height={1290}
                        alt="An AI-generated HTML draft: a monochrome Platform Advantages card row and grayscale auction listings, typeset in mono."
                        sizes="(max-width: 768px) 100vw, 34vw"
                      />
                    </div>
                    <p>
                      argues with structure — fees, formats, verification;
                      the platform as an institution
                    </p>
                  </div>
                </div>
                <div className="ny-pair-foot">
                  <Caption pl="13">
                    two HTML drafts generated from the same written brand
                    language — the shipped site keeps B&rsquo;s structure and
                    A&rsquo;s pacing
                  </Caption>
                </div>
              </figure>

              <div className="ny-section" style={{ marginTop: "var(--gap-block)" }}>
                {codify.sections[1] && <Prose section={codify.sections[1]} />}
                <figure className="ny-aside" data-fade>
                  <div className="ny-pagescroll">
                    <div className="ny-pagescroll-bar">
                      <i />
                      <i />
                      <i />
                      <span>nyma — design system, standalone artifact</span>
                    </div>
                    <div className="ny-pagescroll-frame">
                      <Image
                        src="/media/work/nyma/claude-design-system.png"
                        width={1440}
                        height={2200}
                        alt="The codified NYMA design system as one standalone page: role-based color documentation and the two-role typography rules, generated from the repo."
                        sizes="(max-width: 1080px) 100vw, 36vw"
                      />
                    </div>
                    <div className="ny-pagescroll-foot">
                      <Caption pl="14">
                        the system, codified — one artifact the whole team reads
                      </Caption>
                      <InteractiveCue>
                        keep scrolling — the artifact walks its own length
                      </InteractiveCue>
                    </div>
                  </div>
                </figure>
              </div>
            </section>
          )}

          {/* ── 6.0 · The handoff ── */}
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

              <figure className="ny-wide ny-full" data-fade>
                <div className="ny-plate">
                  <Image
                    src="/media/work/nyma/mob-commerce.png"
                    width={1400}
                    height={910}
                    alt="Three mobile screens in device frames: Auctions with live lots and countdowns, Bag with reserved objects and an authentication opt-in, and Saved with watched lots."
                    sizes="(max-width: 1080px) 100vw, 72vw"
                  />
                </div>
                <Caption pl="16">
                  auctions · bag · saved — the commerce spine on mobile
                </Caption>
              </figure>

              <figure className="ny-wide ny-full" data-fade>
                <div className="ny-plate">
                  <Image
                    src="/media/work/nyma/claude-mobile.png"
                    width={1440}
                    height={1400}
                    alt="The mobile prototype canvas: onboarding and core flows laid out as connected screens the team can build against."
                    sizes="(max-width: 1080px) 100vw, 72vw"
                  />
                </div>
                <Caption pl="17">
                  the mobile canvas, assembled for the team to build against
                </Caption>
              </figure>
            </section>
          )}

          {/* ── The Turn — the page's one seal-red stitch ── */}
          {moment && (
            <div className="ny-turn-wrap" data-act="6" id="ny-turn">
              <section className="ny-turn" aria-labelledby="ny-turn-title">
                <p className="ny-turn-eyebrow" data-fade>
                  Most memorable moment
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
                  νήμα — the thread holds
                </p>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* ── Adjacent case — quiet close ── */}
      {next && (
        <aside className="ny-next">
          <p className="ny-next-label" data-fade>
            Next case
          </p>
          <Link className="ny-next-link" href={`/work/${next.slug}`} data-fade>
            <span className="cta cta--quiet ny-next-title">{next.title}</span>
          </Link>
        </aside>
      )}
    </article>
  );
}
