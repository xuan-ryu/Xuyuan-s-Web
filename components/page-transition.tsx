"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

gsap.registerPlugin(CustomEase);
CustomEase.create("silk", "0.16,1,0.3,1");

// Black-curtain route transition, ported from the live Framer site: the
// veil accelerates up from the bottom, holds while the new route paints
// underneath, then continues up and off. Covers the nav, like live.
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const veilRef = useRef<HTMLDivElement | null>(null);
  const coveredRef = useRef(false);
  const busyRef = useRef(false);

  // intercept same-origin link clicks and run the cover phase first
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = (e.target as Element)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (a.target && a.target !== "_self") return;
      const url = new URL(href, location.href);
      if (url.pathname === location.pathname) {
        // same-page anchors keep default behavior; self-links do nothing
        if (!url.hash) e.preventDefault();
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return; // plain navigation
      const veil = veilRef.current;
      if (!veil || busyRef.current) return;
      e.preventDefault();
      busyRef.current = true;
      veil.style.pointerEvents = "auto";
      gsap.fromTo(
        veil,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.5,
          ease: "power3.in",
          onComplete: () => {
            coveredRef.current = true;
            router.push(url.pathname + url.search + url.hash);
          },
        },
      );
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // reveal once the new route has painted under the veil
  useEffect(() => {
    if (!coveredRef.current) return;
    const veil = veilRef.current;
    if (!veil) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        gsap.to(veil, {
          yPercent: -100,
          duration: 0.65,
          ease: "silk",
          delay: 0.12,
          onComplete: () => {
            coveredRef.current = false;
            busyRef.current = false;
            veil.style.pointerEvents = "none";
            gsap.set(veil, { yPercent: 100 });
          },
        });
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [pathname]);

  return (
    <div
      ref={veilRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--ink-950, #050505)",
        transform: "translateY(100%)",
        zIndex: 9998,
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}
