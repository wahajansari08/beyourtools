import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonlFormatterClient from "./JsonlFormatterClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("jsonl-formatter");

export const metadata: Metadata = {
  title: "JSONL Formatter - Format JSON Lines Online | BeYourTools",
  description: content?.tagline ?? "Pretty-print each line of a JSONL file independently.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/jsonl-formatter` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/jsonl-formatter`,
    title: "JSONL Formatter - Format JSON Lines Online | BeYourTools",
    description: "Format every line of a JSONL file into readable JSON.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSONL Formatter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSONL Formatter - Format JSON Lines Online | BeYourTools",
    description: "Format every line of a JSONL file into readable JSON.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSONL Formatter"
      title="JSONL Formatter"
      description={content?.tagline ?? "Pretty-print each line of a JSONL file independently."}
      category="Format & Validate"
      currentSlug="jsonl-formatter"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonlFormatterClient />
    </ToolLayout>
  );
}
