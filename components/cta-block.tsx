import Link from "next/link";

export function CtaBlock() {
  return (
    <section className="px-6 md:px-10 py-24 md:py-32 border-t border-rule">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <h2 className="text-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.95]">
          Let&apos;s work
          <br />
          together.
        </h2>
        <Link
          href="/contact"
          className="self-start md:self-end inline-flex items-center gap-3 border border-ink text-ink px-6 py-3 text-eyebrow hover:bg-ink hover:text-bg transition-colors"
        >
          Get in touch
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
