"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// One observer pass for both reveal vocabularies:
// - [data-fade]/.fade-up/.text-reveal → .is-visible (detail pages)
// - .fx-rise/.fx-rise-big → .fx-revealed (home heading entrances)
export function FadeReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const fadeEls = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-fade], .fade-up, .text-reveal",
      ),
    );
    const fxEls = Array.from(
      document.querySelectorAll<HTMLElement>(".fx-rise, .fx-rise-big"),
    );
    if (fadeEls.length === 0 && fxEls.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fadeEls.forEach((el) => el.classList.add("is-visible"));
      fxEls.forEach((el) => el.classList.add("fx-revealed"));
      return;
    }

    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          fadeObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    fadeEls.forEach((el) => fadeObserver.observe(el));

    const fxObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("fx-revealed");
          fxObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );
    fxEls.forEach((el) => fxObserver.observe(el));

    return () => {
      fadeObserver.disconnect();
      fxObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
