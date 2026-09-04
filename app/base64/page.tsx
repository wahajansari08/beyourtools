import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Base64Client from "./Base64Client";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("base64");

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder - Free Online | BeYourTools",
  description: content?.tagline ?? "Encode text to Base64 or decode Base64 strings back to plain text.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/base64` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/base64`,
    title: "Base64 Encoder/Decoder - Free Online | BeYourTools",
    description: "Encode and decode Base64 text instantly in your browser.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Base64 Encode/Decode" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encoder/Decoder - Free Online | BeYourTools",
    description: "Encode and decode Base64 text instantly in your browser.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="Base64"
      title="Base64 Encode/Decode"
      description={content?.tagline ?? "Encode text to Base64 or decode Base64 strings back to plain text."}
      category="Encode & Inspect"
      currentSlug="base64"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <Base64Client />
    </ToolLayout>
  );
}
