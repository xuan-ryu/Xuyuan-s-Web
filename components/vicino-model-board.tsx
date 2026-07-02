"use client";

// The merged station-03 interactive: the four real-anatomy nodes on one
// board, each opening its shipped sliding panel; the two side rails and the
// editor open as their own rooms. Stations "Checkpoints" and "Interface
// layers" used to say this in text — this board lets the reader experience
// it. Facts are real (the-product-codebase repo): node labels from the create menu,
// connection colors from the connection types, handle slots 56px + 40px from
// the handle positions, panel width variants (narrow / 333px / half node
// width, 15 node types shipped panels), CreateRail on the left,
// the inspector panel inspector on the right, editors reserved for deep
// revision. Panel/rail field VALUES are clearly-labeled specimen data.
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  canvasEdges,
  canvasNodes,
  clampOffset,
  connectorPath,
  handleColor,
  NodeContent,
  offsetFor,
  ProductHeader,
  productClassName,
  productShellClassName,
  type CanvasNode,
  type NodeKind,
  type OffsetMap,
} from "./vicino-workflow-canvas";

// Model-board stage: wider than the hero stage so every node keeps clearance
// on its LEFT for the sliding panel (panels open to the node's left in the
// shipped build). Scaled to the container by .v-mb-stage.
export const MODEL_STAGE_W = 1620;
export const MODEL_STAGE_H = 700;

const modelPositions: Record<string, { x: number; y: number }> = {
  script: { x: 246, y: 64 },
  storyboard: { x: 560, y: 278 },
  shoot: { x: 980, y: 48 },
  video: { x: 1260, y: 320 },
};

// Same anatomy as the hero board (sizes, labels, typed handles) — only the
// coordinates change.
const nodes: CanvasNode[] = canvasNodes.map((node) => ({
  ...node,
  ...modelPositions[node.id],
}));

// Checkpoint copy per node. The constraint lines quote the team's own
// main-path argument (the "I rebuilt the main path" deck): each step exists
// because the models cannot reliably skip it.
const checkpoints: Array<{
  id: string;
  kind: NodeKind;
  label: string;
  claim: string;
  copy: string;
  conn: string;
}> = [
  {
    id: "script",
    kind: "script",
    label: "Script Generator",
    claim: "Intent becomes editable",
    copy: "Video models cannot hold a long unstructured narrative, so the script node breaks intent into scenes with clear boundaries — revisable before any visual spend.",
    conn: "Output · Text #F1A0FA",
  },
  {
    id: "storyboard",
    kind: "storyboard",
    label: "Story Board Generator",
    claim: "Pacing becomes visible",
    copy: "One sketch frame at a time — fast to generate, cheap in credits, easy to swap — so sequence and rhythm get inspected while changing them is still cheap.",
    conn: "Output · Storyboard #6EDDB3",
  },
  {
    id: "shoot",
    kind: "shoot",
    label: "Shot Node",
    claim: "Shots become concrete",
    copy: "The models cannot infer cinematography from a rough board. Camera, angle, and timing are set explicitly per shot, as high-fidelity keyframes.",
    conn: "Output · Image #6EDDB3",
  },
  {
    id: "video",
    kind: "video",
    label: "Video Generator",
    claim: "Motion becomes output",
    copy: "The most expensive step in credits and time comes last, entered with confirmed keyframes — a preview checkpoint before motion, not instead of it.",
    conn: "Output · Video #FFB347",
  },
];

// Sliding-panel specs: the width VARIANTS are the shipped ones (narrow for
// script/text, 333px for storyImage/shoot, half node width for video); the
// field values are specimen data.
type PanelField = { label: string; value: string; thumbs?: string[] };

const panelSpecs: Record<
  NodeKind,
  { width: number; variant: string; fields: PanelField[]; versions?: string[] }
> = {
  script: {
    width: 220,
    variant: "Narrow — script / text nodes",
    fields: [
      {
        label: "Prompt",
        value: "Interior studio. A figure enters frame, camera drifts from wide to close.",
      },
      { label: "Scenes", value: "6 · clear boundaries" },
    ],
    versions: ["v3 — current", "v2"],
  },
  storyboard: {
    width: 333,
    variant: "333px — storyImage nodes",
    fields: [
      {
        label: "References",
        value: "2 boards attached",
        thumbs: ["/media/vicino-storyboard-sketch.png", "/media/vicino-storyboard-sketch.png"],
      },
      { label: "Style", value: "Sketch · grayscale" },
    ],
    versions: ["v4 — current", "v3"],
  },
  shoot: {
    width: 333,
    variant: "333px — shoot nodes",
    fields: [
      {
        label: "Reference frame",
        value: "Scene 3 · board",
        thumbs: ["/media/vicino-shootnode-board.png"],
      },
      { label: "Camera", value: "Slow push-in · 35mm" },
      { label: "Lighting", value: "Practical, warm key" },
      { label: "Timing", value: "2.4s per shot" },
    ],
  },
  video: {
    width: 172,
    variant: "Half node width — video nodes",
    fields: [
      {
        label: "First / last frame",
        value: "From Shot Node",
        thumbs: ["/media/vicino-video-preview.png", "/media/vicino-video-preview.png"],
      },
      { label: "Duration · motion", value: "5s fixed · simple" },
    ],
  },
};

// The four rooms' "never absorbs" lines — rendered inside each room.
const NOT_FOR = {
  canvas: "Not for prompt forms or dense parameters",
  rails: "Not for node media input or deep edits",
  panel: "Not for deep editing tools",
  editor: "Not for basic node display",
};

const byId = new Map(nodes.map((node) => [node.id, node]));

function PanelFields({ kind }: { kind: NodeKind }) {
  const spec = panelSpecs[kind];
  return (
    <div className="v-mb-panel-fields">
      {spec.fields.map((field) => (
        <div className="v-mb-field" key={field.label}>
          <span className="v-mb-field-label">{field.label}</span>
          {field.thumbs ? (
            <span className="v-mb-field-thumbs">
              {field.thumbs.map((src, i) => (
                <img src={src} alt="" key={`${src}-${i}`} />
              ))}
            </span>
          ) : null}
          <strong className="v-mb-field-value">{field.value}</strong>
        </div>
      ))}
      {spec.versions ? (
        <div className="v-mb-field">
          <span className="v-mb-field-label">Version history</span>
          <span className="v-mb-versions">
            {spec.versions.map((version, index) => (
              <em className={index === 0 ? "is-current" : undefined} key={version}>
                {version}
              </em>
            ))}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function PanelFooter() {
  return (
    <div className="v-mb-room-note">
      <span>Sliding panel — local input</span>
      {NOT_FOR.panel} · specimen data
    </div>
  );
}

function CreateRailContent() {
  return (
    <>
      <p className="v-mb-rail-label">Left rail · CreateRail</p>
      <h4>Creation lives here</h4>
      <ul className="v-mb-rail-list">
        <li>
          <strong>Create menu</strong> all 23 node types
        </li>
        <li>
          <strong>Asset library</strong> uploads and generated outputs
        </li>
        <li>
          <strong>Community library</strong> shared boards
        </li>
      </ul>
      <div className="v-mb-room-note">
        <span>Side rails — creation &amp; configuration</span>
        {NOT_FOR.rails} · recreated rail, specimen data
      </div>
    </>
  );
}

function InspectorRailContent() {
  return (
    <>
      <p className="v-mb-rail-label">Right rail · the inspector panel</p>
      <h4>Configuration lives here</h4>
      <div className="v-mb-panel-fields">
        <div className="v-mb-field">
          <span className="v-mb-field-label">Model</span>
          <strong className="v-mb-field-value is-select">video-gen · pro</strong>
        </div>
        <div className="v-mb-field">
          <span className="v-mb-field-label">Parameters</span>
          <strong className="v-mb-field-value">5s · 16:9 · seed 41</strong>
        </div>
        <div className="v-mb-run" aria-hidden="true">
          Run — 12 credits
        </div>
      </div>
      <div className="v-mb-room-note">
        <span>Side rails — creation &amp; configuration</span>
        {NOT_FOR.rails} · recreated rail, specimen data
      </div>
    </>
  );
}

function EditorContent({
  onClose,
  closeRef,
}: {
  onClose: () => void;
  closeRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <>
      <div className="v-mb-editor-head">
        <div>
          <p className="v-mb-rail-label">Editor · Timeline</p>
          <h4>Deep revision lives here</h4>
        </div>
        <button
          className="v-mb-close"
          type="button"
          onClick={onClose}
          ref={closeRef}
          aria-label="Close the timeline editor"
        >
          <span aria-hidden="true" />
        </button>
      </div>
      <div className="v-mb-timeline" aria-hidden="true">
        <div className="v-mb-timeline-ruler" />
        <div className="v-mb-timeline-track">
          {["Shot 01", "Shot 02", "Shot 03", "Shot 04"].map((shot, index) => (
            <span className="v-mb-clip" style={{ flexGrow: [3, 2, 4, 2][index] }} key={shot}>
              {shot}
            </span>
          ))}
        </div>
        <div className="v-mb-timeline-track is-audio">
          <span className="v-mb-clip is-audio" style={{ flexGrow: 5 }} />
          <span className="v-mb-clip is-audio" style={{ flexGrow: 3 }} />
        </div>
        <span className="v-mb-playhead" />
      </div>
      <div className="v-mb-room-note">
        <span>Editors — timeline, image, 3D</span>
        {NOT_FOR.editor} · specimen timeline
      </div>
    </>
  );
}

export function VicinoModelBoard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const editorCloseRef = useRef<HTMLButtonElement | null>(null);
  const editorOpenerRef = useRef<HTMLButtonElement | null>(null);
  const railCloseRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const railHintRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastRailRef = useRef<"create" | "inspect" | null>(null);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    scale: number;
    moved: boolean;
  } | null>(null);

  const [offsets, setOffsets] = useState<OffsetMap>({});
  const [openNode, setOpenNode] = useState<string | null>(null);
  const [railOpen, setRailOpen] = useState<"create" | "inspect" | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // Mobile stacked variant: which checkpoint is expanded + whether its panel
  // shows. Defaults open so the payoff is visible without a tap.
  const [stackItem, setStackItem] = useState<string | null>("script");
  const [stackPanel, setStackPanel] = useState(true);

  const checkpointById = useMemo(
    () => new Map(checkpoints.map((checkpoint) => [checkpoint.id, checkpoint])),
    [],
  );

  // Pause the board's infinite canvas animations while offscreen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setIsPaused(!entries[0]?.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Move focus into the editor overlay when it opens (it visually covers its
  // opener); hand focus back on close.
  useEffect(() => {
    if (editorOpen) {
      editorCloseRef.current?.focus();
    } else {
      editorOpenerRef.current?.focus?.();
      editorOpenerRef.current = null;
    }
  }, [editorOpen]);

  // Same contract for the rails: the expanded rail covers its hint, so focus
  // rides into the rail's close button and returns to the hint afterwards.
  // (Desktop only — the frame is display:none below 1080px and offsetParent
  // is null there, so the stacked variant keeps its natural tap focus.)
  useEffect(() => {
    if (railOpen) {
      lastRailRef.current = railOpen;
      const close = railCloseRefs.current[railOpen];
      if (close && close.offsetParent) close.focus();
    } else if (lastRailRef.current) {
      const hint = railHintRefs.current[lastRailRef.current];
      if (hint && hint.offsetParent) hint.focus();
      lastRailRef.current = null;
    }
  }, [railOpen]);

  const togglePanel = (id: string) => {
    setOpenNode((current) => (current === id ? null : id));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>, node: CanvasNode) => {
    const current = offsetFor(node, offsets);
    const stageWidth = frameRef.current?.clientWidth ?? MODEL_STAGE_W;
    dragRef.current = {
      id: node.id,
      startX: event.clientX,
      startY: event.clientY,
      baseX: current.x,
      baseY: current.y,
      scale: stageWidth > 0 ? stageWidth / MODEL_STAGE_W : 1,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const node = byId.get(drag.id);
    if (!node) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    drag.moved = true;
    const scale = drag.scale || 1;
    const next = clampOffset(
      node,
      drag.baseX + dx / scale,
      drag.baseY + dy / scale,
      MODEL_STAGE_W,
      MODEL_STAGE_H,
    );
    setOffsets((current) => ({ ...current, [drag.id]: next }));
  };

  // Click = a press that never turned into a drag → toggle the panel.
  const handlePointerUp = (node?: CanvasNode) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (node && drag && drag.id === node.id && !drag.moved) togglePanel(node.id);
  };

  const handleNodeKeyDown = (event: KeyboardEvent<HTMLDivElement>, node: CanvasNode) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePanel(node.id);
      return;
    }
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
      return {
        ...current,
        [node.id]: clampOffset(node, base.x + dx, base.y + dy, MODEL_STAGE_W, MODEL_STAGE_H),
      };
    });
  };

  // One Esc contract for the whole board: closes the topmost room.
  const handleFrameKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    if (editorOpen) setEditorOpen(false);
    else if (railOpen) setRailOpen(null);
    else if (openNode) setOpenNode(null);
    else return;
    event.stopPropagation();
  };

  const openEditorFrom = (event: { currentTarget: HTMLButtonElement }) => {
    editorOpenerRef.current = event.currentTarget;
    setEditorOpen(true);
  };

  const renderPanel = (node: CanvasNode) => {
    const spec = panelSpecs[node.kind];
    const checkpoint = checkpointById.get(node.id);
    return (
      <aside
        className="v-mb-panel"
        id={`vicino-panel-${node.id}`}
        style={{ width: spec.width }}
        aria-hidden={openNode !== node.id}
        aria-label={`${node.label} sliding panel — recreated, specimen data`}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="v-mb-panel-head">
          <span
            className="v-mb-panel-dot"
            style={{ background: handleColor[node.output ?? "video"] }}
            aria-hidden="true"
          />
          <p>{checkpoint?.claim ?? node.label}</p>
        </div>
        <p className="v-mb-panel-variant">
          Shipped width: {spec.variant} · 1 of 15 node types with panels
        </p>
        <PanelFields kind={node.kind} />
        {node.kind === "video" ? (
          <button className="v-mb-editor-open" type="button" onClick={openEditorFrom}>
            Open timeline editor
          </button>
        ) : null}
        <PanelFooter />
      </aside>
    );
  };

  return (
    <div ref={rootRef} className={`v-mb-root${isPaused ? " is-paused" : ""}`}>
      {/* ---- full board: desktop / wide tablet ---- */}
      <div
        ref={frameRef}
        className="v-mb-frame"
        onPointerMove={handlePointerMove}
        onPointerUp={() => handlePointerUp()}
        onPointerCancel={() => handlePointerUp()}
        onKeyDown={handleFrameKeyDown}
      >
        <div className="vicino-live-dots" aria-hidden="true" />

        <div className={`v-mb-stage${openNode ? " has-open" : ""}`}>
          <svg
            className="vicino-live-edges"
            viewBox={`0 0 ${MODEL_STAGE_W} ${MODEL_STAGE_H}`}
            aria-hidden="true"
          >
            {canvasEdges.map(([fromId, toId, type]) => {
              const from = byId.get(fromId);
              const to = byId.get(toId);
              if (!from || !to) return null;
              const live = openNode === fromId || openNode === toId;
              return (
                <path
                  className={`vicino-story-edge is-${type}${live ? " is-live" : ""}`}
                  key={`${fromId}-${toId}`}
                  d={connectorPath(from, to, offsets)}
                  style={{ stroke: handleColor[type] }}
                />
              );
            })}
          </svg>

          {nodes.map((node) => {
            const offset = offsetFor(node, offsets);
            const isOpen = openNode === node.id;
            return (
              <div
                className={`vicino-product-node is-${node.kind} ${productClassName[node.kind]}${
                  isOpen ? " is-open" : ""
                }`}
                key={node.id}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-controls={`vicino-panel-${node.id}`}
                aria-label={`${node.label} node — Enter opens its sliding panel, arrow keys move it`}
                style={
                  {
                    width: node.w,
                    height: node.h,
                    transform: `translate3d(${node.x + offset.x}px, ${node.y + offset.y}px, 0)`,
                    "--input-y": `${node.inputY ?? node.h / 2}px`,
                    "--output-y": `${node.outputY ?? node.h / 2}px`,
                  } as CSSProperties
                }
                onPointerDown={(event) => handlePointerDown(event, node)}
                onPointerUp={() => handlePointerUp(node)}
                onKeyDown={(event) => handleNodeKeyDown(event, node)}
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
                {/* the product's slim panel-toggle tab on the node's left edge */}
                <span
                  className="v-mb-tab"
                  style={{ background: handleColor[node.output ?? "video"] }}
                  aria-hidden="true"
                />
                {renderPanel(node)}
                <div className={`vicino-product-node-shell ${productShellClassName[node.kind]}`}>
                  <ProductHeader node={node} />
                  <NodeContent node={node} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ---- the two rails, hinted at the frame edges ---- */}
        <button
          className="v-mb-rail-hint is-left"
          type="button"
          aria-expanded={railOpen === "create"}
          ref={(el) => {
            railHintRefs.current.create = el;
          }}
          onClick={() => setRailOpen((current) => (current === "create" ? null : "create"))}
        >
          <span className="v-mb-rail-glyph is-plus" aria-hidden="true" />
          <span className="v-mb-rail-glyph is-grid" aria-hidden="true" />
          <span className="v-mb-rail-hint-label">CreateRail</span>
        </button>
        <button
          className="v-mb-rail-hint is-right"
          type="button"
          aria-expanded={railOpen === "inspect"}
          ref={(el) => {
            railHintRefs.current.inspect = el;
          }}
          onClick={() => setRailOpen((current) => (current === "inspect" ? null : "inspect"))}
        >
          <span className="v-mb-rail-glyph is-sliders" aria-hidden="true" />
          <span className="v-mb-rail-hint-label">Inspector</span>
        </button>

        <aside
          className={`v-mb-rail is-left${railOpen === "create" ? " is-open" : ""}`}
          aria-hidden={railOpen !== "create"}
          aria-label="Left rail — CreateRail, recreated"
        >
          <button
            className="v-mb-close"
            type="button"
            onClick={() => setRailOpen(null)}
            aria-label="Close the create rail"
            tabIndex={railOpen === "create" ? 0 : -1}
            ref={(el) => {
              railCloseRefs.current.create = el;
            }}
          >
            <span aria-hidden="true" />
          </button>
          <CreateRailContent />
        </aside>
        <aside
          className={`v-mb-rail is-right${railOpen === "inspect" ? " is-open" : ""}`}
          aria-hidden={railOpen !== "inspect"}
          aria-label="Right rail — the inspector panel inspector, recreated"
        >
          <button
            className="v-mb-close"
            type="button"
            onClick={() => setRailOpen(null)}
            aria-label="Close the inspector rail"
            tabIndex={railOpen === "inspect" ? 0 : -1}
            ref={(el) => {
              railCloseRefs.current.inspect = el;
            }}
          >
            <span aria-hidden="true" />
          </button>
          <InspectorRailContent />
        </aside>

        {/* the canvas room's own contract, kept in view */}
        <p className="v-mb-canvas-note" aria-hidden="true">
          Canvas — stages, outputs, selection · {NOT_FOR.canvas.toLowerCase()}
        </p>

        <div className="vicino-live-caption">
          <span>Interactive recreation — 4 of 23 node types · specimen data</span>
          <span>Click a node · drag to move</span>
        </div>

        {/* ---- editor overlay: the fourth room ---- */}
        <div
          className={`v-mb-editor${editorOpen ? " is-open" : ""}`}
          role="region"
          aria-label="Timeline editor — recreated, specimen data"
          aria-hidden={!editorOpen}
        >
          <EditorContent
            onClose={() => setEditorOpen(false)}
            closeRef={(el) => {
              editorCloseRef.current = el;
            }}
          />
        </div>
      </div>

      {/* ---- checkpoint strip: the narrative captions double as controls ---- */}
      <div className="v-mb-strip">
        {checkpoints.map((checkpoint, index) => {
          const active = openNode === checkpoint.id;
          return (
            <div className={`v-mb-stop${active ? " is-active" : ""}`} key={checkpoint.id}>
              <h3>
                <button
                  type="button"
                  aria-expanded={active}
                  aria-controls={`vicino-panel-${checkpoint.id}`}
                  onClick={() => togglePanel(checkpoint.id)}
                >
                  <span
                    className="v-mb-stop-chip"
                    style={{ background: handleColor[byId.get(checkpoint.id)?.output ?? "video"] }}
                    aria-hidden="true"
                  />
                  <span className="v-mb-stop-index">{String(index + 1).padStart(2, "0")}</span>
                  {checkpoint.label}
                </button>
              </h3>
              <p className="v-mb-stop-claim">{checkpoint.claim}</p>
              <p className="v-mb-stop-copy">{checkpoint.copy}</p>
              <p className="v-mb-stop-conn">{checkpoint.conn}</p>
            </div>
          );
        })}
      </div>

      {/* ---- stacked variant: phones + narrow tablets ---- */}
      <div className="v-mb-stack">
        {checkpoints.map((checkpoint, index) => {
          const node = byId.get(checkpoint.id);
          if (!node) return null;
          const active = stackItem === checkpoint.id;
          const spec = panelSpecs[node.kind];
          return (
            <section className={`v-mb-stack-item${active ? " is-active" : ""}`} key={checkpoint.id}>
              <h3>
                <button
                  type="button"
                  aria-expanded={active}
                  onClick={() => {
                    setStackItem((current) => (current === checkpoint.id ? null : checkpoint.id));
                    setStackPanel(true);
                  }}
                >
                  <span
                    className="v-mb-stop-chip"
                    style={{ background: handleColor[node.output ?? "video"] }}
                    aria-hidden="true"
                  />
                  <span className="v-mb-stop-index">{String(index + 1).padStart(2, "0")}</span>
                  {checkpoint.label}
                  <span className="v-mb-stop-claim">{checkpoint.claim}</span>
                </button>
              </h3>
              {active ? (
                <div className="v-mb-stack-body">
                  <p className="v-mb-stop-copy">{checkpoint.copy}</p>
                  <div
                    className="v-mb-stack-nodebox"
                    style={
                      {
                        maxWidth: node.w,
                        aspectRatio: `${node.w} / ${node.h}`,
                        "--stack-node-w": `${node.w}px`,
                      } as CSSProperties
                    }
                  >
                    <div
                      className={`vicino-product-node is-${node.kind} ${productClassName[node.kind]} is-static`}
                      role="button"
                      tabIndex={0}
                      aria-expanded={stackPanel}
                      aria-label={`${node.label} node — tap to toggle its sliding panel`}
                      style={{ width: node.w, height: node.h }}
                      onClick={() => setStackPanel((current) => !current)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setStackPanel((current) => !current);
                        }
                      }}
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
                      <span
                        className="v-mb-tab"
                        style={{ background: handleColor[node.output ?? "video"] }}
                        aria-hidden="true"
                      />
                      <div
                        className={`vicino-product-node-shell ${productShellClassName[node.kind]}`}
                      >
                        <ProductHeader node={node} />
                        <NodeContent node={node} />
                      </div>
                    </div>
                  </div>
                  {stackPanel ? (
                    <div className="v-mb-stack-panel">
                      <div className="v-mb-panel-head">
                        <span
                          className="v-mb-panel-dot"
                          style={{ background: handleColor[node.output ?? "video"] }}
                          aria-hidden="true"
                        />
                        <p>Sliding panel · {spec.variant}</p>
                      </div>
                      <p className="v-mb-panel-variant">1 of 15 node types with panels</p>
                      <PanelFields kind={node.kind} />
                      {node.kind === "video" ? (
                        <button
                          className="v-mb-editor-open"
                          type="button"
                          aria-expanded={editorOpen}
                          onClick={() => setEditorOpen((current) => !current)}
                        >
                          Open timeline editor
                        </button>
                      ) : null}
                      <PanelFooter />
                    </div>
                  ) : null}
                  {node.kind === "video" && stackPanel && editorOpen ? (
                    <div className="v-mb-stack-editor">
                      <EditorContent onClose={() => setEditorOpen(false)} />
                    </div>
                  ) : null}
                  <p className="v-mb-stop-conn">{checkpoint.conn}</p>
                </div>
              ) : null}
            </section>
          );
        })}

        <div className="v-mb-stack-rails">
          <section className={`v-mb-stack-item${railOpen === "create" ? " is-active" : ""}`}>
            <h3>
              <button
                type="button"
                aria-expanded={railOpen === "create"}
                onClick={() =>
                  setRailOpen((current) => (current === "create" ? null : "create"))
                }
              >
                <span className="v-mb-stop-index">+</span>
                Left rail · CreateRail
              </button>
            </h3>
            {railOpen === "create" ? (
              <div className="v-mb-stack-panel is-rail">
                <CreateRailContent />
              </div>
            ) : null}
          </section>
          <section className={`v-mb-stack-item${railOpen === "inspect" ? " is-active" : ""}`}>
            <h3>
              <button
                type="button"
                aria-expanded={railOpen === "inspect"}
                onClick={() =>
                  setRailOpen((current) => (current === "inspect" ? null : "inspect"))
                }
              >
                <span className="v-mb-stop-index">≡</span>
                Right rail · the inspector panel
              </button>
            </h3>
            {railOpen === "inspect" ? (
              <div className="v-mb-stack-panel is-rail">
                <InspectorRailContent />
              </div>
            ) : null}
          </section>
        </div>

        <p className="v-mb-canvas-note is-stack">
          Canvas — stages, outputs, selection · {NOT_FOR.canvas.toLowerCase()} · recreated, 4 of
          23 node types
        </p>
      </div>
    </div>
  );
}
