"use client";

import type { PointerEvent } from "react";
import { useMemo, useRef, useState } from "react";
import type { Project } from "@/data/projects";

type NodeKind = "text" | "image" | "video" | "model";

type CanvasNode = {
  id: string;
  kind: NodeKind;
  label: string;
  subLabel: string;
  x: number;
  y: number;
  w: number;
  h: number;
  content?: string;
  src?: string;
};

type OffsetMap = Record<string, { x: number; y: number }>;

const edges = [
  ["concept", "sketch"],
  ["sketch", "robot"],
  ["texture", "robot"],
  ["robot", "model"],
  ["robot", "preview"],
];

function center(node: CanvasNode, offsets: OffsetMap) {
  const offset = offsets[node.id] ?? { x: 0, y: 0 };
  return {
    x: node.x + offset.x + node.w / 2,
    y: node.y + offset.y + node.h / 2,
  };
}

export function VicinoWorkflowCanvas({ project }: { project: Project }) {
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);
  const [offsets, setOffsets] = useState<OffsetMap>({});

  const videos = project.moment?.videos ?? [];
  const nodes = useMemo<CanvasNode[]>(
    () => [
      {
        id: "concept",
        kind: "text",
        label: "Concept",
        subLabel: "Text",
        x: 50,
        y: 62,
        w: 190,
        h: 112,
        content:
          "Humanoid exosuit, brutalist frame, cinematic product realism.",
      },
      {
        id: "sketch",
        kind: "image",
        label: "Sketch",
        subLabel: "Image",
        x: 284,
        y: 82,
        w: 152,
        h: 152,
        src: project.cover,
      },
      {
        id: "robot",
        kind: "video",
        label: "Robot",
        subLabel: "Video",
        x: 510,
        y: 60,
        w: 170,
        h: 202,
        src: videos[0]?.src ?? project.previewVideo,
      },
      {
        id: "texture",
        kind: "video",
        label: "Texture",
        subLabel: "Video",
        x: 68,
        y: 322,
        w: 220,
        h: 118,
        src: videos[1]?.src ?? project.previewVideo,
      },
      {
        id: "preview",
        kind: "video",
        label: "Preview",
        subLabel: "Output",
        x: 334,
        y: 292,
        w: 176,
        h: 112,
        src: project.previewVideo ?? videos[0]?.src,
      },
      {
        id: "model",
        kind: "model",
        label: "3D Model",
        subLabel: "Editable",
        x: 528,
        y: 318,
        w: 168,
        h: 116,
      },
    ],
    [project.cover, project.previewVideo, videos]
  );

  const byId = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>, node: CanvasNode) => {
    const current = offsets[node.id] ?? { x: 0, y: 0 };
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
      className="vicino-live-canvas"
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <div className="vicino-live-dots" aria-hidden="true" />
      <svg className="vicino-live-edges" viewBox="0 0 720 480" aria-hidden="true">
        {edges.map(([fromId, toId]) => {
          const from = byId.get(fromId);
          const to = byId.get(toId);
          if (!from || !to) return null;
          const a = center(from, offsets);
          const b = center(to, offsets);
          const mid = (a.x + b.x) / 2;
          return (
            <path
              key={`${fromId}-${toId}`}
              d={`M ${a.x} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x} ${b.y}`}
            />
          );
        })}
      </svg>

      {nodes.map((node) => {
        const offset = offsets[node.id] ?? { x: 0, y: 0 };
        return (
          <div
            className={`vicino-live-node is-${node.kind}`}
            key={node.id}
            style={{
              width: node.w,
              height: node.h,
              transform: `translate3d(${node.x + offset.x}px, ${node.y + offset.y}px, 0)`,
            }}
            onPointerDown={(event) => handlePointerDown(event, node)}
          >
            <div className="vicino-live-node-label">{node.label}</div>
            <div className="vicino-live-node-sublabel">{node.subLabel}</div>
            {node.kind === "text" && (
              <p className="vicino-live-node-text">{node.content}</p>
            )}
            {node.kind === "image" && node.src && (
              <img src={node.src} alt="" draggable={false} />
            )}
            {node.kind === "video" && node.src && (
              <video src={node.src} autoPlay muted loop playsInline />
            )}
            {node.kind === "model" && (
              <div className="vicino-live-model" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>
        );
      })}

      <div className="vicino-live-caption">
        <span>Interactive canvas</span>
        <span>Drag nodes</span>
      </div>
    </div>
  );
}
