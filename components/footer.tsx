import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

const nav = [
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

// Black rounded inset card: socials in the top corners, red seal centered,
// nav row beneath, copyright at the bottom — mirrors the live footer.
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-socials-row">
          <a href={site.socials.linkedin} rel="noopener" target="_blank">
            linkedin
          </a>
          <a href={site.socials.instagram} rel="noopener" target="_blank">
            instagram
          </a>
        </div>
        <div className="footer-mark" aria-hidden="true">
          <Image
            src="/assets/framerusercontent.com/images/ntwL7wUkSslvYCLMnzXaIuQu8zU.png"
            alt=""
            width={36}
            height={69}
          />
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="footer-copy">&copy; Xuyuan Liu</p>
      </div>
    </footer>
  );
}
