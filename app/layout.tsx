import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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
    <html lang="en">
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
