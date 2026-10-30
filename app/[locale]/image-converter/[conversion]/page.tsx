import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  getConversion,
  getFormat,
  getFormatNotes,
  pairInsight,
  conversionRoutes,
  conversionTitle,
  conversionsFrom,
  conversionsTo,
  type ConversionRoute,
} from "@/lib/image-tools-config";
import {
  pairIntro,
  pairWhenTo,
  pairWhenNotTo,
  pairQualitySize,
  pairTableRows,
  pairFormatProfiles,
  pairFaqs,
  pairSettingTip,
  pairMetaDescription,
  pairDeepDive,
} from "@/lib/image-pair-content";
import ConverterClient from "./ConverterClient";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, webAppSchema, SITE, canonical } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { getTranslatedToolContent, localeCanonical, hreflangAlternates } from "@/lib/i18n-content";
import { getTranslations } from "next-intl/server";
import Btn from "@/components/Btn";

interface Props {
  params: Promise<{ conversion: string; locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    conversionRoutes.map((r) => ({ locale, conversion: r.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { conversion, locale } = await params;
  const route = getConversion(conversion);
  if (!route) return { title: "Not Found" };
  const from = getFormat(route.from)!;
  const to   = getFormat(route.to)!;
  const tc = await getTranslatedToolContent(locale, `image:${route.slug}`);
  const t = await getTranslations({ locale, namespace: "common" });
  // Title is templated per locale so grammar is correct in every language
  // (format names like JPG/PNG stay in English).
  const title = t("converterTitle", { from: from.label, to: to.label });
  const description = tc?.description ?? pairMetaDescription(route);
  const url = localeCanonical(locale, `/image-converter/${route.slug}`);
  const image = `${SITE.url}/og-default.png`;
  const path = `/image-converter/${route.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates(locale, path) },
    keywords: `${from.label} to ${to.label}, convert ${from.label} to ${to.label}, ${from.label} to ${to.label} converter, free image converter`,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630, alt: `${from.label} to ${to.label} Converter` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: SITE.twitter,
      images: [image],
    },
  };
}

function RelatedConversions({ route }: { route: ConversionRoute }) {
  const sameFrom = conversionsFrom(route.from).filter((r) => r.slug !== route.slug).slice(0, 8);
  const sameTo   = conversionsTo(route.to).filter((r) => r.slug !== route.slug).slice(0, 8);

  return (
    <div className="mt-10 space-y-6">
      {sameFrom.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
            More {getFormat(route.from)!.label} conversions
          </h2>
          <div className="flex flex-wrap gap-2">
            {sameFrom.map((r) => (
              <Btn key={r.slug} variant="pill" href={`/image-converter/${r.slug}`}>
                {conversionTitle(r)}
              </Btn>
            ))}
          </div>
        </div>
      )}
      {sameTo.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
            Other converters to {getFormat(route.to)!.label}
          </h2>
          <div className="flex flex-wrap gap-2">
            {sameTo.map((r) => (
              <Btn key={r.slug} variant="pill" href={`/image-converter/${r.slug}`}>
                {conversionTitle(r)}
              </Btn>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function Page({ params }: Props) {
  const { conversion, locale } = await params;
  setRequestLocale(locale);
  const route = getConversion(conversion);
  if (!route) notFound();

  const from = getFormat(route.from)!;
  const to   = getFormat(route.to)!;
  const tc = await getTranslatedToolContent(locale, `image:${route.slug}`);
  const insights  = tc?.insight ?? pairInsight(route.from, route.to);
  const intro = pairIntro(route);
  const whenTo = pairWhenTo(route);
  const whenNotTo = pairWhenNotTo(route);
  const qualitySize = pairQualitySize(route);
  const settingTip = pairSettingTip(route);
  const title = conversionTitle(route);
  const url = localeCanonical(locale, `/image-converter/${route.slug}`);

  const deepDive = pairDeepDive(route);
  const faqs = [...pairFaqs(route), ...(deepDive?.faqs ?? [])];

  const schemas = [
    breadcrumbSchema([
      { name: "BeYourTools",    url: SITE.url },
      { name: "Image Converter", url: canonical("/image-converter") },
      { name: title,             url },
    ]),
    webAppSchema({
      name: `${from.label} to ${to.label} Converter`,
      description: `Free online ${from.label} to ${to.label} image converter. Runs entirely in your browser - no upload required.`,
      url,
    }),
    faqSchema(faqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/"               className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>BeYourTools</Link>
          <span>/</span>
          <Link href="/image-converter" className="focus-ring rounded hover:underline" style={{ color: "var(--text-muted)" }}>Image Converter</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            {from.label} to {to.label} Converter
          </h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {intro[0]}
          </p>
        </div>

        {/* Converter */}
        <ConverterClient
          fromFormat={route.from}
          toFormat={route.to}
          fromLabel={from.label}
          toLabel={to.label}
          acceptMimes={from.mimes.join(",")}
          acceptExts={from.extensions.map((e) => `.${e}`).join(",")}
        />

        {/* How to use */}
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            How to convert {from.label} to {to.label}
          </h2>
          <ol className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2"><span className="font-semibold shrink-0" style={{ color: "var(--accent-text)" }}>1.</span>Drop your {from.label} file onto the upload area or click to browse.</li>
            <li className="flex gap-2"><span className="font-semibold shrink-0" style={{ color: "var(--accent-text)" }}>2.</span>The converter processes your file locally - no upload needed.</li>
            <li className="flex gap-2"><span className="font-semibold shrink-0" style={{ color: "var(--accent-text)" }}>3.</span>Click <strong>Download</strong> to save your {to.label} file.</li>
          </ol>
          {settingTip && (
            <p className="rounded-lg border p-3 text-sm leading-relaxed" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--text-secondary)" }}>Good to know:</strong> {settingTip}
            </p>
          )}
        </section>

        {/* Format guide: {from} vs {to}, built from per-format facts, unique to this pair */}
        <section className="mt-10 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {from.label} vs {to.label}: format guide
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {intro[1]}
          </p>
          {insights.length > 0 && (
            <ul className="space-y-2 text-sm list-disc pl-5" style={{ color: "var(--text-muted)" }}>
              {insights.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr style={{ backgroundColor: "var(--bg-elevated)" }}>
                  <th className="border px-3 py-2 text-left font-semibold" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>Feature</th>
                  <th className="border px-3 py-2 text-left font-semibold" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>{from.label}</th>
                  <th className="border px-3 py-2 text-left font-semibold" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>{to.label}</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--text-muted)" }}>
                {pairTableRows(route).map(([label, a, b]) => (
                  <tr key={label}>
                    <td className="border px-3 py-2 font-medium" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>{label}</td>
                    <td className="border px-3 py-2" style={{ borderColor: "var(--border)" }}>{a}</td>
                    <td className="border px-3 py-2" style={{ borderColor: "var(--border)" }}>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pairFormatProfiles(route).map((p) => (
            <p key={p.slice(0, 24)} className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {p}
            </p>
          ))}
        </section>

        {/* Quality and file size consequences for this pair */}
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            What happens to quality and file size
          </h2>
          {qualitySize.map((p) => (
            <p key={p.slice(0, 32)} className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {p}
            </p>
          ))}
        </section>

        {/* When to convert / when to skip */}
        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              When to convert {from.label} to {to.label}
            </h2>
            <ul className="space-y-2 text-sm list-disc pl-5" style={{ color: "var(--text-muted)" }}>
              {whenTo.map((item) => (
                <li key={item.slice(0, 40)}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              When to skip it
            </h2>
            <ul className="space-y-2 text-sm list-disc pl-5" style={{ color: "var(--text-muted)" }}>
              {whenNotTo.map((item) => (
                <li key={item.slice(0, 40)}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Going deeper: worked example, edge cases and better-choice note (8 top pairs only) */}
        {deepDive && (
          <section className="mt-10 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Going deeper: {from.label} to {to.label}
            </h2>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              {deepDive.exampleHeading}
            </h3>
            {deepDive.example.map((p) => (
              <p key={p.slice(0, 32)} className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {p}
              </p>
            ))}
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Edge cases to watch for
            </h3>
            <ul className="space-y-2 text-sm list-disc pl-5" style={{ color: "var(--text-muted)" }}>
              {deepDive.edgeCases.map((edge) => (
                <li key={edge.title}>
                  <strong style={{ color: "var(--text-secondary)" }}>{edge.title}:</strong> {edge.body}
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--text-secondary)" }}>When another format is the better choice:</strong> {deepDive.betterChoice}
            </p>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{from.label} to {to.label} Frequently Asked Questions</h2>
          <dl className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{faq.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Related */}
        <RelatedConversions route={route} />
      </div>
    </>
  );
}
