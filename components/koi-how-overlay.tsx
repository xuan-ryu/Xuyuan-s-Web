"use client";

import { useEffect, useRef, useState } from "react";
import { ValueCard } from "./value-card";
import { stripCssComments } from "@/lib/css-sanitize";

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
// screen readers always get the content — it is never feed-gated). Visually it
// reveals only after the visitor enters feed mode and drops food into the pond
// a few times: "koi:feed" CustomEvent from koi-pond.tsx, count >= 3.
//
// koi-how-grid (desktop): the 1440 canvas of the old home-how section, kept as
// the alignment rail — staggered 640-wide cards over the pond stage, offset
// enough that the lower two cards never visually collide.
// Only the cards catch pointer events; the water around them stays feedable.
const FEEDS_TO_REVEAL = 3;

export function KoiHowOverlay({ title, methods, forceReveal = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(forceReveal);

  useEffect(() => {
    if (forceReveal) return;
    const root = rootRef.current;
    if (!root) return;

    let done = false;

    const cleanupTriggers = () => {
      window.removeEventListener("koi:feed", onFeed);
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
      if (count >= FEEDS_TO_REVEAL) reveal();
    };

    window.addEventListener("koi:feed", onFeed);

    return cleanupTriggers;
  }, [forceReveal]);

  return (
    <div
      ref={rootRef}
      className={`koi-how${revealed ? " is-revealed" : ""}`}
    >
      <style>{stripCssComments(`
        .koi-how {
          position: absolute; inset: 0;
          /* above the lotus banks (.koi-lotus-frame z6) — the method cards
             must never be occluded by pads; fish + pads stay readable
             THROUGH the cards' ink glass instead */
          z-index: 7;
          /* water stays feedable everywhere except the cards themselves */
          pointer-events: none;
        }
        .koi-how-canvas {
          position: relative;
          max-width: 1440px; height: 100%;
          margin: 0 auto;
        }
        .koi-how-title {
          /* top in vh: the crossing lands the pond ~12vh past its boundary,
             so a px-anchored title sat clipped above the fold — 24vh keeps it
             comfortably in the first view, under the nav */
          position: absolute; left: 192px; top: 24vh;
          margin: 0;
          font-family: var(--font-condensed);
          font-size: var(--text-display-2);
          font-weight: 300;
          letter-spacing: -0.05em;
          text-transform: uppercase;
          line-height: 1;
          color: rgba(252, 252, 252, 0.97);
          /* soft ink pool behind the strokes so the title carries over pads */
          text-shadow:
            0 2px 18px rgba(1, 2, 4, 0.85),
            0 0 56px rgba(1, 2, 4, 0.6);
        }
        .koi-how-card {
          position: absolute;
          width: 640px;
          pointer-events: none;
        }
        .koi-how.is-revealed .koi-how-card { pointer-events: auto; }
        /* staggered below the (bigger) title — card 1 clears its line */
        .koi-how-card-1 { left: 624px; top: 400px; min-height: 356px; }
        .koi-how-card-2 { left: 112px; top: 768px; min-height: 322px; }
        .koi-how-card-3 { left: 688px; top: 1130px; min-height: 322px; }

        /* On the pond the cards drop ValueCard's heavy frosted glass (its
           inline blur(28px) pops in during the fade). The pond grew dense
           lotus banks (2026-07-06), so the glass is a step darker than the
           original near-transparent take — the text must hold against pads
           AND fish moving beneath it, while both stay visible through it. */
        .koi-how-card .vibe-card {
          background: rgba(4, 7, 10, 0.66) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
        }

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
             the lower cards keep a real vertical gap instead of stacking into
             one dense block. */
          .koi-how-title { left: 48px; }
          .koi-how-card { width: min(640px, calc(100vw - 96px)); }
          .koi-how-card-1 { left: auto; right: 48px; top: 400px; }
          .koi-how-card-2 { left: 48px; top: 768px; }
          .koi-how-card-3 { left: auto; right: 48px; top: 1130px; }
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
      `)}</style>
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
