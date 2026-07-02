import { CaseStudyLayout } from "@/components/case-study-layout";
import type { Project } from "@/data/projects";

// Stub: FrogHire's bespoke "triage ledger" layout lands here (art-direction
// spec: scratchpad specs/spec-froghire.json). Until then it renders the
// shared template unchanged.
export function FroghireCaseLayout({ project }: { project: Project }) {
  return <CaseStudyLayout project={project} />;
}
