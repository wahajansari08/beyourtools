import type { Metadata } from "next";
import Link from "next/link";
import QRScannerClient from "./QRScannerClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "QR Code Scanner Online - Scan QR Codes Free | BeYourTools",
  description:
    "Scan QR codes using your device camera or upload an image. Decodes URLs, text, WiFi, vCards and more — free, private, no app download needed.",
  keywords: "QR code scanner online, scan QR code, QR code reader, camera QR scanner, free QR scanner",
  alternates: { canonical: `${SITE.url}/qr-code-scanner` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/qr-code-scanner`,
    title: "QR Code Scanner Online - Scan QR Codes Free | BeYourTools",
    description: "Scan QR codes from your camera or upload an image — free and private.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "QR Code Scanner" }],
  },
};

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: "QR Code Scanner", url: canonical("/qr-code-scanner") },
  ]),
  softwareApplicationSchema({
    name: "QR Code Scanner",
    description: "Free browser-based QR code scanner. Use your device camera or upload an image to decode any QR code.",
    url: canonical("/qr-code-scanner"),
    category: "UtilitiesApplication",
  }),
  faqSchema([
    { question: "Do I need to install an app to scan QR codes?", answer: "No. This scanner runs directly in your browser — no download or installation required." },
    { question: "Why does the scanner need camera permission?", answer: "Camera access is needed to capture a live video feed for real-time scanning. You can revoke permission in your browser settings at any time." },
    { question: "What if my device has no camera?", answer: "Use the image upload option to decode a QR code from an existing photo or screenshot." },
    { question: "Is my camera feed private?", answer: "Yes. The video feed is processed locally — no frames are ever sent to a server." },
  ]),
];

export default function QRScannerPage() {
  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/qr-barcode-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>QR &amp; Barcode Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>QR Code Scanner</span>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>QR Tools</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            QR Code Scanner
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Scan QR codes in real time using your device camera. Switch between front and rear cameras,
            or upload an image if you have no camera. Works on desktop and mobile over HTTPS.
          </p>
        </div>

        <QRScannerClient />

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>How to use</h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>1.</span> Click <strong>Start Camera Scan</strong> and allow camera access when prompted.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>2.</span> Point your camera at a QR code — it detects automatically.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>3.</span> Copy the result, open it as a URL, or scan another code.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>4.</span> No camera? Upload a QR code image using the upload option.</li>
          </ol>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>FAQ</h2>
          {[
            ["Why isn't camera scanning working?", "Camera scanning requires HTTPS and a browser that supports getUserMedia (Chrome, Edge, Firefox, Safari). Ensure camera permission is granted."],
            ["Can I switch between front and back camera?", "Yes — if multiple cameras are detected, a selector appears during scanning."],
            ["Is there a size limit for uploaded images?", "There is no hard limit, but very large images may take a moment to decode. Most standard screenshots and photos work fine."],
          ].map(([q, a]) => (
            <div key={q as string}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{q}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{a}</p>
            </div>
          ))}
        </section>

        <QRRelatedTools currentSlug="qr-code-scanner" />
      </div>
    </>
  );
}
