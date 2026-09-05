import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms and Conditions - BeYourTools",
  description: "Read the Terms and Conditions for using BeYourTools. Understand your rights and responsibilities when using our free online tools.",
  alternates: { canonical: `${SITE.url}/terms` },
  openGraph: {
    title: "Terms and Conditions - BeYourTools",
    description: "Read the Terms and Conditions for using BeYourTools. Understand your rights and responsibilities when using our free online tools.",
    url: `${SITE.url}/terms`,
    type: "website",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "BeYourTools Terms and Conditions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions - BeYourTools",
    description: "Read the Terms and Conditions for using BeYourTools. Understand your rights and responsibilities when using our free online tools.",
    images: [`${SITE.url}/og-default.png`],
  },
  robots: { index: true, follow: true },
};

const EFFECTIVE = "August 1, 2026";

export default function TermsPage() {
  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "Terms and Conditions", url: `${SITE.url}/terms` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
        <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>Terms and Conditions</span>
      </nav>

      <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>Terms and Conditions</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Effective date: {EFFECTIVE}</p>

      <div className="policy-content mt-8 space-y-8">

        <section>
          <h2>1. Agreement to Terms</h2>
          <p>By accessing or using BeYourTools (&quot;Site&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) at <strong>{SITE.url}</strong>, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Site.</p>
        </section>

        <section>
          <h2>2. Use of the Site</h2>
          <p>BeYourTools provides free, browser-based tools for developers and designers including JSON utilities, image converters, and PDF tools. You may use the Site for lawful purposes only. You agree not to:</p>
          <ul>
            <li>Use the Site for any illegal or unauthorised purpose</li>
            <li>Attempt to disrupt, overload, or interfere with the Site&apos;s infrastructure</li>
            <li>Scrape or systematically extract data from the Site</li>
            <li>Misrepresent your identity or affiliation</li>
            <li>Upload malicious files or code</li>
          </ul>
        </section>

        <section>
          <h2>3. Intellectual Property</h2>
          <p>All content on BeYourTools - including text, code, design, logos, and blog articles - is owned by or licensed to BeYourTools and is protected by applicable copyright and intellectual property laws.</p>
          <p>You may not reproduce, distribute, or create derivative works from Site content without prior written permission, except for fair-use quotation with attribution.</p>
        </section>

        <section>
          <h2>4. No Warranties</h2>
          <p>BeYourTools is provided <strong>&quot;as is&quot;</strong> and <strong>&quot;as available&quot;</strong> without any warranties, express or implied. We do not warrant that:</p>
          <ul>
            <li>The tools will always be available, error-free, or produce accurate results</li>
            <li>Any files processed will be free from loss or corruption</li>
            <li>The Site will meet your specific requirements</li>
          </ul>
          <p>You use the Site entirely at your own risk. Always keep backups of important files before processing them.</p>
        </section>

        <section>
          <h2>5. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, BeYourTools and its team shall not be liable for any indirect, incidental, special, consequential, or punitive damages - including loss of data, profits, or business - arising from your use of the Site, even if we have been advised of the possibility of such damages.</p>
          <p>Our total liability for any claim arising from your use of the Site shall not exceed zero dollars (USD $0), reflecting that the Site is provided entirely free of charge.</p>
        </section>

        <section>
          <h2>6. Privacy</h2>
          <p>Your privacy is important to us. All tool processing on BeYourTools happens client-side in your browser - files and text are never uploaded to our servers. Please review our <Link href="/privacy-policy" style={{ color: "var(--teal)" }}>Privacy Policy</Link> and <Link href="/cookie-policy" style={{ color: "var(--teal)" }}>Cookie Policy</Link> for full details on data handling.</p>
        </section>

        <section>
          <h2>7. Third-Party Services</h2>
          <p>The Site may use third-party services including analytics (usage statistics) and advertising networks. These services operate under their own privacy policies and may use cookies. See our <Link href="/cookie-policy" style={{ color: "var(--teal)" }}>Cookie Policy</Link> for details.</p>
        </section>

        <section>
          <h2>8. Advertising</h2>
          <p>BeYourTools displays advertisements provided by third-party advertising partners. These ads help keep the Site free. Advertisers are responsible for their own content. We do not endorse any advertised product or service.</p>
          <p>Third-party vendors use cookies to serve ads based on prior visits to this and other websites. You may opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>Ad Settings</a> or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>AboutAds.info</a>.</p>
        </section>

        <section>
          <h2>9. External Links</h2>
          <p>The Site contains links to third-party websites. These links are provided for convenience only. We have no control over third-party content and accept no responsibility for it. Visiting external links is at your own risk.</p>
        </section>

        <section>
          <h2>10. Changes to These Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Changes will be effective upon posting. Continued use of the Site after changes constitutes acceptance of the revised Terms. We encourage you to review this page periodically.</p>
        </section>

        <section>
          <h2>11. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with applicable law. Any disputes shall be resolved in the appropriate courts of competent jurisdiction.</p>
        </section>

        <section>
          <h2>12. Contact</h2>
          <p>If you have any questions about these Terms, please <Link href="/contact" style={{ color: "var(--teal)" }}>contact us</Link>.</p>
        </section>

      </div>
    </div>
    </>
  );
}
