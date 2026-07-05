import Image from "next/image";
import type { Project, CaseSection } from "@/data/projects";
import type { CSSProperties, ReactNode } from "react";
import { OffscreenVideo } from "@/components/ui/offscreen-video";
import { FroghireAffinityMap } from "@/components/froghire-affinity-map";
import { InteractiveCue, ICUE_CSS } from "@/components/ui/interactive-cue";
import { FroghireTradeLedger } from "@/components/froghire-trade-ledger";

// FrogHire.ai — the triage ledger.
// A calm ink-on-paper working document: hairline-ruled dockets, numbered
// evidence figures, marginalia review quotes, and stamped verdicts, with the
// product's green confined inside media frames. Bespoke layout per the
// VicinoCaseLayout precedent (scoped critical CSS, switched in
// app/work/[slug]/page.tsx). Copy renders verbatim from data/projects.ts —
// chapter/H3 retitles are deferred to the batched owner sign-off; the only
// render-filters here strip a title's surrounding quote marks and lift the
// mentor's line out of moment.body for the interlude.

/* ── render-filters (no copy is rewritten, only re-framed) ─────────────── */

const stripQuotes = (s: string) =>
  s.replace(/^[“”"']+/, "").replace(/[“”"']+$/, "").trim();

const extractQuote = (s: string) => {
  const m = s.match(/[“"]([^”"]+)[”"]/);
  return m ? m[1] : s;
};

const chapterIndex = (n: string) => {
  const m = n.match(/\d+/);
  return `Ch. ${(m ? m[0] : "0").padStart(2, "0")}`;
};

/* ── marginalia: the real review/stakeholder quotes already in the data ── */

const MARGINALIA: Record<string, { quote: string; source: string }> = {
  "0-0": {
    quote: "“Hard to use.” “Confusing.”",
    source: "Chrome Web Store reviews",
  },
  "0-1": {
    quote: "“I honestly have no idea how to use this.”",
    source: "Chrome Web Store review",
  },
  "0-2": {
    quote:
      "“We’re past early funding. Every design decision must make financial sense.”",
    source: "My mentor",
  },
  "1-0": {
    quote: "“This will impress users the most.”",
    source: "The CEO, on the animated demo",
  },
  "1-2": {
    quote: "“We thought that feature wasn’t live yet.”",
    source: "An engineer, mid-QA",
  },
  "1-3": {
    quote: "“We’re still firefighting. Eventually we need standards.”",
    source: "My mentor",
  },
};

const TRIAGE_FLOW = [
  {
    index: "01",
    label: "Collect",
    title: "One-star reviews and weekly bug passes",
    note: "Chrome reviews, dashboard walkthroughs, subscription states, resume mismatches.",
    stat: "~100 issues",
  },
  {
    index: "02",
    label: "Diagnose",
    title: "Three flaws underneath the noise",
    note: "No onboarding, broken hierarchy, and missing trust became the real backlog.",
    stat: "3 flaws",
  },
  {
    index: "03",
    label: "Negotiate",
    title: "Every fix met the startup constraint",
    note: "Animated onboarding, subscription clarity, resume control, and filters all had to survive cost.",
    stat: "4 trade-offs",
  },
  {
    index: "04",
    label: "Ship",
    title: "Small fixes kept the product moving",
    note: "Tooltips shipped, filters held, partial wins still restored a path forward.",
    stat: "registration recovered",
  },
];

/* ── building blocks ────────────────────────────────────────────────────── */

function FigCaption({
  index,
  children,
  className = "",
}: {
  index: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figcaption className={`froghire-figcap ${className}`.trim()}>
      <span className="froghire-fig-index">Fig. {index}</span>
      {children}
    </figcaption>
  );
}

function Sec({
  chapter,
  section,
  index,
  children,
}: {
  chapter: number;
  section: CaseSection;
  index: number;
  children?: ReactNode;
}) {
  const note = MARGINALIA[`${chapter}-${index}`];
  return (
    <div className="froghire-grid froghire-sec">
      <div className="froghire-sec-margin" data-fade>
        <p className="froghire-sec-tags">{section.tags}</p>
        {note && (
          <blockquote className="froghire-marginalia">
            <p>{note.quote}</p>
            <cite>{note.source}</cite>
          </blockquote>
        )}
      </div>
      <div className="froghire-sec-copy" data-fade>
        <h3>{section.heading}</h3>
        {section.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {children}
    </div>
  );
}

/* ── scoped critical CSS ────────────────────────────────────────────────── */

const froghireCss = `
/* Grid, named first — container: the 1440px case shell (--work-shell-max);
   margins: --work-gutter clamp(24px, 5vw, 72px); columns: 12 × minmax(0,1fr);
   gutters: --work-grid-gap clamp(18px, 2.3vw, 32px); rules: --work-rule;
   baseline: 8px rhythm, body --text-body/1.62. Tablet (≤1079.98px) remaps
   spans full-width; phone (≤809.98px) is a single reading column and the
   ledger rows stack as definition lists. */
.froghire-case-page {
  --work-shell-max: 1440px;
  --work-gutter: clamp(24px, 5vw, 72px);
  --work-grid-gap: clamp(18px, 2.3vw, 32px);
  --work-rule: rgba(5, 5, 5, 0.14);
  --froghire-ink-soft: rgba(5, 5, 5, 0.76);
  --froghire-ink-mute: rgba(5, 5, 5, 0.55);
  --froghire-ink-label: rgba(5, 5, 5, 0.48);
  --froghire-ink-tag: rgba(5, 5, 5, 0.42);
  --froghire-rule-dark: rgba(255, 255, 255, 0.18);

  /* Case accent — FrogHire's own green (owner rule 2026-07-05: case pages
     derive their accent from their own project, not the site's gold).
     --case-accent is the product's real UI green, #5ac75a — sampled
     straight off the "H1B / PERM / E-Verify" status chips and the sidebar
     frog logomark in Fig. 01's cover shot — used here only for rule marks
     and hover/focus strokes that don't carry small text. --case-detail is
     the same hue darkened to hold AA contrast (raw #5ac75a is ~2.15:1 on
     paper, well under the 4.5:1 floor for reading-size text), used for the
     chapter index and figure-index labels.  */
  --case-accent: #5ac75a;
  --case-detail: #297a29;

  background: var(--paper);
  color: var(--ink-950);
}
.froghire-case-page p {
  text-wrap: pretty;
}
.froghire-case-page img,
.froghire-case-page video,
.froghire-case-page svg {
  display: block;
}
.froghire-shell {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  margin-inline: auto;
  padding-inline: var(--work-gutter);
}
.froghire-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
}

/* metadata voices: hairline + mono/label indices; claims stay in the titles */
.froghire-label {
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--froghire-ink-label);
}
.froghire-index-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--case-detail);
}

/* ── docket hero ── */
.froghire-hero {
  padding-top: clamp(160px, 18vw, 236px);
  padding-bottom: clamp(56px, 6vw, 84px);
}
.froghire-kicker {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  gap: 8px 24px;
  flex-wrap: wrap;
  margin: 0;
  padding-top: 14px;
  border-top: 1px solid var(--work-rule);
}
.froghire-hero h1 {
  grid-column: 1 / 9;
  margin: clamp(48px, 5.5vw, 80px) 0 0;
  font-family: var(--font-condensed);
  font-size: var(--text-display-2);
  font-weight: 300;
  line-height: 0.92;
  letter-spacing: var(--track-display);
  text-transform: uppercase;
}
.froghire-lede {
  grid-column: 1 / 8;
  max-width: 56ch;
  margin: clamp(22px, 2.4vw, 34px) 0 0;
  font-size: var(--text-lead);
  font-weight: 400;
  line-height: 1.5;
  color: rgba(5, 5, 5, 0.68);
}
.froghire-hero-proof {
  grid-column: 1 / -1;
  align-self: start;
  min-width: 0;
  margin: clamp(40px, 4.4vw, 64px) 0 0;
}
.froghire-hero-proof-media {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 7;
  border: 1px solid var(--work-rule);
  background: var(--paper-warm);
}
.froghire-hero-proof-media img {
  object-fit: cover;
  object-position: left top;
}
.froghire-meta {
  grid-column: 10 / -1;
  grid-row: 2 / span 2;
  align-self: start;
  display: grid;
  margin: clamp(48px, 5.5vw, 80px) 0 0;
  border-top: 1px solid var(--work-rule);
}
.froghire-meta div {
  padding: 14px 0;
  border-bottom: 1px solid var(--work-rule);
}
.froghire-meta dt {
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--froghire-ink-label);
}
.froghire-meta dd {
  margin: 5px 0 0;
  font-size: var(--text-meta);
  font-weight: 400;
  line-height: 1.45;
  color: rgba(5, 5, 5, 0.78);
}
.froghire-stats {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  margin-top: clamp(56px, 6vw, 84px);
  border-top: 1px solid var(--work-rule);
}
.froghire-stat {
  grid-column: span 4;
  display: grid;
  gap: 12px;
  align-content: start;
  padding-top: clamp(20px, 2.4vw, 32px);
}
.froghire-stat-num {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-heading);
  font-weight: 400;
  line-height: 1;
}
.froghire-stat-cap {
  margin: 0;
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--froghire-ink-label);
}
.froghire-stat-cap .froghire-fig-index {
  display: inline;
  margin-right: 10px;
}

/* ── evidence frames (figures) ── */
.froghire-fig {
  position: relative;
  overflow: hidden;
  margin: 0;
  border: 1px solid var(--work-rule);
  background: var(--paper-warm);
}
.froghire-fig--auto img {
  width: 100%;
  height: auto;
}
.froghire-fig-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.froghire-figure {
  margin: 0;
  min-width: 0;
}
.froghire-figcap {
  margin: 12px 0 0;
  font-size: var(--text-meta);
  font-weight: 400;
  line-height: 1.5;
  color: var(--froghire-ink-mute);
}
.froghire-fig-index {
  display: block;
  margin-bottom: 4px;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--case-detail);
}

/* ── the product in two rooms ── */
.froghire-rooms {
  align-items: start;
  row-gap: clamp(24px, 3vw, 40px);
  margin-top: clamp(28px, 3vw, 44px);
}
/* The two product surfaces are both wide (dashboard 2.17:1, extension reel
   16:9), so they stack full-width and show whole instead of cropped slices. */
.froghire-room-a {
  grid-column: 1 / -1;
}
.froghire-room-b {
  grid-column: 1 / -1;
}
.froghire-room-a .froghire-fig {
  aspect-ratio: 2.17;
}
.froghire-room-b .froghire-fig {
  aspect-ratio: 2.1;
}
.froghire-room-b .froghire-fig-media {
  /* the recording is 16:9 with a baked-in black bar (~13% top, ~3% bottom);
     bias the vertical cover position to crop the black, full width visible. */
  object-position: 50% 72%;
}

/* ── brief ── */
.froghire-brief {
  margin-top: clamp(76px, 8vw, 130px);
}
.froghire-brief-inner {
  padding: clamp(76px, 8vw, 124px) 0;
  border-top: 1px solid var(--work-rule);
  border-bottom: 1px solid var(--work-rule);
  row-gap: clamp(24px, 3vw, 40px);
}
.froghire-brief-inner h2 {
  grid-column: 1 / 4;
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-heading);
  font-weight: 400;
  line-height: 1.12;
}
.froghire-brief-copy {
  grid-column: 5 / 11;
}
.froghire-brief-copy p,
.froghire-sec-copy p:not(.froghire-sec-tags) {
  margin: 0;
  max-width: 68ch;
  font-family: var(--font-serif);
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.62;
  color: var(--froghire-ink-soft);
}
.froghire-brief-copy p + p,
.froghire-sec-copy p + p {
  margin-top: 22px;
}

/* ── triage spine: the method made visible early ── */
.froghire-triage {
  margin-top: clamp(70px, 8vw, 124px);
}
.froghire-triage-inner {
  padding: clamp(56px, 6vw, 88px) 0;
  border-top: 1px solid var(--work-rule);
  border-bottom: 1px solid var(--work-rule);
  row-gap: clamp(24px, 3vw, 40px);
}
.froghire-triage-label {
  grid-column: 1 / 3;
}
.froghire-triage-copy {
  grid-column: 3 / 8;
}
.froghire-triage-copy h2 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-heading);
  font-weight: 400;
  line-height: 1.12;
  text-wrap: balance;
}
.froghire-triage-copy p {
  max-width: 58ch;
  margin: 20px 0 0;
  font-size: var(--text-body);
  line-height: 1.58;
  color: var(--froghire-ink-soft);
}
.froghire-triage-board {
  grid-column: 8 / -1;
  position: relative;
  display: grid;
  gap: 14px;
  align-self: start;
  min-width: 0;
  padding-left: 24px;
}
.froghire-triage-board::before {
  content: "";
  position: absolute;
  left: 6px;
  top: 18px;
  bottom: 18px;
  width: 1px;
  background: linear-gradient(
    to bottom,
    var(--case-accent),
    rgba(5, 5, 5, 0.18)
  );
  transform-origin: top;
}
.froghire-triage-step {
  position: relative;
  display: grid;
  gap: 8px;
  padding: 18px 0 18px 24px;
  border-top: 1px solid var(--work-rule);
}
.froghire-triage-step:first-child {
  border-top: 0;
}
.froghire-triage-step::before {
  content: "";
  position: absolute;
  left: -22px;
  top: 22px;
  width: 10px;
  height: 10px;
  border: 1px solid var(--case-detail);
  background: var(--paper);
}
.froghire-triage-step-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}
.froghire-triage-step-label {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--case-detail);
}
.froghire-triage-step-stat {
  font-size: var(--text-micro);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--froghire-ink-label);
  text-align: right;
}
.froghire-triage-step h3 {
  margin: 0;
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.22;
}
.froghire-triage-step p {
  max-width: 44ch;
  margin: 0;
  font-size: var(--text-meta);
  line-height: 1.5;
  color: var(--froghire-ink-mute);
}

/* ── chapter banners ── */
.froghire-chapter-head {
  padding-top: clamp(118px, 14vw, 214px);
}
.froghire-chapter-head .froghire-index-label {
  grid-column: 1 / 4;
  margin-bottom: 14px;
}
.froghire-chapter-rule {
  grid-column: 1 / -1;
  height: 1px;
  background: var(--work-rule);
}
.froghire-chapter-head h2 {
  grid-column: 1 / 10;
  margin: clamp(26px, 3vw, 44px) 0 0;
  font-family: var(--font-serif);
  font-size: var(--text-display-3);
  font-weight: 400;
  line-height: 1.02;
  text-wrap: balance;
}

/* ── decision sections ── */
.froghire-sec {
  padding-top: clamp(76px, 8vw, 130px);
  align-items: start;
}
.froghire-sec-margin {
  grid-column: 1 / 4;
}
.froghire-sec-tags {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--froghire-ink-tag);
}
.froghire-marginalia {
  margin: clamp(20px, 2.2vw, 32px) 0 0;
  padding-left: 14px;
  border-left: 2px solid var(--case-accent);
}
.froghire-marginalia p {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-meta);
  font-style: italic;
  line-height: 1.55;
  color: var(--froghire-ink-mute);
}
.froghire-marginalia cite {
  display: block;
  margin-top: 8px;
  font-size: var(--text-micro);
  font-style: normal;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--froghire-ink-label);
}
.froghire-sec-copy {
  grid-column: 5 / 11;
}
.froghire-sec-copy h3 {
  margin: 0 0 clamp(18px, 2vw, 28px);
  font-family: var(--font-serif);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.28;
  color: var(--ink-950);
}

/* figure rows: media + caption resolve on the same 12-col rails */
.froghire-figrow {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
  align-items: end;
  margin: clamp(36px, 4.6vw, 72px) 0 0;
}
.froghire-f-a {
  grid-column: 1 / 10;
}
.froghire-f-b {
  grid-column: 4 / -1;
}
.froghire-f-full {
  grid-column: 1 / -1;
}
.froghire-f-video {
  grid-column: 5 / -1;
}
.froghire-c-right {
  grid-column: 10 / -1;
  align-self: end;
}
.froghire-c-left {
  grid-column: 1 / 4;
  grid-row: 1;
  align-self: end;
}
.froghire-c-below {
  grid-column: 1 / 7;
}
.froghire-fig--1610 {
  aspect-ratio: 16 / 10;
}
.froghire-fig--169 {
  aspect-ratio: 16 / 9;
}
.froghire-fig--219 {
  aspect-ratio: 21 / 9;
}
.froghire-fig--map {
  padding: clamp(16px, 2.4vw, 32px);
}

/* ── interlude: the mentor's line ── */
.froghire-interlude {
  position: relative;
  margin-top: clamp(118px, 14vw, 214px);
  padding-top: clamp(88px, 10vw, 150px);
  padding-bottom: clamp(88px, 10vw, 150px);
  background: var(--ink-950);
  color: var(--paper);
  box-shadow: 0 0 0 100vmax var(--ink-950);
  clip-path: inset(0 -100vmax);
}
.froghire-interlude-kicker {
  grid-column: 2 / 12;
  margin: 0;
  padding-top: 14px;
  border-top: 1px solid var(--froghire-rule-dark);
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.froghire-interlude blockquote {
  grid-column: 2 / 11;
  margin: clamp(44px, 5vw, 72px) 0 0;
}
.froghire-interlude blockquote p {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-display-3);
  font-weight: 400;
  line-height: 1.08;
  color: var(--paper);
  text-wrap: balance;
}
.froghire-interlude-attr {
  grid-column: 2 / 7;
  margin: clamp(28px, 3vw, 44px) 0 0;
  font-size: var(--text-meta);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.62);
}
.froghire-interlude-support {
  grid-column: 7 / 11;
  max-width: 68ch;
  margin: clamp(28px, 3vw, 44px) 0 0;
  font-family: var(--font-serif);
  font-size: var(--text-body);
  line-height: 1.62;
  color: rgba(255, 255, 255, 0.76);
}
.froghire-interlude-figure {
  grid-column: 2 / 12;
  margin-top: clamp(48px, 6vw, 84px);
}
.froghire-fig--ink {
  border-color: rgba(255, 255, 255, 0.12);
  background: var(--ink-900);
  aspect-ratio: 16 / 9;
}
.froghire-interlude .froghire-figcap {
  color: rgba(255, 255, 255, 0.55);
}

/* ── the trade ledger ── */
.froghire-ledger {
  padding-top: clamp(96px, 10vw, 150px);
}
.froghire-ledger-label {
  grid-column: 1 / 4;
  margin-bottom: 14px;
}
.froghire-ledger-title {
  grid-column: 1 / 7;
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-heading);
  font-weight: 400;
  line-height: 1.12;
}
.froghire-ledger-table {
  margin-top: clamp(36px, 4vw, 56px);
  border-top: 1px solid var(--ink-950);
}
.froghire-ledger-headrow {
  padding: 14px 0;
  border-bottom: 1px solid var(--work-rule);
}
.froghire-ledger-h {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--froghire-ink-tag);
}
.froghire-ledger-col-case {
  grid-column: 1 / 4;
}
.froghire-ledger-col-proposed {
  grid-column: 4 / 8;
}
.froghire-ledger-col-pushback {
  grid-column: 8 / 11;
}
.froghire-ledger-col-verdict {
  grid-column: 11 / -1;
}
.froghire-ledger-row {
  position: relative;
  align-items: start;
  padding: clamp(24px, 3vw, 40px) 0;
  border-bottom: 1px solid var(--work-rule);
}
.froghire-ledger-row:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
.froghire-ledger-case {
  position: relative;
  display: inline-block;
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.2;
}
.froghire-ledger-case::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 2px;
  background: var(--case-accent);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--dur-gesture) var(--ease-silk);
}
.froghire-ledger-row:hover .froghire-ledger-case::after,
.froghire-ledger-row:focus-visible .froghire-ledger-case::after,
.froghire-ledger-row:focus-within .froghire-ledger-case::after {
  transform: scaleX(1);
}
.froghire-ledger-shipped {
  margin: 14px 0 0;
  max-width: 34ch;
  font-family: var(--font-serif);
  font-size: var(--text-body);
  line-height: 1.55;
  color: var(--froghire-ink-soft);
}
.froghire-ledger-cell {
  margin: 6px 0 0;
  font-size: var(--text-meta);
  line-height: 1.55;
  color: var(--froghire-ink-mute);
}
.froghire-ledger-cell-label {
  display: none;
}
.froghire-ledger-col-verdict .froghire-stamp {
  margin-top: 4px;
}
.froghire-stamp {
  display: inline-block;
  padding: 10px 14px;
  border: 1px solid currentColor;
  color: var(--ink-900);
  font-size: var(--text-label);
  font-weight: 500;
  line-height: 1;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  opacity: 0;
  transform: rotate(-2deg) scale(1.12);
  transition:
    transform 0.55s var(--ease-spring),
    opacity 0.4s var(--ease-standard);
  transition-delay: var(--fro-d, 0ms);
}
.froghire-ledger[data-stamped="true"] .froghire-stamp {
  opacity: 1;
  transform: rotate(-2deg) scale(1);
}
/* the page's single seal-red moment */
.froghire-stamp[data-red="true"] {
  color: var(--seal-red);
}

/* ── closing coda ── */
.froghire-coda {
  margin-top: clamp(96px, 10vw, 150px);
  padding-bottom: clamp(96px, 11vw, 164px);
}
.froghire-coda-inner {
  padding-top: clamp(40px, 5vw, 64px);
  border-top: 1px solid var(--work-rule);
}
.froghire-coda-inner .froghire-index-label {
  grid-column: 1 / 4;
}
.froghire-coda-copy {
  grid-column: 5 / 11;
  max-width: 60ch;
  margin: 0;
  font-size: var(--text-lead);
  line-height: 1.5;
  color: rgba(5, 5, 5, 0.72);
}

/* ── affinity map (SVG voices) ── */
.froghire-cue-row {
  display: flex;
  justify-content: flex-end;
  margin: 0 0 14px;
}
.froghire-map {
  width: 100%;
  height: auto;
}
.froghire-map-note {
  outline: none;
  opacity: 0;
  transform: translateY(8px);
  transform-box: fill-box;
  transition:
    opacity 0.6s var(--ease-reveal),
    transform 0.6s var(--ease-reveal);
  transition-delay: var(--fro-d, 0ms);
}
.froghire-map.is-live .froghire-map-note {
  opacity: 1;
  transform: none;
}
.froghire-map-note rect {
  fill: var(--paper);
  stroke: rgba(5, 5, 5, 0.2);
  transition: stroke var(--dur-fast) var(--ease-standard);
}
.froghire-map-note:hover rect,
.froghire-map-note:focus-visible rect {
  stroke: var(--case-accent);
  stroke-width: 1.5;
}
.froghire-map-note-label {
  font-family: var(--font-sans);
  font-size: 15px;
  fill: rgba(5, 5, 5, 0.8);
}
.froghire-map-note-source {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  fill: rgba(5, 5, 5, 0.45);
}
.froghire-map-path {
  fill: none;
  stroke: rgba(5, 5, 5, 0.25);
  stroke-width: 1;
  opacity: 0;
  transition: opacity 0.8s var(--ease-standard);
  transition-delay: var(--fro-d, 0ms);
}
.froghire-map.is-live .froghire-map-path {
  opacity: 0.9;
}
.froghire-map-path.is-hot {
  stroke: var(--case-accent);
  stroke-width: 1.5;
  opacity: 1;
  transition: none;
}
.froghire-map-slab {
  opacity: 0;
  transition: opacity 0.8s var(--ease-standard);
  transition-delay: var(--fro-d, 0ms);
}
.froghire-map.is-live .froghire-map-slab {
  opacity: 1;
}
.froghire-map-slab rect {
  fill: var(--ink-900);
}
.froghire-map-slab-label {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.08em;
  fill: var(--paper);
}
.froghire-map-slab-count {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  fill: rgba(255, 255, 255, 0.55);
}
.froghire-map.is-settled .froghire-map-note,
.froghire-map.is-settled .froghire-map-path,
.froghire-map.is-settled .froghire-map-slab {
  transition-delay: 0ms;
}

/* ── tablet: 8-col behavior — figures full-width, margin captions below ── */
@media (max-width: 1079.98px) {
  .froghire-kicker {
    order: 1;
  }
  .froghire-hero h1 {
    order: 2;
  }
  .froghire-lede {
    order: 3;
  }
  .froghire-hero-proof {
    order: 4;
  }
  .froghire-meta {
    order: 5;
  }
  .froghire-stats {
    order: 6;
  }
  .froghire-hero h1,
  .froghire-lede,
  .froghire-hero-proof,
  .froghire-triage-label,
  .froghire-triage-copy,
  .froghire-triage-board,
  .froghire-chapter-head h2,
  .froghire-brief-inner h2,
  .froghire-brief-copy,
  .froghire-sec-margin,
  .froghire-sec-copy,
  .froghire-ledger-title,
  .froghire-coda-copy {
    grid-column: 1 / -1;
  }
  .froghire-meta {
    grid-column: 1 / -1;
    grid-row: auto;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--work-grid-gap);
    margin-top: clamp(36px, 5vw, 56px);
  }
  .froghire-hero-proof {
    grid-row: auto;
    max-width: none;
    margin-top: clamp(28px, 4vw, 48px);
  }
  .froghire-brief-inner h2 {
    margin-bottom: 8px;
  }
  .froghire-triage-board {
    margin-top: 8px;
  }
  .froghire-sec-margin {
    margin-bottom: clamp(22px, 3vw, 32px);
  }
  .froghire-marginalia {
    max-width: 52ch;
  }
  .froghire-room-a {
    grid-column: 1 / -1;
  }
  .froghire-room-b {
    grid-column: 1 / -1;
  }
  .froghire-f-a,
  .froghire-f-b,
  .froghire-f-video {
    grid-column: 1 / -1;
  }
  .froghire-c-right,
  .froghire-c-left,
  .froghire-c-below {
    grid-column: 1 / -1;
    grid-row: auto;
    margin-top: 12px;
  }
  .froghire-figrow {
    align-items: start;
  }
  .froghire-interlude-kicker,
  .froghire-interlude blockquote,
  .froghire-interlude-figure {
    grid-column: 1 / -1;
  }
  .froghire-interlude-attr {
    grid-column: 1 / 7;
  }
  .froghire-interlude-support {
    grid-column: 1 / -1;
  }
}

/* ── phone: single reading column ── */
@media (max-width: 809.98px) {
  .froghire-kicker {
    row-gap: 6px;
  }
  .froghire-meta {
    grid-template-columns: 1fr;
  }
  .froghire-stats {
    grid-template-columns: 1fr;
    row-gap: 0;
  }
  .froghire-stat {
    grid-column: 1 / -1;
    padding: 18px 0;
    border-bottom: 1px solid var(--work-rule);
  }
  .froghire-stat:last-child {
    border-bottom: 0;
  }
  .froghire-brief-copy p,
  .froghire-sec-copy p:not(.froghire-sec-tags),
  .froghire-triage-copy p {
    font-size: var(--text-meta);
    line-height: 1.58;
  }
  .froghire-triage-inner {
    padding: 48px 0;
  }
  .froghire-triage-board {
    padding-left: 18px;
  }
  .froghire-triage-step {
    padding-left: 18px;
  }
  .froghire-triage-step-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
  .froghire-triage-step-stat {
    text-align: left;
  }
  .froghire-room-b {
    grid-column: 1 / -1;
  }
  .froghire-fig--map {
    padding: 12px;
  }
  /* ledger rows stack as definition lists */
  .froghire-ledger-headrow {
    display: none;
  }
  .froghire-ledger-row {
    display: block;
  }
  .froghire-ledger-cell {
    margin-top: 18px;
  }
  .froghire-ledger-cell-label {
    display: block;
    margin-bottom: 4px;
    font-family: var(--font-mono);
    font-size: var(--text-micro);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--froghire-ink-tag);
  }
  .froghire-ledger-col-verdict {
    margin-top: 22px;
  }
  .froghire-ledger-shipped {
    max-width: 68ch;
  }
}

/* ── reduced motion: stamps and map render static, wipes stay put ── */
@media (prefers-reduced-motion: reduce) {
  .froghire-stamp {
    opacity: 1 !important;
    transform: rotate(-2deg) !important;
    transition: none !important;
  }
  .froghire-map-note,
  .froghire-map-slab {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .froghire-map-path {
    opacity: 0.9 !important;
    transition: none !important;
  }
  .froghire-ledger-case::after {
    transition: none;
  }
}

/* ── assembly on arrival ──────────────────────────────────────────────────
   Each container carries data-fade; FadeReveal adds .is-visible on enter, so
   the container rises as a frame (global fadeUp) and its parts settle a beat
   later — the chapter rule draws, the claim rises behind it; the hero stats
   stagger up in reading order; each figure caption follows its media. One
   orchestrated reveal per element, then still. Motion-only: every hidden
   initial state lives inside prefers-reduced-motion: no-preference, so reduced
   motion — and the forced-visible/no-JS fallback — shows the finished layout. */
@keyframes frogAssembleRise {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes frogAssembleDraw {
  from { opacity: 0; transform: scaleX(0); }
  to { opacity: 1; transform: scaleX(1); }
}
@keyframes frogAssembleDrawY {
  from { opacity: 0; transform: scaleY(0); }
  to { opacity: 1; transform: scaleY(1); }
}
@keyframes frogProofSettle {
  from { transform: scale(1.04); }
  to { transform: scale(1); }
}
@media (prefers-reduced-motion: no-preference) {
  /* 1 · chapter head — the hairline draws, then the claim rises behind it */
  .froghire-chapter-head[data-fade] .froghire-chapter-rule {
    opacity: 0;
    transform: scaleX(0);
    transform-origin: left;
  }
  .froghire-chapter-head[data-fade] h2 {
    opacity: 0;
    transform: translateY(12px);
  }
  .froghire-chapter-head[data-fade].is-visible .froghire-chapter-rule {
    animation: frogAssembleDraw 0.36s var(--ease-silk) forwards;
    animation-delay: 200ms;
  }
  .froghire-chapter-head[data-fade].is-visible h2 {
    animation: frogAssembleRise 0.42s var(--ease-spring) forwards;
    animation-delay: 320ms;
  }

  /* 2 · hero stats — stagger-rise in reading order (+110ms), opacity-led */
  .froghire-stats[data-fade] .froghire-stat {
    opacity: 0;
    transform: translateY(12px);
  }
  .froghire-stats[data-fade].is-visible .froghire-stat {
    animation: frogAssembleRise 0.42s var(--ease-spring) forwards;
  }
  .froghire-stats[data-fade].is-visible .froghire-stat:nth-child(1) {
    animation-delay: 90ms;
  }
  .froghire-stats[data-fade].is-visible .froghire-stat:nth-child(2) {
    animation-delay: 200ms;
  }
  .froghire-stats[data-fade].is-visible .froghire-stat:nth-child(3) {
    animation-delay: 310ms;
  }

  /* 2b - triage spine: the rail draws, then the work steps settle */
  .froghire-triage-board[data-fade]::before {
    opacity: 0;
    transform: scaleY(0);
  }
  .froghire-triage-board[data-fade] .froghire-triage-step {
    opacity: 0;
    transform: translateY(12px);
  }
  .froghire-triage-board[data-fade].is-visible::before {
    animation: frogAssembleDrawY 0.48s var(--ease-silk) forwards;
    animation-delay: 140ms;
  }
  .froghire-triage-board[data-fade].is-visible .froghire-triage-step {
    animation: frogAssembleRise 0.46s var(--ease-spring) forwards;
    animation-delay: calc(260ms + var(--fro-d, 0ms));
  }

  .froghire-hero-proof[data-fade].is-visible img {
    animation: frogProofSettle 1.2s var(--ease-silk) forwards;
  }

  /* 3 · figure caption follows its media — the media rides the parent fade,
     only the caption is delayed */
  .froghire-figrow[data-fade] .froghire-figcap {
    opacity: 0;
    transform: translateY(12px);
  }
  .froghire-figrow[data-fade].is-visible .froghire-figcap {
    animation: frogAssembleRise 0.42s var(--ease-spring) forwards;
    animation-delay: 150ms;
  }
}
`;

/* ── layout ─────────────────────────────────────────────────────────────── */

export function FroghireCaseLayout({ project }: { project: Project }) {
  const [ch1, ch2] = project.chapters ?? [];
  const reels = project.moment?.videos ?? [];
  const wideReel = reels.find((v) => v.wide);
  const [walkthroughReel, extensionReel] = reels.filter((v) => !v.wide);
  const mentorLine = project.moment?.body?.[1];
  const lesson = project.moment?.body?.[2];

  const meta: Array<[string, string]> = [
    ["Role", project.role],
    ["Duration", "3 months · Summer 2025"],
    ["Type", project.type],
    ["Team", project.teams],
  ];

  const stats = [
    { num: "~100", idx: "01", cap: "Bugs logged as QA of record" },
    { num: "3", idx: "02", cap: "Systemic flaws diagnosed" },
    { num: "Recovered", idx: "03", cap: "Signup registrations" },
  ];

  return (
    <article className="froghire-case-page">
      <style dangerouslySetInnerHTML={{ __html: froghireCss + ICUE_CSS }} />

      {/* ── docket hero ── */}
      <section className="froghire-hero froghire-shell froghire-grid" id="header">
        <p className="froghire-kicker froghire-label" data-fade>
          <span>Case study · UX internship · Summer 2025</span>
          <span>FrogHire.ai</span>
        </p>
        <h1 data-fade>{project.title}</h1>
        <dl className="froghire-meta" data-fade>
          {meta.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="froghire-lede" data-fade>
          A summer of triage on an early-stage AI job-matching product —
          turning bug reports and one-star reviews back into user trust.
        </p>
        <div className="froghire-stats" data-fade>
          {stats.map((s) => (
            <div className="froghire-stat" key={s.idx}>
              <p className="froghire-stat-num">{s.num}</p>
              <p className="froghire-stat-cap">
                <span className="froghire-fig-index">{s.idx}</span>
                {s.cap}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── the operating model: overview + triage spine, one section ── */}
      <section
        className="froghire-triage froghire-shell"
        aria-labelledby="froghire-triage-title"
      >
        <div className="froghire-grid froghire-triage-inner">
          <p className="froghire-index-label froghire-triage-label" data-fade>
            The operating model
          </p>
          <div className="froghire-triage-copy" data-fade>
            <h2 id="froghire-triage-title">
              Trust was the real backlog.
            </h2>
            {(project.summary ?? [project.blurb]).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div
            className="froghire-triage-board"
            data-fade
            role="list"
            aria-label="The FrogHire triage flow from complaints to shipped fixes"
          >
            {TRIAGE_FLOW.map((step, i) => (
              <article
                className="froghire-triage-step"
                key={step.index}
                role="listitem"
                style={{ "--fro-d": `${i * 90}ms` } as CSSProperties}
              >
                <div className="froghire-triage-step-head">
                  <span className="froghire-triage-step-label">
                    <span>{step.index}</span>
                    {step.label}
                  </span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── the product in two rooms ── */}
      <section
        className="froghire-rooms froghire-shell froghire-grid"
        aria-label="The product in two rooms"
      >
        <figure className="froghire-figure froghire-room-a" data-fade>
          <div className="froghire-fig">
            {project.cover && (
              <Image
                src={project.cover}
                alt="The FrogHire web dashboard: job manage board with status tabs for viewed, applied and interviewing roles"
                fill
                priority
                sizes="(max-width: 1079px) 100vw, 62vw"
                style={{ objectFit: "cover", objectPosition: "left top" }}
              />
            )}
          </div>
          <FigCaption index="01">
            The web dashboard — jobs, resumes, subscription
          </FigCaption>
        </figure>
        <figure className="froghire-figure froghire-room-b" data-fade>
          <div className="froghire-fig">
            {extensionReel && (
              <OffscreenVideo
                src={extensionReel.src}
                className="froghire-fig-media"
                aria-label="Screen recording of the FrogHire Chrome extension open on a LinkedIn job posting"
              />
            )}
          </div>
          <FigCaption index="02">
            The Chrome extension, in place on a LinkedIn posting
          </FigCaption>
        </figure>
      </section>

      {/* ── chapter 01: diagnosis ── */}
      {ch1 && (
        <section className="froghire-shell" aria-label={ch1.number}>
          <header className="froghire-grid froghire-chapter-head" data-fade>
            <p className="froghire-index-label">{chapterIndex(ch1.number)}</p>
            <div className="froghire-chapter-rule" />
            <h2>{stripQuotes(ch1.title)}</h2>
          </header>

          {ch1.sections[0] && (
            <Sec chapter={0} section={ch1.sections[0]} index={0}>
              <figure className="froghire-figrow" data-fade>
                <div className="froghire-fig froghire-fig--auto froghire-f-a">
                  {ch1.sections[0].image && (
                    <Image
                      src={ch1.sections[0].image}
                      alt="FrogHire's feature surface at kickoff, page by page"
                      width={2412}
                      height={1365}
                      sizes="(max-width: 1079px) 100vw, 72vw"
                    />
                  )}
                </div>
                <FigCaption index="03" className="froghire-c-right">
                  The feature surface at kickoff — many features, stitched
                  together page by page
                </FigCaption>
              </figure>
            </Sec>
          )}

          {ch1.sections[1] && (
            <Sec chapter={0} section={ch1.sections[1]} index={1}>
              <figure className="froghire-figrow" data-fade>
                <FigCaption index="04" className="froghire-c-left">
                  Pain points clustered from the weekly test passes —
                  subscriptions, resumes, recommendations
                </FigCaption>
                <div className="froghire-fig froghire-fig--auto froghire-f-b">
                  {ch1.sections[1].image && (
                    <Image
                      src={ch1.sections[1].image}
                      alt="Summary board of user pain points found in weekly usability passes"
                      width={1914}
                      height={1062}
                      sizes="(max-width: 1079px) 100vw, 74vw"
                    />
                  )}
                </div>
              </figure>
            </Sec>
          )}

          {ch1.sections[2] && (
            <Sec chapter={0} section={ch1.sections[2]} index={2}>
              <figure className="froghire-figrow" data-fade>
                <div className="froghire-fig froghire-fig--auto froghire-f-full">
                  {ch1.sections[2].image && (
                    <Image
                      src={ch1.sections[2].image}
                      alt="Resume tutorial benchmark showing onboarding, in-context feature education, and feedback states"
                      width={2752}
                      height={1536}
                      sizes="100vw"
                    />
                  )}
                </div>
                <FigCaption index="05" className="froghire-c-below">
                  Resume tutorial benchmark — instant launch, contextual
                  teaching, and feedback after the tour
                </FigCaption>
              </figure>
            </Sec>
          )}

          {ch1.sections[3] && (
            <Sec chapter={0} section={ch1.sections[3]} index={3}>
              <figure className="froghire-figrow" data-fade>
                <div className="froghire-fig froghire-fig--map froghire-f-full">
                  <p className="froghire-cue-row">
                    <InteractiveCue accent="#5ac75a">
                      Hover a complaint to trace it to a flaw
                    </InteractiveCue>
                  </p>
                  <FroghireAffinityMap />
                </div>
                <FigCaption index="06" className="froghire-c-below">
                  Six complaints from the bug log, converging into three
                  systemic flaws
                </FigCaption>
              </figure>
            </Sec>
          )}
        </section>
      )}

      {/* ── interlude: the mentor's line ── */}
      {mentorLine && (
        <aside
          className="froghire-interlude froghire-shell froghire-grid"
          aria-label="The moment"
        >
          <p className="froghire-interlude-kicker" data-fade>
            The moment
          </p>
          <blockquote data-fade>
            <p>“{extractQuote(mentorLine)}”</p>
          </blockquote>
          <p className="froghire-interlude-attr" data-fade>
            — my mentor, mid-standoff over onboarding
          </p>
          {lesson && (
            <p className="froghire-interlude-support" data-fade>
              {lesson}
            </p>
          )}
          {wideReel && (
            <figure className="froghire-figure froghire-interlude-figure" data-fade>
              <div className="froghire-fig froghire-fig--ink">
                <OffscreenVideo
                  src={wideReel.src}
                  className="froghire-fig-media"
                  aria-label="Screen recording of the FrogHire product in motion"
                />
              </div>
              <FigCaption index="07">
                The product we were fighting over, in motion
              </FigCaption>
            </figure>
          )}
        </aside>
      )}

      {/* ── chapter 02: negotiation ── */}
      {ch2 && (
        <section className="froghire-shell" aria-label={ch2.number}>
          <header className="froghire-grid froghire-chapter-head" data-fade>
            <p className="froghire-index-label">{chapterIndex(ch2.number)}</p>
            <div className="froghire-chapter-rule" />
            <h2>{stripQuotes(ch2.title)}</h2>
          </header>

          {ch2.sections[0] && (
            <Sec chapter={1} section={ch2.sections[0]} index={0}>
              <figure className="froghire-figrow" data-fade>
                <FigCaption index="08" className="froghire-c-left">
                  The tooltip onboarding that shipped — lightweight,
                  imperfect, alive
                </FigCaption>
                <div className="froghire-fig froghire-fig--1610 froghire-f-b">
                  {ch2.sections[0].image && (
                    <Image
                      src={ch2.sections[0].image}
                      alt="The shipped tooltip onboarding on the FrogHire dashboard"
                      fill
                      sizes="(max-width: 1079px) 100vw, 74vw"
                      style={{ objectFit: "cover", objectPosition: "50% 62%" }}
                    />
                  )}
                </div>
              </figure>
            </Sec>
          )}

          {ch2.sections[1] && (
            <Sec chapter={1} section={ch2.sections[1]} index={1}>
              <figure className="froghire-figrow" data-fade>
                <div className="froghire-fig froghire-fig--1610 froghire-f-a">
                  {ch2.sections[1].image && (
                    <Image
                      src={ch2.sections[1].image}
                      alt="The redesigned subscription, resume and filter screens"
                      fill
                      sizes="(max-width: 1079px) 100vw, 72vw"
                      style={{ objectFit: "cover", objectPosition: "50% 45%" }}
                    />
                  )}
                </div>
                <FigCaption index="09" className="froghire-c-right">
                  The subscription page — price shipped, timeframes cut
                </FigCaption>
              </figure>
            </Sec>
          )}

          {ch2.sections[2] && (
            <Sec chapter={1} section={ch2.sections[2]} index={2}>
              <figure className="froghire-figrow" data-fade>
                <FigCaption index="10" className="froghire-c-left">
                  Walking the shipped build, flow by flow
                </FigCaption>
                <div className="froghire-fig froghire-fig--169 froghire-f-video">
                  {walkthroughReel && (
                    <OffscreenVideo
                      src={walkthroughReel.src}
                      className="froghire-fig-media"
                      aria-label="Screen recording walking through the shipped FrogHire dashboard"
                    />
                  )}
                </div>
              </figure>
              <figure className="froghire-figrow" data-fade>
                <div className="froghire-fig froghire-fig--219 froghire-f-full">
                  {ch2.sections[2].image && (
                    <Image
                      src={ch2.sections[2].image}
                      alt="Screens from the QA log of nearly one hundred issues"
                      fill
                      sizes="100vw"
                      style={{ objectFit: "cover", objectPosition: "50% 0%" }}
                    />
                  )}
                </div>
                <FigCaption index="11" className="froghire-c-below">
                  Part of the ~100-issue QA log
                </FigCaption>
              </figure>
            </Sec>
          )}

          {ch2.sections[3] && (
            <Sec chapter={1} section={ch2.sections[3]} index={3}>
              <figure className="froghire-figrow" data-fade>
                <FigCaption index="12" className="froghire-c-left">
                  Sprint review — PM, CEO, mentor, designer around the same
                  table
                </FigCaption>
                <div className="froghire-fig froghire-fig--169 froghire-f-b">
                  {ch2.sections[3].image && (
                    <Image
                      src={ch2.sections[3].image}
                      alt="Illustration of the sprint review: PM, CEO, mentor and designer"
                      fill
                      sizes="(max-width: 1079px) 100vw, 74vw"
                      style={{ objectFit: "cover", objectPosition: "50% 38%" }}
                    />
                  )}
                </div>
              </figure>
            </Sec>
          )}
        </section>
      )}

      {/* ── the trade ledger ── */}
      <FroghireTradeLedger />

      {/* ── closing: what survived ── */}
      <section className="froghire-coda froghire-shell" aria-label="What survived">
        <div className="froghire-grid froghire-coda-inner">
          <p className="froghire-index-label" data-fade>
            What survived
          </p>
          <p className="froghire-coda-copy" data-fade>
            Registration recovered, the product kept moving — and sometimes
            keeping the product alive is the most meaningful design you can
            deliver.
          </p>
        </div>
      </section>
    </article>
  );
}
