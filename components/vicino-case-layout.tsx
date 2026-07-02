import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";
import { OffscreenVideo } from "./ui/offscreen-video";
import { VicinoWorkflowCanvas } from "./vicino-workflow-canvas";

const SEAL_SRC = "/assets/framerusercontent.com/images/ntwL7wUkSslvYCLMnzXaIuQu8zU.png";

// Product handle palette — sanctioned product-UI color, used only inside the
// canvas motif (node handles, flow chips, layer-map owned regions). Exact
// values from the product's typed-connection model
// (src/core/connections/the connection types).
const HANDLE = {
  text: "#F1A0FA",
  storyboard: "#6EDDB3",
  image: "#6EDDB3",
  video: "#FFB347",
};

// Step labels are the product's real create-menu names (the create menu);
// `conn` quotes each node's typed output connection with its shipped color.
const workflow = [
  {
    label: "Script Generator",
    handle: HANDLE.text,
    conn: "Output · Text #F1A0FA",
    title: "Intent Becomes Editable",
    copy: "The workflow starts as a script object, so intent can be revised before it turns into visual production work.",
  },
  {
    label: "Story Board Generator",
    handle: HANDLE.storyboard,
    conn: "Output · Storyboard #6EDDB3",
    title: "Pacing Becomes Visible",
    copy: "The script becomes a sketch storyboard first, giving the creator a low-cost place to inspect sequence and rhythm.",
  },
  {
    label: "Shot Node",
    handle: HANDLE.image,
    conn: "Output · Image #6EDDB3",
    title: "Shots Become Concrete",
    copy: "The rough board resolves into a production-ready shot board with reference frames and camera intent.",
  },
  {
    label: "Video Generator",
    handle: HANDLE.video,
    conn: "Output · Video #FFB347",
    title: "Motion Becomes Output",
    copy: "The final node turns approved shots into video, keeping the source chain visible instead of burying it in a feed.",
  },
];

type LayerKind = "canvas" | "sidebar" | "panel" | "editor";

const layers: Array<{
  label: string;
  kind: LayerKind;
  color: string;
  title: string;
  owns: string;
  avoids: string;
}> = [
  {
    label: "Canvas",
    kind: "canvas",
    color: HANDLE.text,
    title: "Workflow Structure",
    owns: "Stages, outputs, selection, and visible state.",
    avoids: "Prompt forms and dense parameters.",
  },
  {
    // The shipped build splits this room across two rails: the left create
    // rail (create menu + asset/community libraries) and the right inspector
    // (the inspector panel: model dropdown, parameters, run).
    label: "Side rails",
    kind: "sidebar",
    color: HANDLE.storyboard,
    title: "Creation and Configuration",
    owns: "The left rail's create menu and asset libraries; the right inspector's model choice, parameters, and run controls.",
    avoids: "Node media input and deep edits.",
  },
  {
    label: "Sliding panel",
    kind: "panel",
    color: HANDLE.image,
    title: "Local Input",
    owns: "Prompts, references, frame input, and current-node controls — slid out from the node's left edge on 15 of the shipped node types.",
    avoids: "Deep editing tools.",
  },
  {
    label: "Editor",
    kind: "editor",
    color: HANDLE.video,
    title: "Deep Revision",
    owns: "Timeline work, image editing, 3D refinement, and complex operations.",
    avoids: "Basic node display.",
  },
];

// Station-02 evidence: real dates and commit subjects quoted from the
// the-product-codebase repo's git log — the product team's build history that this
// design work fed (the owner's contribution is design/design-system work, not
// commits to that repo).
const canvasLedger: Array<[string, string]> = [
  [
    "2025-09-11",
    "“AI board” — the first canvas commit: one ReactFlow board with a single node type.",
  ],
  [
    "2025-12-02",
    "“Board Refactor” — the node plugin architecture lands: a registry of node definitions.",
  ],
  ["2026-04-16", "Sliding panels ship for all node types."],
  [
    "2026-05-01",
    "Panel animation and handle polish land “according to requests from uiux designers.”",
  ],
  ["2026-06-29", "Post-login default routes to Pulse — the newer flagship surface."],
];

// Render-level copy refreshes grounded in the builder repo: the shipped build
// puts creation in the left rail (create menu + asset/community libraries)
// and model/run configuration in the right inspector (the inspector panel), so
// the older "sidebar = global settings + model controls" phrasing is
// superseded at render time. data/projects.ts is orchestrator-owned; the
// matching data edits are reported for the batched pass.
const factRefresh: Array<[string, string]> = [
  [
    "The sidebar handled global settings and model-level controls.",
    "The side rails handled creation and configuration — the create menu and asset library on the left, model and run controls in the right inspector.",
  ],
  [
    "the sidebar handled global settings and model controls",
    "the side rails handled creation and configuration — the create menu on the left, model and run controls in the right inspector",
  ],
];

function refreshFacts(copy: string) {
  return factRefresh.reduce((text, [from, to]) => text.split(from).join(to), copy);
}

// Figcaptions for the prototype reels. The a teammate credit is render-filtered
// out of the closing moment (body[3] in data/projects.ts) and lives here as
// evidence metadata instead.
const reelCaptions = [
  "Sliding-panel structure — React prototype",
  "Sidebar-only previous version",
  "Video 2 Node prototype — a teammate",
];

// The two densest annotated screenshots break to full width below their copy
// so the node graphs are actually inspectable.
const wideDecisionCaptions: Record<string, string> = {
  "4jRCSVcAkbGd6SEr97GpwZUnOkk":
    "Main-path exploration — image stays a preview checkpoint before video.",
  iqfmdKGdZXFBgs29aUVK7AiR40:
    "Layer responsibilities annotated across the live canvas.",
};

function wideDecisionCaption(image?: string) {
  if (!image) return undefined;
  const match = Object.keys(wideDecisionCaptions).find((id) => image.includes(id));
  return match ? wideDecisionCaptions[match] : undefined;
}

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

// 168x104 wireframes of the product surface — the owned region of each
// interaction layer tinted in its handle color, so the "four rooms" argument
// is visible instead of purely verbal. Static evidence; hidden below 810px.
// Anatomy matches the shipped build: the sidebar room is two rails (left
// create rail + right inspector — second strip drawn in the sidebar <g>),
// and the sliding panel is node-local, opening to the node's LEFT with a
// slim toggle tab and its height synced to the node.
const layerOwnedRegion: Record<LayerKind, { x: number; y: number; w: number; h: number }> = {
  canvas: { x: 8, y: 8, w: 152, h: 88 },
  sidebar: { x: 8, y: 8, w: 26, h: 88 },
  panel: { x: 58, y: 34, w: 40, h: 36 },
  editor: { x: 5, y: 5, w: 158, h: 94 },
};

function LayerMap({ kind, color }: { kind: LayerKind; color: string }) {
  const owned = layerOwnedRegion[kind];
  return (
    <svg
      className="vicino-layer-map"
      viewBox="0 0 168 104"
      width="168"
      height="104"
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="1.5"
        width="165"
        height="101"
        rx="4"
        fill="none"
        stroke="rgba(255,255,255,0.28)"
      />
      <rect
        className="vicino-layer-owned"
        x={owned.x}
        y={owned.y}
        width={owned.w}
        height={owned.h}
        rx="4"
        fill={color}
        fillOpacity="0.12"
        stroke={color}
        strokeOpacity="0.55"
      />
      {kind === "canvas" ? (
        <g fill="none" stroke="rgba(255,255,255,0.34)">
          <rect x="24" y="34" width="26" height="18" rx="2" />
          <rect x="70" y="22" width="30" height="20" rx="2" />
          <rect x="118" y="42" width="28" height="18" rx="2" />
          <path d="M50 43 C 60 43, 60 32, 70 32" />
          <path d="M100 32 C 109 32, 109 51, 118 51" />
        </g>
      ) : null}
      {kind === "sidebar" ? (
        <>
          {/* the room's second rail: the right inspector (the inspector panel) */}
          <rect
            className="vicino-layer-owned"
            x="134"
            y="8"
            width="26"
            height="88"
            rx="4"
            fill={color}
            fillOpacity="0.12"
            stroke={color}
            strokeOpacity="0.55"
          />
          <g fill="none" stroke="rgba(255,255,255,0.2)">
            <rect x="52" y="30" width="28" height="18" rx="2" />
            <rect x="92" y="52" width="28" height="18" rx="2" />
          </g>
          <g stroke={color} strokeOpacity="0.55">
            <line x1="14" y1="20" x2="28" y2="20" />
            <line x1="14" y1="30" x2="28" y2="30" />
            <line x1="14" y1="40" x2="24" y2="40" />
            <line x1="140" y1="20" x2="154" y2="20" />
            <line x1="140" y1="30" x2="154" y2="30" />
            <line x1="140" y1="44" x2="154" y2="44" />
          </g>
        </>
      ) : null}
      {kind === "panel" ? (
        <>
          {/* panel slides out LEFT of its node, height synced to the node;
              the slim colored rect is the product's toggle tab */}
          <g fill="none" stroke="rgba(255,255,255,0.34)">
            <rect x="106" y="34" width="34" height="36" rx="2" />
          </g>
          <rect x="101" y="46" width="3" height="12" rx="1" fill={color} fillOpacity="0.9" />
          <g stroke={color} strokeOpacity="0.55">
            <line x1="66" y1="44" x2="90" y2="44" />
            <line x1="66" y1="52" x2="90" y2="52" />
            <line x1="66" y1="60" x2="84" y2="60" />
          </g>
        </>
      ) : null}
      {kind === "editor" ? (
        <g fill="none" stroke="rgba(255,255,255,0.3)">
          <rect x="16" y="16" width="136" height="48" rx="2" />
          <line x1="16" y1="76" x2="152" y2="76" />
          <line x1="16" y1="85" x2="118" y2="85" />
        </g>
      ) : null}
    </svg>
  );
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
  --vicino-hero-max: 1440px;
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
  --node-header-play-btn-hover-bg: rgba(255, 255, 255, 0.12);
  --node-header-play-btn-icon-color: #F5F5F7;
  --node-shell-bg: #0b0b0d;
  --node-shell-radius: 16px;
  --node-shell-shadow: 0 4px 8px rgba(0, 0, 0, 0.12), 0 12px 24px rgba(0, 0, 0, 0.18);
  --node-shell-selected-shadow: 0 18px 44px rgba(0, 0, 0, 0.55);
  --node-panel-bg: #0b0b0d;
  --node-panel-radius: 12px;
  --node-shell-edge: linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
  --text-node-card-bg: #0b0b0d;
  --text-node-card-border: rgba(241, 160, 250, 0.30);
  --text-node-card-selected-border: #F1A0FA;
  --text-node-prompt-input-bg: #0b0b0d;
  --text-node-textarea-text: #F5F5F7;
  --text-node-preview-text: #d9d9d9;
  --image-node-card-bg: #0b0b0d;
  --image-node-card-border: rgba(255, 255, 255, 0.07);
  --image-node-card-selected-border: rgba(255, 255, 255, 0.5);
  --image-node-card-shadow: 0 18px 32px rgba(0, 0, 0, 0.25);
  --image-node-header-bg: #0b0b0d;
  --image-node-prompt-input-bg: #303030;
  --image-node-text-color: #8b8b8b;
  --image-node-toolbar-btn-text: #D9D9D9;
  --image-node-thumbnail-bg: #303030;
  --image-node-reference-thumbnail-border: rgba(255, 255, 255, 0.2);
  --image-node-reference-thumbnail-bg: rgba(0, 0, 0, 0.5);
  --video-node-card-bg: #0b0b0d;
  --video-node-card-border: rgba(255, 255, 255, 0.07);
  --video-node-card-selected-border: rgba(255, 255, 255, 0.5);
  --video-node-header-bg: #0b0b0d;
  --video-node-video-area-bg: #0b0b0d;
  --video-node-stage-bg: #0b0b0d;
  --vicino-node-bg: var(--node-shell-bg);
  --vicino-node-panel: var(--image-node-prompt-input-bg);
  --vicino-node-line: var(--image-node-card-border);
  --vicino-node-line-strong: var(--image-node-card-selected-border);
  --vicino-node-text: var(--node-header-label-color);
  --vicino-node-muted: var(--image-node-text-color);
  --vicino-node-glass: var(--glass-btn-shadow);
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

/* ---- product nodes (measured recreation of Vicino's UI) ---- */
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
}
.vicino-product-node.is-script .vicino-product-node-shell {
  border: 2px solid var(--text-node-card-border);
  background: var(--text-node-card-bg);
}
.vicino-product-node.is-storyboard .vicino-product-node-shell {
  border: 1px solid var(--image-node-card-border);
  background: var(--image-node-card-bg);
}
.vicino-product-node.is-video .vicino-product-node-shell,
.vicino-product-node.is-shoot .vicino-product-node-shell {
  border: 2px solid rgba(255, 166, 19, 0.5);
  background: var(--image-node-card-bg);
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
.vicino-product-node.is-script .vicino-product-node-header,
.vicino-product-node.is-storyboard .vicino-product-node-header,
.vicino-product-node.is-shoot .vicino-product-node-header,
.vicino-product-node.is-video .vicino-product-node-header {
  border-bottom: none;
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
  height: calc(100% - 53px);
  flex-direction: column;
  gap: 10px;
}
.vicino-script-source {
  flex: 1;
  display: flex;
  min-height: 0;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  padding: 12px;
  border: 0;
  border-radius: var(--node-panel-radius);
  background: var(--text-node-prompt-input-bg);
  box-shadow: var(--glass-btn-shadow);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.vicino-script-source span {
  color: rgba(255,255,255,0.5);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-small);
  letter-spacing: 0;
  text-transform: none;
}
.vicino-script-source strong {
  color: var(--text-node-textarea-text);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-body);
  font-weight: 400;
  line-height: 1.35;
  letter-spacing: 0;
}
.vicino-script-lines {
  display: grid;
  gap: 8px;
}
.vicino-script-lines i {
  display: block;
  height: 7px;
  border-radius: 4px;
  background: rgba(241,160,250,0.28);
}
.vicino-script-lines i:nth-child(1) {
  width: 92%;
}
.vicino-script-lines i:nth-child(2) {
  width: 76%;
}
.vicino-script-lines i:nth-child(3) {
  width: 58%;
}
.vicino-storyboard-scene-card {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 2;
  border: 2px solid transparent;
  border-radius: 8px;
  background: #1c1c1c;
  animation: vicino-story-card-border 7.2s ease-in-out infinite;
  animation-delay: calc(var(--scene-index) * 0.34s);
}
.vicino-storyboard-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
  flex: 1;
  min-height: 0;
  padding: 0 8px;
}
.vicino-storyboard-scene-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.08);
  opacity: 0.88;
}
.vicino-storyboard-scene-card .storyboard-scene-img-area {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #1c1c1c;
}
.vicino-storyboard-scene-card .storyboard-scene-thumb {
  display: block;
}
.vicino-storyboard-scene-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 45%, transparent 88%),
    rgba(255,255,255,0.025);
  background-size: 220% 100%;
  animation: vicino-story-shimmer 7.2s ease-in-out infinite;
  animation-delay: calc(var(--scene-index) * 0.34s);
}
.vicino-storyboard-scene-card::after {
  content: none;
}
.vicino-storyboard-scene-card span {
  position: absolute;
  left: 6px;
  top: 6px;
  z-index: 2;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(110,221,179,0.75);
  color: rgba(255,255,255,0.94);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  font-weight: 600;
  letter-spacing: 0;
}
.vicino-storyboard-scene-card i {
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 2;
  width: 32px;
  height: 20px;
  border: 1px solid rgba(255,255,255,0.18);
  opacity: 0.55;
}
.vicino-storyboard-progress {
  height: 4px;
  margin-top: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255,255,255,0.09);
}
.vicino-storyboard-progress span {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--handle-image);
  transform-origin: left center;
  animation: vicino-story-progress 8.4s ease-in-out infinite;
}
.vicino-storyboard-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
  color: rgba(255,255,255,0.5);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-small);
}
.vicino-storyboard-toolbar strong {
  color: rgba(255,255,255,0.78);
  font-size: var(--vicino-node-small);
  font-weight: 400;
}
.vicino-shoot-node-body.shooting-studio-node-content {
  display: flex;
  height: calc(100% - 53px);
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  box-sizing: border-box;
  background: var(--image-node-card-bg);
}
.shooting-studio-node-preview-area {
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 100%;
  min-height: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid transparent;
  background: var(--image-node-thumbnail-bg);
  box-shadow: var(--glass-btn-shadow);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.shooting-studio-node-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.92) contrast(1.04);
}
.image-node-reference-thumbnails-container {
  position: absolute;
  left: 8px;
  bottom: 8px;
  display: flex;
  gap: 6px;
  z-index: 2;
}
.image-node-reference-thumbnail {
  width: 38px;
  height: 28px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 4px;
  background: rgba(0,0,0,0.5);
  box-shadow: 0 6px 14px rgba(0,0,0,0.24);
}
.image-node-reference-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.08);
  opacity: 0.9;
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
  transform-origin: 64% 48%;
  animation: vicino-video-preview-pan 8.4s ease-in-out infinite;
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
@keyframes vicino-story-shimmer {
  0%,
  18% {
    background-position: 180% 0;
    opacity: 1;
  }
  42%,
  100% {
    background-position: -80% 0;
    opacity: 0.1;
  }
}
@keyframes vicino-story-card-border {
  0%,
  22% {
    border-color: transparent;
  }
  34%,
  54% {
    border-color: rgba(110,221,179,0.58);
  }
  82%,
  100% {
    border-color: rgba(110,221,179,0.16);
  }
}
@keyframes vicino-story-progress {
  0% {
    transform: scaleX(0.02);
  }
  68% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0.02);
  }
}
@keyframes vicino-video-preview-pan {
  0%,
  50% {
    transform: scale(2.35) translateX(0);
  }
  78%,
  100% {
    transform: scale(2.35) translateX(-12px);
  }
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
.vicino-flow,
.vicino-reels,
.vicino-decisions {
  background: var(--ink-900);
  box-shadow: 0 0 0 100vmax var(--ink-900);
  clip-path: inset(0 -100vmax);
}

/* ---- station 02 — brief ---- */
.vicino-brief h2 {
  grid-column: 1 / span 6;
}
.vicino-brief-copy {
  grid-column: 8 / span 5;
  display: grid;
  gap: 20px;
}

/* ---- station 02 — repo evidence: team commit ledger + product-arc figures ---- */
.vicino-brief-evidence {
  grid-column: 1 / -1;
  margin-top: var(--v-head-gap);
  padding-top: clamp(28px, 3vw, 40px);
  border-top: 1px solid var(--v-line-soft);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--v-gutter);
  row-gap: clamp(28px, 3vw, 40px);
}
.vicino-brief-ledger {
  grid-column: 1 / span 4;
  min-width: 0;
}
.vicino-ledger-label {
  margin: 0 0 20px;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--accent-gold);
}
.vicino-brief-ledger dl {
  margin: 0;
  display: grid;
  gap: 16px;
}
.vicino-brief-ledger dl div {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  column-gap: 14px;
  align-items: baseline;
}
.vicino-brief-ledger dt {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-label);
  color: var(--accent-gold);
}
.vicino-brief-ledger dd {
  margin: 0;
  max-width: 44ch;
  font-family: var(--font-sans);
  font-size: var(--text-meta);
  line-height: 1.5;
  color: var(--v-meta-ink);
}
.vicino-brief-figure {
  grid-column: span 4;
  margin: 0;
  min-width: 0;
  display: grid;
  gap: 10px;
  align-content: start;
}

/* ---- station 03 — checkpoints ---- */
.vicino-flow h2 {
  grid-column: 1 / span 8;
}
.vicino-flow-map {
  grid-column: 1 / -1;
  margin-top: var(--v-head-gap);
  border-top: 1px solid var(--v-line-soft);
}
.vicino-flow-node {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--v-gutter);
  align-items: start;
  padding: clamp(32px, 3.4vw, 48px) 0;
  border-bottom: 1px solid var(--v-line-soft);
}
.vicino-flow-chip {
  grid-column: 1;
  justify-self: start;
  width: 6px;
  height: 26px;
  margin-left: -3px;
  margin-top: 4px;
  border-radius: 2px 4px 4px 2px;
  background: var(--chip-color);
}
.vicino-flow-node h3 {
  grid-column: 2 / span 3;
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.2;
  color: var(--paper);
}
.vicino-flow-detail {
  grid-column: 5 / span 7;
}
.vicino-flow-claim {
  margin: 0 0 10px;
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: 500;
  line-height: 1.4;
  color: var(--paper);
}
.vicino-flow-conn {
  margin: 12px 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--stone);
}

/* ---- station 04 — interface layers ---- */
.vicino-layers {
  background: var(--ink-950);
}
.vicino-layers-intro {
  grid-column: 1 / span 5;
  align-self: start;
  position: sticky;
  top: 128px;
}
.vicino-layers-intro h2 {
  margin-bottom: 24px;
}
.vicino-layer-list {
  grid-column: 6 / -1;
  border-top: 1px solid var(--v-line-soft);
}
.vicino-layer-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 168px;
  column-gap: var(--v-gutter);
  align-items: start;
  padding: clamp(28px, 3vw, 40px) 0;
  border-bottom: 1px solid var(--v-line-soft);
}
.vicino-layer-row h3 {
  margin: 10px 0 10px;
  font-family: var(--font-sans);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.2;
  color: var(--paper);
}
.vicino-layer-aside {
  margin: 14px 0 0;
  padding-left: 14px;
  border-left: 1px solid color-mix(in srgb, var(--accent-gold) 28%, transparent);
  max-width: 52ch;
  font-family: var(--font-sans);
  font-size: var(--text-meta);
  line-height: 1.5;
  color: var(--v-meta-ink);
}
.vicino-layer-aside span {
  display: block;
  margin-bottom: 4px;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--accent-gold);
}
.vicino-layer-map {
  justify-self: end;
  margin-top: 6px;
}
.vicino-layer-owned {
  transition: fill-opacity 0.3s var(--ease-silk);
}
.vicino-layer-row:hover .vicino-layer-owned {
  fill-opacity: 0.2;
}

/* ---- station 05 — prototype reels ---- */
.vicino-reels h2 {
  grid-column: 1 / span 8;
}
.vicino-reel-grid {
  grid-column: 1 / -1;
  margin-top: var(--v-head-gap);
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

/* ---- station 06 — decisions ---- */
.vicino-decisions h2 {
  grid-column: 1 / span 8;
}
.vicino-decision-list {
  grid-column: 1 / -1;
  margin-top: var(--v-head-gap);
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
.vicino-decision.is-wide .vicino-decision-figure {
  grid-column: 2 / -1;
  margin-top: clamp(24px, 3vw, 44px);
}
.vicino-decision-figure figcaption,
.vicino-brief-figure figcaption {
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

/* ---- canvas pause + reduced motion ---- */
.vicino-live-canvas.is-paused *,
.vicino-live-canvas.is-paused *::before,
.vicino-live-canvas.is-paused *::after {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .vicino-story-edge {
    animation: none;
    stroke-dasharray: none;
    opacity: 0.46;
  }
  .vicino-storyboard-scene-card {
    animation: none;
    border-color: rgba(110, 221, 179, 0.3);
  }
  .vicino-storyboard-scene-card::before {
    animation: none;
    opacity: 0;
  }
  .vicino-storyboard-progress span {
    animation: none;
    transform: none;
  }
  .vicino-product-node.is-video .video-node-v3-player {
    animation: none;
    transform: scale(2.35);
  }
  .vicino-layer-owned {
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
  .vicino-reels h2,
  .vicino-decisions h2 {
    grid-column: 1 / -1;
  }
  .vicino-opening-copy,
  .vicino-brief-copy {
    grid-column: 1 / -1;
    margin-top: 34px;
  }
  .vicino-brief-ledger {
    grid-column: 1 / -1;
  }
  .vicino-brief-figure {
    grid-column: span 6;
  }
  .vicino-layers-intro {
    grid-column: 1 / -1;
    position: static;
    margin-bottom: 40px;
  }
  .vicino-layer-list {
    grid-column: 1 / -1;
  }
  .vicino-flow-node {
    grid-template-columns: 18px minmax(0, 200px) minmax(0, 1fr);
    column-gap: clamp(16px, 3vw, 28px);
  }
  .vicino-flow-node h3 {
    grid-column: 2;
  }
  .vicino-flow-detail {
    grid-column: 3;
  }
  .vicino-decision {
    grid-template-columns: 1fr;
    row-gap: 14px;
  }
  .vicino-decision-index,
  .vicino-decision-copy,
  .vicino-decision-figure,
  .vicino-decision.is-wide .vicino-decision-figure {
    grid-column: 1;
  }
  .vicino-decision-figure {
    max-width: 720px;
    margin-top: 12px;
  }
  .vicino-decision.is-wide .vicino-decision-figure {
    max-width: none;
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
  .vicino-flow-node {
    grid-template-columns: 18px minmax(0, 1fr);
  }
  .vicino-flow-node h3 {
    grid-column: 2;
  }
  .vicino-flow-detail {
    grid-column: 2;
    margin-top: 10px;
  }
  .vicino-layer-row {
    grid-template-columns: 1fr;
  }
  .vicino-layer-map {
    display: none;
  }
  .vicino-brief-figure {
    grid-column: 1 / -1;
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
  const decisions = sections.slice(0, 6);
  const videos = project.moment?.videos ?? [];
  const meta = [
    ["Role", project.role],
    ["Duration", project.duration],
    ["Team", project.teams],
  ];
  // Redundancy check: summary[0] restates the station-01 thesis, so the brief
  // renders only the responsibility framing. That paragraph (summary[1]) is
  // superseded here with the shipped surface names — creation in the left
  // rail, model/run configuration in the right inspector (see factRefresh).
  const briefCopy = [
    "I helped frame the product around responsibility, not feature count. Nodes should represent meaningful stages and outputs. The side rails should hold creation and global configuration — the left rail for creating nodes and pulling in assets, the right inspector for model choice, parameters, and run controls. Sliding panels should carry node-specific input, references, and version context. Editors should handle deep revision work. That separation gave the team a clearer language for deciding where new functionality belonged.",
  ];

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
          01 · Workflow question
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
          <p className="vicino-body-copy">
            I helped turn a fast-growing set of 3D, image, storyboard, video,
            and editing capabilities into a workflow language the team could
            share.
          </p>
        </div>
      </section>

      <section className="vicino-station vicino-brief">
        <span className="vicino-station-rule" aria-hidden="true" />
        <p className="vicino-station-index" data-fade>
          02 · Brief
        </p>
        <h2 data-fade>From Feature Pile-Up to Workflow Architecture</h2>
        <div className="vicino-brief-copy" data-fade>
          {briefCopy.map((p) => (
            <p className="vicino-body-copy" key={p}>
              {p}
            </p>
          ))}
        </div>
        <div className="vicino-brief-evidence">
          <div className="vicino-brief-ledger" data-fade>
            <p className="vicino-ledger-label">The canvas, in the team&rsquo;s commits</p>
            <dl>
              {canvasLedger.map(([date, event]) => (
                <div key={date}>
                  <dt>{date}</dt>
                  <dd>{event}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="vicino-brief-figure" data-fade>
            <div className="vicino-decision-media">
              <Image
                src="/media/vicino/origin-3d-landing.webp"
                alt="Vicino.AI's original landing page — 'Ultimate Solution for 3D' beside a white robot render"
                width={1600}
                height={925}
                sizes="(max-width: 809.98px) 100vw, (max-width: 1079.98px) 50vw, 420px"
                style={{ height: "auto" }}
              />
            </div>
            <figcaption>
              Where the product started — the &ldquo;Ultimate Solution for 3D&rdquo;
              positioning, kept in the builder&rsquo;s user docs.
            </figcaption>
          </figure>
          <figure className="vicino-brief-figure" data-fade>
            <div className="vicino-decision-media">
              <Image
                src="/media/vicino/landing-v3-hero.webp"
                alt="Vicino landing v3 hero — 'Your competitors use the same AI as everyone else'"
                width={1440}
                height={832}
                sizes="(max-width: 809.98px) 100vw, (max-width: 1079.98px) 50vw, 420px"
                style={{ height: "auto" }}
              />
            </div>
            <figcaption>
              Landing v3, May 2026 — the marketing-agents repositioning, checked
              into the repo as a single-file HTML design draft.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="vicino-station vicino-flow">
        <span className="vicino-station-rule" aria-hidden="true" />
        <p className="vicino-station-index" data-fade>
          03 · Checkpoints
        </p>
        <h2 data-fade>Checkpoints Made the Canvas Usable</h2>
        <div className="vicino-flow-map">
          {workflow.map((step) => (
            <div className="vicino-flow-node" key={step.label} data-fade>
              <span
                className="vicino-flow-chip"
                style={{ "--chip-color": step.handle } as CSSProperties}
                aria-hidden="true"
              />
              <h3>{step.label}</h3>
              <div className="vicino-flow-detail">
                <p className="vicino-flow-claim">{step.title}</p>
                <p className="vicino-body-copy">{step.copy}</p>
                <p className="vicino-flow-conn">{step.conn}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="vicino-station vicino-layers">
        <span className="vicino-station-rule" aria-hidden="true" />
        <p className="vicino-station-index" data-fade>
          04 · Interface layers
        </p>
        <div className="vicino-layers-intro" data-fade>
          <h2>Complexity Needed Different Rooms</h2>
          <p className="vicino-body-copy">
            The canvas could not become a drawer for every control. I treated
            interface layers as responsibilities: each layer had to answer what
            it owned, when it appeared, and what it should never absorb.
          </p>
        </div>
        <div className="vicino-layer-list">
          {layers.map((layer, index) => (
            <div className="vicino-layer-row" key={layer.label} data-fade>
              <div>
                <p className="vicino-row-index">
                  {String(index + 1).padStart(2, "0")} · {layer.label}
                </p>
                <h3>{layer.title}</h3>
                <p className="vicino-body-copy">{layer.owns}</p>
                <p className="vicino-layer-aside">
                  <span>Not for</span>
                  {layer.avoids}
                </p>
              </div>
              <LayerMap kind={layer.kind} color={layer.color} />
            </div>
          ))}
        </div>
      </section>

      {videos.length > 0 && (
        <section className="vicino-station vicino-reels">
          <span className="vicino-station-rule" aria-hidden="true" />
          <p className="vicino-station-index" data-fade>
            05 · Prototype reels
          </p>
          <h2 data-fade>Prototypes Had to Move Fast and Still Align the Team</h2>
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
        </section>
      )}

      <section className="vicino-station vicino-decisions">
        <span className="vicino-station-rule" aria-hidden="true" />
        <p className="vicino-station-index" data-fade>
          06 · Decisions
        </p>
        <h2 data-fade>The Work Was Deciding Where Complexity Should Live</h2>
        <div className="vicino-decision-list">
          {decisions.map((section, index) => {
            const wideCaption = wideDecisionCaption(section.image);
            const isWide = Boolean(wideCaption);
            return (
              <section
                className={`vicino-decision${isWide ? " is-wide" : ""}`}
                key={section.heading}
                data-fade
              >
                <p className="vicino-row-index vicino-decision-index">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="vicino-decision-copy">
                  <h3>{sentenceCase(section.heading)}</h3>
                  <p className="vicino-decision-tags">{section.tags}</p>
                  {section.body.slice(0, 2).map((p) => (
                    <p className="vicino-body-copy vicino-decision-body" key={p}>
                      {refreshFacts(p)}
                    </p>
                  ))}
                </div>
                {section.image && (
                  <figure className="vicino-decision-figure">
                    <div className="vicino-decision-media">
                      <Image
                        src={section.image}
                        alt=""
                        width={isWide ? 1600 : 840}
                        height={isWide ? 1000 : 560}
                        sizes={
                          isWide
                            ? "(max-width: 1080px) 100vw, 1260px"
                            : "(max-width: 1080px) 100vw, 560px"
                        }
                        style={{ height: "auto" }}
                      />
                    </div>
                    {wideCaption ? <figcaption>{wideCaption}</figcaption> : null}
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
                station-05 reel figcaption instead of a closing paragraph */}
            {project.moment.body.slice(0, 3).map((p) => (
              <p className="vicino-body-copy" key={p}>
                {refreshFacts(p)}
              </p>
            ))}
          </div>
          <span className="vicino-closing-rule" aria-hidden="true" />
        </section>
      )}
    </article>
  );
}
