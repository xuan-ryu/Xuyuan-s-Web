"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type FeaturedProject = {
  slug: string;
  title: string;
  cover?: string;
  previewVideo?: string;
  tags?: string[];
  duration?: string;
};

function yearOf(duration?: string) {
  const years = duration?.match(/\d{4}/g);
  return years ? years[years.length - 1] : "";
}

export function FeaturedCards({
  projects,
}: {
  projects: FeaturedProject[];
}) {
  const list = projects.slice(0, 5);
  const [active, setActive] = useState<string>("");

  return (
    <div className="fc">
      <ul className="fc-grid" onPointerLeave={() => setActive("")}>
        {list.map((p, i) => {
          const num = String(i + 1).padStart(2, "0");
          const on = active === p.slug;
          return (
            <li
              key={p.slug}
              className={`fc-card${on ? " is-active" : ""}`}
              onPointerEnter={() => setActive(p.slug)}
            >
              <Link href={`/work/${p.slug}`} className="fc-link">
                <span className="fc-media">
                  {p.cover ? (
                    <Image
                      src={p.cover}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 50vw, 20vw"
                    />
                  ) : null}
                  {on && p.previewVideo ? (
                    <video
                      src={p.previewVideo}
                      poster={p.cover}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : null}
                </span>
                <span className="fc-meta">
                  <span className="fc-num">{num}</span>
                  <span className="fc-title">{p.title}</span>
                  <span className="fc-tags">{(p.tags ?? []).join(" · ")}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
