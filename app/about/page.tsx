import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE, breadcrumbSchema, organizationSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About BeYourTools - Free Browser-Based Online Tools",
  description: "Learn about BeYourTools: our mission, client-side technology, and 290+ free browser tools for JSON, images, PDFs, audio, video, and finance.",
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
            Fast, private, browser-based online tools for everyone. Zero file uploads, zero account sign-ups, and zero paywalls.
          </p>
        </header>

        <div className="policy-content space-y-10">

          <section>
            <h2>Our Mission &amp; Vision</h2>
            <p>
              Daily tasks like converting images, compressing PDFs, or formatting JSON should be fast and simple. Yet most sites force you to create accounts, pay subscriptions, or upload private files to remote servers.
            </p>
            <p>
              <strong>BeYourTools</strong> was created to remove these hurdles. We believe helpful tools should be free, fast, and private by default. By using modern browser technology, WebAssembly, and local processing, every tool runs right on your device. Your documents, photos, code, and finances never leave your hands.
            </p>
          </section>

          <section>
            <h2>What We Build</h2>
            <p className="mb-4">
              BeYourTools provides over <strong>290+ free tools</strong> across seven categories, all built to run instantly right in your browser:
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
                  Format, validate, and compare JSON data in your browser. Decode JWT tokens and convert JSON to CSV, YAML, Python, and SQL with zero server uploads.
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
                  Convert images between JPG, PNG, WebP, AVIF, SVG, ICO, and PDF. Convert multiple files at once, preview changes instantly, and download as a ZIP file.
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
                  Merge, split, and compress PDF files right on your device. Add passwords, rotate pages, or extract text and images without uploading files to any server.
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
                  Compress and trim videos right in your browser. Convert MP4, WebM, and MKV files, create animated GIFs, and grab clean video frames.
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
                  Cut, join, and compress audio files with ease. Boost volume, convert formats like MP3 and WAV, or record sound right inside your web browser.
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
                  Make custom QR codes with logos, build WiFi QR codes, scan codes with your camera, and create retail barcodes like UPC-A and Code 128.
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
                  Calculate loan payments, payoff dates, interest, and profit margins. Plan your budget, compare debts, and estimate your take-home paycheck.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2>How Our Technology Works (Client-Side Architecture)</h2>
            <p>
              Most online tools upload your files to remote servers, run scripts, and send files back. This causes delays and puts your privacy at risk.
            </p>
            <p>
              BeYourTools works differently by running directly on your device:
            </p>
            <ul>
              <li><strong>In-Memory Processing:</strong> Tools run inside your browser memory using local Web Workers and WebAssembly.</li>
              <li><strong>Zero External Storage:</strong> We never store your files, text, or results. When you close the tab, everything is gone.</li>
              <li><strong>Fast Performance:</strong> Processing files locally uses your device power, so you never wait for slow uploads.</li>
            </ul>
          </section>

          <section>
            <h2>Our Core Principles</h2>
            <div className="grid gap-4 sm:grid-cols-2 not-prose">
              {[
                { icon: "🔒", title: "Private by Default", body: "Your files and text stay on your device. We never send your documents, photos, or code to any cloud server." },
                { icon: "🆓", title: "Free to Use", body: "All core tools are 100% free. Enjoy full access without paywalls, subscriptions, daily limits, or hidden costs." },
                { icon: "⚡", title: "Fast and Simple", body: "No account needed. Just open any tool, drop in your files, and download your results in seconds." },
                { icon: "🌍", title: "Works Everywhere", body: "Use our tools on phones, tablets, and laptops. Enjoy clean layouts with light and dark mode support." },
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
              BeYourTools is completely free to use thanks to clean, simple ads. Ad revenue pays for our hosting, fast global network, and ongoing tool updates.
            </p>
            <p>
              We follow clear ethical advertising rules:
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
            <h2>Engineering Standards &amp; Formula Verification</h2>
            <p>
              We build every tool to follow strict web standards and exact math formulas:
            </p>
            <ul>
              <li><strong>Data Formats:</strong> Our JSON tools follow official RFC 8259 rules. They format and check code so it works across all modern apps.</li>
              <li><strong>PDF Documents:</strong> Our PDF tools follow ISO 32000 rules. Your fonts, lines, and layout stay sharp and clean on any device.</li>
              <li><strong>Finance Math:</strong> Every calculator uses proven math formulas. We test our loan, interest, and tax math against standard banking rules.</li>
              <li><strong>Media Processing:</strong> Audio and video tools run locally using modern browser WebAssembly. Your media transforms fast without network lag.</li>
            </ul>
          </section>

          <section>
            <h2>Editorial Integrity &amp; Quality Guidelines</h2>
            <p>
              We write our guides to give you clear, honest, and practical help. We never use fake filler text or spammy marketing content.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 not-prose">
              <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Technical Precision</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Our team reviews every guide and tutorial. We make sure all code, steps, and tips are tested and safe for you to use.
                </p>
              </div>
              <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Regular Updates</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  We review our tools and math formulas often. When browser standards or tax rules change, we update our tools to match.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2>Get in Touch &amp; Feedback</h2>
            <p>
              We love hearing from you! If you find a bug, have an idea for a new tool, or need help with a formula, let us know.
            </p>
            <p>
              Contact our team through our <Link href="/contact" style={{ color: "var(--teal)" }}>Contact Page</Link> or send an email to <a href="mailto:beyourtools@gmail.com" style={{ color: "var(--teal)" }}>beyourtools@gmail.com</a>. We review feedback daily and update tools quickly.
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
