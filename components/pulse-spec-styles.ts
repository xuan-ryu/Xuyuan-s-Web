// Pulse case page — token-sheet styles (L0, css string).
//
// The 2.3 System token-sheet board: interactive hex chips, the six 10-stop
// ramps, the type scale, and the 8-base spacing ruler. Rendered full-width
// as a two-column board (color system | structure system) since 2026-07-15
// (owner: the aside version read too small). Interpolated into the layout's
// one <style> tag; approval/CI-chain styles stay in the layout.

export const pulseSpecCss = `
/* ── Ch. 07 — the token sheet, drawn as a wide two-column board ────────── */
.pulse-tokensheet {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  column-gap: clamp(32px, 4vw, 64px);
  align-items: stretch;
}
/* structure column spreads to the color column's height — no dead corner */
.pulse-tokensheet > div:last-child {
  display: grid;
  align-content: space-between;
}
.pulse-spec-chips {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}
.pulse-spec-chip i {
  display: block;
  height: 34px;
  border: 1px solid rgba(29, 29, 31, 0.1);
  border-radius: var(--radius-thumb);
}
.pulse-spec-chip span {
  display: block;
  margin-top: 6px;
  font-family: var(--pulse-mono);
  font-size: 11px;
  color: var(--pp-text-4);
  transition: color 0.25s var(--ease-silk);
}
.pulse-spec-chip:hover span {
  color: var(--pp-ink);
}
.pulse-ramps {
  display: grid;
  row-gap: 13px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--pp-line);
}
.pulse-ramp-row {
  display: grid;
  grid-template-columns: minmax(84px, auto) minmax(0, 1fr) minmax(58px, auto);
  align-items: center;
  column-gap: 14px;
}
.pulse-ramp-row > span {
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-ramp-stops {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  height: 24px;
  overflow: hidden;
  border-radius: 4px;
}
.pulse-ramp-stops i {
  display: block;
  height: 100%;
}
.pulse-ramp-row > em {
  font-family: var(--pulse-mono);
  font-style: normal;
  font-size: 11px;
  text-align: right;
  color: var(--pp-text-4);
}
.pulse-spec-type {
  margin-top: 16px;
}
.pulse-spec-type-row {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--pp-line);
}
.pulse-spec-type-row strong {
  font-family: var(--font-text);
  font-weight: 600;
  line-height: 1;
  color: var(--pp-ink);
}
.pulse-spec-type-row span {
  font-family: var(--pulse-mono);
  font-size: var(--text-micro);
  color: var(--pp-text-4);
}
.pulse-spec-ruler {
  margin-top: 22px;
}
.pulse-spec-ruler-label {
  font-family: var(--pulse-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-spec-ruler-track {
  position: relative;
  height: 32px;
  margin-top: 10px;
  border-top: 1px solid rgba(29, 29, 31, 0.38);
}
.pulse-spec-ruler-track i {
  position: absolute;
  top: -1px;
  width: 1px;
  height: 8px;
  background: rgba(29, 29, 31, 0.38);
}
.pulse-spec-ruler-track i em {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--pulse-mono);
  font-style: normal;
  font-size: 11px;
  color: var(--pp-text-4);
}
@media (max-width: 809px) {
  .pulse-tokensheet {
    grid-template-columns: minmax(0, 1fr);
  }
  .pulse-tokensheet > div + div {
    margin-top: 8px;
  }
}
/* the sweep series' shared entrance — names why two pairs run together */
.pulse-sweep-head {
  grid-column: 1 / -1;
}
.pulse-sweep-head > p:last-child {
  margin: 0;
  max-width: 44ch;
  font-family: var(--font-text);
  font-size: var(--text-title);
  font-weight: 500;
  line-height: 1.3;
  color: var(--pp-ink);
}
`;
