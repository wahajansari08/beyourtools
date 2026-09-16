import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Disclaimer & Terms of Service | BeYourTools",
  description: "BeYourTools disclaimer. Information about limitations of our tools and accuracy of content.",
  alternates: { canonical: `${SITE.url}/disclaimer` },
  openGraph: {
    title: "Disclaimer & Terms of Service | BeYourTools",
    description: "BeYourTools disclaimer. Information about limitations of our tools and accuracy of content.",
    url: `${SITE.url}/disclaimer`,
    type: "website",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "BeYourTools Disclaimer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer & Terms of Service | BeYourTools",
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
          <p>
            The tools and guides on BeYourTools (<strong>{SITE.url}</strong>) are provided for general learning and everyday tasks.
            We work hard to keep our tools accurate and fast. Even so, we cannot promise that all tool outputs will always be complete, error-free, or suited for every purpose.
          </p>
        </section>

        <section>
          <h2>Tool Output Accuracy</h2>
          <p>
            Our tools format JSON, edit PDFs, and convert images using standard browser tools and open-source code. Please keep the following points in mind:
          </p>
          <ul>
            <li>Always review outputs before using them in live systems or production databases.</li>
            <li>Token count results are helpful estimates, not exact counts from specific AI models.</li>
            <li>Image quality depends on your source file and the output format you pick.</li>
            <li>Scanned PDFs and complex layouts may not always export clean plain text.</li>
            <li>Generated code snippets give you a helpful head start, but you should review them before deployment.</li>
          </ul>
        </section>

        <section>
          <h2>No Professional Advice</h2>
          <p>
            The articles and tools on BeYourTools do not replace certified legal, financial, tax, or engineering advice.
            Our blog posts and guides are written for educational use only. For high-stakes decisions, always speak with a licensed expert.
          </p>
        </section>

        <section>
          <h2>Financial Calculator Disclaimer</h2>
          <p>
            BeYourTools offers calculators for loans, mortgages, profit margins, and debts. Please review these terms before using our financial tools:
          </p>
          <ul>
            <li><strong>Educational use only:</strong> All calculations are meant for personal planning and budgeting estimates. BeYourTools is not a bank, mortgage broker, loan officer, or certified accountant.</li>
            <li><strong>Standard math estimates:</strong> Our calculators use standard math formulas like compound interest and loan amortization schedules. Results show baseline numbers based strictly on the figures you enter.</li>
            <li><strong>Bank and lender terms:</strong> Real-world loan terms, interest rates, closing costs, and taxes vary. They depend on your credit score, local laws, and lender rules.</li>
            <li><strong>No client relationship:</strong> Using our calculators does not create an advisor, broker, or client relationship between you and BeYourTools.</li>
            <li><strong>Consult a qualified professional:</strong> Do not sign loan contracts or invest money without speaking to an independent financial planner or licensed accountant.</li>
          </ul>
        </section>

        <section>
          <h2>File Safety and Data Backups</h2>
          <p>
            All file editing takes place locally in your web browser. Your private documents are never sent to external servers. Even so, you should always keep a safe backup of your important files before editing them with any software. We are not responsible for lost or broken files.
          </p>
        </section>

        <section>
          <h2>Advertising and Third-Party Links</h2>
          <p>
            BeYourTools shows ads from third-party advertising partners to keep our tools free. We do not endorse the products or services shown in these ads. Advertisers are responsible for the claims in their advertisements.
          </p>
        </section>

        <section>
          <h2>Affiliate Disclosures</h2>
          <p>
            Some articles may include referral or affiliate links to helpful third-party software. We disclose these links clearly. We only share products that we trust and find valuable.
          </p>
        </section>

        <section>
          <h2>External Links and Services</h2>
          <p>
            Our pages may link to outside websites for your convenience. We do not control those third-party sites or their privacy practices. We encourage you to read their policies before sharing personal data.
          </p>
        </section>

        <section>
          <h2>Updates to This Disclaimer</h2>
          <p>
            We may update this page from time to time as our tools grow. By continuing to use BeYourTools, you agree to the latest terms listed on this page.
          </p>
        </section>

        <section>
          <h2>Contacting Our Team</h2>
          <p>
            If you have questions about this Disclaimer or want to report an issue, please <Link href="/contact" style={{ color: "var(--teal)" }}>contact our team</Link>.
          </p>
        </section>

      </div>
    </div>
    </>
  );
}
