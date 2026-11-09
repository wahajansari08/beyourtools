import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import RevenueGrowthClient from "./RevenueGrowthClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Revenue Growth Calculator - Growth & CAGR | BeYourTools",
  description: "Calculate revenue growth rates, project future revenue, and find CAGR between periods. Free business calculator in your browser.",
  keywords: "revenue growth calculator, revenue growth rate, CAGR calculator, projected revenue, YoY growth, compound annual growth rate",
  path: "/revenue-growth-calculator",
});

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
        { question: "What is the difference between YoY growth and CAGR?", answer: "YoY growth measures one period against the previous period. CAGR smooths multiple periods into a single consistent annual rate, useful for comparing growth over different timeframes. $1M growing to $1.7M in 3 years: YoY rates might be 25%, 20%, 13.3% but CAGR = 19.4%/year." },
        { question: "Why is CAGR useful for investors?", answer: "CAGR normalises uneven growth into a single comparable number. It answers 'what steady annual rate would produce the same end result?' Making investment comparisons across different time periods, asset classes, or companies much more meaningful." },
        { question: "Can revenue growth be negative?", answer: "Yes, negative growth (revenue decline) is calculated the same way. If revenue fell from $800k to $640k, growth = ($640k − $800k) ÷ $800k = −20%. The calculator handles negative growth rates correctly." },
        { question: "What is the rule of 40 for SaaS?", answer: "A SaaS health benchmark: Revenue Growth Rate + Profit Margin should equal or exceed 40. A company growing at 30% with a 15% profit margin scores 45, passing the rule of 40. It balances growth and profitability for stage-appropriate evaluation." },
        { question: "How long will it take my revenue to double?", answer: "Use the Rule of 72: doubling time in years is about 72 / the annual growth rate in percent. Revenue growing from $1,000,000 to $2,000,000 over 4 years has a CAGR of (2)^(1/4) - 1 = 18.92% a year, so the Rule of 72 estimates 72 / 18.92 = 3.81 years. The exact doubling time is 4.00 years, so treat the Rule of 72 answer as a quick estimate, not an exact figure." },
        { question: "How do I calculate revenue growth and CAGR in Excel or Google Sheets?", answer: "Growth rate: =(Current - Previous) / Previous. CAGR: =(End / Start)^(1 / Years) - 1, or the built-in =RRI(Years, Start, End). Future value: =Start * (1 + Rate)^Years. For example, $1,000 growing at 10% a year for 5 years is 1,000 x (1.10)^5 = $1,610.51. Count years as last year minus first year, so 2021 to 2026 is 5 years, not 6." },
        { question: "What is the difference between total growth and CAGR?", answer: "Total growth is the whole change; CAGR is the steady yearly rate that produces it. Revenue from $1,000,000 to $1,500,000 over 5 years is 50% total growth but only an 8.45% CAGR a year. A second example: $2,000,000 to $5,000,000 over 4 years is 150% total growth and a 25.74% CAGR a year. Two investments can share the same total growth and have very different CAGRs if their timeframes differ." },
      ]}
    >
      <RevenueGrowthClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "revenue-growth-calculator", __enMetadata);
}
