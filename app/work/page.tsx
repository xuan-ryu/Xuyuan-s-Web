import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { WorkCard } from "@/components/work-card";
import { RevealText } from "@/components/text-reveal";
import { WorkParticleBackground } from "@/components/work-particle-background";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects by Xuyuan Liu.",
};

export default function WorkIndex() {
  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <div className="work-index-page">
      <WorkParticleBackground />
      <section className="work-header" id="header">
        <h1 className="work-title-reveal" data-fade>
          <RevealText text="My Work" mode="char" />
        </h1>
        <div className="work-view-controls" aria-hidden="true">
          <span className="work-list-icon">
            <svg viewBox="0 0 28 28" focusable="false">
              <path d="M4.5 7.5h19" />
              <path d="M4.5 14h19" />
              <path d="M4.5 20.5h19" />
            </svg>
          </span>
          <span className="work-card-icon">
            <svg viewBox="0 0 44 44" focusable="false">
              <rect className="work-card-icon-shell" width="44" height="44" rx="22" />
              <rect className="work-card-icon-window" x="11" y="12" width="22" height="18" rx="2" />
              <path className="work-card-icon-line" d="M15 18h14M15 24h10" />
            </svg>
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
