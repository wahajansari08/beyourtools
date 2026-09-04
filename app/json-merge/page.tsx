import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MergeClient from "./MergeClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-merge");

export const metadata: Metadata = {
  title: "JSON Merge - Deep Merge JSON Objects Online | BeYourTools",
  description: content?.tagline ?? "Deep-merge two JSON objects with the second taking precedence on conflicts.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-merge` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-merge`,
    title: "JSON Merge - Deep Merge JSON Objects Online | BeYourTools",
    description: "Deep merge two JSON objects into one combined result.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Merge" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Merge - Deep Merge JSON Objects Online | BeYourTools",
    description: "Deep merge two JSON objects into one combined result.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Merge"
      title="JSON Merge"
      description={content?.tagline ?? "Deep-merge two JSON objects with the second taking precedence on conflicts."}
      category="Compare & Manipulate"
      currentSlug="json-merge"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <MergeClient />
    </ToolLayout>
  );
}
