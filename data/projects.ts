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
      "A team prototyping one product in six different tools, a week to a pitchable flow — and the design production system I built so the rescue never has to happen twice.",
    blurb:
      "Pulse is an AI marketing platform that takes a brand team from a strategic signal to a published social post without giving up human judgment. I joined to design its homepage — and left owning the way the whole team ships: the unified pitch mockup merged from everyone's prototypes, a token-driven design system of ~37 components, the standards and automation that keep AI-generated UI on-system, and the campaign production flow with a person at every gate.\n\nTwo beliefs run through the work. Pages that look alike aren't a product until they share one system. And AI should draft while humans decide — every generative step is wrapped in an editable brief, a review, or an approval gate.",
    role: "Product Designer · Design System · Front-end",
    duration: "2025 - present",
    type: "Intern",
    teams: "PMs, Design Team, Dev Team",
    // Overview = what Pulse is + the owner's scope, once. The belief lives in
    // the moment band; the acts carry the detail — no smearing.
    summary: [
      "Pulse is an AI marketing platform that takes a brand team from a strategic signal to a published social post without giving up human judgment. When I picked it up, the team was prototyping that one product in six different tools — pages that looked alike and shared nothing underneath — with about a week to fold them into a flow we could pitch. Over five intensive weeks I went from owning the homepage to owning how the team ships: the merged mockup itself, then the token-driven design system, the component library, the automation that keeps AI-generated UI on-system, and the handoff surfaces that let design, engineering, ML, and product finally work from one base.",
    ],
    moment: {
      title:
        "When Pulse turned me from someone who ships pages into someone who builds the system that ships them",
      body: [
        "Pulse did not hand me a design-system brief. It handed me a melee — one product, six tools, a deadline — and the discovery that pages which look identical can share nothing at all. The real deliverable was never one more screen. It was the base underneath all of them.",
        "So the work became structure: tokens instead of taste, components instead of copies, written rules an AI can load instead of instructions repeated into a chat box, and a readable surface for every role that touches the work.",
        "And one rule survived every iteration untouched: AI can draft and schedule, but a person always releases to publish. Speed where it helps, a deliberate checkpoint everywhere it matters — that balance, not the automation, was the design.",
      ],
      // TODO: add a screen recording of New Post -> Create with AI -> editable brief -> approve.
    },
    // Arc (owner-sanctioned 2026-07 rework, from the first-person account):
    //   melee -> wake-up -> rescue -> system -> interface -> product.
    // Engineering facts (line counts, percentages, commit volume) are
    // transcribed from the Pulse repo's own record - nothing invented.
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
              "When I picked up Pulse, everyone was iterating on the same product in a different tool: one teammate deep in Figma, one in an AI page-builder, one pasting model-generated HTML, one compositing static images into screens. An early style pass kept fonts and colors roughly aligned, so every page looked like Pulse. Underneath, nothing matched — HTML here, React there, pictures pretending to be UI, generated code nobody could read.",
              "Then the deadline made it real: about a week to fold all of it into one complete flow we could record and pitch. That is where the lesson landed — visual consistency is not system consistency. Pages that look alike are not a product until they share structure, components, and a way to hand work between people.",
            ],
          },
        ],
      },
      {
        number: "02 · The wake-up",
        title: "Owning Home meant reading everyone’s code.",
        sections: [
          {
            tags: "HOMEPAGE · INFORMATION ARCHITECTURE",
            heading:
              "The front door forces the map",
            body: [
              "My page was Home — the product’s entry point. To design it I had to understand every tab: what each module did, what data it carried, what deserved surfacing, where every path led. Home was not a screen; it was the product’s information architecture, and it marched me through everyone’s files.",
              "Extraction kept failing. Components were not components — styles were welded to page files, interactions died in transit, and too much generated code was write-only. The wake-up was a single prototype file 13,020 lines long. Nothing that size stays maintainable — for a person, or affordably for a model.",
            ],
          },
          {
            tags: "OWN FILE FIRST · DELIVERY BAR",
            heading:
              "Engineer my own page, then ask engineering",
            body: [
              "I did not start by legislating for the team. I started with my own file: split it, structured it, extracted the reusable pieces, cleared the dead code. Then I asked the engineers a question no one had asked yet: if design ships code-based prototypes, what shape would you actually accept? Their stack was React — so I rebuilt my prototype in React, on their conventions and their component boundaries.",
              "It handed over cleanly. It also exposed the gap: one page had crossed into maintainable territory, and the rest of the product had not.",
            ],
          },
        ],
      },
      {
        number: "03 · The rescue",
        title: "One week, every prototype, one app.",
        sections: [
          {
            tags: "INTEGRATION · MIGRATION",
            heading:
              "Unify, engineer, migrate, merge",
            body: [
              "A week out, the call came: fold every prototype into one mockup and record the pitch video. The pages could not simply be concatenated, so I took them all. First unify the surface — type, color, spacing, cards, navigation, states. Then engineer file by file: split the monoliths, cut the dead code, rebuild the structure. Then migrate toward one stack, and merge into a single runnable app.",
              "AI did the heavy lifting and broke things in transit — hover states vanished, animations dropped, layouts drifted, code arrived looking alive but dead. Every migration was reviewed against the original and repaired by hand. With a teammate, it took a week of nights: hundreds of commits, roughly half of them structural work rather than pixels.",
            ],
          },
          {
            tags: "DATA · ML HANDOFF",
            heading:
              "Then the data didn’t fit",
            body: [
              "A pitch needs a real case, so I wired in the ML team’s data — and the shapes didn’t match what the front end expected. Mapping fields, states, and edge cases into components was the last mile, and it pushed me into the invisible half of front-end: how data enters a page, and what a component must promise in order to accept it.",
              "The mockup shipped on time; the pitch was recorded. The other thing that shipped was a conviction: this cannot be allowed to happen twice.",
            ],
          },
        ],
      },
      {
        number: "04 · The system",
        title: "So it never happens again: a base the whole team ships from.",
        sections: [
          {
            tags: "TOKENS · COMPONENTS · ONE SOURCE",
            heading:
              "One canonical base, checked by machines",
            body: [
              "The fix was a base everyone shares. One canonical token set — six semantic color ramps, a fixed type scale, an 8-based spacing rhythm — under a library of about 37 components, each a standalone folder: one HTML file, one CSS file, over shared tokens. Every screen composes from component contracts before any page-local UI is invented.",
              "The standard became commits, not advice. The codebase was Prettier-normalized — the 13,020-line upload included — the lint config repaired, oversized images converted to WebP at 94% smaller, 1,905 verified-dead lines removed. A dependency-free check reconciles the inventory, the preview, and the Figma board, and flags any off-scale token before it ships.",
            ],
          },
          {
            tags: "STACK CHOICE · TEAM FLOOR",
            heading:
              "Stepping down from React, on purpose",
            body: [
              "I had proven the React path — and still chose plain HTML + CSS as the team’s prototype stack. Not everyone on a startup team can run a dev server, and a mockup a teammate can’t open is a mockup that doesn’t exist. Plain files open from a double-click, travel as a folder, and record cleanly for a pitch.",
              "The floor mattered more than the ceiling. The discipline comes from the tokens and the checks, not from the framework.",
            ],
          },
          {
            tags: "SKILLS · AUTOMATION",
            heading:
              "Teaching the AI the system",
            body: [
              "A library only holds if every new prototype obeys it — and re-typing the rules into a chat box is where systems go to die. So the rules became skills: written procedures the AI loads before it generates or edits. Maintenance skills keep tokens, components, and previews in sync; a design skill makes new prototypes start on-system instead of being repaired into it.",
              "The payoff arrived with the next builds — Calendar and Campaign both started from that baseline, and the melee never came back.",
            ],
          },
        ],
      },
      {
        number: "05 · The interface",
        title: "Four roles, one base: previews, a package, a playground.",
        sections: [
          {
            tags: "TWO PREVIEWS · HANDOFF",
            heading:
              "A surface for each side of the table",
            body: [
              "The system grew a reading surface for everyone it served. A live component browser renders every component and state straight from its standalone source — the code side’s contract. For designers who live in Figma, a separate sliced, deliberately non-interactive board page exists purely to be imported — code UI carried back into design review, keeping human judgment in the loop.",
              "And the handoff is not a snapshot: when the system moves, a sync pass carries the decision back out to the designer surfaces.",
            ],
          },
          {
            tags: "PACKAGE · DATA STATES",
            heading:
              "From preview to infrastructure",
            body: [
              "A teammate then wrapped the library as a typed React package on the team’s private registry — the JSX wrappers are the only authored layer, and a build step copies the canonical CSS in, so the package cannot drift from its source. Its playground goes past looks: feed a component data and watch it hold — empty, overflowing, missing fields, loading, error.",
              "That is what the melee had been missing. Not talent — an interface. Design, engineering, ML, and product each got a surface they could read, and integration stopped being a rescue.",
            ],
          },
        ],
      },
      {
        number: "06 · The product",
        title: "What the base carried: a studio with a person inside.",
        sections: [
          {
            tags: "SURFACES · HIERARCHY · ASSISTANT",
            heading:
              "A calm studio, not a dashboard",
            body: [
              "On top of the system sits the application — a sidebar-driven workspace spanning Home with its docked assistant, a marketing Calendar, a Signal feed of live brand trends, Analytics, Strategy, Campaigns, and the production Studio. Hierarchy comes from tone, spacing, and reading rhythm before borders, and the assistant docks beside the work instead of pulling the user away from it.",
              "Everything renders from plain static files: every product screenshot on this page was captured from a file:// address. And onboarding turns a new brand into working material, generating starter assets and a brand vault that feeds every generative step after it, so drafts arrive on-brand instead of generic.",
            ],
          },
          {
            tags: "AI FLOW · CREATIVE BRIEF",
            heading:
              "A light brief, drafted by the AI, owned by the human",
            body: [
              "The campaign production flow reached me as another rescue — a designer’s work taken over mid-flight and rebuilt on the system. A post starts inside its campaign: New Post, then Create with AI, and the rest is a conversation, not a form. The user gives a goal, an optional note, and a few assets; the detailed brief is the AI’s job.",
              "Pulse reads the goal, the assets, the brand vault, and the campaign, then drafts a structured Creative Brief as editable fields inside the chat. The user edits any field, talks to refine, sees the budget — and only approval hands off to generation.",
            ],
          },
          {
            tags: "APPROVALS · GUARDRAILS",
            // The publish-guardrail rule is set once by the pulse layout as the
            // guardrail artifact below this section - not repeated here.
            heading:
              "Two gates and a guardrail keep a person in charge",
            body: [
              "Approval runs through an ordered chain — reviewer, then brand admin, then org owner — with SLA timers and an escalation that never auto-approves. A campaign-level plan gate signs off direction and spend before any credits are burned; a per-post content gate signs off the finished creative before it goes live.",
            ],
          },
          {
            tags: "CRAFT · INTERACTION DETAIL",
            heading:
              "The texture lives in the small moments",
            body: [
              "Any reference or uploaded asset opens in a lightweight markup popup — a brush with adjustable size and a few colors for inpaint-style notes, plus a free-text description of how Pulse should use it. The same affordance works on Create-with-AI assets and on the brief’s reference images.",
              "The assistant chat follows the product’s own component contract: the assistant replies as plain reading text, the user’s turns sit in an ink bubble, rich content like the Creative Brief surfaces as a card, inline controls stay flat, and every action carries a considered hover state.",
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
      "Vicino is a node-based generative video platform — a canvas where people build generation, composition, and editing as connected nodes rather than a linear timeline. The generation power was already there; the design challenge was what came after it. As the company moved toward B2B content production, the product had to grow from a capability-first tool into a guided, controllable video workflow — one that could carry both a creative-production veteran and a marketer who had never touched an AI video tool.\n\nMy role grew from screen-level design into product architecture. I worked with PMs, designers, engineers, the founding engineer, and ML engineers to clarify workflow stages, node responsibilities, editor logic, the Sidebar and Floating Bar layers, sliding panels, and the design system behind them. The core lesson was simple: new technical range only matters when people still have clear places to inspect, redirect, and decide.",
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
              "When I joined, the core problem wasn't visual polish — and it wasn't missing editing depth; we were never trying to out-edit Photoshop. It was that the models advanced fast but stayed unpredictable, and a near-blank canvas gave so much freedom that getting from an idea to a usable video was hard to learn and easy to get lost in. The tell was in the feedback: most of it wasn't about the interface, but about how to use the models correctly and make the output more precise — people weren't asking where a control lived, they were asking how to steer the generation and recover when a result came back wrong. B2B raised the stakes: the audience ran from creative-production veterans to marketers new to AI video, and the product had to guide both without slowing either down.",
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
