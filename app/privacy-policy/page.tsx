import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy - BeYourTools",
  description: "BeYourTools privacy policy. All tool processing happens locally in your browser - files and data are never uploaded to our servers.",
  alternates: { canonical: `${SITE.url}/privacy-policy` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/privacy-policy`,
    title: "Privacy Policy - BeYourTools",
    description: "All tool processing happens locally in your browser. Files are never uploaded.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Privacy Policy" }],
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy - BeYourTools",
    description: "All tool processing is local. Files are never uploaded.",
    site: "@beyourtools",
  },
};

const EFFECTIVE = "August 1, 2026";

export default function PrivacyPolicyPage() {
  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "Privacy Policy", url: `${SITE.url}/privacy-policy` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
        <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>Privacy Policy</span>
      </nav>

      <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>Privacy Policy</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Effective date: {EFFECTIVE}</p>

      <div className="policy-content mt-8 space-y-8">

        <section>
          <h2>1. Overview</h2>
          <p>BeYourTools (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Policy explains what information we collect, how we use it, and your rights regarding your personal data.</p>
          <p><strong>Key fact:</strong> All tool processing (JSON, image conversion, PDF operations) happens entirely in your browser. Files, JSON data, and text you paste into tools are <strong>never transmitted to our servers</strong>.</p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>2.1 Automatically Collected Data</h3>
          <p>When you visit BeYourTools, our hosting provider and analytics tools may automatically collect:</p>
          <ul>
            <li>IP address (anonymised)</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent</li>
            <li>Referring website</li>
            <li>Device type (desktop, mobile, tablet)</li>
          </ul>
          <p>This data is collected in aggregate and cannot be used to identify you individually.</p>

          <h3>2.2 Cookies and Tracking</h3>
          <p>We use cookies for: site preferences (theme settings), analytics, and advertising. See our <Link href="/cookie-policy" style={{ color: "var(--teal)" }}>Cookie Policy</Link> for full details.</p>

          <h3>2.3 Information You Voluntarily Provide</h3>
          <p>If you contact us via email, we collect your email address and message content solely to respond to your inquiry.</p>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li><strong>Analytics:</strong> Understanding which tools are most used, improving performance and usability</li>
            <li><strong>Advertising:</strong> Displaying relevant ads through our advertising partner to fund the free service</li>
            <li><strong>Preference storage:</strong> Remembering your theme (dark/light/system) via localStorage</li>
            <li><strong>Support:</strong> Responding to contact form messages</li>
          </ul>
          <p>We do not sell, trade, or rent your personal information to third parties.</p>
        </section>

        <section>
          <h2>4. Online Advertising</h2>
          <p>We display advertisements to support the free service. Our advertising partner uses cookies to serve ads based on prior visits to our site and other websites. This enables serving of relevant ads.</p>
          <p>You may opt out of personalised advertising:</p>
          <ul>
            <li><a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>Ad Settings</a></li>
            <li><a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>Network Advertising Initiative opt-out</a></li>
          </ul>
          <p>For more information, see the <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>advertising partner&apos;s policy</a>.</p>
        </section>

        <section>
          <h2>5. Analytics</h2>
          <p>We use an analytics service to understand site usage. It uses cookies and collects anonymised usage data. IP anonymisation is enabled. You can opt out using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>analytics opt-out browser add-on</a>.</p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>Analytics data is retained for 14 months. Contact emails are retained only as long as necessary to resolve your inquiry.</p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of personal data we hold about you</li>
            <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Objection:</strong> Object to processing for direct marketing</li>
            <li><strong>Portability:</strong> Request transfer of your data</li>
            <li><strong>Opt-out (CCPA):</strong> California residents may opt out of the sale of personal information (we do not sell personal information)</li>
          </ul>
          <p>To exercise these rights, please <Link href="/contact" style={{ color: "var(--teal)" }}>contact us</Link>.</p>
        </section>

        <section>
          <h2>8. Children&apos;s Privacy</h2>
          <p>BeYourTools is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe a child has provided us personal information, please contact us immediately.</p>
        </section>

        <section>
          <h2>9. Third-Party Links</h2>
          <p>Our Site contains links to third-party websites. We are not responsible for the privacy practices of those sites. We encourage you to review their privacy policies.</p>
        </section>

        <section>
          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date. Continued use of the Site constitutes acceptance of the revised Policy.</p>
        </section>

        <section>
          <h2>11. Contact</h2>
          <p>For privacy-related questions, please <Link href="/contact" style={{ color: "var(--teal)" }}>contact us</Link>.</p>
        </section>

      </div>
    </div>
    </>
  );
}
