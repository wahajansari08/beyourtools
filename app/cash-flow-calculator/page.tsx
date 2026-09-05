import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import CashFlowClient from "./CashFlowClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "Cash Flow Calculator - Net Cash Flow from Operating, Investing & Financing | BeYourTools",
  description: "Calculate net cash flow from operating, investing, and financing activities. Enter line items for each category to get a clear cash flow summary. Free, browser-based.",
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
      ]}
    >
      <CashFlowClient />
    </FinanceToolPage>
  );
}
