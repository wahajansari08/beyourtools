import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found (404) | BeYourTools",
  description: "The page you are looking for does not exist or has moved. Explore our 200+ free browser-based tools.",
  robots: {
    index: false,
    follow: true,
  },
};

const CATEGORIES = [
  { name: "JSON Tools", href: "/json-tools", icon: "{ }", desc: "Format, validate, diff & convert JSON" },
  { name: "Image Converter", href: "/image-converter", icon: "🖼", desc: "118 conversion pairs for JPG, PNG, WebP, SVG" },
  { name: "PDF Tools", href: "/pdf-tools", icon: "📄", desc: "Merge, split, compress & protect PDFs" },
  { name: "Video Tools", href: "/video-tools", icon: "🎬", desc: "Compress, convert, trim & create GIFs" },
  { name: "Audio Tools", href: "/audio-tools", icon: "🎵", desc: "Convert, cut, compress & normalize audio" },
  { name: "QR & Barcode Tools", href: "/qr-barcode-tools", icon: "▦", desc: "Generate & scan QR codes and barcodes" },
  { name: "Finance Calculators", href: "/finance-tools", icon: "💰", desc: "40 calculators for loans, margins, taxes & savings" },
];

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-24 text-center">
      <p className="font-mono text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--teal)" }}>
        Error 404
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl" style={{ color: "var(--text-primary)" }}>
        Page not found
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        The page or tool you requested does not exist or may have been moved. Everything on BeYourTools runs privately in your browser with no uploads.
      </p>

      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/"
          className="focus-ring rounded-md px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
        >
          Back to Homepage
        </Link>
      </div>

      <div className="mt-14 border-t pt-10 text-left" style={{ borderColor: "var(--border)" }}>
        <h2 className="mb-5 font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          Browse popular tool categories
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="focus-ring group rounded-xl border p-4 transition hover:-translate-y-0.5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl" aria-hidden="true">{cat.icon}</span>
                <span className="text-sm font-semibold group-hover:underline" style={{ color: "var(--text-primary)" }}>
                  {cat.name}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
