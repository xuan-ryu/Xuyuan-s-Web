"use client";

import gsap from "gsap";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type CSSProperties,
} from "react";

const DOT_D = 10;
const DOT_R = DOT_D / 2;
const RING_D = 16;
const WORDS = ["XUYUAN", "LIU"];

// ink-drop timeline: the dot falls once, blooms like ink in water, letters
// seep outward from the landing point, a last ripple wipes the screen
const DROP_DELAY_S = 0.15;
const BROADCAST_DELAY_MS = 750;
const EXIT_FALLBACK_MS = 3200;

// module-scope: survives client-side route changes / tab switches, but
// resets on a full page refresh — so the loader replays on every reload
let hasShownThisLoad = false;

const containerStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#000",
  zIndex: 9999,
  cursor: "pointer",
  pointerEvents: "all",
  overflow: "hidden",
};

const textContainerStyle: CSSProperties = {
  fontSize: "min(8vw, 56px)",
  fontWeight: 300,
  color: "#fff",
  display: "flex",
  gap: "1.2rem",
  fontFamily: "var(--font-murecho), 'Murecho', sans-serif",
  letterSpacing: "0.4em",
  textTransform: "uppercase",
  userSelect: "none",
};

const letterStyle: CSSProperties = {
  display: "inline-block",
  opacity: 0,
  willChange: "transform, filter, opacity",
};

const ringStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  width: RING_D,
  height: RING_D,
  borderRadius: "50%",
  border: "1.5px solid rgba(255,255,255,0.75)",
  boxShadow:
    "0 0 24px rgba(255,255,255,0.35), inset 0 0 10px rgba(255,255,255,0.18)",
  opacity: 0,
  pointerEvents: "none",
  willChange: "transform, opacity",
};

const dotStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  width: DOT_D,
  height: DOT_D,
  borderRadius: "50%",
  background: "#fff",
  boxShadow:
    "0 0 16px rgba(255,255,255,0.85), 0 0 40px rgba(255,255,255,0.35)",
  opacity: 0,
  pointerEvents: "none",
  zIndex: 10,
};

const hintStyle: CSSProperties = {
  position: "absolute",
  bottom: "40px",
  fontSize: "10px",
  color: "rgba(255,255,255,0.3)",
  letterSpacing: "0.1em",
  opacity: 0,
};

export function Loader() {
  const [shouldRun, setShouldRun] = useState<boolean | null>(null);
  const [gone, setGone] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalRingRef = useRef<HTMLDivElement | null>(null);
  const textWrapRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const introTlRef = useRef<gsap.core.Timeline | null>(null);
  const exitTlRef = useRef<gsap.core.Timeline | null>(null);
  const abortRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const broadcastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoreBodyRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // sessionStorage flag = escape hatch for capture/measure tooling.
    // NOTE: key is "skip-loader" — the old "loader-shown" key lingers in
    // long-lived tabs from before the replay-on-refresh behavior.
    setShouldRun(!hasShownThisLoad && !sessionStorage.getItem("skip-loader"));
  }, []);

  const unlockBody = useCallback(() => {
    restoreBodyRef.current?.();
    restoreBodyRef.current = null;
  }, []);

  const exitLoader = useCallback(() => {
    if (abortRef.current) return;
    abortRef.current = true;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    hasShownThisLoad = true;
    introTlRef.current?.kill();

    if (broadcastTimerRef.current) clearTimeout(broadcastTimerRef.current);
    broadcastTimerRef.current = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("loaderFinished"));
      broadcastTimerRef.current = null;
    }, BROADCAST_DELAY_MS);

    const container = containerRef.current;
    if (!container) {
      unlockBody();
      setGone(true);
      return;
    }
    const exit = gsap.timeline({
      onComplete: () => {
        unlockBody();
        setGone(true);
      },
    });
    if (textWrapRef.current) {
      exit.to(
        textWrapRef.current,
        { opacity: 0, y: -20, filter: "blur(6px)", duration: 0.45 },
        0,
      );
    }
    if (hintRef.current) {
      exit.to(hintRef.current, { opacity: 0, duration: 0.2 }, 0);
    }
    exit.to(
      container,
      { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
      0,
    );
    exitTlRef.current = exit;
  }, [unlockBody]);

  useEffect(() => {
    if (!shouldRun) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitLoader();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exitLoader, shouldRun]);

  useEffect(() => {
    if (!shouldRun) return;
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    restoreBodyRef.current = () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };

    return unlockBody;
  }, [unlockBody, shouldRun]);

  useEffect(() => {
    if (!shouldRun) return;
    // StrictMode double-mount sets abortRef in the first cleanup — reset so
    // the second run's exit path still works
    abortRef.current = false;
    const addTimer = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    // landing point: true visual center between first/last letters
    // (the container rect is skewed right by trailing letter-spacing)
    const getCenter = () => {
      const letters = letterRefs.current.filter(Boolean) as HTMLElement[];
      const el = textWrapRef.current;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (letters.length >= 2) {
        const a = letters[0].getBoundingClientRect();
        const b = letters[letters.length - 1].getBoundingClientRect();
        return { x: (a.left + b.right) / 2, y: r.top + r.height / 2 };
      }
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };

    const c = getCenter();
    const dot = dotRef.current;
    const letters = letterRefs.current.filter(Boolean) as HTMLElement[];

    if (c && dot) {
      const maxDist = Math.max(
        Math.hypot(c.x, c.y),
        Math.hypot(window.innerWidth - c.x, c.y),
        Math.hypot(c.x, window.innerHeight - c.y),
        Math.hypot(window.innerWidth - c.x, window.innerHeight - c.y),
      );
      const rings = ringRefs.current.filter(Boolean) as HTMLElement[];
      const finalRing = finalRingRef.current;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.set(dot, { x: c.x - DOT_R, y: c.y - 180, opacity: 0 })
        .set([...rings, finalRing].filter(Boolean), {
          x: c.x - RING_D / 2,
          y: c.y - RING_D / 2,
          opacity: 0,
          scale: 0.3,
        })
        // the ink dot drifts in and falls, stretching slightly as it drops
        .to(dot, { opacity: 1, duration: 0.2 }, DROP_DELAY_S)
        .to(
          dot,
          { y: c.y - DOT_R, scaleY: 1.18, duration: 0.55, ease: "power2.in" },
          "<",
        )
        .addLabel("land")
        // absorbed on landing
        .to(dot, { scale: 0.2, opacity: 0, duration: 0.28 }, "land");

      // ripples bloom outward, each softer and slower than the last
      rings.forEach((ring, i) => {
        tl.to(
          ring,
          { scale: 7 + i * 5.5, duration: 0.95 + i * 0.3, ease: "expo.out" },
          `land+=${i * 0.12}`,
        )
          .to(ring, { opacity: 0.55 - i * 0.14, duration: 0.18 }, "<")
          .to(ring, { opacity: 0, duration: 0.75 + i * 0.25 }, ">");
      });

      // letters seep outward from the landing point
      tl.fromTo(
        letters,
        { opacity: 0, y: 10, scale: 1.04, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power4.out",
          stagger: { each: 0.045, from: "center" },
        },
        "land",
      );

      // the whole name settles inward — cinematic tracking tighten
      if (textWrapRef.current) {
        tl.fromTo(
          textWrapRef.current,
          { letterSpacing: "0.58em" },
          { letterSpacing: "0.4em", duration: 1.3, ease: "power3.out" },
          "land",
        );
      }

      // the skip hint eases in once the bloom is underway
      if (hintRef.current) {
        tl.to(hintRef.current, { opacity: 1, duration: 0.6 }, "land+=0.3");
      }

      // one last ripple swells past the edges, then the page slides in
      if (finalRing) {
        tl.to(
          finalRing,
          {
            scale: (maxDist * 2) / RING_D,
            duration: 0.85,
            ease: "power2.inOut",
          },
          "land+=1.05",
        )
          .to(finalRing, { opacity: 0.4, duration: 0.25 }, "<")
          .to(finalRing, { opacity: 0, duration: 0.55 }, ">");
      }
      tl.call(exitLoader, [], "land+=1.4");
      introTlRef.current = tl;
    }

    addTimer(exitLoader, EXIT_FALLBACK_MS);

    return () => {
      abortRef.current = true;
      introTlRef.current?.kill();
      introTlRef.current = null;
      exitTlRef.current?.kill();
      exitTlRef.current = null;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];

      if (broadcastTimerRef.current) {
        clearTimeout(broadcastTimerRef.current);
        broadcastTimerRef.current = null;
      }
    };
  }, [exitLoader, shouldRun]);

  if (shouldRun !== true || gone) return null;

  return (
    <div
      ref={containerRef}
      data-app-loader=""
      style={containerStyle}
      onClick={exitLoader}
    >
      <div ref={dotRef} style={dotStyle} />

      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el: HTMLDivElement | null) => {
            ringRefs.current[i] = el;
          }}
          style={ringStyle}
        />
      ))}
      <div ref={finalRingRef} style={ringStyle} />

      <div ref={textWrapRef} style={textContainerStyle}>
        {WORDS.map((word, wIdx) => {
          const offset = WORDS.slice(0, wIdx).join("").length;
          return (
            <span key={wIdx} style={{ display: "flex" }}>
              {word.split("").map((char, i) => (
                <span
                  key={i}
                  ref={(el: HTMLSpanElement | null) => {
                    letterRefs.current[offset + i] = el;
                  }}
                  style={letterStyle}
                >
                  {char}
                </span>
              ))}
            </span>
          );
        })}
      </div>

      <div ref={hintRef} style={hintStyle}>
        CLICK OR ESC TO SKIP
      </div>
    </div>
  );
}
