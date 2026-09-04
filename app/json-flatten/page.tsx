import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import FlattenClient from "./FlattenClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-flatten");

export const metadata: Metadata = {
  title: "JSON Flatten - Flatten & Unflatten JSON | BeYourTools",
  description: content?.tagline ?? "Flatten nested JSON to dot-path pairs or rebuild flat JSON into nested structure.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-flatten` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-flatten`,
    title: "JSON Flatten - Flatten & Unflatten JSON | BeYourTools",
    description: "Convert nested JSON to flat dot-path pairs and back again.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Flatten / Unflatten" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Flatten - Flatten & Unflatten JSON | BeYourTools",
    description: "Convert nested JSON to flat dot-path pairs and back again.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Flatten"
      title="JSON Flatten / Unflatten"
      description={content?.tagline ?? "Flatten nested JSON to dot-path pairs or rebuild flat JSON into nested structure."}
      category="Compare & Manipulate"
      currentSlug="json-flatten"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <FlattenClient />
    </ToolLayout>
  );
}
