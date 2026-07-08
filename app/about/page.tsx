import type { Metadata } from "next";
import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { about } from "@/data/about";
import { site } from "@/data/site";
import { Cta } from "@/components/ui/cta";
import { OffscreenVideo } from "@/components/ui/offscreen-video";
import HongyadongScene from "@/components/hongyadong";
import { stripCssComments } from "@/lib/css-sanitize";

export const metadata: Metadata = {
  title: "About",
  description: about.heroIntro,
};

const SEAL = "/media/shared/seal.png";

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
        imageSrc="/media/about/hongyadong.jpg"
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
                src="/media/about/portrait-meeting.jpg"
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
            {/* wrapper keeps the note's 2-col grid/flex intact: claim + the
                education line stack in the first cell, the CTA keeps its own */}
            <div className="about-resume-claim">
              <h2>{about.resumeNote}</h2>
              {/* facts from the owner's resume (0429): Cornell M.I.S.
                  Dec 2025 — already graduated; Oberlin CS + East Asian
                  Studies '24. */}
              <p className="about-availability">
                Cornell M.S. Information Science &rsquo;25 · based in{" "}
                {site.location} · open to full-time
              </p>
            </div>
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
                <span>Capabilities</span>
                <span>{about.whatChanged.tools.length}</span>
              </div>
              {/* the tools wall, back by owner request — desaturated at rest;
                  hover lifts the icon and slides its name in (touch devices
                  show names statically per the snap-on-touch policy) */}
              <div className="abf-tools-wall">
                {about.whatChanged.tools.map((tool, i) => (
                  <span
                    key={tool.src}
                    className="abf-tool"
                    role="img"
                    aria-label={tool.name}
                    style={{ "--tool-index": i } as CSSProperties}
                  >
                    <span className="abf-tool-icon">
                      <Image src={tool.src} alt="" fill sizes="72px" />
                    </span>
                    <i className="abf-tool-name">{tool.name}</i>
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

              {/* prints hung on a wire (owner redo 2026-07-07): one gold
                  rail, uniform-height prints alternating above/below it,
                  captions set under the print in mono — not baked over it */}
              <div className="about-dojo-wall" data-fade>
                <i className="about-dojo-rail" aria-hidden="true" />
                {about.dojoWall.map((photo, i) => (
                  <figure
                    key={photo.src}
                    className="about-dojo-item"
                    style={{ "--i": i } as CSSProperties}
                  >
                    <span className="about-dojo-print">
                      <Image
                        src={photo.src}
                        alt={
                          "caption" in photo && photo.caption
                            ? photo.caption
                            : "Training photograph from the dojo years"
                        }
                        width={154}
                        height={photo.h}
                        sizes="220px"
                      />
                    </span>
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
      {/* Bottom-pin offset for the dark→activities cover. The dark band is
          taller than the viewport and its height changes with width, so the
          sticky `top` (= viewport − band height) can't be a static value.
          This measures it and writes --dark-pin-top; a full-page load runs the
          inline script directly, and it re-measures on resize / content reflow.
          Only desktop (≥1080px) bottom-pins — narrower widths stack the band
          (position: relative; top: auto via the media query below). */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
  var el = document.querySelector(".abf-dark");
  if (!el) return;
  // Write the offset through an injected stylesheet rule rather than the
  // element's inline style: React owns this <section>, and mutating its style
  // before hydration would trip a hydration-mismatch error. A head <style> is
  // outside React's tree, so it stays clean. offsetHeight is unaffected by the
  // top offset we set, so there is no measure/apply feedback loop.
  var sheet = document.createElement("style");
  document.head.appendChild(sheet);
  var apply = function(){
    if (!window.matchMedia("(min-width: 1080px)").matches) { sheet.textContent = ""; return; }
    sheet.textContent = ".abf-dark{--dark-pin-top:" + (window.innerHeight - el.offsetHeight) + "px}";
  };
  apply();
  window.addEventListener("resize", apply, { passive: true });
  window.addEventListener("load", apply);
  if (window.ResizeObserver) { new ResizeObserver(apply).observe(el); }
})();`,
        }}
      />
      {/* ── "one roll of film" pass (.abf-) — page-owned styles ──
          globals.css .about-* rules keep styling the unchanged markup;
          everything new or overridden lives here under the abf prefix. */}
      <style
        dangerouslySetInnerHTML={{
          __html: stripCssComments(`
/* ─ condensed family voice for the display titles; gold = static detail ─ */
.about-essay .section-intro h2.abf-t,
.about-dark .section-intro h2.abf-t,
h2.about-activities-title.abf-t,
h2.about-habits-title.abf-t,
.abf-vhead h2.abf-t {
  margin: 0;
  padding: 0;
  font-family: var(--font-condensed);
  font-size: var(--text-display-3);
  font-weight: 300;
  line-height: 1.02;
  /* readable section claims take normal tracking (owner rule) */
  letter-spacing: 0;
  text-transform: uppercase;
  text-align: left;
}
.abf-vhead h2.abf-t {
  color: var(--ink-950);
}

/* ─ frame 00: the education / base line under the resume claim ─ */
.about-resume-claim {
  min-width: 0;
}
/* the statement must break like a poster (~3 lines) at ANY viewport —
   hard-cap the size and give it a ch-based measure so an ultrawide screen
   can never stretch the line length or blow the type up to fill the wall */
.about-resume-claim h2 {
  font-size: clamp(28px, 2.4vw, 46px);
  max-width: 24ch;
  text-wrap: balance;
}
.about-availability {
  margin: var(--space-4) 0 0;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--track-eyebrow);
  text-transform: uppercase;
  color: var(--stone);
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
  /* VOICES follows the page-turn wrapper on the same paper. The wrapper is
     positioned (relative), so it paints ABOVE this static section and its
     covering box-shadow bled a grey band across the top of VOICES. Lift VOICES
     into the same paint layer with an opaque paper fill so it seals over that
     shadow tail — the section then flows in with no color band (the only rule
     under the heading is the intended .abf-rule hairline). */
  position: relative;
  z-index: 1;
  background: var(--paper);
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
  border-radius: clamp(30px, 5vw, 64px) clamp(30px, 5vw, 64px) 0 0;
  isolation: isolate;
}
.about-dark.abf-dark {
  /* Covered section for the dark-to-activities page-turn. It must pin by its
     BOTTOM edge: the whole dark band (incl. the dojo wall at its foot) scrolls
     through and reads first, then it holds still while ACTIVITIES slides up
     over it, mirroring the shutter-to-dark cover above.
     CSS sticky can only pin a bottom edge via a negative top of
     (viewport minus element height); a bottom:0 inset only shifts the box UP
     and never holds it here (verified). A plain top:0 is wrong too: this band
     is taller than one viewport, so a top pin would freeze its HEADER (hiding
     the dojo wall) and, because the band nearly fills its container, release
     before the shorter ACTIVITIES panel reaches the seam. Height varies with
     width (dojo clamp + text reflow: ~1788px to 2126px), so the exact offset is
     set at runtime into --dark-pin-top; the fallback suits the 1536 canvas. */
  position: sticky;
  top: var(--dark-pin-top, calc(100svh - 1984px));
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
  position: relative;
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
/* ─ capability index: grouped mono labels, plain-text items — keeps the
   toolbox block's grid rhythm, no new colors ─ */
.abf-tools-wall {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  justify-items: center;
  gap: clamp(22px, 2.6vw, 40px) clamp(18px, 2.4vw, 36px);
  margin: clamp(28px, 4vw, 46px) 0 0;
}
.abf-tool {
  position: relative;
  display: grid;
  justify-items: center;
  width: 100%;
  padding-bottom: 18px;
  opacity: 0;
  transform: translateY(18px);
  will-change: transform, opacity;
}
.abf-tool-index.is-visible .abf-tool {
  animation: abfToolLogoIn 0.72s var(--ease-silk) forwards;
  animation-delay: calc(0.1s + (var(--tool-index) * 45ms));
}
.abf-tool-icon {
  position: relative;
  width: clamp(44px, 4.6vw, 64px);
  aspect-ratio: 1;
  filter: grayscale(0.9) opacity(0.62);
  transform: translateY(6px);
  transition: filter 0.35s var(--ease-silk), transform 0.35s var(--ease-silk);
}
.abf-tool-icon img {
  object-fit: contain;
}
.abf-tool-name {
  position: absolute;
  bottom: -2px;
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  white-space: nowrap;
  color: var(--stone);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.3s var(--ease-silk), transform 0.3s var(--ease-silk);
}
.abf-tool:hover .abf-tool-icon,
.abf-tool:focus-visible .abf-tool-icon {
  filter: none;
  transform: translateY(-4px);
}
.abf-tool:hover .abf-tool-name,
.abf-tool:focus-visible .abf-tool-name {
  opacity: 1;
  transform: translateY(0);
}
/* touch: no hover — icons stay lit and names read statically */
@media (hover: none) {
  .abf-tool-icon { filter: none; transform: none; }
  .abf-tool-name { opacity: 1; transform: none; }
  .abf-tool { padding-bottom: 20px; }
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
  /* poster-scale sign-off — stylized, keeps the display tracking
     (owner rule: very large type = stylized; names, page openers) */
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

/* ─ the dojo wire (owner redo): prints on one rail, captions beneath ─ */
.abf-dark .about-dojo-wall {
  position: relative;
  width: 100%;
  max-width: min(1360px, 100%);
  height: auto;
  margin: clamp(40px, 5vw, 64px) auto 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: clamp(14px, 1.6vw, 26px);
}
.about-dojo-rail {
  position: absolute;
  top: 34px;
  left: 2%;
  right: 2%;
  height: 1px;
  background: rgba(212, 148, 30, 0.4);
}
.abf-dark .about-dojo-item {
  position: relative;
  width: auto;
  margin: 0;
  padding-top: 44px;
  opacity: 0;
  transform: translateY(22px);
}
.abf-dark .about-dojo-item:nth-child(even) {
  padding-top: 62px;
}
.about-dojo-wall.is-visible .about-dojo-item {
  animation: abfToolLogoIn 0.8s var(--ease-silk) forwards;
  animation-delay: calc(0.12s + (var(--i) * 110ms));
}
/* the print hangs from the rail: a short gold thread ties it up */
.abf-dark .about-dojo-item::before {
  content: "";
  position: absolute;
  top: 35px;
  left: 50%;
  width: 1px;
  height: 9px;
  background: rgba(212, 148, 30, 0.5);
}
.abf-dark .about-dojo-item:nth-child(even)::before {
  height: 27px;
}
.about-dojo-print {
  display: block;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.035);
  box-shadow: 0 18px 54px rgba(0, 0, 0, 0.4);
  transition: transform 0.45s var(--ease-silk), box-shadow 0.45s var(--ease-silk);
}
.about-dojo-print img {
  display: block;
  height: clamp(180px, 17vw, 250px);
  width: auto;
}
.abf-dark .about-dojo-item:hover .about-dojo-print {
  transform: translateY(-6px);
  box-shadow: 0 26px 64px rgba(0, 0, 0, 0.55);
}
.abf-dark .about-dojo-item figcaption {
  margin-top: 10px;
  max-width: 24ch;
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 10px;
  letter-spacing: 0.06em;
  line-height: 1.5;
  white-space: normal;
  color: rgba(212, 148, 30, 0.85);
  text-shadow: none;
}
@media (prefers-reduced-motion: reduce) {
  .abf-dark .about-dojo-item {
    opacity: 1;
    transform: none;
    animation: none;
  }
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
    flex-wrap: wrap;
    row-gap: 26px;
  }
  .about-dojo-rail { display: none; }
  .abf-dark .about-dojo-item,
  .abf-dark .about-dojo-item:nth-child(even) { padding-top: 0; }
  .abf-dark .about-dojo-item::before { display: none; }
  .abf-dark .about-dojo-item {
    position: relative;
    width: auto;
  }
  .about-dojo-print img {
    height: 168px;
    width: auto;
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
  .abf-tools-wall {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
}

/* ─ phone (≤809.98): single reading column ─ */
@media (max-width: 809.98px) {
  .about-dojo-print img {
    height: 132px;
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
  .abf-tools-wall {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 20px 14px;
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
  .abf-tool-index.is-visible .abf-tool,
  .abf-tool-index.is-visible .abf-poster {
    opacity: 1;
    transform: none;
    animation: none;
  }
  .abf-habits .about-habit-photo img {
    transition: none;
  }
  .abf-habits .about-habit:hover .about-habit-photo img {
    transform: none;
  }
}
`),
        }}
      />
    </>
  );
}
