"use client";

import { useEffect } from "react";

// Bottom-pin offset for the About dark→activities cover. The dark band is
// taller than the viewport and its height changes with width, so the sticky
// `top` (= viewport − band height) can't be a static value; this measures it
// into --dark-pin-top (globals fallback covers first paint).
//
// A mount effect, NOT an inline <script>: React never executes script tags
// while client-rendering a route, so an inline version only ran on full page
// loads — navigate here client-side and the band was never measured (owner
// bug report 2026-07-10: About broken after in-site navigation). The effect
// runs on every mount and cleans its listeners up on unmount, which the
// inline script also never did.
export function AboutDarkPin() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".abf-dark");
    if (!el) return;
    // Write the offset through an injected stylesheet rule rather than the
    // element's inline style so React's tree stays clean. offsetHeight is
    // unaffected by the top offset we set — no measure/apply feedback loop.
    const sheet = document.createElement("style");
    document.head.appendChild(sheet);
    const apply = () => {
      if (!window.matchMedia("(min-width: 1080px)").matches) {
        sheet.textContent = "";
        return;
      }
      sheet.textContent = `.abf-dark{--dark-pin-top:${window.innerHeight - el.offsetHeight}px}`;
    };
    apply();
    window.addEventListener("resize", apply, { passive: true });
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(apply) : null;
    ro?.observe(el);
    return () => {
      window.removeEventListener("resize", apply);
      ro?.disconnect();
      sheet.remove();
    };
  }, []);
  return null;
}
