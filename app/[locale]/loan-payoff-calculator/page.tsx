import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import LoanPayoffClient from "./LoanPayoffClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Loan Payoff Calculator - Payoff Date & Total Interest | BeYourTools",
  description: "See how long it takes to pay off your loan balance at your current payment, plus total interest and the minimum payment that actually reduces the balance.",
  keywords: "loan payoff calculator, how long to pay off loan, loan payoff time, remaining loan balance, total interest paid, payoff date calculator",
  path: "/loan-payoff-calculator",
});

export default function LoanPayoffPage() {
  return (
    <FinanceToolPage
      slug="loan-payoff-calculator"
      title="Loan Payoff Calculator"
      cluster="Loans"
      tagline="Enter your current balance, interest rate, and monthly payment to see exactly when your loan will be paid off and how much interest you'll pay in total, starting from your current balance, not the original loan."
      description="Free loan payoff calculator. Enter remaining balance, annual interest rate, and current monthly payment to calculate payoff date, total interest, and total amount paid. Enter the remaining balance from your latest statement for an accurate timeline."
      formulaExplanation={
        <>
          <p>Each month: <strong style={{ color: "var(--text-secondary)" }}>Interest Charged</strong> = Balance × (Annual Rate ÷ 12)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>New Balance</strong> = Balance + Interest − Monthly Payment</p>
          <p>This repeats until balance reaches zero. The calculator counts the months.</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $15,000 balance · 8.9% rate · $350/month<br />
            Month 1 interest = $15,000 × 0.0074 = $111.25 → New balance = $14,761.25<br />
            Continue until balance = 0 → approximately <strong>52 months (4 years 4 months)</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What if my payment barely covers the interest?", answer: "If your monthly payment is at or below the monthly interest charge (balance × annual rate ÷ 12), the balance never decreases, you'll pay forever. The calculator flags this and tells you the minimum payment needed." },
        { question: "How do I pay off my loan faster?", answer: "Increase your monthly payment. Even an extra $50–100/month on a typical loan can shorten the payoff by months or years and save significant interest. Use the Extra Payment Loan Calculator to model specific scenarios." },
        { question: "Does this work for car loans, personal loans, and student loans?", answer: "Yes, for any fixed-rate amortizing loan. Enter the current remaining balance (not the original amount), the current interest rate, and your current monthly payment for an accurate remaining payoff timeline." },
        { question: "My loan has a variable rate, can I still use this?", answer: "Yes, but results are estimates. Enter your current rate for today's projection. If your rate adjusts, recalculate with the new rate and remaining balance at that point." },
        { question: "What is the difference between this and the Loan Payment Calculator?", answer: "The Loan Payment Calculator finds your monthly payment from an original loan. This Payoff Calculator answers 'how long until I'm done?' given your current balance and payment, useful mid-loan when the original term no longer reflects reality." },
        { question: "What payment do I need to pay off in 2 years?", answer: "Work it from the amortization formula, or try payments in this calculator until the timeline matches. A $12,000 balance at 9% needs about $548.22 a month to clear in 24 months. If your current payment is lower, the gap is the extra amount to find each month." },
        { question: "Why is my final payment smaller than the rest?", answer: "Because the last payment only covers what is left. If $210 remains when the scheduled payment is $350, you pay $210 and the loan closes. The calculator counts that final partial payment, so the timeline is exact rather than rounded up to a full extra month." },
        { question: "Should I pay extra monthly or save for one lump sum?", answer: "Paying extra each month usually wins, because every extra dollar stops accruing interest from the month it is paid. A lump sum still helps, and the earlier it lands, the more it saves. Compare both in the Extra Payment Loan Calculator before deciding." },
      ]}
    >
      <LoanPayoffClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "loan-payoff-calculator", __enMetadata);
}
