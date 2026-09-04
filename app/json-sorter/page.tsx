import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SorterClient from "./SorterClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-sorter");

export const metadata: Metadata = {
  title: "JSON Sorter - Sort JSON Keys Alphabetically | BeYourTools",
  description: content?.tagline ?? "Sort all object keys alphabetically throughout an entire JSON document.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-sorter` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-sorter`,
    title: "JSON Sorter - Sort JSON Keys Alphabetically | BeYourTools",
    description: "Recursively sort all JSON object keys alphabetically.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Sorter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Sorter - Sort JSON Keys Alphabetically | BeYourTools",
    description: "Recursively sort all JSON object keys alphabetically.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Sorter"
      title="JSON Sorter"
      description={content?.tagline ?? "Sort all object keys alphabetically throughout an entire JSON document."}
      category="Compare & Manipulate"
      currentSlug="json-sorter"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <SorterClient />
    </ToolLayout>
  );
}
