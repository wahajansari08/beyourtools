import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Contact Us - BeYourTools",
  description: "Get in touch with the BeYourTools team. Report a bug, suggest a tool, or ask a question.",
  alternates: { canonical: `${SITE.url}/contact` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/contact`,
    title: "Contact Us - BeYourTools",
    description: "Get in touch with the BeYourTools team. We typically respond within 2–3 business days.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Contact BeYourTools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - BeYourTools",
    description: "Get in touch with the BeYourTools team.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function ContactPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${SITE.url}/contact`,
    name: "Contact BeYourTools",
    description: "Contact page for BeYourTools - feedback, bug reports, and general enquiries.",
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };

  return (
    <>
      <JsonLd data={schema} />
      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Contact</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>Contact Us</h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Have a question, found a bug, or want to suggest a new tool? We&apos;d love to hear from you.
        </p>

        {/* Contact form */}
        <form
          className="mt-8 space-y-5"
          action="mailto:hello@beyourtools.com"
          method="get"
          aria-label="Contact form"
        >
          <div>
            <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Name
            </label>
            <input
              id="contact-name"
              name="subject"
              type="text"
              required
              placeholder="Your name"
              className="focus-ring w-full rounded-lg border px-4 py-2.5 text-sm"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Email address
            </label>
            <input
              id="contact-email"
              name="to"
              type="email"
              required
              placeholder="you@example.com"
              className="focus-ring w-full rounded-lg border px-4 py-2.5 text-sm"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Subject
            </label>
            <select
              id="contact-subject"
              name="subject"
              className="focus-ring w-full rounded-lg border px-4 py-2.5 text-sm"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
            >
              <option value="general">General enquiry</option>
              <option value="bug">Bug report</option>
              <option value="feature">Feature request</option>
              <option value="privacy">Privacy / data request</option>
              <option value="ads">Advertising enquiry</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Message
            </label>
            <textarea
              id="contact-message"
              name="body"
              required
              rows={6}
              placeholder="Describe your question or issue in detail…"
              className="focus-ring w-full rounded-lg border px-4 py-2.5 text-sm resize-none"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
            />
          </div>

          <button
            type="submit"
            className="focus-ring rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          >
            Send message
          </button>
        </form>

        {/* Alternative contact */}
        <div
          className="mt-8 rounded-xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
        >
          <h2 className="font-display text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Other ways to reach us</h2>
          <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            You can also email us directly at{" "}
            <a href="mailto:hello@beyourtools.com" className="focus-ring" style={{ color: "var(--teal)" }}>
              hello@beyourtools.com
            </a>
            . We typically respond within 2–3 business days.
          </p>
          <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
            For privacy or GDPR requests, please see our{" "}
            <Link href="/privacy-policy" style={{ color: "var(--teal)" }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
