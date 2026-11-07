import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import SavingsClient from "./SavingsClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Savings Calculator - Compound Growth | BeYourTools",
  description: "Project how your savings grow with regular deposits and compound interest. See year-by-year growth projections in your browser.",
  keywords: "savings calculator, compound interest calculator, savings growth calculator, future value calculator, investment savings calculator",
  path: "/savings-calculator",
});

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
            Final balance ≈ <strong>$89,900</strong>, contributions total ~$53,000, rest is interest (about $36,900)
          </p>
        </>
      }
      faqs={[
        { question: "What is compound interest?", answer: "Compound interest earns interest on both principal and previously earned interest. With monthly compounding at 5%, your $10,000 earns about $512 in year 1, then about $538 in year 2, and so on, accelerating over time. The yearly amount grows because each year starts from a larger balance." },
        { question: "How much does compounding frequency matter?", answer: "Daily compounding yields slightly more than monthly, which beats quarterly. On $10,000 at 5% over 10 years: annual compounding = $16,289; monthly = $16,470; daily = $16,487. The differences are real but modest at typical savings rates." },
        { question: "How does starting early affect savings?", answer: "Profoundly. $200/month from age 25 to 65 at 6% = ~$400,000. Starting at 35 = ~$200,000. Ten extra years of compounding roughly doubles the outcome. Starting early is the single most impactful savings decision." },
        { question: "What interest rate should I use?", answer: "High-yield savings accounts (HYSA): around 4–5%. CDs: 4–5%. Bond index funds: 3–5% long-term. Stock index funds: 7–10% historical average (not guaranteed). Use conservative rates for planning, over-estimating returns is a common mistake." },
        { question: "Does this calculator account for inflation?", answer: "No, results are in nominal (not inflation-adjusted) dollars. To estimate real purchasing power, subtract the inflation rate from your nominal rate. At 5% return and 3% inflation, the real rate is approximately 2%." },
        { question: "What is the rule of 72?", answer: "A quick way to estimate doubling time: divide 72 by the annual rate. At 6%, money doubles in 72 ÷ 6 = 12 years. At 4%, it takes 18 years. Use the calculator for precise figures; the rule of 72 is a mental math shortcut." },
        { question: "When are my contributions added: before or after interest?", answer: "This calculator adds each contribution after the interest for that period, so a deposit starts earning interest from the next period onward. Depositing at the start of the month instead would earn slightly more, because the money is invested sooner. The difference is small at savings-account rates but grows with higher rates and longer terms." },
        { question: "How much of the final balance is my money versus interest?", answer: "Take the worked example on this page: $5,000 initial plus $200 a month at 4.5% for 20 years ends at about $89,900. You contributed $53,000 of that and interest earned the other $36,900, so about 41% of the final balance is interest. The longer the term, the larger the interest share becomes, which is why starting early matters more than saving more later." },
        { question: "Does it matter if I contribute monthly or quarterly?", answer: "In this calculator, no: it spreads your yearly contributions evenly across the compounding periods, so $200 a month and $600 a quarter produce the same result. In real life, monthly deposits earn slightly more because each deposit starts earning sooner. The year-by-year table shows the first 10 years plus the final year, with the balance, total contributions, and interest earned for each." },
      ]}
    >
      <SavingsClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "savings-calculator", __enMetadata);
}
