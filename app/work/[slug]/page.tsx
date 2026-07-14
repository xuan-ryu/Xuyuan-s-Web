import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import type { Project, ProjectLayoutId } from "@/data/projects";
import { projectCatalog } from "@/data/project-catalog";
import { CaseStudyLayout } from "@/components/case-study-layout";
import { PosterLayout } from "@/components/poster-layout";
import { VicinoCaseLayout } from "@/components/vicino-case-layout";
import { PulseCaseLayout } from "@/components/pulse-case-layout";
import { NymaCaseLayout } from "@/components/nyma-case-layout";
import { FroghireCaseLayout } from "@/components/froghire-case-layout";
import { RoperCaseLayout } from "@/components/roper-case-layout";
import { CloudFuturesCaseLayout } from "@/components/cloud-futures-case-layout";
import { HungerPosterLayout } from "@/components/hunger-poster-layout";
import { VrmbPosterLayout } from "@/components/vrmb-poster-layout";

// Case Layout is an explicit Project choice. The exhaustive registry keeps
// content registration separate from the presentation adapters while making
// a missing adapter a type error.
const layoutAdapters = {
  case: CaseStudyLayout,
  poster: PosterLayout,
  pulse: PulseCaseLayout,
  nyma: NymaCaseLayout,
  vicino: VicinoCaseLayout,
  froghire: FroghireCaseLayout,
  roper: RoperCaseLayout,
  "cloud-futures": CloudFuturesCaseLayout,
  hunger: HungerPosterLayout,
  vrmb: VrmbPosterLayout,
} satisfies Record<
  ProjectLayoutId,
  ComponentType<{ project: Project }>
>;

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projectCatalog.all.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: WorkPageProps,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projectCatalog.get(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.blurb.split("\n\n")[0],
  };
}

export default async function CaseStudy(props: WorkPageProps) {
  const { slug } = await props.params;
  const project = projectCatalog.get(slug);
  if (!project) notFound();

  const Layout = layoutAdapters[project.layout];
  return <Layout project={project} />;
}
