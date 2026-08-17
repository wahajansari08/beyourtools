import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getConversion,
  getFormat,
  conversionRoutes,
  conversionTitle,
  conversionsFrom,
  conversionsTo,
  type ConversionRoute,
} from "@/lib/image-tools-config";
import ConverterClient from "./ConverterClient";

interface Props {
  params: Promise<{ conversion: string }>;
}

export async function generateStaticParams() {
  return conversionRoutes.map((r) => ({ conversion: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { conversion } = await params;
  const route = getConversion(conversion);
  if (!route) return { title: "Not Found" };
  const from = getFormat(route.from)!;
  const to   = getFormat(route.to)!;
  return {
    title: `${from.label} to ${to.label} Converter — Free Online Tool`,
    description: `Convert ${from.label} images to ${to.label} format instantly in your browser. No upload, no sign-up, completely free.`,
  };
}

function RelatedConversions({ route }: { route: ConversionRoute }) {
  const sameFrom = conversionsFrom(route.from).filter((r) => r.slug !== route.slug).slice(0, 8);
  const sameTo   = conversionsTo(route.to).filter((r) => r.slug !== route.slug).slice(0, 8);

  return (
    <div className="mt-10 space-y-6">
      {sameFrom.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-mist-400">
            More {getFormat(route.from)!.label} conversions
          </h2>
          <div className="flex flex-wrap gap-2">
            {sameFrom.map((r) => (
              <Link
                key={r.slug}
                href={`/image-converter/${r.slug}`}
                className="focus-ring rounded-md border border-ink-700 bg-ink-900 px-3 py-1.5 text-xs text-mist-300 transition hover:border-ink-500 hover:text-mist-50"
              >
                {conversionTitle(r)}
              </Link>
            ))}
          </div>
        </div>
      )}
      {sameTo.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-mist-400">
            Other converters to {getFormat(route.to)!.label}
          </h2>
          <div className="flex flex-wrap gap-2">
            {sameTo.map((r) => (
              <Link
                key={r.slug}
                href={`/image-converter/${r.slug}`}
                className="focus-ring rounded-md border border-ink-700 bg-ink-900 px-3 py-1.5 text-xs text-mist-300 transition hover:border-ink-500 hover:text-mist-50"
              >
                {conversionTitle(r)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function Page({ params }: Props) {
  const { conversion } = await params;
  const route = getConversion(conversion);
  if (!route) notFound();

  const from = getFormat(route.from)!;
  const to   = getFormat(route.to)!;
  const title = conversionTitle(route);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-5 flex items-center gap-1.5 text-xs text-mist-400">
        <Link href="/" className="focus-ring rounded hover:text-mist-100">Jsonifyr</Link>
        <span>/</span>
        <Link href="/image-converter" className="focus-ring rounded hover:text-mist-100">Image Converter</Link>
        <span>/</span>
        <span className="text-mist-300">{title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-mist-50 sm:text-3xl">
          {from.label} to {to.label} Converter
        </h1>
        <p className="mt-2 text-sm text-mist-300">
          Convert {from.label} images to {to.label} format directly in your browser.
          No file upload, no account required.
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

      {/* Related */}
      <RelatedConversions route={route} />
    </div>
  );
}
