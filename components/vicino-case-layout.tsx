import Image from "next/image";
import Link from "next/link";
import { adjacent, type Project } from "@/data/projects";
import { OffscreenVideo } from "./ui/offscreen-video";
import { VicinoFlowStrip } from "./vicino-flow-strip";
import { VicinoModelBoard } from "./vicino-model-board";
import { VicinoWorkflowCanvas } from "./vicino-workflow-canvas";

const SEAL_SRC = "/assets/framerusercontent.com/images/ntwL7wUkSslvYCLMnzXaIuQu8zU.png";

// Render-level fact refresh grounded in the owner's own zoning vocabulary
// (the "Detail PDR" board figured in station 04): the generic "sidebars"
// phrasing becomes the design model's named layers. data/projects.ts is
// orchestrator-owned; the matching data edit is reported for the batched
// pass.
function refreshFacts(copy: string) {
  return copy.split("editor logic, sidebars, sliding panels").join(
    "editor logic, the Sidebar and Floating Bar layers, sliding panels",
  );
}

// Figcaptions for the prototype reels. The a teammate credit is render-filtered
// out of the closing moment (body[3] in data/projects.ts) and lives here as
// evidence metadata instead.
const reelCaptions = [
  "Sliding-panel structure — React prototype",
  "Sidebar-only previous version",
  "Video 2 Node prototype — a teammate",
];

// Station-04 evidence ledger: the chapter decisions, tightened. Rows whose
// argument the station-03 interactive now carries are dropped per the
// redundancy rule (the main-path row = the checkpoints, the four-layers row
// = the rooms); the previously unrendered prototype section supplies the
// station intro, and the design-system section joins the ledger. `body`
// picks the paragraphs that do not restate the interactive or the heading.
const evidenceRows: Array<{ section: number; body: number[] }> = [
  { section: 1, body: [0] },
  { section: 3, body: [0] },
  { section: 4, body: [0, 1] },
  { section: 7, body: [0, 1] },
];

// Chapter-2 headings arrive Title Cased; the decision claims read as
// sentence-case editorial claims (family rule), so normalize at render time
// instead of editing data/projects.ts.
const KEEP_CAPS = new Set([
  "I",
  "AI",
  "3D",
  "PM",
  "PMs",
  "React",
  "Vicino",
  "Script",
  "Storyboard",
  "Image",
  "Video",
]);

function sentenceCase(heading: string) {
  return heading
    .split(" ")
    .map((word, index) => {
      if (index === 0) return word;
      const base = word.replace(/[^A-Za-z0-9'']/g, "");
      if (KEEP_CAPS.has(base)) return word;
      if (/^[A-Z][a-z]/.test(word)) return word.charAt(0).toLowerCase() + word.slice(1);
      return word;
    })
    .join(" ");
}

const vicinoCriticalCss = `
.vicino-case-page {
  /* ------------------------------------------------------------------
     Type ladder: the old private --vicino-h1..detail ladder is retired
     and mapped onto the global role tokens:
       --vicino-h1     -> --text-display-2  (hero H1, condensed)
       --vicino-h2     -> --text-display-3  (station H2 claims, condensed)
       --vicino-h3     -> --text-title      (station names, layer titles)
                          --text-heading    (decision sentence-claims, moment)
       --vicino-h4     -> --text-body @ 500 (flow claim lines)
       --vicino-body   -> --text-body
       --vicino-small  -> --text-meta
       --vicino-detail -> --text-label / --text-micro
     Measured exception: the node anatomy inside the workflow canvas is a
     recreation of Vicino's product UI and keeps its own 14/12/10px ladder
     (product type does not map onto the portfolio role tokens).
     ------------------------------------------------------------------ */
  --vicino-section-max: 1440px;
  --vicino-reading-max: 68ch;
  --vicino-node-body: 14px;
  --vicino-node-small: 12px;
  --vicino-node-detail: 10px;
  --v-line: rgba(255, 255, 255, 0.18);
  --v-line-soft: rgba(255, 255, 255, 0.14);
  --v-body-ink: rgba(255, 255, 255, 0.85);
  --v-meta-ink: rgba(255, 255, 255, 0.64);
  --v-margin: clamp(20px, 5vw, 82px);
  --v-gutter: clamp(18px, 2vw, 28px);
  --v-pad-top: clamp(64px, 8vw, 128px);
  --v-pad-bottom: clamp(80px, 9vw, 152px);
  --v-head-gap: clamp(40px, 5vw, 64px);
  /* exact shipped connection colors — src/core/connections/the connection types */
  --handle-text: #F1A0FA;
  --handle-image: #6EDDB3;
  --handle-storyboard: #6EDDB3;
  --handle-video: #FFB347;
  --node-header-bg: #0b0b0d;
  --node-header-border: #333;
  --node-header-label-color: #F5F5F7;
  --node-header-badge-bg: rgba(255, 255, 255, 0.10);
  --node-header-badge-text: rgba(255, 255, 255, 0.80);
  --glass-border: rgba(255, 255, 255, 0.20);
  --glass-btn-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.30),
    inset 0 -1px 0 rgba(255, 255, 255, 0.06);
  --play-btn-glass-bg: rgba(255, 255, 255, 0.10);
  --play-btn-glass-bg-hover: rgba(255, 255, 255, 0.18);
  --node-header-play-btn-bg: rgba(255, 255, 255, 0.06);
  --node-header-play-btn-icon-color: #F5F5F7;
  --node-shell-bg: #0b0b0d;
  --node-shell-radius: 16px;
  --node-shell-shadow: 0 4px 8px rgba(0, 0, 0, 0.12), 0 12px 24px rgba(0, 0, 0, 0.18);
  --node-shell-selected-shadow: 0 18px 44px rgba(0, 0, 0, 0.55);
  --node-shell-edge: linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
  --text-node-textarea-text: #F5F5F7;
  --image-node-card-bg: #0b0b0d;
  --image-node-card-border: rgba(255, 255, 255, 0.07);
  --image-node-prompt-input-bg: #303030;
  --image-node-toolbar-btn-text: #D9D9D9;
  --video-node-card-bg: #0b0b0d;
  --video-node-card-border: rgba(255, 255, 255, 0.07);
  --video-node-card-selected-border: rgba(255, 255, 255, 0.5);
  --video-node-video-area-bg: #0b0b0d;
  --video-node-stage-bg: #0b0b0d;
  --vicino-node-text: var(--node-header-label-color);
  background: var(--ink-950);
  color: var(--paper);
  overflow: hidden;
}
.vicino-case-page p {
  text-wrap: pretty;
}
.vicino-case-page img,
.vicino-case-page video {
  display: block;
}

/* ---- shell: hero + stations share one 12-col grid ---- */
.vicino-hero,
.vicino-station {
  box-sizing: border-box;
  width: min(100%, var(--vicino-section-max));
  margin-inline: auto;
  padding-left: var(--v-margin);
  padding-right: var(--v-margin);
}
.vicino-station {
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--v-gutter);
  align-content: start;
  align-items: start;
  padding-top: var(--v-pad-top);
  padding-bottom: var(--v-pad-bottom);
}

/* Chain rail: the canvas's dashed dataflow edge carried down the column-1
   left edge from station 01 to the closing seal. Static by design. */
.vicino-station::before {
  content: "";
  position: absolute;
  left: var(--v-margin);
  top: 0;
  bottom: 0;
  width: 1px;
  background: repeating-linear-gradient(
    to bottom,
    color-mix(in srgb, var(--accent-gold) 30%, transparent) 0 7px,
    transparent 7px 16px
  );
  pointer-events: none;
}
.vicino-closing::before {
  bottom: auto;
  height: calc(var(--v-pad-top) - 12px);
}

.vicino-station-rule {
  display: block;
  grid-column: 1 / -1;
  height: 1px;
  background: var(--v-line);
  margin-bottom: 24px;
}
.vicino-station-index {
  position: relative;
  grid-column: 1 / span 3;
  align-self: start;
  margin: 0 0 16px;
  padding-left: 18px;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--accent-gold);
}
.vicino-station-index::before {
  /* node-handle-shaped tick marking the station on the rail */
  content: "";
  position: absolute;
  left: -3px;
  top: -2px;
  width: 6px;
  height: 26px;
  border-radius: 2px 4px 4px 2px;
  background: rgba(255, 255, 255, 0.4);
}
.vicino-station h2 {
  margin: 0;
  font-family: var(--font-condensed);
  font-size: var(--text-display-3);
  font-weight: 300;
  line-height: 1.04;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  text-wrap: balance;
  color: var(--paper);
}
.vicino-row-index {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--accent-gold);
}
.vicino-body-copy {
  margin: 0;
  max-width: var(--vicino-reading-max);
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: 300;
  line-height: 1.6;
  color: var(--v-body-ink);
}

/* ---- hero — station 00, canvas first ---- */
.vicino-hero {
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--v-gutter);
  row-gap: clamp(44px, 5vw, 72px);
  align-items: start;
  padding-top: clamp(126px, 10vw, 172px);
  padding-bottom: clamp(64px, 7vw, 104px);
  background: var(--ink-950);
}
.vicino-hero-copy {
  grid-column: 1 / span 5;
  min-width: 0;
}
.vicino-hero h1 {
  margin: 0;
  font-family: var(--font-condensed);
  font-size: var(--text-display-2);
  font-weight: 300;
  line-height: 0.92;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: var(--paper);
}
.vicino-hero-deck {
  max-width: 440px;
  margin: clamp(18px, 2.2vw, 28px) 0 0;
  font-family: var(--font-sans);
  font-size: var(--text-lead);
  font-weight: 300;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.76);
}
.vicino-hero-meta {
  grid-column: 8 / -1;
  align-self: center;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 2.4vw, 34px);
  margin: 0;
}
.vicino-hero-meta div {
  display: grid;
  gap: 8px;
  align-content: start;
  min-width: 0;
}
.vicino-hero-meta dt {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--accent-gold);
}
.vicino-hero-meta dd {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--text-meta);
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.86);
}
.vicino-system-board {
  grid-column: 1 / -1;
  min-width: 0;
}

/* ---- live workflow canvas ---- */
.vicino-live-canvas {
  position: relative;
  width: 100%;
  aspect-ratio: 1360 / 620;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--accent-gold) 24%, rgba(255,255,255,0.14));
  background: #050506;
  box-shadow: 0 30px 92px rgba(0,0,0,0.38);
  touch-action: none;
  container-type: inline-size;
}
.vicino-live-canvas img {
  position: static !important;
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: cover;
}
.vicino-live-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.34) 1px, transparent 1.5px);
  background-size: 28px 28px;
  opacity: 0.3;
}
/* 1360x620 stage scaled to the container width. The atan2/tan division is
   the exact fit; the stepped @container rules below are the fallback. */
.vicino-live-stage {
  position: absolute;
  left: 50%;
  top: 0;
  width: 1360px;
  height: 620px;
  transform: translateX(-50%) scale(0.26);
  transform-origin: top center;
}
@container (min-width: 420px) {
  .vicino-live-stage { transform: translateX(-50%) scale(0.3); }
}
@container (min-width: 520px) {
  .vicino-live-stage { transform: translateX(-50%) scale(0.37); }
}
@container (min-width: 640px) {
  .vicino-live-stage { transform: translateX(-50%) scale(0.46); }
}
@container (min-width: 760px) {
  .vicino-live-stage { transform: translateX(-50%) scale(0.55); }
}
@container (min-width: 880px) {
  .vicino-live-stage { transform: translateX(-50%) scale(0.63); }
}
@container (min-width: 1000px) {
  .vicino-live-stage { transform: translateX(-50%) scale(0.72); }
}
@container (min-width: 1120px) {
  .vicino-live-stage { transform: translateX(-50%) scale(0.81); }
}
@container (min-width: 1240px) {
  .vicino-live-stage { transform: translateX(-50%) scale(0.9); }
}
@container (min-width: 1340px) {
  .vicino-live-stage { transform: translateX(-50%) scale(0.97); }
}
@supports (transform: scale(calc(tan(atan2(100cqw, 1360px))))) {
  .vicino-live-stage {
    transform: translateX(-50%) scale(calc(tan(atan2(100cqw, 1360px))));
  }
}
.vicino-live-edges {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}
.vicino-live-edges path {
  fill: none;
  stroke-width: 1.6;
  stroke-linecap: round;
  opacity: 0.46;
}
.vicino-story-edge {
  stroke-dasharray: 7 9;
  animation: vicino-story-edge-flow 8.4s linear infinite;
}
/* STORYBOARD connections ship heavier than the default edge
   (strokeWidth 3 vs 2 in the connection types) — same ratio at
   recreation stroke scale. */
.vicino-live-edges path.is-storyboard {
  stroke-width: 2.4;
}
.vicino-story-edge.is-text {
  animation-delay: 0s;
}
.vicino-story-edge.is-storyboard {
  animation-delay: 2s;
}
.vicino-story-edge.is-image {
  animation-delay: 4.3s;
}
.vicino-story-edge.is-video {
  animation-delay: 4.3s;
}
@keyframes vicino-story-edge-flow {
  0% {
    opacity: 0.16;
    stroke-dashoffset: 48;
  }
  18%,
  74% {
    opacity: 0.7;
  }
  100% {
    opacity: 0.16;
    stroke-dashoffset: 0;
  }
}
.vicino-live-caption {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 14px;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--stone);
  pointer-events: none;
}

/* ---- product nodes (recreation of Vicino's shipped node components) ---- */
.vicino-product-node {
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible;
  cursor: grab;
  user-select: none;
  will-change: transform;
}
.vicino-product-node:active {
  cursor: grabbing;
}
.vicino-product-node:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
  border-radius: var(--node-shell-radius);
}
.vicino-product-node-shell {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border: 1px solid var(--image-node-card-border);
  border-radius: var(--node-shell-radius);
  background: var(--node-shell-bg);
  box-shadow: var(--node-shell-shadow);
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.2s ease;
}
/* Per-kind card surfaces and borders — the shipped values:
   the script-node styles (near-black card, #404040 border), the storyboard-node styles
   (2px teal multiview border), the shot-node styles and VideoNode (hairline
   white 0.07). */
.vicino-product-node.is-script .vicino-product-node-shell {
  border: 1px solid #404040;
  background: rgba(0, 0, 0, 0.9);
}
.vicino-product-node.is-storyboard .vicino-product-node-shell {
  border: 2px solid rgba(139, 214, 217, 0.5);
  background: var(--image-node-card-bg);
}
.vicino-product-node.is-shoot .vicino-product-node-shell {
  border: 1px solid var(--image-node-card-border);
  background: var(--image-node-card-bg);
}
.vicino-product-node.is-video .vicino-product-node-shell {
  border: 1px solid var(--video-node-card-border);
  background: var(--video-node-card-bg);
}
/* Hover + selection borders — the shipped selection language
   (script rgba(232,232,232,.9); storyImage #8BD6D9; shoot teal 0.6;
   video white 0.5) with the shared selected shadow. */
.vicino-product-node.is-script:hover .vicino-product-node-shell {
  border-color: #555555;
}
.vicino-product-node.is-shoot:hover .vicino-product-node-shell,
.vicino-product-node.is-video:hover .vicino-product-node-shell {
  border-color: rgba(255, 255, 255, 0.28);
}
.vicino-product-node.is-storyboard:hover .vicino-product-node-shell {
  border-color: #8BD6D9;
}
.vicino-product-node.is-script.is-open .vicino-product-node-shell {
  border-color: rgba(232, 232, 232, 0.9);
  box-shadow: var(--node-shell-selected-shadow);
}
.vicino-product-node.is-storyboard.is-open .vicino-product-node-shell {
  border-color: #8BD6D9;
  box-shadow: var(--node-shell-selected-shadow);
}
.vicino-product-node.is-shoot.is-open .vicino-product-node-shell {
  border-color: rgba(139, 214, 217, 0.6);
  box-shadow: var(--node-shell-selected-shadow);
}
.vicino-product-node.is-video.is-open .vicino-product-node-shell {
  border-color: var(--video-node-card-selected-border);
  box-shadow: var(--node-shell-selected-shadow);
}
.vicino-product-node-shell::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--node-shell-edge);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  padding: 2px;
  pointer-events: none;
}
.vicino-product-node.is-storyboard .vicino-product-node-shell::after {
  content: none;
}
.vicino-product-node-header {
  position: relative;
  z-index: 20;
  display: flex;
  height: 53px;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 10px;
  padding: 0 16px;
  border-radius: 16px 16px 0 0;
  border-bottom: 1px solid var(--node-header-border);
  background: var(--node-header-bg);
}
/* ScriptNode ships its own compact 42px transparent header
   (the script-node styles .script-node-header); the other three use the shared
   node-header with its #333 bottom rule. */
.vicino-product-node.is-script .vicino-product-node-header {
  height: 42px;
  padding: 10px 8px 8px;
  background: transparent;
  border-bottom: none;
  border-radius: 0;
}
.vicino-product-node.is-script .vicino-product-node-label-row p {
  color: rgba(255, 255, 255, 0.92);
}
.vicino-product-node.is-script .vicino-product-node-right button {
  width: 26px;
  height: 26px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(24, 24, 24, 0.96);
}
.vicino-product-node-label-row {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 6px;
  max-width: 100%;
}
.vicino-product-node.is-storyboard .vicino-product-node-label-row,
.vicino-product-node.is-video .vicino-product-node-label-row {
  max-width: calc(100% - 48px);
}
.vicino-product-node-label-group {
  all: unset;
  display: flex;
  min-width: 0;
  max-width: 100%;
  align-items: center;
  gap: 8px;
  cursor: inherit;
}
.vicino-product-node-label-row p {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  margin: 0;
  color: var(--node-header-label-color);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-body);
  font-weight: 600;
  letter-spacing: 0;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vicino-product-node-left-icon {
  display: flex;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0;
  color: var(--node-header-label-color);
  background: transparent;
  transform: translateY(1px);
}
.vicino-product-node-right {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
}
.vicino-product-node-right > span {
  display: flex;
  padding: 4px 8px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 4px;
  background: var(--node-header-badge-bg);
}
.vicino-product-node-right > span > span {
  color: var(--node-header-badge-text);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  font-weight: 600;
  letter-spacing: 0;
  line-height: normal;
}
.vicino-product-node-right button {
  display: grid;
  width: 32px;
  height: 28px;
  padding: 8px;
  place-items: center;
  border: 1px solid transparent;
  border-radius: 8px;
  background: var(--node-header-play-btn-bg);
  box-shadow: var(--glass-btn-shadow);
  color: var(--node-header-play-btn-icon-color);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.vicino-product-node-right button span {
  width: 0;
  height: 0;
  margin-left: 2px;
  border-bottom: 6px solid transparent;
  border-left: 9px solid currentColor;
  border-top: 6px solid transparent;
}
.vicino-product-handle {
  position: absolute;
  top: calc(var(--output-y, 50%) - 13px);
  z-index: 2;
  width: 6px;
  height: 26px;
  border: 1px solid var(--handle-color);
  background: var(--handle-color);
  box-shadow: none;
}
.vicino-product-handle.is-left {
  left: -6px;
  top: calc(var(--input-y, 50%) - 13px);
  border-radius: 4px 2px 2px 4px;
}
.vicino-product-handle.is-right {
  right: -6px;
  border-radius: 2px 4px 4px 2px;
}
.vicino-story-icon-lines,
.vicino-story-icon-grid,
.vicino-story-icon-video,
.vicino-story-icon-camera {
  position: relative;
  display: block;
  width: 10px;
  height: 10px;
}
.vicino-story-icon-lines,
.vicino-story-icon-lines::before,
.vicino-story-icon-lines::after {
  border-top: 1px solid currentColor;
}
.vicino-story-icon-lines::before,
.vicino-story-icon-lines::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
}
.vicino-story-icon-lines::before {
  top: 4px;
}
.vicino-story-icon-lines::after {
  top: 8px;
}
.vicino-story-icon-video {
  width: 0;
  height: 0;
  border-bottom: 5px solid transparent;
  border-left: 8px solid currentColor;
  border-top: 5px solid transparent;
}
.vicino-story-icon-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
}
.vicino-story-icon-grid::before,
.vicino-story-icon-grid::after {
  content: "";
  display: block;
  width: 4px;
  height: 4px;
  border: 1px solid currentColor;
  box-shadow: 6px 0 0 -1px rgba(0,0,0,0), 0 6px 0 -1px rgba(0,0,0,0);
}
.vicino-story-icon-camera {
  width: 12px;
  height: 8px;
  border: 1px solid currentColor;
  border-radius: 2px;
}
.vicino-story-icon-camera::before {
  content: "";
  position: absolute;
  left: 3px;
  top: -3px;
  width: 5px;
  height: 2px;
  border: 1px solid currentColor;
  border-bottom: 0;
  border-radius: 2px 2px 0 0;
}
.vicino-story-icon-camera::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 2px;
  width: 3px;
  height: 3px;
  border: 1px solid currentColor;
  border-radius: 50%;
}
.vicino-script-node-body,
.vicino-storyboard-node-body,
.vicino-shoot-node-body,
.vicino-video-output-node-body {
  padding: 0 16px 16px;
  pointer-events: none;
}
.vicino-storyboard-node-body,
.vicino-video-output-node-body {
  display: flex;
  height: calc(100% - 53px);
  flex-direction: column;
  min-height: 0;
}
.vicino-video-output-node-body {
  padding: 5px 8px 8px;
  background: var(--video-node-video-area-bg);
  border-radius: 0 0 16px 16px;
}
.vicino-script-node-body {
  display: flex;
  height: calc(100% - 42px);
  flex-direction: column;
  gap: 8px;
  padding: 0 12px 12px;
}
/* ScriptNode scene cards — the scenes column, compacted to two cards */
.vicino-script-scene-card {
  display: grid;
  gap: 6px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  background: rgba(48, 48, 48, 0.28);
}
.vicino-script-scene-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.vicino-script-scene-head strong {
  color: #F5F5F7;
  font-family: var(--font-sans);
  font-size: var(--vicino-node-small);
  font-weight: 600;
  letter-spacing: 0;
}
.vicino-script-scene-head span {
  color: rgba(255, 255, 255, 0.42);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  letter-spacing: 0;
}
.vicino-script-scene-card p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: 0;
}
.vicino-script-scene-more {
  margin: auto 0 0;
  color: rgba(255, 255, 255, 0.4);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  letter-spacing: 0;
}
/* StoryImageNode scenes — the always-2-rows grid (story-scenes-container:
   3 cols x 2 rows, 12px/5px gap) of glass scene blocks, each with the
   numbered green circle header. */
.vicino-storyboard-node-body {
  padding: 0;
}
.vicino-storyboard-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 12px 5px;
  flex: 1;
  min-height: 0;
  padding: 4px 16px 16px;
}
.vicino-storyboard-scene-block {
  display: flex;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 8px;
  background: rgba(35, 35, 35, 0.3);
  box-shadow: var(--glass-btn-shadow);
}
.vicino-storyboard-scene-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 5px;
  padding: 5px 7px;
}
.vicino-storyboard-scene-num {
  display: flex;
  width: 15px;
  height: 15px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--handle-storyboard);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0;
}
.vicino-storyboard-scene-label {
  overflow: hidden;
  color: #F5F5F7;
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  font-weight: 600;
  letter-spacing: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.vicino-storyboard-scene-img {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.vicino-storyboard-scene-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.08);
  opacity: 0.88;
}
/* ShootNode — one shot sub-card with its labeled First Frame and Video
   Prompt boxes (the shot-node styles: glass shot card, --glass-border boxes,
   11px/600 box labels). */
.vicino-shoot-node-body {
  display: flex;
  height: calc(100% - 53px);
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 12px 12px;
  background: var(--image-node-card-bg);
}
.vicino-shoot-shot-card {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid rgba(139, 214, 217, 0.5);
  border-radius: 10px;
  background: rgba(35, 35, 35, 0.3);
  box-shadow: 0 0 0 1px rgba(139, 214, 217, 0.2), var(--glass-btn-shadow);
}
.vicino-shoot-shot-title-row {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.vicino-shoot-shot-title-row strong {
  color: #F5F5F7;
  font-family: var(--font-sans);
  font-size: var(--vicino-node-small);
  font-weight: 600;
  letter-spacing: 0;
}
.vicino-shoot-refresh {
  position: relative;
  width: 11px;
  height: 11px;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  border-top-color: transparent;
  border-radius: 50%;
}
.vicino-shoot-frame-box,
.vicino-shoot-prompt-box {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  background: var(--image-node-prompt-input-bg);
  box-shadow: var(--glass-btn-shadow);
}
.vicino-shoot-frame-box {
  flex: 1;
  min-height: 0;
}
.vicino-shoot-box-label {
  flex-shrink: 0;
  padding: 8px 8px 6px;
  color: #aaaaaa;
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0;
}
.vicino-shoot-frame-image {
  flex: 1;
  width: calc(100% - 16px);
  min-height: 0;
  margin: 0 8px 8px;
  border-radius: 4px;
  object-fit: cover;
  filter: saturate(0.92) contrast(1.04);
}
.vicino-shoot-prompt-box p {
  margin: 0;
  padding: 0 8px 8px;
  color: rgba(255, 255, 255, 0.55);
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: 0;
}
.vicino-video-output-node-body.video-node-v3-video-area {
  width: 100%;
  height: calc(100% - 53px);
  box-sizing: border-box;
  padding: 5px 8px 8px;
  gap: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--video-node-video-area-bg);
  border-radius: 0 0 16px 16px;
}
.vicino-product-node.is-video .video-node-v3-stage {
  position: relative;
  display: flex;
  width: 100%;
  max-height: calc(100% - 13px);
  aspect-ratio: 16 / 9;
  flex: 0 1 auto;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background: var(--video-node-stage-bg);
}
.vicino-product-node.is-video .video-node-v3-stage::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--video-node-card-border),
    var(--glass-btn-shadow);
  pointer-events: none;
}
.vicino-product-node.is-video .video-node-v3-media {
  position: relative;
  z-index: 0;
  display: flex;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: inherit;
}
.vicino-product-node.is-video .video-node-v3-player {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
  filter: saturate(0.92) contrast(1.05) brightness(0.78);
  pointer-events: none;
}
.vicino-video-play-overlay {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255,255,255,0.42);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.vicino-video-play-overlay::after {
  content: "";
  position: absolute;
  left: 9px;
  top: 6px;
  width: 0;
  height: 0;
  border-bottom: 5px solid transparent;
  border-left: 7px solid rgba(255,255,255,0.78);
  border-top: 5px solid transparent;
}
.vicino-story-video-controls {
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 8px;
  margin-top: 8px;
}
.vicino-story-video-controls i {
  display: block;
  height: 5px;
  border-radius: 999px;
  background: rgba(255,255,255,0.14);
}
.vicino-story-video-controls i:nth-child(2) {
  background: linear-gradient(90deg, var(--handle-video) 0 62%, rgba(255,255,255,0.14) 62%);
}
/* ---- station 01 — workflow question ---- */
.vicino-opening-statement {
  background: var(--ink-950);
}
.vicino-opening-statement .vicino-station-index {
  grid-column: 1 / span 2;
  margin-bottom: 0;
}
.vicino-thesis {
  grid-column: 3 / span 8;
}
.vicino-opening-copy {
  grid-column: 8 / span 5;
  margin-top: var(--v-head-gap);
  display: grid;
  gap: 18px;
}

/* ---- ink-900 stations bleed full width ---- */
.vicino-brief,
.vicino-evidence {
  background: var(--ink-900);
  box-shadow: 0 0 0 100vmax var(--ink-900);
  clip-path: inset(0 -100vmax);
}

/* ---- station 02 — context & problem ---- */
.vicino-brief h2 {
  grid-column: 1 / span 6;
}
.vicino-brief-copy,
.vicino-model-copy,
.vicino-evidence-copy {
  grid-column: 8 / span 5;
  display: grid;
  gap: 20px;
}

/* Full-width artifact figures (context chains, responsibility PDRs, the
   main-path deck) — dense node graphs stay big enough to inspect. */
.vicino-wide-figure {
  grid-column: 1 / -1;
  margin: var(--v-head-gap) 0 0;
  min-width: 0;
  display: grid;
  gap: 12px;
}
.vicino-wide-figure.is-tight {
  margin-top: clamp(28px, 3vw, 44px);
}

/* ---- station 03 — Block A: the flow, told once ---- */
.vicino-flow {
  background: var(--ink-950);
}
.vicino-flow h2 {
  grid-column: 1 / span 6;
}
.vicino-flow-strip-wrap {
  grid-column: 1 / -1;
  margin-top: var(--v-head-gap);
  min-width: 0;
}
/* Alignment contract (owner note: the four entries must sit level at 1536
   and below): the strip is one grid, each stop spans four shared row tracks
   via subgrid, so name/claim/copy/connection rows line up even when a step
   name wraps to two lines. */
.v-fs-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(4, auto);
  column-gap: var(--v-gutter);
  border-top: 1px solid var(--v-line-soft);
}
.v-fs-stop {
  display: grid;
  grid-row: span 4;
  grid-template-rows: subgrid;
  min-width: 0;
  padding-top: 22px;
}
@supports not (grid-template-rows: subgrid) {
  .v-fs-stop {
    grid-template-rows: repeat(4, auto);
    align-content: start;
  }
  /* fallback: reserve two title lines so single-line names stay level */
  .v-fs-name {
    min-height: 2.4em;
  }
}
.v-fs-name {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 0 0 12px;
  font-family: var(--font-sans);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.2;
  color: var(--paper);
}
.v-fs-chip {
  flex: 0 0 auto;
  width: 6px;
  height: 26px;
  margin-top: 1px;
  border-radius: 2px 4px 4px 2px;
}
.v-fs-index {
  flex: 0 0 auto;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  line-height: 2;
  letter-spacing: var(--track-label);
  color: var(--accent-gold);
}
.v-fs-claim {
  margin: 0 0 8px;
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: 500;
  line-height: 1.4;
  color: var(--paper);
}
.v-fs-copy {
  margin: 0;
  max-width: 40ch;
  font-family: var(--font-sans);
  font-size: var(--text-meta);
  font-weight: 300;
  line-height: 1.55;
  color: var(--v-meta-ink);
}
.v-fs-conn {
  align-self: end;
  margin: 14px 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--stone);
}

/* ---- station 04 — Block B: the interface, one interactive board ---- */
.vicino-model {
  background: var(--ink-950);
}
.vicino-model h2 {
  grid-column: 1 / span 6;
}
.vicino-model-invite {
  margin: 4px 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--accent-gold);
}
.vicino-model-board-wrap {
  grid-column: 1 / -1;
  margin-top: var(--v-head-gap);
  min-width: 0;
}

/* board shell — same night-canvas frame language as the hero board */
.v-mb-root {
  display: grid;
  gap: clamp(20px, 2.4vw, 32px);
}
.v-mb-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 1620 / 700;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--accent-gold) 24%, rgba(255,255,255,0.14));
  background: #050506;
  box-shadow: 0 30px 92px rgba(0,0,0,0.38);
  container-type: inline-size;
}
/* 1620x700 stage scaled to the container width (frame shows >=1080px only;
   below that the stacked variant takes over). Stepped rules are the
   fallback; the atan2/tan division is the exact fit. */
.v-mb-stage {
  position: absolute;
  left: 50%;
  top: 0;
  width: 1620px;
  height: 700px;
  transform: translateX(-50%) scale(0.62);
  transform-origin: top center;
}
@container (min-width: 1120px) {
  .v-mb-stage { transform: translateX(-50%) scale(0.69); }
}
@container (min-width: 1240px) {
  .v-mb-stage { transform: translateX(-50%) scale(0.76); }
}
@container (min-width: 1340px) {
  .v-mb-stage { transform: translateX(-50%) scale(0.82); }
}
@supports (transform: scale(calc(tan(atan2(100cqw, 1620px))))) {
  .v-mb-stage {
    transform: translateX(-50%) scale(calc(tan(atan2(100cqw, 1620px))));
  }
}
.v-mb-stage .vicino-product-node {
  touch-action: none;
  transition: opacity 0.35s var(--ease-silk);
}
.v-mb-stage.has-open .vicino-product-node:not(.is-open):not(:hover):not(:focus-visible) {
  opacity: 0.55;
}
.v-mb-stage .vicino-product-node.is-open {
  z-index: 30;
}
/* focus mode: while a panel is open the edge flow freezes and the open
   node's typed connections carry the light */
.v-mb-stage.has-open .vicino-live-edges path {
  animation: none;
  opacity: 0.22;
}
.v-mb-stage.has-open .vicino-live-edges path.is-live {
  animation: none;
  opacity: 0.9;
}

/* the product's panel-toggle tab (the sliding panel .sp-toggle-bar: 5px x
   72px pill in the connection-type color) on the node's left edge */
.v-mb-tab {
  position: absolute;
  left: -2px;
  top: 50%;
  z-index: 3;
  width: 5px;
  height: 72px;
  border-radius: 999px;
  opacity: 0.9;
  transform: translateY(-50%);
  transition: opacity 0.3s var(--ease-standard);
}
.vicino-product-node:hover .v-mb-tab,
.vicino-product-node.is-open .v-mb-tab {
  opacity: 1;
}

/* Sliding Panel — opens flush to the node's LEFT at node height, with the
   shipped surface: 10px rgba(32,32,32,.94) border, 16px radius, frosted
   rgba(48,46,48,.93) glass (the sliding panel). */
.v-mb-panel {
  position: absolute;
  right: 100%;
  top: 0;
  z-index: 2;
  box-sizing: border-box;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 12px;
  border: 10px solid rgba(32, 32, 32, 0.94);
  border-radius: 16px;
  background: rgba(48, 46, 48, 0.93);
  backdrop-filter: blur(4px) saturate(120%);
  -webkit-backdrop-filter: blur(4px) saturate(120%);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  cursor: default;
  opacity: 0;
  visibility: hidden;
  transform: translateX(16px);
  transition:
    transform 0.3s var(--ease-silk),
    opacity 0.3s var(--ease-silk),
    visibility 0s linear 0.3s;
}
.vicino-product-node.is-open .v-mb-panel {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  transition:
    transform 0.3s var(--ease-silk),
    opacity 0.3s var(--ease-silk),
    visibility 0s;
}
/* the panel's first row in the shipped build: the auto-open preference */
.v-mb-panel-autoopen {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 7px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.66);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  letter-spacing: 0;
}
.v-mb-toggle {
  position: relative;
  flex: 0 0 auto;
  width: 22px;
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
}
.v-mb-toggle::after {
  content: "";
  position: absolute;
  left: 2px;
  top: 2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
}
.v-mb-panel-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.v-mb-panel-dot {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 2px;
}
.v-mb-panel-head p {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--vicino-node-body);
  font-weight: 600;
  color: var(--vicino-node-text);
}
.v-mb-panel-variant {
  margin: -4px 0 0;
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.45);
}
.v-mb-panel-fields {
  display: grid;
  gap: 8px;
}
.v-mb-field {
  display: grid;
  gap: 5px;
  padding: 9px 10px;
  border-radius: 8px;
  background: var(--image-node-prompt-input-bg);
  box-shadow: var(--glass-btn-shadow);
}
.v-mb-field-label {
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
}
.v-mb-field-value {
  font-family: var(--font-sans);
  font-size: var(--vicino-node-small);
  font-weight: 400;
  line-height: 1.35;
  color: var(--text-node-textarea-text);
}
.v-mb-field-value.is-select {
  position: relative;
  padding: 6px 22px 6px 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 6px;
}
.v-mb-field-value.is-select::after {
  content: "";
  position: absolute;
  right: 8px;
  top: 50%;
  width: 0;
  height: 0;
  margin-top: -2px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid rgba(255, 255, 255, 0.55);
}
.v-mb-field-thumbs {
  display: flex;
  gap: 6px;
}
.v-mb-field-thumbs img {
  width: 44px;
  height: 30px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  filter: grayscale(1) contrast(1.05);
  opacity: 0.9;
}
.v-mb-versions {
  display: grid;
  gap: 4px;
}
.v-mb-versions em {
  padding: 4px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  font-style: normal;
  color: rgba(255, 255, 255, 0.5);
}
.v-mb-versions em.is-current {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
}
/* the case's annotation voice inside a product room: which layer this is,
   and what it must never absorb */
.v-mb-room-note {
  margin-top: auto;
  padding-top: 9px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.52);
}
.v-mb-room-note span {
  display: block;
  margin-bottom: 3px;
  font-family: var(--font-mono);
  font-size: var(--vicino-node-detail);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-gold);
}
/* the Sidebar's aspect-ratio option list (the inspector panel look) */
.v-mb-ratio-list {
  display: grid;
  gap: 4px;
  margin-top: 4px;
}
.v-mb-ratio-list em {
  padding: 5px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  font-style: normal;
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.5);
}
.v-mb-ratio-list em.is-current {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
}

/* Floating Bar — the node-adjacent next-step layer, recreated from the
   shipped toolbar (the base-node styles .base-node-toolbar: glass strip 6px above
   the node; icon utilities, divider, iridescent action buttons from
   the image-node styles). Appears when its node is selected. */
.v-mb-floatbar {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  z-index: 25;
  display: flex;
  height: 36px;
  width: max-content;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: var(--node-header-play-btn-bg);
  box-shadow: var(--glass-btn-shadow);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: default;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(6px);
  transition:
    transform 0.3s var(--ease-silk),
    opacity 0.3s var(--ease-silk),
    visibility 0s linear 0.3s;
}
.vicino-product-node.is-open .v-mb-floatbar {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
  transition:
    transform 0.3s var(--ease-silk),
    opacity 0.3s var(--ease-silk),
    visibility 0s;
}
.v-mb-fb-icons {
  display: flex;
  align-items: center;
  gap: 4px;
}
.v-mb-fb-ic {
  position: relative;
  display: block;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: var(--node-header-play-btn-bg);
  box-shadow: var(--glass-btn-shadow);
  color: #F5F5F7;
}
.v-mb-fb-ic::before,
.v-mb-fb-ic::after {
  content: "";
  position: absolute;
}
.v-mb-fb-ic.is-duplicate::before {
  left: 7px;
  top: 9px;
  width: 8px;
  height: 8px;
  border: 1px solid currentColor;
  border-radius: 1px;
}
.v-mb-fb-ic.is-duplicate::after {
  left: 10px;
  top: 6px;
  width: 8px;
  height: 8px;
  border: 1px solid currentColor;
  border-radius: 1px;
  background: var(--node-header-play-btn-bg);
}
.v-mb-fb-ic.is-download::before {
  left: 12px;
  top: 6px;
  width: 1.5px;
  height: 9px;
  background: currentColor;
  box-shadow: -3px 6px 0 -0.5px currentColor, 3px 6px 0 -0.5px currentColor;
}
.v-mb-fb-ic.is-download::after {
  left: 7px;
  bottom: 6px;
  width: 12px;
  height: 1.5px;
  background: currentColor;
}
.v-mb-fb-ic.is-delete::before {
  left: 9px;
  top: 9px;
  width: 8px;
  height: 10px;
  border: 1px solid currentColor;
  border-top: 0;
  border-radius: 0 0 2px 2px;
}
.v-mb-fb-ic.is-delete::after {
  left: 7px;
  top: 7px;
  width: 12px;
  height: 1.5px;
  background: currentColor;
}
.v-mb-fb-divider {
  width: 1px;
  height: 26px;
  flex: 0 0 auto;
  background: #404040;
}
.v-mb-fb-action {
  display: flex;
  height: 28px;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: linear-gradient(
    115deg,
    rgba(219, 255, 254, 0.35) 0%,
    rgba(229, 212, 181, 0.35) 17%,
    rgba(247, 178, 133, 0.35) 32%,
    rgba(131, 127, 255, 0.35) 51%,
    rgba(239, 151, 230, 0.35) 82%,
    rgba(252, 151, 153, 0.35) 100%
  );
  box-shadow: var(--glass-btn-shadow);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--image-node-toolbar-btn-text);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-small);
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity 0.2s ease, filter 0.2s ease;
}
.v-mb-fb-action:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  filter: grayscale(0.2);
}
.v-mb-fb-action:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

/* the open node's zoning annotation — the case's voice, below the node */
.v-mb-nodenote {
  position: absolute;
  left: 0;
  top: calc(100% + 12px);
  display: grid;
  gap: 4px;
  width: max-content;
  max-width: 100%;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.5;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.3s var(--ease-standard);
  pointer-events: none;
}
.vicino-product-node.is-open .v-mb-nodenote {
  opacity: 1;
}
.v-mb-nodenote span:first-child {
  color: var(--accent-gold);
}
.v-mb-nodenote span:last-child {
  color: var(--stone);
}

/* the product's left toolbar (CreateRail) — visual only */
.v-mb-createstrip {
  position: absolute;
  left: 14px;
  top: 50%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 10px;
  background: rgba(11, 11, 13, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transform: translateY(-50%);
  pointer-events: none;
}
.v-mb-cs-btn {
  position: relative;
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.72);
  font-style: normal;
}
.v-mb-cs-btn.is-plus {
  background: #ffffff;
  color: #000000;
}
.v-mb-cs-btn.is-plus::before,
.v-mb-cs-btn.is-plus::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  background: currentColor;
}
.v-mb-cs-btn.is-plus::before {
  width: 10px;
  height: 1.5px;
  transform: translate(-50%, -50%);
}
.v-mb-cs-btn.is-plus::after {
  width: 1.5px;
  height: 10px;
  transform: translate(-50%, -50%);
}
.v-mb-cs-btn.is-box::before {
  content: "";
  width: 10px;
  height: 10px;
  border: 1px solid currentColor;
  border-radius: 2px;
}
.v-mb-cs-btn.is-chat::before {
  content: "";
  width: 10px;
  height: 8px;
  border: 1px solid currentColor;
  border-radius: 3px 3px 3px 0;
}
.v-mb-cs-btn.is-v {
  background: rgba(197, 132, 241, 0.35);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
}

/* shared close button (rails + editor) */
.v-mb-close {
  position: relative;
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: var(--play-btn-glass-bg);
  box-shadow: var(--glass-btn-shadow);
  cursor: pointer;
  transition: background 0.25s var(--ease-standard);
}
.v-mb-close:hover {
  background: var(--play-btn-glass-bg-hover);
}
.v-mb-close:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}
.v-mb-close span::before,
.v-mb-close span::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 1px;
  background: rgba(255, 255, 255, 0.75);
}
.v-mb-close span::before {
  transform: translate(-50%, -50%) rotate(45deg);
}
.v-mb-close span::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

/* side rails: collapsed hints pinned to the frame edges (unscaled) */
.v-mb-rail-hint {
  position: absolute;
  top: 50%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 44px;
  padding: 14px 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 10px;
  background: rgba(11, 11, 13, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.72);
  cursor: pointer;
  transform: translateY(-50%);
  transition:
    border-color 0.25s var(--ease-standard),
    background 0.25s var(--ease-standard),
    opacity 0.25s var(--ease-standard);
}
.v-mb-rail-hint.is-right {
  right: 14px;
}
.v-mb-rail-hint:hover {
  border-color: rgba(255, 255, 255, 0.36);
  background: rgba(20, 20, 24, 0.92);
}
.v-mb-rail-hint:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
/* the expanded rail covers its hint — fade the hint out fully */
.v-mb-rail-hint[aria-expanded="true"] {
  opacity: 0;
  pointer-events: none;
}
.v-mb-rail-hint-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--stone);
  writing-mode: vertical-rl;
}
.v-mb-rail-glyph {
  position: relative;
  display: block;
  width: 14px;
  height: 14px;
}
.v-mb-rail-glyph.is-sliders::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 2px;
  height: 1px;
  background: currentColor;
  box-shadow:
    0 5px 0 currentColor,
    0 10px 0 currentColor;
}
.v-mb-rail-glyph.is-sliders::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 0;
  width: 3px;
  height: 5px;
  border-radius: 1px;
  background: currentColor;
  box-shadow: 6px 5px 0 currentColor;
}

/* side rails: expanded rooms */
.v-mb-rail {
  position: absolute;
  top: 12px;
  bottom: 12px;
  z-index: 40;
  box-sizing: border-box;
  width: min(300px, 42%);
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  background: rgba(8, 8, 10, 0.96);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  overflow-y: auto;
  opacity: 0;
  visibility: hidden;
  transition:
    transform 0.34s var(--ease-silk),
    opacity 0.34s var(--ease-silk),
    visibility 0s linear 0.34s;
}
.v-mb-rail.is-right {
  right: 12px;
  transform: translateX(16px);
}
.v-mb-rail.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  transition:
    transform 0.34s var(--ease-silk),
    opacity 0.34s var(--ease-silk),
    visibility 0s;
}
.v-mb-rail > .v-mb-close {
  position: absolute;
  top: 12px;
  right: 12px;
}
.v-mb-rail-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--accent-gold);
}
.v-mb-rail h4,
.v-mb-editor h4 {
  margin: 6px 0 0;
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: 500;
  line-height: 1.3;
  color: var(--paper);
}
.v-mb-rail-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}
.v-mb-rail-list li {
  font-family: var(--font-sans);
  font-size: var(--text-meta);
  font-weight: 300;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.72);
}
.v-mb-rail-list strong {
  display: block;
  font-weight: 500;
  color: var(--node-header-label-color);
}
.v-mb-rail .v-mb-room-note,
.v-mb-editor .v-mb-room-note {
  font-size: var(--vicino-node-small);
}
.v-mb-rail .v-mb-room-note span,
.v-mb-editor .v-mb-room-note span {
  font-size: var(--vicino-node-small);
}
/* the inspector's run affordance, in the product's own video amber */
.v-mb-run {
  padding: 10px;
  border: 1px solid rgba(255, 166, 19, 0.5);
  border-radius: 8px;
  background: rgba(255, 179, 71, 0.12);
  color: var(--handle-video);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

/* canvas room annotation + caption */
.v-mb-canvas-note {
  position: absolute;
  left: 74px;
  top: 16px;
  z-index: 5;
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--stone);
  pointer-events: none;
}

/* editor overlay: the fourth room, covering the whole board */
.v-mb-editor {
  position: absolute;
  inset: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: clamp(14px, 2vw, 24px);
  padding: clamp(18px, 2.6vw, 36px);
  background: #050506;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s var(--ease-standard),
    visibility 0s linear 0.3s;
}
.v-mb-editor.is-open {
  opacity: 1;
  visibility: visible;
  transition:
    opacity 0.3s var(--ease-standard),
    visibility 0s;
}
.v-mb-editor-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.v-mb-editor-head .v-mb-rail-label {
  margin: 0;
}
.v-mb-timeline {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding: 0 8px;
}
.v-mb-timeline-ruler {
  height: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  background: repeating-linear-gradient(
    to right,
    rgba(255, 255, 255, 0.22) 0 1px,
    transparent 1px 40px
  );
}
.v-mb-timeline-track {
  display: flex;
  gap: 6px;
  height: clamp(38px, 6cqw, 60px);
}
.v-mb-timeline-track.is-audio {
  height: 20px;
}
.v-mb-clip {
  display: flex;
  align-items: center;
  min-width: 0;
  flex-basis: 0;
  padding: 0 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 166, 19, 0.45);
  border-radius: 6px;
  background: rgba(255, 179, 71, 0.1);
  color: rgba(255, 255, 255, 0.8);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-small);
  font-weight: 500;
  white-space: nowrap;
}
.v-mb-clip.is-audio {
  border-color: rgba(110, 221, 179, 0.4);
  background: rgba(110, 221, 179, 0.08);
}
.v-mb-playhead {
  position: absolute;
  left: 38%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--handle-video);
}

/* stacked variant (phones + narrow tablets): one ROOM at a time */
.v-mb-stack-item h3 {
  margin: 0 0 12px;
}
.v-mb-stack-item h3 button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.2;
  color: var(--paper);
  transition: color 0.25s var(--ease-standard);
}
.v-mb-stack-item h3 button:hover,
.v-mb-stack-item.is-active h3 button {
  color: var(--accent-amber);
}
.v-mb-stack-item h3 button:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
.v-mb-stop-chip {
  flex: 0 0 auto;
  width: 6px;
  height: 26px;
  border-radius: 2px 4px 4px 2px;
}
.v-mb-stop-copy {
  margin: 0;
  max-width: 52ch;
  font-family: var(--font-sans);
  font-size: var(--text-meta);
  font-weight: 300;
  line-height: 1.55;
  color: var(--v-meta-ink);
}
.v-mb-stack {
  display: none;
  border-top: 1px solid var(--v-line-soft);
}
.v-mb-stack-item {
  border-bottom: 1px solid var(--v-line-soft);
}
.v-mb-stack-item h3 {
  margin: 0;
}
.v-mb-stack-item h3 button {
  width: 100%;
  padding: 18px 0;
}
.v-mb-stack-body {
  display: grid;
  gap: 16px;
  padding: 4px 0 26px;
}
.v-mb-stack-nodebox {
  position: relative;
  width: 100%;
  margin-inline: auto;
  overflow: hidden;
  container-type: inline-size;
}
.v-mb-stack-nodebox .vicino-product-node.is-static {
  position: absolute;
  left: 50%;
  top: 0;
  cursor: pointer;
  transform: translateX(-50%);
}
@supports (transform: scale(calc(tan(atan2(100cqw, 100px))))) {
  .v-mb-stack-nodebox .vicino-product-node.is-static {
    left: 0;
    transform-origin: top left;
    transform: scale(min(1, tan(atan2(100cqw, var(--stack-node-w, 320px)))));
  }
}
.v-mb-stack-panel,
.v-mb-stack-editor {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  background: rgba(11, 11, 13, 0.9);
}
.v-mb-stack-editor .v-mb-timeline {
  min-height: 130px;
}
.v-mb-stack-floatbar {
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding: 6px 0;
}
.v-mb-floatbar.is-static {
  position: static;
  opacity: 1;
  visibility: visible;
  transform: none;
}
.v-mb-floatbar.is-static .v-mb-fb-action {
  cursor: default;
}
.v-mb-canvas-note.is-stack {
  position: static;
  margin: 18px 0 20px;
  pointer-events: auto;
}

/* ---- station 04 — evidence: reels, artifacts, decision ledger ---- */
.vicino-evidence h2 {
  grid-column: 1 / span 6;
}
.vicino-sub-label {
  grid-column: 1 / -1;
  margin: var(--v-head-gap) 0 0;
  padding-left: 18px;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--accent-gold);
}
.vicino-reel-grid {
  grid-column: 1 / -1;
  margin-top: 26px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--v-gutter);
  row-gap: clamp(28px, 3vw, 44px);
}
.vicino-reel {
  margin: 0;
  min-width: 0;
  display: grid;
  gap: 12px;
}
.vicino-reel.is-wide {
  grid-column: 1 / -1;
}
.vicino-reel video {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border: 1px solid var(--v-line);
  border-radius: var(--radius-thumb);
  background: #080b12;
}
.vicino-reel.is-wide video {
  aspect-ratio: 16 / 9;
}
.vicino-reel figcaption {
  font-family: var(--font-sans);
  font-size: var(--text-micro);
  line-height: 1.5;
  color: var(--stone);
}

/* ---- station 04 — decision ledger ---- */
.vicino-decision-list {
  grid-column: 1 / -1;
  margin-top: 26px;
  border-top: 1px solid var(--v-line);
}
.vicino-decision {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--v-gutter);
  align-items: start;
  padding: clamp(48px, 5.5vw, 80px) 0;
  border-bottom: 1px solid var(--v-line);
}
.vicino-decision-index {
  grid-column: 1;
  padding-left: 18px;
}
.vicino-decision-copy {
  grid-column: 2 / span 6;
}
.vicino-decision h3 {
  margin: 0 0 14px;
  font-family: var(--font-sans);
  font-size: var(--text-heading);
  font-weight: 300;
  line-height: 1.2;
  text-wrap: balance;
  color: var(--paper);
}
.vicino-decision-tags {
  margin: 0 0 18px;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--accent-gold);
}
.vicino-decision-body {
  margin: 0 0 20px;
}
.vicino-decision-body:last-child {
  margin-bottom: 0;
}
.vicino-decision-figure {
  grid-column: 8 / span 5;
  margin: 0;
  min-width: 0;
  display: grid;
  gap: 10px;
}
.vicino-decision-media {
  overflow: hidden;
  border: 1px solid var(--v-line);
  border-radius: var(--radius-thumb);
  background: #080b12;
}
.vicino-decision-media img {
  width: 100%;
  height: auto;
}
.vicino-decision-figure figcaption,
.vicino-wide-figure figcaption {
  font-family: var(--font-sans);
  font-size: var(--text-micro);
  line-height: 1.5;
  color: var(--stone);
}

/* ---- station 07 — closing moment (the page's one red moment) ---- */
.vicino-closing {
  background: var(--ink-950);
  padding-bottom: clamp(96px, 10vw, 160px);
}
.vicino-seal {
  position: relative;
  grid-column: 1;
  justify-self: start;
  margin: 0;
}
.vicino-seal::before {
  /* the rail's terminal tick — seal red, once on the page */
  content: "";
  position: absolute;
  left: -3px;
  top: -36px;
  width: 6px;
  height: 26px;
  border-radius: 2px 4px 4px 2px;
  background: var(--seal-red);
}
.vicino-seal img {
  width: clamp(38px, 3.2vw, 48px);
  height: auto;
}
h2.vicino-closing-title {
  grid-column: 2 / span 6;
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--text-heading);
  font-weight: 300;
  line-height: 1.3;
  letter-spacing: 0;
  text-transform: none;
  text-wrap: balance;
  color: var(--paper);
}
.vicino-closing-copy {
  grid-column: 8 / span 5;
  display: grid;
  gap: 20px;
}
.vicino-closing-rule {
  display: block;
  grid-column: 1 / -1;
  height: 1px;
  background: var(--v-line);
  margin-top: clamp(64px, 8vw, 120px);
}

/* ---- adjacent case — quiet close ---- */
.vicino-next {
  box-sizing: border-box;
  width: min(100%, var(--vicino-section-max));
  margin-inline: auto;
  padding: clamp(48px, 6vw, 84px) var(--v-margin);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--v-gutter);
  align-items: baseline;
  background: var(--ink-950);
}
.vicino-next-label {
  grid-column: 1 / span 3;
  margin: 0;
  padding-left: 18px;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--accent-gold);
}
.vicino-next-link {
  grid-column: 4 / span 8;
  justify-self: start;
  text-decoration: none;
}
.vicino-next-link:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
.vicino-next-title {
  font-family: var(--font-condensed);
  font-size: var(--text-heading);
  font-weight: 300;
  line-height: 1.05;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: var(--paper);
  white-space: normal;
}

/* ---- canvas pause + reduced motion ---- */
.vicino-live-canvas.is-paused *,
.vicino-live-canvas.is-paused *::before,
.vicino-live-canvas.is-paused *::after,
.v-mb-root.is-paused *,
.v-mb-root.is-paused *::before,
.v-mb-root.is-paused *::after {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .vicino-story-edge {
    animation: none;
    stroke-dasharray: none;
    opacity: 0.46;
  }
  /* model board: rooms open instantly, nothing idles (the .is-open state
     selectors are repeated so they cannot out-specify this reset) */
  .v-mb-panel,
  .vicino-product-node.is-open .v-mb-panel,
  .v-mb-floatbar,
  .vicino-product-node.is-open .v-mb-floatbar,
  .v-mb-nodenote,
  .v-mb-rail,
  .v-mb-rail.is-open,
  .v-mb-editor,
  .v-mb-editor.is-open,
  .v-mb-tab,
  .v-mb-stop-chip,
  .v-mb-stack-item h3 button,
  .v-mb-close,
  .v-mb-fb-action,
  .v-mb-rail-hint,
  .vicino-product-node-shell,
  .v-mb-stage .vicino-product-node {
    transition: none;
  }
}

/* ---- tablet ---- */
@media (max-width: 1079.98px) {
  .vicino-hero-copy,
  .vicino-hero-meta,
  .vicino-system-board {
    grid-column: 1 / -1;
  }
  .vicino-hero-meta {
    align-self: start;
  }
  .vicino-station-index,
  .vicino-opening-statement .vicino-station-index {
    grid-column: 1 / -1;
    margin-bottom: 18px;
  }
  .vicino-thesis,
  .vicino-brief h2,
  .vicino-flow h2,
  .vicino-model h2,
  .vicino-evidence h2 {
    grid-column: 1 / -1;
  }
  .vicino-opening-copy,
  .vicino-brief-copy,
  .vicino-model-copy,
  .vicino-evidence-copy {
    grid-column: 1 / -1;
    margin-top: 34px;
  }
  /* below 1080 the full board hands over to the stacked rooms */
  .v-mb-frame {
    display: none;
  }
  .v-mb-stack {
    display: block;
  }
  /* flow strip: two level pairs (each stop still spans the shared rows) */
  .v-fs-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(8, auto);
  }
  .v-fs-stop {
    padding-bottom: 30px;
  }
  .vicino-decision {
    grid-template-columns: 1fr;
    row-gap: 14px;
  }
  .vicino-decision-index,
  .vicino-decision-copy,
  .vicino-decision-figure {
    grid-column: 1;
  }
  .vicino-decision-figure {
    max-width: 720px;
    margin-top: 12px;
  }
  .vicino-seal {
    grid-column: 1 / -1;
  }
  h2.vicino-closing-title {
    grid-column: 1 / -1;
    margin-top: 10px;
  }
  .vicino-closing-copy {
    grid-column: 1 / -1;
    margin-top: 28px;
  }
  .vicino-next-label {
    grid-column: 1 / -1;
    margin-bottom: 14px;
    padding-left: 0;
  }
  .vicino-next-link {
    grid-column: 1 / -1;
  }
}

/* ---- phone ---- */
@media (max-width: 809.98px) {
  .vicino-hero {
    padding-top: 112px;
    row-gap: 36px;
  }
  /* the long recreation-metadata caption wraps over the tiny node stage on
     phones — keep only the "Drag nodes" affordance hint there */
  .vicino-live-caption span:first-child {
    display: none;
  }
  .vicino-hero-meta {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .vicino-hero-meta div {
    padding: 12px 0;
    border-bottom: 1px solid var(--v-line-soft);
  }
  .vicino-hero-meta div:last-child {
    border-bottom: 0;
  }
  /* flow strip: one column, natural stacking */
  .v-fs-strip {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
  .v-fs-stop {
    grid-row: auto;
    grid-template-rows: none;
    padding-bottom: 26px;
  }
  .vicino-reel-grid {
    grid-template-columns: 1fr;
  }
  .vicino-reel.is-wide video {
    aspect-ratio: 16 / 10;
  }
}
`;

export function VicinoCaseLayout({ project }: { project: Project }) {
  const sections = project.chapters?.flatMap((chapter) => chapter.sections) ?? [];
  const videos = project.moment?.videos ?? [];
  const { next } = adjacent(project.slug);
  const meta = [
    ["Role", project.role],
    ["Duration", project.duration],
    ["Team", project.teams],
  ];
  // Arc: hero (product) -> 01 overview (role/scope) -> 02 context & problem
  // -> 03 the flow (Block A: main path told once — strip + deck artifact)
  // -> 04 the interface (Block B: the zoning rooms — interactive board + PDR
  // artifact, scale-up as the claim) -> 05 evidence (reels + tightened
  // ledger) -> the moment (seal) -> next case.
  //
  // Data reuse map (data/projects.ts stays orchestrator-owned):
  //   blurb ¶1        -> station 02 copy (expansion/problem framing)
  //   blurb ¶2        -> station 01 copy (role growth), "sidebars" refreshed
  //   sections[0]     -> station 02 copy + figure (structural ambiguity)
  //   sections[2]     -> its per-step argument lives in station 03's flow
  //                      strip; its deck image is that station's artifact
  //   sections[5]     -> its rooms argument lives in station 04's interactive
  //                      board; its "Detail PDR" zoning-board image is that
  //                      station's artifact
  //   sections[6]     -> station 05 intro (prototype working style)
  //   summary[]       -> unrendered here (hero/overview already carry it)
  const overviewCopy = refreshFacts(project.blurb.split("\n\n")[1] ?? "");
  const contextCopy = project.blurb.split("\n\n")[0] ?? "";
  const ambiguityCopy = sections[0]?.body[0];
  const contextFigure = sections[0]?.image;
  const roomsFigure = sections[5]?.image;
  const mainPathFigure = sections[2]?.image;
  const evidenceIntro = sections[6]?.body[0];

  return (
    <article className="vicino-case-page">
      <style dangerouslySetInnerHTML={{ __html: vicinoCriticalCss }} />

      <section className="vicino-hero" id="header">
        <div className="vicino-hero-copy">
          <h1 data-fade>Vicino AI</h1>
          <p className="vicino-hero-deck" data-fade>
            Workflow architecture for a creation canvas.
          </p>
        </div>

        <dl className="vicino-hero-meta" data-fade>
          {meta.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="vicino-system-board">
          <VicinoWorkflowCanvas project={project} />
        </div>
      </section>

      <section
        className="vicino-station vicino-opening-statement"
        aria-labelledby="vicino-opening-title"
      >
        <span className="vicino-station-rule" aria-hidden="true" />
        <p className="vicino-station-index" data-fade>
          01 · Overview
        </p>
        <h2 className="vicino-thesis" id="vicino-opening-title" data-fade>
          A canvas people could understand, correct, and continue.
        </h2>
        <div className="vicino-opening-copy" data-fade>
          <p className="vicino-body-copy">
            The design problem was not how many tools the canvas could hold. It
            was where a person could read the work in progress and know what to
            change next.
          </p>
          {overviewCopy ? <p className="vicino-body-copy">{overviewCopy}</p> : null}
        </div>
      </section>

      <section className="vicino-station vicino-brief">
        <span className="vicino-station-rule" aria-hidden="true" />
        <p className="vicino-station-index" data-fade>
          02 · Context &amp; problem
        </p>
        <h2 data-fade>From Feature Pile-Up to Workflow Architecture</h2>
        <div className="vicino-brief-copy" data-fade>
          {contextCopy ? <p className="vicino-body-copy">{contextCopy}</p> : null}
          {ambiguityCopy ? <p className="vicino-body-copy">{ambiguityCopy}</p> : null}
        </div>
        {contextFigure && (
          <figure className="vicino-wide-figure" data-fade>
            <div className="vicino-decision-media">
              <Image
                src={contextFigure}
                alt="Two node-graph chains labeled TO 3D and TO VIDEO — text prompts flowing through assistant, image, multi-view, 3D, and video nodes"
                width={1600}
                height={1187}
                sizes="(max-width: 1080px) 100vw, 1280px"
                style={{ height: "auto" }}
              />
            </div>
            <figcaption>
              The pile-up, mapped: a to-3D chain and a to-video chain sharing
              the same text-to-image spine — capable pieces, no single model
              holding them together.
            </figcaption>
          </figure>
        )}
      </section>

      <section className="vicino-station vicino-flow">
        <span className="vicino-station-rule" aria-hidden="true" />
        <p className="vicino-station-index" data-fade>
          03 · The flow
        </p>
        <h2 data-fade>The Main Path, Rebuilt Around What the Models Could Support</h2>
        <div className="vicino-model-copy" data-fade>
          <p className="vicino-body-copy">
            The main path holds four checkpoints — script, storyboard, shot,
            video. Each exists because the models cannot reliably skip it, and
            each is a place to inspect and redirect before the next, more
            expensive step.
          </p>
        </div>
        <div className="vicino-flow-strip-wrap" data-fade>
          <VicinoFlowStrip />
        </div>
        {mainPathFigure && (
          <figure className="vicino-wide-figure" data-fade>
            <div className="vicino-decision-media">
              <Image
                src={mainPathFigure}
                alt="Deck slide: 'I rebuilt the main path around what the models could actually support at each step' — Script, Storyboard, Shot breakdown, and Video, each with its model-constraint rationale"
                width={1600}
                height={2141}
                sizes="(max-width: 1080px) 100vw, 1280px"
                style={{ height: "auto" }}
              />
            </div>
            <figcaption>
              The same argument as it was presented — each step exists because
              the models cannot skip it reliably; a recommended structure, not
              a forced pipeline.
            </figcaption>
          </figure>
        )}
      </section>

      <section className="vicino-station vicino-model">
        <span className="vicino-station-rule" aria-hidden="true" />
        <p className="vicino-station-index" data-fade>
          04 · The interface
        </p>
        <h2 data-fade>A Designated Home for Every Kind of Function</h2>
        <div className="vicino-model-copy" data-fade>
          <p className="vicino-body-copy">
            The zoning around that path exists to scale the product up.
            Instead of answering each new feature with one more control on the
            same surface, every kind of function got a designated home: the
            Work Space stages the nodes, the Floating Bar carries the next
            step, the Sidebar holds global settings and model selection, the
            Sliding Panel takes node-level adjustment, the Node Panel stays
            minimal, and deep revision leaves for an Editor.
          </p>
          <p className="vicino-body-copy">
            Each room keeps a one-sentence rule and a list of what never goes
            there — so future features arrive with a place to live instead of
            a new structural debate.
          </p>
          <p className="vicino-model-invite">
            Select a node, open the Sidebar, enter the Editor — every room
            answers for itself
          </p>
        </div>
        <div className="vicino-model-board-wrap" data-fade>
          <VicinoModelBoard />
        </div>
        {roomsFigure && (
          <figure className="vicino-wide-figure" data-fade>
            <div className="vicino-decision-media">
              <Image
                src={roomsFigure}
                alt="The Detail PDR zoning board: a dark canvas labeled Work Space in the middle, with four annotated frames — Floating Bar, Sidebar, Sliding Panel, Node Panel — each carrying what goes here, what does not go here, a one-sentence rule, and a designer checklist"
                width={1600}
                height={1010}
                sizes="(max-width: 1080px) 100vw, 1280px"
                style={{ height: "auto" }}
              />
            </div>
            <figcaption>
              The zoning as it is kept — the &ldquo;Detail PDR&rdquo; board:
              Work Space in the middle; Floating Bar, Sidebar, Sliding Panel,
              and Node Panel framed around it, each with what goes here, what
              does not, its one-sentence rule, and a designer checklist.
            </figcaption>
          </figure>
        )}
      </section>

      <section className="vicino-station vicino-evidence">
        <span className="vicino-station-rule" aria-hidden="true" />
        <p className="vicino-station-index" data-fade>
          05 · Evidence
        </p>
        <h2 data-fade>The Work Was Deciding Where Complexity Should Live</h2>
        {evidenceIntro && (
          <div className="vicino-evidence-copy" data-fade>
            <p className="vicino-body-copy">{evidenceIntro}</p>
          </div>
        )}

        {videos.length > 0 && (
          <>
            <p className="vicino-sub-label" data-fade>
              Prototype reels
            </p>
            <div className="vicino-reel-grid">
              {videos.map((video, index) => (
                <figure
                  className={`vicino-reel${video.wide ? " is-wide" : ""}`}
                  key={video.src}
                  data-fade
                >
                  <OffscreenVideo src={video.src} />
                  <figcaption>
                    {reelCaptions[index] ?? `Prototype reel ${index + 1}`}
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        )}

        <p className="vicino-sub-label" data-fade>
          Decision ledger
        </p>
        <div className="vicino-decision-list">
          {evidenceRows.map(({ section: sectionIndex, body }, index) => {
            const section = sections[sectionIndex];
            if (!section) return null;
            return (
              <section className="vicino-decision" key={section.heading} data-fade>
                <p className="vicino-row-index vicino-decision-index">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="vicino-decision-copy">
                  <h3>{sentenceCase(section.heading)}</h3>
                  <p className="vicino-decision-tags">{section.tags}</p>
                  {body
                    .map((i) => section.body[i])
                    .filter((p): p is string => Boolean(p))
                    .map((p) => (
                      <p className="vicino-body-copy vicino-decision-body" key={p}>
                        {p}
                      </p>
                    ))}
                </div>
                {section.image && (
                  <figure className="vicino-decision-figure">
                    <div className="vicino-decision-media">
                      <Image
                        src={section.image}
                        alt=""
                        width={840}
                        height={560}
                        sizes="(max-width: 1080px) 100vw, 560px"
                        style={{ height: "auto" }}
                      />
                    </div>
                  </figure>
                )}
              </section>
            );
          })}
        </div>
      </section>

      {project.moment && (
        <section className="vicino-station vicino-closing">
          <figure className="vicino-seal" data-fade>
            <Image src={SEAL_SRC} alt="" width={36} height={76} />
          </figure>
          <h2 className="vicino-closing-title" data-fade>
            {project.moment.title}
          </h2>
          <div className="vicino-closing-copy" data-fade>
            {/* body[3] is the a teammate credit — render-filtered into the
                station-04 reel figcaption instead of a closing paragraph */}
            {project.moment.body.slice(0, 3).map((p) => (
              <p className="vicino-body-copy" key={p}>
                {p}
              </p>
            ))}
          </div>
          <span className="vicino-closing-rule" aria-hidden="true" />
        </section>
      )}

      {next && (
        <aside className="vicino-next">
          <p className="vicino-next-label" data-fade>
            Next case
          </p>
          <Link className="vicino-next-link" href={`/work/${next.slug}`} data-fade>
            <span className="cta cta--quiet vicino-next-title">{next.title}</span>
          </Link>
        </aside>
      )}
    </article>
  );
}
