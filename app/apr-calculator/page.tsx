import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import AprClient from "./AprClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "APR Calculator — True Annual Percentage Rate Including Fees | BeYourTools",
  description:
    "Calculate the true APR of a loan including origination fees, points, and closing costs. Compare loans accurately by their real annual cost. Free, browser-based.",
  keywords: "APR calculator, annual percentage rate, loan APR, true cost of loan, mortgage APR, origination fee APR",
  alternates: { canonical: `${SITE.url}/apr-calculator` },
  robots: { index: true, follow: true },
};

export default function AprPage() {
  return (
    <FinanceToolPage
      slug="apr-calculator"
      title="APR Calculator"
      cluster="Savings & Interest"
      tagline="Calculate the true Annual Percentage Rate (APR) of any loan including all fees — the only accurate way to compare loan offers from different lenders."
      description="Free APR calculator. Enter loan amount, stated interest rate, loan term, and upfront fees to calculate the true APR that reflects the real annual cost of borrowing."
      formulaExplanation={
        <>
          <p>APR is the rate that equates the net loan proceeds (after fees) to the present value of all payments:</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Loan Amount − Fees</strong> = Monthly Payment × [1 − (1+r_APR/12)^(−n)] ÷ (r_APR/12)</p>
          <p>This equation is solved numerically (Newton-Raphson) for r_APR, then annualised: <strong style={{ color: "var(--text-secondary)" }}>APR = r_APR × 12</strong></p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $30,000 loan at 6.5% for 5 years with $900 in fees<br />
            Monthly payment = $587 · Effective APR ≈ <strong>7.03%</strong> (vs 6.5% stated rate)
          </p>
        </>
      }
      faqs={[
        { question: "Why is APR higher than the stated interest rate?", answer: "APR includes the interest rate plus all upfront fees, spread across the loan term. Fees reduce the effective loan proceeds but don't reduce your payments — the same payments on a smaller net amount imply a higher true rate." },
        { question: "What fees are included in APR?", answer: "Typically: origination fees, discount points, mortgage broker fees, closing costs paid to the lender. Not always included: appraisal fees, title insurance, prepaid insurance/taxes. Regulations vary by loan type — always ask your lender for the APR disclosure." },
        { question: "How do I use APR to compare two loan offers?", answer: "Compare APRs directly. Loan A at 6.5% with $1,500 in fees may have a higher APR than Loan B at 6.75% with no fees — especially on a short term. APR levels the playing field by expressing the total cost as a single annual rate." },
        { question: "Does APR assume I hold the loan to full term?", answer: "Yes — APR calculations spread fees across the entire loan term. If you refinance or pay off early, the actual cost is higher because you paid fees for a shorter period. For loans you may pay off early, also calculate the cost at your expected actual term." },
        { question: "Is a lower APR always better?", answer: "Usually yes — but consider the cash flow. A loan with a slightly higher APR but lower monthly payments may suit you if cash flow is tight. Also compare total cost: a lower-rate loan with a longer term can cost more total interest than a higher-rate shorter-term loan." },
      ]}
    >
      <AprClient />
    </FinanceToolPage>
  );
}
