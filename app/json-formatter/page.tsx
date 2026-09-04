import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import FormatterClient from "./FormatterClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-formatter");

export const metadata: Metadata = {
  title: "JSON Formatter - Pretty Print JSON Online | BeYourTools",
  description: content?.tagline ?? "Pretty-print JSON with 2, 4, or tab indentation.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-formatter` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-formatter`,
    title: "JSON Formatter - Pretty Print JSON Online | BeYourTools",
    description: "Format and indent JSON instantly in your browser.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Formatter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Formatter - Pretty Print JSON Online | BeYourTools",
    description: "Format and indent JSON instantly in your browser.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Formatter"
      title="JSON Formatter"
      description={content?.tagline ?? "Pretty-print JSON with 2, 4, or tab indentation."}
      category="Format & Validate"
      currentSlug="json-formatter"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <FormatterClient />
    </ToolLayout>
  );
}
