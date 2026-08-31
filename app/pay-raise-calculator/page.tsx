import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import PayRaiseClient from "./PayRaiseClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pay Raise Calculator — Annual & Per-Paycheck Raise Amount | BeYourTools",
  description:
    "Calculate how much a pay raise is worth annually, monthly, and per paycheck. Enter by percentage, dollar amount, or new salary. Free, instant, browser-based.",
  keywords: "pay raise calculator, salary increase calculator, raise percentage, new salary, paycheck increase",
  alternates: { canonical: `${SITE.url}/pay-raise-calculator` },
  robots: { index: true, follow: true },
};

export default function PayRaisePage() {
  return (
    <FinanceToolPage
      slug="pay-raise-calculator"
      title="Pay Raise Calculator"
      cluster="Salary & Income"
      tagline="Find out exactly how much a raise is worth — annually, and per paycheck — whether you know it as a percentage, a dollar amount, or a new salary figure."
      description="Free pay raise calculator. Enter your current salary and raise details (percent, dollar amount, or new salary) to see new annual salary, raise amount, and per-paycheck change."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>New Annual (from %)</strong> = Current Salary × (1 + Raise% ÷ 100)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>New Annual (from $)</strong> = Current Salary + Raise Amount</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Raise %</strong> = Raise Amount ÷ Current Salary × 100</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Per Paycheck</strong> = New Annual ÷ Pay Periods per Year</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Current $65,000 + 5% raise → New annual = $68,250 · Raise = $3,250 · Bi-weekly paycheck = $68,250 ÷ 26 = $2,625
          </p>
        </>
      }
      faqs={[
        { question: "What is a good pay raise percentage?", answer: "Cost-of-living raises typically track inflation (2–4%). Merit raises for strong performers are usually 4–8%. A promotion-linked raise is often 10–20%. Anything below inflation effectively reduces your purchasing power." },
        { question: "How do I negotiate a pay raise?", answer: "Research market rates for your role (Glassdoor, LinkedIn Salary, BLS data), document recent achievements and their business impact, then propose a specific number slightly above your target to leave negotiation room." },
        { question: "How much more will I take home after a raise?", answer: "Less than the full raise amount — additional income is taxed at your marginal rate. A $5,000 raise in the 22% federal bracket nets roughly $3,900 more per year (before state tax). Actual take-home varies with your full tax situation." },
        { question: "What is the difference between a pay raise and a bonus?", answer: "A raise permanently increases your base salary and compounds over time. A bonus is a one-time payment that doesn't affect your base rate. Over a career, even small raises have significantly more total value than equivalent one-time bonuses." },
        { question: "How many paychecks per year for bi-weekly pay?", answer: "Bi-weekly pay = 26 paychecks per year (every two weeks). Semi-monthly = 24 (twice a month on fixed dates). Monthly = 12. Weekly = 52. Two months each year have three bi-weekly paydays instead of two." },
      ]}
    >
      <PayRaiseClient />
    </FinanceToolPage>
  );
}
