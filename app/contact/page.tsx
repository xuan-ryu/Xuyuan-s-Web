import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/data/site";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Xuyuan Liu.",
};

const SEAL_SRC =
  "/media/shared/seal.png";

// "Correspondence: the letter sheet" — the contact page composed as a letter:
// condensed letterhead, opening line, a hairline address ledger (the email is
// the primary object), the portrait as the enclosed photograph with a red chop,
// and the form as the letter body that ends in a seal. One 1440/48 shell for
// the whole page; 12 columns, 24px gutters, 8px baseline. Scoped .ctc- styles
// live here (globals.css is not touched); the legacy .contact-*/.form-* rules
// in globals.css are orphaned by this redesign.
const contactCss = `
.ctc-page {
  background: var(--paper);
  color: var(--ink-950);
}

/* ── Hero — letterhead + address ledger ─────────────────────────
   Shell 1440px / 48px gutters → 1344px field; 12 cols, 24px
   gutters → 90px units. H1 cols 1–9, text block cols 1–5 (546px),
   inscription col 7, portrait cols 8–12 (546px). align-items:
   start ties the intro top to the portrait top (no dead void). */
.ctc-hero {
  max-width: 1440px;
  margin: 0 auto;
  padding: 200px 48px 96px;
}
.ctc-title {
  margin-bottom: 64px;
  font-family: var(--font-condensed);
  font-size: var(--text-display-2);
  font-weight: 300;
  line-height: 0.88;
  letter-spacing: var(--track-display);
  text-transform: uppercase;
}
.ctc-hero-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 24px;
  align-items: start;
}
.ctc-lead-col {
  grid-column: 1 / span 5;
}
.ctc-intro {
  font-size: var(--text-lead);
  line-height: 1.5;
  color: rgba(10, 10, 10, 0.8);
}

/* address ledger — replaces the black mini-card; the email becomes
   a first-class object. Label column = 114px (col 1 + gutter) so
   values sit on the col-2 rail. */
.ctc-ledger {
  margin-top: 56px;
}
.ctc-ledger-row {
  display: grid;
  grid-template-columns: 114px minmax(0, 1fr);
  align-items: baseline;
  padding: 20px 0;
  border-top: 1px solid var(--rule);
}
.ctc-ledger-row:last-child {
  border-bottom: 1px solid var(--rule);
}
.ctc-ledger-label {
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  line-height: 1.6;
  color: rgba(10, 10, 10, 0.55);
}
.ctc-ledger-value {
  font-size: var(--text-body);
  line-height: var(--leading-tight);
  color: var(--ink-950);
}
a.ctc-ledger-value {
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-silk);
}
a.ctc-ledger-value:hover {
  color: var(--accent-amber);
}
a.ctc-ledger-value:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
/* email — the page's primary action: quiet-CTA seal-red rule wipe
   (reuses .cta .cta--quiet), scaled up to title size. */
.cta.ctc-ledger-mail {
  font-size: var(--text-title);
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  line-height: var(--leading-tight);
}

/* portrait — the enclosed photograph, chop pressed on its corner.
   The chop sits outside the clipping frame, so it hangs off the
   media edge like a stamp on a print. */
.ctc-portrait {
  grid-column: 8 / -1;
  position: relative;
}
.ctc-portrait-frame {
  position: relative;
  aspect-ratio: 546 / 600;
  border-radius: var(--radius-media);
  overflow: hidden;
  background: var(--paper-shade);
}
.ctc-portrait-frame img {
  object-fit: cover;
  object-position: 50% 22%;
}
.ctc-portrait-chop {
  position: absolute;
  left: 0;
  bottom: 0;
  transform: translate(-40%, 30%) rotate(-6deg);
  filter: drop-shadow(0 6px 14px rgba(5, 5, 5, 0.22));
}

/* Reveal choreography — the address is written line by line, and the chop
   presses onto the print (a scale settle that keeps the chop's placement
   transform). Hidden states live under no-preference so reduced motion /
   no-JS show the finished letterhead; both containers become silent hosts
   so only the rows / the chop carry the motion, not a competing block fade. */
@media (prefers-reduced-motion: no-preference) {
  .ctc-ledger[data-fade] {
    opacity: 1;
    transform: none;
    filter: none;
    animation: none;
  }
  .ctc-ledger[data-fade] .ctc-ledger-row {
    opacity: 0.001;
    transform: translateY(12px);
  }
  .ctc-ledger[data-fade].is-visible .ctc-ledger-row {
    animation: ctcRowIn 0.5s var(--ease-silk) both;
  }
  .ctc-ledger[data-fade].is-visible .ctc-ledger-row:nth-child(1) { animation-delay: 80ms; }
  .ctc-ledger[data-fade].is-visible .ctc-ledger-row:nth-child(2) { animation-delay: 160ms; }
  .ctc-ledger[data-fade].is-visible .ctc-ledger-row:nth-child(3) { animation-delay: 240ms; }
  .ctc-portrait[data-fade] .ctc-portrait-chop {
    opacity: 0.001;
    transform: translate(-40%, 30%) rotate(-6deg) scale(1.18);
  }
  .ctc-portrait[data-fade].is-visible .ctc-portrait-chop {
    animation: ctcChopPress 0.52s var(--ease-spring) both;
    animation-delay: 220ms;
  }
}
@keyframes ctcRowIn {
  from { opacity: 0.001; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes ctcChopPress {
  from {
    opacity: 0.001;
    transform: translate(-40%, 30%) rotate(-6deg) scale(1.18);
  }
  to {
    opacity: 1;
    transform: translate(-40%, 30%) rotate(-6deg) scale(1);
  }
}

/* ── Fold rule + form — Write a note ────────────────────────────
   Same shell as the hero. Full-width hairline "fold", 96px below
   it the H2 (cols 1–7); form continues the left reading rail on
   cols 1–7, aside note on cols 9–12. */
.ctc-form-section {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px 224px;
}
.ctc-form-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 24px;
  border-top: 1px solid var(--rule);
  padding-top: 96px;
}
.ctc-form-title {
  grid-column: 1 / span 7;
  margin-bottom: 48px;
  font-size: var(--text-heading);
  font-weight: 400;
  line-height: var(--leading-tight);
}
.ctc-form {
  grid-column: 1 / span 7;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.ctc-aside {
  grid-column: 9 / -1;
  grid-row: 2;
  align-self: start;
  border-top: 1px solid var(--rule);
  padding-top: 20px;
  font-size: var(--text-meta);
  line-height: 1.6;
  color: rgba(10, 10, 10, 0.6);
}

/* field system — paper-warm fill, hairline border, 4px radius,
   52px control height (the CTA slab height). Labels reuse the
   ledger's uppercase label voice. */
.ctc-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 24px;
}
.ctc-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ctc-field label {
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  line-height: 1;
  color: rgba(10, 10, 10, 0.55);
}
.ctc-field input,
.ctc-field select,
.ctc-field textarea {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 1px solid var(--rule);
  border-radius: var(--radius-control);
  background: var(--paper-warm);
  color: var(--ink-950);
  font-family: var(--font-text);
  font-size: var(--text-meta);
  line-height: 1.4;
  transition:
    background var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard);
}
.ctc-field textarea {
  height: auto;
  min-height: 176px;
  padding: 14px 16px;
  resize: vertical;
}
.ctc-field select {
  padding-right: 44px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' fill='none' stroke='%230a0a0a' stroke-width='1.25'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}
.ctc-field input::placeholder,
.ctc-field textarea::placeholder {
  color: var(--stone);
}
.ctc-field input:focus,
.ctc-field select:focus,
.ctc-field textarea:focus {
  border-color: var(--ink-950);
  background: var(--paper);
  outline: none;
}
/* shared focus contract — amber ring at the shared offset */
.ctc-field input:focus-visible,
.ctc-field select:focus-visible,
.ctc-field textarea:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
/* validation — seal red carries error semantics (site pattern) */
.ctc-form [aria-invalid="true"] {
  border-color: var(--seal-red);
}
.ctc-form [aria-invalid="true"]:focus,
.ctc-form [aria-invalid="true"]:focus-visible {
  border-color: var(--seal-red);
  outline-color: var(--seal-red);
}
.ctc-error {
  font-size: var(--text-label);
  line-height: 1.4;
  color: var(--seal-red);
}

/* submit — the ink slab on the col-1 rail with a reserved seal
   slot beside it; the red seal stamps in when the letter is
   "sealed" (mailto handed off). The stamp is absolutely placed so
   no layout shifts between states. */
.ctc-submit-row {
  display: flex;
  align-items: center;
  gap: 24px;
}
.cta.ctc-submit {
  width: auto;
  min-width: 220px;
}
.cta.ctc-submit:active {
  transform: translateY(1px);
}
.ctc-seal-slot {
  position: relative;
  flex: 0 0 64px;
  align-self: stretch;
  pointer-events: none;
}
.ctc-seal-stamp {
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -42px;
  opacity: 0;
  transform-origin: 50% 60%;
  animation: ctcSealPress 0.48s var(--ease-spring) forwards;
  filter: drop-shadow(0 2px 8px rgba(5, 5, 5, 0.18));
}
@keyframes ctcSealPress {
  from {
    opacity: 0;
    transform: scale(1.18) rotate(-9deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(-4deg);
  }
}
.ctc-status {
  min-height: 1.5em;
  font-size: var(--text-meta);
  line-height: 1.5;
  color: rgba(10, 10, 10, 0.66);
}

@media (prefers-reduced-motion: reduce) {
  .ctc-seal-stamp {
    animation: none;
    opacity: 1;
    transform: rotate(-4deg);
  }
}

/* tablet — single rail: intro + ledger, then the photograph at
   min(100%, 546px); the aside becomes a paragraph above the form. */
@media (max-width: 1079.98px) {
  .ctc-hero {
    padding: 160px 24px 80px;
  }
  .ctc-title {
    margin-bottom: 56px;
  }
  .ctc-hero-grid {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 48px;
  }
  .ctc-lead-col {
    grid-column: 1 / -1;
    max-width: 680px;
  }
  .ctc-portrait {
    grid-column: 1 / -1;
    width: min(100%, 546px);
  }
  .ctc-form-section {
    padding: 0 24px 160px;
  }
  .ctc-form-grid {
    grid-template-columns: minmax(0, 1fr);
    padding-top: 64px;
  }
  .ctc-form-title {
    grid-column: 1;
    margin-bottom: 40px;
  }
  .ctc-aside {
    grid-column: 1;
    grid-row: 2;
    max-width: 546px;
    margin-bottom: 48px;
  }
  .ctc-form {
    grid-column: 1;
    grid-row: 3;
  }
}

/* phone — one reading column, 20px gutters; rows stack, the
   submit stretches, the stamp presses over its right end. */
@media (max-width: 809.98px) {
  .ctc-hero {
    padding: 128px 20px 64px;
  }
  .ctc-title {
    margin-bottom: 48px;
  }
  .ctc-hero-grid {
    row-gap: 40px;
  }
  .ctc-ledger {
    margin-top: 40px;
  }
  .ctc-ledger-row {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 8px;
    padding: 16px 0;
  }
  .ctc-portrait {
    width: 100%;
  }
  .ctc-form-section {
    padding: 0 20px 128px;
  }
  .ctc-form-grid {
    padding-top: 56px;
  }
  .ctc-form-row {
    grid-template-columns: minmax(0, 1fr);
  }
  .cta.ctc-submit {
    width: 100%;
    min-width: 0;
  }
  .ctc-submit-row {
    position: relative;
  }
  .ctc-seal-slot {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 12px;
    flex: none;
    width: 64px;
  }
}
`;

export default function Contact() {
  return (
    <div className="ctc-page">
      <style dangerouslySetInnerHTML={{ __html: contactCss }} />

      <section className="ctc-hero" id="header">
        <h1 className="ctc-title" data-fade>
          Contact Me
        </h1>

        <div className="ctc-hero-grid">
          <div className="ctc-lead-col">
            <p className="ctc-intro" data-fade>
              Have a project, a half-formed idea, or just want to compare notes
              on design and AI? I&apos;m most useful early &mdash; while the
              problem is still messy and the right shape isn&apos;t obvious
              yet. Tell me what you&apos;re working on.
            </p>

            <dl className="ctc-ledger" data-fade>
              <div className="ctc-ledger-row">
                <dt className="ctc-ledger-label">Email</dt>
                <dd>
                  <a
                    className="cta cta--quiet ctc-ledger-mail"
                    href={`mailto:${site.email}`}
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="ctc-ledger-row">
                <dt className="ctc-ledger-label">Phone</dt>
                <dd>
                  <a
                    className="ctc-ledger-value"
                    href={`tel:${site.phone.replace(/\s+/g, "")}`}
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div className="ctc-ledger-row">
                <dt className="ctc-ledger-label">Based in</dt>
                <dd className="ctc-ledger-value">{site.location}</dd>
              </div>
            </dl>
          </div>

          <div className="ctc-portrait" data-fade>
            <div className="ctc-portrait-frame">
              <Image
                src="/media/shared/portrait.jpg"
                alt="Xuyuan Liu"
                fill
                sizes="(max-width: 809px) calc(100vw - 40px), (max-width: 1079px) min(calc(100vw - 48px), 546px), 546px"
                priority
              />
            </div>
            <Image
              src={SEAL_SRC}
              alt=""
              width={45}
              height={95}
              className="ctc-portrait-chop"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <section className="ctc-form-section">
        <div className="ctc-form-grid">
          <h2 className="ctc-form-title" data-fade>
            Write a note
          </h2>
          <ContactForm />
          <aside className="ctc-aside" aria-label="How this form works" data-fade>
            This form opens your mail app with the note pre-filled &mdash;
            nothing is stored on the site. I usually reply within a day or two.
          </aside>
        </div>
      </section>
    </div>
  );
}
