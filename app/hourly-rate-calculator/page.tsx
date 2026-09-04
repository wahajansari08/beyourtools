import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import HourlyRateClient from "./HourlyRateClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hourly Rate Calculator - Minimum Rate to Meet Your Income Goal | BeYourTools",
  description:
    "Calculate the minimum hourly rate needed to reach your annual income goal, with overhead and profit buffers built in. Ideal for freelancers, consultants, and contractors.",
  keywords: "hourly rate calculator, minimum hourly rate, income goal calculator, consultant rate, contractor rate, freelance pricing",
  alternates: { canonical: `${SITE.url}/hourly-rate-calculator` },
  robots: { index: true, follow: true },
};

export default function HourlyRatePage() {
  return (
    <FinanceToolPage
      slug="hourly-rate-calculator"
      title="Hourly Rate Calculator"
      cluster="Salary & Income"
      tagline="Find the minimum hourly rate you must charge to meet your annual income goal, with separate overhead and profit buffers to arrive at a truly sustainable rate."
      description="Free hourly rate calculator. Enter your annual income goal, hours worked, overhead percentage, and profit margin to see your base rate and recommended sustainable hourly rate."
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
      ]}
    >
      <HourlyRateClient />
    </FinanceToolPage>
  );
}
