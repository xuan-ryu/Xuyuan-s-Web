"use client";

import { useEffect, useRef, useState } from "react";
import { stripCssComments } from "@/lib/css-sanitize";

/* ── The Creative Brief (Fig. 19), made genuinely editable — the caption
   claims "editable fields inside the chat," so it should be true. A person
   edits the AI's draft in place (the human-in-the-loop thesis, in miniature),
   then approves it through the same submit → busy → landed contract every Pulse
   control follows. Styling is inherited from the page's own .pulse-brief-*
   rules; this island only adds the interaction. ── */

const INITIAL = [
  { label: "Audience", value: "Urban runners, 18–29, early-morning crews" },
  { label: "Key message", value: "City miles before the city wakes" },
  { label: "Content direction", value: "Short-form video · street-level POV" },
  { label: "Tone", value: "Confident, unhurried" },
  { label: "Visual style", value: "Natural light, muted brand palette" },
];

function AutoText({
  value,
  onChange,
  onCommit,
}: {
  value: string;
  onChange: (v: string) => void;
  onCommit: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // preventScroll: this mounts inside a long case page — focusing must
    // never move the viewport (QA: an auto-focused field mid-page scrolled
    // the whole document there on load under reduced motion).
    el.focus({ preventScroll: true });
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);
  return (
    <textarea
      ref={ref}
      className="pulse-brief-edit"
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onCommit}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onCommit();
        }
        if (e.key === "Escape") onCommit();
      }}
    />
  );
}

export function PulseCreativeBrief() {
  const [fields, setFields] = useState(INITIAL);
  // No field starts in edit mode: a pre-focused textarea steals document
  // focus at hydration (and drags the reduced-motion viewport to it). The
  // InteractiveCue names the gesture instead.
  const [editing, setEditing] = useState<number | null>(null);
  const [approve, setApprove] = useState<"idle" | "busy" | "done">("idle");
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => clearTimeout(id));
  }, []);

  const setValue = (i: number, v: string) =>
    setFields((prev) => prev.map((f, idx) => (idx === i ? { ...f, value: v } : f)));

  const runApprove = () => {
    if (approve !== "idle") return;
    setEditing(null);
    setApprove("busy");
    timers.current.push(window.setTimeout(() => setApprove("done"), 950));
    timers.current.push(window.setTimeout(() => setApprove("idle"), 2600));
  };

  return (
    <div className="pulse-brief pulse-brief--live">
      <style dangerouslySetInnerHTML={{ __html: stripCssComments(BRIEF_CSS) }} />
      <header className="pulse-brief-head">
        <strong>Creative Brief</strong>
        <span className="pulse-brief-chip">Drafted by Pulse</span>
      </header>
      {fields.map((field, i) => (
        <div
          className={`pulse-brief-field${editing === i ? " is-editing" : ""}`}
          key={field.label}
          onClick={() => editing !== i && setEditing(i)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (editing !== i && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setEditing(i);
            }
          }}
          aria-label={`Edit ${field.label}`}
        >
          <span>{field.label}</span>
          {editing === i ? (
            <AutoText
              value={field.value}
              onChange={(v) => setValue(i, v)}
              onCommit={() => setEditing(null)}
            />
          ) : (
            <p>{field.value}</p>
          )}
        </div>
      ))}
      <footer className="pulse-brief-foot">
        <span className="pulse-brief-budget">Est. spend &middot; 320 credits</span>
        <button
          type="button"
          className={`pulse-brief-approve is-${approve}`}
          onClick={runApprove}
          aria-busy={approve === "busy"}
        >
          {approve === "busy" && <i className="pulse-brief-spin" aria-hidden="true" />}
          {approve === "done" && <i className="pulse-brief-tick" aria-hidden="true" />}
          <span>
            {approve === "busy" ? "Approving" : approve === "done" ? "Approved" : "Approve brief"}
          </span>
        </button>
      </footer>
    </div>
  );
}

const BRIEF_CSS = `
.pulse-brief--live .pulse-brief-field {
  cursor: text;
  transition: border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
}
.pulse-brief--live .pulse-brief-field:not(.is-editing):hover {
  border-color: var(--pp-cyan-ring);
  background: #fff;
}
.pulse-brief--live .pulse-brief-field:focus-visible {
  outline: none;
  border-color: transparent;
  box-shadow: 0 0 0 3px var(--pp-cyan-ring);
}
.pulse-brief-edit {
  display: block;
  width: 100%;
  margin: 3px 0 0;
  padding: 0;
  border: 0;
  background: transparent;
  resize: none;
  overflow: hidden;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.45;
  color: var(--pp-ink);
  caret-color: var(--pp-cyan-dark);
}
.pulse-brief-edit:focus { outline: none; }
.pulse-brief-approve {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid transparent;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.18s ease, color 0.18s ease;
}
.pulse-brief-approve.is-done {
  background: #207d32;
}
.pulse-brief-approve:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--pp-cyan-ring);
}
.pulse-brief-spin {
  width: 12px; height: 12px; border-radius: 9999px;
  border: 2px solid rgba(255,255,255,0.55); border-top-color: #fff;
  animation: pulseBriefSpin 0.7s linear infinite;
}
.pulse-brief-tick { width: 12px; height: 12px; position: relative; }
.pulse-brief-tick::after {
  content: ""; position: absolute; left: 4px; top: 0;
  width: 4px; height: 8px; border: solid #fff; border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
@keyframes pulseBriefSpin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .pulse-brief-spin { animation: none; border-top-color: rgba(255,255,255,0.55); }
}
`;
