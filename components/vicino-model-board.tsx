"use client";

// Station-04 (Block B) interactive: the owner's own PDR *schematic*, rebuilt
// live. A Work Space canvas holds the node cluster centered-left (a single real
// Image node, smaller, with its floating bar above and its sliding panel to the
// left) and the inspector Sidebar docked to the RIGHT as its own column — the
// separate global-settings surface it actually is. Corner frames annotate each
// zone and tie to it with a thin connector. The four-step main path already
// lives in Block A's flow strip — this block is only the zoning: a designated
// home for every kind of function so the product can scale.
//
// CONFIDENTIALITY: this recreates the STRUCTURE of the owner's schematic only —
// the zone text is paraphrased in the designer's own words (no verbatim internal
// PRD paragraphs, no "Detail PRD" doc links, no internal screenshots or names).
//
// The node is a recreation of Vicino's shipped Image node (READ-ONLY source in
// the-product-codebase). What each zone reproduces:
//   Node Panel   — nodes/the image node + the image-node styles: teal-bordered card
//                  (#8BD6D9, rgba(139,214,217,.5)); header = image icon +
//                  "Image" + glass play/generate button; body = the image area
//                  only (the in-node prompt is "commented out — not in PDR").
//   Floating Bar — nodes/image/the node toolbar + shared/the base-node styles: glass
//                  strip above the node — utility icons, a divider, then
//                  Canvas Editor · Multi-views · Generate Video.
//   Sliding Panel— slidingPanel/the sliding panel + panels/the node panel: opens
//                  flush to the node's LEFT at node width; the auto-open row,
//                  Input(s) (Prompt + Images), then a Prompt box. Its toggle tab
//                  is the panel's handle — anchored to the panel edge, slides
//                  with it (sp-toggle-bar left animation).
//   Sidebar      — inspector/the inspector panel + the model dropdown + the run bar: the
//                  right-docked inspector — node title, Model ("Nano Banana
//                  Pro") with its subtext, Aspect ratio (16:9), Variations, and
//                  the bottom Total-cost + Generate run bar.
// Handle slots follow core/connections/the handle positions (first slot 56px from
// the top, +40px per slot). Field values are clearly-labeled specimen data.
import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

// Everything below lives on a 1320×760 stage (scaled to the container width by
// .v-mb-stage), so the whole schematic — cluster, docked inspector, corner
// frames, connectors — shares one coordinate space and stays aligned.
const NODE_W = 250; // smaller than the shipped 310, to free room for the frames
const NODE_H = 320;
// The sliding panel is WIDER than the node and tucks its right edge 30px under
// it (slide-phone). The extra width + right padding keeps the panel's own UI
// clear of the node overlap so nothing is covered.
const PANEL_W = 320;
const NODE_X = 476; // node cluster sits centered-left with breathing room
const NODE_Y = 222;
const NODE_CX = NODE_X + NODE_W / 2;

// The inspector docked to the canvas's right edge (product-faithful width).
const DOCK_X = 1000;
const DOCK_Y = 128;
const DOCK_W = 304;
const DOCK_H = 556;

// The Image node's teal (the image-node styles border / theme --handle-image); the
// Prompt (text) input keeps the connection pink.
const IMAGE_ACCENT = "#8BD6D9";
const TEXT_HANDLE = "#F1A0FA";
const GEN_IMAGE = "/media/work/vicino/video-preview.png";

// the handle positions: first slot 56px from the node top, +40px per slot.
const SLOT_TOP = 56;
const SLOT_STEP = 40;

// Corner frames — the zoning in the designer's own words (paraphrase, sentence
// case). `tick` is the zone's OWN product accent (sanctioned product-UI colour
// inside the canvas): teal from the node/panel, amber from the video action,
// violet from the text/model area. Frame chrome itself stays ink/hairline/gold.
// `box` positions the frame (stage coords); `line` is the connector to the
// element it describes.
const frames = [
  {
    id: "floating",
    label: "Floating Bar",
    tick: "#FFB366",
    copy:
      "Actions on the selected node — duplicate, download, and the next steps (open the editor, multi-views, make a video). Never node settings.",
    box: { left: 18, top: 44, width: 250 },
    line: { x1: 272, y1: 150, x2: 372, y2: 190 },
  },
  {
    id: "panel",
    label: "Sliding Panel",
    tick: "#8BD6D9",
    copy:
      "Node-level inputs and quick tweaks, changed in place — the prompt and its references. Not global settings or the next step.",
    box: { left: 18, top: 560, width: 250 },
    line: { x1: 205, y1: 560, x2: 190, y2: 540 },
  },
  {
    id: "node",
    label: "Node Panel",
    tick: "#8BD6D9",
    copy:
      "Stays minimal — the output and Generate. Every other function moves off it and into a zone of its own.",
    box: { left: 452, top: 582, width: 250 },
    line: { x1: 590, y1: 582, x2: 604, y2: 546 },
  },
  {
    id: "sidebar",
    label: "Sidebar",
    tick: "#9B9CF1",
    copy:
      "Whole-node settings — model selection, aspect ratio, Generate. If a control governs the node, it lives here.",
    box: { left: 1000, top: 18, width: 304 },
    line: { x1: 1152, y1: 108, x2: 1152, y2: 128 },
  },
] as const;

// Faithful floating-bar layout (the node toolbar order): utility icons, a
// divider, then the three named actions. The publish/annotation icons are left
// out to keep the bar readable; the rest is the shipped set.
const barIcons = ["duplicate", "download", "upload", "delete"] as const;
const barActions = ["Canvas Editor", "Multi-views", "Generate Video"] as const;

function ImageHeader() {
  return (
    <div className="vicino-product-node-header">
      <div className="vicino-product-node-label-row">
        <span className="vicino-product-node-label-group">
          <span className="vicino-product-node-left-icon">
            <span className="vicino-img-icon" aria-hidden="true" />
          </span>
          <p title="Image">Image</p>
        </span>
      </div>
      <div className="vicino-product-node-right">
        <button type="button" aria-label="Generate image" tabIndex={-1}>
          <span />
        </button>
      </div>
    </div>
  );
}

function FloatingBar({ open }: { open: boolean }) {
  return (
    <div
      className="v-mb-floatbar"
      role="toolbar"
      aria-label="Image node Floating Bar — recreation"
      aria-hidden={!open}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <span className="v-mb-fb-icons" aria-hidden="true">
        {barIcons.map((icon) => (
          <i className={`v-mb-fb-ic is-${icon}`} key={icon} />
        ))}
      </span>
      <span className="v-mb-fb-divider" aria-hidden="true" />
      {barActions.map((action) => (
        <button
          className="v-mb-fb-action"
          type="button"
          key={action}
          tabIndex={open ? 0 : -1}
          title="Recreation — this action is not wired"
          onKeyDown={(event) => event.stopPropagation()}
        >
          {action}
        </button>
      ))}
    </div>
  );
}

// Recreation of the node panel — decorative (specimen) content, so the interior
// is aria-hidden; the panel itself is labeled and the node's Enter/Esc drive it.
function SlidingPanel({ open }: { open: boolean }) {
  return (
    <aside
      className="v-mb-panel"
      id="v-mb-image-panel"
      style={{ width: PANEL_W }}
      aria-hidden={!open}
      aria-label="Image node Sliding Panel — recreation, specimen data"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="v-mb-panel-inner" aria-hidden="true">
        <div className="v-mb-panel-autoopen">
          <span>Disable panel auto-open</span>
          <i className="v-mb-toggle" />
        </div>
        <div className="v-mb-panel-sep" />
        <div className="v-mb-panel-group">
          <p className="v-mb-panel-grouptitle">Input(s)</p>
          <div>
            <p className="v-mb-panel-sublabel">Prompt</p>
            <div className="v-mb-chip-row">
              <span className="v-mb-chip">Studio scene</span>
              <span className="v-mb-chip-add" />
            </div>
          </div>
          <div>
            <p className="v-mb-panel-sublabel">Images</p>
            <div className="v-mb-chip-row">
              <span className="v-mb-imgbox-add" />
            </div>
          </div>
        </div>
        <div>
          <p className="v-mb-panel-sublabel">Prompt</p>
          <div className="v-mb-prompt">
            <p>A figure at a studio desk, warm key light, shallow depth of field.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Sidebar (inspector) content — the inspector panel / the model dropdown / the run bar.
// PanelHeader shows the node title + type; the run bar (cost + Generate) sits at
// the bottom of the column.
function SidebarContent({ tabIndex }: { tabIndex: number }) {
  return (
    <>
      <div className="v-mb-side-head">
        <h4>Image</h4>
        <span className="v-mb-side-type">Image node</span>
      </div>
      <div className="v-mb-side-field">
        <span className="v-mb-field-label">Model</span>
        <span className="v-mb-model-trigger">Nano Banana Pro</span>
        <span className="v-mb-side-hint">Google · complex prompts, sharp details</span>
      </div>
      <div className="v-mb-side-field">
        <span className="v-mb-field-label">Aspect ratio</span>
        <span className="v-mb-model-trigger">16 : 9</span>
      </div>
      <div className="v-mb-side-field">
        <span className="v-mb-field-label">Variations</span>
        <span className="v-mb-side-seg" aria-hidden="true">
          <em className="is-current">1</em>
          <em>2</em>
          <em>4</em>
        </span>
      </div>
      <div className="v-mb-side-run">
        <div className="v-mb-run-row" aria-hidden="true">
          <span>Total cost</span>
          <span>— credits</span>
        </div>
        <button
          className="v-mb-generate"
          type="button"
          tabIndex={tabIndex}
          title="Recreation — this action is not wired"
        >
          <span className="v-mb-generate-glyph" aria-hidden="true" />
          Generate
        </button>
      </div>
    </>
  );
}

// The image node card body — the image area only (faithful: the in-node prompt
// is commented out in the shipped ImageNode).
function ImageNodeBody() {
  return (
    <div className="vicino-image-node-body">
      <div className="vicino-image-node-frame">
        <img src={GEN_IMAGE} alt="Generated image output — specimen" />
        <span className="vicino-image-node-expand" aria-hidden="true" />
      </div>
    </div>
  );
}

export function VicinoModelBoard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // Expanded by default: the sliding panel + floating bar open, the Sidebar
  // shown — the zoning payoff is visible without a click.
  const [panelOpen, setPanelOpen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

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

  const handleNodeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setPanelOpen((current) => !current);
    }
  };

  // Esc closes the open panel.
  const handleFrameKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    if (!panelOpen) return;
    setPanelOpen(false);
    event.stopPropagation();
  };

  const zoneCopy = (id: string) => frames.find((f) => f.id === id)?.copy ?? "";

  return (
    <div ref={rootRef} className={`v-mb-root${isPaused ? " is-paused" : ""}`}>
      {/* ---- full board: desktop / wide tablet — the schematic ---- */}
      <div ref={frameRef} className="v-mb-frame" onKeyDown={handleFrameKeyDown}>
        <div className="vicino-live-dots" aria-hidden="true" />
        <p className="v-mb-canvas-note" aria-hidden="true">
          Work Space
        </p>

        <div className="v-mb-stage">
          {/* connectors: each corner frame tied to its element */}
          <svg className="v-mb-conn-svg" viewBox="0 0 1320 760" aria-hidden="true">
            {frames.map((frame) => (
              <g key={frame.id}>
                <line
                  className="v-mb-conn-line"
                  x1={frame.line.x1}
                  y1={frame.line.y1}
                  x2={frame.line.x2}
                  y2={frame.line.y2}
                  stroke={frame.tick}
                />
                <circle
                  className="v-mb-conn-dot"
                  cx={frame.line.x2}
                  cy={frame.line.y2}
                  r={4}
                  fill={frame.tick}
                />
              </g>
            ))}
          </svg>

          {/* the four annotation frames */}
          {frames.map((frame) => (
            <div
              className={`v-mb-fnote is-${frame.id}`}
              key={frame.id}
              style={{ left: frame.box.left, top: frame.box.top, width: frame.box.width }}
            >
              <p className="v-mb-fnote-eyebrow">
                <span className="v-mb-fnote-tick" style={{ background: frame.tick }} aria-hidden="true" />
                {frame.label}
              </p>
              <p className="v-mb-fnote-copy">{frame.copy}</p>
            </div>
          ))}

          {/* the live node cluster (centered-left) */}
          <div
            className={`vicino-product-node is-image${panelOpen ? " is-open" : ""}`}
            role="button"
            tabIndex={0}
            aria-expanded={panelOpen}
            aria-controls="v-mb-image-panel"
            aria-label="Image node — Enter opens or closes its Sliding Panel and Floating Bar"
            style={
              {
                width: NODE_W,
                height: NODE_H,
                transform: `translate3d(${NODE_X}px, ${NODE_Y}px, 0)`,
                "--v-mb-panel-w": `${PANEL_W}px`,
              } as CSSProperties
            }
            onClick={() => setPanelOpen((current) => !current)}
            onKeyDown={handleNodeKeyDown}
          >
            <span
              className="vicino-product-handle is-left"
              style={{ top: SLOT_TOP - 13, "--handle-color": TEXT_HANDLE } as CSSProperties}
            />
            <span
              className="vicino-product-handle is-left"
              style={
                { top: SLOT_TOP + SLOT_STEP - 13, "--handle-color": IMAGE_ACCENT } as CSSProperties
              }
            />
            <span
              className="vicino-product-handle is-right"
              style={{ top: SLOT_TOP - 13, "--handle-color": IMAGE_ACCENT } as CSSProperties}
            />
            <span className="v-mb-out-label" aria-hidden="true">
              Image
            </span>

            {/* the sliding panel's own toggle tab — rides to the panel's outer
                edge when open, back to the node edge when closed */}
            <span className="v-mb-tab" style={{ background: IMAGE_ACCENT }} aria-hidden="true" />

            <FloatingBar open={panelOpen} />
            <SlidingPanel open={panelOpen} />

            <div className="vicino-product-node-shell is-image">
              <ImageHeader />
              <ImageNodeBody />
            </div>
          </div>

          {/* the inspector Sidebar, docked to the canvas's right edge */}
          <aside
            className="v-mb-sidebar"
            aria-label="Sidebar — global settings and model selection, recreation"
            style={{ left: DOCK_X, top: DOCK_Y, width: DOCK_W, height: DOCK_H }}
          >
            <SidebarContent tabIndex={0} />
          </aside>
        </div>

        <div className="vicino-live-caption">
          <span>Recreation of Vicino&rsquo;s Image node · specimen data</span>
        </div>
      </div>

      {/* ---- stacked variant: phones + narrow tablets (no schematic layout) ---- */}
      <div className="v-mb-stack">
        <p className="v-mb-canvas-note is-stack">
          Work Space · recreation of Vicino&rsquo;s Image node · specimen data
        </p>

        <div className="v-mb-stack-item">
          <h3>Node Panel</h3>
          <div
            className="v-mb-stack-nodebox"
            style={
              {
                aspectRatio: `${NODE_W} / ${NODE_H}`,
                "--stack-node-w": `${NODE_W}px`,
              } as CSSProperties
            }
          >
            <div
              className="vicino-product-node is-image is-static"
              style={{ width: NODE_W, height: NODE_H }}
            >
              <span
                className="vicino-product-handle is-right"
                style={{ top: SLOT_TOP - 13, "--handle-color": IMAGE_ACCENT } as CSSProperties}
              />
              <span className="v-mb-tab" style={{ background: IMAGE_ACCENT }} aria-hidden="true" />
              <div className="vicino-product-node-shell is-image">
                <ImageHeader />
                <ImageNodeBody />
              </div>
            </div>
          </div>
          <p className="v-mb-stop-copy">{zoneCopy("node")}</p>
        </div>

        <div className="v-mb-stack-item">
          <h3>Floating Bar</h3>
          <div className="v-mb-stack-floatbar">
            <div className="v-mb-floatbar is-static" aria-hidden="true">
              <span className="v-mb-fb-icons">
                {barIcons.map((icon) => (
                  <i className={`v-mb-fb-ic is-${icon}`} key={icon} />
                ))}
              </span>
              <span className="v-mb-fb-divider" />
              {barActions.map((action) => (
                <span className="v-mb-fb-action" key={action}>
                  {action}
                </span>
              ))}
            </div>
          </div>
          <p className="v-mb-stop-copy">{zoneCopy("floating")}</p>
        </div>

        <div className="v-mb-stack-item">
          <h3>Sliding Panel</h3>
          <div className="v-mb-stack-panel" aria-hidden="true">
            <div className="v-mb-panel-autoopen">
              <span>Disable panel auto-open</span>
              <i className="v-mb-toggle" />
            </div>
            <div className="v-mb-panel-sep" />
            <div className="v-mb-panel-group">
              <p className="v-mb-panel-grouptitle">Input(s)</p>
              <div>
                <p className="v-mb-panel-sublabel">Prompt</p>
                <div className="v-mb-chip-row">
                  <span className="v-mb-chip">Studio scene</span>
                  <span className="v-mb-chip-add" />
                </div>
              </div>
              <div>
                <p className="v-mb-panel-sublabel">Images</p>
                <div className="v-mb-chip-row">
                  <span className="v-mb-imgbox-add" />
                </div>
              </div>
            </div>
            <div>
              <p className="v-mb-panel-sublabel">Prompt</p>
              <div className="v-mb-prompt">
                <p>A figure at a studio desk, warm key light, shallow depth of field.</p>
              </div>
            </div>
          </div>
          <p className="v-mb-stop-copy">{zoneCopy("panel")}</p>
        </div>

        <div className="v-mb-stack-item">
          <h3>Sidebar</h3>
          <div className="v-mb-stack-panel is-rail">
            <SidebarContent tabIndex={0} />
          </div>
          <p className="v-mb-stop-copy">{zoneCopy("sidebar")}</p>
        </div>
      </div>
    </div>
  );
}
