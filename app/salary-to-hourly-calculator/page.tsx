import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import SalaryToHourlyClient from "./SalaryToHourlyClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "Salary to Hourly Calculator - Convert Annual Salary to Hourly Rate | BeYourTools",
  description: "Convert an annual, monthly, bi-weekly, or weekly salary into an equivalent hourly rate. Adjust hours per week and weeks worked per year for accurate results.",
  keywords: "salary to hourly calculator, annual salary to hourly rate, convert salary to hourly, hourly equivalent, income calculator",
  path: "/salary-to-hourly-calculator",
});

export default function SalaryToHourlyPage() {
  return (
    <FinanceToolPage
      slug="salary-to-hourly-calculator"
      title="Salary to Hourly Calculator"
      cluster="Salary & Income"
      tagline="Convert a salary, annual, monthly, bi-weekly, or weekly, into an equivalent hourly rate based on your actual working hours."
      description="Free salary to hourly calculator. Enter your salary, pay period, hours per week, and weeks per year to find your equivalent hourly rate and annual salary."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Annual Salary</strong> (if entering monthly) = Monthly × 12; (bi-weekly) = Bi-Weekly × 26; (weekly) = Weekly × Weeks/Year</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Hourly Rate</strong> = Annual Salary ÷ (Hours per Week × Weeks per Year)</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $60,000/year · 40 hrs/week · 52 weeks → $60,000 ÷ 2,080 = <strong>$28.85/hour</strong>
          </p>
        </>
      }
      faqs={[
        { question: "How do I find my hourly rate from an annual salary?", answer: "Divide your annual salary by total hours worked. For a standard 40-hour week over 52 weeks (2,080 hours): $50,000 ÷ 2,080 = $24.04/hour." },
        { question: "What if I work part-time or fewer than 52 weeks?", answer: "Adjust the hours per week and weeks per year inputs. Part-time at 30 hours over 50 weeks = 1,500 annual hours. A $45,000 salary over 1,500 hours = $30/hour." },
        { question: "Why do I earn a different hourly rate than my job offer stated?", answer: "Salaried employees are often paid for their role, not strict hours. If you work 50 hours/week on a 40-hour salary, your effective hourly rate drops. Use 50 hours in the calculator to see the true equivalent." },
        { question: "Does a higher salary always mean a higher hourly rate?", answer: "Not necessarily. A $90,000 job requiring 60 hours/week = $28.85/hour, while a $65,000 job at 40 hours/week = $31.25/hour. The 40-hour job pays more per hour despite a lower headline salary." },
        { question: "What is $50,000 a year as an hourly wage?", answer: "At 40 hours/week and 52 weeks: $50,000 ÷ 2,080 = $24.04/hour. At 37.5 hours/week (UK standard): $50,000 ÷ 1,950 = $25.64/hour." },
      ]}
    >
      <SalaryToHourlyClient />
    </FinanceToolPage>
  );
}
