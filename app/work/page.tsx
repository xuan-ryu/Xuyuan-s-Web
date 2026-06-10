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
      <section className="px-6 md:px-10 pt-40 pb-16 md:pb-24">
        <span className="text-eyebrow">Selected · 2022 – 2026</span>
        <h1 className="mt-4 text-display text-[clamp(3rem,10vw,9rem)] leading-[0.95]">
          My Work
        </h1>
        <p className="mt-8 max-w-2xl text-ink-muted text-lg leading-relaxed">
          Five projects across product design, education, games, and immersive
          media. Each one is a short study in what changes when constraints
          shift — team size, timeline, audience, or the tools available.
        </p>
      </section>

      <section className="px-6 md:px-10 pb-24 grid md:grid-cols-2 gap-8">
        {sorted.map((p) => (
          <WorkCard key={p.slug} project={p} />
        ))}
      </section>

      <CtaBlock />
    </>
  );
}
