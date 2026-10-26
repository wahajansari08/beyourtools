import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import CommissionClient from "./CommissionClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Commission Calculator: Flat & Tiered Sales Commission | BeYourTools",
  description: "Free commission calculator. Work out flat-rate or tiered sales commission, graduated vs retroactive tiers, effective rate, and total pay with base salary.",
  keywords: "commission calculator, sales commission, tiered commission, flat rate commission, commission earnings, sales pay, graduated commission, effective commission rate",
  path: "/commission-calculator",
});

export default function CommissionPage() {
  return (
    <FinanceToolPage
      slug="commission-calculator"
      title="Commission Calculator"
      cluster="Business Finance"
      tagline="Calculate flat-rate or tiered sales commission earnings, with optional base salary, to find your total pay for any period, and check whether your plan pays graduated or retroactive tiers."
      description="Free commission calculator supporting flat-rate and tiered structures. Enter sales amount, commission rate or tiers, and optional base salary to calculate total earnings, and compare graduated tiers against a single flat rate."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Flat Commission</strong> = Sales Amount × (Commission Rate ÷ 100)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Tiered Commission</strong>, each slice of sales is paid at the rate for its bracket (like progressive income tax brackets). Higher brackets apply only to sales above the threshold.</p>
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
        { question: "What is the difference between graduated and retroactive tiers?", answer: "Graduated tiers pay each rate only on the sales inside its bracket. Retroactive tiers apply the highest rate you reached to every dollar. On $40,000 of sales with brackets of 5% to $10,000, 7% to $25,000, and 10% above, graduated commission is $500 + $1,050 + $1,500 = $3,050, while retroactive commission is 10% of $40,000 = $4,000. Always confirm which type your plan uses before comparing offers." },
        { question: "What is my effective commission rate?", answer: "Total commission ÷ total sales. On the $40,000 example above, $3,050 ÷ $40,000 = 7.6%. The effective rate is the single number to compare against a flat-rate offer: if a flat offer pays 8% on the same sales, it beats that tiered plan." },
        { question: "What should I check before accepting a commission plan?", answer: "Five things: the base salary and quota that define OTE, whether tiers are graduated or retroactive, any cap on total commission, clawbacks when a customer refunds or cancels, and when commission is actually paid (on booking, on invoice, or on cash collection). A high headline rate with a cap and clawbacks can pay less than a lower uncapped rate." },
      ]}
    >
      <CommissionClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "commission-calculator", __enMetadata);
}
