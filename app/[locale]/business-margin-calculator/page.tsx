import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import BusinessMarginClient from "./BusinessMarginClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Business Margin Calculator: Gross, Operating & Net Margins Compared | BeYourTools",
  description: "Free business margin calculator. Compare gross, operating, and net profit margins side by side from one set of revenue and cost figures, with a worked waterfall.",
  keywords: "business margin calculator, gross margin, operating margin, net margin, profitability calculator, margin comparison, profit waterfall",
  path: "/business-margin-calculator",
});

export default function BusinessMarginPage() {
  return (
    <FinanceToolPage
      slug="business-margin-calculator"
      title="Business Margin Calculator"
      cluster="Business Finance"
      tagline="Get a complete profitability picture, gross, operating, and net margin side-by-side, from a single set of inputs, and read the waterfall to find exactly where profit leaks."
      description="Free business margin calculator. Enter revenue, COGS, operating expenses, interest, and taxes to compare gross, operating, and net profit margins in one unified view, with a worked example for each layer."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Gross Margin</strong> = (Revenue − COGS) ÷ Revenue × 100</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Operating Margin</strong> = (Revenue − COGS − Operating Expenses) ÷ Revenue × 100</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Net Margin</strong> = (Revenue − COGS − OpEx − Interest − Taxes) ÷ Revenue × 100</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            Each margin strips away one more layer of cost. Comparing all three reveals where profitability is being eroded, production costs, overhead, or financing.
          </p>
        </>
      }
      faqs={[
        { question: "Why compare all three margins together?", answer: "Looking at all three margins in one view reveals which layer is eating your profit. If gross margin is strong (60%) but operating margin is weak (8%), the problem is high overhead, not production costs." },
        { question: "Which margin is most important?", answer: "Depends on your goal. Investors typically focus on net margin (overall profitability). Operators focus on gross margin (product economics) and operating margin (management efficiency). Lenders often look at operating margin (debt service capacity)." },
        { question: "What is a good business margin?", answer: "Industry-specific. Software: gross 70–80%, operating 20–30%. Retail: gross 30–50%, operating 3–8%. Professional services: gross 50–70%, operating 15–25%. Always benchmark against your direct competitors." },
        { question: "How do I read the margin progress bars?", answer: "The bars show each margin as a proportion of revenue. Longer green bars indicate healthier profitability at that level. Bars turn red when a margin is negative, costs exceed revenue at that stage." },
        { question: "What if my operating margin is better than my gross margin?", answer: "That's mathematically impossible, operating margin can never exceed gross margin because it deducts additional costs (operating expenses) on top of COGS. If you see this, check that you haven't mixed up COGS and operating expenses." },
        { question: "How do I read all three margins as one story?", answer: "Walk the waterfall. On $100,000 of revenue with $60,000 COGS, $25,000 operating expenses, and $5,000 of other costs: gross profit is $40,000 (40%), operating profit is $15,000 (15%), and net profit is $10,000 (10%). The biggest drop between layers is the problem to fix: a gross-to-operating drop points at overhead, an operating-to-net drop points at interest or tax." },
        { question: "What does it mean if gross margin falls but net margin holds?", answer: "Something below the gross line improved enough to offset it: lower overhead, cheaper financing, or a lower tax bill. It is still worth investigating, because a falling gross margin means pricing or production is weakening even while the bottom line looks steady." },
        { question: "Which margin should I track every month?", answer: "All three, but watch operating margin most closely month to month: it moves with pricing, supplier costs, and overhead, and it is not distorted by tax timing or one-off financing items the way net margin can be. Review net margin quarterly, when interest and tax figures are complete." },
      ]}
    >
      <BusinessMarginClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "business-margin-calculator", __enMetadata);
}
