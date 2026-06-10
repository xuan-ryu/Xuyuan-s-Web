export const site = {
  name: "Xuyuan Liu",
  nameZh: "刘 栩源",
  title: "Xuyuan Liu — Product Designer & Creative Developer",
  description:
    "Product designer and creative developer based in New York. My work sits between product, humanities, and code.",
  email: "xuan.ryu8@gmail.com",
  phone: "+1 4405813229",
  location: "New York, NY",
  socials: {
    linkedin: "https://www.linkedin.com/in/xuyuan-liu/",
    instagram: "https://www.instagram.com/",
  },
  greeting: ["Welcome", "欢迎", "ようこそ。"],
  howIWork: [
    {
      title: "Observe",
      subtitle: "Attention before action",
      body: "I look past surface-level feedback to find the friction people have learned to live with. Precision starts with attention — UX audits, pain-point mapping, and asking what hasn't been said yet.",
    },
    {
      title: "Build",
      subtitle: "Prototypes as thinking",
      body: "I use prototypes and code as thinking tools, not deliverables. Building early exposes what's missing, sharpens priorities, and turns abstract debates into something a team can actually argue about.",
    },
    {
      title: "Align",
      subtitle: "Shared direction, shippable",
      body: "I work between product, design, and engineering — aligning priorities, negotiating trade-offs, and helping scattered input become a direction the team can ship behind.",
    },
  ],
} as const;

export type Site = typeof site;
