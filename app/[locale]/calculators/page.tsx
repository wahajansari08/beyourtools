import type { Metadata } from "next";
import { localizeMetadata, contentLocale, withPageCopy } from "@/lib/i18n-content";
import GeneralHubPage, { type HubDef } from "@/components/general/GeneralHubPage";
import { SITE } from "@/lib/seo";

const EN_HUB: HubDef = {
  path: "/calculators",
  name: "Calculators",
  tagline: "Quick everyday calculators - percentages, BMI and age with exact breakdowns, unit conversion, scientific math, timers, time zones, and fair random draws. Type and get the answer instantly.",
  description: "All calculators run entirely in your browser. Your numbers are never uploaded or stored.",
  faqs: [
    { question: "Are these calculators free?", answer: "Yes - all calculators are completely free with no sign-up and no usage limits." },
    { question: "Which calculators are available?", answer: "Percentage Calculator, BMI Calculator, Age Calculator, Unit Converter, Stopwatch, Pomodoro Timer, Random Number Generator, Scientific Calculator, and Timezone Converter." },
    { question: "Which calculator do I need?", answer: "Start from the question: a share or a change means the Percentage Calculator, a body-mass number means the BMI Calculator, an exact age means the Age Calculator, a meeting across borders means the Timezone Converter, and a full expression with trig or logs means the Scientific Calculator." },
    { question: "Is my data private?", answer: "Yes. Every calculation happens locally in your browser - nothing is sent to a server or stored." },
    { question: "How accurate are the results?", answer: "The math is exact for the inputs given (including leap-year-correct age math). BMI categories follow WHO cutoffs; they're screening bands, not medical diagnoses." },
    { question: "Do the calculators work offline?", answer: "Once the page has loaded, yes. Every calculator runs on data and APIs already in your browser, so a loaded page keeps answering with the network off." },
  ],
};

const __enMetadata: Metadata = {
  title: "Calculators - Percentage, BMI, Age, Units, Timers & More | BeYourTools",
  description: "Free online calculators: percentage, BMI, age, unit converter, stopwatch, Pomodoro timer, random number generator, scientific calculator, timezone converter. Instant, no sign-up.",
  keywords: "calculators, percentage calculator, bmi calculator, age calculator, unit converter, scientific calculator, timezone converter, pomodoro timer, free online calculator",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/calculators`,
    title: "Calculators - Free Online | BeYourTools",
    description: "Percentage, BMI, age, unit, scientific and timezone calculators plus timers - free in your browser.",
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Calculators" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculators - Free Online | BeYourTools",
    description: "Free calculators in your browser - no sign-up.",
    images: [`${SITE.url}/og-default.png`],
  },
};

export default async function Page() {
  const locale = await contentLocale();
  const hub = await withPageCopy(locale, "calculators", EN_HUB);
  return <GeneralHubPage hub={hub} category="Calculators" />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "calculators", __enMetadata);
}
