import Image from "next/image";
import Link from "next/link";
import { adjacent, type Project } from "@/data/projects";

export function CaseStudyLayout({ project }: { project: Project }) {
  const { prev, next } = adjacent(project.slug);

  return (
    <article>
      <div className={`proj-hero ${project.coverClass ?? ""}`.trim()}>
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="cover-label" style={{ position: "static" }}>
              {project.title}
            </span>
          </div>
        )}
      </div>

      <section className="proj-intro">
        <div className="container">
          <p className="proj-eyebrow label">
            Project · {String(project.order).padStart(2, "0")}
          </p>
          <h1 className="proj-title">{project.title}</h1>
          <p className="proj-oneliner">{project.blurb}</p>
        </div>
      </section>

      <div className="container">
        <div className="proj-meta">
          <div className="meta-cell">
            <div className="meta-label">Role</div>
            <div className="meta-value">{project.role}</div>
          </div>
          <div className="meta-cell">
            <div className="meta-label">Duration</div>
            <div className="meta-value">{project.duration}</div>
          </div>
          <div className="meta-cell">
            <div className="meta-label">Type</div>
            <div className="meta-value">{project.type}</div>
          </div>
          <div className="meta-cell">
            <div className="meta-label">Teams</div>
            <div className="meta-value">{project.teams}</div>
          </div>
        </div>

        <div className="proj-layout">
          <aside className="proj-sidebar">
            <nav>
              <a href="#overview">Overview</a>
              {project.memorableMoment && (
                <a href="#moment">Moment</a>
              )}
              {project.chapters?.map((ch, i) => (
                <a key={i} href={`#ch-${i + 1}`}>
                  {ch.number ?? `Ch ${i + 1}`}
                </a>
              ))}
              {project.livePreview && <a href="#live">Live</a>}
            </nav>
          </aside>

          <div>
            <section id="overview" className="proj-section">
              <p className="proj-section-title">Overview</p>
              <p>{project.blurb}</p>
            </section>

            {project.memorableMoment && (
              <section id="moment" className="proj-section">
                <p className="proj-section-title">Most Memorable Moment</p>
                <h4>{project.memorableMoment.title}</h4>
                {project.memorableMoment.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
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
                <h4>{ch.title}</h4>
                {ch.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </section>
            ))}

            {project.livePreview && (
              <section id="live" className="proj-section">
                <p className="proj-section-title">Live Preview</p>
                <p>
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
                  <span className="proj-nav-title">← {prev.title}</span>
                </Link>
              ) : (
                <div className="proj-nav-item">
                  <span className="proj-nav-label">—</span>
                </div>
              )}
              {next ? (
                <Link
                  href={`/work/${next.slug}`}
                  className="proj-nav-item next"
                >
                  <span className="proj-nav-label">Next</span>
                  <span className="proj-nav-title">{next.title} →</span>
                </Link>
              ) : (
                <div className="proj-nav-item next">
                  <span className="proj-nav-label">—</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
