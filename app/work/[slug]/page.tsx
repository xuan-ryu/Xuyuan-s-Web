import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, projectsBySlug } from "@/data/projects";
import { CaseStudyLayout } from "@/components/case-study-layout";
import { CtaBlock } from "@/components/cta-block";

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
    description: project.blurb,
  };
}

export default async function CaseStudy(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = projectsBySlug[slug];
  if (!project) notFound();

  return (
    <>
      <CaseStudyLayout project={project} />
      <CtaBlock />
    </>
  );
}
