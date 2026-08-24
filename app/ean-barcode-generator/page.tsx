import type { Metadata } from "next";
import Link from "next/link";
import EANGeneratorClient from "./EANGeneratorClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "EAN-13 Barcode Generator - Create EAN Barcodes Free | BeYourTools",
  description:
    "Generate EAN-13 and EAN-8 barcodes with automatic check digit calculation. Enter your digits, get a valid barcode instantly. Download PNG or SVG - free and browser-based.",
  keywords: "EAN-13 barcode generator, EAN barcode, EAN-8 generator, create EAN barcode, EAN check digit, free EAN generator",
  alternates: { canonical: `${SITE.url}/ean-barcode-generator` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/ean-barcode-generator`,
    title: "EAN-13 Barcode Generator - Create EAN Barcodes Free | BeYourTools",
    description: "Generate EAN-13 and EAN-8 barcodes with check digit validation. Free and browser-based.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "EAN Barcode Generator" }],
  },
};

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: "EAN Barcode Generator", url: canonical("/ean-barcode-generator") },
  ]),
  softwareApplicationSchema({
    name: "EAN-13 Barcode Generator",
    description: "Generate EAN-13 and EAN-8 barcodes with automatic check digit calculation. Free, browser-based.",
    url: canonical("/ean-barcode-generator"),
    category: "UtilitiesApplication",
  }),
  faqSchema([
    { question: "What is EAN-13?", answer: "EAN-13 is a 13-digit barcode standard used on retail products worldwide. The last digit is a check digit calculated from the first 12." },
    { question: "What is the difference between EAN-13 and EAN-8?", answer: "EAN-13 is the standard 13-digit format. EAN-8 is a compact 8-digit version used on small packages where a full EAN-13 wouldn't fit." },
    { question: "How is the EAN-13 check digit calculated?", answer: "Digits at odd positions are multiplied by 1, digits at even positions by 3. Sum all results, then subtract the last digit of the total from 10." },
    { question: "Can I validate an existing EAN-13 barcode?", answer: "Yes. Disable 'Auto-calculate check digit' and enter all 13 digits. The tool validates your check digit and tells you the correct one if it's wrong." },
  ]),
];

export default function EANGeneratorPage() {
  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/qr-barcode-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>QR &amp; Barcode Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>EAN Barcode Generator</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>Barcode Tools</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            EAN-13 Barcode Generator
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Generate EAN-13 barcodes used on retail products worldwide - and EAN-8 for compact packaging.
            Enter your digits, the check digit is calculated automatically. Download PNG or SVG.
          </p>
        </div>

        <EANGeneratorClient />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to use</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>1.</span> Choose EAN-13 or EAN-8 using the toggle.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>2.</span> Enter your digits (12 for EAN-13, 7 for EAN-8 with auto check digit).</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>3.</span> Click <strong>Generate</strong>.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>4.</span> Download the barcode as PNG or SVG.</li>
          </ol>
        </section>

        <QRRelatedTools currentSlug="ean-barcode-generator" />
      </div>
    </>
  );
}
