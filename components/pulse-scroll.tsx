"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { subscribeScrollFrame } from "@/lib/scroll-behavior";

// Pulse case page — scroll choreography controller (renders null).
//
// One client mount drives every scripted moment on the page via selectors
// scoped to `.pulse-case-page`; the layout itself stays a server component.
// GSAP + ScrollTrigger load lazily inside the effect (featured-gate
// precedent) and ScrollTrigger is kept in sync through Scroll Behaviour's
// same-frame subscription (the DOM event is stale under smooth scroll).
// Everything is created inside one gsap.context and reverted
// on unmount — triggers, tweens, and inline styles all clean up.
//
// Progressive-enhancement contract (reduced-motion + no-JS correctness):
// the SERVER MARKUP IS THE FINAL STATE. Counters render their final number,
// the ladder renders lit, the monolith renders split, ticker chips render in
// place. Under `prefers-reduced-motion: reduce` this effect bails before
// importing GSAP and the page is simply… finished. When motion is allowed,
// every moment REWINDS its targets first (gsap.set / class removal) and
// plays them back on scroll — so nothing is ever hidden for a reader the
// animation never reaches.
//
// Moments, in page order (all selectors, all optional — missing DOM no-ops):
//   [data-count]         numerals count up from 0 on first enter (once)
//   .pulse-monolith-fig  scrubbed: line-counter races to 10,180 while the
//                        file bar grows; folder chips land as it splits
//   .pulse-ticker-row    commit stream: scrubbed horizontal drift
//   [data-rail]          the case-map rail tracks the running act
export function PulseScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.querySelector<HTMLElement>(".pulse-case-page");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;
    let unsubscribeScroll: (() => void) | null = null;
    // Enter-once moments run on IntersectionObserver, NOT ScrollTrigger:
    // under Lenis, ST enter-triggers can fire late/never on programmatic
    // jumps (the same landmine gsap-reveal.tsx documents). ST stays for
    // true scrubs only.
    const observers: IntersectionObserver[] = [];

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      unsubscribeScroll = subscribeScrollFrame(ScrollTrigger.update);

      ctx = gsap.context(() => {

        // ── numerals: count up from 0 on first enter (once, IO-driven) ──
        {
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target as HTMLElement;
                io.unobserve(el);
                const to = Number(el.dataset.count ?? "0");
                if (!Number.isFinite(to) || to <= 0) return;
                const comma = el.dataset.countFormat === "comma";
                const state = { n: 0 };
                gsap.to(state, {
                  n: to,
                  duration: 1.6,
                  ease: "power3.out",
                  onUpdate: () => {
                    const v = Math.round(state.n);
                    el.textContent = comma
                      ? v.toLocaleString("en-US")
                      : String(v);
                  },
                });
              });
            },
            // no bottom dead-band here: at 1280×720 the hero counters sit
            // inside a -10% margin and read 0/0/0 until a ~140px scroll —
            // a counter may start the moment its first pixel is visible
            { rootMargin: "0px" },
          );
          root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
            const to = Number(el.dataset.count ?? "0");
            if (!Number.isFinite(to) || to <= 0) return;
            el.textContent = "0";
            io.observe(el);
          });
          observers.push(io);
        }

        // ── the monolith splits (act 04): scrubbed counter + bar + chips ──
        root
          .querySelectorAll<HTMLElement>(".pulse-monolith-fig")
          .forEach((fig) => {
            const counter = fig.querySelector<HTMLElement>(
              ".pulse-monolith-count",
            );
            const bar = fig.querySelector<HTMLElement>(".pulse-monolith-bar");
            const chips = fig.querySelectorAll<HTMLElement>(
              ".pulse-monolith-chip",
            );
            const peak = Number(counter?.dataset.peak ?? "10180");
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: fig,
                start: "top 82%",
                end: "top 34%",
                scrub: 0.6,
              },
            });
            if (bar) tl.fromTo(bar, { scaleY: 0.24 }, { scaleY: 1, duration: 0.55 }, 0);
            if (counter) {
              const state = { n: 0 };
              counter.textContent = "0";
              tl.to(
                state,
                {
                  n: peak,
                  duration: 0.55,
                  onUpdate: () => {
                    counter.textContent = Math.round(state.n).toLocaleString(
                      "en-US",
                    );
                  },
                },
                0,
              );
            }
            if (chips.length) {
              tl.fromTo(
                chips,
                { opacity: 0, y: 10 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.3,
                  stagger: 0.05,
                  ease: "power2.out",
                },
                0.6,
              );
            }
          });


        // ── commit stream (act 05): scrubbed horizontal drift ──
        root
          .querySelectorAll<HTMLElement>(".pulse-ticker-row")
          .forEach((rowEl, i) => {
            const dir = i % 2 === 0 ? -1 : 1;
            gsap.fromTo(
              rowEl,
              { xPercent: dir * 6 },
              {
                xPercent: dir * -6,
                ease: "none",
                scrollTrigger: {
                  trigger: rowEl,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
          });

        // ── run-log rail: ONE spine; server markup is the finished run
        //    (all ✓). With motion, rewind and drive done/running from the
        //    chapter positions. ──
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
          // IO with a thin viewport-center band: the chapter crossing the
          // center line is the running act (reliable under Lenis jumps,
          // unlike ST enter-triggers).
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

      }, root);

      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      observers.forEach((io) => io.disconnect());
      unsubscribeScroll?.();
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
