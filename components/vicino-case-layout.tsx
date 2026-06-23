import Image from "next/image";
import type { Project } from "@/data/projects";
import { VicinoWorkflowCanvas } from "./vicino-workflow-canvas";

const workflow = [
  {
    label: "Concept",
    title: "Intent becomes a node",
    copy: "The old homepage made the prompt feel like the start of a manipulable chain, not a hidden text box.",
  },
  {
    label: "Sketch",
    title: "Reference becomes inspectable",
    copy: "Images, textures, and inputs sat as visible objects so people could understand what each generation depended on.",
  },
  {
    label: "Video",
    title: "Motion becomes a checkpoint",
    copy: "Generation output was shown as another stage in the chain, where people could pause, compare, and continue.",
  },
  {
    label: "3D Model",
    title: "Output becomes editable",
    copy: "The canvas story ended with a reusable asset, not a disposable result buried in a feed.",
  },
];

const layers = [
  {
    label: "Canvas",
    title: "Workflow structure",
    owns: "Stages, outputs, selection, and visible state.",
    avoids: "Prompt forms and dense parameters.",
  },
  {
    label: "Sidebar",
    title: "Global control",
    owns: "Project-level settings, model defaults, and broad context.",
    avoids: "Node-specific inputs.",
  },
  {
    label: "Sliding panel",
    title: "Local input",
    owns: "Prompts, references, frame input, versions, and current-node controls.",
    avoids: "Deep editing tools.",
  },
  {
    label: "Editor",
    title: "Deep revision",
    owns: "Timeline work, image editing, 3D refinement, and complex operations.",
    avoids: "Basic node display.",
  },
];

const repoSignals = [
  {
    label: "Older official site",
    title: "Vicino used to introduce itself as a live workflow canvas.",
    copy: "The legacy homepage put draggable creation nodes over a dark dotted surface: concept, sketch, texture, video, 3D model, and preview.",
  },
  {
    label: "Interaction clue",
    title: "The homepage was not just showing screens. It let people touch the model.",
    copy: "Nodes could move. Edges stayed connected. The first impression was that creation is spatial, inspectable, and re-routable.",
  },
  {
    label: "Case story",
    title: "The portfolio page should inherit that behavior.",
    copy: "The case now uses the older site's canvas language to explain my work on workflow structure, node ownership, and revision surfaces.",
  },
];

const vicinoCriticalCss = `
.vicino-case-page {
  --v-paper: #09090b;
  --v-paper-2: #0b1220;
  --v-ink: #dcecff;
  --v-ink-deep: #f8fbff;
  --v-soft: rgba(210, 230, 255, 0.72);
  --v-muted: rgba(142, 197, 255, 0.42);
  --v-line: rgba(81, 162, 255, 0.18);
  --v-line-soft: rgba(81, 162, 255, 0.08);
  --v-coral: #51a2ff;
  --v-coral-deep: #8ec5ff;
  --v-cyan: #8bd6d9;
  background: var(--v-paper);
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
.vicino-section-label,
.vicino-kicker,
.vicino-mono {
  margin: 0;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.16em;
  line-height: 1.4;
  text-transform: uppercase;
}
.vicino-section-label,
.vicino-kicker {
  color: var(--v-coral-deep);
}
.vicino-hero,
.vicino-brief,
.vicino-source,
.vicino-flow,
.vicino-layers,
.vicino-reels,
.vicino-decisions,
.vicino-closing {
  padding-left: clamp(20px, 5vw, 82px);
  padding-right: clamp(20px, 5vw, 82px);
}
.vicino-hero {
  min-height: 100dvh;
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: clamp(34px, 6vw, 100px);
  align-items: center;
  padding-top: clamp(108px, 10vw, 164px);
  padding-bottom: clamp(70px, 8vw, 118px);
  background:
    radial-gradient(circle at 72% 22%, rgba(81,162,255,0.16), transparent 35%),
    linear-gradient(90deg, rgba(81,162,255,0.07) 1px, transparent 1px),
    linear-gradient(rgba(81,162,255,0.06) 1px, transparent 1px),
    var(--v-paper);
  background-size: 52px 52px;
}
.vicino-hero-copy {
  position: relative;
  z-index: 1;
}
.vicino-hero h1,
.vicino-brief h2,
.vicino-source h2,
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
  margin-top: clamp(22px, 3vw, 42px);
  max-width: 760px;
  font-size: clamp(74px, 12vw, 176px);
  line-height: 0.82;
}
.vicino-thesis {
  max-width: 700px;
  margin: clamp(22px, 3vw, 38px) 0 0;
  font-family: var(--font-serif);
  font-size: clamp(30px, 4vw, 62px);
  font-weight: 400;
  line-height: 0.98;
  color: var(--v-ink-deep);
}
.vicino-hero-note {
  max-width: 640px;
  margin: 28px 0 0;
  font-family: var(--font-newsreader);
  font-size: clamp(18px, 1.5vw, 23px);
  line-height: 1.5;
  color: var(--v-soft);
}
.vicino-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: 760px;
  margin: clamp(38px, 5vw, 72px) 0 0;
  border-top: 1px solid var(--v-line);
  border-bottom: 1px solid var(--v-line);
}
.vicino-meta div {
  min-width: 0;
  padding: 14px 18px 16px 0;
  border-right: 1px solid var(--v-line);
}
.vicino-meta div:last-child {
  border-right: 0;
}
.vicino-meta dt {
  margin-bottom: 8px;
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--v-muted);
}
.vicino-meta dd {
  margin: 0;
  font-family: var(--font-newsreader);
  font-size: clamp(14px, 1.15vw, 17px);
  line-height: 1.35;
  color: var(--v-ink);
}
.vicino-system-board {
  min-width: 0;
  position: relative;
  z-index: 1;
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
  aspect-ratio: 720 / 480;
  overflow: hidden;
  border: 1px solid rgba(81,162,255,0.2);
  background:
    radial-gradient(circle at 52% 45%, rgba(81,162,255,0.14), transparent 34%),
    linear-gradient(180deg, rgba(13,18,32,0.94), rgba(5,7,13,0.98));
  box-shadow: 0 34px 120px rgba(0,0,0,0.46);
  touch-action: none;
}
.vicino-live-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(142,197,255,0.36) 1px, transparent 1.5px);
  background-size: 22px 22px;
  mask-image: radial-gradient(circle at 50% 44%, black 0, black 54%, transparent 84%);
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
  stroke: rgba(210,230,255,0.38);
  stroke-width: 1.7;
}
.vicino-live-node {
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  border: 1px solid rgba(210,230,255,0.18);
  background: rgba(7,12,24,0.88);
  box-shadow: 0 22px 70px rgba(0,0,0,0.46);
  cursor: grab;
  user-select: none;
  will-change: transform;
}
.vicino-live-node:active {
  cursor: grabbing;
}
.vicino-live-node-label,
.vicino-live-node-sublabel {
  position: absolute;
  z-index: 2;
  left: 13px;
  font-family: var(--font-mono, monospace);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  pointer-events: none;
}
.vicino-live-node-label {
  top: 12px;
  font-size: 10px;
  color: rgba(248,251,255,0.92);
}
.vicino-live-node-sublabel {
  top: 29px;
  font-size: 8px;
  color: rgba(142,197,255,0.58);
}
.vicino-live-node-text {
  position: absolute;
  top: 54px;
  left: 13px;
  right: 13px;
  margin: 0;
  font-family: var(--font-newsreader);
  font-size: 14px;
  line-height: 1.35;
  color: rgba(210,230,255,0.74);
}
.vicino-live-node img,
.vicino-live-node video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
.vicino-live-node.is-video .vicino-live-node-label,
.vicino-live-node.is-video .vicino-live-node-sublabel,
.vicino-live-node.is-image .vicino-live-node-label,
.vicino-live-node.is-image .vicino-live-node-sublabel {
  text-shadow: 0 1px 12px rgba(0,0,0,0.7);
}
.vicino-live-model {
  position: absolute;
  inset: 34px 20px 18px;
  border: 1px solid rgba(81,162,255,0.18);
  background:
    linear-gradient(90deg, rgba(81,162,255,0.08) 1px, transparent 1px),
    linear-gradient(rgba(81,162,255,0.07) 1px, transparent 1px);
  background-size: 18px 18px;
}
.vicino-live-model span {
  position: absolute;
  display: block;
  border: 1px solid rgba(139,214,217,0.54);
  transform: rotateX(58deg) rotateZ(-34deg);
}
.vicino-live-model span:nth-child(1) {
  left: 38px;
  top: 22px;
  width: 82px;
  height: 60px;
}
.vicino-live-model span:nth-child(2) {
  left: 62px;
  top: 35px;
  width: 58px;
  height: 42px;
}
.vicino-live-model span:nth-child(3) {
  left: 88px;
  top: 52px;
  width: 38px;
  height: 26px;
  border-color: rgba(81,162,255,0.72);
}
.vicino-live-caption {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 14px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: rgba(142,197,255,0.58);
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  pointer-events: none;
}
.vicino-workflow-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  margin-top: 14px;
  border: 1px solid var(--v-line);
  background: rgba(7,12,24,0.72);
}
.vicino-workflow-strip span {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
  padding: 13px 12px;
  border-right: 1px solid var(--v-line);
  color: var(--v-ink);
}
.vicino-workflow-strip span:last-child {
  border-right: 0;
}
.vicino-workflow-strip i,
.vicino-layer-index,
.vicino-decision-index {
  font-style: normal;
  color: var(--v-coral-deep);
}
.vicino-brief,
.vicino-flow,
.vicino-reels,
.vicino-decisions {
  background: #0b1220;
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
.vicino-source h2,
.vicino-flow h2,
.vicino-layers h2,
.vicino-reels h2,
.vicino-decisions h2,
.vicino-closing h2 {
  font-size: clamp(40px, 5.5vw, 92px);
  line-height: 0.95;
}
.vicino-brief-copy p,
.vicino-layer-copy p,
.vicino-closing-copy p {
  margin: 0 0 22px;
  font-family: var(--font-newsreader);
  font-size: clamp(18px, 1.45vw, 22px);
  font-weight: 300;
  line-height: 1.55;
  color: rgba(210,230,255,0.72);
}
.vicino-source {
  padding-top: clamp(78px, 9vw, 140px);
  padding-bottom: clamp(82px, 10vw, 150px);
  background: #09090b;
}
.vicino-source-head {
  max-width: 980px;
}
.vicino-source h2,
.vicino-source-grid {
  margin-top: 22px;
}
.vicino-source-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr) minmax(0, 1fr);
  gap: 1px;
  background: var(--v-line);
  border: 1px solid var(--v-line);
}
.vicino-source-card {
  min-height: 300px;
  padding: clamp(24px, 3vw, 38px);
  background: rgba(7,12,24,0.82);
}
.vicino-source-card span,
.vicino-flow-node span,
.vicino-layer-row > span,
.vicino-decision-tags {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}
.vicino-source-card span {
  color: var(--v-coral-deep);
}
.vicino-source-card h3 {
  margin: clamp(46px, 6vw, 92px) 0 16px;
  font-family: var(--font-serif);
  font-size: clamp(28px, 3vw, 48px);
  font-weight: 400;
  line-height: 1;
}
.vicino-source-card p,
.vicino-flow-node p,
.vicino-layer-row p,
.vicino-decision-copy p:not(.vicino-decision-tags) {
  margin: 0;
  font-family: var(--font-newsreader);
  font-size: 17px;
  line-height: 1.5;
  color: var(--v-soft);
}
.vicino-flow {
  padding-top: clamp(86px, 11vw, 168px);
  padding-bottom: clamp(88px, 12vw, 176px);
}
.vicino-flow-head,
.vicino-reels-head,
.vicino-decisions-head {
  max-width: 980px;
  margin-bottom: clamp(34px, 5vw, 76px);
}
.vicino-flow-head h2,
.vicino-reels-head h2,
.vicino-decisions-head h2 {
  margin-top: 22px;
}
.vicino-flow-map {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--v-line);
  border-left: 1px solid var(--v-line);
}
.vicino-flow-node {
  min-height: 350px;
  padding: clamp(22px, 2.6vw, 38px);
  border-right: 1px solid var(--v-line);
  border-bottom: 1px solid var(--v-line);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    linear-gradient(90deg, rgba(81,162,255,0.06) 1px, transparent 1px),
    linear-gradient(rgba(81,162,255,0.05) 1px, transparent 1px),
    #0b1220;
  background-size: 28px 28px;
}
.vicino-flow-node span {
  color: var(--v-coral-deep);
}
.vicino-flow-node h3 {
  margin: clamp(54px, 7vw, 104px) 0 14px;
  font-family: var(--font-serif);
  font-size: clamp(31px, 3.2vw, 52px);
  font-weight: 400;
  line-height: 1;
}
.vicino-flow-title {
  margin-bottom: 10px !important;
  font-family: var(--font-mono, monospace) !important;
  font-size: 11px !important;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--v-ink) !important;
}
.vicino-layers,
.vicino-closing {
  background: #05070d;
  color: var(--v-paper);
}
.vicino-layers {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(42px, 8vw, 128px);
  padding-top: clamp(82px, 10vw, 150px);
  padding-bottom: clamp(88px, 12vw, 178px);
}
.vicino-layers .vicino-section-label,
.vicino-closing .vicino-section-label {
  color: var(--v-cyan);
}
.vicino-layers h2,
.vicino-closing h2 {
  color: var(--v-paper);
  margin-top: 22px;
}
.vicino-layer-copy p,
.vicino-closing-copy p {
  color: rgba(247,243,235,0.72);
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
  color: var(--v-cyan);
}
.vicino-layer-row h3 {
  margin: 0 0 10px;
  font-family: var(--font-serif);
  font-size: clamp(26px, 2.8vw, 44px);
  font-weight: 400;
  line-height: 1;
  color: var(--v-paper);
}
.vicino-layer-row p {
  color: rgba(247,243,235,0.68);
}
.vicino-layer-avoid {
  padding: 14px;
  border: 1px solid rgba(247,243,235,0.14);
  color: rgba(247,243,235,0.58);
  font-family: var(--font-newsreader);
  font-size: 15px;
  line-height: 1.4;
}
.vicino-layer-avoid strong {
  display: block;
  margin-bottom: 6px;
  color: rgba(247,243,235,0.86);
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
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
  aspect-ratio: 16 / 8;
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
  font-family: var(--font-mono, monospace);
  font-size: 12px;
}
.vicino-decision-tags {
  margin: 0 0 18px;
  color: var(--v-muted);
}
.vicino-decision h3 {
  max-width: 780px;
  margin: 0 0 clamp(22px, 3vw, 38px);
  font-family: var(--font-serif);
  font-size: clamp(28px, 3.2vw, 58px);
  font-weight: 400;
  line-height: 1.02;
}
.vicino-decision-copy p:not(.vicino-decision-tags) {
  max-width: 760px;
  margin: 0 0 20px;
  font-size: clamp(17px, 1.35vw, 21px);
  color: rgba(210,230,255,0.74);
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
  .vicino-brief-grid,
  .vicino-layers,
  .vicino-closing-grid {
    grid-template-columns: 1fr;
  }
  .vicino-source-grid,
  .vicino-flow-map,
  .vicino-reel-grid {
    grid-template-columns: 1fr;
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
  }
  .vicino-meta,
  .vicino-workflow-strip {
    grid-template-columns: 1fr;
  }
  .vicino-meta div,
  .vicino-workflow-strip span {
    border-right: 0;
    border-bottom: 1px solid var(--v-line);
  }
  .vicino-meta div:last-child,
  .vicino-workflow-strip span:last-child {
    border-bottom: 0;
  }
  .vicino-product-frame {
    min-height: 320px;
  }
  .vicino-flow-node {
    min-height: 260px;
  }
  .vicino-reel-grid video.is-wide {
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

  return (
    <article className="vicino-case-page">
      <style dangerouslySetInnerHTML={{ __html: vicinoCriticalCss }} />

      <section className="vicino-hero" id="header">
        <div className="vicino-hero-copy">
          <p className="vicino-kicker" data-fade>
            AI creation workflow / product architecture
          </p>
          <h1 data-fade>Vicino AI</h1>
          <p className="vicino-thesis" data-fade>
            The design problem was not how many things the model could do. It
            was where a person could understand, correct, and continue the work.
          </p>
          <p className="vicino-hero-note" data-fade>
            I helped turn a fast-growing set of 3D, image, prompt, video, and
            editing capabilities into a clearer workflow language for the team.
          </p>
          <dl className="vicino-meta" data-fade>
            {meta.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="vicino-system-board" data-fade>
          <VicinoWorkflowCanvas project={project} />
          <div className="vicino-workflow-strip" aria-hidden="true">
            {workflow.map((step, index) => (
              <span className="vicino-mono" key={step.label}>
                <i>{String(index + 1).padStart(2, "0")}</i>
                {step.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="vicino-brief">
        <p className="vicino-section-label" data-fade>
          Core reframing
        </p>
        <div className="vicino-brief-grid">
          <h2 data-fade>From feature pile-up to workflow architecture.</h2>
          <div className="vicino-brief-copy" data-fade>
            {(project.summary ?? [project.blurb]).slice(0, 2).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="vicino-source">
        <div className="vicino-source-head" data-fade>
          <p className="vicino-section-label">How the product wants to be read</p>
          <h2>The page now follows Vicino's own product logic.</h2>
        </div>
        <div className="vicino-source-grid">
          {repoSignals.map((signal) => (
            <article className="vicino-source-card" key={signal.label} data-fade>
              <span>{signal.label}</span>
              <h3>{signal.title}</h3>
              <p>{signal.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="vicino-flow">
        <div className="vicino-flow-head" data-fade>
          <p className="vicino-section-label">Creation chain</p>
          <h2>Checkpoints mattered more than magic.</h2>
        </div>
        <div className="vicino-flow-map">
          {workflow.map((step, index) => (
            <div className="vicino-flow-node" key={step.label} data-fade>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{step.label}</h3>
                <p className="vicino-flow-title">{step.title}</p>
                <p>{step.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="vicino-layers">
        <div className="vicino-layer-copy" data-fade>
          <p className="vicino-section-label">Interaction architecture</p>
          <h2>Different kinds of complexity needed different rooms.</h2>
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
            <p className="vicino-section-label">Prototype evidence</p>
            <h2>Rough enough to move fast, clear enough to align the team.</h2>
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
          <p className="vicino-section-label">Decision log</p>
          <h2>The design work was deciding where complexity should live.</h2>
        </div>
        <div className="vicino-decision-list">
          {decisions.map((section, index) => (
            <section className="vicino-decision" key={section.heading} data-fade>
              <div className="vicino-decision-index">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="vicino-decision-copy">
                <p className="vicino-decision-tags">{section.tags}</p>
                <h3>{section.heading}</h3>
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
                  />
                </figure>
              )}
            </section>
          ))}
        </div>
      </section>

      {project.moment && (
        <section className="vicino-closing">
          <p className="vicino-section-label" data-fade>
            What changed in my practice
          </p>
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
