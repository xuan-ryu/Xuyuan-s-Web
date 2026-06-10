import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { WorkCard } from "@/components/work-card";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects by Xuyuan Liu.",
};

export default function WorkIndex() {
  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <div className="work-index-page">
      <section className="work-header" id="header">
        <h1 data-fade>My Work</h1>
        <div className="work-view-controls" aria-hidden="true">
          <span className="work-list-icon">
            <span />
            <span />
            <span />
          </span>
          <span className="work-card-icon">
            <span />
          </span>
        </div>
      </section>

      <section className="work-list">
        <div className="work-grid">
          {sorted.map((p) => (
            <WorkCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
