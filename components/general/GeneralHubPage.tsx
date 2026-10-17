import { Link } from "@/i18n/navigation";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import { breadcrumbSchema, faqSchema, softwareApplicationSchema, SITE } from "@/lib/seo";
import { generalToolsByCategory, type GeneralToolCategory } from "@/lib/general-tools-config";

export interface HubDef {
  path: string;
  name: string;
  tagline: string;
  description: string;
  faqs: { question: string; answer: string }[];
}

export function hubSchemas(hub: HubDef, tools: { name: string }[]) {
  return [
    breadcrumbSchema([
      { name: "BeYourTools", url: SITE.url },
      { name: hub.name, url: SITE.url + hub.path },
    ]),
    softwareApplicationSchema({
      name: `BeYourTools ${hub.name}`,
      description: `${tools.length} free browser-based ${hub.name.toLowerCase()}: ${tools.map((t) => t.name).join(", ")}.`,
      url: SITE.url + hub.path,
      category: "UtilitiesApplication",
    }),
    faqSchema(hub.faqs),
  ];
}

export default function GeneralHubPage({ hub, category }: { hub: HubDef; category: GeneralToolCategory }) {
  const tools = generalToolsByCategory(category);

  return (
    <>
      <JsonLd data={hubSchemas(hub, tools)} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>
            BeYourTools
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{hub.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            {hub.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {hub.tagline}
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
            {[`${tools.length} tools`, "100% browser-based", "No sign-up", "Free forever"].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} aria-hidden="true" />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Tool cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.slug}
              href={`/${t.slug}`}
              className="focus-ring group flex flex-col justify-between rounded-xl border p-5 transition hover-card"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <div>
                <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  {t.name}
                </h2>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {t.description}
                </p>
              </div>
              <span className="mt-4 text-xs font-medium opacity-0 transition group-hover:opacity-100" style={{ color: "var(--accent)" }}>
                Use tool →
              </span>
            </Link>
          ))}
        </div>

        {/* FAQ */}
        <section className="mt-12 max-w-3xl" aria-label={`${hub.name} FAQs`}>
          <h2 className="mb-4 font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {hub.name} FAQs
          </h2>
          <FaqAccordion faqs={hub.faqs} />
        </section>

        {/* Privacy note */}
        <div
          className="mt-10 max-w-3xl rounded-lg border p-4 text-xs leading-relaxed"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
        >
          <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Privacy: </span>
          {hub.description}
        </div>
      </div>
    </>
  );
}
