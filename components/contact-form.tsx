"use client";

import { useState } from "react";
import { site } from "@/data/site";

const SERVICES = [
  "Branding",
  "Website and App Design",
  "Design & Marketing",
];

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = `Name: ${data.get("name")}%0D%0AService: ${data.get(
      "service",
    )}%0D%0A%0D%0A${data.get("message")}`;
    window.location.href = `mailto:${site.email}?subject=Portfolio inquiry from ${data.get(
      "name",
    )}&body=${body}`;
    setSent(true);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Smith"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jane@smith.com"
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="service">Service</label>
        <select id="service" name="service" defaultValue="">
          <option value="" disabled>
            Select...
          </option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          placeholder="Your  Message"
          required
        />
      </div>
      <button type="submit" className="btn contact-submit">
        {sent ? "Opening email..." : "Submit"}
      </button>
    </form>
  );
}
