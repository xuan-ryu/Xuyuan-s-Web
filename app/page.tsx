import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { Loader } from "@/components/loader";
import HeroScene from "@/components/hero-scene";
import KoiPondScene from "@/components/koi-pond";
import { FeaturedWindows } from "@/components/featured-windows";
import { RoofTransition } from "@/components/roof-transition";
import { CtaBlock } from "@/components/cta-block";

export default function Home() {
  return (
    <>
      <Loader />

      <HeroScene
        mobileBgUrl="/assets/framerusercontent.com/images/oOEkORPGPOFnemDEDLO72iBOZKU.png"
        heroWord1={site.greeting[0]}
        heroWord2={site.greeting[1]}
        heroWord3={site.greeting[2]}
        heroSubtitle={site.heroSub}
        rightVerticalText={site.sideText}
        quoteLine={site.brandCorner.zh}
        scrollHint={site.scrollHint}
        page2Title={site.brandmark}
        page2Subtitle={site.blackPage.body}
        page2BrandLine={site.blackPage.line}
        page2Footer="Keep scrolling. The true craft lives in the transitions."
        photoUrl="/assets/framerusercontent.com/images/oVKSCPMnnMqcT6I6GkrYcVaI0U.jpg"
      />

      <RoofTransition />

      <section id="featured" className="home-featured home-featured-live">
        <div className="home-featured-shell">
          <div className="home-featured-head">
            <h2>Featured Project</h2>
            <Link href="/work">view all projects</Link>
          </div>

          <div className="home-featured-rule" />

          <FeaturedWindows projects={projects} />
        </div>
      </section>

      <section className="home-koi-section" aria-label="Interactive koi pond">
        <div className="home-koi-frame">
          <div className="home-koi-frame-shadow home-koi-frame-shadow-left" />
          <div className="home-koi-frame-shadow home-koi-frame-shadow-right" />
          <div className="home-koi-inner">
            <KoiPondScene
              eyebrow="INTERLUDE / INK ECOSYSTEM"
              titleMain="A small pond"
              titleSub="for the wandering eye"
              tag="MOVE THE CURSOR. FEED THE FISH."
              feedText="Why not feed the fish?"
              showScrollTip
              introDurationMs={800}
              heroBoxXvw={50}
            />
          </div>
        </div>
      </section>

      {/* live layout: 96px title right-of-center, antique-screen decor on both
          edges, three glassy method cards staggered left/right/left with ink
          brush strokes behind them; geometry measured from the live site */}
      <section id="value" className="home-how">
        <div className="how-decor how-screen" aria-hidden="true">
          <Image
            src="/assets/framerusercontent.com/images/YLXrjVSbjpbSEr6VDxoQlckuA4E.png"
            alt=""
            fill
            sizes="608px"
          />
        </div>
        <div className="how-decor how-vase" aria-hidden="true">
          <Image
            src="/assets/framerusercontent.com/images/ZDxCTcmPVVb0cfyh5FFNd4dj1NA.png"
            alt=""
            fill
            sizes="376px"
          />
        </div>
        <div className="how-decor how-bamboo-screen" aria-hidden="true">
          <Image
            src="/assets/framerusercontent.com/images/lwMaDnjXri23sjZmiuTe7sT1Q.png"
            alt=""
            fill
            sizes="881px"
          />
        </div>
        <div className="how-decor how-lotus" aria-hidden="true">
          <Image
            src="/assets/framerusercontent.com/images/GuVBPaGjujlgeSpfvNyLP3YczDs.png"
            alt=""
            fill
            sizes="597px"
          />
        </div>
        <div className="how-decor how-gold-screen" aria-hidden="true">
          <Image
            src="/assets/framerusercontent.com/images/j6sQpno4wHi7mS5QGmU6grlMWI.png"
            alt=""
            fill
            sizes="947px"
          />
        </div>
        <div className="how-decor how-dark-screen" aria-hidden="true">
          <Image
            src="/assets/framerusercontent.com/images/WpBupAnkoyx461zF3yJoLAf86VQ.png"
            alt=""
            fill
            sizes="385px"
          />
        </div>
        {["how-brush-a", "how-brush-b", "how-brush-c"].map((cls) => (
          <div key={cls} className={`how-decor how-brush ${cls}`} aria-hidden="true">
            <Image
              src="/assets/framerusercontent.com/images/RJnh8cLkwy27PD5vycbXZbYjcQA.png"
              alt=""
              fill
              sizes="800px"
            />
          </div>
        ))}

        <h2 className="home-how-title">How I Work</h2>

        {site.workMethods.map((method, i) => (
          <article key={method.title} className={`how-card how-card-${i + 1}`}>
            <h3>{method.title}</h3>
            <span>{method.heading}</span>
            <p>{method.body}</p>
          </article>
        ))}
      </section>

      <CtaBlock />
    </>
  );
}
