import Link from "next/link";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { WorkCard } from "@/components/work-card";
import { CtaBlock } from "@/components/cta-block";
import { Loader } from "@/components/loader";
import HeroScene from "@/components/hero-scene";

export default function Home() {
  const featured = projects.filter((p) => p.featured);

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
        page2BrandLine={site.brandCorner.en}
        page2Footer={`© ${new Date().getFullYear()} XUYUAN`}
      />

      <section id="featured" className="section featured-section">
        <div className="container">
          <div className="section-intro-row section-intro">
            <div>
              <p className="label" data-fade>
                Selected Work
              </p>
              <h2 data-fade>Featured projects</h2>
            </div>
            <Link href="/work" className="text-link" data-fade>
              View all projects
            </Link>
          </div>
          <div className="featured-grid">
            {featured.map((p) => (
              <WorkCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      <section id="value" className="section value-section">
        <div className="container">
          <div className="section-intro" data-fade>
            <p className="label">My Value</p>
            <h2>How I work</h2>
          </div>
          <div className="grid-divider value-grid">
            {site.archetypes.map((a) => (
              <div key={a.title} className="value-cell" data-fade>
                <div className="value-icon">{a.icon}</div>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="quotes" className="section quotes-section">
        <div className="container">
          <p
            className="label"
            style={{ marginBottom: "40px" }}
            data-fade
          >
            What people say
          </p>
          <div className="grid-divider quotes-grid">
            {site.quotes.map((q) => (
              <div key={q.author} className="quote-cell" data-fade>
                <p className="quote-text">{q.text}</p>
                <div className="quote-author">
                  <strong>{q.author}</strong>
                  <span>{q.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
