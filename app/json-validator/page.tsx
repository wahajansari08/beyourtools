import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ValidatorClient from "./ValidatorClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-validator");

export const metadata: Metadata = {
  title: "JSON Validator - Check JSON Syntax Online | BeYourTools",
  description: content?.tagline ?? "Check JSON syntax and get the exact line and column of any error.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-validator` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-validator`,
    title: "JSON Validator - Check JSON Syntax Online | BeYourTools",
    description: "Validate JSON and get precise error locations instantly.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Validator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Validator - Check JSON Syntax Online | BeYourTools",
    description: "Validate JSON and get precise error locations instantly.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Validator"
      title="JSON Validator"
      description={content?.tagline ?? "Check JSON syntax and get the exact line and column of any error."}
      category="Format & Validate"
      currentSlug="json-validator"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <ValidatorClient />
    </ToolLayout>
  );
}
