import type { Metadata } from "next";
import Link from "next/link";
import { formats, routesBySourceFormat, getFormat, type ImageFormat } from "@/lib/image-tools-config";

export const metadata: Metadata = {
  title: "Image Converter — Convert JPG, PNG, WebP, AVIF, BMP, ICO, SVG, PDF and more",
  description:
    "Free browser-based image converter. Convert between JPG, PNG, WebP, AVIF, GIF, BMP, SVG, ICO, PDF and many other formats — no upload, no sign-up.",
};

const FORMAT_ICONS: Record<string, string> = {
  jpg: "🖼",
  png: "🖼",
  webp: "🌐",
  gif: "🎞",
  svg: "✏️",
  avif: "🗜",
  bmp: "🖼",
  tiff: "📷",
  ico: "🪟",
  heic: "📱",
  jxl: "🗜",
  psd: "🎨",
  tga: "🎮",
  pdf: "📄",
};

export default function ImageConverterHub() {
  const bySource = routesBySourceFormat();
  // Only show source formats that actually have routes
  const activeSources = formats.filter((f) => bySource[f.id]?.length > 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-1.5 text-xs text-mist-400">
          <Link href="/" className="focus-ring rounded hover:text-mist-100">Jsonifyr</Link>
          <span>/</span>
          <span className="text-mist-300">Image Converter</span>
        </div>
        <h1 className="font-display text-3xl font-semibold text-mist-50 sm:text-4xl">
          Image Converter
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist-300">
          Convert images between any format — entirely in your browser. Nothing is uploaded to a server.
          Supports JPG, PNG, WebP, AVIF, GIF, BMP, SVG, ICO, PDF, and more.
        </p>

        {/* Stats bar */}
        <div className="mt-5 flex flex-wrap gap-4 text-xs text-mist-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            {Object.values(bySource).reduce((s, r) => s + r.length, 0)} conversions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            {activeSources.length} formats
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Runs 100% in browser
          </span>
        </div>
      </div>

      {/* Popular quick-links */}
      <div className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mist-400">Popular</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "jpg-to-png", "jpg-to-webp", "jpg-to-pdf",
            "png-to-jpg", "png-to-webp", "png-to-svg",
            "webp-to-jpg", "webp-to-png", "svg-to-png",
          ].map((slug) => {
            const [from, , to] = slug.split("-");
            return (
              <Link
                key={slug}
                href={`/image-converter/${slug}`}
                className="focus-ring rounded-md border border-ink-600 bg-ink-900 px-3 py-1.5 text-xs font-medium text-mist-200 transition hover:border-amber-400/50 hover:text-mist-50"
              >
                {from.toUpperCase()} → {to.toUpperCase()}
              </Link>
            );
          })}
        </div>
      </div>

      {/* All conversions grouped by source */}
      <div className="space-y-10">
        {activeSources.map((fmt) => {
          const routes = bySource[fmt.id as ImageFormat] ?? [];
          return (
            <section key={fmt.id}>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">{FORMAT_ICONS[fmt.id] ?? "🖼"}</span>
                <h2 className="font-display text-base font-semibold text-mist-50">
                  {fmt.label} Converter
                </h2>
                <span className="rounded-full border border-ink-600 bg-ink-900 px-2 py-0.5 text-[10px] font-medium text-mist-400">
                  {routes.length} targets
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {routes.map((route) => {
                  const toFmt = getFormat(route.to)!;
                  return (
                    <Link
                      key={route.slug}
                      href={`/image-converter/${route.slug}`}
                      className="focus-ring group flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 text-xs transition hover:border-amber-400/40 hover:bg-ink-800"
                    >
                      <span className="font-mono font-semibold text-teal-400">{fmt.label}</span>
                      <span className="text-mist-500">→</span>
                      <span className="font-mono font-semibold text-amber-400 group-hover:text-amber-300">
                        {toFmt.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Format support note */}
      <div className="mt-12 rounded-lg border border-ink-700 bg-ink-900 p-4 text-xs leading-relaxed text-mist-400">
        <span className="font-semibold text-mist-300">Browser support note: </span>
        Most conversions run entirely via the browser&apos;s Canvas API — no server needed.
        Formats like TIFF, HEIC, JXL, PSD, and TGA require decoding support that varies by browser;
        those converters will show a helpful message if your browser cannot handle the file.
      </div>
    </div>
  );
}
