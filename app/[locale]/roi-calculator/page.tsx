import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import RoiClient from "./RoiClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "ROI Calculator - Return on Investment | BeYourTools",
  description: "Calculate return on investment (ROI) percentage, net gain, and annualised ROI for any investment. Free tool in your browser.",
  keywords: "ROI calculator, return on investment calculator, investment return, net gain calculator, annualised ROI, investment performance",
  path: "/roi-calculator",
});

export default function RoiPage() {
  return (
    <FinanceToolPage
      slug="roi-calculator"
      title="ROI Calculator"
      cluster="Marketing & ROI"
      tagline="Calculate return on investment percentage, net gain, and annualised ROI for any investment, marketing campaign, real estate, stocks, or business project."
      description="Free ROI calculator. Enter investment cost and return value to calculate ROI percentage and net gain. Add a holding period to get the annualised (CAGR) return."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>ROI</strong> = (Return − Cost) ÷ Cost × 100</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Net Gain</strong> = Return − Cost</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Annualised ROI (CAGR)</strong> = (Return ÷ Cost)^(1÷Years) − 1</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Invested $10,000 · Returned $13,500 over 3 years<br />
            ROI = ($13,500 − $10,000) ÷ $10,000 = <strong>35%</strong> · Net gain = $3,500 · Annualised = (1.35)^(1/3) − 1 = <strong>10.5%/year</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What is a good ROI?", answer: "Context-dependent. Stock market average: about 10% annually before inflation, about 7% after inflation. Real estate: 8–12%. Marketing campaigns: 5:1 ($5 return per $1 spent = 400% ROI) is often cited as a minimum target. Compare against your cost of capital, not a universal benchmark." },
        { question: "What is the difference between ROI and CAGR?", answer: "ROI is total return over the full period regardless of time. CAGR (Compound Annual Growth Rate), the same as annualised ROI here, expresses the equivalent constant annual growth rate. A 35% ROI over 3 years = 10.5% CAGR. CAGR enables fair comparison across different holding periods." },
        { question: "How do I calculate ROI for a marketing campaign?", answer: "ROI = (Revenue from campaign − Campaign cost) ÷ Campaign cost × 100. If you spent $5,000 and generated $20,000 in revenue, ROI = ($20,000 − $5,000) ÷ $5,000 = 300%. For a cleaner measure of ad efficiency, use ROAS instead." },
        { question: "Does ROI account for the time value of money?", answer: "Simple ROI doesn't, a 100% ROI over 1 year is far better than the same ROI over 10 years. Use annualised ROI (CAGR) to compare investments across different time periods on an equal basis." },
        { question: "What does a negative ROI mean?", answer: "You lost money. A −20% ROI means you got back $0.80 for every $1 invested. Negative ROI doesn't always mean failure, sometimes it's acceptable for brand-building investments with long-term payoff, but it needs a clear strategic rationale." },
        { question: "How do I calculate the payback period?", answer: "Payback period = Investment cost / Annual net benefit. A $20,000 investment returning $6,000 a year pays for itself in 3.33 years. Payback ignores everything after the break-even point and ignores compounding, so use it alongside ROI, not instead of it." },
        { question: "What is the difference between ROI and profit margin?", answer: "ROI divides profit by cost, profit margin divides profit by revenue. The same $4,000 profit on a $10,000 cost is a 40% ROI, but on $14,000 of revenue it is a 28.57% profit margin. Both numbers describe the same $4,000, so always check which denominator a quoted percentage uses." },
        { question: "Can ROI be more than 100%?", answer: "Yes. Invest $20,000, get back $50,000 over 5 years, and ROI is (50,000 - 20,000) / 20,000 = 150%, or 20.11% a year annualised. A second example: $10,000 growing to $14,000 over 3 years is 40% ROI and 11.87% a year annualised, not 40 / 3 = 13.33%, because annualising compounds instead of dividing." },
      ]}
    >
      <RoiClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "roi-calculator", __enMetadata);
}
