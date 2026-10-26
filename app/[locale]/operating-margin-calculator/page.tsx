import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import OperatingMarginClient from "./OperatingMarginClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Operating Margin Calculator: EBIT Margin & Operating Income | BeYourTools",
  description: "Free operating margin calculator. Find operating income (EBIT) and operating margin percentage from revenue, COGS, and operating expenses, before interest and taxes.",
  keywords: "operating margin calculator, EBIT margin, operating income, operating profit margin, EBIT calculator, return on sales",
  path: "/operating-margin-calculator",
});

export default function OperatingMarginPage() {
  return (
    <FinanceToolPage
      slug="operating-margin-calculator"
      title="Operating Margin Calculator"
      cluster="Business Finance"
      tagline="Calculate operating income (EBIT) and operating margin percentage from revenue, COGS, and operating expenses, before interest and taxes, and see why lenders and investors watch this margin first."
      description="Free operating margin calculator. Enter revenue, COGS, and operating expenses to calculate EBIT (operating income) and operating margin as a percentage of revenue, with a worked example and a comparison against net margin."
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
        { question: "Is operating margin the same as EBIT margin?", answer: "Yes. EBIT is the dollar figure (revenue minus COGS minus operating expenses); operating margin is that figure divided by revenue. If EBIT is $150,000 on $500,000 of revenue, the EBIT margin (operating margin) is 30%. The two terms describe the same ratio." },
        { question: "Why do investors prefer operating margin over net margin for comparisons?", answer: "Operating margin strips out financing and tax differences. Two companies with identical operations can show very different net margins if one carries heavy debt or sits in a high-tax jurisdiction. Operating margin compares the core business on its own, which is what an investor or lender wants to judge first." },
        { question: "What does a falling operating margin warn about?", answer: "Costs rising faster than revenue. Take a shop at $500,000 revenue, $200,000 COGS, and $150,000 operating expenses: a 30% margin. If revenue grows to $550,000 but COGS rises to $230,000 and operating expenses to $180,000, operating income is $140,000 and margin falls to 25.5%. Revenue grew, but the business got less efficient." },
      ]}
    >
      <OperatingMarginClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "operating-margin-calculator", __enMetadata);
}
