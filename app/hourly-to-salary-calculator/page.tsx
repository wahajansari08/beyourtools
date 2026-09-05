import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import HourlyToSalaryClient from "./HourlyToSalaryClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "Hourly to Salary Calculator - Convert Hourly Wage to Annual Salary | BeYourTools",
  description: "Convert an hourly wage to annual, monthly, bi-weekly, weekly, and daily salary equivalents. Adjust hours per week and weeks per year for accurate results.",
  keywords: "hourly to salary calculator, hourly wage to annual salary, convert hourly to yearly, salary calculator, income calculator",
  path: "/hourly-to-salary-calculator",
});

export default function HourlyToSalaryPage() {
  return (
    <FinanceToolPage
      slug="hourly-to-salary-calculator"
      title="Hourly to Salary Calculator"
      cluster="Salary & Income"
      tagline="Convert any hourly wage into annual, monthly, bi-weekly, weekly, and daily income equivalents, adjust hours and weeks for your actual schedule."
      description="Free hourly to salary calculator. Enter your hourly rate, hours per week, and weeks worked per year to see your equivalent annual, monthly, bi-weekly, weekly, and daily salary."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Annual Salary</strong> = Hourly Rate × Hours per Week × Weeks per Year</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Monthly</strong> = Annual ÷ 12</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Bi-Weekly</strong> = Annual ÷ 26</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Weekly</strong> = Hourly Rate × Hours per Week</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Daily</strong> = Weekly ÷ 5 (assumes 5-day work week)</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $25/hr · 40 hrs/week · 52 weeks = <strong>$52,000/year</strong> · $4,333/month · $2,000/bi-weekly
          </p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>All figures are gross (pre-tax). Use the Paycheck Calculator to estimate take-home pay.</p>
        </>
      }
      faqs={[
        { question: "How many weeks should I use for the annual calculation?", answer: "Use 52 for a full year without unpaid leave. Use 50 if you take 2 weeks unpaid vacation. Part-time or seasonal workers should enter their actual working weeks. Paid vacation doesn't reduce this number, you still receive pay for those weeks." },
        { question: "Why is my bi-weekly pay not exactly half my monthly pay?", answer: "There are 26 bi-weekly periods per year but only 12 months. Each bi-weekly period = Annual ÷ 26. Each month = Annual ÷ 12. Two months per year have three bi-weekly paydays instead of two." },
        { question: "Does this include overtime?", answer: "No, this calculator assumes all hours are at your standard rate. For overtime calculations, use the Overtime Calculator to add 1.5× pay on hours above 40 per week before converting to salary." },
        { question: "How do I compare a job offer paying hourly vs. salaried?", answer: "Convert both to annual equivalent using this calculator. Also factor in benefits: hourly workers often don't receive paid leave or health insurance, which can represent $5,000–$15,000 in additional annual value for salaried positions." },
        { question: "What is $15/hour as an annual salary?", answer: "$15 × 40 hours × 52 weeks = $31,200 per year. Monthly that's $2,600. Bi-weekly: $1,200." },
        { question: "What is $20/hour as an annual salary?", answer: "$20 × 40 × 52 = $41,600 per year. At 35 hours/week it's $36,400. These are pre-tax gross figures." },
      ]}
    >
      <HourlyToSalaryClient />
    </FinanceToolPage>
  );
}
