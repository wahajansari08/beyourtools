import type { Metadata } from "next";
import Link from "next/link";
import Code128Client from "./Code128Client";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Code 128 Barcode Generator - Create Barcodes Online | BeYourTools",
  description:
    "Generate Code 128 barcodes from any printable text. Supports full ASCII, adjustable size and downloadable as PNG or SVG -free and browser-based.",
  keywords: "Code 128 barcode generator, code128 barcode, create Code 128, free barcode generator, ASCII barcode",
  alternates: { canonical: `${SITE.url}/code-128-barcode-generator` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/code-128-barcode-generator`,
    title: "Code 128 Barcode Generator | BeYourTools",
    description: "Generate Code 128 barcodes from any ASCII text. Free, instant, browser-based.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Code 128 Barcode Generator" }],
  },
};

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: "Code 128 Generator", url: canonical("/code-128-barcode-generator") },
  ]),
  softwareApplicationSchema({
    name: "Code 128 Barcode Generator",
    description: "Generate Code 128 barcodes from full ASCII text. Adjustable size, downloadable as PNG or SVG.",
    url: canonical("/code-128-barcode-generator"),
    category: "UtilitiesApplication",
  }),
  faqSchema([
    { question: "What is Code 128?", answer: "Code 128 is a high-density linear barcode that encodes full ASCII text including letters, numbers, and symbols. It's widely used in shipping, packaging, and logistics." },
    { question: "What characters are supported?", answer: "All printable ASCII characters -that's letters (A-Z, a-z), digits (0-9), punctuation, and special characters like @, #, $, etc. Unicode characters are not supported." },
    { question: "Is there a maximum length?", answer: "There is no hard limit, but very long values produce very wide barcodes. Adjust the bar width slider to control density." },
    { question: "Can I download the barcode for printing?", answer: "Yes. Download as SVG for crisp, scalable print output, or PNG for use in documents and images." },
  ]),
];

export default function Code128Page() {
  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/qr-barcode-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>QR &amp; Barcode Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Code 128 Generator</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>Barcode Tools</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            Code 128 Barcode Generator
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Generate Code 128 barcodes from any printable ASCII text. Widely used in shipping, logistics
            and inventory systems. Adjust bar width, height, and margins, then download as PNG or SVG.
          </p>
        </div>

        <Code128Client />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>About Code 128</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Code 128 is one of the most widely used linear barcodes in the world. Unlike EAN or UPC which are digit-only,
            Code 128 encodes full ASCII text -making it suitable for part numbers, serial numbers, URLs, and any alphanumeric data.
            It automatically selects the most efficient encoding subset (A, B, or C) to minimize barcode length.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>FAQ</h2>
          {[
            ["What is Code 128 used for?", "Shipping labels, inventory management, product tracking, library systems -any application needing alphanumeric barcodes."],
            ["Does Code 128 need a check digit?", "Yes, but it's calculated automatically by the library -you don't need to compute it yourself."],
            ["What's the difference between Code 128 and Code 39?", "Code 128 is more compact (fits more data in less space) and supports lowercase letters. Code 39 is simpler but uses only uppercase and a limited character set."],
          ].map(([q, a]) => (
            <div key={q as string}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{q}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{a}</p>
            </div>
          ))}
        </section>

        <QRRelatedTools currentSlug="code-128-barcode-generator" />
      </div>
    </>
  );
}
