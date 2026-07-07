import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { Loader } from "@/components/loader";
import HeroScene from "@/components/hero-scene";
import KoiPondScene from "@/components/koi-pond-lazy";
import { FeaturedGate } from "@/components/featured-gate";
import { KoiLotusFrame } from "@/components/fg-lotus-layer";
import { RoofTransition } from "@/components/roof-transition";
import { KoiHowOverlay } from "@/components/koi-how-overlay";

export default function Home() {
  const liteScenesEnabled = process.env.NEXT_PUBLIC_LITE_SCENES === "1";

  return (
    <>
      <Loader />

      <HeroScene
        liteMode={liteScenesEnabled}
        mobileBgUrl="/media/home/hero-mobile-bg.png"
        heroWord1={site.greeting[0]}
        heroWord2={site.greeting[1]}
        heroWord3={site.greeting[2]}
        heroSubtitle={site.heroSub}
        quoteLine={site.brandCorner.zh}
        scrollHint={site.scrollHint}
        page2Title={site.brandmark}
        page2Subtitle={site.blackPage.body}
        page2Footer="The craft lives in the transitions."
        photoUrl="/media/shared/portrait.jpg"
      />

      <RoofTransition />

      {/* Selected Work — the moon gate: an editorial index whose preview is
          framed in a round opening in the white garden wall beneath the eaves.
          Replaces the earlier moon-dial selector. */}
      <div id="featured" style={{ backgroundColor: "#020305" }}>
        <FeaturedGate projects={projects} />
      </div>

      {/* The pond hosts How I Work: after a few feed drops, the title + method
          cards surface over the
          water. The old #value screens/vase/bamboo collage is retired — its
          markup is preserved at git tag backup/home-how-screens. */}
      <section
        id="value"
        className="home-koi-section koi-has-how"
        aria-label="Interactive koi pond"
      >
        <div className="home-koi-frame">
          <div className="home-koi-inner" data-nav-dark>
            {!liteScenesEnabled ? (
              <KoiPondScene
                eyebrow="INTERLUDE / INK ECOSYSTEM"
                titleMain="A small pond"
                titleSub="for the wandering eye"
                tag="three drops surface how I work"
                feedText="Drop me a problem"
                showScrollTip
                introDurationMs={800}
                heroBoxXvw={50}
              />
            ) : null}
            {!liteScenesEnabled ? <KoiLotusFrame /> : null}
          </div>
        </div>
        <KoiHowOverlay
          title="How I Work"
          methods={site.workMethods}
          forceReveal={liteScenesEnabled}
        />
      </section>
    </>
  );
}
