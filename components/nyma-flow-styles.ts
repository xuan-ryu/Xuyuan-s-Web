// Nyma case page — scoped CSS for the onboarding flow strip (L0 string;
// markup in nyma-flow-screens.tsx), plus the shared strip grab-control and
// the Pl.17 pedestal. Appended to the layout's injected <style> at the
// stripCssComments seam — the layout's own literal is a frozen giant, so
// new blocks live beside it, not inside it. In-screen values reproduce the
// shipped 390×844 mocks at 340px and are exempt from the even-px rule
// where the repro demands it.

export const nymaFlowCss = `
/* ── Pl.16 · onboarding flow strip (markup in nyma-flow-screens.tsx) ── */
.nyf {
  overflow-x: auto;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}
.nyf:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}
.nyf-track {
  display: flex;
  align-items: flex-start;
  gap: 28px;
  width: max-content;
  padding: 2px 2px 14px;
}
.nyf-item {
  flex: none;
  display: grid;
  gap: 10px;
}
.nyf-label {
  font-family: var(--ny-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--ny-text-4);
}
/* neutral shell — the Pl.17 shell, sized for the strip */
.nyf-shell {
  box-sizing: border-box;
  width: 340px;
  padding: 10px;
  border: 2px solid var(--ny-ink);
  border-radius: 44px;
  background: var(--ny-canvas);
  box-shadow: var(--ny-shadow-rest);
}
.nyf-screen {
  --nyf-ink: #111111;
  --nyf-grey: #8a8a8a;
  --nyf-line: #e4e4e4;
  position: relative;
  display: flex;
  flex-direction: column;
  aspect-ratio: 390 / 844;
  border: 1px solid var(--nyf-line);
  border-radius: 34px;
  overflow: clip;
  background: #ffffff;
  color: var(--nyf-ink);
  font-family: var(--ny-display);
}
.nyf-screen.is-dark {
  background: var(--nyf-ink);
  border-color: var(--nyf-ink);
  color: #ffffff;
}
.nyf-status {
  display: flex;
  justify-content: space-between;
  padding: 14px 24px 6px;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
}
/* splash — wordmark centered on ink */
.nyf-splash {
  flex: 1;
  min-height: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 16px;
  text-align: center;
}
.nyf-splash strong {
  font-size: 26px;
  font-weight: 400;
  letter-spacing: 0.28em;
  text-indent: 0.28em;
}
.nyf-splash span {
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.64);
}
.nyf-est {
  padding-bottom: 28px;
  text-align: center;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.24em;
  color: rgba(255, 255, 255, 0.5);
}
/* welcome — the shipped photograph, then the action deck */
.nyf-photo {
  position: relative;
  flex: 1;
  min-height: 0;
  background: var(--nyf-ink);
}
.nyf-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 100%;
}
.nyf-deck {
  display: grid;
  gap: 12px;
  padding: 16px 20px 10px;
}
.nyf-btnrow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.nyf-btn-solid,
.nyf-btn-line {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 12px;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  white-space: nowrap;
}
.nyf-btn-solid {
  background: var(--nyf-ink);
  color: #ffffff;
}
.nyf-btn-line {
  border: 1px solid var(--nyf-ink);
  color: var(--nyf-ink);
}
.nyf-or {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  white-space: nowrap;
  color: var(--nyf-grey);
}
.nyf-or i {
  height: 1px;
  background: var(--nyf-line);
}
.nyf-social {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.nyf-social span {
  display: grid;
  place-items: center;
  width: 54px;
  height: 36px;
  background: var(--nyf-ink);
  color: #ffffff;
}
.nyf-legal {
  text-align: center;
  font-size: 10px;
  line-height: 1.5;
  letter-spacing: 0.02em;
  color: var(--nyf-grey);
}
.nyf-homebar {
  justify-self: center;
  width: 116px;
  height: 4px;
  margin-top: 4px;
  border-radius: 999px;
  background: var(--nyf-ink);
  opacity: 0.8;
}
/* register / sign-in — head, hairline fields, checks, deck foot */
.nyf-head {
  display: grid;
  grid-template-columns: 20px 1fr 20px;
  align-items: center;
  padding: 12px 24px 14px;
}
.nyf-head svg {
  display: block;
}
.nyf-head-title {
  text-align: center;
  font-family: var(--ny-mono);
  font-size: 12px;
  letter-spacing: 0.24em;
  text-indent: 0.24em;
}
.nyf-form {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px 20px;
}
.nyf-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--nyf-line);
  padding: 12px 14px;
  font-size: 12px;
  color: var(--nyf-grey);
}
.nyf-field em {
  font-style: normal;
  font-family: var(--ny-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--nyf-ink);
}
.nyf-checks {
  display: grid;
  gap: 10px;
  padding-top: 2px;
}
.nyf-check {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}
.nyf-check i {
  flex: none;
  display: grid;
  place-items: center;
  width: 14px;
  height: 14px;
  border: 1px solid var(--nyf-ink);
}
.nyf-check i.is-on {
  background: var(--nyf-ink);
}
.nyf-check i.is-on::after {
  content: "\\2713";
  color: #ffffff;
  font-size: 10px;
  line-height: 1;
}
.nyf-forgot {
  text-align: right;
  font-size: 12px;
}
.nyf-forgot u,
.nyf-legal u {
  text-underline-offset: 2px;
}
.nyf-form-foot {
  margin-top: auto;
  display: grid;
  gap: 10px;
}
/* ── shared strip control — the walks drive scrollLeft, so the hand can
   always take over; the grab cursor arms only once motion is on ── */
.ny-motion .ny-strip, .ny-motion .nyf { cursor: grab; }
.ny-strip.is-grabbing, .nyf.is-grabbing { cursor: grabbing; user-select: none; }
.ny-strip img, .nyf img { -webkit-user-drag: none; }
/* ── Pl.17 · the interactive prototype on its own centered pedestal ── */
.ny-proto-solo { display: grid; justify-items: center; }
.ny-proto-solo .nyp-foot { width: min(100%, 560px); }
`;
