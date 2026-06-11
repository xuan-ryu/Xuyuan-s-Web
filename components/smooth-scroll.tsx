"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// The original Framer site ships Lenis smooth scrolling — the inertia is a
// big part of how the scroll choreography feels. Same defaults here.
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // native momentum scrolling is fine on touch devices (Lenis default
    // leaves touch alone, matching the live site)
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // jump to top on route change like a fresh page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
