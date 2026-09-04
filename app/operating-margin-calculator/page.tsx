import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import OperatingMarginClient from "./OperatingMarginClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Operating Margin Calculator - EBIT Margin % | BeYourTools",
  description:
    "Calculate operating margin (EBIT margin) from revenue, COGS, and operating expenses. See your operating income in dollars and as a percentage of revenue.",
  keywords: "operating margin calculator, EBIT margin, operating income, operating profit margin, EBIT calculator",
  alternates: { canonical: `${SITE.url}/operating-margin-calculator` },
  robots: { index: true, follow: true },
};

export default function OperatingMarginPage() {
  return (
    <FinanceToolPage
      slug="operating-margin-calculator"
      title="Operating Margin Calculator"
      cluster="Business Finance"
      tagline="Calculate operating income (EBIT) and operating margin percentage from revenue, COGS, and operating expenses, before interest and taxes."
      description="Free operating margin calculator. Enter revenue, COGS, and operating expenses to calculate EBIT (operating income) and operating margin as a percentage of revenue."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Operating Income (EBIT)</strong> = Revenue − COGS − Operating Expenses</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Operating Margin %</strong> = (Operating Income ÷ Revenue) × 100</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            EBIT = Earnings Before Interest and Taxes. It excludes financing costs (interest) and tax effects, making it useful for comparing operational efficiency across companies with different capital structures.
          </p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Revenue $500k · COGS $200k · OpEx $150k → EBIT = $150k · Operating Margin = <strong>30%</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What is operating margin?", answer: "Operating margin measures how much profit a company makes from its core operations per dollar of revenue, before accounting for interest payments and taxes. It's calculated as EBIT ÷ Revenue." },
        { question: "Why is operating margin useful?", answer: "Because it strips out financing decisions (debt level) and tax jurisdiction effects, it's the best metric for comparing operational efficiency between companies or over time." },
        { question: "What is a good operating margin?", answer: "Highly variable by industry. Software: 20–35%. Manufacturing: 10–20%. Retail: 3–8%. Airlines: 3–6%. A margin improving year-over-year is generally more important than hitting a specific number." },
        { question: "What is the difference between operating margin and EBITDA margin?", answer: "Operating margin uses EBIT (includes depreciation and amortisation). EBITDA margin adds back D&A, making it a closer approximation of cash operating earnings. EBITDA is higher than EBIT for asset-heavy businesses." },
        { question: "How do I improve operating margin?", answer: "Reduce COGS through better purchasing or process efficiency, cut operating overhead (especially fixed costs), or increase revenue without proportionally increasing costs (operating leverage)." },
      ]}
    >
      <OperatingMarginClient />
    </FinanceToolPage>
  );
}
