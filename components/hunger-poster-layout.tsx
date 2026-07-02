import { PosterLayout } from "@/components/poster-layout";
import type { Project } from "@/data/projects";

// Stub: Hunger 1942's bespoke "the 1942 edition" broadsheet layout lands here
// (art-direction spec: scratchpad specs/spec-hunger1942.json). Until then it
// renders the shared poster template unchanged.
export function HungerPosterLayout({ project }: { project: Project }) {
  return <PosterLayout project={project} />;
}
