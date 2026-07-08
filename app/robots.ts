import type { MetadataRoute } from "next";

// /design-system is an internal working surface — routable, but not for
// crawlers or the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/design-system" },
    sitemap: "https://xuyuanliu.com/sitemap.xml",
  };
}
