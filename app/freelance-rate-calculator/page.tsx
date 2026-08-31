import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import FreelanceRateClient from "./FreelanceRateClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Freelance Rate Calculator — Minimum Hourly Rate for Freelancers | BeYourTools",
  description:
    "Calculate the minimum hourly freelance rate you need to charge to hit your income goal after taxes, business expenses, and non-billable time. Free, browser-based.",
  keywords: "freelance rate calculator, freelancer hourly rate, self employed rate, minimum hourly rate, freelance pricing, contractor rate",
  alternates: { canonical: `${SITE.url}/freelance-rate-calculator` },
  robots: { index: true, follow: true },
};

export default function FreelanceRatePage() {
  return (
    <FinanceToolPage
      slug="freelance-rate-calculator"
      title="Freelance Rate Calculator"
      cluster="Salary & Income"
      tagline="Find the minimum hourly rate you need to charge to achieve your desired take-home income after taxes, business expenses, and realistic billable hours."
      description="Free freelance rate calculator for self-employed professionals. Enter desired net income, business expenses, tax rates, and billable hours to find your minimum sustainable hourly rate."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Required Annual Gross</strong> = (Desired Net Income + Business Expenses) ÷ (1 − Total Tax Rate)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Hourly Rate</strong> = Required Annual Gross ÷ Billable Hours per Year</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Day Rate</strong> = Hourly Rate × 8</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Want $80k net · $5k expenses · 37.3% total tax · 1,200 billable hours<br />
            Gross needed = ($80k + $5k) ÷ 0.627 = $135,565 → Hourly = $135,565 ÷ 1,200 = <strong>~$113/hr</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What are billable hours and how many should I use?", answer: "Billable hours are the hours clients actually pay for. Most freelancers bill 60–75% of their working hours — the rest goes to admin, marketing, unpaid revisions, and professional development. 1,000–1,400 hours/year is realistic for a full-time freelancer." },
        { question: "Why is the self-employment tax 15.3%?", answer: "Employees split FICA taxes with their employer — each paying 7.65%. Self-employed people pay both halves: 12.4% Social Security (up to the wage base) + 2.9% Medicare = 15.3% total. You can deduct half of SE tax when calculating income tax." },
        { question: "How much should I add as a buffer?", answer: "Add 15–25% to your minimum rate. Freelancing involves unpaid admin time, late-paying clients, project gaps, unexpected expenses, and dry spells. The minimum rate is break-even; your actual rate should build in profit and stability." },
        { question: "Should I charge hourly or project-based?", answer: "Project-based pricing is usually more profitable — it rewards efficiency and aligns with client value. Use your hourly rate as a floor when estimating project costs: estimate hours × rate, then add a scope buffer of 20–30%." },
        { question: "What counts as a business expense?", answer: "Deductible freelance expenses: software subscriptions, home office (proportional rent/utilities), professional equipment, health insurance premiums, retirement contributions (SEP-IRA/solo 401k), professional development, and accountant fees." },
        { question: "How does my rate compare to a salaried equivalent?", answer: "To compare fairly, add 25–40% to any salaried offer to account for self-employment taxes, no employer benefits (health insurance, retirement match, paid leave), and income volatility. A $100k salary is roughly equivalent to $125–140k freelance gross." },
      ]}
    >
      <FreelanceRateClient />
    </FinanceToolPage>
  );
}
