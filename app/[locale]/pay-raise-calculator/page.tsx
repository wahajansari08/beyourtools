import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import PayRaiseClient from "./PayRaiseClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Pay Raise Calculator - Salary Increase & New Pay | BeYourTools",
  description: "Calculate a pay raise as a percentage or dollar amount and see your new salary, monthly pay, and per-paycheck increase. Free in your browser.",
  keywords: "pay raise calculator, salary increase calculator, raise percentage, new salary, paycheck increase, real raise after inflation",
  path: "/pay-raise-calculator",
});

export default function PayRaisePage() {
  return (
    <FinanceToolPage
      slug="pay-raise-calculator"
      title="Pay Raise Calculator"
      cluster="Salary & Income"
      tagline="Find out exactly how much a raise is worth, annually, and per paycheck, whether you know it as a percentage, a dollar amount, or a new salary figure, and see whether it beats inflation."
      description="Free pay raise calculator. Enter your current salary and raise details (percent, dollar amount, or new salary) to see new annual salary, raise amount, and per-paycheck change. It also shows the raise per pay period, so a small percentage becomes a concrete monthly number."
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
        { question: "How much more will I take home after a raise?", answer: "Less than the full raise amount, additional income is taxed at your marginal rate. A $5,000 raise in the 22% federal bracket nets roughly $3,900 more per year (before state tax). Actual take-home varies with your full tax situation." },
        { question: "What is the difference between a pay raise and a bonus?", answer: "A raise permanently increases your base salary and compounds over time. A bonus is a one-time payment that doesn't affect your base rate. Over a career, even small raises have significantly more total value than equivalent one-time bonuses." },
        { question: "How many paychecks per year for bi-weekly pay?", answer: "Bi-weekly pay = 26 paychecks per year (every two weeks). Semi-monthly = 24 (twice a month on fixed dates). Monthly = 12. Weekly = 52. Two months each year have three bi-weekly paydays instead of two." },
        { question: "Is a 3% raise a real raise?", answer: "Only if it beats inflation. With inflation at 2.8%, a 3% raise adds about 0.2% in real purchasing power: 1.03 divided by 1.028, minus 1. If inflation matches the raise, your buying power stands still even though the salary number rises." },
        { question: "How much is a small raise worth over 10 years?", answer: "Raises compound, because each new raise applies to the higher base. A 3% raise every year turns $50,000 into about $67,196 after 10 years, which is $17,196 more per year than where you started, before any promotions. That is why early-career raises matter so much." },
        { question: "What is the difference between a percentage point and a percent?", answer: "A percentage point is the plain difference between two percentages. A raise budget moving from 3% to 3.5% rises by 0.5 percentage points, which is a 16.7% increase in the size of the budget itself. Keep the two apart when reading an employer's announcement." },
      ]}
    >
      <PayRaiseClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "pay-raise-calculator", __enMetadata);
}
