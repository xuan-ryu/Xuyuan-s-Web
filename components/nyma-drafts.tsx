"use client";

import { useState } from "react";
import Image from "next/image";

// Nyma case page — the two AI drafts as papers on a desk (L1 interactive).
// The front sheet shows whole; the other peeks behind it, and clicking a
// sheet brings its argument forward (transform-only shuffle). Server
// renders Draft A in front as the final state; without JS both sheets and
// their pinned labels stay readable — the flip is an enhancement, not a
// gate. Styles live in the page's scoped <style> (nyma-case-layout.tsx).

const SHEETS = [
  {
    id: "a" as const,
    chip: "Draft A · the editorial argument",
    src: "/media/work/nyma/ai-draft-njal.png",
    width: 1440,
    height: 1230,
    alt: "An AI-generated HTML draft arguing with imagery: colorful live-auction and marketplace product rows under bold section headers.",
  },
  {
    id: "b" as const,
    chip: "Draft B · the structural argument",
    src: "/media/work/nyma/ai-draft-platform.png",
    width: 1440,
    height: 1290,
    alt: "An AI-generated HTML draft arguing with structure: a monochrome Platform Advantages card row and grayscale auction listings, typeset in mono.",
  },
];

export function NymaDrafts() {
  const [front, setFront] = useState<"a" | "b">("a");
  return (
    <div className="ny-drafts" data-front={front}>
      {SHEETS.map((sheet) => (
        <button
          type="button"
          key={sheet.id}
          className={`ny-draft is-${sheet.id}`}
          onClick={() => setFront(sheet.id)}
          aria-pressed={front === sheet.id}
          aria-label={`Bring ${sheet.chip} to the front`}
        >
          <span className="ny-draft-chip">{sheet.chip}</span>
          <Image
            src={sheet.src}
            width={sheet.width}
            height={sheet.height}
            alt={sheet.alt}
            sizes="(max-width: 768px) 100vw, 56vw"
          />
        </button>
      ))}
    </div>
  );
}
