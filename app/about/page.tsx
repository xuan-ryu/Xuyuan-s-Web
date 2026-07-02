import type { Metadata } from "next";
import Image from "next/image";
import { Fragment } from "react";
import { about } from "@/data/about";
import { site } from "@/data/site";
import { CtaBlock } from "@/components/cta-block";
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
            <p className="abf-frame-cap">帧 00 — Chongqing, 17 12 &rsquo;94</p>
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
            <p className="abf-eb">帧 01 / 03</p>
            <h2 className="abf-t">{about.whatChanged.title}</h2>
          </div>
          <div className="about-text about-essay-text">
            {about.whatChanged.body.map((p, i) => (
              <p key={i} data-fade>{p}</p>
            ))}
          </div>

          <div className="abf-toolbox" data-fade>
            <div className="abf-tools-head">
              <span>Tools in rotation</span>
              <span>{about.whatChanged.logos.length}</span>
            </div>
            <div className="about-logo-wall abf-tools">
              {about.whatChanged.logos.map((src) => (
                <span key={src} className="about-logo-cell">
                  <Image src={src} alt="" fill sizes="72px" />
                </span>
              ))}
            </div>
          </div>

          <p className="abf-poster" data-fade>
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
      </section>

      {/* ── Frame 02 — Before the Shutter Closes + 恰好 + Kyoto reel ── */}
      <section className="section about-essay about-shutter abf-shutter">
        <div className="container">
          <div className="about-shutter-grid">
            <div>
              <div className="section-intro" data-fade>
                <p className="abf-eb">帧 02 / 03</p>
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

      {/* ── Frame 03 — How I Work: ink band, hanging scroll, dojo wall ── */}
      <section className="section about-dark abf-dark">
        <div className="container">
          <div className="about-howiwork">
            <div className="section-intro" data-fade>
              <p className="abf-eb">帧 03 / 03</p>
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

      <CtaBlock />

      {/* ── "one roll of film" pass (.abf-) — page-owned styles ──
          globals.css .about-* rules keep styling the unchanged markup;
          everything new or overridden lives here under the abf prefix. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* ─ metadata voice: frame indices + eyebrows (mono, never titles) ─ */
.abf-eb {
  margin: 0 0 var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  font-weight: 400;
  letter-spacing: var(--track-eyebrow);
  text-transform: uppercase;
  color: var(--stone);
}
.abf-dark .abf-eb {
  color: rgba(255, 255, 255, 0.5);
}

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
.abf-frame-cap {
  margin: var(--space-3) 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-eyebrow);
  text-transform: uppercase;
  color: var(--stone);
}

/* ─ pacing: standard paper padding; the post-poster void collapses ─ */
.about-essay.abf-pad {
  padding: clamp(96px, 10vw, 144px) 0;
}
.about-shutter.abf-shutter {
  padding-top: 0;
  padding-bottom: clamp(96px, 10vw, 144px);
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

/* ─ toolbox index: hairline head + greyscale 10×2 wall ─ */
.abf-toolbox {
  grid-column: 2 / span 10;
  min-width: 0;
}
.abf-tools-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-6);
  padding-top: var(--space-5);
  border-top: 1px solid var(--rule);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-eyebrow);
  text-transform: uppercase;
  color: var(--stone);
}
.about-logo-wall.abf-tools {
  margin: var(--space-8) 0 0;
  padding-top: 0;
  border-top: 0;
  max-width: none;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  justify-content: stretch;
  justify-items: center;
  gap: clamp(16px, 2vw, 28px);
}
.abf-tools .about-logo-cell {
  width: 100%;
  max-width: 72px;
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

/* ─ sealed poster line — the page's one seal-red moment ─ */
.abf-poster {
  grid-column: 3 / span 8;
  margin: var(--space-12) 0 0;
  font-family: var(--font-condensed);
  font-size: var(--text-display-3);
  font-weight: 300;
  line-height: 1.08;
  letter-spacing: var(--track-display);
  text-transform: uppercase;
  text-align: center;
  color: var(--ink-950);
}
.abf-poster-seal {
  display: inline-block;
  width: 28px;
  height: auto;
  margin-left: var(--space-4);
  transform: translateY(0.08em);
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
  color: rgba(255, 255, 255, 0.22);
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
.abf-dark .about-dojo-item figcaption {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  white-space: normal;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.78);
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
  .abf-toolbox,
  .abf-poster {
    grid-column: 1 / -1;
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
