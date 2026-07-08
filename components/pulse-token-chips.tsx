"use client";

import { useEffect, useRef, useState } from "react";
import { stripCssComments } from "@/lib/css-sanitize";

/* ── The hero token chips (Fig. 01), made copyable — a design system's tokens
   should be usable, not just shown. Click a swatch to copy its hex; the label
   confirms. Small, on-thesis ("the system documents itself") interaction that
   reuses the page's own .pulse-spec-chip styling. ── */

const CHIPS = [
  { hex: "#49e0f5", role: "ready" },
  { hex: "#43ba51", role: "positive" },
  { hex: "#3987f3", role: "scheduled" },
  { hex: "#f19a08", role: "risk" },
  { hex: "#6366f1", role: "in progress" },
  { hex: "#ef4444", role: "decline" },
];

export function PulseTokenChips() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), 1400);
    } catch {
      /* clipboard unavailable — leave the label unchanged */
    }
  };

  return (
    <div className="pulse-spec-chips pulse-spec-chips--live" data-fade>
      <style dangerouslySetInnerHTML={{ __html: stripCssComments(CHIP_CSS) }} />
      {CHIPS.map((c) => (
        <button
          type="button"
          className={`pulse-spec-chip${copied === c.hex ? " is-copied" : ""}`}
          key={c.hex}
          onClick={() => copy(c.hex)}
          aria-label={`Copy ${c.hex} (${c.role})`}
        >
          <i style={{ background: c.hex }} aria-hidden="true" />
          <span>{copied === c.hex ? "copied ✓" : c.hex}</span>
        </button>
      ))}
    </div>
  );
}

const CHIP_CSS = `
.pulse-spec-chips--live .pulse-spec-chip {
  border: 0;
  padding: 0;
  margin: 0;
  background: none;
  font: inherit;
  text-align: left;
  cursor: copy;
}
.pulse-spec-chips--live .pulse-spec-chip i {
  transition: box-shadow 0.16s ease, transform 0.16s ease;
}
.pulse-spec-chips--live .pulse-spec-chip:hover i {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lift);
}
/* universal depress */
.pulse-spec-chips--live .pulse-spec-chip:active i {
  transform: translateY(1px) scale(0.99);
  transition-duration: 0.2s;
}
.pulse-spec-chips--live .pulse-spec-chip.is-copied span {
  color: var(--pp-cyan-dark, #0d7685);
}
.pulse-spec-chips--live .pulse-spec-chip:focus-visible {
  outline: none;
}
.pulse-spec-chips--live .pulse-spec-chip:focus-visible i {
  box-shadow: 0 0 0 3px var(--pp-cyan-ring, rgba(73, 224, 245, 0.42));
}
`;
