import { Link } from "@/i18n/navigation";
import { localizeMetadata, contentLocale, getTranslatedBlogPost } from "@/lib/i18n-content";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { tools } from "@/lib/tools-config";
import { pdfTools } from "@/lib/pdf-tools-config";
import { conversionRoutes, imageTools } from "@/lib/image-tools-config";
import { videoTools } from "@/lib/video-tools-config";
import { audioTools } from "@/lib/audio-tools-config";
import { qrBarcodeTools } from "@/lib/qr-barcode-config";
import { designTools } from "@/lib/design-tools-config";
import { generalTools } from "@/lib/general-tools-config";
import { financeTools } from "@/lib/finance-tools-config";
import { getRecentPosts, formatDate, SITE_AUTHOR } from "@/lib/blog";
import JsonLd from "@/components/JsonLd";
import HeroSearch from "@/components/HeroSearch";
import CategoryIcon, { CATEGORY_GRADIENTS, type CategoryIconName } from "@/components/CategoryIcon";
import FaqAccordion from "@/components/FaqAccordion";
import { websiteSchema, organizationSchema, faqSchema, SITE } from "@/lib/seo";
import { routing } from "@/i18n/routing";

const __enMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "BeYourTools - Free Online Tools for Everyone",
  description: "200+ free browser-based developer and utility tools: JSON, image converter, PDF, audio, video, and QR codes. Fast, private, no sign-up.",
  keywords: "free online tools, JSON formatter, image converter, PDF tools, audio converter, mp3 converter, video compressor, QR code generator, barcode generator",
  alternates: { canonical: SITE.url },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website", url: SITE.url, siteName: SITE.name, locale: "en_US",
    title: "BeYourTools - Free Online Tools for Everyone",
    description: "200+ free browser-based tools - JSON, image, PDF, audio, video, QR codes and more. Nothing leaves your browser.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "BeYourTools - Free Online Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BeYourTools - Free Online Tools for Everyone",
    description: "200+ free browser-based tools. Nothing leaves your browser.",
    site: SITE.twitter,
    images: [`${SITE.url}/og-default.png`],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "home", __enMetadata);
}

const JSON_FEATURED  = ["json-formatter","json-validator","json-diff","json-to-csv","json-to-typescript","json-schema-generator","jwt-decoder","json-repair"];
const IMAGE_FEATURED = ["jpg-to-png","jpg-to-webp","jpg-to-pdf","png-to-jpg","png-to-webp","png-to-svg","webp-to-jpg","svg-to-png","webp-to-png"];
const IMAGE_TOOLS_FEATURED = ["image-resizer","image-cropper","image-compressor","youtube-thumbnail-downloader"];
const PDF_FEATURED   = ["pdf-to-jpg","jpg-to-pdf","merge-pdf","split-pdf","pdf-compressor","protect-pdf","pdf-to-text","rotate-pdf","pdf-metadata-viewer"];
const VIDEO_FEATURED = ["video-compressor","video-cutter","video-converter","social-video-resizer","mp4-to-mp3","video-to-gif","video-thumbnail-generator","video-resizer","remove-audio-from-video"];
const AUDIO_FEATURED = ["mp3-converter","audio-converter","mp4-to-mp3","mp3-cutter","audio-cutter","mp3-compressor","mp3-merger","audio-joiner","mp3-to-wav","wav-to-mp3","m4a-to-mp3","mp3-volume-booster"];
const QR_FEATURED    = ["qr-code-generator","qr-code-generator-with-logo","qr-code-scanner","qr-code-decoder","wifi-qr-code-generator","barcode-generator","barcode-generator-with-logo","barcode-scanner","barcode-decoder","upc-barcode-generator","ean-barcode-generator","code-128-barcode-generator"];
const DESIGN_FEATURED = ["color-picker","color-palette-generator","favicon-generator"];
const TEXT_FEATURED = ["word-counter","case-converter","lorem-ipsum-generator","url-encoder-decoder"];
const DEV_FEATURED = ["password-generator","regex-tester","uuid-generator","hash-generator","timestamp-converter"];
const CALC_FEATURED = ["percentage-calculator","bmi-calculator","age-calculator"];
const FINANCE_FEATURED = [
  "loan-payment-calculator",
  "profit-margin-calculator",
  "savings-calculator",
  "roi-calculator",
  "debt-snowball-calculator",
  "credit-card-payoff-calculator",
  "hourly-to-salary-calculator",
  "sales-tax-calculator",
];

const jsonCount    = tools.length;
const imageCount   = conversionRoutes.length;
const imageToolsCount = imageTools.length;
const pdfCount     = pdfTools.length;
const videoCount   = videoTools.length;
const audioCount   = audioTools.length;
const qrCount      = qrBarcodeTools.length;
const financeCount = financeTools.length;
const designCount  = designTools.length;
const textCount    = generalTools.filter((t) => t.category === "Text Tools").length;
const devCount     = generalTools.filter((t) => t.category === "Developer Tools").length;
const calcCount    = generalTools.filter((t) => t.category === "Calculators").length;

// Total tool pages across every category (for the stats bar under the hero)
const totalToolCount =
  tools.length + conversionRoutes.length + imageTools.length + designTools.length +
  pdfTools.length + videoTools.length + audioTools.length + qrBarcodeTools.length +
  generalTools.length + financeTools.length;
const categoryCount = 11; // json, image, design, pdf, video, audio, qr, finance, text, dev, calc
const languageCount = routing.locales.length;


export default async function Home() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  const faqs = t.raw("faqs") as { question: string; answer: string }[];
  const schemas = [websiteSchema(), organizationSchema(), faqSchema(faqs)];

  return (
    <>
      <JsonLd data={schemas} />
      <div>
        <Hero />
        <StatsBar />
        <ToolSections />
        <HowItWorks />
        <FaqSection />
        <BlogSection />
        <BottomCta />
      </div>
    </>
  );
}

// ── Category tile: gradient icon chip (Pixelied-style playful color) ──────────
function Tile({ name, size = "md" }: { name: CategoryIconName; size?: "md" | "sm" }) {
  const g = CATEGORY_GRADIENTS[name];
  return (
    <span
      className={`flex shrink-0 items-center justify-center shadow-lg ${
        size === "md" ? "h-12 w-12 rounded-2xl" : "h-9 w-9 rounded-xl"
      }`}
      style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})`, color: "#1a1207" }}
      aria-hidden="true"
    >
      <CategoryIcon name={name} className={size === "md" ? "h-6 w-6" : "h-4 w-4"} />
    </span>
  );
}

// ── Hero: bold dark band (dark in both themes), oversized Cabin headline ─────
const HERO_PILLS: { key: string; href: string; icon: CategoryIconName }[] = [
  { key: "json",    href: "#json-tools",      icon: "json" },
  { key: "image",   href: "#image-converter", icon: "image" },
  { key: "pdf",     href: "#pdf-tools",       icon: "pdf" },
  { key: "video",   href: "#video-tools",     icon: "video" },
  { key: "audio",   href: "#audio-tools",     icon: "audio" },
  { key: "qr",      href: "#qr-barcode-tools", icon: "qr" },
  { key: "finance", href: "#finance-tools",   icon: "finance" },
];

async function Hero() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#0a0a14" }}>
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full opacity-25 blur-3xl" style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 right-1/5 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }} />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 44px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 44px)",
            maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pb-20 sm:pt-28">
        <div
          className="mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
          style={{ borderColor: "rgba(251,191,36,0.4)", backgroundColor: "rgba(251,191,36,0.1)", color: "#fde68a" }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#fbbf24" }} />
          {t("badge")}
        </div>

        <h1 className="font-display mx-auto max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl" style={{ color: "#ffffff" }}>
          {t("h1a")}{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(100deg, #fde68a 0%, #fbbf24 45%, #f59e0b 100%)" }}
          >
            {t("h1b")}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
          {t("sub")}
        </p>

        <div className="mt-9">
          <HeroSearch />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {HERO_PILLS.map(({ key, href, icon }) => (
            <a
              key={href}
              href={href}
              className="focus-ring flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition hover:-translate-y-0.5"
              style={{ borderColor: "rgba(255,255,255,0.14)", backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.75)" }}
            >
              <CategoryIcon name={icon} className="h-3.5 w-3.5" />
              {t(`pills.${key}`)}
            </a>
          ))}
        </div>

        <div
          className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-4 lg:grid-cols-7"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          {[
            { count: jsonCount,    key: "json" },
            { count: imageCount + imageToolsCount, key: "image" },
            { count: pdfCount,     key: "pdf" },
            { count: videoCount,   key: "video" },
            { count: audioCount,   key: "audio" },
            { count: qrCount,      key: "qr" },
            { count: financeCount, key: "finance" },
          ].map(({ count, key }) => (
            <div key={key} className="text-center">
              <div className="font-display text-2xl font-bold sm:text-3xl" style={{ color: "#ffffff" }}>
                {count}+
              </div>
              <div className="mt-1 text-[11px] font-medium uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>
                {t(`stats.${key}`)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Soft curve into the page below */}
      <div aria-hidden="true" className="relative h-8" style={{ background: "linear-gradient(to bottom, transparent, var(--bg-page))" }} />
    </section>
  );
}

// ── Stats bar: live totals directly under the hero ───────────────────────────
async function StatsBar() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  const stats = [
    { value: `${totalToolCount}+`, label: t("statsBar.tools", { count: totalToolCount }), sub: t("statsBar.toolsLabel") },
    { value: `${categoryCount}`,   label: t("statsBar.categories", { count: categoryCount }), sub: t("statsBar.categoriesLabel") },
    { value: `${languageCount}`,   label: t("statsBar.languages", { count: languageCount }), sub: t("statsBar.languagesLabel") },
  ];
  const notes = [
    { value: t("statsBar.free"),     sub: t("statsBar.freeLabel") },
    { value: t("statsBar.noSignup"), sub: t("statsBar.noSignupLabel") },
  ];
  return (
    <section aria-label="BeYourTools stats" className="border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-6 px-4 py-8 sm:px-6">
        {stats.map(({ value, label, sub }) => (
          <div key={label} className="text-center">
            <div className="font-display text-3xl font-bold tracking-tight" style={{ color: "var(--accent-text)" }}>
              {value}
            </div>
            <div className="mt-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{label}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{sub}</div>
          </div>
        ))}
        <div className="hidden h-12 w-px sm:block" style={{ backgroundColor: "var(--border)" }} aria-hidden="true" />
        {notes.map(({ value, sub }) => (
          <div key={value} className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              aria-hidden="true"
            >
              ✓
            </span>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{value}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── How it works: compact 3-step strip ───────────────────────────────────────
async function HowItWorks() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  const steps = t.raw("howItWorks.steps") as { title: string; desc: string }[];
  return (
    <section aria-label={t("howItWorks.title")} className="border-y" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent-text)" }}>
          {t("howItWorks.eyebrow")}
        </p>
        <h2 className="font-display mt-2 text-center text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {t("howItWorks.title")}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.4)]"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
            >
              <div
                className="font-display mb-4 flex h-10 w-10 items-center justify-center rounded-full text-base font-bold"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
                aria-hidden="true"
              >
                {i + 1}
              </div>
              <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Category sections ────────────────────────────────────────────────────────
interface SectionMeta {
  icon: CategoryIconName;
  accent: string;   // "All X →" link color
  shadow: string;   // per-category hover glow (Tailwind arbitrary)
}

// Single-accent scheme: every category uses the refined gold accent.
const SECTION_META: Record<CategoryIconName, SectionMeta> = {
  json:    { icon: "json",    accent: "var(--accent-text)", shadow: "hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.4)]" },
  image:   { icon: "image",   accent: "var(--accent-text)", shadow: "hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.4)]" },
  pdf:     { icon: "pdf",     accent: "var(--accent-text)", shadow: "hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.4)]" },
  video:   { icon: "video",   accent: "var(--accent-text)", shadow: "hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.4)]" },
  audio:   { icon: "audio",   accent: "var(--accent-text)", shadow: "hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.4)]" },
  qr:      { icon: "qr",      accent: "var(--accent-text)", shadow: "hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.4)]" },
  finance: { icon: "finance", accent: "var(--accent-text)", shadow: "hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.4)]" },
  text:    { icon: "text",    accent: "var(--accent-text)", shadow: "hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.4)]" },
  dev:     { icon: "dev",     accent: "var(--accent-text)", shadow: "hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.4)]" },
  calc:    { icon: "calc",    accent: "var(--accent-text)", shadow: "hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.4)]" },
};

async function ToolSections() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  const withCount = (key: string, count: number) => ({
    title: t(`sections.${key}.title`),
    description: t(`sections.${key}.description`, { count }),
    cta: t(`sections.${key}.cta`),
  });
  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4 py-20 sm:px-6">
      <ToolSection
        id="json-tools" icon="json" {...withCount("json", jsonCount)}
        href="/json-tools"
        featured={JSON_FEATURED.map((s) => tools.find((t) => t.slug === s)).filter(Boolean) as typeof tools}
        cardHref={(s) => `/${s}`} />

      <ToolSection
        id="image-converter" icon="image" {...withCount("image", imageCount)}
        href="/image-converter"
        featured={[
          ...IMAGE_TOOLS_FEATURED.map((s) => imageTools.find((t) => t.slug === s)).filter(Boolean) as typeof imageTools,
          ...IMAGE_FEATURED.map((s) => { const [f,,t]=s.split("-"); return { slug:s, name:`${f.toUpperCase()} → ${t.toUpperCase()}`, description:`Convert ${f.toUpperCase()} to ${t.toUpperCase()} in your browser.` }; }),
        ]}
        cardHref={(s) => IMAGE_TOOLS_FEATURED.includes(s) ? `/${s}` : `/image-converter/${s}`} />

      <ToolSection
        id="design-tools" icon="image" {...withCount("design", designCount)}
        href="/design-tools"
        featured={DESIGN_FEATURED.map((s) => designTools.find((t) => t.slug === s)).filter(Boolean) as typeof designTools}
        cardHref={(s) => `/${s}`} />

      <ToolSection
        id="pdf-tools" icon="pdf" {...withCount("pdf", pdfCount)}
        href="/pdf-tools"
        featured={PDF_FEATURED.map((s) => pdfTools.find((t) => t.slug === s)).filter(Boolean) as typeof pdfTools}
        cardHref={(s) => `/pdf-tools/${s}`} />

      <ToolSection
        id="video-tools" icon="video" {...withCount("video", videoCount)}
        href="/video-tools"
        featured={VIDEO_FEATURED.map((s) => videoTools.find((t) => t.slug === s)).filter(Boolean) as typeof videoTools}
        cardHref={(s) => `/${s}`} />

      <ToolSection
        id="audio-tools" icon="audio" {...withCount("audio", audioCount)}
        href="/audio-tools"
        featured={AUDIO_FEATURED.map((s) => audioTools.find((t) => t.slug === s)).filter(Boolean) as typeof audioTools}
        cardHref={(s) => `/${s}`} />

      <ToolSection
        id="qr-barcode-tools" icon="qr" {...withCount("qr", qrCount)}
        href="/qr-barcode-tools"
        featured={QR_FEATURED.map((s) => qrBarcodeTools.find((t) => t.slug === s)).filter(Boolean) as typeof qrBarcodeTools}
        cardHref={(s) => `/${s}`} />

      <FinanceSection />

      <ToolSection
        id="text-tools" icon="text" {...withCount("text", textCount)}
        href="/text-tools"
        featured={TEXT_FEATURED.map((s) => generalTools.find((t) => t.slug === s)).filter(Boolean) as typeof generalTools}
        cardHref={(s) => `/${s}`} />

      <ToolSection
        id="developer-tools" icon="dev" {...withCount("dev", devCount)}
        href="/developer-tools"
        featured={DEV_FEATURED.map((s) => generalTools.find((t) => t.slug === s)).filter(Boolean) as typeof generalTools}
        cardHref={(s) => `/${s}`} />

      <ToolSection
        id="calculators" icon="calc" {...withCount("calc", calcCount)}
        href="/calculators"
        featured={CALC_FEATURED.map((s) => generalTools.find((t) => t.slug === s)).filter(Boolean) as typeof generalTools}
        cardHref={(s) => `/${s}`} />
    </div>
  );
}

function ToolSection({ id, icon, title, description, href, cta, featured, cardHref }: {
  id: string; icon: CategoryIconName; title: string; description: string;
  href: string; cta: string;
  featured: { slug: string; name: string; description: string }[];
  cardHref: (slug: string) => string;
}) {
  const meta = SECTION_META[icon];
  return (
    <section id={id} aria-label={title} className="scroll-mt-24">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Tile name={icon} />
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{title}</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{description}</p>
          </div>
        </div>
        <Link
          href={href}
          className="focus-ring group flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: meta.accent }}
        >
          {cta}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {featured.map((tool) => (
          <Link
            key={tool.slug}
            href={cardHref(tool.slug)}
            className={`focus-ring group flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 ${meta.shadow}`}
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <div>
              <div className="mb-2.5 flex items-center gap-2.5">
                <Tile name={icon} size="sm" />
                <h3 className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{tool.name}</h3>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.description}</p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold opacity-0 transition group-hover:opacity-100" style={{ color: meta.accent }} aria-hidden="true">
              Open tool <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
        <Link
          href={href}
          className="focus-ring group flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-5 text-center transition-all duration-200 hover:-translate-y-1"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full text-lg transition-transform group-hover:scale-110" style={{ backgroundColor: "var(--bg-elevated)", color: meta.accent }} aria-hidden="true">→</span>
          <span className="text-xs font-semibold">View all {title}</span>
        </Link>
      </div>
    </section>
  );
}

// ── Finance cluster quick-links + cards ──────────────────────────────────────
const FINANCE_CLUSTERS = [
  { key: "business",  href: "/finance-tools/business-finance-calculators" },
  { key: "salary",    href: "/finance-tools/salary-income-calculators" },
  { key: "loans",     href: "/finance-tools/loan-calculators" },
  { key: "debt",      href: "/finance-tools/debt-credit-calculators" },
  { key: "savings",   href: "/finance-tools/savings-interest-calculators" },
  { key: "tax",       href: "/finance-tools/tax-pricing-calculators" },
  { key: "marketing", href: "/finance-tools/marketing-roi-calculators" },
];

async function FinanceSection() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  const meta = SECTION_META.finance;
  const featured = FINANCE_FEATURED
    .map((s) => financeTools.find((t) => t.slug === s))
    .filter(Boolean) as typeof financeTools;

  return (
    <section id="finance-tools" aria-label="Finance Tools" className="scroll-mt-24">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Tile name="finance" />
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{t("sections.finance.title")}</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {t("sections.finance.description", { count: financeCount })}
            </p>
          </div>
        </div>
        <Link
          href="/finance-tools"
          className="focus-ring group flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: meta.accent }}
        >
          {t("sections.finance.cta")}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FINANCE_CLUSTERS.map(({ key, href }) => (
          <Link
            key={href}
            href={href}
            className="focus-ring rounded-full border px-3.5 py-1.5 text-xs font-medium transition hover:-translate-y-0.5"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
          >
            {t(`financeClusters.${key}`)}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {featured.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className={`focus-ring group flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 ${meta.shadow}`}
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <div>
              <div className="mb-2.5 flex items-center gap-2.5">
                <Tile name="finance" size="sm" />
                <h3 className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{tool.name}</h3>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.description}</p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold opacity-0 transition group-hover:opacity-100" style={{ color: meta.accent }} aria-hidden="true">
              Calculate <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
        <Link
          href="/finance-tools"
          className="focus-ring group flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-5 text-center transition-all duration-200 hover:-translate-y-1"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full text-lg transition-transform group-hover:scale-110" style={{ backgroundColor: "var(--bg-elevated)", color: meta.accent }} aria-hidden="true">→</span>
          <span className="text-xs font-semibold">{t("sections.finance.viewAll")}</span>
        </Link>
      </div>
    </section>
  );
}

// ── Visible FAQ (mirrors the JSON-LD FAQ schema above) ────────────────────────
async function FaqSection() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  const faqs = t.raw("faqs") as { question: string; answer: string }[];
  return (
    <section aria-label={t("faqTitle")} className="mx-auto max-w-3xl px-4 pb-4 sm:px-6">
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent-text)" }}>
          {t("faqEyebrow")}
        </p>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--text-primary)" }}>
          {t("faqTitle")}
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          {t("faqSub")}
        </p>
      </div>
      <FaqAccordion faqs={faqs} />
    </section>
  );
}

// ── Blog preview ─────────────────────────────────────────────────────────────
const BLOG_BADGE: Record<string, string> = {
  JSON: "var(--accent-text)", Image: "var(--accent-text)", PDF: "var(--coral)",
};

async function BlogSection() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  const enPosts = getRecentPosts(3);
  const posts = await Promise.all(
    enPosts.map(async (p) => {
      const tp = await getTranslatedBlogPost(locale, p.slug);
      return { ...p, title: tp?.title ?? p.title, excerpt: tp?.excerpt ?? p.excerpt };
    })
  );
  return (
    <section id="blog" aria-label="Blog" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent-text)" }}>
            From the blog
          </p>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            {t("blogTitle")}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {t("blogSub", { name: SITE_AUTHOR.name, role: SITE_AUTHOR.role })}
          </p>
        </div>
        <Link
          href="/blog"
          className="focus-ring group flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--accent-text)" }}
        >
          {t("blogCta")}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const badgeColor = BLOG_BADGE[post.category] ?? "var(--accent-text)";
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="focus-ring group flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.35)]"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <div className="flex items-center justify-between border-b px-5 py-3.5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{ backgroundColor: `color-mix(in srgb, ${badgeColor} 15%, transparent)`, color: badgeColor }}
                >
                  {post.category}
                </span>
                <span className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{t("minRead", { count: post.readingTime })}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-base font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{post.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between border-t pt-3 text-[11px]" style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}>
                  <span>{formatDate(post.publishedAt)} · {t("byAuthor", { name: SITE_AUTHOR.name })}</span>
                  <span className="font-semibold transition group-hover:translate-x-0.5" style={{ color: "var(--accent-text)" }}>{t("readMore")}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ── Bottom CTA: dark gradient panel ──────────────────────────────────────────
async function BottomCta() {
  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  const perks = t.raw("perks") as { title: string; body: string }[];
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div
        className="relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-16"
        style={{ background: "linear-gradient(135deg, #12101f 0%, #1b1533 55%, #241a3f 100%)" }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full opacity-25 blur-3xl" style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)" }} />
          <div className="absolute -bottom-28 right-1/4 h-72 w-72 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }} />
        </div>
        <div className="relative">
          <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "#ffffff" }}>
            {t("ctaTitleA")}{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(100deg, #fde68a, #fbbf24)" }}>
              {t("ctaTitleB")}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed sm:text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
            {t("ctaSub")}
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
            {[
              { icon: (<path d="M7 10.5V7.5a5 5 0 0 1 10 0v3M5.5 10.5h13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" />) },
              { icon: (<path d="M13 2.5 4.5 13.5H11L9.5 21.5 19 10h-6.5z" />) },
              { icon: (<><path d="m9 12.5 2 2 4-4.5" /><circle cx="12" cy="12" r="9" /></>) },
            ].map(({ icon }, i) => {
              const { title, body } = perks[i];
              return (
              <div
                key={title}
                className="rounded-2xl border p-5"
                style={{ borderColor: "rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)" }}
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
                  style={{ background: "linear-gradient(135deg, #fcd34d, #d97706)", color: "#1a1207" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    {icon}
                  </svg>
                </div>
                <div className="mb-1 text-sm font-semibold" style={{ color: "#ffffff" }}>{title}</div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{body}</p>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
