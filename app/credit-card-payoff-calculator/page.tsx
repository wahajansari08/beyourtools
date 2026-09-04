import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import CreditCardPayoffClient from "./CreditCardPayoffClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Credit Card Payoff Calculator - Time & Interest to Pay Off Card | BeYourTools",
  description:
    "Find out how long it takes to pay off your credit card balance and total interest paid at a fixed monthly payment. Free, instant, browser-based credit card payoff calculator.",
  keywords: "credit card payoff calculator, credit card interest calculator, pay off credit card, credit card debt, APR calculator",
  alternates: { canonical: `${SITE.url}/credit-card-payoff-calculator` },
  robots: { index: true, follow: true },
};

export default function CreditCardPayoffPage() {
  return (
    <FinanceToolPage
      slug="credit-card-payoff-calculator"
      title="Credit Card Payoff Calculator"
      cluster="Debt & Credit"
      tagline="Enter your balance, APR, and monthly payment to see exactly how many months until your card is paid off and how much interest you'll pay in total."
      description="Free credit card payoff calculator. Enter balance, APR, and monthly payment to calculate payoff time in months, total interest paid, and total amount paid."
      formulaExplanation={
        <>
          <p>Credit cards use simple monthly interest on the average daily balance. This calculator approximates it as:</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Monthly Interest</strong> = Balance × (APR ÷ 12)</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>New Balance</strong> = Balance + Monthly Interest − Payment</p>
          <p>Repeat until balance = 0. Count the months.</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $5,000 at 20.99% APR · $200/month<br />
            Month 1 interest = $5,000 × 0.01749 = $87.46 → Balance after payment = $4,887.46<br />
            Continue... → paid off in approximately <strong>31 months</strong> with $1,190 interest
          </p>
        </>
      }
      faqs={[
        { question: "How does credit card interest compound?", answer: "Most credit cards compound interest daily. The daily periodic rate = APR ÷ 365. It's applied to your average daily balance each day, then charged to your account monthly. This calculator uses monthly compounding as a close approximation." },
        { question: "What happens if I only pay the minimum?", answer: "Minimum payments are typically 1–2% of balance or a fixed amount (e.g. $25), whichever is higher. On a $5,000 balance at 20% APR paying only minimums, payoff takes 20+ years and costs over $5,000 in interest. Use the Minimum Payment Calculator to see this." },
        { question: "How much do I need to pay to clear a card in 12 months?", answer: "For a $5,000 balance at 20.99% APR to be paid off in exactly 12 months, you'd need approximately $463/month. Use trial-and-error in the calculator to find your target payment for any specific timeframe." },
        { question: "Does the APR change affect payments much?", answer: "Yes, significantly. On a $5,000 balance, the difference between 15% and 25% APR at $150/month is over $700 in extra interest. Getting a lower-rate balance transfer or personal loan can meaningfully reduce your total cost." },
        { question: "Should I pay more than the minimum even if I can't pay the full balance?", answer: "Absolutely. Every extra dollar above the minimum directly reduces principal, cutting the interest on every future month. Paying $50 more per month on a typical card can cut years off the payoff timeline." },
      ]}
    >
      <CreditCardPayoffClient />
    </FinanceToolPage>
  );
}
