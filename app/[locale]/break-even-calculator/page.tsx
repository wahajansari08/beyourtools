import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import BreakEvenClient from "./BreakEvenClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Break-Even Calculator: Units, Revenue & Margin of Safety | BeYourTools",
  description: "Free break-even calculator. Find break-even units and revenue from fixed costs, price, and variable cost, plus units for a target profit and margin of safety.",
  keywords: "break even calculator, break even point, fixed costs, variable costs, contribution margin, break even analysis, margin of safety, target profit units",
  path: "/break-even-calculator",
});

export default function BreakEvenPage() {
  return (
    <FinanceToolPage
      slug="break-even-calculator"
      title="Break-Even Calculator"
      cluster="Business Finance"
      tagline="Find exactly how many units you need to sell, and how much revenue to generate, to cover all your fixed and variable costs, then test a target profit and your margin of safety on top."
      description="Free break-even calculator. Enter fixed costs, selling price per unit, and variable cost per unit to find your break-even point in units and revenue, plus the contribution margin, units needed for a target profit, and margin of safety."
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
          answer: "The break-even point is the sales volume at which total revenue equals total costs, neither profit nor loss. Below it you're losing money; above it every additional unit generates profit equal to the contribution margin.",
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
          answer: "Yes, especially useful for service businesses with no single unit price. Break-even revenue = Fixed Costs ÷ Contribution Margin Ratio. This calculator shows both automatically.",
        },
        {
          question: "How many units do I need to sell for a target profit?",
          answer: "Add the target profit to fixed costs before dividing: Units = (Fixed Costs + Target Profit) ÷ Contribution Margin per Unit. Using the example above, a $5,000 target profit needs (10,000 + 5,000) ÷ 15 = 1,000 units, which is $25,000 in revenue at $25 per unit.",
        },
        {
          question: "What is margin of safety?",
          answer: "Margin of safety is how far sales can fall before you start losing money: (Expected Sales − Break-Even Sales) ÷ Expected Sales. If you expect 800 units and break even at 667, your margin of safety is (800 − 667) ÷ 800 = 16.6%. A thin margin of safety means a small sales dip wipes out profit.",
        },
        {
          question: "Why is break-even rounded up to whole units?",
          answer: "You cannot sell part of a unit. In the example above, 10,000 ÷ 15 = 666.7 units, so the answer is 667. At 666 units you are still $10 short of covering fixed costs; the 667th unit is the first one that puts you in profit.",
        },
      ]}
    >
      <BreakEvenClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "break-even-calculator", __enMetadata);
}
