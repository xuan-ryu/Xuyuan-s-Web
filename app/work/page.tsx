import type { Metadata } from "next";
import { projects, type Project } from "@/data/projects";
import { WorkCard } from "@/components/work-card";
import { RevealText } from "@/components/text-reveal";
import { WorkParticleBackground } from "@/components/work-particle-background";
import { WorkViewControls } from "@/components/work-view-controls";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects by Xuyuan Liu.",
};

const workGroups = [
  {
    id: "uiux",
    index: "01",
    title: "UI/UX",
    projectSlugs: ["pulse", "vicino-ai", "froghire-ai", "roper-center"],
  },
  {
    id: "interaction-games",
    index: "02",
    title: "Interaction & Games",
    projectSlugs: ["hunger1942", "vr-education"],
  },
] as const;

export default function WorkIndex() {
  const sorted = [...projects].sort((a, b) => a.order - b.order);
  const projectsBySlug = new Map(sorted.map((project) => [project.slug, project]));

  return (
    <div className="work-index-page" data-work-view="list">
      <WorkParticleBackground />
      <section className="work-header" id="header">
        <h1 className="work-title-reveal" data-fade>
          <RevealText text="My Work" mode="char" />
        </h1>
        <WorkViewControls />
      </section>

      <section className="work-list">
        {workGroups.map((group) => {
          const groupProjects = group.projectSlugs
            .map((slug) => projectsBySlug.get(slug))
            .filter((project): project is Project => Boolean(project));

          return (
            <section
              className="work-category"
              data-work-category={group.id}
              key={group.id}
              aria-labelledby={`work-category-${group.id}`}
            >
              <div className="work-category-header">
                <span className="work-category-index">{group.index}</span>
                <h2 id={`work-category-${group.id}`}>{group.title}</h2>
              </div>
              <div className="work-grid">
                {groupProjects.map((project) => (
                  <WorkCard key={project.slug} project={project} />
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </div>
  );
}
