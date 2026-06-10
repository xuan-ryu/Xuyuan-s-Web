import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { WorkCard } from "@/components/work-card";
import { CtaBlock } from "@/components/cta-block";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects by Xuyuan Liu.",
};

export default function WorkIndex() {
  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <>
      <section className="work-header">
        <div className="container">
          <p className="label" data-fade>
            Portfolio · 2022 – 2026
          </p>
          <h1 data-fade>My Work</h1>
          <p data-fade>
            Five projects across product, education, games, and immersive
            media — each a short study in what shifts when the constraints
            change.
          </p>
          <p className="work-count">
            {String(sorted.length).padStart(2, "0")} projects
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="work-grid">
            {sorted.map((p) => (
              <WorkCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
