import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import BreakEvenClient from "./BreakEvenClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Break-Even Calculator — Units & Revenue to Break Even | BeYourTools",
  description:
    "Calculate your break-even point in units and revenue. Enter fixed costs, selling price, and variable cost per unit. Optionally find units needed for a target profit.",
  keywords: "break even calculator, break even point, fixed costs, variable costs, contribution margin, break even analysis",
  alternates: { canonical: `${SITE.url}/break-even-calculator` },
  robots: { index: true, follow: true },
};

export default function BreakEvenPage() {
  return (
    <FinanceToolPage
      slug="break-even-calculator"
      title="Break-Even Calculator"
      cluster="Business Finance"
      tagline="Find exactly how many units you need to sell — and how much revenue to generate — to cover all your fixed and variable costs."
      description="Free break-even calculator. Enter fixed costs, selling price per unit, and variable cost per unit to find your break-even point in units and revenue, plus the contribution margin."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Contribution Margin per Unit</strong> = Selling Price − Variable Cost per Unit</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Break-Even Units</strong> = Fixed Costs ÷ Contribution Margin per Unit</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Break-Even Revenue</strong> = Break-Even Units × Selling Price</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Units for Target Profit</strong> = (Fixed Costs + Target Profit) ÷ Contribution Margin per Unit</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Fixed costs $10,000 · Price $25 · Variable cost $10<br />
            Contribution margin = $15 · Break-even = 10,000 ÷ 15 = <strong>667 units</strong> ($16,667 revenue)
          </p>
        </>
      }
      faqs={[
        {
          question: "What is the break-even point?",
          answer: "The break-even point is the sales volume at which total revenue equals total costs — neither profit nor loss. Below it you're losing money; above it every additional unit generates profit equal to the contribution margin.",
        },
        {
          question: "What counts as a fixed cost?",
          answer: "Fixed costs stay the same regardless of output: rent, annual software licences, salaries of permanent staff, insurance, loan repayments, and depreciation. They don't change whether you sell 1 unit or 1,000.",
        },
        {
          question: "What counts as a variable cost?",
          answer: "Variable costs change directly with production volume: raw materials, packaging, payment processing fees, direct commission, and shipping. Each additional unit adds exactly the variable cost per unit.",
        },
        {
          question: "How can I lower my break-even point?",
          answer: "Three ways: raise your selling price (increases contribution margin), reduce variable costs (also increases contribution margin), or cut fixed costs. Raising prices is typically the fastest lever.",
        },
        {
          question: "What is contribution margin ratio?",
          answer: "Contribution margin ratio = Contribution Margin ÷ Selling Price. It tells you what percentage of each sales dollar is available to cover fixed costs and then profit. A 60% CMR means $0.60 of every dollar sold contributes to fixed costs.",
        },
        {
          question: "Can the break-even point be in revenue rather than units?",
          answer: "Yes — especially useful for service businesses with no single unit price. Break-even revenue = Fixed Costs ÷ Contribution Margin Ratio. This calculator shows both automatically.",
        },
      ]}
    >
      <BreakEvenClient />
    </FinanceToolPage>
  );
}
