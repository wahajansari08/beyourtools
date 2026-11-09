import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import CashFlowClient from "./CashFlowClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Cash Flow Calculator - Operating & Financing | BeYourTools",
  description: "Calculate net cash flow from operating, investing, and financing activities. Get an instant cash flow summary in your browser.",
  keywords: "cash flow calculator, net cash flow, operating cash flow, investing cash flow, financing cash flow, business cash flow",
  path: "/cash-flow-calculator",
});

export default function CashFlowPage() {
  return (
    <FinanceToolPage
      slug="cash-flow-calculator"
      title="Cash Flow Calculator"
      cluster="Marketing & ROI"
      tagline="Enter operating, investing, and financing line items to calculate net cash flow, the true measure of whether a business is generating or consuming cash."
      description="Free cash flow calculator. Enter line items across operating, investing, and financing activities to calculate net cash flow with a clear three-section summary."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Net Cash Flow</strong> = Operating CF + Investing CF + Financing CF</p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
            <strong>Operating CF:</strong> Cash from core business, net income, depreciation (add back), working capital changes.<br />
            <strong>Investing CF:</strong> Usually negative, capital expenditure, acquisitions, asset purchases (outflows) and asset sales (inflows).<br />
            <strong>Financing CF:</strong> Debt repayment, dividend payments (outflows) and new borrowing, equity issuance (inflows).
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            A positive net cash flow means more cash came in than went out. A healthy business typically has strong positive operating CF funding negative investing CF (growth capex).
          </p>
        </>
      }
      faqs={[
        { question: "Why is cash flow different from profit?", answer: "Profit is an accounting measure that includes non-cash items (depreciation, accruals) and timing differences (revenue recognised before cash is received). Cash flow shows actual cash movement. A profitable company can be cash-flow negative if it's growing fast or has poor receivables." },
        { question: "What is free cash flow?", answer: "Free Cash Flow (FCF) = Operating Cash Flow − Capital Expenditure. It's the cash available after maintaining and growing the asset base, what's available for debt repayment, dividends, buybacks, or reinvestment. FCF is often considered the best measure of business health." },
        { question: "Why is depreciation added back in operating cash flow?", answer: "Depreciation reduces accounting profit but isn't a cash outflow, the cash left the business when the asset was purchased. Adding it back to net income converts accrual profit to cash profit." },
        { question: "What does negative operating cash flow mean?", answer: "The core business is consuming more cash than it generates. For a startup or rapidly growing business, this may be acceptable short-term. For a mature business, sustained negative operating cash flow signals a serious problem." },
        { question: "What is a cash flow statement?", answer: "A formal financial statement (one of the 'Big Three' alongside the income statement and balance sheet) that classifies all cash movements into operating, investing, and financing activities over a period, reconciling net income to the change in cash balance." },
        { question: "How do I calculate my closing cash balance?", answer: "Closing balance = Opening balance + Net cash flow. Take a month with $7,000 operating cash flow ($42,000 of customer receipts minus $35,000 of rent, payroll, and supplies), minus $12,000 investing cash flow for an equipment purchase, plus $8,500 financing cash flow ($10,000 bank loan received minus a $1,500 repayment). Net cash flow is 7,000 - 12,000 + 8,500 = $3,500, so an opening balance of $15,000 closes at $18,500. This calculator gives you the net figure; add it to your opening balance yourself." },
        { question: "How many months of cash runway do I have?", answer: "Runway = Cash balance / Monthly net cash burn. A $120,000 cash balance with $15,000 of net burn a month lasts 8 months, and $90,000 at $12,000 a month lasts 7.5 months. Runway assumes burn stays flat, so recheck it whenever spending or revenue changes." },
        { question: "What is the indirect method of calculating operating cash flow?", answer: "Start from net income, add back non-cash expenses, then adjust for working capital changes. For example, $200,000 net income plus $50,000 depreciation plus $5,000 amortisation minus a $17,000 working capital change gives $238,000 operating cash flow. With investing cash flow of minus $60,000 and financing cash flow of $0, the net change in cash is $178,000, and free cash flow is 238,000 - 80,000 capital expenditure = $158,000." },
      ]}
    >
      <CashFlowClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "cash-flow-calculator", __enMetadata);
}
