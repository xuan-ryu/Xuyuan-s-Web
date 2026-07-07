import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CaseSection, Project } from "@/data/projects";
import { CaseNext } from "@/components/case-next";
import { PulseScroll } from "./pulse-scroll";
import { PulseComponentBrowser } from "./pulse-component-browser";
import { PulseCreativeBrief } from "./pulse-creative-brief";
import { PulsePlaygroundDemo } from "./pulse-playground-demo";
import { PulseTokenChips } from "./pulse-token-chips";
import { InteractiveCue, ICUE_CSS } from "./ui/interactive-cue";
import { stripCssComments } from "@/lib/css-sanitize";

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
//    incompatible sources. The shared wireframe strip on top is the "one
//    face"; under it, each card shows its source's characteristic UI idiom
//    (canvas selection, inline-style soup, chat paste, photo composite) —
//    tool categories drawn, not named (confidentiality: no brand list). ──
const meleeSources = [
  {
    kind: "canvas",
    made: "drawn in a design canvas",
    trace: "frames only — no code at all",
  },
  {
    kind: "builder",
    made: "an AI page-builder export",
    trace: "one file, styles inlined per node",
  },
  {
    kind: "chat",
    made: "pasted from a model chat",
    trace: "runs, but write-only to humans",
  },
  {
    kind: "image",
    made: "composited from images",
    trace: "screens as pictures — nothing wired",
  },
] as const;

// ── The brand rules (ch. 03) — the written identity, four rules + the
//    generation ladder in one card (the prose stays at label budget). ──
const brandRules: Array<[string, string]> = [
  ["surface", "neutral first — gray stage, soft cyan light"],
  ["type", "one face for everything · tabular numerals"],
  ["hierarchy", "size · spacing · tone — never bold"],
  ["color", "only with meaning · red = falling data"],
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

// ── Four roles, one base (ch. 08) — the hub diagram's spokes. ──
const hubRoles: Array<[string, string]> = [
  ["design", "live preview + Figma boards"],
  ["engineering", "typed package + contracts"],
  ["ml", "editable data states"],
  ["product", "one runnable flow"],
];

// ── CI guard checks (ch. 06) — the jobs that protect the canonical HTML
//    library on every merge. The pipeline's later publish/pages jobs ship
//    the SEPARATE npm package (ch. 08), so they're not shown here — the
//    package hasn't been introduced yet at this point in the story. ──
const ciSteps: Array<[string, string]> = [
  ["verify", "inventory ↔ preview ↔ board"],
  ["tokens", "drift advisory"],
  ["generated", "hand-edit guard"],
];

// ── Build timeline (ch. 07 close), drawn as a commit spine. Notes at label
//    budget; `mine: false` marks a teammate's / the team's milestone (the
//    outlined nodes — attribution is part of the drawing). Five verified
//    weeks, 2026-05-30 → 2026-07-04, 824 commits. ──
const milestones = [
  {
    date: "Late May",
    title: "Six ways of building, one deadline",
    note: "the same product in six tools, a pitch about a week out",
    mine: false,
  },
  {
    date: "Late May",
    title: "The file that forced the question",
    note: "the shared home prototype swells into one monolithic file",
    mine: true,
  },
  {
    date: "Early June",
    title: "A finished design, waiting on a foundation",
    note: "a teammate's finished page sits idle — no system to land on",
    mine: false,
  },
  {
    date: "Mid-June",
    title: "The boards become one portable file",
    note: "the visual library rebuilt as a single self-contained page",
    mine: true,
  },
  {
    date: "Mid-June",
    title: "HTML and CSS become the source of truth",
    note: "the React copy demoted to a consumer of the canonical layer",
    mine: true,
  },
  {
    date: "Mid-June",
    title: "The monolith becomes source, not blob",
    note: "a build script splits it: 76 partials, 71 scripts, 22 sheets",
    mine: true,
  },
  {
    date: "Mid-June",
    title: "Standards, written as commits",
    note: "Prettier, lint, lighter assets, a CI token gate",
    mine: true,
  },
  {
    date: "Late June",
    title: "The demos converge into one product",
    note: "one static export, every page on the system's tokens",
    mine: true,
  },
  {
    date: "Late June",
    title: "Wrapped for every consumer",
    note: "a teammate publishes the typed React package; CI syncs the CSS in",
    mine: false,
  },
  {
    date: "Early July",
    title: "The payoff: 1,905 dead lines gone",
    note: "drifted style copies collapse back to one source",
    mine: true,
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
  --pp-shadow-lift: 0 2px 6px rgba(15, 23, 42, 0.04), 0 10px 22px rgba(15, 23, 42, 0.05);

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
.pulse-shot-label {
  font-family: var(--pulse-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.pulse-shot-label.is-before { color: var(--pp-amber-dark); }
.pulse-shot-label.is-after { color: var(--pp-green-dark); }

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
/* the build timeline, drawn as one commit spine: a continuous cyan line,
   filled nodes for my milestones, outlined nodes for a teammate's / the
   team's — attribution is part of the drawing */
.pulse-timeline {
  position: relative;
  max-width: 880px;
  padding: 6px 0;
}
.pulse-timeline::before {
  content: "";
  position: absolute;
  left: 131px;
  top: 14px;
  bottom: 14px;
  width: 2px;
  background: var(--pp-cyan-line);
}
.pulse-timeline-row {
  position: relative;
  display: grid;
  grid-template-columns: 110px 44px minmax(0, 1fr);
  align-items: baseline;
  padding: 10px 0;
}
.pulse-timeline-row p {
  margin: 0;
}
.pulse-timeline-date {
  font-size: var(--text-micro);
  font-weight: 500;
  letter-spacing: 0.04em;
  text-align: right;
  white-space: nowrap;
  color: var(--case-detail);
}
.pulse-timeline-node {
  position: relative;
  z-index: 1;
  justify-self: center;
  align-self: center;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--pp-cyan-600);
}
.pulse-timeline-row.is-team .pulse-timeline-node {
  background: var(--pp-canvas);
  border: 2px solid var(--pp-cyan-600);
  width: 8px;
  height: 8px;
}
.pulse-timeline-body {
  min-width: 0;
}
.pulse-timeline-body strong {
  display: block;
  font-size: var(--text-meta);
  font-weight: 500;
  line-height: 1.45;
  color: var(--pp-ink);
}
.pulse-timeline-body span {
  display: block;
  margin-top: 2px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--pp-text-3);
}
.pulse-timeline-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 0 154px;
  font-size: var(--text-micro);
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--pp-text-4);
}
.pulse-timeline-legend i {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--pp-cyan-600);
}
.pulse-timeline-legend i.is-team {
  width: 7px;
  height: 7px;
  background: var(--pp-canvas);
  border: 2px solid var(--pp-cyan-600);
  margin-left: 16px;
}
@media (max-width: 809px) {
  .pulse-timeline::before {
    left: 5px;
  }
  .pulse-timeline-row {
    grid-template-columns: 12px minmax(0, 1fr);
  }
  .pulse-timeline-date {
    display: none;
  }
  .pulse-timeline-node {
    justify-self: start;
  }
  .pulse-timeline-body span em.pulse-timeline-when {
    display: inline;
  }
  .pulse-timeline-legend {
    margin-left: 24px;
  }
}
.pulse-timeline-when {
  font-style: normal;
}
@media (min-width: 810px) {
  .pulse-timeline-when {
    display: none;
  }
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
  .pulse-inv-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .pulse-inv-cell:nth-child(5n) { border-right: 1px solid var(--pp-line); }
  .pulse-inv-cell:nth-child(4n) { border-right: 0; }
  .pulse-inv-cell:nth-last-child(-n + 5) { border-bottom: 1px solid var(--pp-line); }
  .pulse-inv-cell:nth-last-child(-n + 4) { border-bottom: 0; }
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
  font-size: 13px;
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
/* the roles hub: one base bar, four stems, four role chips */
.pflow-hub {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  row-gap: 0;
  padding: 14px 0 4px;
}
.pflow-hub-bar {
  grid-column: 1 / -1;
  box-sizing: border-box;
  padding: 14px 18px;
  border: 1px solid var(--pp-cyan-line);
  border-radius: 10px;
  background: var(--pp-cyan-soft);
  box-shadow: var(--pp-shadow-rest);
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: var(--pp-ink);
}
.pflow-hub-stem {
  justify-self: center;
  width: 2px;
  height: 22px;
  background: var(--pp-cyan-600);
  position: relative;
}
.pflow-hub-stem::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -2px;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--pp-canvas);
  border: 2px solid var(--pp-cyan-600);
}
.pflow-hub-chip {
  box-sizing: border-box;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--pp-line);
  border-radius: 8px;
  background: var(--pp-canvas);
  box-shadow: var(--pp-shadow-rest);
}
.pflow-hub-chip strong {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pp-ink);
}
.pflow-hub-chip span {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.45;
  color: var(--pp-text-3);
}
@media (max-width: 809px) {
  .pflow-node { padding: 8px 10px; font-size: 13px; }
  .pflow-hub {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .pflow-hub-stem { display: none; }
  .pflow-hub-chip { margin-top: 10px; }
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

/* ── Diagram assembly on arrival ─────────────────────────────────────────
   Each figure carries data-fade; FadeReveal adds .is-visible on enter, so
   the figure rises as a frame and ~220ms later its parts assemble in
   reading order — nodes drop, connections draw toward their target, loops
   sweep in, notes settle. One orchestrated reveal per diagram, then still
   (no ambient loops). Motion-only: every hidden initial state lives inside
   @media (prefers-reduced-motion: no-preference), so reduced motion — and
   the forced-visible/no-JS fallback — shows the finished diagram. ── */
@keyframes pAssembleDrop {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pAssembleDraw {
  from { opacity: 0; transform: scaleX(0); }
  to { opacity: 1; transform: scaleX(1); }
}
@keyframes pAssembleLoop {
  from { opacity: 0; transform: scaleY(0.4); }
  to { opacity: 1; transform: scaleY(1); }
}
@keyframes pAssembleGrow {
  from { opacity: 0; transform: scaleY(0); }
  to { opacity: 1; transform: scaleY(1); }
}
@keyframes pAssembleRise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: no-preference) {
  /* pflow flow diagrams — stagger children by column position (slowed ~1.4x
     from the first pass; the assembly read too fast) */
  .pulse-case-page .pflow-grid > :nth-child(2) { --pd: 130ms; }
  .pulse-case-page .pflow-grid > :nth-child(3) { --pd: 260ms; }
  .pulse-case-page .pflow-grid > :nth-child(4) { --pd: 390ms; }
  .pulse-case-page .pflow-grid > :nth-child(5) { --pd: 520ms; }
  .pulse-case-page .pflow-grid > :nth-child(6) { --pd: 650ms; }
  .pulse-case-page .pflow-grid > :nth-child(7) { --pd: 780ms; }
  .pulse-case-page .pflow-lane:nth-child(2) { --ld: 440ms; }

  .pulse-case-page figure[data-fade] .pflow-node,
  .pulse-case-page figure[data-fade] .pflow-line,
  .pulse-case-page figure[data-fade] .pflow-loop,
  .pulse-case-page figure[data-fade] .pflow-note {
    opacity: 0;
  }
  .pulse-case-page figure[data-fade] .pflow-node { transform: translateY(10px); }
  .pulse-case-page figure[data-fade] .pflow-line {
    transform: scaleX(0);
    transform-origin: left;
  }
  .pulse-case-page figure[data-fade] .pflow-loop {
    transform: scaleY(0.4);
    transform-origin: top;
  }
  .pulse-case-page figure[data-fade].is-visible .pflow-node {
    animation: pAssembleDrop 0.58s var(--ease-spring) forwards;
    animation-delay: calc(300ms + var(--ld, 0ms) + var(--pd, 0ms));
  }
  .pulse-case-page figure[data-fade].is-visible .pflow-line {
    animation: pAssembleDraw 0.48s var(--ease-silk) forwards;
    animation-delay: calc(340ms + var(--ld, 0ms) + var(--pd, 0ms));
  }
  .pulse-case-page figure[data-fade].is-visible .pflow-loop {
    animation: pAssembleLoop 0.56s var(--ease-silk) forwards;
    animation-delay: calc(760ms + var(--ld, 0ms));
  }
  .pulse-case-page figure[data-fade].is-visible .pflow-note {
    animation: pAssembleDrop 0.58s var(--ease-silk) forwards;
    animation-delay: calc(820ms + var(--ld, 0ms));
  }

  /* melee — the four source scenes rise in sequence */
  .pulse-case-page figure[data-fade] .pulse-melee-cell { opacity: 0; }
  .pulse-case-page .pulse-melee-cell:nth-child(1) { --cd: 0ms; }
  .pulse-case-page .pulse-melee-cell:nth-child(2) { --cd: 150ms; }
  .pulse-case-page .pulse-melee-cell:nth-child(3) { --cd: 300ms; }
  .pulse-case-page .pulse-melee-cell:nth-child(4) { --cd: 450ms; }
  .pulse-case-page figure[data-fade].is-visible .pulse-melee-cell {
    animation: pAssembleRise 0.68s var(--ease-spring) forwards;
    animation-delay: calc(240ms + var(--cd, 0ms));
  }

  /* build timeline — the commit spine grows as the rows stagger in */
  .pulse-case-page figure[data-fade] .pulse-timeline::before {
    transform: scaleY(0);
    transform-origin: top;
  }
  .pulse-case-page figure[data-fade] .pulse-timeline-row,
  .pulse-case-page figure[data-fade] .pulse-timeline-legend {
    opacity: 0;
  }
  .pulse-case-page figure[data-fade].is-visible .pulse-timeline::before {
    animation: pAssembleGrow 1s var(--ease-silk) forwards;
    animation-delay: 260ms;
  }
  .pulse-case-page .pulse-timeline-row:nth-child(1) { --rd: 0ms; }
  .pulse-case-page .pulse-timeline-row:nth-child(2) { --rd: 78ms; }
  .pulse-case-page .pulse-timeline-row:nth-child(3) { --rd: 156ms; }
  .pulse-case-page .pulse-timeline-row:nth-child(4) { --rd: 234ms; }
  .pulse-case-page .pulse-timeline-row:nth-child(5) { --rd: 312ms; }
  .pulse-case-page .pulse-timeline-row:nth-child(6) { --rd: 390ms; }
  .pulse-case-page .pulse-timeline-row:nth-child(7) { --rd: 468ms; }
  .pulse-case-page .pulse-timeline-row:nth-child(8) { --rd: 546ms; }
  .pulse-case-page .pulse-timeline-row:nth-child(9) { --rd: 624ms; }
  .pulse-case-page .pulse-timeline-row:nth-child(10) { --rd: 702ms; }
  .pulse-case-page figure[data-fade].is-visible .pulse-timeline-row {
    animation: pAssembleRise 0.6s var(--ease-silk) forwards;
    animation-delay: calc(400ms + var(--rd, 0ms));
  }
  .pulse-case-page figure[data-fade].is-visible .pulse-timeline-legend {
    animation: pAssembleDrop 0.58s var(--ease-silk) forwards;
    animation-delay: 1240ms;
  }

  /* roles hub — the base bar drops, stems extend down, chips rise */
  .pulse-case-page figure[data-fade] .pflow-hub-bar { opacity: 0; transform: translateY(-8px); }
  .pulse-case-page figure[data-fade] .pflow-hub-stem { transform: scaleY(0); transform-origin: top; }
  .pulse-case-page figure[data-fade] .pflow-hub-chip { opacity: 0; transform: translateY(12px); }
  .pulse-case-page figure[data-fade].is-visible .pflow-hub-bar {
    animation: pAssembleDrop 0.58s var(--ease-spring) forwards;
    animation-delay: 280ms;
  }
  .pulse-case-page figure[data-fade].is-visible .pflow-hub-stem {
    animation: pAssembleGrow 0.48s var(--ease-silk) forwards;
    animation-delay: 500ms;
  }
  .pulse-case-page figure[data-fade].is-visible .pflow-hub-chip {
    animation: pAssembleRise 0.6s var(--ease-spring) forwards;
    animation-delay: 700ms;
  }

  /* approval + CI chains — cells and links rise left to right */
  .pulse-case-page figure[data-fade] .pulse-chain-cell,
  .pulse-case-page figure[data-fade] .pulse-chain-link { opacity: 0; }
  .pulse-case-page .pulse-chain-row > :nth-child(1) { --nd: 0ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(2) { --nd: 150ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(3) { --nd: 300ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(4) { --nd: 450ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(5) { --nd: 600ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(6) { --nd: 750ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(7) { --nd: 900ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(8) { --nd: 1050ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(9) { --nd: 1200ms; }
  .pulse-case-page figure[data-fade].is-visible .pulse-chain-cell {
    animation: pAssembleRise 0.6s var(--ease-spring) forwards;
    animation-delay: calc(280ms + var(--nd, 0ms));
  }
  .pulse-case-page figure[data-fade].is-visible .pulse-chain-link {
    animation: pAssembleDrop 0.5s var(--ease-silk) forwards;
    animation-delay: calc(280ms + var(--nd, 0ms));
  }
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

  return (
    <article className="case-study-page pulse-case-page" data-has-cover="false">
      <style
        dangerouslySetInnerHTML={{
          __html: stripCssComments(pulseCss + ICUE_CSS),
        }}
      />
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
                      <em className="pulse-fig">Fig. 03</em>The bet &mdash;
                      the style pass made six efforts rhyme; it was a look,
                      not a system
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
                      <span>brand rules &middot; written day one</span>
                    </header>
                    <div className="pulse-kv">
                      {brandRules.map(([rule, deal]) => (
                        <div className="pulse-kv-row" key={rule}>
                          <span>{rule}</span>
                          <em>{deal}</em>
                        </div>
                      ))}
                    </div>
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
                      the generation ladder &mdash; each hue has one job; they
                      light in order as you arrive
                    </p>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 04</em>Few rules, firmly
                      held &mdash; color appears only when it means something
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
                      <em className="pulse-fig">Fig. 08</em>Engineer my own
                      page, then ask engineering
                    </span>
                  </figcaption>
                </figure>
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
                <figure className="pulse-inset-medium" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>the rescue &middot; one pipeline</span>
                    </header>
                    <div
                      className="pflow"
                      role="img"
                      aria-label="Four stages: unify the surface, engineer file by file, migrate toward one stack, merge into one app. Under the migrate stage a repair loop: AI broke hover states, animations, and layout in transit and produced dead code — every page was repaired by hand against its original."
                    >
                      <div
                        className="pflow-grid"
                        aria-hidden="true"
                        style={{
                          gridTemplateColumns:
                            "minmax(0, 1fr) 28px minmax(0, 1fr) 28px minmax(0, 1fr) 28px minmax(0, 1fr)",
                        }}
                      >
                        <span className="pflow-node is-cyan">Unify</span>
                        <span className="pflow-line is-cyan" />
                        <span className="pflow-node is-purple">Engineer</span>
                        <span className="pflow-line is-amber" />
                        <span className="pflow-node is-amber">Migrate</span>
                        <span className="pflow-line is-green" />
                        <span className="pflow-node is-green">Merge</span>
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                        <span
                          className="pflow-loop"
                          style={{ gridColumn: "5 / 6" }}
                        />
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                      </div>
                      <p className="pflow-note is-amber is-center" aria-hidden="true">
                        <i>↺</i>AI broke hover &middot; animation &middot;
                        layout &middot; dead code &mdash; repaired by hand
                        against the original
                      </p>
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 09</em>AI carried the
                      bulk; the fidelity was hand work
                    </span>
                  </figcaption>
                </figure>
                <figure className="pulse-section-full" data-fade>
                  {/* 824/five-weeks live in the hero console only (audit:
                      the stat was stated twice) — this row keeps the two
                      numbers the commit stream itself is about */}
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
                      <em className="pulse-fig">Fig. 10</em>The commit stream,
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
                      <em className="pulse-fig">Fig. 11</em>The canonical
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
                      <em className="pulse-fig">Fig. 12</em>The full registry
                      &mdash; 40 components, each its own folder over shared
                      tokens
                    </span>
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
                      <em className="pulse-fig">Fig. 13</em>The CI guard checks
                      &mdash; inventory, tokens, and hand-edits, reconciled on
                      every merge
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

      {/* ── 07 · The skills ── */}
      {skills && (
        <section className="case-chapter pulse-chapter" data-act="6">
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
                      <em className="pulse-fig">Fig. 14</em>The repetition
                      loop a skill deletes
                    </span>
                  </figcaption>
                </figure>
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
                      <em className="pulse-fig">Fig. 15</em>The rules, made
                      loadable &mdash; on-system by construction, not by repair
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
                        <i>↺</i>drift found &rarr; edit the md &mdash; the
                        floor rises for everything after
                      </p>
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 16</em>Harness control
                      &mdash; the feedback loop that stays
                    </span>
                  </figcaption>
                </figure>
                <figure className="pulse-section-full" data-fade>
                  <div className="pulse-timeline">
                    {milestones.map((m) => (
                      <div
                        className={`pulse-timeline-row${m.mine ? "" : " is-team"}`}
                        key={m.title}
                      >
                        <span className="pulse-timeline-date">{m.date}</span>
                        <i className="pulse-timeline-node" aria-hidden="true" />
                        <div className="pulse-timeline-body">
                          <strong>{m.title}</strong>
                          <span>
                            <em className="pulse-timeline-when">
                              {m.date} &middot;{" "}
                            </em>
                            {m.note}
                          </span>
                        </div>
                      </div>
                    ))}
                    <p className="pulse-timeline-legend" aria-hidden="true">
                      <i /> my work
                      <i className="is-team" /> teammate / team
                    </p>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 17</em>Build timeline
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
                      <em className="pulse-fig">Fig. 18</em>The component
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
                      <em className="pulse-fig">Fig. 19</em>The sliced Figma
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
                      <em className="pulse-fig">Fig. 20</em>The package&rsquo;s
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
                      <em className="pulse-fig">Fig. 21</em>The playground
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
                      <em className="pulse-fig">Fig. 22</em>The real
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
                    <div
                      className="pflow-hub"
                      role="img"
                      aria-label="One base — the tokens and 40 components — read four ways: design reads the live preview and Figma boards, engineering reads the typed package and contracts, ML reads the editable data states, product reads one runnable flow."
                    >
                      <div className="pflow-hub-bar" aria-hidden="true">
                        One base &mdash; tokens + 40 components
                      </div>
                      {hubRoles.map(([role]) => (
                        <span
                          className="pflow-hub-stem"
                          key={`stem-${role}`}
                          aria-hidden="true"
                        />
                      ))}
                      {hubRoles.map(([role, reads]) => (
                        <div
                          className="pflow-hub-chip"
                          key={role}
                          aria-hidden="true"
                        >
                          <strong>{role}</strong>
                          <span>{reads}</span>
                        </div>
                      ))}
                    </div>
                    <p className="pulse-spec-foot">
                      integration stopped being a rescue
                    </p>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 23</em>The interface,
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
                      <em className="pulse-fig">Fig. 24</em>The unified Pulse
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
                      <em className="pulse-fig">Fig. 25</em>Two more pages of
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
                      <em className="pulse-fig">Fig. 26</em>Onboarding &mdash;
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
                        <em className="pulse-fig">Fig. 27</em>The Creative
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
                        <em className="pulse-fig">Fig. 28</em>Chat contract
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
                      <em className="pulse-fig">Fig. 29</em>Approval chain
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
            {product.sections[3] && (
              <div className="pulse-section">
                <SectionProse section={product.sections[3]} />
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
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 30</em>Same brief, rebuilt
                      &mdash; a browse-first Campaign Library became a
                      decision-first Overview
                    </span>
                  </figcaption>
                </figure>
                <figure className="pulse-inset-medium" data-fade>
                  <div className="pulse-card pulse-specpad">
                    <header className="pulse-spec-head">
                      <span>the intake &middot; then the base</span>
                    </header>
                    <div
                      className="pflow"
                      role="img"
                      aria-label="The campaign page went from a vibe-coded intake — one four-thousand-line HTML file with inline styles, base64 images and no system — to a rebuild on the base: shared tokens and components, ten CSS modules and fifteen JS component modules, consuming three design-system components directly."
                    >
                      <div
                        className="pflow-grid"
                        aria-hidden="true"
                        style={{
                          gridTemplateColumns:
                            "minmax(0, 1fr) 32px minmax(0, 1fr)",
                        }}
                      >
                        <span className="pflow-node is-amber">
                          The intake
                          <em>one 4,000-line file &middot; inline &middot; base64 &middot; no system</em>
                        </span>
                        <span className="pflow-line is-amber" />
                        <span className="pflow-node is-green">
                          On the base
                          <em>shared tokens + 10 CSS &middot; 15 JS modules &middot; 3 DS components</em>
                        </span>
                      </div>
                      <p className="pflow-note is-green is-center" aria-hidden="true">
                        <i>✓</i>207 commits over ~2.5 weeks &mdash; a picture
                        refined into a handoff-ready product
                      </p>
                    </div>
                  </div>
                  <figcaption className="pulse-fig-caption">
                    <span>
                      <em className="pulse-fig">Fig. 31</em>The refinement, in
                      the build &mdash; monolith to modular, on the design
                      system
                    </span>
                  </figcaption>
                </figure>
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
                <em className="pulse-fig">Fig. 32</em>Create-with-AI &mdash;
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
      <CaseNext slug={project.slug} />
    </article>
  );
}
