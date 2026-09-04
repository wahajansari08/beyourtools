import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import YamlToJsonClient from "./YamlToJsonClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("yaml-to-json");

export const metadata: Metadata = {
  title: "YAML to JSON Converter - Free Online | BeYourTools",
  description: content?.tagline ?? "Convert YAML configuration files to valid JSON with full feature support.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/yaml-to-json` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/yaml-to-json`,
    title: "YAML to JSON Converter - Free Online | BeYourTools",
    description: "Convert YAML documents to JSON in your browser.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "YAML to JSON" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "YAML to JSON Converter - Free Online | BeYourTools",
    description: "Convert YAML documents to JSON in your browser.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="YAML to JSON"
      title="YAML to JSON"
      description={content?.tagline ?? "Convert YAML configuration files to valid JSON with full feature support."}
      category="Convert"
      currentSlug="yaml-to-json"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <YamlToJsonClient />
    </ToolLayout>
  );
}
