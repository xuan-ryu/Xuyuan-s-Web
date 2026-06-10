import Image from "next/image";
import Link from "next/link";
import { adjacent, type Project } from "@/data/projects";
import { CaseStudySidebar } from "@/components/case-study-sidebar";

export function CaseStudyLayout({ project }: { project: Project }) {
  const { prev, next } = adjacent(project.slug);
  const meta = [
    ["Role", project.role],
    ["Duration", project.duration],
    ["Type", project.type],
    ["Teams", project.teams],
  ];
  const sidebarItems = [
    { href: "#overview", label: "Overview" },
    ...(project.memorableMoment ? [{ href: "#moment", label: "Moment" }] : []),
    ...(project.chapters?.map((ch, i) => ({
      href: `#ch-${i + 1}`,
      label: ch.number ?? `Ch ${i + 1}`,
    })) ?? []),
    ...(project.livePreview ? [{ href: "#live", label: "Live" }] : []),
  ];

  return (
    <article className="case-study-page">
      <section className="case-study-hero" id="header">
        <p className="case-study-kicker">Case Study</p>
        <h1>{project.title}</h1>
      </section>
      <div className="case-study-rule" />

      <div className={`proj-hero ${project.coverClass ?? ""}`.trim()}>
        <div className="proj-hero-frame">
          {project.cover ? (
            <Image
              src={project.cover}
              alt={project.title}
              fill
              sizes="100vw"
              priority
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="proj-hero-placeholder">
              <span className="cover-label" style={{ position: "static" }}>
                {project.title}
              </span>
            </div>
          )}
        </div>
      </div>

      <section className="proj-summary">
        <h2>Project Summary</h2>
        <div className="proj-summary-meta">
          {meta.map(([label, value]) => (
            <div key={label} className="proj-summary-cell">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <p>{project.blurb}</p>
      </section>

      <section className="proj-solution-heading">
        <h2>Solution</h2>
      </section>

      <div className="container proj-content-container">
        <div className="proj-layout">
          <CaseStudySidebar items={sidebarItems} />

          <div>
            <section id="overview" className="proj-section">
              <p className="proj-section-title">Overview</p>
              <div className="proj-section-copy">
                <h4>{project.oneliner}</h4>
                <p>{project.blurb}</p>
              </div>
            </section>

            {project.memorableMoment && (
              <section id="moment" className="proj-section">
                <p className="proj-section-title">Most Memorable Moment</p>
                <div className="proj-section-copy">
                  <h4>{project.memorableMoment.title}</h4>
                  {project.memorableMoment.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}

            {project.chapters?.map((ch, i) => (
              <section
                key={i}
                id={`ch-${i + 1}`}
                className="proj-section"
              >
                <p className="proj-section-title">
                  {ch.number ?? `Chapter ${i + 1}`}
                  {ch.tags ? ` · ${ch.tags}` : ""}
                </p>
                <div className="proj-section-copy">
                  <h4>{ch.title}</h4>
                  {ch.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            {project.livePreview && (
              <section id="live" className="proj-section">
                <p className="proj-section-title">Live Preview</p>
                <p className="proj-section-copy">
                  <a
                    href={project.livePreview.href}
                    className="text-link"
                  >
                    {project.livePreview.label}
                  </a>
                </p>
              </section>
            )}

            <div className="proj-nav">
              {prev ? (
                <Link
                  href={`/work/${prev.slug}`}
                  className="proj-nav-item prev"
                >
                  <span className="proj-nav-label">Previous</span>
                  <span className="proj-nav-title">&larr; {prev.title}</span>
                </Link>
              ) : (
                <div className="proj-nav-item">
                  <span className="proj-nav-label">-</span>
                </div>
              )}
              {next ? (
                <Link
                  href={`/work/${next.slug}`}
                  className="proj-nav-item next"
                >
                  <span className="proj-nav-label">Next</span>
                  <span className="proj-nav-title">{next.title} &rarr;</span>
                </Link>
              ) : (
                <div className="proj-nav-item next">
                  <span className="proj-nav-label">-</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
