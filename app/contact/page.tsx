import type { Metadata } from "next";
import { site } from "@/data/site";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Xuyuan Liu.",
};

export default function Contact() {
  return (
    <section className="px-6 md:px-10 pt-40 pb-24 grid lg:grid-cols-2 gap-16 lg:gap-24 max-w-7xl">
      <div className="space-y-10">
        <div>
          <span className="text-eyebrow">Contact</span>
          <h1 className="mt-4 text-display text-[clamp(3rem,9vw,7rem)] leading-[0.95]">
            Contact Me
          </h1>
        </div>
        <p className="max-w-md text-ink-muted text-lg leading-relaxed">
          With a focus on innovation, storytelling, and user-centered design, I
          craft immersive experiences that captivate and engage. Let&apos;s
          collaborate.
        </p>
        <dl className="space-y-4 text-ink">
          <div>
            <dt className="text-eyebrow">Email</dt>
            <dd className="mt-1">
              <a
                href={`mailto:${site.email}`}
                className="hover:underline underline-offset-4"
              >
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-eyebrow">Phone</dt>
            <dd className="mt-1">{site.phone}</dd>
          </div>
          <div>
            <dt className="text-eyebrow">Based In</dt>
            <dd className="mt-1">{site.location}</dd>
          </div>
        </dl>
      </div>

      <ContactForm />
    </section>
  );
}
