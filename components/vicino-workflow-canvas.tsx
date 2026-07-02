"use client";

import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/data/projects";

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

// Exact connection colors from the product's typed-edge model
// (src/core/connections/the connection types): TEXT #F1A0FA, STORYBOARD and
// IMAGE #6EDDB3, VIDEO #FFB347.
export const handleColor: Record<HandleType, string> = {
  text: "#F1A0FA",
  storyboard: "#6EDDB3",
  image: "#6EDDB3",
  video: "#FFB347",
};

export const productClassName: Record<NodeKind, string> = {
  script: "base-node-wrapper text-node-root",
  storyboard: "base-node-wrapper storyboard-node-root",
  shoot: "base-node-wrapper shooting-studio-node-root",
  video: "base-node-wrapper video-node-v3-root",
};

export const productShellClassName: Record<NodeKind, string> = {
  script: "base-node-container text-node-card",
  storyboard: "base-node-container storyboard-node-card",
  shoot: "base-node-container shooting-studio-node-card",
  video: "base-node-container video-node-v3",
};

const productHeaderClassName: Record<NodeKind, string> = {
  script: "node-header text-node-header",
  storyboard: "node-header storyboard-node-header",
  shoot: "node-header shooting-studio-node-header",
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
// measured sizes, typed handles). The hero board uses these coordinates;
// the model board (vicino-model-board.tsx) re-positions the same nodes.
export const canvasNodes: CanvasNode[] = [
  {
    id: "script",
    kind: "script",
    label: "Script Generator",
    x: 28,
    y: 216,
    w: 214,
    h: 230,
    output: "text",
    outputY: HANDLE_SLOT_Y,
  },
  {
    id: "storyboard",
    kind: "storyboard",
    label: "Story Board Generator",
    x: 306,
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
    x: 700,
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
    x: 992,
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
  const showPlayButton = node.kind === "storyboard" || node.kind === "video";

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

function ScriptNodeBody() {
  return (
    <div className="vicino-script-node-body">
      <div className="vicino-script-source">
        <span>Prompt</span>
        <strong>Interior studio. A figure enters frame, camera drifts from wide to close.</strong>
      </div>
      <div className="vicino-script-lines" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function StoryboardNodeBody() {
  return (
    <div className="vicino-storyboard-node-body">
      <div className="vicino-storyboard-grid storyboard-scene-grid cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            className="vicino-storyboard-scene-card storyboard-scene-card nodrag has-image"
            key={index}
            style={{ "--scene-index": index } as CSSProperties}
          >
            <span className="storyboard-scene-num">Scene {index + 1}</span>
            <div className="storyboard-scene-img-area">
              <img
                className="storyboard-scene-thumb"
                src="/media/vicino-storyboard-sketch.png"
                alt=""
              />
            </div>
          </div>
        ))}
      </div>
      <div className="vicino-storyboard-progress">
        <span />
      </div>
      <div className="vicino-storyboard-toolbar">
        <span>6 sketch scenes</span>
        <strong>Generate Shots</strong>
      </div>
    </div>
  );
}

function ShootNodeBody() {
  return (
    <div className="vicino-shoot-node-body shooting-studio-node-content">
      <div className="shooting-studio-node-preview-area">
        <img
          className="shooting-studio-node-preview"
          src="/media/vicino-shootnode-board.png"
          alt="Cinematic shot board preview"
        />
        <div className="image-node-reference-thumbnails-container" aria-hidden="true">
          <div className="image-node-reference-thumbnail">
            <img src="/media/vicino-storyboard-sketch.png" alt="" />
          </div>
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
          <img
            className="video-node-v3-player"
            src="/media/vicino-video-preview.png"
            alt="Video output preview"
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

export function NodeContent({ node }: { node: CanvasNode }) {
  if (node.kind === "script") return <ScriptNodeBody />;
  if (node.kind === "storyboard") return <StoryboardNodeBody />;
  if (node.kind === "shoot") return <ShootNodeBody />;
  return <VideoNodeBody />;
}

export function VicinoWorkflowCanvas({ project: _project }: { project: Project }) {
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

  const byId = useMemo(() => new Map(canvasNodes.map((node) => [node.id, node])), []);

  // Pause the infinite canvas animations (edge flow, shimmer, preview pan)
  // while the frame is offscreen — .is-paused sets animation-play-state.
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
    const next = clampOffset(
      node,
      drag.baseX + (event.clientX - drag.startX) / scale,
      drag.baseY + (event.clientY - drag.startY) / scale,
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

  return (
    <div
      ref={rootRef}
      className={`vicino-live-canvas is-storyboard-animation${isPaused ? " is-paused" : ""}`}
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
          {canvasEdges.map(([fromId, toId, type]) => {
            const from = byId.get(fromId);
            const to = byId.get(toId);
            if (!from || !to) return null;
            return (
              <path
                className={`vicino-story-edge is-${type}`}
                key={`${fromId}-${toId}`}
                d={connectorPath(from, to, offsets)}
                style={{ stroke: handleColor[type] }}
              />
            );
          })}
        </svg>

        {canvasNodes.map((node) => {
          const offset = offsetFor(node, offsets);
          return (
            <div
              className={`vicino-product-node is-${node.kind} ${productClassName[node.kind]}`}
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
                <NodeContent node={node} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="vicino-live-caption">
        <span>Board recreation — 4 of 23 node types</span>
        <span>Drag nodes</span>
      </div>
    </div>
  );
}
