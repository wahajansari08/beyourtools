import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE, breadcrumbSchema, organizationSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About BeYourTools - Free Browser-Based Online Tools",
  description: "Learn about BeYourTools - our mission, client-side technology, and why we built 290+ free browser-based tools for JSON, images, PDFs, video, audio, QR codes, and finance.",
  alternates: { canonical: `${SITE.url}/about` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/about`,
    title: "About BeYourTools - Free Browser-Based Online Tools",
    description: "Our mission: free, private, browser-based tools for everyone. No sign-up, no uploads, no paywalls.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "About BeYourTools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About BeYourTools",
    description: "Free, private, browser-based tools - no sign-up, no uploads.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function AboutPage() {
  const schemas = [
    organizationSchema(),
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "About", url: `${SITE.url}/about` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>About</span>
        </nav>

        <header className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--teal)" }}>
            About Our Platform
          </p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            About BeYourTools
          </h1>
          <p className="mt-3 text-base leading-relaxed sm:text-lg" style={{ color: "var(--text-muted)" }}>
            Fast, private, browser-based online tools for developers, creators, entrepreneurs, and everyday users. Zero file uploads, zero account registration, and zero paywalls.
          </p>
        </header>

        <div className="policy-content space-y-10">

          <section>
            <h2>Our Mission &amp; Vision</h2>
            <p>
              In today&apos;s digital ecosystem, performing simple daily tasks-such as formatting a JSON payload, converting an image, compressing a PDF, or trimming an audio clip-often comes with frustrating barriers: forced account sign-ups, subscription paywalls, intrusive tracking, and privacy risks from uploading sensitive files to unknown remote servers.
            </p>
            <p>
              <strong>BeYourTools</strong> was created to eliminate these barriers entirely. We believe essential productivity and utility tools should be <em>universally accessible, instant, and privacy-preserving by default</em>. By harnessing modern browser standards, WebAssembly, HTML5 Canvas, and client-side processing, every single computation on our platform runs locally inside your web browser. Your confidential documents, images, code, and financial data never leave your device.
            </p>
          </section>

          <section>
            <h2>What We Build</h2>
            <p className="mb-4">
              BeYourTools provides a unified ecosystem of over <strong>290+ specialized tools</strong> organized across seven core suites, all engineered for immediate client-side execution:
            </p>

            <div className="grid gap-4 sm:grid-cols-2 not-prose">
              <div className="rounded-xl border p-5 transition hover-card" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: "color-mix(in srgb, var(--teal) 15%, transparent)", color: "var(--teal)" }}>
                    {"{ }"}
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      <Link href="/json-tools" className="hover:underline">JSON &amp; Developer Tools</Link>
                    </h3>
                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>30+ Browser Utilities</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  High-speed JSON formatters, validators, side-by-side diff engines, JSONPath evaluators, JWT token decoders, and converters for CSV, TypeScript, Python, SQL, XML, and YAML with zero server transmission.
                </p>
              </div>

              <div className="rounded-xl border p-5 transition hover-card" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }}>
                    🖼
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      <Link href="/image-converter" className="hover:underline">Image Converter Suite</Link>
                    </h3>
                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>118 Conversion Pairs</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Comprehensive two-way image conversions between JPG, PNG, WebP, AVIF, SVG, ICO, BMP, TIFF, HEIC, and PDF. Features multi-file batch processing, instant previewing, and client-side ZIP packaging.
                </p>
              </div>

              <div className="rounded-xl border p-5 transition hover-card" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: "color-mix(in srgb, var(--coral) 15%, transparent)", color: "var(--coral)" }}>
                    📄
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      <Link href="/pdf-tools" className="hover:underline">PDF Document Suite</Link>
                    </h3>
                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>30 Client-Side Tools</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Fast and secure PDF management including merge, split, compress, password protect, unlock, rotate, watermark, page reordering, and lossless extraction to text and images without cloud uploads.
                </p>
              </div>

              <div className="rounded-xl border p-5 transition hover-card" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: "color-mix(in srgb, #8b5cf6 15%, transparent)", color: "#8b5cf6" }}>
                    🎬
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      <Link href="/video-tools" className="hover:underline">Video Tools Suite</Link>
                    </h3>
                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>20 Media Utilities</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Hardware-accelerated browser video utilities powered by WebAssembly. Compress videos, trim clips, convert formats (MP4, WebM, MOV, MKV), extract audio tracks, generate GIFs, and capture frame thumbnails.
                </p>
              </div>

              <div className="rounded-xl border p-5 transition hover-card" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: "color-mix(in srgb, var(--teal) 15%, transparent)", color: "var(--teal)" }}>
                    🎵
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      <Link href="/audio-tools" className="hover:underline">Audio Tools Suite</Link>
                    </h3>
                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>20 Sound Utilities</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Comprehensive audio tools including MP3 converters, audio cutters, bit rate compressors, audio mergers, volume boosters, tempo changers, and an in-browser microphone voice recorder.
                </p>
              </div>

              <div className="rounded-xl border p-5 transition hover-card" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: "color-mix(in srgb, #f59e0b 15%, transparent)", color: "#f59e0b" }}>
                    ▦
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      <Link href="/qr-barcode-tools" className="hover:underline">QR &amp; Barcode Suite</Link>
                    </h3>
                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>12 Scanning &amp; Generation Tools</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Custom QR code generator with embedded logos, WiFi network QR codes, image scanners, and linear retail barcode generators supporting UPC-A, EAN-13, and Code 128 standards.
                </p>
              </div>

              <div className="rounded-xl border p-5 transition hover-card sm:col-span-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: "color-mix(in srgb, #10b981 15%, transparent)", color: "#10b981" }}>
                    💰
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      <Link href="/finance-tools" className="hover:underline">Financial &amp; Business Calculators</Link>
                    </h3>
                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>59 Financial Modeling Engines</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Mathematical calculation suites covering loan payments, amortization schedules, gross and net profit margins, savings targets, investment ROI, debt snowball/avalanche strategies, credit card payoff models, and hourly-to-salary wage conversions.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2>How Our Technology Works (Client-Side Architecture)</h2>
            <p>
              Traditional online utility websites upload your files and data to their remote cloud servers, run backend scripts, and send the result back. This architecture introduces bandwidth bottlenecks, server wait times, and severe data privacy vulnerabilities.
            </p>
            <p>
              BeYourTools operates on a <strong>modern client-first paradigm</strong>:
            </p>
            <ul>
              <li><strong>In-Memory Processing:</strong> Data manipulation occurs strictly within your browser&apos;s allocated memory sandbox using JavaScript Web Workers, HTML5 Canvas, and WebAssembly binaries.</li>
              <li><strong>Zero External Storage:</strong> We do not operate databases to retain your files, text, credentials, or generated outputs. Once you close or reload your browser tab, your data is completely discarded.</li>
              <li><strong>High Performance:</strong> Since files are processed locally on your device&apos;s CPU and GPU, you experience instant processing without waiting for upload or download transfers.</li>
            </ul>
          </section>

          <section>
            <h2>Our Core Principles</h2>
            <div className="grid gap-4 sm:grid-cols-2 not-prose">
              {[
                { icon: "🔒", title: "Privacy by Default", body: "No files or text are transmitted to remote servers. Confidential legal documents, private source code, and images stay strictly on your device." },
                { icon: "🆓", title: "Free Forever", body: "We are committed to keeping all core tools accessible without paywalls, subscriptions, daily usage limits, or hidden fees." },
                { icon: "⚡", title: "Frictionless & Instant", body: "No registration, no account logins, and no email collection. Simply open any tool, drop in your data, and export your results immediately." },
                { icon: "🌍", title: "Cross-Platform & Accessible", body: "Fully responsive across desktop, tablet, and mobile screens. Designed with WCAG accessibility standards and native dark/light theme support." },
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
            <h2>Sustainable &amp; Transparent Advertising</h2>
            <p>
              BeYourTools is free to use worldwide thanks to support from clean, non-intrusive digital advertising. Revenue generated from advertising covers infrastructure maintenance, content delivery network (CDN) bandwidth, and active feature development.
            </p>
            <p>
              We adhere to strict ethical advertising standards:
            </p>
            <ul>
              <li>No deceptive &quot;fake download&quot; buttons or misleading advertisements.</li>
              <li>No intrusive modal popups, audio auto-play ads, or screen-blocking overlays.</li>
              <li>Full compliance with Google AdSense quality and placement guidelines.</li>
            </ul>
            <p>
              To learn more about our advertising practices and privacy safeguards, please review our <Link href="/privacy-policy" style={{ color: "var(--teal)" }}>Privacy Policy</Link> and <Link href="/cookie-policy" style={{ color: "var(--teal)" }}>Cookie Policy</Link>.
            </p>
          </section>

          <section>
            <h2>Get in Touch &amp; Feedback</h2>
            <p>
              We continuously expand and refine our tools based on community requests and developer feedback. If you have suggestions for a new tool, encounter a bug, or would like to partner with us, we would love to hear from you.
            </p>
            <p>
              Reach out through our <Link href="/contact" style={{ color: "var(--teal)" }}>Contact Page</Link> or connect with us on social media.
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
