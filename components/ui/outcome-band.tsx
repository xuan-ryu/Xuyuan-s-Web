import type { ProjectOutcomes } from "@/data/projects";
import "./outcome-band.css";

// Outcome band — the recruiter's at-a-glance row (audit #1 request):
// role lives in each hero's meta rail; this band adds the three outcome
// bullets and the one hard number, before the story starts. One quiet
// table-row: mono eyebrow, three short bullets, a single large numeral.
// Hairline top/bottom, no card, no box.
//
// Voice contract: the band inherits each page's typography by rendering
// inside the page's scoped stage, and exposes --ob-* variables that fall
// back to the case-accent contract (--case-accent / --case-detail) and
// the shared work-shell tokens. The module owns its base stylesheet; pages
// may re-tune the --ob-* knobs or add page-scoped overrides.
//
//   --ob-max        band max-width          (default --work-shell-max)
//   --ob-pad-x      horizontal padding      (default --work-gutter)
//   --ob-gap        column gap              (default --work-grid-gap)
//   --ob-rule       hairline color          (default --work-rule)
//   --ob-detail     eyebrow + tick color    (default --case-detail → --case-accent)
//   --ob-body       bullet text color       (default inherit)
//   --ob-mono       eyebrow/label face      (default --font-mono)
//   --ob-stat-ink   numeral color           (default inherit)
//   --ob-stat-font  numeral face            (default inherit)

export function OutcomeBand({
  outcomes,
  className = "",
}: {
  outcomes: ProjectOutcomes;
  className?: string;
}) {
  return (
    <section
      className={className ? `ob-band ${className}` : "ob-band"}
      aria-label="Outcomes at a glance"
      data-fade
    >
      <p className="ob-eyebrow">At a glance</p>
      <ul className="ob-bullets">
        {outcomes.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <p className="ob-stat">
        <strong>{outcomes.stat.value}</strong>
        <span>{outcomes.stat.label}</span>
      </p>
    </section>
  );
}
