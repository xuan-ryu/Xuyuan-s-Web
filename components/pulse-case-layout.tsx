import { CaseStudyLayout } from "@/components/case-study-layout";
import type { Project } from "@/data/projects";

// Stub: Pulse's bespoke "printed specimen document" layout lands here
// (art-direction spec: scratchpad specs/spec-pulse.json). Until then it
// renders the shared template unchanged.
export function PulseCaseLayout({ project }: { project: Project }) {
  return <CaseStudyLayout project={project} />;
}
