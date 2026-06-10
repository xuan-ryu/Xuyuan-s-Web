"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

const nav = [
  { href: "/", label: "home" },
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`content-nav${scrolled ? " scrolled" : ""}`}
        aria-label="Primary navigation"
      >
        <div className="content-nav-inner">
          <Link href="/" className="nav-logo">
            <span className="nav-logo-en">XUYUAN LIU</span>
            <span className="nav-logo-zh">{site.nameZh}</span>
          </Link>
          <div className="nav-links">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? false
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "active" : ""}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            className={`nav-toggle${open ? " open" : ""}`}
            onClick={() => setOpen((s) => !s)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      <div
        className={`nav-drawer${open ? " open" : ""}`}
        aria-hidden={!open}
      >
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
