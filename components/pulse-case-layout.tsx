import Image from "next/image";
import Link from "next/link";
import { adjacent, type Project } from "@/data/projects";

// Pulse — "the design system documents itself." A printed specimen document:
// the page typesets Pulse's real tokens as ink-and-hairline specimen sheets on
// the portfolio's paper. Every specimen value below is transcribed from the
// Pulse design-system truth source (design-system/handoff/components/tokens.css
// and design-system/component-library.md in the Pulse repo) — nothing is
// invented. Chapter 03 adds the engineering story: dates, hashes, and quotes
// are transcribed from the repo's git log and docs
// (internal-host/the-product/prototype), and its figures are real captures
// of the project's static file:// surfaces (public/media/pulse/).
// Art-direction spec: scratchpad specs/spec-pulse.json (verdict:
// build-with-adjustments). Scoped styles only (.pulse-*), vicino precedent.

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
// (component-library.md, shipped HTML sources + placeable slice sources).
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

// Workspace surfaces — enumerated in the project copy (chapter 1, section 2).
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
// chapter 2 copy. Human checkpoints are the page's one seal-red moment.
const gateSteps = [
  { label: "Goal", note: "a goal and an optional note", human: false },
  { label: "Assets", note: "uploaded or picked from the brand vault", human: false },
  { label: "Brief", note: "editable fields, budget shown", human: true },
  { label: "Generate", note: "runs only after the brief is approved", human: false },
  { label: "Review", note: "content gate signs off the creative", human: true },
  { label: "Publish", note: "a person releases — always", human: true },
];

// Creative Brief fields — the field list from moment.body / chapter 2 copy;
// values are specimen sample data (clearly illustrative, brand-neutral).
const briefFields = [
  { label: "Audience", value: "Urban runners, 18–29, early-morning crews", editing: false },
  { label: "Key message", value: "City miles before the city wakes", editing: true },
  { label: "Content direction", value: "Short-form video · street-level POV", editing: false },
  { label: "Tone", value: "Confident, unhurried", editing: false },
  { label: "Visual style", value: "Natural light, muted brand palette", editing: false },
];

// Figures ledger — the project's own numbers (summary, chapters). The repo's
// git log runs 2026-05-30 → 2026-07-02, so "2 week sprint" is superseded by
// the five-week figure (see the render-filter below).
const ledger: Array<[string, string]> = [
  ["5", "week build"],
  ["37", "components"],
  ["6", "semantic ramps"],
  ["2", "approval gates"],
  ["1", "publish rule"],
];

// data/projects.ts still says "an intensive two-week sprint"; the git log
// (2026-05-30 → 2026-07-02) says five weeks. Render-filtered here until the
// orchestrator's batched copy pass lands in data/projects.ts.
const filterSummary = (p: string) =>
  p.replace("Over an intensive two-week sprint", "Over five intensive weeks");

// ── Chapter 03 — the engineering story. Every date, hash, count, and quote
//    below is transcribed from the Pulse repo (git log, internal-doc,
//    ds-single-source-migration.md, packages/react) — nothing is invented. ──

// Commit ledger — subjects quoted verbatim from the repo log. Rows 2 and 7
// are teammates' commits; their notes say so.
const engineeringLog = [
  {
    date: "2026-05-30",
    ref: "56e86d5",
    subject: "Refine action calendar and campaign overflow",
    note: "First product commit: an 8,626-line single-file prototype, a 1,863-line design-system.html already beside it.",
  },
  {
    date: "2026-06-04",
    ref: "63086af",
    subject: "Design is ready. Only waiting to run with new design system.",
    note: "A teammate's page, parked until the system could carry it.",
  },
  {
    date: "2026-06-12",
    ref: "d60b348",
    subject: "Rebuild visual component library as self-contained HTML page",
    note: "The designer-facing boards become one portable file.",
  },
  {
    date: "2026-06-17",
    ref: "4ed3935",
    subject: "Drop React as the source of truth; de-dup ConfirmBar",
    note: "The pivot: standalone HTML/CSS becomes the canonical layer.",
  },
  {
    date: "2026-06-18",
    ref: "728a660",
    subject: "Prettier-normalize the codebase + add root config",
    note: "The standards wave — format, lint, line endings, asset weight.",
  },
  {
    date: "2026-06-24",
    ref: "8807110",
    subject: "Rename draft/home-calendar-html -> draft/pulse-app (the unified product)",
    note: "The demos unify into one static product export.",
  },
  {
    date: "2026-06-25",
    ref: "react-v0.6.0",
    subject: "Pulse design system as React components",
    note: "A teammate tags the npm wrapper; its build syncs my canonical CSS.",
  },
  {
    date: "2026-07-01",
    ref: "be50105",
    subject: "sync(ds): propagate the type/progress decisions to the designer surfaces",
    note: "System decisions flow back out to the designer surfaces.",
  },
];

// Truth-source table — internal-doc, quoted rows.
const truthRows: Array<[string, string]> = [
  ["tokens", "handoff/components/tokens.css"],
  ["component", "its <Name>/ folder"],
  ["inventory", "component-library.md"],
  ["preview", "html-component-preview.html"],
  ["figma board", "figma-component-library.html"],
];

// Package plate — packages/react/package.json + README facts.
const plateRows: Array<[string, string]> = [
  ["package", "internal-package/react"],
  ["version", "0.6.0"],
  ["exports", "37"],
  ["registry", "GitLab · private"],
  ["peer", "react ≥ 18"],
  ["styles", "synced from the canonical CSS"],
];

// Chapter 03 screenshots — captured from the project's static file://
// surfaces (1440×1000). All seven live in public/media/pulse/.
const SHOT_W = 1440;
const SHOT_H = 1000;

// ── Microcopy hardcoded here (copy trims in data/projects.ts wait on the
//    batched owner pass; the shared strings themselves stay untouched). ──────
const turnClaim =
  "The decision wasn’t how much AI can do — it was where a human must stay.";
const guardrail = "AI can draft and schedule. A person releases to publish.";
// Verbatim sentence from the project copy (chapter 2, section 2) — set once
// here as the guardrail note instead of repeating inside the body column.
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
  color: var(--accent-gold);
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
  border-top: 1px solid var(--accent-gold);
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

/* ── The Turn: the one full-bleed ink band ──────────────────────────────── */
.pulse-turn {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  margin: clamp(76px, 8vw, 124px) auto 0;
  padding: clamp(96px, 10vw, 150px) var(--work-gutter);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  row-gap: clamp(26px, 3vw, 42px);
  background: var(--ink-950);
  color: var(--paper);
  /* full-bleed within the centered shell (vicino precedent) */
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

/* ── Fig. 03 — semantic color ramps (one row per role) ──────────────────── */
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

/* ── Fig. 04 — component inventory (printed index) ──────────────────────── */
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

/* ── Fig. 05 — workspace anatomy (surfaces row) ─────────────────────────── */
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

/* ── Fig. 07 — approval chain ───────────────────────────────────────────── */
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

/* ── Fig. 08 — chat contract specimen ───────────────────────────────────── */
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

/* ── Chapter 03 — Fig. 09 engineering ledger (commit log specimen) ──────── */
.pulse-log {
  border-top: 1px solid var(--accent-gold);
}
.pulse-log-row {
  display: grid;
  grid-template-columns: 110px minmax(96px, 110px) minmax(0, 1.15fr) minmax(0, 1fr);
  column-gap: var(--work-grid-gap);
  align-items: baseline;
  padding: 14px 0;
  border-bottom: 1px solid var(--work-rule);
}
.pulse-log-row p {
  margin: 0;
}
.pulse-log-date,
.pulse-log-ref {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.04em;
  white-space: nowrap;
  color: rgba(5, 5, 5, 0.48);
}
.pulse-log-ref {
  /* static gold detail — the hash column */
  color: var(--accent-gold);
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

/* ── Chapter 03 — typeset doc specimens (truth table, npm plate) ────────── */
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

/* ── Chapter 03 — doc quote (same grammar as the guardrail) ─────────────── */
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

/* ── Chapter 03 — screenshot frames (product keeps its colors inside) ───── */
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
    grid-template-columns: 96px minmax(84px, 100px) minmax(0, 1.15fr) minmax(0, 1fr);
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
  .pulse-log-date,
  .pulse-log-ref {
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

export function PulseCaseLayout({ project }: { project: Project }) {
  const meta = [
    ["Role", project.role],
    ["Duration", project.duration],
    ["Type", project.type],
    ["Teams", project.teams],
  ];
  const [ch1, ch2] = project.chapters ?? [];
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

      {/* ── Project summary + figures ledger ── */}
      <section className="proj-summary" aria-labelledby="project-summary">
        <h2 id="project-summary" data-fade>
          Project Summary
        </h2>
        <div className="proj-summary-copy">
          {(project.summary ?? [project.blurb]).map(filterSummary).map((p) => (
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

      {/* ── The Turn: the one ink band, with the human-gate spine ── */}
      {moment && (
        <section className="pulse-turn" aria-labelledby="pulse-turn-title">
          <p className="pulse-turn-eyebrow" data-fade>
            Most memorable moment
          </p>
          <h2 className="pulse-turn-claim" id="pulse-turn-title" data-fade>
            {turnClaim}
          </h2>
          <div className="pulse-turn-copy" data-fade>
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
              <em className="pulse-fig">Fig. 02</em> Create-with-AI &mdash; where a
              person stays in the loop
            </span>
            <span className="pulse-spine-legend">
              <i aria-hidden="true" /> ai step
              <i className="is-stamp" aria-hidden="true" /> human gate
            </span>
          </footer>
        </section>
      )}

      {/* ── Chapter 01 — system before screens ── */}
      {ch1 && (
        <section className="case-chapter pulse-chapter">
          <header className="pulse-chapter-head" data-fade>
            <p className="pulse-chapter-index">01</p>
            <h2 className="pulse-chapter-claim">{ch1.title}</h2>
            <div className="pulse-chapter-headrule" aria-hidden="true" />
          </header>

          {ch1.sections[0] && (
            <div className="pulse-section">
              <p className="pulse-section-tags" data-fade>
                {ch1.sections[0].tags}
              </p>
              <div className="pulse-section-copy" data-fade>
                <h3>{ch1.sections[0].heading}</h3>
                {ch1.sections[0].body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
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
                  <em className="pulse-fig">Fig. 03</em> Six semantic ramps, 50
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
                  <em className="pulse-fig">Fig. 04</em> Component inventory,
                  abridged &mdash; 37 named sources from the Pulse registry
                </figcaption>
              </figure>
            </div>
          )}

          {ch1.sections[1] && (
            <div className="pulse-section">
              <p className="pulse-section-tags" data-fade>
                {ch1.sections[1].tags}
              </p>
              <div className="pulse-section-copy" data-fade>
                <h3>{ch1.sections[1].heading}</h3>
                {ch1.sections[1].body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
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
                  <em className="pulse-fig">Fig. 05</em> Workspace anatomy &mdash;
                  one rail, seven surfaces
                </figcaption>
              </figure>
            </div>
          )}
        </section>
      )}

      {/* ── Chapter 02 — the Create-with-AI flow ── */}
      {ch2 && (
        <section className="case-chapter pulse-chapter">
          <header className="pulse-chapter-head" data-fade>
            <p className="pulse-chapter-index">02</p>
            <h2 className="pulse-chapter-claim">{ch2.title}</h2>
            <div className="pulse-chapter-headrule" aria-hidden="true" />
          </header>

          {ch2.sections[0] && (
            <div className="pulse-section">
              <p className="pulse-section-tags" data-fade>
                {ch2.sections[0].tags}
              </p>
              <div className="pulse-section-copy" data-fade>
                <h3>{ch2.sections[0].heading}</h3>
                {ch2.sections[0].body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
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
                  <em className="pulse-fig">Fig. 06</em> The Creative Brief &mdash;
                  editable fields inside the chat
                </figcaption>
              </figure>
            </div>
          )}

          {ch2.sections[1] && (
            <div className="pulse-section">
              <p className="pulse-section-tags" data-fade>
                {ch2.sections[1].tags}
              </p>
              <div className="pulse-section-copy" data-fade>
                <h3>{ch2.sections[1].heading}</h3>
                {/* body[1] carries the guardrail sentence — it is set once
                    below as the page's guardrail artifact instead */}
                {ch2.sections[1].body.slice(0, 1).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
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
                  <em className="pulse-fig">Fig. 07</em> Approval chain &mdash; SLA
                  timers; escalation never auto-approves
                </figcaption>
              </figure>
              <div className="pulse-guardrail pulse-section-inset" data-fade>
                <p className="pulse-guardrail-claim">{guardrail}</p>
                <p className="pulse-guardrail-note">{guardrailNote}</p>
              </div>
            </div>
          )}

          {ch2.sections[2] && (
            <div className="pulse-section">
              <p className="pulse-section-tags" data-fade>
                {ch2.sections[2].tags}
              </p>
              <div className="pulse-section-copy" data-fade>
                <h3>{ch2.sections[2].heading}</h3>
                {ch2.sections[2].body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
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
                  <em className="pulse-fig">Fig. 08</em> Chat contract &mdash; the
                  assistant follows the product component contract
                </figcaption>
              </figure>
            </div>
          )}
        </section>
      )}

      {/* ── Chapter 03 — the engineering story (hardcoded; dossier-traced) ── */}
      <section className="case-chapter pulse-chapter">
        <header className="pulse-chapter-head" data-fade>
          <p className="pulse-chapter-index">03</p>
          <h2 className="pulse-chapter-claim">
            The engineering story: one prototype became the team&rsquo;s library.
          </h2>
          <div className="pulse-chapter-headrule" aria-hidden="true" />
        </header>

        {/* S0 — the commit ledger */}
        <div className="pulse-section">
          <p className="pulse-section-tags" data-fade>
            GIT LOG · FIVE BEATS
          </p>
          <div className="pulse-section-copy" data-fade>
            <h3>Five beats, dated from the log</h3>
            <p>
              This chapter reads from the repository &mdash; 656 of my commits
              between May 30 and July 2, 2026, alongside a team shipping
              prototypes of its own. Five beats run through the log: exploring
              the design system as code, discovering the shape of the
              team&rsquo;s code, standardizing the engineering, keeping
              runnable demos in everyone&rsquo;s hands, and refactoring it all
              into a maintainable library &mdash; npm-wrapped, Figma-exported.
            </p>
          </div>
          <figure className="pulse-section-full" data-fade>
            <div className="pulse-log">
              {engineeringLog.map((row) => (
                <div className="pulse-log-row" key={row.ref}>
                  <span className="pulse-log-date">{row.date}</span>
                  <span className="pulse-log-ref">{row.ref}</span>
                  <p className="pulse-log-subject">&ldquo;{row.subject}&rdquo;</p>
                  <p className="pulse-log-note">{row.note}</p>
                </div>
              ))}
            </div>
            <figcaption className="pulse-fig-caption">
              <em className="pulse-fig">Fig. 09</em> Engineering ledger &mdash;
              commit subjects quoted from the repo log, May 30 &rarr; July 1,
              2026
            </figcaption>
          </figure>
        </div>

        {/* S1 — origin, the mess, the standard */}
        <div className="pulse-section">
          <p className="pulse-section-tags" data-fade>
            ORIGIN · TEAM CODE · STANDARDS
          </p>
          <div className="pulse-section-copy" data-fade>
            <h3>The mess was real, so the standard became commits</h3>
            <p>
              The system was there from day one: my first commit to the product
              landed an 8,626-line single-file prototype with a 1,863-line
              design-system.html already sitting beside it &mdash; the design
              system explored as code before there was any process to require
              it. The team&rsquo;s work arrived the way single files do: whole
              prototypes uploaded to the repo root, one 13,020 lines long, and
              pages queuing behind the system &mdash; one teammate&rsquo;s
              commit message reads, in full, &ldquo;Design is ready. Only
              waiting to run with new design system.&rdquo;
            </p>
            <p>
              So the standard became commits instead of advice. In one June
              wave I Prettier-normalized the codebase &mdash; the 13,020-line
              upload included &mdash; repaired the ESLint config, forced LF
              line endings, converted oversized PNGs to WebP at 94% smaller,
              and moved the loose prototypes out of the tracked root. I wrote
              the contracts down as documents &mdash; an app UI standard, then
              a migration plan whose audit put numbers on the mess: a 557 KB
              stylesheet carrying three hand-reconciled copies of the token
              set, and 94 page partials that imported nothing from the system.
              A teammate stood up the CI that runs the consistency checks; I
              greened the token gate and kept extending it.
            </p>
          </div>
          <figure className="pulse-section-aside" data-fade>
            <div className="pulse-spec-card pulse-truth">
              <header className="pulse-spec-head">
                <span>internal-doc &middot; truth sources</span>
              </header>
              <p className="pulse-truth-epigraph">
                &ldquo;Before changing anything, confirm you are editing the
                truth source.&rdquo;
              </p>
              <div className="pulse-kv">
                {truthRows.map(([layer, file]) => (
                  <div className="pulse-kv-row" key={layer}>
                    <span>{layer}</span>
                    <em>{file}</em>
                  </div>
                ))}
              </div>
              <p className="pulse-spec-foot">
                self-check &middot; node scripts/verify.mjs
              </p>
            </div>
            <figcaption className="pulse-fig-caption">
              <em className="pulse-fig">Fig. 10</em> The truth-source table
              &mdash; one file may define each layer, and a script checks it
            </figcaption>
          </figure>
          <figure className="pulse-doc-quote pulse-section-inset" data-fade>
            <blockquote>
              &ldquo;Today pulse-app does not consume the DS at all &mdash;
              they are parallel universes.&rdquo;
            </blockquote>
            <figcaption>
              ds-single-source-migration.md, the audit&rsquo;s core finding,
              June 29. Four days of slice-by-slice adoption later, eight system
              components own the app&rsquo;s UI and 1,905 verified-dead lines
              are gone.
            </figcaption>
          </figure>
        </div>

        {/* S2 — demos the team could open from disk */}
        <div className="pulse-section">
          <p className="pulse-section-tags" data-fade>
            DEMOS · FILE:// · HAND-AROUND
          </p>
          <div className="pulse-section-copy" data-fade>
            <h3>Demos the team could open from disk</h3>
            <p>
              Standards alone don&rsquo;t align a team &mdash; runnable demos
              do. The first week of June was a React sprint: a Calendar
              workspace, the homepage post queue, a 1:1 port of the campaigns
              workspace &mdash; real surfaces for the team to react to within
              days. By June 24 the demos were unified into a single
              vanilla-HTML product, draft/pulse-app: Home, Calendar, Campaign,
              Analytics, Signal, Strategy, and Onboarding as routable pages on
              the system&rsquo;s tokens.
            </p>
            <p>
              The engineering constraint is the point: the app builds to plain
              HTML that renders from a double-click. The README states it as a
              rule &mdash; &ldquo;Preserve file:// support because designers
              may open this export directly.&rdquo; Every product screenshot on
              this page was captured from a file:// address: no server, no
              toolchain, no account.
            </p>
          </div>
          <figure className="pulse-section-full" data-fade>
            <div className="pulse-shot">
              <Image
                src="/media/pulse/pulse-app-home.png"
                alt="Pulse app Home page: workspace sidebar for the Cider demo brand, action-item KPI tiles, content queue, and signals feed"
                width={SHOT_W}
                height={SHOT_H}
                sizes="(max-width: 1080px) 100vw, 1376px"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <figcaption className="pulse-fig-caption">
              <em className="pulse-fig">Fig. 11</em> draft/pulse-app, Home,
              rendered from file:// &mdash; the demo brand&rsquo;s live brief,
              action items, content queue, signals, and the assistant dock
            </figcaption>
          </figure>
          <figure className="pulse-section-inset" data-fade>
            <div className="pulse-shot-pair">
              <div className="pulse-shot">
                <Image
                  src="/media/pulse/pulse-app-calendar.png"
                  alt="Pulse Calendar in week view with scheduled posts and a schedule-health rail"
                  width={SHOT_W}
                  height={SHOT_H}
                  sizes="(max-width: 809px) 100vw, (max-width: 1080px) 50vw, 500px"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <div className="pulse-shot">
                <Image
                  src="/media/pulse/pulse-app-analytics.png"
                  alt="Pulse Analytics weekly report with KPI tiles and key signals"
                  width={SHOT_W}
                  height={SHOT_H}
                  sizes="(max-width: 809px) 100vw, (max-width: 1080px) 50vw, 500px"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
            <figcaption className="pulse-fig-caption">
              <em className="pulse-fig">Fig. 12</em> Two more pages of the same
              static export &mdash; the week-view scheduling Calendar and the
              weekly Analytics report
            </figcaption>
          </figure>
        </div>

        {/* S3 — the canonical library and its npm wrapper */}
        <div className="pulse-section">
          <p className="pulse-section-tags" data-fade>
            LIBRARY · NPM · NO DRIFT
          </p>
          <div className="pulse-section-copy" data-fade>
            <h3>One canonical library, wrapped for every consumer</h3>
            <p>
              On June 17 I made the pivot that stuck: drop React as the source
              of truth. Each component became a standalone folder &mdash; one
              HTML file, one CSS file &mdash; over a shared tokens.css of 340
              custom properties, with a live browser to flip through the set.
              Then the single-file prototypes were refactored the same way:
              split into partials and page modules through late June, the
              hardest clusters extracted last, and the best pieces graduated
              into the library itself.
            </p>
            <p>
              That canonical layer is what made a package safe. Over June
              23&ndash;25 a teammate wrapped the library as internal-package/react
              &mdash; typed React components on the team&rsquo;s private
              registry &mdash; where the JSX wrappers are the only authored
              layer. A build step copies the canonical CSS straight into the
              package, in the script&rsquo;s own words, so the components
              &ldquo;style themselves from the truth source and can never
              drift.&rdquo;
            </p>
          </div>
          <figure className="pulse-section-aside" data-fade>
            <div className="pulse-spec-card">
              <header className="pulse-spec-head">
                <span>packages/react &middot; manifest</span>
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
                published on react-v* tags &middot; CI rebuilds from the design
                system
              </p>
            </div>
            <figcaption className="pulse-fig-caption">
              <em className="pulse-fig">Fig. 13</em> The npm wrapper&rsquo;s
              plate, from packages/react &mdash; styles synced at build time
            </figcaption>
          </figure>
          <figure className="pulse-section-full" data-fade>
            <div className="pulse-shot">
              <Image
                src="/media/pulse/component-preview.png"
                alt="Pulse HTML Component Preview: category sidebar and the AIPanel component specimen with a live demo"
                width={SHOT_W}
                height={SHOT_H}
                sizes="(max-width: 1080px) 100vw, 1376px"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <figcaption className="pulse-fig-caption">
              <em className="pulse-fig">Fig. 14</em> html-component-preview.html
              &mdash; the live component browser: 40 components, one standalone
              source each; the AIPanel specimen open with its 21 slices
            </figcaption>
          </figure>
          <figure className="pulse-section-inset" data-fade>
            <div className="pulse-shot">
              <Image
                src="/media/pulse/react-playground.png"
                alt="Pulse React Component Library playground: AIPanel rendered from the npm package, with copyable usage code"
                width={SHOT_W}
                height={SHOT_H}
                sizes="(max-width: 1080px) 100vw, 1030px"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <figcaption className="pulse-fig-caption">
              <em className="pulse-fig">Fig. 15</em> The package playground
              &mdash; the published AIPanel rendered live with copyable usage,
              itself a static page
            </figcaption>
          </figure>
        </div>

        {/* S4 — the Figma export and the non-coding designers */}
        <div className="pulse-section">
          <p className="pulse-section-tags" data-fade>
            FIGMA · HANDOFF · DESIGNERS
          </p>
          <div className="pulse-section-copy" data-fade>
            <h3>A handoff designers can double-click</h3>
            <p>
              The designer surface got the same discipline. On June 12 I
              rebuilt the visual component library as a self-contained HTML
              page, then expanded it into variant-by-state boards for Figma
              import &mdash; one 7,874-line file that prints every component,
              every state, with its interaction contract alongside. A
              companion foundations handbook typesets the brand rules &mdash;
              neutral first, color with meaning &mdash; for people who will
              never open the repo.
            </p>
            <p>
              None of it needs a toolchain: the boards, the handbook, the
              component browser, and the app export all open from a
              double-click. And the handoff is not a snapshot &mdash; when the
              system moves, a sync pass carries the decision back out to the
              designer surfaces; the latest landed July 1.
            </p>
          </div>
          <figure className="pulse-section-full" data-fade>
            <div className="pulse-shot">
              <Image
                src="/media/pulse/figma-board-campaign.png"
                alt="Figma component board: PostChip state matrix and a labeled campaign anatomy map"
                width={SHOT_W}
                height={SHOT_H}
                sizes="(max-width: 1080px) 100vw, 1376px"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <figcaption className="pulse-fig-caption">
              <em className="pulse-fig">Fig. 16</em> figma-component-library.html
              &mdash; PostChip states (default, hover, active, keyboard focus)
              over the campaign anatomy map, one section of the single-file
              Figma board
            </figcaption>
          </figure>
          <figure className="pulse-section-inset" data-fade>
            <div className="pulse-shot">
              <Image
                src="/media/pulse/foundations-handbook.png"
                alt="Pulse / Post Design System foundations page with status, scope, accent, and export chips and the section index"
                width={SHOT_W}
                height={SHOT_H}
                sizes="(max-width: 1080px) 100vw, 1030px"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <figcaption className="pulse-fig-caption">
              <em className="pulse-fig">Fig. 17</em> The Pulse / Post
              foundations handbook &mdash; working spec, the accent law
              (&ldquo;cyan replaces green&rdquo;), and the export path to Figma
            </figcaption>
          </figure>
        </div>
      </section>

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
