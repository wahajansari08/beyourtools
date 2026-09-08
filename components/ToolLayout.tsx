import { ReactNode } from "react";
import Link from "next/link";
import ToolHeader from "./ToolHeader";
import RelatedTools from "./RelatedTools";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  webAppSchema,
  faqSchema,
  SITE,
  canonical,
} from "@/lib/seo";
import type { ToolCategory } from "@/lib/tools-config";
import type { HowToStep, ToolFAQ } from "@/lib/json-tools-content";

export default function ToolLayout({
  eyebrow,
  title,
  description,
  category,
  currentSlug,
  howTo,
  faqs,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  category: ToolCategory;
  currentSlug: string;
  /** Optional numbered how-to steps shown below the tool UI */
  howTo?: HowToStep[];
  /** Optional FAQs shown below the how-to section */
  faqs?: ToolFAQ[];
  children: ReactNode;
}) {
  const toolUrl = canonical(`/${currentSlug}`);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "JSON Tools",  url: canonical("/json-tools") },
      { name: title,         url: toolUrl },
    ]),
    webAppSchema({
      name: title,
      description,
      url: toolUrl,
    }),
    ...(faqs && faqs.length > 0 ? [faqSchema(faqs)] : []),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol
            className="flex flex-wrap items-center gap-1.5 text-xs"
            style={{ color: "var(--text-subtle)" }}
          >
            <li>
              <Link
                href="/"
                className="focus-ring rounded hover:underline"
                style={{ color: "var(--text-muted)" }}
              >
                BeYourTools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/json-tools"
                className="focus-ring rounded hover:underline"
                style={{ color: "var(--text-muted)" }}
              >
                JSON Tools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li
              style={{ color: "var(--text-secondary)" }}
              aria-current="page"
            >
              {title}
            </li>
          </ol>
        </nav>

        {/* Header - H1, eyebrow, description */}
        <ToolHeader eyebrow={eyebrow} title={title} description={description} />

        {/* Tool UI */}
        {children}

        {/* How to use */}
        {howTo && howTo.length > 0 && (
          <section className="mt-10 space-y-3" aria-labelledby="howto-heading">
            <h2
              id="howto-heading"
              className="font-display text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              How to use
            </h2>
            <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
              {howTo.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    className="shrink-0 font-semibold"
                    style={{ color: "var(--teal)" }}
                  >
                    {i + 1}.
                  </span>
                  <span>
                    <strong style={{ color: "var(--text-secondary)" }}>
                      {step.title}
                    </strong>{" "}
                    {step.text}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* JSON Architecture & Developer Standards */}
        <section className="mt-10 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            JSON Architecture &amp; Data Interchange Standards
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            JavaScript Object Notation (JSON) is standardized under RFC 8259 and ECMA-404 as the universal lightweight data interchange format for modern cloud architectures, microservices, and REST/GraphQL APIs. 
            Utilizing the <strong style={{ color: "var(--text-primary)" }}>{title}</strong> ensures that your schemas, configurations, and API payloads adhere strictly to syntax specifications, prevent serialization anomalies, and streamline collaboration across engineering teams.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Zero-Server Security</h3>
              <p>
                Handling sensitive database dumps, API credentials, bearer tokens, or user payloads in online tools requires uncompromising privacy. 
                All data entered into {title} is parsed and manipulated locally within your browser sandbox-nothing is ever transmitted across the network or logged on external servers.
              </p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Syntax Precision &amp; CI/CD Ready</h3>
              <p>
                Properly validated and cleanly formatted JSON eliminates runtime parse exceptions, ensures predictable Git diffs across version control, and accelerates automated testing in continuous deployment pipelines.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {faqs && faqs.length > 0 && (
          <section className="mt-10" aria-labelledby="faq-heading">
            <h2
              id="faq-heading"
              className="mb-4 font-display text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-5">
              {faqs.map(({ question, answer }) => (
                <div key={question}>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {question}
                  </p>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {answer}
                  </p>
                </div>
              ))}
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Can this tool handle large, complex JSON payloads?
                </p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Yes. Because the tool operates directly inside modern V8 JavaScript execution engines, it easily processes complex multi-megabyte payloads containing thousands of nested keys with negligible latency.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Are my proprietary payloads or secrets stored or cached?
                </p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  No. BeYourTools implements zero tracking, zero telemetries, and zero database persistence. Everything stays strictly inside your browser memory and disappears the moment your tab is closed.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Related tools */}
        <RelatedTools category={category} currentSlug={currentSlug} />
      </div>
    </>
  );
}
