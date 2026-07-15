"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { scrollTo } from "@/lib/scroll-behavior";

// Pulse case page — the fork: two doors into the case (L1, client).
//
// Sits after the overview. Sets data-view="product|system" on
// .pulse-case-page; the page CSS hides the other reading track (and
// collapses its rail group to a clickable label). Without JS the effect
// never runs, no attribute is set, and both tracks render stacked — the
// fork is enhancement, not a gate. The case-map rail's part labels carry
// [data-rail-switch]; a delegated listener here makes them switch tracks
// from any scroll depth. After a switch ScrollTrigger's scrub positions
// are stale (display toggles moved everything), so we nudge it with a
// resize event and return the reader to the tracks' top when they were
// below it.

const VIEWS = [
  {
    id: "product",
    no: "Part 1",
    label: "Product",
    desc: "The operating loop, and the three surfaces where it meets a person.",
  },
  {
    id: "system",
    no: "Part 2",
    label: "Design engineering",
    desc: "Six prototypes to one system — tokens, checks, AI-readable rules.",
  },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

// door signature = a miniature of the ECG trace this part's opener draws
// below: one heartbeat for Product, the double beat for the system. The
// door literally previews the opener it leads to. BEATS holds each spike's
// x-position (fraction of the 280-unit viewBox) — the wrap positions one
// ping dot per spike, fired once when the door becomes the reading track.
const TRACES: Record<ViewId, string> = {
  product: "M0 14 H110 L116 14 120 3 126 25 131 8 135 14 H280",
  system:
    "M0 14 H88 L94 14 98 4 104 24 109 11 113 14 H150 L156 14 160 3 166 25 171 8 175 14 H280",
};
const BEATS: Record<ViewId, string[]> = {
  product: ["44.6%"],
  system: ["37.1%", "59.3%"],
};

function DoorTrace({ id }: { id: ViewId }) {
  return (
    <span className="pulse-door-tracewrap">
      <svg
        className="pulse-door-trace"
        viewBox="0 0 280 28"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={TRACES[id]} vectorEffect="non-scaling-stroke" />
      </svg>
      {BEATS[id].map((x) => (
        <i key={x} className="pulse-door-beat" style={{ left: x }} aria-hidden="true" />
      ))}
    </span>
  );
}

export function PulsePartSwitch() {
  const [view, setView] = useState<ViewId>("product");
  // true only for user-initiated switches — the mount effect must not scroll
  const pickedRef = useRef(false);

  const pick = useCallback((next: ViewId) => {
    setView((prev) => {
      if (next === prev) return prev;
      pickedRef.current = true;
      return next;
    });
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".pulse-case-page");
    if (!root) return;
    root.dataset.view = view;
    window.dispatchEvent(new Event("resize"));
    // measured AFTER the other track collapsed (this effect runs post-commit),
    // so the landing position is the real one — land on the part's opener.
    // MUST go through the scroll bus: a native scrollTo gets overwritten by
    // the smooth-scroll adapter's next frame.
    if (pickedRef.current) {
      pickedRef.current = false;
      const opener = document.querySelector<HTMLElement>(
        `#pulse-view-${view} .pulse-part`,
      );
      // land exactly on the opener's box top: its own half-gap padding is
      // the breathing room, and any negative offset shows the fork's tail.
      // Pass a NUMBER (not the element) — the smooth-scroll adapter resolves
      // element targets against its internal position, which can be stale
      // after a native jump; window.scrollY is always the truth.
      if (opener) {
        const top = opener.getBoundingClientRect().top + window.scrollY;
        scrollTo(top, { immediate: true });
      }
    }
    return () => {
      delete root.dataset.view;
    };
  }, [view]);

  // the rail's part labels switch tracks from any depth
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-rail-switch]",
      );
      if (!btn) return;
      const next = btn.dataset.railSwitch;
      if (next === "product" || next === "system") pick(next);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pick]);

  return (
    <>
      <p className="pulse-fork-cue">Two reading tracks &mdash; pick one</p>
      <div className="pulse-doors" role="tablist" aria-label="Case study parts">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={view === v.id}
            aria-controls={`pulse-view-${v.id}`}
            className={`pulse-door${view === v.id ? " is-on" : ""}`}
            onClick={() => pick(v.id)}
          >
            <span className="pulse-door-head">
              <span className="pulse-door-index">{v.no}</span>
              <span className="pulse-door-now" aria-hidden="true">
                Reading
              </span>
            </span>
            <strong className="pulse-door-title">{v.label}</strong>
            <span className="pulse-door-desc">{v.desc}</span>
            <DoorTrace id={v.id} />
          </button>
        ))}
      </div>
    </>
  );
}
