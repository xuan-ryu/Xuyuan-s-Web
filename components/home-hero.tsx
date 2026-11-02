// Home stage — L1 hero section: the opening still + the decode runway.
//
// The first screen is the copy over the photo pass (dark, so the nav goes
// light via data-nav-dark). The rest of the section is empty scroll travel
// that the stage spends decoding the photo into the room, left to right.
import { site } from "@/data/site";

export function HomeHero() {
  return (
    <section className="home-hero" data-shot="hero" aria-labelledby="home-hero-title">
      <div className="home-hero-screen home-grid" data-nav-dark>
        <p className="home-hero-kicker">{site.home.heroKicker}</p>
        <h1 id="home-hero-title" className="home-hero-title">
          {site.home.heroName.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </h1>
        <p className="home-hero-role">{site.heroSub}</p>
        <p className="home-hero-hint glass-chip" data-glass="dark">
          <span aria-hidden="true" className="home-hero-hint-rule" />
          {site.home.decodeHint}
        </p>
      </div>
    </section>
  );
}
