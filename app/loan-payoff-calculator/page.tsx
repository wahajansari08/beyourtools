import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import LoanPayoffClient from "./LoanPayoffClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "Loan Payoff Calculator - Time to Pay Off Loan at Current Payment | BeYourTools",
  description: "See how long it takes to pay off your loan balance at your current monthly payment, and how much total interest you'll pay. Free, instant, browser-based.",
  keywords: "loan payoff calculator, how long to pay off loan, loan payoff time, remaining loan balance, total interest paid",
  path: "/loan-payoff-calculator",
});

export default function LoanPayoffPage() {
  return (
    <FinanceToolPage
      slug="loan-payoff-calculator"
      title="Loan Payoff Calculator"
      cluster="Loans"
      tagline="Enter your current balance, interest rate, and monthly payment to see exactly when your loan will be paid off and how much interest you'll pay in total."
      description="Free loan payoff calculator. Enter remaining balance, annual interest rate, and current monthly payment to calculate payoff date, total interest, and total amount paid."
      formulaExplanation={
        <>
          <p>Each month: <strong style={{ color: "var(--text-secondary)" }}>Interest Charged</strong> = Balance × (Annual Rate ÷ 12)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>New Balance</strong> = Balance + Interest − Monthly Payment</p>
          <p>This repeats until balance reaches zero. The calculator counts the months.</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $15,000 balance · 8.9% rate · $350/month<br />
            Month 1 interest = $15,000 × 0.0074 = $111.25 → New balance = $14,761.25<br />
            Continue until balance = 0 → approximately <strong>57 months (4 years 9 months)</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What if my payment barely covers the interest?", answer: "If your monthly payment is at or below the monthly interest charge (balance × annual rate ÷ 12), the balance never decreases, you'll pay forever. The calculator flags this and tells you the minimum payment needed." },
        { question: "How do I pay off my loan faster?", answer: "Increase your monthly payment. Even an extra $50–100/month on a typical loan can shorten the payoff by months or years and save significant interest. Use the Extra Payment Loan Calculator to model specific scenarios." },
        { question: "Does this work for car loans, personal loans, and student loans?", answer: "Yes, for any fixed-rate amortizing loan. Enter the current remaining balance (not the original amount), the current interest rate, and your current monthly payment for an accurate remaining payoff timeline." },
        { question: "My loan has a variable rate, can I still use this?", answer: "Yes, but results are estimates. Enter your current rate for today's projection. If your rate adjusts, recalculate with the new rate and remaining balance at that point." },
        { question: "What is the difference between this and the Loan Payment Calculator?", answer: "The Loan Payment Calculator finds your monthly payment from an original loan. This Payoff Calculator answers 'how long until I'm done?' given your current balance and payment, useful mid-loan when the original term no longer reflects reality." },
      ]}
    >
      <LoanPayoffClient />
    </FinanceToolPage>
  );
}
