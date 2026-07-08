import type { ProjectOutcomes } from "@/data/projects";

// Outcome band — the recruiter's at-a-glance row (audit #1 request):
// role lives in each hero's meta rail; this band adds the three outcome
// bullets and the one hard number, before the story starts. One quiet
// table-row: mono eyebrow, three short bullets, a single large numeral.
// Hairline top/bottom, no card, no box.
//
// Voice contract: the band inherits each page's typography by rendering
// inside the page's scoped stage, and exposes --ob-* variables that fall
// back to the case-accent contract (--case-accent / --case-detail) and
// the shared work-shell tokens. Pages append OUTCOME_BAND_CSS into their
// scoped style string and may re-tune the --ob-* knobs there.
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

export const OUTCOME_BAND_CSS = `
.ob-band {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--ob-max, var(--work-shell-max, 1440px));
  margin-inline: auto;
  padding: clamp(24px, 2.6vw, 34px) var(--ob-pad-x, var(--work-gutter, clamp(24px, 5vw, 72px)));
  display: grid;
  grid-template-columns: minmax(110px, 2fr) minmax(0, 7fr) minmax(150px, 3fr);
  column-gap: var(--ob-gap, var(--work-grid-gap, clamp(18px, 2.3vw, 32px)));
  row-gap: 0;
  align-items: center;
  border-top: 1px solid var(--ob-rule, var(--work-rule, rgba(5, 5, 5, 0.14)));
  border-bottom: 1px solid var(--ob-rule, var(--work-rule, rgba(5, 5, 5, 0.14)));
  border-radius: 0;
  background: none;
}
.ob-eyebrow {
  margin: 0;
  font-family: var(--ob-mono, var(--font-mono, ui-monospace, SFMono-Regular, monospace));
  font-size: var(--text-label, 11px);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ob-detail, var(--case-detail, var(--case-accent, currentColor)));
}
.ob-bullets {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--ob-gap, var(--work-grid-gap, clamp(18px, 2.3vw, 32px)));
  align-items: start;
}
.ob-bullets li {
  position: relative;
  padding-left: 15px;
  font-size: var(--text-meta, 14px);
  font-weight: 400;
  line-height: 1.5;
  color: var(--ob-body, inherit);
  text-wrap: pretty;
}
.ob-bullets li::before {
  content: "";
  position: absolute;
  left: 0;
  top: calc(var(--ob-li-pad, 0px) + 0.7em);
  width: 7px;
  height: 1px;
  background: var(--ob-detail, var(--case-detail, var(--case-accent, currentColor)));
}
.ob-stat {
  margin: 0;
  justify-self: end;
  display: grid;
  justify-items: end;
  row-gap: 6px;
  text-align: right;
}
.ob-stat strong {
  font-family: var(--ob-stat-font, inherit);
  font-size: clamp(30px, 2.75vw, 42px);
  font-weight: var(--ob-stat-weight, 600);
  line-height: 0.95;
  letter-spacing: -0.01em;
  color: var(--ob-stat-ink, inherit);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ob-stat span {
  font-family: var(--ob-mono, var(--font-mono, ui-monospace, SFMono-Regular, monospace));
  font-size: var(--text-label, 11px);
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ob-body, inherit);
  opacity: 0.62;
}
@media (max-width: 1079.98px) {
  .ob-band {
    grid-template-columns: minmax(0, 1fr) auto;
    row-gap: 20px;
    align-items: baseline;
  }
  .ob-bullets {
    grid-column: 1 / -1;
  }
}
@media (max-width: 809.98px) {
  .ob-band {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0;
    padding-block: 18px;
    align-items: start;
  }
  .ob-eyebrow {
    padding-bottom: 14px;
  }
  .ob-bullets {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0;
  }
  .ob-bullets li {
    --ob-li-pad: 10px;
    padding-block: 10px;
    border-top: 1px solid var(--ob-rule, var(--work-rule, rgba(5, 5, 5, 0.14)));
  }
  .ob-stat {
    justify-self: start;
    justify-items: start;
    text-align: left;
    width: 100%;
    padding-top: 16px;
    border-top: 1px solid var(--ob-rule, var(--work-rule, rgba(5, 5, 5, 0.14)));
  }
}
`;

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
