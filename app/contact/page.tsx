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
            With a focus on innovation, storytelling, and user-centered design,
            I create immersive experiences that captivate and engage. Let&apos;s
            collaborate to bring your vision to life and craft digital solutions
            that leave a lasting impact.
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
