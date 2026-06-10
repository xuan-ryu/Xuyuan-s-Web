import { Fragment } from "react";
import type { Metadata } from "next";
import { about } from "@/data/about";
import { CtaBlock } from "@/components/cta-block";
import HongyadongScene from "@/components/hongyadong";
import KoiPondScene from "@/components/koi-pond";

export const metadata: Metadata = {
  title: "About",
  description: about.bio[0],
};

export default function About() {
  return (
    <>
      <HongyadongScene
        imageSrc="/media/hongyadong.png"
        profilePhoto=""
        eyebrow="Profile · 介绍"
        titleLine1="About"
        titleLine2="Me."
        titleZh="刘 栩源"
        subtitle={about.bio[0]}
        signatureNote={about.hometown}
        scrollDemo={0}
      />

      <section className="about-header">
        <div className="container">
          <p className="label" data-fade>
            About
          </p>
          <h1 data-fade>{about.heading}</h1>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="about-layout">
            <div className="about-text">
              {about.bio.map((p, i) => (
                <p key={i} data-fade>
                  {p}
                </p>
              ))}
              <blockquote className="about-quote" data-fade>
                <span className="zh">{about.koan.zh}</span>
                <span className="en">{about.koan.en}</span>
              </blockquote>
            </div>
            <div className="about-photo" data-fade>
              <span className="cover-label" style={{ position: "static" }}>
                Portrait
              </span>
            </div>
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
            {about.archetypes.map((a) => (
              <div key={a.title} className="archetype-cell" data-fade>
                <div className="archetype-icon">{a.icon}</div>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {about.essays.map((essay, idx) => (
        <Fragment key={essay.title}>
          <section className="section">
            <div className="container">
              <div className="section-intro" data-fade>
                <p className="label">{essay.title}</p>
              </div>
              <div className="about-text" style={{ maxWidth: 720 }}>
                {essay.body.map((p, i) => (
                  <p key={i} data-fade>
                    {p}
                  </p>
                ))}
                {"caption" in essay && essay.caption && (
                  <p className="label" style={{ marginTop: 16 }}>
                    {essay.caption}
                  </p>
                )}
              </div>
            </div>
          </section>
          {idx === 0 && (
            <section>
              <KoiPondScene
                eyebrow="INTERLUDE · INK ECOSYSTEM"
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

      <section className="section">
        <div className="container">
          <div className="section-intro" data-fade>
            <p className="label">Practice — 心・技・体</p>
            <h2>Dojos</h2>
          </div>
          <div>
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

      <section className="section">
        <div className="container">
          <div className="section-intro" data-fade>
            <p className="label">Activities & Leadership</p>
          </div>
          <div>
            {about.activities.map((a) => (
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
