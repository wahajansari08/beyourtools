import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import LoanAmortizationClient from "./LoanAmortizationClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Loan Amortization Calculator - Full Month-by-Month Schedule | BeYourTools",
  description: "Generate a complete month-by-month amortization schedule for any loan. See principal, interest, and balance for every payment, find the tipping point where principal overtakes interest, and check 0% loans too.",
  keywords: "loan amortization calculator, amortization schedule, mortgage amortization, loan schedule, principal and interest breakdown, amortization table, tipping point, 0 interest loan",
  path: "/loan-amortization-calculator",
});

export default function LoanAmortizationPage() {
  return (
    <FinanceToolPage
      slug="loan-amortization-calculator"
      title="Loan Amortization Calculator"
      cluster="Loans"
      tagline="Generate a complete month-by-month amortization schedule showing payment, principal, interest, and remaining balance for every payment of your loan."
      description="Free loan amortization calculator. Enter loan amount, interest rate, and term to generate a full amortization table with monthly principal, interest, and balance breakdown."
      formulaExplanation={
        <>
          <p>Each row of the schedule is calculated as:</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Interest Portion</strong> = Remaining Balance × (Annual Rate ÷ 12)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Principal Portion</strong> = Monthly Payment − Interest Portion</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>New Balance</strong> = Previous Balance − Principal Portion</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            Because balance decreases each month, the interest portion shrinks and the principal portion grows. Early payments are mostly interest; late payments are mostly principal.
          </p>
        </>
      }
      faqs={[
        { question: "What is an amortization schedule?", answer: "A table showing every payment of a loan, broken down into how much goes to interest and how much to principal, plus the remaining balance after each payment. It reveals the true cost of borrowing over time." },
        { question: "Why is my early payments almost all interest?", answer: "At the start, your balance is at its highest. Interest = balance × monthly rate, so it's highest early on. As the balance falls, less goes to interest and more to principal. This is called front-loaded interest." },
        { question: "How do I use this schedule for tax purposes?", answer: "Mortgage interest on a primary residence is often tax-deductible in the US. The amortization schedule shows exactly how much interest you paid in each calendar year, useful for itemising deductions on Schedule A." },
        { question: "What is the tipping point where principal exceeds interest?", answer: "On a 30-year mortgage at 7%, the tipping point is around month 242, just past year 20: before that, more of each payment goes to interest than to principal. On a $300,000 loan at 7%, the first payment sends $1,750.00 to interest and only $245.91 to principal. After 10 years you have paid $239,509 in total but the balance is still $257,437, so only $42,563 went to principal. The calculator table shows this shift as the principal column grows." },
        { question: "Can I use this for a mortgage, car loan, or student loan?", answer: "Yes, for any fixed-rate amortizing loan. Enter the original amount, rate, and full term. For the remaining schedule mid-loan, enter your current balance, current rate, and remaining months (converted to years)." },
        { question: "How does an extra payment affect the schedule?", answer: "Extra payments reduce the principal faster, so the schedule shortens and interest on all remaining rows decreases. Use the Extra Payment Loan Calculator to model this; the amortization schedule assumes standard payments only." },
        { question: "How much of my first year of payments actually goes to principal?", answer: "Very little. On a $300,000 loan at 6.5% over 30 years, the monthly payment is $1,896.20, so you pay $22,754 in the first year but only about $3,825 of that reduces the balance. The other $18,929 is interest. That is why the first years of a long mortgage feel like treading water." },
        { question: "What if my loan has 0% interest?", answer: "Then every payment is all principal: the monthly payment is simply the loan amount divided by the number of months. A $12,000 loan at 0% over 2 years costs $500 a month, and the schedule shows zero interest in every row. This calculator handles a 0% rate, and the total interest comes out as $0." },
        { question: "Why does the schedule only show the first 24 months?", answer: "The table shows the first 24 rows so the page stays readable, and a Show all button reveals the full schedule, all 360 rows on a 30-year loan. The summary cards above the table always cover the whole term: monthly payment, total interest, and total paid." },
      ]}
    >
      <LoanAmortizationClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "loan-amortization-calculator", __enMetadata);
}
