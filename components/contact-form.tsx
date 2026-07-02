"use client";

import { useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { Cta } from "@/components/ui/cta";

const SEAL_SRC =
  "/assets/framerusercontent.com/images/ntwL7wUkSslvYCLMnzXaIuQu8zU.png";

const SERVICES = [
  "Branding",
  "Website and App Design",
  "Design & Marketing",
];

type Status = "idle" | "submitting" | "success" | "error";
type FieldKey = "name" | "email" | "message";
type Errors = Partial<Record<FieldKey, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const next: Errors = {};
    if (!name) next.name = "Please enter your name.";
    if (!email) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(email)) next.email = "That email doesn't look right.";
    if (!message) next.message = "Add a short note about your project.";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      setStatus("error");
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");
    // encodeURIComponent, not hand-rolled %0D%0A: unescaped '&'/'#'/newlines in
    // user input would otherwise truncate or flatten the mailto body.
    const body = encodeURIComponent(
      `Name: ${name}\r\nService: ${data.get("service")}\r\n\r\n${message}`,
    );
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("success");
  }

  const submitting = status === "submitting";
  const fieldProps = (k: FieldKey) =>
    errors[k]
      ? ({ "aria-invalid": true, "aria-describedby": `${k}-error` } as const)
      : {};

  return (
    <form className="ctc-form" onSubmit={handleSubmit} noValidate>
      <div className="ctc-form-row">
        <div className="ctc-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Smith"
            {...fieldProps("name")}
          />
          {errors.name && (
            <p className="ctc-error" id="name-error" role="alert">
              {errors.name}
            </p>
          )}
        </div>
        <div className="ctc-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jane@smith.com"
            {...fieldProps("email")}
          />
          {errors.email && (
            <p className="ctc-error" id="email-error" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <div className="ctc-field">
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
      <div className="ctc-field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          placeholder="Your message"
          {...fieldProps("message")}
        />
        {errors.message && (
          <p className="ctc-error" id="message-error" role="alert">
            {errors.message}
          </p>
        )}
      </div>
      <div className="ctc-submit-row">
        <Cta
          type="submit"
          variant="solid"
          large
          full
          className="ctc-submit"
          disabled={submitting}
        >
          {submitting
            ? "Opening email…"
            : status === "success"
              ? "Email opened"
              : "Submit"}
        </Cta>
        {/* seal-on-send — the letter is sealed when the mailto hands off;
            decorative (aria-hidden), the aria-live line below announces. */}
        <span className="ctc-seal-slot" aria-hidden="true">
          {status === "success" && (
            <Image
              src={SEAL_SRC}
              alt=""
              width={40}
              height={84}
              className="ctc-seal-stamp"
            />
          )}
        </span>
      </div>
      <p className="ctc-status" role="status" aria-live="polite">
        {status === "success"
          ? `Your email app should have opened with the message ready. If it didn't, write to ${site.email} directly.`
          : status === "error"
            ? "Please fix the highlighted fields and try again."
            : ""}
      </p>
    </form>
  );
}
