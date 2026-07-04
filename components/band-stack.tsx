"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Scroll-driven page-turn for a stack of theme bands (the ink/paper rhythm on
// the case pages). Generalizes the About page's single sticky sheet into a
// deck: each band pins by its BOTTOM edge, so the whole band reads as you
// scroll, then holds still while the next band slides up over it — a rounded
// sheet lifting over the one below (the look lives in CSS; this only supplies
// the measured pin offset and the rising z-index).
//
// Why bottom-pin, not top:0 — these bands are several viewports tall; a top
// pin would freeze a band's header and hide the rest. Bottom-pin = top of
// (viewport − bandHeight), so a tall band scrolls through fully and only holds
// at its end. Heights reflow (viz, images, fonts), so they're measured live.
// prefers-reduced-motion opts out entirely — bands stay in normal flow.
export function BandStack({ selector }: { selector: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bands = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (bands.length < 2) return;

    const measure = () => {
      const vh = window.innerHeight;
      bands.forEach((band, i) => {
        band.style.setProperty("--vb-z", String(i + 1));
        // clamp <= 0: a band taller than the viewport pins its bottom; a band
        // shorter than the viewport just pins at the top (offset 0).
        band.style.setProperty(
          "--vb-top",
          `${Math.min(0, vh - band.offsetHeight)}px`,
        );
        band.classList.add("is-stacked");
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    bands.forEach((band) => ro.observe(band));
    window.addEventListener("resize", measure);
    // re-measure once media/fonts settle and change the band heights
    const timers = [300, 900, 1800].map((d) => window.setTimeout(measure, d));

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      timers.forEach((t) => clearTimeout(t));
      bands.forEach((band) => {
        band.classList.remove("is-stacked");
        band.style.removeProperty("--vb-z");
        band.style.removeProperty("--vb-top");
      });
    };
  }, [pathname, selector]);

  return null;
}
