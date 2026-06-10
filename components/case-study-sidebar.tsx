"use client";

import { useEffect, useMemo, useState } from "react";

type SidebarItem = {
  href: string;
  label: string;
};

export function CaseStudySidebar({ items }: { items: SidebarItem[] }) {
  const ids = useMemo(
    () => items.map((item) => item.href.replace(/^#/, "")),
    [items],
  );
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    if (ids.length === 0) return;

    const syncFromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (ids.includes(id)) setActiveId(id);
    };

    syncFromHash();

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -58% 0px",
        threshold: [0, 0.2, 0.5, 0.8],
      },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener("hashchange", syncFromHash);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, [ids]);

  return (
    <aside className="proj-sidebar">
      <nav aria-label="Case study sections">
        {items.map((item) => {
          const id = item.href.replace(/^#/, "");
          return (
            <a
              key={item.href}
              href={item.href}
              className={activeId === id ? "active" : undefined}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
