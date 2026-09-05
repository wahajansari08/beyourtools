import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import RoasClient from "./RoasClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "ROAS Calculator - Return on Ad Spend for Any Campaign | BeYourTools",
  description: "Calculate ROAS (Return on Ad Spend) for any advertising campaign. Enter revenue and ad spend, add your gross margin to see profitability and break-even ROAS. Free, instant.",
  keywords: "ROAS calculator, return on ad spend, advertising ROI, Facebook ads ROAS, Google ads ROAS, marketing profitability, break-even ROAS",
  path: "/roas-calculator",
});

export default function RoasPage() {
  return (
    <FinanceToolPage
      slug="roas-calculator"
      title="ROAS Calculator"
      cluster="Marketing & ROI"
      tagline="Calculate return on ad spend for any campaign, and add your gross margin to instantly see profitability and the break-even ROAS you need to target."
      description="Free ROAS calculator. Enter ad revenue and spend to calculate ROAS ratio. Add gross margin to find campaign profit and the break-even ROAS threshold."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>ROAS</strong> = Revenue from Ads ÷ Ad Spend</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Break-Even ROAS</strong> = 1 ÷ Gross Margin (as decimal) = 100 ÷ Margin%</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Profit</strong> = Revenue × Gross Margin% − Ad Spend</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Revenue $20,000 · Ad Spend $5,000 · Gross Margin 30%<br />
            ROAS = 20,000 ÷ 5,000 = <strong>4.0</strong> · Break-even = 100 ÷ 30 = <strong>3.33</strong> · Profit = $6,000 − $5,000 = <strong>$1,000</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What is a good ROAS?", answer: "Break-even ROAS depends on your gross margin. At 25% margin: break-even = 4.0. At 33% margin: break-even = 3.0. At 50% margin: break-even = 2.0. A 'good' ROAS is anything comfortably above your break-even, typically 4:1 to 8:1 for e-commerce." },
        { question: "What is the difference between ROAS and ROI?", answer: "ROAS measures gross revenue per ad dollar spent, it ignores all other costs. ROI measures net profit relative to total investment. A 4:1 ROAS sounds impressive but may be unprofitable if COGS is 70%. Always check ROAS against your break-even before judging campaign performance." },
        { question: "How do I calculate break-even ROAS?", answer: "Break-even ROAS = 1 ÷ Gross Margin. At 25% gross margin: 1 ÷ 0.25 = 4.0. This means you need $4 in revenue for every $1 in ad spend just to cover the cost of goods and ads. Any ROAS above this is profitable." },
        { question: "Why is my ROAS high but I'm still losing money?", answer: "ROAS only accounts for ad spend versus revenue. It ignores COGS, fulfilment, customer service, returns, overheads, and other expenses. A 5:1 ROAS at 15% gross margin only returns $0.75 revenue after COGS per $1 of ad spend, still a loss after factoring in other costs." },
        { question: "How do platforms like Meta and Google report ROAS?", answer: "Ad platforms report 'Purchase ROAS' = Purchase conversion value ÷ Amount spent, measured by their pixel/conversion tracking. Attribution window differences (1-day vs. 7-day click) and data discrepancies between platforms and your actual revenue data are common, so always reconcile with backend sales." },
      ]}
    >
      <RoasClient />
    </FinanceToolPage>
  );
}
