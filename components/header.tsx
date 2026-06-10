"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/data/site";

const nav = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 md:px-10 pt-6 pointer-events-none">
      <div className="flex items-start justify-between gap-6 pointer-events-auto">
        <Link href="/" className="group flex items-baseline gap-3">
          <span className="text-eyebrow text-ink">{site.name}</span>
          <span
            className="text-3xl md:text-4xl text-ink leading-none"
            style={{ fontFamily: "var(--font-brush)" }}
          >
            {site.nameZh}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-sm border border-rule bg-bg-elev/80 backdrop-blur px-2 py-1">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-eyebrow tracking-[0.28em] transition-colors ${
                  active ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="md:hidden border border-rule rounded-sm px-3 py-2 text-eyebrow"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="md:hidden pointer-events-auto mt-4 rounded-sm border border-rule bg-bg-elev/95 backdrop-blur p-4 flex flex-col gap-3">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`text-eyebrow ${
                  active ? "text-ink" : "text-ink-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
