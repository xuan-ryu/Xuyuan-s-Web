"use client";

import { useEffect, useRef, useState } from "react";
import { scrollTo } from "@/lib/scroll-behavior";

// Scroll spine for the Cloud Support Futures page: the fixed case rail
// (the authority gate's page-level incarnation), the four-color reading
// progress bar, and the sticky authority-gate scrub. All handlers are
// rAF-throttled listeners on native window scroll (Lenis drives native
// scroll on this site), and everything degrades to a finished static
// state without JS or under reduced motion.

/* ── case rail + progress ──────────────────────────────────────────────── */

const STAGES = [
  ["detect", "Detect"],
  ["ground", "Ground"],
  ["probe", "Probe"],
  ["film", "Film"],
  ["frame", "Frame"],
  ["build", "Build"],
  ["decide", "Decide"],
] as const;

export function CfCaseRail() {
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stageEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cf-stage]"),
    );
    const sectionEls = Array.from(
      document.querySelectorAll<HTMLElement>(".cf-page .cf-section, .cf-page .cf-hero, .cf-page .cf-close"),
    );

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const doc = document.documentElement;
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, doc.scrollHeight - vh)));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

      const mark = vh * 0.45;
      let idx = 0;
      for (const el of stageEls) {
        if (el.getBoundingClientRect().top <= mark) {
          idx = STAGES.findIndex(([k]) => k === el.dataset.cfStage);
        }
      }
      setActive((cur) => (cur === idx ? cur : Math.max(0, idx)));

      let isDark = false;
      for (const el of sectionEls) {
        const r = el.getBoundingClientRect();
        if (r.top <= vh * 0.5 && r.bottom > vh * 0.5) {
          isDark = el.hasAttribute("data-nav-dark");
        }
      }
      setDark((cur) => (cur === isDark ? cur : isDark));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (key: string) => {
    const el = document.querySelector<HTMLElement>(`[data-cf-stage="${key}"]`);
    if (!el) return;
    // pre-reveal the destination: a long jump can land before FadeReveal's
    // observer fires, leaving the whole screen in its ghost (pre-fade) state
    if (el.hasAttribute("data-fade")) el.classList.add("is-visible");
    el.querySelectorAll<HTMLElement>("[data-fade]").forEach((n) => {
      n.classList.add("is-visible");
    });
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    scrollTo(y, { duration: 1.1 });
  };

  return (
    <>
      <div className="cf-progress" aria-hidden="true">
        <span ref={barRef} />
      </div>
      <nav className={`cf-rail-nav${dark ? " is-dark" : ""}`} aria-label="Case progress">
        {STAGES.map(([key, label], i) => (
          <button
            key={key}
            type="button"
            className={i === active ? "is-on" : undefined}
            aria-current={i === active ? "step" : undefined}
            onClick={() => go(key)}
          >
            <span className="cf-rail-dot" aria-hidden="true" />
            <span className="cf-rail-label">{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

/* ── the authority gate, enacted as a scroll scrub ─────────────────────── */

const GATE_STEPS = [
  {
    key: "detect",
    title: "AI detects & prepares",
    line: "Evidence assembled, customer consented.",
  },
  {
    key: "verify",
    title: "Human verifies",
    line: "The agent reviews the packet against the account.",
  },
  {
    key: "release",
    title: "Release refund",
    line: "Only a verified human can release funds.",
  },
] as const;

export function CfGate() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [step, setStep] = useState(3); // no-JS / pre-mount: finished state

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 900px)");
    if (reduce.matches || narrow.matches) return; // static finished state

    let raf = 0;
    const liveId = requestAnimationFrame(() => {
      setLive(true);
      setStep(0);
    });
    const update = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - vh;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      el.style.setProperty("--gate-p", String(p));
      const s = p < 0.3 ? 0 : p < 0.62 ? 1 : p < 0.86 ? 2 : 3;
      setStep((cur) => (cur === s ? cur : s));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(liveId);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={`cf-gate${live ? " is-live" : ""}`} ref={wrapRef}>
      <div className="cf-gate-stage" data-step={step}>
        <p className="cf-gate-kicker">The rule, enacted</p>
        <h3 className="cf-gate-title">
          {step < 3 ? "The refund waits for a person." : "Released — by a person."}
        </h3>
        <div className="cf-gate-track" aria-hidden="true">
          <span className="cf-gate-fill" />
        </div>
        <ol className="cf-gate-steps">
          {GATE_STEPS.map((g, i) => (
            <li
              key={g.key}
              className={
                step > i ? "is-done" : step === i ? "is-current" : undefined
              }
            >
              <span className="cf-gate-dot" aria-hidden="true">
                {step > i ? "✓" : i + 1}
              </span>
              <strong>{g.title}</strong>
              <p>{g.line}</p>
            </li>
          ))}
        </ol>
        <p className="cf-gate-note" role="status">
          {step < 3
            ? "Locked — verify to enable."
            : "$89.99 · confirmed by the agent · the AI never touched the money."}
        </p>
      </div>
    </div>
  );
}
