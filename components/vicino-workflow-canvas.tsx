"use client";

import Image from "next/image";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { InteractiveCue } from "./ui/interactive-cue";

export type HandleType = "text" | "storyboard" | "image" | "video";
export type NodeKind = "script" | "storyboard" | "shoot" | "video";

export type CanvasNode = {
  id: string;
  kind: NodeKind;
  label: string;
  badge?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  input?: HandleType;
  output?: HandleType;
  inputY?: number;
  outputY?: number;
};

export type OffsetMap = Record<string, { x: number; y: number }>;

// Coordinate space of the node stage. Re-spaced from the old 900x640 board so
// the four nodes fill the hero frame edge-to-edge (no dead dot-grid), scaled
// to the container by .vicino-live-stage in the layout CSS.
export const VICINO_STAGE_W = 1360;
export const VICINO_STAGE_H = 620;
const STAGE_BLEED = 24; // soft clamp: dragged nodes may bleed this far past the stage

// Exact connection colors from the product's typed-edge model:
// TEXT #F1A0FA, STORYBOARD and IMAGE #6EDDB3, VIDEO #FFB347.
export const handleColor: Record<HandleType, string> = {
  text: "#F1A0FA",
  storyboard: "#6EDDB3",
  image: "#6EDDB3",
  video: "#FFB347",
};

// Wrapper/shell/header class names mirror the product's own node components
// (script / story-image / shoot / video node cards and headers). Styling for
// the recreation lives in the .vicino-product-* rules; these names keep the
// anatomy legible.
export const productClassName: Record<NodeKind, string> = {
  script: "base-node-wrapper script-node",
  storyboard: "base-node-wrapper story-image-node",
  shoot: "base-node-wrapper shoot-node",
  video: "base-node-wrapper video-node-v3-root",
};

export const productShellClassName: Record<NodeKind, string> = {
  script: "base-node-container script-node-card",
  storyboard: "base-node-container story-image-card",
  shoot: "base-node-container shoot-node-card",
  video: "base-node-container video-node-v3",
};

const productHeaderClassName: Record<NodeKind, string> = {
  script: "node-header script-node-header",
  storyboard: "node-header story-image-header",
  shoot: "node-header shoot-node-header",
  video: "node-header video-node-v3-header",
};

// The product's narrative pipeline with the real dataflow types:
// Script Generator -TEXT-> Story Board Generator -STORYBOARD-> Shot Node
// -IMAGE-> Video Generator.
export const canvasEdges: Array<[string, string, HandleType]> = [
  ["script", "storyboard", "text"],
  ["storyboard", "shoot", "storyboard"],
  ["shoot", "video", "image"],
];

// Labels are the product's real create-menu names (the create menu: "Script
// Generator", "Story Board Generator", "Shot Node", "Video Generator" —
// registry types script / storyImage / shoot / video). Handle slots follow
// the product's handle positions: first slot centered 56px from node top,
// additional slots every 40px.
export const HANDLE_SLOT_Y = 56;
export const HANDLE_SLOT_SPACING = 40;

// Exported as the single source of node anatomy (real create-menu labels,
// scaled-down node sizes, typed handles) for the hero flow canvas. The
// station-04 board (vicino-model-board.tsx) is a standalone single Image node
// and does not reuse these coordinates.
export const canvasNodes: CanvasNode[] = [
  {
    id: "script",
    kind: "script",
    label: "Script Generator",
    x: 24,
    y: 210,
    w: 280,
    h: 236,
    output: "text",
    outputY: HANDLE_SLOT_Y,
  },
  {
    id: "storyboard",
    kind: "storyboard",
    label: "Story Board Generator",
    x: 344,
    y: 44,
    w: 326,
    h: 302,
    input: "text",
    output: "storyboard",
    inputY: HANDLE_SLOT_Y,
    outputY: HANDLE_SLOT_Y,
  },
  {
    id: "shoot",
    kind: "shoot",
    label: "Shot Node",
    x: 712,
    y: 56,
    w: 252,
    h: 330,
    input: "storyboard",
    output: "image",
    inputY: HANDLE_SLOT_Y,
    outputY: HANDLE_SLOT_Y,
  },
  {
    id: "video",
    kind: "video",
    label: "Video Generator",
    x: 1000,
    y: 330,
    w: 344,
    h: 260,
    input: "image",
    output: "video",
    inputY: HANDLE_SLOT_Y,
    outputY: HANDLE_SLOT_Y,
  },
];

export function offsetFor(node: CanvasNode, offsets: OffsetMap) {
  return offsets[node.id] ?? { x: 0, y: 0 };
}

// Soft-clamp a node's drag/nudge offset so the node stays on (or just past)
// the stage — dragged nodes can't be lost outside the visible frame.
export function clampOffset(
  node: CanvasNode,
  x: number,
  y: number,
  stageW: number = VICINO_STAGE_W,
  stageH: number = VICINO_STAGE_H,
) {
  const minX = -STAGE_BLEED - node.x;
  const maxX = stageW - node.w + STAGE_BLEED - node.x;
  const minY = -STAGE_BLEED - node.y;
  const maxY = stageH - node.h + STAGE_BLEED - node.y;
  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, minY), maxY),
  };
}

function anchor(node: CanvasNode, offsets: OffsetMap, side: "left" | "right") {
  const offset = offsetFor(node, offsets);
  return {
    x: node.x + offset.x + (side === "right" ? node.w : 0),
    y:
      node.y +
      offset.y +
      (side === "right"
        ? node.outputY ?? node.h / 2
        : node.inputY ?? node.h / 2),
  };
}

export function connectorPath(from: CanvasNode, to: CanvasNode, offsets: OffsetMap) {
  const a = anchor(from, offsets, "right");
  const b = anchor(to, offsets, "left");
  const dx = Math.max(34, Math.abs(b.x - a.x) * 0.46);
  return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
}

function NodeIcon({ kind }: { kind: NodeKind }) {
  if (kind === "script") return <span className="vicino-story-icon-lines" aria-hidden="true" />;
  if (kind === "video") return <span className="vicino-story-icon-video" aria-hidden="true" />;
  if (kind === "shoot") return <span className="vicino-story-icon-camera" aria-hidden="true" />;
  return <span className="vicino-story-icon-grid" aria-hidden="true" />;
}

export function ProductHeader({ node }: { node: CanvasNode }) {
  // Every generator header ships the glass play/generate button
  // (the node header .node-header-play-button; ScriptNode has its own).
  const showPlayButton = true;

  return (
    <div className={`vicino-product-node-header ${productHeaderClassName[node.kind]}`}>
      <div className="vicino-product-node-label-row node-header-label-row">
        <button
          className="vicino-product-node-label-group node-header-label-group nodrag"
          type="button"
          tabIndex={-1}
          aria-label={node.label}
        >
          <span className="vicino-product-node-left-icon node-header-left-icon">
            <NodeIcon kind={node.kind} />
          </span>
          <p className="node-header-label node-header-label-clickable" title={node.label}>
            {node.label}
          </p>
        </button>
      </div>
      <div className="vicino-product-node-right node-header-right">
        {node.badge ? (
          <span className="node-header-badge">
            <span className="node-header-badge-text">{node.badge}</span>
          </span>
        ) : null}
        {showPlayButton ? (
          <button
            className="node-header-play-button node-header-play-button--play"
            type="button"
            aria-label={`Run ${node.label}`}
            tabIndex={-1}
          >
            <span className="play-btn-play-icon play-btn-play-icon--plain" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ScriptNode look (the script node): a near-black card holding a column of
// scene cards — each scene a title row plus its beat text. Values are
// specimen data; the anatomy (scene cards, duration tags) is the product's.
const scriptScenes = [
  {
    name: "Scene 1",
    duration: "2.4s",
    text: "Interior studio. A figure enters frame, camera drifts from wide to close.",
  },
  {
    name: "Scene 2",
    duration: "3.1s",
    text: "Close on hands at the desk; the monitor light shifts as the cut widens.",
  },
];

function ScriptNodeBody() {
  return (
    <div className="vicino-script-node-body">
      {scriptScenes.map((scene) => (
        <div className="vicino-script-scene-card script-node-scene-card" key={scene.name}>
          <div className="vicino-script-scene-head">
            <strong>{scene.name}</strong>
            <span>{scene.duration}</span>
          </div>
          <p>{scene.text}</p>
        </div>
      ))}
      <p className="vicino-script-scene-more">+ 4 more scenes</p>
    </div>
  );
}

// StoryImageNode look: the always-2-rows scene grid (story-scenes-container),
// each scene block a glass card with the numbered green circle header and its
// sketch frame.
function StoryboardNodeBody() {
  return (
    <div className="vicino-storyboard-node-body">
      <div className="vicino-storyboard-grid story-scenes-container">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="vicino-storyboard-scene-block story-scene-block nodrag" key={index}>
            <div className="vicino-storyboard-scene-head story-scene-header">
              <span className="vicino-storyboard-scene-num story-scene-number">{index + 1}</span>
              <span className="vicino-storyboard-scene-label story-scene-label">
                Scene {index + 1}
              </span>
            </div>
            <div className="vicino-storyboard-scene-img">
              <Image
                src="/media/work/vicino/storyboard-sketch.png"
                alt=""
                fill
                sizes="80px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ShootNode look: one shot sub-card ("Shot N" title row) holding the labeled
// First Frame box and the Video Prompt box.
function ShootNodeBody() {
  return (
    <div className="vicino-shoot-node-body shoot-node-body">
      <div className="vicino-shoot-shot-card shoot-node-shot-card">
        <div className="vicino-shoot-shot-title-row">
          <strong>Shot 3</strong>
          <span aria-hidden="true" className="vicino-shoot-refresh" />
        </div>
        <div className="vicino-shoot-frame-box shoot-node-frame-box">
          <span className="vicino-shoot-box-label shoot-node-box-label">First Frame</span>
          <Image
            className="vicino-shoot-frame-image shoot-node-frame-image"
            src="/media/work/vicino/shootnode-board.png"
            alt="Cinematic shot board preview"
            width={220}
            height={124}
          />
        </div>
        <div className="vicino-shoot-prompt-box shoot-node-prompt-box">
          <span className="vicino-shoot-box-label shoot-node-box-label">Video Prompt</span>
          <p>Slow push-in, 35mm. Practical warm key; hold on the hands.</p>
        </div>
      </div>
    </div>
  );
}

function VideoNodeBody() {
  return (
    <div className="vicino-video-output-node-body video-node-v3-video-area">
      <div className="video-node-v3-stage">
        <div className="video-node-v3-media">
          <Image
            className="video-node-v3-player"
            src="/media/work/vicino/video-preview.png"
            alt="Video output preview"
            width={260}
            height={148}
          />
        </div>
        <span className="vicino-video-play-overlay" />
      </div>
      <div className="vicino-story-video-controls">
        <i />
        <i />
      </div>
    </div>
  );
}

// Placeholder bodies for the runnable (from-empty) canvas: same structural
// chrome as the real bodies, media and text swapped for skeletons, so a Run
// visibly generates each stage's content from nothing.
function ScriptPlaceholder() {
  return (
    <div className="vicino-script-node-body">
      {[0, 1].map((i) => (
        <div className="vicino-script-scene-card script-node-scene-card is-ph" key={i}>
          <span className="vicino-ph-bar is-w40" />
          <span className="vicino-ph-bar" />
          <span className="vicino-ph-bar is-w70" />
        </div>
      ))}
      <p className="vicino-script-scene-more">&hellip;</p>
    </div>
  );
}

function StoryboardPlaceholder() {
  return (
    <div className="vicino-storyboard-node-body">
      <div className="vicino-storyboard-grid story-scenes-container">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            className="vicino-storyboard-scene-block story-scene-block is-ph"
            key={index}
          >
            <div className="vicino-storyboard-scene-head story-scene-header">
              <span className="vicino-storyboard-scene-num story-scene-number">
                {index + 1}
              </span>
              <span className="vicino-storyboard-scene-label story-scene-label">
                Scene {index + 1}
              </span>
            </div>
            <div className="vicino-storyboard-scene-img is-ph-media" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ShootPlaceholder() {
  return (
    <div className="vicino-shoot-node-body shoot-node-body">
      <div className="vicino-shoot-shot-card shoot-node-shot-card is-ph">
        <div className="vicino-shoot-shot-title-row">
          <strong>Shot 3</strong>
          <span aria-hidden="true" className="vicino-shoot-refresh" />
        </div>
        <div className="vicino-shoot-frame-box shoot-node-frame-box">
          <span className="vicino-shoot-box-label shoot-node-box-label">First Frame</span>
          <div className="vicino-ph-media" />
        </div>
        <div className="vicino-shoot-prompt-box shoot-node-prompt-box">
          <span className="vicino-shoot-box-label shoot-node-box-label">Video Prompt</span>
          <div className="vicino-shoot-ph-lines">
            <span className="vicino-ph-bar" />
            <span className="vicino-ph-bar is-w70" />
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoPlaceholder() {
  return (
    <div className="vicino-video-output-node-body video-node-v3-video-area">
      <div className="video-node-v3-stage">
        <div className="vicino-ph-media" />
      </div>
      <div className="vicino-story-video-controls">
        <i />
        <i />
      </div>
    </div>
  );
}

function NodePlaceholder({ node }: { node: CanvasNode }) {
  if (node.kind === "script") return <ScriptPlaceholder />;
  if (node.kind === "storyboard") return <StoryboardPlaceholder />;
  if (node.kind === "shoot") return <ShootPlaceholder />;
  return <VideoPlaceholder />;
}

export function NodeContent({
  node,
  revealed = true,
}: {
  node: CanvasNode;
  revealed?: boolean;
}) {
  if (!revealed) return <NodePlaceholder node={node} />;
  if (node.kind === "script") return <ScriptNodeBody />;
  if (node.kind === "storyboard") return <StoryboardNodeBody />;
  if (node.kind === "shoot") return <ShootNodeBody />;
  return <VideoNodeBody />;
}

export function VicinoWorkflowCanvas({
  project: _project,
  runnable = false,
  caption = "Board recreation — a few of the node library's types",
}: {
  project: Project;
  // runnable: the station-03 "interactive example" mode — node bodies start
  // as placeholders and a Run control generates the path stage by stage.
  // The hero instance stays ambient (drag only, full content).
  runnable?: boolean;
  caption?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    scale: number;
  } | null>(null);
  const [offsets, setOffsets] = useState<OffsetMap>({});
  const [isPaused, setIsPaused] = useState(false);
  // Coarse pointers get an honest cue: with touch-action: pan-y on the frame,
  // vertical swipes scroll the page and node drags only track sideways.
  const [isCoarse, setIsCoarse] = useState(false);
  // Click-to-run generation flow: runIndex is -1 idle, 0..n-1 the node currently
  // "generating", n once the whole flow has played through. Final-state
  // contract: idle (-1, the server-rendered rest state) shows the COMPLETED
  // run — pressing Run rewinds to placeholders and replays the generation.
  const [runIndex, setRunIndex] = useState(-1);
  const runTimers = useRef<number[]>([]);
  const nodeCount = canvasNodes.length;
  const runActive = runIndex >= 0;

  const byId = useMemo(() => new Map(canvasNodes.map((node) => [node.id, node])), []);

  // Pause the infinite canvas animations (edge flow) while the frame is
  // offscreen — .is-paused sets animation-play-state.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        setIsPaused(!entries[0]?.isIntersecting);
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => runTimers.current.forEach((t) => clearTimeout(t)), []);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const onChange = () => setIsCoarse(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Play the pipeline: light each node in turn (script -> storyboard -> shot ->
  // video), its incoming edge carrying the output, so a click "runs" the flow.
  const playFlow = () => {
    runTimers.current.forEach((t) => clearTimeout(t));
    runTimers.current = [];
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRunIndex(nodeCount);
      return;
    }
    setRunIndex(0);
    for (let i = 1; i <= nodeCount; i += 1) {
      runTimers.current.push(window.setTimeout(() => setRunIndex(i), 850 * i));
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>, node: CanvasNode) => {
    const current = offsetFor(node, offsets);
    // Pointer deltas are in screen px; the stage is scaled to the container,
    // so convert deltas back into stage coordinates for accurate dragging.
    const stageWidth = rootRef.current?.clientWidth ?? VICINO_STAGE_W;
    dragRef.current = {
      id: node.id,
      startX: event.clientX,
      startY: event.clientY,
      baseX: current.x,
      baseY: current.y,
      scale: stageWidth > 0 ? stageWidth / VICINO_STAGE_W : 1,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const node = byId.get(drag.id);
    if (!node) return;
    const scale = drag.scale || 1;
    // Touch drags stay horizontal: the frame's touch-action: pan-y hands the
    // vertical axis to the page scroll, so the node must not track it either.
    const isTouch = event.pointerType === "touch";
    const next = clampOffset(
      node,
      drag.baseX + (event.clientX - drag.startX) / scale,
      isTouch ? drag.baseY : drag.baseY + (event.clientY - drag.startY) / scale,
    );
    setOffsets((current) => ({ ...current, [drag.id]: next }));
  };

  const stopDragging = () => {
    dragRef.current = null;
  };

  // Keyboard parity for the drag interaction: arrow keys nudge the focused
  // node (Shift for larger steps), soft-clamped to the stage like dragging.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, node: CanvasNode) => {
    const step = event.shiftKey ? 32 : 12;
    let dx = 0;
    let dy = 0;
    if (event.key === "ArrowLeft") dx = -step;
    else if (event.key === "ArrowRight") dx = step;
    else if (event.key === "ArrowUp") dy = -step;
    else if (event.key === "ArrowDown") dy = step;
    else return;
    event.preventDefault();
    setOffsets((current) => {
      const base = current[node.id] ?? { x: 0, y: 0 };
      return { ...current, [node.id]: clampOffset(node, base.x + dx, base.y + dy) };
    });
  };

  const nodeStateClass = (index: number) => {
    if (!runActive) return "";
    if (index < runIndex) return " is-generated";
    if (index === runIndex) return " is-generating";
    return " is-pending";
  };
  const edgeStateClass = (index: number) => {
    if (!runActive) return "";
    if (runIndex === index + 1) return " is-flowing";
    if (runIndex > index + 1) return " is-flowed";
    return " is-dim";
  };
  const runLabel =
    runIndex < 0
      ? "▶ Run the flow"
      : runIndex >= nodeCount
        ? "↻ Replay"
        : "Generating…";

  return (
    <div className="vicino-live-wrap">
    <div
      ref={rootRef}
      className={`vicino-live-canvas is-storyboard-animation${isPaused ? " is-paused" : ""}${runActive ? " is-flow-run" : ""}${runnable ? " is-runnable" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <div className="vicino-live-dots" aria-hidden="true" />
      <div className="vicino-live-stage">
        <svg
          className="vicino-live-edges"
          viewBox={`0 0 ${VICINO_STAGE_W} ${VICINO_STAGE_H}`}
          aria-hidden="true"
        >
          {canvasEdges.map(([fromId, toId, type], edgeIndex) => {
            const from = byId.get(fromId);
            const to = byId.get(toId);
            if (!from || !to) return null;
            return (
              <path
                className={`vicino-story-edge is-${type}${edgeStateClass(edgeIndex)}`}
                key={`${fromId}-${toId}`}
                d={connectorPath(from, to, offsets)}
                style={{ stroke: handleColor[type] }}
              />
            );
          })}
        </svg>

        {canvasNodes.map((node, nodeIndex) => {
          const offset = offsetFor(node, offsets);
          return (
            <div
              className={`vicino-product-node is-${node.kind} ${productClassName[node.kind]}${nodeStateClass(nodeIndex)}`}
              key={node.id}
              role="button"
              tabIndex={0}
              aria-label={`${node.label} node — drag or use arrow keys to move`}
              style={
                {
                  width: node.w,
                  height: node.h,
                  transform: `translate3d(${node.x + offset.x}px, ${node.y + offset.y}px, 0)`,
                  "--node-color": handleColor[node.output ?? node.input ?? "storyboard"],
                  "--input-y": `${node.inputY ?? node.h / 2}px`,
                  "--output-y": `${node.outputY ?? node.h / 2}px`,
                } as CSSProperties
              }
              onPointerDown={(event) => handlePointerDown(event, node)}
              onKeyDown={(event) => handleKeyDown(event, node)}
            >
              {node.input ? (
                <span
                  className={`vicino-product-handle is-left handle-${node.input}`}
                  style={{ "--handle-color": handleColor[node.input] } as CSSProperties}
                />
              ) : null}
              {node.output ? (
                <span
                  className={`vicino-product-handle is-right handle-${node.output}`}
                  style={{ "--handle-color": handleColor[node.output] } as CSSProperties}
                />
              ) : null}
              <div className={`vicino-product-node-shell ${productShellClassName[node.kind]}`}>
                <ProductHeader node={node} />
                <NodeContent
                  node={node}
                  revealed={!runnable || !runActive || runIndex > nodeIndex}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* the caption/Run row renders below the frame (see .vicino-live-wrap) */}
      </div>

      <div className="vicino-live-caption">
        <span>{caption}</span>
        {runnable ? (
          <button
            type="button"
            className={`vicino-live-run${runIndex < 0 ? " is-primary" : ""}`}
            onClick={playFlow}
            aria-label="Rewind the finished flow and replay its generation stage by stage"
          >
            {runLabel}
          </button>
        ) : (
          <InteractiveCue>
            {isCoarse
              ? "Drag a node sideways — vertical swipes scroll the page"
              : "Drag the nodes — connections follow"}
          </InteractiveCue>
        )}
      </div>
    </div>
  );
}
