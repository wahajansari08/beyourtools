import type { Metadata } from "next";
import Link from "next/link";
import QRGeneratorClient from "./QRGeneratorClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, howToSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "QR Code Generator - Create Free QR Codes Online | BeYourTools",
  description:
    "Create free QR codes online for URLs, text, WiFi, email, phone numbers, vCards and more. Customize colors, size and error correction. Download as PNG or SVG.",
  keywords:
    "QR code generator, free QR code, create QR code, WiFi QR code, vCard QR code, URL QR code, custom QR code",
  alternates: { canonical: `${SITE.url}/qr-code-generator` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/qr-code-generator`,
    title: "QR Code Generator - Create Free QR Codes Online | BeYourTools",
    description: "Generate QR codes for URLs, WiFi, vCards and more -free, instant, no sign-up.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "QR Code Generator" }],
  },
};

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools", url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: "QR Code Generator", url: canonical("/qr-code-generator") },
  ]),
  softwareApplicationSchema({
    name: "QR Code Generator",
    description: "Free browser-based QR code generator supporting URLs, text, WiFi, email, phone, vCard and location.",
    url: canonical("/qr-code-generator"),
    category: "UtilitiesApplication",
  }),
  howToSchema({
    name: "How to generate a QR code",
    description: "Steps to create a free QR code using BeYourTools.",
    steps: [
      { name: "Choose content type", text: "Select the type of content: URL, Text, WiFi, Email, Phone, SMS, vCard, or Location." },
      { name: "Enter your data", text: "Fill in the required fields for your chosen content type." },
      { name: "Customize (optional)", text: "Adjust size, colors, margin, and error correction level." },
      { name: "Generate", text: 'Click "Generate QR Code" to create your QR code instantly.' },
      { name: "Download", text: "Download as PNG or SVG, or copy the encoded value." },
    ],
  }),
  faqSchema([
    { question: "Is the QR code generator free?", answer: "Yes, completely free with no sign-up required. All processing happens in your browser." },
    { question: "Can I create a WiFi QR code?", answer: "Yes. Choose WiFi, enter your SSID, password and security type, then generate. Anyone who scans the code will be prompted to join your network." },
    { question: "What's the difference between error correction levels?", answer: "Higher error correction (H) makes the QR code more resilient to damage but denser. L (7%) is smallest; H (30%) is most robust. Use H when printing on surfaces that may get scratched." },
    { question: "Can I download the QR code as SVG?", answer: "Yes. After generating, use the 'Download SVG' button to get a scalable vector version suitable for printing at any size." },
    { question: "Is my data safe?", answer: "All QR code generation happens entirely in your browser. No data is ever sent to a server." },
  ]),
];

export default function QRCodeGeneratorPage() {
  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/qr-barcode-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>QR &amp; Barcode Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>QR Code Generator</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>
            QR Tools
          </p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            QR Code Generator
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Create free QR codes for URLs, text, WiFi credentials, email, phone, SMS, vCards, and GPS locations.
            Customize colors and download as PNG or SVG -everything happens in your browser.
          </p>
        </div>

        {/* Tool */}
        <QRGeneratorClient />

        {/* How to use */}
        <section className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            How to use
          </h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>1.</span> Select the content type (URL, WiFi, vCard, etc.).</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>2.</span> Fill in the required fields.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>3.</span> Optionally expand &quot;Customize QR code&quot; to change size, colors and error correction.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>4.</span> Click <strong>Generate QR Code</strong>.</li>
            <li className="flex gap-2"><span className="font-semibold" style={{ color: "var(--teal)" }}>5.</span> Download PNG or SVG, or copy the encoded value.</li>
          </ol>
        </section>

        {/* Features */}
        <section className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Features</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["8 content types", "URL, Text, Email, Phone, SMS, WiFi, vCard, Location"],
              ["Custom colors", "Set foreground and background colors freely"],
              ["Adjustable size", "128 px to 512 px output"],
              ["Error correction", "L / M / Q / H levels"],
              ["PNG & SVG download", "Pixel-perfect PNG and infinitely scalable SVG"],
              ["100% private", "No server upload -generated entirely in your browser"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{title}</p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>FAQ</h2>
          {[
            ["Is this QR code generator really free?", "Yes -no sign-up, no watermarks, unlimited usage."],
            ["Can I print the generated QR code?", "Yes. Download the SVG version for best print quality at any size."],
            ["What is error correction?", "It determines how much of the QR code can be damaged and still scan correctly. H (30%) is best for printed or outdoor use."],
          ].map(([q, a]) => (
            <div key={q as string}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{q}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{a}</p>
            </div>
          ))}
        </section>

        <QRRelatedTools currentSlug="qr-code-generator" />
      </div>
    </>
  );
}
