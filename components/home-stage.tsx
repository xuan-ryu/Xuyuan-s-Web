// Home stage — L2 composer: one fixed WebGL stage under four camera shots.
//
// The canvas is a sticky 100svh layer that the sections scroll over; each
// section names its camera shot with data-shot (see home-stage-tokens). The
// server markup is complete readable content on a CSS backdrop — the stage is
// enhancement only, so no-WebGL / reduced-motion visitors lose nothing but the
// picture. Does not own the loader or page transitions.
import { HomeStageScene } from "./home-stage-scene";
import { HomeHero } from "./home-hero";
import { HomeIntro } from "./home-intro";
import { HomeWork } from "./home-work";
import { HomeMethod } from "./home-method";

export function HomeStage() {
  return (
    <div className="home-stage">
      <div className="home-stage-layer" aria-hidden="true">
        <HomeStageScene />
      </div>
      <HomeHero />
      <HomeIntro />
      <HomeWork />
      <HomeMethod />
    </div>
  );
}
