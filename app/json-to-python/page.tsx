import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToPythonClient from "./JsonToPythonClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-to-python");

export const metadata: Metadata = {
  title: "JSON to Python Generator - Free Online | BeYourTools",
  description: content?.tagline ?? "Generate Python dataclass or TypedDict definitions from any JSON sample.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-to-python` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-to-python`,
    title: "JSON to Python Generator - Free Online | BeYourTools",
    description: "Generate Python dataclasses and TypedDicts from JSON.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON to Python" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to Python Generator - Free Online | BeYourTools",
    description: "Generate Python dataclasses and TypedDicts from JSON.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON to Python"
      title="JSON to Python"
      description={content?.tagline ?? "Generate Python dataclass or TypedDict definitions from any JSON sample."}
      category="Convert"
      currentSlug="json-to-python"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonToPythonClient />
    </ToolLayout>
  );
}
