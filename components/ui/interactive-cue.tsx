import type { CSSProperties, ReactNode } from "react";
import "./interactive-cue.css";

/* A concise, consistent "this is interactive" hint for the case pages. One short
   phrase that names the gesture (owner rule: keep it simple — a sentence is
   enough, no arrows/icon clutter). A small dot in the case accent is the only
   mark; the text stays readable. Set the accent per case via the `accent` prop
   (or a scoped --icue-accent); dark grounds set --icue-text to a light value. */
export function InteractiveCue({
  children,
  accent,
  className = "",
}: {
  children: ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <span
      className={`icue ${className}`.trim()}
      style={accent ? ({ "--icue-accent": accent } as CSSProperties) : undefined}
    >
      {children}
    </span>
  );
}
