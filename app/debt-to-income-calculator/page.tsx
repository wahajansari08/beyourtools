import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import DebtToIncomeClient from "./DebtToIncomeClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "Debt-to-Income Calculator - DTI Ratio for Loan Qualification | BeYourTools",
  description: "Calculate your debt-to-income (DTI) ratio to understand your borrowing capacity and loan qualification prospects. Includes front-end and back-end DTI. Free, browser-based.",
  keywords: "debt to income calculator, DTI calculator, debt to income ratio, mortgage DTI, loan qualification, back end ratio, front end ratio",
  path: "/debt-to-income-calculator",
});

export default function DebtToIncomePage() {
  return (
    <FinanceToolPage
      slug="debt-to-income-calculator"
      title="Debt-to-Income Calculator"
      cluster="Debt & Credit"
      tagline="Calculate your debt-to-income (DTI) ratio to see how lenders view your financial health and whether you're likely to qualify for a mortgage or other loan."
      description="Free DTI calculator. Enter monthly gross income and all monthly debt payments to calculate your front-end and back-end debt-to-income ratios with a clear qualification assessment."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Back-End DTI</strong> = Total Monthly Debt Payments ÷ Gross Monthly Income × 100</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Front-End DTI</strong> = Monthly Housing Cost ÷ Gross Monthly Income × 100</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> Income $6,000/mo · Mortgage $1,500 · Car $400 · Credit cards $200 = Total debt $2,100<br />
            Back-end DTI = $2,100 ÷ $6,000 = <strong>35%</strong> · Front-end = $1,500 ÷ $6,000 = <strong>25%</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What is a good DTI ratio?", answer: "Below 36% is generally considered good. Below 20% is excellent. Most conventional mortgage lenders cap back-end DTI at 43–45%. FHA loans allow up to 50% in some cases. Lower DTI = better loan terms and more lender options." },
        { question: "What is the difference between front-end and back-end DTI?", answer: "Front-end DTI (housing ratio) includes only housing costs: mortgage/rent, property tax, insurance, HOA. Back-end DTI includes all monthly debt: housing + car loans + student loans + credit card minimums + any other obligations." },
        { question: "What counts as debt for DTI purposes?", answer: "Monthly minimum payments on: mortgage/rent, auto loans, student loans, credit card balances, personal loans, child support/alimony, and any other regular debt obligation. Utilities, groceries, insurance premiums, and subscriptions are NOT included." },
        { question: "How do I lower my DTI to qualify for a mortgage?", answer: "Pay down debt to reduce monthly obligations (especially credit cards), increase income, avoid taking on new debt before applying, or save a larger down payment to borrow less. Even closing paid-off cards can temporarily help by removing the minimum payment obligation." },
        { question: "Does rental income count toward income for DTI?", answer: "Usually yes, most lenders count 75% of gross rental income to account for vacancies. Self-employment income typically uses a 2-year average from tax returns. Verify with your lender which income sources they accept." },
      ]}
    >
      <DebtToIncomeClient />
    </FinanceToolPage>
  );
}
