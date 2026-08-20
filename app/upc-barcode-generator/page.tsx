import type { Metadata } from "next";
import Link from "next/link";
import UPCGeneratorClient from "./UPCGeneratorClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "UPC Barcode Generator - Create UPC-A Barcodes Free | BeYourTools",
  description:
    "Generate valid UPC-A barcodes with automatic check digit calculation. Enter 11 digits and get a complete 12-digit UPC-A barcode. Download PNG or SVG.",
  keywords: "UPC barcode generator, UPC-A barcode, create UPC barcode, UPC check digit, free UPC generator",
  alternates: { canonical: `${SITE.url}/upc-barcode-generator` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/upc-barcode-generator`,
    title: "UPC Barcode Generator - Create UPC-A Barcodes Free | BeYourTools",
    description: "Generate UPC-A barcodes with automatic check digit calculation. Free and browser-based.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "UPC Barcode Generator" }],
  },
};

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: "UPC Barcode Generator", url: canonical("/upc-barcode-generator") },
  ]),
  softwareApplicationSchema({
    name: "UPC Barcode Generator",
    description: "Generate UPC-A barcodes with automatic check digit calculation. Enter 11 digits and get a complete, valid 12-digit UPC-A barcode.",
    url: canonical("/upc-barcode-generator"),
    category: "UtilitiesApplication",
  }),
  faqSchema([
    { question: "What is a UPC-A barcode?", answer: "UPC-A (Universal Product Code) is a 12-digit barcode used on retail products in North America. The last digit is a check digit calculated from the first 11." },
    { question: "How is the UPC-A check digit calculated?", answer: "Odd-position digits are multiplied by 3, even-position digits by 1. Sum all results, then subtract the last digit from 10. Example: 03600029145 → check digit 2." },
    { question: "Can I enter a complete 12-digit UPC?", answer: "Yes. Disable 'Auto-calculate check digit' and enter all 12 digits. The tool validates your check digit and shows the correct one if it's wrong." },
  ]),
];

export default function UPCGeneratorPage() {
  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/qr-barcode-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>QR &amp; Barcode Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>UPC Barcode Generator</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>Barcode Tools</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            UPC Barcode Generator
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Generate UPC-A barcodes used on North American retail products. Enter 11 digits and the tool calculates
            the correct 12th check digit automatically. Download as PNG or SVG.
          </p>
        </div>

        <UPCGeneratorClient />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to use</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>1.</span> Enter your 11-digit UPC number (the check digit will be calculated for you).</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>2.</span> Or disable auto-check and enter the full 12-digit code to validate it.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>3.</span> Click <strong>Generate UPC Barcode</strong>.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>4.</span> Download PNG or SVG, or copy the full 12-digit code.</li>
          </ol>
        </section>

        <section className="mt-10 rounded-lg border p-4 text-sm"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
          <p className="font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Example</p>
          <p>Input: <code className="font-mono text-xs px-1 rounded" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--accent)" }}>03600029145</code> (11 digits)</p>
          <p className="mt-1">Output: <code className="font-mono text-xs px-1 rounded" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--teal)" }}>036000291452</code> (check digit = 2)</p>
        </section>

        <QRRelatedTools currentSlug="upc-barcode-generator" />
      </div>
    </>
  );
}
