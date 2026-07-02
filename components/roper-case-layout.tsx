import { CaseStudyLayout } from "@/components/case-study-layout";
import type { Project } from "@/data/projects";

// Stub: Roper Center's bespoke "ledger and weathervane" layout lands here
// (art-direction spec: scratchpad specs/spec-roper.json). Until then it
// renders the shared template unchanged.
export function RoperCaseLayout({ project }: { project: Project }) {
  return <CaseStudyLayout project={project} />;
}
