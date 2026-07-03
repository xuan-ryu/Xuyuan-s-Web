// Project data transcribed verbatim from the Framer export
// (local Framer export...\work\*\index.html). Two templates exist on the
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
      "Designing and building an AI marketing platform end to end — the system first, then the surfaces on top of it, with a human in every loop.",
    blurb:
      "Pulse is an AI marketing platform that takes a brand team from a strategic signal to a published social post without giving up human judgment. Over five intensive weeks I designed and built it end to end: a token-driven design system of ~37 components, the core surfaces — Home with its docked assistant, the marketing Calendar, Signal, Analytics, Studio — the quality of what the AI hands back to users, and the campaign production flow, taken over mid-flight from another designer and rebuilt on the system.\n\nThe throughline is one belief: AI should draft, humans should decide. Every generative step is wrapped in an editable brief, a review, or an approval gate, so speed never comes at the cost of brand safety.",
    role: "Product Designer · Design System · Front-end",
    duration: "2025 - present",
    type: "Intern",
    teams: "PMs, Design Team, Dev Team",
    // Overview = what Pulse is + the owner's scope, once. The belief lives in
    // the moment band; the acts carry the detail — no smearing.
    summary: [
      "Pulse is an AI marketing platform that takes a brand team from a strategic signal to a published social post without giving up human judgment. Over five intensive weeks I designed and built it end to end: the token-driven design system, the core surfaces from Home to the production Studio, the quality of what the AI hands back to users, and the campaign production flow — taken over mid-flight from another designer and rebuilt on the system.",
    ],
    moment: {
      title:
        "When I realized the design decision wasn't “how much can AI do” — it was “where must a human stay”",
      body: [
        "It is tempting to let AI run a marketing post end to end: type a goal, get a scheduled post. Building Pulse, the more valuable question turned out to be the opposite one — where does a person have to stay in the loop, and how do I make that moment feel like control instead of friction?",
        "The answer shaped the whole flow. Create with AI asks for almost nothing up front — a goal and a few assets, uploaded or picked from the brand vault. The assistant then drafts the full Creative Brief (audience, key message, content direction, tone, visual style) and shows it as editable fields inside the chat. The human edits, talks to refine, sees the budget envelope, and approves. Only then does generation run — and even then a standing guardrail holds: AI can draft and schedule, but a person always releases to publish.",
        "Speed where it helps; a deliberate checkpoint everywhere it matters. That balance, not the automation itself, was the real design.",
      ],
      // TODO: add a screen recording of New Post -> Create with AI -> editable brief -> approve.
    },
    // Standard case-study arc: context → Act I (system) → Act II (product) →
    // Act III (rescue). Engineering facts (dates, line counts, quotes) are
    // transcribed from the Pulse repo's git log and docs — nothing invented.
    // The pulse layout attaches its specimen figures to these positionally.
    chapters: [
      {
        number: "01 · Context",
        title:
          "Prototypes were piling up; pages were parked waiting for a system.",
        sections: [
          {
            tags: "TEAM CODE · PARKED PAGES · AUDIT",
            heading:
              "Single-file prototypes, parked pages, drifting copies",
            body: [
              "The team's work arrived the way single files do: whole prototypes uploaded to the repo root, one 13,020 lines long, and pages queuing behind the missing foundation. One teammate's design sat finished for weeks, waiting only for a system to exist before it could ship.",
              "The mess was measurable. An audit put numbers on it: a 557 KB stylesheet carrying three hand-reconciled copies of the token set, and 94 page partials that imported nothing from the system. That was the situation the system had to answer.",
            ],
          },
        ],
      },
      {
        number: "02 · Act I",
        title: "I built the system before the screens.",
        sections: [
          {
            tags: "TOKENS · COMPONENTS · ONE SOURCE",
            heading:
              "One source of truth, not a folder of one-offs",
            body: [
              "The system was there from day one: my first product commit landed an 8,626-line single-file prototype with a 1,863-line design-system.html already sitting beside it — the design system explored as code before there was any process to require it.",
              "Pulse runs on a single canonical token set — color as six semantic ramps, a fixed type scale, an 8-based spacing rhythm, and radius and shadow scales — and a library of around 37 components. On June 17 I made the pivot that stuck: drop React as the source of truth. Each component became a standalone folder — one HTML file, one CSS file — over a shared tokens.css of 340 custom properties, with a live browser to flip through the set.",
              "The rule I held was simple: every screen composes from component contracts and shared tokens before any page-local UI is invented. Color is assigned by role, so a status green and a data-trend green never collide; a dependency-free check reconciles the component inventory, the preview, and the Figma board and flags any off-scale token, type, or radius before it ships.",
            ],
          },
          {
            tags: "STANDARDS · CI · ADOPTION",
            heading: "The standard became commits, not advice",
            body: [
              "In one June wave I Prettier-normalized the codebase — the 13,020-line upload included — repaired the ESLint config, forced LF line endings, converted oversized PNGs to WebP at 94% smaller, and moved the loose prototypes out of the tracked root. I wrote the contracts down as documents — an app UI standard, then the single-source migration plan. A teammate stood up the CI that runs the consistency checks; I greened the token gate and kept extending it.",
              "Then the two worlds converged. The single-file prototypes were split into partials and page modules through late June, the hardest clusters extracted last, and the best pieces graduated into the library itself. Four days of slice-by-slice adoption after the audit, eight system components owned the app's UI and 1,905 verified-dead lines were gone.",
            ],
          },
          {
            tags: "LIBRARY · PACKAGE · NO DRIFT",
            heading: "One canonical library, wrapped for every consumer",
            body: [
              "That canonical layer is what made a package safe. A teammate wrapped the library as an internal, typed React component package on the team's private registry, where the JSX wrappers are the only authored layer. A build step copies the canonical CSS straight into the package, so the components style themselves from that one source and cannot drift out of sync.",
            ],
          },
          {
            tags: "FIGMA · HANDOFF · DESIGNERS",
            heading: "A handoff designers can double-click",
            body: [
              "The designer surface got the same discipline. On June 12 I rebuilt the visual component library as a self-contained HTML page, then expanded it into variant-by-state boards for Figma import — one 7,874-line file that prints every component, every state, with its interaction contract alongside. A companion foundations handbook typesets the brand rules — neutral first, color with meaning — for people who will never open the repo.",
              "And the handoff is not a snapshot — when the system moves, a sync pass carries the decision back out to the designer surfaces; the latest landed July 1.",
            ],
          },
          {
            tags: "TIMELINE · EVIDENCE",
            heading: "The paper trail, start to finish",
            body: [
              "The record is the work itself: five weeks of daily commits carrying the system from that first prototype to a shipped product, alongside a team shipping prototypes of its own. The milestones below carry the arc — a couple of them a teammate's work.",
              "By the end, the system had stopped being cleanup work. It was the infrastructure that let the product grow without re-litigating the same patterns.",
            ],
          },
        ],
      },
      {
        number: "03 · Act II",
        title: "The product: seven surfaces that read as one studio.",
        sections: [
          {
            tags: "SURFACES · HIERARCHY · ASSISTANT",
            heading:
              "A calm studio, not a dashboard of competing widgets",
            body: [
              "On top of the system sits the application — a sidebar-driven workspace spanning Home (a dashboard with a context-aware AI assistant), a marketing Calendar, a Signal feed of live brand trends, Analytics, Strategy, Campaigns, and the production Studio.",
              "The design language is deliberately quiet: hierarchy comes from tone, spacing, and reading rhythm before borders, and the AI assistant docks beside the work instead of pulling the user away from it. The goal was a tool that feels like a focused studio rather than a wall of equal-weight cards.",
            ],
          },
          {
            tags: "STATIC EXPORT · FILE:// · DEMOS",
            heading: "Demos the team could open from disk",
            body: [
              "Standards alone don't align a team — runnable demos do. The first week of June was a React sprint: a Calendar workspace, the homepage post queue, a 1:1 port of the campaigns workspace — real surfaces for the team to react to within days. By late June the demos were unified into a single vanilla-HTML product: Home, Calendar, Campaign, Analytics, Signal, Strategy, and Onboarding as routable pages on the system's tokens.",
              "The engineering constraint is the point: the app builds to plain HTML that renders from a double-click. It's a standing rule — keep file:// support, because designers may open the export directly. Every product screenshot on this page was captured from a file:// address: no server, no toolchain, no account.",
            ],
          },
          {
            tags: "OUTPUT QUALITY · ONBOARDING · BRAND VAULT",
            heading: "The output is a design surface too",
            body: [
              "Onboarding doesn't end at a configured account — it turns a new brand into working material, generating on-brand visual assets and a starter design system the team can use from day one.",
              "The brand vault feeds every generative step after that, so what the AI drafts already speaks the brand's language instead of arriving generic.",
            ],
          },
        ],
      },
      {
        number: "04 · Act III",
        title: "The campaign flow: inherited as a rescue, rebuilt on the system.",
        sections: [
          {
            tags: "AI FLOW · CREATIVE BRIEF",
            heading:
              "A light brief, drafted by the AI, owned by the human",
            body: [
              "The campaign production flow reached me as firefighting — another designer's work, taken over mid-flight. A post belongs to a campaign, so it starts inside that campaign's Posts page — New Post, then Create with AI — and the rest is a conversation, not a form. Instead of a long upfront questionnaire, the user gives a goal, an optional note, and a few assets. The detailed brief is the AI's job.",
              "Pulse analyses the goal, the selected assets, the brand vault, and the campaign, then drafts a structured Creative Brief as editable fields inside the chat. The user edits any field, talks to refine, and sees the budget before committing. Approving the brief hands off to generation, and the post lands in Content Review.",
            ],
          },
          {
            tags: "APPROVALS · TRUST · GUARDRAILS",
            heading:
              "Two gates and a publish guardrail keep a person in charge",
            // The publish-guardrail rule ("AI can draft and schedule…") is set
            // once by the pulse layout as the guardrail artifact below this
            // section — not repeated here.
            body: [
              "Approval runs through an ordered chain — reviewer, then brand admin, then org owner — with SLA timers and an escalation that never auto-approves. A campaign-level plan gate signs off direction and spend before any credits are burned; a per-post content gate signs off the finished creative before it goes live.",
            ],
          },
          {
            tags: "CRAFT · INTERACTION DETAIL",
            heading:
              "The texture lives in the small moments",
            body: [
              "Any reference or uploaded asset opens in a lightweight markup popup — a brush with adjustable size and a few colors for inpaint-style notes, plus a free-text description of how Pulse should use it. The same affordance works on Create-with-AI assets and on the brief's reference images.",
              "The assistant chat follows the product's own component contract, tuned against the React reference so the prototype and the app speak the same language: the assistant replies as plain reading text, the user's turns sit in an ink bubble, rich content like the Creative Brief surfaces as a card, inline controls stay flat, and every action carries a considered hover state.",
            ],
          },
        ],
      },
    ],
    order: 0,
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
      "Vicino AI was expanding across 3D, image, video, editing tools, references, and higher-level workflow features. What the product needed was not another feature tour. It needed a shared interaction model that could make those pieces feel like one production environment instead of a growing collection of experiments.\n\nMy role grew from screen-level design into product architecture. I worked with PMs, designers, engineers, the founding engineer, and ML engineers to clarify workflow stages, node responsibilities, editor logic, the Sidebar and Floating Bar layers, sliding panels, and the design system behind them. The core lesson was simple: new technical range only matters when people still have clear places to inspect, redirect, and decide.",
    role: "Product Designer / PM",
    duration: "2025 - present",
    type: "Intern",
    teams: "PMs, Design Team, Dev Team, Mkt Team",
    summary: [
      "When I joined Vicino AI, the product already had a strong interactive promise: creation should feel like a canvas of connected stages and outputs, not a stack of isolated tools. The hard part was carrying that feeling into the real product as 3D, image, video, editing, reference, and workflow features expanded.",
      "I helped frame the product around responsibility, not feature count. Nodes should represent meaningful stages and outputs. The Sidebar should hold global settings and model selection; the Floating Bar should carry the next step forward. Sliding panels should carry node-specific input, references, and version context. Editors should handle deep revision work. That separation gave the team a clearer language for deciding where new functionality belonged.",
    ],
    moment: {
      title:
        "When I realized the product did not need one more feature - it needed a clearer interaction model",
      body: [
        "What stayed with me most from this project was the moment I realized the product did not need one more feature. It needed a clearer structure.",
        "During one review, we walked through a long creation chain: camera, 3D, image, prompt, and then video. On paper, each part was already becoming more capable. But when I tried to trace the flow from input to output, I realized the problem was no longer feature depth. The problem was that the system itself was becoming harder to explain. Even within the team, people were beginning to describe the same workflow in different ways. That was the moment I stopped treating the project as a series of screen problems and started treating it as a workflow problem.",
        "From then on, I became much more focused on where complexity should live. What belongs in a node? What belongs in an editor? What should stay global, and what should stay local? If the models could not reliably do everything in one shot, then the product should not pretend otherwise. That shift shaped the prototype direction I helped push forward: nodes represented meaningful stages and outputs; the Sidebar handled global settings and model selection; the Floating Bar carried the next-step actions; sliding panels supported more local adjustments, input management, and version history; and editors took on the deeper work that did not belong on the main canvas. More importantly, that structure gave the team a stronger foundation for iteration and a shared way to think about how new features should enter the product as it kept growing.",
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
              "When I joined the project, the core problem was not visual polish. It was structural ambiguity. 3D, image, video, and editing tools were all advancing at the same time, but there was no shared interaction model connecting them into one readable system. Prompts, reference assets, camera inputs, and generated outputs all existed, but the logic that tied them together was still unstable. In practice, that meant even simple questions—where an asset should enter the flow, when an editor should appear, or which node should own a certain step—kept getting answered differently depending on who was in the room.",
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
            image: `/media/work/vicino/ch1-2.png`,
          },
          {
            tags: "WORKFLOW STRUCTURE · MODEL CONSTRAINTS",
            heading:
              "I rebuilt the main path around what the models could actually support",
            body: [
              "Once I became more focused on feasibility, the main path started to clarify. Script, Storyboard, Image, and Video did not need to collapse into one “smart” object. They needed to do different jobs clearly. Script helped organize intent. Storyboard shaped pacing and visual sequence. Image worked better as a lighter preview and revision layer before users committed to video. Video then became the step that should happen with more intention, not less.",
              "One example made that logic very concrete for me. A video-first flow looked simpler on paper, but in practice it pushed users into the slowest and most expensive step before they could even confirm whether the content was right. By keeping image as a preview layer, users could correct composition, content, and direction before moving into motion. That made the workflow longer by one step, but much easier to control. It stopped being an idealized flow and became a usable one.",
            ],
            image: `/media/work/vicino/ch1-3.png`,
          },
          {
            tags: "AI LIMITS · PRODUCT LOGIC",
            heading:
              "I was not packaging a finished capability — I was helping define what that capability should become as a product",
            body: [
              "The more I worked on the system, the more I realized that design was not happening after the technology was “done.” Some paths were too expensive, too unstable, or too uneven to be presented as a default experience. Some outputs needed an intermediate step where users could inspect and redirect the result before moving on. That meant design could not simply wrap an existing capability in a nicer interface. It had to help define the form that capability should take as a product.",
              "One of the clearest examples was our decision not to compress too much into a single node. A more collapsed version often looked cleaner at first, but it also removed the checkpoints users needed to understand and correct what was happening. In several cases, splitting one broad step into two smaller ones created a better product, not because the system became simpler underneath, but because the user finally had somewhere to pause, inspect, and decide.",
            ],
            image: `/media/work/vicino/ch1-4.png`,
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
            image: `/media/work/vicino/ch2-1.png`,
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
            image: `/media/work/vicino/ch2-3.png`,
          },
          {
            tags: "DESIGN SYSTEMS · SCALABILITY",
            heading:
              "The Design System Stopped Being Cleanup Work And Became The Infrastructure That Let The Product Keep Growing",
            body: [
              "At the same time, I stopped treating the design system as something you do after the main design work is finished. As more workflows, editors, and support layers entered the product, consistency was no longer just a visual concern. It became a way to keep the product readable, keep the team aligned, and make future iteration easier. Without a clearer system, every new feature risked reopening the same structural debates.",
              "That became even more important as the product started preparing for future expansion, including faster workflow creation and more assistive features that might be introduced later. In practice, this meant standardizing more than just colors or spacing. It meant giving the team a stable language for layers, components, and behaviors, so new workflows could enter the system without forcing everyone to renegotiate the same patterns from scratch.",
            ],
            image: `/media/work/vicino/ch2-4.png`,
          },
        ],
      },
    ],
    order: 1,
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
    duration: "05/22/2025 - 08/22/2025",
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
              "At kickoff, the PM and mentor walked us through the product. It had many features, but they felt stitched together. The CEO pulled me aside and asked me to review every page, especially the negative reviews on the Chrome Web Store. Users were calling it “hard to use” and “confusing.”",
              "Reading those comments, I realized this wasn’t school anymore—it was survival. No one was waiting for a polished framework; the CEO wanted metrics back up fast. That was when I felt it: design here wasn’t about ideal portfolios, but about relieving user pain immediately with limited resources.",
            ],
            image: `/media/work/froghire/ch1-1.png`,
          },
          {
            tags: "USABILITY TESTING · BUG LOGGING · USER FEEDBACK ANALYSIS",
            heading: "Testing Showed Me Users Weren’t Lost—They’d Been Left Behind",
            body: [
              "Every week I ran through the whole dashboard—subscriptions, resumes, job recommendations—logging every bug with screenshots. The problems piled up: hidden subscription flows, unclear resume states, job lists suggesting software engineering roles to marketing students.",
              "Then I saw a review: “I honestly have no idea how to use this.” It stung, because I’d felt the same on my first try. The problem wasn’t user intelligence—it was the product’s silence. No onboarding, no guidance, no hand to hold. Users weren’t lost; they’d been abandoned.",
            ],
            image: `/media/work/froghire/ch1-2.png`,
          },
          {
            tags: "COMPETITIVE ANALYSIS · COST EVALUATION · PRODUCT BENCHMARKING",
            heading: "I Learned That Chasing Trends Wasn’t an Option",
            body: [
              "My mentor showed me Simplify, Teal, and other competitors. They had sleek AI autofill features, and at first I thought we should too. But once we calculated costs, it was clear a startup couldn’t afford that. My mentor reminded me: “We’re past early funding. Every design decision must make financial sense.”",
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
              "I drafted three onboarding flows: pop-ups, a walkthrough, and an animated demo. The CEO immediately pushed for animation: “This will impress users the most.” Honestly, I felt a spark too—the animation looked more “designed.”",
              "But engineering shut it down: it would slow load times and push release back two weeks. My excitement dropped instantly. If users had no onboarding at all, even the flashiest animation meant nothing.",
              "Then my mentor cut in: “The real issue isn’t which format—it’s that there’s no onboarding at all.” That line hit me. We’d been debating how, when the real problem was whether.",
              "We ended up with lightweight tooltips. Far from perfect, but better than nothing. And that was my first real startup lesson: elegant ideas rarely survive—the designs that ship are the ones that matter.",
            ],
            image: `/media/work/froghire/ch2-1.png`,
          },
          {
            tags: "SUBSCRIPTION REDESIGN· RESUME MANAGEMENT · FILTERING EXPERIENCE",
            heading: "Fighting for Clarity, Accepting Half-Wins",
            body: [
              "I redesigned the subscription page to show price and timeframes. The CEO agreed, but engineering pushed back: “Too heavy for the backend.” We shipped just the price. I hated losing the clarity—knowing what you bought felt so basic.",
              "In resume management, I suggested active/inactive toggles to control recommendations. Engineering said no again, too complex. We cut it down to one highlighted resume. I knew it wasn’t flexible, but at least it gave users a little control.",
              "For filters, I insisted on adding location and salary—my mentor reminded me those mattered most to job seekers. That time, I held the line. Each round felt like bargaining. Sometimes I won clarity, sometimes only half. But I learned to prioritize: if the perfect solution won’t ship, even a partial step forward is still progress.",
            ],
            image: `/media/work/froghire/ch2-2.png`,
          },
          {
            tags: "DESIGN SPECS · QA WALKTHROUGH · DEVELOPER HANDOFF",
            heading: "Becoming My Own QA",
            body: [
              "After handoff, the frontend often ignored our Figma components and used their own templates. When I saw the first build, I froze: the structure was right, but the details were unrecognizable.",
              "So I became my own QA—running every flow, screen-recording, capturing bugs. Subscription data missing, resume states broken, misaligned tooltips—I logged nearly a hundred issues. Once, an engineer even admitted: “We thought that feature wasn’t live yet.” It was both funny and painful.",
              "Frustrating as it was, I learned something essential: in a strapped startup, the designer isn’t just a flow creator—they’re also the last line of defense for what makes it to production.",
            ],
            image: `/media/work/froghire/ch2-3.png`,
          },
          {
            tags: "SPRINT REVIEW · RETROSPECTIVES · DESIGN PRINCIPLES",
            heading: "From Frustration to Redefining My Role",
            body: [
              "In review, the PM said at least registration rates had recovered. The CEO called a demo “complete,” even though its value was limited. I felt torn—by their definition, we’d succeeded. But I knew this “completeness” was fragile.",
              "Then my mentor reminded us: “We’re still firefighting. Eventually we need standards.” That stuck with me. Yes, we were living in trade-offs. But I could still fight for clarity and consistency where it mattered.",
              "That’s when I reframed my role. Design wasn’t just about pixels—it was about helping the product survive and move forward, even if imperfect. In a startup, sometimes keeping the product alive is the most meaningful design you can deliver.",
            ],
            image: `/media/work/froghire/ch2-4.png`,
          },
        ],
      },
    ],
    order: 2,
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
      "I led the redesign of Roper Center’s educational simulation platform, reframing it from a confusing quiz-like tool into a structured learning experience. I uncovered systemic issues: unclear navigation, misleading progress bars, and a lack of educational alignment through heuristic evaluation, competitive analysis, and user testing, By translating pain points into design goals—clarity, feedback, motivation, and learning outcomes—I delivered a high-fidelity prototype, UI kit, and research report that gave the client their first evidence-based UX process.",
    role: "UX Designer, Project Manager",
    duration: "09/01/2024 - 12/17/2024",
    type: "Client-Based Project",
    teams: "UX Designers, UX Researchers, Project Manager, Software Engineers",
    summary: [
      "I led the redesign of Roper Center’s educational simulation platform, reframing it from a confusing quiz-like tool into a structured learning experience. I uncovered systemic issues: unclear navigation, misleading progress bars, and a lack of educational alignment through heuristic evaluation, competitive analysis, and user testing, By translating pain points into design goals—clarity, feedback, motivation, and learning outcomes—I delivered a high-fidelity prototype, UI kit, and research report that gave the client their first evidence-based UX process.",
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
            heading: "Delivering The First Evidence-Based UX Process For Roper",
            body: [
              "The final delivery included a high-fidelity prototype, UI kit, and research report. But the real impact was showing Roper Center their first evidence-based UX process. Every design choice traced back to a pain point, every feature mapped to a principle. The redesign didn’t just make the tool usable—it made it educational.",
            ],
            image: `/media/work/roper/ch2-4.png`,
          },
        ],
      },
    ],
    order: 3,
    featured: true,
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
    duration: "09/2022-04/2024",
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
        year: "09/2022-04/2024",
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
    order: 4,
  },
  {
    slug: "vr-education",
    title: "VR Monarch Butterfly",
    template: "poster",
    cover: `/media/work/vr/cover.png`,
    coverClass: "cover-vr-monarch",
    tags: ["VR Design", "Unity"],
    oneliner:
      "An immersive VR education experience tracing the monarch butterfly migration through embodied perspective-taking.",
    blurb:
      "VR Monarch Butterfly is an immersive VR experience showcasing the monarch butterfly migration.",
    role: "Designer, Developer",
    duration: "12/2023-1/2024",
    type: "Undergraduate",
    teams: "Digital Art, Immersive Experience, Digital Education",
    poster: {
      lede: "VR Monarch Butterfly is an immersive VR experience showcasing the monarch butterfly migration.",
      image: `/media/work/vr/cover.png`,
      intro: [
        "VR Monarch Butterfly is an immersive and interactive virtual reality documentary created during Winter Term in January 2023, marking my first exploration into interaction design. Working collaboratively with two fellow students, we employed Unity as our primary development tool to construct an engaging virtual environment designed to authentically recreate the spectacular journey of monarch butterflies during their annual migration. To enhance immersion, we carefully crafted detailed visual scenes depicting the butterflies' habitats, migration routes, and behaviors, aiming to evoke genuine emotional and sensory responses from users.",
        "Additionally, we integrated a documentary-style narration to provide educational context, making the experience informative as well as visually captivating. Interactive elements were intentionally designed and incorporated throughout the experience, allowing users to engage actively by exploring various scenes, triggering narrated explanations, and closely observing the butterflies' characteristics and migratory patterns. Ultimately, the project transcends traditional VR visualization by blending interactive technology, immersive storytelling, and educational documentary elements, providing an innovative approach to understanding and appreciating the monarch butterfly migration.",
      ],
      details: {
        project: "VR Monarch Butterfly",
        client: "Undergraduate",
        year: "12/2023-1/2024",
        services: "Digital Art, Immersive Experience, Digital Education",
      },
      body: [
        "Synopsis: This collaborative project was completed with classmates during Oberlin College’s Winter Term in January 2023, utilizing Unity for the VR platform and Blender for butterfly modeling, with my primary role being scene creation. Our goal was to build a realistic virtual environment depicting the spectacular migration of monarch butterflies, exploring the educational and documentary potential of immersive VR experiences. Users can interact with and explore the scene through VR headsets.",
        "Looking forward, we plan to further enhance the project by integrating additional visual art elements, such as transitioning butterflies into particle effects synchronized with music, evolving the experience from a purely realistic representation into a visually compelling artistic work.",
      ],
      gallery: [
        `/media/work/vr/gallery-1.png`,
        `/media/work/vr/gallery-2.png`,
        `/media/work/vr/gallery-3.png`,
        `/media/work/vr/gallery-4.png`,
      ],
    },
    order: 5,
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
