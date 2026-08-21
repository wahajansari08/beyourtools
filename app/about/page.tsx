import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About BeYourTools — Free Browser-Based Online Tools",
  description: "Learn about BeYourTools — our mission, values, and why we built free browser-based tools for JSON, images, PDFs, audio, video and QR codes.",
  alternates: { canonical: `${SITE.url}/about` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/about`,
    title: "About BeYourTools — Free Browser-Based Online Tools",
    description: "Our mission: free, private, browser-based tools for everyone. No sign-up, no uploads, no paywalls.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "About BeYourTools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About BeYourTools",
    description: "Free, private, browser-based tools — no sign-up, no uploads.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
        <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>About</span>
      </nav>

      <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>About BeYourTools</h1>
      <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
        Free, private, browser-based tools for developers - no sign-up, no uploads, no paywalls.
      </p>

      <div className="policy-content mt-8 space-y-8">

        <section>
          <h2>Our Mission</h2>
          <p>Developers should never have to pay for basic productivity tools, upload sensitive data to unknown servers, or create accounts just to format a JSON response. BeYourTools was built to fix that.</p>
          <p>Every tool on BeYourTools runs entirely in your browser. Your JSON, files, and data never leave your device. We believe privacy-by-default should be the standard, not a premium feature.</p>
        </section>

        <section>
          <h2>What We Build</h2>
          <p>We maintain three suites of tools, all free and browser-based:</p>
          <ul>
            <li><strong><Link href="/json-tools" style={{ color: "var(--teal)" }}>JSON Tools</Link></strong> - 30+ tools including formatter, validator, diff, schema generator, JSONPath tester, JWT decoder, and converters to CSV, TypeScript, Python, SQL and more.</li>
            <li><strong><Link href="/image-converter" style={{ color: "var(--teal)" }}>Image Converter</Link></strong> - 118 image conversion combinations including JPG, PNG, WebP, AVIF, SVG, ICO, BMP, TIFF, and PDF.</li>
            <li><strong><Link href="/pdf-tools" style={{ color: "var(--teal)" }}>PDF Tools</Link></strong> - 30 tools including merge, split, compress, rotate, watermark, protect, unlock, and conversion to images and text.</li>
          </ul>
        </section>

        <section>
          <h2>Our Principles</h2>
          <div className="grid gap-4 sm:grid-cols-2 not-prose">
            {[
              { icon: "🔒", title: "Privacy first", body: "Nothing you process is transmitted to a server. All computation happens locally in your browser tab." },
              { icon: "🆓", title: "Free forever", body: "Our tools are funded by non-intrusive advertising. We will never paywalled core functionality." },
              { icon: "⚡", title: "No friction", body: "No account creation. No email required. Paste and go." },
              { icon: "🌍", title: "Accessible", body: "Tools work on any modern device. We support dark and light mode and follow accessibility best practices." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">{icon}</span>
                  <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{title}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Advertising</h2>
          <p>BeYourTools is free because it&apos;s supported by advertising. Ads appear on tool pages and help cover hosting and development costs. We choose non-intrusive ad placements and never allow pop-ups or auto-play video ads.</p>
          <p>You can read more about how ads work in our <Link href="/privacy-policy" style={{ color: "var(--teal)" }}>Privacy Policy</Link>.</p>
        </section>

        <section>
          <h2>Get in Touch</h2>
          <p>Questions, feedback, or partnership enquiries? We&apos;d love to hear from you. <Link href="/contact" style={{ color: "var(--teal)" }}>Contact us here</Link>.</p>
        </section>

      </div>
    </div>
  );
}
