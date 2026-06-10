import type { Metadata } from "next";
import { Cormorant_Garamond, Marcellus, Murecho } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/data/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
});

const murecho = Murecho({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-murecho",
});

export const metadata: Metadata = {
  title: { default: site.title, template: "%s — Xuyuan Liu" },
  description: site.description,
  metadataBase: new URL("https://xuyuan.liu"),
  openGraph: {
    type: "website",
    title: site.title,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${marcellus.variable} ${murecho.variable}`}
    >
      <body className="min-h-screen bg-bg text-ink antialiased flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
