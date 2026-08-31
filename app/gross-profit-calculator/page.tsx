import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import GrossProfitClient from "./GrossProfitClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gross Profit Calculator — Gross Profit & Gross Margin % | BeYourTools",
  description:
    "Calculate gross profit and gross profit margin from revenue and cost of goods sold (COGS). Fast, free, and browser-based with no sign-up required.",
  keywords: "gross profit calculator, gross margin calculator, cogs, revenue, gross profit formula",
  alternates: { canonical: `${SITE.url}/gross-profit-calculator` },
  robots: { index: true, follow: true },
};

export default function GrossProfitPage() {
  return (
    <FinanceToolPage
      slug="gross-profit-calculator"
      title="Gross Profit Calculator"
      cluster="Business Finance"
      tagline="Calculate gross profit and gross margin percentage from revenue and cost of goods sold in seconds."
      description="Free gross profit calculator. Enter total revenue and COGS to instantly calculate gross profit in dollars and gross profit margin as a percentage."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Gross Profit</strong> = Revenue − Cost of Goods Sold (COGS)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Gross Margin %</strong> = (Gross Profit ÷ Revenue) × 100</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Revenue $200,000 · COGS $120,000<br />
            Gross Profit = $80,000 · Gross Margin = 80,000 ÷ 200,000 = <strong>40%</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What does gross profit tell you?", answer: "Gross profit shows how much revenue remains after covering the direct costs of producing your product or service. It funds all your other expenses — salaries, marketing, rent — and eventually profit." },
        { question: "What is included in COGS?", answer: "COGS includes direct production costs: raw materials, direct labour, manufacturing overhead, and inbound freight. It excludes operating expenses like marketing, office rent, and management salaries." },
        { question: "What is a healthy gross margin by industry?", answer: "Software and SaaS: 60–80%. Retail: 25–50%. Manufacturing: 25–35%. Restaurants: 60–70% (on food cost alone). Always compare against your industry peers." },
        { question: "How is gross profit different from net profit?", answer: "Gross profit only deducts COGS from revenue. Net profit deducts everything — operating expenses, interest, and taxes. A business can have strong gross profit but poor net profit if overhead is high." },
        { question: "Can gross profit be negative?", answer: "Yes — if COGS exceeds revenue, gross profit is negative. This means each unit sold costs more to make than it earns, which is unsustainable and signals a pricing or cost problem." },
      ]}
    >
      <GrossProfitClient />
    </FinanceToolPage>
  );
}
