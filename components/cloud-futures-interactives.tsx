"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties } from "react";
import { InteractiveCue } from "@/components/ui/interactive-cue";
import { subscribeLenis } from "@/lib/lenis-bus";
import type Lenis from "lenis";

// Interactive beats for the Cloud Support Futures case page. Styles live in
// the page's scoped critical CSS (prefix cf-, cloud-futures-case-layout.tsx);
// this file only carries state. All quotes are verbatim from the studio's
// research sessions (participants anonymized as P1…P9 in the report).

/* ── 01 · the two lo-fi extreme worlds ─────────────────────────────────── */

const WORLDS = [
  {
    key: "ai",
    name: "A world run entirely by AI",
    traits: [
      "Monitors your emotional state continuously",
      "Opens support cases before you ask",
      "Resolves billing issues autonomously — no human in the loop",
    ],
    reaction:
      "Fast, but unsettling. Participants asked who is accountable when the machine misreads a financially sensitive case.",
    board: {
      src: "/media/work/cloud-futures/worlds-ai.png",
      width: 2400,
      height: 849,
      alt: "Lo-fi storyboard of the all-AI support world: proactive help popups and recording badges over a billing console",
      line: "Lo-fi storyboard — proactive popups, emotion tracking, no human anywhere",
    },
  },
  {
    key: "human",
    name: "A world with no AI at all",
    traits: [
      "Every step handled by a person",
      "Warm, accountable, deliberate",
      "Queues, repetition, and answers that vary by agent",
    ],
    reaction:
      "Reassuring in the abstract — but participants immediately recalled hour-long waits and humans reading from scripts.",
    board: {
      src: "/media/work/cloud-futures/worlds-human.png",
      width: 2400,
      height: 1508,
      alt: "Lo-fi storyboard of the human-only support world: contacting an agent and waiting in a chat queue",
      line: "Lo-fi storyboard, first beats — a queue before every answer",
    },
  },
] as const;

export function CfWorlds() {
  const [active, setActive] = useState(0);
  const world = WORLDS[active];

  return (
    <div className="cf-worlds">
      <div className="cf-worlds-switch" role="group" aria-label="Two extreme worlds">
        {WORLDS.map((w, i) => (
          <button
            key={w.key}
            type="button"
            className={`cf-chip${i === active ? " is-on" : ""}`}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            {i === 0 ? "World A · all AI" : "World B · all human"}
          </button>
        ))}
      </div>
      <div className="cf-worlds-panel" key={world.key}>
        <p className="cf-worlds-name">{world.name}</p>
        <ul className="cf-worlds-traits">
          {world.traits.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="cf-worlds-reaction">{world.reaction}</p>
        <figure className="cf-worlds-board">
          <div className="cf-worlds-board-media">
            <Image
              src={world.board.src}
              alt={world.board.alt}
              width={world.board.width}
              height={world.board.height}
              sizes="(max-width: 900px) 100vw, 720px"
            />
          </div>
          <figcaption>{world.board.line}</figcaption>
        </figure>
      </div>
    </div>
  );
}

/* ── 02 · four mid-fi futures: same case, four power structures ────────── */

type Lane = {
  /** arrow direction across the lane */
  dir: "right" | "left";
  verb: string;
};

type Scenario = {
  key: string;
  name: string;
  color: string;
  tagline: string;
  /** lane between Customer and AI */
  laneA: Lane;
  /** lane between AI and Human agent */
  laneB: Lane;
  authority: 0 | 1 | 2; // node index holding the final say
  verdict: { quote: string; source: string };
  /** the team's full decision-flow diagram behind the film */
  flow: { src: string; width: number; height: number; alt: string; line: string };
};

const NODES = ["Customer", "AI", "Human agent"] as const;

const SCENARIOS: Scenario[] = [
  {
    key: "advocate",
    name: "The Advocate",
    color: "#4285F4",
    tagline: "The AI takes the customer’s side against the company.",
    laneA: { dir: "left", verb: "coaches the customer" },
    laneB: { dir: "right", verb: "pushes the exception through" },
    authority: 0,
    verdict: {
      quote:
        "When AI suggests rule-bending, it feels more like something that is not allowed.",
      source: "Mid-fi session, P1",
    },
    flow: {
      src: "/media/work/cloud-futures/flow-advocate.png",
      width: 2400,
      height: 661,
      alt: "Flowchart: the AI reads the user's stress level, weighs company policy against user benefit, proactively offers refunds or workarounds, and if policy blocks it, briefs a human that the user deserves an exception — ending at 'user got what they wanted'.",
      line: "how the AI decides when to bend toward the customer",
    },
  },
  {
    key: "supervisor",
    name: "The Supervisor",
    color: "#EA4335",
    tagline: "The AI monitors the human agent and corrects them mid-call.",
    laneA: { dir: "right", verb: "reports oversight upward" },
    laneB: { dir: "right", verb: "monitors · overrides the agent" },
    authority: 1,
    verdict: {
      quote:
        "It undermines the integrity of human service and makes humans seem useless.",
      source: "Mid-fi session, P5",
    },
    flow: {
      src: "/media/work/cloud-futures/flow-supervisor.png",
      width: 2400,
      height: 606,
      alt: "Flowchart: while a human agent helps the user, a parallel AI track monitors the conversation in real time, scores response time, empathy, and policy compliance, offers to intervene on poor service, can flag the human's manager, and ends by handing the user a performance report.",
      line: "the parallel track where AI scores the human’s performance",
    },
  },
  {
    key: "badcop",
    name: "The Bad Cop",
    color: "#F9AB00",
    tagline: "The AI enforces policy rigidly; only the human may bend it.",
    laneA: { dir: "left", verb: "applies the rules, no exceptions" },
    laneB: { dir: "left", verb: "human override, when justified" },
    authority: 2,
    verdict: {
      quote: "A cold machine that rigidly enforces rules.",
      source: "Mid-fi session, P9 — the human’s override read as “noble”",
    },
    flow: {
      src: "/media/work/cloud-futures/flow-badcop.png",
      width: 2400,
      height: 528,
      alt: "Flowchart: the AI enforces policy strictly — 'I'm sorry, you don't qualify' — and only when the user is distressed does a compassionate human enter, review the emotional context the AI gathered, and decide whether to grant the exception or apologize that it can't be overridden.",
      line: "rigid enforcement, with the human override as the only exit",
    },
  },
  {
    key: "nurse",
    name: "The Triage Nurse",
    color: "#1E8E3E",
    tagline: "Emotional signals decide who gets seen first.",
    laneA: { dir: "right", verb: "emotion scored at the door" },
    laneB: { dir: "right", verb: "priority queue to the agent" },
    authority: 1,
    verdict: {
      quote: "Everyone gets an Oscar for acting frustrated.",
      source: "Mid-fi session, P9",
    },
    flow: {
      src: "/media/work/cloud-futures/flow-nurse.png",
      width: 2400,
      height: 394,
      alt: "Flowchart: the AI intake assessment scores each case's severity 1–5; low scores it resolves alone, medium it attempts with a specialist on standby, and high scores get a detailed case file — problem summary, steps tried, emotional state — prepared before transfer to a human specialist who validates the diagnosis.",
      line: "severity triage deciding whether a human ever enters",
    },
  },
];

export function CfFutures() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  // page-level lightbox: the 2400px decision flows are the studio's core
  // artifacts and unreadable at stage scale — click inspects one at 1:1
  const [zoom, setZoom] = useState<number | null>(null);
  const zoomTriggerRef = useRef<HTMLElement | null>(null);
  const zoomCloseRef = useRef<HTMLButtonElement>(null);
  const sc = SCENARIOS[active];

  useEffect(() => {
    if (zoom === null) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    lenisRef.current?.stop();
    zoomCloseRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setZoom(null);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      html.style.overflow = prevOverflow;
      lenisRef.current?.start();
      window.removeEventListener("keydown", onKey, true);
      zoomTriggerRef.current?.focus();
    };
  }, [zoom]);

  // Desktop: the stage pins and vertical scroll SLIDES the four power
  // structures horizontally — dwell on each, visible travel between them,
  // so the gesture and the motion agree. Mobile and no-JS keep the same
  // track as a native horizontal swipe carousel.
  useEffect(() => {
    const unsub = subscribeLenis((l) => {
      lenisRef.current = l;
    });
    const narrow = window.matchMedia("(max-width: 900px)");
    if (narrow.matches) {
      const vp = viewportRef.current;
      if (!vp) return unsub;
      const onSwipe = () => {
        const w =
          trackRef.current?.children[0]?.getBoundingClientRect().width ||
          vp.clientWidth;
        const idx = Math.min(3, Math.max(0, Math.round(vp.scrollLeft / w)));
        setActive((cur) => (cur === idx ? cur : idx));
      };
      vp.addEventListener("scroll", onSwipe, { passive: true });
      return () => {
        unsub();
        vp.removeEventListener("scroll", onSwipe);
      };
    }
    let raf = 0;
    const liveId = requestAnimationFrame(() => setLive(true));
    const DWELL = 0.55;
    const update = () => {
      raf = 0;
      const el = wrapRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
      const rawT = Math.min(3, Math.max(0, p * 4 - 0.5));
      const seg = Math.floor(rawT);
      const u = rawT - seg;
      const s = u <= DWELL ? 0 : (u - DWELL) / (1 - DWELL);
      const eased = Math.min(3, seg + s * s * (3 - 2 * s));
      // pixel-based: percentage would resolve against the flex track's own
      // width, which stays at one viewport no matter how many panels it holds
      const w = viewportRef.current ? viewportRef.current.clientWidth : 0;
      track.style.transform = `translateX(${-eased * w}px)`;
      el.style.setProperty("--fu-t", String(eased));
      const idx = Math.round(eased);
      setActive((cur) => (cur === idx ? cur : idx));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      unsub();
      cancelAnimationFrame(liveId);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (i: number) => {
    const el = wrapRef.current;
    if (live && el) {
      // the jump plays through the intermediate positions, so the slide
      // itself stays visible even on click
      const vh = window.innerHeight;
      const y =
        el.getBoundingClientRect().top +
        window.scrollY +
        ((i + 0.5) / 4) * (el.offsetHeight - vh);
      const lenis = lenisRef.current;
      if (lenis) lenis.scrollTo(y, { duration: 1.1 });
      else window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }
    setActive(i);
    const vp = viewportRef.current;
    if (vp) {
      const w =
        trackRef.current?.children[0]?.getBoundingClientRect().width ||
        vp.clientWidth;
      vp.scrollTo({ left: i * w, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`cf-futures${live ? " is-live" : ""}`}
      ref={wrapRef}
      style={{ "--fu-wash": sc.color, "--fu-a": active } as CSSProperties}
    >
      <div className="cf-futures-stage">
        <div className="cf-fu-head">
          <div className="cf-fu-labels" role="group" aria-label="Four speculative futures">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.key}
                type="button"
                className={i === active ? "is-on" : undefined}
                style={{ "--cf-dot": s.color } as CSSProperties}
                aria-current={i === active ? "true" : undefined}
                onClick={() => goTo(i)}
              >
                <span className="cf-fu-dot" aria-hidden="true" />
                {s.name}
              </button>
            ))}
          </div>
          {/* four segments on the same columns as the four tabs above; the
              active persona's segment fills in that persona's color */}
          <div className="cf-fu-progress" aria-hidden="true">
            {SCENARIOS.map((s, i) => (
              <span
                key={s.key}
                className={`cf-fu-seg${i === active ? " is-on" : ""}`}
                style={{ "--cf-dot": s.color } as CSSProperties}
              />
            ))}
          </div>
          <p className="cf-fu-hint" aria-hidden="true">
            swipe sideways
          </p>
        </div>

        <div className="cf-fu-viewport" ref={viewportRef}>
          <div className="cf-fu-track" ref={trackRef}>
            {SCENARIOS.map((s, si) => (
              <section
                className="cf-fu-panel"
                key={s.key}
                style={{ "--cf-sc": s.color } as CSSProperties}
                aria-label={s.name}
              >
                <p className="cf-stage-tagline">{s.tagline}</p>
                <div
                  className="cf-diagram"
                  role="img"
                  aria-label={`Power diagram: ${NODES[s.authority]} holds the final say`}
                >
                  {NODES.map((n, i) => (
                    <div
                      className={`cf-node${s.authority === i ? " has-say" : ""}`}
                      key={n}
                    >
                      <span className="cf-node-name">{n}</span>
                      <span className="cf-node-say">final say</span>
                    </div>
                  ))}
                  <div className="cf-lane cf-lane-a">
                    <span className={`cf-arrow is-${s.laneA.dir}`} />
                    <span className="cf-lane-verb">{s.laneA.verb}</span>
                  </div>
                  <div className="cf-lane cf-lane-b">
                    <span className={`cf-arrow is-${s.laneB.dir}`} />
                    <span className="cf-lane-verb">{s.laneB.verb}</span>
                  </div>
                </div>
                <figure className="cf-futures-flow">
                  <button
                    type="button"
                    className="cf-futures-flow-btn"
                    onClick={(e) => {
                      zoomTriggerRef.current = e.currentTarget;
                      setZoom(si);
                    }}
                    aria-label={`Inspect the full ${s.name} decision flow at full size`}
                  >
                    <span className="cf-futures-flow-media">
                      <Image
                        src={s.flow.src}
                        alt={s.flow.alt}
                        width={s.flow.width}
                        height={s.flow.height}
                        sizes="(max-width: 900px) 100vw, 1120px"
                        // only the first panel is on screen at rest; the other
                        // three load as the carousel brings them in
                        loading={si === 0 ? "eager" : "lazy"}
                      />
                    </span>
                  </button>
                  <figcaption>
                    Working flow from the team’s Figma — {s.flow.line}.
                    <InteractiveCue className="cf-fu-zoom-cue">
                      Click the flow to inspect it at full size.
                    </InteractiveCue>
                  </figcaption>
                </figure>
                <p className="cf-verdict">
                  <span className="cf-verdict-quote">“{s.verdict.quote}”</span>
                  <span className="cf-verdict-source">{s.verdict.source}</span>
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
      {zoom !== null &&
        // portal to body: the page sections isolate their stacking contexts
        // and the site nav sits at z-index 1000 — the dialog must clear both
        createPortal(
        <div
          className="cf-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${SCENARIOS[zoom].name} — full decision flow`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setZoom(null);
          }}
        >
          <div className="cf-lightbox-bar">
            <span className="cf-lightbox-title">
              {SCENARIOS[zoom].name} · decision flow · 1:1
            </span>
            <button
              type="button"
              className="cf-lightbox-close"
              ref={zoomCloseRef}
              onClick={() => setZoom(null)}
            >
              Close · Esc
            </button>
          </div>
          {/* data-lenis-prevent keeps Lenis's window smoothing from eating
              the wheel; the flows pan natively inside the dialog */}
          <div className="cf-lightbox-scroll" tabIndex={0} data-lenis-prevent>
            {/* plain img on purpose: the artifact at its native 2400px, no
                responsive resizing between the reader and the pixels */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SCENARIOS[zoom].flow.src}
              alt={SCENARIOS[zoom].flow.alt}
              width={SCENARIOS[zoom].flow.width}
              height={SCENARIOS[zoom].flow.height}
            />
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

/* ── 03 · the hi-fi world: one case, two seats ─────────────────────────── */

const SEATS = [
  {
    key: "customer",
    label: "Customer’s seat",
    figures: [
      {
        src: "/media/work/cloud-futures/voice-boundary-trim.png",
        width: 2880,
        height: 1520,
        alt: "Voice assistant showing its duplicate-charge evidence, then explaining refund authorization requires human verification",
        caption:
          "The AI names its own boundary — it can detect and analyze the duplicate charge, but refund authorization requires a human. It asks before preparing the handoff.",
      },
      {
        src: "/media/work/cloud-futures/voice-packet-trim.png",
        width: 2880,
        height: 1520,
        alt: "Case packet assembling: transaction receipts, timestamp analysis, and a voice transcript shared with consent",
        caption:
          "With consent given, the AI assembles receipts, timeline analysis, and the voice transcript into a case packet — so nobody re-explains anything.",
      },
    ],
  },
  {
    key: "agent",
    label: "Agent’s seat",
    figures: [
      {
        src: "/media/work/cloud-futures/agent-locked.png",
        width: 2880,
        height: 1960,
        alt: "Agent console showing the AI case packet and a refund locked pending human verification",
        caption:
          "The same packet lands on the agent’s desk. The refund is prepared but locked — “verify to enable.”",
      },
      {
        src: "/media/work/cloud-futures/agent-live.png",
        width: 2880,
        height: 1960,
        alt: "Agent console after human verification, with the refund release now an enabled human action",
        caption:
          "Only after the human confirms does the refund action go live. The AI reads, summarizes, and prepares — it never touches the money.",
      },
    ],
  },
] as const;

export function CfSeats() {
  const [active, setActive] = useState(0);
  const seat = SEATS[active];

  return (
    <div className="cf-seats">
      <div className="cf-seats-switch" role="group" aria-label="Two seats of the same case">
        {SEATS.map((s, i) => (
          <button
            key={s.key}
            type="button"
            className={`cf-chip${i === active ? " is-on" : ""}`}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="cf-seats-panel" key={seat.key}>
        {seat.figures.map((f, i) => (
          <figure className="cf-seat-fig" key={f.src}>
            <div className="cf-seat-media">
              <Image
                src={f.src}
                alt={f.alt}
                width={f.width}
                height={f.height}
                sizes="(max-width: 900px) 100vw, 1080px"
                priority={false}
              />
            </div>
            <figcaption className="cf-seat-cap">
              <span className="cf-fig-index">
                Fig. {active === 0 ? `0${2 + i}` : `0${4 + i}`}
              </span>
              {f.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
