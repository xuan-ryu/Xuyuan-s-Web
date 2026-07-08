"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

// Chapter 1, S4 figure: the six real complaints from the FrogHire bug log
// converging into the three systemic flaws the chapter names. One inline SVG
// on a 12-field internal grid; complaint notes left (fields 1–5), ink flaw
// slabs right (fields 8–12). On phone (≤809.98px) the composition restacks:
// notes above slabs, connectors rerouted down a left rail.
// Complaint + flaw language is verbatim from data/projects.ts chapter copy.

type Note = {
  label: string;
  source: string;
  /** full review/quote context, shown as the hover/focus tooltip */
  title: string;
  /** index into FLAWS */
  flaw: number;
};

const NOTES: Note[] = [
  {
    label: "“I honestly have no idea how to use this.”",
    source: "Chrome Web Store review",
    title:
      "Chrome Web Store review: “I honestly have no idea how to use this.” It stung, because I’d felt the same on my first try.",
    flaw: 0,
  },
  {
    label: "No guidance, no hand to hold",
    source: "First-run experience",
    title:
      "The problem wasn’t user intelligence — it was the product’s silence. No onboarding, no guidance, no hand to hold.",
    flaw: 0,
  },
  {
    label: "Unclear resume states",
    source: "Weekly dashboard passes",
    title:
      "Weekly passes through the dashboard kept logging unclear resume states — users couldn’t tell which resume drove their recommendations.",
    flaw: 1,
  },
  {
    label: "Scattered settings",
    source: "Bug log, clustered",
    title:
      "Settings were scattered across the product — one of the clusters that pointed to a broken information hierarchy.",
    flaw: 1,
  },
  {
    label: "Hidden subscription flows",
    source: "Bug log, clustered",
    title:
      "Subscription flows were hidden and opaque — users couldn’t see what they had bought, or for how long.",
    flaw: 2,
  },
  {
    label: "Wrong-major job recommendations",
    source: "SWE roles, marketing students",
    title:
      "Job lists suggested software-engineering roles to marketing students — recommendations users had no reason to trust.",
    flaw: 2,
  },
];

const FLAWS = [
  { label: "NO ONBOARDING", count: "2 of 6 complaints" },
  { label: "BROKEN HIERARCHY", count: "2 of 6 complaints" },
  { label: "MISSING TRUST", count: "2 of 6 complaints" },
];

const matchesMedia = (query: string) =>
  typeof window !== "undefined" && window.matchMedia(query).matches;

// ── Geometry ────────────────────────────────────────────────────────────────
// Desktop: viewBox 1200×560, 12 internal fields of 100. Notes on fields 1–5,
// slabs on fields 8–12, connectors crossing fields 5–8.
// Stacked (phone): viewBox 400×872, notes column above slabs column,
// connectors bracket down a left rail (one rail depth per flaw).

function desktopGeo() {
  const note = (i: number) => ({ x: 16, y: 37 + i * 84, w: 372, h: 66 });
  // slabs span the full extent of the six-card stack: first/last slab
  // centers align with the first/third complaint pair (owner: the right
  // column ended early and left a dead band under the canvas)
  const slab = (j: number) => ({ x: 764, y: 60 + j * 168, w: 420, h: 104 });
  const path = (i: number, j: number) => {
    const ya = 37 + i * 84 + 33;
    const yb = 60 + j * 168 + 52;
    return `M 388 ${ya} C 560 ${ya}, 592 ${yb}, 764 ${yb}`;
  };
  return { viewBox: "0 0 1200 540", note, slab, path };
}

function stackedGeo() {
  const note = (i: number) => ({ x: 30, y: 10 + i * 88, w: 362, h: 74 });
  const slab = (j: number) => ({ x: 30, y: 550 + j * 108, w: 362, h: 92 });
  const path = (i: number, j: number) => {
    const ya = 10 + i * 88 + 37;
    const yb = 550 + j * 108 + 46;
    const x = 20 - j * 7;
    return [
      `M 30 ${ya}`,
      `L ${x + 6} ${ya}`,
      `Q ${x} ${ya} ${x} ${ya + 6}`,
      `L ${x} ${yb - 6}`,
      `Q ${x} ${yb} ${x + 6} ${yb}`,
      `L 30 ${yb}`,
    ].join(" ");
  };
  return { viewBox: "0 0 400 872", note, slab, path };
}

export function FroghireAffinityMap() {
  const rootRef = useRef<SVGSVGElement>(null);
  const [stacked, setStacked] = useState(() =>
    matchesMedia("(max-width: 809.98px)"),
  );
  const [live, setLive] = useState(() =>
    matchesMedia("(prefers-reduced-motion: reduce)"),
  );
  const [settled, setSettled] = useState(() =>
    matchesMedia("(prefers-reduced-motion: reduce)"),
  );
  const [hot, setHot] = useState<number | null>(null);

  // Phone restack — the SVG swaps to the vertical composition.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 809.98px)");
    const onChange = () => setStacked(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Entrance: fires once, then the observer disconnects. Reduced motion
  // renders the final state immediately (CSS also enforces it).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setLive(true);
        io.disconnect();
        // clear the stagger delays once the entrance has played so
        // hover/focus tints respond instantly
        timer = setTimeout(() => setSettled(true), 1500);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  const geo = stacked ? stackedGeo() : desktopGeo();

  return (
    <svg
      ref={rootRef}
      className={`froghire-map${live ? " is-live" : ""}${settled ? " is-settled" : ""}`}
      viewBox={geo.viewBox}
      role="group"
      aria-label="Affinity map: six complaints from the bug log converge into three systemic flaws — no onboarding, broken hierarchy, missing trust."
    >
      {/* connectors under everything */}
      {NOTES.map((n, i) => (
        <path
          key={`p-${i}`}
          className={`froghire-map-path${hot === i ? " is-hot" : ""}`}
          style={{ "--fro-d": `${480 + i * 40}ms` } as CSSProperties}
          d={geo.path(i, n.flaw)}
        />
      ))}

      {NOTES.map((n, i) => {
        const r = geo.note(i);
        return (
          <g
            key={`n-${i}`}
            className="froghire-map-note"
            style={{ "--fro-d": `${i * 60}ms` } as CSSProperties}
            tabIndex={0}
            role="img"
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot((h) => (h === i ? null : h))}
            onFocus={() => setHot(i)}
            onBlur={() => setHot((h) => (h === i ? null : h))}
          >
            <title>{n.title}</title>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} />
            <text className="froghire-map-note-label" x={r.x + 18} y={r.y + (stacked ? 31 : 28)}>
              {n.label}
            </text>
            <text className="froghire-map-note-source" x={r.x + 18} y={r.y + (stacked ? 55 : 49)}>
              {n.source}
            </text>
          </g>
        );
      })}

      {FLAWS.map((f, j) => {
        const r = geo.slab(j);
        return (
          <g
            key={`s-${j}`}
            className="froghire-map-slab"
            style={{ "--fro-d": `${520 + j * 70}ms` } as CSSProperties}
          >
            <rect x={r.x} y={r.y} width={r.w} height={r.h} />
            <text className="froghire-map-slab-label" x={r.x + 24} y={r.y + r.h / 2 - 4}>
              {f.label}
            </text>
            <text className="froghire-map-slab-count" x={r.x + 24} y={r.y + r.h / 2 + 20}>
              {f.count}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
