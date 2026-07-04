"use client";

import { useMemo, useState } from "react";

// Pulse playground demo — the npm package's data-testing story, live on the
// page: feed a component JSON and watch it hold. The left pane is an editable
// payload; the right pane is a MetricCard-shaped tile rendering whatever
// arrives — including nothing, too much, and garbage. Sample data only
// (illustrative, brand-neutral); the real playground drives the published
// package with per-component knobs and a JSON live-data editor.
//
// States demonstrated on purpose:
//   healthy  → value + delta + sparkline
//   empty    → the tile's empty state (no data yet)
//   overflow → long label / huge value, truncating gracefully
//   broken   → invalid JSON; the tile shows its error state, never crashes
// Color semantics follow the Pulse rule: green = data up; red = declining
// data ONLY (this red lives inside the product frame, not on the page's
// budget — the page's one seal-red moment stays the human-gate stamps).

type Payload = {
  label?: unknown;
  value?: unknown;
  delta?: unknown;
  series?: unknown;
};

const PRESETS: Array<{ key: string; note: string; json: string }> = [
  {
    key: "healthy",
    note: "value + trend",
    json: `{
  "label": "Projected reach",
  "value": "420K",
  "delta": "+12%",
  "series": [3, 5, 4, 7, 6, 9, 11]
}`,
  },
  {
    key: "empty",
    note: "nothing arrived",
    json: `{
  "label": "Projected reach",
  "value": null,
  "series": []
}`,
  },
  {
    key: "overflow",
    note: "too much of everything",
    json: `{
  "label": "Cross-platform projected reach, all campaigns, rolling quarter",
  "value": "1,204,586,332",
  "delta": "+248%",
  "series": [2,3,3,4,5,4,6,7,6,8,9,8,10,12,11,13,14,13,15,17,16,18,19,21,20,22,24,23,25,27]
}`,
  },
  {
    key: "broken",
    note: "malformed payload",
    json: `{ "label": "Projected reach", "value":`,
  },
];

function parsePayload(src: string):
  | { state: "error"; message: string }
  | { state: "empty"; label: string }
  | {
      state: "ok";
      label: string;
      value: string;
      delta: string | null;
      falling: boolean;
      series: number[];
    } {
  let data: Payload;
  try {
    data = JSON.parse(src) as Payload;
  } catch (err) {
    return {
      state: "error",
      message: err instanceof Error ? err.message.split("\n")[0] : "invalid JSON",
    };
  }
  const label =
    typeof data.label === "string" && data.label.trim() ? data.label : "Metric";
  const series = Array.isArray(data.series)
    ? data.series.filter((n): n is number => typeof n === "number")
    : [];
  const hasValue =
    data.value !== null &&
    data.value !== undefined &&
    `${data.value as string}`.trim() !== "";
  if (!hasValue && series.length === 0) return { state: "empty", label };
  const delta = typeof data.delta === "string" && data.delta.trim() ? data.delta : null;
  return {
    state: "ok",
    label,
    // objects stringify readably instead of collapsing to [object Object]
    value: hasValue
      ? typeof data.value === "object"
        ? JSON.stringify(data.value)
        : String(data.value)
      : "—",
    delta,
    falling: delta?.trim().startsWith("-") ?? false,
    series,
  };
}

function Sparkline({ series }: { series: number[] }) {
  if (series.length < 2) return null;
  const w = 132;
  const h = 36;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const pts = series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * w;
      const y = h - 3 - ((v - min) / span) * (h - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      className="ppg-spark"
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      focusable="false"
    >
      <polyline points={pts} />
    </svg>
  );
}

const PPG_CSS = `
.ppg {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 14px;
  padding: clamp(16px, 1.4vw, 22px);
  font-family: var(--font-text);
}
.ppg-pane { min-width: 0; display: flex; flex-direction: column; gap: 10px; }
.ppg-pane-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  font-family: var(--font-text);
  font-weight: 500;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.ppg-presets { display: flex; flex-wrap: wrap; gap: 6px; }
.ppg-preset {
  padding: 4px 10px;
  border: 1px solid var(--pp-line);
  border-radius: 8px;
  background: #ffffff;
  font-family: var(--font-text);
  font-weight: 500;
  font-size: 11px;
  color: var(--pp-text-2);
  cursor: pointer;
  transition: border-color 0.18s var(--ease-silk), color 0.18s var(--ease-silk);
}
.ppg-preset:hover { border-color: var(--pp-cyan-ring); color: var(--pp-ink); }
.ppg-preset.is-on {
  border-color: var(--pp-cyan-ring);
  background: var(--pp-cyan-soft);
  color: var(--pp-cyan-dark);
}
.ppg-preset:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
.ppg-editor {
  flex: 1;
  min-height: 190px;
  resize: vertical;
  padding: 12px 14px;
  border: 1px solid var(--pp-line);
  border-radius: 12px;
  background: #ffffff;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--pp-ink);
}
.ppg-editor:focus-visible {
  outline: none;
  border-color: transparent;
  box-shadow: 0 0 0 3px var(--pp-cyan-ring);
}
.ppg-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  border: 1px dashed rgba(29, 29, 31, 0.14);
  border-radius: 12px;
}
.ppg-tile {
  box-sizing: border-box;
  width: min(100%, 300px);
  padding: 16px 18px;
  border: 1px solid var(--pp-line);
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.035), 0 4px 10px rgba(15, 23, 42, 0.04);
}
.ppg-tile-label {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.ppg-tile-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 6px;
}
.ppg-tile-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 26px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--pp-ink);
}
.ppg-tile-delta {
  flex: none;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: #2e9d40; /* success-600: data up */
}
.ppg-tile-delta.is-falling { color: #dc2626; } /* red-600: declining data only */
.ppg-spark { display: block; width: 100%; height: 36px; margin-top: 10px; }
.ppg-spark polyline {
  fill: none;
  stroke: #0ea5b8; /* cyan-600: neutral diagram path */
  stroke-width: 1.6;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.ppg-state {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--pp-text-2);
}
.ppg-state strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--pp-ink);
}
.ppg-state.is-error strong { color: #b91c1c; }
.ppg-state code {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--pp-text-4);
  overflow-wrap: anywhere;
}
@media (max-width: 809px) {
  .ppg { grid-template-columns: minmax(0, 1fr); }
  .ppg-editor { min-height: 150px; }
}
`;

export function PulsePlaygroundDemo() {
  const [active, setActive] = useState(0);
  const [src, setSrc] = useState(PRESETS[0].json);
  const parsed = useMemo(() => parsePayload(src), [src]);

  return (
    <div className="ppg" data-fade>
      <style dangerouslySetInnerHTML={{ __html: PPG_CSS }} />
      <div className="ppg-pane">
        <div className="ppg-pane-head">
          <span>payload &middot; json</span>
          <span>sample data</span>
        </div>
        <div className="ppg-presets" role="group" aria-label="Payload presets">
          {PRESETS.map((p, i) => (
            <button
              type="button"
              key={p.key}
              className={`ppg-preset${i === active ? " is-on" : ""}`}
              aria-pressed={i === active}
              title={p.note}
              onClick={() => {
                setActive(i);
                setSrc(p.json);
              }}
            >
              {p.key}
            </button>
          ))}
        </div>
        <textarea
          className="ppg-editor"
          aria-label="Component data payload (editable JSON)"
          spellCheck={false}
          value={src}
          onChange={(e) => {
            setSrc(e.target.value);
            setActive(-1);
          }}
        />
      </div>
      <div className="ppg-pane">
        <div className="ppg-pane-head">
          <span>MetricCard &middot; renders the payload</span>
          <span>holds every state</span>
        </div>
        <div className="ppg-stage" aria-live="polite">
          {parsed.state === "error" ? (
            <div className="ppg-tile">
              <p className="ppg-state is-error">
                <strong>Couldn&rsquo;t read the payload</strong>
                The tile keeps its frame and says why instead of crashing:
                <br />
                <code>{parsed.message}</code>
              </p>
            </div>
          ) : parsed.state === "empty" ? (
            <div className="ppg-tile">
              <span className="ppg-tile-label">{parsed.label}</span>
              <p className="ppg-state">
                <strong>No data yet</strong>
                Connect a source to start tracking this metric.
              </p>
            </div>
          ) : (
            <div className="ppg-tile">
              <span className="ppg-tile-label">{parsed.label}</span>
              <div className="ppg-tile-row">
                <span className="ppg-tile-value">{parsed.value}</span>
                {parsed.delta && (
                  <span
                    className={`ppg-tile-delta${parsed.falling ? " is-falling" : ""}`}
                  >
                    {parsed.delta}
                  </span>
                )}
              </div>
              <Sparkline series={parsed.series} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
