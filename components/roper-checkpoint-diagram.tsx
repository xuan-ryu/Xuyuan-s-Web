"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

// The signature decision as a two-lane hairline diagram (spec-roper.json
// "CheckpointDiagram"): the BEFORE lane fills to 100% regardless; the AFTER
// lane's five segments fill one-by-one, each gated by a small ink tick.
// Triggered once by IntersectionObserver at 40% visibility; transform/opacity
// only; never replays; under prefers-reduced-motion both lanes render in
// their final state immediately. Styling lives in roper-case-layout.tsx.
export function RoperCheckpointDiagram() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-run");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.classList.add("is-run");
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="roper-diagram"
      ref={ref}
      role="img"
      aria-label="Diagram of the progress redesign. Before: a single bar fills to one hundred percent whether or not anything was understood. After: five checkpoint segments, each unlocking only when understanding is demonstrated, marked by a check."
    >
      <div className="roper-lane">
        <p className="roper-lane-label">Before — filled either way · completion ≠ comprehension</p>
        <div className="roper-lane-track">
          <span className="roper-lane-fill is-before" />
        </div>
      </div>
      <div className="roper-lane">
        <p className="roper-lane-label">After — each segment unlocks on demonstrated understanding</p>
        <div className="roper-lane-segs">
          {[0, 1, 2, 3, 4].map((index) => (
            <span
              className="roper-seg"
              key={index}
              style={{ "--i": index } as CSSProperties}
            >
              <span className="roper-seg-fill" />
              <svg
                className="roper-seg-tick"
                viewBox="0 0 10 10"
                aria-hidden="true"
              >
                <path
                  d="M1.5 5.5 4 8l4.5-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
