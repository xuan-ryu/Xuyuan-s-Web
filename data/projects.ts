// Project data transcribed verbatim from the Framer export
// (local Framer export work/*/index.html). Two templates exist on the
// live site: "case" (vicino-ai, froghire-ai, roper-center) and "poster"
// (hunger1942, vr-education). Copy intentionally preserves the source text,
// including its quirks ("one more features", full-width colon).


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

export type Project = {
  slug: string;
  title: string;
  template: "case" | "poster";
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
    template: "case",
    // TODO: drop in a cover image + a Featured hover preview clip when ready.
    coverClass: "cover-pulse",
    tags: ["Product Design", "Design System", "AI"],
    oneliner:
      "Pulse is an AI marketing platform — strategic signal to published post, with a person at every gate. I joined a team prototyping it in six different tools, a week from a pitch — and built the design production system so that rescue never happens twice.",
    blurb:
      "Pulse is an AI marketing platform that takes a brand team from a strategic signal to a published social post without giving up human judgment. I joined to design its homepage — and left owning the way the whole team ships: the unified pitch mockup merged from everyone’s prototypes, a token-driven design system of 40 components, the standards and automation that keep AI-generated UI on-system, and the campaign production flow with a person at every gate.\n\nTwo beliefs run through the work. Pages that look alike aren’t a product until they share one system. And AI should draft while humans decide — every generative step is wrapped in an editable brief, a review, or an approval gate.",
    role: "Product Designer · Design System · Front-end",
    duration: "2025 – present",
    type: "Intern",
    teams: "PMs, Design Team, Dev Team",
    // Overview = what Pulse is + the owner's scope, once. The belief lives in
    // the moment band; the acts carry the detail — no smearing.
    summary: [
      "Pulse takes a brand team from a strategic signal to a published social post — an AI marketing platform that never gives up human judgment. When I picked it up, the team was prototyping that one product in six different tools — pages that looked alike and shared nothing underneath — with about a week to fold them into a flow we could pitch.",
      "Over five intensive weeks I went from owning the homepage to owning how the team ships: the merged mockup itself, then the token-driven design system and component library, the automation that keeps AI-generated UI on-system, and the handoff surfaces that let design, engineering, ML, and product finally work from one base.",
    ],
    moment: {
      title:
        "When Pulse turned me from someone who ships pages into someone who builds the system that ships them",
      body: [
        "Pulse did not hand me a design-system brief. It handed me a melee: one product, six tools, a deadline, and the discovery that pages which look identical can share nothing at all. The real deliverable was never one more screen. It was the base underneath all of them.",
        "So the work became structure. Tokens instead of taste, components instead of copies, and written rules an AI loads instead of instructions repeated into a chat box. Design reads previews, engineering reads a typed package, ML reads data states, product reads one runnable flow. The melee ended when everyone stopped squeezing into the same files and started shipping from the same base.",
        "One rule survived every iteration untouched: AI can draft and schedule, but a person always releases to publish. Speed where it helps, a deliberate checkpoint where it matters. That balance, not the automation, was the design.",
      ],
      // TODO: add a screen recording of New Post -> Create with AI -> editable brief -> approve.
    },
    // Arc (owner 2026-07 rework #2 — the full first-person causal chain):
    //   melee -> bet -> look -> wake-up -> rescue -> base -> skills ->
    //   interface -> product; the Turn (moment) closes it.
    // Engineering facts are verified against the Pulse repo's own git record
    // (2026-07-04 audit): 824 commits over five weeks (308 structural), the
    // monolith's true historical peak is 10,180 lines (the earlier 13,020
    // figure did not survive the audit), 40 components in the handoff
    // library (37 in the React package), 1,905 net dead lines removed
    // (commit-subject verbatim).
    // Confidentiality: teammates stay anonymous, tools are described as
    // categories (no brand list), no package identity, no commit hashes.
    // The pulse layout attaches its specimen figures to these positionally.
    chapters: [
      {
        number: "01 · The melee",
        title: "Same product, six tools — and not one shared line.",
        sections: [
          {
            tags: "AI PROTOTYPING · FRAGMENTATION",
            heading:
              "Prototypes that only looked like one product",
            body: [
              "When I picked up Pulse, everyone was iterating on the same product in a different tool: canvas frames, an AI page-builder, model-pasted HTML, screens composited from images. An early style pass kept the pages looking related, but nothing underneath matched. With a week left before the pitch we had to fold all of it into one flow, and that is where the lesson landed for me. Visual consistency is not system consistency.",
            ],
          },
        ],
      },
      {
        number: "02 · The bet",
        title: "Boards can’t be pitched. Working code can.",
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
        number: "03 · The look",
        title: "Branding at deadline speed: a studio, not a dashboard.",
        sections: [
          {
            tags: "BRAND · UI DIRECTION",
            heading: "Neutral first, color with meaning",
            body: [
              "The identity had to be settled fast, and it had to survive AI reproduction, so I kept the rules few and wrote every one of them down. I also refused to pick the direction by taste alone. The accent candidates ran against the same dashboard side by side, and the winner had to prove itself on a full Home screen before we ratified the palette.",
            ],
          },
        ],
      },
      {
        number: "04 · The wake-up",
        title: "Owning Home meant reading everyone’s code.",
        sections: [
          {
            tags: "HOMEPAGE · INFORMATION ARCHITECTURE",
            heading:
              "The front door forces the map",
            body: [
              "My page was Home, the product’s entry point, so designing it meant understanding every tab, every module, and everyone’s files. Extraction kept failing: styles were welded to pages, interactions died in transit, and much of the generated code was unreadable. The wake-up call was a single prototype file 10,180 lines long. Nothing that size stays maintainable, for a person or, affordably, for a model.",
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
        number: "05 · The rescue",
        title: "One week, every prototype, one app.",
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
        number: "06 · The base",
        title: "The look became law: one base the whole team ships from.",
        sections: [
          {
            tags: "TOKENS · COMPONENTS · ONE SOURCE",
            heading:
              "One canonical base, checked by machines",
            body: [
              "The fix was a base everyone shares. The look was ratified into one canonical token sheet — six semantic ramps, a fixed type scale, an 8-based rhythm — beneath the 40 standalone components, and every screen composes from those contracts before inventing anything page-local. The standard became commits rather than advice: Prettier normalized the codebase, I purged 1,905 verified-dead lines, and a dependency-free check now enforces all of it in CI.",
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
        number: "07 · The skills",
        title: "Rules the AI loads, so nobody has to repeat them.",
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
              "When a review catches a drift, the fix lands in the skill’s markdown, not in someone’s memory. I keep editing those files the way engineers keep tests green: each decision we settle — a token, a component pattern, a rule about states — gets written where the AI reads it before it works. That is what makes the generation quality compound: every edit raises the floor of everything produced after it.",
            ],
          },
        ],
      },
      {
        number: "08 · The interface",
        title: "Four roles, one base: previews, a package, a playground.",
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
        number: "09 · The product",
        title: "What the base carried: a studio with a person inside.",
        sections: [
          {
            tags: "SURFACES · HIERARCHY · ASSISTANT",
            heading:
              "A calm studio, not a dashboard",
            body: [
              "On top of the system sits the application: a sidebar workspace that runs from Home and its docked assistant through Calendar, Signal, Analytics, Strategy, Campaigns, and the production Studio. Hierarchy comes from tone, spacing, and rhythm before borders, and every screenshot on this page renders from a plain file:// address.",
            ],
          },
          {
            tags: "AI FLOW · CREATIVE BRIEF",
            heading:
              "A light brief, drafted by the AI, owned by the human",
            body: [
              "A post starts inside its campaign. New Post, then Create with AI, and from there it is a conversation rather than a form: the user gives a goal and a few assets, Pulse reads the brand vault and the campaign, and a structured Creative Brief comes back as editable fields inside the chat. Only approval hands off to generation.",
            ],
          },
          {
            tags: "APPROVALS · GUARDRAILS",
            // The publish-guardrail rule is set once by the pulse layout as the
            // guardrail artifact below this section - not repeated here.
            heading:
              "Two gates and a guardrail keep a person in charge",
            body: [
              "Approval runs through an ordered chain — reviewer, brand admin, org owner — with SLA timers and an escalation that never auto-approves. A plan gate signs off direction and spend before any credits burn; a content gate signs off the finished creative before it goes live.",
            ],
          },
          {
            tags: "CAMPAIGN PAGE · TAKEOVER",
            // Fig. attach in the layout: before/after screenshots + a build-diff
            // card. Numbers from the Pulse repo's own git record (campaign
            // standalone track): 207 commits, 2026-06-18 → 07-04.
            heading:
              "Rebuilding a vibe-coded page, step by step",
            body: [
              "The clearest proof of all this is the Campaign page. It reached me as a teammate’s quick, vibe-coded prototype — one four-thousand-line HTML file, styles inlined, images pasted in as data, no system underneath. It looked like a product and behaved like a draft.",
              "Over about two and a half weeks I rebuilt it on the base, a commit at a time: I pulled the status tabs and badges out as real components, reshaped the flow from a flat Campaign Library into a decision-first Overview — what needs your approval and what’s mid-production, with the assistant proposing directions from the week’s signals — added the plan-diff gate and the approval chain, and finally let it consume the design-system components directly. Same brief; a real product. A picture became something engineering could receive and a designer could keep owning — which is the whole point.",
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
    template: "case",
    cover: `/media/work/nyma/cover.png`,
    coverClass: "cover-nyma",
    tags: ["Brand & Product", "Design System", "AI Workflow"],
    oneliner:
      "Nyma is a social resale platform for designer, luxury, and vintage fashion — people comment, save, and follow around the pieces, not just buy them. I joined as the only designer after the marketplace and auction architecture were built, and gave the platform what it didn’t have yet: a brand with a reason, a visual system, and design rules codified into the front-end repo.",
    blurb:
      "Nyma is a 2C social resale platform for designer, luxury, and vintage fashion — closer to a community formed around garments than a listing-based marketplace. When I joined, the transaction and auction architecture were already in place and a website was live, but the visual foundation was weak, the UI logic needed cleanup, and the founders liked the name Nyma without a story behind it.\n\nMy work was the design layer, end to end: I traced the name to νήμα — Greek for thread — and rebuilt the brand around continuity, designed the key pages by hand, wrote the 17-page brand manual, and then codified the system into the front-end repo so a team of one front-end engineer, one back-end engineer, and no designer can keep shipping consistently after my contract ends.",
    role: "Brand & Product Designer — the only designer",
    duration: "2025 – 2026",
    type: "Intern",
    teams: "2 founders · 1 front-end · 1 back-end",
    summary: [
      "Nyma is a 2C social resale platform for designer, luxury, and vintage fashion. Users don’t just buy and sell — they comment, save, and follow around the pieces, so the product has to feel like a community formed around garments, not a transaction site. When I joined, the marketplace and auction architecture were built and a website was live; what was missing was the design layer. The visual foundation was weak, the UI logic needed cleanup, and the founders liked the name Nyma without being able to say what it meant.",
      "I traced the name to νήμα — Greek for thread — and everything hung from that: moodboards and AI-assisted direction studies, a 17-page brand manual with role-based color and an archival typographic voice, thirty-odd key pages designed by hand in Figma — and finally the whole system written into code, so the rules survive me and the team can build mobile without a designer in the room.",
    ],
    moment: {
      title:
        "When a name the founders just liked became the thread everything hangs from",
      body: [
        "Nyma didn’t need a logo first; it needed a reason. The founders liked the sound of the name, but nobody could say what it meant. Researching it, I found νήμα — Greek for thread — and the whole brand was suddenly in one word: garments carrying stories from one owner into the next, resale as continuity instead of clearance. Every decision after that pulled the same thread — the Fates on the moodboards, the role-based palette, the archival voice, the condition reports, and finally the rules written into the repo. And because the thread has to hold every wardrobe — designer, luxury, vintage — the system stayed deliberately quiet enough for all of them to enter.",
        "The honest part: I’m not a trained graphic designer, and Nyma was my first time owning visual identity at this scale. Stakeholder feedback was positive and the visual quality moved far, but a sharper eye would have made some calls sharper still — next time I bring critique in earlier.",
        "And I would codify from month one. The system I built at the end to hand off mobile is the system that would have made every earlier month faster. Same lesson as Vicino, from the other side: the earlier the framework exists, the more AI compounds. The later it exists, the more you are cleaning up retroactively.",
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
        number: "01 · The inheritance",
        title: "Architecture in place. Meaning missing.",
        sections: [
          {
            tags: "2C SOCIAL RESALE · AS FOUND",
            heading: "A working platform that didn’t know what it was",
            body: [
              "I joined after the hard plumbing was done: marketplace and auction architecture in place, a website already live. And Nyma was never meant to be a listing board — people comment, save, and follow around the items, so it has to feel like a community formed around fashion pieces. But the visual foundation was weak, the UI logic needed cleanup, and the brand rationale was underdeveloped. The founders liked the name; the name didn’t yet mean anything. My scope became the whole design layer: brand direction, visual system, UI logic — and, later, turning all of it into rules a two-engineer team can build from without me.",
            ],
          },
        ],
      },
      {
        number: "02 · The thread",
        title: "νήμα — the name already knew what the brand should be.",
        sections: [
          {
            tags: "NAMING · RESEARCH",
            heading: "Finding the thread inside Nyma",
            body: [
              "Researching the word, I found Nyma could connect to νήμα — Greek for thread. That one link gave the name narrative and visual potential it never had: garments carrying stories across owners, continuity instead of pure transaction, resale as something curated and cultural rather than clearance. I built the moodboards around that idea — the Fates spinning and cutting thread, Greek textile patterns, archival fashion photography — and the direction stopped being a taste question.",
            ],
          },
          {
            tags: "MOODBOARDS · AI EXPLORATION",
            heading: "Directions as conversation material",
            body: [
              "In parallel I used AI to widen the search. I fed it my competitive research, the secondhand platforms I had studied, visual references, and the brand-language drafts I was writing, and had it generate brand directions, homepage narratives, positioning, and copy versions. That let us compare quickly whether Nyma should lean editorial like a fashion magazine, archival like a curated archive, transactional like a typical marketplace, or fashion-forward with louder style. The outputs were never final answers — they were conversation material that helped a name that merely sounded good become a grounded direction around thread, continuity, and curation.",
            ],
          },
        ],
      },
      {
        number: "03 · The rulebook",
        title: "Structural, not expressive — a brand designed to be maintained.",
        sections: [
          {
            tags: "BRAND MANUAL · OPERATIONAL RULES",
            heading: "Rules that protect the objects",
            body: [
              "The manual I wrote defines Nyma’s identity as structural rather than expressive: restrained, consistent, and secondary to the objects it carries. It reads as operational rules — what must remain constant, where variation is permitted, where expression is intentionally limited. When uncertainty arises, priority goes to clarity, reduction, and structural consistency. The line I kept coming back to: this brand is not meant to be reinterpreted — it is meant to be maintained.",
            ],
          },
          {
            tags: "COLOR ROLES · TYPOGRAPHY",
            heading: "Color that signals, type that archives",
            body: [
              "Color at Nyma is role-based, never decorative. Ceramic Black contains; the archival whites surface; Ceramic Yellow appears only as a material trace; Activation Blue is reserved exclusively for interactive states. Any use of color outside its defined role is misuse — the palette signals structure, state, and continuity instead of expressing identity. Murecho carries the words in thin and regular weights — bold is nearly absent from the system — an archival voice that is quiet, precise, deliberately non-performative, with mono reserved for system data, the way an archive labels its objects.",
              "The restraint is also hospitality. Nyma serves wardrobes that have nothing to do with each other — a couture archive, a designer drop, a worn pair of Levi’s — and the system has to receive all of them without re-styling itself. That is the real reason the rules are this quiet: inclusivity was the design decision underneath the design decisions.",
            ],
          },
        ],
      },
      {
        number: "04 · The pages",
        title: "Thirty-odd pages by hand; AI where hands weren’t needed.",
        sections: [
          {
            tags: "FIGMA · BY HAND",
            heading: "The pages AI couldn’t deliver",
            body: [
              "Once the direction settled, the work shifted into production — and AI’s role had to shrink. For the major feature pages it could suggest structure, but not the designer-level layout, hierarchy, and editorial pacing the brand needed. So I designed and iterated the thirty-to-forty key pages by hand in Figma: marketplace and auction surfaces, listing and seller flows, onboarding, profile, messaging — the spine of the product.",
            ],
          },
          {
            tags: "AI ASSETS · STYLE VS INCLUSIVITY",
            heading: "Minimal enough for the items, editorial enough for a voice",
            body: [
              "Imagery was a different problem: a fashion resale platform needs a lot of it to feel alive, and there was no content library yet. Beyond public-domain and licensed references, I used AI-generated assets for mood imagery and atmosphere that matched the site’s tone while keeping copyright risk low. The judgment underneath everything was the trade between style and inclusivity — premium enough for designer-fashion users, welcoming enough for vintage and broader resale buyers. Most calls in the system were made to hold styles that share nothing: the same card, grid, and type have to serve an Hermès collector and a vintage seller without re-styling. That is why the language landed on minimal but editorial: minimal so the items carry the page, editorial so the brand keeps a voice.",
            ],
          },
        ],
      },
      {
        number: "05 · The codification",
        title: "The design system left Figma and moved into the repo.",
        sections: [
          {
            tags: "FRONT-END REPO · DESIGN RULES",
            heading: "Decisions written once, reused everywhere",
            body: [
              "Nyma is a small company; a heavy, formal design system was never the point. But the product kept growing, and I didn’t want to re-make the same design decisions every time a new surface appeared. So I started codifying the existing system directly into the front-end repo: layout rules, typography, spacing, component behavior, reusable patterns — design decisions as code the product can’t drift away from.",
            ],
          },
          {
            tags: "FIGMA · CLAUDE DESIGN · CLAUDE CODE",
            heading: "Figma stopped being the only source of truth",
            body: [
              "That changed how I work. Instead of designing in Figma and handing off, I moved across Figma, Claude Design, and Claude Code as one loop: explore a direction with AI, generate the code, fix details back in Figma, re-export and let AI refine — or edit in Claude Design, or adjust the repo directly. Figma stayed for visual refinement, but the codified front-end system became where design rules are preserved, reused, and extended. The lesson I keep re-learning: AI only scales you when the framework is clear. Unclear brand, inconsistent system, vague prompt — AI just generates more noise. Framework first; then it compounds.",
            ],
          },
        ],
      },
      {
        number: "06 · The handoff",
        title: "A system that keeps working after I leave.",
        sections: [
          {
            tags: "MOBILE · ROADMAP · CONTINUITY",
            heading: "Prototypes and a roadmap the team can build against",
            body: [
              "The reason the system matters now: the team is starting their mobile build, and my contract is wrapping up. So I used the same AI workflow to prepare their continuity — AI-generated early prototype directions for mobile as starting points, and a product roadmap built from competitor study plus a structured conversation with AI, output as HTML, brought into Figma, and merged with the design system into a working prototype the team can build against. The codified system isn’t for me; it’s the layer that preserves visual and interaction consistency after I’m gone. That is the real test of whether a design system is doing its job.",
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
    template: "case",
    cover: `/media/work/vicino/cover.png`,
    previewVideo: `/media/work/vicino/preview.mp4`,
    coverClass: "cover-vicino",
    tags: ["Product Design", "PM", "AI"],
    oneliner:
      "Turning Vicino's interactive creation canvas into a clearer workflow system people could read, redirect, and keep building on.",
    cardBlurb:
      "The earlier Vicino homepage made the product feel alive: draggable creation nodes, connected outputs, and a dark workflow canvas where concept, image, video, and 3D could sit in one spatial chain. My work started from that promise and pushed it toward a clearer product system.",
    blurb:
      "Vicino is a node-based generative video platform — a canvas where people build generation, composition, and editing as connected nodes rather than a linear timeline. The generation power was already there; the design challenge was what came after it. As the company moved toward B2B content production, the product had to grow from a capability-first tool into a guided, controllable video workflow — one that could carry both a creative-production veteran and a marketer who had never touched an AI video tool.\n\nMy role grew from screen-level design into product architecture. I worked with PMs, designers, engineers, the founding engineer, and ML engineers to clarify workflow stages, node responsibilities, editor logic, the Sidebar and Floating Bar layers, sliding panels, and the design system behind them. The core lesson was simple: new technical range only matters when people still have clear places to inspect, redirect, and decide.",
    role: "Product Designer / PM",
    duration: "2025 – present",
    type: "Intern",
    teams: "PMs, Design Team, Dev Team, Mkt Team",
    summary: [
      "When I joined Vicino AI, the product already had a strong interactive promise: creation should feel like a canvas of connected stages and outputs, not a stack of isolated tools. The hard part was carrying that feeling into the real product as 3D, image, video, editing, reference, and workflow features expanded.",
      "I helped frame the product around responsibility, not feature count. Nodes should represent meaningful stages and outputs. The Sidebar should hold global settings and model selection; the Floating Bar should carry the next step forward. Sliding panels should carry node-specific input, references, and version context. Editors should handle deep revision work. That separation gave the team a clearer language for deciding where new functionality belonged.",
    ],
    moment: {
      title:
        "When I realized the product did not need one more feature — it needed a clearer interaction model",
      body: [
        "What stayed with me most from this project was the moment I realized the product did not need one more feature. It needed a clearer structure.",
        "During one review, we walked through a long creation chain: camera, 3D, image, prompt, and then video. On paper, each part was already becoming more capable. But when I tried to trace the flow from input to output, I realized the problem was no longer feature depth. The problem was that the system itself was becoming harder to explain. Even within the team, people were beginning to describe the same workflow in different ways. That was the moment I stopped treating the project as a series of screen problems and started treating it as a workflow problem.",
        "From then on the work was mostly about where complexity should live — and both halves of this project grew out of that one question. The flow gave people a path they could follow and correct; the zoning gave every kind of function a place to belong. What I keep from it is not any single screen but a way to grow a product: when the models cannot do everything in one shot, structure is what lets people — and the team — keep moving, and lets new features enter without reopening the same debate.",
        "(note: the Video 2 Node prototype was made by a teammate)",
      ],
      videos: [
        { src: `/media/work/vicino/preview.mp4` },
        { src: `/media/work/vicino/moment-2.mp4` },
        { src: `/media/work/vicino/moment-3.mp4`, wide: true },
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
    template: "case",
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
          "“I refused to just patch Bugs without seeing the bigger problem.”",
        sections: [
          {
            tags: "KICKOFF · PRD REVIEW · STAKEHOLDERS INTERVIEWS",
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
            tags: "ONBOARDING FLOWS · STAKEHOLDER FEEDBACK· DESIGN TRADE-OFFS",
            heading: "The First Lesson in Startup Compromise",
            body: [
              "I drafted three onboarding flows: pop-ups, a walkthrough, and an animated demo. The CEO immediately pushed for animation. Honestly, I felt a spark too—it looked more “designed.”",
              "But engineering shut it down flat, and my excitement dropped instantly. If users had no onboarding at all, even the flashiest animation meant nothing.",
              "Then my mentor cut in with the line that reframed the whole standoff: we’d been debating how, when the real problem was whether.",
              "And that was my first real startup lesson: elegant ideas rarely survive—the designs that ship are the ones that matter.",
            ],
            image: `/media/work/froghire/ch2-1.png`,
          },
          {
            tags: "SUBSCRIPTION REDESIGN· RESUME MANAGEMENT · FILTERING EXPERIENCE",
            heading: "Fighting for Clarity, Accepting Half-Wins",
            body: [
              "Subscription clarity, resume control, filters—every redesign that summer went to the same bargaining table, and each round closed differently.",
              "Each round felt like bargaining. Sometimes I won clarity, sometimes only half. But I learned to prioritize: if the perfect solution won’t ship, even a partial step forward is still progress.",
            ],
            image: `/media/work/froghire/ch2-2.png`,
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
    template: "case",
    cover: `/media/work/roper/cover.png`,
    previewVideo: `/media/work/roper/preview.mp4`,
    coverClass: "cover-roper",
    tags: ["UX Design", "Data Viz"],
    oneliner:
      "Redesigning public opinion data discovery for researchers and the general public.",
    blurb:
      "I led the redesign of Roper Center’s educational simulation platform, reframing it from a confusing quiz-like tool into a structured learning experience. I uncovered systemic issues: unclear navigation, misleading progress bars, and a lack of educational alignment through heuristic evaluation, competitive analysis, and user testing, By translating pain points into design goals—clarity, feedback, motivation, and learning outcomes—I rebuilt the simulation so progress finally meant comprehension.",
    role: "UX Designer, Project Manager",
    duration: "09/2024 – 12/2024",
    type: "Client-Based Project",
    teams: "UX Designers, UX Researchers, Project Manager, Software Engineers",
    summary: [
      "I led the redesign of Roper Center’s educational simulation platform, reframing it from a confusing quiz-like tool into a structured learning experience. I uncovered systemic issues: unclear navigation, misleading progress bars, and a lack of educational alignment through heuristic evaluation, competitive analysis, and user testing, By translating pain points into design goals—clarity, feedback, motivation, and learning outcomes—I rebuilt the simulation so progress finally meant comprehension.",
    ],
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
            image: `/media/work/roper/ch1-1.png`,
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
            image: `/media/work/roper/ch1-3.png`,
          },
          {
            tags: "Insight Synthesis · Design Principles · Evidence-Based Framing",
            heading: "The Moment Complaints Became a Design Compass",
            body: [
              "From evaluation and testing, I distilled four design principles: clarity (navigation and progress must be unambiguous), feedback (immediate confirmation of understanding), motivation (gameplay should reinforce effort, not distract), and outcomes (design must point back to learning goals). This translation—from scattered complaints to structured principles—was the foundation for everything that followed.",
            ],
            image: `/media/work/roper/ch1-4.png`,
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
    template: "case",
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
    template: "poster",
    cover: `/media/work/hunger/cover.png`,
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
    poster: {
      lede: "Hunger 1942 is a 2D survival RPG set during the 1942 Henan Famine, blending real histories with gameplay to explore human struggle in disaster.",
      image: `/media/work/hunger/cover.png`,
      intro: [
        "Hunger 1942 is a game project that I initiated and developed with my team. It is a 2D pixel-style historical role-playing survival game inspired by The Oregon Trail, set against the backdrop of the 1942 Henan Famine. The project encompasses the game itself, artistic direction, and historical research.",
        "Launched in September 2022, the historical research and foundational game framework were completed by January 2023, with the initial demo finalized in August 2023. The game was inspired by reflections on food shortages during COVID-19 and insights from my modern Chinese history class, prompting me to explore the struggles of ordinary people during times of catastrophe.",
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
        `/media/work/hunger/gallery-1.png`,
        `/media/work/hunger/gallery-2.png`,
        `/media/work/hunger/gallery-3.png`,
        `/media/work/hunger/gallery-4.png`,
      ],
    },
    order: 6,
  },
  {
    slug: "vr-education",
    title: "VR Monarch Butterfly",
    template: "poster",
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
    poster: {
      lede: "A winter-term VR documentary of the monarch migration, built in Unity and explored through a headset.",
      image: `/media/work/vr/cover.png`,
      intro: [
        "VR Monarch Butterfly is an interactive VR documentary built during Winter Term, January 2023 — my first exploration into interaction design. With two fellow students I constructed the environment in Unity, recreating the monarchs’ annual migration: habitats, routes, and behaviors staged to be felt, not just watched.",
        "A documentary-style narration carries the educational context, and interactive triggers placed through the scene let users explore, listen, and observe the butterflies up close — the documentary read from inside it.",
      ],
      details: {
        project: "VR Monarch Butterfly",
        client: "Undergraduate",
        year: "12/2022 – 1/2023",
        services: "Digital Art, Immersive Experience, Digital Education",
      },
      body: [
        "Synopsis: Completed with classmates during Oberlin College’s Winter Term, January 2023 — Unity for the VR platform, Blender for the butterfly models; my primary role was scene creation. Explored through a headset, the piece tests how much documentary and educational weight a realistic VR environment can carry.",
        "Looking forward, we plan to further enhance the project by integrating additional visual art elements, such as transitioning butterflies into particle effects synchronized with music, evolving the experience from a purely realistic representation into a visually compelling artistic work.",
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

// Record<…, Project | undefined>: lookups come from the URL slug, so a miss is
// a real case every consumer must handle (both current callers already guard).
export const projectsBySlug: Record<string, Project | undefined> =
  Object.fromEntries(projects.map((p) => [p.slug, p]));

export function adjacent(slug: string) {
  const sorted = [...projects].sort((a, b) => a.order - b.order);
  const i = sorted.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? sorted[i - 1] : null,
    next: i < sorted.length - 1 ? sorted[i + 1] : null,
  };
}
