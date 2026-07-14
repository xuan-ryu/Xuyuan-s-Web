import Image from "next/image";
import Link from "next/link";
import { projectCatalog } from "@/data/project-catalog";
import { stripCssComments } from "@/lib/css-sanitize";

// Shared "next case" close for the case pages: label, title, and a cover
// PREVIEW of where the link goes. One contract across pages (the shared
// 1440 work shell), color-neutral by design — everything derives from
// currentColor, so it sits on a light page in ink and on a dark page in
// its light text color; the title inherits the page's own text face.
// Poster pages keep their separate poster-nav contract.

const CSS = `
.case-next {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--work-shell-max, 1440px);
  margin: 0 auto;
  padding: clamp(56px, 6vw, 88px) var(--work-gutter, clamp(24px, 5vw, 72px));
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--work-grid-gap, clamp(18px, 2.3vw, 32px));
  row-gap: 20px;
  border-top: 1px solid color-mix(in srgb, currentColor 16%, transparent);
  align-items: center;
}
.case-next-label {
  grid-column: 1 / 4;
  align-self: start;
  margin: 6px 0 0;
  font-size: var(--text-label);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.55;
}
.case-next-link {
  grid-column: 4 / 13;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(200px, 280px);
  gap: clamp(24px, 3vw, 48px);
  align-items: center;
  text-decoration: none;
  color: inherit;
}
.case-next-copy {
  display: grid;
  gap: 10px;
  justify-items: start;
}
.case-next-title {
  font-family: inherit;
  font-size: clamp(28px, 2.6vw, 44px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: 0;
  text-transform: none;
  white-space: normal;
  padding-bottom: 0.12em;
}
.case-next-hint {
  font-size: var(--text-label);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
  transition: opacity var(--dur-fast) ease;
}
.case-next-media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
}
.case-next-media img,
.case-next-media .case-next-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.01);
  transition: transform 0.6s var(--ease-silk);
}
.case-next-link:hover .case-next-media img,
.case-next-link:focus-visible .case-next-media img,
.case-next-link:hover .case-next-media .case-next-fallback,
.case-next-link:focus-visible .case-next-media .case-next-fallback {
  transform: scale(1.05);
}
.case-next-link:hover .case-next-hint,
.case-next-link:focus-visible .case-next-hint {
  opacity: 1;
}
.case-next-link:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
@media (max-width: 900px) {
  .case-next { display: block; }
  .case-next-label { margin-bottom: 16px; }
  .case-next-link { grid-template-columns: 1fr; gap: 18px; }
  .case-next-media { max-width: 420px; }
}
`;

export function CaseNext({ slug }: { slug: string }) {
  const { next, prev } = projectCatalog.adjacent(slug);
  const target = next ?? prev;
  if (!target) return null;
  const label = next ? "Next case" : "Previous case";

  return (
    <aside className="case-next" aria-label={label}>
      <p className="case-next-label">{label}</p>
      <Link className="case-next-link" href={`/work/${target.slug}`}>
        <span className="case-next-copy">
          <span className="cta cta--quiet case-next-title">{target.title}</span>
          <span className="case-next-hint">View project</span>
        </span>
        <span className="case-next-media" aria-hidden="true">
          {target.cover ? (
            <Image
              src={target.cover}
              alt=""
              fill
              sizes="(max-width: 900px) 90vw, 280px"
            />
          ) : (
            <span className={`case-next-fallback ${target.coverClass ?? ""}`} />
          )}
        </span>
      </Link>
      <style dangerouslySetInnerHTML={{ __html: stripCssComments(CSS) }} />
    </aside>
  );
}
