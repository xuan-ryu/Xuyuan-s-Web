import type { MetadataRoute } from "next";
import { projectCatalog } from "@/data/project-catalog";

const BASE = "https://xuyuanliu.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, priority: 1 },
    { url: `${BASE}/work`, priority: 0.9 },
    ...projectCatalog.all.map((p) => ({
      url: `${BASE}/work/${p.slug}`,
      priority: 0.8,
    })),
    { url: `${BASE}/about`, priority: 0.7 },
    { url: `${BASE}/contact`, priority: 0.6 },
  ];
}
