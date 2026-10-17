import { localizeMetadata, contentLocale, withPageCopy } from "@/lib/i18n-content";
import pagesEn from "@/content/en/pages.json";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { SITE, faqSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import ContactForm from "./ContactForm";

type ContactCopy = {
  breadcrumb: string;
  title: string;
  intro: string;
  otherWaysHeading: string;
  emailLabel: string;
  emailNote: string;
  followLabel: string;
  privacyNoteHtml: string;
  support: { heading: string; intro: string; cards: { title: string; body: string }[] };
  response: { heading: string; body: string };
  troubleshooting: { heading: string; intro: string; html: string };
  faqHeading: string;
  faqs: { question: string; answer: string }[];
};

const EN_COPY = (pagesEn as unknown as Record<string, ContactCopy>)["contact"];

const __enMetadata: Metadata = {
  title: "Contact Us - Support & Feedback | BeYourTools",
  description: "Get in touch with the BeYourTools team. Report a bug, suggest a tool, or ask a question.",
  alternates: { canonical: `${SITE.url}/contact` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/contact`,
    title: "Contact Us - Support & Feedback | BeYourTools",
    description: "Get in touch with the BeYourTools team. We typically respond within 2–3 business days.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "Contact BeYourTools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - Support & Feedback | BeYourTools",
    description: "Get in touch with the BeYourTools team.",
    site: "@beyourtools",
    images: [`${SITE.url}/og-default.png`],
  },
};

export default async function ContactPage() {
  const locale = await contentLocale();
  const copy = await withPageCopy(locale, "contact", EN_COPY);

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
      <JsonLd data={[schema, faqSchema(copy.faqs)]} />
      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover-text-primary" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{copy.breadcrumb}</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>{copy.title}</h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {copy.intro}
        </p>

        {/* Contact form */}
        <ContactForm />

        {/* Alternative contact */}
        <div
          className="mt-8 rounded-xl border p-5 space-y-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
        >
          <h2 className="font-display text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{copy.otherWaysHeading}</h2>

          {/* Email */}
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--bg-elevated)", color: "var(--accent-text)" }}
              aria-hidden="true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{copy.emailLabel}</p>
              <a
                href="mailto:beyourtools@gmail.com"
                className="focus-ring text-xs hover:underline"
                style={{ color: "var(--accent-text)" }}
              >
                beyourtools@gmail.com
              </a>
              <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-subtle)" }}>
                {copy.emailNote}
              </p>
            </div>
          </div>

          {/* Social links */}
          <div>
            <p className="mb-3 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{copy.followLabel}</p>
            <div className="space-y-2">
              {[
                {
                  label: "Facebook",
                  handle: "BeYourTools",
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

          <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}
            dangerouslySetInnerHTML={{ __html: copy.privacyNoteHtml }} />
        </div>

        {/* Support Channels & Scope */}
        <section className="mt-10 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            {copy.support.heading}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {copy.support.intro}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {copy.support.cards.map((card) => (
              <div key={card.title} className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{card.title}</h3>
                <p>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Response Times */}
        <section className="mt-8 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            {copy.response.heading}
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {copy.response.body}
          </p>
        </section>

        {/* Troubleshooting Tips */}
        <section className="mt-8 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            {copy.troubleshooting.heading}
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {copy.troubleshooting.intro}
          </p>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed list-disc pl-5" style={{ color: "var(--text-muted)" }}
            dangerouslySetInnerHTML={{ __html: copy.troubleshooting.html }} />
        </section>

        {/* FAQ */}
        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {copy.faqHeading}
          </h2>
          {copy.faqs.map(({ question, answer }) => (
            <div key={question}>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{question}</p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{answer}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "contact", __enMetadata);
}
