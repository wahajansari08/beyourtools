import type { Metadata } from "next";
import Link from "next/link";
import Code128Client from "./Code128Client";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Code 128 Barcode Generator - Online Free | BeYourTools",
  description:
    "Generate Code 128 barcodes from any printable text. Supports full ASCII, adjustable size and downloadable as PNG or SVG - free and browser-based.",
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
    { question: "What characters are supported?", answer: "All printable ASCII characters - that's letters (A-Z, a-z), digits (0-9), punctuation, and special characters like @, #, $, etc. Unicode characters are not supported." },
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

        {/* Technical Architecture & Standards */}
        <section className="mt-12 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Code 128 Symbology Architecture &amp; ISO/IEC 15417 Standards
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Code 128 is an extremely high-density linear barcode symbology defined under international standard <strong style={{ color: "var(--text-primary)" }}>ISO/IEC 15417</strong>.
            Unlike numeric-only retail barcodes like UPC-A and EAN-13, Code 128 can encode all 128 ASCII characters (including uppercase, lowercase, punctuation, numbers, and control codes) using three distinct code sets (A, B, and C).
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Character Sets &amp; Auto-Switching</h3>
              <p>
                <strong>Code Set A:</strong> Uppercase letters, digits, and ASCII control characters (00–95).<br />
                <strong>Code Set B:</strong> Full printable ASCII (uppercase, lowercase, digits, and punctuation).<br />
                <strong>Code Set C:</strong> Numeric double-density encoding (00–99 encoded into single bar patterns), halving the required physical width for digit sequences.
              </p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Modulo 103 Checksum &amp; Quiet Zones</h3>
              <p>
                Data integrity is enforced through a mandatory weighted modulo-103 check character calculated automatically before transmission.
                For reliable scanning by laser and CCD readers, a minimum quiet zone of 10 times the module width (X-dimension) is maintained on both margins.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Code 128 Barcode Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {[
              ["What is Code 128 used for?", "Code 128 is the global standard for logistics, shipping containers (GS1-128 / UCC-128), carton labels, pharmaceutical tracking, and enterprise asset inventory management."],
              ["Does Code 128 need a manual check digit?", "No. The modulo-103 checksum is calculated automatically by the browser generator and appended to the symbol structure."],
              ["What is the difference between Code 128 and Code 39?", "Code 128 is significantly more compact, supports lowercase letters, and includes mandatory checksum verification. Code 39 has a larger physical footprint and is primarily used in legacy industrial equipment."],
              ["Are generated barcodes stored on your servers?", "No. Barcodes are rendered entirely in client-side memory using HTML5 Canvas and SVG. No data is transmitted to or logged on remote servers."],
            ].map(([q, a]) => (
              <div key={q as string}>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{q}</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{a}</p>
              </div>
            ))}
          </div>
        </section>

        <QRRelatedTools currentSlug="code-128-barcode-generator" />
      </div>
    </>
  );
}
