import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { adjacent, type CaseSection, type Project } from "@/data/projects";
import { PulseScroll } from "./pulse-scroll";
import { PulseComponentBrowser } from "./pulse-component-browser";
import { PulseCreativeBrief } from "./pulse-creative-brief";
import { PulsePlaygroundDemo } from "./pulse-playground-demo";
import { PulseTokenChips } from "./pulse-token-chips";
import { InteractiveCue, ICUE_CSS } from "./ui/interactive-cue";

// Pulse — "Studio Bloom" (owner direction, 2026-07-04): the one case page
// that steps INSIDE its product's world. The ink/paper specimen document and
// its scroll page-turn are retired (owner rejection); the page now sits on
// Pulse's own stage — the #f4f7f7 neutral ground with soft cyan blooms,
// glass bentos, white inner cards, ink chrome — and the "agent" feel comes
// from motion and semantics, never from neon: a run-log rail tracks the acts,
// the generation-status ladder lights in sequence, counters count, the
// monolith splits on scrub, a typed stream runs in the hero console. Pulse's
// own written rules hold here too: no glow, no halo, color only with meaning.
// This is an owner-sanctioned departure from the paper editorial ground —
// scoped to this page only; site neutrals, the CTA contract, the type
// ladder, the two-gap rhythm, and the ONE seal-red moment all still apply.
//
// Grid, named first (Muller-Brockmann rule): container = the shared work
// shell (max 1440, margins --work-gutter, 12 columns, gutters
// --work-grid-gap). Standing rails: the run-log rail cols 1-2 (sticky,
// desktop only); chapter content cols 3-12, itself a 10-column grid — copy
// 1-7 (≤62ch), aside artifacts 7-11, insets/full 1-11. Hero: H1 cols 4-10,
// lede 4-9, run console cols 10-12 rows 1-3. Vertical rhythm: one
// --gap-section between chapters (half-padding each side), --gap-block
// inside. Baseline 8px; all authored values even px (1px hairlines exempt;
// product-frame recreations keep Pulse's own geometry, incl. its sanctioned
// fully-rounded status pills — a product idiom, not a portfolio pill).
//
// Copy: verbatim from data/projects.ts (the 9-act causal chain — melee →
// bet → look → wake-up → rescue → base → skills → interface → product; the
// Turn closes). This layout attaches evidence positionally. Numbers were
// re-verified against the Pulse repo's git record on 2026-07-04: the peak
// file is 10,180 lines (rev-verified; the earlier 13,020 didn't survive
// audit), 824 commits over five weeks with 308 structural, 40 components in
// the handoff library, 1,905 net dead lines removed (commit-subject
// verbatim). Confidentiality invariants: teammates anonymous, tools as
// categories, no commit hashes, package identity generalized.
//
// Choreography lives in <PulseScroll /> (GSAP + ScrollTrigger over the
// lenis-bus). The server markup is always the FINAL state — reduced motion
// and no-JS read a finished page; motion only rewinds and replays it.

// ── Specimen data (traced to the Pulse system source) ──────────────────────

// Type scale — tokens.css --type-page-display: 64px, --type-h2: 28px, --fs-5: 15px.
const typeScale = [
  { px: 64, size: 34, role: "page display" },
  { px: 28, size: 19, role: "section" },
  { px: 15, size: 12, role: "body" },
];

// 8-based spacing rhythm — tokens.css --space-2/4/6/7/9.
const spacingTicks = [8, 16, 24, 32, 48];

// Semantic lightness ramps — tokens.css: same 6 stops per family
// (50/100 soft fills, 200 lines, 500 base, 600 text/dot, 700 emphasis).
const ramps = [
  {
    role: "ready",
    base: "#49e0f5",
    stops: ["#f0fdff", "#e5fbff", "#b8f3fb", "#49e0f5", "#0ea5b8", "#0d7685"],
  },
  {
    role: "positive",
    base: "#43ba51",
    stops: ["#eff9f1", "#d5f0da", "#abe2b3", "#43ba51", "#2e9d40", "#207d32"],
  },
  {
    role: "scheduled",
    base: "#3987f3",
    stops: ["#eff5fe", "#d7e6fd", "#b0cdfa", "#3987f3", "#1f6fe0", "#1a57b0"],
  },
  {
    role: "risk",
    base: "#f19a08",
    stops: ["#fef6e7", "#fce7be", "#f7ce84", "#f19a08", "#cc7f06", "#a1640b"],
  },
  {
    role: "in progress",
    base: "#6366f1",
    stops: ["#f1f1fe", "#e2e3fc", "#c7c9f8", "#6366f1", "#4f46e5", "#4338ca"],
  },
  {
    role: "decline",
    base: "#ef4444",
    stops: ["#fef2f2", "#fde4e4", "#f9c9c9", "#ef4444", "#dc2626", "#b91c1c"],
  },
];

// Component inventory — all 40 names from the Pulse handoff registry,
// in registry order (verified against the preview's COMPONENTS array).
const inventory = [
  "AIPanel",
  "Button",
  "ButtonPrimary",
  "ButtonSecondary",
  "ButtonGhost",
  "ButtonDanger",
  "IconButton",
  "Card",
  "Grid",
  "MetricCard",
  "ActionCard",
  "MediaCard",
  "EmptyCard",
  "ErrorCard",
  "ConfirmBar",
  "Modal",
  "Icon",
  "PlatformBadge",
  "PostChip",
  "PlatformPreview",
  "ApprovalChain",
  "SegmentedTabs",
  "PageNavTabs",
  "ReportRangeTabs",
  "ActionRangeTabs",
  "AnalyticsSubtabs",
  "SignalSeverityTabs",
  "SignalRow",
  "SignalCard",
  "HorizontalBarChart",
  "VerticalBarChart",
  "ComboChart",
  "LineChart",
  "FunnelChart",
  "DataTable",
  "ScoreGauge",
  "StatList",
  "Sidebar",
  "StatusPill",
  "NodeGenerationMap",
];

// The Create-with-AI flow — human checkpoints are the page's one seal-red
// moment (the Turn's spine).
const gateSteps = [
  { label: "Goal", note: "a goal and an optional note", human: false },
  { label: "Assets", note: "uploaded or picked from the brand vault", human: false },
  { label: "Brief", note: "editable fields, budget shown", human: true },
  { label: "Generate", note: "runs only after the brief is approved", human: false },
  { label: "Review", note: "content gate signs off the creative", human: true },
  { label: "Publish", note: "a person releases — always", human: true },
];

// The run-log rail — the page's agent spine. One entry per act; each
// chapter renders the same list with its own position marked "running".
const acts = [
  "The melee",
  "The bet",
  "The look",
  "The wake-up",
  "The rescue",
  "The base",
  "The skills",
  "The interface",
  "The product",
  "The turn",
];

// Figures ledger — scope stats only (the hero console owns the run stats,
// so nothing repeats: 824/40/5wk live there; 6/1/10,180/gates live here).
const ledger: Array<[string, string]> = [
  ["6", "tools, one product"],
  ["1", "week to the pitch"],
  ["10,180", "lines, the peak file"],
  ["2", "gates + 1 publish rule"],
];

// ── The melee (ch. 01): four prototypes with the same face and
//    incompatible sources. Wireframes identical by design; the trace lines
//    are categories, not tool brands (confidentiality: no tool list). ──
const meleeSources = [
  { made: "drawn in a design canvas", trace: "frames only — no code at all" },
  { made: "an AI page-builder export", trace: "one file, styles inlined per node" },
  { made: "pasted from a model chat", trace: "runs, but write-only to humans" },
  { made: "composited from images", trace: "screens as pictures — nothing wired" },
];

// ── What migration broke (ch. 05) — repaired by hand against the original. ──
const lossRows: Array<[string, string]> = [
  ["hover states", "restored by hand"],
  ["animations", "rebuilt from the original"],
  ["layout drift", "re-aligned against capture"],
  ["dead code", "cut, not carried"],
];

// ── Commit stream (ch. 05) — commit-style subjects, paraphrased from the
//    repo's real flavor; no hashes, no names. Two rows drift on scrub. ──
const tickerRows: string[][] = [
  [
    "refac(css): purge dead legacy classes — DOM-verified",
    "fix: restore hover states lost in migration",
    "prettier: normalize every touched file",
    "migrate: analytics onto shared tokens",
    "split: home monolith into partials",
    "refac(tokens): make card surfaces solid",
    "verify: reconcile inventory and preview",
  ],
  [
    "chore: repair the lint config",
    "refac(campaign): build-time concat the bundles",
    "fix: re-align layout drift against capture",
    "rename: class names people can read",
    "clean: cut dead code, not carry it",
    "docs: write the rule where the AI loads it",
    "ci: fail the pipeline on hand-edited output",
  ],
];

// ── The skill card (ch. 07) — condensed from the real skill files. ──
const skillRules = [
  "compose from the component library before inventing page-local UI",
  "tokens only — no raw hex, no off-scale spacing or type",
  "every state ships: hover, focus, empty, loading, error",
  "run the consistency check before any handoff",
];

// ── Four roles, one base (ch. 08) — who reads which surface. ──
const roleRows: Array<[string, string]> = [
  ["design", "the live preview + the Figma boards"],
  ["engineering", "the typed package + component contracts"],
  ["ml", "the playground's editable data states"],
  ["product", "one runnable flow, ready to pitch"],
];

// ── CI gate chain (ch. 06) — the five jobs, generalized. ──
const ciSteps: Array<[string, string]> = [
  ["verify", "inventory ↔ preview ↔ board"],
  ["tokens", "drift advisory"],
  ["generated", "hand-edit guard"],
  ["publish", "package release"],
  ["pages", "playground deploy"],
];

// ── Build timeline (ch. 07 close). My own account, over five verified
//    weeks (2026-05-30 → 2026-07-04, 824 commits). Two milestones were a
//    teammate's or the team's work, and their notes say so. ──
const milestones = [
  {
    date: "Late May",
    title: "Six ways of building, one deadline",
    note: "The team was prototyping the same product in different tools, an early style guide holding the look together — and a pitch date about a week out made the gap between looking alike and being alike unmissable.",
  },
  {
    date: "Late May",
    title: "The file that forced the question",
    note: "The shared home prototype peaked at 10,180 lines in one file — the moment prototyping stopped being just design work.",
  },
  {
    date: "Early June",
    title: "A finished design, waiting on a foundation",
    note: "A teammate's page was done and idle, blocked on a system that didn't exist yet. It was the plainest argument for building the foundation before the screens.",
  },
  {
    date: "Mid-June",
    title: "The boards became one portable file",
    note: "I rebuilt the visual component library as a single self-contained page, so the designer-facing boards travelled as one file anyone could open.",
  },
  {
    date: "Mid-June",
    title: "HTML and CSS became the source of truth",
    note: "The pivot that stuck: I made the standalone HTML and CSS the canonical layer and demoted the React copy to a consumer of it.",
  },
  {
    date: "Mid-June",
    title: "The monolith became source, not blob",
    note: "A build script split the draft app into 76 HTML partials, 71 scripts, and 22 sheets — assembled by tooling, never hand-edited again.",
  },
  {
    date: "Mid-June",
    title: "Standards, written as commits",
    note: "A formatting and lint pass, consistent line endings, lighter assets, and a CI token gate turned the conventions into something the repo enforced — not something I had to keep asking for.",
  },
  {
    date: "Late June",
    title: "The demos converged into one product",
    note: "The scattered prototypes unified into a single static product export — one set of routable pages, all on the system's tokens.",
  },
  {
    date: "Late June",
    title: "Wrapped for every consumer",
    note: "A teammate packaged the library as an internal, typed React set on a private registry; a build step syncs the canonical CSS in, so the two can never fall out of step.",
  },
  {
    date: "Early July",
    title: "The payoff: 1,905 dead lines gone",
    note: "As the surfaces adopted the system, the parallel copies the styles had drifted into collapsed back to one — 1,905 verified-dead lines removed in one audited purge.",
  },
];

// Package plate — genericized: typed React wrappers on a private registry,
// styles synced from the canonical CSS; nothing that identifies the package.
const plateRows: Array<[string, string]> = [
  ["package", "internal, typed React set"],
  ["distribution", "private registry"],
  ["authored", "typed JSX wrappers"],
  ["peer", "react ≥ 18"],
  ["styles", "synced from the canonical CSS"],
];

// Screenshots — captured from the project's static file:// surfaces at
// 1440×1000 (onboarding is 1440×916: its top bar is cropped on purpose).
const SHOT_W = 1440;
const SHOT_H = 1000;

// ── Microcopy set once here. ─────────────────────────────────────────────────
const turnClaim =
  "From shipping pages to building the system that ships them.";
// The publish guardrail — verbatim project rule, typeset once under ch. 09.
const guardrail = "AI can draft and schedule. A person releases to publish.";
const guardrailNote =
  "The guardrail is independent of the gates, so turning approvals off never lets an agent publish on its own.";
// Verbatim quotables, verified against the repo (2026-07-04):
const doctrineQuote =
  "Build the link that doesn’t exist, then delete the copies.";
const fileQuote =
  "Preserve file:// support because designers may open this export directly.";

const pulseCss = `
/* ── Pulse case page — Studio Bloom ──────────────────────────────────────
   The page adopts Pulse's own stage: #f4f7f7 ground, soft cyan blooms,
   glass bentos, white inner cards, ink chrome. Product values are scoped
   as --pp-*; the page's case accent is Pulse's cyan family (--case-accent
   #49e0f5 for marks, --case-detail #0d7685 for text — the 500 base fails
   AA as text on light ground, so text always uses the 700 stop). */
.pulse-case-page {
  /* Pulse stage + surfaces */
  --pp-stage: #f4f7f7;
  --pp-canvas: #ffffff;
  --pp-ink: #1d1d1f;
  --pp-text-2: #44464a;
  --pp-text-3: #5f6369;
  --pp-text-4: #8a8e95;
  --pp-line: rgba(29, 29, 31, 0.08);
  --pp-line-strong: rgba(29, 29, 31, 0.16);
  --pp-glass: rgba(255, 255, 255, 0.38);
  --pp-shadow-rest: 0 1px 2px rgba(15, 23, 42, 0.035), 0 4px 10px rgba(15, 23, 42, 0.04);
  --pp-shadow-lift: 0 2px 6px rgba(15, 23, 42, 0.05), 0 14px 30px rgba(15, 23, 42, 0.07);

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
     commit stream, the JSON payload editor) can opt back into real mono. */
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
  height: 96px;
  z-index: 50;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    var(--pp-stage) 34%,
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

/* ── Hero: H1 + lede + meta + the run console ──────────────────────────── */
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
.pulse-console {
  grid-column: 10 / -1;
  grid-row: 1 / span 3;
  align-self: start;
  box-sizing: border-box;
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--pp-line);
  border-radius: 16px;
  background: var(--pp-glass);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: var(--pp-shadow-lift);
}
.pulse-console-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-family: var(--pulse-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-fig {
  font-style: normal;
  color: var(--case-detail);
  margin-right: 0.65em;
}
/* status pill — a Pulse product idiom (its pills stay fully rounded);
   colors follow the generation ladder, flat fills, no glow */
.pulse-pill {
  font-family: var(--pulse-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.04em;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--pp-line-strong);
  background: #ffffff;
  color: var(--pp-text-3);
  white-space: nowrap;
}
.pulse-pill[data-state="queued"]     { background: #eef0f0; color: var(--pp-text-2); }
.pulse-pill[data-state="scheduled"]  { background: var(--pp-blue-soft); color: var(--pp-blue-dark); border-color: var(--pp-blue-line); }
.pulse-pill[data-state="generating"] { background: var(--pp-purple-soft); color: var(--pp-purple-dark); border-color: var(--pp-purple-line); }
.pulse-pill[data-state="ready"]      { background: var(--pp-cyan-soft); color: var(--pp-cyan-dark); border-color: var(--pp-cyan-line); }
.pulse-pill[data-state="live"]       { background: var(--pp-green-soft); color: var(--pp-green-dark); border-color: var(--pp-green-line); }
.pulse-pill[data-state="attention"]  { background: var(--pp-amber-soft); color: var(--pp-amber-dark); border-color: var(--pp-amber-line); }
.pulse-stream {
  min-height: 18px;
  font-family: var(--pulse-mono);
  font-size: 12px;
  color: var(--pp-cyan-dark);
}
@media (prefers-reduced-motion: no-preference) {
  .pulse-stream::after {
    content: "▍";
    animation: pulseCaret 1.1s steps(2, end) infinite;
  }
}
@keyframes pulseCaret {
  50% { opacity: 0; }
}
.pulse-console-ledger {
  border-top: 1px solid var(--pp-line);
}
.pulse-console-ledger > div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--pp-line);
}
.pulse-console-ledger strong {
  font-family: var(--pulse-mono);
  font-size: 22px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--pp-ink);
}
.pulse-console-ledger span {
  font-family: var(--pulse-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: right;
  color: var(--pp-text-4);
}
.pulse-ecg {
  display: block;
  width: 100%;
  height: 48px;
}
.pulse-ecg path {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
}
.pulse-ecg .pulse-ecg-base { stroke: rgba(29, 29, 31, 0.12); }
.pulse-ecg .pulse-ecg-trace { stroke: var(--pp-cyan-600); }
@media (prefers-reduced-motion: no-preference) {
  .pulse-ecg .pulse-ecg-trace {
    stroke: var(--pp-cyan);
    stroke-dasharray: 110 620;
    animation: pulseTrace 4.6s linear infinite;
  }
}
@keyframes pulseTrace {
  to { stroke-dashoffset: -730; }
}

/* ── Summary + figures ledger ───────────────────────────────────────────── */
/* the shared summary slab is paper-white globally; on the Pulse stage it
   reads as an accidental seam — sit it directly on the stage instead */
.pulse-case-page .proj-summary {
  background: transparent;
  border-top-color: var(--pp-line-strong);
  border-bottom-color: var(--pp-line-strong);
}
.pulse-ledger {
  grid-column: 11 / -1;
  align-self: start;
  border-top: 1px solid var(--pp-line-strong);
}
.pulse-ledger > div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid var(--pp-line-strong);
}
.pulse-ledger strong {
  font-family: var(--pulse-mono);
  font-size: var(--text-title);
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--pp-ink);
}
.pulse-ledger span {
  font-size: var(--text-label);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pp-text-4);
  text-align: right;
}
.pulse-ledger-note {
  grid-column: 1 / -1;
  margin: 10px 0 0;
  font-family: var(--pulse-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--pp-text-4);
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
  row-gap: clamp(32px, 3.6vw, 48px);
  padding: calc(var(--gap-section) / 2) 0;
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
.pulse-rail li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 5px 0;
  font-family: var(--pulse-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.04em;
  color: #b1b5bb;
}
.pulse-rail li i {
  font-style: normal;
  width: 18px;
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
@media (prefers-reduced-motion: no-preference) {
  .pulse-rail li.is-run::after {
    animation: pulseCaret 1.2s steps(2, end) infinite;
  }
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
.pulse-shot-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--work-grid-gap);
}

/* ── Ch. 01 — the melee grid ────────────────────────────────────────────── */
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
  height: 16px;
  background: rgba(29, 29, 31, 0.16);
}
.pulse-melee-wire i:nth-child(3) {
  width: 72%;
}
.pulse-melee-made {
  margin: 0;
  font-size: 14px;
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

/* ── Ch. 02 — the thin style pass ───────────────────────────────────────── */
.pulse-stylepass-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 14px;
}
.pulse-stylepass-row strong {
  font-family: var(--font-text);
  font-size: 34px;
  font-weight: 600;
  line-height: 1;
  color: var(--pp-ink);
}
.pulse-stylepass-dots {
  display: flex;
  gap: 6px;
}
.pulse-stylepass-dots i {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid var(--pp-line);
}
.pulse-stylepass-note {
  margin: 14px 0 0;
  font-family: var(--pulse-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--pp-text-3);
}
.pulse-stylepass-note strong {
  display: block;
  font-family: var(--font-text);
  font-size: 14px;
  font-weight: 600;
  color: var(--pp-ink);
}

/* ── Ch. 03 — the generation-status ladder ──────────────────────────────── */
.pulse-ladder {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}
.pulse-ladder-pill {
  font-family: var(--pulse-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.04em;
  padding: 4px 12px;
  border-radius: 999px; /* product idiom inside a product frame */
  border: 1px solid var(--pp-line-strong);
  background: transparent;
  color: var(--pp-text-3);
  transition: background 0.3s var(--ease-silk), color 0.3s var(--ease-silk),
    border-color 0.3s var(--ease-silk), transform 0.3s var(--ease-silk);
}
.pulse-ladder-pill.is-on { transform: translateY(-2px); }
.pulse-ladder-pill[data-state="queued"].is-on     { background: #eef0f0; color: var(--pp-text-2); }
.pulse-ladder-pill[data-state="scheduled"].is-on  { background: var(--pp-blue-soft); color: var(--pp-blue-dark); border-color: var(--pp-blue-line); }
.pulse-ladder-pill[data-state="generating"].is-on { background: var(--pp-purple-soft); color: var(--pp-purple-dark); border-color: var(--pp-purple-line); }
.pulse-ladder-pill[data-state="ready"].is-on      { background: var(--pp-cyan-soft); color: var(--pp-cyan-dark); border-color: var(--pp-cyan-line); }
.pulse-ladder-pill[data-state="live"].is-on       { background: var(--pp-green-soft); color: var(--pp-green-dark); border-color: var(--pp-green-line); }
.pulse-ladder-pill[data-state="attention"].is-on  { background: var(--pp-amber-soft); color: var(--pp-amber-dark); border-color: var(--pp-amber-line); }

/* ── Ch. 04 — the monolith splits ───────────────────────────────────────── */
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
  width: 64px;
  height: 240px;
  border: 1px solid var(--pp-line-strong);
  border-radius: 4px;
  background: repeating-linear-gradient(
    to bottom,
    rgba(29, 29, 31, 0.14) 0 1px,
    transparent 1px 5px
  );
  transform-origin: bottom;
}
.pulse-monolith-folder {
  display: grid;
  gap: 6px;
}
.pulse-monolith-chip {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pulse-monolith-chip i {
  display: block;
  width: 28px;
  height: 18px;
  border: 1px solid var(--pp-line-strong);
  border-radius: 2px;
  background: var(--pp-canvas);
}
.pulse-monolith-chip em {
  font-style: normal;
  font-family: var(--pulse-mono);
  font-size: 12px;
  color: var(--pp-text-3);
}
.pulse-monolith-label {
  margin: 0;
  font-family: var(--pulse-mono);
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  color: var(--pp-text-3);
}
.pulse-monolith-label strong {
  display: block;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--pp-ink);
}

/* ── Ch. 05 — commit stream + loss card ─────────────────────────────────── */
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
  /* literal code content — the one place real mono stays (with the JSON
     editor); everything UI on this page is the text face */
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
  padding: 9px 0;
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

/* ── Ch. 06 — token sheet, ramps, inventory, CI chain ───────────────────── */
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
  grid-template-columns: repeat(6, minmax(0, 1fr));
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
  padding: 9px 0;
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
.pulse-inv-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  border: 1px solid var(--pp-line);
  border-radius: 12px;
  overflow: hidden;
  background: var(--pp-canvas);
  box-shadow: var(--pp-shadow-rest);
}
.pulse-inv-cell {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
  padding: 12px 14px;
  border-right: 1px solid var(--pp-line);
  border-bottom: 1px solid var(--pp-line);
  transition: background 0.25s var(--ease-silk);
}
.pulse-inv-cell:nth-child(5n) { border-right: 0; }
.pulse-inv-cell:nth-last-child(-n + 5) { border-bottom: 0; }
.pulse-inv-cell i {
  font-family: var(--pulse-mono);
  font-style: normal;
  font-size: var(--text-micro);
  color: var(--pp-text-4);
}
.pulse-inv-cell span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-meta);
  color: rgba(29, 29, 31, 0.8);
}
.pulse-inv-cell:hover {
  background: var(--pp-cyan-soft);
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

/* ── Ch. 07 — skill card + build timeline ───────────────────────────────── */
.pulse-truth-epigraph {
  margin: 14px 0 2px;
  font-size: var(--text-meta);
  font-weight: 500;
  line-height: 1.5;
  color: var(--pp-ink);
}
.pulse-skill-rules {
  display: grid;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}
.pulse-skill-rules li {
  position: relative;
  padding-left: 18px;
  font-family: var(--pulse-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--pp-text-2);
}
.pulse-skill-rules li::before {
  content: "—";
  position: absolute;
  left: 0;
  color: var(--case-detail);
}
.pulse-log {
  border-top: 1px solid var(--pp-line-strong);
}
.pulse-log-row {
  display: grid;
  grid-template-columns: minmax(96px, 120px) minmax(0, 1.1fr) minmax(0, 1fr);
  column-gap: var(--work-grid-gap);
  align-items: baseline;
  padding: 14px 0;
  border-bottom: 1px solid var(--pp-line-strong);
}
.pulse-log-row p {
  margin: 0;
}
.pulse-log-date {
  font-family: var(--pulse-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.04em;
  white-space: nowrap;
  color: var(--case-detail);
}
.pulse-log-subject {
  font-size: var(--text-meta);
  font-weight: 500;
  line-height: 1.5;
  color: var(--pp-ink);
}
.pulse-log-note {
  font-size: var(--text-meta);
  line-height: 1.5;
  color: var(--pp-text-3);
}

/* ── Ch. 09 — product artifacts (brief, chat, guardrail) ────────────────── */
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
.pulse-chat {
  padding: clamp(18px, 1.6vw, 26px);
  font-family: var(--font-text);
  color: var(--pp-ink);
}
.pulse-chat-turn + .pulse-chat-turn {
  margin-top: 16px;
}
.pulse-chat-turn:nth-child(2) { --d: 80ms; }
.pulse-chat-turn:nth-child(3) { --d: 160ms; }
.pulse-chat-assistant {
  margin: 0;
  max-width: 34ch;
  font-size: 15px;
  line-height: 1.5;
}
.pulse-chat-user {
  display: flex;
  justify-content: flex-end;
}
.pulse-chat-user span {
  padding: 9px 14px;
  border-radius: 16px 16px 4px 16px;
  background: var(--pp-ink);
  font-size: 15px;
  line-height: 1.4;
  color: #ffffff;
}
.pulse-chat-card {
  padding: 12px 14px;
  border: 1px solid var(--pp-line);
  border-radius: 16px;
  background: #ffffff;
}
.pulse-chat-card strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
}
.pulse-chat-card i {
  display: block;
  height: 7px;
  margin-top: 7px;
  border-radius: 4px;
  background: rgba(29, 29, 31, 0.09);
}
.pulse-chat-card i:nth-of-type(1) { width: 88%; }
.pulse-chat-card i:nth-of-type(2) { width: 64%; }
.pulse-chat-card i:nth-of-type(3) { width: 46%; }
.pulse-chat-card > span {
  display: inline-block;
  margin-top: 11px;
  font-size: 13px;
  font-weight: 600;
  color: var(--pp-cyan-dark);
}
.pulse-chat-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0 0;
  font-family: var(--pulse-mono);
  font-size: 11px;
  color: var(--pp-text-3);
}
.pulse-chat-note::before {
  content: "";
  width: 16px;
  height: 1px;
  flex: 0 0 auto;
  background: rgba(29, 29, 31, 0.35);
}
.pulse-chat-note.is-right {
  justify-content: flex-end;
}
.pulse-chat-note.is-right::before {
  order: 2;
}
.pulse-guardrail {
  margin-top: clamp(4px, 0.8vw, 10px);
  padding-left: clamp(18px, 2vw, 28px);
  border-left: 2px solid var(--pp-ink);
}
.pulse-guardrail-claim {
  margin: 0;
  max-width: 34ch;
  font-family: var(--font-text);
  font-size: var(--text-title);
  font-weight: 500;
  line-height: 1.32;
  color: var(--pp-ink);
}
.pulse-guardrail-note {
  margin: 12px 0 0;
  max-width: 56ch;
  font-size: var(--text-meta);
  line-height: 1.55;
  color: var(--pp-text-3);
}

/* ── The Turn — glass bento; the spine carries the one seal-red moment ──── */
.pulse-turn-wrap {
  /* lives inside the acts main — the shell/gutter come from .pulse-acts */
  padding: calc(var(--gap-section) / 2) 0;
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
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
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
  left: 21px;
  right: 0;
  top: 10px;
  height: 1px;
  background: var(--pp-stage);
}
.pulse-spine-node {
  position: relative;
  z-index: 1;
  display: block;
  width: 21px;
  height: 21px;
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

/* ── Adjacent case — quiet close ────────────────────────────────────────── */
.pulse-next {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  margin: 0 auto;
  padding: clamp(56px, 6vw, 84px) var(--work-gutter);
  border-top: 1px solid var(--pp-line-strong);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  align-items: baseline;
}
.pulse-next-label {
  grid-column: 1 / 4;
  margin: 0;
  font-size: var(--text-label);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-next-link {
  grid-column: 4 / 10;
  justify-self: start;
  text-decoration: none;
  color: var(--pp-ink);
}
.pulse-next-link:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
.pulse-next-title {
  font-family: var(--font-text);
  font-size: var(--text-heading);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.12;
  text-transform: none;
  padding-bottom: 0.14em;
  white-space: normal;
}
.pulse-next-link:hover .pulse-next-title::after,
.pulse-next-link:focus-visible .pulse-next-title::after {
  transform: scaleX(1);
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
  .pulse-console {
    grid-column: 3 / -1;
    grid-row: auto;
    max-width: 480px;
  }
  .pulse-ledger {
    grid-column: 3 / -1;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    column-gap: var(--work-grid-gap);
  }
  .pulse-ledger > div {
    display: block;
    padding: 13px 0 15px;
  }
  .pulse-ledger span {
    display: block;
    margin-top: 8px;
    text-align: left;
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
  .pulse-section-inset,
  .pulse-section-full {
    grid-column: 1 / -1;
  }
  .pulse-chapter-claim {
    max-width: none;
  }
  .pulse-inv-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .pulse-inv-cell:nth-child(5n) { border-right: 1px solid var(--pp-line); }
  .pulse-inv-cell:nth-child(4n) { border-right: 0; }
  .pulse-inv-cell:nth-last-child(-n + 5) { border-bottom: 1px solid var(--pp-line); }
  .pulse-inv-cell:nth-last-child(-n + 4) { border-bottom: 0; }
  .pulse-log-row {
    grid-template-columns: minmax(84px, 104px) minmax(0, 1.1fr) minmax(0, 1fr);
  }
  .pulse-next-label {
    grid-column: 1 / 3;
  }
  .pulse-next-link {
    grid-column: 3 / -1;
  }
}

/* ── Phone ──────────────────────────────────────────────────────────────── */
@media (max-width: 809px) {
  .pulse-case-page .case-study-hero h1,
  .pulse-case-page .case-hero-lede,
  .pulse-console {
    grid-column: 1;
  }
  .pulse-console {
    max-width: none;
  }
  .pulse-ledger {
    grid-column: 1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
  .pulse-inv-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .pulse-inv-cell:nth-child(4n),
  .pulse-inv-cell:nth-child(5n) { border-right: 1px solid var(--pp-line); }
  .pulse-inv-cell:nth-child(2n) { border-right: 0; }
  .pulse-inv-cell:nth-last-child(-n + 4),
  .pulse-inv-cell:nth-last-child(-n + 5) { border-bottom: 1px solid var(--pp-line); }
  .pulse-inv-cell:nth-last-child(-n + 2) { border-bottom: 0; }
  /* keep names on one line (mid-word breaks like "ButtonSeconda/ry" read
     worse than an ellipsis) */
  .pulse-inv-cell span {
    white-space: nowrap;
    text-overflow: ellipsis;
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
  .pulse-log-row {
    display: block;
    padding: 16px 0;
  }
  .pulse-log-date {
    display: inline-block;
    margin-right: 14px;
  }
  .pulse-log-subject {
    margin-top: 6px;
  }
  .pulse-log-note {
    margin-top: 4px;
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
    grid-template-columns: 21px minmax(0, 1fr);
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
  .pulse-next {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 18px;
  }
  .pulse-next-label,
  .pulse-next-link {
    grid-column: 1;
  }
}

/* ── One-typeface support: the former mono labels hold their shape in the
   text face via weight + tabular numerals (placed last so it wins ties) ── */
.pulse-spec-head,
.pulse-console-head,
.pulse-rail-head,
.pulse-chapter-index,
.pulse-fig,
.pulse-spec-foot,
.pulse-kv-row span,
.pulse-ticker-stats span,
.pulse-spine-legend,
.pulse-next-label,
.pulse-section-tags,
.pulse-spec-ruler-label {
  font-weight: 500;
}
.pulse-rail li i,
.pulse-console-ledger strong,
.pulse-ticker-stats strong,
.pulse-kv-row em,
.pulse-log-date,
.pulse-ramp-row > em,
.pulse-monolith-label strong,
.pulse-ledger strong {
  font-variant-numeric: tabular-nums;
}
.pulse-case-page .icue {
  font-family: var(--pulse-mono);
  font-weight: 500;
}

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
  .pulse-inv-cell,
  .pulse-spec-chip span,
  .pulse-ladder-pill {
    transition: none;
  }
}
`;

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

// The run-log rail — ONE persistent spine beside all the acts (QA: the old
// per-chapter copies read as nine duplicate cards). Server markup renders
// the FINAL state (all acts done — the run finished); when motion is
// allowed, PulseScroll rewinds it and drives done/running live from the
// chapter positions. Decorative duplicate of the chapter headings, so it's
// hidden from the tree.
function RunRail() {
  return (
    <aside className="pulse-rail" aria-hidden="true">
      <div className="pulse-rail-card" data-fade>
        <span className="pulse-rail-head">Run log</span>
        <ol data-rail>
          {acts.map((label, i) => (
            <li key={label} className="is-done">
              <i>{String(i + 1).padStart(2, "0")}</i>
              {label}
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

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

export function PulseCaseLayout({ project }: { project: Project }) {
  const meta = [
    ["Role", project.role],
    ["Duration", project.duration],
    ["Type", project.type],
    ["Teams", project.teams],
  ];
  // The nine-act causal chain from data/projects.ts:
  // melee → bet → look → wake-up → rescue → base → skills → interface → product.
  const [melee, bet, look, wakeup, rescue, base, skills, iface, product] =
    project.chapters ?? [];
  const moment = project.moment;
  const neighbors = adjacent(project.slug);
  const next = neighbors.next ?? neighbors.prev;

  return (
    <article className="case-study-page pulse-case-page" data-has-cover="false">
      <style dangerouslySetInnerHTML={{ __html: pulseCss + ICUE_CSS }} />
      <PulseScroll />
      <div className="pulse-blooms" aria-hidden="true">
        <i className="pulse-bloom" />
        <i className="pulse-bloom" />
        <i className="pulse-bloom" />
      </div>
      <div className="pulse-navscrim" aria-hidden="true" />

      {/* ── Hero: H1 + lede + meta rail + the run console ── */}
      <section className="case-study-hero" id="header">
        <p className="case-hero-kicker" data-fade>
          Case Study
        </p>
        <h1 data-fade>{project.title}</h1>
        <aside className="pulse-console" aria-label="Project run console" data-fade>
          <header className="pulse-console-head">
            <span>
              <em className="pulse-fig">Fig. 01</em>Run console
            </span>
            <span
              className="pulse-pill"
              data-state="ready"
              data-cycle="queued:queued|scheduled:scheduled|generating:generating|ready:ready"
            >
              ready
            </span>
          </header>
          <p
            className="pulse-stream"
            data-stream="six prototypes → one system, five weeks"
          >
            six prototypes → one system, five weeks
          </p>
          <div className="pulse-console-ledger">
            <div>
              <strong data-count="824">824</strong>
              <span>commits &middot; five weeks</span>
            </div>
            <div>
              <strong data-count="40">40</strong>
              <span>components, one source</span>
            </div>
            <div>
              <strong>3</strong>
              <span>human checkpoints</span>
            </div>
          </div>
          <svg className="pulse-ecg" viewBox="0 0 640 64" aria-hidden="true">
            <path
              className="pulse-ecg-base"
              d="M0 40 H190 l10 -14 12 26 10 -30 12 22 8 -4 H420 l10 -10 12 18 8 -8 H640"
            />
            <path
              className="pulse-ecg-trace"
              d="M0 40 H190 l10 -14 12 26 10 -30 12 22 8 -4 H420 l10 -10 12 18 8 -8 H640"
            />
          </svg>
        </aside>
        <p className="case-hero-lede" data-fade>
          {project.oneliner}
        </p>
        <dl className="case-hero-meta" data-fade>
          {meta.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Overview: what Pulse is + the scope, once + figures ledger ── */}
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
        <aside className="pulse-ledger" aria-label="Project figures" data-fade>
          {ledger.map(([n, unit]) => (
            <div key={unit}>
              <strong>{n}</strong>
              <span>{unit}</span>
            </div>
          ))}
          <p className="pulse-ledger-note">
            teammates, tools, and the package identity are generalized on
            purpose &mdash; the work is real; the internals stay internal
          </p>
        </aside>
      </section>

      {/* ── The acts: one persistent run-log rail beside all nine chapters
          and the Turn — the "one run" spine, driven on scroll ── */}
      <div className="pulse-acts">
        <RunRail />
        <div className="pulse-acts-main">

      {/* ── 01 · The melee ── */}
      {melee && (
        <section className="case-chapter pulse-chapter" data-act="0">
            <ChapterHead number={melee.number} title={melee.title} />
            {melee.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={melee.sections[0]} />
                <figure className="pulse-section-full" data-fade>
                  <div className="pulse-melee">
                    {meleeSources.map((cell) => (
                      <div className="pulse-melee-cell" key={cell.made}>
                        <div className="pulse-melee-wire" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                          <i />
                        </div>
                        <p className="pulse-melee-made">{cell.made}</p>
                        <p className="pulse-melee-trace">{cell.trace}</p>
                      </div>
                    ))}
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 02</em>Four prototypes,
                      one face &mdash; and four sources that cannot be merged
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      {/* ── 02 · The bet ── */}
      {bet && (
        <section className="case-chapter pulse-chapter" data-act="1">
            <ChapterHead number={bet.number} title={bet.title} />
            {bet.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={bet.sections[0]} />
                <figure className="pulse-section-aside" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>style pass &middot; v0</span>
                    </header>
                    <div className="pulse-stylepass-row">
                      <strong>Aa</strong>
                      <span className="pulse-stylepass-dots" aria-hidden="true">
                        <i style={{ background: "#1d1d1f" }} />
                        <i style={{ background: "#49e0f5" }} />
                        <i style={{ background: "#43ba51" }} />
                        <i style={{ background: "#f19a08" }} />
                      </span>
                    </div>
                    <p className="pulse-stylepass-note">
                      <strong>a look, not a system</strong>
                      one typeface &middot; a palette &middot; a handful of
                      rules &mdash; enough to rhyme, not enough to merge
                    </p>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 03</em>The thin style
                      pass that held the melee together, barely
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      {/* ── 03 · The look ── */}
      {look && (
        <section className="case-chapter pulse-chapter" data-act="2">
            <ChapterHead number={look.number} title={look.title} />
            {look.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={look.sections[0]} />
                <figure className="pulse-section-aside" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>generation status &middot; ladder</span>
                    </header>
                    <div className="pulse-ladder">
                      <span className="pulse-ladder-pill is-on" data-state="queued">
                        queued
                      </span>
                      <span className="pulse-ladder-pill is-on" data-state="scheduled">
                        scheduled
                      </span>
                      <span className="pulse-ladder-pill is-on" data-state="generating">
                        generating
                      </span>
                      <span className="pulse-ladder-pill is-on" data-state="ready">
                        ready
                      </span>
                      <span className="pulse-ladder-pill is-on" data-state="live">
                        published
                      </span>
                      <span className="pulse-ladder-pill is-on" data-state="attention">
                        needs attention
                      </span>
                    </div>
                    <p className="pulse-spec-foot">
                      red never appears in generation status &mdash; it is
                      reserved for declining data
                    </p>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 04</em>Six process
                      states, each with one meaning &mdash; they light in
                      order as you arrive
                    </span>
                  </figcaption>
                </figure>
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
                      <em className="pulse-fig">Fig. 05</em>The accent study
                      &mdash; identical dashboards, candidate accents side by
                      side; then the cyan experiment on a full Home
                    </span>
                  </figcaption>
                </figure>
                <figure className="pulse-section-inset" data-fade>
                  <div className="pulse-shot">
                    <Image
                      src="/media/work/pulse/foundations-color.png"
                      alt="Pulse design-system foundations: the 'Neutral first, color with meaning' section with named swatches, status chips, and semantics rules"
                      width={SHOT_W}
                      height={SHOT_H}
                      sizes="(max-width: 1080px) 100vw, 1030px"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 06</em>The rules, written
                      down &mdash; the foundations page every hue answers to
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      {/* ── 04 · The wake-up ── */}
      {wakeup && (
        <section className="case-chapter pulse-chapter" data-act="3">
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
                      <em className="pulse-fig">Fig. 07</em>The wake-up file
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
              </div>
            )}
        </section>
      )}

      {/* ── 05 · The rescue ── */}
      {rescue && (
        <section className="case-chapter pulse-chapter" data-act="4">
            <ChapterHead number={rescue.number} title={rescue.title} />
            {rescue.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={rescue.sections[0]} />
                <figure className="pulse-section-aside" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>What migration broke</span>
                    </header>
                    <div className="pulse-kv">
                      {lossRows.map(([what, fix]) => (
                        <div className="pulse-kv-row" key={what}>
                          <span>{what}</span>
                          <em>{fix}</em>
                        </div>
                      ))}
                    </div>
                    <p className="pulse-spec-foot">
                      every page reviewed against its original
                    </p>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 08</em>AI carried the
                      bulk; the fidelity was hand work
                    </span>
                  </figcaption>
                </figure>
                <figure className="pulse-section-full" data-fade>
                  <div className="pulse-ticker-stats">
                    <div>
                      <strong data-count="824">824</strong>
                      <span>commits, five weeks</span>
                    </div>
                    <div>
                      <strong data-count="308">308</strong>
                      <span>of them structural</span>
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
                      <em className="pulse-fig">Fig. 09</em>The commit stream,
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

      {/* ── 06 · The base ── */}
      {base && (
        <section className="case-chapter pulse-chapter" data-act="5">
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
                      <em className="pulse-fig">Fig. 10</em>The canonical
                      token sheet &mdash; six ramps, one scale, one rhythm
                    </span>
                    <InteractiveCue>click / tap a chip to copy its hex</InteractiveCue>
                  </figcaption>
                </figure>
                <figure className="pulse-section-full" data-fade>
                  <div className="pulse-inv-grid">
                    {inventory.map((name, i) => (
                      <div className="pulse-inv-cell" key={name}>
                        <i>{String(i + 1).padStart(2, "0")}</i>
                        <span>{name}</span>
                      </div>
                    ))}
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 11</em>The full registry
                      &mdash; 40 components, each its own folder over shared
                      tokens
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
                      <em className="pulse-fig">Fig. 12</em>The CI gate chain
                      &mdash; the standard enforces itself on every merge
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      {/* ── 07 · The skills ── */}
      {skills && (
        <section className="case-chapter pulse-chapter" data-act="6">
            <ChapterHead number={skills.number} title={skills.title} />
            {skills.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={skills.sections[0]} />
                <figure className="pulse-section-aside" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>skill &middot; design-usage</span>
                    </header>
                    <p className="pulse-truth-epigraph">
                      Loaded before the AI generates or edits a prototype
                      &mdash; the system, written as procedure.
                    </p>
                    <ul className="pulse-skill-rules">
                      {skillRules.map((rule) => (
                        <li key={rule}>{rule}</li>
                      ))}
                    </ul>
                    <p className="pulse-spec-foot">
                      maintenance skills keep tokens, previews, and boards in
                      sync
                    </p>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 13</em>The rules, made
                      loadable &mdash; on-system by construction, not by repair
                    </span>
                  </figcaption>
                </figure>
                <figure className="pulse-section-full" data-fade>
                  <div className="pulse-log">
                    {milestones.map((m) => (
                      <div className="pulse-log-row" key={m.title}>
                        <span className="pulse-log-date">{m.date}</span>
                        <p className="pulse-log-subject">{m.title}</p>
                        <p className="pulse-log-note">{m.note}</p>
                      </div>
                    ))}
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 14</em>Build timeline
                      &mdash; five weeks from melee to system, late May to
                      early July 2026
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      {/* ── 08 · The interface ── */}
      {iface && (
        <section className="case-chapter pulse-chapter" data-act="7">
            <ChapterHead number={iface.number} title={iface.title} />
            {iface.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={iface.sections[0]} />
                <figure className="pulse-section-full" data-fade>
                  <PulseComponentBrowser />
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 15</em>The component
                      browser, rebuilt live &mdash; real components from the
                      Pulse registry; the shipped browser holds all 40
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
                      <em className="pulse-fig">Fig. 16</em>The sliced Figma
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
                <figure className="pulse-section-aside" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>React package &middot; manifest</span>
                    </header>
                    <div className="pulse-kv">
                      {plateRows.map(([key, value]) => (
                        <div className="pulse-kv-row" key={key}>
                          <span>{key}</span>
                          <em>{value}</em>
                        </div>
                      ))}
                    </div>
                    <p className="pulse-spec-foot">
                      versioned releases &middot; CI rebuilds from the design
                      system
                    </p>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 17</em>The package&rsquo;s
                      plate &mdash; styles sync from the canonical CSS at build
                      time
                    </span>
                  </figcaption>
                </figure>
                <figure className="pulse-section-full" data-fade>
                  <div className="pulse-card">
                    <PulsePlaygroundDemo />
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 18</em>The playground
                      idea, live &mdash; feed a component data and watch it
                      hold: empty, overflowing, broken
                    </span>
                    <InteractiveCue>
                      edit the JSON &mdash; the tile answers
                    </InteractiveCue>
                  </figcaption>
                </figure>
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
                      <em className="pulse-fig">Fig. 19</em>The real
                      playground &mdash; the published AIPanel rendered live,
                      with per-component knobs and a JSON data editor
                    </span>
                  </figcaption>
                </figure>
                <figure className="pulse-section-inset" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>Four roles &middot; one base</span>
                    </header>
                    <div className="pulse-kv">
                      {roleRows.map(([role, reads]) => (
                        <div className="pulse-kv-row" key={role}>
                          <span>{role}</span>
                          <em>{reads}</em>
                        </div>
                      ))}
                    </div>
                    <p className="pulse-spec-foot">
                      integration stopped being a rescue
                    </p>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 20</em>The interface,
                      read four ways
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
        </section>
      )}

      {/* ── 09 · The product ── */}
      {product && (
        <section className="case-chapter pulse-chapter" data-act="8">
            <ChapterHead number={product.number} title={product.title} />
            {product.sections[0] && (
              <div className="pulse-section">
                <SectionProse section={product.sections[0]} />
                <figure className="pulse-section-full" data-fade>
                  <div className="pulse-shot">
                    <Image
                      src="/media/work/pulse/pulse-app-home.png"
                      alt="Pulse app Home page: workspace sidebar for the demo brand, action-item KPI tiles, content queue, and signals feed"
                      width={SHOT_W}
                      height={SHOT_H}
                      sizes="(max-width: 1080px) 100vw, 1160px"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 21</em>The unified Pulse
                      app, Home &mdash; the page that forced the map, now on
                      the system
                    </span>
                  </figcaption>
                </figure>
                <figure className="pulse-section-inset" data-fade>
                  <div className="pulse-shot-pair">
                    <div className="pulse-shot">
                      <Image
                        src="/media/work/pulse/pulse-app-calendar.png"
                        alt="Pulse Calendar in week view with scheduled posts and a schedule-health rail"
                        width={SHOT_W}
                        height={SHOT_H}
                        sizes="(max-width: 809px) 100vw, (max-width: 1080px) 50vw, 500px"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                    <div className="pulse-shot">
                      <Image
                        src="/media/work/pulse/pulse-app-analytics.png"
                        alt="Pulse Analytics weekly report with KPI tiles and key signals"
                        width={SHOT_W}
                        height={SHOT_H}
                        sizes="(max-width: 809px) 100vw, (max-width: 1080px) 50vw, 500px"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 22</em>Two more pages of
                      the same static export &mdash; the scheduling Calendar
                      and the weekly Analytics report, both from a file://
                      address
                    </span>
                  </figcaption>
                </figure>
                <figure className="pulse-section-inset" data-fade>
                  <div className="pulse-shot">
                    <Image
                      src="/media/work/pulse/pulse-app-onboarding.png"
                      alt="Pulse brand onboarding: an editorial hero reading 'Your brand, decoded. Your channels, run.' above brand-URL and brand-guide inputs"
                      width={SHOT_W}
                      height={916}
                      sizes="(max-width: 1080px) 100vw, 1030px"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 23</em>Onboarding &mdash;
                      a new brand becomes working material: starter assets and
                      a vault that feeds every generative step after it
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}
            {product.sections[1] && (
              <div className="pulse-section">
                <SectionProse section={product.sections[1]} />
                <div className="pulse-section-aside">
                  <figure data-fade>
                    <div className="pulse-artifact">
                      <PulseCreativeBrief />
                    </div>
                    <figcaption className="pulse-fig-caption">
                      <span>
                        <em className="pulse-fig">Fig. 24</em>The Creative
                        Brief &mdash; a person shapes the AI draft
                      </span>
                      <InteractiveCue>edit a field, then approve</InteractiveCue>
                    </figcaption>
                  </figure>
                  <figure data-fade style={{ marginTop: 24 }}>
                    <div className="pulse-artifact">
                      <div className="pulse-chat">
                        <div className="pulse-chat-turn">
                          <p className="pulse-chat-assistant">
                            Draft brief is ready &mdash; audience and tone come
                            from your brand vault.
                          </p>
                          <p className="pulse-chat-note">
                            assistant &middot; plain text, no bubble
                          </p>
                        </div>
                        <div className="pulse-chat-turn">
                          <div className="pulse-chat-user">
                            <span>Tighten the key message.</span>
                          </div>
                          <p className="pulse-chat-note is-right">
                            user &middot; ink bubble, right-aligned
                          </p>
                        </div>
                        <div className="pulse-chat-turn">
                          <div className="pulse-chat-card">
                            <strong>Creative Brief</strong>
                            <i aria-hidden="true" />
                            <i aria-hidden="true" />
                            <i aria-hidden="true" />
                            <span>Open brief</span>
                          </div>
                          <p className="pulse-chat-note">
                            rich content &middot; a card; inline controls stay
                            flat
                          </p>
                        </div>
                      </div>
                    </div>
                    <figcaption className="pulse-fig-caption">
                      <span>
                        <em className="pulse-fig">Fig. 25</em>Chat contract
                        &mdash; the assistant follows the product component
                        contract
                      </span>
                    </figcaption>
                  </figure>
                </div>
              </div>
            )}
            {product.sections[2] && (
              <div className="pulse-section">
                <SectionProse section={product.sections[2]} />
                <figure className="pulse-section-inset" data-fade>
                  <div className="pulse-chain-row is-approvals">
                    <div className="pulse-chain-cell">
                      <i>01</i>
                      <strong>Reviewer</strong>
                    </div>
                    <span className="pulse-chain-link">SLA 24h</span>
                    <div className="pulse-chain-cell">
                      <i>02</i>
                      <strong>Brand admin</strong>
                    </div>
                    <span className="pulse-chain-link">SLA 24h</span>
                    <div className="pulse-chain-cell">
                      <i>03</i>
                      <strong>Org owner</strong>
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 26</em>Approval chain
                      &mdash; SLA timers; escalation never auto-approves
                    </span>
                  </figcaption>
                </figure>
                <div className="pulse-guardrail pulse-section-inset" data-fade>
                  <p className="pulse-guardrail-claim">{guardrail}</p>
                  <p className="pulse-guardrail-note">{guardrailNote}</p>
                </div>
              </div>
            )}
        </section>
      )}

      {/* ── The Turn — reflective climax; the spine carries the page's one
          seal-red moment (the human-gate stamps) ── */}
      {moment && (
        <div className="pulse-turn-wrap" data-act="9">
          <section className="pulse-turn" aria-labelledby="pulse-turn-title">
            <p className="pulse-turn-eyebrow" data-fade>
              Most memorable moment
            </p>
            <h2 className="pulse-turn-claim" id="pulse-turn-title" data-fade>
              {turnClaim}
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
              <span>
                <em className="pulse-fig">Fig. 27</em>Create-with-AI &mdash;
                where a person stays in the loop
              </span>
              <span className="pulse-spine-legend">
                <i aria-hidden="true" /> ai step
                <i className="is-stamp" aria-hidden="true" /> human gate
              </span>
            </footer>
          </section>
        </div>
      )}

        </div>
      </div>

      {/* ── Adjacent case — quiet close ── */}
      {next && (
        <aside className="pulse-next">
          <p className="pulse-next-label" data-fade>
            Next case
          </p>
          <Link className="pulse-next-link" href={`/work/${next.slug}`} data-fade>
            <span className="cta cta--quiet pulse-next-title">{next.title}</span>
          </Link>
        </aside>
      )}
    </article>
  );
}
