// Project data transcribed verbatim from the Framer export
// (local Framer export...\work\*\index.html). Two templates exist on the
// live site: "case" (vicino-ai, froghire-ai, roper-center) and "poster"
// (hunger1942, vr-education). Copy intentionally preserves the source text,
// including its quirks ("one more features", full-width colon).

const IMG = "/assets/framerusercontent.com/images";
const MEDIA = "/assets/framerusercontent.com/assets";

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
  coverClass?: string;
  tags: string[];
  oneliner: string;
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
    slug: "vicino-ai",
    title: "Vicino AI",
    template: "case",
    cover: `${IMG}/CSMKvZFRUZIIYznbJxUXsf58M.png`,
    coverClass: "cover-vicino",
    tags: ["Product Design", "PM", "AI"],
    oneliner:
      "Finding the structure underneath a creation chain that spans 3D, image, prompt, and video — so the seams stop being where users get lost.",
    blurb:
      "When I joined Vicino AI, the product was expanding quickly across 3D, image generation, video generation, editing tools, and higher-level workflow features. What it still lacked was a shared interaction model that could make those capabilities feel like one product instead of a growing collection of experiments. Prompts, reference assets, editors, and generated outputs all existed, but the logic connecting them was still unclear. As the product grew, so did a more important question: how do you turn fast-moving capabilities into a workflow people can actually understand, control, and build on?\n\nMy role quickly became much broader than designing individual screens. I worked closely with PMs, other designers, SDEs, frontend engineers, the founding engineer, and ML engineers to help turn those moving pieces into a more coherent product structure. I contributed to workflow design, node responsibilities, editor logic, interaction layers like sidebars and sliding panels, and the design system behind all of it. More importantly, this project changed how I think about these tools. I became much more aware of what the models could realistically support, where automation helped, where it broke down, and how a new workflow had to be designed around those limits. The goal was never to automate everything away. It was to make complex creation easier to begin, while still leaving people enough control to revise, refine, and make detailed decisions when the work demanded more precision.",
    role: "Product Designer / PM",
    duration: "2025 - present",
    type: "Intern",
    teams: "PMs, Design Team, Dev Team, Mkt Team",
    summary: [
      "When I joined Vicino AI, the product was expanding quickly across 3D, image generation, video generation, editing tools, and higher-level workflow features. What it still lacked was a shared interaction model that could make those capabilities feel like one product instead of a growing collection of experiments. Prompts, reference assets, editors, and generated outputs all existed, but the logic connecting them was still unclear. As the product grew, so did a more important question: how do you turn fast-moving capabilities into a workflow people can actually understand, control, and build on?",
      "My role quickly became much broader than designing individual screens. I worked closely with PMs, other designers, SDEs, frontend engineers, the founding engineer, and ML engineers to help turn those moving pieces into a more coherent product structure. I contributed to workflow design, node responsibilities, editor logic, interaction layers like sidebars and sliding panels, and the design system behind all of it. More importantly, this project changed how I think about these tools. I became much more aware of what the models could realistically support, where automation helped, where it broke down, and how a new workflow had to be designed around those limits. The goal was never to automate everything away. It was to make complex creation easier to begin, while still leaving people enough control to revise, refine, and make detailed decisions when the work demanded more precision.",
    ],
    moment: {
      title:
        "When I realized the product did not need one more features — it needed a clearer interaction model",
      body: [
        "What stayed with me most from this project was the moment I realized the product did not need one more feature. It needed a clearer structure.",
        "During one review, we walked through a long creation chain: camera, 3D, image, prompt, and then video. On paper, each part was already becoming more capable. But when I tried to trace the flow from input to output, I realized the problem was no longer feature depth. The problem was that the system itself was becoming harder to explain. Even within the team, people were beginning to describe the same workflow in different ways. That was the moment I stopped treating the project as a series of screen problems and started treating it as a workflow problem.",
        "From then on, I became much more focused on where complexity should live. What belongs in a node? What belongs in an editor? What should stay global, and what should stay local? If the models could not reliably do everything in one shot, then the product should not pretend otherwise. That shift shaped the prototype direction I helped push forward: nodes represented meaningful stages and outputs; the sidebar handled global settings and model controls; sliding panels supported more local adjustments, input management, and version history; and editors took on the deeper work that did not belong on the main canvas. More importantly, that structure gave the team a stronger foundation for iteration and a shared way to think about how new features should enter the product as it kept growing.",
        "(note: Video 2 Node prototype made by a teammate)",
      ],
      videos: [
        { src: `${MEDIA}/2sxQz0YH0U9dhtJQiQQ0plKSR8U.mp4` },
        { src: `${MEDIA}/5iOxAG6TNxFUKrbrm99nQp9VE.mp4` },
        { src: `${MEDIA}/LkL74v7ncImwXFUrfG4CCkmh9kA.mp4`, wide: true },
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
            image: `${IMG}/w7VAuq5Mdt9Q8seKnu9Q7n7RFS0.png`,
          },
          {
            tags: "WORKFLOW DESIGN · USER CAPABILITY",
            heading:
              "I stopped asking what the product could do, and started asking what users could actually understand",
            body: [
              "One of the biggest shifts in my thinking came when I stopped looking at the product only through capability. A traditional studio workflow assumes multiple specialists, each owning a different part of the process. A product cannot. Even if Vicino was growing toward more professional and studio-level use cases, the people actually using it would not necessarily think like a full production team. That meant the design challenge was not to reproduce a traditional pipeline step by step. It was to redefine what a workflow should look like when one person, or a much smaller team, is trying to work through systems that used to belong to several roles.",
              "That changed the questions I asked. I stopped asking only what the product was able to generate, and started asking what kind of flow a user could actually follow, revise, and finish. That shift made the work less about exposing more power and more about making power usable.",
            ],
            image: `${IMG}/VQq3yhEzHWYaC5RuRf5z44hxEA.png`,
          },
          {
            tags: "WORKFLOW STRUCTURE · MODEL CONSTRAINTS",
            heading:
              "I rebuilt the main path around what the models could actually support",
            body: [
              "Once I became more focused on feasibility, the main path started to clarify. Script, Storyboard, Image, and Video did not need to collapse into one “smart” object. They needed to do different jobs clearly. Script helped organize intent. Storyboard shaped pacing and visual sequence. Image worked better as a lighter preview and revision layer before users committed to video. Video then became the step that should happen with more intention, not less.",
              "One example made that logic very concrete for me. A video-first flow looked simpler on paper, but in practice it pushed users into the slowest and most expensive step before they could even confirm whether the content was right. By keeping image as a preview layer, users could correct composition, content, and direction before moving into motion. That made the workflow longer by one step, but much easier to control. It stopped being an idealized flow and became a usable one.",
            ],
            image: `${IMG}/4jRCSVcAkbGd6SEr97GpwZUnOkk.png`,
          },
          {
            tags: "AI LIMITS · PRODUCT LOGIC",
            heading:
              "I was not packaging a finished capability — I was helping define what that capability should become as a product",
            body: [
              "The more I worked on the system, the more I realized that design was not happening after the technology was “done.” Some paths were too expensive, too unstable, or too uneven to be presented as a default experience. Some outputs needed an intermediate step where users could inspect and redirect the result before moving on. That meant design could not simply wrap an existing capability in a nicer interface. It had to help define the form that capability should take as a product.",
              "One of the clearest examples was our decision not to compress too much into a single node. A more “magical” version often looked cleaner at first, but it also removed the checkpoints users needed to understand and correct what was happening. In several cases, splitting one powerful step into two smaller ones created a better product—not because the system became simpler underneath, but because the user finally had somewhere to pause, inspect, and decide.",
            ],
            image: `${IMG}/PAs9cYC0pYFMy5JNWi2b9MljpaE.png`,
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
            image: `${IMG}/2p1SkcpFAaQDb0pUmRjCZ8hdK9o.png`,
          },
          {
            tags: "INTERACTION ARCHITECTURE · INTERFACE LAYERS",
            heading:
              "I Distributed Different Kinds Of Complexity Across Four Interaction Layers",
            body: [
              "As the workflow became clearer, I started caring much more about where complexity should live. I did not want every new function to be solved by adding one more control to the same surface. Instead, I helped define a clearer distribution of responsibilities across the system. Nodes represented meaningful stages and outputs. The sidebar handled global settings and model-level controls. Sliding panels supported local inputs, smaller adjustments, and version history. Editors took on deeper, reusable work that did not belong on the canvas.",
              "That separation mattered because it made future decisions easier. For example, version history made more sense in the Sliding Panel than in the Sidebar, because it belonged to the current node and current output—not to the broader system state. Once we started making decisions that way, the layers stopped feeling like visual containers and started working as a shared framework for where new functionality should live.",
            ],
            image: `${IMG}/iqfmdKGdZXFBgs29aUVK7AiR40.png`,
          },
          {
            tags: "PM COLLABORATION · WORKING PROTOTYPES",
            heading:
              "I Used Rough But Structurally Clear Prototypes To Move Decisions Forward Before The Design Looked Finished",
            body: [
              "Another big shift for me was how I worked with the team. Because the roadmap, model behavior, and implementation state were all changing at once, this project did not fit a clean handoff model. Waiting until the design looked polished before sharing it would have slowed down the very conversations that needed to happen early. So I found myself relying much more on annotated flows, rough prototypes, and working structures that made the logic visible before the UI was fully refined.",
              "In one case, I even moved directly into a lightweight React prototype for the sliding panel instead of waiting to fully package everything in static specs first. That was not about skipping design craft. It was about helping PMs and engineers react to structure while the product logic was still moving. In this project, rough but clear prototypes were often the fastest way to build alignment.",
            ],
            image: `${IMG}/Y2anlRBHMWoIbETEdzOk5RafKp4.png`,
          },
          {
            tags: "DESIGN SYSTEMS · SCALABILITY",
            heading:
              "The Design System Stopped Being Cleanup Work And Became The Infrastructure That Let The Product Keep Growing",
            body: [
              "At the same time, I stopped treating the design system as something you do after the main design work is finished. As more workflows, editors, and support layers entered the product, consistency was no longer just a visual concern. It became a way to keep the product readable, keep the team aligned, and make future iteration easier. Without a clearer system, every new feature risked reopening the same structural debates.",
              "That became even more important as the product started preparing for future expansion, including faster workflow creation and more assistive features that might be introduced later. In practice, this meant standardizing more than just colors or spacing. It meant giving the team a stable language for layers, components, and behaviors, so new workflows could enter the system without forcing everyone to renegotiate the same patterns from scratch.",
            ],
            image: `${IMG}/w5I7Go3ueHyH98FnyiEWACBfJ8.png`,
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
    cover: `${IMG}/J7KSTcOXT9GD7Wi9y09C1kQVpRY.png`,
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
        { src: `${MEDIA}/lX87zncxlP75HPjOuxEBjrAIMI.mp4` },
        { src: `${MEDIA}/NcrYa6VeZRsVXkl0FLlqvUyzLAc.mp4` },
        { src: `${MEDIA}/e3Ly93zb0zMaZ8i4cHXvK7RE.mp4`, wide: true },
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
            image: `${IMG}/adocnaNIqkMGEz0fjzS61Lrzyg.png`,
          },
          {
            tags: "USABILITY TESTING · BUG LOGGING · USER FEEDBACK ANALYSIS",
            heading: "Testing Showed Me Users Weren’t Lost—They’d Been Left Behind",
            body: [
              "Every week I ran through the whole dashboard—subscriptions, resumes, job recommendations—logging every bug with screenshots. The problems piled up: hidden subscription flows, unclear resume states, job lists suggesting software engineering roles to marketing students.",
              "Then I saw a review: “I honestly have no idea how to use this.” It stung, because I’d felt the same on my first try. The problem wasn’t user intelligence—it was the product’s silence. No onboarding, no guidance, no hand to hold. Users weren’t lost; they’d been abandoned.",
            ],
            image: `${IMG}/gWzfdHCRdn4RkcUo9rx6OGajs8.png`,
          },
          {
            tags: "COMPETITIVE ANALYSIS · COST EVALUATION · PRODUCT BENCHMARKING",
            heading: "I Learned That Chasing Trends Wasn’t an Option",
            body: [
              "My mentor showed me Simplify, Teal, and other competitors. They had sleek AI autofill features, and at first I thought we should too. But once we calculated costs, it was clear a startup couldn’t afford that. My mentor reminded me: “We’re past early funding. Every design decision must make financial sense.”",
              "That reframed my mindset. Startup design wasn’t about piling on flashy features, but finding leverage points—low-cost changes that could restore trust and usability. It wasn’t about chasing the AI trend; it was about knowing what not to build.",
            ],
            image: `${IMG}/z6g5ELAZFrVWESYf8XVnH8s0.png`,
          },
          {
            tags: "BUG TRIAGE · JOURNEY MAPPING · PROBLEM DEFINITION",
            heading: "From Scattered Bugs to Systemic Problems",
            body: [
              "Together with my mentor, I clustered bugs and feedback. Resume gaps, opaque subscriptions, scattered settings—they all pointed to systemic flaws: no onboarding, broken information hierarchy, missing trust.",
              "At first it felt like whack-a-mole: fix one bug, another pops up. But then it hit me: unless we asked bigger questions, users would keep leaving faster than we could patch. Why was conversion so low? Why were features ignored? Did users lose trust on day one?",
              "That was my turning point. I wasn’t just logging issues anymore—I was learning to turn bugs into design problems. That’s where design could shift the product from firefighting toward strategy.",
            ],
            image: `${IMG}/SpOzEq9WuEvCdyyoudss4Mdudr0.png`,
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
            image: `${IMG}/mojnu7syokMRNJ6psUnsC3naI.png`,
          },
          {
            tags: "SUBSCRIPTION REDESIGN· RESUME MANAGEMENT · FILTERING EXPERIENCE",
            heading: "Fighting for Clarity, Accepting Half-Wins",
            body: [
              "I redesigned the subscription page to show price and timeframes. The CEO agreed, but engineering pushed back: “Too heavy for the backend.” We shipped just the price. I hated losing the clarity—knowing what you bought felt so basic.",
              "In resume management, I suggested active/inactive toggles to control recommendations. Engineering said no again, too complex. We cut it down to one highlighted resume. I knew it wasn’t flexible, but at least it gave users a little control.",
              "For filters, I insisted on adding location and salary—my mentor reminded me those mattered most to job seekers. That time, I held the line. Each round felt like bargaining. Sometimes I won clarity, sometimes only half. But I learned to prioritize: if the perfect solution won’t ship, even a partial step forward is still progress.",
            ],
            image: `${IMG}/QYQYxvdE318lF0NjQQF4T92iY.png`,
          },
          {
            tags: "DESIGN SPECS · QA WALKTHROUGH · DEVELOPER HANDOFF",
            heading: "Becoming My Own QA",
            body: [
              "After handoff, the frontend often ignored our Figma components and used their own templates. When I saw the first build, I froze: the structure was right, but the details were unrecognizable.",
              "So I became my own QA—running every flow, screen-recording, capturing bugs. Subscription data missing, resume states broken, misaligned tooltips—I logged nearly a hundred issues. Once, an engineer even admitted: “We thought that feature wasn’t live yet.” It was both funny and painful.",
              "Frustrating as it was, I learned something essential: in a strapped startup, the designer isn’t just a flow creator—they’re also the last line of defense for what makes it to production.",
            ],
            image: `${IMG}/osRacTZJ0WnEBDhuwHjyHF6pV8.png`,
          },
          {
            tags: "SPRINT REVIEW · RETROSPECTIVES · DESIGN PRINCIPLES",
            heading: "From Frustration to Redefining My Role",
            body: [
              "In review, the PM said at least registration rates had recovered. The CEO called a demo “complete,” even though its value was limited. I felt torn—by their definition, we’d succeeded. But I knew this “completeness” was fragile.",
              "Then my mentor reminded us: “We’re still firefighting. Eventually we need standards.” That stuck with me. Yes, we were living in trade-offs. But I could still fight for clarity and consistency where it mattered.",
              "That’s when I reframed my role. Design wasn’t just about pixels—it was about helping the product survive and move forward, even if imperfect. In a startup, sometimes keeping the product alive is the most meaningful design you can deliver.",
            ],
            image: `${IMG}/vh67bkEgGRz5dxrBoPOUJHYA.png`,
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
    cover: `${IMG}/hnG0x6uWkJJVksmxu5u2OIc1PkI.png`,
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
      videos: [{ src: `${MEDIA}/0YUwmf39zv2LOjK87mSkDqwMhs.mp4`, wide: true }],
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
            image: `${IMG}/u1QTK7nAxvtdYkJJUwn27XHXH0.png`,
          },
          {
            tags: "Heuristic Evaluation · UX Audit",
            heading: "The Audit Promised Usability but Revealed Deeper Gaps",
            body: [
              "I started with a heuristic evaluation. What I found was subtle but serious: ambiguous navigation, misleading progress indicators, and no cues linking actions to learning outcomes. A progress bar suggested mastery, yet no feedback confirmed understanding. These issues weren’t just usability flaws—they revealed a deeper problem: the system measured activity, not comprehension.",
            ],
            image: `${IMG}/y4g1iOAeZ3DbygTr4oCjhmawCI.png`,
          },
          {
            tags: "User Interviews · Affinity Mapping · Jobs-to-Be-Done",
            heading: "When Points Felt Hollow, Students Asked for Proof",
            body: [
              "User testing with high school and university students reinforced this gap. Many completed tasks quickly, but when asked to recall citations or explain reasoning, they hesitated. One student put it bluntly: “It feels like a game, not like I’m learning.” That insight reframed our challenge: the design goal was not to keep students clicking, but to give them proof of progress they could believe in.",
            ],
            image: `${IMG}/36T8QNF6Ig8SWEUDDRbCwUKLZ8.png`,
          },
          {
            tags: "Insight Synthesis · Design Principles · Evidence-Based Framing",
            heading: "The Moment Complaints Became a Design Compass",
            body: [
              "From evaluation and testing, I distilled four design principles: clarity (navigation and progress must be unambiguous), feedback (immediate confirmation of understanding), motivation (gameplay should reinforce effort, not distract), and outcomes (design must point back to learning goals). This translation—from scattered complaints to structured principles—was the foundation for everything that followed.",
            ],
            image: `${IMG}/4VBB9t4qjDpl67YIwX0lvwO0EWc.png`,
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
            image: `${IMG}/Q5Sry3kmQjkL2IrPJonGuWTcTs.png`,
          },
          {
            tags: "Usability Testing · Feedback Loop · Cognitive Load",
            heading: "How Feedback Turned Empty Clicks Into Learning Moments",
            body: [
              "In usability tests, students said they clicked without thinking because the system never asked them to pause. I introduced immediate feedback—correct answers revealed sources, wrong ones showed hints and citations. This transformed clicks into moments of reflection, teaching students that learning wasn’t about speed, but about engaging with evidence.",
            ],
            image: `${IMG}/nIVoATYHxfZZ2Add1MYY7XAzUU.png`,
          },
          {
            tags: "Gamification · Rewards System · Behavior Design",
            heading:
              "The Day Sources Stopped Being Ignored And Started Driving Learning",
            body: [
              "Early prototypes treated citations as optional drawers, but students ignored them. I reframed citations as part of gameplay: correct answers unlocked sources, and exploring them earned small achievements. What was once a burden became motivation—students engaged with primary sources not because they had to, but because it felt rewarding.",
            ],
            image: `${IMG}/iq5Xv9PySspri0wwc01wAsSpnso.png`,
          },
          {
            tags: "Iteration · Prototype Testing · Design System Alignment",
            heading: "Delivering The First Evidence-Based UX Process For Roper",
            body: [
              "The final delivery included a high-fidelity prototype, UI kit, and research report. But the real impact was showing Roper Center their first evidence-based UX process. Every design choice traced back to a pain point, every feature mapped to a principle. The redesign didn’t just make the tool usable—it made it educational.",
            ],
            image: `${IMG}/fpm42GkwPwxcSXlHPDBjgeaet4.png`,
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
    cover: `${IMG}/5zyKNfQwTPjb8k4yiVdDHojwG4.png`,
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
      image: `${IMG}/5zyKNfQwTPjb8k4yiVdDHojwG4.png`,
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
        `${IMG}/YzdvHm9fRkxjYqLmiFkgRZy2ds.png`,
        `${IMG}/xxUlpWJIXRbMFeUYoUXXdSrePE.png`,
        `${IMG}/vRXAT7TUi9cF4MfUqD9VOwPvj8.png`,
        `${IMG}/RMkSRmw2XRzwPj5ekMTRNcz0c.png`,
      ],
    },
    order: 4,
  },
  {
    slug: "vr-education",
    title: "VR Monarch Butterfly",
    template: "poster",
    cover: `${IMG}/NwtTH2DNikT8udqd6SMqzccrHc.png`,
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
      image: `${IMG}/NwtTH2DNikT8udqd6SMqzccrHc.png`,
      intro: [
        "VR Monarch Butterfly is an immersive and interactive virtual reality documentary created during Winter Term in January 2023, marking my first exploration into interaction design. Working collaboratively with two fellow students, we employed Unity as our primary development tool to construct an engaging virtual environment designed to authentically recreate the spectacular journey of monarch butterflies during their annual migration. To enhance immersion, we carefully crafted detailed visual scenes depicting the butterflies' habitats, migration routes, and behaviors, aiming to evoke genuine emotional and sensory responses from users.",
        "Additionally, we integrated a documentary-style narration to provide educational context, making the experience informative as well as visually captivating. Interactive elements were intentionally designed and incorporated throughout the experience, allowing users to engage actively by exploring various scenes, triggering narrated explanations, and closely observing the butterflies' characteristics and migratory patterns. Ultimately, the project transcends traditional VR visualization by blending interactive technology, immersive storytelling, and educational documentary elements, providing an innovative approach to understanding and appreciating the monarch butterfly migration.",
      ],
      details: {
        project: "VR Monarch Butterfly",
        client: "Undergraduate",
        year: "12/2023-1/2024",
        services: "Digital Art, Immersive Experience, Digital Education",
        livePreview: {
          label: "VR MONARCH BUTTERFLY",
          href: "https://example.com",
        },
      },
      body: [
        "Synopsis: This collaborative project was completed with classmates during Oberlin College’s Winter Term in January 2023, utilizing Unity for the VR platform and Blender for butterfly modeling, with my primary role being scene creation. Our goal was to build a realistic virtual environment depicting the spectacular migration of monarch butterflies, exploring the educational and documentary potential of immersive VR experiences. Users can interact with and explore the scene through VR headsets.",
        "Looking forward, we plan to further enhance the project by integrating additional visual art elements, such as transitioning butterflies into particle effects synchronized with music, evolving the experience from a purely realistic representation into a visually compelling artistic work.",
      ],
      gallery: [
        `${IMG}/eBiTITfDvzOQi5d856eOQlnZ0.png`,
        `${IMG}/zybECsV8b73QDuiTODGgkNl1kpU.png`,
        `${IMG}/WLu4twUpL4jQRQUFnaixKsArCfs.png`,
        `${IMG}/q6fhW0aDnYgQVrLeSm0az2p46g.png`,
      ],
    },
    order: 5,
  },
];

export const projectsBySlug = Object.fromEntries(
  projects.map((p) => [p.slug, p]),
);

export function adjacent(slug: string) {
  const sorted = [...projects].sort((a, b) => a.order - b.order);
  const i = sorted.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? sorted[i - 1] : null,
    next: i < sorted.length - 1 ? sorted[i + 1] : null,
  };
}
