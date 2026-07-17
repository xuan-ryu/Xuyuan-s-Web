"use client";

import { useEffect, useRef, useState } from "react";
import { stripCssComments } from "@/lib/css-sanitize";
import { ramps } from "./pulse-content";

/* ── The six semantic ramps, made copyable stop by stop (L1, client).
   Same contract as the hero token chips: a design system's tokens should
   be usable, not just shown. Click any of the 60 stops to copy its hex —
   the row's trailing hex confirms. Markup keeps .pulse-ramps /
   .pulse-ramp-row / .pulse-ramp-stops so the layout's board styles and
   the assembly stagger keep applying unchanged. ── */

const STOP_NAMES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

export function PulseRampBoard() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (key: string, hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(key);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), 1400);
    } catch {
      /* clipboard unavailable — leave the row unchanged */
    }
  };

  return (
    <div className="pulse-ramps pulse-ramps--live">
      <style dangerouslySetInnerHTML={{ __html: stripCssComments(RAMP_CSS) }} />
      {ramps.map((ramp) => {
        const hit = copied?.startsWith(`${ramp.role}:`)
          ? copied.slice(ramp.role.length + 1)
          : null;
        return (
          <div className="pulse-ramp-row" key={ramp.role}>
            <span>{ramp.role}</span>
            <div className="pulse-ramp-stops">
              {ramp.stops.map((hex, i) => (
                <button
                  type="button"
                  key={hex}
                  style={{ background: hex }}
                  onClick={() => copy(`${ramp.role}:${hex}`, hex)}
                  aria-label={`Copy ${hex} (${ramp.role} ${STOP_NAMES[i]})`}
                  title={`${STOP_NAMES[i]} · ${hex}`}
                />
              ))}
            </div>
            <em className={hit ? "is-copied" : undefined}>{hit ?? ramp.base}</em>
          </div>
        );
      })}
    </div>
  );
}

const RAMP_CSS = `
.pulse-ramps--live .pulse-ramp-stops button {
  display: block;
  height: 100%;
  width: 100%;
  border: 0;
  padding: 0;
  background: none;
  cursor: copy;
}
.pulse-ramps--live .pulse-ramp-stops button:hover {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
}
.pulse-ramps--live .pulse-ramp-stops button:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px #fff;
}
.pulse-ramps--live .pulse-ramp-row > em.is-copied {
  color: var(--pp-cyan-dark, #0d7685);
}
`;
