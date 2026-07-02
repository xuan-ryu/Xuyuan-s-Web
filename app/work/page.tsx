// /work — 检索, the printed catalogue index.
//
// One Müller-Brockmann catalogue table on paper: continuous mono numerals
// 01–06, condensed ink entries, tabular meta (discipline / year), a sticky
// category thumb-tab in the left margin, and a "plate" (the project's real
// cover / preview clip) that slips in from the right margin on hover/focus.
// The old card view, icon toggle, and WebGL dust are deleted by design — the
// case pages are the cinema, the index is the card catalogue. Server
// component; the only client bit is the small hover-video helper
// (components/work-index-plate.tsx).
//
// Grid: the shared case-shell — max-width var(--work-shell-max) 1440px,
// margins var(--work-gutter), 12 columns, gutters var(--work-grid-gap),
// 8px baseline, 144px row module. Rail cols 1–2 (sticky), rows cols 3–12;
// in a row: numeral col 3, title flush on the col-4 edge, discipline cols
// 10–11, year on the col-12 edge; plate spans cols 9–12. Styles live below
// (prefix .wki-) per the repo's component-owned <style> pattern.

import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { projects, projectsBySlug, type Project } from "@/data/projects";
import { Cta } from "@/components/ui/cta";
import { WorkIndexPlate } from "@/components/work-index-plate";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects by Xuyuan Liu.",
};

const workGroups = [
  {
    id: "uiux",
    index: "01",
    title: "UI/UX",
    projectSlugs: ["pulse", "vicino-ai", "froghire-ai", "roper-center"],
  },
  {
    id: "interaction-games",
    index: "02",
    title: "Interaction & Games",
    projectSlugs: ["hunger1942", "vr-education"],
  },
] as const;

// The index needs a clean 4–7 char year column; duration strings in data are
// inconsistent ("2025 - present", "09/2022-04/2024"), so format here — no
// data-model change (coherence adjustment).
function displayYear(project: Project): string {
  const source = project.poster?.details.year ?? project.duration;
  const years = [...source.matchAll(/(?:19|20)\d{2}/g)].map((m) => Number(m[0]));
  if (years.length === 0) return "";
  const start = Math.min(...years);
  const end = Math.max(...years);
  if (/present/i.test(source)) return `${start}–`;
  if (end > start) return `${start}–${String(end).slice(2)}`;
  return String(start);
}

function yearRange(list: Project[]): string {
  const sources = list.map((p) => p.poster?.details.year ?? p.duration);
  const years = sources.flatMap((s) =>
    [...s.matchAll(/(?:19|20)\d{2}/g)].map((m) => Number(m[0])),
  );
  const min = Math.min(...years);
  const max = sources.some((s) => /present/i.test(s))
    ? new Date().getFullYear()
    : Math.max(...years);
  return `${min}—${max}`;
}

export default function WorkIndex() {
  // continuous catalogue numerals 01–06 across categories
  let counter = 0;
  const groups = workGroups.map((group) => ({
    ...group,
    rows: group.projectSlugs
      .map((slug) => projectsBySlug[slug])
      .filter((project): project is Project => Boolean(project))
      .map((project, groupRow) => ({
        project,
        groupRow,
        numeral: String(++counter).padStart(2, "0"),
      })),
  }));
  return (
    <div className="wki-page">
      <header className="wki-header">
        <p className="wki-eyebrow" data-fade>
          Selected Work · {yearRange(projects)}
        </p>
        <h1 className="wki-title" data-fade>
          My Work
        </h1>
        <nav className="wki-jump" aria-label="Work categories" data-fade>
          {groups.map((group) => (
            <Cta
              key={group.id}
              href={`#work-category-${group.id}`}
              variant="quiet"
              className="wki-jump-link"
            >
              {group.title}
            </Cta>
          ))}
        </nav>
      </header>

      <div className="wki-list">
        {groups.map((group) => (
          <section
            key={group.id}
            id={`work-category-${group.id}`}
            className="wki-category"
            aria-labelledby={`work-category-${group.id}-title`}
          >
            {/* sticky thumb-tab in the left margin (cols 1–2) */}
            <header className="wki-rail">
              <h2 className="wki-rail-title" id={`work-category-${group.id}-title`}>
                {group.title}
              </h2>
            </header>

            <ol className="wki-rows">
              {group.rows.map(({ project, numeral, groupRow }) => (
                <li
                  key={project.slug}
                  className="wki-row"
                  data-fade
                  style={{ "--wki-i": groupRow } as CSSProperties}
                >
                  <Link href={`/work/${project.slug}`} className="wki-row-link">
                    <span className="wki-row-num" aria-hidden="true">
                      {numeral}
                    </span>
                    <span className="wki-row-title">{project.title}</span>
                    <span className="wki-row-meta wki-row-discipline">
                      {project.tags[0]}
                    </span>
                    <span className="wki-row-meta wki-row-year">
                      {displayYear(project)}
                    </span>
                    <WorkIndexPlate
                      title={project.title}
                      cover={project.cover}
                      previewVideo={project.previewVideo}
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}

        {/* index colophon — the quiet exit on the same table span */}
        <div className="wki-colophon" data-fade>
          <div className="wki-colophon-inner">
            <Cta href="/contact" variant="quiet">
              Get in Touch
            </Cta>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* ── 检索 · the printed catalogue index (prefix wki-) ─────────
           12-col case-shell, 8px baseline, 144px row module. All red on
           this page is the seal tick; gold = the static fallback-plate
           rule; amber = focus rings only (global .cta contract). */
        .wki-page {
          --work-shell-max: 1440px;
          --work-gutter: clamp(24px, 5vw, 72px);
          --work-grid-gap: clamp(18px, 2.3vw, 32px);
          --work-rule: rgba(5, 5, 5, 0.14);
          --wki-rule-hover: rgba(5, 5, 5, 0.28);
          --wki-meta-ink: rgba(5, 5, 5, 0.48);
          --wki-row-pad: var(--space-8);
          /* optical drop from the title's box top to its cap line — keeps
             numerals/meta on the cap line of the condensed titles */
          --wki-cap-nudge: calc(0.07 * var(--text-display-3));
          background: var(--paper);
          color: var(--ink-950);
          font-family: var(--font-text);
        }

        /* ── 1 · index header ─────────────────────────────────────── */
        .wki-header {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          column-gap: var(--work-grid-gap);
          row-gap: var(--space-5);
          align-items: end;
          width: 100%;
          max-width: var(--work-shell-max);
          margin-inline: auto;
          padding: clamp(180px, 17vw, 245px) var(--work-gutter) var(--space-11);
        }
        .wki-eyebrow {
          grid-column: 1 / 5;
          grid-row: 1;
          margin: 0;
          font-size: var(--text-label);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--wki-meta-ink);
        }
        .wki-title {
          grid-column: 1 / 10;
          grid-row: 2;
          margin: 0;
          font-family: var(--font-condensed);
          font-size: var(--text-display-1);
          font-weight: 300;
          line-height: 0.9;
          letter-spacing: var(--track-display);
          text-transform: uppercase;
          color: var(--ink-950);
        }
        .wki-jump {
          grid-column: 10 / 12;
          grid-row: 2;
          align-self: end;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-3);
        }
        /* ── 2/3 · the catalogue table ────────────────────────────── */
        .wki-list {
          width: 100%;
          max-width: var(--work-shell-max);
          margin-inline: auto;
          padding: 0 var(--work-gutter) clamp(120px, 12vw, 192px);
        }
        .wki-category {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          column-gap: var(--work-grid-gap);
          align-items: start;
          scroll-margin-top: 120px;
        }
        .wki-category + .wki-category {
          margin-top: 96px;
        }
        .wki-rail {
          grid-column: 1 / 3;
          position: sticky;
          top: 96px;
          padding-top: calc(var(--wki-row-pad) + var(--wki-cap-nudge));
        }
        .wki-rail-title {
          margin: 0;
          font-size: var(--text-title);
          font-weight: 400;
          line-height: var(--leading-tight);
          color: var(--ink-950);
        }

        .wki-rows {
          grid-column: 3 / -1;
          margin: 0;
          padding: 0;
          list-style: none;
          border-top: 1px solid var(--work-rule);
        }
        .wki-row {
          position: relative;
          border-bottom: 1px solid var(--work-rule);
          transition: border-color 0.24s ease;
        }
        .wki-row:hover,
        .wki-row:focus-within {
          border-color: var(--wki-rule-hover);
        }
        .wki-row-link {
          position: relative;
          display: grid;
          grid-template-columns: repeat(10, minmax(0, 1fr));
          column-gap: var(--work-grid-gap);
          align-items: start;
          min-height: 144px;
          padding: var(--wki-row-pad) 0;
          text-decoration: none;
          color: inherit;
          outline: none;
        }
        /* the seal tick — the page's one red moment; wipes down like a
           brush pull, cap height to baseline, at the row's col-3 edge */
        .wki-row-link::before {
          content: "";
          position: absolute;
          left: calc(var(--work-grid-gap) / -2);
          top: calc(var(--wki-row-pad) + var(--wki-cap-nudge));
          width: 2px;
          height: calc(0.7 * var(--text-display-3));
          background: var(--accent-red);
          opacity: 0;
          transform: scaleY(0);
          transform-origin: top;
          transition:
            transform 0.3s var(--ease-silk),
            opacity 0.2s ease;
          pointer-events: none;
        }
        .wki-row-link:hover::before,
        .wki-row-link:focus-visible::before {
          opacity: 1;
          transform: scaleY(1);
        }
        .wki-row-num {
          grid-column: 1 / 2;
          padding-top: var(--wki-cap-nudge);
          font-family: var(--font-mono);
          font-size: var(--text-label);
          font-weight: 400;
          letter-spacing: 0.08em;
          color: var(--stone);
        }
        .wki-row-title {
          grid-column: 2 / 8;
          font-family: var(--font-condensed);
          font-size: var(--text-display-3);
          font-weight: 300;
          line-height: 0.94;
          letter-spacing: 0;
          text-transform: uppercase;
          color: var(--ink-950);
          transition: transform 0.34s var(--ease-silk);
        }
        .wki-row-link:hover .wki-row-title,
        .wki-row-link:focus-visible .wki-row-title {
          transform: translateX(20px);
        }
        .wki-row-meta {
          padding-top: var(--wki-cap-nudge);
          font-size: var(--text-label);
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--wki-meta-ink);
          transition:
            opacity 0.24s ease,
            transform 0.24s ease;
        }
        .wki-row-discipline {
          grid-column: 8 / 10;
        }
        .wki-row-year {
          grid-column: 10 / 11;
          justify-self: end;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        /* meta yields to the plate sliding in over its columns */
        .wki-row-link:hover .wki-row-meta,
        .wki-row-link:focus-visible .wki-row-meta {
          opacity: 0;
          transform: translateX(8px);
        }

        /* ── the plate — a print pulled from the sleeve (cols 9–12) ── */
        .wki-plate {
          position: absolute;
          top: 50%;
          right: 0;
          z-index: 3;
          width: calc(
            ((100% - 9 * var(--work-grid-gap)) / 10) * 4 +
              3 * var(--work-grid-gap)
          );
          aspect-ratio: 16 / 10;
          border-radius: var(--radius-thumb);
          overflow: hidden;
          background: var(--ink-950);
          box-shadow: 0 10px 24px rgba(5, 5, 5, 0.08);
          opacity: 0;
          transform: translate(40px, -50%) scale(0.97);
          transition:
            opacity 0.34s var(--ease-silk),
            transform 0.34s var(--ease-silk);
          pointer-events: none;
        }
        .wki-row-link:hover .wki-plate,
        .wki-row-link:focus-visible .wki-plate {
          opacity: 1;
          transform: translate(0, -50%) scale(1);
        }
        .wki-plate-img,
        .wki-plate-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .wki-plate-video {
          z-index: 1;
        }
        .wki-plate-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--ink-950);
        }
        .wki-plate-fallback-title {
          padding-bottom: var(--space-2);
          border-bottom: 2px solid var(--accent-gold);
          font-family: var(--font-condensed);
          font-size: var(--text-title);
          font-weight: 300;
          line-height: 1;
          letter-spacing: var(--track-display);
          text-transform: uppercase;
          color: var(--paper);
        }

        /* ── 4 · colophon ─────────────────────────────────────────── */
        .wki-colophon {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          column-gap: var(--work-grid-gap);
        }
        .wki-colophon-inner {
          grid-column: 3 / -1;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--space-6);
          padding-top: var(--space-6);
        }

        /* ── entrance: quiet fade-rise, 60ms stagger (overrides the
              global 60px fadeUp for these rows) ─────────────────────── */
        .wki-row[data-fade] {
          opacity: 0.001;
          transform: translateY(12px);
          will-change: transform, opacity;
        }
        .wki-row[data-fade].is-visible {
          animation: wkiRowIn 0.6s var(--ease-silk) both;
          animation-delay: calc(var(--wki-i, 0) * 60ms);
        }
        @keyframes wkiRowIn {
          from {
            opacity: 0.001;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── tablet (810–1079): 8 cols, rail becomes an inline band ── */
        @media (max-width: 1079.98px) {
          .wki-header {
            grid-template-columns: repeat(8, minmax(0, 1fr));
          }
          .wki-eyebrow {
            grid-column: 1 / 6;
          }
          .wki-title {
            grid-column: 1 / 8;
          }
          .wki-jump {
            grid-column: 1 / -1;
            grid-row: 3;
            flex-direction: row;
            gap: var(--space-8);
            padding-top: var(--space-2);
          }
          .wki-category {
            grid-template-columns: repeat(8, minmax(0, 1fr));
            row-gap: var(--space-6);
          }
          .wki-rail {
            grid-column: 1 / -1;
            position: static;
            display: flex;
            align-items: baseline;
            gap: var(--space-4);
            padding-top: 0;
          }
          .wki-rail-title {
            margin: 0;
          }
          .wki-rows {
            grid-column: 1 / -1;
          }
          .wki-row-link {
            grid-template-columns: repeat(8, minmax(0, 1fr));
          }
          .wki-row-num {
            grid-column: 1 / 7;
            grid-row: 1;
            padding-top: 0;
          }
          .wki-row-title {
            grid-column: 1 / 7;
            grid-row: 2;
            margin-top: var(--space-2);
          }
          .wki-row-discipline {
            display: none;
          }
          .wki-row-year {
            grid-column: 7 / -1;
            grid-row: 1;
            padding-top: 0;
          }
          .wki-plate {
            width: calc(
              ((100% - 7 * var(--work-grid-gap)) / 8) * 4 +
                3 * var(--work-grid-gap)
            );
          }
          .wki-row-link::before {
            top: calc(var(--wki-row-pad) + 26px + var(--wki-cap-nudge));
          }
        }

        /* ── phone (≤809): single column; numeral + title + year; the
              plate is a static 4:3 print shown on tap-focus only ────── */
        @media (max-width: 809.98px) {
          .wki-page {
            --wki-row-pad: var(--space-6);
          }
          .wki-header {
            grid-template-columns: minmax(0, 1fr);
            row-gap: var(--space-4);
            padding-top: 142px;
            padding-bottom: var(--space-9);
          }
          .wki-eyebrow,
          .wki-title,
          .wki-jump {
            grid-column: 1;
            grid-row: auto;
          }
          .wki-jump {
            flex-direction: row;
            flex-wrap: wrap;
            gap: var(--space-4) var(--space-7);
            padding-top: var(--space-4);
          }
          .wki-category {
            grid-template-columns: minmax(0, 1fr);
            row-gap: var(--space-5);
            scroll-margin-top: 90px;
          }
          .wki-category + .wki-category {
            margin-top: var(--space-11);
          }
          .wki-rail,
          .wki-rows {
            grid-column: 1;
          }
          .wki-rail {
            flex-wrap: wrap;
            row-gap: var(--space-1);
          }
          .wki-row-link {
            grid-template-columns: minmax(0, 1fr) auto;
            column-gap: var(--space-4);
            min-height: 0;
          }
          .wki-row-num {
            grid-column: 1;
            grid-row: 1;
          }
          .wki-row-year {
            grid-column: 2;
            grid-row: 1;
          }
          .wki-row-title {
            grid-column: 1 / -1;
            grid-row: 2;
            margin-top: var(--space-2);
          }
          .wki-row-link:hover .wki-row-title,
          .wki-row-link:focus-visible .wki-row-title {
            transform: none;
          }
          .wki-row-link:hover .wki-row-meta,
          .wki-row-link:focus-visible .wki-row-meta {
            opacity: 1;
            transform: none;
          }
          .wki-plate {
            /* relative (not static): the plate stays in flow below the title
               but remains the containing block for the fill image */
            position: relative;
            top: auto;
            right: auto;
            grid-column: 1 / -1;
            grid-row: 3;
            display: none;
            width: 100%;
            aspect-ratio: 4 / 3;
            margin-top: var(--space-4);
            opacity: 1;
            transform: none;
          }
          .wki-row-link:focus .wki-plate,
          .wki-row-link:focus-visible .wki-plate {
            display: block;
            transform: none;
          }
          .wki-row-link::before {
            left: -12px;
            top: calc(var(--wki-row-pad) + 25px + var(--wki-cap-nudge));
          }
          .wki-colophon-inner {
            grid-column: 1 / -1;
            flex-wrap: wrap;
            gap: var(--space-4);
          }
        }

        /* ── reduced motion: everything visible, opacity-only states ── */
        @media (prefers-reduced-motion: reduce) {
          .wki-row[data-fade] {
            opacity: 1;
            transform: none;
            will-change: auto;
          }
          .wki-row[data-fade].is-visible {
            animation: none;
          }
          .wki-row-title,
          .wki-row-meta,
          .wki-plate,
          .wki-row-link::before {
            transition: opacity 0.2s ease;
          }
          .wki-row-link::before {
            transform: scaleY(1);
          }
          .wki-row-link:hover .wki-row-title,
          .wki-row-link:focus-visible .wki-row-title {
            transform: none;
          }
          .wki-row-link:hover .wki-row-meta,
          .wki-row-link:focus-visible .wki-row-meta {
            transform: none;
          }
        }
        @media (prefers-reduced-motion: reduce) and (min-width: 810px) {
          .wki-plate {
            transform: translate(0, -50%);
          }
        }
      `,
        }}
      />
    </div>
  );
}
