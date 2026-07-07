import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { CaseNext } from "@/components/case-next";
import { OffscreenVideo } from "./ui/offscreen-video";
import { VicinoAudienceViz } from "./vicino-audience-viz";
import { VicinoCheckpointViz } from "./vicino-checkpoint-viz";
import { VicinoFlowStrip } from "./vicino-flow-strip";
import { VicinoInterventionViz } from "./vicino-intervention-viz";
import { VicinoModelBoard } from "./vicino-model-board";
import { VicinoPipelineViz } from "./vicino-pipeline-viz";
import { VicinoWorkflowCanvas } from "./vicino-workflow-canvas";
import { stripCssComments } from "@/lib/css-sanitize";

const SEAL_SRC = "/media/shared/seal.png";

// Render-level fact refresh grounded in the owner's own zoning vocabulary:
// the generic "sidebars" phrasing becomes the design model's named layers.
// data/projects.ts is orchestrator-owned; the matching data edit is reported
// for the batched pass.
function refreshFacts(copy: string) {
  return copy.split("editor logic, sidebars, sliding panels").join(
    "editor logic, the Sidebar and Floating Bar layers, sliding panels",
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
  /* how far the dashed chain rail sits into the left margin, off column 1, so
     content breathes instead of hugging the rail (0 at narrow widths) */
  --v-rail-inset: clamp(0px, 2.2vw, 34px);
  /* station rhythm rides the DS tokens: adjacent stations sum to exactly
     one --gap-section; block spacing inside a station is one --gap-block */
  --v-pad-top: calc(var(--gap-section) / 2);
  --v-pad-bottom: calc(var(--gap-section) / 2);
  --v-head-gap: var(--gap-block);
  /* exact shipped connection colors from the product's connection types */
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
  /* ── Unified card system (owner: unify radius + border, add depth/质感, not
     flat AI). One radius, one hairline, one elevated material for every
     case-level card so the page reads as one system. Depth on dark = a surface
     lifted a step off the ground + a top catch-light + a layered shadow. ── */
  --v-card-radius: 16px;
  --v-card-line: rgba(255, 255, 255, 0.10);
  --v-card-surface: #1d1d1f;
  --v-card-shadow: 0 2px 8px rgba(0, 0, 0, 0.38), 0 22px 50px rgba(0, 0, 0, 0.5);
  --v-card-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.07);
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
  left: calc(var(--v-margin) - var(--v-rail-inset));
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

/* ── Reading zones — large flat color blocks that give the continuous
   scroll its rhythm (owner: 大色块分区 is welcome; but NO page-turn, NO
   rounded-corner sheets). The page stays one dark Work Space; zones alternate
   the pure canvas black with a lifted graphite so sections read as distinct
   grounds without ever leaving the dark, and reading is never interrupted. The
   Dataflow Spine + spotlight (added separately) carry the color and life. ── */
.vicino-band {
  position: relative;
}
/* Zones ride the product's OWN two themes:
   dark = inside the Work Space (canvas / flow / interface); light = the reading
   sections, using the real light mode (#fff ground, ink text) so prose reads
   easily. Authentic, not an arbitrary ink/paper alternation. */
.vicino-band[data-zone="canvas"] {
  background: #0a0a0a;
}
.vicino-band[data-zone="frame"] {
  background: #ffffff;
}
.vicino-band[data-zone="flow"] {
  background: #0a0a0a;
}
.vicino-band[data-zone="reflect"] {
  background: #ffffff;
}
/* ── Light-mode reading zones: flip the prose/headings/rails to the product's
   light-theme ink (#000 / #333 / #666, border #e0e0e0). Dark diagram + product
   cards stay dark islands on the white — editorial dark-figures-on-paper — so
   no viz needs re-theming. The header nav-ink sampler flips on its own. ── */
.vicino-band[data-zone="frame"],
.vicino-band[data-zone="reflect"] {
  color: #333333;
}
.vicino-band[data-zone="frame"] .vicino-station h2,
.vicino-band[data-zone="frame"] .vicino-thesis,
.vicino-band[data-zone="reflect"] h2.vicino-closing-title {
  color: #000000;
}
.vicino-band[data-zone="frame"] .vicino-body-copy,
.vicino-band[data-zone="frame"] .vicino-body-copy p,
.vicino-band[data-zone="reflect"] .vicino-closing-copy,
.vicino-band[data-zone="reflect"] .vicino-closing-copy p {
  color: #333333;
}
.vicino-band[data-zone="frame"] .vicino-station-rule,
.vicino-band[data-zone="reflect"] .vicino-closing-rule {
  background: #e0e0e0;
}
.vicino-band[data-zone="frame"] .vicino-wide-figure figcaption {
  color: #666666;
}
.vicino-band[data-zone="frame"] .vicino-station::before,
.vicino-band[data-zone="reflect"] .vicino-station::before,
.vicino-band[data-zone="reflect"] .vicino-closing::before {
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0 7px,
    transparent 7px 16px
  );
}
.vicino-band[data-zone="frame"] .vicino-station-index::before {
  background: rgba(0, 0, 0, 0.32);
}
/* stations inside a zone paint no ground of their own — the zone owns it */
.vicino-band .vicino-station,
.vicino-band .vicino-hero {
  background: transparent;
  box-shadow: none;
  clip-path: none;
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
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--accent-gold);
}
.vicino-station-index::before {
  /* node-handle-shaped tick marking the station on the rail */
  content: "";
  position: absolute;
  left: calc(-3px - var(--v-rail-inset));
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
  /* section claims are read, not glanced — normal tracking (owner rule);
     negative tracking stays reserved for stylized short display names */
  letter-spacing: 0;
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
  align-self: start;
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
  border: 1px solid var(--v-card-line, rgba(255, 255, 255, 0.1));
  border-radius: var(--v-card-radius, 16px);
  background: #050506;
  box-shadow:
    var(--v-card-highlight, inset 0 1px 0 rgba(255, 255, 255, 0.07)),
    var(--v-card-shadow, 0 2px 8px rgba(0, 0, 0, 0.38), 0 22px 50px rgba(0, 0, 0, 0.5));
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
   (strokeWidth 3 vs 2 in the shipped connection types) — same ratio at
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
/* ---- click-to-run generation flow (hero canvas Run button) ---- */
/* quiet resting state (used for Generating… and Replay) — solid, never a
   transparent wash */
.vicino-live-run {
  pointer-events: auto;
  margin: 0;
  padding: 8px 16px;
  border: 1px solid color-mix(in srgb, var(--accent-amber, #e0902f) 55%, transparent);
  border-radius: 999px;
  background: var(--ink-900, #0a0a0a);
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: color-mix(in srgb, var(--accent-amber, #e0902f) 92%, white);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.vicino-live-run:hover {
  background: var(--ink-800, #1c1c1c);
  border-color: var(--accent-amber, #e0902f);
}
/* the opening call to run — solid amber, ink label, unmissable */
.vicino-live-run.is-primary {
  background: var(--accent-amber, #e0902f);
  border-color: var(--accent-amber, #e0902f);
  color: var(--ink-950, #08080a);
  box-shadow: 0 6px 20px -6px color-mix(in srgb, var(--accent-amber, #e0902f) 60%, transparent);
}
.vicino-live-run.is-primary:hover {
  background: color-mix(in srgb, var(--accent-amber, #e0902f) 86%, white);
  color: var(--ink-950, #08080a);
}
.vicino-live-run:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
/* while a run plays, freeze the ambient edge drift and drive edges by state */
.vicino-live-canvas.is-flow-run .vicino-story-edge {
  animation: none;
  opacity: 0.1;
  stroke-dashoffset: 0;
}
.vicino-live-canvas.is-flow-run .vicino-story-edge.is-flowed {
  opacity: 0.5;
}
.vicino-live-canvas.is-flow-run .vicino-story-edge.is-flowing {
  opacity: 0.95;
  animation: vicino-story-edge-flow 0.85s linear infinite;
}
/* node generation states */
.vicino-product-node.is-pending {
  opacity: 0.32;
  transition: opacity 0.45s ease;
}
.vicino-product-node.is-generating,
.vicino-product-node.is-generated {
  opacity: 1;
  transition: opacity 0.35s ease;
}
.vicino-live-canvas .vicino-product-node.is-generating .vicino-product-node-shell {
  border-color: var(--node-color, #6eddb3);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--node-color, #6eddb3) 70%, transparent),
    0 0 26px -4px var(--node-color, #6eddb3);
}
.vicino-product-node.is-generating .vicino-product-node-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  background: linear-gradient(
    115deg,
    transparent 34%,
    color-mix(in srgb, var(--node-color, #6eddb3) 26%, transparent) 50%,
    transparent 66%
  );
  background-size: 240% 100%;
  animation: vicino-gen-sweep 0.85s linear infinite;
}
@keyframes vicino-gen-sweep {
  from {
    background-position: 130% 0;
  }
  to {
    background-position: -130% 0;
  }
}
/* run-from-empty placeholders (runnable canvas): bodies render skeleton bars
   and dashed media frames until their stage generates, then the real content
   reveals — the flow visibly goes from nothing to output */
.vicino-ph-bar {
  display: block;
  height: 7px;
  margin: 6px 0;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.09);
}
.vicino-ph-bar.is-w40 {
  width: 40%;
}
.vicino-ph-bar.is-w70 {
  width: 70%;
}
.vicino-ph-media {
  flex: 1;
  align-self: stretch;
  min-height: 40px;
  margin: 0 8px 8px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.02);
}
.vicino-storyboard-scene-img.is-ph-media {
  min-height: 0;
  margin: 0;
  border: 1px dashed rgba(255, 255, 255, 0.14);
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.02);
}
.vicino-product-node.is-video .video-node-v3-stage .vicino-ph-media {
  position: absolute;
  inset: 0;
  margin: 0;
  border-radius: 8px;
}
.vicino-shoot-ph-lines {
  padding: 0 8px 8px;
}
.vicino-shoot-ph-lines .vicino-ph-bar {
  margin: 4px 0;
}
.vicino-storyboard-scene-block.is-ph .vicino-storyboard-scene-num {
  background: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.55);
}
@media (prefers-reduced-motion: no-preference) {
  .vicino-product-node.is-generating .vicino-ph-bar,
  .vicino-product-node.is-generating .vicino-ph-media {
    animation: vicino-ph-pulse 0.9s ease-in-out infinite;
  }
  .vicino-live-canvas.is-runnable .vicino-product-node.is-generated .vicino-script-node-body,
  .vicino-live-canvas.is-runnable .vicino-product-node.is-generated .vicino-storyboard-node-body,
  .vicino-live-canvas.is-runnable .vicino-product-node.is-generated .vicino-shoot-node-body,
  .vicino-live-canvas.is-runnable .vicino-product-node.is-generated .vicino-video-output-node-body {
    animation: vicino-node-reveal 0.55s var(--ease-silk) both;
  }
}
@keyframes vicino-ph-pulse {
  50% {
    background-color: rgba(255, 255, 255, 0.16);
  }
}
@keyframes vicino-node-reveal {
  from {
    opacity: 0;
    transform: scale(0.98);
    filter: brightness(1.35);
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
  font-family: var(--font-text);
  font-size: 13px;
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
  z-index: 2;
  overflow: hidden;
  border: 1px solid var(--image-node-card-border);
  border-radius: var(--node-shell-radius);
  background: var(--node-shell-bg);
  box-shadow: var(--node-shell-shadow);
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.2s ease;
}
/* Per-kind card surfaces and borders. Owner decision: every node wears the
   storyboard treatment — a 2px border in its OWN connection-type color
   (text pink, storyboard/image teal, video amber) at half strength, full
   strength on hover — instead of the shipped near-invisible hairlines. */
.vicino-product-node.is-script .vicino-product-node-shell {
  border: 2px solid rgba(241, 160, 250, 0.5);
  background: rgba(0, 0, 0, 0.9);
}
.vicino-product-node.is-storyboard .vicino-product-node-shell {
  border: 2px solid rgba(139, 214, 217, 0.5);
  background: var(--image-node-card-bg);
}
.vicino-product-node.is-shoot .vicino-product-node-shell {
  border: 2px solid rgba(110, 221, 179, 0.5);
  background: var(--image-node-card-bg);
}
.vicino-product-node.is-video .vicino-product-node-shell {
  border: 2px solid rgba(255, 179, 71, 0.5);
  background: var(--video-node-card-bg);
}
.vicino-product-node.is-script:hover .vicino-product-node-shell {
  border-color: #F1A0FA;
}
.vicino-product-node.is-shoot:hover .vicino-product-node-shell {
  border-color: #6EDDB3;
}
.vicino-product-node.is-video:hover .vicino-product-node-shell {
  border-color: #FFB347;
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
/* the type-colored 2px borders replace the inner edge gradient on all four
   canvas node kinds (the storyboard precedent, extended) */
.vicino-product-node.is-script .vicino-product-node-shell::after,
.vicino-product-node.is-storyboard .vicino-product-node-shell::after,
.vicino-product-node.is-shoot .vicino-product-node-shell::after,
.vicino-product-node.is-video .vicino-product-node-shell::after {
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
   (the script node's own header); the other three use the shared
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
  z-index: 3;
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
  position: relative;
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
   Prompt boxes (glass shot card, --glass-border boxes,
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
/* coded viz blocks embedded in the ink-900 stations (audience/logic diagrams
   that replaced the blurry raster figures) */
.vicino-brief-viz,
.vicino-flow-viz {
  grid-column: 1 / -1;
  margin: var(--v-head-gap) 0 0;
  min-width: 0;
}
.vicino-flow-viz .vicino-model-invite {
  margin: 0 0 16px;
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
  grid-template-rows: repeat(3, auto);
  column-gap: var(--v-gutter);
  border-top: 1px solid var(--v-line-soft);
}
.v-fs-stop {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
  min-width: 0;
  padding-top: 22px;
}
@supports not (grid-template-rows: subgrid) {
  .v-fs-stop {
    grid-template-rows: repeat(3, auto);
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

/* ---- station 04 — Block B: the interface, one interactive board ---- */
.vicino-model {
  background: var(--ink-950);
}
.vicino-model h2 {
  grid-column: 1 / span 6;
}
/* interactive lead-ins are read, not scanned — sentence case, no caps
   (owner critique: instruction sentences in mono caps are unreadable) */
.vicino-model-invite {
  margin: 4px 0 0;
  font-family: var(--font-text);
  font-size: var(--text-meta);
  font-weight: 300;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
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
  aspect-ratio: 1320 / 760;
  overflow: hidden;
  border: 1px solid var(--v-card-line, rgba(255, 255, 255, 0.1));
  border-radius: var(--v-card-radius, 16px);
  background: #050506;
  box-shadow:
    var(--v-card-highlight, inset 0 1px 0 rgba(255, 255, 255, 0.07)),
    var(--v-card-shadow, 0 2px 8px rgba(0, 0, 0, 0.38), 0 22px 50px rgba(0, 0, 0, 0.5));
  container-type: inline-size;
}
/* 1320x760 stage scaled to the container width (frame shows >=1080px only;
   below that the stacked variant takes over). Stepped rules are the
   fallback; the atan2/tan division is the exact fit. */
.v-mb-stage {
  position: absolute;
  left: 50%;
  top: 0;
  width: 1320px;
  height: 760px;
  transform: translateX(-50%) scale(0.72);
  transform-origin: top center;
}
@container (min-width: 1000px) {
  .v-mb-stage { transform: translateX(-50%) scale(0.76); }
}
@container (min-width: 1100px) {
  .v-mb-stage { transform: translateX(-50%) scale(0.83); }
}
@container (min-width: 1200px) {
  .v-mb-stage { transform: translateX(-50%) scale(0.91); }
}
@container (min-width: 1280px) {
  .v-mb-stage { transform: translateX(-50%) scale(0.97); }
}
@supports (transform: scale(calc(tan(atan2(100cqw, 1320px))))) {
  .v-mb-stage {
    transform: translateX(-50%) scale(calc(tan(atan2(100cqw, 1320px))));
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
/* the sliding panel's handle (the sliding panel .sp-toggle-bar): sits at the
   node's left edge when closed and rides out to the panel's outer edge when
   open, so it reads as part of the panel and slides with it */
.v-mb-tab {
  position: absolute;
  left: 0;
  top: 50%;
  z-index: 4;
  width: 5px;
  height: 72px;
  border-radius: 999px;
  opacity: 0.9;
  transform: translateY(-50%);
  transition: left 0.3s var(--ease-silk), opacity 0.3s var(--ease-standard);
}
.vicino-product-node:hover .v-mb-tab {
  opacity: 1;
}
.vicino-product-node.is-open .v-mb-tab {
  /* ride to the panel's outer (left) edge — panel left = 30px - panel-w */
  left: calc(25px - var(--v-mb-panel-w, 250px));
  opacity: 1;
}

/* Sliding Panel — opens flush to the node's LEFT at node height, with the
   shipped surface: 10px rgba(32,32,32,.94) border, 16px radius, frosted
   rgba(48,46,48,.93) glass. */
.v-mb-panel {
  position: absolute;
  /* slide-phone: the panel (keyboard) sits level with the node top and tucks
     30px under the node (the lid), so opening reads like a slider sliding out */
  right: calc(100% - 30px);
  top: 0;
  z-index: 1;
  box-sizing: border-box;
  /* equal height with the node (slide-phone lid + base line up); the right
     padding keeps the panel's UI clear of the 30px it tucks under the node */
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 38px 12px 12px;
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
   shipped toolbar (glass strip 6px above the node; icon utilities,
   divider, iridescent action buttons). Appears when its node is selected. */
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
  left: 18px;
  top: 14px;
  z-index: 7;
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.04em;
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
  font-family: var(--font-text);
  font-size: var(--text-meta);
  font-weight: 500;
  color: rgba(244, 241, 234, 0.88);
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
  /* the rail's terminal tick — seal red, once on the page. Aligns to the chain
     rail exactly like every station tick (same -rail-inset offset). */
  content: "";
  position: absolute;
  left: calc(-3px - var(--v-rail-inset));
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


/* ---- station 04 — the one Image node (recreation of Vicino's ImageNode) ---- */
/* Card: teal border rgba(139,214,217,.5); #8BD6D9 on hover /
   select, with the shared selected shadow. */
.vicino-product-node.is-image {
  cursor: pointer;
}
.vicino-product-node.is-image:active {
  cursor: pointer;
}
.vicino-product-node.is-image .vicino-product-node-shell {
  border: 1px solid rgba(139, 214, 217, 0.5);
  background: var(--image-node-card-bg);
}
.vicino-product-node.is-image:hover .vicino-product-node-shell,
.vicino-product-node.is-image:focus-visible .vicino-product-node-shell {
  border-color: #8BD6D9;
}
.vicino-product-node.is-image.is-open .vicino-product-node-shell {
  border-color: #8BD6D9;
  /* lighter than the shared selected shadow — the board node sat too heavy */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.32);
}
.vicino-product-node.is-image.is-static {
  cursor: default;
}
/* when the panel is open it slides over the node's left edge, so the left
   input handles tuck UNDER the panel instead of floating on top of it */
.vicino-product-node.is-image.is-open .vicino-product-handle.is-left {
  z-index: 0;
}
/* header image glyph (image-node-header-icon) */
.vicino-img-icon {
  position: relative;
  display: block;
  width: 13px;
  height: 11px;
  border: 1px solid currentColor;
  border-radius: 2px;
}
.vicino-img-icon::before {
  content: "";
  position: absolute;
  left: 1px;
  bottom: 1px;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 3px solid transparent;
  border-bottom: 5px solid currentColor;
}
.vicino-img-icon::after {
  content: "";
  position: absolute;
  right: 2px;
  top: 2px;
  width: 2.5px;
  height: 2.5px;
  border-radius: 50%;
  background: currentColor;
}
/* image area — the node body is the image only (in-node prompt is commented
   out in the shipped ImageNode) */
.vicino-image-node-body {
  display: flex;
  height: calc(100% - 53px);
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 8px 8px;
  background: var(--image-node-card-bg);
  border-radius: 0 0 16px 16px;
}
.vicino-image-node-frame {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: 8px;
  background: #0b0b0d;
  box-shadow: var(--glass-btn-shadow);
}
.vicino-image-node-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.95) contrast(1.03);
}
.vicino-image-node-expand {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 26px;
  height: 26px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 6px;
  background: rgba(11, 11, 13, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  opacity: 0.85;
}
.vicino-image-node-expand::before,
.vicino-image-node-expand::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 7px;
  border: 1.5px solid rgba(255, 255, 255, 0.75);
}
.vicino-image-node-expand::before {
  top: 6px;
  right: 6px;
  border-left: 0;
  border-bottom: 0;
}
.vicino-image-node-expand::after {
  bottom: 6px;
  left: 6px;
  border-right: 0;
  border-top: 0;
}
/* the right output handle's label ("Image") */
.v-mb-out-label {
  position: absolute;
  top: 40px;
  left: calc(100% + 10px);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: #8bd6d9;
  white-space: nowrap;
  pointer-events: none;
}

/* floating bar: the upload icon (joins the shipped duplicate/download/delete) */
.v-mb-fb-ic.is-upload::before {
  left: 12px;
  top: 6px;
  width: 1.5px;
  height: 9px;
  background: currentColor;
  box-shadow: -3px 4px 0 -0.5px currentColor, 3px 4px 0 -0.5px currentColor;
}
.v-mb-fb-ic.is-upload::after {
  left: 8px;
  bottom: 6px;
  width: 10px;
  height: 1.5px;
  background: currentColor;
}

/* sliding panel content — recreation of the node panel */
.v-mb-panel-inner {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}
.v-mb-panel-sep {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}
.v-mb-panel-group {
  display: grid;
  gap: 8px;
}
.v-mb-panel-grouptitle {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--vicino-node-body);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}
.v-mb-panel-sublabel {
  margin: 0 0 6px;
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.45);
}
.v-mb-chip-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.v-mb-chip {
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 8px;
  background: #464657;
  color: #9191de;
  font-family: var(--font-sans);
  font-size: var(--vicino-node-small);
}
.v-mb-chip-add,
.v-mb-imgbox-add {
  position: relative;
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: #222222;
}
.v-mb-chip-add {
  width: 28px;
  height: 28px;
  border-radius: 999px;
}
.v-mb-imgbox-add {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  border-style: dashed;
  border-width: 2px;
}
.v-mb-chip-add::before,
.v-mb-chip-add::after,
.v-mb-imgbox-add::before,
.v-mb-imgbox-add::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  background: rgba(255, 255, 255, 0.6);
  transform: translate(-50%, -50%);
}
.v-mb-chip-add::before,
.v-mb-imgbox-add::before {
  width: 10px;
  height: 1.5px;
}
.v-mb-chip-add::after,
.v-mb-imgbox-add::after {
  width: 1.5px;
  height: 10px;
}
.v-mb-prompt {
  min-height: 50px;
  padding: 9px 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  background: #202020;
}
.v-mb-prompt p {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--vicino-node-small);
  font-weight: 400;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.8);
}

/* sidebar (inspector) content — the inspector panel / the model dropdown / the run bar */
.v-mb-side-head {
  display: grid;
  gap: 2px;
  padding-right: 34px;
}
.v-mb-side-head h4 {
  margin: 4px 0 0;
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: 500;
  line-height: 1.2;
  color: var(--paper);
}
.v-mb-side-type {
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  color: rgba(255, 255, 255, 0.5);
}
.v-mb-side-field {
  display: grid;
  gap: 5px;
}
.v-mb-model-trigger {
  position: relative;
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 24px 0 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  font-family: var(--font-sans);
  font-size: var(--vicino-node-small);
  color: var(--text-node-textarea-text);
}
.v-mb-model-trigger::after {
  content: "";
  position: absolute;
  right: 10px;
  top: 50%;
  width: 0;
  height: 0;
  margin-top: -2px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid rgba(255, 255, 255, 0.55);
}
.v-mb-side-hint {
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  color: rgba(255, 255, 255, 0.4);
}
.v-mb-side-seg {
  display: inline-grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.35);
}
.v-mb-side-seg em {
  padding: 4px 0;
  border-radius: 4px;
  font-family: var(--font-sans);
  font-size: var(--vicino-node-small);
  font-style: normal;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}
.v-mb-side-seg em.is-current {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
}
.v-mb-run-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 2px;
  font-family: var(--font-sans);
  font-size: var(--vicino-node-detail);
  color: rgba(255, 255, 255, 0.55);
}
.v-mb-generate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  border: 1px solid color-mix(in srgb, var(--accent-amber) 55%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--accent-amber) 16%, transparent);
  color: var(--accent-amber);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s var(--ease-standard);
}
.v-mb-generate:hover {
  background: color-mix(in srgb, var(--accent-amber) 24%, transparent);
}
.v-mb-generate:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}
.v-mb-generate-glyph {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid currentColor;
}

/* in-canvas connectors: thin lines from each corner frame to its element,
   stroked in that zone's own product accent (set inline) */
.v-mb-conn-svg {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}
.v-mb-conn-line {
  stroke-width: 1.4;
  opacity: 0.5;
}
.v-mb-conn-dot {
  opacity: 0.85;
}

/* the inspector Sidebar as a stage element beside the node (part of the
   cluster). Inner styles are shared with the mobile stack via .v-mb-side-*. */
.v-mb-sidebar {
  position: absolute;
  z-index: 8;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  background: rgba(10, 10, 12, 0.94);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.45);
}
.v-mb-sidebar .v-mb-side-head {
  padding-right: 0;
}
/* the inspector's bottom run bar (the run bar) — cost + Generate, anchored to
   the foot of the column with a separating rule */
.v-mb-side-run {
  margin-top: auto;
  display: grid;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* corner annotation frames — ink/hairline/gold-eyebrow chrome (NOT coloured
   borders); the product-accent lives only in the tick + connector */
.v-mb-fnote {
  position: absolute;
  z-index: 6;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid var(--v-line);
  border-radius: 10px;
  background: rgba(6, 6, 8, 0.72);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}
/* zone annotation titles read as titles — sentence case, text face */
.v-mb-fnote-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 7px;
  font-family: var(--font-text);
  font-size: var(--text-meta);
  font-weight: 500;
  line-height: 1.2;
  color: var(--paper);
}
.v-mb-fnote-tick {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 2px;
}
.v-mb-fnote-copy {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 300;
  line-height: 1.45;
  color: var(--v-body-ink);
}

/* keep the grid from stretching to the wide static floating bar's max-content;
   the bar scrolls inside its own overflow box instead */
.v-mb-root {
  grid-template-columns: minmax(0, 1fr);
}
.v-mb-stack,
.v-mb-stack-item {
  min-width: 0;
}
.v-mb-stack-floatbar {
  max-width: 100%;
}
/* mobile stack: plain zone headings (no accordion in the single-node board) */
.v-mb-stack-item h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 12px;
  padding: 18px 0 0;
  font-family: var(--font-sans);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.2;
  color: var(--paper);
}
.v-mb-stack-panel.is-rail {
  gap: 12px;
}

@media (prefers-reduced-motion: reduce) {
  .v-mb-generate {
    transition: none;
  }
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
    grid-template-rows: repeat(6, auto);
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
  const meta = [
    ["Role", project.role],
    ["Duration", project.duration],
    ["Team", project.teams],
  ];
  // Arc: hero (product) -> 01 overview (role/scope) -> 02 context & problem
  // -> 03 the flow (Block A: main path told once — strip + deck artifact)
  // -> 04 the interface (Block B: the zoning, shown on ONE recreated Image node)
  // -> 05 evidence (reels + tightened ledger) -> the moment (seal) -> next case.
  //
  // Data reuse map (data/projects.ts stays orchestrator-owned):
  //   blurb ¶1        -> station 02 copy (expansion/problem framing)
  //   blurb ¶2        -> station 01 copy (role growth), "sidebars" refreshed
  //   sections[0]     -> station 02 copy + figure (structural ambiguity)
  //   sections[2]     -> its per-step argument lives in station 03's flow
  //                      strip; its deck image is that station's artifact
  //   sections[5]     -> its zoning argument is retold in the designer's own
  //                      words by station 04's interactive board; the internal
  //                      "Detail PDR" board image is intentionally NOT featured
  //                      (owner confidentiality: summarize, don't reproduce)
  //   sections[6]     -> station 05 intro (prototype working style)
  //   summary[]       -> unrendered here (hero/overview already carry it)
  const overviewCopy = refreshFacts(project.blurb.split("\n\n")[1] ?? "");
  const contextCopy = project.blurb.split("\n\n")[0] ?? "";
  const ambiguityCopy = sections[0]?.body[0];
  const contextFigure = sections[0]?.image;
  // The main-path deck is the product's own flow overview (Script → Storyboard
  // → Shot → Image Editor → Video). Hardcoded (decoupled from data) like the
  // other declassified vicino artifacts. Owner-supplied prototype screenshot.
  const mainPathFigure = "/media/work/vicino/flow-overview.png";

  return (
    <article className="vicino-case-page">
      <style
        dangerouslySetInnerHTML={{
          __html: stripCssComments(vicinoCriticalCss),
        }}
      />

      {/* ── reading zones: large flat color blocks (canvas black ↔ graphite)
          for scroll rhythm — continuous, no page-turn, no rounded sheets ── */}
      <div className="vicino-band" data-zone="canvas">
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
      </div>

      <div className="vicino-band" data-zone="frame">
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
            The design problem was never how many tools the canvas could hold,
            and better models will not retire it. It is where a person can read
            the work in progress, shape their own intent, and know what to change
            next.
          </p>
          {overviewCopy ? <p className="vicino-body-copy">{overviewCopy}</p> : null}
        </div>
        {videos.length > 0 && (
          <>
            <p className="vicino-sub-label" data-fade>
              The product in use
            </p>
            <div className="vicino-reel-grid">
              {videos.map((video) => (
                <figure
                  className={`vicino-reel${video.wide ? " is-wide" : ""}`}
                  key={video.src}
                  data-fade
                >
                  <OffscreenVideo src={video.src} />
                </figure>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="vicino-station vicino-brief">
        <span className="vicino-station-rule" aria-hidden="true" />
        <p className="vicino-station-index" data-fade>
          02 · Context &amp; problem
        </p>
        <h2 data-fade>From Raw Generation to a Workflow People Could Steer</h2>
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
              The workflow, roughly mapped: capable nodes, chained to 3D and to
              video off one text-to-image spine — but a newcomer couldn&rsquo;t
              see the 0-to-1 loop, or how to wire node into node into a flow of
              their own.
            </figcaption>
          </figure>
        )}
        <div className="vicino-brief-viz" data-fade>
          <VicinoAudienceViz />
        </div>
        <div className="vicino-brief-viz" data-fade>
          <VicinoPipelineViz />
        </div>
      </section>
      </div>

      <div className="vicino-band" data-zone="flow">
      <section className="vicino-station vicino-flow">
        <span className="vicino-station-rule" aria-hidden="true" />
        <p className="vicino-station-index" data-fade>
          03 · The flow
        </p>
        <h2 data-fade>The Main Path, Built to Keep Intent Legible</h2>
        <div className="vicino-model-copy" data-fade>
          <p className="vicino-body-copy">
            I rebuilt the main path around four checkpoints — script, storyboard,
            shot, video — each a place to inspect and redirect before the next,
            costlier step. Each also asks the person to state their intent plainly, and
            that stated intent is the clearest prompt any model can act on: the
            flow does prompt-engineering by design, and teaches it as people work.
          </p>
          <p className="vicino-body-copy">
            The path splits in two: the front — Script and Storyboard — converges
            intent into language any model can read; the back — Shot and Video —
            turns it into generation people can steer and refine. It&rsquo;s also
            the step-control a future full-workflow agent would need.
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
                alt="The main path as a node flow: Script Node refines or writes the script, Storyboard turns it into six sketch scenes, Shot Node generates detailed keyframes, a lighter Image Editor preview lets you refine frames before the costly step, and Video Generation produces the clips — script, storyboard, shot, and video each a checkpoint to inspect and redirect before the next, costlier one."
                width={1851}
                height={854}
                sizes="(max-width: 1080px) 100vw, 1280px"
                style={{ height: "auto" }}
              />
            </div>
            <figcaption>
              The path as nodes on the canvas — script, storyboard, shot, and
              video, with a lighter image-refine preview between shot and video —
              each checkpoint a place to inspect and redirect before the next,
              more expensive one.
            </figcaption>
          </figure>
        )}
        <div className="vicino-flow-viz" data-fade>
          <p className="vicino-model-invite">
            The same path, live — press Run and watch it generate from empty:
            script, storyboard, shot, video
          </p>
          <VicinoWorkflowCanvas
            project={project}
            runnable
            caption="The main path on the board — specimen data"
          />
        </div>
        <div className="vicino-flow-viz" data-fade>
          <VicinoCheckpointViz />
        </div>
        <div className="vicino-flow-viz" data-fade>
          <VicinoInterventionViz />
        </div>
      </section>

      <section className="vicino-station vicino-model">
        <span className="vicino-station-rule" aria-hidden="true" />
        <p className="vicino-station-index" data-fade>
          04 · The interface
        </p>
        <h2 data-fade>A Designated Home for Every Kind of Function</h2>
        <div className="vicino-model-copy" data-fade>
          <p className="vicino-body-copy">
            The new workflow forced a second problem into the open: the
            original lightweight node could not scale to carry these bigger
            encapsulated nodes, and as everything piled onto the same node
            surface the canvas itself turned bloated. A staged workflow needed
            a UI language that could scale with it.
          </p>
          <p className="vicino-body-copy">
            So I gave every kind of function a designated home: the Work Space
            stages the nodes, the Floating Bar carries the next step, the
            Sidebar holds global settings and model selection, the Sliding
            Panel takes node-level adjustment, the Node Panel stays minimal,
            and deep revision leaves for an Editor. Each zone keeps one rule
            and a list of what never goes there — so future features arrive
            with a place to live instead of a new structural debate.
          </p>
          <p className="vicino-model-invite">
            One Image node, every zone in place — click it to open its panel and bar
          </p>
        </div>
        <div className="vicino-model-board-wrap" data-fade>
          <VicinoModelBoard />
        </div>
      </section>
      </div>

      <div className="vicino-band" data-zone="reflect">
      {project.moment && (
        <section className="vicino-station vicino-closing">
          <figure className="vicino-seal" data-fade>
            <Image src={SEAL_SRC} alt="" width={36} height={76} />
          </figure>
          <h2 className="vicino-closing-title" data-fade>
            {project.moment.title}
          </h2>
          <div className="vicino-closing-copy" data-fade>
            {/* body[3] is the anonymous teammate credit — render-filtered into
                the station-04 reel figcaption instead of a closing paragraph */}
            {project.moment.body.slice(0, 3).map((p) => (
              <p className="vicino-body-copy" key={p}>
                {p}
              </p>
            ))}
          </div>
          <span className="vicino-closing-rule" aria-hidden="true" />
        </section>
      )}

      <CaseNext slug={project.slug} />
      </div>
    </article>
  );
}
