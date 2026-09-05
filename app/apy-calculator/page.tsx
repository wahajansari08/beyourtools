import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import ApyClient from "./ApyClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "APY Calculator - Convert APR to Annual Percentage Yield | BeYourTools",
  description: "Convert an annual percentage rate (APR) to APY (Annual Percentage Yield) for any compounding frequency. See actual interest earned on any principal. Free, browser-based.",
  keywords: "APY calculator, APR to APY, annual percentage yield, compound interest rate, effective annual rate, savings account APY",
  path: "/apy-calculator",
});

export default function ApyPage() {
  return (
    <FinanceToolPage
      slug="apy-calculator"
      title="APY Calculator"
      cluster="Savings & Interest"
      tagline="Convert any APR to its true Annual Percentage Yield (APY) by selecting the compounding frequency, and see actual interest earned on your principal."
      description="Free APY calculator. Enter an APR and compounding frequency (daily, monthly, quarterly, etc.) to find the effective APY and project interest earned on any balance."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>APY</strong> = (1 + APR/n)ⁿ − 1</p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            Where n = number of compounding periods per year (365 for daily, 12 for monthly, etc.)
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> 5% APR compounded monthly → APY = (1 + 0.05/12)¹² − 1 = <strong>5.1162%</strong><br />
            5% APR compounded daily → APY = (1 + 0.05/365)³⁶⁵ − 1 = <strong>5.1267%</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What is the difference between APR and APY?", answer: "APR is the stated annual rate without compounding. APY accounts for compounding, interest earned on interest. APY is always ≥ APR. When comparing savings accounts, use APY. When comparing loans (where APR understates the cost), also prefer APY." },
        { question: "Why do banks advertise APY for savings and APR for loans?", answer: "Because APY > APR when compounding occurs, banks advertise APY on savings accounts to show a higher number, and APR on loans to show a lower number. Both are legally required disclosures, but always convert to the same metric when comparing." },
        { question: "How much does compounding frequency matter in practice?", answer: "For most savings products, the difference between daily and monthly compounding is small. At 5% APR: monthly APY = 5.1162%; daily APY = 5.1267%. The difference grows with higher rates and longer time periods but is rarely the deciding factor." },
        { question: "What is the effective annual rate (EAR)?", answer: "EAR is another name for APY, the true annual return accounting for compounding. The formula is identical: EAR = (1 + r/n)ⁿ − 1. Finance textbooks use EAR; banking regulators in the US use APY." },
        { question: "How do I compare two savings accounts with different APYs?", answer: "Simply compare APYs directly, the higher APY account earns more, regardless of how the rate is compounded. APY is standardised for comparison. For identical APYs, check for fees, minimum balance requirements, and withdrawal restrictions." },
      ]}
    >
      <ApyClient />
    </FinanceToolPage>
  );
}
