import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import SavingsGoalClient from "./SavingsGoalClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Savings Goal Calculator — Monthly Savings Needed to Hit Your Target | BeYourTools",
  description:
    "Find out exactly how much you need to save each month to reach any savings goal by a target date. Accounts for existing savings and compound interest. Free, browser-based.",
  keywords: "savings goal calculator, monthly savings calculator, how much to save, target savings, savings plan calculator, future value calculator",
  alternates: { canonical: `${SITE.url}/savings-goal-calculator` },
  robots: { index: true, follow: true },
};

export default function SavingsGoalPage() {
  return (
    <FinanceToolPage
      slug="savings-goal-calculator"
      title="Savings Goal Calculator"
      cluster="Savings & Interest"
      tagline="Enter your savings goal, current balance, interest rate, and deadline to find the exact monthly contribution you need to reach your target."
      description="Free savings goal calculator. Enter goal amount, current savings, annual rate, and months to deadline to calculate required monthly contribution and total interest earned."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Future Value of Existing Savings</strong> = P × (1 + r/12)ⁿ</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Remaining Needed</strong> = Goal − Future Value of Existing Savings</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Required Monthly Payment (PMT)</strong> = Remaining × r/12 ÷ [(1 + r/12)ⁿ − 1]</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            Where r = annual rate, n = months. This is the reverse of a future value calculation — solving for the regular payment needed to reach a target balance.
          </p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Goal $20,000 · Current $2,000 · 4.5% rate · 24 months → Monthly ≈ <strong>$756</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What savings goals can I use this for?", answer: "Any lump-sum target: emergency fund (3–6 months expenses), house down payment, car, wedding, vacation, college tuition, or a specific retirement milestone. Just enter the target amount and your deadline in months." },
        { question: "How does existing savings affect my required contribution?", answer: "Your current savings will grow with compound interest over the period, so you need to save less each month. The calculator grows your existing balance at the full rate, then calculates the gap to your goal." },
        { question: "What if I can't afford the required monthly amount?", answer: "Two options: extend your timeline (more months reduces each payment) or lower the goal. Try increasing the months input to see how much the required monthly payment drops — even a 6-month extension often makes a big difference." },
        { question: "How much should I save for an emergency fund?", answer: "The standard recommendation is 3–6 months of essential living expenses. If your monthly expenses are $3,000, aim for $9,000–$18,000. High-yield savings accounts (4–5% in 2024) are the right vehicle — liquid, low-risk, and interest-bearing." },
        { question: "What interest rate is realistic for a savings account?", answer: "High-yield savings accounts (HYSAs) offered 4–5% APY in 2024. Traditional bank savings accounts offer far less (0.1–0.5%). For goals over 5 years, a diversified investment portfolio may be more appropriate than a savings account." },
      ]}
    >
      <SavingsGoalClient />
    </FinanceToolPage>
  );
}
