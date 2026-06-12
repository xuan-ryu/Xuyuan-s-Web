"use client";

import { useEffect } from "react";

// Scroll-appear entrances for text blocks (ported from the live Framer
// appear effects: rise + fade once the element enters the viewport).
export function RevealFx() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".fx-rise, .fx-rise-big"),
    );
    if (els.length === 0) return;
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      els.forEach((el) => el.classList.add("fx-revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("fx-revealed");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.2 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
