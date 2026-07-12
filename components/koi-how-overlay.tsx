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
  // "Just feed the fish" tucks the cards away one by one and hands the water
  // back; the same chip then reads "How I Work" to bring them back — so the
  // dismiss is always reversible.
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        // let the pond re-dock / restore its feed tip to match
        window.dispatchEvent(
          new CustomEvent(next ? "koi:how-dismiss" : "koi:how-reveal")
        );
      } catch {
        /* no-op */
      }
      return next;
    });
  };

  useEffect(() => {
    if (forceReveal) return;
    const root = rootRef.current;
    if (!root) return;

    let done = false;
    let io: IntersectionObserver | null = null;

    const cleanupTriggers = () => {
      window.removeEventListener("koi:feed", onFeed);
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
      if (count >= FEEDS_TO_REVEAL) reveal();
    };

    window.addEventListener("koi:feed", onFeed);

    // Phones + narrow tablets: feeding three times is a hover-era easter egg
    // no touch visitor discovers, and on the flowed layouts (≤900px) the
    // (invisible) card stack still occupies flow — screens of blank water.
    // Surface the cards once the pond band actually reaches the reader;
    // feeding stays as a bonus. (901px+ keeps the feed gate: the band is
    // fixed-height there, so hidden cards cost no space.)
    if (window.matchMedia("(pointer: coarse), (max-width: 900px)").matches) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) reveal();
        },
        // fire when the band's top third is on screen, not at first pixel
        { rootMargin: "0px 0px -30% 0px" },
      );
      io.observe(root);
    }

    return cleanupTriggers;
  }, [forceReveal]);

  return (
    <div
      ref={rootRef}
      className={`koi-how${revealed ? " is-revealed" : ""}${
        collapsed ? " is-collapsed" : ""
      }`}
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
        /* staggered below the (bigger) title — card 1 clears its line.
           The right-rail cards anchor from the RIGHT (176/112px = their
           1440-canvas insets), so between 1251-1439px they slide inward
           instead of poking past the viewport (48px hscroll at 1280). */
        .koi-how-card-1 { left: auto; right: 176px; top: 400px; min-height: 356px; }
        .koi-how-card-2 { left: 112px; top: 768px; min-height: 322px; }
        .koi-how-card-3 { left: auto; right: 112px; top: 1130px; min-height: 322px; }

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

        /* Toggle chip — same ink-glass language as the pond's feed chip
           (#feed-ui): hairline edge, --radius-control, uppercase label, lift
           shadow. It tucks the cards away ("Just feed the fish") and brings
           them back ("How I Work"), so the dismiss is reversible. Lives once
           the cards are up, then stays put in both states. */
        .koi-how-toggle {
          /* pairs with the pond's feed chip as ONE left-edge control group.
             The button is a direct child of .koi-how (inset 0 = the section
             box — the SAME coordinate system the chip docks in); it used to
             live inside the centered 1440 canvas, which pushed it ~48px off
             the chip's edge on wide screens (owner report 2026-07-08). Same
             24px dock inset, stacked 12px under the docked chip (chip is
             centred at 26% of the band, ~48px tall → bottom at 26% + 24px). */
          position: absolute; left: 24px; top: calc(26% + 36px);
          display: inline-flex; align-items: center; gap: 12px;
          /* fixed 252px = the docked feed chip's box (owner: equal length);
             also keeps the box stable across the two toggle labels */
          width: 252px; box-sizing: border-box; justify-content: flex-start;
          padding: 12px 18px;
          /* shared ink-glass recipe — must match #feed-ui in koi-pond.tsx */
          background: rgba(10, 10, 10, 0.62);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: var(--radius-control);
          box-shadow: var(--shadow-lift);
          cursor: pointer; user-select: none;
          pointer-events: none;
          font-family: var(--font-sans);
          font-size: var(--text-label); font-weight: 500;
          letter-spacing: var(--track-label); text-transform: uppercase;
          line-height: 1; white-space: nowrap;
          color: rgba(255, 255, 255, 0.78);
          opacity: 0; transform: translateY(14px);
          transition: opacity var(--dur-reveal) var(--ease-reveal),
                      transform var(--dur-reveal) var(--ease-reveal),
                      background var(--dur-fast) ease,
                      border-color var(--dur-fast) ease,
                      color var(--dur-fast) ease;
        }
        .koi-how.is-revealed .koi-how-toggle {
          opacity: 1; transform: none; pointer-events: auto;
          transition-delay: 0.62s;
        }
        .koi-how-toggle:hover {
          background: rgba(20, 20, 20, 0.72);
          border-color: rgba(255, 255, 255, 0.24);
          color: #fff;
        }
        /* universal depress — same 1px settle as every .cta press */
        .koi-how.is-revealed .koi-how-toggle:active {
          transform: translateY(1px) scale(0.99);
        }
        .koi-how-toggle:focus-visible {
          outline: var(--focus-ring); outline-offset: var(--focus-offset);
        }
        /* chevron in a 22px icon slot — the same slot the docked feed chip
           gives its pellets, so the two chips share one icon rhythm. Points
           down (tuck away) when open, flips up when collapsed. */
        .koi-how-toggle-ico {
          position: relative;
          width: 22px; height: 22px; flex-shrink: 0;
        }
        .koi-how-toggle-ico::before {
          content: "";
          position: absolute; left: 50%; top: 50%;
          width: 8px; height: 8px;
          border-right: 1.5px solid currentColor;
          border-bottom: 1.5px solid currentColor;
          transform: translate(-50%, -62%) rotate(45deg);
          transition: transform 0.42s var(--ease-silk);
        }
        .koi-how.is-collapsed .koi-how-toggle-ico::before {
          transform: translate(-50%, -38%) rotate(-135deg);
        }

        /* collapse: reverse-staggered downward withdraw (card 3 leaves first).
           Removing is-collapsed lets the reveal stagger bring them back. */
        .koi-how.is-revealed.is-collapsed .koi-how-title,
        .koi-how.is-revealed.is-collapsed .koi-how-card {
          opacity: 0;
          transform: translateY(46px) scale(0.965);
        }
        .koi-how.is-collapsed .koi-how-card-3 { transition-delay: 0s; }
        .koi-how.is-collapsed .koi-how-card-2 { transition-delay: 0.12s; }
        .koi-how.is-collapsed .koi-how-card-1 { transition-delay: 0.24s; }
        .koi-how.is-collapsed .koi-how-title  { transition-delay: 0.36s; }
        /* tucked-away cards must hand their patch of water back to feeding */
        .koi-how.is-collapsed .koi-how-card { pointer-events: none; }

        @media (prefers-reduced-motion: reduce) {
          .koi-how-title, .koi-how-card, .koi-how-toggle,
          .koi-how-toggle-ico::before { transition: none; }
        }
        /* no JS: never hide the content behind the reveal */
        @media (scripting: none) {
          .koi-how-title, .koi-how-card { opacity: 1; transform: none; }
          .koi-how-card { pointer-events: auto; }
        }

        @media (max-width: 1250px) and (min-width: 901px) {
          /* mid shells: the fixed-px stagger collapsed into one cramped
             column here (12px gaps, cards sharing a rail — owner report
             2026-07-12). Compose as a grid anchored to the band's foot
             instead: two cards shoulder to shoulder, the third centered
             beneath, open water above. The band keeps its fixed 180dvh
             height — the lotus frame's %-anchored pads (and the crossing
             handoff) depend on it. */
          .koi-how-title { left: 48px; }
          .koi-how-canvas {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 28px 24px;
            align-content: end;
            padding: 0 48px 72px;
          }
          .koi-how-card,
          .koi-how-card-1, .koi-how-card-2, .koi-how-card-3 {
            position: static;
            width: auto;
            min-height: 0;
          }
          .koi-how-card-3 {
            grid-column: 1 / -1;
            width: min(640px, 100%);
            justify-self: center;
          }
        }

        @media (max-width: 900px) and (min-width: 741px) {
          /* narrow tablet: the crossing never runs here (901px boundary),
             so the band may grow — flow the stack like the phone, title on
             the open water above, toggle retired (collapsing a flowed stack
             just leaves a hole) */
          .koi-how {
            position: relative;
            inset: auto;
          }
          .koi-how-canvas {
            max-width: none;
            height: auto;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 32px;
            /* clears the title (24vh) and the docked chip (~26% of band) */
            padding: 560px 48px 112px;
          }
          .koi-how-title { left: 48px; }
          .koi-how-card,
          .koi-how-card-1, .koi-how-card-2, .koi-how-card-3 {
            position: static;
            width: min(640px, 100%);
            min-height: 0;
          }
          .koi-how-card-2 { align-self: flex-end; }
          .koi-how-toggle { display: none; }
        }
        /* narrow-tablet modifier for the host section — same contract as the
           phone one below: grow with the stack, never shrink under the band */
        @media (max-width: 900px) and (min-width: 741px) {
          .home-koi-section.koi-has-how {
            height: auto;
            min-height: max(1555px, 180dvh);
          }
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
            /* 320px of open water above the stack (was 460): enough pond to
               feed in, less dead travel on a phone (2026-07-10 pacing pass) */
            padding: 320px 20px 96px;
          }
          .koi-how-title { position: static; }
          /* phone: cards auto-reveal on scroll and sit in normal flow, so
             collapsing them would just leave a blank band — the tuck-away
             toggle is a desktop affordance; the pond above stays feedable */
          .koi-how-toggle {
            display: none;
          }
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
            min-height: 860px;
          }
        }
      `)}</style>
      {!forceReveal && (
        <button
          type="button"
          className="koi-how-toggle"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={
            collapsed
              ? "Bring How I Work back"
              : "Hide How I Work and just feed the fish"
          }
        >
          <span className="koi-how-toggle-ico" aria-hidden="true" />
          {collapsed ? "How I Work" : "Just feed the fish"}
        </button>
      )}
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
              interactive={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
