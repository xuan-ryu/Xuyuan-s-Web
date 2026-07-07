import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { projects, projectsBySlug, type Project } from "@/data/projects";
import { CaseStudyLayout } from "@/components/case-study-layout";
import { PosterLayout } from "@/components/poster-layout";
import { VicinoCaseLayout } from "@/components/vicino-case-layout";
import { PulseCaseLayout } from "@/components/pulse-case-layout";
import { FroghireCaseLayout } from "@/components/froghire-case-layout";
import { RoperCaseLayout } from "@/components/roper-case-layout";
import { CloudFuturesCaseLayout } from "@/components/cloud-futures-case-layout";
import { HungerPosterLayout } from "@/components/hunger-poster-layout";
import { VrmbPosterLayout } from "@/components/vrmb-poster-layout";

// Every project has a bespoke layout rooted in its own material (the vicino
// precedent, generalized). The shared templates remain as fallbacks for any
// future project that hasn't earned a bespoke treatment yet.
const bespokeLayouts: Record<string, ComponentType<{ project: Project }>> = {
  "vicino-ai": VicinoCaseLayout,
  pulse: PulseCaseLayout,
  "froghire-ai": FroghireCaseLayout,
  "roper-center": RoperCaseLayout,
  "cloud-support-futures": CloudFuturesCaseLayout,
  hunger1942: HungerPosterLayout,
  "vr-education": VrmbPosterLayout,
};

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: WorkPageProps,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projectsBySlug[slug];
  if (!project) return {};
  return {
    title: project.title,
    description: project.blurb.split("\n\n")[0],
  };
}

export default async function CaseStudy(props: WorkPageProps) {
  const { slug } = await props.params;
  const project = projectsBySlug[slug];
  if (!project) notFound();

  const Layout =
    bespokeLayouts[project.slug] ??
    (project.template === "poster" ? PosterLayout : CaseStudyLayout);
  return <Layout project={project} />;
}
