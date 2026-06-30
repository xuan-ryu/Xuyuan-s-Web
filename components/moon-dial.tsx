"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type DialProject = {
  slug: string;
  title: string;
  cover?: string;
  previewVideo?: string;
  tags?: string[];
  oneliner?: string;
  role?: string;
};

function ArcArrow() {
  // a clean chevron (the up form; the down control flips it via CSS)
  return (
    <svg viewBox="0 0 32 32" className="md-arc-svg" aria-hidden="true">
      <path d="M6 20 L 16 10 L 26 20" />
    </svg>
  );
}

// The moon is parked at the right edge (its centre sits on the right border, so
// only the left hemisphere shows). Project nodes ride the rim; the one rotating
// onto the left-pointing focus point (180°) becomes the active project.
const FOCUS = 180; // left edge of the moon (faces the centred content)

export function MoonDial({ projects }: { projects: DialProject[] }) {
  const list = projects.slice(0, 6);
  const N = Math.max(list.length, 1);
  const STEP = 360 / N;

  const [active, setActive] = useState(0);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const moonRef = useRef<HTMLDivElement | null>(null);
  const craterRef = useRef<HTMLDivElement | null>(null);
  const focusRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const angle = useRef(FOCUS); // node 0 (base 0°) starts on the focus
  const target = useRef(FOCUS);
  const vel = useRef(0);
  const dragging = useRef(false);
  const startPointer = useRef(0);
  const startAngle = useRef(0);
  const lastT = useRef(0);
  const raf = useRef(0);

  const snapFor = (i: number) => FOCUS - i * STEP;
  const nearestIndex = (a: number) => {
    const i = Math.round((FOCUS - a) / STEP) % N;
    return ((i % N) + N) % N;
  };
  // shortest-path target so clicks/arrows never spin the long way round
  const unwrap = (t: number) => {
    let v = t;
    while (v - angle.current > 180) v -= 360;
    while (v - angle.current < -180) v += 360;
    return v;
  };

  function pointerAngle(e: PointerEvent | React.PointerEvent) {
    const moon = moonRef.current!;
    const r = moon.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
  }

  useEffect(() => {
    let lastIdx = -1;
    let lastAngle = NaN;
    let needsLayout = true;
    let visible = true;
    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      if (!dragging.current) {
        if (reduceMotion) {
          // snap straight to target — the dial still navigates, but does not
          // continuously ease/animate
          angle.current = target.current;
        } else {
          const d = target.current - angle.current;
          angle.current += d * 0.12;
          if (Math.abs(d) < 0.04) angle.current = target.current;
        }
      }
      // skip the layout read + node writes when nothing moved (idle / settled);
      // the dial geometry only changes on interaction, not on scroll (moon and
      // stage scroll together), so a static frame needs no work
      if (dragging.current || angle.current !== lastAngle || needsLayout) {
      lastAngle = angle.current;
      needsLayout = false;
      const st = stageRef.current;
      const moon = moonRef.current;
      if (st && moon) {
        // geometry relative to the moon's own centre, so the dial follows the
        // moon wherever it's positioned
        const sr = st.getBoundingClientRect();
        const mr = moon.getBoundingClientRect();
        const cx = mr.left - sr.left + mr.width / 2;
        const cy = mr.top - sr.top + mr.height / 2;
        const R = mr.width / 2 + 40; // nodes orbit just outside the rim
        for (let i = 0; i < N; i++) {
          const a = ((i * STEP + angle.current) * Math.PI) / 180;
          const x = cx + R * Math.cos(a);
          const y = cy + R * Math.sin(a);
          const el = nodeRefs.current[i];
          if (!el) continue;
          el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
          // only the left arc (the visible half) shows its nodes
          const onLeft = Math.cos(a) < 0.18;
          el.style.opacity = onLeft ? "1" : "0";
          el.style.pointerEvents = onLeft ? "auto" : "none";
        }
        // focus marker fixed on the moon's left edge
        if (focusRef.current) {
          const fa = (FOCUS * Math.PI) / 180;
          focusRef.current.style.transform = `translate(-50%, -50%) translate(${(cx + R * Math.cos(fa)).toFixed(1)}px, ${(cy + R * Math.sin(fa)).toFixed(1)}px)`;
        }
        if (craterRef.current)
          craterRef.current.style.transform = `rotate(${angle.current.toFixed(2)}deg)`;
      }
      const idx = nearestIndex(angle.current);
      if (idx !== lastIdx) {
        lastIdx = idx;
        setActive(idx);
      }
      }
      raf.current = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(tick);
    };
    // pause the rAF entirely while the dial is scrolled off-screen
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([e]) => {
              if (e.isIntersecting) {
                if (!visible) {
                  visible = true;
                  needsLayout = true;
                  start();
                }
              } else if (visible) {
                visible = false;
                cancelAnimationFrame(raf.current);
              }
            },
            { threshold: 0 },
          )
        : null;
    const obsEl = stageRef.current ?? moonRef.current;
    if (io && obsEl) io.observe(obsEl);
    const onResize = () => {
      needsLayout = true;
    };
    window.addEventListener("resize", onResize, { passive: true });
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      io?.disconnect();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startPointer.current = pointerAngle(e);
    startAngle.current = angle.current;
    lastT.current = performance.now();
    vel.current = 0;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const pa = pointerAngle(e);
    const na = startAngle.current + (pa - startPointer.current);
    const now = performance.now();
    const dt = Math.max(1, now - lastT.current);
    vel.current = (na - angle.current) / dt;
    lastT.current = now;
    angle.current = na;
  };
  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const projected = angle.current + vel.current * 130; // inertia
    target.current = unwrap(snapFor(nearestIndex(projected)));
  };

  const step = (dir: number) => {
    const i = (nearestIndex(target.current) + dir + N) % N;
    target.current = unwrap(snapFor(i));
  };
  const pick = (i: number) => {
    target.current = unwrap(snapFor(i));
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowDown" || e.key === "ArrowRight") step(1);
  };

  const ap = list[active];

  return (
    <div className="md-stage">
      <p className="md-eyebrow">Selected Work</p>

      {/* active project — preview + text, floating over the moon's centre */}
      <div
        className={`md-panel${
          !ap?.previewVideo && !ap?.cover ? " md-panel--text" : ""
        }`}
        key={ap?.slug}
        aria-live="polite"
      >
        {ap?.previewVideo || ap?.cover ? (
          <span className="md-panel-media">
            {ap.previewVideo ? (
              <video
                src={ap.previewVideo}
                poster={ap.cover}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image src={ap.cover!} alt="" fill sizes="520px" />
            )}
          </span>
        ) : null}
        <div className="md-panel-copy">
          <span className="md-panel-num">
            {String(active + 1).padStart(2, "0")}
            <i> / {String(N).padStart(2, "0")}</i>
          </span>
          <h3 className="md-panel-title">{ap?.title}</h3>
          <p className="md-panel-tags">{(ap?.tags ?? []).join(" · ")}</p>
          <p className="md-panel-desc">{ap?.oneliner}</p>
          <Link href={`/work/${ap?.slug}`} className="md-panel-cta">
            View Project <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* right: the moon dial */}
      <div
        className="md-dialwrap"
        role="listbox"
        aria-label="Project selector"
        tabIndex={0}
        onKeyDown={onKey}
        ref={stageRef}
      >
        <div className="md-glow" aria-hidden="true" />
        <div
          className="md-moon"
          ref={moonRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          {/* real lunar photo; rotating it spins the craters so the dial
              motion is legible */}
          <div className="md-moon-face" ref={craterRef} aria-hidden="true" />
          <div className="md-moon-shade" aria-hidden="true" />
        </div>

        {/* focus marker fixed on the moon's left edge (positioned in rAF) */}
        <div className="md-focus" ref={focusRef} aria-hidden="true">
          <span className="md-focus-dot" />
        </div>

        {/* rim nodes (positioned each frame) */}
        {list.map((p, i) => (
          <button
            key={p.slug}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            className={`md-node${i === active ? " is-active" : ""}`}
            onClick={() => pick(i)}
            aria-label={p.title}
            aria-selected={i === active}
            role="option"
          >
            <span className="md-node-dot" />
          </button>
        ))}

        {/* arc controls hugging the rim + caption */}
        <button
          className="md-arc md-arc-up"
          onClick={() => step(-1)}
          aria-label="Previous project"
        >
          <ArcArrow />
        </button>
        <button
          className="md-arc md-arc-down"
          onClick={() => step(1)}
          aria-label="Next project"
        >
          <ArcArrow />
        </button>
        <span className="md-rotate-cap" aria-hidden="true">
          Rotate to explore
        </span>
      </div>
    </div>
  );
}
