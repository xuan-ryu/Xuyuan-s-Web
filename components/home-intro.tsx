// Home stage — L1 intro section: a visionOS-style glass window beside the
// arrangement's three-quarter shot. Copy comes from data/site.ts.
import Image from "next/image";
import { site } from "@/data/site";
import { Cta } from "./ui/cta";

export function HomeIntro() {
  return (
    <section className="home-intro home-shot" data-shot="intro" aria-labelledby="home-intro-title">
      <div className="home-grid home-shot-inner">
        <article className="home-intro-window glass-window" data-fade>
          <Image
            className="home-intro-portrait"
            src="/media/shared/portrait.jpg"
            alt="Portrait of Xuyuan Liu"
            width={112}
            height={112}
          />
          <p className="home-eyebrow">{site.home.introEyebrow}</p>
          <h2 id="home-intro-title" className="home-intro-title">
            {site.brandmark}
          </h2>
          <p className="home-intro-body">{site.blackPage.body}</p>
          <Cta href="/about" variant="line">
            {site.home.introCta}
          </Cta>
        </article>
      </div>
    </section>
  );
}
