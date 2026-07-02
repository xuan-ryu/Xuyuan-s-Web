"use client";

import { useEffect, useRef, useState } from "react";
import { ValueCard } from "./value-card";

type Method = {
  readonly title: string;
  readonly heading: string;
  readonly body: string;
};

type Props = {
  title: string;
  methods: ReadonlyArray<Method>;
  /** Reveal immediately (lite-scenes mode: there is no pond to feed). */
  forceReveal?: boolean;
};

// How-I-Work surfaces over the koi pond. The markup is server-rendered (SEO /
// screen readers always get the content — it is never feed-gated); the visual
// reveal fires on the pond's feed-count signal ("koi:feed" CustomEvent from
// koi-pond.tsx, count >= 3) or on a fallback: ~14s of the section in view, or
// scrolling past 75% of it. Reduced motion reveals instantly on first sight.
//
// koi-how-grid (desktop): the 1440 canvas of the old home-how section, kept as
// the alignment rail — two card columns at x 192 / 608 (640-wide cards), title
// at (192, 96), card rows at y 240 / 700 / 1060 over the 1318px pond stage.
// Only the cards catch pointer events; the water around them stays feedable.
export function KoiHowOverlay({ title, methods, forceReveal = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(forceReveal);

  useEffect(() => {
    if (forceReveal) return;
    const root = rootRef.current;
    if (!root) return;
    const section = (root.closest(".home-koi-section") ?? root) as HTMLElement;

    let done = false;
    let dwellTimer = 0;
    let raf = 0;
    let io: IntersectionObserver | null = null;

    const cleanupTriggers = () => {
      window.removeEventListener("koi:feed", onFeed);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (dwellTimer) window.clearTimeout(dwellTimer);
      dwellTimer = 0;
      io?.disconnect();
      io = null;
    };

    const reveal = () => {
      if (done) return;
      done = true;
      setRevealed(true);
      // Tell the pond so the feed tip docks out of the cards' way.
      try {
        window.dispatchEvent(new CustomEvent("koi:how-reveal"));
      } catch {
        /* no-op */
      }
      cleanupTriggers();
    };

    const onFeed = (e: Event) => {
      const count =
        (e as CustomEvent<{ count?: number }>).detail?.count ?? 0;
      if (count >= 3) reveal();
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = section.getBoundingClientRect();
        if (r.height <= 0) return;
        // How far the visitor has scrolled THROUGH the section (0 when its
        // top reaches the viewport top, 1 when its bottom meets the viewport
        // bottom) — not how far it has merely entered the viewport.
        const span = r.height - window.innerHeight;
        const progress =
          span > 0 ? -r.top / span : (window.innerHeight - r.top) / r.height;
        if (progress >= 0.75) reveal();
      });
    };

    const prefersReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const inView = !!entry && entry.isIntersecting;
          if (inView && prefersReduce) {
            reveal();
            return;
          }
          if (inView && !dwellTimer) {
            dwellTimer = window.setTimeout(reveal, 14000);
          } else if (!inView && dwellTimer) {
            window.clearTimeout(dwellTimer);
            dwellTimer = 0;
          }
        },
        { threshold: 0.25 },
      );
      io.observe(section);
    } else {
      // No IO — arm the dwell timer immediately.
      dwellTimer = window.setTimeout(reveal, 14000);
    }

    window.addEventListener("koi:feed", onFeed);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return cleanupTriggers;
  }, [forceReveal]);

  return (
    <div
      ref={rootRef}
      className={`koi-how${revealed ? " is-revealed" : ""}`}
    >
      <style>{`
        .koi-how {
          position: absolute; inset: 0;
          z-index: 4;
          /* water stays feedable everywhere except the cards themselves */
          pointer-events: none;
        }
        .koi-how-canvas {
          position: relative;
          max-width: 1440px; height: 100%;
          margin: 0 auto;
        }
        .koi-how-title {
          position: absolute; left: 192px; top: 96px;
          margin: 0;
          font-family: var(--font-condensed);
          font-size: var(--text-display-3);
          font-weight: 300;
          letter-spacing: -0.05em;
          text-transform: uppercase;
          line-height: 1;
          color: rgba(250, 250, 250, 0.92);
        }
        .koi-how-card {
          position: absolute;
          width: 640px;
          pointer-events: none;
        }
        .koi-how.is-revealed .koi-how-card { pointer-events: auto; }
        .koi-how-card-1 { left: 608px; top: 240px; min-height: 356px; }
        .koi-how-card-2 { left: 192px; top: 700px; min-height: 322px; }
        .koi-how-card-3 { left: 608px; top: 1060px; min-height: 322px; }

        /* reveal — transform/opacity only, staggered */
        .koi-how-title, .koi-how-card {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity var(--dur-reveal) var(--ease-reveal),
                      transform var(--dur-reveal) var(--ease-reveal);
        }
        .koi-how.is-revealed .koi-how-title,
        .koi-how.is-revealed .koi-how-card {
          opacity: 1;
          transform: none;
        }
        .koi-how.is-revealed .koi-how-card-1 { transition-delay: 0.14s; }
        .koi-how.is-revealed .koi-how-card-2 { transition-delay: 0.30s; }
        .koi-how.is-revealed .koi-how-card-3 { transition-delay: 0.46s; }

        @media (prefers-reduced-motion: reduce) {
          .koi-how-title, .koi-how-card { transition: none; }
        }
        /* no JS: never hide the content behind the reveal */
        @media (scripting: none) {
          .koi-how-title, .koi-how-card { opacity: 1; transform: none; }
          .koi-how-card { pointer-events: auto; }
        }

        @media (max-width: 1250px) and (min-width: 741px) {
          /* narrower shells: keep two rails but pull them inside the viewport;
             card-2 drops a little lower so the docked feed chip (left edge,
             pond mid-height) keeps clear water around it */
          .koi-how-title { left: 48px; }
          .koi-how-card { width: min(640px, calc(100vw - 96px)); }
          .koi-how-card-1 { left: auto; right: 48px; }
          .koi-how-card-2 { left: 48px; top: 764px; }
          .koi-how-card-3 { left: auto; right: 48px; }
        }

        @media (max-width: 740px) {
          /* phone: the ink band grows and the stack flows below the top
             water area (the section modifier lives on .home-koi-section) */
          .koi-how {
            position: relative; inset: auto;
            pointer-events: none;
          }
          .koi-how-canvas {
            position: relative;
            max-width: none; height: auto; margin: 0;
            display: flex; flex-direction: column;
            gap: 28px;
            padding: 460px 20px 96px;
          }
          .koi-how-title { position: static; }
          .koi-how-card,
          .koi-how-card-1, .koi-how-card-2, .koi-how-card-3 {
            position: static;
            width: 100%; min-height: 0;
          }
        }
        /* phone modifier for the host section: let the band grow with the
           stack (globals.css keeps the measured 972px pond as the minimum) */
        @media (max-width: 740px) {
          .home-koi-section.koi-has-how {
            height: auto;
            min-height: 972px;
          }
        }
      `}</style>
      <div className="koi-how-canvas">
        <h2 className="koi-how-title">{title}</h2>
        {methods.map((method, i) => (
          <div
            key={method.title}
            className={`koi-how-card koi-how-card-${i + 1}`}
          >
            <ValueCard
              title={method.title}
              subtitle={method.heading}
              bodyText={method.body}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
