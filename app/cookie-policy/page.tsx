import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cookie Policy - BeYourTools",
  description: "BeYourTools Cookie Policy. Learn which cookies we use, why, and how to control them.",
  alternates: { canonical: `${SITE.url}/cookie-policy` },
  robots: { index: true, follow: true },
};

const EFFECTIVE = "August 1, 2026";

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
        <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>Cookie Policy</span>
      </nav>

      <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>Cookie Policy</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Effective date: {EFFECTIVE}</p>

      <div className="policy-content mt-8 space-y-8">

        <section>
          <h2>1. What Are Cookies?</h2>
          <p>Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work efficiently and to provide information to site owners. Some cookies expire when you close your browser; others persist for longer.</p>
        </section>

        <section>
          <h2>2. Cookies We Use</h2>

          <h3>2.1 Strictly Necessary Cookies</h3>
          <p>These cookies are essential for the Site to function. They cannot be disabled.</p>
          <table>
            <thead><tr><th>Name</th><th>Purpose</th><th>Duration</th></tr></thead>
            <tbody>
              <tr><td><code>byt-theme</code></td><td>Stores your dark/light/system theme preference (localStorage)</td><td>Persistent</td></tr>
              <tr><td><code>cookie_consent</code></td><td>Remembers your cookie consent choice</td><td>1 year</td></tr>
            </tbody>
          </table>

          <h3>2.2 Analytics Cookies</h3>
          <p>These cookies help us understand how visitors use the Site so we can improve it.</p>
          <table>
            <thead><tr><th>Name</th><th>Provider</th><th>Purpose</th><th>Duration</th></tr></thead>
            <tbody>
              <tr><td><code>_ga</code></td><td>Google Analytics</td><td>Distinguishes users</td><td>2 years</td></tr>
              <tr><td><code>_ga_*</code></td><td>Google Analytics</td><td>Maintains session state</td><td>2 years</td></tr>
              <tr><td><code>_gid</code></td><td>Google Analytics</td><td>Distinguishes users (session)</td><td>24 hours</td></tr>
            </tbody>
          </table>

          <h3>2.3 Advertising Cookies</h3>
          <p>These cookies are set by our advertising partner to deliver relevant advertisements and measure ad performance.</p>
          <table>
            <thead><tr><th>Name</th><th>Provider</th><th>Purpose</th><th>Duration</th></tr></thead>
            <tbody>
              <tr><td><code>IDE</code></td><td>Google DoubleClick</td><td>Personalised ad targeting</td><td>13 months</td></tr>
              <tr><td><code>test_cookie</code></td><td>Google DoubleClick</td><td>Checks if cookies are supported</td><td>15 minutes</td></tr>
              <tr><td><code>DSID</code></td><td>Google</td><td>Identifies logged-in Google users for ad personalisation</td><td>2 weeks</td></tr>
              <tr><td><code>NID</code></td><td>Google</td><td>Ad personalisation for non-logged-in users</td><td>6 months</td></tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>3. How to Control Cookies</h2>
          <p>You can control cookies in several ways:</p>
          <ul>
            <li><strong>Browser settings:</strong> Most browsers allow you to block or delete cookies. See your browser&apos;s help documentation for instructions.</li>
            <li><strong>Advertising:</strong> Opt out at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>Ad Settings</a></li>
            <li><strong>Network Advertising Initiative:</strong> Opt out at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>aboutads.info/choices</a></li>
            <li><strong>Analytics opt-out:</strong> Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>analytics opt-out browser add-on</a></li>
          </ul>
          <p>Note: Blocking some cookies may affect the functionality of the Site (e.g., theme preferences will not be saved).</p>
        </section>

        <section>
          <h2>4. LocalStorage</h2>
          <p>In addition to cookies, we use browser localStorage to store your theme preference (<code>byt-theme</code>) and cookie consent status. This data stays on your device and is never transmitted to our servers. You can clear it by clearing your browser&apos;s site data.</p>
        </section>

        <section>
          <h2>5. Changes to This Policy</h2>
          <p>We may update this Cookie Policy periodically. Changes will be posted on this page with an updated effective date.</p>
        </section>

        <section>
          <h2>6. Contact</h2>
          <p>Questions about our cookie use? <Link href="/contact" style={{ color: "var(--teal)" }}>Contact us</Link>.</p>
        </section>

      </div>
    </div>
  );
}
