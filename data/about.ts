// About-page content transcribed verbatim from the Framer export
// (export-.../about/index.html); section order and media mapping follow the
// live site DOM (audit-screenshots/outline-about.txt).


export const about = {
  heading: "About Me.",
  heroIntro:
    "I'm an AI design engineer who likes making messy ideas behave: interfaces, prototypes, design systems, and the rules that help teams keep building after the first demo.",
  hometown: "My Hometown, Chongqing, China, A City that Grounded With People.",
  koan: {
    zh: "好雪片々，不落别處",
    en: "Good snow, flake by flake, falls only here.",
    caption: "— Zen kōan on full presence",
  },
  bio: [
    "Hi, I’m Xuyuan Liu, an AI design engineer based in New York, by way of Cornell.",
    "My work sits between product, interface, and code. I still start from a human question, but more and more I find myself asking a systems question too: what should stay consistent after the first version works?",
  ],
  resumeNote:
    "My Resume Tells You What I've Done. This Is How I Think While Building It.",

  whatChanged: {
    title: "What AI Made Me Notice",
    body: [
      "At first, AI mostly felt like speed. A page could appear quickly. An interaction that was only a feeling in my head could become something I could click a few minutes later.",
      "That helped, especially when an idea was still fragile. But the more I used it, the less I was impressed by speed alone. The work came out fast, sometimes faster than I had time to understand it.",
      "A screen would look finished, but underneath it I would still have questions. Why is this state here? Can this component survive another page? If someone else picks it up tomorrow, will they know what to do?",
      "AI made me think harder about systems, frameworks, and design principles. What should be fixed before generation starts? What can stay open? What is a product rule, and what is only a nice-looking moment?",
      "Pulse made that question concrete. We had plenty of pages, made in different tools and different styles of code. They looked like the same product, but they did not share the same skeleton.",
      "So the work became less about making one more page and more about building the order underneath: tokens, components, state rules, handoff surfaces, checks, and the rules AI should read before it makes anything new.",
      "That is where design started to feel more serious to me. Not every decision should be remade from taste. Some things need principles: what can change, what should hold, where the machine can run, and where a person has to stop and judge.",
    ],
    closing: "Fast Is Useful. Structure Is What Lets It Last.",
    // 5x4 logo wall, row-major, as rendered on the live site at 1440w
    logos: [
      `/media/about/logos/logo-01.svg`,
      `/media/about/logos/logo-02.png`,
      `/media/about/logos/logo-03.png`,
      `/media/about/logos/logo-04.png`,
      `/media/about/logos/logo-05.png`,
      `/media/about/logos/logo-06.png`,
      `/media/about/logos/logo-07.png`,
      `/media/about/logos/logo-08.webp`,
      `/media/about/logos/logo-09.svg`,
      `/media/about/logos/logo-10.png`,
      `/media/about/logos/logo-11.png`,
      `/media/about/logos/logo-12.png`,
      `/media/about/logos/logo-13.png`,
      `/media/about/logos/logo-14.png`,
      `/media/about/logos/logo-15.png`,
      `/media/about/logos/logo-16.png`,
      `/media/about/logos/logo-17.svg`,
      `/media/about/logos/logo-18.png`,
      `/media/about/logos/logo-19.webp`,
      `/media/about/logos/logo-20.png`,
    ],
  },

  shutter: {
    title: "Before It Answers",
    body: [
      "I still like film, not because old tools are automatically better, but because film asks you to decide before the shutter closes.",
      "That habit has followed me into AI work. Before the system answers, I want to know what it is answering for, what it is allowed to assume, and who gets to say whether the result is right.",
      "My friends and I have a \"Zen\" phrase for the kind of moment we're after: 恰好, QiaHao. Not perfect; not excessive; right.",
      "I want AI products to have that same feeling. Enough help to move the work forward. Enough structure to keep the person in charge.",
      "A hundred prototypes before lunch can be useful. I care more about what happens after lunch: whether one of them can hold real data, real users, and real responsibility.",
    ],
    video: `/media/about/kyoto-reel.mp4`,
    caption: "01/25/2023 Kinkakuji, Kyoto, Japan",
  },

  howIWork: {
    title: "How I Work",
    body: [
      "Thinking and making have never quite lived in separate rooms for me. If an idea cannot be made, I usually do not understand it yet. Building is where the thought starts telling the truth.",
      "I usually move in three steps. First, diagnose what is actually stuck: the unclear state, the awkward handoff, the step everyone works around but nobody names.",
      "Then I prototype. A working surface gives a team something to react to while the direction is still cheap to change.",
      "Then I structure what worked. If a decision is good, I do not want it to depend on me remembering it next time. It should become a token, a component, a workflow, a check, or a rule the AI reads before it starts.",
      "There's a phrase from the dōjō — 心・技・体, mind, technique, body. I understand it very practically. Under pressure, taste is not enough. You need patterns your hands can repeat and responsibility when a call was wrong.",
      "That is why I like this direction. AI rewards people who can move between ambiguity and implementation: read the product, shape the interaction, write the front end, inspect the output, then turn the lesson into a system.",
      "I do not want AI to feel like a magic button pasted onto a page. I want it to feel like a good workspace: helpful, clear, and honest about where the human decision lives.",
    ],
    caption: "心・技・体 / mind, skill, body / Aikido · Kendo · Iaido",
  },

  // staggered photo wall; positions are live-measured offsets at 1440w
  // (x relative to a 1420px-wide stage, y relative to the wall top)
  dojoWall: [
    { src: `/media/about/dojo-wall-1.jpg`, x: 0, y: 0, h: 433 },
    { src: `/media/about/dojo-wall-2-oberlin.jpg`, x: 178, y: 0, h: 254, caption: "Oberlin Aikikai, OH, 2022" },
    { src: `/media/about/dojo-wall-3-ikazuchi.jpg`, x: 356, y: 139, h: 130, caption: "Ikazuchi Dojo, CA, 2023" },
    { src: `/media/about/dojo-wall-4.jpg`, x: 534, y: 156, h: 277 },
    { src: `/media/about/dojo-wall-5-chongqing.jpg`, x: 712, y: 29, h: 333, caption: "Chongqing JiangBei Kendo Dojo, China, 2024" },
    { src: `/media/about/dojo-wall-6.jpg`, x: 890, y: 213, h: 221 },
    { src: `/media/about/dojo-wall-7.jpg`, x: 1068, y: 0, h: 433 },
    { src: `/media/about/dojo-wall-8-kyoto.jpg`, x: 1246, y: 99, h: 195, caption: "Kyoto Hokenkai, Japan, 2024" },
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
      org: "Oberlin Chinese Student Association",
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
      photo: `/media/about/testimonial-jiangning.jpg`,
      name: "Jiangning Lian",
      role: "UX Designer",
      quote:
        "Xuyuan is a passionate, driven UI/UX mentee who learns fast, embraces feedback, and delivers. Clear goals, strong follow-through, and great to work with.",
    },
    {
      photo: `/media/about/testimonial-minna.jpg`,
      name: "Minna Wang",
      role: "Project Manager",
      quote:
        "Xuyuan has been reliable and resourceful, brings fresh perspectives and solid execution that strengthen our team’s UI/UX projects.",
    },
    {
      photo: `/media/about/testimonial-yuchi.jpg`,
      name: "Yu-chi Chang",
      role: "Assistant Professor of History",
      quote:
        "Xuyuan has demonstrated a deep understanding and strong analytical ability in working with both textual and visual historical materials. He combined his skills in game design to beautifully complete his capstone project on a complex historical topic.",
    },
  ],

  habits: [
    {
      photo: `/media/about/habit-photography.jpg`,
      label: "Photography",
      sub: "Film & Camera",
    },
    {
      photo: `/media/about/habit-art.jpg`,
      label: "Art",
      sub: "Asian & Buddhism",
    },
    {
      photo: `/media/about/habit-martial-art.jpg`,
      label: "Martial Art",
      sub: "Aikido & Iaido & Kendo",
    },
    {
      photo: `/media/about/habit-music.jpg`,
      label: "Music",
      sub: "Jazz&Techno&City-pop",
    },
  ],
} as const;
