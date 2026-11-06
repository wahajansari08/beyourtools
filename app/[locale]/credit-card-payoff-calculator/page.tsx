import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import CreditCardPayoffClient from "./CreditCardPayoffClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Credit Card Payoff Calculator - Months to Pay Off & Total Interest | BeYourTools",
  description: "Find out how long it takes to pay off your credit card balance and the total interest paid at a fixed monthly payment. See the minimum-payment trap and test a higher payment.",
  keywords: "credit card payoff calculator, credit card interest calculator, pay off credit card, credit card debt, APR calculator, minimum payment trap, payoff time",
  path: "/credit-card-payoff-calculator",
});

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
            Continue... → paid off in approximately <strong>34 months</strong> with $1,632 interest
          </p>
        </>
      }
      faqs={[
        { question: "How does credit card interest compound?", answer: "Most credit cards compound interest daily. The daily periodic rate = APR ÷ 365. It's applied to your average daily balance each day, then charged to your account monthly. This calculator uses monthly compounding as a close approximation." },
        { question: "What happens if I only pay the minimum?", answer: "Minimum payments are typically 1–2% of balance or a fixed amount (e.g. $25), whichever is higher, and the payment shrinks as the balance falls, which is why it takes so long. On a $5,000 balance at 20% APR with a minimum of 2% of the balance (and a $25 floor), paying only minimums takes about 44 years and costs about $20,200 in interest, four times the original balance. Use the Minimum Payment Calculator to see this on your own numbers." },
        { question: "How much do I need to pay to clear a card in 12 months?", answer: "For a $5,000 balance at 20.99% APR to be paid off in exactly 12 months, you need about $466 a month. At $463 a month the payoff slips to 13 months with a small final payment. Use trial-and-error in the calculator to find your target payment for any specific timeframe." },
        { question: "Does the APR change affect payments much?", answer: "Yes, significantly. On a $5,000 balance at $150 a month, the difference between 15% and 25% APR is about $2,100 in extra interest: $1,509 at 15% versus $3,625 at 25%, and the payoff stretches from 44 months to 58 months. Getting a lower-rate balance transfer or personal loan can meaningfully reduce your total cost." },
        { question: "Should I pay more than the minimum even if I can't pay the full balance?", answer: "Absolutely. Every extra dollar above the minimum directly reduces principal, cutting the interest on every future month. Paying $50 more per month on a typical card can cut years off the payoff timeline." },
        { question: "What if my monthly payment does not cover the interest?", answer: "Then the balance grows instead of shrinking, and no payoff is possible at that payment. This calculator tells you so directly: it shows an error naming the monthly interest charge and asks you to increase the payment. For a $5,000 balance at 20.99%, one month of interest is $87.46, so any payment at or below that cannot reduce the balance." },
        { question: "Does the calculator use daily or monthly compounding?", answer: "Monthly, as a close approximation: each month's interest is the balance times APR divided by 12. Issuers actually compound daily on your average daily balance, so a real statement can differ by a few dollars, but the payoff time and total interest are very close. If your statement shows a different interest figure for the same balance and APR, daily compounding is the reason." },
        { question: "How much does paying $50 more a month save?", answer: "A lot, because the extra goes straight to principal. On a $5,000 balance at 20.99% APR, $200 a month takes 34 months and costs $1,632 in interest. At $250 a month it takes 25 months and costs $1,207: nine months sooner and about $425 less interest, for $50 more a month." },
      ]}
    >
      <CreditCardPayoffClient />
    </FinanceToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "credit-card-payoff-calculator", __enMetadata);
}
