import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import LoanPaymentClient from "./LoanPaymentClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "Loan Payment Calculator - Monthly Payment, Total Interest | BeYourTools",
  description: "Calculate your monthly loan payment, total amount paid, and total interest for any loan amount, interest rate, and term. Free, browser-based, instant results.",
  keywords: "loan payment calculator, monthly loan payment, loan calculator, mortgage payment calculator, auto loan calculator, personal loan calculator",
  path: "/loan-payment-calculator",
});

export default function LoanPaymentPage() {
  return (
    <FinanceToolPage
      slug="loan-payment-calculator"
      title="Loan Payment Calculator"
      cluster="Loans"
      tagline="Enter loan amount, interest rate, and term to instantly see your monthly payment, total amount paid, and total interest cost."
      description="Free loan payment calculator. Uses the standard amortization formula to calculate monthly payment, total repayment, and total interest for any loan."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Monthly Payment (M)</strong> = P × [r(1+r)ⁿ] ÷ [(1+r)ⁿ − 1]</p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            Where P = principal, r = monthly rate (annual rate ÷ 12), n = total months (years × 12)
          </p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Total Paid</strong> = Monthly Payment × n</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Total Interest</strong> = Total Paid − Principal</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $25,000 at 6.5% over 5 years (60 months)<br />
            r = 0.065 ÷ 12 = 0.005417 → M = $488.85 → Total paid = $29,331 → Interest = <strong>$4,331</strong>
          </p>
        </>
      }
      faqs={[
        { question: "What inputs does this calculator need?", answer: "Three: the loan principal (amount borrowed), the annual interest rate as a percentage, and the loan term in years. For a mortgage at 7% over 30 years on $300,000, the monthly payment is $1,996." },
        { question: "Does this work for mortgages, auto loans, and personal loans?", answer: "Yes, the amortization formula is the same for all fixed-rate instalment loans. Just enter the correct principal, rate, and term for your specific loan type." },
        { question: "What is the difference between interest rate and APR?", answer: "The interest rate is used to calculate your payment. APR includes the interest rate plus fees (origination, points, insurance) expressed as an annual rate. For a true cost comparison between lenders, use APR. For payment calculation, use the stated interest rate." },
        { question: "How does loan term affect total interest paid?", answer: "A longer term reduces monthly payments but dramatically increases total interest. A $20,000 loan at 7% costs $1,277 in interest over 2 years but $7,753 over 5 years. Shorter terms always cost less overall." },
        { question: "What happens if I make extra payments?", answer: "Extra payments reduce principal faster, cutting total interest and shortening the loan. Even one extra payment per year can save thousands. Use the Extra Payment Loan Calculator to see the exact savings." },
        { question: "Why is my first payment mostly interest?", answer: "With standard amortization, each payment's interest portion is: remaining balance × monthly rate. At the start the balance is highest, so interest is highest. As principal falls, less goes to interest and more to principal, this reverses near the end of the term." },
      ]}
    >
      <LoanPaymentClient />
    </FinanceToolPage>
  );
}
