import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import DebtPayoffClient from "./DebtPayoffClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Debt Payoff Calculator - Time & Total Interest for Multiple Debts | BeYourTools",
  description:
    "Calculate how long it takes to pay off multiple debts and the total interest cost at your current payments. Add extra monthly payments to see the impact. Free, browser-based.",
  keywords: "debt payoff calculator, multiple debt calculator, pay off debt, total interest, debt free calculator, debt elimination",
  alternates: { canonical: `${SITE.url}/debt-payoff-calculator` },
  robots: { index: true, follow: true },
};

export default function DebtPayoffPage() {
  return (
    <FinanceToolPage
      slug="debt-payoff-calculator"
      title="Debt Payoff Calculator"
      cluster="Debt & Credit"
      tagline="Enter multiple debts with their balances, rates, and minimum payments to see when each will be paid off, total interest cost, and when you'll be debt-free."
      description="Free multi-debt payoff calculator. Add up to 10 debts with balance, interest rate, and minimum payment to see payoff timeline and total interest for each debt and overall."
      formulaExplanation={
        <>
          <p>For each debt, the calculator simulates monthly payments:</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Monthly Interest</strong> = Balance × (Annual Rate ÷ 12)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>New Balance</strong> = Balance + Interest − Payment</p>
          <p>This repeats until balance = 0. Any extra payment amount is split equally across all active debts.</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            For a smarter payoff strategy that saves more interest, try the Debt Snowball Calculator (smallest balance first) or Debt Avalanche Calculator (highest rate first).
          </p>
        </>
      }
      faqs={[
        { question: "What is the fastest way to pay off multiple debts?", answer: "The debt avalanche method (targeting the highest interest rate first) minimises total interest paid. The debt snowball (smallest balance first) keeps motivation high by delivering quick wins. Both outperform making only minimum payments." },
        { question: "How much does making minimum payments really cost?", answer: "On a $5,000 credit card at 20% APR with a 2% minimum payment, making only minimums takes over 30 years and costs more than $9,000 in interest, nearly double the original balance. Paying even $50 extra monthly saves years and thousands." },
        { question: "Should I pay off debt or save/invest?", answer: "Mathematically: if debt interest rate > expected investment return, pay debt first. High-interest credit card debt (15–25%) should almost always be prioritised over investing. Low-rate mortgage debt (3–7%) may be worth keeping while investing, since long-term market returns historically exceed this." },
        { question: "What is a debt consolidation loan and should I use one?", answer: "A debt consolidation loan replaces multiple debts with a single lower-rate loan. It's beneficial if the consolidated rate is meaningfully lower than your weighted average current rate. Be cautious: extending the term can increase total interest even at a lower rate." },
        { question: "How is the extra payment applied across debts?", answer: "This calculator splits it equally as a simple estimate. In practice, the debt snowball and avalanche methods direct all extra payment to one debt at a time, which is more effective. Use those calculators for optimised strategies." },
      ]}
    >
      <DebtPayoffClient />
    </FinanceToolPage>
  );
}
