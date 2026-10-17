import type { Metadata } from "next";
import { localizeMetadata, contentLocale, withPageCopy } from "@/lib/i18n-content";
import GeneralHubPage, { type HubDef } from "@/components/general/GeneralHubPage";
import { SITE } from "@/lib/seo";

const EN_HUB: HubDef = {
  path: "/text-tools",
  name: "Text Tools",
  tagline: "Everyday text utilities - count words, convert case, encode URLs and generate placeholder copy. Free, instant, and private.",
  description: "All text tools run entirely in your browser. Nothing you type is uploaded or stored anywhere.",
  faqs: [
    { question: "Are these text tools free?", answer: "Yes - all text tools are completely free with no sign-up and no usage limits." },
    { question: "Is my text uploaded to a server?", answer: "No. Everything is processed locally in your browser tab. Your text never leaves your device." },
    { question: "Which text tools are available?", answer: "Word Counter, Case Converter, Lorem Ipsum Generator and URL Encoder/Decoder." },
    { question: "Do the tools work offline?", answer: "Once the page has loaded, the tools themselves need no network - counting, converting and generating all happen locally." },
  ],
};

const __enMetadata: Metadata = {
  title: "Text Tools - Word Counter, Case Converter & More | BeYourTools",
  description: "Free online text tools: word counter, case converter, lorem ipsum generator, URL encoder/decoder. No sign-up, 100% private.",
  keywords: "text tools, word counter, case converter, lorem ipsum generator, url encoder decoder, free text tools",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/text-tools`,
    title: "Text Tools - Free Online | BeYourTools",
    description: "Word counter, case converter, lorem ipsum generator and URL tools - free in your browser.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Text Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Tools - Free Online | BeYourTools",
    description: "Free text tools in your browser - no sign-up.",
    images: [`${SITE.url}/og-default.png`],
  },
};

export default async function Page() {
  const locale = await contentLocale();
  const hub = await withPageCopy(locale, "text-tools", EN_HUB);
  return <GeneralHubPage hub={hub} category="Text Tools" />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "text-tools", __enMetadata);
}
