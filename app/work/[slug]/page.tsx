import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, projectsBySlug } from "@/data/projects";
import { CaseStudyLayout } from "@/components/case-study-layout";
import { PosterLayout } from "@/components/poster-layout";
import { VicinoCaseLayout } from "@/components/vicino-case-layout";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projectsBySlug[slug];
  if (!project) return {};
  return {
    title: project.title,
    description: project.blurb.split("\n\n")[0],
  };
}

export default async function CaseStudy(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = projectsBySlug[slug];
  if (!project) notFound();

  return project.slug === "vicino-ai" ? (
    <VicinoCaseLayout project={project} />
  ) : project.template === "poster" ? (
    <PosterLayout project={project} />
  ) : (
    <CaseStudyLayout project={project} />
  );
}
