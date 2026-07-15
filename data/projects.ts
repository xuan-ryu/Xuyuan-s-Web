// Project data transcribed verbatim from the Framer export
// (local Framer export work/*/index.html). The source used case and poster
// templates; the current Project Catalog assigns an explicit Case Layout.
// Copy intentionally preserves the source text, including its quirks
// ("one more features", full-width colon).


export type CaseSection = {
  tags: string;
  heading: string;
  body: string[];
  image?: string;
};

export type CaseChapter = {
  number: string;
  title: string;
  sections: CaseSection[];
};

export type CaseVideo = {
  src: string;
  wide?: boolean;
  /** still frame shown before playback starts */
  poster?: string;
  /** reel figcaption — describes the footage (and carries any credit) */
  caption?: string;
};

export type CaseMoment = {
  title: string;
  body: string[];
  videos?: CaseVideo[];
};

export type PosterContent = {
  lede: string;
  image: string;
  intro: string[];
  details: {
    project: string;
    client: string;
    year: string;
    services: string;
    livePreview?: { label: string; href: string };
  };
  body: string[];
  gallery: string[];
};

// The recruiter's at-a-glance row (audit #1): three outcome bullets and one
// hard number, rendered by components/ui/outcome-band.tsx right under each
// case hero. Every figure is derived from copy already on this page or in
// the bespoke layouts — no new numbers.
export type ProjectOutcomes = {
  bullets: [string, string, string];
  stat: { value: string; label: string };
};

export type WorkCategoryId = "uiux" | "interaction-games";

export type ProjectLayoutId =
  | "case"
  | "poster"
  | "pulse"
  | "nyma"
  | "vicino"
  | "froghire"
  | "roper"
  | "cloud-futures"
  | "hunger"
  | "vrmb";

export type Project = {
  slug: string;
  title: string;
  category: WorkCategoryId;
  layout: ProjectLayoutId;
  cover?: string;
  /** video shown in the home Featured hover preview */
  previewVideo?: string;
  coverClass?: string;
  tags: string[];
  oneliner: string;
  cardBlurb?: string;
  blurb: string;
  role: string;
  duration: string;
  type: string;
  teams: string;
  summary?: string[];
  outcomes?: ProjectOutcomes;
  moment?: CaseMoment;
  chapters?: CaseChapter[];
  poster?: PosterContent;
  order: number;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "pulse",
    title: "Pulse",
    category: "uiux",
    layout: "pulse",
    cover: `/media/work/pulse/pulse-app-home.png`,
    previewVideo: `/media/work/pulse/preview.mp4`,
    coverClass: "cover-pulse",
    tags: ["Product Design", "Design Systems", "Design Engineering"],
    oneliner:
      "Pulse is an AI marketing operating system that learns a brand, runs its campaign cycle, and improves the next one. I designed Home, Campaign, and Calendar — where the cycle meets human judgment — then built the system that lets the team and its AI tools keep shipping Pulse as one product.",
    blurb:
      "Pulse — from the team behind Vicino — learns a brand into a model and a vault, contracts it into a 90-day strategy, turns strategy into campaigns and platform content, controls distribution through the calendar, and reads performance back into the next cycle, with signal arriving from the market daily. I owned the three surfaces where that cycle meets a person — Home, Campaign, Calendar — and the system underneath the product: one runnable app, a canonical component library, AI-readable design rules, verified build contracts, and a release flow in which a person always makes the final decision.",
    role: "Product Designer · Design Systems · Front-end",
    duration: "2025 – present",
    type: "Intern",
    teams: "PMs, Design Team, Dev Team",
    // Overview = what Pulse is + the owner's scope, once. The belief lives in
    // the moment band; the acts carry the detail — no smearing.
    summary: [
      "I joined with about a week to a pitch and one product scattered across six prototyping tools. My surfaces were Home, Campaign, and Calendar — one path from daily decisions through production to distribution — and designing the front door meant understanding the whole loop behind it: the brand model, the 90-day strategy, the signals coming in, the performance flowing back, and the human decisions connecting them.",
      "That work expanded into a unified application runtime, 62 canonical components, AI-readable design skills, automated consistency checks, and a React distribution layer. The outcome was not just a cleaner prototype. It was a shared way for design, engineering, ML, product, and coding agents to keep building the same product.",
    ],
    // At-a-glance proof points. The case page keeps these facts in the hero
    // instead of repeating them in a separate outcome band.
    outcomes: {
      bullets: [
        "Six product surfaces converged on one runtime",
        "62 canonical components checked across source, docs, and preview",
        "AI-readable rules and CI keep new work aligned",
      ],
      stat: { value: "4", label: "system checks passing" },
    },
    moment: {
      title: "Pulse runs a system for every brand — I built the system that runs Pulse",
      body: [
        "Pulse’s promise to a client is a system that keeps running: learn the brand once, and every cycle after — strategy, campaigns, publishing, performance — leaves the next one smarter. The deeper work of this internship was giving Pulse the same property on the inside: tokens instead of taste, components instead of copies, one runtime instead of parallel demos, and written rules the AI loads before it works — so every review, like every campaign, raises the floor of whatever comes next.",
        "One decision stayed constant through both loops: AI can draft, schedule, and learn, but a person releases to publish. The system made the team faster; the human gate kept that speed accountable.",
      ],
      // The Campaign gate-flow recording renders in ch 1.2 (Fig. 1.4); the
      // Turn closes on the gate spine (its figure is unnumbered — it ends
      // both reading tracks).
    },
    // TWO-PART arc (owner structure, 2026-07-14): Part 1 · Product (the
    // operating loop, the owner's three surfaces and their design
    // judgments, the design language) → Part 2 · Design engineering
    // (fragmentation → convergence → system → operating model → proof).
    // Engineering facts are verified against the live Pulse repo; activity
    // counts stay out of the primary narrative because the system and
    // product outcomes are the stronger evidence.
    // Confidentiality: teammates stay anonymous, tools are described as
    // categories (no brand list), no package identity, no commit hashes.
    // The pulse layout attaches its specimen figures to these positionally.
    chapters: [
      {
        number: "1.1 · Product",
        title: "Learns the brand, runs the cycle, improves the next one.",
        sections: [
          {
            tags: "ZERO TO ONE · PRODUCT DESIGN",
            heading: "One operating loop, drawn as a workspace",
            body: [
              "Pulse is the next act of the team behind Vicino, the node-based video generation platform — an AI marketing operating system, not a content tool bolted onto a chat box. It learns a brand once, runs its campaign cycle, and makes each next cycle smarter than the last.",
            ],
          },
          {
            tags: "THE LOOP · THREE BEATS",
            heading: "Learn once, run, learn again",
            body: [
              "First, learn the brand. Onboarding studies the site, the accounts, the history, and whatever the team uploads, and builds the model everything else runs on — profile, voice, audience, competitors — plus the visual identity, moodboard, color tokens, and asset vault the AI later draws on to produce on-brand visuals and video. Ratified as a Brand Report, it becomes Strategy: a 90-day contract of bets, positioning, and guardrails, refreshed each quarter and corrected whenever the market or the numbers disagree with it.",
              "Then, run the cycle. An approved campaign plan becomes a set of briefs; approved briefs unlock production; finished content returns for review before it enters the calendar. Calendar ships it on time and stays hand-adjustable, and analytics reads the results — then proposes changes to strategy, briefs, formats, and timing.",
              "And never run blind. Signal watches the market daily — competitors, trends, risks, openings — and what it finds can spawn a new campaign direction or recalibrate the standing strategy. Performance flows back from inside. Strategy and the next campaign absorb both.",
            ],
          },
        ],
      },
      {
        number: "1.2 · My surfaces",
        title: "Three pages where the cycle meets a person.",
        sections: [
          {
            tags: "MY SCOPE · ONE PATH",
            heading: "Decide, produce, distribute",
            body: [
              "Mine were Home, Campaign, and Calendar — three surfaces I designed and rebuilt into one path through the loop: decide, produce, distribute. The work started with a category teardown, not a blank canvas — how social suites, AI content tools, and content calendars handle the same jobs — and the pattern repeats across all of them: these tools optimize for showing everything and deciding nothing. That gap became the brief for all three pages. The rest of the product — Signal, Strategy, Analytics — appears here as those pages’ upstream and downstream.",
            ],
          },
          {
            tags: "HOME · THE DAILY COMMAND DECK",
            heading: "Home decides what deserves today",
            body: [
              "Marketing tools in this category open on dashboards — chart walls, activity feeds, follower counts — because showing everything is easier than deciding anything. Home bets the opposite way: the first screen of an operating system should be the day’s decisions, not the brand’s vital signs. Its spec line is the whole brief in one sentence — “your live brand brief — what needs you today.”",
              "The hierarchy is decided by blocking order, not by importance-in-general. Action items lead — posts to review, publish, or route, each card carrying the signal that explains why it matters and exactly one primary action. The content queue comes second, with a live state on every item: scheduled, draft, rendering, ready. Signals sit beside it sorted by priority — amber means act now. The KPI tiles exist, but they are subordinate to the queue, never the page’s opening statement. And the assistant is a persistent input docked at the bottom — “Message Pulse” starts work from anywhere — not a floating bubble that covers the work.",
            ],
          },
          {
            tags: "CAMPAIGN · STRATEGY BECOMES PRODUCTION",
            heading: "Campaign places the person before and after the machine",
            body: [
              "AI content tools mostly start at a prompt box and end at a wall of drafts — generation first, judgment nowhere. Campaign is built as the reverse: it starts from the 90-day contract and refuses to generate anything a person hasn’t scoped. Three gates are real nodes in the build, not review theater — the plan is approved before direction or spend is committed, the brief before generation runs, the content before anything goes live.",
              "The page itself is decision-first. Approvals and the production queue sit above the campaign list — waiting on decision, due soon, escalated, brand-safety flags — and production is legible by stage: briefs, generating, content review, schedule, publish. Pulse suggests new campaign directions from the week’s signals, but a suggestion arrives as a card you adopt or dismiss, never as work already done. Inside a campaign, Create with AI is a conversation — a goal and a few assets in, a structured Creative Brief back as editable fields, and only approval hands off to generation. Behind it all runs an org-shaped chain — reviewer, brand admin, org owner — on SLA timers with an escalation that never auto-approves. Early on spend, late on quality: that placement is product design, not paperwork.",
            ],
          },
          {
            tags: "CALENDAR · THE CONTROL PLANE",
            heading: "Calendar balances the automatic and the hand",
            body: [
              "Content calendars in this category are grids you fill by hand — the calendar is where finished work goes to be arranged. Pulse’s Calendar was designed as something else: the control plane between production and publishing. Approved work flows into the schedule and ships on time without anyone pushing it, and a person can grab any of it back — drag a post to a better slot, hold a day, reshuffle a week.",
              "The layout serves that one job. Day, three-day, week, month, and list views share a single spine, so replanning never means relearning the page. Schedule health sits beside the grid — drafts, scheduled, generating, ready, failed — making what will ship as visible as what shipped. The scheduling queue holds campaign-generated work with auto-slotting a person can override per item. Automation you can always interrupt is the difference between a scheduler you trust and one you babysit.",
            ],
          },
        ],
      },
      {
        number: "1.3 · Design language",
        title: "Quiet on purpose.",
        sections: [
          {
            tags: "DESIGN LANGUAGE · UI DIRECTION",
            heading: "Neutral first, color with meaning",
            body: [
              "The stage stays neutral — gray ground, soft cyan light — so the work is the only thing that speaks. Color appears only when it means something: cyan for ready, blue for scheduled, amber for risk, red reserved for falling data. Learn the palette once and every screen after that reads itself. The same economy runs through the type: one face for everything, tabular numerals for data, and hierarchy built from size, spacing, and tone — never bold.",
              "The identity had to be settled fast, and it had to survive being reproduced by AI, so I kept the rules few and wrote every one of them down. I also refused to pick the direction by taste alone: the accent candidates ran against the same dashboard side by side, and the winner had to prove itself on a full Home screen before we ratified the palette. Writing the rules down felt like documentation at the time. It turned out to be the seed of everything that follows.",
            ],
          },
        ],
      },
      {
        number: "2.1 · Fragmentation",
        title: "One product, six incompatible prototypes.",
        sections: [
          {
            tags: "AI PROTOTYPING · FRAGMENTATION",
            heading:
              "Prototypes that only looked like one product",
            body: [
              "The operating loop you just toured is six weeks downstream of a very different scene. When I picked up Pulse, everyone was iterating on the same product in a different tool: canvas frames, an AI page-builder, model-pasted HTML, screens composited from images. An early style pass kept the pages looking related, but nothing underneath matched. With a week left before the pitch we had to fold all of it into one flow, and that is where the lesson landed for me. Visual consistency is not system consistency.",
            ],
          },
        ],
      },
      {
        number: "2.2 · Convergence",
        title: "From prototype fragments to one working product.",
        sections: [
          {
            tags: "CODE-FIRST · PROTOTYPE STRATEGY",
            heading: "Betting the pitch on code",
            body: [
              "A pitch needs a flow someone can click through and record, not a deck of stills, so the designer and I decided to prototype in code and let AI do most of the typing. To keep six parallel efforts roughly aligned, we seeded a thin style pass first. It gave us a shared look. It did not give us a system, and that difference shaped everything that followed.",
            ],
          },
        ],
      },
      {
        number: "2.2A · The map",
        title: "Home forced the whole system into view.",
        sections: [
          {
            tags: "HOMEPAGE · INFORMATION ARCHITECTURE",
            heading:
              "The front door forces the map",
            body: [
              "My page was Home, the product’s entry point, so designing it meant understanding every tab, every module, and everyone’s files. Extraction kept failing: styles were welded to pages, interactions died in transit, and much of the generated code was unreadable. The wake-up call was a single prototype file over ten thousand lines long. Nothing that size stays maintainable, for a person or, affordably, for a model.",
            ],
          },
          {
            tags: "OWN FILE FIRST · THE MILESTONE",
            heading:
              "If it’s all code anyway, hand it off clean",
            body: [
              "I started with my own file: split it, structured it, cleared the dead code. The realization underneath became the whole project. A prototype that looks right but is chaos in the code is still just a prototype — and since generating clean, structured code costs about the same as generating a mess, and it is all code either way, why not generate it in the shape engineering can actually receive, so the designer owns the real front-end result instead of throwing a picture over the wall?",
              "So I asked the engineers a question nobody had raised yet: if design ships code, what shape would you actually accept? Their stack was React, so I rebuilt on their conventions and the handover went cleanly. To me that was the real milestone — AI quietly closing the old, contentious gap between what design draws and what engineering has to build.",
            ],
          },
        ],
      },
      {
        number: "2.2B · The rebuild",
        title: "One app, built to receive real data.",
        sections: [
          {
            tags: "INTEGRATION · MIGRATION",
            heading:
              "Unify, engineer, migrate, merge",
            body: [
              "A week out, the call came to fold every prototype into one mockup and record the pitch video. I took them all: unify the surface, engineer file by file, migrate toward one stack, merge into a single runnable app. AI carried the bulk of the conversion and kept breaking things in transit, so I reviewed every page against its original and repaired every break by hand — a week of nights with a teammate.",
            ],
          },
          {
            tags: "MEETS REALITY · SAME LESSON",
            heading:
              "Then the real data didn’t fit",
            body: [
              "For the pitch I wired in the ML team’s real data — and the shapes didn’t match what the screens had assumed. It was the code lesson again, from the other side: a mockup that looks finished but can’t hold real data is still just a picture. We had built the UI first and treated data as a detail to pour in later, when the honest order is the reverse — start from the data that exists, tag it, and design the chart around what it can actually give. Looking right was never the bar; being real enough for engineering to receive — real code and real data both — was. That is the gap the shared base was built to close.",
            ],
          },
        ],
      },
      {
        number: "2.3 · System",
        title: "The visual language became a canonical system.",
        sections: [
          {
            tags: "TOKENS · COMPONENTS · ONE SOURCE",
            heading:
              "One canonical base, checked by machines",
            body: [
              "The fix was a base everyone shares. The look was ratified into one canonical token sheet — six semantic ramps in ten graded stops, a fixed type scale, an 8-based rhythm — layered primitives, semantics, components, so a theme rebinds one band and every component follows. Beneath it sit 62 standalone components, and every screen composes from those contracts before inventing anything page-local. Home, Campaign, and Calendar were the first surfaces to compose from it. The standard became commits rather than advice: formatting normalized the codebase, dead code came out, and dependency-free checks enforce the contracts in CI — including a contrast gate that fails the build on unreadable text.",
            ],
          },
          {
            tags: "STACK CHOICE · TEAM FLOOR",
            heading:
              "Stepping down from React, on purpose",
            body: [
              "I had proven I could ship the React path, and still made plain HTML and CSS the team’s prototype stack — an interim call, and one I stay honest about. Not everyone on the team can fully own engineering standards yet, and plain files meet everyone where they are: a designer and an engineer can both edit them, they export straight to Figma design boards, they preview from a double-click with no dev server to run, and they still convert cleanly into React or another framework later. A mockup a teammate can’t open might as well not exist. The floor mattered more than the ceiling — the discipline lives in the tokens and the checks, not the framework.",
            ],
          },
        ],
      },
      {
        number: "2.4 · Operating model",
        title: "The system became a way of working.",
        sections: [
          {
            tags: "SKILLS · AUTOMATION",
            heading:
              "Teaching the AI the system",
            body: [
              "A library only holds if every new prototype follows it, and re-typing the rules into a chat box every time is exactly how that falls apart. So I wrote the rules as skills the AI loads before it generates or edits: maintenance skills keep tokens, components, and previews in sync, and a design skill makes new work start on-system instead of getting repaired into it. Calendar began from that baseline, and the melee never came back.",
            ],
          },
          {
            tags: "LIVING RULES · COMPOUNDING QUALITY",
            heading: "The skill is a living document",
            body: [
              "When a review catches a drift, the fix lands in the skill’s markdown, not in someone’s memory. I keep editing those files the way engineers keep tests green: each decision we settle — a token, a component pattern, a rule about states — gets written where the AI reads it before it works. That is what makes the generation quality compound: every edit raises the floor of everything produced after it. The newest waves land the same way — a chart-color canon with its own dataviz skill, motion tiers, the accessibility gate — each written into the rules first, then swept through the app. And the latest system audit was simply the three skills, run end-to-end over the library they govern.",
            ],
          },
        ],
      },
      {
        number: "2.4A · Interfaces",
        title: "One source, several ways to use it.",
        sections: [
          {
            tags: "TWO PREVIEWS · HANDOFF",
            heading:
              "A surface for each side of the table",
            body: [
              "I grew a reading surface for each side of the table: a live component browser that renders every component and state from its standalone source, and a sliced, deliberately non-interactive Figma board built purely to be imported, so code UI flows back into design review. The handoff is not a snapshot either: when the system changes, a sync pass carries the decision back out to the designer surfaces.",
            ],
          },
          {
            tags: "PACKAGE · A SEPARATE MIGRATION",
            heading:
              "From preview to infrastructure",
            body: [
              "The HTML library stayed the source of truth. Separately, and later, a teammate re-migrated it into a typed React package on the team’s private registry — a distinct build that copies the canonical CSS in so the package can’t drift from its origin, then a CI job publishes that package and deploys its playground. The playground goes past looks: you feed a component data and watch it hold. That was the thing the melee had been missing — not talent, but an interface between the people who had to work together.",
            ],
          },
        ],
      },
      {
        number: "2.5 · Proof",
        title: "The same page before and after the system.",
        sections: [
          {
            tags: "CAMPAIGN PAGE · BEFORE / AFTER",
            // Fig. attach in the layout: before/after screenshots + the
            // tells card. Numbers from the Pulse repo's own git record
            // (campaign standalone track): 207 commits, 2026-06-18 → 07-04.
            heading:
              "Rebuilding a vibe-coded page, step by step",
            body: [
              "The clearest proof of all this is the Campaign page. It reached me as a teammate’s quick, vibe-coded prototype — one four-thousand-line HTML file, styles inlined, images pasted in as data, no system underneath. It looked like a product and behaved like a draft.",
              "Over about two and a half weeks I rebuilt it on the base, a commit at a time: I pulled the status tabs and badges out as real components, reshaped the flow from a flat Campaign Library into a decision-first Overview — what needs your approval and what’s mid-production, with the assistant proposing directions from the week’s signals — added the plan-diff gate and the approval chain, and finally let it consume the design-system components directly. Same brief; a real product. A picture became something engineering could receive and a designer could keep owning — which is the whole point.",
              "The quiet is the point too. Generated UI gives itself away in small tells, and the base forbids every one of them — so the more of the page the AI writes, the less it reads as AI-written. Quality stopped depending on who, or what, typed the code.",
            ],
          },
        ],
      },
    ],
    order: 0,
    featured: true,
  },
  {
    slug: "nyma",
    title: "Nyma",
    category: "uiux",
    layout: "nyma",
    cover: `/media/work/nyma/cover.png`,
    previewVideo: `/media/work/nyma/preview.mp4`,
    coverClass: "cover-nyma",
    tags: ["Platform Brand", "Product Design", "Design Engineering"],
    oneliner:
      "Nyma was not a rebrand layered onto a finished marketplace. As the only designer, I rebuilt its design layer across brand, product, and implementation—then codified the system so it could carry the platform from web into mobile.",
    blurb:
      "Nyma is a social resale platform for designer, luxury, and vintage fashion. Its commerce architecture worked when I joined, but its brand, product aesthetic, interface logic, and implementation rules did not yet form one platform.\n\nAs the only designer, I rebuilt that layer end to end: a platform idea around continuity, one visual and interaction grammar across the core web experience, and a coded framework the team could carry into mobile.",
    role: "Brand & Product Designer — the only designer",
    duration: "2025 – 2026",
    type: "Intern",
    teams: "2 founders · 1 front-end · 1 back-end",
    // One paragraph on purpose (2026-07-13 cleanup): the old second
    // paragraph restated the hero lede almost verbatim.
    summary: [
      "Nyma is a social resale platform for designer, luxury, and vintage fashion. Its commerce architecture worked when I joined, but brand, product aesthetic, interface logic, and implementation rules did not yet form one platform — so the work became rebuilding that layer end to end: a platform idea around continuity, one visual and interaction grammar for the core web experience, and a coded framework the team can carry into mobile.",
    ],
    // At-a-glance band — facts from the summary/chapters above: the νήμα
    // discovery, 30–40 hand-designed pages, codification into the repo,
    // and the manual's own pagination (17 pages).
    outcomes: {
      bullets: [
        "One platform language across brand, product, and interaction",
        "30–40 core web surfaces redesigned within the system",
        "Design and implementation rules codified in the front-end repo",
      ],
      stat: { value: "17", label: "operational brand-system pages" },
    },
    moment: {
      title:
        "When the brand became a framework for building the platform.",
      body: [
        "The turning point was not finding a story for the name. It was watching the same idea survive translation: from continuity as a brand principle, to color and type rules, to product flows, components, and finally code.",
        "I would bring visual critique in earlier and codify from month one. The framework built near the end would have made every earlier decision faster to test, easier to share, and less dependent on one designer’s memory.",
      ],
    },
    // Arc (deck slides 22–27): inheritance → thread → rulebook → pages →
    // codification → handoff; the Turn carries the νήμα discovery + the two
    // honest reflections. Facts from the Smarttwigs archive: 17 brand-manual
    // pages, 30–40 key desktop pages (deck claim, ~50 mocks in the final
    // export), role-based palette (#1C1A17 / #CF882E / #0D5EAF), Murecho.
    // Confidentiality: agency credit and mock personal data stay out of crops.
    chapters: [
      {
        number: "01 · The gap",
        title: "A working platform without a coherent design layer.",
        sections: [
          {
            tags: "PLATFORM AUDIT · AS FOUND",
            heading: "The commerce worked. The platform did not yet speak as one",
            body: [
              "I joined after the hard plumbing was done: marketplace and auction architecture in place, a website already live. But the brand rationale, product aesthetic, interface logic, and implementation rules had developed as separate decisions.",
              "Nyma was also more social than a listing board: people comment, save, and follow around the pieces. My scope became the missing design layer—one platform language the brand, product, and two-engineer team could all build from.",
            ],
          },
        ],
      },
      {
        number: "02 · The thesis",
        title: "Thread became a platform principle, not just a brand story.",
        sections: [
          {
            tags: "PLATFORM IDEA · RESEARCH",
            heading: "From a name to a way the platform should behave",
            body: [
              "Researching Nyma led me to νήμα—Greek for thread. It gave the name more than a story: garments move between owners, value circulates, provenance accumulates, and a community forms around what each piece carries forward.",
              "That made continuity the platform thesis. The brand had to feel archival rather than promotional; the product had to make history, condition, trust, and relationships visible; the system had to hold all of it together.",
            ],
          },
          {
            tags: "COMPETITIVE STUDY · DIRECTION TESTS",
            heading: "Testing which expression could carry the thesis",
            body: [
              "I mapped how secondhand platforms framed value—editorial, archival, transactional, or fashion-forward—then used moodboards and AI-assisted studies to compare those positions quickly.",
              "AI widened the option space; it did not choose the direction. The deciding question was whether each concept could support Nyma’s full product: luxury and vintage, community and commerce, expressive imagery and repeatable interface rules.",
            ],
          },
        ],
      },
      {
        number: "03 · The language",
        title: "One design grammar for every wardrobe.",
        sections: [
          {
            tags: "DESIGN LANGUAGE · OPERATIONAL RULES",
            heading: "A brand system that governs product decisions",
            body: [
              "The manual was not a style guide detached from the product. It defined what stays constant, where variation is allowed, and how brand choices shape interface behavior. Clarity, reduction, and structural consistency became operating rules.",
              "That shifted the identity from a set of assets into a shared decision framework. A founder, designer, or engineer could use the same logic to judge a new page instead of interpreting the brand from scratch.",
            ],
          },
          {
            tags: "COLOR ROLES · TYPE SYSTEM · INCLUSIVITY",
            heading: "Quiet enough to receive every wardrobe",
            body: [
              "Color carries roles, not decoration: Ceramic Black contains, archival whites surface content, Ceramic Yellow leaves a trace, and Activation Blue marks interaction. Type stays thin and precise, with mono reserved for system data.",
              "Restraint was not aesthetic minimalism for its own sake. The same shell had to hold a couture archive, a designer drop, and worn Levi’s without restyling itself. The quieter the system, the more varied the wardrobe it could receive.",
            ],
          },
        ],
      },
      {
        number: "04 · The product",
        title: "The design language became the product.",
        sections: [
          {
            tags: "CORE FLOWS · PRODUCT DESIGN",
            heading: "Applying one system across the platform’s spine",
            body: [
              "With the language in place, I redesigned the core web experience by hand in Figma: marketplace and auction surfaces, listing and seller flows, onboarding, profile, messaging, orders, and the social layer around each piece.",
              "Across those flows, the work was less about making each screen distinctive than making the platform recognizable as one system—the same hierarchy, pacing, components, and interaction logic across very different tasks.",
            ],
          },
          {
            tags: "CONTENT SYSTEM · RANGE TEST",
            heading: "Specific without becoming exclusive",
            body: [
              "Fashion resale needs imagery to make inventory feel alive, but Nyma had no content library. I combined licensed and public-domain references with AI-generated atmosphere, using generation to expand the world without deciding the product.",
              "Every choice was tested across three unlike wardrobes: luxury, designer, and vintage. Minimal structure let the objects lead; editorial pacing gave the platform a voice. The system had to feel specific without becoming exclusive.",
            ],
          },
        ],
      },
      {
        number: "05 · The framework",
        title: "The design language became an implementation framework.",
        sections: [
          {
            tags: "DESIGN SYSTEM · FRONT-END REPO",
            heading: "The repo became part of the design surface",
            body: [
              "Nyma did not need a heavy enterprise design system. It needed a small set of rules the product could not quietly drift away from: layout, type, spacing, component behavior, and reusable patterns written into the front-end repo.",
              "Codifying those decisions changed the deliverable. I was no longer handing engineering a collection of screens; I was giving the team a framework that could reproduce the same product logic on the next surface.",
            ],
          },
          {
            tags: "FIGMA · CODE · AI-ASSISTED BUILD",
            heading: "One loop between visual judgment and implementation",
            body: [
              "Figma remained the place for visual refinement, but it stopped being the only source of truth. I moved between Figma, Claude Design, Claude Code, and the repo, using each change to update the shared system rather than patch one screen.",
              "AI accelerated generation and translation only after the framework was explicit. With stable rules, it could extend the product; without them, it produced more interpretations. The leverage came from the system, not the prompt.",
            ],
          },
        ],
      },
      {
        number: "06 · The continuity",
        title: "One system carried the platform from web into mobile.",
        sections: [
          {
            tags: "MOBILE · ROADMAP · SYSTEM CONTINUITY",
            heading: "A framework the team could extend without starting over",
            body: [
              "As the team began the mobile build, I used the same framework to prepare starting directions, connect the roadmap to competitor research, and assemble a working prototype that combined the new flows with Nyma’s existing design rules.",
              "The point was not to predict every mobile screen. It was to give two engineers a coherent base for the next decision: the same brand logic, interaction grammar, and components adapted to a new surface without starting over.",
            ],
          },
        ],
      },
    ],
    order: 1,
    featured: true,
  },
  {
    slug: "vicino-ai",
    title: "Vicino AI",
    category: "uiux",
    layout: "vicino",
    cover: `/media/work/vicino/cover.png`,
    previewVideo: `/media/work/vicino/preview.mp4`,
    coverClass: "cover-vicino",
    tags: ["Product Design", "PM", "AI"],
    oneliner:
      "Turning Vicino's interactive creation canvas into a clearer workflow system people could read, redirect, and keep building on.",
    cardBlurb:
      "The earlier Vicino homepage made the product feel alive: draggable creation nodes, connected outputs, and a dark workflow canvas where concept, image, video, and 3D could sit in one spatial chain. My work started from that promise and pushed it toward a clearer product system.",
    blurb:
      "Vicino is a node-based generative video platform — a canvas where people build generation, composition, and editing as connected nodes rather than a linear timeline. The generation power was already there; the design challenge was what came after it. As the company moved toward B2B content production, the product had to grow from a capability-first tool into a guided, controllable video workflow — one that could carry both a creative-production veteran and a marketer who had never touched an AI video tool.\n\nMy role grew from screen-level design into product architecture. I worked with PMs, designers, engineers, the founding engineer, and ML engineers to clarify workflow stages, node responsibilities, editor logic, the Sidebar and Floating Bar layers, sliding panels, and the design system behind them. The core lesson was simple: new technical range only matters when people can still see what the system is doing and change its course.",
    role: "Product Designer / PM",
    duration: "2025 – present",
    type: "Intern",
    teams: "PMs, Design Team, Dev Team, Mkt Team",
    summary: [
      "When I joined Vicino AI, the product already had a strong interactive promise: creation should feel like a canvas of connected stages and outputs, not a stack of isolated tools. The hard part was carrying that feeling into the real product as 3D, image, video, editing, reference, and workflow features expanded.",
      "I helped frame the product around responsibility, not feature count. Nodes should represent meaningful stages and outputs. The Sidebar should hold global settings and model selection; the Floating Bar should carry the next step forward. Sliding panels should carry node-specific input, references, and version context. Editors should handle deep revision work. That separation gave the team a clearer language for deciding where new functionality belonged.",
    ],
    // At-a-glance band — facts from this page's own chapters: the main path
    // rebuilt on model feasibility (Ch.1), checkpoints over collapsed nodes
    // (Ch.1), and the four zones annotated on the station-04 board (Ch.2).
    outcomes: {
      bullets: [
        "Main path rebuilt around what models support",
        "Checkpoints let people inspect, redirect, decide",
        "One shared language for where features belong",
      ],
      stat: { value: "4", label: "zones, one shared framework" },
    },
    moment: {
      title:
        "When I realized the product did not need one more feature — it needed a clearer interaction model",
      // The title already carries the "one more feature → clearer model"
      // realization, so the body starts at the review-room scene (no repeat).
      body: [
        "During one review, we walked through a long creation chain: camera, 3D, image, prompt, and then video. On paper, each part was already becoming more capable. But when I tried to trace the flow from input to output, I realized the problem was no longer feature depth. The problem was that the system itself was becoming harder to explain. Even within the team, people were beginning to describe the same workflow in different ways. That was the moment I stopped treating the project as a series of screen problems and started treating it as a workflow problem.",
        "From then on the work was mostly about where complexity should live — and both halves of this project grew out of that one question. The flow gave people a path they could follow and correct; the zoning gave every kind of function a place to belong. What I keep from it is not any single screen but a way to grow a product: when the models cannot do everything in one shot, structure is what lets people — and the team — keep moving, and lets new features enter without reopening the same debate.",
      ],
      videos: [
        {
          src: `/media/work/vicino/preview.mp4`,
          poster: `/media/work/vicino/preview-poster.jpg`,
          caption:
            "The canvas end to end: a text prompt is enhanced into refined script text, wired into an Image node, then on into video generation.",
        },
        {
          src: `/media/work/vicino/moment-2.mp4`,
          poster: `/media/work/vicino/moment-2-poster.jpg`,
          caption:
            "The zoning decision, prototyped: global settings stay in the Sidebar while node-level inputs move into a Sliding Panel on the node itself. This node prototype was built by a teammate.",
        },
        {
          src: `/media/work/vicino/moment-3.mp4`,
          wide: true,
          poster: `/media/work/vicino/moment-3-poster.jpg`,
          caption:
            "The refine loop: a generated frame opens in the Image Editor, one region is redirected with a prompt, and the corrected image returns to the canvas for the next generation.",
        },
      ],
    },
    chapters: [
      {
        number: "Chapter 1",
        title: "Better automation was never the point. Better structure was.",
        sections: [
          {
            tags: "PROBLEM FRAMING · PRODUCT COMPLEXITY",
            heading:
              "The product was becoming more capable, but no one could clearly describe one end-to-end workflow",
            body: [
              "When I joined, the core problem wasn’t visual polish — and it wasn’t missing editing depth; we were never trying to out-edit Photoshop. It was that the models advanced fast but stayed unpredictable, and a near-blank canvas gave so much freedom that getting from an idea to a usable video was hard to learn and easy to get lost in. The tell was in the feedback: most of it wasn’t about the interface, but about how to use the models correctly and make the output more precise — people weren’t asking where a control lived, they were asking how to steer the generation and recover when a result came back wrong. B2B raised the stakes: the audience ran from creative-production veterans to marketers new to AI video, and the product had to guide both without slowing either down.",
              "The clearest signal came during review. Different teammates described the same workflow in different ways, which told me the issue was deeper than feature planning. The product did not simply need more capability. It needed a structure that people could actually hold in their heads. That became my starting point.",
            ],
            image: `/media/work/vicino/ch1-1.png`,
          },
          {
            tags: "WORKFLOW DESIGN · USER CAPABILITY",
            heading:
              "I stopped asking what the product could do, and started asking what users could actually understand",
            body: [
              "One of the biggest shifts in my thinking came when I stopped looking at the product only through capability. A traditional studio workflow assumes multiple specialists, each owning a different part of the process. A product cannot. Even if Vicino was growing toward more professional and studio-level use cases, the people actually using it would not necessarily think like a full production team. That meant the design challenge was not to reproduce a traditional pipeline step by step. It was to redefine what a workflow should look like when one person, or a much smaller team, is trying to work through systems that used to belong to several roles.",
              "That changed the questions I asked. I stopped asking only what the product was able to generate, and started asking what kind of flow a user could actually follow, revise, and finish. That shift made the work less about exposing more power and more about making power usable.",
            ],
          },
          {
            tags: "WORKFLOW STRUCTURE · MODEL CONSTRAINTS",
            heading:
              "I rebuilt the main path around what the models could actually support",
            body: [
              "Once I became more focused on feasibility, the main path started to clarify. Script, Storyboard, Image, and Video did not need to collapse into one “smart” object. They needed to do different jobs clearly. Script helped organize intent. Storyboard shaped pacing and visual sequence. Image worked better as a lighter preview and revision layer before users committed to video. Video then became the step that should happen with more intention, not less.",
              "One example made that logic very concrete for me. A video-first flow looked simpler on paper, but in practice it pushed users into the slowest and most expensive step before they could even confirm whether the content was right. By keeping image as a preview layer, users could correct composition, content, and direction before moving into motion. That made the workflow longer by one step, but much easier to control. It stopped being an idealized flow and became a usable one.",
            ],
          },
          {
            tags: "AI LIMITS · PRODUCT LOGIC",
            heading:
              "I was not packaging a finished capability — I was helping define what that capability should become as a product",
            body: [
              "The more I worked on the system, the more I realized that design was not happening after the technology was “done.” Some paths were too expensive, too unstable, or too uneven to be presented as a default experience. Some outputs needed an intermediate step where users could inspect and redirect the result before moving on. That meant design could not simply wrap an existing capability in a nicer interface. It had to help define the form that capability should take as a product.",
              "One of the clearest examples was our decision not to compress too much into a single node. A more collapsed version often looked cleaner at first, but it also removed the checkpoints users needed to understand and correct what was happening. In several cases, splitting one broad step into two smaller ones created a better product, not because the system became simpler underneath, but because the user finally had somewhere to pause, inspect, and decide.",
            ],
          },
        ],
      },
      {
        number: "Chapter 2",
        title: "Designing for control, collaboration, and scale",
        sections: [
          {
            tags: "HUMAN CONTROL · AGENT SUPPORT",
            heading:
              "The Stronger The Automation Became, The More Important It Was To Preserve Room For User Intervention",
            body: [
              "As we started thinking more seriously about how future assistive or agent-like behaviors might fit into the product, my position became clearer rather than more optimistic. I did not think better automation meant removing people from the process. Especially if the product was going to support more professional, higher-stakes creative work, users still needed room to inspect, revise, and redirect what the system was doing. A product could help them start faster, but it could not trap them inside a black box.",
              "That changed the way I thought about “smart workflows.” For me, a smart workflow was not one that made every decision on the user’s behalf. It was one that reduced friction without taking away control. Even if more assistive behaviors were introduced later, I wanted users to have visible points of intervention—places where they could step in, correct direction, and continue shaping the work.",
            ],
          },
          {
            tags: "INTERACTION ARCHITECTURE · INTERFACE LAYERS",
            heading:
              "I Distributed Different Kinds Of Complexity Across Four Interaction Layers",
            body: [
              "As the workflow became clearer, I started caring much more about where complexity should live. I did not want every new function to be solved by adding one more control to the same surface. Instead, I helped define a clearer distribution of responsibilities across the system. Nodes represented meaningful stages and outputs. The Sidebar handled global settings and model selection; the Floating Bar carried the next-step actions. Sliding panels supported local inputs, smaller adjustments, and version history. Editors took on deeper, reusable work that did not belong on the canvas.",
              "That separation mattered because it made future decisions easier. For example, version history made more sense in the Sliding Panel than in the Sidebar, because it belonged to the current node and current output—not to the broader system state. Once we started making decisions that way, the layers stopped feeling like visual containers and started working as a shared framework for where new functionality should live.",
            ],
          },
          {
            tags: "PM COLLABORATION · WORKING PROTOTYPES",
            heading:
              "I Used Rough But Structurally Clear Prototypes To Move Decisions Forward Before The Design Looked Finished",
            body: [
              "Another big shift for me was how I worked with the team. Because the roadmap, model behavior, and implementation state were all changing at once, this project did not fit a clean handoff model. Waiting until the design looked polished before sharing it would have slowed down the very conversations that needed to happen early. So I found myself relying much more on annotated flows, rough prototypes, and working structures that made the logic visible before the UI was fully refined.",
              "In one case, I even moved directly into a lightweight React prototype for the sliding panel instead of waiting to fully package everything in static specs first. That was not about skipping design craft. It was about helping PMs and engineers react to structure while the product logic was still moving. In this project, rough but clear prototypes were often the fastest way to build alignment.",
            ],
          },
          {
            tags: "DESIGN SYSTEMS · SCALABILITY",
            heading:
              "The Design System Stopped Being Cleanup Work And Became The Infrastructure That Let The Product Keep Growing",
            body: [
              "At the same time, I stopped treating the design system as something you do after the main design work is finished. As more workflows, editors, and support layers entered the product, consistency was no longer just a visual concern. It became a way to keep the product readable, keep the team aligned, and make future iteration easier. Without a clearer system, every new feature risked reopening the same structural debates.",
              "That became even more important as the product started preparing for future expansion, including faster workflow creation and more assistive features that might be introduced later. In practice, this meant standardizing more than just colors or spacing. It meant giving the team a stable language for layers, components, and behaviors, so new workflows could enter the system without forcing everyone to renegotiate the same patterns from scratch.",
            ],
          },
        ],
      },
    ],
    order: 2,
    featured: true,
  },
  {
    slug: "froghire-ai",
    title: "FrogHire.ai",
    category: "uiux",
    layout: "froghire",
    cover: `/media/work/froghire/cover.png`,
    previewVideo: `/media/work/froghire/preview.mp4`,
    coverClass: "cover-froghire",
    tags: ["UX Design", "Research", "AI"],
    oneliner:
      "Redesigning the AI-powered hiring experience for early-career talent — making algorithmic screening feel fair, transparent, and human.",
    blurb:
      "I redesigned FrogHire.ai, an early-stage AI job-matching platform, turning scattered bug fixes and negative reviews into a focused effort to rebuild user trust. Through usability testing, bug triage, and competitive analysis, I found the real issues weren’t missing features but missing guidance—users had no onboarding, unclear resume states, and opaque subscriptions. By reframing isolated complaints into systemic design problems, I delivered lightweight yet impactful fixes that restored signups, improved clarity, and helped the product survive its critical growth stage.",
    role: "UX Designer",
    duration: "06/2025 – 08/2025",
    type: "Intern",
    teams: "UX Designer, PM, Founder, Front End Engineers",
    summary: [
      "I redesigned FrogHire.ai, an early-stage AI job-matching platform, turning scattered bug fixes and negative reviews into a focused effort to rebuild user trust. Through usability testing, bug triage, and competitive analysis, I found the real issues weren’t missing features but missing guidance—users had no onboarding, unclear resume states, and opaque subscriptions. By reframing isolated complaints into systemic design problems, I delivered lightweight yet impactful fixes that restored signups, improved clarity, and helped the product survive its critical growth stage.",
    ],
    // At-a-glance band — figures from this page's own triage record (the
    // froghire layout's docket stats): three systemic flaws, recovered
    // signups, ~100 issues logged as QA of record.
    outcomes: {
      bullets: [
        "Three systemic flaws diagnosed under scattered bugs",
        "Lightweight fixes shipped within startup constraints",
        "Signup registrations recovered at a critical stage",
      ],
      stat: { value: "~100", label: "issues logged as QA of record" },
    },
    moment: {
      title: "“When I Learned Survival Can Be The Most Important Design Goal”",
      body: [
        "It was in the middle of a standoff over onboarding. The CEO pushed for a flashy animation, convinced it would impress users. Engineering immediately blocked it: too heavy, two weeks late. I had drafted the options, and for a moment I felt stuck between my own excitement for the “designed” solution and the harsh reality of deadlines.",
        "Then my mentor cut in: “The real problem isn’t which format. It’s that we have no onboarding at all.”",
        "That pause reframed everything. I realized that in a startup, elegance doesn’t matter if the product can’t survive. We shipped tooltips—lightweight, imperfect, but alive. Looking back, that moment reshaped how I define my role. My job isn’t just to design the perfect flow, but to protect the product’s ability to move forward. Sometimes, the most meaningful design choice isn’t the one that dazzles, but the one that keeps the door open for tomorrow.",
      ],
      videos: [
        { src: `/media/work/froghire/preview.mp4` },
        { src: `/media/work/froghire/moment-2.mp4` },
        { src: `/media/work/froghire/moment-3.mp4`, wide: true },
      ],
    },
    chapters: [
      {
        number: "Chapter 1",
        title:
          "“I refused to just patch bugs without seeing the bigger problem.”",
        sections: [
          {
            tags: "KICKOFF · PRD REVIEW · STAKEHOLDER INTERVIEWS",
            heading: "The First Time Startup Urgency Hit Me",
            body: [
              "At kickoff, the PM and mentor walked us through the product. It had many features, but they felt stitched together. The CEO pulled me aside and asked me to review every page, especially the negative reviews on the Chrome Web Store.",
              "Reading those comments, I realized this wasn’t school anymore—it was survival. No one was waiting for a polished framework; the CEO wanted metrics back up fast. That was when I felt it: design here wasn’t about ideal portfolios, but about relieving user pain immediately with limited resources.",
            ],
            image: `/media/work/froghire/ch1-1.png`,
          },
          {
            tags: "USABILITY TESTING · BUG LOGGING · USER FEEDBACK ANALYSIS",
            heading: "Testing Showed Me Users Weren’t Lost—They’d Been Left Behind",
            body: [
              "Every week I ran through the whole dashboard—subscriptions, resumes, job recommendations—logging every bug with screenshots. The problems piled up: hidden subscription flows, unclear resume states, job lists suggesting software engineering roles to marketing students.",
              "Then one review stung more than the rest—I’d felt the same on my first try. The problem wasn’t user intelligence—it was the product’s silence. No onboarding, no guidance, no hand to hold. Users weren’t lost; they’d been abandoned.",
            ],
            image: `/media/work/froghire/ch1-2.png`,
          },
          {
            tags: "COMPETITIVE ANALYSIS · COST EVALUATION · PRODUCT BENCHMARKING",
            heading: "I Learned That Chasing Trends Wasn’t an Option",
            body: [
              "My mentor showed me Simplify, Teal, and other competitors. They had sleek AI autofill features, and at first I thought we should too. But once we calculated costs, it was clear a startup couldn’t afford that.",
              "That reframed my mindset. Startup design wasn’t about piling on flashy features, but finding leverage points—low-cost changes that could restore trust and usability. It wasn’t about chasing the AI trend; it was about knowing what not to build.",
            ],
            image: `/media/work/froghire/ch1-3.png`,
          },
          {
            tags: "BUG TRIAGE · JOURNEY MAPPING · PROBLEM DEFINITION",
            heading: "From Scattered Bugs to Systemic Problems",
            body: [
              "Together with my mentor, I clustered bugs and feedback. Resume gaps, opaque subscriptions, scattered settings—they all pointed to systemic flaws: no onboarding, broken information hierarchy, missing trust.",
              "At first it felt like whack-a-mole: fix one bug, another pops up. But then it hit me: unless we asked bigger questions, users would keep leaving faster than we could patch. Why was conversion so low? Why were features ignored? Did users lose trust on day one?",
              "That was my turning point. I wasn’t just logging issues anymore—I was learning to turn bugs into design problems. That’s where design could shift the product from firefighting toward strategy.",
            ],
            image: `/media/work/froghire/ch1-4.png`,
          },
        ],
      },
      {
        number: "Chapter 2",
        title: "When Ideal Designs Collapsed, I Learned to Deliver What Survives",
        sections: [
          {
            tags: "ONBOARDING FLOWS · STAKEHOLDER FEEDBACK · DESIGN TRADE-OFFS",
            heading: "The First Lesson in Startup Compromise",
            body: [
              "I drafted three onboarding flows: pop-ups, a walkthrough, and an animated demo. The CEO immediately pushed for animation. Honestly, I felt a spark too—it looked more “designed.”",
              "But engineering shut it down flat, and my excitement dropped instantly. If users had no onboarding at all, even the flashiest animation meant nothing.",
              "Then my mentor cut in with the line that reframed the whole standoff: we’d been debating how, when the real problem was whether.",
              "And that was my first real startup lesson: elegant ideas rarely survive—the designs that ship are the ones that matter.",
            ],
            image: `/media/work/froghire/ch2-1.webp`,
          },
          {
            tags: "SUBSCRIPTION REDESIGN · RESUME MANAGEMENT · FILTERING EXPERIENCE",
            heading: "Fighting for Clarity, Accepting Half-Wins",
            body: [
              "Subscription clarity, resume control, filters—every redesign that summer went to the same bargaining table, and each round closed differently.",
              "Each round felt like bargaining. Sometimes I won clarity, sometimes only half. But I learned to prioritize: if the perfect solution won’t ship, even a partial step forward is still progress.",
            ],
            image: `/media/work/froghire/ch2-2.webp`,
          },
          {
            tags: "DESIGN SPECS · QA WALKTHROUGH · DEVELOPER HANDOFF",
            heading: "Becoming My Own QA",
            body: [
              "After handoff, the frontend often ignored our Figma components and used their own templates. When I saw the first build, I froze: the structure was right, but the details were unrecognizable.",
              "So I became my own QA—running every flow, screen-recording, capturing bugs. Subscription data missing, resume states broken, misaligned tooltips—I logged nearly a hundred issues. One engineer’s mid-QA admission was both funny and painful.",
              "Frustrating as it was, I learned something essential: in a strapped startup, the designer isn’t just a flow creator—they’re also the last line of defense for what makes it to production.",
            ],
            image: `/media/work/froghire/ch2-3.png`,
          },
          {
            tags: "SPRINT REVIEW · RETROSPECTIVES · DESIGN PRINCIPLES",
            heading: "From Frustration to Redefining My Role",
            body: [
              "In review, the PM said at least registration rates had recovered. The CEO called a demo “complete,” even though its value was limited. I felt torn—by their definition, we’d succeeded. But I knew this “completeness” was fragile.",
              "Then my mentor said the line that stuck with me all summer. Yes, we were living in trade-offs. But I could still fight for clarity and consistency where it mattered.",
              "That’s when I reframed my role. Design wasn’t just about pixels—it was about helping the product survive and move forward, even if imperfect. In a startup, sometimes keeping the product alive is the most meaningful design you can deliver.",
            ],
            image: `/media/work/froghire/ch2-4.png`,
          },
        ],
      },
    ],
    order: 3,
    featured: true,
  },
  {
    slug: "roper-center",
    title: "Roper Center",
    category: "uiux",
    layout: "roper",
    cover: `/media/work/roper/cover.png`,
    previewVideo: `/media/work/roper/preview.mp4`,
    coverClass: "cover-roper",
    tags: ["UX Design", "Data Viz"],
    oneliner:
      "Redesigning public opinion data discovery for researchers and the general public.",
    blurb:
      "I led the redesign of Roper Center’s educational simulation platform, reframing it from a confusing quiz-like tool into a structured learning experience. I uncovered systemic issues through heuristic evaluation, competitive analysis, and user testing: unclear navigation, misleading progress bars, and a lack of educational alignment. By translating pain points into design goals—clarity, feedback, motivation, and learning outcomes—I rebuilt the simulation so progress finally meant comprehension.",
    role: "UX Designer, Project Manager",
    duration: "09/2024 – 12/2024",
    type: "Client-Based Project",
    teams: "UX Designers, UX Researchers, Project Manager, Software Engineers",
    summary: [
      "I led the redesign of Roper Center’s educational simulation platform, reframing it from a confusing quiz-like tool into a structured learning experience. I uncovered systemic issues through heuristic evaluation, competitive analysis, and user testing: unclear navigation, misleading progress bars, and a lack of educational alignment. By translating pain points into design goals—clarity, feedback, motivation, and learning outcomes—I rebuilt the simulation so progress finally meant comprehension.",
    ],
    // At-a-glance band — facts from the chapters above: heuristic audit +
    // student testing, the checkpoint progress redesign, citations reframed
    // as rewards, and the four principles (clarity, feedback, motivation,
    // outcomes).
    outcomes: {
      bullets: [
        "Heuristic audit and student testing exposed hollow progress",
        "Progress bar rebuilt as comprehension checkpoints",
        "Citations reframed as rewards students actually open",
      ],
      stat: { value: "4", label: "design principles, from testing" },
    },
    moment: {
      title:
        "Most Memorable Moment： The Day I Realized That Progress Bars Can Mislead Learning",
      body: [
        "During usability tests, students smiled when the progress bar filled up and said, “I’m done, I’ve learned it.” Yet when asked follow-up questions, many couldn’t recall the key concepts. That contradiction was striking: the interface signaled success, but the learning had not happened. It wasn’t just a UI bug—it was a gap between appearance and outcome.",
        "That moment reshaped how I thought about educational design. A progress bar is not just decoration; it is a promise. As Don Norman reminds us, affordances guide expectations. For Roper Center, the real goal wasn’t “finishing a task” but “retaining knowledge.” That realization led me to redesign progress as layered checkpoints with feedback and citations, turning completion into genuine understanding.",
      ],
      videos: [{ src: `/media/work/roper/preview.mp4`, wide: true }],
    },
    chapters: [
      {
        number: "Chapter 1",
        title: "When “A Quiz Game” Failed to Teach Anything",
        sections: [
          {
            tags: "Stakeholder Briefing · Product Vision · Initial Assumptions",
            heading: "The Kickoff That Looked Like Learning but Wasn’t",
            body: [
              "The Roper Center came to us with an educational simulation tool that looked like a quiz game. Students could click through questions, earn points, and see progress bars fill up. On the surface, it felt like learning. But in kickoff discussions, faculty admitted: “Students play, but they don’t retain.” My first realization was that this wasn’t about polishing visuals—it was about uncovering why “fun” wasn’t translating into knowledge.",
            ],
            image: `/media/work/roper/ch1-1-r1.png`,
          },
          {
            tags: "Heuristic Evaluation · UX Audit",
            heading: "The Audit Promised Usability but Revealed Deeper Gaps",
            body: [
              "I started with a heuristic evaluation. What I found was subtle but serious: ambiguous navigation, misleading progress indicators, and no cues linking actions to learning outcomes. A progress bar suggested mastery, yet no feedback confirmed understanding. These issues weren’t just usability flaws—they revealed a deeper problem: the system measured activity, not comprehension.",
            ],
            image: `/media/work/roper/ch1-2.png`,
          },
          {
            tags: "User Interviews · Affinity Mapping · Jobs-to-Be-Done",
            heading: "When Points Felt Hollow, Students Asked for Proof",
            body: [
              "User testing with high school and university students reinforced this gap. Many completed tasks quickly, but when asked to recall citations or explain reasoning, they hesitated. One student put it bluntly: “It feels like a game, not like I’m learning.” That insight reframed our challenge: the design goal was not to keep students clicking, but to give them proof of progress they could believe in.",
            ],
            image: `/media/work/roper/ch1-3-r1.png`,
          },
          {
            tags: "Insight Synthesis · Design Principles · Evidence-Based Framing",
            heading: "The Moment Complaints Became a Design Compass",
            body: [
              "From evaluation and testing, I distilled four design principles: clarity (navigation and progress must be unambiguous), feedback (immediate confirmation of understanding), motivation (gameplay should reinforce effort, not distract), and outcomes (design must point back to learning goals). This translation—from scattered complaints to structured principles—was the foundation for everything that followed.",
            ],
            image: `/media/work/roper/ch1-4-r1.png`,
          },
        ],
      },
      {
        number: "Chapter 2",
        title: "When Iteration Turned Gameplay Into Genuine Learning",
        sections: [
          {
            tags: "Wireframes · Task Flow · Interaction Patterns",
            heading: "When A Progress Bar Stopped Lying About Learning",
            body: [
              "The first design challenge was progress. The old bar filled up no matter what, misleading students into thinking completion meant comprehension. I redesigned it as layered checkpoints: each segment unlocked only when students demonstrated understanding, with brief feedback at every step. Progress stopped being decoration—it became evidence of learning.",
            ],
            image: `/media/work/roper/ch2-1.png`,
          },
          {
            tags: "Usability Testing · Feedback Loop · Cognitive Load",
            heading: "How Feedback Turned Empty Clicks Into Learning Moments",
            body: [
              "In usability tests, students said they clicked without thinking because the system never asked them to pause. I introduced immediate feedback—correct answers revealed sources, wrong ones showed hints and citations. This transformed clicks into moments of reflection, teaching students that learning wasn’t about speed, but about engaging with evidence.",
            ],
            image: `/media/work/roper/ch2-2.png`,
          },
          {
            tags: "Gamification · Rewards System · Behavior Design",
            heading:
              "The Day Sources Stopped Being Ignored And Started Driving Learning",
            body: [
              "Early prototypes treated citations as optional drawers, but students ignored them. I reframed citations as part of gameplay: correct answers unlocked sources, and exploring them earned small achievements. What was once a burden became motivation—students engaged with primary sources not because they had to, but because it felt rewarding.",
            ],
            image: `/media/work/roper/ch2-3.png`,
          },
          {
            tags: "Iteration · Prototype Testing · Design System Alignment",
            heading: "The Redesign Shipped, But The Process Stayed",
            body: [
              "The lasting impact wasn’t any single deliverable. Every design choice traced back to a pain point, every feature mapped to a principle. The redesign didn’t just make the tool usable—it made it educational.",
            ],
            image: `/media/work/roper/ch2-4.png`,
          },
        ],
      },
    ],
    order: 5,
    featured: false,
  },
  {
    slug: "cloud-support-futures",
    title: "Cloud Support Futures",
    category: "uiux",
    layout: "cloud-futures",
    cover: `/media/work/cloud-futures/cover.png`,
    coverClass: "cover-cloud-futures",
    tags: ["Speculative Design", "UX Research", "AI"],
    oneliner:
      "A Cornell × Google Cloud research studio on AI customer support: literature review, market analysis, speculative testing, and a framework for where AI should stop.",
    blurb:
      "How much of customer support should an AI be allowed to do? Over a semester-long sponsored studio with Google Cloud, our six-person Cornell team treated that as a research question before it became an interface question. We reviewed five domains, benchmarked support systems, ran low-fidelity probes with cloud users, and then tested four deliberately unbalanced human–AI power structures around the same billing case.\n\nThe consistent finding was not that users wanted a specific automation percentage. They wanted partnership with legible roles: AI could detect patterns, summarize evidence, and prepare the case; a human still needed to verify, interpret, and own the outcome. The final prototype became a synthesis artifact, but the main deliverable was a four-principle design framework and five tensions for evaluating future AI support systems.",
    role: "Product Designer & Researcher",
    duration: "Sep – Dec 2025",
    type: "Sponsored studio",
    teams: "Six-person Cornell MPS team · Google Cloud UX",
    // Confidentiality (public repo): teammates and Google stakeholders stay
    // unnamed; no internal links or file paths; demo personas (Jordan, Anna)
    // are the prototype's own fiction. The hi-fi film ships as a trimmed cut —
    // product story only. Copy voice: "we" for team work, "I" only where the
    // owner speaks for himself.
    summary: [
      "Google Cloud’s support question is a scaling question: a growing customer base, increasingly complex needs, and human expertise that does not scale with either. The studio brief asked us not to optimize today’s ticket flow but to imagine support five years out, then work backwards through research, testing, and critique.",
      "So instead of leading with a feature, we led with evidence. Literature review and market analysis shaped the research questions; two extreme worlds probed where users draw the automation line; four short films tested different power structures. Only after that did we build the value-centered world: AI does the reading, a human does the deciding.",
    ],
    // At-a-glance band — facts from the blurb/summary above and the layout's
    // framework section: two extreme worlds, four films of power structures,
    // the AI-prepares/humans-decide verdict, 4 principles + 5 open tensions.
    outcomes: {
      bullets: [
        "Two extreme worlds probed the automation line",
        "Four films tested four human–AI power structures",
        "Verdict: AI prepares the case, a human decides",
      ],
      stat: { value: "4", label: "principles · five open tensions" },
    },
    moment: {
      title:
        "When we split the labor of care, what exactly are we redesigning?",
      body: [
        "Delegating presence and attention to AI while reserving judgment and action for humans is efficient — every study we ran says users prefer it. But the research left us with a sharper question than the one we started with: are we optimizing a service interaction, or fundamentally redesigning what a care relationship can be?",
      ],
    },
    order: 4,
  },
  {
    slug: "hunger1942",
    title: "Hunger 1942",
    category: "interaction-games",
    layout: "hunger",
    // cover-v3: masthead credit line redacted (teammate real-name policy) and
    // the baked XUYAUN typo glyph-swapped; renamed to bust caches.
    cover: `/media/work/hunger/cover-v3.png`,
    previewVideo: `/media/work/hunger/preview.mp4`,
    coverClass: "cover-hunger",
    tags: ["Game Design", "History"],
    oneliner:
      "A 2D survival RPG set during the 1942 Henan Famine — blending oral history with gameplay.",
    blurb:
      "Hunger 1942 is a 2D survival RPG set during the 1942 Henan Famine, blending real histories with gameplay to explore human struggle in disaster.",
    role: "Game Designer, Producer",
    duration: "09/2022 – 04/2024",
    type: "Undergraduate",
    teams: "Game Design, History Research",
    // At-a-glance band — facts from the poster intro below: project initiated
    // and led by the owner (design, research, programming), levels built from
    // collected oral histories, demo finalized August 2023.
    outcomes: {
      bullets: [
        "Initiated and led design, history research, and code",
        "Levels built from collected real oral histories",
        "Playable demo finalized in August 2023",
      ],
      // "2" is the moral-value branch printed on the broadsheet itself: the
      // first act ends on a low-moral or high-moral plot line. (The previous
      // stat "1942" was the setting's year, not an outcome.)
      stat: { value: "2", label: "endings to the first act, set by moral choices" },
    },
    poster: {
      lede: "Hunger 1942 is a 2D survival RPG set during the 1942 Henan Famine, blending real histories with gameplay to explore human struggle in disaster.",
      image: `/media/work/hunger/cover-v3.png`,
      intro: [
        "Hunger 1942 is a game project that I initiated and developed with my team. It is a 2D pixel-style historical role-playing survival game inspired by The Oregon Trail, set against the backdrop of the 1942 Henan Famine. The project encompasses the game itself, artistic direction, and historical research.",
        "Launched in September 2022, the historical research and foundational game framework were completed by January 2023. The game was inspired by reflections on food shortages during COVID-19 and insights from my modern Chinese history class, prompting me to explore the struggles of ordinary people during times of catastrophe.",
        "In designing the game, I combined survival mechanics with a narrative drawn from real oral histories to immerse players in the harsh realities of famine. Additionally, this project serves as a platform to examine how games can function as both educational tools and interactive art. I aim to explore how game mechanics and player interactions shape decision-making and emotional engagement.",
        "My role encompassed game design, historical research, and programming. Looking ahead, I hope to further develop this project within a studio setting.",
      ],
      details: {
        project: "Hunger 1942",
        client: "Undergraduate",
        year: "09/2022 – 04/2024",
        services: "Game Design, History Research",
        livePreview: {
          label: "HUNGER 1942",
          href: "https://youtu.be/TUj10C2kW38",
        },
      },
      body: [
        "During the COVID-19 epidemic in 2022, intense pressures from lockdowns, financial difficulties, illness, and food shortages gradually shifted people's attitudes from empathy toward self-interest. Such shifts are understandable under extreme circumstances. When studying modern Chinese history, I saw parallels in the hardships and changing human nature during the 1942 famine, making me reflect on how history repeats itself. Whether resisting Japan a century ago or battling today's epidemic, we often highlight concepts of “righteousness.” Yet beneath such ideals, the suffering of ordinary people is frequently summarized by a simple phrase like \"the people lived in misery,\" with their individual stories overlooked.",
        "Chinese culture deeply romanticizes self-sacrifice—using one's most precious life for collective ideals—as the highest form of achievement. From feudal loyalty and early Republican patriotism to today’s vision of national rejuvenation, we consistently celebrate sacrifice for grand objectives. Yet narratives unrelated to these ideals are often marginalized or forgotten. History textbooks selectively pass down the stories deemed worthy, reinforcing a focus on collective righteousness. This raises the question: shouldn’t ordinary people’s everyday struggles also be understood, giving us a fuller, more authentic historical picture? Perhaps understanding their hardships can deepen our reflection on the very ideals we hold dear.",
        "Though there is no definitive \"correct\" way to narrate history, by examining ordinary lives in past disasters—as we now experience personally during this epidemic—we can develop deeper empathy and thoughtfully reconsider concepts such as \"righteousness,\" \"justice,\" and \"humanity.\" Our project focuses specifically on the 1942 Henan famine, collecting overlooked individual narratives and using the immersive quality of games to reconstruct a realistic historical environment. Through authentic stories and personal choices, we encourage players to reflect critically and independently, striving always to maintain historical objectivity and avoid ideological bias.",
      ],
      gallery: [
        `/media/work/hunger/gallery-1-v2.png`,
        `/media/work/hunger/gallery-2-v2.png`,
        `/media/work/hunger/gallery-3.png`,
        `/media/work/hunger/gallery-4.png`,
      ],
    },
    order: 6,
  },
  {
    slug: "vr-education",
    title: "VR Monarch Butterfly",
    category: "interaction-games",
    layout: "vrmb",
    cover: `/media/work/vr/cover.png`,
    coverClass: "cover-vr-monarch",
    tags: ["VR Design", "Unity"],
    oneliner:
      "A Unity VR documentary that puts you inside the monarch migration — education by embodiment.",
    blurb:
      "A winter-term VR documentary of the monarch migration, built in Unity and explored through a headset.",
    role: "Designer, Developer",
    duration: "12/2022 – 1/2023",
    type: "Undergraduate",
    teams: "Digital Art, Immersive Experience, Digital Education",
    // At-a-glance band — facts from the poster copy below: Unity environment
    // built with two fellow students in one winter term, documentary
    // narration with in-scene interactive triggers, owner's role = scene
    // creation and development.
    outcomes: {
      bullets: [
        "Monarch migration rebuilt as a Unity VR habitat",
        "Documentary narration with in-scene interactive triggers",
        "Scene creation and development, first interaction design",
      ],
      stat: { value: "3", label: "students · one winter term" },
    },
    poster: {
      lede: "A winter-term VR documentary of the monarch migration, built in Unity and explored through a headset.",
      image: `/media/work/vr/cover.png`,
      intro: [
        "VR Monarch Butterfly is an interactive VR documentary built during Winter Term, January 2023 — my first exploration into interaction design. With two fellow students I constructed the environment in Unity, recreating the monarchs’ annual migration: habitats, routes, and behaviors staged to be felt, not just watched.",
        "A documentary-style narration carries the educational context, split into audio triggers placed through the grove — each passage set off by exploring, listening, and observing up close — while AI agents steer the butterflies’ flight paths.",
      ],
      details: {
        project: "VR Monarch Butterfly",
        client: "Undergraduate",
        year: "12/2022 – 1/2023",
        services: "Digital Art, Immersive Experience, Digital Education",
      },
      body: [
        // bench: the one claim this chapter owns — term/team/tools already
        // live in the intro, hero meta, and details rail
        "Explored through a headset, the piece tests how much documentary and educational weight a realistic VR environment can carry.",
        // coda: neutral statement of the planned next step (the 2023 source
        // wrote it in future tense; the particle strip below sketches it)
        "The planned coda: the realistic butterflies dissolving into particle effects synced to the music — documentary becoming instrument. The strip below sketches it.",
      ],
      gallery: [
        `/media/work/vr/gallery-1.png`,
        `/media/work/vr/gallery-2.png`,
        `/media/work/vr/gallery-3.png`,
        `/media/work/vr/gallery-4.png`,
      ],
    },
    order: 7,
  },
];
