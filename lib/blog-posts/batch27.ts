import type { BlogPost } from "@/lib/blog";

export const batch27: BlogPost[] = [
  {
    slug: "what-is-compound-interest",
    title: "What Is Compound Interest and How Does It Work?",
    seoTitle: "What Is Compound Interest? Formula, Examples, and the Rule of 72",
    excerpt:
      "Compound interest is interest earned on your original money plus all the interest it has already earned. That one idea explains why $10,000 at 7% becomes $76,123 in 30 years instead of $31,000, why starting ten years earlier more than doubles the result, and why the same arithmetic makes credit card debt grow so fast. This guide works through the formula with real numbers.",
    author: "Wahaj Ansari",
    publishedAt: "2026-11-14",
    readingTime: 13,
    category: "Finance",
    tags: ["Compound Interest", "Savings", "Investing", "APY", "Personal Finance"],
    content: `<p>The short answer: compound interest is interest earned on your original money plus all the interest it has already earned. You deposit money, it earns interest, and that interest stays in the account and starts earning interest of its own. Each period the balance is a little bigger, so the next period earns a little more, and the growth speeds up over time. That is the whole mechanism, and it explains both sides of personal finance: why patient savers end up with far more than they deposited, and why unpaid card balances grow so fast.</p>
<p>Simple interest is the contrast. With simple interest, every period pays the same amount, calculated only on the original sum, no matter how many years pass. With compound interest, every period pays interest on a balance that includes everything earned so far. The difference looks small in year one and enormous by year thirty, which is why time matters more than the rate when you are saving, and why paying a balance down quickly matters more than the rate when you are borrowing.</p>

<h2>How compounding works, year by year</h2>
<p>Take $1,000 in an account paying 5% a year, compounded monthly, and leave it alone. In year one it earns $51.16, taking the balance to $1,051.16. In year two the interest is calculated on $1,051.16, not on the original $1,000, so it earns $53.78 and the balance reaches $1,104.94. In year three it earns $56.53 on the $1,104.94 balance, reaching $1,161.47. Nothing changed except the balance, yet each year earns more than the year before. That is compounding: the interest itself becomes part of what earns interest next time.</p>
<p>The same $1,000 at simple interest would earn exactly $50 every year, forever, because simple interest only ever looks at the original $1,000. After three years the simple account holds $1,150.00 and the compound account holds $1,161.47. The gap is $11.47 after three years, which is easy to ignore. After thirty years the gap is the whole story, as the comparison below shows.</p>

<h2>The compound interest formula</h2>
<p>The formula is A = P(1 + r/n)^(nt). Each letter has one job:</p>
<p>A is the final amount, principal plus interest. P is the principal, the money you start with. r is the annual interest rate written as a decimal, so 5% becomes 0.05. n is the number of times interest compounds per year: 1 for annual, 4 for quarterly, 12 for monthly, 365 for daily. t is the number of years the money stays invested. The interest earned is simply A minus P.</p>
<p>Work it through on $10,000 at a 5% annual rate, compounded monthly, for 5 years. That is P = 10,000, r = 0.05, n = 12, t = 5. The monthly rate is 0.05 divided by 12, or 0.0041667, and there are 60 compounding periods, so A = 10,000 x (1.0041667)^60 = $12,833.59. The interest earned is $2,833.59. Leave the same money for 10 years and it becomes $16,470.09, with $6,470.09 of interest. Both figures match our <a href="/savings-calculator">Savings Calculator</a>, which runs the same calculation period by period and shows the year by year breakdown.</p>
<p>One warning about the formula: it assumes you deposit once and add nothing more. If you add money every month, the formula alone is not enough, because each deposit starts its own compounding clock. The worked monthly deposit examples later in this guide come from the same calculator, which adds each contribution after that period's interest, exactly as a real account does.</p>

<h2>Simple vs compound interest: the 30 year gap</h2>
<p>The cleanest way to see what compounding is worth is to run the same money at the same rate both ways. Here is $10,000 at 7% a year for 30 years, with interest added once a year.</p>
<table>
<tr><th></th><th>Simple interest</th><th>Compound interest</th></tr>
<tr><td>Interest in year 1</td><td>$700.00</td><td>$700.00</td></tr>
<tr><td>Interest in year 10</td><td>$700.00</td><td>$1,286.92</td></tr>
<tr><td>Interest in year 30</td><td>$700.00</td><td>$4,979.98</td></tr>
<tr><td>Total interest after 30 years</td><td>$21,000.00</td><td>$66,122.55</td></tr>
<tr><td>Final balance</td><td>$31,000.00</td><td>$76,122.55</td></tr>
</table>
<p>In year one the two accounts are identical, because there is no earlier interest to compound yet. By year ten the compound account earns $1,286.92 in a single year, almost double the $700 the simple account pays. By year thirty the compound account earns $4,979.98 in one year, nearly half the original deposit, without anything new being added. The simple account ends at $31,000. The compound account ends at $76,122.55, more than double, from the same $10,000 and the same 7% rate. The only difference is that the compound account lets interest earn interest.</p>
<p>That gap is why the rate is not the whole story. A savings account paying 7% simple interest is a worse deal than one paying 6% compounded, over a long enough term, because the compounding does more work than the extra point of rate. Our <a href="/simple-interest-calculator">Simple Interest Calculator</a> shows the straight line version, and the <a href="/apy-calculator">APY Calculator</a> converts any nominal rate into the effective yearly return that compounding actually produces.</p>

<h2>The Rule of 72: how long until money doubles</h2>
<p>There is a shortcut for the doubling question that needs no calculator. Divide 72 by the yearly rate and you get roughly how many years it takes money to double. At 7% a year, money doubles in about 10.3 years. The exact figure is 10.24 years, so the shortcut is close. It works well for rates between about 4% and 12%, and it gets less accurate outside that range, so treat it as an estimate, not a promise.</p>
<table>
<tr><th>Annual rate</th><th>Rule of 72 estimate</th><th>Exact doubling time</th></tr>
<tr><td>4%</td><td>18 years</td><td>17.67 years</td></tr>
<tr><td>5%</td><td>14.4 years</td><td>14.21 years</td></tr>
<tr><td>7%</td><td>10.3 years</td><td>10.24 years</td></tr>
<tr><td>9%</td><td>8 years</td><td>8.04 years</td></tr>
<tr><td>12%</td><td>6 years</td><td>6.12 years</td></tr>
</table>
<p>The rule is most useful as a comparison tool. Money at 4% takes about 18 years to double, while money at 7% takes about 10. A three point difference in the rate nearly halves the wait. On the debt side it is a warning label: a card balance at 21.19% APR doubles in about 3.4 years if it is left untouched and the interest keeps compounding, which is the subject of a later section.</p>

<h2>Starting early beats saving more later</h2>
<p>Compounding rewards time more than it rewards size, and the numbers are stark. Take two savers who both put $200 a month into an account earning 7% a year, compounded monthly. One starts at 25 and stops at 65. The other starts at 35 and stops at 65. The early starter deposits for 40 years, the late starter for 30 years, so the early starter puts in $96,000 and the late starter puts in $72,000, a difference of $24,000 in contributions.</p>
<table>
<tr><th></th><th>Start at 25</th><th>Start at 35</th></tr>
<tr><td>Years of saving</td><td>40</td><td>30</td></tr>
<tr><td>Total deposited</td><td>$96,000</td><td>$72,000</td></tr>
<tr><td>Interest earned</td><td>$428,962.68</td><td>$171,994.20</td></tr>
<tr><td>Final balance at 65</td><td>$524,962.68</td><td>$243,994.20</td></tr>
</table>
<p>The early starter ends with more than double the late starter's balance, $524,962.68 against $243,994.20, from only a third more in deposits. The extra ten years at the start are worth $280,968.48 at the end, because those early deposits have forty years to compound instead of thirty. In the early starter's account, 82% of the final balance is interest, not deposits. In the late starter's account, interest is 70% of the balance. Both figures come from our <a href="/savings-calculator">Savings Calculator</a> with $200 a month at 7% compounded monthly, and you can run your own age and amount through it.</p>
<p>The same arithmetic works at smaller amounts. Saving $100 a month at 5% for 30 years ends at $83,225.86, from $36,000 of deposits, so $47,225.86 of it is interest. The monthly amount matters less than most people think. What matters most is starting, then letting the deposits run long enough for the interest to start doing the heavy lifting. Our <a href="/savings-goal-calculator">Savings Goal Calculator</a> works the problem backwards: tell it the target and the date, and it tells you the monthly amount.</p>

<h2>How often compounding happens, and how much it matters</h2>
<p>Interest can be added to your balance once a year, once a quarter, once a month, or once a day, and more frequent compounding earns slightly more, because each addition starts earning interest sooner. Here is $10,000 at a 5% annual rate for one year at every frequency.</p>
<table>
<tr><th>Compounding</th><th>Periods per year</th><th>Balance after 1 year</th><th>Interest earned</th></tr>
<tr><td>Annual</td><td>1</td><td>$10,500.00</td><td>$500.00</td></tr>
<tr><td>Semi-annual</td><td>2</td><td>$10,506.25</td><td>$506.25</td></tr>
<tr><td>Quarterly</td><td>4</td><td>$10,509.45</td><td>$509.45</td></tr>
<tr><td>Monthly</td><td>12</td><td>$10,511.62</td><td>$511.62</td></tr>
<tr><td>Daily</td><td>365</td><td>$10,512.67</td><td>$512.67</td></tr>
<tr><td>Continuous</td><td>Unlimited</td><td>$10,512.71</td><td>$512.71</td></tr>
</table>
<p>The lesson is that frequency is a small lever. Monthly compounding beats annual by $11.62 on $10,000 in year one, and daily beats monthly by only $1.05. Continuous compounding, the theoretical limit where interest is added constantly, beats daily by four cents. No real account can beat 5.1271% on a 5% rate. The rate and the number of years matter far more than how often the interest is added, which is why the number to compare between savings accounts is the APY, the effective yearly return with compounding already included. Our <a href="/blog/apr-vs-apy">APR vs APY guide</a> works through that comparison in full, including the same 5% table and what the two numbers mean on each side of a loan.</p>

<h2>When compounding works against you</h2>
<p>Everything above runs in reverse on a debt. When interest is added to a balance you owe, the next period charges interest on a bigger balance, so the debt grows faster the longer it sits. A credit card is the clearest example, because the rates are high and the interest compounds monthly.</p>
<p>Take a $1,000 card balance at the August 2026 average US card APR of 21.19%, from the Federal Reserve G.19 release. The first month adds about $17.66 of interest. If the balance is left completely untouched for a year, with interest compounding monthly and no payments at all, the effective annual cost is 23.37%, or $233.74 on that $1,000. The Rule of 72 says the balance doubles in about 3.4 years at that rate. That is a hypothetical no payment illustration, not a typical bill, since real cards charge interest on the daily balance and minimum payments change the math, but it shows the scale: at card rates, compounding doubles a debt in about three years, while at savings rates it takes a decade or two to double your money.</p>
<p>The way out is the same arithmetic in reverse. Paying more than the minimum shrinks the balance that next month's interest is calculated on, which is why an extra $50 a month cuts years off a payoff. Our <a href="/credit-card-payoff-calculator">Credit Card Payoff Calculator</a> shows the months and total interest for any payment, and our <a href="/loan-payment-calculator">Loan Payment Calculator</a> and <a href="/loan-interest-calculator">Loan Interest Calculator</a> show the same for fixed loans, where the compounding is slower because the rate is lower and the balance falls on a schedule.</p>

<h2>What slows compounding down</h2>
<p>Compounding is powerful, but it is not automatic, and four things slow it down. First, withdrawals. Taking interest out of the account removes the base that would have earned interest next period, which is why an account that pays interest out as cash grows only at the simple rate. Second, fees. A $5 monthly fee on an account earning $38 a year wipes out the return entirely, and the APY never shows it, so check fees separately from the rate.</p>
<p>Third, inflation. A 5% nominal return with 3% inflation is a real return of about 1.9%, because prices rose while the money grew. The balance still compounds, but what it buys grows more slowly. Fourth, tax. Interest earned in a taxable account is taxed in the year it is earned in most countries, which trims the amount that stays behind to compound. None of these cancel compounding. They only shrink the rate that actually compounds, which is why the rate you should plan on is the after fee, after tax, after inflation rate, not the poster rate.</p>

<h2>How to put compound interest to work</h2>
<p>Five steps, in order. First, start now, even with a small amount, because the early years are the most valuable ones, as the 25 versus 35 comparison shows. Second, automate a fixed monthly deposit, so the contributions keep arriving without a decision each month. Third, pick the account by APY, not by the poster rate, and check the fees the APY does not show. Fourth, leave the interest in the account. Every withdrawal is a reset on the compounding base. Fifth, reinvest anything the account pays out, including dividends if you hold funds, so the earnings keep earning.</p>
<p>Run your own numbers before you commit to a plan. Our <a href="/savings-calculator">Savings Calculator</a> projects any deposit and rate with a year by year table, the <a href="/apy-calculator">APY Calculator</a> converts a nominal rate into the effective yearly return, and the <a href="/savings-goal-calculator">Savings Goal Calculator</a> tells you the monthly amount for a target date. If percentages themselves trip you up, our <a href="/blog/how-to-calculate-percentage-guide">percentage guide</a> covers the underlying arithmetic, including the percentage point trap that shows up in every rate headline. The formula is simple, the arithmetic is checkable, and the only input that cannot be bought back later is time.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>What is compound interest in simple words?</dt>
<dd>Compound interest is interest earned on your money and on the interest it has already earned. You deposit $1,000 at 5%, it earns $51.16 in the first year with monthly compounding, and in the second year the interest is calculated on $1,051.16, not on the original $1,000, so it earns a little more. Simple interest only ever pays on the original deposit, so it earns the same amount every year.</dd>
<dt>How do I calculate compound interest?</dt>
<dd>Use A = P(1 + r/n)^(nt), where P is the starting amount, r is the annual rate as a decimal, n is the compounding periods per year, and t is the years. A worked check: $1,000 at a 4% annual rate compounded monthly gives an APY of 4.0742%, so $40.74 of interest in a year, for a balance of $1,040.74. For regular monthly deposits, use a calculator instead, because each deposit starts its own compounding clock. Our Savings Calculator runs the same calculation period by period.</dd>
<dt>How long does it take for money to double?</dt>
<dd>Divide 72 by the yearly rate for a close estimate. At 7% a year, money doubles in about 10.3 years, and the exact figure is 10.24 years. At 4% it takes about 18 years, at 9% about 8 years, and at 12% about 6 years. The shortcut works well for rates between about 4% and 12%. On the debt side, a card balance at 21.19% APR doubles in about 3.4 years if it is left untouched.</dd>
<dt>Is compound interest always better than simple interest?</dt>
<dd>For saving, yes, whenever the rate and term are the same, because compound interest pays on a growing balance while simple interest pays the same amount every year. On $10,000 at 7% for 30 years, simple interest ends at $31,000 and compound interest ends at $76,122.55. The gap is zero in year one and grows every year after that, so the advantage only exists over time. For borrowing, compound interest is worse for the borrower for the same reason, which is why paying a balance down early saves so much.</dd>
<dt>Does compound interest work on debt too?</dt>
<dd>Yes, and it is the same arithmetic in reverse. Unpaid interest is added to the balance you owe, so the next period charges interest on a bigger balance. A $1,000 card balance at 21.19% APR costs about $17.66 in the first month, and left untouched for a year with monthly compounding the effective cost is 23.37%, or $233.74. Paying more than the minimum shrinks the balance that next month's interest is calculated on, which is why extra payments cut years off a payoff.</dd>
<dt>What is the difference between compound interest and APY?</dt>
<dd>Compound interest is the mechanism, the interest earning interest. APY is the number that measures the result of that mechanism over one year. A 5% rate compounded monthly pays an APY of 5.1162%, which is the effective yearly return after compounding. The APY already includes the compounding, so it is the number to compare between savings accounts. The nominal rate is the poster number, the APY is what actually lands in your account.</dd>
</dl>
</section>`,
  },
];
