export const site = {
  name: "Xuyuan Liu",
  nameZh: "刘 栩源",
  brandmark: "Hi, I'm Xuyuan — an AI design engineer.",
  title: "Xuyuan Liu — AI Design Engineer",
  description:
    "AI design engineer crafting digital products where design meets code — an oriental aesthetic with modern engineering.",
  email: "xuan.ryu8@gmail.com",
  phone: "+1 4405813229",
  location: "New York, NY",
  socials: {
    linkedin: "https://www.linkedin.com/in/xuyuan-liu-0b589b252",
    instagram: "https://www.instagram.com/_xuan_liu_/",
  },
  greeting: ["Welcome,", "欢迎,", "ようこそ。"],
  heroSub:
    "AI Design Engineer.\nI design products and build them in code — with AI as the medium.",
  brandCorner: {
    // bottom-left hero caption — credits the composition's source
    zh: "构图灵感源自《潇湘八景图》\nInspired by the Eight Views of Xiaoxiang",
    en: "GAWAIN · UX STRATEGY × VIBE CODING",
  },
  sideText: "先行先聽 萬縷歸心",
  scrollHint: "Scroll down to explore",
  blackPage: {
    zh: "深 邃",
    body: "AI is just the newest tool. The soul of the work never changes — it only comes through more vividly.",
  },
  archetypes: [
    {
      icon: "🔥",
      title: "Firefighter",
      body: "I move fast when it matters. When projects hit turbulence, I find clarity under pressure — turning constraint into creative momentum. I step toward the hard problems, not away from them.",
    },
    {
      icon: "🦉",
      title: "Owl",
      body: "I observe before I act. Deep research and careful synthesis are my foundation. I question surface assumptions, surface what's hidden in the data, and ask the question nobody thought to ask.",
    },
    {
      icon: "🌳",
      title: "Tree",
      body: "I build for the long run. Strong roots in research and relationships. Adaptable above ground — growing in whichever direction the work genuinely needs, not just what's comfortable.",
    },
  ],
  workMethods: [
    {
      title: "Observe",
      heading: "See what others settle for",
      body: "I look past surface-level feedback to find the friction people have learned to live with. Precision starts with attention — UX audits, pain-point mapping, and sitting with ambiguity before jumping to solutions.",
    },
    {
      title: "Build",
      heading: "Prototype before certainty",
      body: "I use prototypes and code as thinking tools, not deliverables. Building early exposes what's missing, sharpens priorities, and turns abstract direction into something a team can react to.",
    },
    {
      title: "Align",
      heading: "Connect vision, logic, and execution",
      body: "I work in the spaces between product, design, and engineering — aligning priorities, negotiating trade-offs, and helping scattered input become coherent momentum.",
    },
  ],
  quotes: [
    {
      text: "XUYUAN brings a rare combination of empathy and precision to every project. Their ability to synthesise user research into actionable design decisions is exceptional.",
      author: "Jiangning Lian",
      role: "Senior Product Designer",
    },
    {
      text: "Working with XUYUAN transformed our team's design process. They asked questions that reshaped how we understood our own users — and the final product showed it.",
      author: "Minna Wang",
      role: "UX Research Lead",
    },
    {
      text: "XUYUAN's research instincts are exceptional. They consistently surface insights that shift a project's direction in a meaningful way — always asking the right questions.",
      author: "Yu-chi Chang",
      role: "HCI Faculty, Cornell",
    },
  ],
} as const;

export type Site = typeof site;
