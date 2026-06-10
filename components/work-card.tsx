import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export function WorkCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="project-card fade-up"
      data-fade
    >
      <div className={`project-cover ${project.coverClass ?? ""}`.trim()}>
        {project.cover ? (
          <Image
            src={project.cover}
            alt={project.title}
            fill
            sizes="(max-width: 680px) 100vw, 540px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className="cover-label">{project.title}</span>
        )}
      </div>
      <div className="project-body">
        <div className="project-tags">
          {project.tags.map((t) => (
            <span key={t} className="pill">
              {t}
            </span>
          ))}
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-oneliner">{project.oneliner}</p>
        <span className="text-link" style={{ marginTop: "8px" }}>
          View project
        </span>
      </div>
    </Link>
  );
}
