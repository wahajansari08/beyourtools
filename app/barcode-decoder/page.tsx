import type { Metadata } from "next";
import Link from "next/link";
import BarcodeDecoderClient from "./BarcodeDecoderClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Barcode Decoder - Read Barcodes from Images Free | BeYourTools",
  description:
    "Upload a barcode image and decode it instantly. Supports Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF and more. Free, private, browser-based.",
  keywords: "barcode decoder, read barcode from image, barcode reader online, decode barcode, barcode image decoder",
  alternates: { canonical: `${SITE.url}/barcode-decoder` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/barcode-decoder`,
    title: "Barcode Decoder - Read Barcodes from Images | BeYourTools",
    description: "Upload a barcode image and decode its value instantly. Free and private.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Barcode Decoder" }],
  },
};

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: "Barcode Decoder", url: canonical("/barcode-decoder") },
  ]),
  softwareApplicationSchema({
    name: "Barcode Decoder",
    description: "Upload a barcode image and decode Code 128, EAN-13, UPC-A and many more formats instantly in your browser.",
    url: canonical("/barcode-decoder"),
    category: "UtilitiesApplication",
  }),
  faqSchema([
    { question: "Which barcode formats can be decoded?", answer: "Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF, Data Matrix, Aztec, PDF417 and more — detection is automatic." },
    { question: "Are my images uploaded to a server?", answer: "No. All decoding happens locally using the open-source ZXing library. Your images never leave your device." },
    { question: "Why wasn't my barcode detected?", answer: "Make sure the barcode is clearly visible, not blurry, and fills a reasonable portion of the image. Low-contrast or heavily damaged barcodes may not decode." },
  ]),
];

export default function BarcodeDecoderPage() {
  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/qr-barcode-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>QR &amp; Barcode Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Barcode Decoder</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>Barcode Tools</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            Barcode Decoder
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Upload a barcode image to decode it instantly. The format is detected automatically —
            no need to specify Code 128, EAN-13, UPC, or any other type. Everything runs in your browser.
          </p>
        </div>

        <BarcodeDecoderClient />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to use</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>1.</span> Drag and drop a barcode image, or click to browse for a file.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>2.</span> The decoder automatically detects the barcode format and reads its value.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>3.</span> Copy the decoded value or open it as a URL if applicable.</li>
          </ol>
        </section>

        <QRRelatedTools currentSlug="barcode-decoder" />
      </div>
    </>
  );
}
