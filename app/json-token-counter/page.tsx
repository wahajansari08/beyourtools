import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TokenCounterClient from "./TokenCounterClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("json-token-counter");

export const metadata: Metadata = {
  title: "JSON Token Counter - LLM Token Estimator | BeYourTools",
  description: content?.tagline ?? "Estimate how many LLM tokens a JSON payload will consume before sending to an AI API.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/json-token-counter` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/json-token-counter`,
    title: "JSON Token Counter - LLM Token Estimator | BeYourTools",
    description: "Count LLM tokens in JSON payloads for OpenAI and other models.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Token Counter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Token Counter - LLM Token Estimator | BeYourTools",
    description: "Count LLM tokens in JSON payloads for OpenAI and other models.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="Token Counter"
      title="JSON Token Counter"
      description={content?.tagline ?? "Estimate how many LLM tokens a JSON payload will consume before sending to an AI API."}
      category="Encode & Inspect"
      currentSlug="json-token-counter"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <TokenCounterClient />
    </ToolLayout>
  );
}
