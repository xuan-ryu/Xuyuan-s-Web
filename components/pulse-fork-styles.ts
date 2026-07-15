// Pulse case page — fork styles (L0, css string).
//
// Served CSS for the part fork `pulse-part-switch.tsx` renders: the cue
// line, the two open door columns split by a hairline, and each door's
// mini ECG trace (a miniature of its part opener's trace — live cyan
// while reading, gray while idle). Interpolated into the layout's one
// <style> tag at the fork section, so cascade order is unchanged; the
// layout runs it through stripCssComments with everything else.

export const pulseForkCss = `
/* the fork — two open columns in the part-opener grammar, after the
   overview: eyebrow + title + brief over the part's own trace */
.pulse-fork {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  margin: 0 auto;
  padding: clamp(48px, 5vw, 72px) var(--work-gutter) 0;
}
.pulse-fork-cue {
  margin: 0 0 clamp(20px, 2.2vw, 32px);
  font-family: var(--pulse-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pp-text-4);
}
.pulse-doors {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
}
/* selection reads like the rail's running act, scaled up: the track being
   read sits on a soft cyan panel (flat tint — no border, no shadow), the
   idle one is bare page and takes a hover wash */
.pulse-door {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  padding: clamp(20px, 2.2vw, 28px);
  border: 0;
  border-radius: 14px;
  background: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-text);
  color: var(--pp-ink);
  transition: background-color 0.25s var(--ease-silk);
}
.pulse-door.is-on {
  background: var(--pp-cyan-soft);
}
.pulse-door:not(.is-on):hover {
  background: rgba(15, 23, 42, 0.04);
}
.pulse-door:focus-visible {
  outline: 2px solid var(--pp-cyan-600);
  outline-offset: 4px;
}
.pulse-door-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 22px;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.pulse-door-index {
  color: var(--case-detail);
}
.pulse-door-now {
  display: none;
  padding: 4px 10px;
  border-radius: 6px;
  /* sits ON the cyan-soft panel — white keeps the chip visible there */
  background: rgba(255, 255, 255, 0.85);
  color: var(--pp-cyan-dark);
}
.pulse-door.is-on .pulse-door-now {
  display: block;
}
.pulse-door-title {
  font-size: clamp(22px, 2vw, 30px);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.1;
  transition: color 0.2s var(--ease-silk);
}
.pulse-door:hover .pulse-door-title {
  color: var(--pp-cyan-dark);
}
.pulse-door-desc {
  max-width: 44ch;
  margin-bottom: clamp(14px, 1.6vw, 22px);
  font-size: var(--text-meta);
  line-height: 1.5;
  color: var(--pp-text-3);
}
/* the door's signature = a miniature of the ECG trace its part opener
   draws below (one beat / double beat) — live cyan while reading, gray
   while idle. Picking a door fires ONE ping per spike (then still —
   the page's no-ambient-loops rule); the dots stay invisible otherwise */
.pulse-door-tracewrap {
  position: relative;
  display: block;
  width: 100%;
  margin-top: auto;
}
.pulse-door-trace {
  display: block;
  width: 100%;
  height: 24px;
}
.pulse-door-beat {
  position: absolute;
  top: 12px;
  left: 0;
  width: 7px;
  height: 7px;
  margin: -3.5px 0 0 -3.5px;
  border-radius: 50%;
  background: var(--pp-cyan-600);
  opacity: 0;
  pointer-events: none;
}
@keyframes pulseDoorBeat {
  0% { opacity: 0; transform: scale(0.3); }
  30% { opacity: 0.9; transform: scale(1); }
  100% { opacity: 0; transform: scale(2.4); }
}
@media (prefers-reduced-motion: no-preference) {
  /* fires when the fork scrolls into view (FadeReveal lands .is-visible),
     so the ping is actually witnessed — a bare .is-on hook would fire at
     hydration, far above the fold, and play to nobody */
  .pulse-fork[data-fade].is-visible .pulse-door.is-on .pulse-door-beat {
    animation: pulseDoorBeat 0.9s var(--ease-silk) both;
    animation-delay: 500ms;
  }
  .pulse-fork[data-fade].is-visible
    .pulse-door.is-on
    .pulse-door-beat:nth-of-type(2) {
    animation-delay: 670ms;
  }
  /* the idle door answers a hover with a gray ping — affordance, not state */
  .pulse-door:not(.is-on):hover .pulse-door-beat {
    background: var(--pp-text-3);
    animation: pulseDoorBeat 0.9s var(--ease-silk) both;
    animation-delay: 80ms;
  }
  .pulse-door:not(.is-on):hover .pulse-door-beat:nth-of-type(2) {
    animation-delay: 250ms;
  }
}
.pulse-door-trace path {
  fill: none;
  stroke: var(--pp-line-strong);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.3s var(--ease-silk);
}
.pulse-door:hover .pulse-door-trace path {
  stroke: var(--pp-text-3);
}
.pulse-door.is-on .pulse-door-trace path {
  stroke: var(--pp-cyan-600);
}
@media (max-width: 809px) {
  .pulse-doors {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 12px;
  }
}
`;
