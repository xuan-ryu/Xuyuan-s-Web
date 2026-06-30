import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/data/site";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Xuyuan Liu.",
};

export default function Contact() {
  return (
    <div className="contact-page">
      <section className="contact-hero" id="header">
        <h1 className="contact-title" data-fade>
          Contact Me
        </h1>

        <div className="contact-hero-grid">
          <p className="contact-intro" data-fade>
            Have a project, a half-formed idea, or just want to compare notes on
            design and AI? I&apos;m most useful early &mdash; while the problem is
            still messy and the right shape isn&apos;t obvious yet. Tell me what
            you&apos;re working on.
          </p>

          <aside className="contact-card" aria-label="Contact information">
            <Image
              src="/assets/framerusercontent.com/images/ntwL7wUkSslvYCLMnzXaIuQu8zU.png"
              alt=""
              width={304}
              height={641}
              className="contact-card-mark"
            />
            <div className="contact-card-links">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={`tel:${site.phone.replace(/\s+/g, "")}`}>
                {site.phone}
              </a>
            </div>
          </aside>

          <div className="contact-portrait">
            <Image
              src="/assets/framerusercontent.com/images/oVKSCPMnnMqcT6I6GkrYcVaI0U.jpg"
              alt="Xuyuan Liu"
              fill
              sizes="(max-width: 809px) calc(100vw - 48px), 310px"
              priority
            />
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <ContactForm />
      </section>
    </div>
  );
}
