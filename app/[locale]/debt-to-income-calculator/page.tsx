import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import DebtToIncomeClient from "./DebtToIncomeClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Debt-to-Income Calculator - DTI Ratio | BeYourTools",
  description: "Calculate your debt-to-income (DTI) ratio to check loan qualification. Includes front-end and back-end DTI ratios in your browser.",
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
        { question: "How do I lower my DTI to qualify for a mortgage?", answer: "Pay down debt to reduce monthly obligations (especially credit cards), increase income, avoid taking on new debt before applying, or save a larger down payment to borrow less. Closing a paid-off card does not help: a $0 balance already carries a $0 minimum payment, so closing it removes nothing from your DTI, and it can hurt your credit score by cutting your available credit." },
        { question: "Does rental income count toward income for DTI?", answer: "Usually yes, most lenders count 75% of gross rental income to account for vacancies. Self-employment income typically uses a 2-year average from tax returns. Verify with your lender which income sources they accept." },
        { question: "What is the 28/36 rule?", answer: "It is the traditional lender guideline: front-end DTI (housing only) at or below 28%, and back-end DTI (all debts) at or below 36%. This calculator uses the same bands in its labels: up to 28% is good, up to 36% is acceptable, up to 43% is borderline. Many lenders now approve above 36% with compensating factors, but the 28/36 rule is still a useful target when you are planning a mortgage application." },
        { question: "How much more debt can I afford before lenders say no?", answer: "Work from the 43% back-end cap many lenders use as a ceiling. With $6,000 of gross monthly income, 43% allows up to $2,580 of total monthly debt payments. If you already pay $2,100 a month, that leaves about $480 a month of headroom. That is a ceiling, not a recommendation: a lower DTI usually means better loan terms." },
        { question: "Which debt counts as my housing cost for front-end DTI?", answer: "This calculator takes the housing cost from the first debt row, labelled Mortgage / Rent, so keep that row first and put your full housing payment in it. If property tax, home insurance, HOA dues, or mortgage insurance are billed separately from your mortgage, add them into that same row so the front-end ratio reflects the whole housing cost. Deleting or reordering the first row changes what the front-end ratio measures." },
      ]}
    >
      <DebtToIncomeClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "debt-to-income-calculator", __enMetadata);
}
