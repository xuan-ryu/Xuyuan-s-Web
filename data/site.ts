export const site = {
  name: "Xuyuan Liu",
  nameZh: "刘 栩源",
  // NBSP inside "AI product" keeps it together so the black-page title breaks as
  // "Hi, I'm Xuyuan — / AI product designer & / design engineer."
  brandmark: "Hi, I'm Xuyuan — AI product designer & design engineer.",
  title: "Xuyuan Liu — AI Product Designer & AI Design Engineer",
  description:
    "AI product designer & AI design engineer crafting digital products where design meets code — an oriental aesthetic with modern engineering.",
  email: "xuan.ryu8@gmail.com",
  phone: "+1 (440) 581-3229",
  location: "New York, NY",
  resumeUrl: "/media/about/resume.pdf?v=0716d",
  socials: {
    linkedin: "https://www.linkedin.com/in/xuyuan-liu-0b589b252",
    instagram: "https://www.instagram.com/_xuan_liu_/",
  },
  greeting: ["Welcome,", "欢迎,", "ようこそ。"],
  heroSub:
    "AI Product Designer · AI Design Engineer.\nI design and build the structure around AI — for the people who use it, and the teams who ship it.",
  brandCorner: {
    // bottom-left hero caption — credits the composition's source
    zh: "构图灵感源自《潇湘八景图》\nInspired by the Eight Views of Xiaoxiang",
    en: "GAWAIN · UX STRATEGY × VIBE CODING",
  },
  scrollHint: "Scroll down to explore",
  blackPage: {
    zh: "深 邃",
    body: "I give unclear ideas form.",
  },
  homeHow: {
    feedText: "Bring me a question",
    feedHint: "Three drops reveal how I work",
    continueHint: "How I work is next — keep going",
  },
  workMethods: [
    {
      title: "Diagnose",
      heading: "Find the problem underneath the request",
      body: "I start where the product is already hurting: complaints, failed states, awkward handoffs, and the workaround nobody names. The first move is turning noise into the real constraint.",
    },
    {
      title: "Prototype",
      heading: "Make the argument tangible",
      body: "I build early because a working surface tells the truth faster than a perfect deck. Code prototypes, motion tests, and workflow mockups let teams react while the direction is still cheap to change.",
    },
    {
      title: "Structure",
      heading: "Turn good decisions into systems",
      body: "Once the direction is clear, I make it repeatable: tokens, component contracts, checkpoints, roles, and AI guardrails. The work should keep making sense after the first handoff.",
    },
  ],
} as const;

export type Site = typeof site;
