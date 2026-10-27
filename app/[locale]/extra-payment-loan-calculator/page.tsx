import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import ExtraPaymentClient from "./ExtraPaymentClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Extra Payment Loan Calculator - Interest Saved & Years Saved | BeYourTools",
  description: "See how much interest and time you save with extra monthly payments or a lump-sum payment, compared side by side with your original schedule.",
  keywords: "extra payment loan calculator, overpayment calculator, pay off loan early, interest savings, lump sum loan payment, biweekly mortgage payment",
  path: "/extra-payment-loan-calculator",
});

export default function ExtraPaymentPage() {
  return (
    <FinanceToolPage
      slug="extra-payment-loan-calculator"
      title="Extra Payment Loan Calculator"
      cluster="Loans"
      tagline="See exactly how much interest you save and how many months you cut off your loan by adding extra monthly payments or a one-time lump sum, with the original and accelerated schedules shown side by side."
      description="Free extra payment loan calculator. Enter loan details and extra payment amounts to compare total interest and payoff time with and without the extra payments. Always tell your lender to apply extra payments to principal, and check your next statement."
      formulaExplanation={
        <>
          <p>Each month, interest accrues on the remaining balance. Any extra payment reduces principal directly, so less interest accrues in every subsequent month, the savings compound over time.</p>
          <p className="mt-1"><strong style={{ color: "var(--text-secondary)" }}>Interest Reduction</strong> = (Interest without extra payments) − (Interest with extra payments)</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $300,000 at 6.5% over 30 years. Base payment = $1,896/mo · Total interest = $382,633<br />
            Adding $200/month extra → paid off in 23y 1m · Total interest = $279,185 → <strong>Save $103,449 and 6 years 11 months</strong>
          </p>
        </>
      }
      faqs={[
        { question: "Does making extra payments reduce my required monthly payment?", answer: "No, with most standard loans, extra payments reduce principal and shorten the term, but your required monthly payment stays the same. Some lenders let you recast the loan to lower payments, but that requires a formal request." },
        { question: "When is the best time to make a lump-sum payment?", answer: "Earlier is always better, the earlier you reduce principal, the more interest accrues on a smaller balance for longer. A $10,000 lump sum in month 1 saves far more interest than the same payment in year 20." },
        { question: "Will my lender apply extra payments to principal?", answer: "Most do, but verify. Some lenders apply extra funds to future scheduled payments first (prepaid interest), which doesn't reduce principal. Specify 'apply to principal' when making the payment and check your next statement." },
        { question: "What if I can only afford a small extra amount?", answer: "Even $50–100 extra per month makes a meaningful difference over a long loan term. On a 30-year mortgage, $100/month extra typically saves 4–5 years and tens of thousands in interest." },
        { question: "Is it better to pay extra on the mortgage or invest the money?", answer: "It depends on the loan rate vs. expected investment returns. If your mortgage is 7% and your investment return expectation is 7%, they're roughly equivalent on a risk-adjusted basis. Higher-rate debt (credit cards at 20%+) should almost always be paid first." },
        { question: "How does paying biweekly instead of monthly help?", answer: "Paying half the monthly amount every two weeks gives 26 half-payments a year, which is 13 full payments instead of 12. That one extra payment a year, applied to principal, typically cuts 4 to 5 years off a 30-year mortgage and saves tens of thousands in interest. The effect is the same as adding one extra monthly payment per year." },
        { question: "Is $50 a month extra really worth it?", answer: "Yes, on a long loan it adds up. On a $300,000 loan at 6.5% over 30 years, $50 extra a month pays the loan off in 334 months instead of 360, saving $33,582 in interest. Small, steady extras beat waiting for a large lump sum you may never have." },
        { question: "Extra monthly payments or one lump sum: which saves more?", answer: "It depends on size and timing. On the same $300,000 loan at 6.5% over 30 years, $200 extra a month saves $103,449 in interest, while a single $20,000 lump sum in month 1 saves $97,969. The steady $200 a month wins here, because it keeps cutting principal every month for years. Run your own numbers before choosing." },
      ]}
    >
      <ExtraPaymentClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "extra-payment-loan-calculator", __enMetadata);
}
