"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const D6NZ =
  "/media/home/roof-piece-a.png";
const ABW =
  "/media/home/roof-piece-b.png";

// Live composition: two roof artworks, each rendered twice. The pieces drift
// as you scroll — the upper pair slides right (+0.0317 px per scrolled px),
// the lower pair left, everything sinking slightly (+0.011) — measured on the
// live site at 1536x750 (scripts/probe-scroll.mjs round). Transform is zero
// when the section's center crosses the viewport center; the CSS `left`/`top`
// values hold the live mid-view geometry.
const PIECES = [
  { src: D6NZ, cls: "roof-a", w: 1928, h: 1076, dir: 1 },
  { src: ABW, cls: "roof-b", w: 1928, h: 1076, dir: 1 },
  { src: D6NZ, cls: "roof-c", w: 1903, h: 1062, dir: -1 },
  { src: ABW, cls: "roof-d", w: 1902, h: 1062, dir: -1 },
] as const;

const clampF = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

export function RoofTransition() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth <= 740) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = section.getBoundingClientRect();
      // px scrolled past the point where the section center hits viewport center
      const offset = vh / 2 - (r.top + r.height / 2);
      // "House rises" surge: as the eaves climb into view, give them an eased
      // upward boost ON TOP of the measured drift, so the architecture appears
      // to accelerate up to meet the pinned moon instead of the moon merely
      // setting. Monotonic (never dips back) so the moon stays occluded once
      // swallowed; bounded inside this overflow:hidden section so no gap opens
      // below. p: 0 while the section is still low, →1 as it passes center.
      const p = clampF((offset + vh * 0.45) / (vh * 0.9), 0, 1);
      const surge = -(vh * 0.11) * (1 - Math.pow(1 - p, 3)); // easeOutCubic
      for (let i = 0; i < PIECES.length; i++) {
        const el = imgRefs.current[i];
        if (!el) continue;
        const tx = PIECES[i].dir * 0.0317 * offset;
        const ty = 0.011 * offset + surge;
        el.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
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

  return (
    <section
      ref={sectionRef}
      className="home-roof-transition"
      aria-hidden="true"
    >
      {PIECES.map((p, i) => (
        <Image
          key={i}
          ref={(el) => {
            imgRefs.current[i] = el;
          }}
          src={p.src}
          alt=""
          width={p.w}
          height={p.h}
          className={`roof ${p.cls}`}
          unoptimized
        />
      ))}
    </section>
  );
}
