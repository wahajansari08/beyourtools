import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import SavingsClient from "./SavingsClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Savings Calculator - Compound Savings Growth Projector | BeYourTools",
  description:
    "Project how your savings grow with an initial deposit, regular contributions, and compound interest over any time period. Shows year-by-year breakdown. Free, browser-based.",
  keywords: "savings calculator, compound interest calculator, savings growth calculator, future value calculator, investment savings calculator",
  alternates: { canonical: `${SITE.url}/savings-calculator` },
  robots: { index: true, follow: true },
};

export default function SavingsPage() {
  return (
    <FinanceToolPage
      slug="savings-calculator"
      title="Savings Calculator"
      cluster="Savings & Interest"
      tagline="See how your savings grow over time with compound interest and regular contributions, adjust compounding frequency, contribution schedule, and term to model any scenario."
      description="Free compound savings calculator. Enter initial deposit, regular contributions, interest rate, compounding frequency, and term to project final balance with a year-by-year breakdown."
      formulaExplanation={
        <>
          <p>The calculator compounds interest at the selected frequency and adds contributions proportionally across compounding periods:</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Balance after each period</strong> = Previous Balance × (1 + r/n) + Contribution per period</p>
          <p>Where r = annual rate, n = compounding periods per year. This repeats for every period across the full term.</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $5,000 initial · $200/mo · 4.5% rate · monthly compounding · 20 years<br />
            Final balance ≈ <strong>$120,000+</strong>, contributions total ~$53,000, rest is interest
          </p>
        </>
      }
      faqs={[
        { question: "What is compound interest?", answer: "Compound interest earns interest on both principal and previously earned interest. With monthly compounding at 5%, your $10,000 earns $500 in year 1, then $525 in year 2 (on $10,500), and so on, accelerating exponentially over time." },
        { question: "How much does compounding frequency matter?", answer: "Daily compounding yields slightly more than monthly, which beats quarterly. On $10,000 at 5% over 10 years: annual compounding = $16,289; monthly = $16,471; daily = $16,487. The differences are real but modest at typical savings rates." },
        { question: "How does starting early affect savings?", answer: "Profoundly. $200/month from age 25 to 65 at 6% = ~$400,000. Starting at 35 = ~$200,000. Ten extra years of compounding roughly doubles the outcome. Starting early is the single most impactful savings decision." },
        { question: "What interest rate should I use?", answer: "High-yield savings accounts (HYSA): 4–5% (2024). CDs: 4–5%. Bond index funds: 3–5% long-term. Stock index funds: 7–10% historical average (not guaranteed). Use conservative rates for planning, over-estimating returns is a common mistake." },
        { question: "Does this calculator account for inflation?", answer: "No, results are in nominal (not inflation-adjusted) dollars. To estimate real purchasing power, subtract the inflation rate from your nominal rate. At 5% return and 3% inflation, the real rate is approximately 2%." },
        { question: "What is the rule of 72?", answer: "A quick way to estimate doubling time: divide 72 by the annual rate. At 6%, money doubles in 72 ÷ 6 = 12 years. At 4%, it takes 18 years. Use the calculator for precise figures; the rule of 72 is a mental math shortcut." },
      ]}
    >
      <SavingsClient />
    </FinanceToolPage>
  );
}
