import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export function WorkCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block border border-rule overflow-hidden bg-bg-elev"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-6 md:p-8 space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-display text-2xl md:text-3xl uppercase tracking-wide">
            {project.title}
          </h3>
          <span className="text-eyebrow shrink-0">
            {String(project.order).padStart(2, "0")}
          </span>
        </div>
        <p className="text-ink-muted text-sm leading-relaxed line-clamp-3">
          {project.blurb}
        </p>
        <span className="inline-flex items-center gap-2 text-eyebrow text-ink group-hover:gap-3 transition-all">
          View project <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
