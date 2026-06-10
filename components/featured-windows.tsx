"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type FeaturedProject = {
  slug: string;
  title: string;
  cover?: string;
  blurb: string;
};

type ActivePreview = {
  project: FeaturedProject;
  label: string;
  group: "a" | "b";
};

function WindowPane({
  project,
  label,
  side,
  group,
  active,
  onActive,
}: {
  project: FeaturedProject;
  label: string;
  side: "left" | "right";
  group: "a" | "b";
  active: boolean;
  onActive: (preview: ActivePreview) => void;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`window-pane window-pane-${side}${active ? " is-active" : ""}`}
      onPointerEnter={() => onActive({ project, label, group })}
      onFocus={() => onActive({ project, label, group })}
    >
      <span className="window-pane-number">{label}</span>
      <span className="window-pane-preview" aria-hidden="true">
        {project.cover ? (
          <Image src={project.cover} alt="" fill sizes="230px" />
        ) : null}
        <span>{project.title}</span>
      </span>
    </Link>
  );
}

export function FeaturedWindows({ projects }: { projects: FeaturedProject[] }) {
  const featured = projects.slice(0, 4);
  const [active, setActive] = useState<ActivePreview | null>(null);
  const activeKey = active ? active.project.slug : "";

  if (featured.length < 4) return null;

  return (
    <div className="home-window-stage" onPointerLeave={() => setActive(null)}>
      <div className="home-window-unit window-unit-a">
        <div className="window-shape" aria-label="Featured projects 01 and 02">
          <WindowPane
            project={featured[0]}
            label="01"
            side="left"
            group="a"
            active={activeKey === featured[0].slug}
            onActive={setActive}
          />
          <WindowPane
            project={featured[1]}
            label="02"
            side="right"
            group="a"
            active={activeKey === featured[1].slug}
            onActive={setActive}
          />
        </div>
        <span className="window-caption">Hover on the Window to View</span>
      </div>

      <div className="featured-roof-line" aria-hidden="true">
        <Image
          src="/assets/framerusercontent.com/images/wgP2v6bRLltf0I89tfuRuq6sUhQ.png"
          alt=""
          fill
          sizes="100vw"
        />
      </div>

      <div className="featured-bamboo" aria-hidden="true">
        <Image
          src="/assets/framerusercontent.com/images/L1vpdZpPpmGxuSapa0YWEYsqI.png"
          alt=""
          fill
          sizes="520px"
        />
      </div>

      <div className="home-window-unit window-unit-b">
        <div className="window-shape" aria-label="Featured projects 03 and 04">
          <WindowPane
            project={featured[2]}
            label="03"
            side="left"
            group="b"
            active={activeKey === featured[2].slug}
            onActive={setActive}
          />
          <WindowPane
            project={featured[3]}
            label="04"
            side="right"
            group="b"
            active={activeKey === featured[3].slug}
            onActive={setActive}
          />
        </div>
        <span className="window-caption">Hover on the Window to View</span>
      </div>

      <div className="featured-garden-tree" aria-hidden="true">
        <Image
          src="/assets/framerusercontent.com/images/gu9zjePdorThhw4JGrGru2eXBY.png"
          alt=""
          fill
          sizes="360px"
        />
      </div>

      <div className="featured-garden-rock" aria-hidden="true">
        <Image
          src="/assets/framerusercontent.com/images/3GdEAzchhqqng8XQl1Obd6fHMUk.png"
          alt=""
          fill
          sizes="320px"
        />
      </div>

      {active ? (
        <Link
          href={`/work/${active.project.slug}`}
          className={`featured-project-preview preview-group-${active.group}`}
        >
          <span className="featured-preview-media">
            {active.project.cover ? (
              <Image
                src={active.project.cover}
                alt=""
                fill
                sizes="72vw"
                priority={false}
              />
            ) : null}
          </span>
          <span className="featured-preview-copy">
            <span className="featured-preview-title">{active.project.title}</span>
            <span className="featured-preview-body">
              {active.project.blurb.split("\n\n")[0]}
            </span>
            <span className="featured-preview-button">View Detail</span>
          </span>
        </Link>
      ) : null}
    </div>
  );
}
