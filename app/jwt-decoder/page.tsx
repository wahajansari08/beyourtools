import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JwtDecoderClient from "./JwtDecoderClient";
import { SITE } from "@/lib/seo";
import { getJsonToolContent } from "@/lib/json-tools-content";

const content = getJsonToolContent("jwt-decoder");

export const metadata: Metadata = {
  title: "JWT Decoder - Inspect JWT Tokens Online | BeYourTools",
  description: content?.tagline ?? "Decode any JWT token to inspect its header and payload claims.",
  keywords: content?.keywords,
  alternates: { canonical: `${SITE.url}/jwt-decoder` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/jwt-decoder`,
    title: "JWT Decoder - Inspect JWT Tokens Online | BeYourTools",
    description: "Decode JWT header and payload without needing the signing secret.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JWT Decoder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Decoder - Inspect JWT Tokens Online | BeYourTools",
    description: "Decode JWT header and payload without needing the signing secret.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JWT Decoder"
      title="JWT Decoder"
      description={content?.tagline ?? "Decode any JWT token to inspect its header and payload claims."}
      category="Encode & Inspect"
      currentSlug="jwt-decoder"
      howTo={content?.howTo}
      faqs={content?.faqs}
    >
      <JwtDecoderClient />
    </ToolLayout>
  );
}
