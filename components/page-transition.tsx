"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

gsap.registerPlugin(CustomEase);
CustomEase.create("silk", "0.16,1,0.3,1");

// Ink-curtain route transition, ported from the live site: the veil rises
// to cover (outgoing page rides up and dims), the route swaps under full
// black, then the veil lifts away bottom-to-top while the incoming page
// rises into place. Transform-only — compositor-safe.
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const veilRef = useRef<HTMLDivElement | null>(null);
  const coveredRef = useRef(false);
  const busyRef = useRef(false);
  const revealingRef = useRef(false);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // single reveal path, shared by the pathname effect and the watchdog —
  // safe to call twice (revealingRef guards)
  const playReveal = useCallback(() => {
    const veil = veilRef.current;
    if (!veil || revealingRef.current) return;
    revealingRef.current = true;
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
    // <main> persists across routes (it lives in the layout) — drop the
    // outgoing slide/dim while still under full black
    gsap.set("main", { clearProps: "transform,opacity" });
    const tl = gsap.timeline({
      onComplete: () => {
        coveredRef.current = false;
        busyRef.current = false;
        revealingRef.current = false;
        veil.style.pointerEvents = "none";
        gsap.set(veil, { y: 0, yPercent: 100 });
        window.dispatchEvent(new Event("xuyuan:nav-resample"));
      },
    });
    // full black lifts away bottom-to-top, the lower soft edge sweeping
    // up, while the incoming page rises into place underneath
    tl.to(veil, { yPercent: -100, duration: 0.75, ease: "silk" }, 0).fromTo(
      "main",
      { y: 70, opacity: 0.85 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "silk",
        clearProps: "transform,opacity",
      },
      0.02,
    );
  }, []);

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
      // mid-transition clicks must not fall through to an instant Next
      // navigation — that desyncs the curtain state machine for good
      if (busyRef.current) {
        e.preventDefault();
        return;
      }
      const url = new URL(href, location.href);
      if (url.pathname === location.pathname) {
        if (!url.hash) e.preventDefault();
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return; // plain navigation
      const veil = veilRef.current;
      if (!veil) return;
      e.preventDefault();
      busyRef.current = true;
      revealingRef.current = false;
      veil.style.pointerEvents = "auto";

      const tl = gsap.timeline({
        onComplete: () => {
          coveredRef.current = true;
          router.push(url.pathname + url.search + url.hash);
          // failsafe: if the route never paints (or the pathname effect is
          // skipped), lift the curtain anyway instead of trapping the page
          watchdogRef.current = setTimeout(() => {
            if (coveredRef.current) playReveal();
          }, 1800);
        },
      });
      // the ink sweeps up, its soft gradient edge leading.
      // y:0 is load-bearing: GSAP parses the stylesheet's translateY(100%)
      // from the computed matrix as a PIXEL y — left alone, it offsets the
      // whole tween by one veil-height and the cover never reaches the screen
      tl.fromTo(
        veil,
        { y: 0, yPercent: 100 },
        { yPercent: 0, duration: 0.55, ease: "power2.inOut" },
        0,
      );
      // the outgoing page rides up with the curtain and dims (live does the
      // same). Only near the top: a transform on <main> re-roots the hero's
      // fixed canvas by scrollY — at scroll≈0 that displacement is zero.
      if (window.scrollY < 8) {
        tl.to(
          "main",
          { y: -90, opacity: 0.78, duration: 0.55, ease: "power2.inOut" },
          0,
        );
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, playReveal]);

  // reveal once the new route has painted AND the main thread has gone
  // quiet — heavy pages (WebGL hero, koi canvas) throw long hydration
  // tasks right after mount that would make the veil skip frames
  useEffect(() => {
    if (!coveredRef.current) return;
    let cancelled = false;
    let idleId = 0;
    let raf2 = 0;
    const go = () => {
      if (!cancelled) playReveal();
    };
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (typeof window.requestIdleCallback === "function") {
          idleId = window.requestIdleCallback(go, { timeout: 600 });
        } else {
          idleId = window.setTimeout(go, 280) as unknown as number;
        }
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
    };
  }, [pathname, playReveal]);

  return (
    <div
      ref={veilRef}
      data-nav-sample-ignore=""
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: "-60vh",
        height: "220vh",
        // soft edges on BOTH ends: the top edge leads the rising cover, the
        // bottom edge leads the upward reveal; the solid middle (132vh)
        // holds the viewport fully black at rest
        background:
          "linear-gradient(to top, transparent 0%, var(--ink-950, #050505) 20%, var(--ink-950, #050505) 80%, transparent 100%)",
        transform: "translateY(100%)",
        zIndex: 9998,
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}
