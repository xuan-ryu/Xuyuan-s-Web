"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// GSAP-powered masked text reveal (RevealText markup:
// .text-reveal → .text-reveal-slot[overflow:hidden] → .text-reveal-item).
// An IntersectionObserver triggers the GSAP timeline as each reveal enters view
// (fires immediately for above-the-fold content on load, on scroll for the
// rest). IO is used instead of ScrollTrigger because it stays reliable under
// Lenis smooth scroll — ScrollTrigger left in-view items hidden until the first
// scroll. The animation itself is pure GSAP.
export function GsapReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>(".text-reveal"),
    );
    if (!reveals.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveals.forEach((el) =>
        el.querySelectorAll<HTMLElement>(".text-reveal-item").forEach((it) => {
          it.style.opacity = "1";
          it.style.transform = "none";
          it.style.filter = "none";
        }),
      );
      return;
    }

    const play = (el: HTMLElement) => {
      const items = el.querySelectorAll<HTMLElement>(".text-reveal-item");
      if (!items.length) return;
      const left = el.classList.contains("text-reveal-left");
      const right = el.classList.contains("text-reveal-right");
      const isChar = el.classList.contains("text-reveal-char");
      const isLine = el.classList.contains("text-reveal-line");
      const isAboutReveal = Boolean(
        el.closest(
          ".about-header, .about-essay, .about-dark, .about-activities, .about-habits",
        ),
      );
      const travelX = isAboutReveal ? 28 : 64;
      const travelY = isAboutReveal ? 72 : 116;
      const blur = isAboutReveal ? 4 : 8;

      gsap.fromTo(
        items,
        {
          opacity: 0,
          filter: `blur(${blur}px)`,
          yPercent: left || right ? 0 : travelY,
          x: left ? -travelX : right ? travelX : 0,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          yPercent: 0,
          x: 0,
          duration: isAboutReveal ? (isLine ? 1.05 : 0.96) : isLine ? 0.82 : 0.92,
          ease: isAboutReveal ? "power4.out" : "power3.out",
          stagger: isChar ? (isAboutReveal ? 0.018 : 0.026) : isLine ? 0 : 0.05,
        },
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          play(entry.target as HTMLElement);
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );
    reveals.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
