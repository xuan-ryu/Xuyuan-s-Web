import type { Metadata } from "next";
import Image from "next/image";
import { about } from "@/data/about";
import { CtaBlock } from "@/components/cta-block";
import HongyadongScene from "@/components/hongyadong";
import { RevealText } from "@/components/text-reveal";

export const metadata: Metadata = {
  title: "About",
  description: about.heroIntro,
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
              <RevealText as="span" className="zh" text={about.koan.zh} mode="char" />
              <RevealText
                as="span"
                className="en"
                text={about.koan.en}
                mode="line"
                direction="left"
                delay={260}
              />
              <RevealText
                as="cite"
                text={about.koan.caption}
                mode="line"
                direction="left"
                delay={420}
              />
            </blockquote>
          </div>

          <div className="about-text about-bio">
            {about.bio.map((p) => (
              <p key={p} data-fade>{p}</p>
            ))}
          </div>

          <div className="about-divider" aria-hidden="true" />

          <div className="about-resume-note" data-fade>
            <h2>
              <RevealText text={about.resumeNote} mode="line" direction="right" />
            </h2>
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

      <section className="section about-essay about-essay-right">
        <div className="container">
          <div className="section-intro" data-fade>
            <h2>
              <RevealText text={about.whatChanged.title} mode="line" direction="right" />
            </h2>
          </div>
          <div className="about-text about-essay-text">
            {about.whatChanged.body.map((p, i) => (
              <p key={i} data-fade>{p}</p>
            ))}
          </div>

          <div className="about-logo-wall" data-fade>
            {about.whatChanged.logos.map((src) => (
              <span key={src} className="about-logo-cell">
                <Image src={src} alt="" fill sizes="100px" />
              </span>
            ))}
          </div>

          <p className="about-essay-closing" data-fade>
            {about.whatChanged.closing}
          </p>
        </div>
      </section>

      <section className="section about-essay about-shutter">
        <div className="container">
          <div className="about-shutter-grid">
            <div>
              <div className="section-intro" data-fade>
                <h2>
                  <RevealText text={about.shutter.title} mode="line" direction="left" />
                </h2>
              </div>
              <div className="about-text about-essay-text">
                {about.shutter.body.map((p, i) => (
                  <p key={i} data-fade>{p}</p>
                ))}
              </div>
            </div>
            <figure className="about-kyoto" data-fade>
              <video
                src={about.shutter.video}
                autoPlay
                muted
                loop
                playsInline
              />
              <figcaption>{about.shutter.caption}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section about-dark">
        <div className="container">
          <div className="about-howiwork">
            <div className="section-intro" data-fade>
              <h2>
                <RevealText text={about.howIWork.title} mode="line" direction="right" />
              </h2>
            </div>
            <div className="about-text about-essay-text">
              {about.howIWork.body.map((p, i) => (
                <p key={i} data-fade>{p}</p>
              ))}
              <p className="about-caption" data-fade>{about.howIWork.caption}</p>
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

      <section className="section about-activities">
        <div className="container">
          <h2 className="about-activities-title" data-fade>
            <RevealText text="Activities & Leadership" mode="line" />
          </h2>
          {about.activities.map((a) => (
            <div key={a.org + a.role} className="about-activity" data-fade>
              <h3>{a.org}</h3>
              <p className="about-activity-role">{a.role}</p>
              <p className="about-activity-date">{a.date}</p>
              <ul>
                {a.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section about-testimonials">
        <div className="container about-testimonial-grid">
          {about.testimonials.map((t) => (
            <figure key={t.name} className="about-testimonial" data-fade>
              <span className="about-testimonial-photo">
                <Image src={t.photo} alt={t.name} fill sizes="369px" />
              </span>
              <figcaption>
                <h3>{t.name}</h3>
                <p className="about-testimonial-role">{t.role}</p>
                <blockquote>{t.quote}</blockquote>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section about-habits">
        <div className="container">
          <h2 className="about-habits-title" data-fade>
            <RevealText text="My Habits" mode="line" />
          </h2>
          <div className="about-habits-grid">
            {about.habits.map((h) => (
              <figure key={h.label} className="about-habit" data-fade>
                <span className="about-habit-photo">
                  <Image src={h.photo} alt={h.label} fill sizes="240px" />
                </span>
                <figcaption>
                  <p className="about-habit-label">{h.label}</p>
                  <p className="about-habit-sub">{h.sub}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
