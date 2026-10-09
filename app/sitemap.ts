import type { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/docs";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getAllDocs().map((doc) => ({
    url: `${site.url}${doc.href}`,
    lastModified: doc.frontmatter.updatedAt
      ? new Date(doc.frontmatter.updatedAt)
      : undefined,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/docs/changelog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...docs,
  ];
}
