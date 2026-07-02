"use client";

// Moon Gate (月洞门) — an editorial index whose preview is framed in a round
// opening in the #fff plaster wall beneath the eaves.
//
// Left: a compact index of condensed-uppercase project names (skill's "work
// index list mode", seal-red active mark). Resting on a name fills a FIXED hero
// slot — enlarged title + one-line caption + tags + link. The slot height is
// fixed and the button is pinned to its base, so moving through the index never
// changes the column height and the whole composition never drifts.
// Right: the moon gate holds a vertical film-strip of the six covers; selecting
// slides the strip up/down to the chosen frame (it follows the list's up/down
// motion), clipped inside the circular opening. The frame itself never moves.
//
// English copy, Arabic numerals, one seal-red accent. Prefix fg-.

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/data/projects";
import { Cta } from "@/components/ui/cta";

export function FeaturedGate({ projects }: { projects: Project[] }) {
  // only the product / UI-UX / AI work (the first four); the game + VR pieces
  // live on the full Work page, reached via the CTA below the list
  const list = [...projects].sort((a, b) => a.order - b.order).slice(0, 4);
  const firstWithVideo = Math.max(0, list.findIndex((p) => p.previewVideo));
  const [active, setActive] = useState(firstWithVideo);
  const ap = list[active] ?? list[0];
  const num = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section className="fg-section" aria-labelledby="fg-heading">
      <div className="fg-shell">
        <header className="fg-head">
          <h2 id="fg-heading" className="fg-title">Selected Work</h2>
          <Cta href="/work" variant="line" large className="fg-allwork">
            All Work
          </Cta>
        </header>

        <div className="fg-main">
          {/* left: an accordion index of the top four */}
          <div className="fg-left">
          <ol className="fg-list" aria-label="Selected work">
            {list.map((p, i) => {
              const isActive = i === active;
              return (
                <li key={p.slug} className={`fg-row${isActive ? " is-active" : ""}`}>
                  <Link
                    href={`/work/${p.slug}`}
                    className="fg-row-link"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-label={`${p.title} — ${p.tags.join(", ")}`}
                  >
                    <span className="fg-row-head">
                      <span className="fg-row-num">{num(i)}</span>
                      <span className="fg-row-name">{p.title}</span>
                    </span>
                    <span className="fg-row-detail">
                      <span className="fg-row-detail-in">
                        <span className="fg-row-desc">{p.oneliner}</span>
                        <span className="fg-row-meta">
                          <span className="fg-row-tags">{p.tags.join(" · ")}</span>
                          <span className="fg-row-cta cta cta--quiet">View Project</span>
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
          </div>

          {/* right: the moon gate — a vertical film-strip that slides */}
          <div className="fg-right">
            <Link
              href={`/work/${ap.slug}`}
              className="fg-gate"
              aria-label={`View ${ap.title}`}
              tabIndex={-1}
            >
              <span className="fg-gate-inner">
                <span
                  className="fg-strip"
                  style={{ ["--active" as string]: active }}
                >
                  {list.map((p, i) => {
                    const isActive = i === active;
                    const hasMedia = Boolean(p.cover || p.previewVideo);
                    return (
                      <span className="fg-cell" key={p.slug}>
                        {hasMedia ? (
                          isActive && p.previewVideo ? (
                            <video
                              className="fg-video"
                              src={p.previewVideo}
                              poster={p.cover}
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="none"
                            />
                          ) : p.cover ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              className="fg-cover"
                              src={p.cover}
                              alt=""
                              loading={i <= 1 ? "eager" : "lazy"}
                              decoding="async"
                            />
                          ) : null
                        ) : (
                          <span className="fg-gate-plate">
                            <span className="fg-gate-plate-note">In development</span>
                          </span>
                        )}
                      </span>
                    );
                  })}
                </span>
                <span className="fg-dip" key={active} aria-hidden="true" />
              </span>
              <span className="fg-gate-rim" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .fg-section {
          position: relative;
          background: #ffffff;
          color: #141414;
          padding-block: clamp(96px, 14vh, 172px);
          min-height: 100vh;
          display: flex; align-items: center;
          font-family: var(--font-sans);
          overflow: hidden;
        }
        .fg-shell {
          position: relative; z-index: 1;
          /* editorial shell that keeps widening on large / 32in screens so the
             section fills the viewport instead of stranding it in the middle */
          width: min(1800px, 100% - 2 * clamp(24px, 5vw, 140px));
          margin-inline: auto;
        }
        .fg-head {
          display: flex; flex-wrap: wrap; align-items: baseline;
          justify-content: space-between; gap: clamp(16px, 4vw, 60px);
          padding-bottom: clamp(10px, 1.6vh, 18px);
        }
        .fg-title {
          margin: 0;
          font-family: var(--font-condensed);
          font-size: clamp(56px, 8.8vw, 208px);
          font-weight: 300; line-height: 0.9; letter-spacing: -0.05em;
          text-transform: uppercase; color: #141414;
        }

        .fg-main {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
          align-items: start;
          gap: clamp(32px, 5vw, 128px);
          padding-top: clamp(34px, 5vh, 84px);
        }

        /* ---- accordion index: big condensed names, active unfolds its story ---- */
        .fg-list { list-style: none; margin: 0; padding: 0; }
        .fg-row { border-top: 1px solid rgba(15,16,20,0.1); }
        .fg-row:first-child { border-top: none; }
        .fg-row-link {
          display: block; text-decoration: none; color: inherit; outline: none;
          padding: clamp(9px, 1.3vh, 16px) 0;
        }
        .fg-row-head { display: grid; grid-template-columns: 2.4em 1fr; align-items: baseline; gap: 12px; }
        .fg-row-num {
          font-size: var(--text-meta); font-variant-numeric: tabular-nums;
          color: rgba(20,20,22,0.3);
          transition: color 0.35s var(--ease-silk, cubic-bezier(0.16,1,0.3,1));
        }
        .fg-row-name {
          font-family: var(--font-condensed);
          font-size: clamp(30px, 3.7vw, 78px);
          font-weight: 300; line-height: 1.0; letter-spacing: -0.05em;
          text-transform: uppercase; color: rgba(20,20,22,0.32);
          transition: color 0.35s var(--ease-silk, cubic-bezier(0.16,1,0.3,1));
        }
        .fg-row.is-active .fg-row-num { color: var(--seal-red, #d10000); }
        .fg-row.is-active .fg-row-name { color: #111; }
        .fg-row-link:focus-visible .fg-row-name { color: #111; }

        /* the story unfolds smoothly under the active title (grid 0fr → 1fr) */
        .fg-row-detail {
          display: grid; grid-template-rows: 0fr;
          margin-left: calc(2.4em + 12px);
          opacity: 0;
          transition: grid-template-rows 0.6s var(--ease-silk, cubic-bezier(0.16,1,0.3,1)),
                      opacity 0.5s ease;
        }
        .fg-row.is-active .fg-row-detail { grid-template-rows: 1fr; opacity: 1; }
        .fg-row-detail-in { min-height: 0; overflow: hidden; padding-top: 12px; }
        .fg-row-desc {
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
          max-width: 44ch;
          font-size: var(--text-body); line-height: 1.5; color: rgba(24,24,27,0.66);
        }
        .fg-row-meta {
          display: flex; align-items: baseline; justify-content: space-between; gap: 18px;
          margin-top: 14px; max-width: 44ch;
        }
        .fg-row-tags {
          font-size: var(--text-label); text-transform: uppercase; letter-spacing: 0.12em;
          color: rgba(20,20,22,0.5);
        }
        /* no arrow — a hairline that wipes in under the label carries the hover */
        /* label chrome + seal-red rule come from .cta--quiet (globals.css);
           only the row-level hover trigger is local — the wipe fires when the
           whole row is hovered, not just the label */
        .fg-row-link:hover .fg-row-cta::after,
        .fg-row-link:focus-visible .fg-row-cta::after { transform: scaleX(1); }

        .fg-left { min-width: 0; }
        /* the All Work CTA (global .cta--line) parks in the top-right corner,
           dropped to the big title's baseline */
        .fg-allwork { flex: none; align-self: baseline; }

        /* ---- the moon gate: a vertical film-strip clipped in a circle ---- */
        .fg-right { position: relative; display: flex; justify-content: flex-end; }
        .fg-gate {
          position: relative; display: block;
          width: clamp(380px, 40vw, 720px); aspect-ratio: 1 / 1;
          margin-right: clamp(-56px, -3vw, 0px);
          border-radius: 50%; text-decoration: none; color: inherit;
        }
        .fg-gate-inner {
          position: absolute; inset: 0; border-radius: 50%; overflow: hidden; background: #101010;
        }
        .fg-strip {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          /* selecting a lower item slides the strip up — follows the list */
          transform: translateY(calc(var(--active, 0) * -100%));
          /* visible up/down slide (follows the list), combined with the dip:
             the strip slides across the whole transition while a brief black
             passes over its midpoint */
          transition: transform 0.66s ease-in-out;
          will-change: transform;
        }
        /* each frame mattes its cover so the whole project is legible in the
           round window — a picture mounted in the porthole, not a tight crop */
        .fg-cell {
          position: relative; flex: 0 0 100%; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          /* flat black — no inner glow */
          background: #0a0a0a;
        }
        /* the whole cover, centered in the black moon, framed with a hairline */
        .fg-cover, .fg-video {
          max-width: 90%; max-height: 86%; width: auto; height: auto;
          object-fit: contain; display: block; border-radius: 3px;
          box-shadow: 0 22px 46px -18px rgba(3,3,3,0.82), 0 0 0 1px rgba(255,255,255,0.12);
        }
        /* switch = a slow, smooth dip through black, like a page transition */
        .fg-dip {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          background: #060606; opacity: 0;
          animation: fgDip 0.7s ease-in-out;
        }
        @keyframes fgDip { 0% { opacity: 0; } 44% { opacity: 1; } 56% { opacity: 1; } 100% { opacity: 0; } }
        /* a clean opening: a soft top recess + a hairline edge. No inner glow. */
        .fg-gate-rim {
          position: absolute; inset: 0; border-radius: 50%; pointer-events: none; z-index: 2;
          box-shadow:
            inset 0 0 0 1px rgba(15,16,20,0.16),
            0 18px 56px rgba(15,16,20,0.12);
        }
        .fg-gate-plate {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          background: radial-gradient(circle at 44% 40%, #242424 0%, #151515 62%, #0d0d0d 100%);
        }
        .fg-gate-plate-note {
          font-size: var(--text-label); text-transform: uppercase; letter-spacing: 0.24em;
          color: rgba(255,255,255,0.42);
        }

        @media (max-width: 900px) {
          .fg-main { grid-template-columns: 1fr; gap: clamp(30px, 6vh, 52px); padding-top: clamp(30px, 5vh, 52px); }
          .fg-right { order: -1; justify-content: center; }
          .fg-gate { width: min(72vw, 400px); margin-right: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fg-strip, .fg-row-num, .fg-row-name, .fg-row-detail,
          .fg-row-cta::after { transition: none; animation: none; }
          .fg-dip { animation: none; }
        }
      `,
        }}
      />
    </section>
  );
}
