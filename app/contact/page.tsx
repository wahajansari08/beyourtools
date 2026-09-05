import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Btn from "@/components/Btn";

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

          <Btn variant="primary" size="lg">
          Send message
        </Btn>
        </form>

        {/* Alternative contact */}
        <div
          className="mt-8 rounded-xl border p-5 space-y-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
        >
          <h2 className="font-display text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Other ways to reach us</h2>

          {/* Email */}
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--bg-elevated)", color: "var(--teal)" }}
              aria-hidden="true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Email</p>
              <a
                href="mailto:hello@beyourtools.com"
                className="focus-ring text-xs hover:underline"
                style={{ color: "var(--teal)" }}
              >
                hello@beyourtools.com
              </a>
              <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-subtle)" }}>
                We typically respond within 2–3 business days.
              </p>
            </div>
          </div>

          {/* Social links */}
          <div>
            <p className="mb-3 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Follow us</p>
            <div className="space-y-2">
              {[
                {
                  label: "Facebook",
                  handle: "Be Your Tools",
                  href: "https://www.facebook.com/people/Be-Your-Tools/61593827195970/",
                  color: "#1877F2",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  label: "X (Twitter)",
                  handle: "@BeYourTools",
                  href: "https://x.com/BeYourTools",
                  color: "var(--text-primary)",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: "Reddit",
                  handle: "u/beyourtools",
                  href: "https://www.reddit.com/user/beyourtools/",
                  color: "#FF4500",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                    </svg>
                  ),
                },
              ].map(({ label, handle, href, color, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring flex items-center gap-3 rounded-lg border px-3 py-2.5 transition hover:opacity-80"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "color-mix(in srgb,var(--bg-surface) 60%,transparent)", color }}
                  >
                    {icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{handle}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                    className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-subtle)" }} aria-hidden="true">
                    <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
            For privacy or GDPR requests, please see our{" "}
            <Link href="/privacy-policy" className="hover:underline" style={{ color: "var(--teal)" }}>
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </>
  );
}
