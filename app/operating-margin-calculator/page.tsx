import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import OperatingMarginClient from "./OperatingMarginClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "Operating Margin Calculator - EBIT Margin % | BeYourTools",
  description: "Calculate operating margin (EBIT margin) from revenue, COGS, and operating expenses. See your operating income in dollars and as a percentage of revenue.",
  keywords: "operating margin calculator, EBIT margin, operating income, operating profit margin, EBIT calculator",
  path: "/operating-margin-calculator",
});

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
          <p><strong style={{ color: "var(--text-secondary)" }}>Operating Income (EBIT)</strong> = Revenue − COGS − Operating Costs</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Operating Margin %</strong> = (Operating Income ÷ Revenue) × 100</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            EBIT stands for Earnings Before Interest and Taxes. It tracks the cash you keep from your main day-to-day work. It leaves out debt fees and government taxes so you can see how well your core shop or firm performs.
          </p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> A shop makes $500,000 in sales. The cost of goods sold is $200,000. Everyday office bills come to $150,000. The operating income is $150,000 ($500,000 − $200,000 − $150,000). The operating margin is <strong>30%</strong> ($150,000 ÷ $500,000 × 100).
          </p>
          <div className="mt-3 text-xs space-y-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <p className="font-semibold" style={{ color: "var(--text-secondary)" }}>Operating Margin vs Net Margin</p>
            <p>
              Operating margin looks only at core trading costs. It shows how much profit your team generates before paying loans or taxes. Net margin takes the final step. It subtracts interest, company tax, and one-off fees to show the final money that stays in the bank.
            </p>
            <p>
              If your operating margin is high but your net margin is low, heavy debt or high tax rates may be eating into your bottom line. Tracking both metrics every month helps you fix leaks early and keep your business strong.
            </p>
          </div>
        </>
      }
      faqs={[
        { question: "What is operating margin?", answer: "Operating margin shows the percentage of profit a company keeps from sales after paying everyday running costs. It is calculated by dividing operating income (EBIT) by total revenue." },
        { question: "Why is operating margin helpful?", answer: "It reveals how well a company controls its daily production and office costs. Because it leaves out debt and local taxes, it lets you compare different businesses fairly." },
        { question: "What is a healthy operating margin?", answer: "Healthy margins vary by industry. Software firms often see 20% to 35%. Factories usually see 10% to 20%. Retail shops often run on 3% to 8%. Steady yearly growth is the best sign of success." },
        { question: "How does operating margin differ from EBITDA margin?", answer: "Operating margin uses EBIT, which includes equipment wear and tear over time. EBITDA adds back those non-cash costs to show raw cash flow. As a result, EBITDA margin is usually higher." },
        { question: "How can a business raise its operating margin?", answer: "You can raise your margin by cutting supply costs, lowering overhead expenses, or selling more units without adding new fixed bills. Raising prices also lifts margins immediately." },
        { question: "How often should I check my operating margin?", answer: "Most business owners review their operating margin every month and at the end of each fiscal quarter. Doing so lets you spot rising supply costs or higher rent before they hurt your cash flow." },
      ]}
    >
      <OperatingMarginClient />
    </FinanceToolPage>
  );
}
