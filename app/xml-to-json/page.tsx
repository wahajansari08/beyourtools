import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import XmlToJsonClient from "./XmlToJsonClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("xml-to-json");

export const metadata: Metadata = {
  title: "XML to JSON Converter - Free Online | BeYourTools",
  description: content?.tagline ?? "Parse XML documents and convert them to clean JSON objects.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/xml-to-json` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/xml-to-json`,
    title: "XML to JSON Converter - Free Online | BeYourTools",
    description: "Convert XML documents to JSON with attribute handling.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "XML to JSON" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "XML to JSON Converter - Free Online | BeYourTools",
    description: "Convert XML documents to JSON with attribute handling.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="XML to JSON"
      title="XML to JSON"
      description={content?.tagline ?? "Parse XML documents and convert them to clean JSON objects."}
      category="Convert"
      currentSlug="xml-to-json"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <XmlToJsonClient />
    </ToolLayout>
  );
}
