import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import CommissionClient from "./CommissionClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Commission Calculator - Flat Rate & Tiered Sales Commission | BeYourTools",
  description:
    "Calculate sales commission earnings for flat-rate or tiered commission structures. Add a base salary to find total pay. Free, instant, browser-based.",
  keywords: "commission calculator, sales commission, tiered commission, flat rate commission, commission earnings, sales pay",
  alternates: { canonical: `${SITE.url}/commission-calculator` },
  robots: { index: true, follow: true },
};

export default function CommissionPage() {
  return (
    <FinanceToolPage
      slug="commission-calculator"
      title="Commission Calculator"
      cluster="Business Finance"
      tagline="Calculate flat-rate or tiered sales commission earnings, with optional base salary, to find your total pay for any period."
      description="Free commission calculator supporting flat-rate and tiered structures. Enter sales amount, commission rate or tiers, and optional base salary to calculate total earnings."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Flat Commission</strong> = Sales Amount × (Commission Rate ÷ 100)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Tiered Commission</strong>, each dollar of sales is taxed at the rate for its bracket (like progressive income tax). Higher brackets apply only to sales above the threshold.</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Total Pay</strong> = Base Salary + Commission Earned</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example (flat):</strong> $15,000 sales at 10% = <strong>$1,500 commission</strong>.<br />
            <strong>Example (tiered):</strong> First $10k at 5% ($500) + next $5k at 8% ($400) = <strong>$900 commission</strong>.
          </p>
        </>
      }
      faqs={[
        { question: "What is the difference between flat and tiered commission?", answer: "Flat commission applies a single rate to all sales. Tiered commission uses different rates for different sales bands, higher sales unlock higher rates on the amounts above each threshold, incentivising overachievement." },
        { question: "How does tiered commission work?", answer: "Like progressive tax brackets, each dollar of sales is taxed at the rate for its band. If the first $10,000 is at 5% and sales above are at 8%, a $15,000 salesperson earns $500 (on the first $10k) + $400 (on the next $5k) = $900." },
        { question: "Is commission taxed differently to salary?", answer: "In most countries, commission is taxed as ordinary income, the same as salary. The withholding method may differ (some employers withhold at a flat supplemental rate), but at year-end it's all combined on your tax return." },
        { question: "What is a typical sales commission rate?", answer: "Rates vary widely: retail 1–5%, real estate 2.5–3% per side, insurance 5–15%, SaaS software 8–12%, financial products 20–30%. Benchmark against your industry and ensure the OTE (on-target earnings) is competitive." },
        { question: "What is OTE (On-Target Earnings)?", answer: "OTE = Base Salary + Commission at 100% quota achievement. It represents what a rep earning their full quota makes. Most reps achieve 60–80% of quota, so realistic earnings are typically 60–80% of OTE." },
      ]}
    >
      <CommissionClient />
    </FinanceToolPage>
  );
}
