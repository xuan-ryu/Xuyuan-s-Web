import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

const nav = [
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

// Full-bleed ink colophon on the site grid: a mono eyebrow + the email as the
// condensed display anchor (the footer's one action), the red seal as the
// page's closing stamp, then a hairline meta row — pages / elsewhere / ©.
// Amber is the hover voice (non-case surface); the seal is the only red.
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-main">
          <div className="footer-cta">
            <p className="footer-eyebrow">Get in touch</p>
            <a className="footer-email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
          <div className="footer-mark" aria-hidden="true">
            <Image
              src="/media/shared/seal.png"
              alt=""
              width={36}
              height={76}
            />
          </div>
        </div>

        <div className="footer-meta">
          <nav className="footer-col" aria-label="Footer navigation">
            <p className="footer-col-label">Pages</p>
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="footer-col">
            <p className="footer-col-label">Elsewhere</p>
            <a href={site.socials.linkedin} rel="noopener" target="_blank">
              linkedin
            </a>
            <a href={site.socials.instagram} rel="noopener" target="_blank">
              instagram
            </a>
          </div>
          <p className="footer-copy">
            &copy; 2026 Xuyuan Liu &middot; designed &amp; built by hand in
            Next.js/React
          </p>
        </div>
      </div>
    </footer>
  );
}
