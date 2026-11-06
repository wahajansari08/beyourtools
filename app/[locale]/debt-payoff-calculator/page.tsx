import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import DebtPayoffClient from "./DebtPayoffClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Debt Payoff Calculator - Multiple Debts, Payoff Date & Interest | BeYourTools",
  description: "Calculate how long it takes to pay off multiple debts and the total interest cost. Add your debts, see each payoff timeline and your debt-free date, and test what extra payments save.",
  keywords: "debt payoff calculator, multiple debt calculator, pay off debt, total interest, debt free calculator, debt elimination, debt free date, minimum payment trap",
  path: "/debt-payoff-calculator",
});

export default function DebtPayoffPage() {
  return (
    <FinanceToolPage
      slug="debt-payoff-calculator"
      title="Debt Payoff Calculator"
      cluster="Debt & Credit"
      tagline="Enter multiple debts with their balances, rates, and minimum payments to see when each will be paid off, total interest cost, and when you'll be debt-free."
      description="Free multi-debt payoff calculator. Add your debts with balance, interest rate, and minimum payment to see payoff timeline and total interest for each debt and overall."
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
        { question: "How much does making minimum payments really cost?", answer: "Far more than most people expect. On a $5,000 credit card at 20% APR with a minimum payment of 2% of the balance (and a $25 floor), making only minimums takes about 44 years and costs about $20,200 in interest, four times the original balance. Adding just $50 a month on top of the minimum cuts that to under 7 years and about $3,430 in interest. The minimum shrinks as the balance falls, which is why it takes so long." },
        { question: "Should I pay off debt or save/invest?", answer: "Mathematically: if debt interest rate > expected investment return, pay debt first. High-interest credit card debt (15–25%) should almost always be prioritised over investing. Low-rate mortgage debt (3–7%) may be worth keeping while investing, since long-term market returns historically exceed this." },
        { question: "What is a debt consolidation loan and should I use one?", answer: "A debt consolidation loan replaces multiple debts with a single lower-rate loan. It's beneficial if the consolidated rate is meaningfully lower than your weighted average current rate. Be cautious: extending the term can increase total interest even at a lower rate." },
        { question: "How is the extra payment applied across debts?", answer: "This calculator splits it equally as a simple estimate. In practice, the debt snowball and avalanche methods direct all extra payment to one debt at a time, which is more effective. Use those calculators for optimised strategies." },
        { question: "Does this calculator roll freed payments to the next debt?", answer: "No. Each debt is simulated on its own, with the extra payment split equally across all active debts, and there is no cascade: when one debt is paid off, its minimum payment does not roll into the others here. The Debt Snowball and Debt Avalanche calculators do roll freed payments forward, which is why they usually show a faster debt-free date for the same debts." },
        { question: "Is there a limit on how many debts I can add?", answer: "No. There is no fixed limit: add as many debts as you need, each with its own balance, rate, and minimum payment. The results show a payoff timeline per debt plus overall totals, and the debt-free date is the month the longest-running debt clears." },
        { question: "What happens if a minimum payment does not cover the monthly interest?", answer: "Then the balance never falls: each month adds more interest than the payment removes. The calculator runs the simulation for up to 600 months (50 years) and the debt still shows as unpaid, which is the signal to raise the payment above that month's interest charge. For a $5,000 balance at 20%, one month of interest is about $83, so any payment below that cannot shrink the balance." },
      ]}
    >
      <DebtPayoffClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "debt-payoff-calculator", __enMetadata);
}
