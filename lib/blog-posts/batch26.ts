import type { BlogPost } from "@/lib/blog";

export const batch26: BlogPost[] = [
  {
    slug: "apr-vs-apy",
    title: "APR vs APY: What's the Difference and Which One Should You Compare?",
    seoTitle: "APR vs APY: The Difference, Formulas, and Which One Matters",
    excerpt:
      "APR is the yearly cost of borrowing, fees included and compounding left out. APY is the yearly return on savings, compounding included. Compare loans by APR and savings by APY, and this guide shows the formulas and the worked numbers for both, including why a $300 fee can push a 6% loan to an 11.74% APR.",
    author: "Wahaj Ansari",
    publishedAt: "2026-11-13",
    readingTime: 12,
    category: "Finance",
    tags: ["APR", "APY", "Interest Rates", "Loans", "Savings"],
    content: `<p>The short answer: APR is what borrowing costs you per year, fees included. APY is what saving earns you per year, compounding included. They look like the same kind of number, and they are both quoted as a yearly percentage, but they measure opposite things. Compare loans by APR, lowest wins. Compare savings accounts by APY, highest wins. Mix them up and you will compare a cost against a return, which tells you nothing. This guide works through both formulas with real numbers, including a loan where the stated rate is 6% but the true APR is 11.74%, and a savings account where a 5% rate actually pays 5.1162%.</p>
<p>Both numbers exist because a single "interest rate" is not enough to describe what really happens to money over a year. Two things distort it: fees, which raise the cost of a loan without changing the stated rate, and compounding, which raises the return on savings because interest starts earning interest of its own. APR corrects for fees. APY corrects for compounding. Neither corrects for both, which is why you need to know which one you are looking at.</p>

<h2>APR vs APY at a glance</h2>
<table>
<tr><th></th><th>APR</th><th>APY</th></tr>
<tr><td>What it measures</td><td>The yearly cost of borrowing</td><td>The yearly return on saving</td></tr>
<tr><td>Used for</td><td>Loans, mortgages, credit cards</td><td>Savings accounts, money market accounts, CDs</td></tr>
<tr><td>Includes fees</td><td>Yes, upfront fees are folded in</td><td>No, it reflects interest only</td></tr>
<tr><td>Includes compounding</td><td>No, it is a simple annualised rate</td><td>Yes, interest on interest is the whole point</td></tr>
<tr><td>Which way to compare</td><td>Lower is cheaper</td><td>Higher earns more</td></tr>
<tr><td>Who advertises it</td><td>Lenders, because it looks smaller</td><td>Banks, because it looks bigger</td></tr>
<tr><td>Governed in the US by</td><td>Truth in Lending Act (Regulation Z)</td><td>Truth in Savings Act (Regulation DD)</td></tr>
</table>
<p>That last row matters more than it looks. Both numbers are legally required disclosures in the United States, which means a lender cannot hide the APR and a bank cannot invent an APY. The numbers are standardised so that two offers can be compared on the same basis. The catch is that they standardise different things, so an APR and an APY side by side are still not directly comparable.</p>

<h2>What APR actually measures</h2>
<p>APR, the annual percentage rate, answers one question: what does this loan really cost per year, all in? It starts from the stated interest rate and adds the upfront fees, origination fees, discount points, broker fees, and lender closing costs, then spreads that total cost across the loan term as a single yearly rate. The formula in its simplest form is the periodic rate times the number of periods in a year. The exact figure lenders must disclose is worked out by amortisation: the APR is the rate that makes the present value of all your payments equal to the money you actually received, which is the loan amount minus the fees.</p>
<p>Here is what that means on a real loan, checked against our <a href="/apr-calculator">APR Calculator</a>, which solves the same equation. Borrow $30,000 at a stated rate of 6.5% for 5 years, with $900 in fees. The monthly payment is $586.98. The true APR is 7.78%, not 6.5%. The $900 fee costs you 1.28 percentage points a year, because you pay interest on the full $30,000 while only receiving $29,100 of it. The longer the term, the thinner the fee spreads: the same $900 on a 30 year loan would add only a fraction of a point. The shorter the term, the harder the same fee bites.</p>
<p>That bite is worst on short loans, and it is where the quick arithmetic most people use goes wrong. Take a $10,000 loan at 6% for one year with a $300 origination fee. The simple shortcut says the APR is (interest plus fees) divided by the principal: ($600 + $300) / $10,000 = 9.00%. The true APR, worked out by amortisation, is 11.74%, with a monthly payment of $860.66. The shortcut understates the cost by nearly three points, because it pretends the $300 fee is paid evenly over the year when in fact it comes out of your pocket on day one. Treat any (fees + interest) / principal calculation as a rough illustration, never as the APR. If the loan is short, the gap is large. If the lender's disclosed APR differs from your own calculation by more than 0.125 percentage points, US rules say that gap is worth questioning, so run the numbers through a calculator before you sign.</p>
<p>One more APR condition to know: it assumes you hold the loan to the full term. Pay it off early and the fees were spread over fewer months, so the effective cost per year rises. That same $30,000 loan at 6.5% with $900 in fees has a true APR of 7.78% if held for 5 years, but 8.46% if paid off after 2 years. You still pay less in total by paying early, $33,239.46 instead of $35,219.07, because you stop paying interest sooner. The fees simply cost more per year of borrowing. If you expect to refinance or repay early, compare offers at your expected term, not the full term. Our <a href="/loan-payment-calculator">Loan Payment Calculator</a> and <a href="/loan-interest-calculator">Loan Interest Calculator</a> show the payment and total interest behind any APR you are comparing.</p>

<h2>What APY actually measures</h2>
<p>APY, the annual percentage yield, answers the opposite question: what does this savings account really earn per year, once interest starts earning interest of its own? The formula is APY = (1 + r / n)^n - 1, where r is the nominal annual rate as a decimal and n is the number of compounding periods per year. Multiply by 100 for a percentage. The rate on the poster is r. The APY is what lands in your account.</p>
<p>Here is the same 5% rate at every compounding frequency, on a $10,000 balance for one year. Every figure below is the exact result of that formula.</p>
<table>
<tr><th>Compounding</th><th>Periods per year</th><th>APY</th><th>Balance after 1 year</th><th>Interest earned</th></tr>
<tr><td>Annual</td><td>1</td><td>5.0000%</td><td>$10,500.00</td><td>$500.00</td></tr>
<tr><td>Semi-annual</td><td>2</td><td>5.0625%</td><td>$10,506.25</td><td>$506.25</td></tr>
<tr><td>Quarterly</td><td>4</td><td>5.0945%</td><td>$10,509.45</td><td>$509.45</td></tr>
<tr><td>Monthly</td><td>12</td><td>5.1162%</td><td>$10,511.62</td><td>$511.62</td></tr>
<tr><td>Daily</td><td>365</td><td>5.1267%</td><td>$10,512.67</td><td>$512.67</td></tr>
<tr><td>Continuous</td><td>Unlimited</td><td>5.1271%</td><td>$10,512.71</td><td>$512.71</td></tr>
</table>
<p>Two things stand out. First, the gap between annual and monthly compounding is $11.62 on $10,000 in year one, which is real money but not the deciding factor between two accounts. Second, daily compounding beats monthly by only $1.05 on the same balance, and continuous compounding, the theoretical limit where interest is added constantly, beats daily by four cents. No real account can beat 5.1271% on a 5% rate, so a daily compounding account and a monthly one at the same rate are effectively the same account. Compare the APY, not the compounding frequency. Run any rate through our <a href="/apy-calculator">APY Calculator</a> to see the same table for your own balance.</p>
<p>The gap widens with time, which is where APY earns its keep. That same $10,000 at a 5.1162% APY grows to $12,833.59 after 5 years and about $16,470 after 10 years, against $16,288.95 if the rate never compounded at all. The extra $181 over ten years is interest earning interest, and it is exactly what the APY is telling you. Our <a href="/savings-calculator">Savings Calculator</a> projects the same growth with regular deposits added in.</p>
<p>To go the other way, from an APY back to the nominal rate, use r = n x ((1 + APY)^(1/n) - 1). An APY of 5.1162% compounded monthly is a nominal rate of exactly 5.0000%. The two numbers describe the same account. APY is also the same calculation finance textbooks call the effective annual rate, or EAR. The names differ by context, banks say APY, textbooks say EAR, but the arithmetic is identical.</p>

<h2>The same 5% on both sides of the table</h2>
<p>The cleanest way to feel the difference is to put the same rate on a loan and on a savings account. A 5% savings rate compounded monthly pays an APY of 5.1162%, as above. A 12% APR loan compounded monthly costs an effective 12.6825% a year, because (1 + 0.12/12)^12 - 1 = 0.126825. Month one interest on a $10,000 loan at 12% is $100. Month two is $101, charged on the $10,100 balance. That is compounding working against you, and it is why the effective cost of a loan is always higher than its APR whenever interest compounds inside the year. The APR tells you the advertised cost. The effective rate tells you what you actually pay. On a savings account the same mechanism works for you, and the APY is the number that already includes it.</p>
<p>This is also why banks advertise the flattering number on each side. A savings account is sold on its APY, the bigger number. A loan is sold on its APR, the smaller number. Both disclosures are honest and both are legally required. The trick is only that each side shows you the number that looks best for them, so you have to convert before you compare. A 5% APY savings account and a 5% APR loan are not the same deal in opposite directions: the savings account pays you 5.1162% compounded monthly, while the loan costs you 5.1162% compounded monthly plus any fees the APR already includes.</p>

<h2>Which one to compare, product by product</h2>
<table>
<tr><th>Product</th><th>Compare by</th><th>Why</th></tr>
<tr><td>Personal loan</td><td>APR</td><td>It includes the fees, which is where loans differ</td></tr>
<tr><td>Mortgage</td><td>APR</td><td>Points and closing costs move the APR more than the rate</td></tr>
<tr><td>Credit card</td><td>APR</td><td>APR and the interest rate are effectively the same number on cards</td></tr>
<tr><td>Savings account</td><td>APY</td><td>It includes compounding, which is where accounts differ</td></tr>
<tr><td>Money market account</td><td>APY</td><td>Same reason as savings, plus check the fees APY ignores</td></tr>
<tr><td>Certificate of deposit (CD)</td><td>APY</td><td>The APY is the return over the full term, fees aside</td></tr>
</table>
<p>Credit cards deserve a closer look, because they are where APR bites most people. The average US credit card APR was 21.19% across all accounts in August 2026, according to the Federal Reserve G.19 release, and 22.36% on accounts actually assessed interest. On a $1,000 balance carried for one month at 21.19%, that is about $17.66 of interest. Leave the full $1,000 untouched for a year with monthly compounding and the effective annual cost is 23.37%, or $233.74, because the rate compounds. That is a hypothetical no payment illustration, not a typical bill, since real cards charge interest on the daily balance and minimum payments change the math, but it shows the scale. The daily periodic rate is 21.19% divided by 365, about 0.058% a day, and it is charged every day the balance sits there. The one escape hatch is the grace period: pay the statement balance in full by the due date and the APR costs you nothing on purchases. The APR only starts charging when you carry a balance.</p>
<p>On the savings side, the spread is just as wide. The FDIC national average savings APY was 0.38% in October 2026, while high yield accounts typically paid 3% to 4%. On a $10,000 balance that is the difference between about $38 a year and $300 to $400 a year, which dwarfs the $1.05 monthly versus daily compounding gap. Pick the account by APY first, then check the conditions the APY does not show: monthly fees, minimum balance requirements, and withdrawal limits. APY reflects interest only. A $5 monthly fee on an account earning $38 a year wipes out the return entirely, and the APY will never tell you that.</p>

<h2>How to convert between them</h2>
<p>Converting is two formulas and a calculator. To turn a nominal rate into an APY, use APY = (1 + r / n)^n - 1 with n as the compounding periods per year. To turn an APY back into the nominal rate, use r = n x ((1 + APY)^(1/n) - 1). A small example to check your arithmetic: $1,000 at a 4% rate compounded monthly gives an APY of 4.0742%, so $40.74 of interest in a year instead of the $40.00 simple interest would give. If your numbers match those, your formula is right.</p>
<p>For loans, the conversion runs through the APR calculator instead, because fees have to be amortised rather than plugged into a formula. Enter the loan amount, the stated rate, the term, and every upfront fee, and the calculator solves for the rate that makes the present value of your payments equal to the money you actually received. That is the true APR, and it is the number to carry into any comparison. A difference of half a point on a large loan is worth more than a difference of a point on a small one, so compare the total cost as well as the rate: a lower APR on a longer term can still cost more total interest than a higher APR on a shorter term.</p>
<p>One final check before you decide: confirm the rate type on the offer in front of you. A savings advert shows APY. A loan advert shows APR. If an offer shows only a bare "interest rate" with no letters after it, ask which one it is, because a 5% rate, a 5% APR, and a 5% APY are three different promises. The rate is the poster number. The APR is the rate plus fees. The APY is the rate plus compounding. Know which one you are reading, and the comparison takes care of itself. If percentages themselves trip you up, our <a href="/blog/how-to-calculate-percentage-guide">percentage guide</a> covers the underlying arithmetic, including the percentage point trap that shows up in every rate headline.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>Which is higher, APR or APY?</dt>
<dd>APY is equal to or higher than the APR or nominal rate for the same stated rate, because APY adds compounding on top. They are exactly equal only when compounding is annual, so n equals 1, or when there is no compounding at all. A fee loaded loan APR can still be numerically higher than a savings account APY, but that is two different products being compared, not the same rate. On the same rate, APY never comes out lower.</dd>
<dt>Which one matters for a loan, and which one for savings?</dt>
<dd>For a loan, compare APR, lowest wins, because APR includes the fees that separate one loan offer from another. For savings, a money market account, or a CD, compare APY, highest wins, because APY includes the compounding that separates one account from another. Comparing a loan APR against a savings APY tells you nothing, because one is a cost and the other is a return.</dd>
<dt>Can APY be lower than APR?</dt>
<dd>On the same rate, no. APY starts from the nominal rate and adds compounding, so it can only match it or beat it. The confusion comes from comparing two different products: a loan APR with heavy fees can be higher than a savings APY, and a low rate savings account can have an APY below another product's APR. Within one product and one rate, APY is never lower.</dd>
<dt>How much difference does monthly versus daily compounding make?</dt>
<dd>Very little at ordinary rates. At 5%, monthly compounding gives an APY of 5.1162% and daily gives 5.1267%, a difference of $1.05 per $10,000 per year. The gap widens with higher rates and longer terms, but it is rarely the deciding factor between two accounts. Continuous compounding, the theoretical limit, gives 5.1271% at 5%, only four cents a year more than daily on $10,000, so no real account can beat daily compounding by much.</dd>
<dt>What fees go into APR?</dt>
<dd>On a loan, typically origination fees, discount points, mortgage broker fees, and closing costs paid to the lender. Not always included: appraisal fees, title insurance, and prepaid insurance or taxes, and the exact list varies by loan type, so always ask your lender for the APR disclosure. On a credit card, APR and the interest rate are effectively the same number, because issuers do not fold upfront fees into card APR. APY includes no fees at all, it reflects interest only, so check account fees separately.</dd>
<dt>Does credit card APR matter if I pay in full every month?</dt>
<dd>No, not for purchases. Pay the statement balance in full by the due date and the grace period means the APR costs you nothing. It matters the moment you carry a balance: at the August 2026 average APR of 21.19%, a $1,000 balance costs about $17.66 in the first month, and left untouched for a year with monthly compounding the effective cost is 23.37%, or $233.74. Cash advances usually have no grace period at all, so their APR starts charging immediately.</dd>
</dl>
</section>`,
  },
];
