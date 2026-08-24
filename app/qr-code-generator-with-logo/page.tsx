import type { Metadata } from "next";
import Link from "next/link";
import QRWithLogoClient from "./QRWithLogoClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "QR Code Generator with Logo -Add Logo to QR Code Free | BeYourTools",
  description:
    "Generate QR codes for URLs, text, WiFi, email, phone and vCard -then overlay a custom or social media logo. Choose from Instagram, Facebook, YouTube, TikTok and more. Free, browser-based, no upload.",
  keywords:
    "QR code generator with logo, QR code with logo, custom QR code logo, QR code with image, branded QR code, social media QR code",
  alternates: { canonical: `${SITE.url}/qr-code-generator-with-logo` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/qr-code-generator-with-logo`,
    title: "QR Code Generator with Logo -Add Logo to QR Code Free | BeYourTools",
    description:
      "Create branded QR codes with a custom or social media logo. URL, WiFi, vCard and more. Browser-based, no upload.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "QR Code Generator with Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator with Logo | BeYourTools",
    description: "Add a custom or social logo to any QR code -free, browser-based.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
  },
};

const FAQS = [
  {
    question: "Can I add a logo to my QR code?",
    answer:
      "Yes. Choose 'Social logo' to pick from built-in brand icons (Instagram, Facebook, YouTube, TikTok, X, LinkedIn, WhatsApp, Telegram, GitHub), or choose 'Upload logo' to use your own PNG, JPG, WebP or SVG image. Your logo is never uploaded -everything stays in your browser.",
  },
  {
    question: "Will the logo prevent the QR code from scanning?",
    answer:
      "QR codes have built-in error correction that allows a portion of the code to be obscured and still scan correctly. This tool automatically uses the highest error correction level (H, 30%) when a logo is active, which means up to 30% of the QR code area can be covered. Keep your logo under 20–25% of the QR size for reliable scanning, and always test before printing.",
  },
  {
    question: "Why is error correction set to H automatically?",
    answer:
      "Error correction level H allows QR codes to be scanned even when up to 30% of the code is obscured. When a logo covers part of the QR code, you need this headroom for reliable scanning. The tool sets it automatically when a logo is active so you don't have to remember to do it manually.",
  },
  {
    question: "What QR code types are supported?",
    answer:
      "URL, plain text, email (mailto:), phone (tel:), SMS, WiFi credentials (WIFI: format), vCard v3 contacts, and GPS coordinates. Each type generates the correct QR payload format automatically.",
  },
  {
    question: "Can I download the QR code with logo as SVG?",
    answer:
      "Yes -when a logo is applied, the tool generates an SVG that embeds the logo as an inline image element. You can download PNG, JPG or SVG in all cases. For best print quality, use SVG.",
  },
  {
    question: "Is my uploaded logo kept private?",
    answer:
      "Yes. Your uploaded logo is read locally using the browser FileReader API and composited onto a canvas in your browser tab. It is never sent to BeYourTools servers or any third-party service. SVG uploads are sanitized to remove scripts before use.",
  },
];

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools",        url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: "QR Code Generator with Logo", url: canonical("/qr-code-generator-with-logo") },
  ]),
  softwareApplicationSchema({
    name: "QR Code Generator with Logo",
    description:
      "Free browser-based QR code generator with custom logo overlay. Supports URL, WiFi, vCard, email, phone and text. Upload a custom logo or choose a social media icon.",
    url: canonical("/qr-code-generator-with-logo"),
    category: "UtilitiesApplication",
  }),
  faqSchema(FAQS),
];

export default function QRCodeGeneratorWithLogoPage() {
  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/qr-barcode-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>QR &amp; Barcode Tools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>QR Code Generator with Logo</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>
            QR Tools
          </p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            QR Code Generator with Logo
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Generate QR codes for URLs, WiFi, contacts, email, phone and more -then overlay your brand logo or a social media icon.
            Customize colors, error correction, logo size and padding. Download as PNG, JPG or SVG.
            Everything runs in your browser; nothing is uploaded.
          </p>
        </div>

        {/* Tool */}
        <QRWithLogoClient />

        {/* How to use */}
        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            How to create a QR code with a logo
          </h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {[
              ["Choose content type", "Select URL, Text, WiFi, Email, Phone, SMS, vCard or Location."],
              ["Enter your data", "Fill in the required fields -for WiFi enter the SSID, password and security type; for vCard fill in the contact details."],
              ["Add a logo", "Select 'Social logo' to choose a brand icon, or 'Upload logo' to add your own PNG, JPG, WebP or SVG image (max 2 MB)."],
              ["Adjust logo size", "Keep the logo under 20–25% of the QR size for reliable scanning. Error correction H is applied automatically when a logo is active."],
              ["Customize colors", "Expand 'Customize QR code' to change QR color, background, size and margin."],
              ["Generate and download", "Click Generate, preview the result, then download as PNG, JPG or SVG, or print directly."],
            ].map(([title, text], i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 font-semibold" style={{ color: "var(--teal)" }}>{i + 1}.</span>
                <span><strong style={{ color: "var(--text-secondary)" }}>{title}</strong> -{text}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Supported types */}
        <section className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Supported QR code types
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["URL",      "Any web address. Protocol (https://) is added automatically if omitted."],
              ["Plain Text","Any text up to the QR code's data capacity."],
              ["WiFi",     "SSID, password and security type. Guests scan to join -no typing required."],
              ["Email",    "Pre-fills the recipient address in a mailto: link when scanned."],
              ["Phone",    "tel: link that initiates a call on a mobile device."],
              ["SMS",      "sms: link that opens the messages app with the number pre-filled."],
              ["vCard",    "Contact card with name, phone, email, company, website and address."],
              ["Location", "GPS coordinates encoded as a geo: URI."],
            ].map(([name, desc]) => (
              <div key={name} className="rounded-lg border p-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{name}</p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Logo support */}
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Custom and social logo support
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Choose from nine built-in social media brand icons: Instagram, Facebook, YouTube, TikTok, X (Twitter), LinkedIn, WhatsApp, Telegram and GitHub. These are rendered as inline vector graphics in your browser -no external network request is made and no image is loaded from any CDN.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            To use your own logo, upload a PNG, JPG, WebP or SVG file (maximum 2 MB). SVG files are sanitized before use to remove any scripts or unsafe elements. All image processing happens in the browser; your file is never transmitted anywhere.
          </p>
        </section>

        {/* Scanning tips */}
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            QR code logo and scanning tips
          </h2>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {[
              "Always use error correction level H when adding a logo -this tool sets it automatically.",
              "Keep the logo under 20–25% of the QR code's total area for reliable scanning.",
              "Add a white padding background around the logo to visually separate it from the QR modules.",
              "Use high contrast colors -dark QR modules on a white background scan most reliably.",
              "Test the generated QR code with multiple scanner apps before printing at scale.",
              "For printed QR codes, use the SVG download for the sharpest output at any print size.",
              "Avoid overly complex colors or gradients on the QR modules -they reduce contrast and scanability.",
            ].map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true" style={{ color: "var(--teal)" }}>✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Privacy */}
        <section className="mt-10 rounded-lg border p-4 text-sm leading-relaxed"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
          <p>
            <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>🔒 Private browser-based processing -</span>
            all QR code generation, logo rendering and image compositing happens locally in your browser using the qrcode library and the Canvas API.
            Your QR data, uploaded logo images and generated outputs are never sent to BeYourTools servers or any third-party service.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>FAQ</h2>
          {FAQS.map(({ question, answer }) => (
            <div key={question}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{question}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{answer}</p>
            </div>
          ))}
        </section>

        {/* Related tools */}
        <QRRelatedTools currentSlug="qr-code-generator-with-logo" />
      </div>
    </>
  );
}
