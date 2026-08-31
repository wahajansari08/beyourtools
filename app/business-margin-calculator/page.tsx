import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import BusinessMarginClient from "./BusinessMarginClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Business Margin Calculator — Gross, Operating & Net Margins Side-by-Side | BeYourTools",
  description:
    "Compare gross, operating, and net profit margins in one view. Enter all revenue and cost figures to get a complete profitability picture for your business.",
  keywords: "business margin calculator, gross margin, operating margin, net margin, profitability calculator, margin comparison",
  alternates: { canonical: `${SITE.url}/business-margin-calculator` },
  robots: { index: true, follow: true },
};

export default function BusinessMarginPage() {
  return (
    <FinanceToolPage
      slug="business-margin-calculator"
      title="Business Margin Calculator"
      cluster="Business Finance"
      tagline="Get a complete profitability picture — gross, operating, and net margin side-by-side — from a single set of inputs."
      description="Free business margin calculator. Enter revenue, COGS, operating expenses, interest, and taxes to compare gross, operating, and net profit margins in one unified view."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Gross Margin</strong> = (Revenue − COGS) ÷ Revenue × 100</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Operating Margin</strong> = (Revenue − COGS − Operating Expenses) ÷ Revenue × 100</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Net Margin</strong> = (Revenue − COGS − OpEx − Interest − Taxes) ÷ Revenue × 100</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            Each margin strips away one more layer of cost. Comparing all three reveals where profitability is being eroded — production costs, overhead, or financing.
          </p>
        </>
      }
      faqs={[
        { question: "Why compare all three margins together?", answer: "Looking at all three margins in one view reveals which layer is eating your profit. If gross margin is strong (60%) but operating margin is weak (8%), the problem is high overhead — not production costs." },
        { question: "Which margin is most important?", answer: "Depends on your goal. Investors typically focus on net margin (overall profitability). Operators focus on gross margin (product economics) and operating margin (management efficiency). Lenders often look at operating margin (debt service capacity)." },
        { question: "What is a good business margin?", answer: "Industry-specific. Software: gross 70–80%, operating 20–30%. Retail: gross 30–50%, operating 3–8%. Professional services: gross 50–70%, operating 15–25%. Always benchmark against your direct competitors." },
        { question: "How do I read the margin progress bars?", answer: "The bars show each margin as a proportion of revenue. Longer green bars indicate healthier profitability at that level. Bars turn red when a margin is negative — costs exceed revenue at that stage." },
        { question: "What if my operating margin is better than my gross margin?", answer: "That's mathematically impossible — operating margin can never exceed gross margin because it deducts additional costs (operating expenses) on top of COGS. If you see this, check that you haven't mixed up COGS and operating expenses." },
      ]}
    >
      <BusinessMarginClient />
    </FinanceToolPage>
  );
}
