"use client";

import { useEffect, useState } from "react";

type WorkViewMode = "list" | "card";

export function WorkViewControls() {
  const [mode, setMode] = useState<WorkViewMode>("list");

  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".work-index-page");
    page?.setAttribute("data-work-view", mode);
  }, [mode]);

  return (
    <div className="work-view-controls" role="group" aria-label="Work layout">
      <button
        type="button"
        className="work-view-control work-list-icon"
        aria-label="List view"
        aria-pressed={mode === "list"}
        onClick={() => setMode("list")}
      >
        <svg viewBox="0 0 44 44" focusable="false" aria-hidden="true">
          <rect className="work-list-icon-shell" width="44" height="44" rx="22" />
          <path className="work-list-icon-line" d="M12.5 15h19" />
          <path className="work-list-icon-line" d="M12.5 22h19" />
          <path className="work-list-icon-line" d="M12.5 29h19" />
        </svg>
      </button>
      <button
        type="button"
        className="work-view-control work-card-icon"
        aria-label="Card view"
        aria-pressed={mode === "card"}
        onClick={() => setMode("card")}
      >
        <svg viewBox="0 0 44 44" focusable="false" aria-hidden="true">
          <rect className="work-card-icon-shell" width="44" height="44" rx="22" />
          <rect className="work-card-icon-window" x="11" y="12" width="22" height="18" rx="2" />
          <path className="work-card-icon-line" d="M15 18h14M15 24h10" />
        </svg>
      </button>
    </div>
  );
}
