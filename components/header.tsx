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

  // Real-time nav ink: every nav element (logo + each link) takes its colour
  // from the ACTUAL background directly behind it, sampled per frame — so it
  // never goes invisible, even on mixed sections (e.g. the koi: links over the
  // dark pond go white while the logo / edge links over the white margins stay
  // ink). Colour is set inline so cached CSS can't defeat it.
  //
  // Detection walks elementsFromPoint and takes the first OPAQUE layer's
  // luminance. Two subtleties: (1) the night overlay is pointer-events:none, so
  // it never appears in the stack — when the stack above it is fully
  // transparent we fall back to reading its opacity; (2) the hero's own white
  // background + body/html sit BEHIND that overlay, so they're skipped (they'd
  // otherwise falsely read "light" at night).
  useEffect(() => {
    const inkFor = (el: HTMLElement, dark: boolean) => {
      if (el.classList.contains("nav-logo-zh")) return dark ? "#ffffff" : "#161616";
      if (el.classList.contains("active")) return dark ? "#ff6a5a" : "#d10000";
      return dark ? "#ffffff" : "#1a1a1a";
    };
    const overlayDark = () => {
      const o = document.querySelector<HTMLElement>("[data-night-overlay]");
      return !!o && parseFloat(getComputedStyle(o).opacity || "0") > 0.5;
    };
    // average luminance of every rgb/rgba colour in a string — handles solid
    // background-color AND gradient background-image (e.g. the moon dial's dark
    // radial sky); near-transparent stops are ignored.
    const colorLum = (str: string) => {
      const cols = str.match(/rgba?\([^)]+\)/g);
      if (!cols) return null;
      let sum = 0,
        n = 0,
        maxA = 0;
      for (const col of cols) {
        const m = col.match(/[\d.]+/g);
        if (!m) continue;
        const a = m[3] !== undefined ? parseFloat(m[3]) : 1;
        if (a < 0.15) continue;
        sum += 0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2];
        n++;
        if (a > maxA) maxA = a;
      }
      return n ? { lum: sum / n, a: maxA } : null;
    };
    const isDarkBehind = (x: number, y: number) => {
      const stack = document.elementsFromPoint(x, y) as HTMLElement[];
      for (const el of stack) {
        if (
          el.closest(".content-nav") ||
          el.closest(".nav-drawer") ||
          el.hasAttribute("data-hero-bg") ||
          el.tagName === "BODY" ||
          el.tagName === "HTML"
        )
          continue;
        if (el.closest("[data-nav-dark]")) return true; // explicit dark scene
        const cs = getComputedStyle(el);
        const op = parseFloat(cs.opacity || "1");
        // first opaque layer wins — try solid colour, then gradient image
        const solid = colorLum(cs.backgroundColor);
        if (solid && solid.a * op >= 0.6) return solid.lum < 115;
        const bgi = cs.backgroundImage;
        if (op >= 0.6 && bgi && bgi.indexOf("gradient") !== -1) {
          const grad = colorLum(bgi);
          if (grad) return grad.lum < 115;
        }
      }
      return overlayDark(); // stack transparent → the night overlay shows through
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      document
        .querySelectorAll<HTMLElement>(".nav-logo-zh, .nav-links a")
        .forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0) return; // hidden (mobile → hamburger)
          el.style.color = inkFor(
            el,
            isDarkBehind(r.left + r.width / 2, r.top + r.height / 2)
          );
        });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    // the overlay fades via inline opacity (no scroll/class event) while the
    // hero's scroll-spring settles, so poll briefly to keep the nav in sync
    const poll = window.setInterval(schedule, 200);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearInterval(poll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return (
    <>
      <nav
        className={`content-nav${scrolled ? " scrolled" : ""}`}
        aria-label="Primary navigation"
      >
        <div className="content-nav-inner">
          <Link href="/" className="nav-logo" aria-label="Xuyuan Liu — home">
            <span className="nav-logo-zh">{site.nameZh}</span>
          </Link>
          <div className="nav-links">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
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
