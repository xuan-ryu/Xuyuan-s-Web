import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { RevealText } from "@/components/text-reveal";

export function WorkCard({ project }: { project: Project }) {
  const displayTitle =
    project.slug === "froghire-ai" ? "FROGHIRE. AI" : project.title;

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
            sizes="(min-width: 1080px) min(1200px, calc(100vw - 144px)), (min-width: 810px) calc(100vw - 88px), calc(100vw - 48px)"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className="cover-label">{project.title}</span>
        )}
      </div>

      <div className="work-card-shade" />
      <div className="work-card-title">
        <RevealText text={displayTitle} mode="char" direction="right" delay={120} />
      </div>
      <div className="work-card-copy">
        {project.blurb.split("\n\n").map((paragraph, index) => (
          <p key={paragraph} className="work-card-copy-line">
            <RevealText
              text={paragraph}
              mode="line"
              direction="left"
              delay={220 + index * 120}
            />
          </p>
        ))}
      </div>
      <span className="work-card-button">View Project</span>
    </Link>
  );
}
