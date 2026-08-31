import type { Metadata } from "next";
import Link from "next/link";
import BarcodeGeneratorClient from "./BarcodeGeneratorClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Barcode Generator - Create Barcodes Online Free | BeYourTools",
  description:
    "Generate barcodes online for free - Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF-14, MSI and Codabar. Customize size, colors and download as PNG or SVG.",
  keywords: "barcode generator, free barcode generator, code 128 generator, EAN barcode, UPC barcode, online barcode maker",
  alternates: { canonical: `${SITE.url}/barcode-generator` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/barcode-generator`,
    title: "Barcode Generator - Create Barcodes Online Free | BeYourTools",
    description: "Create Code 128, EAN-13, UPC and more - free, instant, browser-based.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Barcode Generator" }],
  },
};

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: "Barcode Generator", url: canonical("/barcode-generator") },
  ]),
  softwareApplicationSchema({
    name: "Barcode Generator",
    description: "Free browser-based barcode generator supporting Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF-14, MSI and Codabar.",
    url: canonical("/barcode-generator"),
    category: "UtilitiesApplication",
  }),
  faqSchema([
    { question: "Which barcode formats are supported?", answer: "Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF-14, MSI and Codabar." },
    { question: "Can I download the barcode?", answer: "Yes - as PNG for documents and as SVG for scalable print-quality output." },
    { question: "Does EAN-13 generation validate the check digit?", answer: "Yes. Enter 12 digits and the check digit is calculated and appended automatically. Invalid values show a clear error." },
    { question: "Is there a character limit?", answer: "Code 128 supports full ASCII and has no practical character limit. Other formats like Code 39 have character set restrictions shown under the input." },
  ]),
];

export default function BarcodeGeneratorPage() {
  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/qr-barcode-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>QR &amp; Barcode Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Barcode Generator</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>Barcode Tools</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            Barcode Generator
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Create barcodes in 8 popular formats - Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF-14, MSI and Codabar.
            Customize size, colors and download as PNG or SVG instantly in your browser.
          </p>
        </div>

        <BarcodeGeneratorClient />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to use</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>1.</span> Choose a barcode format from the dropdown.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>2.</span> Enter the value to encode - the hint below the field shows what characters are allowed.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>3.</span> Optionally expand <strong>Customize barcode</strong> to adjust width, height, colors and text.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>4.</span> Click <strong>Generate Barcode</strong> and download as PNG or SVG.</li>
          </ol>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Supported formats</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["Code 128", "Full ASCII, variable length. Widely used in shipping and logistics."],
              ["Code 39", "Uppercase A-Z, digits, and special chars. Common in manufacturing."],
              ["EAN-13", "13-digit European Article Number. Used on retail products globally."],
              ["EAN-8", "8-digit compact EAN for small packages."],
              ["UPC-A", "12-digit Universal Product Code. Standard for North American retail."],
              ["ITF-14", "14-digit format for outer cartons and shipping containers."],
              ["MSI", "Digits only. Used in library and inventory systems."],
              ["Codabar", "Used in blood banks, FedEx and libraries. Alphanumeric with start/stop."],
            ].map(([name, desc]) => (
              <div key={name} className="rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{name}</p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <QRRelatedTools currentSlug="barcode-generator" />
      </div>
    </>
  );
}
