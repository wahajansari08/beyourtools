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
    { question: "Which barcode formats can be decoded?", answer: "Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF, Data Matrix, Aztec, PDF417 and more - detection is automatic." },
    { question: "Are my images uploaded to a server?", answer: "No. All decoding happens locally in your browser. Your images never leave your device." },
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
            Upload a barcode image to decode it instantly. The format is detected automatically -
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

        {/* Computer Vision & Optical Decoding Standards */}
        <section className="mt-10 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Computer Vision &amp; In-Browser Optical Decoding Architecture
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Decoding one-dimensional and two-dimensional optical barcodes from uploaded photos or screenshots requires multi-stage image processing. 
            Our in-browser decoding engine performs real-time image binarization, adaptive thresholding, edge detection, and perspective distortion correction directly inside your browser tab without transmitting images across external networks.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Universal Format Detection</h3>
              <p>
                The decoder automatically evaluates 1D linear symbologies (Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF) as well as 2D matrix symbologies (Data Matrix, Aztec, PDF417). 
                You never need to know the specific barcode encoding type prior to decoding.
              </p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Client-Side Confidentiality</h3>
              <p>
                Confidential supply chain manifests, internal asset tracking tags, shipping labels, and product serial numbers remain 100% private. 
                Images are processed directly in browser RAM via HTML5 Canvas image buffers and are instantly discarded when you close or refresh the page.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Frequently Asked Questions</h2>
          {[
            ["Which barcode formats can be decoded from images?", "The decoder automatically scans for Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF, Data Matrix, Aztec, and PDF417 formats without manual configuration."],
            ["Why wasn't my barcode recognized?", "Ensure the barcode is well-lit, sharp, and has adequate quiet zones (clear margins) around the bars. Blurry, low-resolution, or heavily skewed photos may require re-taking the photo closer to the symbol."],
            ["Can I decode barcodes from smartphone screenshots or PDF invoices?", "Yes. Save the screenshot or document page as PNG, JPG, or WebP and drop it into the decoder to extract the embedded alphanumeric payload."],
            ["Are my uploaded images stored or logged on a server?", "No. The entire optical scanning pipeline executes in JavaScript within your local browser environment. No files or decoded strings are sent to any remote server."],
          ].map(([q, a]) => (
            <div key={q as string}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{q}</p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{a}</p>
            </div>
          ))}
        </section>

        <QRRelatedTools currentSlug="barcode-decoder" />
      </div>
    </>
  );
}
