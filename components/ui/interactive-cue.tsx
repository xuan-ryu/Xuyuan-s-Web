import type { CSSProperties, ReactNode } from "react";

/* Shared cue styles. Injected into each case page's own scoped <style> (the
   reliable path in this codebase — per-page critical CSS, not globals). The dot
   carries the case accent; the text stays readable. Dark grounds set
   --icue-text to a light value in their own scope. */
export const ICUE_CSS = `
.icue {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.03em;
  line-height: 1.4;
  color: var(--icue-text, rgba(5, 5, 5, 0.56));
}
.icue::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: var(--icue-accent, currentColor);
  flex: none;
}
`;

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
