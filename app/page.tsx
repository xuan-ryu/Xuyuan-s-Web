import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { Loader } from "@/components/loader";
import HeroScene from "@/components/hero-scene";
import KoiPondScene from "@/components/koi-pond";
import { FeaturedWindows } from "@/components/featured-windows";

export default function Home() {
  return (
    <>
      <Loader />

      <HeroScene
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

      <section className="home-roof-transition" aria-hidden="true">
        <Image
          src="/assets/framerusercontent.com/images/6abw1vzYpd5VHb7WZncQkASt2ag.png"
          alt=""
          width={2500}
          height={900}
          className="roof roof-a"
        />
        <Image
          src="/assets/framerusercontent.com/images/D6Nz1N21z7DIjWae8R8LFGCY.png"
          alt=""
          width={2400}
          height={800}
          className="roof roof-b"
        />
        <Image
          src="/assets/framerusercontent.com/images/wgP2v6bRLltf0I89tfuRuq6sUhQ.png"
          alt=""
          width={1200}
          height={260}
          className="roof roof-c"
        />
      </section>

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

      <section id="value" className="home-how">
        <div className="how-decor how-screen" aria-hidden="true">
          <Image
            src="/assets/framerusercontent.com/images/YLXrjVSbjpbSEr6VDxoQlckuA4E.png"
            alt=""
            fill
            sizes="430px"
          />
        </div>
        <div className="how-decor how-vase" aria-hidden="true">
          <Image
            src="/assets/framerusercontent.com/images/ZDxCTcmPVVb0cfyh5FFNd4dj1NA.png"
            alt=""
            fill
            sizes="220px"
          />
        </div>
        <div className="how-decor how-bamboo-screen" aria-hidden="true">
          <Image
            src="/assets/framerusercontent.com/images/lwMaDnjXri23sjZmiuTe7sT1Q.png"
            alt=""
            fill
            sizes="420px"
          />
        </div>
        <div className="how-decor how-lotus" aria-hidden="true">
          <Image
            src="/assets/framerusercontent.com/images/GuVBPaGjujlgeSpfvNyLP3YczDs.png"
            alt=""
            fill
            sizes="360px"
          />
        </div>
        <div className="home-how-title">
          <h2>How I Work</h2>
        </div>
        <div className="how-method-card">
          <article>
            <span>{site.workMethods[0].title}</span>
            <h3>{site.workMethods[0].heading}</h3>
            <p>{site.workMethods[0].body}</p>
          </article>
        </div>
        <div className="how-method-list">
          {site.workMethods.slice(1).map((method) => (
            <article key={method.title}>
              <span>{method.title}</span>
              <h3>{method.heading}</h3>
              <p>{method.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-live-cta">
        <div>
          <h2>Let&apos;s Work Together</h2>
          <Link href="/contact">get in touch</Link>
        </div>
      </section>
    </>
  );
}
