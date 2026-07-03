import type { Metadata } from "next";
import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { about } from "@/data/about";
import { site } from "@/data/site";
import { Cta } from "@/components/ui/cta";
import { OffscreenVideo } from "@/components/ui/offscreen-video";
import HongyadongScene from "@/components/hongyadong";

export const metadata: Metadata = {
  title: "About",
  description: about.heroIntro,
};

const SEAL = "/assets/framerusercontent.com/images/ntwL7wUkSslvYCLMnzXaIuQu8zU.png";

// 心・技・体 hanging-scroll column + gloss, derived from the existing
// data/about.ts caption string ("心・技・体 / mind, skill, body / Aikido ·
// Kendo · Iaido"). Copy edits to data/*.ts are deferred, so the page
// render-filters the shipped string: the characters become the vertical
// column, the rest becomes its gold gloss, and the old duplicate caption
// paragraph is no longer rendered.
const [dojoZh, ...dojoGlossParts] = about.howIWork.caption.split(" / ");

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

      {/* ── Frame 00 — intro: portrait, koan, bio, resume ── */}
      <section className="about-header">
        <div className="container about-layout">
          <div className="abf-portrait" data-fade>
            <div className="about-photo">
              <Image
                src="/assets/framerusercontent.com/images/z70LgB4OGJnzvGEUcfqCtULg4.jpg"
                alt="Xuyuan Liu in a meeting"
                fill
                sizes="(max-width: 809px) 350px, 306px"
              />
            </div>
          </div>

          <div className="about-quote-wrap">
            <blockquote className="about-quote" data-fade>
              <span className="zh">{about.koan.zh}</span>
              <span className="en">{about.koan.en}</span>
              <cite>{about.koan.caption}</cite>
            </blockquote>
          </div>

          <div className="about-text about-bio">
            {about.bio.map((p) => (
              <p key={p} data-fade>{p}</p>
            ))}
          </div>

          <div className="about-divider" aria-hidden="true" />

          <div className="about-resume-note" data-fade>
            <h2>{about.resumeNote}</h2>
            <Cta
              variant="solid"
              href={site.resumeUrl}
              target="_blank"
              rel="noreferrer"
              prefetch={false}
            >
              Resume
            </Cta>
          </div>
        </div>
      </section>

      {/* ── Frame 01 — What Changed + toolbox index + sealed poster line ── */}
      <section className="section about-essay about-essay-right abf-pad">
        <div className="container">
          <div className="section-intro" data-fade>
            <h2 className="abf-t">{about.whatChanged.title}</h2>
          </div>
          <div className="about-text about-essay-text">
            {about.whatChanged.body.map((p, i) => (
              <p key={i} data-fade>{p}</p>
            ))}
          </div>

          <div className="abf-tool-index" data-fade>
            <div className="abf-toolbox">
              <div className="abf-tools-head">
                <span>Tools in rotation</span>
                <span>{about.whatChanged.logos.length}</span>
              </div>
              <div className="about-logo-wall abf-tools">
                {about.whatChanged.logos.map((src, i) => (
                  <span
                    key={src}
                    className="about-logo-cell"
                    style={{ "--tool-index": i } as CSSProperties}
                  >
                    <Image src={src} alt="" fill sizes="72px" />
                  </span>
                ))}
              </div>
            </div>

            <div className="abf-tool-story">
              <p className="abf-poster">
                {about.whatChanged.closing}
                <Image
                  src={SEAL}
                  alt=""
                  width={28}
                  height={55}
                  className="abf-poster-seal"
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="about-page-turn">
        {/* ── Frame 02 — Before the Shutter Closes + 恰好 + Kyoto reel ── */}
        <section className="section about-essay about-shutter abf-shutter">
          <div className="container">
            <div className="about-shutter-grid">
              <div>
                <div className="section-intro" data-fade>
                  <h2 className="abf-t">{about.shutter.title}</h2>
                </div>
                <div className="about-text about-essay-text">
                  {about.shutter.body.map((p, i) => (
                    <Fragment key={i}>
                      <p data-fade>{p}</p>
                      {i === 2 ? (
                        <span className="abf-qiahao" data-fade>
                          <span className="abf-qiahao-zh" aria-hidden="true">
                            恰好
                          </span>
                          <span className="abf-qiahao-gloss">
                            qiàhǎo — not perfect; right
                          </span>
                        </span>
                      ) : null}
                    </Fragment>
                  ))}
                </div>
              </div>
              <figure className="about-kyoto" data-fade>
                <OffscreenVideo src={about.shutter.video} />
                <figcaption>{about.shutter.caption}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <div className="about-dark-turn">
          {/* ── Frame 03 — How I Work: ink band, hanging scroll, dojo wall ── */}
          <section className="section about-dark abf-dark">
            <div className="container">
              <div className="about-howiwork">
                <div className="section-intro" data-fade>
                  <h2 className="abf-t">{about.howIWork.title}</h2>
                </div>
                <div className="abf-scroll" data-fade>
                  <span className="abf-scroll-zh" aria-hidden="true">
                    {dojoZh}
                  </span>
                  <span className="abf-scroll-gloss">
                    {dojoGlossParts.map((part) => (
                      <span key={part} className="abf-scroll-gloss-line">
                        {part}
                      </span>
                    ))}
                  </span>
                </div>
                <div className="about-text about-essay-text">
                  {about.howIWork.body.map((p, i) => (
                    <p key={i} data-fade>{p}</p>
                  ))}
                </div>
              </div>

              <div className="about-dojo-wall" data-fade>
                {about.dojoWall.map((photo) => (
                  <figure
                    key={photo.src}
                    className="about-dojo-item"
                    style={{
                      left: `${(photo.x / 1420) * 100}%`,
                      top: photo.y,
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt=""
                      width={154}
                      height={photo.h}
                      sizes="154px"
                      style={{ height: photo.h }}
                    />
                    {"caption" in photo && photo.caption ? (
                      <figcaption>{photo.caption}</figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* ── Rebate — vita timeline ── */}
          <section className="section about-activities abf-vita-sec">
            <div className="container">
              <h2 className="about-activities-title abf-t" data-fade>
                Activities &amp; Leadership
              </h2>
              <div className="abf-vita">
                {about.activities.map((a) => (
                  <article key={a.org + a.role} className="abf-vita-entry" data-fade>
                    <h3>{a.org}</h3>
                    <p className="abf-vita-role">{a.role}</p>
                    <p className="abf-vita-date">{a.date}</p>
                    <ul>
                      {a.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Rebate — voices ── */}
      <section className="section about-testimonials abf-voices">
        <div className="abf-vshell">
          <div className="abf-vhead" data-fade>
            <h2 className="abf-t">Voices</h2>
          </div>
          <div className="abf-rule" aria-hidden="true" />
        </div>
        <div className="container about-testimonial-grid">
          {about.testimonials.map((t) => (
            <figure key={t.name} className="about-testimonial" data-fade>
              <span className="about-testimonial-photo">
                <Image src={t.photo} alt={t.name} fill sizes="369px" />
              </span>
              <figcaption>
                <h3>{t.name}</h3>
                <p className="about-testimonial-role abf-role">{t.role}</p>
                <blockquote>{t.quote}</blockquote>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Rebate — habits contact strip ── */}
      <section className="section about-habits abf-habits">
        <div className="container">
          <h2 className="about-habits-title abf-t" data-fade>
            My Habits
          </h2>
          <div className="abf-rule" aria-hidden="true" />
          <div className="about-habits-grid">
            {about.habits.map((h, i) => (
              <figure key={h.label} className="about-habit" data-fade>
                <span className="about-habit-photo">
                  <Image src={h.photo} alt={h.label} fill sizes="240px" />
                </span>
                <figcaption>
                  <p className="abf-fr">FR. {String(i + 1).padStart(2, "0")}</p>
                  <p className="about-habit-label">{h.label}</p>
                  <p className="about-habit-sub">{h.sub}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      {/* ── "one roll of film" pass (.abf-) — page-owned styles ──
          globals.css .about-* rules keep styling the unchanged markup;
          everything new or overridden lives here under the abf prefix. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* ─ condensed family voice for the display titles; gold = static detail ─ */
.about-essay .section-intro h2.abf-t,
.about-dark .section-intro h2.abf-t,
h2.about-activities-title.abf-t,
h2.about-habits-title.abf-t,
.abf-vhead h2.abf-t {
  margin: 0;
  border-left: 4px solid var(--accent-gold);
  border-right: 0;
  padding-left: clamp(14px, 1.5vw, 22px);
  padding-right: 0;
  font-family: var(--font-condensed);
  font-size: var(--text-display-3);
  font-weight: 300;
  line-height: 1.02;
  letter-spacing: var(--track-display);
  text-transform: uppercase;
  text-align: left;
}
.abf-vhead h2.abf-t {
  color: var(--ink-950);
}

/* ─ frame 00: portrait + rebate caption ─ */
.abf-portrait {
  grid-column: 1 / span 3;
  grid-row: 1 / span 2;
  justify-self: start;
  width: 100%;
  max-width: 328px;
}
.abf-portrait .about-photo {
  width: 100%;
  max-width: none;
  /* legacy tablet/phone rules zero the photo (aspect-ratio: auto + height
     auto) — pin the negative's intrinsic ratio at every width */
  aspect-ratio: 2075 / 3130;
  height: auto;
}
/* ─ pacing: standard paper padding; the post-poster void collapses ─ */
.about-essay.abf-pad {
  padding: clamp(96px, 10vw, 144px) 0;
}
.about-shutter.abf-shutter {
  padding-top: 0;
  padding-bottom: clamp(128px, 13vw, 196px);
}
.about-activities.abf-vita-sec {
  padding: clamp(96px, 10vw, 144px) 0;
}
.about-testimonials.abf-voices {
  padding-top: clamp(96px, 10vw, 144px);
}
.about-habits.abf-habits {
  padding-top: clamp(96px, 10vw, 144px);
}

.about-page-turn {
  position: relative;
  isolation: isolate;
  background: var(--paper);
}
.about-page-turn::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 100svh;
  background: var(--paper);
  pointer-events: none;
  z-index: 0;
}
.about-shutter.abf-shutter {
  position: sticky;
  top: 0;
  z-index: 1;
  min-height: 100svh;
  display: flex;
  align-items: center;
  background: var(--paper);
}
.about-shutter.abf-shutter > .container {
  width: 100%;
}
.about-dark-turn {
  position: relative;
  z-index: 2;
  background: var(--ink-950);
  isolation: isolate;
}
.about-dark.abf-dark {
  position: relative;
  z-index: 1;
  margin-top: 0;
  min-height: 100svh;
  border-radius: clamp(30px, 5vw, 64px) clamp(30px, 5vw, 64px) 0 0;
  box-shadow: 0 -44px 90px rgba(5, 5, 5, 0.24);
  overflow: clip;
}
.about-dark.abf-dark::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: clamp(72px, 8vw, 132px);
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0)
  );
}
.about-activities.abf-vita-sec {
  position: sticky;
  top: 0;
  z-index: 2;
  min-height: 100svh;
  margin-top: 0;
  padding-top: clamp(76px, 8.5vw, 124px);
  border-radius: clamp(30px, 5vw, 64px) clamp(30px, 5vw, 64px) 0 0;
  background: var(--paper);
  box-shadow: 0 -44px 90px rgba(5, 5, 5, 0.18);
  overflow: clip;
}
.about-activities.abf-vita-sec::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: clamp(72px, 8vw, 132px);
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.98),
    rgba(255, 255, 255, 0)
  );
}
.about-activities.abf-vita-sec [data-fade] {
  opacity: 1;
  transform: none;
  filter: none;
  animation: none;
}

/* ─ toolbox index + poster line: one workbench block ─ */
.abf-tool-index {
  grid-column: 2 / span 10;
  min-width: 0;
  margin-top: clamp(30px, 4vw, 56px);
  padding-top: clamp(18px, 2vw, 28px);
  border-top: 1px solid var(--rule);
}
.abf-tool-index[data-fade] {
  transform: translateY(30px);
  filter: none;
}
.abf-tool-index[data-fade].is-visible {
  animation: abfToolSectionIn 0.95s var(--ease-reveal) forwards;
  filter: none;
}
.abf-toolbox {
  min-width: 0;
}
.abf-tools-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-6);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-eyebrow);
  text-transform: uppercase;
  color: var(--stone);
  opacity: 0;
  transform: translateY(10px);
}
.abf-tool-index.is-visible .abf-tools-head {
  animation: abfToolMetaIn 0.7s var(--ease-reveal) 0.08s forwards;
}
.about-logo-wall.abf-tools {
  margin: clamp(28px, 4vw, 46px) 0 0;
  padding-top: 0;
  border-top: 0;
  max-width: none;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  justify-content: stretch;
  justify-items: center;
  gap: clamp(18px, 2.2vw, 32px) clamp(18px, 2.4vw, 36px);
}
.abf-tools .about-logo-cell {
  width: 100%;
  max-width: 72px;
  opacity: 0;
  transform: translateY(18px) scale(0.96);
  transform-origin: 50% 70%;
  will-change: transform, opacity;
}
.abf-tool-index.is-visible .about-logo-cell {
  animation: abfToolLogoIn 0.72s var(--ease-silk) forwards;
  animation-delay: calc(0.14s + (var(--tool-index) * 34ms));
}
.abf-tools .about-logo-cell img {
  filter: grayscale(1);
  opacity: 0.72;
  transition:
    filter var(--dur-base) var(--ease-silk),
    opacity var(--dur-base) var(--ease-silk);
}
.abf-tools .about-logo-cell:hover img,
.abf-tools .about-logo-cell:focus-visible img {
  filter: grayscale(0);
  opacity: 1;
}

/* ─ sealed poster line — belongs to the toolbox block ─ */
.abf-tool-story {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  column-gap: clamp(24px, 5vw, 72px);
  margin-top: clamp(38px, 6vw, 76px);
  padding-top: clamp(24px, 3vw, 42px);
  border-top: 1px solid rgba(17, 17, 17, 0.12);
}
.abf-poster {
  grid-column: 1;
  max-width: 980px;
  margin: 0;
  font-family: var(--font-condensed);
  font-size: clamp(42px, 5.6vw, 74px);
  font-weight: 300;
  line-height: 1.04;
  letter-spacing: var(--track-display);
  text-transform: uppercase;
  text-align: left;
  color: var(--ink-950);
  opacity: 0;
  transform: translateY(24px);
}
.abf-tool-index.is-visible .abf-poster {
  animation: abfToolPosterIn 0.95s var(--ease-reveal) 0.46s forwards;
}
.abf-poster-seal {
  display: inline-block;
  width: 28px;
  height: auto;
  margin-left: var(--space-4);
  transform: translateY(0.08em);
}

@keyframes abfToolSectionIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
    filter: none;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: none;
  }
}
@keyframes abfToolMetaIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes abfToolLogoIn {
  0% {
    opacity: 0;
    transform: translateY(18px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes abfToolPosterIn {
  0% {
    opacity: 0;
    transform: translateY(24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ─ 恰好 brush moment inside essay 02 ─ */
.abf-qiahao {
  display: block;
  margin: var(--space-8) 0;
}
.abf-qiahao-zh {
  display: block;
  font-family: "CloudXingCaoGBK", var(--font-brush);
  font-size: clamp(56px, 6vw, 84px);
  line-height: 1.05;
  color: var(--ink-950);
}
.abf-qiahao-gloss {
  display: block;
  margin-top: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.08em;
  color: var(--stone);
}

/* ─ 心・技・体 hanging scroll in the ink band's left rail ─ */
.abf-dark .about-howiwork .section-intro {
  grid-row: 1;
}
.abf-dark .about-howiwork .about-essay-text {
  grid-row: 1 / span 2;
}
.abf-scroll {
  grid-column: 2 / span 2;
  grid-row: 2;
  align-self: start;
  justify-self: start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-7);
}
.abf-scroll-zh {
  writing-mode: vertical-rl;
  font-family: "CloudXingCaoGBK", var(--font-brush);
  font-size: clamp(40px, 4vw, 56px);
  line-height: 1;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.88);
  text-shadow: 0 0 18px rgba(255, 255, 255, 0.08);
}
.abf-scroll-gloss {
  max-width: 24ch;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-eyebrow);
  text-transform: uppercase;
  line-height: 1.7;
  color: var(--accent-gold);
}
.abf-scroll-gloss-line {
  display: block;
}

/* the stacked shutter column lost the intro's air in the grid pass */
.about-shutter.abf-shutter .section-intro {
  margin: 0 0 clamp(28px, 3.2vw, 48px);
}

/* ─ dojo captions: wrap, max two lines ─ */
.abf-dark .about-dojo-wall {
  width: 100%;
  max-width: min(1360px, 100%);
  height: clamp(560px, 38vw, 660px);
  margin-left: auto;
  margin-right: auto;
}
.abf-dark .about-dojo-item {
  width: clamp(112px, 9.2vw, 142px);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.035);
  box-shadow: 0 18px 54px rgba(0, 0, 0, 0.22);
}
.abf-dark .about-dojo-item:nth-child(1) {
  left: 0% !important;
  top: 88px !important;
  z-index: 1;
}
.abf-dark .about-dojo-item:nth-child(2) {
  left: 14% !important;
  top: 0 !important;
  z-index: 2;
}
.abf-dark .about-dojo-item:nth-child(3) {
  left: 28% !important;
  top: 270px !important;
  z-index: 3;
}
.abf-dark .about-dojo-item:nth-child(4) {
  left: 41.5% !important;
  top: 138px !important;
  z-index: 2;
}
.abf-dark .about-dojo-item:nth-child(5) {
  left: 55% !important;
  top: 44px !important;
  z-index: 4;
}
.abf-dark .about-dojo-item:nth-child(6) {
  left: 66.4% !important;
  top: 330px !important;
  z-index: 3;
}
.abf-dark .about-dojo-item:nth-child(7) {
  left: 77.5% !important;
  top: 0 !important;
  z-index: 2;
}
.abf-dark .about-dojo-item:nth-child(8) {
  left: 89.2% !important;
  top: 264px !important;
  z-index: 4;
}
.abf-dark .about-dojo-item figcaption {
  position: absolute;
  right: 10px;
  bottom: 10px;
  left: 10px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  white-space: normal;
  margin: 0;
  font-size: clamp(12px, 0.86vw, 16px);
  line-height: 1.22;
  color: rgba(255, 255, 255, 0.88);
  text-shadow: 0 1px 16px rgba(0, 0, 0, 0.72);
}

/* ─ vita timeline ─ */
.abf-vita {
  grid-column: 6 / span 6;
  min-width: 0;
  border-left: 1px solid var(--rule);
}
.abf-vita-entry {
  position: relative;
  padding-left: var(--space-7);
}
.abf-vita-entry + .abf-vita-entry {
  margin-top: clamp(44px, 5vw, 72px);
}
.abf-vita-entry::before {
  content: "";
  position: absolute;
  left: -3.5px;
  top: 0.65em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-gold);
}
.abf-vita-entry h3 {
  margin: 0 0 var(--space-2);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.22;
}
.abf-vita-role {
  margin: 0;
  font-size: var(--text-meta);
  line-height: 1.5;
  color: rgba(10, 10, 10, 0.62);
}
.abf-vita-date {
  margin: var(--space-1) 0 var(--space-4);
  font-size: var(--text-meta);
  color: var(--accent-gold);
}
.abf-vita ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.abf-vita li {
  position: relative;
  max-width: 66ch;
  padding-left: 18px;
  font-size: var(--text-body);
  line-height: 1.58;
  color: rgba(10, 10, 10, 0.74);
}
.abf-vita li + li {
  margin-top: var(--space-2);
}
.abf-vita li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.62em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-gold);
}

/* ─ voices head + demoted roles ─ */
.abf-vshell {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--about-shell);
  margin: 0 auto clamp(40px, 5vw, 78px);
  padding: 0 var(--about-gutter);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--about-gap);
  row-gap: clamp(40px, 5vw, 78px);
}
.abf-vhead {
  grid-column: 1 / span 5;
}
.abf-rule {
  grid-column: 1 / -1;
  height: 1px;
  background: var(--rule);
}
.about-testimonial-role.abf-role {
  font-size: var(--text-label);
  letter-spacing: var(--track-caps);
  text-transform: uppercase;
  color: var(--stone);
}

/* ─ habits contact strip ─ */
.abf-fr {
  margin: 0 0 var(--space-1);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-eyebrow);
  color: var(--accent-gold);
}
.abf-habits .about-habit-photo {
  border-radius: var(--radius-thumb);
}
.abf-habits .about-habit-photo img {
  transition: transform var(--dur-base) var(--ease-silk);
}
.abf-habits .about-habit:hover .about-habit-photo img {
  transform: scale(1.02);
}

/* ─ tablet (810–1079.98): stack, drop the vertical scroll writing ─ */
@media (max-width: 1079.98px) {
  .about-shutter.abf-shutter {
    position: relative;
    min-height: auto;
    display: block;
  }
  .about-dark.abf-dark {
    position: relative;
    top: auto;
    margin-top: clamp(-56px, -8vw, -28px);
  }
  .about-activities.abf-vita-sec {
    min-height: auto;
    margin-top: 0;
    padding-top: clamp(88px, 12vw, 124px);
    border-radius: clamp(24px, 7vw, 44px) clamp(24px, 7vw, 44px) 0 0;
  }
  .abf-dark .about-dojo-wall {
    position: static;
    height: auto;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
    max-width: none;
  }
  .abf-dark .about-dojo-item {
    position: static;
    width: 100%;
  }
  .abf-dark .about-dojo-item img {
    width: 100%;
    height: auto !important;
  }
  .abf-tool-index {
    grid-column: 1 / -1;
  }
  .abf-tool-story {
    grid-template-columns: 1fr;
  }
  .abf-vhead {
    grid-column: 1 / span 4;
  }
  .abf-vita {
    grid-column: 4 / span 5;
  }
  .abf-dark .about-howiwork .section-intro,
  .abf-dark .about-howiwork .about-essay-text {
    grid-row: auto;
  }
  .abf-scroll {
    grid-column: 1 / -1;
    grid-row: auto;
    flex-direction: row;
    align-items: baseline;
    flex-wrap: wrap;
    gap: var(--space-5);
  }
  .abf-scroll-zh {
    writing-mode: horizontal-tb;
    font-size: clamp(28px, 4vw, 40px);
    letter-spacing: 0.08em;
  }
  .about-logo-wall.abf-tools {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
}

/* ─ phone (≤809.98): single reading column ─ */
@media (max-width: 809.98px) {
  .abf-dark .about-dojo-wall {
    grid-template-columns: 1fr;
  }
  .abf-portrait {
    grid-column: 1 / -1;
    width: min(100%, 360px);
    max-width: none;
  }
  .about-essay .section-intro h2.abf-t,
  .about-dark .section-intro h2.abf-t,
  h2.about-activities-title.abf-t,
  h2.about-habits-title.abf-t,
  .abf-vhead h2.abf-t {
    font-size: clamp(44px, 14vw, 68px);
  }
  .abf-vhead,
  .abf-vita {
    grid-column: 1 / -1;
  }
  .abf-vita-entry {
    padding-left: 18px;
  }
  .abf-poster {
    font-size: clamp(38px, 10.5vw, 52px);
    max-width: 11ch;
  }
  .abf-poster-seal {
    width: 22px;
    margin-left: var(--space-3);
  }
  .about-logo-wall.abf-tools {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 18px 14px;
  }
  .abf-scroll-gloss {
    max-width: none;
  }
}

/* ─ reduced motion: state changes only, nothing moves ─ */
@media (prefers-reduced-motion: reduce) {
  .about-dark.abf-dark,
  .about-activities.abf-vita-sec {
    transform: none;
    animation: none;
  }
  .abf-tool-index[data-fade].is-visible,
  .abf-tool-index.is-visible .abf-tools-head,
  .abf-tool-index.is-visible .about-logo-cell,
  .abf-tool-index.is-visible .abf-poster {
    opacity: 1;
    transform: none;
    animation: none;
  }
  .abf-tools .about-logo-cell img,
  .abf-habits .about-habit-photo img {
    transition: none;
  }
  .abf-habits .about-habit:hover .about-habit-photo img {
    transform: none;
  }
}
`,
        }}
      />
    </>
  );
}
