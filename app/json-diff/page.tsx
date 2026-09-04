import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import DiffClient from "./DiffClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-diff");

export const metadata: Metadata = {
  title: "JSON Diff - Compare JSON Documents Online | BeYourTools",
  description: content?.tagline ?? "Compare two JSON documents and see every addition, deletion, and change highlighted.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-diff` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-diff`,
    title: "JSON Diff - Compare JSON Documents Online | BeYourTools",
    description: "Side-by-side JSON comparison with highlighted differences.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Diff / Compare" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Diff - Compare JSON Documents Online | BeYourTools",
    description: "Side-by-side JSON comparison with highlighted differences.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Diff"
      title="JSON Diff / Compare"
      description={content?.tagline ?? "Compare two JSON documents and see every addition, deletion, and change highlighted."}
      category="Compare & Manipulate"
      currentSlug="json-diff"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <DiffClient />
    </ToolLayout>
  );
}
