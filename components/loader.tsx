"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type CSSProperties,
} from "react";
import type Lenis from "lenis";
import { subscribeLenis } from "@/lib/lenis-bus";
import { stripCssComments } from "@/lib/css-sanitize";

gsap.registerPlugin(CustomEase);
CustomEase.create("inkSoft", "0.25,1,0.5,1");
CustomEase.create("doors", "0.76,0,0.24,1");

const WORDS = ["XUYUAN", "LIU"];
const SEAL_SRC = "/media/shared/seal.png";

const BROADCAST_DELAY_MS = 750;
const EXIT_FALLBACK_MS = 5200;

// module-scope: survives client-side route changes / tab switches, but
// resets on a full page refresh — so the loader replays on every reload
let hasShownThisLoad = false;

const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const rootStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  cursor: "pointer",
  overflow: "hidden",
  touchAction: "none",
  userSelect: "none",
};

const scrollLockCss = `
html:has([data-app-loader]),
html:has([data-app-loader]) body,
body:has([data-app-loader]) {
  overflow: hidden !important;
  overscroll-behavior: none !important;
}

body:has([data-app-loader]) {
  touch-action: none !important;
}
`;

const doorStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "50.2vw",
  background: "var(--ink-950, #050505)",
  overflow: "hidden",
  willChange: "transform",
};

const grainStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "100vw",
  backgroundImage: GRAIN_URL,
  opacity: 0.035,
  mixBlendMode: "overlay",
  pointerEvents: "none",
};

const contentStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(20px, 3vw, 40px)",
  pointerEvents: "none",
  willChange: "transform, opacity, filter",
};

const nameStyle: CSSProperties = {
  display: "flex",
  gap: "1.1rem",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--text-display-3)",
  fontWeight: 300,
  letterSpacing: "0.35em",
  textTransform: "uppercase",
  color: "#e8e6e3",
  whiteSpace: "nowrap",
};

const letterStyle: CSSProperties = {
  display: "inline-block",
  opacity: 0,
  willChange: "transform, filter, opacity",
};

const sealStyle: CSSProperties = {
  width: "clamp(30px, 3vw, 42px)",
  height: "auto",
  flexShrink: 0,
  opacity: 0,
  willChange: "transform, filter, opacity",
};

const hintStyle: CSSProperties = {
  position: "absolute",
  bottom: "40px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 10,
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-micro)",
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  color: "rgba(232,230,227,0.45)",
  opacity: 0,
  pointerEvents: "none",
};

export function Loader() {
  const [shouldRun, setShouldRun] = useState(true);
  const [gone, setGone] = useState(false);
  const leftDoorRef = useRef<HTMLDivElement | null>(null);
  const rightDoorRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sealRef = useRef<HTMLImageElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const introTlRef = useRef<gsap.core.Timeline | null>(null);
  const exitTlRef = useRef<gsap.core.Timeline | null>(null);
  const abortRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const broadcastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoreBodyRef = useRef<(() => void) | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // sessionStorage flag = escape hatch for capture/measure tooling
    const timer = window.setTimeout(() => {
      setShouldRun(!hasShownThisLoad && !sessionStorage.getItem("skip-loader"));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(
    () =>
      subscribeLenis((lenis) => {
        lenisRef.current = lenis;
      }),
    [],
  );

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
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);

    if (broadcastTimerRef.current) clearTimeout(broadcastTimerRef.current);
    broadcastTimerRef.current = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("loaderFinished"));
      broadcastTimerRef.current = null;
    }, BROADCAST_DELAY_MS);

    const left = leftDoorRef.current;
    const right = rightDoorRef.current;
    if (!left || !right) {
      unlockBody();
      setGone(true);
      return;
    }
    const exit = gsap.timeline({
      onComplete: () => {
        lenisRef.current?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
        unlockBody();
        setGone(true);
      },
    });
    if (contentRef.current) {
      exit.to(
        contentRef.current,
        { opacity: 0, scale: 0.95, filter: "blur(12px)", duration: 0.45 },
        0,
      );
    }
    if (hintRef.current) {
      exit.to(hintRef.current, { opacity: 0, duration: 0.3 }, 0);
    }
    // the shoji doors slide apart, revealing the page
    exit
      .to(left, { xPercent: -100, duration: 1.15, ease: "doors" }, 0.12)
      .to(right, { xPercent: 100, duration: 1.15, ease: "doors" }, 0.12);
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
    const originalOverscroll = document.body.style.overscrollBehavior;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscroll =
      document.documentElement.style.overscrollBehavior;
    const lockedLenis = lenisRef.current;
    lockedLenis?.stop();
    lockedLenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.overscrollBehavior = "none";
    restoreBodyRef.current = () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      document.body.style.overscrollBehavior = originalOverscroll;
      lockedLenis?.start();
    };
    return unlockBody;
  }, [unlockBody, shouldRun]);

  useEffect(() => {
    if (!shouldRun) return;
    const preventScroll = (event: Event) => event.preventDefault();
    window.addEventListener("wheel", preventScroll, {
      capture: true,
      passive: false,
    });
    window.addEventListener("touchmove", preventScroll, {
      capture: true,
      passive: false,
    });
    return () => {
      window.removeEventListener("wheel", preventScroll, { capture: true });
      window.removeEventListener("touchmove", preventScroll, { capture: true });
    };
  }, [shouldRun]);

  useEffect(() => {
    if (!shouldRun) return;
    // StrictMode double-mount sets abortRef in the first cleanup
    abortRef.current = false;
    const addTimer = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    const letters = letterRefs.current.filter(Boolean) as HTMLElement[];
    const tl = gsap.timeline();

    // letters surface out of the ink — slow, viscous
    tl.fromTo(
      letters,
      { opacity: 0, filter: "blur(24px)", scale: 0.95 },
      {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 1.8,
        ease: "inkSoft",
        stagger: 0.07,
      },
      0.1,
    );

    // the red seal presses in beside the name
    if (sealRef.current) {
      tl.fromTo(
        sealRef.current,
        { opacity: 0, x: -12, filter: "blur(8px)" },
        {
          opacity: 0.9,
          x: 0,
          filter: "blur(0px)",
          duration: 1.6,
          ease: "inkSoft",
        },
        1.1,
      );
    }

    const hint = hintRef.current;
    if (hint) {
      tl.to(hint, { opacity: 1, duration: 1.0 }, 2.2);
      // gentle pulse while waiting
      gsap.to(hint, {
        opacity: 0.4,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        delay: 3.2,
        ease: "power1.inOut",
      });
    }

    tl.call(exitLoader, [], 3.3);
    introTlRef.current = tl;

    addTimer(exitLoader, EXIT_FALLBACK_MS);

    return () => {
      abortRef.current = true;
      introTlRef.current?.kill();
      introTlRef.current = null;
      exitTlRef.current?.kill();
      exitTlRef.current = null;
      if (hint) gsap.killTweensOf(hint);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      if (broadcastTimerRef.current) {
        clearTimeout(broadcastTimerRef.current);
        broadcastTimerRef.current = null;
      }
    };
  }, [exitLoader, shouldRun]);

  if (shouldRun !== true || gone) return null;

  let ci = 0;

  return (
    <div
      data-app-loader=""
      style={rootStyle}
      onClick={exitLoader}
      onWheel={(event) => event.preventDefault()}
      onTouchMove={(event) => event.preventDefault()}
      aria-hidden="true"
    >
      <style
        dangerouslySetInnerHTML={{ __html: stripCssComments(scrollLockCss) }}
      />
      {/* shoji doors — they ARE the backdrop, and slide apart on exit */}
      <div ref={leftDoorRef} style={{ ...doorStyle, left: 0 }}>
        <div style={{ ...grainStyle, left: 0 }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: 1,
            background: "rgba(255,255,255,0.08)",
          }}
        />
      </div>
      <div ref={rightDoorRef} style={{ ...doorStyle, right: 0 }}>
        <div style={{ ...grainStyle, right: 0 }} />
      </div>

      <div ref={contentRef} style={contentStyle}>
        <div style={nameStyle}>
          {WORDS.map((word, wIdx) => (
            <span key={wIdx} style={{ display: "flex" }}>
              {word.split("").map((char) => {
                const idx = ci++;
                return (
                  <span
                    key={idx}
                    ref={(el: HTMLSpanElement | null) => {
                      letterRefs.current[idx] = el;
                    }}
                    style={letterStyle}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </div>
        {/* the studio's own red seal, pressed beside the name */}
        {/* eslint-disable-next-line @next/next/no-img-element -- GSAP animates this exact img node through a ref. */}
        <img ref={sealRef} src={SEAL_SRC} alt="" style={sealStyle} />
      </div>

      <div ref={hintRef} style={hintStyle}>
        CLICK ANYWHERE OR ESC TO SKIP INTRO
      </div>
    </div>
  );
}
