import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Disclaimer - BeYourTools",
  description: "BeYourTools disclaimer. Information about limitations of our tools and accuracy of content.",
  alternates: { canonical: `${SITE.url}/disclaimer` },
  openGraph: {
    title: "Disclaimer - BeYourTools",
    description: "BeYourTools disclaimer. Information about limitations of our tools and accuracy of content.",
    url: `${SITE.url}/disclaimer`,
    type: "website",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "BeYourTools Disclaimer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer - BeYourTools",
    description: "BeYourTools disclaimer. Information about limitations of our tools and accuracy of content.",
    images: [`${SITE.url}/og-default.png`],
  },
  robots: { index: true, follow: true },
};

const EFFECTIVE = "August 1, 2026";

export default function DisclaimerPage() {
  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "Disclaimer", url: `${SITE.url}/disclaimer` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
        <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>Disclaimer</span>
      </nav>

      <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>Disclaimer</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Last updated: {EFFECTIVE}</p>

      <div className="policy-content mt-8 space-y-8">

        <section>
          <h2>Website Disclaimer</h2>
          <p>The information and tools provided on BeYourTools (<strong>{SITE.url}</strong>) are for general informational and productivity purposes only. While we strive to keep our tools accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the tools or their output.</p>
        </section>

        <section>
          <h2>Tool Output Accuracy</h2>
          <p>Our tools perform technical operations (JSON formatting, image conversion, PDF manipulation) using well-established browser APIs and open-source libraries. However:</p>
          <ul>
            <li>Results should always be verified before use in production systems</li>
            <li>Token count estimates are approximations, not exact tokenizer counts</li>
            <li>Image quality after conversion depends on input quality and format limitations</li>
            <li>PDF text extraction may be incomplete for scanned or complex PDFs</li>
            <li>SQL, TypeScript, and Python code generation produces a starting point that may require manual refinement</li>
          </ul>
        </section>

        <section>
          <h2>No Professional Advice</h2>
          <p>Content on BeYourTools, including blog articles, does not constitute professional legal, financial, security, or technical advice. Blog posts are educational and informational only. For security-critical implementations, consult a qualified professional.</p>
        </section>

        <section>
          <h2>Financial, Loan, Tax &amp; Calculation Tools Disclaimer</h2>
          <p>
            BeYourTools provides specialized financial calculators covering loans, mortgages, APR, debt payoff strategies, profit margins, and investment returns. 
            <strong>Please review the following essential terms regarding all calculation tools:</strong>
          </p>
          <ul>
            <li><strong>Educational &amp; Illustrative Only:</strong> All calculators and generated outputs are intended solely for general personal budgeting, educational evaluation, and theoretical modeling. BeYourTools is not a licensed financial advisor, Certified Financial Planner (CFP), mortgage broker, commercial lender, or Certified Public Accountant (CPA).</li>
            <li><strong>Mathematical Approximations:</strong> Calculations utilize standard mathematical algorithms (such as compound interest formulas, Newton-Raphson iterative approximations for APR, and amortized repayment schedules). Results reflect theoretical values based strictly on user-submitted inputs.</li>
            <li><strong>Institutional Discretion:</strong> Actual interest rates, loan terms, origination fees, closing costs, and tax liabilities depend upon lender underwriting standards, personal credit history, and regional statutory regulations.</li>
            <li><strong>No Fiduciary Duty:</strong> Accessing or relying upon outputs from our calculators does not establish any client-advisor, broker, or fiduciary relationship between you and BeYourTools.</li>
            <li><strong>Professional Consultation Recommended:</strong> Do not execute binding loans, real estate purchases, or commercial debt consolidations without consulting an independent certified financial planner, accountant, or licensed lending officer.</li>
          </ul>
        </section>

        <section>
          <h2>File Safety</h2>
          <p>Although BeYourTools processes files locally in your browser and does not upload them to servers, you should always maintain independent backups of important files before processing them with any tool. We accept no liability for file loss or corruption.</p>
        </section>

        <section>
          <h2>Advertising Disclaimer</h2>
          <p>BeYourTools is supported by advertising. Advertisements displayed on this Site are provided by third-party advertising partners. We do not endorse any advertised product, service, or organisation. Advertisers are solely responsible for the accuracy of their advertisements.</p>
        </section>

        <section>
          <h2>Affiliate Links</h2>
          <p>Occasionally, blog posts or tool pages may contain affiliate or referral links to third-party products or services. These will be clearly disclosed. We only recommend tools we genuinely find useful. Affiliate relationships do not influence our editorial content.</p>
        </section>

        <section>
          <h2>External Links</h2>
          <p>BeYourTools contains links to third-party websites. These are provided for convenience only. We have no control over the content, privacy practices, or availability of external sites and accept no responsibility for them.</p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>We may update this Disclaimer at any time. Continued use of the Site after updates constitutes acceptance of the revised Disclaimer.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Questions about this Disclaimer? <Link href="/contact" style={{ color: "var(--teal)" }}>Contact us</Link>.</p>
        </section>

      </div>
    </div>
    </>
  );
}
