import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ViewerClient from "./ViewerClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-viewer");

export const metadata: Metadata = {
  title: "JSON Viewer - Interactive JSON Tree Online | BeYourTools",
  description: content?.tagline ?? "Explore JSON as a collapsible tree - expand and collapse any node.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-viewer` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-viewer`,
    title: "JSON Viewer - Interactive JSON Tree Online | BeYourTools",
    description: "Visualise JSON as a collapsible tree structure.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Viewer / Tree" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Viewer - Interactive JSON Tree Online | BeYourTools",
    description: "Visualise JSON as a collapsible tree structure.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Viewer"
      title="JSON Viewer / Tree"
      description={content?.tagline ?? "Explore JSON as a collapsible tree - expand and collapse any node."}
      category="Format & Validate"
      currentSlug="json-viewer"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <ViewerClient />
    </ToolLayout>
  );
}
