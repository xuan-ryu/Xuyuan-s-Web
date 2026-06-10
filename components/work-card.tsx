import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export function WorkCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="project-card work-feature-card fade-up"
      data-fade
    >
      <div className={`project-cover ${project.coverClass ?? ""}`.trim()}>
        {project.cover ? (
          <Image
            src={project.cover}
            alt={project.title}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className="cover-label">{project.title}</span>
        )}
      </div>

      <div className="work-card-shade" />
      <div className="work-card-title">{project.title}</div>
      <div className="work-card-copy">
        {project.blurb.split("\n\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <span className="work-card-button">View Project</span>
    </Link>
  );
}
