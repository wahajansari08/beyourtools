import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import NetProfitClient from "./NetProfitClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Net Profit Calculator: Net Income, Profit & Margin | BeYourTools",
  description: "Free net profit calculator. Find net profit and net margin after COGS, operating expenses, interest, and taxes, with the full profit waterfall explained.",
  keywords: "net profit calculator, net income calculator, net margin, bottom line, profit after tax, net profit formula, profit waterfall",
  path: "/net-profit-calculator",
});

export default function NetProfitPage() {
  return (
    <FinanceToolPage
      slug="net-profit-calculator"
      title="Net Profit Calculator"
      cluster="Business Finance"
      tagline="Calculate your true bottom-line net profit, and gross and operating profit along the way, by deducting all costs, expenses, interest, and taxes from revenue, then read the waterfall to see where profit narrows."
      description="Free net profit calculator. Enter revenue, COGS, operating expenses, interest, and taxes to get gross profit, operating income, and net profit with margin percentages, plus a worked waterfall example."
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
        { question: "How do I read the profit waterfall?", answer: "Follow the example above step by step. Revenue $500,000 minus COGS $200,000 gives gross profit $300,000 (60% gross margin). Minus operating expenses $150,000 gives operating income $150,000 (30% operating margin). Minus interest $10,000 and tax $28,000 gives net profit $112,000 (22.4% net margin). Where the waterfall narrows most is where to focus first." },
        { question: "What tax rate should I use in the calculator?", answer: "Use your effective rate: income tax ÷ pre-tax profit. In the example, pre-tax profit is $150,000 − $10,000 = $140,000, and $28,000 ÷ $140,000 = 20%. Last year's filed return gives a realistic starting point; a statutory headline rate usually overstates what you actually pay." },
        { question: "Can net margin be high while the business is in trouble?", answer: "Yes. A one-off gain (selling an asset), delayed spending, or unpaid bills can flatter a single period. Check whether the profit repeats, whether cash actually arrived, and whether costs were pushed into the next period before treating a high net margin as health." },
      ]}
    >
      <NetProfitClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "net-profit-calculator", __enMetadata);
}
