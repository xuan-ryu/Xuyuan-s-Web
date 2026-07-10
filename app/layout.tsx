/* eslint-disable @next/next/no-page-custom-font -- Google Fonts are script-created here on purpose; see the hydration note below. */
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChunkGuard } from "@/components/chunk-guard";
import { FadeReveal } from "@/components/fade-reveal";
import { GsapReveal } from "@/components/gsap-reveal";
import { SmoothScroll } from "@/components/smooth-scroll";
import { PageTransition } from "@/components/page-transition";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: site.title, template: "%s — XUYUAN" },
  description: site.description,
  metadataBase: new URL("https://xuyuanliu.com"),
  openGraph: {
    type: "website",
    siteName: "Xuyuan Liu",
    title: site.title,
    description: site.description,
    url: "https://xuyuanliu.com",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.png"],
  },
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
        {/* Self-hosted faces (@font-face in globals.css): the brush fonts
            (LiuJian, CloudXingCaoGBK) and Murecho. Everything else — Manrope
            (the main UI face; --font-newsreader/--font-serif alias it),
            Noto Sans SC (CJK, impractical to self-host), Saira Condensed,
            Oswald, JetBrains Mono — loads async via a script-CREATED link: it
            lives outside React's tree, so flipping media print→all on load
            can't cause a hydration mismatch. media="print" keeps it off the
            render path; display=swap. */}
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
        {/* no-JS fallback (2026-07-07 audit): every reveal on the site hides
            behind [data-fade]/.text-reveal initial states that only client
            observers release — without JS the pages read blank. Force the
            final state; with JS this tag never renders. */}
        <noscript>
          <style>{`
            [data-fade], .text-reveal, .text-reveal-item, .fx-rise {
              opacity: 1 !important;
              transform: none !important;
              clip-path: none !important;
              filter: none !important;
              animation: none !important;
            }
            [data-fade] * {
              opacity: 1 !important;
              filter: none !important;
              animation: none !important;
            }
          `}</style>
        </noscript>
        <div id="page-root">
          <ChunkGuard />
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
