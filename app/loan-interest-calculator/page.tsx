import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import LoanInterestClient from "./LoanInterestClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "Loan Interest Calculator - Total Interest Paid on Any Loan | BeYourTools",
  description: "Find out the total interest you'll pay over the life of any loan. Enter principal, interest rate, and term to see total interest, monthly payment, and interest as a percentage of the loan.",
  keywords: "loan interest calculator, total interest paid, loan cost calculator, interest on loan, how much interest on a loan",
  path: "/loan-interest-calculator",
});

export default function LoanInterestPage() {
  return (
    <FinanceToolPage
      slug="loan-interest-calculator"
      title="Loan Interest Calculator"
      cluster="Loans"
      tagline="Find out exactly how much interest you'll pay over the life of any loan, and what percentage of your total repayment goes to the lender."
      description="Free loan interest calculator. Enter principal, annual rate, and term to calculate total interest paid, monthly payment, total repayment, and interest-to-principal ratio."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Monthly Payment</strong> = P × r(1+r)ⁿ ÷ [(1+r)ⁿ − 1]</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Total Paid</strong> = Monthly Payment × n (total months)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Total Interest</strong> = Total Paid − Principal</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $200,000 mortgage at 7% over 30 years → Monthly = $1,331 → Total paid = $479,017 → <strong>Total interest = $279,017</strong> (139% of the original loan)
          </p>
        </>
      }
      faqs={[
        { question: "How does interest rate affect total interest paid?", answer: "Dramatically. A $300,000 mortgage at 6% over 30 years costs $347,515 in interest. At 7% it costs $418,527, an extra $71,012 for just a 1% rate increase. Always shop for the lowest rate you qualify for." },
        { question: "Does a shorter loan term reduce interest?", answer: "Yes, both by paying less total interest and by receiving a lower rate (shorter-term loans typically carry lower rates). A 15-year mortgage at 6.5% on $300,000 costs $176,000 in interest vs. $347,000 for a 30-year term, saving $171,000." },
        { question: "Can I reduce interest by making extra payments?", answer: "Yes. Even one extra monthly payment per year (13 instead of 12) on a 30-year mortgage can cut the term by 4–5 years and save tens of thousands in interest. Use the Extra Payment Loan Calculator to model this." },
        { question: "Why does a mortgage end up costing nearly double the purchase price?", answer: "On a 30-year loan, total interest often equals or exceeds the principal. A $300,000 loan at 7% costs $418,527 in interest alone. This is why 15-year mortgages and extra payments are so powerful, they dramatically reduce this compounding cost." },
        { question: "Is credit card interest calculated the same way?", answer: "No, credit cards use daily periodic rate (APR ÷ 365) on the average daily balance and compound monthly. They're revolving, not amortizing. The Credit Card Payoff Calculator handles this correctly." },
      ]}
    >
      <LoanInterestClient />
    </FinanceToolPage>
  );
}
