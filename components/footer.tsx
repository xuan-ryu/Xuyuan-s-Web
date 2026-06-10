import Link from "next/link";
import { site } from "@/data/site";

const nav = [
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
  { href: "/#value", label: "my value" },
  { href: "/contact", label: "contact" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="footer-logo">XUYUAN</div>
          <p className="footer-copy">
            © {new Date().getFullYear()} XUYUAN. All rights reserved.
          </p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="footer-social">
          <a
            href={site.socials.linkedin}
            rel="noopener"
            target="_blank"
          >
            linkedin
          </a>
          <a
            href={site.socials.instagram}
            rel="noopener"
            target="_blank"
          >
            instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
