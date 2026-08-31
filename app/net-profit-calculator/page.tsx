import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import NetProfitClient from "./NetProfitClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Net Profit Calculator — Net Income & Net Margin % | BeYourTools",
  description:
    "Calculate net profit and net profit margin after deducting COGS, operating expenses, interest, and taxes from revenue. Includes gross and operating profit breakdown.",
  keywords: "net profit calculator, net income calculator, net margin, bottom line, profit after tax, net profit formula",
  alternates: { canonical: `${SITE.url}/net-profit-calculator` },
  robots: { index: true, follow: true },
};

export default function NetProfitPage() {
  return (
    <FinanceToolPage
      slug="net-profit-calculator"
      title="Net Profit Calculator"
      cluster="Business Finance"
      tagline="Calculate your true bottom-line net profit — and gross and operating profit along the way — by deducting all costs, expenses, interest, and taxes from revenue."
      description="Free net profit calculator. Enter revenue, COGS, operating expenses, interest, and taxes to get gross profit, operating income, and net profit with margin percentages."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Gross Profit</strong> = Revenue − COGS</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Operating Income (EBIT)</strong> = Gross Profit − Operating Expenses</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Net Profit</strong> = Operating Income − Interest & Other Expenses − Income Taxes</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Net Margin %</strong> = (Net Profit ÷ Revenue) × 100</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Revenue $500k · COGS $200k · OpEx $150k · Interest $10k · Tax $28k<br />
            Net Profit = $500k − $200k − $150k − $10k − $28k = <strong>$112,000</strong> (22.4% net margin)
          </p>
        </>
      }
      faqs={[
        { question: "What is net profit?", answer: "Net profit (also called net income or the bottom line) is what remains from revenue after deducting every expense: COGS, operating expenses, interest payments, and income taxes. It's the most complete measure of profitability." },
        { question: "What does net margin tell investors?", answer: "Net margin shows how much profit is generated per dollar of revenue after all obligations. A 15% net margin means the company earns $0.15 for every $1.00 of sales. Higher margins signal a more efficient, competitive business." },
        { question: "Why might a company have positive gross profit but negative net profit?", answer: "High operating expenses (sales team, R&D, administration), heavy debt interest, or large tax liabilities can erode gross profit into a net loss. This is common in growth-stage companies investing heavily in expansion." },
        { question: "What are operating expenses (OpEx)?", answer: "OpEx includes all costs not directly tied to production: salaries of non-production staff, rent, utilities, marketing, depreciation, and R&D. Distinguishing OpEx from COGS is important for correct margin calculations." },
        { question: "Is net profit the same as free cash flow?", answer: "No. Net profit is an accounting figure that includes non-cash items like depreciation. Free cash flow = operating cash flow minus capital expenditures. A profitable company can still have negative cash flow if it's investing heavily in assets." },
        { question: "How do I improve net profit margin?", answer: "Increase prices (raises revenue without necessarily increasing costs), reduce COGS through supplier renegotiation or process efficiency, cut operating overhead, or reduce debt to lower interest expense." },
      ]}
    >
      <NetProfitClient />
    </FinanceToolPage>
  );
}
