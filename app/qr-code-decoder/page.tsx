import type { Metadata } from "next";
import Link from "next/link";
import QRDecoderClient from "./QRDecoderClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "QR Code Decoder - Read QR Codes from Images Free | BeYourTools",
  description:
    "Upload a QR code image and decode its content instantly - URL, text, WiFi, vCard and more. Works with PNG, JPG and WebP. Free, private, browser-based.",
  keywords: "QR code decoder, read QR code from image, QR code reader online, decode QR code, QR image decoder",
  alternates: { canonical: `${SITE.url}/qr-code-decoder` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/qr-code-decoder`,
    title: "QR Code Decoder - Read QR Codes from Images | BeYourTools",
    description: "Upload a QR code image and decode its content instantly. Free and private.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "QR Code Decoder" }],
  },
};

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: "QR Code Decoder", url: canonical("/qr-code-decoder") },
  ]),
  softwareApplicationSchema({
    name: "QR Code Decoder",
    description: "Upload a QR code image (PNG, JPG, WebP) and decode its content instantly in your browser.",
    url: canonical("/qr-code-decoder"),
    category: "UtilitiesApplication",
  }),
  faqSchema([
    { question: "What image formats does the QR decoder support?", answer: "PNG, JPG/JPEG, and WebP images are supported. The QR code should be clearly visible and not blurry." },
    { question: "Are my images uploaded to a server?", answer: "No. All decoding happens locally in your browser. Your images never leave your device." },
    { question: "What types of QR codes can be decoded?", answer: "Any standard QR code including URLs, plain text, WiFi credentials, vCards, email, phone numbers, and SMS." },
    { question: "Why wasn't my QR code detected?", answer: "Ensure the image is well-lit, in focus, and the QR code fills a reasonable portion of the image. Heavily distorted or damaged codes may not decode reliably." },
  ]),
];

export default function QRDecoderPage() {
  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/qr-barcode-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>QR &amp; Barcode Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>QR Code Decoder</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>QR Tools</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            QR Code Decoder
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Upload or drag in a QR code image to instantly reveal its contents - URL, WiFi credentials, contact info, or plain text. No camera needed. Everything happens in your browser.
          </p>
        </div>

        <QRDecoderClient />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to use</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>1.</span> Drag and drop a QR code image onto the upload area, or click to browse.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>2.</span> The decoder reads the QR code automatically.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>3.</span> Copy the decoded value or open it as a URL if applicable.</li>
          </ol>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>FAQ</h2>
          {[
            ["What image formats are supported?", "PNG, JPG, and WebP. The QR code must be clearly visible and not too small or blurry."],
            ["Does this upload my image anywhere?", "No. Decoding is done entirely in your browser. Your images never leave your device."],
            ["My QR code wasn't detected - why?", "Try a higher-resolution image where the QR code fills more of the frame. Very small or heavily damaged codes may not decode."],
          ].map(([q, a]) => (
            <div key={q as string}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{q}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{a}</p>
            </div>
          ))}
        </section>

        <QRRelatedTools currentSlug="qr-code-decoder" />
      </div>
    </>
  );
}
