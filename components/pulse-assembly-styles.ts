// Pulse case page — diagram-assembly styles (L0, css string).
//
// Entrance choreography for every drawn artifact: keyframes + the ONE
// `prefers-reduced-motion: no-preference` block that hides initial states
// and assembles them when FadeReveal lands `.is-visible`. Interpolated into
// the layout's single <style> tag (the layout keeps the reduced-motion kill
// block beside the interpolation point). Section rule: one orchestrated
// reveal per diagram, then still — no ambient loops; ≤1.1s per diagram.

export const pulseAssemblyCss = `
/* ── Diagram assembly on arrival ─────────────────────────────────────────
   Each figure carries data-fade; FadeReveal adds .is-visible on enter, so
   the figure rises as a frame and ~220ms later its parts assemble in
   reading order — nodes drop, connections draw toward their target, loops
   sweep in, notes settle. One orchestrated reveal per diagram, then still
   (no ambient loops). Motion-only: every hidden initial state lives inside
   @media (prefers-reduced-motion: no-preference), so reduced motion — and
   the forced-visible/no-JS fallback — shows the finished diagram. ── */
@keyframes pAssembleDrop {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pAssembleDraw {
  from { opacity: 0; transform: scaleX(0); }
  to { opacity: 1; transform: scaleX(1); }
}
@keyframes pAssembleLoop {
  from { opacity: 0; transform: scaleY(0.4); }
  to { opacity: 1; transform: scaleY(1); }
}
@keyframes pAssembleGrow {
  from { opacity: 0; transform: scaleY(0); }
  to { opacity: 1; transform: scaleY(1); }
}
@keyframes pAssembleRise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulseTraceDraw { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: no-preference) {
  /* pflow flow diagrams — stagger children by column position. Tuning
     (2026-07-08 review): at reading speed the anchor figures arrived as
     blank cards, so base delays sit ≤120ms and the staggers are ~40%
     tighter; per-element durations stay ≥0.45s (the earlier "too fast reads
     cheap" owner note holds — the sequence compresses, the moves don't).
     Budget: every diagram finishes ≤1.1s after .is-visible lands. */
  .pulse-case-page .pflow-grid > :nth-child(2) { --pd: 70ms; }
  .pulse-case-page .pflow-grid > :nth-child(3) { --pd: 140ms; }
  .pulse-case-page .pflow-grid > :nth-child(4) { --pd: 210ms; }
  .pulse-case-page .pflow-grid > :nth-child(5) { --pd: 280ms; }
  .pulse-case-page .pflow-grid > :nth-child(6) { --pd: 350ms; }
  .pulse-case-page .pflow-grid > :nth-child(7) { --pd: 420ms; }
  .pulse-case-page .pflow-lane:nth-child(2) { --ld: 200ms; }

  .pulse-case-page figure[data-fade] .pflow-node,
  .pulse-case-page figure[data-fade] .pflow-line,
  .pulse-case-page figure[data-fade] .pflow-loop,
  .pulse-case-page figure[data-fade] .pflow-note {
    opacity: 0;
  }
  .pulse-case-page figure[data-fade] .pflow-node { transform: translateY(10px); }
  .pulse-case-page figure[data-fade] .pflow-line {
    transform: scaleX(0);
    transform-origin: left;
  }
  .pulse-case-page figure[data-fade] .pflow-loop {
    transform: scaleY(0.4);
    transform-origin: top;
  }
  .pulse-case-page figure[data-fade].is-visible .pflow-node {
    animation: pAssembleDrop 0.58s var(--ease-spring) forwards;
    animation-delay: calc(100ms + var(--ld, 0ms) + var(--pd, 0ms));
  }
  .pulse-case-page figure[data-fade].is-visible .pflow-line {
    animation: pAssembleDraw 0.48s var(--ease-silk) forwards;
    animation-delay: calc(120ms + var(--ld, 0ms) + var(--pd, 0ms));
  }
  .pulse-case-page figure[data-fade].is-visible .pflow-loop {
    animation: pAssembleLoop 0.56s var(--ease-silk) forwards;
    animation-delay: calc(440ms + var(--ld, 0ms));
  }
  .pulse-case-page figure[data-fade].is-visible .pflow-note {
    animation: pAssembleDrop 0.45s var(--ease-silk) forwards;
    animation-delay: calc(440ms + var(--ld, 0ms));
  }

  /* melee — the four source scenes rise in sequence */
  .pulse-case-page figure[data-fade] .pulse-melee-cell { opacity: 0; }
  .pulse-case-page .pulse-melee-cell:nth-child(1) { --cd: 0ms; }
  .pulse-case-page .pulse-melee-cell:nth-child(2) { --cd: 90ms; }
  .pulse-case-page .pulse-melee-cell:nth-child(3) { --cd: 180ms; }
  .pulse-case-page .pulse-melee-cell:nth-child(4) { --cd: 270ms; }
  .pulse-case-page figure[data-fade].is-visible .pulse-melee-cell {
    animation: pAssembleRise 0.68s var(--ease-spring) forwards;
    animation-delay: calc(100ms + var(--cd, 0ms));
  }

  /* part openers — the pulse trace draws left to right on arrival */
  .pulse-case-page header[data-fade] .pulse-part-pulse path {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
  }
  .pulse-case-page header[data-fade].is-visible .pulse-part-pulse path {
    animation: pulseTraceDraw 1.4s var(--ease-silk) forwards;
    animation-delay: 200ms;
  }

  /* operating-loop map — 11 children ride a compressed stagger so the
     whole assembly still lands inside the ~1.1s budget; Signal drops last
     (outside information arrives after the chain exists) */
  .pulse-map .pflow-grid > :nth-child(2) { --pd: 45ms; }
  .pulse-map .pflow-grid > :nth-child(3) { --pd: 90ms; }
  .pulse-map .pflow-grid > :nth-child(4) { --pd: 135ms; }
  .pulse-map .pflow-grid > :nth-child(5) { --pd: 180ms; }
  .pulse-map .pflow-grid > :nth-child(6) { --pd: 225ms; }
  .pulse-map .pflow-grid > :nth-child(7) { --pd: 270ms; }
  .pulse-map .pflow-grid > :nth-child(8) { --pd: 315ms; }
  .pulse-map .pflow-grid > :nth-child(9) { --pd: 360ms; }
  .pulse-case-page figure[data-fade] .pulse-map-signal { opacity: 0; }
  .pulse-case-page figure[data-fade] .pulse-map-fork {
    opacity: 0;
    transform: scaleY(0);
    transform-origin: top;
  }
  .pulse-case-page figure[data-fade].is-visible .pulse-map-signal {
    animation: pAssembleDrop 0.5s var(--ease-spring) forwards;
    animation-delay: 420ms;
  }
  .pulse-case-page figure[data-fade].is-visible .pulse-map-fork {
    animation: pAssembleGrow 0.4s var(--ease-silk) forwards;
    animation-delay: 500ms;
  }

  /* approval + CI chains — cells and links rise left to right */
  .pulse-case-page figure[data-fade] .pulse-chain-cell,
  .pulse-case-page figure[data-fade] .pulse-chain-link { opacity: 0; }
  .pulse-case-page .pulse-chain-row > :nth-child(1) { --nd: 0ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(2) { --nd: 90ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(3) { --nd: 180ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(4) { --nd: 270ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(5) { --nd: 360ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(6) { --nd: 450ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(7) { --nd: 540ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(8) { --nd: 630ms; }
  .pulse-case-page .pulse-chain-row > :nth-child(9) { --nd: 720ms; }
  .pulse-case-page figure[data-fade].is-visible .pulse-chain-cell {
    animation: pAssembleRise 0.6s var(--ease-spring) forwards;
    animation-delay: calc(100ms + var(--nd, 0ms));
  }
  .pulse-case-page figure[data-fade].is-visible .pulse-chain-link {
    animation: pAssembleDrop 0.5s var(--ease-silk) forwards;
    animation-delay: calc(100ms + var(--nd, 0ms));
  }

  /* token sheet — labels wait in place while the six ramp bands draw in
     row by row, then the type scale and the spacing ruler settle */
  .pulse-case-page figure[data-fade] .pulse-spec-chips,
  .pulse-case-page figure[data-fade] .pulse-spec-type-row,
  .pulse-case-page figure[data-fade] .pulse-spec-ruler { opacity: 0; }
  .pulse-case-page figure[data-fade] .pulse-ramp-stops {
    opacity: 0;
    transform: scaleX(0);
    transform-origin: left;
  }
  .pulse-case-page .pulse-ramp-row:nth-child(2) { --rd: 55ms; }
  .pulse-case-page .pulse-ramp-row:nth-child(3) { --rd: 110ms; }
  .pulse-case-page .pulse-ramp-row:nth-child(4) { --rd: 165ms; }
  .pulse-case-page .pulse-ramp-row:nth-child(5) { --rd: 220ms; }
  .pulse-case-page .pulse-ramp-row:nth-child(6) { --rd: 275ms; }
  .pulse-case-page .pulse-spec-type-row:nth-child(2) { --td: 60ms; }
  .pulse-case-page .pulse-spec-type-row:nth-child(3) { --td: 120ms; }
  .pulse-case-page figure[data-fade].is-visible .pulse-spec-chips {
    animation: pAssembleDrop 0.5s var(--ease-spring) forwards;
    animation-delay: 100ms;
  }
  .pulse-case-page figure[data-fade].is-visible .pulse-ramp-stops {
    animation: pAssembleDraw 0.55s var(--ease-silk) forwards;
    animation-delay: calc(160ms + var(--rd, 0ms));
  }
  .pulse-case-page figure[data-fade].is-visible .pulse-spec-type-row {
    animation: pAssembleRise 0.5s var(--ease-spring) forwards;
    animation-delay: calc(500ms + var(--td, 0ms));
  }
  .pulse-case-page figure[data-fade].is-visible .pulse-spec-ruler {
    animation: pAssembleDrop 0.5s var(--ease-silk) forwards;
    animation-delay: 640ms;
  }

  /* kv cards (the generated-UI tells) — rows land one accusation at a time */
  .pulse-case-page figure[data-fade] .pulse-kv-row { opacity: 0; }
  .pulse-case-page .pulse-kv-row:nth-child(2) { --kd: 80ms; }
  .pulse-case-page .pulse-kv-row:nth-child(3) { --kd: 160ms; }
  .pulse-case-page .pulse-kv-row:nth-child(4) { --kd: 240ms; }
  .pulse-case-page figure[data-fade].is-visible .pulse-kv-row {
    animation: pAssembleRise 0.55s var(--ease-spring) forwards;
    animation-delay: calc(120ms + var(--kd, 0ms));
  }
}
`;
