import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import HourlyRateClient from "./HourlyRateClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Hourly Rate Calculator - Minimum Rate for Your Income Goal | BeYourTools",
  description: "Calculate the minimum hourly rate to reach your annual income goal, with overhead and profit buffers for a sustainable rate. Free in your browser.",
  keywords: "hourly rate calculator, minimum hourly rate, income goal calculator, consultant rate, contractor rate, freelance pricing, billable hours",
  path: "/hourly-rate-calculator",
});

export default function HourlyRatePage() {
  return (
    <FinanceToolPage
      slug="hourly-rate-calculator"
      title="Hourly Rate Calculator"
      cluster="Salary & Income"
      tagline="Find the minimum hourly rate you must charge to meet your annual income goal, with separate overhead and profit buffers to arrive at a truly sustainable rate, and a clear line between your floor and your recommended rate."
      description="Free hourly rate calculator. Enter your annual income goal, hours worked, overhead percentage, and profit margin to see your base rate and recommended sustainable hourly rate. The base rate is your break-even figure; the recommended rate adds the buffers that keep the rate sustainable."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Base Rate</strong> = Annual Income Goal ÷ (Hours/Week × Weeks/Year)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Rate with Overhead</strong> = Base Rate × (1 + Overhead% ÷ 100)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Recommended Rate</strong> = Rate with Overhead × (1 + Profit% ÷ 100)</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Goal $90k · 40 hrs/week · 50 weeks · 20% overhead · 10% profit<br />
            Base = $90k ÷ 2,000 = $45 → With overhead = $54 → Recommended = <strong>$59.40/hr</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What is the difference between this and the Freelance Rate Calculator?", answer: "The Freelance Rate Calculator works backwards from a desired after-tax net income, accounting for self-employment taxes and business expenses. This Hourly Rate Calculator works from a gross revenue goal with overhead and profit buffers, ideal for businesses or consultants quoting projects." },
        { question: "What overhead percentage should I use?", answer: "15–25% covers typical admin time, non-billable hours, and business costs. If you have significant non-billable time (sales calls, project management, invoicing), use 25–40%. Very efficient consultants doing pure billable work can use 10–15%." },
        { question: "Why add a profit margin on top of overhead?", answer: "Overhead covers break-even costs; profit is what lets you invest in growth, weather dry spells, save for retirement, and build a buffer. A 10–20% profit margin makes the rate sustainable long-term." },
        { question: "How many hours per year should I plan for?", answer: "A 40-hour week for 50 working weeks = 2,000 hours. But not all are billable, admin, sales, and professional development are real costs. Using 1,500–1,800 billable hours is more realistic for most knowledge workers." },
        { question: "Should I use this rate for every project?", answer: "Use it as a floor. Charge more for specialist expertise, tight deadlines, or complex projects. Never quote below your calculated rate, doing so erodes value and makes the work unprofitable." },
        { question: "What is the 2x salary rule for freelance rates?", answer: "A quick check: take the equivalent employee salary, divide by 2,080 hours, and double it. A $60,000 salary becomes $28.85 an hour, doubled to $57.69. The doubling roughly covers self-employment tax, benefits, and non-billable time. Use it as a sanity check, then calculate your real rate from your own costs." },
        { question: "What is the difference between my minimum rate and my recommended rate?", answer: "The minimum rate covers your income goal and nothing else. The recommended rate adds overhead and profit on top. In this calculator's example, a $90,000 goal on 2,000 hours gives a $45 base rate, $54 with 20% overhead, and a $59.40 recommended rate with 10% profit. Quote the recommended rate; treat the base rate as a floor you never go below." },
        { question: "How many billable hours should I really plan for?", answer: "Fewer than you work. A 40-hour week for 50 weeks is 2,000 hours, but admin, sales, and time off are not billable. At 65% utilization, that is 1,300 billable hours, and a $90,000 goal then needs a $69.23 base rate before overhead and profit, not $45. Enter your honest billable hours for a rate you can actually live on." },
      ]}
    >
      <HourlyRateClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "hourly-rate-calculator", __enMetadata);
}
