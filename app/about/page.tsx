import { Fragment } from "react";
import type { Metadata } from "next";
import { about } from "@/data/about";
import { CtaBlock } from "@/components/cta-block";
import HongyadongScene from "@/components/hongyadong";
import KoiPondScene from "@/components/koi-pond";

export const metadata: Metadata = {
  title: "About",
  description: about.intro,
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
        titleZh="刘 栩源"
        subtitle={about.intro}
        signatureNote="This nightscape is my hometown, Chongqing."
        scrollDemo={0}
      />

      <section className="px-6 md:px-10 py-20 border-t border-rule">
        <p className="text-eyebrow">{about.hometown}</p>
        <figure className="mt-12 max-w-3xl mx-auto text-center">
          <blockquote
            className="text-display text-4xl md:text-6xl leading-tight"
            style={{ fontFamily: "var(--font-brush)" }}
          >
            {about.koan.zh}
          </blockquote>
          <figcaption className="mt-6 italic text-ink-muted">
            {about.koan.en}
          </figcaption>
          <p className="mt-3 text-eyebrow">{about.koan.caption}</p>
        </figure>
      </section>

      <section className="px-6 md:px-10 py-20 max-w-3xl space-y-6 text-lg leading-relaxed text-ink-muted">
        {about.bio.map((p, i) => (
          <p key={i} className={i === 0 ? "text-ink" : undefined}>
            {p}
          </p>
        ))}
      </section>

      {about.sections.map((sec, idx) => (
        <Fragment key={sec.title}>
          <section className="px-6 md:px-10 py-20 md:py-28 border-t border-rule max-w-3xl">
            <h2 className="text-display text-3xl md:text-5xl leading-tight">
              {sec.title}
            </h2>
            <div className="mt-10 space-y-5 text-ink-muted leading-relaxed text-lg">
              {sec.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {"caption" in sec && sec.caption && (
              <p className="mt-10 text-eyebrow">{sec.caption}</p>
            )}
          </section>
          {idx === 0 && (
            <section className="px-6 md:px-10 py-10 border-t border-rule">
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

      <section className="px-6 md:px-10 py-20 border-t border-rule grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-eyebrow mb-6">Dojos</h3>
          <ul className="space-y-3 text-ink-muted">
            {about.dojos.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-eyebrow mb-6">Activities & Leadership</h3>
          <ul className="space-y-4 text-ink-muted">
            {about.activities.map((a) => (
              <li key={a.role}>
                <p className="text-ink">{a.role}</p>
                <p className="text-eyebrow mt-1">{a.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
