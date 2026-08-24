import type { Metadata } from "next";
import Link from "next/link";
import BarcodeWithLogoClient from "./BarcodeWithLogoClient";
import QRRelatedTools from "@/components/qr/QRRelatedTools";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Barcode Generator with Logo -Add Logo to Barcode Free | BeYourTools",
  description:
    "Generate Code 128, EAN-13, EAN-8, UPC-A and Code 39 barcodes with a custom or social media logo overlay. Upload your own logo or choose from Instagram, Facebook, YouTube and more. Free, browser-based, no upload.",
  keywords:
    "barcode generator with logo, barcode with logo, custom barcode logo, EAN-13 barcode logo, Code 128 logo barcode, brand barcode generator",
  alternates: { canonical: `${SITE.url}/barcode-generator-with-logo` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/barcode-generator-with-logo`,
    title: "Barcode Generator with Logo -Add Logo to Barcode Free | BeYourTools",
    description:
      "Create barcodes with a custom or social media logo. Code 128, EAN-13, UPC-A and more. Browser-based, no upload.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Barcode Generator with Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barcode Generator with Logo | BeYourTools",
    description: "Add a custom or social logo to any barcode -free, browser-based.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
  },
};

const FAQS = [
  {
    question: "Can I add my own logo to a barcode?",
    answer:
      "Yes. Choose 'Upload logo', pick a PNG, JPG, WebP or SVG file (max 2 MB) and it will be overlaid on the generated barcode. Your image is never uploaded to any server -everything stays in your browser.",
  },
  {
    question: "Will adding a logo stop the barcode from scanning?",
    answer:
      "A logo that covers more than roughly 20–25% of the barcode area can make it hard to scan reliably. The tool warns you if your logo size exceeds a safe threshold. Barcodes with error-correction (like QR codes) tolerate obscuring better than standard linear barcodes, so keep logos small and centered.",
  },
  {
    question: "Which barcode formats are supported?",
    answer:
      "Code 128 (full ASCII), Code 39 (uppercase alphanumeric), EAN-13 (13-digit retail), EAN-8 (8-digit compact retail) and UPC-A (12-digit North American retail). Check-digits for EAN-13, EAN-8 and UPC-A are calculated automatically when you provide the shorter digit string.",
  },
  {
    question: "Can I use social media logos like Instagram or YouTube?",
    answer:
      "Yes -choose 'Social logo' and pick from Instagram, Facebook, YouTube, TikTok, X, LinkedIn, WhatsApp, Telegram or GitHub. These logos are rendered as inline graphics directly in your browser -no external image requests are made.",
  },
  {
    question: "Can I download the barcode as SVG?",
    answer:
      "SVG download is available when no logo is applied (the raw barcode SVG). When a logo overlay is applied, the output is rasterized onto a canvas, so PNG and JPG downloads are offered instead.",
  },
  {
    question: "Is my uploaded logo kept private?",
    answer:
      "Yes. Your uploaded logo is read locally using the browser FileReader API and drawn onto a canvas element in your browser tab. It is never sent to BeYourTools servers or any third-party service.",
  },
];

const schemas = [
  breadcrumbSchema([
    { name: "BeYourTools",        url: SITE.url },
    { name: "QR & Barcode Tools", url: canonical("/qr-barcode-tools") },
    { name: "Barcode Generator with Logo", url: canonical("/barcode-generator-with-logo") },
  ]),
  softwareApplicationSchema({
    name: "Barcode Generator with Logo",
    description:
      "Free browser-based barcode generator with custom logo overlay. Supports Code 128, EAN-13, EAN-8, UPC-A and Code 39. Upload a custom logo or choose a social media icon.",
    url: canonical("/barcode-generator-with-logo"),
    category: "UtilitiesApplication",
  }),
  faqSchema(FAQS),
];

export default function BarcodeGeneratorWithLogoPage() {
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
          <span style={{ color: "var(--text-secondary)" }}>Barcode Generator with Logo</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>
            Barcode Tools
          </p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            Barcode Generator with Logo
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Generate professional barcodes and overlay a custom or social media logo.
            Supports Code 128, EAN-13, EAN-8, UPC-A and Code 39.
            Customize colors, size, logo position and padding -then download as PNG, JPG or SVG.
            Everything runs in your browser; nothing is uploaded.
          </p>
        </div>

        {/* Tool */}
        <BarcodeWithLogoClient />

        {/* How to use */}
        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            How to create a barcode with a logo
          </h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {[
              ["Choose format", "Select Code 128, EAN-13, EAN-8, UPC-A or Code 39 from the format dropdown."],
              ["Enter value", "Type your barcode value. For EAN-13/EAN-8/UPC-A you can enter the short form -the check digit is added automatically."],
              ["Add a logo", "Select 'Social logo' to choose a brand icon, or 'Upload logo' to add your own PNG, JPG, WebP or SVG image."],
              ["Adjust size & padding", "Use the logo size slider to control how much of the barcode the logo covers. Keep it under 20% for reliable scanning. Add padding to create a clean white border around the logo."],
              ["Customize barcode", "Set bar color, background, bar width and height to match your brand."],
              ["Generate and download", "Click Generate, preview the result, then download as PNG or JPG. SVG is available for barcode-only output."],
            ].map(([title, text], i) => (
              <li key={i} className="flex gap-2">
                <span className="font-semibold shrink-0" style={{ color: "var(--teal)" }}>{i + 1}.</span>
                <span><strong style={{ color: "var(--text-secondary)" }}>{title}</strong> -{text}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Supported formats */}
        <section className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Supported barcode formats
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["Code 128",  "Full ASCII printable characters. Variable length. The most widely used barcode in logistics and shipping."],
              ["Code 39",   "Uppercase A–Z, digits 0–9, and special characters. Common in manufacturing, military and healthcare."],
              ["EAN-13",    "13-digit European Article Number used on retail products worldwide. Check digit calculated automatically."],
              ["EAN-8",     "Compact 8-digit EAN for small packaging where a full EAN-13 would not fit."],
              ["UPC-A",     "12-digit Universal Product Code -the standard for retail products in North America."],
            ].map(([name, desc]) => (
              <div key={name} className="rounded-lg border p-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{name}</p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Logo section */}
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Custom and social logo support
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            You can overlay any of the following social media brand icons: Instagram, Facebook, YouTube, TikTok, X (Twitter), LinkedIn, WhatsApp, Telegram, and GitHub. These are rendered as inline vector graphics -no external network request is made and no image is loaded from a CDN.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            To use your own logo, upload a PNG, JPG, WebP or SVG file (maximum 2 MB). SVG files are sanitized before use to remove any scripts or unsafe elements. All image processing happens in the browser; your file is never transmitted to any server.
          </p>
        </section>

        {/* Scanning tips */}
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Logo and scanning tips
          </h2>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {[
              "Keep the logo under 20% of the barcode width to maintain reliable scanning.",
              "Place the logo centrally so it covers bars evenly and avoids the barcode edges.",
              "Use a white padding background (the default) to visually separate the logo from the bars.",
              "Dark bar color on a white background gives the best scanner contrast.",
              "Always test the final barcode with an actual scanner or scanning app before printing at scale.",
              "If scanning fails, reduce the logo size, increase contrast, or use the barcode without a logo.",
            ].map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: "var(--teal)" }} aria-hidden="true">✓</span>
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
            all barcode generation, logo rendering, and image compositing happens locally in your browser using the Canvas API and JsBarcode library.
            Your barcode values, uploaded logo images, and generated outputs are never sent to BeYourTools servers or any third-party service.
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
        <QRRelatedTools currentSlug="barcode-generator-with-logo" />
      </div>
    </>
  );
}
