import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import LoanInterestClient from "./LoanInterestClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Loan Interest Calculator - Total Interest Paid | BeYourTools",
  description: "Find out the total interest you will pay over the life of any loan, plus the monthly payment and interest as a share of the loan. Free in your browser.",
  keywords: "loan interest calculator, total interest paid, loan cost calculator, interest on loan, how much interest on a loan, mortgage interest total",
  path: "/loan-interest-calculator",
});

export default function LoanInterestPage() {
  return (
    <FinanceToolPage
      slug="loan-interest-calculator"
      title="Loan Interest Calculator"
      cluster="Loans"
      tagline="Find out exactly how much interest you'll pay over the life of any loan, and what percentage of your total repayment goes to the lender, so the true cost is visible before you sign."
      description="Free loan interest calculator. Enter principal, annual rate, and term to calculate total interest paid, monthly payment, total repayment, and interest-to-principal ratio. It also shows how a lower rate or a shorter term changes the total."
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
        { question: "Does a shorter loan term reduce interest?", answer: "Yes, both by paying less total interest and often by qualifying for a lower rate. A 15-year mortgage at 6.5% on $300,000 costs $170,398 in interest, versus $382,633 for a 30-year term at the same rate, a saving of $212,235. The monthly payment is higher, but the total cost is far lower." },
        { question: "Can I reduce interest by making extra payments?", answer: "Yes. Even one extra monthly payment per year (13 instead of 12) on a 30-year mortgage can cut the term by 4–5 years and save tens of thousands in interest. Use the Extra Payment Loan Calculator to model this." },
        { question: "Why does a mortgage end up costing nearly double the purchase price?", answer: "On a 30-year loan, total interest often equals or exceeds the principal. A $300,000 loan at 7% costs $418,527 in interest alone. This is why 15-year mortgages and extra payments are so powerful, they dramatically reduce this compounding cost." },
        { question: "Is credit card interest calculated the same way?", answer: "No, credit cards use daily periodic rate (APR ÷ 365) on the average daily balance and compound monthly. They're revolving, not amortizing. The Credit Card Payoff Calculator handles this correctly." },
        { question: "How much of my first year goes to principal?", answer: "Less than you expect. On a $300,000 loan at 6.5% over 30 years, only about $3,825 of the first year's payments reduces principal; the rest is interest. That is why early extra payments are so powerful: they cut principal when the balance, and therefore the interest, is at its highest." },
        { question: "What does total interest as a percentage of the loan mean?", answer: "It puts the cost in proportion. A $300,000 loan at 6% over 30 years costs $347,515 in interest, which is about 116% of the amount borrowed: you repay more than twice what you borrowed. Shorter terms and lower rates bring that percentage down sharply." },
        { question: "Why is the interest share highest in the first years?", answer: "Each payment's interest portion is the remaining balance times the monthly rate, and the balance is largest at the start. On a $200,000 loan at 7%, the first payment is $1,166.67 interest and only $163.93 principal. As the balance falls, the split flips." },
      ]}
    >
      <LoanInterestClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "loan-interest-calculator", __enMetadata);
}
