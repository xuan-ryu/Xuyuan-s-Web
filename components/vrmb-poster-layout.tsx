import { PosterLayout } from "@/components/poster-layout";
import type { Project } from "@/data/projects";

// Stub: VR Monarch Butterfly's bespoke "naturalist's field folio" layout
// lands here (art-direction spec: scratchpad specs/spec-vr-butterfly.json).
// Until then it renders the shared poster template unchanged.
export function VrmbPosterLayout({ project }: { project: Project }) {
  return <PosterLayout project={project} />;
}
