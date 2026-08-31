import type { Metadata } from "next";
import Link from "next/link";
import BarcodeScannerClient from "./BarcodeScannerClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Barcode Scanner Online - Scan Barcodes Free | BeYourTools",
  description:
    "Scan barcodes using your device camera or upload an image. Supports Code 128, Code 39, EAN-13, UPC-A, ITF and more. Free, private, no app needed.",
  keywords: "barcode scanner online, scan barcode, barcode reader, camera barcode scanner, free barcode scanner",
  alternates: { canonical: `${SITE.url}/barcode-scanner` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/barcode-scanner`,
    title: "Barcode Scanner Online - Scan Barcodes Free | BeYourTools",
    description: "Scan barcodes from your camera or upload an image. Free and private.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Barcode Scanner" }],
  },
};

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: "Barcode Scanner", url: canonical("/barcode-scanner") },
  ]),
  softwareApplicationSchema({
    name: "Barcode Scanner",
    description: "Free browser-based barcode scanner. Use your camera or upload an image to decode Code 128, EAN-13, UPC-A and many more formats.",
    url: canonical("/barcode-scanner"),
    category: "UtilitiesApplication",
  }),
  faqSchema([
    { question: "Which barcode formats does the scanner support?", answer: "Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF, Data Matrix, Aztec, and PDF417." },
    { question: "Do I need to install an app?", answer: "No. The scanner runs entirely in your browser - no download needed." },
    { question: "What if camera permission is denied?", answer: "You can still decode barcodes by uploading an image using the upload option below the camera controls." },
    { question: "Is my camera feed private?", answer: "Yes. All processing is done locally in JavaScript. No frames are uploaded to any server." },
  ]),
];

export default function BarcodeScannerPage() {
  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/qr-barcode-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>QR &amp; Barcode Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Barcode Scanner</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>Barcode Tools</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            Barcode Scanner
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Scan barcodes live using your device camera. The format is detected automatically - Code 128,
            EAN-13, UPC-A, and more. No camera? Upload a barcode image instead.
          </p>
        </div>

        <BarcodeScannerClient />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to use</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>1.</span> Click <strong>Start Camera Scan</strong> and allow camera access.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>2.</span> Hold a barcode in front of your camera - detection is automatic.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>3.</span> Copy the result or scan another barcode.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>4.</span> No camera? Upload a barcode image using the upload option.</li>
          </ol>
        </section>

        <QRRelatedTools currentSlug="barcode-scanner" />
      </div>
    </>
  );
}
