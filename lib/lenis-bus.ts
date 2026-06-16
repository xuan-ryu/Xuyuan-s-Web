import type Lenis from "lenis";

// Tiny shared handle to the single Lenis instance created by <SmoothScroll>.
// Scroll-pinned components (e.g. the hero's moon card) need to apply their
// counter-transform inside Lenis's OWN scroll emission — Lenis updates scroll
// inside its rAF and emits 'scroll' synchronously right after, so a transform
// computed there lands in the same frame the page paints. The DOM 'scroll'
// event, by contrast, fires before Lenis's rAF each frame and is therefore one
// frame stale, which makes JS-pinned elements jitter under smooth scroll.
//
// A bus (rather than a direct import) decouples mount order: subscribers get
// the instance immediately if it already exists, or as soon as it appears.

type Listener = (lenis: Lenis | null) => void;

let current: Lenis | null = null;
const listeners = new Set<Listener>();

export function setLenis(lenis: Lenis | null) {
  current = lenis;
  for (const fn of listeners) fn(lenis);
}

export function subscribeLenis(fn: Listener): () => void {
  listeners.add(fn);
  fn(current);
  return () => {
    listeners.delete(fn);
  };
}
