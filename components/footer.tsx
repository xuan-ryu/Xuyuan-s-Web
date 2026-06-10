import Link from "next/link";
import { site } from "@/data/site";

const nav = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  { href: site.socials.linkedin, label: "LinkedIn" },
  { href: site.socials.instagram, label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-rule px-6 md:px-10 py-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div className="space-y-4">
          <Link href="/" className="flex items-baseline gap-3">
            <span className="text-eyebrow text-ink">{site.name}</span>
            <span
              className="text-3xl text-ink leading-none"
              style={{ fontFamily: "var(--font-brush)" }}
            >
              {site.nameZh}
            </span>
          </Link>
          <p className="text-ink-muted max-w-md text-sm leading-relaxed">
            {site.description}
          </p>
        </div>

        <div className="flex gap-10">
          <ul className="space-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-eyebrow hover:text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="space-y-2">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-eyebrow hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between text-xs text-ink-dim">
        <span>© {new Date().getFullYear()} Xuyuan Liu</span>
        <a href={`mailto:${site.email}`} className="hover:text-ink">
          {site.email}
        </a>
      </div>
    </footer>
  );
}
