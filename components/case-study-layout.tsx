import Image from "next/image";
import type { Project } from "@/data/projects";

// Mirrors the Framer "case study" template (vicino-ai, froghire-ai,
// roper-center): title band → cover → black summary → SOLUTION banner →
// memorable moment (+ prototype videos) → chapter banners with tagged
// sections, each followed by a full-width figure.
export function CaseStudyLayout({ project }: { project: Project }) {
  const meta = [
    ["Role", project.role],
    ["Duration", project.duration],
    ["Type", project.type],
    ["Teams", project.teams],
  ];

  return (
    <article
      className="case-study-page"
      data-has-cover={project.cover ? "true" : "false"}
    >
      <section className="case-study-hero" id="header">
        <p className="case-hero-kicker" data-fade>
          Case Study
        </p>
        <h1 data-fade>{project.title}</h1>
        <p className="case-hero-lede" data-fade>
          {project.oneliner}
        </p>
        <dl className="case-hero-meta" data-fade>
          {meta.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {project.cover && (
        <figure className={`proj-hero ${project.coverClass ?? ""}`.trim()}>
          <div className="proj-hero-frame">
            <Image
              src={project.cover}
              alt={project.title}
              fill
              sizes="100vw"
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        </figure>
      )}

      <section className="proj-summary" aria-labelledby="project-summary">
        <h2 id="project-summary" data-fade>
          Project Summary
        </h2>
        <div className="proj-summary-copy">
          {(project.summary ?? [project.blurb]).map((p, i) => (
            <p key={i} data-fade>
              {p}
            </p>
          ))}
        </div>
      </section>

      {project.moment && (
        <section className="case-moment">
          <h2 className="case-moment-label" data-fade>
            Most Memorable Moment
          </h2>
          {/* live: copy in the left column, the half videos stacked in the
              right column, the wide video full-width below */}
          <div className="case-moment-grid">
            <div className="case-moment-body" data-fade>
              <h3>{project.moment.title}</h3>
              {project.moment.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="case-moment-videos" data-fade>
              {project.moment.videos
                ?.filter((v) => !v.wide)
                .map((v) => (
                  <video
                    key={v.src}
                    src={v.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ))}
            </div>
          </div>
          {project.moment.videos
            ?.filter((v) => v.wide)
            .map((v) => (
              <video
                key={v.src}
                className="case-video-wide"
                src={v.src}
                autoPlay
                muted
                loop
                playsInline
                data-fade
              />
            ))}
        </section>
      )}

      {project.chapters?.map((chapter) => (
        <section key={chapter.number} className="case-chapter">
          <header className="case-chapter-head" data-fade>
            <h2 className="case-chapter-no">{chapter.number}</h2>
            <div className="case-chapter-rule" />
            <p className="case-chapter-sub">{chapter.title}</p>
          </header>

          {chapter.sections.map((section) => (
            <div key={section.tags} className="case-section">
              <div className="case-section-grid">
                <p className="case-section-tags" data-fade>
                  {section.tags}
                </p>
                <div className="case-section-copy" data-fade>
                  <h3 className="case-section-heading">{section.heading}</h3>
                  {section.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
              {section.image && (
                <figure className="case-section-figure" data-fade>
                  <Image
                    src={section.image}
                    alt=""
                    width={1380}
                    height={900}
                    sizes="(max-width: 809px) 100vw, 1380px"
                    style={{ height: "auto" }}
                  />
                </figure>
              )}
            </div>
          ))}
        </section>
      ))}
    </article>
  );
}
