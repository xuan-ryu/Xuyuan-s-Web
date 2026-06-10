import Link from "next/link";

export function CtaBlock() {
  return (
    <section id="cta" className="section cta-section">
      <div className="container">
        <h2 data-fade>
          LET&apos;S WORK
          <br />
          TOGETHER
        </h2>
        <Link href="/contact" className="btn" data-fade>
          get in touch
        </Link>
      </div>
    </section>
  );
}
