import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FadeReveal } from "@/components/fade-reveal";
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
            Mono load async: media="print" keeps them off the render path, the
            inline script flips them to "all" on load (display=swap covers FOUT). */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200;300;400;500;600&family=JetBrains+Mono:wght@100..800&display=swap"
          media="print"
          data-async-font=""
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var l=document.querySelector('link[data-async-font]');if(!l)return;if(l.sheet){l.media='all';}else{l.addEventListener('load',function(){l.media='all';});}})();",
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200;300;400;500;600&family=JetBrains+Mono:wght@100..800&display=swap"
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
          <PageTransition />
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
