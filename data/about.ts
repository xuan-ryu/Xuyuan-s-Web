// About-page content — the single source for /about copy. The narrative runs
// one spine: Chongqing (why people-tech friction matters) → CS→HCI (friction
// is not fate) → What AI Made Me Notice (lower crossing costs; structure over
// speed) → Before It Answers (qiàhǎo: judgment before generation) → How I
// Work (diagnose / prototype / structure + 心技体). Section order and media
// mapping still follow the live-site DOM (audit-screenshots/outline-about.txt);
// rendering contracts (pull-line = verbatim sentence of the essay's final
// paragraph, 恰好 brush block after shutter ¶3) live in app/about/page.tsx.


export const about = {
  heading: "About Me.",
  heroIntro:
    "I'm an AI product designer and design engineer. I care about the friction between people and technology — the kind that is hard to name but easy to feel — and I like turning it into problems that can be seen, tested, and solved.",
  hometown:
    "Chongqing, China — my hometown, a city where people live close and look out for one another.",
  koan: {
    zh: "好雪片々，不落别處",
    en: "Good snow, flake by flake, falls only here.",
    caption: "— Layman Pang, Blue Cliff Record, Case 42",
  },
  bio: [
    "Hi, I’m Xuyuan Liu, based in New York. I studied computer science as an undergraduate, then HCI at Cornell — not because I already saw myself becoming a product designer, just less and less satisfied with making technology merely run.",
    "I grew up in Chongqing. Life there is built on the relationships between people: everyone lives close, and noticing whether someone else is comfortable comes naturally. It took me a while to see that the same habit shapes how I look at technology.",
    "Computer science showed me what systems can do — and the distance between capability and experience. Plenty of software is powerful, yet leaves the people using it confused, frustrated, even wondering whether they are just not smart enough.",
    "I have never quite believed that this friction has to be accepted. What draws me to design is that it can rearrange the relationship between people and technology, and solve a real need in a way that works, feels natural, and is beautiful in its form.",
  ],
  resumeNote:
    "My Resume Tells You What I've Done. This Is How I Think While Building It.",

  whatChanged: {
    title: "What AI Made Me Notice",
    body: [
      "AI did not change why I design. It changed how far I can take it.",
      "In school I was told to be cautious with AI; almost overnight, real projects expected me to use it responsibly. I came to see that understanding the fundamentals and using AI were never an either-or choice.",
      "Computer science taught me the boundaries of systems; product and design taught me what people need. AI lets me move between the two faster, turning an idea I cannot quite say yet into something a team can examine together.",
      "It did not merge product, design, and engineering into one job, but it lowered the cost of crossing between them. Product can prototype earlier; design can carry an interaction into the real build; engineering can see concrete intent before the work starts.",
      "A page can look finished while my questions are not. Why is this state here? Will this component survive the next page? If someone else picks it up tomorrow, will they know what to do?",
      "Pulse made those questions concrete. Facing prototypes from different tools and different styles of code, the work was not to generate one more page — it was to settle them into shared tokens, components, states, and checks, so people and AI could keep building on the same ground.",
      "AI gives me more chances to try answers; it does not decide which answer is right. A good decision should not be remade from taste every time. The faster answers arrive, the more it matters to know what should hold, what can change, and where a person has to stop and judge.",
    ],
    // pull-line for the essay column: a verbatim sentence from the final
    // paragraph, lifted mid-column so the seven-paragraph read skims
    pull: "A good decision should not be remade from taste every time.",
    closing: "Fast Is Useful. Structure Is What Lets It Last.",
    // the tools wall, restored (owner 2026-07-07: the icons were good) —
    // now each carries a name for the hover slide-reveal; render treatment
    // (desaturated at rest, lit on hover) lives in the About page styles.
    tools: [
      { src: `/media/about/logos/logo-03.png`, name: "Figma" },
      { src: `/media/about/logos/logo-09.svg`, name: "Claude" },
      { src: `/media/about/logos/logo-11.png`, name: "Claude Code" },
      { src: `/media/about/logos/logo-08.webp`, name: "ChatGPT" },
      { src: `/media/about/logos/logo-10.png`, name: "n8n" },
      { src: `/media/about/logos/logo-19.webp`, name: "React" },
      { src: `/media/about/logos/logo-13.png`, name: "JavaScript" },
      { src: `/media/about/logos/logo-12.png`, name: "HTML5" },
      { src: `/media/about/logos/logo-14.png`, name: "CSS" },
      { src: `/media/about/logos/logo-15.png`, name: "Node.js" },
      { src: `/media/about/logos/logo-20.png`, name: "three.js" },
      { src: `/media/about/logos/logo-16.png`, name: "Python" },
      { src: `/media/about/logos/logo-17.svg`, name: "Java" },
      { src: `/media/about/logos/logo-18.png`, name: "C" },
      { src: `/media/about/logos/logo-07.png`, name: "Unity" },
      { src: `/media/about/logos/logo-06.png`, name: "Blender" },
      { src: `/media/about/logos/logo-02.png`, name: "Photoshop" },
      { src: `/media/about/logos/logo-04.png`, name: "Illustrator" },
      { src: `/media/about/logos/logo-05.png`, name: "Lightroom" },
      { src: `/media/about/logos/logo-01.svg`, name: "Canva" },
    ],
  },

  shutter: {
    title: "Before It Answers",
    body: [
      "I still like film, not because old tools are automatically better, but because film asks you to decide before the shutter closes. What belongs in the frame and what can be let go has to be clear before the result exists.",
      "For a photograph in the snow, I can prepare the camera, choose the composition, find the spot, and wait for the light. I cannot order the snow to fall. And when the moment does come, I still have to recognize it in time — and reach the place before the snow melts.",
      "My friends and I have a word for that kind of moment: 恰好, qiàhǎo. Not perfection, not everything pushed to its maximum — every condition that matters is present, and nothing pulls against the rest. Not a little less, not a little more. Right.",
      "Qiàhǎo has chance in it, but it cannot run on chance alone. Preparation does not guarantee the moment will come; it means that when it comes, you can see it, catch it, and know why the shutter should close now.",
      "Design works the same way. A clear need, enough taste, prototypes you can test, a stable design system, an implementation that can ship — these are conditions prepared in advance. AI lets me see more possibilities sooner, but more possibilities do not assemble themselves into the right answer.",
      "A hundred prototypes before lunch can be useful. I care more about what happens after lunch: whether one of them can hold real data, real users, and real responsibility. Generation can be fast. Judgment still has to happen before it answers.",
    ],
    video: `/media/about/kyoto-reel.mp4`,
    // first frame of the reel, extracted with ffmpeg — paints the figure
    // before the mp4 arrives (and under reduced motion / save-data)
    videoPoster: `/media/about/kyoto-reel-poster.jpg`,
    caption: "01/25/2023 Kinkakuji, Kyoto, Japan",
  },

  howIWork: {
    title: "How I Work",
    body: [
      "Thinking and making have never quite lived in separate rooms for me. If an idea cannot be built yet, I usually do not understand it yet. Making is not the execution that follows thought; it is where an idea starts showing its real shape.",
      "I work in three moves: diagnose, prototype, structure.",
      "Diagnose first. I look for where things are actually stuck: the unclear state, the awkward handoff, the step everyone works around but nobody names. What a request asks for on the surface is not always what matters; I care more about why it appeared, and who is carrying the friction.",
      "Then prototype. I like putting a working surface up early, because a team reacts more honestly to something real than to a perfect spec. While the direction is still cheap to change, mistakes should arrive as early as possible.",
      "Then structure. When a decision proves right, it should move into a component, a workflow, a design system, or a check — and stop depending on someone remembering it next time.",
      "There is a phrase from the dōjō — 心・技・体, mind, technique, body. Mind is understanding the problem and the people inside it. Technique is trained judgment, taste, and craft. Body is the decision entering real use, until it feels natural and reliable in someone's hands. Missing any one of them, the answer is not complete — and when a call turns out wrong, someone has to answer for it.",
      "I do not want AI to feel like a magic button pasted onto a page. I want it to feel like a good workspace: helping people explore more possibilities, shortening the distance between idea and implementation, and honest about where the final judgment still lives.",
    ],
    caption: "心・技・体 / mind, technique, body / Aikido · Kendo · Iaido",
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
      date: "Sep 2024 – Dec 2025",
      bullets: [
        "Ran the WeChat public account; its publications drew 300+ attendees per performance",
        "Designed the posters and promotional materials that carried each show's publicity",
      ],
    },
    {
      org: "Oberlin Chinese Student Association",
      role: "Chair",
      date: "Jan 2023 – May 2024",
      bullets: [
        "Oversaw CSA's internal operations and led the recruitment of new members",
        "Co-hosted events with the East Asian Studies department and maintained relations with the Chinese Consulate",
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
      sub: "Aikido & Kendo & Iaido",
    },
    {
      photo: `/media/about/habit-music.jpg`,
      label: "Music",
      sub: "Jazz & Techno & City-pop",
    },
  ],
} as const;
