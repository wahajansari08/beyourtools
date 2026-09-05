import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  softwareApplicationSchema,
  SITE,
  canonical,
} from "@/lib/seo";
import {
  tools,
  categories,
  toolsByCategory,
  type ToolCategory,
} from "@/lib/tools-config";
import Btn from "@/components/Btn";

// ── Slug helpers ──────────────────────────────────────────────────────────────

function toSlug(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function fromSlug(slug: string): ToolCategory | undefined {
  return categories.find((c) => toSlug(c) === slug);
}

export function generateStaticParams() {
  return categories.map((c) => ({ category: toSlug(c) }));
}

// ── Category metadata ─────────────────────────────────────────────────────────

const CAT_META: Record<
  ToolCategory,
  {
    icon: string;
    color: string;
    bg: string;
    border: string;
    description: string;
    intro: string;
    faqs: { question: string; answer: string }[];
  }
> = {
  "Format & Validate": {
    icon: "✓",
    color: "var(--teal)",
    bg: "color-mix(in srgb,var(--teal) 10%,transparent)",
    border: "color-mix(in srgb,var(--teal) 30%,transparent)",
    description:
      "Free online JSON formatters and validators. Format messy JSON, validate syntax, repair broken JSON, and explore data as a collapsible tree.",
    intro:
      "These tools cover the most common day-to-day JSON tasks: making JSON readable, checking it for errors, repairing common mistakes, and exploring structure visually.",
    faqs: [
      {
        question: "What is the difference between formatting and validating JSON?",
        answer:
          "Formatting (or beautifying) adds indentation and whitespace to make JSON readable. Validating checks whether the JSON is syntactically correct according to the spec. You can format valid JSON, but you cannot format invalid JSON without fixing errors first.",
      },
      {
        question: "What is JSONL and how does it differ from JSON?",
        answer:
          "JSONL (JSON Lines) is a format where each line is a separate, complete JSON value. It is useful for streaming data, log files, and datasets too large to hold as a single JSON array. Our JSONL formatter and validator handle each line independently.",
      },
      {
        question: "How does JSON Repair work?",
        answer:
          "JSON Repair detects and fixes common mistakes such as trailing commas, single-quoted strings, missing quotes around keys, and unescaped control characters. It is not a full parser but covers the most frequent real-world issues.",
      },
      {
        question: "What is a JSON Tree Viewer?",
        answer:
          "A JSON Tree Viewer renders JSON as a collapsible tree of nodes, making it easy to navigate deeply nested objects without manually counting brackets. You can expand and collapse individual branches to explore the structure.",
      },
    ],
  },
  "Compare & Manipulate": {
    icon: "⇄",
    color: "var(--accent-text)",
    bg: "color-mix(in srgb,var(--accent) 10%,transparent)",
    border: "color-mix(in srgb,var(--accent) 30%,transparent)",
    description:
      "Compare, sort, merge, flatten, and query JSON. Side-by-side diff, deep merge, key sorting, path flattening, and JSONPath expression testing.",
    intro:
      "These tools go beyond reading JSON - they help you find differences between documents, combine multiple sources, reorganize structure, and extract specific values using JSONPath queries.",
    faqs: [
      {
        question: "How does the JSON Diff tool work?",
        answer:
          "JSON Diff compares two JSON documents and highlights additions, deletions, and changes. It normalizes whitespace before comparing so formatting differences do not create false positives.",
      },
      {
        question: "What is JSONPath and how do I use it?",
        answer:
          "JSONPath is a query language for JSON, similar to XPath for XML. Use expressions like $.users[*].email to extract all email addresses from a users array, or $.store.book[?(@.price < 10)] to filter books by price.",
      },
      {
        question: "What does JSON Flatten do?",
        answer:
          "JSON Flatten converts a deeply nested JSON object into a flat key-value structure using dot notation. For example, {user: {name: 'Alice'}} becomes {'user.name': 'Alice'}. Unflatten reverses this process.",
      },
      {
        question: "How does JSON Merge handle conflicts?",
        answer:
          "JSON Merge performs a deep merge where the second object's values take precedence over the first when there are key conflicts. Arrays are not merged element-by-element; the second array replaces the first.",
      },
    ],
  },
  "Convert": {
    icon: "→",
    color: "var(--coral)",
    bg: "color-mix(in srgb,var(--coral) 10%,transparent)",
    border: "color-mix(in srgb,var(--coral) 30%,transparent)",
    description:
      "Convert JSON to CSV, YAML, XML, TypeScript interfaces, Python dataclasses, SQL statements, Excel, and more. All conversions run in your browser.",
    intro:
      "Use these converters when your data is in JSON but your destination system, code, or colleague needs a different format. Every conversion is instant, client-side, and produces clean output.",
    faqs: [
      {
        question: "Can I convert nested JSON to CSV?",
        answer:
          "Our JSON to CSV converter flattens nested objects using dot notation so they fit into a tabular structure. Arrays of objects become rows, and nested keys become column headers like user.name or address.city.",
      },
      {
        question: "How does JSON to TypeScript work?",
        answer:
          "The tool infers TypeScript interface definitions from your JSON sample. It detects types (string, number, boolean, array, nested object) and generates properly typed interfaces you can paste straight into your project.",
      },
      {
        question: "What SQL output does JSON to SQL produce?",
        answer:
          "JSON to SQL generates a CREATE TABLE statement inferred from your JSON keys and value types, followed by INSERT statements for each record in the array. The output targets standard SQL compatible with most relational databases.",
      },
      {
        question: "Does JSON to YAML preserve all data types?",
        answer:
          "Yes. Strings, numbers, booleans, null values, arrays, and nested objects all round-trip correctly through YAML conversion. String values that look like numbers or booleans are quoted in the YAML output to prevent type ambiguity.",
      },
    ],
  },
  "Generate & Schema": {
    icon: "⬡",
    color: "var(--teal)",
    bg: "color-mix(in srgb,var(--teal) 10%,transparent)",
    border: "color-mix(in srgb,var(--teal) 30%,transparent)",
    description:
      "Generate JSON Schema from sample data, validate JSON against a schema, and generate realistic mock JSON data from a template.",
    intro:
      "Whether you need to document an API response, validate incoming data, or generate test fixtures, these tools let you work with JSON Schema and mock data generation entirely in your browser.",
    faqs: [
      {
        question: "What is JSON Schema?",
        answer:
          "JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. It describes the expected structure, data types, required fields, and constraints for a JSON document, and is widely used for API documentation and validation.",
      },
      {
        question: "How accurate is the JSON Schema Generator?",
        answer:
          "The generator infers a schema from your sample data. It correctly identifies types and required fields present in the sample. For production use, review the output and add enum constraints, minLength, pattern, or format keywords that cannot be inferred from a single sample.",
      },
      {
        question: "What template syntax does the JSON Generator use?",
        answer:
          "The JSON Generator uses a simple template where you define your JSON structure and use helpers like {{internet.email}}, {{name.fullName}}, {{datatype.number}}, and {{date.past}} to generate realistic values. Templates can include arrays with a repeat count.",
      },
      {
        question: "Can I validate JSON against my own schema?",
        answer:
          "Yes. The JSON Schema Validator accepts any valid JSON Schema (draft-07 and later) and validates your JSON document against it. Errors are reported with the exact path and rule that failed.",
      },
    ],
  },
  "Encode & Inspect": {
    icon: "🔍",
    color: "var(--accent-text)",
    bg: "color-mix(in srgb,var(--accent) 10%,transparent)",
    border: "color-mix(in srgb,var(--accent) 30%,transparent)",
    description:
      "Encode and decode Base64 text, decode JWT tokens to inspect headers and payloads, and count LLM tokens for any JSON payload.",
    intro:
      "Utility tools for developers who need to inspect encoded data, debug authentication tokens, or understand the token cost of sending JSON to a language model API.",
    faqs: [
      {
        question: "What is Base64 and when do developers use it?",
        answer:
          "Base64 is a binary-to-text encoding that represents binary data as ASCII characters. Developers use it to embed images in HTML/CSS, encode binary payloads in JSON (which only supports text), and pass data safely through systems that only handle text.",
      },
      {
        question: "Is it safe to decode a JWT here?",
        answer:
          "Yes, for inspection purposes. The JWT Decoder only decodes the header and payload (which are Base64-encoded and not encrypted). It does not verify the signature, so you can read the claims without needing the signing secret.",
      },
      {
        question: "What does the JSON Token Counter do?",
        answer:
          "The token counter estimates how many tokens a JSON payload will consume when sent to an LLM API (such as OpenAI or Anthropic). This helps you understand cost and context window usage before sending large JSON payloads.",
      },
      {
        question: "Can I decode a JWT signature?",
        answer:
          "The signature portion of a JWT is a cryptographic hash and cannot be decoded into readable content without the signing secret. The JWT Decoder shows the algorithm used (in the header) so you know what type of signature it is, but does not verify or crack it.",
      },
    ],
  },
};

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = fromSlug(slug);
  if (!cat) return {};

  const catTools = toolsByCategory(cat);
  const m = CAT_META[cat];

  return {
    title: `${cat} JSON Tools - Free Online ${cat} Tools | BeYourTools`,
    description: m.description,
    keywords: catTools
      .map((t) => t.name)
      .concat(["JSON", cat, "free online tools", "browser-based"])
      .join(", "),
    alternates: { canonical: `${SITE.url}/json-tools/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE.url}/json-tools/${slug}`,
      title: `${cat} JSON Tools | BeYourTools`,
      description: m.description,
      images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: `${cat} JSON Tools` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat} JSON Tools | BeYourTools`,
      description: m.description,
      site: "@beyourtools",
      images: [`${SITE.url}/og-default.png`],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function JsonCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const cat = fromSlug(slug);
  if (!cat) notFound();

  const catTools = toolsByCategory(cat);
  const m = CAT_META[cat];
  const pageUrl = canonical(`/json-tools/${slug}`);
  const siblingCats = categories.filter((c) => c !== cat);

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: "JSON Tools", url: canonical("/json-tools") },
      { name: cat, url: pageUrl },
    ]),
    softwareApplicationSchema({
      name: `BeYourTools JSON Tools - ${cat}`,
      description: m.description,
      url: pageUrl,
      category: "DeveloperApplication",
    }),
    itemListSchema(
      catTools.map((t) => ({
        name: t.name,
        url: canonical(`/${t.slug}`),
        description: t.description,
      }))
    ),
    faqSchema(m.faqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
            <li>
              <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>
                BeYourTools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/json-tools" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>
                JSON Tools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li style={{ color: "var(--text-secondary)" }} aria-current="page">{cat}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-lg font-bold"
              style={{ backgroundColor: m.bg, border: `1px solid ${m.border}`, color: m.color }}
              aria-hidden="true"
            >
              {m.icon}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: m.color }}>
              JSON Tools
            </p>
          </div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            {cat}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {m.intro}
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
            {[`${catTools.length} tools`, "100% browser-based", "No upload required", "Free forever"].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Tool grid */}
        <section aria-labelledby="tools-heading">
          <h2
            id="tools-heading"
            className="mb-4 font-display text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            All {cat} Tools
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {catTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="focus-ring group flex flex-col justify-between rounded-lg border p-4 transition hover-card"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
              >
                <div>
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="font-mono text-[11px]" style={{ color: m.color }} aria-hidden="true">
                      {"{ }"}
                    </span>
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
                  style={{ color: m.color }}
                  aria-hidden="true"
                >
                  Open tool →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="mb-4 font-display text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {m.faqs.map(({ question, answer }) => (
              <div key={question}>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{question}</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other categories */}
        <section className="mt-12 border-t pt-8" style={{ borderColor: "var(--border)" }}>
          <h2
            className="mb-4 text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--text-subtle)" }}
          >
            Other JSON Tool Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblingCats.map((c) => (
              <Btn variant="pill" key={c} href={`/json-tools/${toSlug(c)}`}>
                <span aria-hidden="true">{CAT_META[c].icon}</span>
                {c}
              </Btn>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/json-tools"
              className="focus-ring text-xs font-medium hover:underline"
              style={{ color: "var(--teal)" }}
            >
              ← All JSON Tools
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
