import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import BeautifierClient from "./BeautifierClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-beautifier");

export const metadata: Metadata = {
  title: "JSON Beautifier - Make JSON Readable Online | BeYourTools",
  description: content?.tagline ?? "Clean up compact JSON into a neatly indented, readable format.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-beautifier` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-beautifier`,
    title: "JSON Beautifier - Make JSON Readable Online | BeYourTools",
    description: "Beautify JSON with proper indentation in your browser.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Beautifier" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Beautifier - Make JSON Readable Online | BeYourTools",
    description: "Beautify JSON with proper indentation in your browser.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Beautifier"
      title="JSON Beautifier"
      description={content?.tagline ?? "Clean up compact JSON into a neatly indented, readable format."}
      category="Format & Validate"
      currentSlug="json-beautifier"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <BeautifierClient />
    </ToolLayout>
  );
}
