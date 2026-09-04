import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MinifierClient from "./MinifierClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-minifier");

export const metadata: Metadata = {
  title: "JSON Minifier - Compress JSON Online | BeYourTools",
  description: content?.tagline ?? "Strip whitespace from JSON to produce the smallest possible file.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-minifier` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-minifier`,
    title: "JSON Minifier - Compress JSON Online | BeYourTools",
    description: "Remove whitespace from JSON to reduce file size.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Minifier" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Minifier - Compress JSON Online | BeYourTools",
    description: "Remove whitespace from JSON to reduce file size.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Minifier"
      title="JSON Minifier"
      description={content?.tagline ?? "Strip whitespace from JSON to produce the smallest possible file."}
      category="Format & Validate"
      currentSlug="json-minifier"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <MinifierClient />
    </ToolLayout>
  );
}
