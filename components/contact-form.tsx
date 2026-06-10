"use client";

import { useState } from "react";
import { site } from "@/data/site";

type Field = { id: string; label: string; type?: string; rows?: number };

const fields: Field[] = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email", type: "email" },
  { id: "service", label: "Service" },
  { id: "message", label: "Message", rows: 4 },
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = `Name: ${data.get("name")}%0D%0AService: ${data.get("service")}%0D%0A%0D%0A${data.get("message")}`;
    window.location.href = `mailto:${site.email}?subject=Portfolio inquiry from ${data.get("name")}&body=${body}`;
    setStatus("sent");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {fields.map((f) => (
        <div key={f.id} className="space-y-2">
          <label htmlFor={f.id} className="text-eyebrow block">
            {f.label}
          </label>
          {f.rows ? (
            <textarea
              id={f.id}
              name={f.id}
              rows={f.rows}
              required
              className="w-full bg-transparent border-b border-rule py-2 focus:border-ink focus:outline-none transition-colors resize-none"
            />
          ) : (
            <input
              id={f.id}
              name={f.id}
              type={f.type ?? "text"}
              required
              className="w-full bg-transparent border-b border-rule py-2 focus:border-ink focus:outline-none transition-colors"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="inline-flex items-center gap-3 border border-ink px-6 py-3 text-eyebrow hover:bg-ink hover:text-bg transition-colors"
      >
        {status === "sent" ? "Opening email…" : "Submit"}
        <span aria-hidden>→</span>
      </button>
    </form>
  );
}
