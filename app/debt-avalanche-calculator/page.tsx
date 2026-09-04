import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import DebtAvalancheClient from "./DebtAvalancheClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Debt Avalanche Calculator - Pay Highest Interest Rate First | BeYourTools",
  description:
    "Use the debt avalanche method to eliminate debt by targeting the highest interest rate first. Saves the most money in total interest. Free, browser-based calculator.",
  keywords: "debt avalanche calculator, debt avalanche method, highest interest first, debt payoff, minimize interest, debt elimination strategy",
  alternates: { canonical: `${SITE.url}/debt-avalanche-calculator` },
  robots: { index: true, follow: true },
};

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
        { question: "How much more does snowball cost vs. avalanche?", answer: "On a typical multi-debt scenario, snowball costs $200–$1,000 more in interest than avalanche. The difference depends on how spread out the interest rates are. Use both calculators and compare to make an informed choice." },
        { question: "Should student loans be in the avalanche?", answer: "If they carry a high interest rate (above 6–7%), yes. Federal student loans below 5% may be better to pay minimums on while directing extra money at higher-rate consumer debt. Sort all your debts by rate and follow the calculator's order." },
        { question: "What if I get a balance transfer to 0% APR?", answer: "The 0% card moves to the bottom of the avalanche order (lowest rate = lowest priority). However, be sure to pay it off before the promotional period ends to avoid retroactive interest charges." },
      ]}
    >
      <DebtAvalancheClient />
    </FinanceToolPage>
  );
}
