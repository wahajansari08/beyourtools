import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonSchemaValidatorClient from "./JsonSchemaValidatorClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-schema-validator");

export const metadata: Metadata = {
  title: "JSON Schema Validator - Free Online | BeYourTools",
  description: content?.tagline ?? "Validate JSON against any JSON Schema and get a clear list of every error with paths.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-schema-validator` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-schema-validator`,
    title: "JSON Schema Validator - Free Online | BeYourTools",
    description: "Validate JSON against JSON Schema with detailed error reporting.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Schema Validator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Schema Validator - Free Online | BeYourTools",
    description: "Validate JSON against JSON Schema with detailed error reporting.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="Schema Validator"
      title="JSON Schema Validator"
      description={content?.tagline ?? "Validate JSON against any JSON Schema and get a clear list of every error with paths."}
      category="Generate & Schema"
      currentSlug="json-schema-validator"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonSchemaValidatorClient />
    </ToolLayout>
  );
}
