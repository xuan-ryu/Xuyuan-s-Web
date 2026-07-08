"use client";

import { useEffect, useRef } from "react";

// The measured "flight line" for the VR Monarch Butterfly folio: a 1px accent
// rule across the full grid with three mono waypoints tracing the migration
// the VR piece documents (Oberlin OH -> Texas flyway -> El Rosario MX).
// Final-state contract: the markup ships fully drawn (no-JS, reduced motion,
// and print all read the finished line — CSS in vrmb-poster-layout hides
// nothing at rest). This effect REWINDS the line (.is-rewound) only when
// motion is allowed, then replays the stroke-dashoffset wipe (.is-drawn) on
// first intersection and disconnects.
export function VrmbFlightLine() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // already drawn — never rewind
    }
    el.classList.add("is-rewound");
    // flush the rewound frame so the draw transition has a start state
    void el.getBoundingClientRect();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.classList.add("is-drawn");
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      className="vrmb-flight"
      role="img"
      aria-label="Flight line from Oberlin, Ohio through the Texas flyway to El Rosario, Mexico — a migration of up to about 4,800 kilometres flown south by a single generation, with several generations returning"
    >
      {/* waypoint labels — wide screens read one line per stop; on phones
          (≤809.98px, toggled in vrmb-poster-layout CSS) each label stacks
          into two short lines so the three anchors never collide at 390px */}
      <g className="vrmb-flight-labels vrmb-flight-labels--wide">
        <text x="0" y="26" textAnchor="start">
          OBERLIN OH
        </text>
        <text x="52%" y="26" textAnchor="middle">
          TEXAS FLYWAY
        </text>
        <text x="100%" y="26" textAnchor="end">
          EL ROSARIO MX
        </text>
      </g>
      <g className="vrmb-flight-labels vrmb-flight-labels--narrow">
        <text x="0" y="10" textAnchor="start">
          OBERLIN
        </text>
        <text x="0" y="26" textAnchor="start">
          OH
        </text>
        <text x="52%" y="10" textAnchor="middle">
          TEXAS
        </text>
        <text x="52%" y="26" textAnchor="middle">
          FLYWAY
        </text>
        <text x="100%" y="10" textAnchor="end">
          EL ROSARIO
        </text>
        <text x="100%" y="26" textAnchor="end">
          MX
        </text>
      </g>
      {/* ticks */}
      <line className="vrmb-flight-tick" x1="0.5" y1="38" x2="0.5" y2="46" />
      <line className="vrmb-flight-tick" x1="52%" y1="38" x2="52%" y2="46" />
      <line className="vrmb-flight-tick" x1="99.9%" y1="38" x2="99.9%" y2="46" />
      {/* the rule itself */}
      <line
        className="vrmb-flight-rule"
        x1="0"
        y1="46.5"
        x2="100%"
        y2="46.5"
        pathLength={1}
      />
      {/* distance note — end-anchored single line on wide screens; on phones
          it starts at x=0 and wraps to two lines so the bbox never leaves
          the shell (the one-liner overflowed left by ~83px at 390px) */}
      <text
        className="vrmb-flight-note vrmb-flight-note--wide"
        x="100%"
        y="72"
        textAnchor="end"
      >
        UP TO ≈4,800 KM — ONE GENERATION SOUTH, SEVERAL BACK
      </text>
      <g className="vrmb-flight-note vrmb-flight-note--narrow">
        <text x="0" y="72" textAnchor="start">
          UP TO ≈4,800 KM
        </text>
        <text x="0" y="88" textAnchor="start">
          ONE GENERATION SOUTH, SEVERAL BACK
        </text>
      </g>
    </svg>
  );
}
