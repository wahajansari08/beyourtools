import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonlValidatorClient from "./JsonlValidatorClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("jsonl-validator");

export const metadata: Metadata = {
  title: "JSONL Validator - Validate JSON Lines Online | BeYourTools",
  description: content?.tagline ?? "Validate every line of a JSONL file and get the exact line of each error.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/jsonl-validator` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/jsonl-validator`,
    title: "JSONL Validator - Validate JSON Lines Online | BeYourTools",
    description: "Validate each line of a JSON Lines file independently.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSONL Validator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSONL Validator - Validate JSON Lines Online | BeYourTools",
    description: "Validate each line of a JSON Lines file independently.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSONL Validator"
      title="JSONL Validator"
      description={content?.tagline ?? "Validate every line of a JSONL file and get the exact line of each error."}
      category="Format & Validate"
      currentSlug="jsonl-validator"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JsonlValidatorClient />
    </ToolLayout>
  );
}
