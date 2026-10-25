import type { Metadata } from "next";
import { localizeMetadata, contentLocale, withPageCopy } from "@/lib/i18n-content";
import GeneralHubPage, { type HubDef } from "@/components/general/GeneralHubPage";
import { SITE } from "@/lib/seo";

const EN_HUB: HubDef = {
  path: "/developer-tools",
  name: "Developer Tools",
  tagline: "Small sharp utilities for developers - test regex, generate UUIDs and passwords, hash data, convert timestamps, preview markdown, and build meta tags. No accounts, no tracking.",
  description: "All developer tools run entirely in your browser, including cryptographic operations via Web Crypto. Nothing is uploaded or stored.",
  faqs: [
    { question: "Are these developer tools free?", answer: "Yes - all developer tools are completely free with no sign-up and no usage limits." },
    { question: "Are the generated passwords and UUIDs cryptographically secure?", answer: "Yes. Both use the Web Crypto API (crypto.getRandomValues / crypto.randomUUID), the browser's secure random source - never Math.random()." },
    { question: "Which developer tools are available?", answer: "Password Generator, Regex Tester, UUID Generator, Hash Generator, Timestamp Converter, Markdown Previewer, and Meta Tag Generator." },
    { question: "Which developer tool should I start with?", answer: "Start from the job: debugging a pattern means the Regex Tester, a seed script means the UUID Generator, a checksum means the Hash Generator, a raw epoch number means the Timestamp Converter, and a page launch means the Meta Tag Generator. Each tool's page explains its own job in full." },
    { question: "Is my data sent anywhere?", answer: "No. Hashing, generation and testing all happen locally in your browser." },
    { question: "Do these tools work offline?", answer: "Once the page has loaded, yes. Everything runs on built-in browser APIs, so a loaded tool keeps working with the network off." },
  ],
};

const __enMetadata: Metadata = {
  title: "Developer Tools - Regex, UUID, Password, Hash, Timestamp | BeYourTools",
  description: "Free developer tools: regex tester, UUID generator, secure password generator, hash generator (MD5/SHA), timestamp converter, markdown previewer, meta tag generator. No sign-up.",
  keywords: "developer tools, regex tester, uuid generator, password generator, hash generator, timestamp converter, markdown previewer, meta tag generator",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/developer-tools`,
    title: "Developer Tools - Free Online | BeYourTools",
    description: "Regex tester, UUID/password generators, hash calculator, timestamp converter, markdown previewer and meta tag generator - free in your browser.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Developer Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Tools - Free Online | BeYourTools",
    description: "Free developer utilities in your browser - no sign-up.",
    images: [`${SITE.url}/og-default.png`],
  },
};

export default async function Page() {
  const locale = await contentLocale();
  const hub = await withPageCopy(locale, "developer-tools", EN_HUB);
  return <GeneralHubPage hub={hub} category="Developer Tools" />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "developer-tools", __enMetadata);
}
