import type { Metadata } from "next";
import { localizeMetadata, contentLocale, withPageCopy } from "@/lib/i18n-content";
import { Link } from "@/i18n/navigation";
import GeneralHubPage, { type HubDef } from "@/components/general/GeneralHubPage";
import { SITE } from "@/lib/seo";
import TextToolsFinder from "./TextToolsFinder";

const EN_HUB: HubDef = {
  path: "/text-tools",
  name: "Text Tools",
  tagline: "Everyday text utilities - count words, convert case, encode URLs, generate placeholder copy and listen to text aloud. Free, instant, and private.",
  description: "All text tools run entirely in your browser. Nothing you type is uploaded or stored anywhere.",
  faqs: [
    { question: "Are these text tools free?", answer: "Yes - all text tools are completely free with no sign-up and no usage limits." },
    { question: "Is my text uploaded to a server?", answer: "No. Everything is processed locally in your browser tab. Your text never leaves your device." },
    { question: "Which text tools are available?", answer: "Word Counter, Case Converter, Lorem Ipsum Generator, URL Encoder/Decoder and Text to Speech." },
    { question: "Do the tools work offline?", answer: "Once the page has loaded, the tools themselves need no network - counting, converting and generating all happen locally." },
    { question: "Which text tool should I start with?", answer: "Most people start with the Word Counter to check length and reading time, then the Case Converter to fix headings and titles. If you are building a web page, the URL Encoder/Decoder is the one you will reach for next." },
    { question: "Do the tools work on my phone?", answer: "Yes. Every text tool is mobile-friendly: the editors stack vertically on small screens and copy buttons work with your phone's clipboard." },
    { question: "Do the tools save what I type?", answer: "No. Text is processed in memory in your browser tab and discarded when you leave the page. Nothing is sent to a server or stored in an account." },
  ],
};

const __enMetadata: Metadata = {
  title: "Text Tools - Word Counter, Case Converter & More | BeYourTools",
  description: "Free online text tools: word counter, case converter, lorem ipsum generator, URL encoder/decoder, text to speech. No sign-up, 100% private.",
  keywords: "text tools, word counter, case converter, lorem ipsum generator, url encoder decoder, text to speech, free text tools",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/text-tools`,
    title: "Text Tools - Free Online | BeYourTools",
    description: "Word counter, case converter, lorem ipsum generator, URL tools and text to speech - free in your browser.",
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

const cardCls = "focus-ring group flex flex-col justify-between rounded-xl border p-5 transition hover-card";
const cardStyle = { borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" } as const;

const MOST_USED = [
  { slug: "word-counter", name: "Word Counter", blurb: "Live words, characters, sentences and reading time as you type." },
  { slug: "case-converter", name: "Case Converter", blurb: "15 styles from Title Case to snake_case, with per-style copy." },
  { slug: "url-encoder-decoder", name: "URL Encoder / Decoder", blurb: "Percent-encode links and query strings without breaking them." },
  { slug: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", blurb: "Placeholder paragraphs, sentences or words for mockups." },
];

const GUIDE = [
  { slug: "word-counter", name: "Word Counter", bestFor: "Essays, articles and social posts with a length limit", text: "Paste a draft and watch words, characters, sentences, paragraphs and reading time update live, plus readability scores and a word-target tracker. Use it before you submit anything with a word limit." },
  { slug: "case-converter", name: "Case Converter", bestFor: "Headings, titles, file names and code identifiers", text: "Switch text between UPPER, lower, Title, Sentence, Capitalized, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, path/case, Train-Case and more. The at-a-glance list shows every style side by side so you can copy the right one." },
  { slug: "url-encoder-decoder", name: "URL Encoder / Decoder", bestFor: "Links, query strings and redirect URLs", text: "Encode special characters so links survive email, chat and redirects, or decode a messy percent-encoded URL back to readable text. Encoding runs locally, so your links stay private." },
  { slug: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", bestFor: "Design mockups and layout drafts", text: "Generate realistic placeholder text by paragraph, sentence or word count. Fill a page layout without writing real copy first, then swap in the final text when it is ready." },
  { slug: "text-to-speech", name: "Text to Speech", bestFor: "Proofreading by ear and hands-free reading", text: "Hear your text read aloud in the browser. Listening back is the fastest way to catch awkward sentences, repeated words and missing punctuation that your eyes skip over." },
];

export default async function Page() {
  const locale = await contentLocale();
  const hub = await withPageCopy(locale, "text-tools", EN_HUB);
  return (
    <>
      <TextToolsFinder />

      {/* Most used */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12" aria-label="Most used text tools">
        <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Most used text tools
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          The four tools visitors reach for first. Every tool below is free, runs in your browser, and needs no sign-up.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOST_USED.map((t) => (
            <Link key={t.slug} href={`/${t.slug}`} className={cardCls} style={cardStyle}>
              <div>
                <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  {t.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {t.blurb}
                </p>
              </div>
              <span className="mt-4 text-xs font-medium opacity-0 transition group-hover:opacity-100" style={{ color: "var(--accent)" }}>
                Use tool →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <GeneralHubPage hub={hub} category="Text Tools" />

      {/* Which tool do you need? */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12" aria-label="Which text tool do you need?">
        <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Which text tool do you need?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Pick by the job, not the name. Each entry links straight to the tool.
        </p>
        <div className="mt-5 space-y-4">
          {GUIDE.map((g) => (
            <article
              key={g.slug}
              className="rounded-xl border p-5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                <Link href={`/${g.slug}`} className="focus-ring rounded hover:underline" style={{ color: "var(--accent-text)" }}>
                  {g.name}
                </Link>
              </h3>
              <p className="mt-1 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                Best for: {g.bestFor}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {g.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Browse more tool hubs (P1-6: in-content cross-links to sibling hubs) */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12" aria-label="Browse more tool hubs">
        <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Browse more tool hubs
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Done with text? These collections cover the next job — calculators, developer utilities, PDF tools and image tools, all free in your browser.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { slug: "calculators", name: "Calculators", blurb: "Percentages, BMI, age and unit conversion with exact breakdowns." },
            { slug: "developer-tools", name: "Developer Tools", blurb: "Regex, UUIDs, passwords, hashes and timestamps for builders." },
            { slug: "pdf-tools", name: "PDF Tools", blurb: "Merge, split, compress and convert PDFs without uploading them." },
            { slug: "image-converter", name: "Image Converter", blurb: "Convert images between formats, with resize and quality controls." },
          ].map((h) => (
            <Link key={h.slug} href={`/${h.slug}`} className={cardCls} style={cardStyle}>
              <div>
                <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  {h.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {h.blurb}
                </p>
              </div>
              <span className="mt-4 text-xs font-medium opacity-0 transition group-hover:opacity-100" style={{ color: "var(--accent)" }}>
                Browse hub →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "text-tools", __enMetadata);
}
