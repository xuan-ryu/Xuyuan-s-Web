export type ProjectChapter = {
  number?: string;
  title: string;
  tags?: string;
  body: string[];
};

export type Project = {
  slug: string;
  title: string;
  cover?: string;
  coverClass?: string;
  tags: string[];
  oneliner: string;
  blurb: string;
  role: string;
  duration: string;
  type: string;
  teams: string;
  memorableMoment?: {
    title: string;
    body: string[];
  };
  chapters?: ProjectChapter[];
  livePreview?: { label: string; href: string };
  order: number;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "vicino-ai",
    title: "Vicino AI",
    cover: "/media/CSMKvZFRUZIIYznbJxUXsf58M.png",
    coverClass: "cover-vicino",
    tags: ["Product Design", "PM", "AI"],
    oneliner:
      "Finding the structure underneath a creation chain that spans 3D, image, prompt, and video — so the seams stop being where users get lost.",
    blurb:
      "When I joined Vicino AI, the product was expanding quickly across 3D, image generation, video generation, editing tools, and higher-level workflows. My focus became finding the structure underneath all of it — where complexity should live, and where the interaction model needed to stay quiet.",
    role: "Product Designer / PM",
    duration: "2025 – present",
    type: "Intern",
    teams: "PMs, Design Team, Dev Team, Mkt Team",
    memorableMoment: {
      title:
        "When I realized the product did not need one more feature — it needed a clearer interaction model",
      body: [
        "What stayed with me most from this project was the moment I realized the product did not need one more feature. It needed a clearer structure.",
        "During one review, we walked through a long creation chain: camera, 3D, image, prompt, and then video. On paper, each part was already becoming powerful on its own. In use, the seams between them did most of the damage. Users were not blocked by missing features; they were blocked by not knowing where they were inside the system.",
        "From then on, I became much more focused on where complexity should live. What belongs in a node? What belongs in an editor? What should stay invisible until it's needed?",
      ],
    },
    order: 1,
    featured: true,
  },
  {
    slug: "froghire-ai",
    title: "FrogHire.ai",
    cover: "/media/J7KSTcOXT9GD7Wi9y09C1kQVpRY.png",
    coverClass: "cover-froghire",
    tags: ["UX Design", "Research", "AI"],
    oneliner:
      "Redesigning the AI-powered hiring experience for early-career talent — making algorithmic screening feel fair, transparent, and human.",
    blurb:
      "I redesigned FrogHire.ai, an early-stage AI job-matching platform, turning scattered bug fixes and negative reviews into a focused effort to align the product with what users actually needed.",
    role: "UX Designer",
    duration: "05/22/2025 – 08/22/2025",
    type: "Intern",
    teams: "UX Designer, PM, Founder, Front End Engineers",
    memorableMoment: {
      title:
        "“When I Learned Survival Can Be The Most Important Design Goal”",
      body: [
        "It was in the middle of a standoff over onboarding. The CEO pushed for a flashy animation, convinced it would impress users. Engineering immediately objected — timelines were tight, and the team had already missed two ship dates.",
        "Then my mentor cut in: “The real problem isn't which format. It's that we have no onboarding at all.”",
        "That pause reframed everything. I realized that in a startup, elegance doesn't matter if the product can't survive. We shipped tooltips — lightweight, unglamorous, but enough to keep users from churning before the next release.",
      ],
    },
    order: 2,
    featured: true,
  },
  {
    slug: "roper-center",
    title: "Roper Center",
    cover: "/media/hnG0x6uWkJJVksmxu5u2OIc1PkI.png",
    coverClass: "cover-roper",
    tags: ["UX Design", "Data Viz"],
    oneliner:
      "Redesigning public opinion data discovery for researchers and the general public.",
    blurb:
      "I led the redesign of Roper Center's educational simulation platform, reframing it from a confusing quiz-like tool into a structured learning experience for students of public opinion research.",
    role: "UX Designer, Project Manager",
    duration: "09/01/2024 – 12/17/2024",
    type: "Client-Based Project",
    teams: "UX Designers, UX Researchers, Project Manager, Software Engineers",
    memorableMoment: {
      title:
        "The Day I Realized That Progress Bars Can Mislead Learning",
      body: [
        "During usability tests, students smiled when the progress bar filled up and said, “I'm done, I've learned it.” Yet when asked follow-up questions, they couldn't reconstruct the reasoning behind their answers.",
        "That moment reshaped how I thought about educational design. A progress bar is not just decoration; it is a promise. As Don Norman reminds us, every visible signal is a kind of contract with the user — and we had been making the wrong promise.",
      ],
    },
    order: 3,
    featured: true,
  },
  {
    slug: "hunger1942",
    title: "Hunger 1942",
    cover: "/media/5zyKNfQwTPjb8k4yiVdDHojwG4.png",
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
    memorableMoment: {
      title: "Why this game began",
      body: [
        "Hunger 1942 is a game project that I initiated and developed with my team. It is a 2D pixel-style historical role-playing survival game inspired by the 1942 Henan famine in China.",
        "During the COVID-19 epidemic in 2022, intense pressures from lockdowns, financial difficulties, illness, and food shortages gradually shifted my perception of historical disasters from abstract narratives into deeply personal realities.",
        "Chinese culture deeply romanticizes self-sacrifice — using one's most precious life for collective ideals — as the highest form of achievement. Yet, individual lives caught in disasters often go unnoticed.",
      ],
    },
    livePreview: { label: "Hunger 1942", href: "#" },
    order: 4,
  },
  {
    slug: "vr-education",
    title: "VR Monarch Butterfly",
    cover: "/media/NwtTH2DNikT8udqd6SMqzccrHc.png",
    coverClass: "cover-vr-monarch",
    tags: ["VR Design", "Unity"],
    oneliner:
      "An immersive VR education experience tracing the monarch butterfly migration through embodied perspective-taking.",
    blurb:
      "VR Monarch Butterfly is an immersive VR experience showcasing the monarch butterfly migration.",
    role: "Designer, Developer",
    duration: "12/2023 – 1/2024",
    type: "Undergraduate",
    teams: "Digital Art, Immersive Experience, Digital Education",
    memorableMoment: {
      title: "Synopsis",
      body: [
        "VR Monarch Butterfly is an immersive and interactive virtual reality documentary created during Winter Term in January 2023, marking my first venture into VR development.",
        "This collaborative project was completed with classmates during Oberlin College's Winter Term in January 2023, utilizing Unity for development.",
        "Looking forward, we plan to further enhance the project by integrating additional visual art elements, such as transitioning butterflies into more painterly, expressive forms.",
      ],
    },
    livePreview: { label: "VR Monarch Butterfly", href: "#" },
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
