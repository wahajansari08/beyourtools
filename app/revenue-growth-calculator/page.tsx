import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import RevenueGrowthClient from "./RevenueGrowthClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Revenue Growth Calculator — Growth Rate, Projected Revenue & CAGR | BeYourTools",
  description:
    "Calculate revenue growth rate between two periods, project future revenue at a given growth rate, or find CAGR between a start and end revenue. Free, browser-based.",
  keywords: "revenue growth calculator, revenue growth rate, CAGR calculator, projected revenue, YoY growth, compound annual growth rate",
  alternates: { canonical: `${SITE.url}/revenue-growth-calculator` },
  robots: { index: true, follow: true },
};

export default function RevenueGrowthPage() {
  return (
    <FinanceToolPage
      slug="revenue-growth-calculator"
      title="Revenue Growth Calculator"
      cluster="Marketing & ROI"
      tagline="Calculate year-over-year revenue growth rate, project future revenue at a target growth rate, or find the CAGR between any two revenue figures."
      description="Free revenue growth calculator with three modes: calculate growth rate between periods, project future revenue at a given rate, or find CAGR between start and end values."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Growth Rate</strong> = (Current − Previous) ÷ |Previous| × 100</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Projected Revenue</strong> = Current × (1 + Growth Rate ÷ 100)^Years</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>CAGR</strong> = (Ending ÷ Starting)^(1÷Years) − 1</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example (growth rate):</strong> $500k → $650k = ($650k − $500k) ÷ $500k = <strong>+30%</strong><br />
            <strong>Example (CAGR):</strong> $500k → $800k over 3 years = (800÷500)^(1/3) − 1 = <strong>16.96%/year</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What is a good revenue growth rate?", answer: "Highly context-dependent. Early-stage SaaS: 100–300%+ YoY. Growth-stage SaaS: 50–100%. Mature public companies: 10–20%. Fortune 500: 3–8%. Compare against industry benchmarks and your own historical trajectory rather than a single number." },
        { question: "What is the difference between YoY growth and CAGR?", answer: "YoY growth measures one period against the previous period. CAGR smooths multiple periods into a single consistent annual rate — useful for comparing growth over different timeframes. $1M growing to $1.7M in 3 years: YoY rates might be 20%, 15%, 13% but CAGR = 19.4%/year." },
        { question: "Why is CAGR useful for investors?", answer: "CAGR normalises uneven growth into a single comparable number. It answers 'what steady annual rate would produce the same end result?' Making investment comparisons across different time periods, asset classes, or companies much more meaningful." },
        { question: "Can revenue growth be negative?", answer: "Yes — negative growth (revenue decline) is calculated the same way. If revenue fell from $800k to $640k, growth = ($640k − $800k) ÷ $800k = −20%. The calculator handles negative growth rates correctly." },
        { question: "What is the rule of 40 for SaaS?", answer: "A SaaS health benchmark: Revenue Growth Rate + Profit Margin should equal or exceed 40. A company growing at 30% with a 15% profit margin scores 45 — passing the rule of 40. It balances growth and profitability for stage-appropriate evaluation." },
      ]}
    >
      <RevenueGrowthClient />
    </FinanceToolPage>
  );
}
