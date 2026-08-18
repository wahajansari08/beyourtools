import type { Metadata } from "next";
import Link from "next/link";
import { tools, categories, toolsByCategory } from "@/lib/tools-config";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, softwareApplicationSchema, faqSchema, SITE, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "JSON Tools - Free Online JSON Formatter, Validator & Converter",
  description: "Free browser-based JSON tools. Format, validate, diff, convert, generate, and inspect JSON - no upload, no sign-up, 100% private.",
  keywords: "JSON formatter, JSON validator, JSON diff, JSON to CSV, JSON schema, JSONPath, JWT decoder, online JSON tools",
  alternates: { canonical: `${SITE.url}/json-tools` },
  openGraph: {
    type: "website", url: `${SITE.url}/json-tools`,
    title: "Free Online JSON Tools - BeYourTools",
    description: "30+ JSON tools in your browser - format, validate, convert, diff, and more.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "JSON Tools" }],
  },
};

export default function JsonToolsPage() {
  const total = tools.length;

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "JSON Tools", url: canonical("/json-tools") },
    ]),
    softwareApplicationSchema({
      name: "BeYourTools JSON Tools",
      description: `${total} free browser-based JSON tools including formatter, validator, diff, converter, and more.`,
      url: canonical("/json-tools"),
      category: "DeveloperApplication",
    }),
    faqSchema([
      { question: "How do I format JSON online?", answer: "Use our free JSON Formatter - paste your JSON, choose indent style (2 spaces, 4 spaces, or tab), and get formatted output instantly." },
      { question: "How do I validate JSON?", answer: "Our JSON Validator checks syntax and reports the exact line and column of any error. It supports both JSON and JSONL formats." },
      { question: "What is JSONPath?", answer: "JSONPath is a query language for JSON, like XPath for XML. Use our JSONPath Tester to run expressions like $.users[*].email against any JSON document." },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
        <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>
          BeYourTools
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>JSON Tools</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
          JSON Tools
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Everything you need to work with JSON - format, validate, compare, convert, transform and generate.
          All tools run entirely in your browser with no file upload required.
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            {total} tools total
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            100% browser-based
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            No upload needed
          </span>
        </div>
      </div>

      {/* Popular quick-links */}
      <div className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
          Popular
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "json-formatter","json-validator","json-diff","json-beautifier",
            "json-repair","jwt-decoder","json-schema-generator","json-to-typescript",
          ].map((slug) => {
            const tool = tools.find((t) => t.slug === slug);
            if (!tool) return null;
            return (
              <Link
                key={slug}
                href={`/${slug}`}
                className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition"
                style={{
                  borderColor: "var(--border-strong)",
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                }}
              >
                <span className="font-mono text-[10px]" style={{ color: "var(--teal)" }}>{"{ }"}</span>
                {tool.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tools grouped by category */}
      <div className="space-y-10">
        {categories.map((cat) => {
          const catTools = toolsByCategory(cat);
          return (
            <section key={cat}>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  {cat}
                </h2>
                <span
                  className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-subtle)" }}
                >
                  {catTools.length} tools
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {catTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    className="focus-ring group flex flex-col justify-between rounded-lg border p-4 transition hover-card"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--bg-surface)",
                    }}
                  >
                    <div>
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="font-mono text-[11px]" style={{ color: "var(--teal)" }}>{"{ }"}</span>
                        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {tool.name}
                        </h3>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {tool.description}
                      </p>
                    </div>
                    <span
                      className="mt-3 text-xs font-medium opacity-0 transition group-hover:opacity-100"
                      style={{ color: "var(--accent)" }}
                    >
                      Open tool →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
    </>
  );
}
