import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FadeReveal } from "@/components/fade-reveal";
import { GsapReveal } from "@/components/gsap-reveal";
import { SmoothScroll } from "@/components/smooth-scroll";
import { PageTransition } from "@/components/page-transition";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: site.title, template: "%s — XUYUAN" },
  description: site.description,
  metadataBase: new URL("https://xuyuan.liu"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Cormorant Garamond + Newsreader are fully self-hosted now (@font-face
            in globals.css, incl. the 300/200/italic weights) — no Google link, no
            render-block. Noto Serif SC (CJK, impractical to self-host) + JetBrains
            Mono load async via a script-CREATED link: it lives outside React's
            tree, so flipping media print→all on load can't cause a hydration
            mismatch. media="print" keeps it off the render path; display=swap. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Noto+Sans+SC:wght@200;300;400;500;600;700&family=Saira+Condensed:wght@100;200;300;400&family=Oswald:wght@200;300&family=JetBrains+Mono:wght@100..800&display=swap';l.media='print';l.onload=function(){this.media='all';};document.head.appendChild(l);})();",
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Noto+Sans+SC:wght@200;300;400;500;600;700&family=Saira+Condensed:wght@100;200;300;400&family=Oswald:wght@200;300&family=JetBrains+Mono:wght@100..800&display=swap"
          />
        </noscript>
      </head>
      {/* suppressHydrationWarning: browser extensions (ColorZilla's
          cz-shortcut-listen, Grammarly, etc.) inject attributes on <html>/<body>
          before React hydrates — that's an extension artifact, not a real
          server/client mismatch. Only suppresses these elements' own attributes. */}
      <body suppressHydrationWarning>
        <div id="page-root">
          <SmoothScroll />
          <FadeReveal />
          <GsapReveal />
          <PageTransition />
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
