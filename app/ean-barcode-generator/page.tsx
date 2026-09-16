import type { Metadata } from "next";
import Link from "next/link";
import EANGeneratorClient from "./EANGeneratorClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "EAN-13 Barcode Generator - Create EAN Barcodes | BeYourTools",
  description:
    "Generate EAN-13 and EAN-8 barcodes with automatic check digits. Enter your digits and download PNG or SVG. 100% free and browser-based.",
  keywords: "EAN-13 barcode generator, EAN barcode, EAN-8 generator, create EAN barcode, EAN check digit, free EAN generator",
  alternates: { canonical: `${SITE.url}/ean-barcode-generator` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/ean-barcode-generator`,
    title: "EAN Barcode Generator - Free Online | BeYourTools",
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
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to Generate EAN Barcodes</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>1.</span> Choose EAN-13 or EAN-8 using the toggle.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>2.</span> Enter your digits (12 for EAN-13, 7 for EAN-8 with auto check digit).</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>3.</span> Click <strong>Generate</strong>.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>4.</span> Download the barcode as PNG or SVG.</li>
          </ol>
        </section>

        {/* EAN-13 Standards & Architecture Guide */}
        <section className="mt-10 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            GS1 Global Trade Item Numbers (GTIN) &amp; EAN Architecture
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            The European Article Number (EAN-13), formally governed under the international <strong>GS1 standard</strong> as GTIN-13, is the universal retail barcode identifier across Europe, Asia, Latin America, and Australia. 
            EAN barcodes facilitate automated point-of-sale inventory depletion, supply chain traceability, and automated warehouse receiving.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Country Prefix &amp; Manufacturer Code</h3>
              <p>
                The first 2–3 digits indicate the GS1 national member organization where the company prefix was registered (e.g., 00–13 for US/Canada, 50 for the UK, 400–440 for Germany). 
                The subsequent digits represent the individual manufacturer identification and specific item reference.
              </p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Modulo-10 Check Digit Calculation</h3>
              <p>
                The 13th digit is mathematically derived from the preceding 12 digits using an alternating weighting formula: odd-indexed positions are multiplied by 1 and even-indexed positions by 3. 
                Our engine automatically solves the modulo-10 complement to ensure full compliance with GS1 scanner validation.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>EAN Barcode Frequently Asked Questions</h2>
          {[
            ["What is the difference between EAN-13 and EAN-8?", "EAN-13 is the standard full 13-digit product barcode. EAN-8 is a specialized compact 8-digit derivative reserved for small packaging items (like chewing gum or cosmetics) with limited physical label surface area."],
            ["Can EAN-13 barcodes be scanned in the United States and Canada?", "Yes. Since 2005 (the GS1 2005 Sunrise initiative), all modern North American point-of-sale barcode scanners and retail checkout systems seamlessly scan and process both 12-digit UPC-A and 13-digit EAN-13 symbols."],
            ["How do I register an official EAN barcode for commercial retail sales?", "Official unique GS1 company prefixes must be obtained directly from your regional GS1 Member Organization. Our tool allows you to format, validate, and generate print-ready vector graphics once you have your allocated numbers."],
            ["Why should I download SVG format for product packaging?", "SVG is vector-based and resolution-independent. When passed to commercial packaging printers, vector barcodes eliminate raster pixelation, ensuring compliance with ISO/IEC 15416 print quality grading standards."],
          ].map(([q, a]) => (
            <div key={q as string}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{q}</p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{a}</p>
            </div>
          ))}
        </section>

        <QRRelatedTools currentSlug="ean-barcode-generator" />
      </div>
    </>
  );
}
