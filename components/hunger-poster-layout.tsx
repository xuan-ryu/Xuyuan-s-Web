import Image from "next/image";
import Link from "next/link";
import { adjacent, type Project } from "@/data/projects";
import { Cta } from "@/components/ui/cta";
import { HungerLoupeFrame } from "@/components/hunger-loupe-frame";
import { InteractiveCue, ICUE_CSS } from "@/components/ui/interactive-cue";
import { OffscreenVideo } from "@/components/ui/offscreen-video";
import { OutcomeBand, OUTCOME_BAND_CSS } from "@/components/ui/outcome-band";
import { stripCssComments } from "@/lib/css-sanitize";

// "The 1942 Edition" (spec-hunger1942): the project printed its own broadsheet,
// so the case page becomes the desk it lies on — an archival reading room.
// Folio rules + dateline metadata run the sections; the broadsheet and the four
// art boards are handled as documents (hairline frames, reading loupe, numbered
// plates on a newsprint band). Seal red belongs to the dispatch chop alone —
// the page's ONE red (the pull-quote rule is gold); the case accent
// (--case-accent, Wan Shouren's navy-indigo jacket) marks static plate
// numbers and the active loupe ring.
// Plate titles and captions are hardcoded here (data/projects.ts additions are
// deferred to the serialized data pass).

const SHEET_ALT =
  "Back to History — an aged 1942-style broadsheet dated 2023-04-20, the game-design document appendix. Its columns carry the oral histories the levels are built from: the Henan disaster, the storylines of Wan Shouren, Xuchang, and Zhengzhou.";

// Captions add provenance (medium, source, role) rather than restating the
// boards' own legible printed text (transliterations: Wan Shouren, Jiayan
// Wan). Order matches poster.gallery in data/projects.ts.
const PLATES = [
  {
    title: "Wan Shouren — the protagonist",
    caption:
      "Character board from the game-design document — digital concept art and pixel sprites drawn against archival famine photographs; the printed notes set out the moral-value system.",
    width: 1246,
    height: 1759,
    alt: "Character concept sheet for Wan Shouren: full-figure concept art, four expression studies, turnaround views, pixel-art sprites, and archival famine reference photographs.",
  },
  {
    title: "Jiayan Wan — the younger sister",
    caption:
      "Companion board in the same archival format — her biography and the first act's trade-off are typeset on the sheet itself.",
    width: 1243,
    height: 1764,
    alt: "Character concept sheet for Jiayan Wan with biography and gameplay notes, refugee reference photographs, pixel sprites, and famine-victim character studies.",
  },
  {
    title: "Scenes & storyboards",
    caption:
      "Storyboard sheet — interface studies and scene blocking for the first act; each panel restages a documented event from the oral histories.",
    width: 1242,
    height: 1770,
    alt: "Storyboard and concept board: Oregon Trail interface references and staged scenes including the plane bombing, the dyke-break flood, fleeing famine, victims climbing onto a train, and a camping point.",
  },
  {
    title: "In-game scenes",
    caption:
      "Level one in pixels — plundering the landlord's burning granary, the protagonist's home, dialogue choices, and the inventory that meters every day of survival.",
    width: 1246,
    height: 1746,
    alt: "In-game pixel-art scenes: the landlord's burning granary, prototype level landscapes, the protagonist's home, a dialogue scene with choices, and the inventory system.",
  },
];

export function HungerPosterLayout({ project }: { project: Project }) {
  const poster = project.poster;
  if (!poster) return null;

  const { prev, next } = adjacent(project.slug);
  const youtubeHref = poster.details.livePreview?.href;
  const plates = PLATES.slice(0, poster.gallery.length).map((plate, i) => ({
    ...plate,
    src: poster.gallery[i],
  }));

  return (
    <article className="poster-page hunger-page">
      <style
        dangerouslySetInnerHTML={{
          __html: stripCssComments(hungerCss + ICUE_CSS + OUTCOME_BAND_CSS),
        }}
      />

      {/* ── 1 · Dateline masthead ─────────────────────────────── */}
      <header className="hunger-hero" id="header">
        <p className="hunger-folio" data-fade>
          <span>Henan, China — 1942</span>
          <span className="hunger-folio-mid">2D Survival RPG</span>
          <span>09/2022–04/2024</span>
        </p>
        <h1 data-fade>{project.title}</h1>
        <p className="hunger-lede" data-fade>
          {poster.lede}
        </p>
        <dl className="hunger-meta" data-fade>
          {/* Duration is omitted: the folio dateline above already carries
              09/2022–04/2024 — one fact, one place (redundancy rule). */}
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{project.type}</dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>{project.teams}</dd>
          </div>
        </dl>
      </header>

      {/* ── at a glance: the recruiter's skim row (audit #1) ── */}
      {project.outcomes && <OutcomeBand outcomes={project.outcomes} />}

      {/* ── 2 · The broadsheet ────────────────────────────────── */}
      <section className="hunger-sheet" aria-label="The printed broadsheet">
        <div className="hunger-sheet-media" data-fade>
          <HungerLoupeFrame
            src={poster.image}
            alt={SHEET_ALT}
            width={1243}
            height={1762}
            sizes="(max-width: 809px) 100vw, 1296px"
            priority
          />
        </div>
        <p className="hunger-sheet-caption">
          Back to History — the game-design document appendix printed as a
          1942-style broadsheet; its columns carry the oral histories the
          levels are built from.
        </p>
        <p className="hunger-loupe-cue">
          <InteractiveCue accent="var(--case-accent)">
            Hover the broadsheet — the loupe magnifies
          </InteractiveCue>
        </p>
        <Cta
          variant="quiet"
          href={poster.image}
          target="_blank"
          rel="noreferrer"
          className="hunger-sheet-cta"
        >
          Read the full sheet
        </Cta>
      </section>

      {/* ── 3 · Dispatch — the claim ──────────────────────────── */}
      <section className="hunger-section hunger-dispatch" aria-labelledby="hunger-dispatch-title">
        <span className="hunger-rule" aria-hidden="true" data-fade />
        <p className="hunger-kicker" data-fade>
          01 · Dispatch
        </p>
        <h2 id="hunger-dispatch-title" className="hunger-claim" data-fade>
          A survival RPG built from the oral histories of the 1942 Henan
          famine.
        </h2>
        <div className="hunger-copy hunger-dispatch-copy">
          {poster.intro.map((p, i) => (
            <p key={i} data-fade>
              {p}
            </p>
          ))}
        </div>
        <Image
          className="hunger-stamp"
          src="/media/shared/seal.png"
          alt=""
          width={304}
          height={641}
          data-fade
        />
      </section>

      {/* ── 4 · The game in motion ────────────────────────────── */}
      <section className="hunger-section hunger-motion" aria-labelledby="hunger-motion-title">
        <span className="hunger-rule" aria-hidden="true" data-fade />
        <p className="hunger-kicker" data-fade>
          02 · In Motion
        </p>
        <h3 id="hunger-motion-title" className="hunger-motion-title" data-fade>
          The first act, playable
        </h3>
        {project.previewVideo && (
          <div className="hunger-reel" data-fade>
            <OffscreenVideo
              src={project.previewVideo}
              threshold={0.5}
              aria-label="Silent gameplay capture of the first act of Hunger 1942"
            />
          </div>
        )}
        <p className="hunger-reel-caption">
          Level 1 — entering the landlord&rsquo;s house to plunder food;
          prototype capture.
        </p>
        {youtubeHref && (
          <Cta
            variant="quiet"
            href={youtubeHref}
            target="_blank"
            rel="noreferrer"
            className="hunger-reel-cta"
          >
            Watch the full preview
          </Cta>
        )}
      </section>

      {/* ── 5 · Editorial — why this history became a game ───── */}
      <section className="hunger-section hunger-editorial" aria-labelledby="hunger-editorial-title">
        <span className="hunger-rule" aria-hidden="true" data-fade />
        <p className="hunger-kicker" data-fade>
          03 · Editorial
        </p>
        <h2 id="hunger-editorial-title" className="hunger-claim" data-fade>
          Ordinary suffering deserves more than one sentence of history.
        </h2>
        <div className="hunger-copy hunger-essay-lead">
          <p data-fade>{poster.body[0]}</p>
        </div>
        <aside className="hunger-pull" data-fade>
          <p className="hunger-pull-quote">
            &ldquo;the people lived in misery&rdquo;
          </p>
          <p className="hunger-pull-source">How textbooks summarize 1942</p>
        </aside>
        <div className="hunger-copy hunger-essay-rest">
          {poster.body.slice(1).map((p, i) => (
            <p key={i} data-fade>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ── 6 · The archive — numbered plates ────────────────── */}
      <section className="hunger-archive" aria-labelledby="hunger-archive-title">
        <div className="hunger-archive-inner">
          <p className="hunger-kicker" data-fade>
            04 · The Archive
          </p>
          <h2 id="hunger-archive-title" className="hunger-claim hunger-archive-claim" data-fade>
            From character sheets to playable scenes.
          </h2>
          <ol className="hunger-plates">
            {plates.map((plate, i) => (
              <li className="hunger-plate" key={plate.src}>
                <div className="hunger-plate-caption">
                  <p className="hunger-plate-no">
                    Plate {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="hunger-plate-title">{plate.title}</h3>
                  <p className="hunger-plate-note">{plate.caption}</p>
                  <Cta
                    variant="quiet"
                    href={plate.src}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View full plate
                  </Cta>
                </div>
                <div className="hunger-plate-media" data-fade>
                  <HungerLoupeFrame
                    src={plate.src}
                    alt={plate.alt}
                    width={plate.width}
                    height={plate.height}
                    sizes="(max-width: 809px) 100vw, (max-width: 1079px) 75vw, 980px"
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 7 · Adjacent projects (shared poster-nav contract) ── */}
      <nav className="poster-nav" aria-label="Adjacent projects">
        {prev ? (
          <Link href={`/work/${prev.slug}`} className="poster-nav-item prev">
            {prev.cover && (
              <span className="poster-nav-thumb">
                <Image src={prev.cover} alt="" width={120} height={88} />
              </span>
            )}
            <span>
              <span className="poster-nav-label">Previous</span>
              <span className="poster-nav-title">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/work/${next.slug}`} className="poster-nav-item next">
            <span>
              <span className="poster-nav-label">Next</span>
              <span className="poster-nav-title">{next.title}</span>
            </span>
            {next.cover && (
              <span className="poster-nav-thumb">
                <Image src={next.cover} alt="" width={120} height={88} />
              </span>
            )}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

const hungerCss = `
/* ============================================================
   Hunger 1942 — "The 1942 Edition" archival broadsheet layout.
   Scoped to .hunger-page; grid/type/color come from the shared
   case-shell tokens (--work-shell-max, --work-gutter, --work-grid-gap,
   --work-rule) already declared on .poster-page.
   ============================================================ */
.hunger-page {
  /* Case palette — drawn from the work: the broadsheet is ink-on-newsprint
     (already the family neutrals), so the one color the project owns is
     Wan Shouren's ragged navy-indigo jacket (character sheets + every pixel
     sprite). Seal red appears once — the dispatch chop; the pull-quote rule
     is demoted to gold, and the granary-fire orange and level-sky teal
     remain inside the media where they belong. */
  --case-accent: #3e4a61;
  --case-accent-soft: color-mix(in srgb, var(--case-accent) 14%, transparent);
  background: var(--paper);
  color: var(--ink-950);
}

/* — shared 12-column case shell — */
.hunger-hero,
.hunger-sheet,
.hunger-section,
.hunger-archive-inner,
.hunger-plate {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max);
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap);
}

/* folio rule — the newspaper's running head, reused by every section */
.hunger-rule {
  position: relative;
  grid-column: 1 / -1;
  height: 1px;
}
/* the ink is a ::before bar so it can draw (scaleX); the span stays full-width
   so the reveal observer sees real area. Identical hairline at rest. */
.hunger-rule::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--work-rule);
  transform-origin: left;
}

.hunger-kicker {
  grid-column: 1 / 3;
  margin: 14px 0 clamp(32px, 4vw, 56px);
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.48);
}

.hunger-claim {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-heading);
  font-weight: 400;
  line-height: 1.12;
  letter-spacing: 0;
  color: var(--ink-950);
  text-wrap: balance;
}

.hunger-copy p {
  margin: 0;
  max-width: 68ch;
  font-family: var(--font-serif);
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.62;
  color: rgba(5, 5, 5, 0.76);
}
.hunger-copy p + p {
  margin-top: 22px;
}

/* quiet CTAs carry a resting hairline so the full-asset path stays obvious
   on touch/keyboard; the seal-red rule still wipes over it on hover/focus */
.hunger-page .cta--quiet {
  box-shadow: inset 0 -1px 0 var(--work-rule);
}

/* ── 1 · Dateline masthead ─────────────────────────────────── */
.hunger-hero {
  padding: clamp(160px, 18vw, 235px) var(--work-gutter) clamp(40px, 4vw, 56px);
}
.hunger-folio {
  grid-column: 1 / -1;
  grid-row: 1;
  display: flex;
  justify-content: space-between;
  gap: var(--work-grid-gap);
  margin: 0 0 clamp(36px, 4vw, 60px);
  padding-top: 14px;
  border-top: 1px solid var(--work-rule);
}
.hunger-folio span {
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.48);
}
.hunger-hero h1 {
  grid-column: 1 / 9;
  grid-row: 2;
  margin: 0;
  font-family: var(--font-condensed);
  font-size: var(--text-display-2);
  font-weight: 300;
  line-height: 0.94;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: var(--ink-950);
}
.hunger-lede {
  grid-column: 1 / 7;
  grid-row: 3;
  max-width: 62ch;
  margin: clamp(28px, 3vw, 44px) 0 0;
  font-family: var(--font-serif);
  font-size: var(--text-lead);
  font-weight: 400;
  line-height: 1.5;
  color: rgba(5, 5, 5, 0.68);
}
.hunger-meta {
  grid-column: 9 / -1;
  grid-row: 2 / span 2;
  align-self: start;
  margin: 0;
  display: grid;
  border-top: 1px solid var(--work-rule);
}
.hunger-meta div {
  padding: 14px 0;
  border-bottom: 1px solid var(--work-rule);
}
.hunger-meta dt {
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.48);
}
.hunger-meta dd {
  margin: 5px 0 0;
  font-size: var(--text-meta);
  font-weight: 400;
  line-height: 1.45;
  color: rgba(5, 5, 5, 0.78);
}

/* ── 2 · The broadsheet ────────────────────────────────────── */
.hunger-sheet {
  padding: 0 var(--work-gutter);
  row-gap: clamp(16px, 1.8vw, 24px);
}
.hunger-sheet-media {
  grid-column: 1 / -1;
  grid-row: 1;
}
.hunger-sheet-caption {
  grid-column: 1 / 7;
  grid-row: 2;
  margin: 0;
  font-size: var(--text-meta);
  font-weight: 400;
  line-height: 1.6;
  color: rgba(5, 5, 5, 0.6);
}
.hunger-sheet-cta {
  grid-column: 10 / -1;
  grid-row: 2;
  justify-self: end;
  align-self: start;
  margin-top: 4px;
}

/* loupe cue — names the gesture; only shown where the loupe exists
   (hover-capable fine pointers, same gate as .hunger-loupe itself) */
.hunger-loupe-cue {
  display: none;
  grid-column: 6 / 10;
  grid-row: 2;
  justify-self: end;
  align-self: start;
  margin: 7px 0 0;
}
@media (hover: hover) and (pointer: fine) {
  .hunger-loupe-cue {
    display: block;
  }
}

/* document frame + reading loupe */
.hunger-loupe-frame {
  position: relative;
  container-type: inline-size;
  border: 1px solid var(--work-rule);
  background: var(--paper);
}
.hunger-loupe-frame img {
  display: block;
}
.hunger-loupe {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  border: 1px solid var(--case-accent);
  box-shadow: 0 0 0 5px var(--case-accent-soft), 0 14px 34px rgba(5, 5, 5, 0.18);
  background-color: var(--paper);
  background-repeat: no-repeat;
  background-size: 240cqw auto;
  background-position: var(--lx, 50%) var(--ly, 50%);
  transform: translate3d(calc(var(--px, -600px) - 50%), calc(var(--py, -600px) - 50%), 0);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s var(--ease-standard);
  will-change: transform, opacity;
}
@media (hover: hover) and (pointer: fine) {
  .hunger-loupe {
    display: block;
  }
  .hunger-loupe-frame {
    cursor: zoom-in;
  }
}
.hunger-loupe-on .hunger-loupe {
  opacity: 1;
}

/* ── 3 · Dispatch ──────────────────────────────────────────── */
.hunger-section {
  padding: clamp(76px, 8vw, 124px) var(--work-gutter);
}
.hunger-dispatch {
  margin-top: clamp(64px, 7vw, 108px);
}
.hunger-dispatch .hunger-claim {
  grid-column: 1 / 6;
  grid-row: 3;
}
.hunger-dispatch-copy {
  grid-column: 6 / 11;
  grid-row: 3;
}
.hunger-stamp {
  grid-column: 11 / -1;
  grid-row: 3;
  align-self: start;
  justify-self: start;
  width: clamp(74px, 8vw, 118px);
  height: auto;
}

/* ── 4 · In motion ─────────────────────────────────────────── */
.hunger-motion {
  padding: clamp(64px, 7vw, 104px) var(--work-gutter);
}
.hunger-motion-title {
  grid-column: 1 / 5;
  grid-row: 3;
  margin: 0 0 clamp(28px, 3vw, 44px);
  font-family: var(--font-serif);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.28;
  color: var(--ink-950);
}
.hunger-reel {
  grid-column: 1 / -1;
  grid-row: 4;
  border: 1px solid var(--work-rule);
  background: var(--ink-950);
}
.hunger-reel video {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
.hunger-reel-caption {
  grid-column: 1 / 5;
  grid-row: 5;
  margin: 16px 0 0;
  font-size: var(--text-meta);
  font-weight: 400;
  line-height: 1.6;
  color: rgba(5, 5, 5, 0.6);
}
.hunger-reel-cta {
  grid-column: 10 / -1;
  grid-row: 5;
  justify-self: end;
  align-self: start;
  margin-top: 20px;
}

/* ── 5 · Editorial ─────────────────────────────────────────── */
.hunger-editorial .hunger-claim {
  grid-column: 1 / 6;
  grid-row: 3;
  margin-bottom: clamp(36px, 4vw, 60px);
}
.hunger-essay-lead {
  grid-column: 5 / 11;
  grid-row: 4;
}
.hunger-pull {
  position: relative;
  grid-column: 1 / 4;
  grid-row: 5;
  align-self: start;
  margin-top: 22px;
  padding-top: 20px;
}
/* gold accent as a drawable bar (was border-top:2px; a border can't
   scaleX). Demoted from seal red so the dispatch chop stays the page's one
   red. Same 2px rule, same resting position — padding absorbs the 2px the
   border used to add. */
.hunger-pull::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--accent-gold);
  transform-origin: left;
}
.hunger-pull-quote {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--text-heading);
  font-weight: 300;
  line-height: 1.2;
  color: var(--ink-950);
}
.hunger-pull-source {
  margin: 14px 0 0;
  font-size: var(--text-micro);
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(5, 5, 5, 0.48);
}
.hunger-essay-rest {
  grid-column: 5 / 11;
  grid-row: 5;
}
.hunger-essay-rest p:first-child {
  margin-top: 22px;
}

/* ── 6 · The archive — newsprint band + numbered plates ────── */
.hunger-archive {
  border-top: 1px solid var(--work-rule);
  border-bottom: 1px solid var(--work-rule);
  background-color: var(--paper-warm);
  background-image: radial-gradient(rgba(5, 5, 5, 0.035) 1px, transparent 1px);
  background-size: 7px 7px;
}
.hunger-archive-inner {
  padding: clamp(76px, 8vw, 124px) var(--work-gutter);
}
.hunger-archive-inner .hunger-kicker {
  margin-top: 0;
}
.hunger-archive-claim {
  grid-column: 1 / 7;
  grid-row: 2;
}
.hunger-plates {
  grid-column: 1 / -1;
  grid-row: 3;
  margin: clamp(48px, 5vw, 76px) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  row-gap: clamp(64px, 7vw, 104px);
}
.hunger-plate {
  align-items: start;
}
.hunger-plate-caption {
  grid-column: 1 / 4;
  position: sticky;
  top: 120px;
  align-self: start;
}
.hunger-plate-no {
  margin: 0 0 12px;
  font-size: var(--text-label);
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--case-accent);
}
.hunger-plate-title {
  margin: 0 0 14px;
  font-family: var(--font-serif);
  font-size: var(--text-title);
  font-weight: 400;
  line-height: 1.28;
  color: var(--ink-950);
}
.hunger-plate-note {
  margin: 0 0 20px;
  max-width: 36ch;
  font-size: var(--text-meta);
  font-weight: 400;
  line-height: 1.6;
  color: rgba(5, 5, 5, 0.62);
}
.hunger-plate-media {
  grid-column: 4 / -1;
}

/* ── tablet · 8 columns (810–1079) ─────────────────────────── */
@media (max-width: 1079px) {
  .hunger-hero,
  .hunger-sheet,
  .hunger-section,
  .hunger-archive-inner,
  .hunger-plate {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
  .hunger-hero h1 {
    grid-column: 1 / -1;
  }
  .hunger-lede {
    grid-column: 1 / 6;
  }
  .hunger-meta {
    grid-column: 6 / -1;
    grid-row: 3;
    margin-top: clamp(28px, 3vw, 44px);
  }
  .hunger-sheet-caption {
    grid-column: 1 / 6;
  }
  .hunger-sheet-cta {
    grid-column: 6 / -1;
  }
  .hunger-loupe-cue {
    grid-column: 1 / -1;
    grid-row: 3;
    justify-self: start;
    margin-top: 2px;
  }
  .hunger-kicker {
    grid-column: 1 / 4;
  }
  .hunger-dispatch .hunger-claim {
    grid-column: 1 / -1;
    margin-bottom: clamp(32px, 4vw, 48px);
  }
  .hunger-dispatch-copy {
    grid-column: 3 / -1;
    grid-row: 4;
  }
  .hunger-stamp {
    display: none;
  }
  .hunger-motion-title {
    grid-column: 1 / 6;
  }
  .hunger-reel-caption {
    grid-column: 1 / 6;
  }
  .hunger-reel-cta {
    grid-column: 6 / -1;
  }
  .hunger-editorial .hunger-claim {
    grid-column: 1 / -1;
  }
  .hunger-essay-lead {
    grid-column: 3 / -1;
  }
  .hunger-pull {
    grid-column: 1 / 3;
  }
  .hunger-essay-rest {
    grid-column: 3 / -1;
  }
  .hunger-archive-claim {
    grid-column: 1 / -1;
  }
  .hunger-plate-caption {
    grid-column: 1 / 3;
  }
  .hunger-plate-media {
    grid-column: 3 / -1;
  }
}

/* ── phone · one reading column (≤809) ─────────────────────── */
@media (max-width: 809px) {
  .hunger-hero,
  .hunger-sheet,
  .hunger-section,
  .hunger-archive-inner,
  .hunger-plate {
    grid-template-columns: minmax(0, 1fr);
  }
  .hunger-hero {
    padding-top: 132px;
  }
  .hunger-folio,
  .hunger-hero h1,
  .hunger-lede,
  .hunger-meta,
  .hunger-sheet-media,
  .hunger-sheet-caption,
  .hunger-loupe-cue,
  .hunger-sheet-cta,
  .hunger-rule,
  .hunger-kicker,
  .hunger-claim,
  .hunger-dispatch .hunger-claim,
  .hunger-dispatch-copy,
  .hunger-motion-title,
  .hunger-reel,
  .hunger-reel-caption,
  .hunger-reel-cta,
  .hunger-editorial .hunger-claim,
  .hunger-essay-lead,
  .hunger-pull,
  .hunger-essay-rest,
  .hunger-archive-claim,
  .hunger-plates,
  .hunger-plate-caption,
  .hunger-plate-media {
    grid-column: 1;
    grid-row: auto;
  }
  .hunger-folio-mid {
    display: none;
  }
  .hunger-meta {
    margin-top: 28px;
  }
  .hunger-section,
  .hunger-archive-inner {
    padding-top: 62px;
    padding-bottom: 62px;
  }
  .hunger-dispatch {
    margin-top: 56px;
  }
  .hunger-sheet-caption {
    margin-top: 4px;
  }
  .hunger-sheet-cta,
  .hunger-reel-cta {
    justify-self: start;
    margin-top: 14px;
  }
  .hunger-dispatch .hunger-claim,
  .hunger-editorial .hunger-claim,
  .hunger-archive-claim {
    margin-bottom: 28px;
  }
  .hunger-dispatch-copy {
    margin-top: 0;
  }
  .hunger-motion-title {
    margin-bottom: 22px;
  }
  .hunger-pull {
    margin: 30px 0 8px;
    max-width: 30ch;
  }
  .hunger-plates {
    margin-top: 40px;
    row-gap: 56px;
  }
  .hunger-plate-caption {
    position: static;
    margin-bottom: 20px;
  }
}

/* ── Set-in-print motion — the sheet assembles as it enters view ─────────
   Restrained and period-true: the section column rules strike in from the
   left (letterpress), the seal presses down, and the pull-quote's gold
   accent draws before its words set. Zero new JS: the global FadeReveal adds
   .is-visible on scroll-enter. Motion-only — every hidden initial state lives
   inside @media (prefers-reduced-motion: no-preference), so reduced motion and
   the forced-visible fallback show the finished, fully-inked layout. ── */
@keyframes hungerRuleDraw {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes hungerStampPress {
  from { opacity: 0.001; transform: scale(1.06); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes hungerPullRise {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: no-preference) {
  /* 1 · section column rules strike in from the left (letterpress). The span
     is a silent full-width host — neutralize the base translateY slide — and
     its ::before hairline draws scaleX 0→1. (Scaling the span itself would
     collapse its box to zero width and starve the reveal observer.) */
  .hunger-page .hunger-rule[data-fade] {
    opacity: 1;
    transform: none;
  }
  .hunger-page .hunger-rule[data-fade].is-visible {
    animation: none;
  }
  .hunger-page .hunger-rule[data-fade]::before {
    transform: scaleX(0);
  }
  .hunger-page .hunger-rule[data-fade].is-visible::before {
    animation: hungerRuleDraw var(--dur-gesture) var(--ease-silk) forwards;
  }

  /* 2 · the seal presses in — a settle from slightly oversized, no slide */
  .hunger-page .hunger-stamp[data-fade] {
    opacity: 0.001;
    transform: scale(1.06);
  }
  .hunger-page .hunger-stamp[data-fade].is-visible {
    animation: hungerStampPress 0.5s var(--ease-spring) forwards;
  }

  /* 3 · pull-quote — the aside is a silent host (no move of its own); its
     gold accent draws, then the quote and source set in a two-beat rise */
  .hunger-page .hunger-pull[data-fade] {
    opacity: 1;
    transform: none;
  }
  .hunger-page .hunger-pull[data-fade].is-visible {
    animation: none;
  }
  .hunger-page .hunger-pull[data-fade]::before {
    transform: scaleX(0);
  }
  .hunger-page .hunger-pull[data-fade].is-visible::before {
    animation: hungerRuleDraw var(--dur-gesture) var(--ease-silk) forwards;
  }
  .hunger-page .hunger-pull[data-fade] .hunger-pull-quote,
  .hunger-page .hunger-pull[data-fade] .hunger-pull-source {
    opacity: 0;
    transform: translateY(12px);
  }
  .hunger-page .hunger-pull[data-fade].is-visible .hunger-pull-quote {
    animation: hungerPullRise 0.5s var(--ease-spring) forwards;
    animation-delay: 120ms;
  }
  .hunger-page .hunger-pull[data-fade].is-visible .hunger-pull-source {
    animation: hungerPullRise 0.5s var(--ease-spring) forwards;
    animation-delay: 220ms;
  }

  /* 4 · masthead sets line by line — calm cascade (delays only, base fadeUp) */
  .hunger-hero h1[data-fade].is-visible {
    animation-delay: 80ms;
  }
  .hunger-hero .hunger-lede[data-fade].is-visible {
    animation-delay: 160ms;
  }
  .hunger-hero .hunger-meta[data-fade].is-visible {
    animation-delay: 240ms;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hunger-loupe {
    transition: none;
  }
}

/* ── Outcome band — dateline voice: folio hairlines, the jacket navy on
   labels (--case-accent, the page's static detail ink), condensed numeral
   like the masthead ── */
.hunger-page .ob-band {
  --ob-stat-font: var(--font-condensed);
  --ob-stat-weight: 300;
  --ob-body: rgba(5, 5, 5, 0.76);
}
.hunger-page .ob-stat strong {
  text-transform: uppercase;
  letter-spacing: var(--track-display, 0.01em);
}
`;
