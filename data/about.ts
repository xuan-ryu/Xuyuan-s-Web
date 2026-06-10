// About-page content transcribed verbatim from the Framer export
// (export-.../about/index.html); section order and media mapping follow the
// live site DOM (audit-screenshots/outline-about.txt).

const IMG = "/assets/framerusercontent.com/images";
const MEDIA = "/assets/framerusercontent.com/assets";

export const about = {
  heading: "About Me.",
  heroIntro:
    "I'm a curious generalist with too many tabs open. I know a little about a lot, chase odd possibilities for fun, and lately I've been building with AI to see which ideas deserve to become real.",
  hometown: "My Hometown, Chongqing, China, A City that Grounded With People.",
  koan: {
    zh: "好雪片々，不落别處",
    en: "Good snow, flake by flake, falls only here.",
    caption: "— Zen kōan on full presence",
  },
  bio: [
    "Hi, I’m Xuyuan Liu — a product designer and creative developer based in New York, by way of Cornell.",
    "My work sits between product, humanities, and code. Sometimes it starts as research, sometimes as an interface, and sometimes as a prototype that becomes the research itself. Most of what I make returns to one small question: what would this be like if it were actually good?",
  ],
  resumeNote:
    "My Resume Tells You What I've Done. This Is What's In My Head While I'm Doing It.",

  whatChanged: {
    title: "What Changed",
    body: [
      "These days, I’m watching two things happen at once.",
      "Technology is becoming genuinely more open. Tools are cheaper, faster, and kinder to beginners than they have ever been. More people can now make, write, design, build, and say what they mean in forms that used to require entire teams or years of training.",
      "At the same time, that openness is reshaping the world I was trained to enter. The research habits, the design craft, the code I taught myself after midnight — none of that disappears. But it is being asked to do new work, in new shapes, at a different speed.",
      "I don’t think the honest response is nostalgia. I also don’t think it is blind excitement. The harder thing is to keep moving without becoming careless — to use new tools without forgetting what craft was trying to teach me.",
    ],
    closing: "I Learned A Lot. The Era Keeps Moving. So Do I.",
    // 5x4 logo wall, row-major, as rendered on the live site at 1440w
    logos: [
      `${IMG}/5J5OEzpheE8Fxt8MeKK7UkFDDe8.svg`,
      `${IMG}/CNUyQk0XNbw3geWYbXJtlRT80.png`,
      `${IMG}/xwnKoqiHtgolpK85ELMAZgRtBI.png`,
      `${IMG}/x8AO0uXQ7jQm3Ygxv7EX3q1M.png`,
      `${IMG}/3DOoUFQ2wutndQSEhQYe8drSm68.png`,
      `${IMG}/E6rG0jQ8sKPNhH2w0hi7RAqlfxE.png`,
      `${IMG}/ejKIC88egZahPvJJGv8El9lA6gM.png`,
      `${IMG}/hXCW92Fo4239PgNRzvCqVUrG0.webp`,
      `${IMG}/lg1QGHwGwPnIIM2anM62VC1x0.svg`,
      `${IMG}/L03RNVqaBTGbQ263Pi6WDza1cM.png`,
      `${IMG}/6Qwf6PbbFLDvYpmjUmVor3SqWM.png`,
      `${IMG}/JO1yuHHhzuYB6RosNzzrAQ5pBeo.png`,
      `${IMG}/EIFKHmoTOeLFSt1LxAF1wQw9fw.png`,
      `${IMG}/eDHObwcFOAKAeWQTMcG6hrVU9A.png`,
      `${IMG}/zt3zQspgf4m7OkqlznNpjvkcNA.png`,
      `${IMG}/gwmgdtDtwFYraBJmFzfeVWXOSmY.png`,
      `${IMG}/QdglYPgKGHdhJ9HbKDD621M9uHU.svg`,
      `${IMG}/0zkeuqQ5qK8ixn7kzvQxXYtZ6rI.png`,
      `${IMG}/HqIQCYs1x8G5tBzRn6henq97d4.webp`,
      `${IMG}/mBcFXXR2XSpQFL5AGUm2sCQ7OnE.png`,
    ],
  },

  shutter: {
    title: "Before the Shutter Closes",
    body: [
      "The feeling is close to what those darkroom photographers must have had when the first digital cameras hit the shelves. Glad, of course — the craft was reaching more hands. But quieter than glad, somewhere underneath. You can spend forty years over a tray of developer, learning by feel alone when a print has been in the bath long enough — no timer, no instructions — and then one morning that knowledge has nowhere left to go.",
      "I shoot a little myself. Digital generation, obviously. But I'd rather come home with thirty frames I actually remember taking than two thousand I'll be meeting for the first time in Lightroom. So I keep going back to film. Film makes you decide what the photograph is before the shutter closes — no preview, no second take, just whether you read the light correctly the first time.",
      "My friends and I have a \"Zen\" phrase for the kind of moment we're after: 恰好, QiaHao. Not perfect; not excessive; right. The light isn't flawless but it's enough. Sometimes you don't even raise the camera a second time, because you can already feel that the first frame was the one.",
      "That's what I still trust about the older tools. Not slowness as virtue — slowness has nothing to do with it — but the way the constraint sharpens what you pay attention to. You eventually learn what it feels like when something has actually landed, as opposed to merely produced.",
      "Same with the AI era. You can generate a hundred prototypes before lunch; that doesn't make 恰好 cheaper, only rarer.",
    ],
    video: `${MEDIA}/9Zq9uut6C58z0HyonvLZFxJLv0.mp4`,
    caption: "01/25/2023 Kinkakuji, Kyoto, Japan",
  },

  howIWork: {
    title: "How I Work",
    body: [
      "Thinking and making have never quite lived in separate rooms for me. Research starts to matter only when it changes the shape of the thing. A sketch turns out to be less an idea presented than an idea tested — sometimes the test is what tells me the idea wasn't any good to begin with. A prototype that works isn't a demo bolted on at the end of the thinking; it's where the thinking finally gets caught in the act.",
      "There's a phrase from the dōjō — 心・技・体, mind, technique, body. The intuition it points to, that surfaces under pressure in both design and budō, isn't mystical. It's what's left after years of designs that failed for reasons I couldn't yet see, and after a sensei broke and rebuilt my technique with a bokken that didn't care how I felt about it.",
      "Later, under pressure, that work returns as a faster kind of seeing — an eye and a body that can tell good from bad before the conscious mind has language for why.",
      "A client doesn't always give you a second draft. Neither does the bokken. All you can do is own the wrong call afterward — sit with it, study what happened, carry the responsibility — and let it quietly change how you see the next one.",
      "That's the kind of design I'm after — not impressive in the abstract, and not just polished at the surface, but something handled and tested and adjusted enough times to start moving naturally. The best interfaces I've used have that quality: they don't announce themselves, they just arrive where your thought was already going.",
    ],
    caption: "心・技・体 / mind, skill, body / Aikido · Kendo · Iaido",
  },

  // staggered photo wall; positions are live-measured offsets at 1440w
  // (x relative to a 1420px-wide stage, y relative to the wall top)
  dojoWall: [
    { src: `${IMG}/2RoUM3esMXVEKDaeQnGVXBBhOY.jpg`, x: 0, y: 0, h: 433 },
    { src: `${IMG}/7PQHwFbGVgsuZbWOfNEzYPD7zcI.jpg`, x: 178, y: 0, h: 254, caption: "Oberlin Aikikai, OH, 2022" },
    { src: `${IMG}/tW4R7MqkdmATxELLSr4A2SrlWw.jpg`, x: 356, y: 139, h: 130, caption: "Ikazuchi Dojo, CA, 2023" },
    { src: `${IMG}/MF7TFCYzwRJPqsi7BNMfExGPyg.jpg`, x: 534, y: 156, h: 277 },
    { src: `${IMG}/SUHc9j4i2q6lWCPn65FHtpIVCqw.jpg`, x: 712, y: 29, h: 333, caption: "Chongqing JiangBei Kendo Dojo, China, 2024" },
    { src: `${IMG}/mkABAiHXQOfGwelCIF1V62j82g.jpg`, x: 890, y: 213, h: 221 },
    { src: `${IMG}/EvOUJarrMys983wrkaajzhZpzk.jpg`, x: 1068, y: 0, h: 433 },
    { src: `${IMG}/LLqvjwTjmeqiekQkofmdE7L6mhc.jpg`, x: 1246, y: 99, h: 195, caption: "Kyoto Hokenkai, Japan, 2024" },
  ],

  activities: [
    {
      org: "Cornell Chinese Drama Club",
      role: "Publicity Department Chair",
      date: "September 2024 – Dec 2025",
      bullets: [
        "Operate the WeChat public account and published the tweet to attract more 300+ users for performance",
        "Developed the marketing promotion materials including posters design and advertise the events",
      ],
    },
    {
      org: "Chinese Student Association",
      role: "Chair",
      date: "January 2023- May 2024",
      bullets: [
        "Supervised the internal work of CSA and was responsible for new members recruitment",
        "Co-hosted and organized activities with the East Asian Studies Department of the college and maintain relations with the Chinese Consulate",
      ],
    },
  ],

  testimonials: [
    {
      photo: `${IMG}/vUiz4QowRLx4HmzsIBob6ukm58.jpg`,
      name: "Jiangning Lian",
      role: "UX Designer",
      quote:
        "Xuyuan is a passionate, driven UI/UX mentee who learns fast, embraces feedback, and delivers. Clear goals, strong follow-through, and great to work with.",
    },
    {
      photo: `${IMG}/fU24djX17gR5iKkcGEDHEQ74.jpg`,
      name: "Minna Wang",
      role: "Project Manager",
      quote:
        "Xuyuan has been reliable and resourceful, brings fresh perspectives and solid execution that strengthen our team’s UI/UX projects.",
    },
    {
      photo: `${IMG}/fwsL143Fl9SheXSyRjQJUgLHxr4.jpg`,
      name: "Yu-chi Chang",
      role: "Assistant Professor of History",
      quote:
        "Xuyuan has demonstrated a deep understanding and strong analytical ability in working with both textual and visual historical materials. He combined his skills in game design to beautifully complete his capstone project on a complex historical topic.",
    },
  ],

  habits: [
    {
      photo: `${IMG}/T5puQfALB4AjPr30dGWXFp42g.jpg`,
      label: "Photography",
      sub: "Film & Camera",
    },
    {
      photo: `${IMG}/NUBu4ucAEdyKOs1K3lT9PRplNgU.jpg`,
      label: "Art",
      sub: "Asian & Buddhism",
    },
    {
      photo: `${IMG}/xgRn6oH8Cm7lOIWuESdvZGN22KU.jpg`,
      label: "Martial Art",
      sub: "Aikido & Iaido & Kendo",
    },
    {
      photo: `${IMG}/yM6MYbR8k8DyGO8zuZZyf3jZ19E.jpg`,
      label: "Music",
      sub: "Jazz&Techno&City-pop",
    },
  ],
} as const;
