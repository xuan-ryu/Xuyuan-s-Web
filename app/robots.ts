import type { MetadataRoute } from "next";

// Internal working and encrypted private surfaces remain routable, but are
// excluded from crawlers and the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/design-system", "/private/"],
    },
    sitemap: "https://xuyuanliu.com/sitemap.xml",
  };
}
