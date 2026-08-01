import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "error";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/projects`, priority: 0.8 },
    ...getAllProjects().map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, priority: 0.7 })),
  ];
}
