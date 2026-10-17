import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { contentLocale } from "@/lib/i18n-content";
import CategoryIcon, { type CategoryIconName } from "@/components/CategoryIcon";

const CATEGORIES: { key: string; href: string; icon: CategoryIconName }[] = [
  { key: "json",    href: "/json-tools",       icon: "json" },
  { key: "image",   href: "/image-converter",  icon: "image" },
  { key: "pdf",     href: "/pdf-tools",        icon: "pdf" },
  { key: "video",   href: "/video-tools",      icon: "video" },
  { key: "audio",   href: "/audio-tools",      icon: "audio" },
  { key: "qr",      href: "/qr-barcode-tools", icon: "qr" },
  { key: "finance", href: "/finance-tools",    icon: "finance" },
];

export default async function NotFound() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });
  const tn = await getTranslations({ locale, namespace: "nav" });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent-text)" }}>
        Error 404
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-5xl" style={{ color: "var(--text-primary)" }}>
        {t("title")}
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {t("body")}
      </p>

      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/"
          className="focus-ring rounded-md px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
        >
          {t("backHome")}
        </Link>
      </div>

      <div className="mt-14 border-t pt-10 text-left" style={{ borderColor: "var(--border)" }}>
        <h2 className="font-display mb-5 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          {t("browseCategories")}
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
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent-text)" }}
                  aria-hidden="true"
                >
                  <CategoryIcon name={cat.icon} className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold group-hover:underline" style={{ color: "var(--text-primary)" }}>
                  {tn(`categories.${cat.key}.label`)}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {tn(`categories.${cat.key}.description`)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
