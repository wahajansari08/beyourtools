import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import DebtSnowballClient from "./DebtSnowballClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Debt Snowball Calculator - Smallest Balance First | BeYourTools",
  description: "Use the debt snowball method to pay off debts by tackling the smallest balance first. See your payoff order, first win date, and total interest in your browser.",
  keywords: "debt snowball calculator, debt snowball method, pay off debt, smallest balance first, debt payoff order, debt free plan, quick wins",
  path: "/debt-snowball-calculator",
});

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
          <p><strong style={{ color: "var(--text-secondary)" }}>Step 3:</strong> Direct all extra money at the smallest balance until it&apos;s gone.</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Step 4:</strong> Once a debt is paid, roll its freed payment to the next smallest, the &quot;snowball&quot; grows with each payoff.</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            The snowball method is psychologically powerful because it produces quick wins. It costs slightly more in interest than the avalanche method but keeps more people on track to completion.
          </p>
        </>
      }
      faqs={[
        { question: "Why is the snowball method effective?", answer: "Behaviour matters as much as math. Paying off a debt completely creates a motivational win that keeps people committed. Research shows the snowball method leads to higher debt-elimination success rates than the mathematically optimal avalanche method." },
        { question: "What is the difference between snowball and avalanche?", answer: "Snowball: smallest balance first. Avalanche: highest interest rate first. Avalanche saves more total interest. Snowball delivers quicker wins. For most people with moderate debt, the snowball is the better choice because sustained motivation prevents giving up." },
        { question: "Should I include my mortgage in the snowball?", answer: "Most debt advice excludes the mortgage from the snowball, focus on consumer debts (credit cards, personal loans, car loans, student loans) first, then tackle the mortgage separately once other debts are eliminated." },
        { question: "What if two debts have the same balance?", answer: "The calculator re-sorts by current balance every month, and when two balances are equal it keeps the order you listed them in, so list the higher-rate debt first if you want it to win ties. Note that the order can change as balances fall: the target is always the currently smallest remaining balance, not the one that started smallest." },
        { question: "How much extra should I put toward the snowball?", answer: "Even $50–100/month extra makes a significant difference. More is better, consider selling unused items, taking on extra hours, or cutting discretionary spending temporarily. The faster the first debt falls, the bigger the snowball grows." },
        { question: "Does the payoff order change as balances fall?", answer: "Yes. The calculator re-sorts by current balance every month, so the target is always the smallest balance remaining at that moment, not necessarily the one that started smallest. In practice the order rarely changes, because the target debt shrinks fastest, but a debt that starts second-smallest can become the target if the first one stalls." },
        { question: "What happens if I set the extra payment to $0?", answer: "The plan still works, because freed minimum payments keep rolling forward: when a debt clears, its minimum joins the attack on the next smallest debt. On three debts totalling $10,500 (a $500 store card at 12%, a $4,000 card at 24%, a $6,000 loan at 8%) with no extra payment, the plan takes 76 months and costs $6,551 in interest. Adding $150 a month cuts that to 34 months and $2,028." },
        { question: "How does the calculator use my extra payment?", answer: "Every month it pays the minimum on all debts, then sends the extra payment plus any freed minimums from cleared debts to the current target, the smallest remaining balance. When that debt clears, the whole amount, its minimum plus the extra, rolls to the next smallest. That rollover is the snowball: your total monthly outlay never changes, but the amount hitting each remaining debt grows every time one disappears." },
      ]}
    >
      <DebtSnowballClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "debt-snowball-calculator", __enMetadata);
}
