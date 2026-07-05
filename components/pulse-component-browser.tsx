"use client";

import { useEffect, useRef, useState } from "react";
import { stripCssComments } from "@/lib/css-sanitize";

/* ── The live component browser (Fig. 10), recreated as a real interactive
   specimen instead of a screenshot. Every piece here is a faithful rebuild of
   a Pulse shared component — its geometry, color ramps, and state contract come
   straight from the design system's token truth-source (control heights 34/38,
   radius 8/12/16, the six semantic ramps, the dot-led status pills, the calm
   flat-white surfaces). Rendered in the portfolio's own typeface so it reads as
   a coded specimen alongside its sibling diagrams, not a pasted product frame.
   Confidential internals stay out; these are generic UI atoms the owner built
   and the owner has cleared for reproduction. ── */

type Category = "buttons" | "status" | "metrics" | "tabs" | "campaign";

const CATEGORIES: { id: Category; label: string; count: string }[] = [
  { id: "buttons", label: "Buttons", count: "4 variants" },
  { id: "status", label: "Status", count: "6 states" },
  { id: "metrics", label: "Metrics", count: "3 tiles" },
  { id: "tabs", label: "Tabs", count: "segmented" },
  { id: "campaign", label: "Campaign", count: "post chip" },
];

/* one small run-state machine for the submit → busy → done feedback path that
   every interactive Pulse control is required to demonstrate */
function useRun() {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => clearTimeout(id));
  }, []);
  const run = () => {
    if (state !== "idle") return;
    setState("busy");
    timers.current.push(window.setTimeout(() => setState("done"), 900));
    timers.current.push(window.setTimeout(() => setState("idle"), 2200));
  };
  return { state, run };
}

function RunButton({
  variant,
  label,
}: {
  variant: "primary" | "secondary" | "ghost" | "danger";
  label: string;
}) {
  const { state, run } = useRun();
  const busyLabel = variant === "danger" ? "Removing" : "Working";
  const doneLabel = variant === "danger" ? "Removed" : "Done";
  return (
    <button
      type="button"
      className={`pcb-btn pcb-btn--${variant} is-${state}`}
      onClick={run}
      aria-busy={state === "busy"}
      aria-live="polite"
    >
      {state === "busy" && <i className="pcb-spinner" aria-hidden="true" />}
      {state === "done" && <i className="pcb-check" aria-hidden="true" />}
      <span>{state === "busy" ? busyLabel : state === "done" ? doneLabel : label}</span>
    </button>
  );
}

const GEN_STATES = [
  { key: "queued", label: "Queued" },
  { key: "scheduled", label: "Scheduled" },
  { key: "building", label: "Generating" },
  { key: "ready", label: "Ready" },
  { key: "published", label: "Published" },
  { key: "onhold", label: "On hold" },
] as const;

function StatusSpec() {
  const [i, setI] = useState(3); // start on "ready" (the cyan state)
  const cur = GEN_STATES[i];
  return (
    <div className="pcb-group">
      <div className="pcb-pill-row">
        {GEN_STATES.map((s) => (
          <span className={`pcb-pill pcb-pill--${s.key}`} key={s.key}>
            <i aria-hidden="true" />
            {s.label}
          </span>
        ))}
      </div>
      <div className="pcb-cycle">
        <span className={`pcb-pill pcb-pill--${cur.key} pcb-pill--lg`}>
          <i aria-hidden="true" />
          {cur.label}
        </span>
        <button
          type="button"
          className="pcb-btn pcb-btn--secondary pcb-btn--sm"
          onClick={() => setI((v) => (v + 1) % GEN_STATES.length)}
        >
          Advance state
        </button>
        <span className="pcb-hint">generation status · one dot, no glow</span>
      </div>
    </div>
  );
}

const METRICS = [
  { label: "Published posts", value: "128", delta: "+12%", dir: "up", spark: [8, 10, 9, 14, 13, 18, 22] },
  { label: "Avg engagement", value: "4.6%", delta: "+0.4pt", dir: "up", spark: [10, 11, 10, 12, 13, 13, 15] },
  { label: "Drop-off", value: "2.1%", delta: "−0.3pt", dir: "down", spark: [16, 15, 15, 13, 12, 11, 9] },
] as const;

function sparkPath(vals: readonly number[]) {
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const span = max - min || 1;
  const w = 120;
  const h = 34;
  return vals
    .map((v, idx) => {
      const x = (idx / (vals.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${idx === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function MetricsSpec() {
  return (
    <div className="pcb-group">
      <div className="pcb-metric-row">
        {METRICS.map((m) => (
          <article className="pcb-metric" key={m.label}>
            <p className="pcb-metric-label">{m.label}</p>
            <div className="pcb-metric-figure">
              <strong>{m.value}</strong>
              <span className={`pcb-delta pcb-delta--${m.dir}`}>{m.delta}</span>
            </div>
            <svg
              className="pcb-spark"
              viewBox="0 0 120 34"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path className={`pcb-spark-line is-${m.dir}`} d={sparkPath(m.spark)} />
            </svg>
          </article>
        ))}
      </div>
      <span className="pcb-hint">MetricCard · key figure at one standard size · hover to draw the trend</span>
    </div>
  );
}

const TABS = ["Overview", "Reach", "Engagement", "Conversions"];

function TabsSpec() {
  const [i, setI] = useState(0);
  return (
    <div className="pcb-group">
      <div
        className="pcb-seg"
        role="tablist"
        style={{ ["--seg-n" as string]: TABS.length, ["--seg-i" as string]: i }}
      >
        <span className="pcb-seg-thumb" aria-hidden="true" />
        {TABS.map((t, idx) => (
          <button
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`pcb-seg-btn${i === idx ? " is-active" : ""}`}
            key={t}
            onClick={() => setI(idx)}
          >
            {t}
          </button>
        ))}
      </div>
      <span className="pcb-hint">SegmentedTabs · thumb slides to the selected tab</span>
    </div>
  );
}

const POSTS = [
  { platform: "in", name: "LinkedIn", tint: "#0a66c2", title: "Launch week — founder note", status: "scheduled", label: "Scheduled", pct: 100 },
  { platform: "ig", name: "Instagram", tint: "#d95b7f", title: "Carousel · 5 frames", status: "building", label: "Generating", pct: 62 },
  { platform: "x", name: "X", tint: "#0f0f0f", title: "Thread · 4 posts", status: "ready", label: "Ready", pct: 100 },
];

function CampaignSpec() {
  const [lifted, setLifted] = useState<number | null>(null);
  return (
    <div className="pcb-group">
      <div className="pcb-chip-col">
        {POSTS.map((p, idx) => (
          <div
            className={`pcb-chip${lifted === idx ? " is-lifted" : ""}`}
            key={p.title}
            onMouseEnter={() => setLifted(idx)}
            onMouseLeave={() => setLifted(null)}
          >
            <span className="pcb-plat" style={{ background: p.tint }} aria-hidden="true">
              {p.platform}
            </span>
            <div className="pcb-chip-body">
              <p className="pcb-chip-title">{p.title}</p>
              <p className="pcb-chip-meta">{p.name}</p>
            </div>
            <div className="pcb-chip-right">
              <span className={`pcb-pill pcb-pill--${p.status}`}>
                <i aria-hidden="true" />
                {p.label}
              </span>
              {p.pct < 100 && (
                <span className="pcb-meter" aria-hidden="true">
                  <i style={{ width: `${p.pct}%` }} />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <span className="pcb-hint">PostChip · one row per platform in a campaign pipeline</span>
    </div>
  );
}

export function PulseComponentBrowser() {
  const [cat, setCat] = useState<Category>("buttons");
  const active = CATEGORIES.find((c) => c.id === cat)!;
  return (
    <div className="pcb">
      <style dangerouslySetInnerHTML={{ __html: stripCssComments(PCB_CSS) }} />
      <header className="pcb-head">
        <span className="pcb-head-title">Component browser</span>
        <span className="pcb-head-live">
          <i aria-hidden="true" /> rendered live · Pulse registry
        </span>
      </header>
      <div className="pcb-body">
        <nav className="pcb-rail" aria-label="Component categories">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.id}
              className={`pcb-rail-item${cat === c.id ? " is-active" : ""}`}
              aria-current={cat === c.id}
              onClick={() => setCat(c.id)}
            >
              <span>{c.label}</span>
              <em>{c.count}</em>
            </button>
          ))}
        </nav>
        <section className="pcb-stage" aria-live="polite">
          <div className="pcb-stage-head">
            <h4>{active.label}</h4>
            <p>{STAGE_COPY[cat]}</p>
          </div>
          {cat === "buttons" && (
            <div className="pcb-group">
              <div className="pcb-btn-row">
                <RunButton variant="primary" label="Publish" />
                <RunButton variant="secondary" label="Save draft" />
                <RunButton variant="ghost" label="Preview" />
                <RunButton variant="danger" label="Remove" />
              </div>
              <div className="pcb-btn-row">
                <button type="button" className="pcb-btn pcb-btn--primary pcb-btn--sm">
                  Compact · 34px
                </button>
                <button type="button" className="pcb-btn pcb-btn--secondary pcb-btn--sm">
                  Compact
                </button>
                <button type="button" className="pcb-btn pcb-btn--secondary pcb-btn--sm" disabled>
                  Disabled
                </button>
              </div>
              <span className="pcb-hint">click any button · submit → busy → landed</span>
            </div>
          )}
          {cat === "status" && <StatusSpec />}
          {cat === "metrics" && <MetricsSpec />}
          {cat === "tabs" && <TabsSpec />}
          {cat === "campaign" && <CampaignSpec />}
        </section>
      </div>
    </div>
  );
}

const STAGE_COPY: Record<Category, string> = {
  buttons: "One control contract — four intents, each with its own busy and landed feedback.",
  status: "Generation status: a dot, a soft fill, an outline. Color is assigned by state, never decoration.",
  metrics: "The KPI tile — one figure size across the app, a signed delta, an optional trend.",
  tabs: "A segmented control; the thumb is the only moving part.",
  campaign: "The production row: platform, work, state — the unit a campaign is built from.",
};

const PCB_CSS = `
.pcb {
  /* Pulse token truth-source values, scoped to this specimen */
  --c-cyan: #49e0f5; --c-cyan-dark: #0d7685; --c-cyan-soft: #e5fbff; --c-cyan-line: #b8f3fb;
  --c-green: #43ba51; --c-green-600: #2e9d40; --c-green-soft: #eff9f1; --c-green-line: #abe2b3;
  --c-blue: #3987f3; --c-blue-600: #1f6fe0; --c-blue-soft: #eff5fe; --c-blue-line: #b0cdfa;
  --c-amber: #f19a08; --c-amber-700: #a1640b; --c-amber-soft: #fef6e7; --c-amber-line: #f7ce84;
  --c-purple: #6366f1; --c-purple-600: #4f46e5; --c-purple-soft: #f1f1fe; --c-purple-line: #c7c9f8;
  --c-red: #ef4444; --c-red-600: #dc2626; --c-red-soft: #fef2f2; --c-red-line: #f9c9c9;
  --c-ink-900: #141416; --c-ink-800: #1d1d1f; --c-ink-700: #2f3135;
  --c-text-3: #5f6369; --c-text-4: #8a8e95;
  --c-canvas: #ffffff; --c-surface: #f8faf9; --c-surface-2: #ecf1f0;
  --c-border: rgba(29,29,31,0.10); --c-border-strong: rgba(29,29,31,0.16);
  --c-shadow-1: 0 1px 2px rgba(15,23,42,0.05);
  --c-shadow-2: 0 1px 2px rgba(15,23,42,0.04), 0 6px 16px rgba(15,23,42,0.06);
  --c-focus: 0 0 0 3px rgba(73,224,245,0.42);
  --c-ui: var(--font-text, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif);
  /* one-typeface rule (owner, 2026-07-04): Pulse aliases mono to its sans —
     labels/hints render in the text face with tabular numerals */
  --c-mono: var(--c-ui);

  box-sizing: border-box;
  /* capped so the stage reads dense at full-shell width (owner QA note:
     the uncapped browser left the stage mostly empty at 1536) */
  max-width: 980px;
  border: 1px solid var(--c-border);
  border-radius: 16px;
  background: var(--c-canvas);
  box-shadow: var(--c-shadow-2);
  overflow: hidden;
  font-family: var(--c-ui);
  color: var(--c-ink-800);
  -webkit-font-smoothing: antialiased;
}
.pcb *, .pcb *::before, .pcb *::after { box-sizing: border-box; }
.pcb button { font-family: inherit; cursor: pointer; }

.pcb-head {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 14px 20px;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-surface);
}
.pcb-head-title { font-size: 14px; font-weight: 600; letter-spacing: 0; }
.pcb-head-live {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--c-mono); font-size: 11px; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--c-text-4);
}
.pcb-head-live i {
  width: 6px; height: 6px; border-radius: 9999px; background: var(--c-green);
}

.pcb-body { display: grid; grid-template-columns: 176px minmax(0, 1fr); }
@media (max-width: 720px) { .pcb-body { grid-template-columns: 1fr; } }

.pcb-rail {
  display: flex; flex-direction: column; gap: 2px;
  padding: 12px; border-right: 1px solid var(--c-border); background: var(--c-canvas);
}
@media (max-width: 720px) {
  .pcb-rail { flex-direction: row; overflow-x: auto; border-right: 0; border-bottom: 1px solid var(--c-border); }
}
.pcb-rail-item {
  display: flex; flex-direction: column; align-items: flex-start; gap: 1px;
  padding: 9px 12px; border: 0; border-radius: 10px; background: transparent;
  text-align: left; color: var(--c-text-3); transition: background 0.18s ease, color 0.18s ease;
  white-space: nowrap;
}
.pcb-rail-item span { font-size: 13px; font-weight: 500; color: var(--c-ink-800); }
.pcb-rail-item em { font-style: normal; font-family: var(--c-mono); font-size: 10px; color: var(--c-text-4); letter-spacing: 0.02em; }
.pcb-rail-item:hover { background: var(--c-surface); }
.pcb-rail-item.is-active { background: var(--c-cyan-soft); }
.pcb-rail-item.is-active span { color: var(--c-cyan-dark); }
.pcb-rail-item.is-active em { color: var(--c-cyan-dark); opacity: 0.72; }
.pcb-rail-item:focus-visible { outline: none; box-shadow: var(--c-focus); }

.pcb-stage { padding: 24px clamp(20px, 2.6vw, 32px) 28px; min-height: 268px; display: flex; flex-direction: column; }
.pcb-stage-head { margin-bottom: 22px; }
.pcb-stage-head h4 { margin: 0 0 6px; font-size: 18px; font-weight: 600; }
.pcb-stage-head p { margin: 0; max-width: 52ch; font-size: 13px; line-height: 1.55; color: var(--c-text-3); }

.pcb-group { display: flex; flex-direction: column; gap: 18px; }
.pcb-hint { font-family: var(--c-mono); font-size: 11px; color: var(--c-text-4); letter-spacing: 0.02em; }

/* ── Buttons ── */
.pcb-btn-row { display: flex; flex-wrap: wrap; gap: 12px; }
.pcb-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 38px; padding: 0 18px; border-radius: 8px; border: 1px solid transparent;
  font-size: 13px; font-weight: 600; letter-spacing: 0;
  transition: background 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}
.pcb-btn--sm { height: 34px; padding: 0 16px; font-size: 12px; }
.pcb-btn:focus-visible { outline: none; box-shadow: var(--c-focus); }
.pcb-btn:disabled { cursor: default; opacity: 0.45; box-shadow: none; }
.pcb-btn:disabled:hover { background: #fff; box-shadow: none; }
.pcb-btn--primary { background: var(--c-ink-900); color: #fff; }
.pcb-btn--primary:hover { background: var(--c-ink-700); box-shadow: var(--c-shadow-2); }
.pcb-btn--secondary { background: #fff; border-color: var(--c-border-strong); color: var(--c-ink-800); }
.pcb-btn--secondary:hover { background: var(--c-surface); box-shadow: var(--c-shadow-1); }
.pcb-btn--ghost { background: transparent; color: var(--c-ink-800); }
.pcb-btn--ghost:hover { background: var(--c-surface); }
.pcb-btn--danger { background: #fff; border-color: var(--c-red-line); color: var(--c-red-600); }
.pcb-btn--danger:hover { background: var(--c-red-soft); }
.pcb-btn.is-done { color: var(--c-green-600); border-color: var(--c-green-line); background: var(--c-green-soft); }
.pcb-btn--primary.is-busy, .pcb-btn--primary.is-done { color: #fff; }
.pcb-btn--primary.is-done { background: var(--c-green-600); border-color: var(--c-green-600); }
.pcb-spinner {
  width: 13px; height: 13px; border-radius: 9999px;
  border: 2px solid currentColor; border-top-color: transparent;
  animation: pcb-spin 0.7s linear infinite; opacity: 0.9;
}
.pcb-check { width: 13px; height: 13px; position: relative; }
.pcb-check::after {
  content: ""; position: absolute; left: 4px; top: 0px;
  width: 5px; height: 9px; border: solid currentColor; border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
@keyframes pcb-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .pcb-spinner { animation: none; border-top-color: currentColor; opacity: 0.5; }
}

/* ── Status pills (dot-led, outlined, soft fill) ── */
.pcb-pill-row { display: flex; flex-wrap: wrap; gap: 8px; }
.pcb-pill {
  display: inline-flex; align-items: center; gap: 7px;
  height: 26px; padding: 0 11px; border-radius: 9999px;
  border: 1px solid var(--c-border-strong); background: #fff;
  font-size: 12px; font-weight: 600; color: var(--c-ink-700); white-space: nowrap;
}
.pcb-pill i { width: 6px; height: 6px; border-radius: 9999px; background: var(--c-text-4); flex: none; }
.pcb-pill--lg { height: 30px; padding: 0 14px; font-size: 13px; }
.pcb-pill--queued { background: rgba(29,29,31,0.04); border-color: rgba(29,29,31,0.10); color: var(--c-text-3); }
.pcb-pill--queued i { background: var(--c-text-4); }
.pcb-pill--scheduled { background: var(--c-blue-soft); border-color: var(--c-blue-line); color: var(--c-blue-600); }
.pcb-pill--scheduled i { background: var(--c-blue); }
.pcb-pill--building { background: var(--c-purple-soft); border-color: var(--c-purple-line); color: var(--c-purple-600); }
.pcb-pill--building i { background: var(--c-purple); }
.pcb-pill--ready { background: var(--c-cyan-soft); border-color: var(--c-cyan-line); color: var(--c-cyan-dark); }
.pcb-pill--ready i { background: var(--c-cyan); }
.pcb-pill--published { background: var(--c-green-soft); border-color: var(--c-green-line); color: var(--c-green-600); }
.pcb-pill--published i { background: var(--c-green); }
.pcb-pill--onhold { background: var(--c-amber-soft); border-color: var(--c-amber-line); color: var(--c-amber-700); }
.pcb-pill--onhold i { background: var(--c-amber); }
.pcb-cycle { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }

/* ── Metric tiles ── */
.pcb-metric-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
@media (max-width: 640px) { .pcb-metric-row { grid-template-columns: 1fr; } }
.pcb-metric {
  border: 1px solid var(--c-border); border-radius: 12px; background: #fff;
  padding: 16px 16px 12px; box-shadow: var(--c-shadow-1);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.pcb-metric:hover { box-shadow: var(--c-shadow-2); transform: translateY(-2px); }
.pcb-metric-label { margin: 0 0 8px; font-family: var(--c-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--c-text-4); }
.pcb-metric-figure { display: flex; align-items: baseline; gap: 10px; }
.pcb-metric-figure strong { font-size: 32px; font-weight: 600; line-height: 1; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.pcb-delta { font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums; }
.pcb-delta--up { color: var(--c-green-600); }
.pcb-delta--down { color: var(--c-red-600); }
.pcb-spark { display: block; width: 100%; height: 34px; margin-top: 10px; overflow: visible; }
.pcb-spark-line {
  fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
  opacity: 0.42; transition: opacity 0.25s ease;
}
.pcb-spark-line.is-up { stroke: var(--c-green); }
.pcb-spark-line.is-down { stroke: var(--c-red); }
.pcb-metric:hover .pcb-spark-line { opacity: 1; }

/* ── Segmented tabs ── */
.pcb-seg {
  position: relative; display: grid; grid-template-columns: repeat(var(--seg-n), 1fr);
  gap: 0; padding: 3px; border-radius: 10px; background: var(--c-surface-2); width: 100%; max-width: 460px;
}
.pcb-seg-thumb {
  position: absolute; top: 3px; bottom: 3px; left: 3px;
  width: calc((100% - 6px) / var(--seg-n));
  border-radius: 8px; background: #fff; box-shadow: var(--c-shadow-1);
  transform: translateX(calc(var(--seg-i) * 100%));
  transition: transform 0.28s var(--ease-out, cubic-bezier(0.16,1,0.3,1));
}
@media (prefers-reduced-motion: reduce) { .pcb-seg-thumb { transition: none; } }
.pcb-seg-btn {
  position: relative; z-index: 1; border: 0; background: transparent;
  height: 32px; font-size: 13px; font-weight: 500; color: var(--c-text-3);
  transition: color 0.18s ease;
}
.pcb-seg-btn.is-active { color: var(--c-ink-900); font-weight: 600; }
.pcb-seg-btn:focus-visible { outline: none; box-shadow: var(--c-focus); border-radius: 8px; }

/* ── PostChip ── */
.pcb-chip-col { display: flex; flex-direction: column; gap: 10px; }
.pcb-chip {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 14px; border: 1px solid var(--c-border); border-radius: 12px; background: #fff;
  box-shadow: var(--c-shadow-1); transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.pcb-chip.is-lifted { box-shadow: var(--c-shadow-2); transform: translateY(-2px); }
.pcb-plat {
  width: 34px; height: 34px; flex: none; border-radius: 9px;
  display: inline-flex; align-items: center; justify-content: center;
  color: #fff; font-size: 12px; font-weight: 700; letter-spacing: -0.02em; text-transform: lowercase;
}
.pcb-chip-body { flex: 1 1 auto; min-width: 0; }
.pcb-chip-title { margin: 0; font-size: 14px; font-weight: 600; color: var(--c-ink-800); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pcb-chip-meta { margin: 2px 0 0; font-size: 12px; color: var(--c-text-4); }
.pcb-chip-right { display: flex; align-items: center; gap: 10px; flex: none; }
.pcb-meter { display: block; width: 56px; height: 5px; border-radius: 9999px; background: var(--c-surface-2); overflow: hidden; }
.pcb-meter i { display: block; height: 100%; border-radius: 9999px; background: var(--c-purple); }
@media (max-width: 560px) { .pcb-meter { display: none; } }
`;
