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
        {/* consolidated from the hero/koi runtime injectors — same families
            and weights, loaded once and early */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Newsreader:ital,wght@0,200;0,300;0,400;1,200;1,300;1,400&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Murecho:wght@300;400;500&family=Noto+Serif+SC:wght@200;300;400;500;600&family=JetBrains+Mono:wght@100..800&display=swap"
        />
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
