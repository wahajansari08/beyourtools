import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import ExtraPaymentClient from "./ExtraPaymentClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Extra Payment Loan Calculator — Interest Saved by Paying Extra | BeYourTools",
  description:
    "See how much interest and time you save by making extra monthly payments or a lump-sum payment on your loan. Side-by-side comparison with and without extra payments.",
  keywords: "extra payment loan calculator, overpayment calculator, pay off loan early, interest savings, lump sum loan payment",
  alternates: { canonical: `${SITE.url}/extra-payment-loan-calculator` },
  robots: { index: true, follow: true },
};

export default function ExtraPaymentPage() {
  return (
    <FinanceToolPage
      slug="extra-payment-loan-calculator"
      title="Extra Payment Loan Calculator"
      cluster="Loans"
      tagline="See exactly how much interest you save and how many months you cut off your loan by adding extra monthly payments or a one-time lump sum."
      description="Free extra payment loan calculator. Enter loan details and extra payment amounts to compare total interest and payoff time with and without the extra payments."
      formulaExplanation={
        <>
          <p>Each month, interest accrues on the remaining balance. Any extra payment reduces principal directly, so less interest accrues in every subsequent month — the savings compound over time.</p>
          <p className="mt-1"><strong style={{ color: "var(--text-secondary)" }}>Interest Reduction</strong> = (Interest without extra payments) − (Interest with extra payments)</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $300,000 at 6.5% over 30 years. Base payment = $1,896/mo · Total interest = $382,633<br />
            Adding $200/month extra → paid off in 24y 5m · Total interest = $294,878 → <strong>Save $87,755 and 5.5 years</strong>
          </p>
        </>
      }
      faqs={[
        { question: "Does making extra payments reduce my required monthly payment?", answer: "No — with most standard loans, extra payments reduce principal and shorten the term, but your required monthly payment stays the same. Some lenders let you recast the loan to lower payments, but that requires a formal request." },
        { question: "When is the best time to make a lump-sum payment?", answer: "Earlier is always better — the earlier you reduce principal, the more interest accrues on a smaller balance for longer. A $10,000 lump sum in month 1 saves far more interest than the same payment in year 20." },
        { question: "Will my lender apply extra payments to principal?", answer: "Most do — but verify. Some lenders apply extra funds to future scheduled payments first (prepaid interest), which doesn't reduce principal. Specify 'apply to principal' when making the payment and check your next statement." },
        { question: "What if I can only afford a small extra amount?", answer: "Even $50–100 extra per month makes a meaningful difference over a long loan term. On a 30-year mortgage, $100/month extra typically saves 4–5 years and tens of thousands in interest." },
        { question: "Is it better to pay extra on the mortgage or invest the money?", answer: "It depends on the loan rate vs. expected investment returns. If your mortgage is 7% and your investment return expectation is 7%, they're roughly equivalent on a risk-adjusted basis. Higher-rate debt (credit cards at 20%+) should almost always be paid first." },
      ]}
    >
      <ExtraPaymentClient />
    </FinanceToolPage>
  );
}
