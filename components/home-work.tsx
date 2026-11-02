// Home stage — L1 selected-work section: featured projects as glass cards
// floating in the room while the camera holds a bloom close-up.
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { projectCatalog } from "@/data/project-catalog";
import { Cta } from "./ui/cta";

export function HomeWork() {
  const featured = projectCatalog.all.filter((p) => p.featured).sort((a, b) => a.order - b.order);

  return (
    <section className="home-work home-shot" data-shot="work" aria-labelledby="home-work-title">
      <div className="home-grid home-shot-inner">
        <header className="home-work-head" data-fade>
          <h2 id="home-work-title" className="home-display">
            {site.home.workTitle}
          </h2>
          <Cta href="/work" variant="quiet">
            {site.home.workAll}
          </Cta>
        </header>
        <ol className="home-work-list">
          {featured.map((p, i) => (
            <li key={p.slug} data-fade>
              <Link href={`/work/${p.slug}`} className="home-work-card glass-window">
                {p.cover ? (
                  <span className="home-work-media">
                    <Image src={p.cover} alt="" fill sizes="(max-width: 760px) 90vw, 30vw" />
                  </span>
                ) : null}
                <span className="home-work-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="home-work-name">{p.title}</span>
                <span className="home-work-line">{p.oneliner}</span>
                <span className="home-work-tags">{p.tags.join(" · ")}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
