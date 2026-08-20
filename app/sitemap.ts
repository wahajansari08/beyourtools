import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools-config";
import { pdfTools } from "@/lib/pdf-tools-config";
import { conversionRoutes } from "@/lib/image-tools-config";
import { blogPosts } from "@/lib/blog";
import { videoTools } from "@/lib/video-tools-config";

const BASE = "https://beyourtools.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/json-tools`,      lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/image-converter`, lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/pdf-tools`,       lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/video-tools`,     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/blog`,            lastModified: now, changeFrequency: "daily",   priority: 0.8 },
  ];

  const jsonToolPages: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${BASE}/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const pdfToolPages: MetadataRoute.Sitemap = pdfTools.map((t) => ({
    url: `${BASE}/pdf-tools/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const imagePages: MetadataRoute.Sitemap = conversionRoutes.map((r) => ({
    url: `${BASE}/image-converter/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const videoPages: MetadataRoute.Sitemap = videoTools.map((t) => ({
    url: `${BASE}/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.publishedAt,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    ...staticPages,
    ...jsonToolPages,
    ...pdfToolPages,
    ...imagePages,
    ...videoPages,
    ...blogPages,
  ];
}
