"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const D6NZ =
  "/assets/framerusercontent.com/images/D6Nz1N21z7DIjWae8R8LFGCY.png";
const ABW =
  "/assets/framerusercontent.com/images/6abw1vzYpd5VHb7WZncQkASt2ag.png";

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
      const r = section.getBoundingClientRect();
      // px scrolled past the point where the section center hits viewport center
      const offset = window.innerHeight / 2 - (r.top + r.height / 2);
      for (let i = 0; i < PIECES.length; i++) {
        const el = imgRefs.current[i];
        if (!el) continue;
        const tx = PIECES[i].dir * 0.0317 * offset;
        const ty = 0.011 * offset;
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
