"use client";

import { useEffect } from "react";

// Live How-I-Work decor drift (measured at 1440x1000): the black screen and
// gold screen slide right ~0.042px per scrolled px, the bamboo screen slides
// left ~0.054. Vase, lotus, dark screen, and brushes stay static. Zero when
// the section center crosses the viewport center.
const TARGETS: [string, number][] = [
  [".how-screen", 0.042],
  [".how-gold-screen", 0.042],
  [".how-bamboo-screen", -0.054],
];

export function HowDecorParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth <= 740) return;
    const section = document.querySelector<HTMLElement>(".home-how");
    if (!section) return;
    const els = TARGETS.map(([sel, rate]) => ({
      el: document.querySelector<HTMLElement>(sel),
      rate,
    }));

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const offset = window.innerHeight / 2 - (r.top + r.height / 2);
      for (const { el, rate } of els) {
        if (el) el.style.transform = `translateX(${(rate * offset).toFixed(1)}px)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
