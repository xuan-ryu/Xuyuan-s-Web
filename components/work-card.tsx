import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { RevealText } from "@/components/text-reveal";

export function WorkCard({ project }: { project: Project }) {
  const displayTitle =
    project.slug === "froghire-ai" ? "FROGHIRE. AI" : project.title;
  const listTitle =
    project.slug === "vr-education" ? (
      <>
        <span className="work-title-line">VR MONARCH</span>
        <br />
        <span className="work-title-line">BUTTERFLY</span>
      </>
    ) : (
      displayTitle
    );

  return (
    <Link
      href={`/work/${project.slug}`}
      className="project-card work-feature-card fade-up"
      data-fade
      data-project-slug={project.slug}
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
        <span className="work-title-index">{listTitle}</span>
        <RevealText
          text={displayTitle}
          className="work-title-card"
          mode="char"
          direction="right"
          delay={120}
        />
      </div>
      <div className="work-card-copy">
        {(project.cardBlurb ?? project.blurb).split("\n\n").map((paragraph, index) => (
          <p key={paragraph} className="work-card-copy-line">
            <RevealText
              text={paragraph}
              mode="line"
              direction="up"
              delay={220 + index * 120}
            />
          </p>
        ))}
      </div>
      <span className="work-card-button cta cta--solid">View Project</span>
    </Link>
  );
}
