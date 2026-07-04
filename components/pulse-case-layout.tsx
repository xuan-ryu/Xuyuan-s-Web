import Image from "next/image";
import Link from "next/link";
import { adjacent, type CaseSection, type Project } from "@/data/projects";

// Pulse — "the design system documents itself." A printed specimen document:
// the page typesets Pulse's real tokens as ink-and-hairline specimen sheets on
// the portfolio's paper. The specimen values below reflect the project's actual
// design system — the token set, type scale, spacing rhythm, and component
// inventory are the ones I shipped, not invented. The build timeline is my own
// account of how the work happened; screenshots are real captures of the
// prototype's static file:// surfaces (public/media/work/pulse/). Confidential
// details (exact package identity, teammate names, internal filenames, and
// commit hashes) are deliberately kept off the public page.
//
// Narrative arc (standard case-study structure, owner-sanctioned restructure):
//   hero (token sheet) → overview (scope + figures ledger) →
//   01 context (the team situation) → 02 Act I · the system →
//   03 Act II · the product → 04 Act III · the rescue →
//   the belief (ink band, the one seal-red moment) → closer.
// Chapter copy lives in data/projects.ts; this layout attaches the specimen
// figures positionally. Scoped styles only (.pulse-*), sibling-case precedent.
// Case accent (--case-accent, --case-detail, owner rule 2026-07-05) is Pulse's
// own cyan — the same #49e0f5 / 700-stop shown in the Fig. 01 chips and Fig.
// 02 "ready" ramp — carrying the page's own rule marks and figure/date
// labels. The seal-red human-gate stamp stays the page's one red moment.

// ── Specimen data (traced to the Pulse system source) ──────────────────────

// Six semantic base colors — tokens.css --color-* (role semantics from the
// component-library "Keep color meanings separate" rule).
const tokenChips = [
  { hex: "#49e0f5", role: "ready" },
  { hex: "#43ba51", role: "positive" },
  { hex: "#3987f3", role: "scheduled" },
  { hex: "#f19a08", role: "risk" },
  { hex: "#6366f1", role: "in progress" },
  { hex: "#ef4444", role: "decline" },
];

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

// Component inventory — 37 real names from the Pulse component registry
// (the component index, shipped component sources + placeable slices).
// The registry holds a few more tab variants, so the sheet is labeled
// "inventory, abridged" — names are never invented.
const inventory = [
  "Icon",
  "Button",
  "ButtonPrimary",
  "ButtonSecondary",
  "ButtonGhost",
  "ButtonDanger",
  "IconButton",
  "Card",
  "MetricCard",
  "ActionCard",
  "MediaCard",
  "EmptyCard",
  "ErrorCard",
  "Grid",
  "Sidebar",
  "SegmentedTabs",
  "PageNavTabs",
  "SignalSeverityTabs",
  "StatusPill",
  "PlatformBadge",
  "SignalRow",
  "SignalCard",
  "DataTable",
  "LineChart",
  "ComboChart",
  "HorizontalBarChart",
  "VerticalBarChart",
  "FunnelChart",
  "ScoreGauge",
  "StatList",
  "Modal",
  "ConfirmBar",
  "AIPanel",
  "PostChip",
  "ApprovalChain",
  "NodeGenerationMap",
  "PlatformPreview",
];

// Workspace surfaces — enumerated in the project copy (Act II, section 1).
const surfaces = [
  "Home",
  "Calendar",
  "Signal",
  "Analytics",
  "Strategy",
  "Campaigns",
  "Studio",
];

// The Create-with-AI flow — enumerated in the project's moment.body and
// Act III copy. Human checkpoints are the page's one seal-red moment.
const gateSteps = [
  { label: "Goal", note: "a goal and an optional note", human: false },
  { label: "Assets", note: "uploaded or picked from the brand vault", human: false },
  { label: "Brief", note: "editable fields, budget shown", human: true },
  { label: "Generate", note: "runs only after the brief is approved", human: false },
  { label: "Review", note: "content gate signs off the creative", human: true },
  { label: "Publish", note: "a person releases — always", human: true },
];

// Creative Brief fields — the field list from moment.body / Act III copy;
// values are specimen sample data (clearly illustrative, brand-neutral).
const briefFields = [
  { label: "Audience", value: "Urban runners, 18–29, early-morning crews", editing: false },
  { label: "Key message", value: "City miles before the city wakes", editing: true },
  { label: "Content direction", value: "Short-form video · street-level POV", editing: false },
  { label: "Tone", value: "Confident, unhurried", editing: false },
  { label: "Visual style", value: "Natural light, muted brand palette", editing: false },
];

// Figures ledger — the project's own numbers (summary, chapters). The
// five-week figure matches the repo's git log (2026-05-30 → 2026-07-02).
const ledger: Array<[string, string]> = [
  ["5", "week build"],
  ["37", "components"],
  ["6", "semantic ramps"],
  ["2", "approval gates"],
  ["1", "publish rule"],
];

// ── Build timeline (Act I). My own account of how the work happened,
//    over roughly five weeks. Eight milestones carry the arc; two of them
//    were a teammate's or the team's work, and their notes say so. General
//    timeframes only — no commit hashes, no names. ──
const milestones = [
  {
    date: "Late May",
    title: "Day one: a prototype and a system, together",
    note: "The first thing I shipped was a complete single-file prototype — and, sitting beside it, the first design-system page. The system was explored as code before any process asked for one.",
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
    note: "As the surfaces adopted the system, the parallel copies the styles had drifted into collapsed back to one — 1,905 verified-dead lines removed.",
  },
];

// Truth-source map — my own restatement of the rule: one place owns each
// layer, and everything downstream reads from it (no private filenames).
const truthRows: Array<[string, string]> = [
  ["tokens", "one shared token sheet"],
  ["component", "its own source folder"],
  ["inventory", "the component index"],
  ["preview", "the live preview page"],
  ["figma board", "the single-file Figma board"],
];

// Package plate — genericized: the story (typed React wrappers on a private
// registry, styles synced from the canonical CSS) with nothing that would
// identify the exact package, version, or registry.
const plateRows: Array<[string, string]> = [
  ["package", "internal, typed React set"],
  ["distribution", "private registry"],
  ["authored", "typed JSX wrappers"],
  ["peer", "react ≥ 18"],
  ["styles", "synced from the canonical CSS"],
];

// Screenshots — captured from the project's static file:// surfaces
// (1440×1000). All seven live in public/media/work/pulse/.
const SHOT_W = 1440;
const SHOT_H = 1000;

// ── Microcopy set once here. ─────────────────────────────────────────────────
// The belief band's claim — a condensation of moment.title.
const turnClaim =
  "The decision wasn’t how much AI can do — it was where a human must stay.";
// The publish guardrail — verbatim project rule, typeset once as an artifact
// under Act III section 2 (deliberately absent from that section's body copy).
const guardrail = "AI can draft and schedule. A person releases to publish.";
const guardrailNote =
  "The guardrail is independent of the gates, so turning approvals off never lets an agent publish on its own.";

const pulseCss = `
/* ── Pulse case page — printed specimen document ─────────────────────────
   Grid: the existing work shell (max 1440, 12 cols, --work-gutter margins,
   --work-grid-gap gutters). Three standing rails: metadata cols 1-3, prose
   cols 4-8, artifacts cols 9-12; full figures span all 12. One full-bleed
   ink band; one seal-red moment (the human-gate stamps). */
.pulse-case-page {
  /* Pulse product values, used ONLY inside specimen frames */
  --pp-ground: #f4f7f7;
  --pp-ink: #1d1d1f;
  --pp-text-2: #5f6369;
  --pp-text-4: #8a8e95;
  --pp-line: rgba(29, 29, 31, 0.08);
  --pp-cyan-dark: #0d7685;
  --pp-cyan-soft: #e5fbff;
  --pp-cyan-ring: rgba(73, 224, 245, 0.42);

  /* Case accent — Pulse's own cyan (owner rule 2026-07-05: case pages derive
     their accent from their own project, not the site's gold). --case-accent
     is the product's real primary/interactive color, #49e0f5 — the same hex
     drawn in the Fig. 01 token chips and the Fig. 02 "ready" ramp's base
     stop — used here only for the page's own rule marks (the pp-* values
     above stay reserved for the product-frame specimens). --case-detail
     reuses the same ramp's 700/"text" stop (== --pp-cyan-dark, already the
     product's own on-paper accent-text color in Fig. 14/16) for the
     figure-index and timeline-date labels, since raw #49e0f5 fails AA
     contrast as small text on paper. */
  --case-accent: #49e0f5;
  --case-detail: var(--pp-cyan-dark);

  /* dark-band hairline (DESIGN.md) */
  --pulse-rule-dark: rgba(255, 255, 255, 0.28);
}
.pulse-case-page p {
  text-wrap: pretty;
}
.pulse-case-page figure {
  margin: 0;
}
/* one shared stagger contract: children opt in via --d */
.pulse-case-page [data-fade].is-visible {
  animation-delay: var(--d, 0ms);
}

/* ── Hero: title band + token sheet (the project visible in viewport 1) ── */
.pulse-case-page .case-study-hero h1 {
  grid-column: 4 / 10;
  grid-row: 1;
  align-self: start;
  font-family: var(--font-condensed);
  font-weight: 300;
  letter-spacing: var(--track-display);
  text-transform: uppercase;
  line-height: 0.9;
}
.pulse-case-page .case-hero-lede {
  grid-column: 4 / 9;
  grid-row: 2;
  max-width: 60ch;
}
.pulse-token-sheet {
  grid-column: 10 / -1;
  grid-row: 1 / span 3;
  align-self: start;
  box-sizing: border-box;
  border: 1px solid var(--work-rule);
  background: var(--paper-warm);
  padding: clamp(16px, 1.4vw, 22px);
}
.pulse-spec-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.48);
}
.pulse-fig {
  font-style: normal;
  color: var(--case-detail);
  /* JSX collapses the space after the inline em — restore the gap here */
  margin-right: 0.65em;
}
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
  font-family: var(--font-mono);
  font-size: 10px;
  color: rgba(5, 5, 5, 0.48);
  transition: color 0.25s var(--ease-silk);
}
.pulse-spec-chip:hover span {
  color: var(--ink-950);
}
.pulse-spec-type {
  margin-top: 18px;
  border-top: 1px solid var(--work-rule);
}
.pulse-spec-type-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid var(--work-rule);
}
.pulse-spec-type-row strong {
  /* the product's own face inside the frame */
  font-family: var(--font-text);
  font-weight: 600;
  line-height: 1;
  color: var(--pp-ink);
}
.pulse-spec-type-row span {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: rgba(5, 5, 5, 0.48);
}
.pulse-spec-ruler {
  margin-top: 16px;
}
.pulse-spec-ruler-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.48);
}
.pulse-spec-ruler-track {
  position: relative;
  height: 26px;
  margin-top: 8px;
  border-top: 1px solid rgba(5, 5, 5, 0.38);
}
.pulse-spec-ruler-track i {
  position: absolute;
  top: -1px;
  width: 1px;
  height: 7px;
  background: rgba(5, 5, 5, 0.38);
}
.pulse-spec-ruler-track i em {
  position: absolute;
  top: 9px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 10px;
  color: rgba(5, 5, 5, 0.48);
}
/* sheet entrance stagger */
.pulse-token-sheet > :nth-child(2) { --d: 60ms; }
.pulse-token-sheet > :nth-child(3) { --d: 120ms; }
.pulse-token-sheet > :nth-child(4) { --d: 180ms; }

/* ── Summary + figures ledger ───────────────────────────────────────────── */
.pulse-ledger {
  grid-column: 11 / -1;
  align-self: start;
  border-top: 1px solid var(--case-accent);
}
.pulse-ledger > div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid var(--work-rule);
}
.pulse-ledger strong {
  font-family: var(--font-mono);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1;
  color: var(--ink-950);
}
.pulse-ledger span {
  font-size: var(--text-label);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.48);
  text-align: right;
}

/* ── The Belief: the one full-bleed ink band (reflective climax; sits
      between Act III and the closer, so it gets act-level breathing room
      above and clears the closer's hairline below) ─────────────────────── */
.pulse-turn {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  margin: clamp(118px, 14vw, 214px) auto clamp(76px, 8vw, 124px);
  padding: clamp(96px, 10vw, 150px) var(--work-gutter);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  row-gap: clamp(26px, 3vw, 42px);
  background: var(--ink-950);
  color: var(--paper);
  /* full-bleed within the centered shell (sibling-case precedent) */
  box-shadow: 0 0 0 100vmax var(--ink-950);
  clip-path: inset(0 -100vmax);
}
.pulse-turn-eyebrow {
  grid-column: 1 / 4;
  margin: 0;
  font-size: var(--text-label);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.pulse-turn-claim {
  grid-column: 1 / 8;
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-heading);
  font-weight: 400;
  line-height: 1.18;
  letter-spacing: 0;
  color: var(--paper);
}
.pulse-turn-copy {
  grid-column: 1 / 7;
}
.pulse-turn-copy p {
  margin: 0;
  max-width: 60ch;
  font-size: var(--text-body);
  line-height: 1.62;
  color: rgba(255, 255, 255, 0.72);
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
  margin-top: clamp(28px, 3.4vw, 54px);
  padding-top: 10px;
}
.pulse-spine::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 20px;
  height: 1px;
  background: var(--pulse-rule-dark);
}
.pulse-spine-step {
  position: relative;
}
/* the flow ends at PUBLISH — mask the hairline past the last node */
.pulse-spine-step:last-child::after {
  content: "";
  position: absolute;
  left: 21px;
  right: 0;
  top: 10px;
  height: 1px;
  background: var(--ink-950);
}
.pulse-spine-node {
  position: relative;
  z-index: 1;
  display: block;
  width: 21px;
  height: 21px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  background: var(--ink-950);
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
  color: var(--paper);
}
.pulse-spine-note {
  display: block;
  margin-top: 7px;
  max-width: 22ch;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.55);
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
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: rgba(255, 255, 255, 0.55);
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
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
}
.pulse-spine-legend i.is-stamp {
  border: 0;
  border-radius: 1px;
  background: var(--seal-red);
  margin-left: 14px;
}

/* ── Chapter heads: mono index above the claim (title outweighs index) ──── */
.pulse-chapter-head {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  row-gap: clamp(16px, 1.8vw, 24px);
  padding-top: clamp(118px, 14vw, 214px);
}
.pulse-chapter-index {
  grid-column: 1 / -1;
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: var(--track-eyebrow);
  color: rgba(5, 5, 5, 0.42);
}
.pulse-chapter-claim {
  grid-column: 1 / 11;
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-display-3);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: 0;
  color: var(--ink-950);
  text-wrap: balance;
}
.pulse-chapter-headrule {
  grid-column: 1 / -1;
  height: 1px;
  margin-top: clamp(8px, 1.2vw, 16px);
  background: var(--work-rule);
}

/* ── Chapter sections: tags 1-3 · copy 4-8 · artifact 9-12 ─────────────── */
.pulse-section {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  row-gap: clamp(36px, 4.4vw, 60px);
  align-items: start;
  padding-top: clamp(76px, 8vw, 130px);
}
.pulse-section-tags {
  grid-column: 1 / 4;
  margin: 0;
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.42);
}
.pulse-section-copy {
  grid-column: 4 / 9;
}
.pulse-section-copy h3 {
  margin: 0 0 clamp(18px, 2vw, 28px);
  font-family: var(--font-serif);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.28;
  color: var(--ink-950);
}
.pulse-section-copy p {
  margin: 0;
  max-width: 62ch;
  font-size: var(--text-body);
  line-height: 1.62;
  color: rgba(5, 5, 5, 0.76);
}
.pulse-section-copy p + p {
  margin-top: 22px;
}
.pulse-section-aside {
  grid-column: 9 / -1;
}
.pulse-section-inset {
  grid-column: 4 / -1;
}
.pulse-section-full {
  grid-column: 1 / -1;
}
.pulse-fig-caption {
  margin: 12px 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  line-height: 1.5;
  color: rgba(5, 5, 5, 0.5);
}

/* ── Fig. 02 — semantic color ramps (one row per role) ──────────────────── */
.pulse-ramps {
  border: 1px solid var(--work-rule);
  background: var(--paper-warm);
  padding: clamp(16px, 1.4vw, 22px);
  display: grid;
  row-gap: 12px;
}
.pulse-ramp-row {
  display: grid;
  grid-template-columns: minmax(74px, auto) minmax(0, 1fr) minmax(52px, auto);
  align-items: center;
  column-gap: 12px;
}
.pulse-ramp-row > span {
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.42);
}
.pulse-ramp-stops {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  height: 18px;
  overflow: hidden;
  border-radius: 3px;
}
.pulse-ramp-stops i {
  display: block;
  height: 100%;
}
.pulse-ramp-row > em {
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 10px;
  text-align: right;
  color: rgba(5, 5, 5, 0.48);
}

/* ── Fig. 03 — component inventory (printed index) ──────────────────────── */
.pulse-inventory-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  border-top: 1px solid var(--work-rule);
  border-left: 1px solid var(--work-rule);
}
.pulse-inventory-cell {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
  padding: 13px 14px;
  border-right: 1px solid var(--work-rule);
  border-bottom: 1px solid var(--work-rule);
  transition:
    background 0.25s var(--ease-silk),
    color 0.25s var(--ease-silk);
}
.pulse-inventory-cell i {
  font-family: var(--font-mono);
  font-style: normal;
  font-size: var(--text-micro);
  color: rgba(5, 5, 5, 0.4);
  transition: color 0.25s var(--ease-silk);
}
.pulse-inventory-cell span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-meta);
  color: rgba(5, 5, 5, 0.78);
  transition: color 0.25s var(--ease-silk);
}
.pulse-inventory-cell:not(.is-blank):hover {
  background: var(--ink-950);
}
.pulse-inventory-cell:not(.is-blank):hover i,
.pulse-inventory-cell:not(.is-blank):hover span {
  color: var(--paper);
}

/* ── Fig. 11 — workspace anatomy (surfaces row) ─────────────────────────── */
.pulse-surfaces-grid {
  display: grid;
  grid-template-columns: minmax(42px, 0.35fr) repeat(7, minmax(0, 1fr));
  border: 1px solid var(--work-rule);
}
.pulse-surface-rail {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 12px 6px;
  background: var(--paper-warm);
}
.pulse-surface-rail span {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.45);
}
.pulse-surface-cell {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  min-height: clamp(104px, 10vw, 150px);
  min-width: 0;
  padding: 12px;
  border-left: 1px solid var(--work-rule);
}
.pulse-surface-cell i {
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 10px;
  color: rgba(5, 5, 5, 0.38);
}
.pulse-surface-cell span {
  font-size: var(--text-label);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.66);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Product artifacts (Pulse UI keeps its own colors inside frames) ────── */
.pulse-artifact {
  overflow: hidden;
  border: 1px solid var(--work-rule);
  border-radius: var(--radius-media);
  background: var(--pp-ground);
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
.pulse-brief-caret {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin-left: 2px;
  vertical-align: -0.15em;
  background: var(--pp-ink);
}
@media (prefers-reduced-motion: no-preference) {
  .pulse-brief-caret {
    animation: pulseCaret 1.1s steps(2, end) infinite;
  }
}
@keyframes pulseCaret {
  50% {
    opacity: 0;
  }
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
  color: var(--pp-text-2);
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

/* ── Fig. 15 — approval chain ───────────────────────────────────────────── */
.pulse-chain-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: center;
  column-gap: 0;
}
.pulse-chain-cell {
  display: grid;
  gap: 6px;
  padding: clamp(14px, 1.4vw, 20px);
  border: 1px solid var(--work-rule);
  background: var(--paper);
}
.pulse-chain-cell i {
  font-family: var(--font-mono);
  font-style: normal;
  font-size: var(--text-micro);
  color: rgba(5, 5, 5, 0.4);
}
.pulse-chain-cell strong {
  font-size: var(--text-meta);
  font-weight: 500;
  color: var(--ink-950);
}
.pulse-chain-sla {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  color: rgba(5, 5, 5, 0.5);
}
.pulse-chain-sla::before,
.pulse-chain-sla::after {
  content: "";
  width: clamp(10px, 1.4vw, 22px);
  height: 1px;
  background: var(--work-rule);
}

/* ── The guardrail — set once; the rule is ink ──────────────────────────── */
.pulse-guardrail {
  margin-top: clamp(4px, 0.8vw, 10px);
  padding-left: clamp(18px, 2vw, 28px);
  border-left: 2px solid var(--ink-950);
}
.pulse-guardrail-claim {
  margin: 0;
  max-width: 34ch;
  font-family: var(--font-serif);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.32;
  color: var(--ink-950);
}
.pulse-guardrail-note {
  margin: 12px 0 0;
  max-width: 56ch;
  font-size: var(--text-meta);
  line-height: 1.55;
  color: rgba(5, 5, 5, 0.55);
}

/* ── Fig. 16 — chat contract specimen ───────────────────────────────────── */
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
  font-family: var(--font-mono);
  font-size: 11px;
  color: rgba(29, 29, 31, 0.52);
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

/* ── Fig. 10 — build timeline (milestone narrative, closes Act I) ───────── */
.pulse-log {
  border-top: 1px solid var(--case-accent);
}
.pulse-log-row {
  display: grid;
  grid-template-columns: minmax(96px, 120px) minmax(0, 1.1fr) minmax(0, 1fr);
  column-gap: var(--work-grid-gap);
  align-items: baseline;
  padding: 14px 0;
  border-bottom: 1px solid var(--work-rule);
}
.pulse-log-row p {
  margin: 0;
}
.pulse-log-date {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.04em;
  white-space: nowrap;
  /* static case-accent detail — the timeframe markers along the spine */
  color: var(--case-detail);
}
.pulse-log-subject {
  font-size: var(--text-meta);
  line-height: 1.5;
  color: var(--ink-950);
}
.pulse-log-note {
  font-size: var(--text-meta);
  line-height: 1.5;
  color: rgba(5, 5, 5, 0.55);
}

/* ── Act I — typeset doc specimens (truth table, npm plate) ─────────────── */
.pulse-spec-card {
  box-sizing: border-box;
  border: 1px solid var(--work-rule);
  background: var(--paper-warm);
  padding: clamp(16px, 1.4vw, 22px);
}
.pulse-truth-epigraph {
  margin: 14px 0 2px;
  font-family: var(--font-serif);
  font-size: var(--text-meta);
  line-height: 1.5;
  color: var(--ink-950);
}
.pulse-kv {
  margin-top: 12px;
  border-top: 1px solid var(--work-rule);
}
.pulse-kv-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid var(--work-rule);
}
.pulse-kv-row span {
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  color: rgba(5, 5, 5, 0.42);
}
.pulse-kv-row em {
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 11px;
  text-align: right;
  overflow-wrap: anywhere;
  color: rgba(5, 5, 5, 0.72);
}
.pulse-spec-foot {
  margin: 12px 0 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: rgba(5, 5, 5, 0.48);
}

/* ── Context — doc quote (same grammar as the guardrail) ────────────────── */
.pulse-doc-quote {
  margin-top: clamp(4px, 0.8vw, 10px);
  padding-left: clamp(18px, 2vw, 28px);
  border-left: 2px solid var(--ink-950);
}
.pulse-doc-quote blockquote {
  margin: 0;
  max-width: 46ch;
  font-family: var(--font-serif);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.32;
  color: var(--ink-950);
}
.pulse-doc-quote figcaption {
  margin-top: 12px;
  max-width: 56ch;
  font-size: var(--text-meta);
  line-height: 1.55;
  color: rgba(5, 5, 5, 0.55);
}

/* ── Screenshot frames (product keeps its colors inside) ────────────────── */
.pulse-shot {
  overflow: hidden;
  border: 1px solid var(--work-rule);
  border-radius: var(--radius-media);
  background: var(--paper-warm);
}
.pulse-shot img {
  display: block;
}
.pulse-shot-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--work-grid-gap);
}

/* ── Adjacent case — quiet close ────────────────────────────────────────── */
.pulse-next {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  margin: 0 auto;
  padding: clamp(56px, 6vw, 84px) var(--work-gutter);
  border-top: 1px solid var(--work-rule);
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
  color: rgba(5, 5, 5, 0.48);
}
.pulse-next-link {
  grid-column: 4 / 10;
  justify-self: start;
  text-decoration: none;
  color: var(--ink-950);
}
.pulse-next-link:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
.pulse-next-title {
  font-family: var(--font-serif);
  font-size: var(--text-heading);
  font-weight: 400;
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
  .pulse-token-sheet {
    grid-column: 3 / -1;
    grid-row: auto;
    max-width: 480px;
  }
  .pulse-spec-chips {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
  .pulse-ledger {
    grid-column: 3 / -1;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
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
  .pulse-turn-claim {
    grid-column: 1 / -1;
  }
  .pulse-turn-copy {
    grid-column: 1 / -1;
  }
  .pulse-chapter-claim {
    grid-column: 1 / -1;
  }
  .pulse-section {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
  .pulse-section-tags {
    grid-column: 1 / 3;
  }
  .pulse-section-copy,
  .pulse-section-aside,
  .pulse-section-inset {
    grid-column: 3 / -1;
  }
  .pulse-section-full {
    grid-column: 1 / -1;
  }
  .pulse-inventory-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .pulse-spec-card {
    max-width: 480px;
  }
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
  .pulse-token-sheet {
    grid-column: 1;
  }
  .pulse-token-sheet {
    max-width: none;
  }
  .pulse-spec-chips {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .pulse-ledger {
    grid-column: 1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .pulse-turn {
    grid-template-columns: minmax(0, 1fr);
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
  .pulse-chapter-head {
    grid-template-columns: minmax(0, 1fr);
  }
  .pulse-chapter-index,
  .pulse-chapter-claim,
  .pulse-chapter-headrule {
    grid-column: 1;
  }
  .pulse-section {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 30px;
  }
  .pulse-section-tags,
  .pulse-section-copy,
  .pulse-section-aside,
  .pulse-section-inset,
  .pulse-section-full {
    grid-column: 1;
  }
  .pulse-inventory-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .pulse-inventory-cell span {
    white-space: normal;
    overflow-wrap: break-word;
  }
  .pulse-surfaces-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .pulse-surface-rail {
    grid-column: 1 / -1;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid var(--work-rule);
  }
  .pulse-surface-rail span {
    writing-mode: horizontal-tb;
    transform: none;
  }
  .pulse-surface-cell {
    min-height: 84px;
  }
  .pulse-surface-cell:nth-child(2n) {
    border-left: 0;
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
  .pulse-spec-card {
    max-width: none;
  }
  .pulse-shot-pair {
    grid-template-columns: minmax(0, 1fr);
  }
  .pulse-chain-row {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0;
  }
  .pulse-chain-sla {
    padding: 10px 0;
  }
  .pulse-chain-sla::before,
  .pulse-chain-sla::after {
    width: 12px;
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

/* ── Reduced motion: render final state; kill scoped loops ──────────────── */
@media (prefers-reduced-motion: reduce) {
  .pulse-case-page [data-fade] {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .pulse-spine-step .pulse-spine-node,
  .pulse-brief-caret {
    animation: none !important;
    opacity: 1;
    transform: none;
  }
  .pulse-inventory-cell,
  .pulse-inventory-cell i,
  .pulse-inventory-cell span,
  .pulse-spec-chip span {
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

// Section prose: tags rail (cols 1-3) + heading and body (cols 4-8).
// Figures attach after this, per section, in the caller.
function SectionProse({ section }: { section: CaseSection }) {
  return (
    <>
      <p className="pulse-section-tags" data-fade>
        {section.tags}
      </p>
      <div className="pulse-section-copy" data-fade>
        <h3>{section.heading}</h3>
        {section.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </>
  );
}

export function PulseCaseLayout({ project }: { project: Project }) {
  const meta = [
    ["Role", project.role],
    ["Duration", project.duration],
    ["Type", project.type],
    ["Teams", project.teams],
  ];
  // The four-beat arc from data/projects.ts:
  // context → Act I (system) → Act II (product) → Act III (rescue).
  const [ctx, actSystem, actProduct, actRescue] = project.chapters ?? [];
  const moment = project.moment;
  const neighbors = adjacent(project.slug);
  const next = neighbors.next ?? neighbors.prev;
  const inventoryFillers = (6 - (inventory.length % 6)) % 6;

  return (
    <article className="case-study-page pulse-case-page" data-has-cover="false">
      <style dangerouslySetInnerHTML={{ __html: pulseCss }} />

      {/* ── Hero: H1 + lede + meta rail + token-sheet specimen ── */}
      <section className="case-study-hero" id="header">
        <p className="case-hero-kicker" data-fade>
          Case Study
        </p>
        <h1 data-fade>{project.title}</h1>
        <aside className="pulse-token-sheet" aria-label="Pulse token sheet specimen">
          <header className="pulse-spec-head" data-fade>
            <span>Pulse &middot; token sheet</span>
            <span className="pulse-fig">Fig. 01</span>
          </header>
          <div className="pulse-spec-chips" data-fade>
            {tokenChips.map((chip) => (
              <div className="pulse-spec-chip" key={chip.hex}>
                <i style={{ background: chip.hex }} aria-hidden="true" />
                <span>{chip.hex}</span>
              </div>
            ))}
          </div>
          <div className="pulse-spec-type" data-fade>
            {typeScale.map((row) => (
              <div className="pulse-spec-type-row" key={row.px}>
                <strong style={{ fontSize: row.size }}>Aa</strong>
                <span>
                  {row.px} &middot; {row.role}
                </span>
              </div>
            ))}
          </div>
          <div className="pulse-spec-ruler" data-fade>
            <span className="pulse-spec-ruler-label">spacing &middot; 8-base</span>
            <div className="pulse-spec-ruler-track" aria-hidden="true">
              {spacingTicks.map((v) => (
                <i key={v} style={{ left: `${(v / 48) * 96}%` }}>
                  <em>{v}</em>
                </i>
              ))}
            </div>
          </div>
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
        </aside>
      </section>

      {/* ── 01 · Context — the team situation that made system-first necessary ── */}
      {ctx && (
        <section className="case-chapter pulse-chapter">
          <ChapterHead number={ctx.number} title={ctx.title} />
          {ctx.sections[0] && (
            <div className="pulse-section">
              <SectionProse section={ctx.sections[0]} />
              <figure className="pulse-doc-quote pulse-section-inset" data-fade>
                <blockquote>
                  The audit&rsquo;s finding was blunt: the product and the
                  design system had become two separate worlds &mdash; the app
                  consumed nothing from the system it was meant to stand on.
                </blockquote>
                <figcaption>
                  The single-source audit, late June &mdash; the finding that
                  set the whole convergence in motion.
                </figcaption>
              </figure>
            </div>
          )}
        </section>
      )}

      {/* ── 02 · Act I — the system: canonical layer, standards, consumers ── */}
      {actSystem && (
        <section className="case-chapter pulse-chapter">
          <ChapterHead number={actSystem.number} title={actSystem.title} />

          {/* §1 — one source of truth: ramps + component inventory */}
          {actSystem.sections[0] && (
            <div className="pulse-section">
              <SectionProse section={actSystem.sections[0]} />
              <figure className="pulse-section-aside" data-fade>
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
                <figcaption className="pulse-fig-caption">
                  <em className="pulse-fig">Fig. 02</em> Six semantic ramps, 50
                  &rarr; 700 &mdash; color assigned by role
                </figcaption>
              </figure>
              <figure className="pulse-section-full" data-fade>
                <div className="pulse-inventory-grid">
                  {inventory.map((name, i) => (
                    <div className="pulse-inventory-cell" key={name}>
                      <i>{String(i + 1).padStart(2, "0")}</i>
                      <span>{name}</span>
                    </div>
                  ))}
                  {Array.from({ length: inventoryFillers }).map((_, i) => (
                    <div
                      className="pulse-inventory-cell is-blank"
                      key={`blank-${i}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <figcaption className="pulse-fig-caption">
                  <em className="pulse-fig">Fig. 03</em> Component inventory,
                  abridged &mdash; 37 named sources from the Pulse registry
                </figcaption>
              </figure>
            </div>
          )}

          {/* §2 — standards, CI, adoption: the truth-source table */}
          {actSystem.sections[1] && (
            <div className="pulse-section">
              <SectionProse section={actSystem.sections[1]} />
              <figure className="pulse-section-aside" data-fade>
                <div className="pulse-spec-card pulse-truth">
                  <header className="pulse-spec-head">
                    <span>Single source of truth</span>
                  </header>
                  <p className="pulse-truth-epigraph">
                    The rule I held: before you change anything, make sure
                    you&rsquo;re editing the source &mdash; not a copy of it.
                  </p>
                  <div className="pulse-kv">
                    {truthRows.map(([layer, where]) => (
                      <div className="pulse-kv-row" key={layer}>
                        <span>{layer}</span>
                        <em>{where}</em>
                      </div>
                    ))}
                  </div>
                  <p className="pulse-spec-foot">
                    reconciled by a dependency-free check
                  </p>
                </div>
                <figcaption className="pulse-fig-caption">
                  <em className="pulse-fig">Fig. 04</em> One place owns each
                  layer &mdash; and a check keeps them honest
                </figcaption>
              </figure>
            </div>
          )}

          {/* §3 — the React package (a teammate's packaging; my canonical CSS) */}
          {actSystem.sections[2] && (
            <div className="pulse-section">
              <SectionProse section={actSystem.sections[2]} />
              <figure className="pulse-section-aside" data-fade>
                <div className="pulse-spec-card">
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
                  <em className="pulse-fig">Fig. 05</em> The React package&rsquo;s
                  plate &mdash; an internal wrapper whose styles sync from the
                  canonical CSS at build time
                </figcaption>
              </figure>
              <figure className="pulse-section-full" data-fade>
                <div className="pulse-shot">
                  <Image
                    src="/media/work/pulse/component-preview.png"
                    alt="Pulse HTML Component Preview: category sidebar and the AIPanel component specimen with a live demo"
                    width={SHOT_W}
                    height={SHOT_H}
                    sizes="(max-width: 1080px) 100vw, 1376px"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <figcaption className="pulse-fig-caption">
                  <em className="pulse-fig">Fig. 06</em> The live component
                  browser &mdash; 40 components, one standalone source each; the
                  AIPanel specimen open with its 21 slices
                </figcaption>
              </figure>
              <figure className="pulse-section-inset" data-fade>
                <div className="pulse-shot">
                  <Image
                    src="/media/work/pulse/react-playground.png"
                    alt="Pulse React Component Library playground: AIPanel rendered from the npm package, with copyable usage code"
                    width={SHOT_W}
                    height={SHOT_H}
                    sizes="(max-width: 1080px) 100vw, 1030px"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <figcaption className="pulse-fig-caption">
                  <em className="pulse-fig">Fig. 07</em> The package playground
                  &mdash; the published AIPanel rendered live with copyable
                  usage, itself a static page
                </figcaption>
              </figure>
            </div>
          )}

          {/* §4 — the Figma handoff for non-coding designers */}
          {actSystem.sections[3] && (
            <div className="pulse-section">
              <SectionProse section={actSystem.sections[3]} />
              <figure className="pulse-section-full" data-fade>
                <div className="pulse-shot">
                  <Image
                    src="/media/work/pulse/figma-board-campaign.png"
                    alt="Figma component board: PostChip state matrix and a labeled campaign anatomy map"
                    width={SHOT_W}
                    height={SHOT_H}
                    sizes="(max-width: 1080px) 100vw, 1376px"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <figcaption className="pulse-fig-caption">
                  <em className="pulse-fig">Fig. 08</em> The single-file Figma
                  board &mdash; PostChip states (default, hover, active, keyboard
                  focus) over the campaign anatomy map
                </figcaption>
              </figure>
              <figure className="pulse-section-inset" data-fade>
                <div className="pulse-shot">
                  <Image
                    src="/media/work/pulse/foundations-handbook.png"
                    alt="Pulse design system foundations page with status, scope, accent, and export chips and the section index"
                    width={SHOT_W}
                    height={SHOT_H}
                    sizes="(max-width: 1080px) 100vw, 1030px"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <figcaption className="pulse-fig-caption">
                  <em className="pulse-fig">Fig. 09</em> The foundations
                  handbook &mdash; the brand-facing working spec, its accent
                  rule where cyan takes green&rsquo;s role, and the export path
                  to Figma
                </figcaption>
              </figure>
            </div>
          )}

          {/* §5 — the act's evidence: the build timeline closes Act I */}
          {actSystem.sections[4] && (
            <div className="pulse-section">
              <SectionProse section={actSystem.sections[4]} />
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
                  <em className="pulse-fig">Fig. 10</em> Build timeline &mdash;
                  the milestones that carried the system from prototype to
                  shipped product, late May to early July 2026
                </figcaption>
              </figure>
            </div>
          )}
        </section>
      )}

      {/* ── 03 · Act II — the product: the surfaces the system carried ── */}
      {actProduct && (
        <section className="case-chapter pulse-chapter">
          <ChapterHead number={actProduct.number} title={actProduct.title} />

          {/* §1 — the calm studio: workspace anatomy + Home */}
          {actProduct.sections[0] && (
            <div className="pulse-section">
              <SectionProse section={actProduct.sections[0]} />
              <figure className="pulse-section-inset" data-fade>
                <div className="pulse-surfaces-grid">
                  <div className="pulse-surface-rail" aria-hidden="true">
                    <span>Sidebar</span>
                  </div>
                  {surfaces.map((surface, i) => (
                    <div className="pulse-surface-cell" key={surface}>
                      <i>{String(i + 1).padStart(2, "0")}</i>
                      <span>{surface}</span>
                    </div>
                  ))}
                </div>
                <figcaption className="pulse-fig-caption">
                  <em className="pulse-fig">Fig. 11</em> Workspace anatomy
                  &mdash; one rail, seven surfaces
                </figcaption>
              </figure>
              <figure className="pulse-section-full" data-fade>
                <div className="pulse-shot">
                  <Image
                    src="/media/work/pulse/pulse-app-home.png"
                    alt="Pulse app Home page: workspace sidebar for the Cider demo brand, action-item KPI tiles, content queue, and signals feed"
                    width={SHOT_W}
                    height={SHOT_H}
                    sizes="(max-width: 1080px) 100vw, 1376px"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <figcaption className="pulse-fig-caption">
                  <em className="pulse-fig">Fig. 12</em> The unified Pulse app,
                  Home &mdash; the demo brand&rsquo;s live brief, action items,
                  content queue, signals, and the assistant dock
                </figcaption>
              </figure>
            </div>
          )}

          {/* §2 — demos from disk: the Calendar + Analytics pair */}
          {actProduct.sections[1] && (
            <div className="pulse-section">
              <SectionProse section={actProduct.sections[1]} />
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
                  <em className="pulse-fig">Fig. 13</em> Two more pages of the
                  same static export &mdash; the week-view scheduling Calendar
                  and the weekly Analytics report
                </figcaption>
              </figure>
            </div>
          )}

          {/* §3 — output quality as a full beat (no artifact exists yet;
              the copy carries it) */}
          {actProduct.sections[2] && (
            <div className="pulse-section">
              <SectionProse section={actProduct.sections[2]} />
            </div>
          )}
        </section>
      )}

      {/* ── 04 · Act III — the rescue: the flow rebuilt on the system ── */}
      {actRescue && (
        <section className="case-chapter pulse-chapter">
          <ChapterHead number={actRescue.number} title={actRescue.title} />

          {/* §1 — the Creative Brief flow */}
          {actRescue.sections[0] && (
            <div className="pulse-section">
              <SectionProse section={actRescue.sections[0]} />
              <figure className="pulse-section-aside" data-fade>
                <div className="pulse-artifact">
                  <div className="pulse-brief">
                    <header className="pulse-brief-head">
                      <strong>Creative Brief</strong>
                      <span className="pulse-brief-chip">Drafted by Pulse</span>
                    </header>
                    {briefFields.map((field) => (
                      <div
                        className={`pulse-brief-field${field.editing ? " is-editing" : ""}`}
                        key={field.label}
                      >
                        <span>{field.label}</span>
                        <p>
                          {field.value}
                          {field.editing && (
                            <i className="pulse-brief-caret" aria-hidden="true" />
                          )}
                        </p>
                      </div>
                    ))}
                    <footer className="pulse-brief-foot">
                      <span className="pulse-brief-budget">
                        Est. spend &middot; 320 credits
                      </span>
                      <span className="pulse-brief-approve">Approve brief</span>
                    </footer>
                  </div>
                </div>
                <figcaption className="pulse-fig-caption">
                  <em className="pulse-fig">Fig. 14</em> The Creative Brief &mdash;
                  editable fields inside the chat
                </figcaption>
              </figure>
            </div>
          )}

          {/* §2 — the gates; the guardrail is typeset once, as an artifact */}
          {actRescue.sections[1] && (
            <div className="pulse-section">
              <SectionProse section={actRescue.sections[1]} />
              <figure className="pulse-section-inset" data-fade>
                <div className="pulse-chain-row">
                  <div className="pulse-chain-cell">
                    <i>01</i>
                    <strong>Reviewer</strong>
                  </div>
                  <span className="pulse-chain-sla">SLA 24h</span>
                  <div className="pulse-chain-cell">
                    <i>02</i>
                    <strong>Brand admin</strong>
                  </div>
                  <span className="pulse-chain-sla">SLA 24h</span>
                  <div className="pulse-chain-cell">
                    <i>03</i>
                    <strong>Org owner</strong>
                  </div>
                </div>
                <figcaption className="pulse-fig-caption">
                  <em className="pulse-fig">Fig. 15</em> Approval chain &mdash; SLA
                  timers; escalation never auto-approves
                </figcaption>
              </figure>
              <div className="pulse-guardrail pulse-section-inset" data-fade>
                <p className="pulse-guardrail-claim">{guardrail}</p>
                <p className="pulse-guardrail-note">{guardrailNote}</p>
              </div>
            </div>
          )}

          {/* §3 — craft: the chat contract */}
          {actRescue.sections[2] && (
            <div className="pulse-section">
              <SectionProse section={actRescue.sections[2]} />
              <figure className="pulse-section-aside">
                <div className="pulse-artifact">
                  <div className="pulse-chat">
                    <div className="pulse-chat-turn" data-fade>
                      <p className="pulse-chat-assistant">
                        Draft brief is ready &mdash; audience and tone come from
                        your brand vault.
                      </p>
                      <p className="pulse-chat-note">assistant &middot; plain text, no bubble</p>
                    </div>
                    <div className="pulse-chat-turn" data-fade>
                      <div className="pulse-chat-user">
                        <span>Tighten the key message.</span>
                      </div>
                      <p className="pulse-chat-note is-right">
                        user &middot; ink bubble, right-aligned
                      </p>
                    </div>
                    <div className="pulse-chat-turn" data-fade>
                      <div className="pulse-chat-card">
                        <strong>Creative Brief</strong>
                        <i aria-hidden="true" />
                        <i aria-hidden="true" />
                        <i aria-hidden="true" />
                        <span>Open brief</span>
                      </div>
                      <p className="pulse-chat-note">
                        rich content &middot; a card; inline controls stay flat
                      </p>
                    </div>
                  </div>
                </div>
                <figcaption className="pulse-fig-caption" data-fade>
                  <em className="pulse-fig">Fig. 16</em> Chat contract &mdash; the
                  assistant follows the product component contract
                </figcaption>
              </figure>
            </div>
          )}
        </section>
      )}

      {/* ── The Belief — the reflective climax, after the acts have shown
          the system, the product, and the rescue: the one ink band, with the
          human-gate spine (the page's one seal-red moment) ── */}
      {moment && (
        <section className="pulse-turn" aria-labelledby="pulse-turn-title">
          <p className="pulse-turn-eyebrow" data-fade>
            Most memorable moment
          </p>
          <h2 className="pulse-turn-claim" id="pulse-turn-title" data-fade>
            {turnClaim}
          </h2>
          <div className="pulse-turn-copy" data-fade>
            {/* body[1] retells the Create-with-AI flow — Act III already
                covers it, so the band keeps only the reflection */}
            {[moment.body[0], moment.body[2]].filter(Boolean).map((p) => (
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
              <em className="pulse-fig">Fig. 17</em> Create-with-AI &mdash;
              where a person stays in the loop
            </span>
            <span className="pulse-spine-legend">
              <i aria-hidden="true" /> ai step
              <i className="is-stamp" aria-hidden="true" /> human gate
            </span>
          </footer>
        </section>
      )}

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
