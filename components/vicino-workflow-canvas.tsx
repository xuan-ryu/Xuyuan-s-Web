"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useMemo, useRef, useState } from "react";
import type { Project } from "@/data/projects";

type HandleType = "text" | "storyboard" | "image" | "video";
type NodeKind = "script" | "storyboard" | "shoot" | "video";

type CanvasNode = {
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

type OffsetMap = Record<string, { x: number; y: number }>;

const handleColor: Record<HandleType, string> = {
  text: "#9B9CF1",
  storyboard: "#8BD6D9",
  image: "#8BD6D9",
  video: "#FFB366",
};

const productClassName: Record<NodeKind, string> = {
  script: "base-node-wrapper text-node-root",
  storyboard: "base-node-wrapper storyboard-node-root",
  shoot: "base-node-wrapper shooting-studio-node-root",
  video: "base-node-wrapper video-node-v3-root",
};

const productShellClassName: Record<NodeKind, string> = {
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

const edges: Array<[string, string, HandleType]> = [
  ["script", "storyboard", "text"],
  ["storyboard", "shoot", "storyboard"],
  ["shoot", "video", "image"],
];

const nodes: CanvasNode[] = [
  {
    id: "script",
    kind: "script",
    label: "Script",
    x: 42,
    y: 244,
    w: 214,
    h: 230,
    output: "text",
    outputY: 82,
  },
  {
    id: "storyboard",
    kind: "storyboard",
    label: "Storyboard",
    x: 292,
    y: 54,
    w: 326,
    h: 302,
    input: "text",
    output: "storyboard",
    inputY: 86,
    outputY: 118,
  },
  {
    id: "shoot",
    kind: "shoot",
    label: "Shooting Studio",
    x: 640,
    y: 82,
    w: 252,
    h: 330,
    input: "storyboard",
    output: "image",
    inputY: 146,
    outputY: 168,
  },
  {
    id: "video",
    kind: "video",
    label: "Video",
    x: 264,
    y: 362,
    w: 390,
    h: 270,
    input: "image",
    output: "video",
    inputY: 132,
    outputY: 132,
  },
];

function offsetFor(node: CanvasNode, offsets: OffsetMap) {
  return offsets[node.id] ?? { x: 0, y: 0 };
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

function connectorPath(from: CanvasNode, to: CanvasNode, offsets: OffsetMap) {
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

function ProductHeader({ node }: { node: CanvasNode }) {
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

function NodeContent({ node }: { node: CanvasNode }) {
  if (node.kind === "script") return <ScriptNodeBody />;
  if (node.kind === "storyboard") return <StoryboardNodeBody />;
  if (node.kind === "shoot") return <ShootNodeBody />;
  return <VideoNodeBody />;
}

export function VicinoWorkflowCanvas({ project: _project }: { project: Project }) {
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);
  const [offsets, setOffsets] = useState<OffsetMap>({});

  const byId = useMemo(() => new Map(nodes.map((node) => [node.id, node])), []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>, node: CanvasNode) => {
    const current = offsetFor(node, offsets);
    dragRef.current = {
      id: node.id,
      startX: event.clientX,
      startY: event.clientY,
      baseX: current.x,
      baseY: current.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    setOffsets((current) => ({
      ...current,
      [drag.id]: {
        x: drag.baseX + event.clientX - drag.startX,
        y: drag.baseY + event.clientY - drag.startY,
      },
    }));
  };

  const stopDragging = () => {
    dragRef.current = null;
  };

  return (
    <div
      className="vicino-live-canvas is-storyboard-animation"
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <div className="vicino-live-dots" aria-hidden="true" />
      <div className="vicino-live-stage">
        <svg className="vicino-live-edges" viewBox="0 0 900 640" aria-hidden="true">
          {edges.map(([fromId, toId, type]) => {
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

        {nodes.map((node) => {
          const offset = offsetFor(node, offsets);
          return (
            <div
              className={`vicino-product-node is-${node.kind} ${productClassName[node.kind]}`}
              key={node.id}
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

        <div className="vicino-live-caption">
          <span>Interactive canvas</span>
          <span>Drag nodes</span>
        </div>
      </div>
    </div>
  );
}
