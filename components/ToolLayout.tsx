import { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
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
import type { HowToStep, ToolFAQ, JsonPairGuide } from "@/lib/json-tools-content";
import { getTranslations } from "next-intl/server";
import { contentLocale, getTranslatedToolContentAny } from "@/lib/i18n-content";

export default async function ToolLayout({
  eyebrow,
  title,
  description,
  category,
  currentSlug,
  howTo,
  faqs,
  pairGuide,
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
  /** Pair-specific conversion guide; replaces the generic standards box when present */
  pairGuide?: JsonPairGuide;
  children: ReactNode;
}) {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  // Translated overrides (fall back to the English props when untranslated)
  const tc = await getTranslatedToolContentAny(locale, currentSlug);
  const tTitle = tc?.name ?? title;
  const tDescription = (tc as { tagline?: string } | undefined)?.tagline ?? description;
  const tHowTo = (tc?.howTo as HowToStep[] | undefined) ?? howTo;
  const tFaqs = (tc?.faqs as ToolFAQ[] | undefined) ?? faqs;

  const toolUrl = canonical(`/${currentSlug}`);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "JSON Tools",  url: canonical("/json-tools") },
      { name: tTitle,        url: toolUrl },
    ]),
    webAppSchema({
      name: tTitle,
      description: tDescription,
      url: toolUrl,
    }),
    ...(tFaqs && tFaqs.length > 0 ? [faqSchema(tFaqs)] : []),
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
              {tTitle}
            </li>
          </ol>
        </nav>

        {/* Header - H1, eyebrow, description */}
        <ToolHeader eyebrow={eyebrow} title={tTitle} description={tDescription} />

        {/* Tool UI */}
        {children}

        {/* How to use */}
        {tHowTo && tHowTo.length > 0 && (
          <section className="mt-10 space-y-3" aria-labelledby="howto-heading">
            <h2
              id="howto-heading"
              className="font-display text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {t("howToUse")} {tTitle}
            </h2>
            <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
              {tHowTo.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    className="shrink-0 font-semibold"
                    style={{ color: "var(--accent-text)" }}
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

        {/* Pair-specific conversion guide, or the generic standards box for non-pair tools */}
        {pairGuide ? (
        <section className="mt-10 space-y-6">
          <div className="space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              About this conversion
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{pairGuide.intro}</p>
          </div>
          <div className="space-y-3 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              What changes in structure
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{pairGuide.structureNote}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--text-primary)" }}>When to convert</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {pairGuide.whenTo.map((item) => (<li key={item}>{item}</li>))}
              </ul>
            </div>
            <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--text-primary)" }}>When to keep the original</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {pairGuide.whenNotTo.map((item) => (<li key={item}>{item}</li>))}
              </ul>
            </div>
          </div>
          <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Watch out for</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{pairGuide.gotcha}</p>
          </div>
        </section>
        ) : (
        <section className="mt-10 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {tTitle} &amp; JSON Developer Standards
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            JSON is the standard format for web APIs and modern applications. Using the{" "}
            <strong style={{ color: "var(--text-primary)" }}>{tTitle}</strong> helps you check syntax,
            catch formatting errors, and keep your data clean and readable.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Zero-Server Security</h3>
              <p>
                All data entered into {tTitle} runs directly inside your browser sandbox. Nothing is ever sent across the network or saved on remote servers.
              </p>
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Clean &amp; CI/CD Ready</h3>
              <p>
                Well-formatted JSON prevents runtime syntax bugs, makes code reviews easier, and ensures smooth API data exchange.
              </p>
            </div>
          </div>
        </section>
        )}

        {/* FAQ */}
        {tFaqs && tFaqs.length > 0 && (
          <section className="mt-10" aria-labelledby="faq-heading">
            <h2
              id="faq-heading"
              className="mb-4 font-display text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {tTitle} {t("faqs")}
            </h2>
            <div className="space-y-5">
              {tFaqs.map(({ question, answer }) => (
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
