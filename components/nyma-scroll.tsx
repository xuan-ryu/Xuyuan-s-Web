"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { subscribeLenis } from "@/lib/lenis-bus";

// Nyma case page — scroll choreography controller (renders null).
//
// Same contract as pulse-scroll.tsx (the precedent): one client mount, all
// selectors scoped to `.nyma-case-page`, GSAP + ScrollTrigger loaded lazily,
// ScrollTrigger kept in sync with Lenis via the lenis-bus, everything inside
// one gsap.context and reverted on unmount. Enter-once moments run on
// IntersectionObserver (Lenis + ST enter-triggers can fire late/never on
// programmatic jumps); ScrollTrigger is used for true scrubs only.
//
// Progressive-enhancement contract: the SERVER MARKUP IS THE FINAL STATE —
// the thread rail renders fully stitched, the manual stack renders fanned
// open, the workflow loop renders lit, counters render their final numbers.
// Under prefers-reduced-motion this effect bails before importing GSAP and
// the page is simply… finished. With motion, every moment REWINDS its
// targets first and plays them back on scroll.
//
// Moments, in page order (all selectors optional — missing DOM no-ops):
//   [data-stream]      hero band: mono tags typed once on mount
//   [data-hairline]    archival rules draw in (scaleX, once, IO)
//   [data-count]       numerals count up on first enter (once, IO)
//   .ny-thread-fill    the thread stitches down the rail (scrub over .ny-acts)
//   [data-rail] li     running chapter follows the viewport center band (IO)
//   .ny-strip-track    moodboard table: horizontal scrub (≥769px only)
//   .ny-stack          the manual fans open on first enter (class, IO)
//   [data-drift]       plate-wall columns drift vertically (scrub, ≥769px)
//   .ny-pagescroll img the full-length mock scrolls inside its frame (scrub)
//   .ny-loop-node      workflow loop lights in sequence on first enter (IO)
export function NymaScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.querySelector<HTMLElement>(".nyma-case-page");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // motion is actually on: let the CSS clip the strip / pagescroll frames
    // for the GSAP walks. Without this class (no-JS, reduced motion) those
    // surfaces stay natively scrollable so their content is reachable.
    root.classList.add("ny-motion");

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;
    let unsubLenis: (() => void) | null = null;
    let lenisDetach: (() => void) | null = null;
    const timers: number[] = [];
    const observers: IntersectionObserver[] = [];

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      unsubLenis = subscribeLenis((lenis) => {
        lenisDetach?.();
        lenisDetach = null;
        if (lenis) {
          lenis.on("scroll", ScrollTrigger.update);
          lenisDetach = () => lenis.off("scroll", ScrollTrigger.update);
        }
      });

      ctx = gsap.context(() => {
        // ── navscrim: off while a dark band (hero, Turn) sits under the
        //    nav — parchment fog over ink read as a defect ──
        {
          const scrim = root.querySelector<HTMLElement>(".ny-navscrim");
          const darks = root.querySelectorAll<HTMLElement>(
            ".ny-hero-band, .ny-turn",
          );
          if (scrim && darks.length) {
            const overlapping = new Set<Element>();
            const io = new IntersectionObserver(
              (entries) => {
                entries.forEach((e) => {
                  if (e.isIntersecting) overlapping.add(e.target);
                  else overlapping.delete(e.target);
                });
                scrim.classList.toggle("is-on", overlapping.size === 0);
              },
              { rootMargin: "0px 0px -91% 0px", threshold: 0 },
            );
            darks.forEach((d) => io.observe(d));
            observers.push(io);
          }
        }
        // ── hero: mono tags typed once ──
        root.querySelectorAll<HTMLElement>("[data-stream]").forEach((el) => {
          const full = el.dataset.stream ?? el.textContent ?? "";
          const state = { n: 0 };
          el.textContent = "";
          gsap.to(state, {
            n: full.length,
            duration: Math.min(2.8, full.length * 0.05),
            ease: "none",
            delay: 0.6,
            onUpdate: () => {
              el.textContent = full.slice(0, Math.round(state.n));
            },
          });
        });

        // ── archival hairlines draw in (once, IO) ──
        {
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target as HTMLElement;
                io.unobserve(el);
                gsap.to(el, {
                  scaleX: 1,
                  duration: 1.1,
                  ease: "power3.inOut",
                });
              });
            },
            { rootMargin: "0px 0px -10% 0px" },
          );
          root.querySelectorAll<HTMLElement>("[data-hairline]").forEach((el) => {
            gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
            io.observe(el);
          });
          observers.push(io);
        }

        // ── numerals count up (once, IO) ──
        {
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target as HTMLElement;
                io.unobserve(el);
                const to = Number(el.dataset.count ?? "0");
                if (!Number.isFinite(to) || to <= 0) return;
                const state = { n: 0 };
                gsap.to(state, {
                  n: to,
                  duration: 1.4,
                  ease: "power3.out",
                  onUpdate: () => {
                    el.textContent = String(Math.round(state.n));
                  },
                });
              });
            },
            { rootMargin: "0px 0px -10% 0px" },
          );
          root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
            const to = Number(el.dataset.count ?? "0");
            if (!Number.isFinite(to) || to <= 0) return;
            el.textContent = "0";
            io.observe(el);
          });
          observers.push(io);
        }

        // ── the thread stitches down the rail as the acts pass ──
        {
          const fill = root.querySelector<HTMLElement>(".ny-thread-fill");
          const acts = root.querySelector<HTMLElement>(".ny-acts");
          if (fill && acts) {
            gsap.fromTo(
              fill,
              { scaleY: 0, transformOrigin: "top center" },
              {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: acts,
                  start: "top 60%",
                  end: "bottom 80%",
                  scrub: 0.8,
                },
              },
            );
          }
        }

        // ── rail: the chapter crossing the viewport center is running ──
        {
          const rail = root.querySelector<HTMLElement>("[data-rail]");
          const chapters = Array.from(
            root.querySelectorAll<HTMLElement>("[data-act]"),
          );
          if (rail && chapters.length) {
            const items = Array.from(rail.querySelectorAll<HTMLElement>("li"));
            const setActive = (idx: number) => {
              items.forEach((li, i) => {
                li.classList.toggle("is-done", i < idx);
                li.classList.toggle("is-run", i === idx);
              });
            };
            setActive(0);
            const active = new Set<number>();
            const io = new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  const idx = Number(
                    (entry.target as HTMLElement).dataset.act ?? "0",
                  );
                  if (entry.isIntersecting) active.add(idx);
                  else active.delete(idx);
                });
                if (active.size) setActive(Math.max(...active));
              },
              { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
            );
            chapters.forEach((ch) => io.observe(ch));
            observers.push(io);
          }
        }

        // ── moodboard table: horizontal scrub (desktop; touch gets native
        //    overflow scroll via CSS) ──
        const mm = gsap.matchMedia();
        mm.add("(min-width: 769px)", () => {
          root.querySelectorAll<HTMLElement>(".ny-strip").forEach((strip) => {
            const track = strip.querySelector<HTMLElement>(".ny-strip-track");
            if (!track) return;
            gsap.fromTo(
              track,
              { x: 0 },
              {
                x: () => -Math.max(0, track.scrollWidth - strip.clientWidth),
                ease: "none",
                scrollTrigger: {
                  trigger: strip,
                  start: "top 78%",
                  end: "bottom 6%",
                  scrub: 1,
                  invalidateOnRefresh: true,
                },
              },
            );
          });

          // plate-wall columns drift at opposing speeds
          root.querySelectorAll<HTMLElement>("[data-drift]").forEach((col) => {
            const dir = Number(col.dataset.drift ?? "1") || 1;
            gsap.fromTo(
              col,
              { yPercent: dir * 3.2 },
              {
                yPercent: dir * -3.2,
                ease: "none",
                scrollTrigger: {
                  trigger: col.parentElement ?? col,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
          });
        });

        // ── the full-length mock scrolls inside its frame ──
        root
          .querySelectorAll<HTMLElement>(".ny-pagescroll-frame")
          .forEach((frame) => {
            const img = frame.querySelector<HTMLElement>("img");
            if (!img) return;
            gsap.fromTo(
              img,
              { y: 0 },
              {
                y: () => -Math.max(0, img.offsetHeight - frame.clientHeight),
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top 78%",
                  end: "bottom -60%",
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              },
            );
          });

        // ── the manual fans open on first enter (server renders it open) ──
        {
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target as HTMLElement;
                io.unobserve(el);
                el.classList.add("is-open");
              });
            },
            { rootMargin: "0px 0px -18% 0px" },
          );
          root.querySelectorAll<HTMLElement>(".ny-stack").forEach((el) => {
            el.classList.remove("is-open");
            io.observe(el);
          });
          observers.push(io);
        }

        // ── workflow loop lights in sequence (server renders it lit) ──
        {
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const loop = entry.target as HTMLElement;
                io.unobserve(loop);
                loop
                  .querySelectorAll<HTMLElement>(".ny-loop-node")
                  .forEach((node, i) => {
                    timers.push(
                      window.setTimeout(
                        () => node.classList.add("is-on"),
                        420 * i,
                      ),
                    );
                  });
              });
            },
            { rootMargin: "0px 0px -16% 0px" },
          );
          root.querySelectorAll<HTMLElement>(".ny-loop").forEach((loop) => {
            const nodes = loop.querySelectorAll<HTMLElement>(".ny-loop-node");
            if (!nodes.length) return;
            nodes.forEach((n) => n.classList.remove("is-on"));
            io.observe(loop);
          });
          observers.push(io);
        }
      }, root);

      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      root.classList.remove("ny-motion");
      timers.forEach((t) => window.clearTimeout(t));
      observers.forEach((io) => io.disconnect());
      lenisDetach?.();
      unsubLenis?.();
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
