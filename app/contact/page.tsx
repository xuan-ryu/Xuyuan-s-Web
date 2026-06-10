import type { Metadata } from "next";
import { site } from "@/data/site";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Xuyuan Liu.",
};

export default function Contact() {
  return (
    <>
      <section className="contact-header">
        <div className="container">
          <p className="label" data-fade>
            Get in touch
          </p>
          <h1 data-fade>Contact Me</h1>
          <p data-fade>
            For collaboration, freelance work, or just a hello — I&apos;m happy
            to hear from you.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="contact-layout">
            <aside className="contact-info">
              <h2>Direct contact</h2>
              <div className="contact-item">
                <div className="contact-item-label">Email</div>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
              <div className="contact-item">
                <div className="contact-item-label">Phone</div>
                <span>{site.phone}</span>
              </div>
              <div className="contact-item">
                <div className="contact-item-label">Based in</div>
                <span>{site.location}</span>
              </div>
              <div className="social-links">
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener"
                >
                  linkedin
                </a>
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noopener"
                >
                  instagram
                </a>
              </div>
            </aside>

            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
