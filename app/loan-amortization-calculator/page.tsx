import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import LoanAmortizationClient from "./LoanAmortizationClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Loan Amortization Calculator — Full Month-by-Month Schedule | BeYourTools",
  description:
    "Generate a complete month-by-month amortization schedule for any loan. See payment, principal, interest, and remaining balance for every payment. Free, browser-based.",
  keywords: "loan amortization calculator, amortization schedule, mortgage amortization, loan schedule, principal and interest breakdown",
  alternates: { canonical: `${SITE.url}/loan-amortization-calculator` },
  robots: { index: true, follow: true },
};

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
            Because balance decreases each month, the interest portion shrinks and the principal portion grows — a process called negative amortization reversal. Early payments are mostly interest; late payments are mostly principal.
          </p>
        </>
      }
      faqs={[
        { question: "What is an amortization schedule?", answer: "A table showing every payment of a loan, broken down into how much goes to interest and how much to principal, plus the remaining balance after each payment. It reveals the true cost of borrowing over time." },
        { question: "Why is my early payments almost all interest?", answer: "At the start, your balance is at its highest. Interest = balance × monthly rate, so it's highest early on. As the balance falls, less goes to interest and more to principal. This is called front-loaded interest." },
        { question: "How do I use this schedule for tax purposes?", answer: "Mortgage interest on a primary residence is often tax-deductible in the US. The amortization schedule shows exactly how much interest you paid in each calendar year — useful for itemising deductions on Schedule A." },
        { question: "What is the tipping point where principal exceeds interest?", answer: "On a 30-year mortgage at 7%, the tipping point is around month 222 (year 18-19) — past that, more of each payment goes to principal than interest. The calculator table shows this visually as the principal column grows." },
        { question: "Can I use this for a mortgage, car loan, or student loan?", answer: "Yes — for any fixed-rate amortizing loan. Enter the original amount, rate, and full term. For the remaining schedule mid-loan, enter your current balance, current rate, and remaining months (converted to years)." },
        { question: "How does an extra payment affect the schedule?", answer: "Extra payments reduce the principal faster, so the schedule shortens and interest on all remaining rows decreases. Use the Extra Payment Loan Calculator to model this; the amortization schedule assumes standard payments only." },
      ]}
    >
      <LoanAmortizationClient />
    </FinanceToolPage>
  );
}
