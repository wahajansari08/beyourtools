import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/seo";
import { getVideoTool } from "@/lib/video-tools-config";
import VideoToolPage from "./VideoToolPage";

export function buildVideoMetadata(slug: string): Metadata {
  const tool = getVideoTool(slug);
  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.metaDescription,
    keywords: [tool.name, tool.category, "video tools", "online video editor", "browser video processing", ...tool.formats].join(", "),
    alternates: { canonical: `${SITE.url}/${tool.slug}` },
    openGraph: {
      type: "website",
      url: `${SITE.url}/${tool.slug}`,
      title: tool.title,
      description: tool.metaDescription,
      images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.metaDescription,
      images: [`${SITE.url}/og-default.png`],
    },
  };
}

export function renderVideoTool(slug: string) {
  const tool = getVideoTool(slug);
  if (!tool) notFound();
  return <VideoToolPage tool={tool} />;
}

