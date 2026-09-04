import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import MinPaymentClient from "./MinPaymentClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Credit Card Minimum Payment Calculator - True Cost of Paying Minimums | BeYourTools",
  description:
    "See the shocking true cost of only making minimum payments on your credit card, how many years it takes and how much interest you pay in total. Free, browser-based.",
  keywords: "credit card minimum payment calculator, minimum payment interest, how long to pay off credit card minimums, credit card cost",
  alternates: { canonical: `${SITE.url}/credit-card-minimum-payment-calculator` },
  robots: { index: true, follow: true },
};

export default function MinPaymentPage() {
  return (
    <FinanceToolPage
      slug="credit-card-minimum-payment-calculator"
      title="Credit Card Minimum Payment Calculator"
      cluster="Debt & Credit"
      tagline="Discover the true cost of only making minimum payments, how many years you'll be paying and how much total interest you'll hand to the credit card company."
      description="Free credit card minimum payment calculator. Enter balance and APR to see how long minimum-only payments take to clear the card and the total interest cost."
      formulaExplanation={
        <>
          <p>Most credit card minimum payments = <strong style={{ color: "var(--text-secondary)" }}>Max(% of Balance, Floor Amount)</strong></p>
          <p>Each month: Monthly Interest = Balance × (APR ÷ 12); New Balance = Balance + Interest − Minimum Payment</p>
          <p>Because minimum payments shrink as the balance shrinks, the payoff period is very long, the balance declines slowly and interest consumes most of each payment.</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> $5,000 at 22.99% APR · 2% minimum (floor $25)<br />
            First min = $100 → as balance drops, minimums shrink → <strong>payoff takes 27+ years</strong>, total interest exceeds $5,500
          </p>
        </>
      }
      faqs={[
        { question: "Why do minimum payments take so long to pay off a balance?", answer: "Minimum payments are calculated as a small percentage of the current balance. As the balance shrinks, so does the minimum, but because the balance shrinks slowly (most of each payment goes to interest), it can take decades to reach zero." },
        { question: "What is the typical credit card minimum payment?", answer: "Most issuers charge the greater of: 1–3% of the current balance, or a flat minimum (usually $25–$35), or the interest charge plus $1. The exact formula varies by card, check your cardmember agreement." },
        { question: "How much do I need to pay to clear my card in 3 years?", answer: "Use the Credit Card Payoff Calculator with your balance and APR, then trial different payment amounts until payoff time = 36 months. For a $5,000 balance at 21% APR, about $180/month pays it off in 3 years." },
        { question: "Is making minimum payments ever acceptable?", answer: "Temporarily, during genuine financial hardship where cash flow is critical. Long-term, minimums are extremely costly and should be increased as soon as possible. Even an extra $25–50/month makes a significant difference." },
        { question: "How do balance transfers affect minimum payments?", answer: "A 0% promotional balance transfer eliminates the interest component, so minimum payments go almost entirely to principal, dramatically accelerating payoff during the promo period. Always pay enough to clear the balance before the promo ends." },
      ]}
    >
      <MinPaymentClient />
    </FinanceToolPage>
  );
}
