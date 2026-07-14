import type { Project } from "@/data/projects";
import Image from "next/image";
import { Roboto, Roboto_Mono } from "next/font/google";
import { OffscreenVideo } from "@/components/ui/offscreen-video";
import { InteractiveCue } from "@/components/ui/interactive-cue";
import {
  CfWorlds,
  CfFutures,
  CfSeats,
} from "@/components/cloud-futures-interactives";
import { CfCaseRail, CfGate } from "@/components/cloud-futures-scroll";
import { CaseNext } from "@/components/case-next";
import { OutcomeBand } from "@/components/ui/outcome-band";
import { stripCssComments } from "@/lib/css-sanitize";

// Cloud Support Futures — a Cornell × Google Cloud sponsored studio.
// The page adopts the work's own design language wholesale (owner rule
// 2026-07-07, design skill "per-work typefaces"): a "Google Sans"-first →
// Roboto stack for text and Roboto Mono for the data voice, page-scoped via
// next/font — site chrome keeps the global fonts. The case accent is the
// product world's blue, the four mid-fi scenarios carry the four product
// colors as wayfinding, and one seal-red moment closes the page.
// Bespoke layout per the vicino precedent (scoped critical CSS, switched in
// app/work/[slug]/page.tsx). Prose comes from data/projects.ts; the diagram
// and interactive structures live with their components.
// Server component, no state: all client behavior lives in the imported
// interactives/scroll components. All page styling is one scoped template
// literal at the end of the file (comments stripped at injection via
// stripCssComments) — keep section banners outside that literal.

/* ---- page fonts ---- */
const cfSans = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--cf-roboto",
});

const cfMonoFont = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--cf-roboto-mono",
});

/* ---- framework decks: principles and tensions ---- */
const PRINCIPLES = [
  {
    num: "1",
    name: "Human agency as the anchor",
    line: "Final authority remains human.",
  },
  {
    num: "2",
    name: "Emotional intelligence, not performance",
    line: "Affect shapes tone, not outcomes.",
  },
  {
    num: "3",
    name: "Procedural fairness",
    line: "Priority stays explainable.",
  },
  {
    num: "4",
    name: "Role clarity with accountability",
    line: "Every handoff names responsibility.",
  },
];

// lean = where this study's final world settled on each axis (0 = fully the
// left value, 100 = fully the right) — read off the framework decisions:
// authority cues stay visible even when they add friction (transparency);
// human verification is kept at the cost of speed (dignity); the human's
// contextual override outranks rigid consistency; trust is earned by the
// evidence packet, not a familiar face; and asking for a person costs nothing.
const TENSIONS = [
  { a: "Transparency", b: "Experience", lean: 32 },
  { a: "Efficiency", b: "Dignity", lean: 66 },
  { a: "Consistency", b: "Contextual judgment", lean: 62 },
  { a: "Trust by familiarity", b: "Trust by competence", lean: 70 },
  { a: "Open access", b: "Gatekeeping", lean: 34 },
];

/* ---- brief and review decks ---- */
const RQS = [
  {
    num: "RQ 1",
    q: "What emerging trends and technologies are shaping the evolution of customer support?",
  },
  {
    num: "RQ 2",
    q: "What are the alternative futures of the social experience of human–AI interaction in support?",
  },
  {
    num: "RQ 3",
    q: "What are the social implications of those alternative futures?",
  },
];

const INSIGHTS = [
  {
    lead: "Hybrid beats either pole.",
    line: "AI handles volume; humans keep judgment and accountability.",
  },
  {
    lead: "The agency gap is real.",
    line: "Most systems explain AI; few let users redirect it.",
  },
  {
    lead: "Context is plural.",
    line: "Console, CLI, API, and infra-as-code users bring different support contexts.",
  },
  {
    lead: "Proactive is the new bar.",
    line: "The strongest systems help before a ticket exists.",
  },
];

const INDUSTRY_CASES = [
  ["GitHub Copilot", "Visible AI progress"],
  ["Intercom Fin", "Confidence-based handoff"],
  ["Qatar Airways", "Proactive assistance"],
  ["Alibaba", "Emotion-aware risk"],
  ["Apple Genius Bar", "Human expertise as trust"],
];

const METHOD_STEPS = [
  {
    label: "Foundations",
    line: "Literature across five domains · six systems benchmarked",
  },
  {
    label: "Lo-fi probes",
    line: "Four sessions walk two extreme worlds",
  },
  {
    label: "Mid-fi films",
    line: "Nine sessions judge four power structures",
  },
  {
    label: "Hi-fi world",
    line: "The surviving values, built and filmed",
  },
];

const PROCESS_PHASES = [
  {
    label: "Discover",
    note: "Landscape",
    items: [
      "Human-AI support literature",
      "Competitor benchmark",
    ],
  },
  {
    label: "Define",
    note: "Problem frame",
    items: [
      "Research questions",
      "Opportunity split",
    ],
  },
  {
    label: "Develop",
    note: "Speculative probes",
    items: [
      "Future concepts",
      "Lo-fi testing",
    ],
  },
  {
    label: "Deliver",
    note: "Chosen world",
    items: [
      "High-fidelity prototype",
      "Client research report",
    ],
  },
];

/* ---- lo-fi probe decks ---- */
const EMOTION_FLOW = [
  "Support problem",
  "Glowing support cue",
  "User asks AI",
  "AI reads question + affect",
  "Emotion threshold",
  "Human escalation",
];

const LOW_FI_WIREFRAME = {
  src: "/media/work/cloud-futures/evidence-low-fi-wireframes.png",
  alt: "Slide with two grayscale billing-console wireframes side by side: an AI-only world where an assistant popup interrupts the cost table offering unprompted help, and a human-agent-only world with a support chat window and a wait in the queue.",
  label: "Slide 17",
  title: "Two deliberately plain support worlds",
  line: "Plain screens kept the conversation on authority, escalation, and emotional safety.",
};

const LOW_FI_EVIDENCE = [
  {
    src: "/media/work/cloud-futures/evidence-low-fi-probes.png",
    alt: "Findings slide from interviews with four GCP free-trial users, four themes each with a quote: resistance to unsolicited AI intervention, need for clear role boundaries, need for predictable escalation pathways, and emotional safety concerns when money is involved.",
    label: "Slide 18",
    title: "Users wanted speed without invisible AI.",
    line: "Unsolicited AI, unclear handoff, and emotional safety became the risks to carry forward.",
  },
];

const AFFINITY_CLUSTERS = [
  {
    theme: "Role boundaries",
    line: "Who is answering — and who is accountable for the answer?",
  },
  {
    theme: "Unsolicited AI",
    line: "Helpful when invited; unsettling when it arrives on its own.",
  },
  {
    theme: "Escalation paths",
    line: "The handoff must be visible, and asking for a person can’t cost anything.",
  },
  {
    theme: "Emotional safety",
    line: "Never reward distress, never imitate empathy.",
  },
];

/* ---- mid-fi evidence decks ---- */
const MID_FI_EVIDENCE = [
  {
    src: "/media/work/cloud-futures/evidence-mid-fi-quotes.png",
    alt: "Four participant quotes grouped under authority, accountability, emotional inference, and role clarity — P5 notes scenario 3 is the only one where human workers clearly decide over AI; P4 asks whether the AI is a tool or a monitor-manager.",
    label: "Slide 21",
    title: "Participants judged authority before accuracy.",
    line: "Accountability, emotion, and role clarity shaped trust more than raw automation speed.",
    width: 582,
    height: 520,
  },
  {
    src: "/media/work/cloud-futures/evidence-mid-fi-testing-02.png",
    alt: "Mid-fidelity billing console with a voice-assistant overlay reassuring a stressed customer, beside two session findings: P5 warns the emotion loophole invites exploitation at the company's cost, and P6 says visible human-AI conflict looks unprofessional.",
    label: "Slide 22",
    title: "Emotion-aware triage introduced fairness risk.",
    line: "Affective priority looked gameable and harder to justify.",
    width: 1080,
    height: 608,
  },
];

/* ---- framework evaluation decks ---- */
const EVALUATION_QUESTIONS = [
  ["Agency", "Who is in charge?"],
  ["Emotion", "Can feelings change priority?"],
  ["Fairness", "Can priority be explained?"],
  ["Accountability", "Who owns the decision?"],
];

const FRAMEWORK_EVIDENCE = [
  {
    src: "/media/work/cloud-futures/evidence-design-implications.png",
    alt: "Design-implications table with four rows — human agency, emotional boundaries, procedural fairness, role clarity — each mapped to what it means, how the interface implements it (authority cues on handoff, no affect detection, no emotion-based prioritization, visual separation of roles), and the risk accepted.",
    label: "Slide 26",
    title: "Each value had to change the interface.",
    line: "The implications table linked research values to UI choices and risks.",
  },
];

/* ---- synthesis and limits decks ---- */
// Process evidence only (the finished interfaces and the "human authorizes"
// verdict live in 07 · Final synthesis — one home per fact): two shots of the
// raw generated output, captioned for what the process produced.
const AI_PROTO_SHOTS = [
  {
    src: "/media/work/cloud-futures/ai-voice-prototype-packet-trim.png",
    alt: "AI-generated Google Cloud voice prototype: the billing console with the voice assistant mid-conversation over the duplicate-charge case.",
    caption:
      "First generated pass — the customer voice surface, running in the browser minutes after the prompt.",
    width: 2880,
    height: 1520,
  },
  {
    src: "/media/work/cloud-futures/ai-agent-interface-mid.png",
    alt: "AI-generated Google Cloud agent console draft showing queue state, customer messages, and flagged duplicate transactions.",
    caption:
      "The same run drafts the agent console — paused mid-flow and critiqued against the Material 3 guardrails.",
    width: 2880,
    height: 1960,
  },
];

const HI_FI_CHANGES = [
  {
    label: "Nurse-doctor metaphor expanded",
    before: "Emotional triage metaphor.",
    after: "AI prepares; human verifies.",
  },
  {
    label: "Emotional detector removed",
    before: "Affective priority looked gameable.",
    after: "Neutral care, no emotion priority.",
  },
  {
    label: "Authority cues made visible",
    before: "Decision power felt unclear.",
    after: "Refund action stays human-only.",
  },
];

const LIMITS_AND_NEXT = [
  {
    lead: "Speculative, not predictive.",
    line: "The scenarios are research probes for revealing tensions, not forecasts of how support systems will inevitably evolve.",
  },
  {
    lead: "Qualitative sample.",
    line: "Round 1 used four free-tier cloud users plus two expert conversations; Round 2 used nine graduate-student interviews, giving depth rather than population-level proof.",
  },
  {
    lead: "Emotional inference needs governance.",
    line: "Future work should test consent, transparency, and policy guardrails before emotion-aware triage becomes operational.",
  },
  {
    lead: "User control remains open.",
    line: "Further prototypes should let users tune AI assistance, contest triage, and choose escalation paths.",
  },
];

/* ---- case layout component ---- */
export function CloudFuturesCaseLayout({ project }: { project: Project }) {
  return (
    <article className={`cf-page ${cfSans.variable} ${cfMonoFont.variable}`}>
      <CfCaseRail />
      {/* ── hero ─────────────────────────────────────────────────────── */}
      <header className="cf-shell cf-hero" data-cf-stage="detect">
        <div className="cf-brandbar" data-fade>
          <div className="cf-brand-lockup cf-brand-google" aria-label="Google Cloud">
            <span className="cf-cloud-mark" aria-hidden="true">
              <span className="cf-cloud-blue" />
              <span className="cf-cloud-red" />
              <span className="cf-cloud-yellow" />
              <span className="cf-cloud-green" />
            </span>
            <span>Google Cloud</span>
          </div>
          <div className="cf-brand-plus">×</div>
          <div className="cf-brand-lockup cf-brand-cornell" aria-label="Cornell Bowers Information Science">
            <Image
              src="/media/work/cloud-futures/cornell-bowers-logo.png"
              alt="Cornell Bowers Information Science"
              width={769}
              height={133}
              sizes="(max-width: 900px) 180px, 260px"
            />
          </div>
        </div>
        <p className="cf-kicker" data-fade>
          <span className="cf-kicker-wave" aria-hidden="true">
            <i /><i /><i /><i /><i />
          </span>
          Google Cloud × Cornell · Sponsored studio — Fall 2025
        </p>
        <h1 className="cf-title" data-fade>
          {"Cloud Support Futures".split(" ").map((word, i) => (
            <span className="cf-title-word" key={word} style={{ ["--w" as string]: i }}>
              {word}
              {i < 2 ? " " : ""}
            </span>
          ))}
        </h1>
        <div className="cf-hero-rule" data-fade aria-hidden="true" />
        <div className="cf-grid cf-hero-row" data-fade>
          <p className="cf-lede">
            A research-led speculative design study for Google Cloud support:
            from literature review and market analysis to user testing, design
            principles, and one final world where
            <em> AI prepares, humans decide.</em>
          </p>
          <dl className="cf-meta">
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Timeline</dt>
              <dd>{project.duration}</dd>
            </div>
            <div>
              <dt>Team</dt>
              <dd>{project.teams}</dd>
            </div>
            <div>
              <dt>Method</dt>
              <dd>Research review · speculative testing · synthesis</dd>
            </div>
          </dl>
        </div>
        <figure className="cf-hero-proof" data-fade>
          <div className="cf-hero-proof-copy">
            <span>Source deck</span>
            <strong>Cornell MPS Project for Google Cloud</strong>
            <p>Final presentation cover, used here as project evidence and brand context.</p>
          </div>
          <div className="cf-hero-proof-media">
            <Image
              src="/media/work/cloud-futures/evidence-title-banner.png"
              alt="Final presentation cover for the Cornell MPS project for Google Cloud."
              width={1080}
              height={330}
              sizes="(max-width: 900px) 100vw, 760px"
              priority
            />
          </div>
        </figure>
      </header>

      {/* ── at a glance: the recruiter's skim row (audit #1) ── */}
      {project.outcomes && <OutcomeBand outcomes={project.outcomes} />}

      {/* ── 01 · brief ───────────────────────────────────────────────── */}
      <section className="cf-shell cf-section cf-section--light" aria-label="Brief">
        <div className="cf-grid">
          <p className="cf-rail" data-fade>
            01 · Brief
          </p>
          <div className="cf-body" data-fade>
            <h2 className="cf-h2">
              Imagine support five years out, then argue backwards.
            </h2>
            {project.summary?.map((p) => (
              <p className="cf-p" key={p.slice(0, 24)}>
                {p}
              </p>
            ))}
            <div className="cf-rqs" data-fade>
              {RQS.map((rq) => (
                <div className="cf-rq" key={rq.num}>
                  <span className="cf-rq-num">{rq.num}</span>
                  <p className="cf-rq-q">{rq.q}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="cf-method" data-fade>
          {METHOD_STEPS.map((s, i) => (
            <div className="cf-method-step" key={s.label} style={{ ["--i" as string]: i }}>
              <span className="cf-method-dot" />
              <span className="cf-method-label">{s.label}</span>
              <span className="cf-method-line">{s.line}</span>
            </div>
          ))}
        </div>
        <figure className="cf-process-viz" data-fade>
          <div className="cf-process-frame">
            <div className="cf-process-phases">
              {PROCESS_PHASES.map((phase, i) => (
                <section className="cf-process-phase" key={phase.label} style={{ ["--i" as string]: i }}>
                  <p className="cf-process-note">{phase.note}</p>
                  <h3>{phase.label}</h3>
                  <ul>
                    {phase.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
          <figcaption className="cf-cap">
            <span className="cf-fig-index">Rebuilt from proposal slide</span>
            The plan we pitched in week one — both Deliver items, the
            prototype and the client research report, shipped.
          </figcaption>
        </figure>
      </section>

      {/* ── 02 · foundational review ─────────────────────────────────── */}
      <section className="cf-shell cf-section cf-section--dark" aria-label="Foundational review" data-nav-dark data-cf-stage="ground">
        <span className="cf-section-bg" data-nav-dark aria-hidden="true" />
        <div className="cf-grid">
          <p className="cf-rail" data-fade>
            02 · Review
          </p>
          <div className="cf-body" data-fade>
            <h2 className="cf-h2">
              The literature pointed away from replacement and toward partnership.
            </h2>
            <p className="cf-p">
              The review gave us a testing frame: partnership, agency,
              context, and proactive help.
            </p>
          </div>
        </div>
        <div className="cf-insights" data-fade>
          {INSIGHTS.map((insight, i) => (
            <div className="cf-insight" key={insight.lead} style={{ ["--i" as string]: i }}>
              <h3 className="cf-insight-lead">{insight.lead}</h3>
              <p className="cf-insight-line">{insight.line}</p>
            </div>
          ))}
        </div>
        <div className="cf-industry" data-fade>
          <div className="cf-industry-head">
            <p className="cf-industry-eyebrow">Industry practices</p>
            <h3 className="cf-panel-title">
              Current products became evidence, not inspiration boards.
            </h3>
          </div>
          <div className="cf-industry-list">
            {INDUSTRY_CASES.map(([name, line], i) => (
              <div className="cf-industry-case" key={name} style={{ ["--i" as string]: i }}>
                <span className="cf-industry-index">{String(i + 1).padStart(2, "0")}</span>
                <h4>{name}</h4>
                <p>{line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 · lo-fi probes ────────────────────────────────────────── */}
      <section className="cf-shell cf-section cf-section--light" aria-label="Lo-fi probes" data-cf-stage="probe">
        <div className="cf-grid">
          <p className="cf-rail" data-fade>
            03 · Testing round 1
          </p>
          <div className="cf-body" data-fade>
            <h2 className="cf-h2">The first test rejected both extremes.</h2>
            <p className="cf-p">
              Four cloud users and two expert conversations compared two
              exaggerated support worlds. The useful result was not a
              preference; it was a boundary map for automation, handoff, and
              care.
            </p>
          </div>
        </div>
        <div className="cf-artifact" data-fade>
          <div className="cf-design-beat" data-fade>
            <div className="cf-design-beat-copy">
              <span className="cf-design-beat-kicker">Artifact</span>
              <h3>Wireframes made the extremes tangible.</h3>
              <p>
                They were intentionally plain, so participants critiqued the
                support model rather than visual polish.
              </p>
            </div>
            <figure className="cf-wireframe-proof">
              <div className="cf-wireframe-media">
                <Image
                  src={LOW_FI_WIREFRAME.src}
                  alt={LOW_FI_WIREFRAME.alt}
                  width={1440}
                  height={810}
                  sizes="(max-width: 900px) 100vw, 900px"
                />
              </div>
              <figcaption className="cf-cap">
                <span className="cf-fig-index">{LOW_FI_WIREFRAME.label}</span>
                {LOW_FI_WIREFRAME.line}
              </figcaption>
            </figure>
          </div>
          <div className="cf-evidence-set cf-evidence-set--solo" data-fade>
            {LOW_FI_EVIDENCE.map((item) => (
              <figure className="cf-evidence-card" key={item.src}>
                <div className="cf-evidence-media">
                  <Image src={item.src} alt={item.alt} width={1440} height={810} sizes="(max-width: 900px) 100vw, 1120px" />
                </div>
                <figcaption className="cf-evidence-caption">
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.line}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <figure className="cf-flow-viz">
            <div className="cf-flow-frame">
              <div className="cf-flow-warning">
                User metadata and emotional cues are shared and tracked
              </div>
              <div className="cf-flow-row">
                {EMOTION_FLOW.map((step, i) => (
                  <div
                    className={`cf-flow-step${i >= 4 ? " is-critical" : ""}`}
                    key={step}
                    style={{ ["--i" as string]: i }}
                  >
                    <span className="cf-flow-index">{String(i + 1).padStart(2, "0")}</span>
                    <span className="cf-flow-label">{step}</span>
                  </div>
                ))}
              </div>
              <div className="cf-flow-branch">
                <span>if affect reads high</span>
                <strong>priority jumps to human support</strong>
              </div>
              <div className="cf-flow-critique">
                <p>What this tested</p>
                <ul>
                  <li>Whether users accept emotion as support metadata</li>
                  <li>Whether distress becomes a gameable signal</li>
                  <li>Where the human handoff should be visible</li>
                </ul>
              </div>
            </div>
            <figcaption className="cf-cap">
              <span className="cf-fig-index">Rebuilt from lo-fi flow</span>
              The intentionally uncomfortable scenario is simplified into the
              research question it was built to provoke: when does emotional
              intelligence become emotional surveillance?
            </figcaption>
          </figure>
          <InteractiveCue className="cf-cue">
            Switch worlds — the two deliberately extreme supports round 1
            tested.
          </InteractiveCue>
          <CfWorlds />
          <p className="cf-finding">
            <span className="cf-finding-quote">
              “I want a balanced option — AI for speed and humans for empathy.”
            </span>
            <span className="cf-finding-source">Lo-fi probe participant</span>
          </p>
          <div className="cf-affinity">
            <p className="cf-affinity-title">Round 1 clustered into four questions.</p>
            <div className="cf-affinity-board">
              {AFFINITY_CLUSTERS.map((cluster, i) => (
                <section className="cf-affinity-cluster" key={cluster.theme} style={{ ["--i" as string]: i }}>
                  <h3>{cluster.theme}</h3>
                  <p>{cluster.line}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · four futures ────────────────────────────────────────── */}
      <section className="cf-shell cf-section cf-section--dark" aria-label="Four futures" data-nav-dark data-cf-stage="film">
        <span className="cf-section-bg" data-nav-dark aria-hidden="true" />
        <div className="cf-grid">
          <p className="cf-rail" data-fade>
            04 · Testing round 2
          </p>
          <div className="cf-body" data-fade>
            <h2 className="cf-h2">
              Four films made power visible enough to test.
            </h2>
            <p className="cf-p">
              Nine sessions watched four one-minute films of the same duplicate
              charge. Reactions converged on authority, fairness, and whether
              emotion should ever affect priority.
            </p>
          </div>
        </div>
        <div className="cf-artifact" data-fade>
          <figure className="cf-board-fig" data-fade>
            <div className="cf-board-media">
              <Image
                src="/media/work/cloud-futures/affinity-board.png"
                alt="Affinity map of raw insights from the nine mid-fi research sessions, color-coded by participant"
                width={2000}
                height={1405}
                sizes="(max-width: 900px) 100vw, 1120px"
              />
            </div>
            <figcaption className="cf-cap">
              <span className="cf-fig-index">Team Figma board</span>
              Every reaction from the nine sessions, affinity-mapped by
              participant before it was distilled — the verdicts below sit on
              top of this wall.
            </figcaption>
          </figure>
          <div className="cf-evidence-set" data-fade>
            {MID_FI_EVIDENCE.map((item) => (
              <figure className="cf-evidence-card" key={item.src}>
                <div className="cf-evidence-media">
                  <Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 900px) 100vw, 640px" />
                </div>
                <figcaption className="cf-evidence-caption">
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.line}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <InteractiveCue className="cf-cue">
            <span className="cf-cue-wide">
              Ride the scroll — the same billing case slides through four
              power structures.
            </span>
            <span className="cf-cue-narrow">
              Swipe sideways — the same billing case moves through four
              power structures.
            </span>
          </InteractiveCue>
          <CfFutures />
        </div>
      </section>

      {/* ── 05 · framework ───────────────────────────────────────────── */}
      <section className="cf-shell cf-section cf-section--light" aria-label="Framework" data-cf-stage="frame">
        <div className="cf-grid">
          <p className="cf-rail" data-fade>
            05 · Framework
          </p>
          <div className="cf-body" data-fade>
            <h2 className="cf-h2">Four principles, five open tensions.</h2>
            <p className="cf-p">
              The tests closed into one lens: AI can prepare the work, but
              humans must hold interpretation, accountability, and final action.
            </p>
          </div>
        </div>
        <figure className="cf-framework-viz" data-fade>
          <div className="cf-framework-frame">
            <div className="cf-framework-core">
              <span>Final lens</span>
              <strong>AI prepares. Humans decide.</strong>
            </div>
            <div className="cf-framework-principles">
              {PRINCIPLES.map((principle, i) => (
                <div className="cf-framework-principle" key={principle.num} style={{ ["--i" as string]: i }}>
                  <span>P{principle.num}</span>
                  <h3>{principle.name}</h3>
                  <p>{principle.line}</p>
                </div>
              ))}
            </div>
          </div>
          <figcaption className="cf-cap">
            <span className="cf-fig-index">Rebuilt from final framework</span>
            The framework is treated as a lens, not a checklist: every quadrant
            asks what the support system protects when AI becomes more capable.
          </figcaption>
        </figure>
        <div className="cf-tensions" data-fade>
          <p className="cf-tensions-anchor">
            Five tensions that stay open — managed, never resolved. The dot
            marks where the final world settled.
          </p>
          {TENSIONS.map((t, i) => (
            <div
              className="cf-tension"
              key={t.a}
              style={{ ["--i" as string]: i, ["--lean" as string]: `${t.lean}%` }}
            >
              <span className="cf-tension-side">{t.a}</span>
              <span className="cf-tension-bar">
                <span className="cf-tension-mark" />
              </span>
              <span className="cf-tension-side is-right">{t.b}</span>
            </div>
          ))}
        </div>
        <div className="cf-eval" data-fade>
          <h3 className="cf-panel-title">Questions we used to judge the final prototype</h3>
          <div className="cf-eval-list">
            {EVALUATION_QUESTIONS.map(([label, question]) => (
              <div className="cf-eval-item" key={label}>
                <span className="cf-eval-label">{label}</span>
                <span className="cf-eval-question">{question}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cf-evidence-set cf-evidence-set--solo" data-fade>
          {FRAMEWORK_EVIDENCE.map((item) => (
            <figure className="cf-evidence-card" key={item.src}>
              <div className="cf-evidence-media">
                <Image src={item.src} alt={item.alt} width={1080} height={608} sizes="(max-width: 900px) 100vw, 1120px" />
              </div>
              <figcaption className="cf-evidence-caption">
                <span>{item.label}</span>
                <strong>{item.title}</strong>
                <p>{item.line}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── 06 · AI prototyping ─────────────────────────────────────── */}
      <section className="cf-shell cf-section cf-section--dark" aria-label="AI prototyping" data-nav-dark data-cf-stage="build">
        <span className="cf-section-bg" data-nav-dark aria-hidden="true" />
        <div className="cf-grid">
          <p className="cf-rail" data-fade>
            06 · AI prototyping
          </p>
          <div className="cf-body" data-fade>
            <h2 className="cf-h2">
              AI prototyping worked because the product language was already mature.
            </h2>
            <p className="cf-p">
              This was my first serious test of direct AI-generated
              prototyping. Material 3 gave the model a stable grammar, so speed
              did not mean losing control over role boundaries.
            </p>
          </div>
        </div>
        <div className="cf-ai-motion-board" data-fade>
          <div className="cf-ai-motion-stage" aria-label="Animated path from research prompt to testable prototype">
            <div className="cf-motion-path" aria-hidden="true">
              <span />
            </div>
            <section className="cf-motion-tile cf-motion-tile--prompt">
              <span className="cf-motion-label">Prompt · the brief</span>
              <p>Duplicate charge. High anxiety. Refund requires human authority.</p>
              <ul className="cf-prompt-lines">
                <li>one case, two seats</li>
                <li>AI may detect, explain, prepare</li>
                <li>it never authorizes refunds</li>
              </ul>
            </section>
            <section className="cf-motion-tile cf-motion-tile--agent">
              <span className="cf-agent-slab">
                <span className="cf-gem-dot is-blue" />
                AI agent
              </span>
              <p className="cf-agent-sub">drafts both interfaces in code</p>
            </section>
            <section className="cf-motion-tile cf-motion-tile--rules">
              <span className="cf-motion-label">Material 3 guardrails</span>
              <ul className="cf-rule-stack">
                <li>Official color ramps only</li>
                <li>M3 shape · elevation · type</li>
                <li>Sentence case, no invented UI</li>
              </ul>
            </section>
            <section className="cf-motion-tile cf-motion-tile--packet">
              <span className="cf-motion-label">Case packet</span>
              <ul className="cf-packet-preview">
                <li>
                  <span className="cf-packet-dot is-red" />
                  Two charges, two seconds apart — flagged
                </li>
                <li>
                  <span className="cf-packet-tick" aria-hidden="true" />
                  Receipts + timestamp analysis
                </li>
                <li>
                  <span className="cf-packet-tick" aria-hidden="true" />
                  Voice transcript, shared with consent
                </li>
              </ul>
            </section>
            <section className="cf-motion-tile cf-motion-tile--test">
              <span className="cf-motion-label">Reviewable output</span>
              <ul className="cf-output-list">
                <li><strong>2</strong> working interfaces</li>
                <li><strong>22</strong>-scene customer walkthrough</li>
                <li><strong>6</strong>-step agent console</li>
              </ul>
              <p className="cf-output-status">
                <span className="cf-gem-dot is-green" />
                runs in the browser — pause, critique, test
              </p>
            </section>
          </div>
          <div className="cf-ai-motion-copy">
            <span>Process diagram</span>
            <h3>Prompt, guardrails, packet, review.</h3>
            <p>
              The motion is legible on purpose: it shows how the AI output
              stayed inside a system that researchers could pause, critique,
              and test.
            </p>
          </div>
        </div>
        <div className="cf-ai-gallery" data-fade>
          {AI_PROTO_SHOTS.map((shot, i) => (
            <figure className="cf-ai-shot" key={shot.src}>
              <div className="cf-ai-media">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width}
                  height={shot.height}
                  sizes="(max-width: 900px) 100vw, 640px"
                />
              </div>
              <figcaption className="cf-cap">
                <span className="cf-fig-index">AI prototype {String(i + 1).padStart(2, "0")}</span>
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── 07 · final synthesis ─────────────────────────────────────── */}
      <section className="cf-shell cf-section cf-section--light" aria-label="Final synthesis">
        <div className="cf-grid">
          <p className="cf-rail" data-fade>
            07 · Final synthesis
          </p>
          <div className="cf-body" data-fade>
            <h2 className="cf-h2">
              The prototype became the final research argument.
            </h2>
            <p className="cf-p">
              The final film and interfaces demonstrate one rule from testing:
              AI listens, organizes, and prepares; the human verifies and owns
              the outcome.
            </p>
          </div>
        </div>
        <div className="cf-hifi-changes" data-fade>
          <div className="cf-hifi-change-head">
            <p className="cf-hifi-eyebrow">From mid-fi to hi-fi</p>
            <h3 className="cf-panel-title">
              Testing turned scenarios into interaction rules.
            </h3>
          </div>
          <div className="cf-hifi-change-grid">
            {HI_FI_CHANGES.map((change, i) => (
              <article className="cf-hifi-change" key={change.label} style={{ ["--i" as string]: i }}>
                <span className="cf-hifi-index">{String(i + 1).padStart(2, "0")}</span>
                <h4>{change.label}</h4>
                <div className="cf-hifi-compare">
                  <p>
                    <span>Before</span>
                    {change.before}
                  </p>
                  <p>
                    <span>After</span>
                    {change.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <InteractiveCue className="cf-cue cf-cue--gate">
          Keep scrolling — authority shifts hand to hand until a person
          releases the refund.
        </InteractiveCue>
        <CfGate />
        <figure className="cf-film" data-fade>
          <div className="cf-film-frame">
            <OffscreenVideo
              src="/media/work/cloud-futures/hifi-film.mp4"
              poster="/media/work/cloud-futures/hifi-poster.png"
              className="cf-film-media"
              // ~24000px into the page: don't fetch 2.1MB of film at page top
              preload="none"
            />
          </div>
          <figcaption className="cf-cap">
            <span className="cf-fig-index">Fig. 01</span>
            The hi-fi film — a little over a minute — plays the duplicate-charge
            case end to end: two $89.99 charges land two seconds apart, the AI
            assistant flags the pattern and assembles the case packet, and a
            billing specialist verifies before the refund is released. Watch for
            the limitation card — the AI naming its own boundary before the
            human takes over.
          </figcaption>
        </figure>
        <div className="cf-artifact" data-fade>
          <InteractiveCue className="cf-cue">
            Switch seats — the same case packet, from either side of the
            handoff.
          </InteractiveCue>
          <CfSeats />
        </div>
      </section>

      {/* ── 08 · limits and next work ────────────────────────────────── */}
      <section className="cf-shell cf-section cf-section--dark" aria-label="Limits and future work" data-nav-dark data-cf-stage="decide">
        <span className="cf-section-bg" data-nav-dark aria-hidden="true" />
        <div className="cf-grid">
          <p className="cf-rail" data-fade>
            08 · Limits
          </p>
          <div className="cf-body" data-fade>
            <h2 className="cf-h2">
              The research opened questions the prototype should not pretend to close.
            </h2>
            <p className="cf-p">
              Because the work used speculative design, the goal was not to
              prove a market preference. It was to expose where human-AI
              support becomes socially fragile, then turn those tensions into a
              framework future teams can test more rigorously.
            </p>
          </div>
        </div>
        <div className="cf-limits" data-fade>
          {LIMITS_AND_NEXT.map((item, i) => (
            <div className="cf-limit" key={item.lead} style={{ ["--i" as string]: i }}>
              <h3 className="cf-limit-lead">{item.lead}</h3>
              <p className="cf-limit-line">{item.line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── closing · the speculative question ──────────────────────── */}
      <section className="cf-shell cf-close" aria-label="Closing question">
        <div className="cf-close-rule" data-fade aria-hidden="true" />
        <h2 className="cf-close-title" data-fade>
          {project.moment?.title}
        </h2>
        {project.moment?.body.map((p) => (
          <p className="cf-close-p" data-fade key={p.slice(0, 24)}>
            {p}
          </p>
        ))}
        <p className="cf-signoff" data-fade>
          <span className="cf-signoff-main">
            Voice-first. Human when it matters.
          </span>
          <span className="cf-signoff-meta">
            Cornell Bowers CIS × Google Cloud — Fall 2025
          </span>
        </p>
      </section>

      <CaseNext slug={project.slug} />

      {/* ---- scoped case css ---- */}
      <style
        dangerouslySetInnerHTML={{
          __html: stripCssComments(`
        .cf-page {
          --case-accent: #1a73e8;
          --case-accent-soft: #e8f0fe;
          --g-blue: #4285f4;
          --g-red: #ea4335;
          --g-yellow: #fbbc04;
          --g-green: #34a853;
          --cf-ink: #101216;
          --cf-stone: rgba(16, 18, 22, 0.62);
          --cf-sans: "Google Sans", var(--cf-roboto), "Helvetica Neue", Arial, sans-serif;
          --cf-mono: var(--cf-roboto-mono), "Roboto Mono", monospace;
          --icue-accent: var(--case-accent);
          background: #ffffff;
          color: var(--cf-ink);
          font-family: var(--cf-sans);
          padding-top: clamp(140px, 18vh, 220px);
          padding-bottom: 0;
          overflow-x: clip;
        }
        .cf-shell {
          width: min(var(--work-shell-max, 1440px), 100% - 2 * var(--work-gutter, clamp(24px, 5vw, 72px)));
          margin-inline: auto;
        }
        /* outcome band — Google voice: cf-shell geometry, Roboto Mono
           labels in the product blue, hairlines in the page's own rule */
        .cf-page .ob-band {
          --ob-max: none;
          width: min(var(--work-shell-max, 1440px), 100% - 2 * var(--work-gutter, clamp(24px, 5vw, 72px)));
          --ob-pad-x: 0px;
          --ob-mono: var(--cf-mono);
          --ob-rule: rgba(16, 18, 22, 0.14);
          --ob-detail: var(--case-accent);
          --ob-body: var(--cf-stone);
          --ob-stat-ink: var(--cf-ink);
          margin-top: calc(var(--gap-block, 48px) * 0.75);
        }
        .cf-grid {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: clamp(16px, 2vw, 32px);
        }
        .cf-section {
          position: relative;
          isolation: isolate;
          padding-block: calc(var(--gap-section) / 2);
        }
        .cf-section::before,
        .cf-close::before {
          content: "";
          position: absolute;
          inset-block: 0;
          left: 50%;
          width: 100vw;
          transform: translateX(-50%);
          z-index: -1;
          pointer-events: none;
        }
        /* the four-color band lives in exactly two places now: the hero rule
           and the fixed reading-progress bar — not on every section seam */
        .cf-progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          z-index: 90;
          pointer-events: none;
        }
        .cf-progress span {
          display: block;
          height: 100%;
          transform: scaleX(0);
          transform-origin: 0 50%;
          background:
            linear-gradient(90deg, var(--g-blue), var(--g-blue) 25%, var(--g-red) 25%, var(--g-red) 50%, var(--g-yellow) 50%, var(--g-yellow) 75%, var(--g-green) 75%);
        }
        .cf-rail-nav {
          position: fixed;
          left: clamp(12px, 1.6vw, 28px);
          top: 50%;
          translate: 0 -50%;
          z-index: 70;
          display: grid;
          gap: 16px;
        }
        @media (max-width: 1280px) {
          .cf-rail-nav { display: none; }
        }
        .cf-rail-nav button {
          appearance: none;
          border: 0;
          background: transparent;
          padding: 2px;
          position: relative;
          display: flex;
          align-items: center;
          cursor: pointer;
          color: var(--cf-ink);
        }
        .cf-rail-nav button:focus-visible {
          outline: var(--focus-ring);
          outline-offset: var(--focus-offset);
        }
        .cf-rail-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          border: 1px solid rgba(16, 18, 22, 0.44);
          background: transparent;
          flex: none;
          transition: background var(--dur-fast) ease, border-color var(--dur-fast) ease, transform var(--dur-fast) ease;
        }
        .cf-rail-label {
          /* out of flow: the button hit area stays dot-sized, so the fixed
             rail never reaches into the content column even invisibly */
          position: absolute;
          left: calc(100% + 8px);
          top: 50%;
          font-family: var(--cf-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          translate: -4px -50%;
          transition: opacity var(--dur-fast) ease, translate var(--dur-fast) ease;
        }
        /* labels expand on hover/focus only — the active state keeps just the
           lit dot, so the fixed rail never reaches into the content column
           (at 1536 the shell gutter is 72px; a resting label would cross it) */
        .cf-rail-nav button:hover .cf-rail-label,
        .cf-rail-nav button:focus-visible .cf-rail-label {
          opacity: 0.66;
          translate: 0 -50%;
        }
        .cf-rail-nav button.is-on .cf-rail-dot {
          background: var(--case-accent);
          border-color: var(--case-accent);
          transform: scale(1.25);
        }
        .cf-rail-nav.is-dark button { color: #f8fafd; }
        .cf-rail-nav.is-dark .cf-rail-dot { border-color: rgba(248, 250, 252, 0.44); }
        .cf-rail-nav.is-dark button.is-on .cf-rail-dot {
          background: #8ab4f8;
          border-color: #8ab4f8;
        }
        .cf-section--light::before {
          background:
            linear-gradient(90deg, rgba(66, 133, 244, 0.035), transparent 20%, transparent 78%, rgba(52, 168, 83, 0.032)),
            #ffffff;
        }
        .cf-section--dark {
          --rule: rgba(248, 250, 252, 0.18);
          --case-accent: #8ab4f8;
          --case-accent-soft: rgba(138, 180, 248, 0.18);
          --icue-text: rgba(248, 250, 252, 0.62);
          color: #f8fafd;
        }
        .cf-section--dark::before {
          background:
            linear-gradient(90deg, rgba(66, 133, 244, 0.16), transparent 26%, transparent 72%, rgba(251, 188, 4, 0.10)),
            #101216;
        }
        .cf-section-bg {
          position: absolute;
          inset-block: 0;
          left: 50%;
          width: 100vw;
          transform: translateX(-50%);
          z-index: 0;
          display: block;
          background:
            linear-gradient(90deg, rgba(66, 133, 244, 0.16), transparent 26%, transparent 72%, rgba(251, 188, 4, 0.10)),
            #101216;
        }
        .cf-section > :not(.cf-section-bg) {
          position: relative;
          z-index: 1;
        }
        .cf-section--dark .cf-rail,
        .cf-section--dark .cf-p,
        .cf-section--dark .cf-method-line,
        .cf-section--dark .cf-insight-line,
        .cf-section--dark .cf-industry-case p,
        .cf-section--dark .cf-worlds-reaction,
        .cf-section--dark .cf-lane-verb,
        .cf-section--dark .cf-verdict-source,
        .cf-section--dark .cf-limit-line,
        .cf-section--dark .cf-cap,
        .cf-section--dark .cf-seat-cap,
        .cf-section--dark .cf-finding-source {
          color: rgba(248, 250, 252, 0.68);
        }
        .cf-section--dark .cf-h2,
        .cf-section--dark .cf-panel-title,
        .cf-section--dark .cf-insight-lead,
        .cf-section--dark .cf-industry-case h4,
        .cf-section--dark .cf-worlds-name,
        .cf-section--dark .cf-stage-tagline,
        .cf-section--dark .cf-node-name,
        .cf-section--dark .cf-verdict-quote,
        .cf-section--dark .cf-limit-lead {
          color: #f8fafd;
        }
        .cf-section--dark .cf-chip {
          color: #f8fafd;
          border-color: rgba(248, 250, 252, 0.24);
          background: rgba(248, 250, 252, 0.03);
        }
        .cf-section--dark .cf-chip:hover {
          border-color: rgba(248, 250, 252, 0.48);
        }
        .cf-section--dark .cf-chip.is-on {
          color: #101216;
          border-color: #8ab4f8;
          background: #8ab4f8;
        }
        .cf-section--dark .cf-industry-case {
          /* opaque: the section's tinted wash must not bleed through cells */
          background: #191c22;
        }
        .cf-section--dark .cf-industry-index {
          color: #8ab4f8;
        }

        .cf-brandbar {
          display: flex;
          align-items: center;
          gap: clamp(14px, 1.6vw, 24px);
          margin-bottom: clamp(34px, 4vw, 64px);
          padding-bottom: clamp(18px, 2vw, 26px);
          border-bottom: 1px solid var(--rule);
        }
        .cf-brand-lockup {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #202124;
        }
        .cf-brand-google {
          font-family: "Google Sans", var(--cf-sans);
          font-size: clamp(22px, 1.8vw, 30px);
          font-weight: 500;
          letter-spacing: 0;
        }
        .cf-cloud-mark {
          position: relative;
          width: 42px;
          height: 30px;
          flex: none;
          display: block;
        }
        .cf-cloud-mark span {
          position: absolute;
          display: block;
          border-radius: 999px;
        }
        .cf-cloud-blue {
          left: 5px;
          bottom: 3px;
          width: 31px;
          height: 16px;
          border: 5px solid var(--g-blue);
          border-top-color: transparent;
          background: transparent;
        }
        .cf-cloud-red {
          left: 18px;
          top: 2px;
          width: 18px;
          height: 18px;
          border: 5px solid var(--g-red);
          border-left-color: transparent;
          background: transparent;
        }
        .cf-cloud-yellow {
          left: 1px;
          top: 10px;
          width: 18px;
          height: 16px;
          border: 5px solid var(--g-yellow);
          border-right-color: transparent;
          background: transparent;
        }
        .cf-cloud-green {
          left: 14px;
          bottom: 0;
          width: 25px;
          height: 10px;
          background: var(--g-green);
        }
        .cf-brand-plus {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--cf-stone);
          text-transform: uppercase;
        }
        .cf-brand-cornell {
          padding-left: clamp(8px, 1vw, 14px);
        }
        .cf-brand-cornell img {
          display: block;
          width: clamp(190px, 19vw, 282px);
          height: auto;
        }

        .cf-hero-proof {
          margin: 0;
          display: grid;
          grid-template-columns: minmax(220px, 0.36fr) minmax(0, 0.64fr);
          gap: clamp(24px, 3vw, 48px);
          align-items: center;
          padding-top: clamp(20px, 2.4vw, 32px);
          border-top: 1px solid var(--rule);
        }
        .cf-hero-proof-copy {
          display: grid;
          gap: 10px;
          align-content: center;
          padding: clamp(10px, 1.2vw, 18px);
        }
        .cf-hero-proof-copy span {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--g-green);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .cf-hero-proof-copy strong {
          font-size: clamp(22px, 2vw, 34px);
          line-height: 1.12;
          font-weight: 500;
          max-width: 13em;
        }
        .cf-hero-proof-copy p {
          margin: 0;
          font-size: var(--text-label);
          line-height: 1.45;
          color: var(--cf-stone);
          max-width: 30ch;
        }
        .cf-hero-proof-media {
          overflow: hidden;
          border: 1px solid var(--rule);
          border-radius: 6px;
          background: #f1f3f4;
        }
        .cf-hero-proof-media img {
          display: block;
          width: 100%;
          height: auto;
        }

        .cf-kicker {
          margin: 0 0 clamp(20px, 2.6vw, 36px);
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: var(--text-label);
          letter-spacing: var(--track-label);
          text-transform: uppercase;
          color: var(--case-accent);
        }
        .cf-kicker-wave {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          height: 14px;
        }
        .cf-kicker-wave i {
          width: 3px;
          height: 14px;
          border-radius: 2px;
          background: var(--case-accent);
          transform: scaleY(0.55);
        }
        .cf-title-word { display: inline-block; }
        .cf-title-word:not(:last-child) { margin-right: 0.24em; }
        .cf-hero-rule {
          height: 4px;
          margin: 0 0 clamp(28px, 3.4vw, 48px);
          background:
            linear-gradient(90deg, var(--g-blue), var(--g-blue) 25%, var(--g-red) 25%, var(--g-red) 50%, var(--g-yellow) 50%, var(--g-yellow) 75%, var(--g-green) 75%);
        }
        .cf-title {
          /* Google-voice display: sentence case, tight but readable */
          margin: 0 0 clamp(28px, 3.4vw, 48px);
          font-family: var(--cf-sans);
          font-size: clamp(56px, 7.4vw, 116px);
          font-weight: 500;
          line-height: 1.02;
          letter-spacing: -0.02em;
        }
        .cf-hero-row { align-items: end; margin-bottom: var(--gap-block); }
        .cf-lede {
          grid-column: 1 / 8;
          margin: 0;
          font-size: clamp(20px, 1.8vw, 26px);
          line-height: 1.5;
          max-width: 30em;
        }
        .cf-lede em { font-style: normal; color: var(--case-accent); }
        .cf-meta {
          grid-column: 9 / 13;
          margin: 0;
          display: grid;
          gap: 14px;
          align-content: end;
        }
        .cf-meta div { display: grid; grid-template-columns: 88px 1fr; gap: 12px; }
        .cf-meta dt {
          font-size: var(--text-label);
          letter-spacing: var(--track-label);
          text-transform: uppercase;
          color: var(--cf-stone);
        }
        .cf-meta dd { margin: 0; font-size: var(--text-body); line-height: 1.4; }

        .cf-film { margin: var(--gap-block) 0 0; }
        .cf-film-frame {
          border: 1px solid var(--rule);
          border-radius: 8px;
          overflow: hidden;
          background: #05070a;
        }
        .cf-film-media { display: block; width: 100%; aspect-ratio: 1870 / 960; object-fit: cover; }
        .cf-cap {
          display: flex; gap: 12px; align-items: baseline;
          margin-top: 14px;
          font-size: var(--text-meta);
          line-height: 1.5;
          color: var(--cf-stone);
          max-width: 62ch;
        }
        .cf-fig-index {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
          flex: none;
        }
        .cf-process-viz, .cf-flow-viz, .cf-framework-viz {
          margin: var(--gap-block) 0 0;
        }
        .cf-flow-viz {
          margin-top: 0;
          margin-bottom: var(--gap-block);
        }
        .cf-process-frame, .cf-flow-frame, .cf-framework-frame {
          border: 1px solid var(--rule);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.58);
          overflow: hidden;
        }
        .cf-process-frame {
          display: grid;
          gap: clamp(18px, 2vw, 28px);
          padding: clamp(18px, 2.4vw, 34px);
        }
        .cf-process-phases {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(12px, 1.6vw, 22px);
        }
        .cf-process-phase {
          display: grid;
          gap: 12px;
          align-content: start;
          min-height: 240px;
          padding: clamp(16px, 2vw, 24px);
          border: 1px solid var(--rule);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.68);
        }
        .cf-process-note {
          margin: 0;
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .cf-process-phase h3 {
          margin: 0;
          font-size: clamp(24px, 2.1vw, 34px);
          font-weight: 500;
          line-height: 1.08;
        }
        .cf-process-phase ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 10px;
        }
        .cf-process-phase li {
          position: relative;
          padding-left: 16px;
          font-size: var(--text-meta);
          line-height: 1.4;
          color: rgba(16, 18, 22, 0.78);
        }
        .cf-process-phase li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.7em;
          width: 8px;
          height: 1px;
          background: var(--case-accent);
        }

        .cf-flow-frame {
          /* warning semantics on purpose: this flow is the surveillance
             scenario the probe was built to make uncomfortable */
          display: grid;
          gap: clamp(20px, 2.4vw, 34px);
          padding: clamp(18px, 2.4vw, 32px);
          background: #fff9ee;
        }
        .cf-flow-warning {
          padding: 10px 14px;
          border: 1px solid rgba(176, 96, 0, 0.4);
          border-radius: 4px;
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          line-height: 1.4;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #8f5700;
          background: rgba(255, 255, 255, 0.56);
        }
        .cf-flow-row {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: clamp(10px, 1.1vw, 16px);
          align-items: stretch;
        }
        .cf-flow-step {
          position: relative;
          min-height: 116px;
          display: grid;
          align-content: center;
          gap: 8px;
          padding: 14px;
          border: 1px solid rgba(176, 96, 0, 0.26);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.76);
        }
        .cf-flow-step:not(:last-child)::after {
          content: "";
          position: absolute;
          left: calc(100% + 1px);
          top: 50%;
          width: clamp(10px, 1.1vw, 16px);
          height: 1px;
          background: rgba(176, 96, 0, 0.45);
        }
        .cf-flow-step.is-critical {
          border-color: rgba(176, 96, 0, 0.52);
          background: #fbeccc;
        }
        .cf-flow-index {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: #8f5700;
        }
        .cf-flow-label {
          font-size: var(--text-meta);
          line-height: 1.35;
          color: rgba(16, 18, 22, 0.84);
        }
        .cf-flow-branch {
          display: grid;
          gap: 4px;
          padding-top: 16px;
          border-top: 1px solid rgba(176, 96, 0, 0.34);
          text-align: center;
        }
        .cf-flow-branch span {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: #8f5700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .cf-flow-branch strong {
          font-size: clamp(20px, 1.7vw, 26px);
          line-height: 1.25;
          font-weight: 500;
        }
        .cf-flow-critique {
          display: grid;
          grid-template-columns: minmax(130px, 0.22fr) minmax(0, 1fr);
          gap: clamp(18px, 2vw, 30px);
          padding-top: 18px;
          border-top: 1px solid rgba(176, 96, 0, 0.26);
        }
        .cf-flow-critique p {
          margin: 0;
          font-size: var(--text-label);
          text-transform: uppercase;
          letter-spacing: var(--track-label);
          color: #8f5700;
        }
        .cf-flow-critique ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(14px, 1.6vw, 24px);
        }
        .cf-flow-critique li {
          font-size: var(--text-meta);
          line-height: 1.45;
          color: rgba(16, 18, 22, 0.78);
        }

        .cf-framework-frame {
          display: grid;
          grid-template-columns: minmax(220px, 0.85fr) minmax(0, 1.7fr);
          gap: clamp(18px, 2vw, 32px);
          padding: clamp(18px, 2.4vw, 34px);
          background:
            linear-gradient(90deg, rgba(66, 133, 244, 0.06), transparent 46%, rgba(66, 133, 244, 0.06)),
            rgba(255, 255, 255, 0.62);
        }
        .cf-framework-core {
          display: grid;
          gap: 10px;
          align-content: center;
          min-height: 320px;
          padding: clamp(18px, 2vw, 28px);
          border: 1px solid rgba(66, 133, 244, 0.34);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.72);
        }
        .cf-framework-core span {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .cf-framework-core strong {
          font-size: clamp(30px, 3.2vw, 54px);
          line-height: 1.02;
          font-weight: 500;
          max-width: 8em;
        }
        .cf-framework-principles {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(12px, 1.4vw, 20px);
        }
        .cf-framework-principle {
          display: grid;
          gap: 10px;
          align-content: start;
          min-height: 150px;
          padding: clamp(16px, 1.8vw, 24px);
          border: 1px solid rgba(66, 133, 244, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.72);
        }
        .cf-framework-principle span {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
        }
        .cf-framework-principle h3 {
          margin: 0;
          font-size: clamp(19px, 1.6vw, 24px);
          line-height: 1.2;
          font-weight: 500;
        }
        .cf-framework-principle p {
          margin: 0;
          font-size: var(--text-meta);
          line-height: 1.5;
          color: var(--cf-stone);
        }

        .cf-rail {
          grid-column: 1 / 4;
          margin: 0;
          font-family: var(--cf-mono);
          font-size: var(--text-label);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--cf-stone);
        }
        .cf-body { grid-column: 4 / 12; min-width: 0; }
        .cf-h2 {
          margin: 0 0 clamp(16px, 2vw, 26px);
          font-family: var(--cf-sans);
          font-size: clamp(34px, 3.4vw, 54px);
          font-weight: 400;
          line-height: 1.12;
          letter-spacing: -0.01em;
        }
        .cf-p {
          margin: 0 0 1em;
          font-size: var(--text-body);
          line-height: 1.58;
          max-width: 56ch;
          color: rgba(16, 18, 22, 0.86);
        }

        .cf-rqs {
          margin-top: clamp(28px, 3.4vw, 48px);
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(18px, 2.2vw, 32px);
        }
        .cf-rq {
          display: grid;
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid var(--rule);
        }
        .cf-rq-num {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
        }
        .cf-rq-q {
          margin: 0;
          font-size: var(--text-meta);
          line-height: 1.55;
          color: rgba(16, 18, 22, 0.8);
        }

        .cf-insights {
          margin-top: var(--gap-block);
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(18px, 2.2vw, 32px);
        }
        .cf-insight {
          display: grid;
          gap: 10px;
          align-content: start;
          padding-top: 16px;
          border-top: 1px solid var(--rule);
        }
        .cf-insight-lead {
          margin: 0;
          font-size: clamp(20px, 1.7vw, 24px);
          font-weight: 500;
          line-height: 1.3;
        }
        .cf-insight-line {
          margin: 0;
          font-size: var(--text-label);
          line-height: 1.45;
          color: var(--cf-stone);
        }

        .cf-panel-title {
          margin: 0;
          font-size: clamp(22px, 1.9vw, 28px);
          font-weight: 500;
          line-height: 1.3;
        }

        .cf-industry {
          margin-top: var(--gap-block);
          display: grid;
          grid-template-columns: minmax(220px, 0.34fr) minmax(0, 1fr);
          gap: clamp(24px, 3vw, 48px);
          align-items: start;
          padding-block: clamp(18px, 2.4vw, 30px);
          border-block: 1px solid var(--rule);
        }
        .cf-industry-head {
          display: grid;
          gap: 10px;
          align-content: start;
        }
        .cf-industry-eyebrow {
          margin: 0;
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .cf-industry-list {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 1px;
          background: var(--rule);
          border: 1px solid var(--rule);
        }
        .cf-industry-case {
          min-height: 142px;
          display: grid;
          gap: 8px;
          align-content: start;
          padding: clamp(16px, 1.6vw, 20px);
          background: #ffffff;
        }
        .cf-industry-index {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
        }
        .cf-industry-case h4 {
          margin: 0;
          font-size: clamp(17px, 1.35vw, 21px);
          line-height: 1.25;
          font-weight: 500;
        }
        .cf-industry-case p {
          margin: 0;
          font-size: var(--text-label);
          line-height: 1.42;
          color: var(--cf-stone);
        }

        .cf-method {
          margin-top: var(--gap-block);
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(16px, 2vw, 32px);
          position: relative;
          padding-top: 18px;
        }
        .cf-method::before {
          content: "";
          position: absolute;
          left: 0; right: 0; top: 3px;
          height: 1px;
          background: var(--rule);
        }
        .cf-method-step { position: relative; display: grid; gap: 6px; align-content: start; }
        .cf-method-dot {
          position: absolute; top: -18px; left: 0;
          width: 8px; height: 8px; border-radius: 9999px;
          background: var(--case-accent);
        }
        .cf-method-step:nth-child(1) .cf-method-dot { background: var(--g-blue); }
        .cf-method-step:nth-child(2) .cf-method-dot { background: var(--g-red); }
        .cf-method-step:nth-child(3) .cf-method-dot { background: var(--g-yellow); }
        .cf-method-step:nth-child(4) .cf-method-dot { background: var(--g-green); }
        .cf-method-label {
          font-size: var(--text-label);
          letter-spacing: var(--track-label);
          text-transform: uppercase;
        }
        .cf-method-line { font-size: var(--text-meta); line-height: 1.5; color: var(--cf-stone); max-width: 30ch; }

        .cf-artifact { margin-top: var(--gap-block); }
        .cf-cue { display: inline-flex; margin-bottom: 18px; }
        /* cue copy names the actual gesture per breakpoint: the futures stage
           rides vertical scroll on desktop but is a native horizontal swipe
           carousel under 900px; the gate is a static finished panel there */
        .cf-cue-narrow { display: none; }

        .cf-design-beat {
          margin: clamp(22px, 3vw, 42px) 0 var(--gap-block);
          display: grid;
          grid-template-columns: minmax(220px, 0.34fr) minmax(0, 1fr);
          gap: clamp(22px, 3.2vw, 48px);
          align-items: start;
          padding-block: clamp(20px, 2.8vw, 34px);
          border-block: 1px solid var(--rule);
        }
        .cf-design-beat-copy {
          display: grid;
          gap: 12px;
          align-content: start;
          padding-top: 4px;
        }
        .cf-design-beat-kicker {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--case-accent);
        }
        .cf-design-beat-copy h3 {
          margin: 0;
          max-width: 12ch;
          font-size: clamp(26px, 2.4vw, 40px);
          line-height: 1.05;
          font-weight: 500;
          letter-spacing: 0;
        }
        .cf-design-beat-copy p {
          margin: 0;
          max-width: 34ch;
          font-size: var(--text-body);
          line-height: 1.52;
          color: var(--cf-stone);
        }
        .cf-wireframe-proof {
          margin: 0;
        }
        .cf-wireframe-media {
          border: 1px solid rgba(16, 18, 22, 0.14);
          border-radius: 8px;
          overflow: hidden;
          background: #f8f9fa;
          box-shadow: 0 12px 32px rgba(16, 18, 22, 0.05);
        }
        .cf-wireframe-media img {
          display: block;
          width: 100%;
          height: auto;
        }

        .cf-evidence-set {
          margin: clamp(26px, 3.2vw, 48px) 0 var(--gap-block);
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(18px, 2.2vw, 32px);
          align-items: start;
        }
        .cf-evidence-set--solo {
          grid-template-columns: minmax(0, 1fr);
        }
        .cf-evidence-set--solo .cf-evidence-card {
          grid-template-columns: minmax(0, 1.55fr) minmax(240px, 0.38fr);
          align-items: stretch;
        }
        .cf-evidence-card {
          margin: 0;
          display: grid;
          gap: 0;
          border: 1px solid rgba(16, 18, 22, 0.14);
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: 0 12px 32px rgba(16, 18, 22, 0.05);
        }
        .cf-evidence-media {
          background:
            linear-gradient(135deg, rgba(66, 133, 244, 0.08), transparent 34%),
            #f8f9fa;
        }
        .cf-evidence-media img {
          display: block;
          width: 100%;
          height: auto;
        }
        .cf-evidence-caption {
          display: grid;
          gap: 8px;
          align-content: start;
          padding: clamp(14px, 1.5vw, 20px);
          border-top: 1px solid var(--rule);
          color: var(--cf-stone);
        }
        .cf-evidence-set--solo .cf-evidence-caption {
          border-top: 0;
          border-left: 1px solid var(--rule);
          align-content: center;
        }
        .cf-evidence-caption span {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .cf-evidence-caption strong {
          font-size: clamp(18px, 1.35vw, 22px);
          line-height: 1.25;
          font-weight: 500;
          color: var(--cf-ink);
        }
        .cf-evidence-caption p {
          margin: 0;
          font-size: var(--text-label);
          line-height: 1.42;
          max-width: 26ch;
        }

        .cf-board-fig {
          margin: clamp(26px, 3.2vw, 48px) 0 0;
        }
        .cf-board-media {
          border: 1px solid rgba(248, 250, 252, 0.16);
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
        }
        .cf-board-media img {
          display: block;
          width: 100%;
          height: auto;
        }
        .cf-board-fig .cf-cap {
          margin-top: 12px;
        }

        .cf-futures-flow {
          margin: clamp(20px, 2.4vw, 30px) 0 0;
        }
        .cf-futures-flow-media {
          display: block;
          /* wayfinding: the whole frame takes the scenario color (no
             single-edge color bars on this site) */
          border: 1px solid color-mix(in srgb, var(--cf-sc, var(--case-accent)) 72%, transparent);
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
        }
        .cf-futures-flow-media img {
          display: block;
          width: 100%;
          height: auto;
        }
        .cf-futures-flow figcaption {
          /* lives only in the dark four-futures section */
          margin-top: 10px;
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          line-height: 1.5;
          color: rgba(248, 250, 252, 0.6);
        }
        /* the 2400px flows are the studio's core artifacts, unreadable at
           stage scale — click opens the page-level lightbox at 1:1 */
        .cf-futures-flow-btn {
          appearance: none;
          display: block;
          width: 100%;
          margin: 0;
          padding: 0;
          border: 0;
          background: transparent;
          text-align: inherit;
          font: inherit;
          color: inherit;
          cursor: zoom-in;
        }
        .cf-futures-flow-btn:focus-visible {
          outline: var(--focus-ring);
          outline-offset: var(--focus-offset);
        }
        .cf-fu-zoom-cue {
          display: inline-flex;
          margin-left: 10px;
        }
        .cf-lightbox {
          /* portaled to <body> (outside .cf-page): no --cf-* vars here, and
             it must clear the site nav's z-index 1000 */
          position: fixed;
          inset: 0;
          z-index: 1200;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          background: rgba(8, 10, 14, 0.94);
        }
        @media (prefers-reduced-motion: no-preference) {
          .cf-lightbox { animation: cfStageIn 0.3s var(--ease-silk) both; }
        }
        .cf-lightbox-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px clamp(16px, 3vw, 32px);
          color: #f8fafd;
        }
        .cf-lightbox-title {
          font-family: var(--cf-mono, var(--font-mono));
          font-size: var(--text-micro);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(248, 250, 252, 0.78);
        }
        .cf-lightbox-close {
          appearance: none;
          border: 1px solid rgba(248, 250, 252, 0.4);
          border-radius: 4px;
          background: transparent;
          padding: 8px 14px;
          font-family: var(--cf-mono, var(--font-mono));
          font-size: var(--text-micro);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #f8fafd;
          cursor: pointer;
          transition: border-color var(--dur-fast) ease;
        }
        .cf-lightbox-close:hover { border-color: #f8fafd; }
        .cf-lightbox-close:focus-visible {
          outline: var(--focus-ring);
          outline-offset: var(--focus-offset);
        }
        .cf-lightbox-scroll {
          overflow: auto;
          padding: 0 clamp(16px, 3vw, 32px) clamp(16px, 3vw, 32px);
        }
        .cf-lightbox-scroll img {
          display: block;
          width: 2400px;
          max-width: none;
          height: auto;
          margin-inline: auto;
          border-radius: 8px;
          background: #fff;
        }

        /* pinned four-futures stage: vertical scroll SLIDES the four power
           structures horizontally — dwell, then visible travel; the wash
           takes the active scenario's color. Without JS (and on mobile) the
           same track is a native horizontal swipe carousel. */
        .cf-futures.is-live {
          height: 380vh;
        }
        .cf-futures-stage {
          position: relative;
          z-index: 0;
        }
        .cf-futures.is-live .cf-futures-stage {
          position: sticky;
          top: clamp(64px, 9vh, 96px);
          min-height: calc(100vh - clamp(120px, 16vh, 170px));
          display: grid;
          align-content: center;
        }
        .cf-futures-stage::before {
          content: "";
          position: absolute;
          inset-block: -6%;
          left: 50%;
          width: 100vw;
          transform: translateX(-50%);
          z-index: -1;
          pointer-events: none;
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--fu-wash) 13%, transparent), transparent 70%);
          transition: background 0.6s var(--ease-silk);
        }
        .cf-futures.is-live .cf-futures-flow-media img {
          width: 100%;
          max-height: 32vh;
          object-fit: contain;
          background: #fff;
        }
        /* owner note: the tabs and the colored bar below correspond — so both
           rows ride the SAME four equal columns (tab i sits directly over bar
           segment i), spread across the full stage width, with clear air
           between the tab row and the bar. */
        .cf-fu-head {
          display: grid;
          gap: clamp(18px, 2.4vw, 30px);
          margin-bottom: clamp(18px, 2.2vw, 28px);
        }
        .cf-fu-labels {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--fu-col-gap, clamp(14px, 2.4vw, 32px));
        }
        .cf-fu-labels button {
          justify-self: start;
          text-align: left;
          appearance: none;
          border: 0;
          background: transparent;
          padding: 2px 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font: inherit;
          font-size: var(--text-meta);
          font-weight: 500;
          color: rgba(248, 250, 252, 0.5);
          transition: color var(--dur-fast) ease;
        }
        .cf-fu-labels button:hover { color: rgba(248, 250, 252, 0.86); }
        .cf-fu-labels button.is-on { color: #f8fafd; }
        .cf-fu-labels button:focus-visible {
          outline: var(--focus-ring);
          outline-offset: var(--focus-offset);
        }
        .cf-fu-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: var(--cf-dot);
          flex: none;
          opacity: 0.5;
          transition: opacity var(--dur-fast) ease;
        }
        .cf-fu-labels button.is-on .cf-fu-dot { opacity: 1; }
        /* the bar, split into four segments on the same columns as the tabs;
           the active persona's segment fills in that persona's color */
        .cf-fu-progress {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--fu-col-gap, clamp(14px, 2.4vw, 32px));
          height: 3px;
        }
        .cf-fu-seg {
          position: relative;
          overflow: hidden;
          background: rgba(248, 250, 252, 0.14);
        }
        .cf-fu-seg::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--cf-dot);
          transform: scaleX(0);
          transform-origin: left;
          /* opacity rides along: scaleX(0) alone can leave a 1px
             subpixel sliver at the segment's left edge */
          opacity: 0;
          transition: transform 0.45s var(--ease-silk), opacity 0.45s var(--ease-silk);
        }
        .cf-fu-seg.is-on::before {
          transform: scaleX(1);
          opacity: 1;
        }
        .cf-fu-hint {
          display: none;
          margin: 0;
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(248, 250, 252, 0.5);
        }
        .cf-fu-viewport {
          overflow: hidden;
        }
        .cf-fu-track {
          display: flex;
          will-change: transform;
        }
        .cf-fu-panel {
          flex: 0 0 100%;
          min-width: 0;
          box-sizing: border-box;
          padding-right: clamp(32px, 4vw, 64px);
        }
        .cf-futures:not(.is-live) .cf-fu-viewport {
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: thin;
          overscroll-behavior-x: contain;
        }
        .cf-futures:not(.is-live) .cf-fu-panel {
          scroll-snap-align: start;
        }

        /* the authority gate, enacted: sticky three-step scrub */
        .cf-gate {
          margin-top: var(--gap-block);
        }
        .cf-gate.is-live {
          height: 260vh;
        }
        .cf-gate-stage {
          display: grid;
          justify-items: center;
          text-align: center;
          gap: clamp(18px, 2.2vw, 28px);
          padding: clamp(24px, 3vw, 44px) 0;
          border-block: 1px solid var(--rule);
        }
        .cf-gate.is-live .cf-gate-stage {
          position: sticky;
          top: clamp(72px, 10vh, 110px);
          min-height: calc(100vh - clamp(140px, 20vh, 200px));
          align-content: center;
        }
        .cf-gate-kicker {
          margin: 0;
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--case-accent);
        }
        .cf-gate-title {
          margin: 0;
          font-family: var(--cf-sans);
          font-size: clamp(30px, 3vw, 48px);
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -0.01em;
          max-width: 18em;
        }
        .cf-gate-stage[data-step="3"] .cf-gate-title { color: var(--g-green); }
        .cf-gate-track {
          width: min(560px, 72%);
          height: 2px;
          background: rgba(16, 18, 22, 0.14);
          overflow: hidden;
        }
        .cf-gate-fill {
          display: block;
          height: 100%;
          transform: scaleX(var(--gate-p, 1));
          transform-origin: 0 50%;
          background: linear-gradient(90deg, var(--case-accent), var(--g-green));
        }
        .cf-gate-steps {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(16px, 2.4vw, 40px);
          width: min(920px, 100%);
        }
        .cf-gate-steps li {
          display: grid;
          justify-items: center;
          gap: 8px;
          opacity: 0.38;
          transition: opacity 0.4s var(--ease-silk);
        }
        .cf-gate-steps li.is-current,
        .cf-gate-steps li.is-done { opacity: 1; }
        .cf-gate-dot {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 9999px;
          border: 1px solid rgba(16, 18, 22, 0.3);
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          transition: background 0.4s var(--ease-silk), color 0.4s var(--ease-silk), border-color 0.4s var(--ease-silk);
        }
        .cf-gate-steps li.is-current .cf-gate-dot {
          border-color: var(--case-accent);
          color: var(--case-accent);
        }
        .cf-gate-steps li.is-done .cf-gate-dot {
          background: var(--g-green);
          border-color: var(--g-green);
          color: #fff;
        }
        .cf-gate-steps strong {
          font-size: clamp(17px, 1.3vw, 20px);
          font-weight: 500;
          line-height: 1.3;
        }
        .cf-gate-steps p {
          margin: 0;
          max-width: 26ch;
          font-size: var(--text-label);
          line-height: 1.45;
          color: var(--cf-stone);
        }
        .cf-gate-note {
          margin: 0;
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          letter-spacing: 0.04em;
          color: var(--cf-stone);
        }
        .cf-gate-stage[data-step="3"] .cf-gate-note { color: var(--g-green); }

        .cf-chip {
          appearance: none;
          border: 1px solid var(--rule);
          background: transparent;
          border-radius: 8px;
          padding: 10px 16px;
          font: inherit;
          font-size: var(--text-meta);
          color: var(--cf-ink);
          cursor: pointer;
          transition: border-color var(--dur-fast) ease, background var(--dur-fast) ease;
        }
        .cf-chip:hover { border-color: rgba(16, 18, 22, 0.4); }
        .cf-chip:focus-visible { outline: var(--focus-ring); outline-offset: var(--focus-offset); }
        .cf-chip.is-on {
          border-color: var(--case-accent);
          background: var(--case-accent-soft);
        }
        .cf-chip--dot { display: inline-flex; align-items: center; gap: 8px; }
        .cf-chip--dot::before {
          content: "";
          width: 8px; height: 8px; border-radius: 9999px;
          background: var(--cf-dot, var(--case-accent));
          flex: none;
        }

        .cf-worlds-switch, .cf-seats-switch {
          display: flex; flex-wrap: wrap; gap: 10px;
          margin-bottom: clamp(20px, 2.4vw, 32px);
        }
        .cf-worlds-panel { max-width: 720px; }
        .cf-worlds-name {
          margin: 0 0 12px;
          font-size: clamp(22px, 1.9vw, 28px);
          font-weight: 500;
          line-height: 1.3;
        }
        .cf-worlds-traits { margin: 0 0 14px; padding: 0; list-style: none; display: grid; gap: 8px; }
        .cf-worlds-traits li {
          position: relative;
          padding-left: 18px;
          font-size: var(--text-body);
          line-height: 1.5;
        }
        .cf-worlds-traits li::before {
          content: "";
          position: absolute; left: 0; top: 0.62em;
          width: 8px; height: 1px; background: var(--case-accent);
        }
        .cf-worlds-reaction {
          margin: 0;
          padding-top: 14px;
          border-top: 1px solid var(--rule);
          font-size: var(--text-meta);
          line-height: 1.55;
          color: var(--cf-stone);
          max-width: 56ch;
        }
        .cf-worlds-board {
          margin: 20px 0 0;
        }
        .cf-worlds-board-media {
          border: 1px solid rgba(16, 18, 22, 0.14);
          border-radius: 8px;
          overflow: hidden;
          background: #f8f9fa;
        }
        .cf-worlds-board-media img {
          display: block;
          width: 100%;
          height: auto;
        }
        .cf-worlds-board figcaption {
          margin-top: 10px;
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          line-height: 1.5;
          color: var(--cf-stone);
        }
        .cf-finding {
          display: grid; gap: 4px;
          margin: clamp(24px, 3vw, 36px) 0 0;
        }
        .cf-finding-quote { font-size: clamp(18px, 1.5vw, 22px); line-height: 1.45; font-weight: 500; max-width: 34em; }
        .cf-finding-source { font-size: var(--text-micro); font-family: var(--cf-mono); color: var(--cf-stone); }
        .cf-affinity {
          margin-top: clamp(28px, 3.4vw, 48px);
          display: grid;
          gap: 16px;
        }
        .cf-affinity-title {
          margin: 0;
          font-size: clamp(22px, 1.9vw, 28px);
          line-height: 1.3;
          font-weight: 500;
        }
        .cf-affinity-board {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(18px, 2.2vw, 32px);
        }
        .cf-affinity-cluster {
          display: grid;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--rule);
          align-content: start;
        }
        .cf-affinity-cluster h3 {
          margin: 0;
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .cf-affinity-cluster p {
          margin: 0;
          font-size: clamp(17px, 1.4vw, 20px);
          font-weight: 500;
          line-height: 1.4;
          color: var(--cf-ink);
        }

        .cf-stage-tagline {
          margin: 0 0 clamp(20px, 2.4vw, 30px);
          font-size: clamp(22px, 1.9vw, 28px);
          font-weight: 500;
          line-height: 1.3;
          max-width: 30em;
        }
        .cf-diagram {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(96px, 150px) minmax(0, 1fr) minmax(96px, 150px) minmax(0, 1fr);
          gap: 0 clamp(10px, 1.2vw, 18px);
          align-items: start;
          padding: clamp(20px, 2.4vw, 32px) 0;
          border-block: 1px solid var(--rule);
        }
        .cf-node { text-align: center; display: grid; gap: 8px; justify-items: center; }
        .cf-node-name {
          font-family: var(--cf-sans);
          font-size: clamp(18px, 1.5vw, 24px);
          font-weight: 500;
          line-height: 1.2;
          padding-bottom: 8px;
          border-bottom: 2px solid transparent;
          transition: border-color 0.3s ease;
        }
        .cf-node.has-say .cf-node-name { border-bottom-color: var(--cf-sc, var(--case-accent)); }
        .cf-node-say {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--cf-sc, var(--case-accent));
          opacity: 0;
          transform: translateY(-4px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .cf-node.has-say .cf-node-say { opacity: 1; transform: none; }
        .cf-lane { display: grid; gap: 10px; justify-items: center; padding-top: 14px; min-width: 0; }
        .cf-lane-a { grid-column: 2; grid-row: 1; }
        .cf-lane-b { grid-column: 4; grid-row: 1; }
        .cf-node:nth-of-type(1) { grid-column: 1; grid-row: 1; }
        .cf-node:nth-of-type(2) { grid-column: 3; grid-row: 1; }
        .cf-node:nth-of-type(3) { grid-column: 5; grid-row: 1; }
        .cf-arrow {
          position: relative;
          width: 100%;
          height: 1px;
          background: var(--cf-sc, var(--case-accent));
        }
        .cf-arrow::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 8px; height: 8px;
          border-top: 1px solid var(--cf-sc, var(--case-accent));
          border-right: 1px solid var(--cf-sc, var(--case-accent));
        }
        .cf-arrow.is-right::after { right: 0; transform: translateY(-50%) rotate(45deg); }
        .cf-arrow.is-left::after { left: 0; transform: translateY(-50%) rotate(-135deg); }
        .cf-lane-verb {
          font-size: var(--text-micro);
          font-family: var(--cf-mono);
          line-height: 1.45;
          text-align: center;
          color: var(--cf-stone);
          max-width: 150px;
        }
        .cf-verdict {
          display: grid; gap: 4px;
          margin: clamp(20px, 2.4vw, 30px) 0 0;
        }
        .cf-verdict-quote { font-size: clamp(18px, 1.5vw, 22px); line-height: 1.45; font-weight: 500; max-width: 34em; }
        .cf-verdict-source { font-size: var(--text-micro); font-family: var(--cf-mono); color: var(--cf-stone); }
        .cf-seats-panel { display: grid; gap: var(--gap-block); }
        .cf-seat-fig { margin: 0; }
        .cf-seat-media {
          border: 1px solid var(--rule);
          border-radius: 8px;
          overflow: hidden;
          background: #f8f9fa;
        }
        .cf-seat-media img { display: block; width: 100%; height: auto; }
        .cf-seat-cap {
          display: flex; gap: 12px; align-items: baseline;
          margin-top: 12px;
          font-size: var(--text-meta);
          line-height: 1.5;
          color: var(--cf-stone);
          max-width: 62ch;
        }

        .cf-tensions { margin-top: calc(var(--gap-block) * 1.4); max-width: 880px; }
        .cf-tensions-anchor {
          margin: 0 0 clamp(18px, 2.2vw, 28px);
          font-size: clamp(22px, 1.9vw, 28px);
          font-weight: 500;
          line-height: 1.3;
        }
        .cf-tension {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(80px, 220px) minmax(0, 1fr);
          gap: 14px;
          align-items: center;
          padding: 12px 0;
        }
        .cf-tension-side { font-size: var(--text-body); line-height: 1.4; text-align: right; }
        .cf-tension-side.is-right { text-align: left; }
        .cf-tension-bar { position: relative; height: 1px; background: var(--rule); }
        .cf-tension-mark {
          position: absolute; left: var(--lean, 50%); top: 50%;
          width: 8px; height: 8px; border-radius: 9999px;
          transform: translate(-50%, -50%);
          background: var(--case-accent);
        }

        .cf-eval {
          margin-top: var(--gap-block);
          display: grid;
          gap: clamp(18px, 2.2vw, 28px);
          max-width: 960px;
        }
        .cf-eval-list {
          display: grid;
          border-top: 1px solid var(--rule);
        }
        .cf-eval-item {
          display: grid;
          grid-template-columns: minmax(104px, 0.28fr) minmax(0, 1fr);
          gap: 24px;
          padding: 16px 0;
          border-bottom: 1px solid var(--rule);
        }
        .cf-eval-label {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          line-height: 1.6;
        }
        .cf-eval-question {
          font-size: var(--text-body);
          line-height: 1.5;
          color: rgba(16, 18, 22, 0.84);
        }

        .cf-ai-motion-board {
          margin-top: var(--gap-block);
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(240px, 0.52fr);
          gap: clamp(24px, 3vw, 48px);
          align-items: stretch;
          padding-block: clamp(20px, 2.8vw, 36px);
          border-block: 1px solid var(--rule);
        }
        .cf-ai-motion-stage {
          position: relative;
          min-height: clamp(420px, 34vw, 560px);
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-template-rows: repeat(2, minmax(190px, 1fr));
          gap: clamp(10px, 1.1vw, 16px);
          overflow: hidden;
        }
        .cf-motion-tile {
          position: relative;
          display: grid;
          align-content: start;
          gap: 14px;
          min-width: 0;
          padding: clamp(14px, 1.4vw, 20px);
          border: 1px solid rgba(248, 250, 252, 0.13);
          border-radius: 8px;
          background: rgba(248, 250, 252, 0.035);
          overflow: hidden;
        }
        .cf-motion-tile--prompt {
          grid-column: 1;
          grid-row: 1;
        }
        .cf-motion-tile--agent {
          grid-column: 2;
          grid-row: 1;
          place-items: center;
          background:
            linear-gradient(135deg, rgba(138, 180, 248, 0.3), rgba(138, 180, 248, 0.08) 62%, rgba(248, 250, 252, 0.035));
        }
        .cf-motion-tile--rules {
          grid-column: 3;
          grid-row: 1;
        }
        .cf-motion-tile--packet {
          grid-column: 1 / 4;
          grid-row: 2;
        }
        .cf-motion-tile--test {
          grid-column: 4;
          grid-row: 1 / 3;
          align-content: center;
        }
        .cf-motion-label {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: rgba(248, 250, 252, 0.58);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .cf-motion-tile p {
          margin: 0;
          max-width: 22ch;
          font-size: var(--text-label);
          line-height: 1.45;
          color: rgba(248, 250, 252, 0.86);
        }
        .cf-motion-path {
          /* signal seam between the two tile rows; it must stop short of the
             full-height output tile in column 4 or it crosses its text */
          position: absolute;
          left: 6%;
          right: calc(25% + 6px);
          top: 50%;
          height: 1px;
          background: rgba(248, 250, 252, 0.22);
          z-index: 2;
          pointer-events: none;
        }
        /* the signal dot rides a full-width carrier span: translating the
           carrier by its own width (-100% + dot) is the transform-only way
           to travel a parent-relative distance (no animated 'left') */
        .cf-motion-path span {
          position: absolute;
          inset: 0;
          display: block;
        }
        .cf-motion-path span::before {
          content: "";
          position: absolute;
          top: -4px;
          right: 0;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #8ab4f8;
          box-shadow: 0 0 0 5px rgba(138, 180, 248, 0.14);
        }
        .cf-prompt-lines,
        .cf-rule-stack,
        .cf-packet-preview,
        .cf-output-list {
          display: grid;
          gap: 8px;
          margin: 0;
          margin-top: auto;
          padding: 0;
          list-style: none;
        }
        .cf-prompt-lines li {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          line-height: 1.5;
          color: rgba(248, 250, 252, 0.6);
        }
        .cf-prompt-lines li::before {
          content: "— ";
          color: rgba(248, 250, 252, 0.34);
        }
        .cf-rule-stack li {
          display: flex;
          align-items: center;
          min-height: 32px;
          padding: 5px 12px;
          border-radius: 8px;
          border: 1px solid color-mix(in srgb, #8ab4f8 62%, transparent);
          background: rgba(248, 250, 252, 0.06);
          font-size: var(--text-micro);
          line-height: 1.35;
          color: rgba(248, 250, 252, 0.82);
        }
        .cf-rule-stack li:nth-child(2) { border-color: color-mix(in srgb, #fbbc04 62%, transparent); }
        .cf-rule-stack li:nth-child(3) { border-color: color-mix(in srgb, #34a853 62%, transparent); }
        .cf-agent-slab {
          min-width: 142px;
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 1px solid rgba(248, 250, 252, 0.26);
          border-radius: 4px;
          background: rgba(248, 250, 252, 0.08);
          color: rgba(248, 250, 252, 0.92);
          font-size: var(--text-label);
          line-height: 1;
        }
        .cf-agent-sub {
          margin: 0;
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          text-align: center;
          color: rgba(248, 250, 252, 0.52);
        }
        .cf-gem-dot,
        .cf-packet-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          flex: none;
        }
        .cf-gem-dot.is-blue { background: #4285f4; }
        .cf-gem-dot.is-green { background: #34a853; }
        .cf-packet-dot.is-red { background: #ea4335; }
        .cf-packet-preview {
          max-width: 420px;
          padding: 14px 16px;
          border: 1px solid rgba(248, 250, 252, 0.16);
          border-radius: 8px;
          background: rgba(248, 250, 252, 0.06);
        }
        .cf-packet-preview li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: var(--text-micro);
          line-height: 1.45;
          color: rgba(248, 250, 252, 0.82);
        }
        .cf-packet-tick {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          flex: none;
          background: #34a853;
        }
        .cf-output-list li {
          font-size: var(--text-label);
          line-height: 1.5;
          color: rgba(248, 250, 252, 0.78);
        }
        .cf-output-list strong {
          font-family: var(--cf-sans);
          font-size: clamp(22px, 1.9vw, 30px);
          font-weight: 500;
          color: #f8fafd;
        }
        .cf-output-status {
          margin: 12px 0 0;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          line-height: 1.45;
          color: rgba(248, 250, 252, 0.6);
        }
        .cf-ai-motion-copy {
          display: grid;
          gap: 12px;
          align-content: end;
          padding-bottom: 4px;
        }
        .cf-ai-motion-copy span {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .cf-ai-motion-copy h3 {
          margin: 0;
          font-size: clamp(28px, 2.6vw, 44px);
          line-height: 1.06;
          font-weight: 500;
          color: #f8fafd;
        }
        .cf-ai-motion-copy p {
          margin: 0;
          max-width: 34ch;
          font-size: var(--text-meta);
          line-height: 1.55;
          color: rgba(248, 250, 252, 0.68);
        }
        .cf-ai-gallery {
          margin-top: var(--gap-block);
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(22px, 2.6vw, 42px);
          align-items: start;
        }
        .cf-ai-shot {
          margin: 0;
        }
        .cf-ai-media {
          border: 1px solid var(--rule);
          border-radius: 8px;
          overflow: hidden;
          background: #f8f9fa;
        }
        .cf-ai-media img {
          display: block;
          width: 100%;
          height: auto;
        }

        .cf-hifi-changes {
          margin-top: var(--gap-block);
          display: grid;
          grid-template-columns: minmax(220px, 0.34fr) minmax(0, 1fr);
          gap: clamp(24px, 3vw, 48px);
          align-items: start;
          padding: clamp(18px, 2.4vw, 30px) 0;
          border-block: 1px solid var(--rule);
        }
        .cf-hifi-change-head {
          display: grid;
          gap: 10px;
          align-content: start;
        }
        .cf-hifi-eyebrow {
          margin: 0;
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .cf-hifi-change-grid {
          display: grid;
          gap: clamp(14px, 1.6vw, 20px);
        }
        .cf-hifi-change {
          display: grid;
          grid-template-columns: 32px minmax(180px, 0.52fr) minmax(0, 0.88fr);
          gap: clamp(14px, 1.8vw, 24px);
          align-items: start;
          padding-bottom: clamp(14px, 1.6vw, 20px);
          border-bottom: 1px solid var(--rule);
        }
        .cf-hifi-change:last-child {
          padding-bottom: 0;
          border-bottom: 0;
        }
        .cf-hifi-index {
          padding-top: 4px;
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
        }
        .cf-hifi-change h4 {
          margin: 0;
          font-size: clamp(19px, 1.5vw, 24px);
          line-height: 1.25;
          font-weight: 500;
        }
        .cf-hifi-compare {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(12px, 1.4vw, 18px);
        }
        .cf-hifi-compare p {
          margin: 0;
          display: grid;
          gap: 6px;
          padding: 12px;
          border: 1px solid rgba(16, 18, 22, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.72);
          font-size: var(--text-label);
          line-height: 1.42;
          color: var(--cf-stone);
        }
        .cf-hifi-compare span {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--case-accent);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .cf-limits {
          margin-top: var(--gap-block);
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(18px, 2.2vw, 32px);
        }
        .cf-limit {
          display: grid;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--rule);
          align-content: start;
        }
        .cf-limit-lead {
          margin: 0;
          font-size: clamp(20px, 1.7vw, 24px);
          font-weight: 500;
          line-height: 1.3;
        }
        .cf-limit-line {
          margin: 0;
          font-size: var(--text-meta);
          line-height: 1.55;
          color: var(--cf-stone);
        }

        .cf-close {
          position: relative;
          isolation: isolate;
          padding-block: calc(var(--gap-section) / 2) calc(var(--gap-section) / 3);
          max-width: 1408px;
        }
        .cf-close::before {
          background: #ffffff;
        }
        .cf-close-rule {
          width: 56px; height: 4px;
          background: var(--seal-red);
          margin-bottom: clamp(24px, 3vw, 40px);
        }
        .cf-close-title {
          margin: 0 0 clamp(18px, 2.2vw, 28px);
          font-family: var(--cf-sans);
          font-size: clamp(40px, 4.4vw, 72px);
          font-weight: 400;
          line-height: 1.08;
          letter-spacing: -0.015em;
          max-width: 20em;
        }
        .cf-close-p {
          margin: 0 0 1em;
          font-size: clamp(18px, 1.5vw, 22px);
          line-height: 1.6;
          max-width: 58ch;
          color: rgba(16, 18, 22, 0.86);
        }
        .cf-signoff {
          display: grid; gap: 6px;
          margin: clamp(32px, 4vw, 56px) 0 0;
          padding-top: 18px;
          border-top: 1px solid var(--rule);
        }
        .cf-signoff-main { font-size: var(--text-body); font-weight: 500; }
        .cf-signoff-meta {
          font-family: var(--cf-mono);
          font-size: var(--text-micro);
          color: var(--cf-stone);
        }

        .cf-page .icue { font-family: var(--cf-mono); }

        @media (prefers-reduced-motion: no-preference) {
          .cf-page [data-fade] {
            opacity: 0;
            transform: translateY(22px);
            transition: opacity 0.7s var(--ease-silk), transform 0.7s var(--ease-silk);
          }
          .cf-section--dark [data-fade] {
            transform: translateY(24px);
          }
          .cf-section--light [data-fade] {
            transform: translateY(24px) scale(0.992);
          }
          .cf-section .cf-body[data-fade] {
            transition-delay: 80ms;
          }
          .cf-section .cf-artifact[data-fade],
          .cf-section .cf-evidence-set[data-fade],
          .cf-section .cf-ai-motion-board[data-fade] {
            transition-delay: 140ms;
          }
          .cf-page [data-fade].is-visible { opacity: 1; transform: none; }
          /* hero assembles like a transcript: words surface in reading
             order, then the four-color rule draws once */
          .cf-title-word {
            display: inline-block;
            opacity: 0;
            transform: translateY(0.4em);
            transition: opacity 0.55s var(--ease-silk), transform 0.55s var(--ease-silk);
            transition-delay: calc(var(--w, 0) * 110ms + 160ms);
          }
          .cf-title.is-visible .cf-title-word {
            opacity: 1;
            transform: none;
          }
          .cf-hero-rule {
            transform: scaleX(0);
            transform-origin: 0 50%;
            transition: transform 0.9s var(--ease-silk) 560ms;
          }
          .cf-hero-rule.is-visible { transform: scaleX(1); }
          .cf-kicker-wave i {
            animation: cfWave 1.3s var(--ease-silk) infinite;
            animation-delay: calc(var(--wv, 0) * 120ms);
          }
          .cf-kicker-wave i:nth-child(1) { --wv: 0; }
          .cf-kicker-wave i:nth-child(2) { --wv: 1; }
          .cf-kicker-wave i:nth-child(3) { --wv: 2; }
          .cf-kicker-wave i:nth-child(4) { --wv: 3; }
          .cf-kicker-wave i:nth-child(5) { --wv: 4; }
          @keyframes cfWave {
            0%, 100% { transform: scaleY(0.4); }
            45% { transform: scaleY(1); }
          }
          /* section claims wipe open once their body arrives */
          .cf-body[data-fade] .cf-h2 {
            clip-path: inset(0 0 100% 0);
            transition: clip-path 0.8s var(--ease-silk) 60ms;
          }
          .cf-body[data-fade].is-visible .cf-h2 {
            clip-path: inset(0 0 -8% 0);
          }
          .cf-method-step, .cf-insight, .cf-tension, .cf-limit {
            opacity: 0;
            transform: translateY(14px);
          }
          .cf-ai-motion-board.is-visible .cf-motion-tile {
            animation: cfTileIn 0.72s var(--ease-silk) both;
            animation-delay: calc(var(--i, 0) * 95ms + 120ms);
          }
          .cf-motion-tile--prompt { --i: 0; }
          .cf-motion-tile--agent { --i: 1; }
          .cf-motion-tile--rules { --i: 2; }
          .cf-motion-tile--test { --i: 3; }
          .cf-motion-tile--packet { --i: 4; }
          [data-fade].is-visible .cf-method-step,
          [data-fade].is-visible .cf-insight,
          [data-fade].is-visible .cf-tension,
          [data-fade].is-visible .cf-limit {
            opacity: 1;
            transform: none;
            transition: opacity 0.6s var(--ease-silk), transform 0.6s var(--ease-silk);
            transition-delay: calc(var(--i, 0) * 110ms);
          }
          .cf-worlds-panel, .cf-seats-panel {
            animation: cfStageIn 0.45s var(--ease-silk) both;
          }
          .cf-motion-path span {
            animation: cfMotionTravel 3.8s var(--ease-silk) infinite;
          }
          .cf-agent-slab {
            animation: cfSoftPulse 2.8s var(--ease-silk) infinite;
          }
          .cf-output-status .cf-gem-dot {
            animation: cfGemFloat 2.8s var(--ease-silk) infinite;
          }
          @keyframes cfStageIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: none; }
          }
          @keyframes cfTileIn {
            from { opacity: 0.78; transform: translateY(18px) scale(0.985); }
            to { opacity: 1; transform: none; }
          }
          @keyframes cfMotionTravel {
            0% { transform: translateX(calc(-100% + 8px)); opacity: 0.18; }
            16% { opacity: 1; }
            82% { opacity: 1; }
            100% { transform: translateX(0); opacity: 0.18; }
          }
          @keyframes cfSoftPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.035); }
          }
          @keyframes cfGemFloat {
            0%, 100% { transform: translateY(-4px); }
            50% { transform: translateY(8px); }
          }
        }

        @media (max-width: 900px) {
          .cf-grid { display: block; }
          .cf-fu-hint { display: block; }
          .cf-cue-wide { display: none; }
          .cf-cue-narrow { display: inline; }
          .cf-cue--gate { display: none; }
          /* narrow: tab names need two columns; the bar keeps its four
             segments as a swipe-progress readout */
          .cf-fu-labels {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            row-gap: 10px;
          }
          .cf-fu-panel {
            flex-basis: 88%;
            padding-right: 16px;
          }
          .cf-brandbar {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }
          .cf-brand-plus {
            display: none;
          }
          .cf-brand-cornell {
            padding-left: 0;
          }
          .cf-brand-cornell img {
            width: min(260px, 78vw);
          }
          .cf-hero-proof {
            grid-template-columns: 1fr;
            padding: 14px;
          }
          .cf-hero-proof-copy {
            padding-top: 16px;
          }
          .cf-rail { margin-bottom: 14px; }
          .cf-lede { max-width: none; margin-bottom: 24px; }
          .cf-meta { margin-top: 8px; }
          .cf-hero-row { display: block; }
          .cf-rqs, .cf-insights, .cf-industry, .cf-industry-list, .cf-design-beat, .cf-evidence-set, .cf-evidence-set--solo .cf-evidence-card, .cf-ai-motion-board, .cf-ai-gallery, .cf-hifi-changes, .cf-limits { grid-template-columns: 1fr; }
          .cf-eval-item { grid-template-columns: 1fr; gap: 8px; }
          .cf-method { grid-template-columns: 1fr; gap: 20px; padding-top: 0; }
          .cf-method::before { display: none; }
          .cf-method-step { padding-left: 18px; }
          .cf-method-dot { top: 6px; }
          .cf-affinity-board { grid-template-columns: 1fr; }
          .cf-design-beat-copy h3 {
            max-width: none;
          }
          .cf-evidence-media {
            overflow: hidden;
          }
          .cf-evidence-media img {
            width: 100%;
            max-width: 100%;
          }
          .cf-evidence-set--solo .cf-evidence-caption {
            border-left: 0;
            border-top: 1px solid var(--rule);
          }
          .cf-diagram {
            grid-template-columns: 1fr;
            gap: 14px;
            justify-items: center;
          }
          .cf-node:nth-of-type(1), .cf-node:nth-of-type(2), .cf-node:nth-of-type(3),
          .cf-lane-a, .cf-lane-b { grid-column: 1; grid-row: auto; }
          .cf-node { order: 0; }
          .cf-node:nth-of-type(2) { order: 2; }
          .cf-node:nth-of-type(3) { order: 4; }
          .cf-lane-a { order: 1; }
          .cf-lane-b { order: 3; }
          .cf-lane { width: 100%; max-width: 320px; padding-top: 0; }
          .cf-arrow { width: 1px; height: 36px; margin-inline: auto; }
          .cf-arrow.is-right::after { right: auto; left: 50%; top: auto; bottom: 0; transform: translateX(-50%) rotate(135deg); }
          .cf-arrow.is-left::after { left: 50%; top: 0; transform: translateX(-50%) rotate(-45deg); }
          .cf-tension { grid-template-columns: minmax(0, 1fr) 60px minmax(0, 1fr); gap: 10px; }
          .cf-film-media { aspect-ratio: 1870 / 960; }
          .cf-process-frame {
            padding: clamp(14px, 4vw, 18px);
          }
          .cf-process-phases {
            grid-template-columns: 1fr;
          }
          .cf-process-phase {
            min-height: 0;
          }
          .cf-cap {
            display: grid;
            gap: 6px;
            align-items: start;
          }
          .cf-process-phase ul {
            align-self: start;
          }
          .cf-ai-motion-copy {
            order: -1;
            align-content: start;
          }
          .cf-ai-motion-stage {
            /* auto rows: fixed heights clipped tile copy at this width */
            min-height: 0;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-rows: none;
            grid-auto-rows: auto;
          }
          .cf-motion-tile--prompt {
            grid-column: 1 / 3;
            grid-row: 1;
          }
          .cf-motion-tile--agent {
            grid-column: 1;
            grid-row: 2;
            min-height: 120px;
          }
          .cf-motion-tile--rules {
            grid-column: 2;
            grid-row: 2 / 4;
          }
          .cf-motion-tile--packet {
            grid-column: 1 / 3;
            grid-row: 4;
          }
          .cf-motion-tile--test {
            grid-column: 1 / 3;
            grid-row: 5;
            align-content: start;
          }
          .cf-motion-path {
            /* the horizontal signal seam has no meaning in the stacked layout */
            display: none;
          }
          .cf-flow-row {
            grid-template-columns: 1fr;
          }
          .cf-flow-step {
            min-height: 0;
          }
          .cf-flow-step:not(:last-child)::after {
            left: 18px;
            top: 100%;
            width: 1px;
            height: 12px;
          }
          .cf-flow-critique {
            grid-template-columns: 1fr;
          }
          .cf-flow-critique ul {
            grid-template-columns: 1fr;
          }
          .cf-framework-frame {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .cf-framework-principles {
            grid-template-columns: 1fr;
          }
          .cf-framework-core {
            min-height: 0;
          }
          .cf-ai-media {
            overflow-x: auto;
            scrollbar-width: thin;
          }
          .cf-ai-media img {
            width: max(100%, 720px);
            max-width: none;
          }
          .cf-hifi-change {
            grid-template-columns: 1fr;
          }
          .cf-hifi-compare {
            grid-template-columns: 1fr;
          }
        }
      `),
        }}
      />
    </article>
  );
}
