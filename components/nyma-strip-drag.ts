// Nyma case page — mouse grab-drag panning for the horizontal strips
// (moodboard table, onboarding flow). L1 helper for nyma-scroll.tsx: the
// walks there scrub the SAME scrollLeft axis, so drag and scrub never
// fight — a still page keeps the strip where the hand left it. Touch pans
// natively. Returns one disposer covering every attached strip.

export function attachStripDrag(root: HTMLElement): () => void {
  const disposers: (() => void)[] = [];
  root.querySelectorAll<HTMLElement>(".ny-strip, .nyf").forEach((strip) => {
    let lastX = 0;
    let dragging = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      lastX = e.clientX;
      strip.classList.add("is-grabbing");
      strip.setPointerCapture(e.pointerId);
      e.preventDefault(); // no text selection / native image drag
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      strip.scrollLeft -= e.clientX - lastX;
      lastX = e.clientX;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      strip.classList.remove("is-grabbing");
      if (strip.hasPointerCapture(e.pointerId)) {
        strip.releasePointerCapture(e.pointerId);
      }
    };
    const noDrag = (e: Event) => e.preventDefault();
    strip.addEventListener("pointerdown", down);
    strip.addEventListener("pointermove", move);
    strip.addEventListener("pointerup", up);
    strip.addEventListener("pointercancel", up);
    strip.addEventListener("dragstart", noDrag);
    disposers.push(() => {
      strip.removeEventListener("pointerdown", down);
      strip.removeEventListener("pointermove", move);
      strip.removeEventListener("pointerup", up);
      strip.removeEventListener("pointercancel", up);
      strip.removeEventListener("dragstart", noDrag);
      strip.classList.remove("is-grabbing");
    });
  });
  return () => disposers.forEach((d) => d());
}
