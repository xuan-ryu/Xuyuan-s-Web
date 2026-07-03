// Station-03 (Block A) flow strip: the main path told once — script,
// storyboard, shot, video — with each step's model-constraint rationale.
// This is the merge of the old board checkpoint strip and the "I rebuilt the
// main path around what the models could actually support" evidence section:
// the per-step argument lives here and only here; the deck artifact below it
// is the same argument as it was presented.
//
// Static by design (no client hooks). Alignment contract: the four columns
// share row tracks via subgrid so the claims, copy, and connection labels sit
// level even when a step name wraps to two lines (see .v-fs-* CSS in
// vicino-case-layout.tsx).

// Colors are the product's typed connections (the connection types).
type FlowStop = {
  id: string;
  label: string;
  claim: string;
  copy: string;
  conn: string;
  color: string;
};

const flowStops: FlowStop[] = [
  {
    id: "script",
    label: "Script Generator",
    claim: "Intent becomes editable",
    copy: "Video models cannot hold a long unstructured narrative, so the script node breaks intent into scenes with clear boundaries — revisable before any visual spend.",
    conn: "Output · Text #F1A0FA",
    color: "#F1A0FA",
  },
  {
    id: "storyboard",
    label: "Story Board Generator",
    claim: "Pacing becomes visible",
    copy: "One sketch frame at a time — fast to generate, cheap in credits, easy to swap — so sequence and rhythm get inspected while changing them is still cheap.",
    conn: "Output · Storyboard #6EDDB3",
    color: "#6EDDB3",
  },
  {
    id: "shoot",
    label: "Shot Node",
    claim: "Shots become concrete",
    copy: "The models cannot infer cinematography from a rough board. Camera, angle, and timing are set explicitly per shot, as high-fidelity keyframes.",
    conn: "Output · Image #6EDDB3",
    color: "#6EDDB3",
  },
  {
    id: "video",
    label: "Video Generator",
    claim: "Motion becomes output",
    copy: "The most expensive step in credits and time comes last, entered with confirmed keyframes — a preview checkpoint before motion, not instead of it.",
    conn: "Output · Video #FFB347",
    color: "#FFB347",
  },
];

export function VicinoFlowStrip() {
  return (
    <div className="v-fs-strip">
      {flowStops.map((stop, index) => (
        <div className="v-fs-stop" key={stop.id}>
          <h3 className="v-fs-name">
            <span className="v-fs-chip" style={{ background: stop.color }} aria-hidden="true" />
            <span className="v-fs-index">{String(index + 1).padStart(2, "0")}</span>
            {stop.label}
          </h3>
          <p className="v-fs-claim">{stop.claim}</p>
          <p className="v-fs-copy">{stop.copy}</p>
        </div>
      ))}
    </div>
  );
}
