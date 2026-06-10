export const site = {
  name: "Xuyuan Liu",
  nameZh: "刘 栩源",
  brandmark: "XUYUAN",
  title: "Xuyuan Liu — Product Designer & Creative Developer",
  description:
    "Interactive Design & Creative Development. Crafting digital experiences with an oriental aesthetic and modern engineering.",
  email: "xuan.ryu8@gmail.com",
  phone: "+1 4405813229",
  location: "New York, NY",
  socials: {
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
  },
  greeting: ["Hello,", "你好,", "こんにちは"],
  heroSub:
    "Interactive Design & Creative Development.\nCrafting digital experiences with an oriental aesthetic and modern engineering.",
  brandCorner: {
    zh: "气韵生动",
    en: "Foreground Bank & Distant Peaks · Mist · Birds · Moss",
  },
  sideText: "会 当 凌 绝 顶",
  scrollHint: "向下滚动 / Scroll to explore",
  blackPage: {
    zh: "深 邃",
    body: "当数字水墨褪去，我们在黑暗中聚焦设计的本质。\nScroll to enter.",
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
