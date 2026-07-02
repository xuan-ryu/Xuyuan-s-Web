import Image from "next/image";
import type { Project } from "@/data/projects";
import { VicinoWorkflowCanvas } from "./vicino-workflow-canvas";

const workflow = [
  {
    label: "Script",
    title: "Intent Becomes Editable",
    copy: "The workflow starts as a script object, so intent can be revised before it turns into visual production work.",
  },
  {
    label: "Storyboard",
    title: "Pacing Becomes Visible",
    copy: "The script becomes a sketch storyboard first, giving the creator a low-cost place to inspect sequence and rhythm.",
  },
  {
    label: "ShootNode",
    title: "Shots Become Concrete",
    copy: "The rough board resolves into a production-ready shot board with reference frames and camera intent.",
  },
  {
    label: "Video",
    title: "Motion Becomes Output",
    copy: "The final node turns approved shots into video, keeping the source chain visible instead of burying it in a feed.",
  },
];

const layers = [
  {
    label: "Canvas",
    title: "Workflow Structure",
    owns: "Stages, outputs, selection, and visible state.",
    avoids: "Prompt forms and dense parameters.",
  },
  {
    label: "Sidebar",
    title: "Global Control",
    owns: "Project-level settings, model defaults, and broad context.",
    avoids: "Node-specific inputs.",
  },
  {
    label: "Sliding panel",
    title: "Local Input",
    owns: "Prompts, references, frame input, versions, and current-node controls.",
    avoids: "Deep editing tools.",
  },
  {
    label: "Editor",
    title: "Deep Revision",
    owns: "Timeline work, image editing, 3D refinement, and complex operations.",
    avoids: "Basic node display.",
  },
];

const vicinoCriticalCss = `
.vicino-case-page {
  --vicino-hero-max: 1440px;
  --vicino-section-max: 1440px;
  --vicino-reading-max: 68ch;
  --vicino-h1: clamp(68px, 7.2vw, 112px);
  --vicino-h2: clamp(42px, 4.6vw, 72px);
  --vicino-h3: clamp(27px, 2.35vw, 36px);
  --vicino-h4: clamp(20px, 1.5vw, 23px);
  --vicino-body: clamp(17px, 1.2vw, 20px);
  --vicino-small: 14px;
  --vicino-detail: 12px;
  --vicino-node-body: 14px;
  --vicino-node-small: 12px;
  --vicino-node-detail: 10px;
  --v-paper: var(--ink-950);
  --v-paper-2: var(--ink-900);
  --v-ink: var(--paper);
  --v-ink-deep: #f8fbff;
  --v-soft: rgba(255, 255, 255, 0.76);
  --v-muted: rgba(255, 255, 255, 0.62);
  --v-line: rgba(255, 255, 255, 0.18);
  --v-line-soft: rgba(255, 255, 255, 0.08);
  --v-coral: var(--accent-amber);
  --v-coral-deep: var(--accent-gold);
  --v-cyan: var(--handle-image);
  --handle-text: #9B9CF1;
  --handle-image: #8BD6D9;
  --handle-storyboard: #8BD6D9;
  --handle-video: #FFB366;
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
  --text-node-card-border: rgba(155, 156, 241, 0.30);
  --text-node-card-selected-border: #9B9CF1;
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
  color: var(--v-ink);
  overflow: hidden;
}
.vicino-case-page [data-fade] {
  opacity: 1;
  transform: none;
  animation: none;
}
.vicino-case-page p {
  text-wrap: pretty;
}
.vicino-case-page img,
.vicino-case-page video {
  display: block;
}
.vicino-hero,
.vicino-opening-statement,
.vicino-brief,
.vicino-flow,
.vicino-layers,
.vicino-reels,
.vicino-decisions,
.vicino-closing {
  box-sizing: border-box;
  width: min(100%, var(--vicino-section-max));
  margin-inline: auto;
  padding-left: clamp(20px, 5vw, 82px);
  padding-right: clamp(20px, 5vw, 82px);
}
.vicino-hero {
  width: min(100%, var(--vicino-hero-max));
  min-height: 0;
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(18px, 2vw, 28px);
  row-gap: clamp(52px, 6vw, 86px);
  align-items: start;
  padding-top: clamp(126px, 10vw, 172px);
  padding-bottom: clamp(70px, 8vw, 118px);
  background: var(--ink-950);
}
.vicino-hero-copy {
  position: relative;
  z-index: 1;
  align-self: start;
  grid-column: 1 / span 5;
  padding-top: 0;
}
.vicino-hero h1,
.vicino-brief h2,
.vicino-flow h2,
.vicino-layers h2,
.vicino-reels h2,
.vicino-decisions h2,
.vicino-closing h2 {
  margin: 0;
  font-family: var(--font-serif);
  font-weight: 400;
  letter-spacing: 0;
  color: var(--v-ink);
}
.vicino-hero h1 {
  margin-top: 0;
  max-width: 600px;
  font-size: var(--vicino-h1);
  line-height: 0.92;
}
.vicino-hero-deck {
  max-width: 440px;
  margin: clamp(18px, 2.2vw, 28px) 0 0;
  font-family: var(--font-newsreader);
  font-size: var(--vicino-body);
  font-weight: 300;
  line-height: 1.45;
  color: color-mix(in srgb, var(--accent-gold) 42%, rgba(255,255,255,0.72));
}
.vicino-thesis {
  grid-column: 4 / span 7;
  max-width: 820px;
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--vicino-h2);
  font-weight: 400;
  line-height: 1.06;
  text-wrap: wrap;
  overflow-wrap: break-word;
  color: rgba(255,255,255,0.9);
}
.vicino-opening-copy {
  grid-column: 8 / span 4;
  max-width: 470px;
  margin: clamp(18px, 2vw, 28px) 0 0;
  display: grid;
  gap: 18px;
}
.vicino-opening-copy p {
  margin: 0;
  font-family: var(--font-newsreader);
  font-size: var(--vicino-body);
  line-height: 1.58;
  text-wrap: wrap;
  overflow-wrap: break-word;
  color: var(--v-soft);
}
.vicino-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: 760px;
  margin: clamp(34px, 4.5vw, 58px) 0 0;
  border-top: 1px solid var(--v-line);
  border-bottom: 1px solid var(--v-line);
}
.vicino-hero-meta {
  grid-column: 8 / -1;
  align-self: center;
  width: 100%;
  margin: 0;
  max-width: none;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 2.4vw, 34px);
  border: 0;
}
.vicino-meta div {
  min-width: 0;
  padding: 14px 18px 16px 0;
  border-right: 1px solid var(--v-line);
}
.vicino-hero-meta div {
  display: grid;
  gap: 6px;
  align-content: start;
  padding: 0;
  border-right: 0;
  border-bottom: 0;
}
.vicino-meta div:last-child {
  border-right: 0;
}
.vicino-hero-meta div:last-child {
  border-bottom: 0;
}
.vicino-meta dt {
  margin-bottom: 8px;
  font-family: var(--font-sans);
  font-size: var(--vicino-detail);
  letter-spacing: 0;
  text-transform: none;
  color: var(--v-muted);
}
.vicino-hero-meta dt {
  margin: 0;
  font-size: var(--vicino-detail);
  letter-spacing: 0;
  color: color-mix(in srgb, var(--accent-gold) 74%, rgba(255,255,255,0.62));
}
.vicino-meta dd {
  margin: 0;
  font-family: var(--font-newsreader);
  font-size: var(--vicino-small);
  line-height: 1.35;
  color: var(--v-ink);
}
.vicino-hero-meta dd {
  font-size: var(--vicino-small);
  color: rgba(255,255,255,0.86);
}
.vicino-system-board {
  min-width: 0;
  position: relative;
  z-index: 1;
  align-self: start;
  justify-self: stretch;
  grid-column: 1 / -1;
  width: 100%;
  max-width: none;
  margin-top: 0;
}
.vicino-opening-statement {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(18px, 2vw, 28px);
  row-gap: clamp(24px, 4vw, 54px);
  padding-top: clamp(78px, 8vw, 132px);
  padding-bottom: clamp(86px, 10vw, 160px);
  border-top: 1px solid color-mix(in srgb, var(--accent-gold) 34%, transparent);
}
.vicino-opening-index {
  grid-column: 1 / span 2;
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--vicino-small);
  line-height: 1.45;
  color: color-mix(in srgb, var(--accent-gold) 78%, rgba(255,255,255,0.64));
}
.vicino-product-frame {
  position: relative;
  min-height: clamp(420px, 58vw, 720px);
  overflow: hidden;
  border: 1px solid var(--v-line);
  background: #080b12;
  box-shadow: 0 34px 94px rgba(0, 0, 0, 0.38);
}
.vicino-product-frame::before {
  content: "workflow prototype";
  position: absolute;
  left: 18px;
  top: 16px;
  z-index: 2;
  color: rgba(255,255,255,0.62);
}
.vicino-product-frame video,
.vicino-product-frame img {
  width: 100%;
  height: 100%;
  min-height: inherit;
  object-fit: cover;
}
.vicino-product-frame img {
  position: relative !important;
}
.vicino-live-canvas {
  position: relative;
  width: 100%;
  aspect-ratio: 900 / 640;
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
.vicino-live-stage {
  position: absolute;
  left: 50%;
  top: 0;
  width: 900px;
  height: 640px;
  transform: translateX(-50%) scale(0.72);
  transform-origin: top center;
}
@container (min-width: 820px) {
  .vicino-live-stage {
    transform: translateX(-50%) scale(0.82);
  }
}
@container (min-width: 900px) {
  .vicino-live-stage {
    transform: translateX(-50%) scale(0.9);
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
  background: rgba(155,156,241,0.28);
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
.vicino-generated-preview {
  position: relative;
  overflow: hidden;
  width: 100%;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  background: rgba(255,255,255,0.025);
}
.vicino-generated-preview.is-sketch,
.vicino-generated-preview.is-shoot {
  height: 144px;
}
.vicino-product-node.is-shoot .vicino-generated-preview.is-shoot {
  height: 116px;
}
.vicino-generated-preview.is-sketch img {
  filter: grayscale(1) contrast(1.08);
}
.vicino-generated-preview.is-shoot img {
  filter: saturate(0.92) contrast(1.04);
}
.vicino-generated-preview::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0;
  background:
    linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent),
    rgba(255,255,255,0.025);
  transform: translateX(-100%);
  animation: vicino-preview-generate-sweep 8.4s ease-in-out infinite;
}
.vicino-generated-preview.is-shoot::after {
  animation-delay: 2.8s;
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
.vicino-video-output-stage {
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  min-height: 0;
  aspect-ratio: 16 / 9;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background: var(--video-node-stage-bg);
  box-shadow:
    inset 0 0 0 1px var(--video-node-card-border),
    var(--glass-btn-shadow);
}
.vicino-video-output-stage img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: 64% 48%;
  filter: saturate(0.92) contrast(1.05) brightness(0.78);
  animation: vicino-video-preview-pan 8.4s ease-in-out infinite;
}
.vicino-video-output-stage span {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255,255,255,0.42);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.vicino-video-output-stage span::after {
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
.vicino-story-video-stage {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  height: 54px;
  padding: 5px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  background: rgba(255,255,255,0.025);
}
.vicino-story-video-stage span {
  display: block;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 5px;
  background:
    radial-gradient(circle at 30% 30%, rgba(255,179,71,0.22), transparent 34%),
    rgba(255,255,255,0.03);
  animation: vicino-story-video-frame 7.2s ease-in-out infinite;
}
.vicino-story-video-stage span:nth-child(2) {
  animation-delay: 0.16s;
}
.vicino-story-video-stage span:nth-child(3) {
  animation-delay: 0.32s;
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
@keyframes vicino-story-image-fill {
  0%,
  24% {
    opacity: 0;
  }
  38%,
  82% {
    opacity: 1;
  }
  100% {
    opacity: 0.42;
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
@keyframes vicino-preview-generate-sweep {
  0%,
  18% {
    opacity: 0;
    transform: translateX(-100%);
  }
  30%,
  62% {
    opacity: 1;
  }
  76%,
  100% {
    opacity: 0;
    transform: translateX(100%);
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
@keyframes vicino-story-video-frame {
  0%,
  56% {
    opacity: 0.28;
    transform: translateY(0);
  }
  72%,
  90% {
    opacity: 1;
    transform: translateY(-1px);
  }
  100% {
    opacity: 0.42;
    transform: translateY(0);
  }
}
.vicino-node-prompt {
  display: grid;
  gap: 5px;
}
.vicino-node-prompt span {
  color: rgba(255,255,255,0.38);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  letter-spacing: 0;
  text-transform: none;
}
.vicino-node-prompt p {
  margin: 0;
  color: rgba(255,255,255,0.72);
  font-size: var(--vicino-node-detail);
  line-height: 1.32;
}
.vicino-node-model-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.42);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
}
.vicino-image-stage {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 34px;
  gap: 7px;
  margin-top: 8px;
}
.vicino-image-main,
.vicino-image-refs span,
.vicino-video-stage,
.vicino-preview-pane,
.vicino-preview-panel,
.vicino-model-stage,
.vicino-model-thumbs i {
  border: 1px solid rgba(255,255,255,0.12);
  background:
    radial-gradient(circle at 30% 24%, color-mix(in srgb, var(--node-color) 22%, transparent), transparent 30%),
    rgba(255,255,255,0.025);
}
.vicino-image-main {
  position: relative;
  min-height: 76px;
  border-radius: 8px;
}
.vicino-image-main span {
  position: absolute;
  left: 16px;
  top: 18px;
  width: 44px;
  height: 42px;
  border: 1px solid rgba(255,255,255,0.24);
  transform: rotate(-5deg);
}
.vicino-image-main i {
  position: absolute;
  right: 14px;
  bottom: 13px;
  width: 34px;
  height: 28px;
  border: 1px solid rgba(255,255,255,0.28);
  transform: rotate(7deg);
}
.vicino-image-refs {
  display: grid;
  gap: 6px;
}
.vicino-image-refs span {
  border-radius: 6px;
}
.vicino-video-stage {
  position: relative;
  height: 58px;
  margin-top: 8px;
  overflow: hidden;
  border-radius: 8px;
}
.vicino-video-stage i {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 22px;
  height: 22px;
  border: 1px solid rgba(255,255,255,0.42);
  border-radius: 999px;
  transform: translate(-50%, -50%);
}
.vicino-video-stage i::after {
  content: "";
  position: absolute;
  left: 8px;
  top: 6px;
  width: 0;
  height: 0;
  border-bottom: 5px solid transparent;
  border-left: 7px solid rgba(255,255,255,0.7);
  border-top: 5px solid transparent;
}
.vicino-video-frame-a,
.vicino-video-frame-b {
  position: absolute;
  width: 38px;
  height: 40px;
  border: 1px solid color-mix(in srgb, var(--node-color) 36%, rgba(255,255,255,0.18));
  background: rgba(255,255,255,0.025);
}
.vicino-video-frame-a {
  left: 18px;
  top: 9px;
}
.vicino-video-frame-b {
  right: 18px;
  top: 12px;
}
.vicino-video-controls {
  display: grid;
  grid-template-columns: 18px 1fr 18px;
  gap: 7px;
  margin-top: 8px;
}
.vicino-video-controls span {
  height: 5px;
  border-radius: 999px;
  background: rgba(255,255,255,0.16);
}
.vicino-video-controls span:nth-child(2) {
  background: linear-gradient(90deg, var(--node-color) 0 44%, rgba(255,255,255,0.14) 44%);
}
.vicino-preview-node-body {
  display: grid;
  grid-template-columns: 1fr 58px;
  gap: 8px;
}
.vicino-preview-pane {
  position: relative;
  min-height: 62px;
  border-radius: 8px;
}
.vicino-preview-pane span {
  position: absolute;
  left: 16px;
  top: 15px;
  width: 44px;
  height: 32px;
  border: 1px solid rgba(255,255,255,0.25);
}
.vicino-preview-pane i {
  position: absolute;
  right: 13px;
  bottom: 12px;
  width: 30px;
  height: 20px;
  border: 1px solid color-mix(in srgb, var(--node-color) 42%, rgba(255,255,255,0.24));
}
.vicino-preview-panel {
  display: grid;
  gap: 6px;
  padding: 7px;
  border-radius: 8px;
}
.vicino-preview-panel span {
  display: block;
  height: 6px;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
}
.vicino-model-stage {
  position: relative;
  height: 62px;
  border-radius: 8px;
  background:
    linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px),
    linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
    rgba(255,255,255,0.025);
  background-size: 16px 16px;
}
.vicino-model-stage span {
  position: absolute;
  display: block;
  border: 1px solid color-mix(in srgb, var(--node-color) 54%, rgba(255,255,255,0.36));
  transform: rotateX(58deg) rotateZ(-34deg);
}
.vicino-model-stage span:nth-child(1) {
  left: 36px;
  top: 18px;
  width: 64px;
  height: 42px;
}
.vicino-model-stage span:nth-child(2) {
  left: 56px;
  top: 30px;
  width: 44px;
  height: 30px;
}
.vicino-model-stage span:nth-child(3) {
  left: 74px;
  top: 40px;
  width: 28px;
  height: 18px;
}
.vicino-model-thumbs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 8px;
}
.vicino-model-thumbs i {
  height: 18px;
  border-radius: 5px;
}
.vicino-live-caption {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 22px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: color-mix(in srgb, var(--accent-gold) 46%, rgba(255,255,255,0.52));
  font-family: var(--font-sans);
  font-size: var(--vicino-detail);
  letter-spacing: 0;
  text-transform: none;
  pointer-events: none;
}
.vicino-layer-index,
.vicino-decision-index {
  font-style: normal;
  color: var(--v-coral-deep);
}
.vicino-brief,
.vicino-flow,
.vicino-reels,
.vicino-decisions {
  position: relative;
  background: var(--ink-900);
  box-shadow: 0 0 0 100vmax var(--ink-900);
  clip-path: inset(0 -100vmax);
}
.vicino-brief > *,
.vicino-flow > *,
.vicino-layers > *,
.vicino-reels > *,
.vicino-decisions > *,
.vicino-closing > * {
  position: relative;
  z-index: 1;
}
.vicino-brief::before,
.vicino-flow::before,
.vicino-layers::before,
.vicino-reels::before,
.vicino-decisions::before,
.vicino-closing::before {
  position: absolute;
  left: clamp(20px, 5vw, 82px);
  top: clamp(44px, 5vw, 78px);
  z-index: 0;
  font-family: var(--font-serif);
  font-size: clamp(86px, 13vw, 190px);
  font-weight: 400;
  line-height: 0.8;
  color: color-mix(in srgb, var(--accent-gold) 18%, transparent);
  pointer-events: none;
}
.vicino-brief::before {
  content: "02";
}
.vicino-flow::before {
  content: "03";
}
.vicino-layers::before {
  content: "04";
}
.vicino-reels::before {
  content: "05";
}
.vicino-decisions::before {
  content: "06";
}
.vicino-closing::before {
  content: "07";
}
.vicino-brief {
  padding-top: clamp(82px, 10vw, 150px);
  padding-bottom: clamp(80px, 11vw, 160px);
}
.vicino-brief-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(34px, 7vw, 120px);
  align-items: start;
  margin-top: clamp(26px, 4vw, 58px);
}
.vicino-brief h2,
.vicino-flow h2,
.vicino-layers h2,
.vicino-reels h2,
.vicino-decisions h2,
.vicino-closing h2 {
  max-width: 920px;
  font-size: var(--vicino-h2);
  line-height: 1.02;
}
.vicino-brief-copy p,
.vicino-layer-copy p,
.vicino-closing-copy p {
  max-width: var(--vicino-reading-max);
  margin: 0 0 22px;
  font-family: var(--font-newsreader);
  font-size: var(--vicino-body);
  font-weight: 300;
  line-height: 1.6;
  color: rgba(255,255,255,0.76);
}
.vicino-flow-node span,
.vicino-layer-row > span,
.vicino-decision-tags {
  font-family: var(--font-sans);
  font-size: var(--vicino-small);
  letter-spacing: 0;
  text-transform: none;
  color: color-mix(in srgb, var(--accent-amber) 68%, rgba(255,255,255,0.68));
}
.vicino-flow-node p,
.vicino-layer-row p,
.vicino-decision-copy p:not(.vicino-decision-tags) {
  margin: 0;
  font-family: var(--font-newsreader);
  font-size: var(--vicino-body);
  line-height: 1.56;
  color: var(--v-soft);
}
.vicino-flow {
  padding-top: clamp(86px, 11vw, 168px);
  padding-bottom: clamp(88px, 12vw, 176px);
}
.vicino-flow-head,
.vicino-reels-head,
.vicino-decisions-head {
  max-width: 960px;
  margin-bottom: clamp(34px, 5vw, 76px);
}
.vicino-flow-head h2,
.vicino-reels-head h2,
.vicino-decisions-head h2 {
  margin-top: 0;
}
.vicino-flow-map {
  display: grid;
  border-top: 1px solid var(--v-line);
}
.vicino-flow-node {
  min-height: 0;
  padding: clamp(24px, 3vw, 42px) 0;
  border-bottom: 1px solid var(--v-line);
  display: grid;
  grid-template-columns: 88px minmax(140px, 0.42fr) minmax(0, 1fr);
  gap: clamp(18px, 4vw, 64px);
  align-items: start;
}
.vicino-flow-node span {
  color: var(--v-coral-deep);
}
.vicino-flow-node h3 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--vicino-h3);
  font-weight: 400;
  line-height: 1.04;
}
.vicino-flow-subtitle {
  margin: 0 0 10px;
  font-family: var(--font-newsreader);
  font-size: var(--vicino-h4);
  font-weight: 300;
  letter-spacing: 0;
  line-height: 1.25;
  color: color-mix(in srgb, var(--accent-gold) 34%, var(--v-ink));
}
.vicino-layers,
.vicino-closing {
  position: relative;
  background: var(--ink-950);
  color: var(--v-paper);
}
.vicino-layers {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(42px, 8vw, 128px);
  padding-top: clamp(82px, 10vw, 150px);
  padding-bottom: clamp(88px, 12vw, 178px);
}
.vicino-layers h2,
.vicino-closing h2 {
  color: var(--v-paper);
  margin-top: 0;
}
.vicino-layer-copy p,
.vicino-closing-copy p {
  color: rgba(247,243,235,0.78);
}
.vicino-layer-list {
  border-top: 1px solid rgba(247,243,235,0.16);
}
.vicino-layer-row {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr) minmax(220px, 0.6fr);
  gap: clamp(18px, 3vw, 46px);
  padding: clamp(24px, 3vw, 40px) 0;
  border-bottom: 1px solid rgba(247,243,235,0.16);
  align-items: start;
}
.vicino-layer-row > span {
  color: var(--v-coral-deep);
}
.vicino-layer-row h3 {
  margin: 0 0 10px;
  font-family: var(--font-serif);
  font-size: var(--vicino-h3);
  font-weight: 400;
  line-height: 1.04;
  color: var(--v-paper);
}
.vicino-layer-row p {
  color: rgba(247,243,235,0.76);
}
.vicino-layer-avoid {
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--accent-gold) 28%, rgba(247,243,235,0.2));
  color: rgba(247,243,235,0.7);
  font-family: var(--font-newsreader);
  font-size: var(--vicino-small);
  line-height: 1.4;
}
.vicino-layer-avoid strong {
  display: block;
  margin-bottom: 6px;
  color: color-mix(in srgb, var(--accent-gold) 42%, rgba(247,243,235,0.9));
  font-family: var(--font-sans);
  font-size: var(--vicino-detail);
  letter-spacing: 0;
  text-transform: none;
}
.vicino-reels {
  padding-top: clamp(84px, 10vw, 160px);
  padding-bottom: clamp(90px, 11vw, 170px);
}
.vicino-reel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(16px, 2vw, 28px);
}
.vicino-reel-grid video {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: #080b12;
  border: 1px solid var(--v-line);
}
.vicino-reel-grid video.is-wide {
  grid-column: 1 / -1;
  aspect-ratio: 16 / 9;
}
.vicino-decisions {
  padding-top: clamp(88px, 12vw, 190px);
  padding-bottom: clamp(90px, 12vw, 190px);
}
.vicino-decision-list {
  border-top: 1px solid var(--v-line);
}
.vicino-decision {
  display: grid;
  grid-template-columns: 60px minmax(0, 1fr) minmax(280px, 0.78fr);
  gap: clamp(28px, 5vw, 86px);
  padding: clamp(46px, 7vw, 110px) 0;
  border-bottom: 1px solid var(--v-line);
  align-items: start;
}
.vicino-decision-index {
  font-family: var(--font-sans);
  font-size: var(--vicino-small);
}
.vicino-decision-tags {
  margin: 0 0 18px;
  color: color-mix(in srgb, var(--accent-amber) 70%, rgba(255,255,255,0.66));
}
.vicino-decision h3 {
  max-width: 760px;
  margin: 0 0 14px;
  font-family: var(--font-serif);
  font-size: var(--vicino-h3);
  font-weight: 400;
  line-height: 1.08;
}
.vicino-decision-copy p:not(.vicino-decision-tags) {
  max-width: var(--vicino-reading-max);
  margin: 0 0 20px;
  font-size: var(--vicino-body);
  color: rgba(255,255,255,0.76);
}
.vicino-decision-image {
  margin: 0;
  overflow: hidden;
  background: #080b12;
  border: 1px solid var(--v-line);
}
.vicino-decision-image img {
  width: 100%;
  height: auto;
}
.vicino-closing {
  padding-top: clamp(84px, 10vw, 160px);
  padding-bottom: clamp(90px, 12vw, 180px);
}
.vicino-closing-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: clamp(34px, 7vw, 120px);
  margin-top: clamp(26px, 4vw, 58px);
  align-items: start;
}
@media (max-width: 1080px) {
  .vicino-hero,
  .vicino-opening-statement,
  .vicino-brief-grid,
  .vicino-layers,
  .vicino-closing-grid {
    grid-template-columns: 1fr;
  }
  .vicino-hero-copy,
  .vicino-hero-meta,
  .vicino-system-board,
  .vicino-opening-index,
  .vicino-thesis,
  .vicino-opening-copy {
    grid-column: 1;
  }
  .vicino-flow-map,
  .vicino-reel-grid {
    grid-template-columns: 1fr;
  }
  .vicino-system-board {
    justify-self: stretch;
    max-width: none;
  }
  .vicino-layer-row,
  .vicino-decision {
    grid-template-columns: 1fr;
  }
  .vicino-decision-image {
    max-width: 720px;
  }
}
@media (max-width: 720px) {
  .vicino-hero {
    padding-top: 112px;
    row-gap: 34px;
  }
  .vicino-opening-statement {
    padding-top: 64px;
    padding-bottom: 82px;
  }
  .vicino-meta {
    grid-template-columns: 1fr;
  }
  .vicino-meta div {
    border-right: 0;
    border-bottom: 1px solid var(--v-line);
  }
  .vicino-meta div:last-child {
    border-bottom: 0;
  }
  .vicino-product-frame {
    min-height: 320px;
  }
  .vicino-thesis,
  .vicino-opening-copy {
    max-width: none;
  }
  .vicino-live-stage {
    transform: translateX(-50%) scale(0.58);
  }
  .vicino-flow-node {
    grid-template-columns: 1fr;
    gap: 12px;
    min-height: 0;
  }
  .vicino-reel-grid video.is-wide {
    aspect-ratio: 16 / 10;
  }
}
@media (max-width: 560px) {
  .vicino-live-stage {
    transform: translateX(-50%) scale(0.48);
  }
}
@media (max-width: 480px) {
  .vicino-live-stage {
    transform: translateX(-50%) scale(0.38);
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

        <dl className="vicino-meta vicino-hero-meta" data-fade>
          {meta.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="vicino-system-board" data-fade>
          <VicinoWorkflowCanvas project={project} />
        </div>
      </section>

      <section className="vicino-opening-statement" aria-labelledby="vicino-opening-title">
        <p className="vicino-opening-index" data-fade>
          01 / Workflow question
        </p>
        <h2 className="vicino-thesis" id="vicino-opening-title" data-fade>
          A canvas people could understand, correct, and continue.
        </h2>
        <div className="vicino-opening-copy" data-fade>
          <p>
            The design problem was not how many tools the canvas could hold. It
            was where a person could read the work in progress and know what to
            change next.
          </p>
          <p>
            I helped turn a fast-growing set of 3D, image, storyboard, video,
            and editing capabilities into a workflow language the team could
            share.
          </p>
        </div>
      </section>

      <section className="vicino-brief">
        <div className="vicino-brief-grid">
          <h2 data-fade>From Feature Pile-Up to Workflow Architecture</h2>
          <div className="vicino-brief-copy" data-fade>
            {(project.summary ?? [project.blurb]).slice(0, 2).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="vicino-flow">
        <div className="vicino-flow-head" data-fade>
          <h2>Checkpoints Made the Canvas Usable</h2>
        </div>
        <div className="vicino-flow-map">
          {workflow.map((step, index) => (
            <div className="vicino-flow-node" key={step.label} data-fade>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.label}</h3>
              <div>
                <h4 className="vicino-flow-subtitle">{step.title}</h4>
                <p>{step.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="vicino-layers">
        <div className="vicino-layer-copy" data-fade>
          <h2>Complexity Needed Different Rooms</h2>
          <p>
            The canvas could not become a drawer for every control. I treated
            interface layers as responsibilities: each layer had to answer what
            it owned, when it appeared, and what it should never absorb.
          </p>
        </div>
        <div className="vicino-layer-list">
          {layers.map((layer, index) => (
            <div className="vicino-layer-row" key={layer.label} data-fade>
              <span className="vicino-layer-index">
                {String(index + 1).padStart(2, "0")} / {layer.label}
              </span>
              <div>
                <h3>{layer.title}</h3>
                <p>{layer.owns}</p>
              </div>
              <div className="vicino-layer-avoid">
                <strong>Not for</strong>
                {layer.avoids}
              </div>
            </div>
          ))}
        </div>
      </section>

      {videos.length > 0 && (
        <section className="vicino-reels">
          <div className="vicino-reels-head" data-fade>
            <h2>Prototypes Had to Move Fast and Still Align the Team</h2>
          </div>
          <div className="vicino-reel-grid">
            {videos.map((video, index) => (
              <video
                key={video.src}
                className={video.wide ? "is-wide" : ""}
                src={video.src}
                autoPlay
                muted
                loop
                playsInline
                data-fade
                aria-label={`Vicino prototype reel ${index + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      <section className="vicino-decisions">
        <div className="vicino-decisions-head" data-fade>
          <h2>The Work Was Deciding Where Complexity Should Live</h2>
        </div>
        <div className="vicino-decision-list">
          {decisions.map((section, index) => (
            <section className="vicino-decision" key={section.heading} data-fade>
              <div className="vicino-decision-index">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="vicino-decision-copy">
                <h3>{section.heading}</h3>
                <p className="vicino-decision-tags">{section.tags}</p>
                {section.body.slice(0, 2).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {section.image && (
                <figure className="vicino-decision-image">
                  <Image
                    src={section.image}
                    alt=""
                    width={840}
                    height={560}
                    sizes="(max-width: 900px) 100vw, 34vw"
                    style={{ height: "auto" }}
                  />
                </figure>
              )}
            </section>
          ))}
        </div>
      </section>

      {project.moment && (
        <section className="vicino-closing">
          <div className="vicino-closing-grid">
            <h2 data-fade>{project.moment.title}</h2>
            <div className="vicino-closing-copy" data-fade>
              {project.moment.body.slice(0, 3).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
