import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import DebtSnowballClient from "./DebtSnowballClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Debt Snowball Calculator - Pay Off Debts Smallest Balance First | BeYourTools",
  description:
    "Use the debt snowball method to pay off multiple debts by tackling the smallest balance first. See your payoff order, month-by-month plan, and total interest cost.",
  keywords: "debt snowball calculator, debt snowball method, pay off debt, smallest balance first, debt payoff order, debt free plan",
  alternates: { canonical: `${SITE.url}/debt-snowball-calculator` },
  robots: { index: true, follow: true },
};

export default function DebtSnowballPage() {
  return (
    <FinanceToolPage
      slug="debt-snowball-calculator"
      title="Debt Snowball Calculator"
      cluster="Debt & Credit"
      tagline="Pay off the smallest balance first, then roll those freed payments to the next, see exactly when each debt gets eliminated and when you'll be debt-free."
      description="Free debt snowball calculator. Add your debts, set an extra monthly payment, and see the snowball payoff order, debt-free date, and total interest paid."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Step 1:</strong> List debts from smallest to largest balance.</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Step 2:</strong> Pay minimums on all debts every month.</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Step 3:</strong> Direct all extra money at the smallest balance until it's gone.</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Step 4:</strong> Once a debt is paid, roll its freed payment to the next smallest, the "snowball" grows with each payoff.</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            The snowball method is psychologically powerful because it produces quick wins. It costs slightly more in interest than the avalanche method but keeps more people on track to completion.
          </p>
        </>
      }
      faqs={[
        { question: "Why is the snowball method effective?", answer: "Behaviour matters as much as math. Paying off a debt completely creates a motivational win that keeps people committed. Research shows the snowball method leads to higher debt-elimination success rates than the mathematically optimal avalanche method." },
        { question: "What is the difference between snowball and avalanche?", answer: "Snowball: smallest balance first. Avalanche: highest interest rate first. Avalanche saves more total interest. Snowball delivers quicker wins. For most people with moderate debt, the snowball is the better choice because sustained motivation prevents giving up." },
        { question: "Should I include my mortgage in the snowball?", answer: "Most debt advice excludes the mortgage from the snowball, focus on consumer debts (credit cards, personal loans, car loans, student loans) first, then tackle the mortgage separately once other debts are eliminated." },
        { question: "What if two debts have the same balance?", answer: "Pay off the one with the higher interest rate first among equal balances, this is a hybrid approach that respects the snowball logic while slightly reducing interest cost. This calculator orders strictly by balance." },
        { question: "How much extra should I put toward the snowball?", answer: "Even $50–100/month extra makes a significant difference. More is better, consider selling unused items, taking on extra hours, or cutting discretionary spending temporarily. The faster the first debt falls, the bigger the snowball grows." },
      ]}
    >
      <DebtSnowballClient />
    </FinanceToolPage>
  );
}
