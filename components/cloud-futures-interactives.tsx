"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
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
  flow: { src: string; width: number; height: number; line: string };
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
      line: "severity triage deciding whether a human ever enters",
    },
  },
];

export function CfFutures() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const sc = SCENARIOS[active];

  // Desktop: the stage pins (position: sticky) and scroll scrubs through the
  // four power structures — one quarter of the runway each. Mobile keeps the
  // plain tab switcher; no-JS renders scenario one as a static block.
  useEffect(() => {
    const unsub = subscribeLenis((l) => {
      lenisRef.current = l;
    });
    const narrow = window.matchMedia("(max-width: 900px)");
    if (narrow.matches) return unsub;
    let raf = 0;
    const liveId = requestAnimationFrame(() => setLive(true));
    const update = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
      const idx = Math.min(3, Math.floor(p * 4));
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
    setActive(i);
    const el = wrapRef.current;
    if (!live || !el) return;
    const vh = window.innerHeight;
    const y =
      el.getBoundingClientRect().top +
      window.scrollY +
      ((i + 0.5) / 4) * (el.offsetHeight - vh);
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div
      className={`cf-futures${live ? " is-live" : ""}`}
      ref={wrapRef}
      style={{ "--cf-sc": sc.color } as CSSProperties}
    >
      <div className="cf-futures-stage">
      <div className="cf-futures-tabs" role="group" aria-label="Four speculative futures">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.key}
            type="button"
            className={`cf-chip cf-chip--dot${i === active ? " is-on" : ""}`}
            style={{ "--cf-dot": s.color } as CSSProperties}
            aria-pressed={i === active}
            onClick={() => goTo(i)}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="cf-stage" key={sc.key}>
        <p className="cf-stage-tagline">{sc.tagline}</p>
        <div
          className="cf-diagram"
          role="img"
          aria-label={`Power diagram: ${NODES[sc.authority]} holds the final say`}
        >
          {NODES.map((n, i) => (
            <div
              className={`cf-node${sc.authority === i ? " has-say" : ""}`}
              key={n}
            >
              <span className="cf-node-name">{n}</span>
              <span className="cf-node-say">final say</span>
            </div>
          ))}
          <div className="cf-lane cf-lane-a">
            <span className={`cf-arrow is-${sc.laneA.dir}`} />
            <span className="cf-lane-verb">{sc.laneA.verb}</span>
          </div>
          <div className="cf-lane cf-lane-b">
            <span className={`cf-arrow is-${sc.laneB.dir}`} />
            <span className="cf-lane-verb">{sc.laneB.verb}</span>
          </div>
        </div>
        <figure className="cf-futures-flow">
          <div className="cf-futures-flow-media">
            <Image
              src={sc.flow.src}
              alt={`Decision-flow diagram for ${sc.name}`}
              width={sc.flow.width}
              height={sc.flow.height}
              sizes="(max-width: 900px) 100vw, 1120px"
            />
          </div>
          <figcaption>
            Working flow from the team’s Figma — {sc.flow.line}
          </figcaption>
        </figure>
        <p className="cf-verdict">
          <span className="cf-verdict-quote">“{sc.verdict.quote}”</span>
          <span className="cf-verdict-source">{sc.verdict.source}</span>
        </p>
      </div>
      </div>
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
        src: "/media/work/cloud-futures/voice-boundary.png",
        alt: "Voice assistant showing its duplicate-charge evidence, then explaining refund authorization requires human verification",
        caption:
          "The AI names its own boundary — it can detect and analyze the duplicate charge, but refund authorization requires a human. It asks before preparing the handoff.",
      },
      {
        src: "/media/work/cloud-futures/voice-packet.png",
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
        alt: "Agent console showing the AI case packet and a refund locked pending human verification",
        caption:
          "The same packet lands on the agent’s desk. The refund is prepared but locked — “verify to enable.”",
      },
      {
        src: "/media/work/cloud-futures/agent-live.png",
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
                width={2880}
                height={1960}
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
