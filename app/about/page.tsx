import { Fragment } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { about } from "@/data/about";
import { CtaBlock } from "@/components/cta-block";
import HongyadongScene from "@/components/hongyadong";
import KoiPondScene from "@/components/koi-pond";

const BIO = [
  "Hi, I'm Xuyuan Liu, a product designer and creative developer based in New York, by way of Cornell.",
  "My work sits between product, humanities, and code. Sometimes it starts as research, sometimes as an interface, and sometimes as a prototype that becomes the research itself.",
  "Most of what I make returns to one small question: what would this be like if it were actually good?",
  "My resume tells you what I've done. This is what's in my head while I'm doing it.",
] as const;

const KOAN = {
  zh: "好雪片々，不落别处",
  en: "Good snow, flake by flake, falls only here.",
  caption: "Zen koan on full presence",
} as const;

const ARCHETYPES = [
  {
    index: "01",
    title: "Firefighter",
    body: "I move fast when it matters. When projects hit turbulence, I find clarity under pressure, turning constraint into creative momentum.",
  },
  {
    index: "02",
    title: "Owl",
    body: "I observe before I act. Deep research and careful synthesis are my foundation. I question surface assumptions and ask what nobody thought to ask.",
  },
  {
    index: "03",
    title: "Tree",
    body: "I build for the long run. Strong roots in research and relationships, adaptable above ground, growing in whichever direction the work needs.",
  },
] as const;

const ESSAYS = [
  {
    title: "What Changed",
    body: [
      "These days, I'm watching two things happen at once.",
      "Technology is becoming genuinely more open. Tools are cheaper, faster, and kinder to beginners than they have ever been. More people can now make, write, design, build, and say what they mean in forms that used to require entire teams or years of training.",
      "At the same time, that openness is reshaping the world I was trained to enter. The research habits, the design craft, the code I taught myself after midnight, none of that disappears. But it is being asked to do new work, in new shapes, at a different speed.",
      "I don't think the honest response is nostalgia. I also don't think it is blind excitement. The harder thing is to keep moving without becoming careless, to use new tools without forgetting what craft was trying to teach me.",
      "I learned a lot. The era keeps moving. So do I.",
    ],
  },
  {
    title: "Before the Shutter Closes",
    body: [
      "The feeling is close to what those darkroom photographers must have had when the first digital cameras hit the shelves. Glad, of course, the craft was reaching more hands. But quieter than glad, somewhere underneath.",
      "You can spend forty years over a tray of developer, learning by feel alone when a print has been in the bath long enough, and then one morning that knowledge has nowhere left to go.",
      "I shoot a little myself. Digital generation, obviously. But I'd rather come home with thirty frames I actually remember taking than two thousand I'll be meeting for the first time in Lightroom.",
      "So I keep going back to film. Film makes you decide what the photograph is before the shutter closes: no preview, no second take, just whether you read the light correctly the first time.",
      "My friends and I have a Zen phrase for the kind of moment we're after: 恰好, QiaHao. Not perfect; not excessive; right. The light isn't flawless but it's enough.",
      "That's what I still trust about the older tools. Not slowness as virtue, but the way the constraint sharpens what you pay attention to.",
    ],
    caption: "01/25/2023 / Kinkakuji, Kyoto, Japan",
  },
  {
    title: "How I Work",
    body: [
      "Thinking and making have never quite lived in separate rooms for me. Research starts to matter only when it changes the shape of the thing.",
      "A sketch turns out to be less an idea presented than an idea tested. Sometimes the test is what tells me the idea wasn't any good to begin with.",
      "A prototype that works isn't a demo bolted on at the end of the thinking; it's where the thinking finally gets caught in the act.",
      "There's a phrase from the dojo: 心・技・体, mind, technique, body. The intuition it points to, that surfaces under pressure in both design and budo, isn't mystical.",
      "It's what's left after years of designs that failed for reasons I couldn't yet see, and after a sensei broke and rebuilt my technique with a bokken that didn't care how I felt about it.",
      "The best interfaces I've used have that quality: they don't announce themselves, they just arrive where your thought was already going.",
    ],
    caption: "心・技・体 / mind, skill, body / Aikido / Kendo / Iaido",
  },
] as const;

const ACTIVITIES = [
  {
    date: "2024 / 2025",
    title: "Cornell Chinese Drama Club",
    org: "Publicity Department Chair",
    desc: "Operated the WeChat public account, published performance announcements for an audience of 300+ users, and developed promotional materials including posters and event advertising.",
  },
] as const;

export const metadata: Metadata = {
  title: "About",
  description: BIO[0],
};

export default function About() {
  return (
    <>
      <HongyadongScene
        imageSrc="/media/hongyadong.png"
        profilePhoto=""
        eyebrow="Profile"
        titleLine1="About"
        titleLine2="Me."
        titleZh=""
        subtitle={about.heroIntro}
        signatureNote={about.hometown}
        scrollDemo={0}
      />

      <section className="about-header">
        <div className="container about-layout">
          <div className="about-photo" data-fade>
            <Image
              src="/assets/framerusercontent.com/images/z70LgB4OGJnzvGEUcfqCtULg4.jpg"
              alt="Xuyuan Liu in a meeting"
              fill
              sizes="(max-width: 809px) 350px, 306px"
            />
          </div>

          <div className="about-quote-wrap">
            <blockquote className="about-quote" data-fade>
              <span className="zh">{KOAN.zh}</span>
              <span className="en">{KOAN.en}</span>
              <cite>{KOAN.caption}</cite>
            </blockquote>
          </div>

          <div className="about-text about-bio">
            {BIO.slice(0, 2).map((p) => (
              <p key={p} data-fade>
                {p}
              </p>
            ))}
          </div>

          <div className="about-divider" aria-hidden="true" />

          <div className="about-resume-note" data-fade>
            <h2>{BIO.slice(2).join(" ")}</h2>
            <a
              className="about-resume-link"
              href="/assets/framerusercontent.com/assets/VXxmU8xrCkbdBVKix29pBF2kVeY.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Resume
            </a>
          </div>
        </div>
      </section>

      <section className="section archetypes-section">
        <div className="container">
          <div className="section-intro" data-fade>
            <p className="label">Value archetypes</p>
            <h2>How I show up</h2>
          </div>
          <div className="grid-divider archetypes-grid">
            {ARCHETYPES.map((a) => (
              <div key={a.title} className="archetype-cell" data-fade>
                <div className="archetype-icon">{a.index}</div>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {ESSAYS.map((essay, idx) => (
        <Fragment key={essay.title}>
          <section className="section about-essay">
            <div className="container">
              <div className="section-intro" data-fade>
                <h2>{essay.title}</h2>
              </div>
              <div className="about-text">
                {essay.body.map((p, i) => (
                  <p key={i} data-fade>
                    {p}
                  </p>
                ))}
                {"caption" in essay && essay.caption ? (
                  <p className="about-caption" data-fade>
                    {essay.caption}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
          {idx === 0 && (
            <section>
              <KoiPondScene
                eyebrow="INTERLUDE / INK ECOSYSTEM"
                titleMain="A small pond"
                titleSub="for the wandering eye"
                tag="MOVE THE CURSOR. FEED THE FISH."
                feedText="Why not feed the fish?"
                showScrollTip={false}
                introDurationMs={800}
                heroBoxXvw={50}
              />
            </section>
          )}
        </Fragment>
      ))}

      <section className="section about-timeline-section">
        <div className="container">
          <div className="section-intro" data-fade>
            <p className="label">Practice / mind, technique, body</p>
            <h2>Dojos</h2>
          </div>
          <div className="timeline-list">
            {about.dojos.map((d) => (
              <div key={d.title} className="timeline-item" data-fade>
                <div className="timeline-date">{d.date}</div>
                <div>
                  <div className="timeline-title">{d.title}</div>
                  <div className="timeline-org">{d.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-timeline-section">
        <div className="container">
          <div className="section-intro" data-fade>
            <p className="label">Activities & Leadership</p>
          </div>
          <div className="timeline-list">
            {ACTIVITIES.map((a) => (
              <div key={a.title} className="timeline-item" data-fade>
                <div className="timeline-date">{a.date}</div>
                <div>
                  <div className="timeline-title">{a.title}</div>
                  <div className="timeline-org">{a.org}</div>
                  <p className="timeline-desc">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
