"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeLenis } from "@/lib/lenis-bus";
import { stripCssComments } from "@/lib/css-sanitize";

type Chapter = { id: string; label: string };

type Props = {
  chapters: ReadonlyArray<Chapter>;
  /** Accent for the progress fill + active row; defaults to the case accent. */
  accent?: string;
};

// Phone reading aids for the long case pages (Nyma runs ~38 phone screens):
// a hairline reading-progress bar under the nav, and an ink-glass INDEX chip
// (same chip language as the pond's feed controls) that opens a chapter list.
// Desktop hides both — there the choreography and viewport do the pacing.
export function CaseMap({ chapters, accent }: Props) {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = barRef.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      el.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // tap outside the sheet closes it
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const jump = (id: string) => {
    setOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    let lenis: import("lenis").default | null = null;
    subscribeLenis((l) => {
      lenis = l;
    })();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (lenis && !reduced) {
      (lenis as import("lenis").default).scrollTo(target, {
        duration: 1.2,
        offset: -72,
      });
    } else {
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
  };

  if (!chapters.length) return null;

  return (
    <div ref={rootRef} className={`cmap${open ? " is-open" : ""}`}>
      <style>{stripCssComments(`
        /* phone-only reading aids; desktop paces itself */
        .cmap { display: none; }
        @media (max-width: 809.98px) {
          .cmap { display: contents; }
        }
        .cmap-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 2px;
          z-index: 60;
          background: var(--cmap-accent);
          transform: scaleX(0);
          transform-origin: left;
          pointer-events: none;
        }
        .cmap-chip {
          position: fixed;
          right: 16px;
          bottom: calc(18px + env(safe-area-inset-bottom, 0px));
          z-index: 61;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 11px 16px;
          background: rgba(10, 10, 10, 0.62);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: var(--radius-control);
          box-shadow: var(--shadow-lift);
          cursor: pointer; user-select: none;
          font-family: var(--font-sans);
          font-size: var(--text-micro); font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          line-height: 1; color: rgba(255, 255, 255, 0.85);
          transition: transform 0.2s var(--ease-soft);
        }
        .cmap-chip:active { transform: translateY(1px) scale(0.99); }
        .cmap-chip-ico {
          width: 10px; height: 8px; flex-shrink: 0;
          background:
            linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)) 0 0 / 10px 1.5px no-repeat,
            linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)) 0 50% / 7px 1.5px no-repeat,
            linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)) 0 100% / 10px 1.5px no-repeat;
        }
        .cmap-sheet {
          position: fixed;
          right: 16px;
          bottom: calc(64px + env(safe-area-inset-bottom, 0px));
          z-index: 61;
          min-width: 228px;
          padding: 8px;
          background: rgba(8, 8, 8, 0.86);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: var(--radius-control);
          box-shadow: var(--shadow-overlay);
          opacity: 0;
          transform: translateY(10px) scale(0.98);
          transform-origin: bottom right;
          pointer-events: none;
          transition: opacity 0.24s var(--ease-soft),
                      transform 0.24s var(--ease-soft);
        }
        .cmap.is-open .cmap-sheet {
          opacity: 1; transform: none; pointer-events: auto;
        }
        .cmap-row {
          display: flex; align-items: baseline; gap: 12px;
          width: 100%;
          padding: 11px 12px;
          background: none; border: 0; cursor: pointer;
          text-align: left;
          font-family: var(--font-sans);
          font-size: var(--text-label); font-weight: 400;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.88);
          border-radius: 3px;
        }
        .cmap-row:active { background: rgba(255, 255, 255, 0.08); }
        .cmap-row-num {
          font-family: var(--font-mono);
          font-size: var(--text-micro);
          color: var(--cmap-accent);
        }
        @media (prefers-reduced-motion: reduce) {
          .cmap-sheet { transition: none; }
        }
      `)}</style>
      <div
        style={{ ["--cmap-accent" as string]: accent ?? "var(--case-accent, var(--accent-gold))" } as React.CSSProperties}
        data-nav-sample-ignore=""
      >
        <div ref={barRef} className="cmap-bar" aria-hidden="true" />
        <button
          type="button"
          className="cmap-chip"
          aria-expanded={open}
          aria-label={open ? "Close chapter index" : "Open chapter index"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="cmap-chip-ico" aria-hidden="true" />
          Index
        </button>
        <nav className="cmap-sheet" aria-label="Chapters">
          {chapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className="cmap-row"
              onClick={() => jump(c.id)}
            >
              <span className="cmap-row-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              {c.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
