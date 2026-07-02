"use client";

// Station-04 (Block B) interactive: the four real-anatomy nodes on one board,
// each room of the owner's zoning model openable in place. The rooms use the
// owner's design vocabulary from the "Detail PDR" zoning board (the artifact
// figured below the board): Work Space (the canvas) · Floating Bar (the
// node-adjacent next-step layer, appears when a node is selected) · Sidebar
// (global settings + model selection, right side) · Sliding Panel (node-level
// adjustment layer, opens on node select) · Node Panel (the node's minimal
// canvas-facing surface) · Editor (deep revision). Each room's annotation
// quotes that PDR board's one-sentence rules and "what does not go here"
// lists. Facts are real (the-product-codebase repo): node labels from
// the create menu, connection colors from the connection types, handle slots
// 56px + 40px from the handle positions, sliding-panel width variants from
// the sliding panel (narrow 288px for script/text, 333px for
// storyImage/shoot, half node width for video; 15 node types ship panels),
// floating-bar anatomy from the base-node styles + the node toolbar. Panel and
// rail field VALUES are clearly-labeled specimen data.
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
// on its LEFT for the sliding panel (panels open flush to the node's left in
// the shipped build). Scaled to the container by .v-mb-stage.
export const MODEL_STAGE_W = 1620;
export const MODEL_STAGE_H = 700;

const modelPositions: Record<string, { x: number; y: number }> = {
  script: { x: 360, y: 108 },
  storyboard: { x: 660, y: 300 },
  shoot: { x: 1000, y: 100 },
  video: { x: 1276, y: 306 },
};

// Same anatomy as the hero board (sizes, labels, typed handles) — only the
// coordinates change.
const nodes: CanvasNode[] = canvasNodes.map((node) => ({
  ...node,
  ...modelPositions[node.id],
}));

// Sliding-panel specs: the width VARIANTS are the shipped ones
// (the sliding panel — narrow min(100cqw, 288px) for script/text, 333px
// for storyImage/shoot, half node width for video); the field values are
// specimen data.
type PanelField = { label: string; value: string; thumbs?: string[] };

const panelSpecs: Record<
  NodeKind,
  { width: number; variant: string; fields: PanelField[]; versions?: string[] }
> = {
  script: {
    width: 288,
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

// Floating-bar specs. Utility icons + divider + next-step actions follow the
// shipped toolbar (the base-node styles .base-node-toolbar + the node toolbar);
// action labels are the product's. "Advance" actions open the next node's
// panel — the PDR's rule made literal: the bar only moves the work forward.
type BarAction =
  | { label: string; kind: "advance"; to: string }
  | { label: string; kind: "editor" }
  | { label: string; kind: "inert" };

const barSpecs: Record<NodeKind, BarAction[]> = {
  script: [{ label: "Generate Storyboard", kind: "advance", to: "storyboard" }],
  storyboard: [{ label: "Generate Shots", kind: "advance", to: "shoot" }],
  shoot: [
    { label: "Image Editor", kind: "inert" },
    { label: "Multi-views", kind: "inert" },
    { label: "Generate Video", kind: "advance", to: "video" },
  ],
  video: [{ label: "Video Editor", kind: "editor" }],
};

// Room annotations — the PDR board's own vocabulary: a one-sentence rule and
// what never goes here, per room.
const ROOM = {
  workspace: "Work Space — nodes, connections, outputs · every other function has its own room",
  nodePanel: "Node Panel — output · type · generate, nothing else",
  floatingBar: "Floating Bar ↑ next step only, never adjustment",
  panel: {
    label: "Sliding Panel — node-level adjustment",
    rule: "“Make a small change” without “regenerate from scratch.”",
    not: "Not for global settings, model selection, or next-step actions",
  },
  sidebar: {
    label: "Sidebar — global settings · model selection",
    rule: "If a control affects the node as a whole, it belongs in the Sidebar.",
    not: "Not for input management, version history, or local fine-tuning",
  },
  editor: {
    label: "Editor — deep revision",
    rule: "When the task needs real workspace, it leaves the canvas for an editor.",
    not: "Not for quick, in-flow adjustments",
  },
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

// The real panel's first row: the "Disable panel auto-open" preference
// (the sliding panel's PanelContent header). Decorative in the recreation.
function PanelAutoOpenRow() {
  return (
    <div className="v-mb-panel-autoopen" aria-hidden="true">
      <span>Disable panel auto-open</span>
      <i className="v-mb-toggle" />
    </div>
  );
}

function PanelFooter() {
  return (
    <div className="v-mb-room-note">
      <span>{ROOM.panel.label}</span>
      {ROOM.panel.rule} {ROOM.panel.not} · specimen data
    </div>
  );
}

// The floating bar: utility icons, a divider, then the next-step actions —
// recreated from the shipped toolbar. Inert actions render in the product's
// disabled state; advance/editor actions are live.
function FloatingBar({
  node,
  open,
  onAdvance,
  onOpenEditor,
}: {
  node: CanvasNode;
  open: boolean;
  onAdvance: (id: string) => void;
  onOpenEditor: (event: { currentTarget: HTMLButtonElement }) => void;
}) {
  const actions = barSpecs[node.kind];
  return (
    <div
      className="v-mb-floatbar"
      role="toolbar"
      aria-label={`${node.label} Floating Bar — next-step shortcuts, recreated`}
      aria-hidden={!open}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <span className="v-mb-fb-icons" aria-hidden="true">
        <i className="v-mb-fb-ic is-duplicate" />
        <i className="v-mb-fb-ic is-download" />
        <i className="v-mb-fb-ic is-delete" />
      </span>
      <span className="v-mb-fb-divider" aria-hidden="true" />
      {actions.map((action) => {
        if (action.kind === "inert") {
          return (
            <button
              className="v-mb-fb-action"
              type="button"
              key={action.label}
              disabled
              title="Recreation — this action is not wired"
              tabIndex={-1}
            >
              {action.label}
            </button>
          );
        }
        if (action.kind === "editor") {
          return (
            <button
              className="v-mb-fb-action"
              type="button"
              key={action.label}
              tabIndex={open ? 0 : -1}
              onClick={onOpenEditor}
              onKeyDown={(event) => event.stopPropagation()}
            >
              {action.label}
            </button>
          );
        }
        return (
          <button
            className="v-mb-fb-action"
            type="button"
            key={action.label}
            tabIndex={open ? 0 : -1}
            aria-label={`${action.label} — opens the next node's Sliding Panel`}
            onClick={() => onAdvance(action.to)}
            onKeyDown={(event) => event.stopPropagation()}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

// Sidebar room content — the the inspector panel surface as the PDR board mocks
// it: node identity, Model Selection, Aspect Ratio with its option list, and
// the run action. Values are specimen data.
function SidebarContent() {
  return (
    <>
      <p className="v-mb-rail-label">{ROOM.sidebar.label}</p>
      <h4>Video Generator</h4>
      <div className="v-mb-panel-fields">
        <div className="v-mb-field">
          <span className="v-mb-field-label">Model Selection</span>
          <strong className="v-mb-field-value is-select">video-gen · pro</strong>
        </div>
        <div className="v-mb-field">
          <span className="v-mb-field-label">Aspect Ratio</span>
          <strong className="v-mb-field-value is-select">16 : 9</strong>
          <span className="v-mb-ratio-list">
            <em className="is-current">16:9 — widescreen, presentations</em>
            <em>1:1 — square, social posts</em>
            <em>9:16 — vertical, shorts</em>
          </span>
        </div>
        <div className="v-mb-run" aria-hidden="true">
          Run — 12 credits
        </div>
      </div>
      <div className="v-mb-room-note">
        <span>{ROOM.sidebar.label}</span>
        {ROOM.sidebar.rule} {ROOM.sidebar.not} · specimen data
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
          aria-label="Close the editor"
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
        <span>{ROOM.editor.label}</span>
        {ROOM.editor.rule} {ROOM.editor.not} · specimen timeline
      </div>
    </>
  );
}

// The product's left toolbar (CreateRail's LeftSidebarToolbar): create, asset
// library, workflow chat. Purely visual here — creation is not part of the
// zoning story this board tells.
function CreateStrip() {
  return (
    <div className="v-mb-createstrip" aria-hidden="true">
      <i className="v-mb-cs-btn is-plus" />
      <i className="v-mb-cs-btn is-box" />
      <i className="v-mb-cs-btn is-chat" />
      <i className="v-mb-cs-btn is-v">V</i>
    </div>
  );
}

// Mobile rooms accordion — one room at a time, demonstrated on real anatomy.
const stackRooms = [
  { id: "node-panel", label: "Node Panel", rule: ROOM.nodePanel },
  { id: "floating-bar", label: "Floating Bar", rule: ROOM.floatingBar },
  { id: "sliding-panel", label: "Sliding Panel", rule: `${ROOM.panel.rule} ${ROOM.panel.not}` },
  { id: "sidebar", label: "Sidebar", rule: `${ROOM.sidebar.rule} ${ROOM.sidebar.not}` },
  { id: "editor", label: "Editor", rule: `${ROOM.editor.rule} ${ROOM.editor.not}` },
];

export function VicinoModelBoard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const editorCloseRef = useRef<HTMLButtonElement | null>(null);
  const editorOpenerRef = useRef<HTMLButtonElement | null>(null);
  const sidebarCloseRef = useRef<HTMLButtonElement | null>(null);
  const sidebarHintRef = useRef<HTMLButtonElement | null>(null);
  const sidebarWasOpenRef = useRef(false);
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // Mobile rooms accordion: which room is expanded. Defaults open so the
  // zoning payoff is visible without a tap.
  const [stackRoom, setStackRoom] = useState<string | null>("node-panel");

  const stackNode = useMemo(() => byId.get("shoot") ?? nodes[0], []);

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

  // Same contract for the Sidebar: the expanded rail covers its hint, so
  // focus rides into the rail's close button and returns to the hint after.
  // (Desktop only — the frame is display:none below 1080px and offsetParent
  // is null there, so the stacked variant keeps its natural tap focus.)
  useEffect(() => {
    if (sidebarOpen) {
      sidebarWasOpenRef.current = true;
      const close = sidebarCloseRef.current;
      if (close && close.offsetParent) close.focus();
    } else if (sidebarWasOpenRef.current) {
      sidebarWasOpenRef.current = false;
      const hint = sidebarHintRef.current;
      if (hint && hint.offsetParent) hint.focus();
    }
  }, [sidebarOpen]);

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
    // Buttons inside the node (floating bar, panel) own their key events.
    if (event.target !== event.currentTarget) return;
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
    else if (sidebarOpen) setSidebarOpen(false);
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
    return (
      <aside
        className="v-mb-panel"
        id={`vicino-panel-${node.id}`}
        style={{ width: spec.width }}
        aria-hidden={openNode !== node.id}
        aria-label={`${node.label} Sliding Panel — recreated, specimen data`}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <PanelAutoOpenRow />
        <div className="v-mb-panel-head">
          <span
            className="v-mb-panel-dot"
            style={{ background: handleColor[node.output ?? "video"] }}
            aria-hidden="true"
          />
          <p>{node.label}</p>
        </div>
        <p className="v-mb-panel-variant">
          Shipped width: {spec.variant} · 1 of 15 node types with panels
        </p>
        <PanelFields kind={node.kind} />
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
                aria-label={`${node.label} node — Enter opens its Sliding Panel and Floating Bar, arrow keys move it`}
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
                {/* the product's slim panel-toggle tab on the node's left edge
                    (the sliding panel's sp-toggle-bar: 5px pill, type color) */}
                <span
                  className="v-mb-tab sp-toggle-bar"
                  style={{ background: handleColor[node.output ?? "video"] }}
                  aria-hidden="true"
                />
                <FloatingBar
                  node={node}
                  open={isOpen}
                  onAdvance={(id) => setOpenNode(id)}
                  onOpenEditor={openEditorFrom}
                />
                {renderPanel(node)}
                <div className={`vicino-product-node-shell ${productShellClassName[node.kind]}`}>
                  <ProductHeader node={node} />
                  <NodeContent node={node} />
                </div>
                {/* the open node's zoning annotation — the case's voice */}
                <div className="v-mb-nodenote" aria-hidden="true">
                  <span>{ROOM.nodePanel}</span>
                  <span>{ROOM.floatingBar}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* the product's left toolbar, visual only */}
        <CreateStrip />

        {/* ---- Sidebar room: hinted at the frame's right edge ---- */}
        <button
          className="v-mb-rail-hint is-right"
          type="button"
          aria-expanded={sidebarOpen}
          ref={sidebarHintRef}
          onClick={() => setSidebarOpen((current) => !current)}
        >
          <span className="v-mb-rail-glyph is-sliders" aria-hidden="true" />
          <span className="v-mb-rail-hint-label">Sidebar</span>
        </button>

        <aside
          className={`v-mb-rail is-right${sidebarOpen ? " is-open" : ""}`}
          aria-hidden={!sidebarOpen}
          aria-label="Sidebar — global settings and model selection, recreated"
        >
          <button
            className="v-mb-close"
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close the Sidebar"
            tabIndex={sidebarOpen ? 0 : -1}
            ref={sidebarCloseRef}
          >
            <span aria-hidden="true" />
          </button>
          <SidebarContent />
        </aside>

        {/* the canvas room's own contract, kept in view */}
        <p className="v-mb-canvas-note" aria-hidden="true">
          {ROOM.workspace}
        </p>

        <div className="vicino-live-caption">
          <span>Interactive recreation — 4 of 23 node types · specimen data</span>
          <span>Click a node · drag to move</span>
        </div>

        {/* ---- Editor overlay: the deep-revision room ---- */}
        <div
          className={`v-mb-editor${editorOpen ? " is-open" : ""}`}
          role="region"
          aria-label="Editor — recreated, specimen data"
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

      {/* ---- stacked variant: phones + narrow tablets — one room at a time ---- */}
      <div className="v-mb-stack">
        <p className="v-mb-canvas-note is-stack">
          {ROOM.workspace} · recreated, 4 of 23 node types · specimen data
        </p>
        {stackRooms.map((room) => {
          const active = stackRoom === room.id;
          return (
            <section className={`v-mb-stack-item${active ? " is-active" : ""}`} key={room.id}>
              <h3>
                <button
                  type="button"
                  aria-expanded={active}
                  onClick={() => setStackRoom((current) => (current === room.id ? null : room.id))}
                >
                  <span
                    className="v-mb-stop-chip"
                    style={{ background: handleColor[stackNode.output ?? "video"] }}
                    aria-hidden="true"
                  />
                  {room.label}
                </button>
              </h3>
              {active ? (
                <div className="v-mb-stack-body">
                  {room.id === "node-panel" ? (
                    <div
                      className="v-mb-stack-nodebox"
                      style={
                        {
                          maxWidth: stackNode.w,
                          aspectRatio: `${stackNode.w} / ${stackNode.h}`,
                          "--stack-node-w": `${stackNode.w}px`,
                        } as CSSProperties
                      }
                    >
                      <div
                        className={`vicino-product-node is-${stackNode.kind} ${
                          productClassName[stackNode.kind]
                        } is-static`}
                        style={{ width: stackNode.w, height: stackNode.h }}
                      >
                        {stackNode.input ? (
                          <span
                            className={`vicino-product-handle is-left handle-${stackNode.input}`}
                            style={
                              { "--handle-color": handleColor[stackNode.input] } as CSSProperties
                            }
                          />
                        ) : null}
                        {stackNode.output ? (
                          <span
                            className={`vicino-product-handle is-right handle-${stackNode.output}`}
                            style={
                              { "--handle-color": handleColor[stackNode.output] } as CSSProperties
                            }
                          />
                        ) : null}
                        <span
                          className="v-mb-tab sp-toggle-bar"
                          style={{ background: handleColor[stackNode.output ?? "video"] }}
                          aria-hidden="true"
                        />
                        <div
                          className={`vicino-product-node-shell ${
                            productShellClassName[stackNode.kind]
                          }`}
                        >
                          <ProductHeader node={stackNode} />
                          <NodeContent node={stackNode} />
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {room.id === "floating-bar" ? (
                    <div className="v-mb-stack-floatbar" aria-hidden="true">
                      <div className="v-mb-floatbar is-static">
                        <span className="v-mb-fb-icons">
                          <i className="v-mb-fb-ic is-duplicate" />
                          <i className="v-mb-fb-ic is-download" />
                          <i className="v-mb-fb-ic is-delete" />
                        </span>
                        <span className="v-mb-fb-divider" />
                        <span className="v-mb-fb-action">Generate Video</span>
                      </div>
                    </div>
                  ) : null}
                  {room.id === "sliding-panel" ? (
                    <div className="v-mb-stack-panel">
                      <PanelAutoOpenRow />
                      <div className="v-mb-panel-head">
                        <span
                          className="v-mb-panel-dot"
                          style={{ background: handleColor[stackNode.output ?? "video"] }}
                          aria-hidden="true"
                        />
                        <p>{stackNode.label}</p>
                      </div>
                      <p className="v-mb-panel-variant">
                        Shipped width: {panelSpecs[stackNode.kind].variant} · 1 of 15 node types
                        with panels
                      </p>
                      <PanelFields kind={stackNode.kind} />
                    </div>
                  ) : null}
                  {room.id === "sidebar" ? (
                    <div className="v-mb-stack-panel is-rail">
                      <SidebarContent />
                    </div>
                  ) : null}
                  {room.id === "editor" ? (
                    <div className="v-mb-stack-editor">
                      <div>
                        <p className="v-mb-rail-label">Editor · Timeline</p>
                      </div>
                      <div className="v-mb-timeline" aria-hidden="true">
                        <div className="v-mb-timeline-ruler" />
                        <div className="v-mb-timeline-track">
                          {["Shot 01", "Shot 02", "Shot 03", "Shot 04"].map((shot, index) => (
                            <span
                              className="v-mb-clip"
                              style={{ flexGrow: [3, 2, 4, 2][index] }}
                              key={shot}
                            >
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
                    </div>
                  ) : null}
                  <p className="v-mb-stop-copy">{room.rule}</p>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
