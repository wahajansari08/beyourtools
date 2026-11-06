import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import DebtAvalancheClient from "./DebtAvalancheClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Debt Avalanche Calculator - Highest Interest First | BeYourTools",
  description: "Use the debt avalanche method to eliminate debt by targeting the highest interest rate first. See the optimal payoff order, interest saved vs snowball, and your debt-free date.",
  keywords: "debt avalanche calculator, debt avalanche method, highest interest first, debt payoff, minimize interest, debt elimination strategy, avalanche vs snowball",
  path: "/debt-avalanche-calculator",
});

export default function DebtAvalanchePage() {
  return (
    <FinanceToolPage
      slug="debt-avalanche-calculator"
      title="Debt Avalanche Calculator"
      cluster="Debt & Credit"
      tagline="Target the highest-interest debt first to minimise total interest paid, the mathematically optimal debt payoff strategy."
      description="Free debt avalanche calculator. Add debts with balance, rate, and minimum payment. See the optimal payoff order, interest saved, and your debt-free date."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Step 1:</strong> Sort debts from highest to lowest interest rate.</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Step 2:</strong> Pay minimums on all debts every month.</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Step 3:</strong> Direct all extra money at the highest-rate debt until eliminated.</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Step 4:</strong> Roll the freed payment to the next highest-rate debt, the avalanche grows.</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            Because high-rate debt accrues the most interest per dollar of balance, eliminating it first reduces the total interest bill more than any other ordering strategy.
          </p>
        </>
      }
      faqs={[
        { question: "Why does the avalanche save more money than snowball?", answer: "High interest rates cause the most damage per dollar of balance. Eliminating a 24% credit card before a 6% car loan stops the most expensive interest compounding first, leaving you with more money overall." },
        { question: "Is the avalanche always the best strategy?", answer: "Mathematically yes, it minimises total interest. But if you're prone to giving up, the snowball's quick wins may keep you on track. A completed snowball beats an abandoned avalanche every time." },
        { question: "How much more does snowball cost vs. avalanche?", answer: "It depends on how spread out the rates are, and it is often less than people expect. On three debts totalling $10,500 (a $500 store card at 12%, a $4,000 card at 24%, a $6,000 loan at 8%) with $150 extra a month, the snowball costs $2,028 in interest and the avalanche $1,951, a gap of only $76, and both finish debt-free in 34 months. The real difference is timing: the snowball clears its first debt in month 3, the avalanche in month 22. Run both calculators on your own debts to see your gap." },
        { question: "Should student loans be in the avalanche?", answer: "If they carry a high interest rate (above 6–7%), yes. Federal student loans below 5% may be better to pay minimums on while directing extra money at higher-rate consumer debt. Sort all your debts by rate and follow the calculator's order." },
        { question: "What if I get a balance transfer to 0% APR?", answer: "The 0% card moves to the bottom of the avalanche order, because the lowest rate is the lowest priority. When the promotional period ends, the remaining balance starts accruing interest at the card's regular APR. Retroactive interest, where the lender backdates interest to the purchase date, applies to some store financing plans, not to a typical 0% balance transfer, so check the card's terms. Either way, aim to clear the transferred balance before the promo ends." },
        { question: "Can the avalanche ever cost more than the snowball?", answer: "No, for the same debts and the same monthly budget. Targeting the highest rate first retires the most expensive dollars soonest, so the avalanche is mathematically optimal: it never costs more interest than the snowball. At worst it ties, which happens when both methods produce the same order, for example when the smallest balance is also the highest rate. If the avalanche feels slower, that is the timing, not the cost: its first win usually comes later." },
        { question: "What if two debts have the same interest rate?", answer: "The calculator sorts by rate, highest first, and when two rates are equal it keeps the order you listed them in, so list the smaller balance first if you want it cleared sooner. The sort runs every month on the current rates, but since rates do not change during the simulation, the order stays fixed unless a debt is paid off." },
        { question: "What happens if I set the extra payment to $0?", answer: "The plan still works, because freed minimum payments keep rolling forward to the next highest-rate debt. On three debts totalling $10,500 (a $500 store card at 12%, a $4,000 card at 24%, a $6,000 loan at 8%) with no extra payment, the avalanche takes 75 months and costs $6,231 in interest. Adding $150 a month cuts that to 34 months and $1,951. The rollover does more work than the ordering: compare with the snowball on the same debts to see the gap." },
      ]}
    >
      <DebtAvalancheClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "debt-avalanche-calculator", __enMetadata);
}
