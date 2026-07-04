"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { subscribeLenis } from "@/lib/lenis-bus";

// Pulse case page — scroll choreography controller (renders null).
//
// One client mount drives every scripted moment on the page via selectors
// scoped to `.pulse-case-page`; the layout itself stays a server component.
// GSAP + ScrollTrigger load lazily inside the effect (featured-gate
// precedent) and ScrollTrigger is kept in sync with Lenis's own scroll
// emission via the lenis-bus (the DOM scroll event is one frame stale under
// smooth scroll). Everything is created inside one gsap.context and reverted
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
//   [data-stream]        hero console: typewriter line, once on mount
//   [data-cycle]         hero console: status pill steps the generation
//                        ladder once (queued → … → ready), then rests
//   [data-count]         numerals count up from 0 on first enter (once)
//   .pulse-monolith-fig  scrubbed: line-counter races to 10,180 while the
//                        file bar grows; folder chips land as it splits
//   .pulse-ladder        status pills light in sequence on first enter
//   .pulse-ticker-row    commit stream: scrubbed horizontal drift
//   .pulse-inv-cell      inventory: batched rise-in, tiny stagger
export function PulseScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.querySelector<HTMLElement>(".pulse-case-page");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;
    let unsubLenis: (() => void) | null = null;
    let lenisDetach: (() => void) | null = null;
    const timers: number[] = [];

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
        // ── hero console: typewriter stream (once, then the caret holds) ──
        root.querySelectorAll<HTMLElement>("[data-stream]").forEach((el) => {
          const full = el.dataset.stream ?? el.textContent ?? "";
          const state = { n: 0 };
          el.textContent = "";
          gsap.to(state, {
            n: full.length,
            duration: Math.min(2.6, full.length * 0.045),
            ease: "none",
            delay: 0.5,
            onUpdate: () => {
              el.textContent = full.slice(0, Math.round(state.n));
            },
          });
        });

        // ── hero console: the status pill steps the generation ladder ──
        root.querySelectorAll<HTMLElement>("[data-cycle]").forEach((el) => {
          const steps = (el.dataset.cycle ?? "").split("|").filter(Boolean);
          if (steps.length < 2) return;
          const rest = el.textContent ?? steps[steps.length - 1];
          const restState = el.dataset.state ?? "";
          let i = 0;
          const step = () => {
            if (i < steps.length) {
              const [state, label] = steps[i].split(":");
              el.dataset.state = state;
              el.textContent = label ?? state;
              i += 1;
              timers.push(window.setTimeout(step, 1200));
            } else {
              el.dataset.state = restState;
              el.textContent = rest;
            }
          };
          timers.push(window.setTimeout(step, 700));
        });

        // ── numerals: count up from 0 on first enter ──
        root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const to = Number(el.dataset.count ?? "0");
          if (!Number.isFinite(to) || to <= 0) return;
          const comma = el.dataset.countFormat === "comma";
          const state = { n: to };
          const render = () => {
            const v = Math.round(state.n);
            el.textContent = comma ? v.toLocaleString("en-US") : String(v);
          };
          state.n = 0;
          render();
          gsap.to(state, {
            n: to,
            duration: 1.6,
            ease: "power3.out",
            onUpdate: render,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

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

        // ── generation ladder (act 03): pills light in sequence, once ──
        root.querySelectorAll<HTMLElement>(".pulse-ladder").forEach((row) => {
          const pills = Array.from(
            row.querySelectorAll<HTMLElement>(".pulse-ladder-pill"),
          );
          if (!pills.length) return;
          pills.forEach((p) => p.classList.remove("is-on"));
          ScrollTrigger.create({
            trigger: row,
            start: "top 80%",
            once: true,
            onEnter: () => {
              pills.forEach((p, i) => {
                timers.push(
                  window.setTimeout(() => p.classList.add("is-on"), 360 * i),
                );
              });
            },
          });
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
          chapters.forEach((ch) => {
            const idx = Number(ch.dataset.act ?? "0");
            ScrollTrigger.create({
              trigger: ch,
              start: "top 55%",
              end: "bottom 55%",
              onToggle: (self) => {
                if (self.isActive) setActive(idx);
              },
            });
          });
        }

        // ── inventory (act 06): batched rise-in ──
        const cells = root.querySelectorAll<HTMLElement>(".pulse-inv-cell");
        if (cells.length) {
          gsap.set(cells, { opacity: 0, y: 12 });
          ScrollTrigger.batch(cells, {
            start: "top 92%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.03,
                ease: "power2.out",
                overwrite: true,
              }),
          });
        }
      }, root);

      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      lenisDetach?.();
      unsubLenis?.();
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
