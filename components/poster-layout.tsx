import Image from "next/image";
import Link from "next/link";
import { adjacent, type Project } from "@/data/projects";

// Mirrors the Framer "poster" template (hunger1942, vr-education): centered
// title + lede → tall poster image → black about/details section → essay
// paragraphs → tall gallery images → previous/next thumbnails.
export function PosterLayout({ project }: { project: Project }) {
  const poster = project.poster;
  if (!poster) return null;

  const { prev, next } = adjacent(project.slug);
  const details: [string, React.ReactNode][] = [
    ["Project:", poster.details.project],
    ["Client:", poster.details.client],
    ["Year:", poster.details.year],
    ["Services:", poster.details.services],
  ];

  return (
    <article className="poster-page">
      <section className="poster-hero" id="header">
        <h1>{project.title}</h1>
        <p>{poster.lede}</p>
      </section>

      <div className="poster-image">
        <Image
          src={poster.image}
          alt={project.title}
          width={1376}
          height={1530}
          sizes="(max-width: 809px) 100vw, 1376px"
          priority
        />
      </div>

      <section className="poster-about">
        <p className="poster-about-label">about</p>
        <div className="poster-about-intro">
          {poster.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="poster-details">
          <div className="poster-details-head">
            <p>Project Details</p>
            <Image
              src="/assets/framerusercontent.com/images/ntwL7wUkSslvYCLMnzXaIuQu8zU.png"
              alt=""
              width={157}
              height={127}
            />
          </div>
          <dl className="poster-details-list">
            {details.map(([label, value]) => (
              <div key={label as string} className="poster-details-row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            {poster.details.livePreview && (
              <div className="poster-details-row">
                <dt className="poster-live-label">Live Preview:</dt>
                <dd>
                  <a
                    href={poster.details.livePreview.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {poster.details.livePreview.label}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <section className="poster-body">
        {poster.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>

      <section className="poster-gallery">
        {poster.gallery.map((src) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={1376}
            height={1607}
            sizes="(max-width: 809px) 100vw, 1376px"
          />
        ))}
      </section>

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
