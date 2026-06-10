import Image from "next/image";
import Link from "next/link";
import { adjacent, type Project } from "@/data/projects";

export function CaseStudyLayout({ project }: { project: Project }) {
  const { prev, next } = adjacent(project.slug);

  return (
    <article className="pt-32 md:pt-40">
      <header className="px-6 md:px-10 pb-16 md:pb-24">
        <span className="text-eyebrow">{`Project · ${String(project.order).padStart(2, "0")}`}</span>
        <h1 className="text-display text-[clamp(3rem,10vw,9rem)] leading-[0.95] mt-4 uppercase">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-ink-muted text-lg leading-relaxed">
          {project.blurb}
        </p>
      </header>

      <div className="px-6 md:px-10 relative aspect-[16/9] md:aspect-[21/9] overflow-hidden border-y border-rule">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      <section className="px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-4 gap-x-10 gap-y-10 border-b border-rule">
        <Meta label="Role" value={project.role} />
        <Meta label="Duration" value={project.duration} />
        <Meta label="Type" value={project.type} />
        <Meta label="Teams" value={project.teams} />
      </section>

      {project.memorableMoment && (
        <section className="px-6 md:px-10 py-20 md:py-32 max-w-4xl">
          <span className="text-eyebrow">Most Memorable Moment</span>
          <h2 className="text-display text-3xl md:text-5xl mt-4 leading-tight italic font-light">
            {project.memorableMoment.title}
          </h2>
          <div className="mt-10 space-y-6 text-ink-muted text-lg leading-relaxed">
            {project.memorableMoment.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {project.chapters && project.chapters.length > 0 && (
        <section className="px-6 md:px-10 pb-20 md:pb-32 space-y-24">
          {project.chapters.map((ch, i) => (
            <div key={i} className="max-w-4xl">
              {ch.number && (
                <span className="text-eyebrow">{ch.number}</span>
              )}
              <h3 className="text-display text-2xl md:text-4xl mt-4 leading-tight">
                {ch.title}
              </h3>
              {ch.tags && (
                <p className="mt-3 text-eyebrow">{ch.tags}</p>
              )}
              <div className="mt-8 space-y-5 text-ink-muted text-base md:text-lg leading-relaxed">
                {ch.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {project.livePreview && (
        <section className="px-6 md:px-10 pb-20">
          <span className="text-eyebrow">Live Preview</span>
          <p className="mt-2 text-2xl text-display">{project.livePreview.label}</p>
        </section>
      )}

      <nav className="border-t border-rule px-6 md:px-10 py-10 grid grid-cols-2 gap-6">
        {prev ? (
          <Link href={`/work/${prev.slug}`} className="group">
            <span className="text-eyebrow">Previous</span>
            <p className="text-display text-xl md:text-2xl mt-2 group-hover:underline">
              ← {prev.title}
            </p>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/work/${next.slug}`}
            className="group text-right justify-self-end"
          >
            <span className="text-eyebrow">Next</span>
            <p className="text-display text-xl md:text-2xl mt-2 group-hover:underline">
              {next.title} →
            </p>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-eyebrow">{label}</span>
      <p className="mt-2 text-ink leading-snug">{value}</p>
    </div>
  );
}
