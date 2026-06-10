import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Murecho,
  Noto_Serif_SC,
} from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/data/site";
import "./globals.css";

const murecho = Murecho({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-murecho",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const notoSerifSc = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto-serif-sc",
  preload: false,
});

export const metadata: Metadata = {
  title: { default: site.title, template: "%s — XUYUAN" },
  description: site.description,
  metadataBase: new URL("https://xuyuan.liu"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${murecho.variable} ${cormorant.variable} ${notoSerifSc.variable}`}
    >
      <body>
        <div id="page-root">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
