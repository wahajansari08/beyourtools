"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { locales, localeNames, type Locale } from "@/i18n/routing";
import ThemeToggle from "./ThemeToggle";
import CategoryIcon, { type CategoryIconName } from "./CategoryIcon";
import dynamic from "next/dynamic";

const SearchOverlay = dynamic(() => import("./SearchOverlay"), { ssr: false });

// ── Mega menu data ────────────────────────────────────────────────────────────

// Category definitions (labels/descriptions come from the nav translations).
const TOOL_CATEGORY_DEFS: {
  key: string;
  href: string;
  iconName: CategoryIconName;
  gradient: [string, string];
  featured: { label: string; href: string }[];
}[] = [
  {
    key: "json",
    href:  "/json-tools",
    iconName: "json",
    gradient: ["#fcd34d", "#d97706"],
    featured: [
      { label: "JSON Formatter",           href: "/json-formatter" },
      { label: "JSON Validator",           href: "/json-validator" },
      { label: "JSON Diff",                href: "/json-diff" },
      { label: "JWT Decoder",              href: "/jwt-decoder" },
      { label: "JSON Schema Generator",    href: "/json-schema-generator" },
    ],
  },
  {
    key: "image",
    href:  "/image-converter",
    iconName: "image",
    gradient: ["#fcd34d", "#d97706"],
    featured: [
      { label: "JPG to PNG",               href: "/image-converter/jpg-to-png" },
      { label: "PNG to JPG",               href: "/image-converter/png-to-jpg" },
      { label: "JPG to WebP",              href: "/image-converter/jpg-to-webp" },
      { label: "JPG to PDF",               href: "/image-converter/jpg-to-pdf" },
      { label: "SVG to PNG",               href: "/image-converter/svg-to-png" },
    ],
  },
  {
    key: "design",
    href:  "/design-tools",
    iconName: "image",
    gradient: ["#fcd34d", "#d97706"],
    featured: [
      { label: "Color Picker",             href: "/color-picker" },
      { label: "Color Palette Generator",  href: "/color-palette-generator" },
      { label: "Favicon Generator",        href: "/favicon-generator" },
    ],
  },
  {
    key: "pdf",
    href:  "/pdf-tools",
    iconName: "pdf",
    gradient: ["#fcd34d", "#d97706"],
    featured: [
      { label: "Merge PDF",                href: "/pdf-tools/merge-pdf" },
      { label: "Split PDF",                href: "/pdf-tools/split-pdf" },
      { label: "PDF to JPG",               href: "/pdf-tools/pdf-to-jpg" },
      { label: "Compress PDF",             href: "/pdf-tools/pdf-compressor" },
      { label: "Protect PDF",              href: "/pdf-tools/protect-pdf" },
    ],
  },
  {
    key: "qr",
    href:  "/qr-barcode-tools",
    iconName: "qr",
    gradient: ["#fcd34d", "#d97706"],
    featured: [
      { label: "QR Code Generator",        href: "/qr-code-generator" },
      { label: "WiFi QR Generator",        href: "/wifi-qr-code-generator" },
      { label: "Barcode Generator",        href: "/barcode-generator" },
      { label: "QR Code Scanner",          href: "/qr-code-scanner" },
      { label: "Barcode Scanner",          href: "/barcode-scanner" },
    ],
  },
  {
    key: "audio",
    href:  "/audio-tools",
    iconName: "audio",
    gradient: ["#fcd34d", "#d97706"],
    featured: [
      { label: "MP3 Converter",            href: "/mp3-converter" },
      { label: "MP3 Cutter",               href: "/mp3-cutter" },
      { label: "MP4 to MP3",               href: "/mp4-to-mp3" },
      { label: "MP3 Compressor",           href: "/mp3-compressor" },
      { label: "Audio Recorder",           href: "/audio-recorder" },
    ],
  },
  {
    key: "video",
    href:  "/video-tools",
    iconName: "video",
    gradient: ["#fcd34d", "#d97706"],
    featured: [
      { label: "Video Compressor",         href: "/video-compressor" },
      { label: "Video Cutter",             href: "/video-cutter" },
      { label: "Video Converter",          href: "/video-converter" },
      { label: "Video to GIF",             href: "/video-to-gif" },
      { label: "Thumbnail Maker",          href: "/video-thumbnail-generator" },
    ],
  },
  {
    key: "finance",
    href:  "/finance-tools",
    iconName: "finance",
    gradient: ["#fcd34d", "#d97706"],
    featured: [
      { label: "Loan Payment",             href: "/loan-payment-calculator" },
      { label: "Profit Margin",            href: "/profit-margin-calculator" },
      { label: "Savings Calculator",       href: "/savings-calculator" },
      { label: "ROI Calculator",           href: "/roi-calculator" },
      { label: "Debt Snowball",            href: "/debt-snowball-calculator" },
    ],
  },
  {
    key: "dev",
    href:  "/developer-tools",
    iconName: "dev",
    gradient: ["#fcd34d", "#d97706"],
    featured: [
      { label: "Password Generator",       href: "/password-generator" },
      { label: "Regex Tester",             href: "/regex-tester" },
      { label: "UUID Generator",           href: "/uuid-generator" },
      { label: "Hash Generator",           href: "/hash-generator" },
      { label: "Timestamp Converter",      href: "/timestamp-converter" },
    ],
  },
  {
    key: "text",
    href:  "/text-tools",
    iconName: "text",
    gradient: ["#fcd34d", "#d97706"],
    featured: [
      { label: "Word Counter",             href: "/word-counter" },
      { label: "Case Converter",           href: "/case-converter" },
      { label: "Lorem Ipsum",              href: "/lorem-ipsum-generator" },
      { label: "URL Encoder/Decoder",      href: "/url-encoder-decoder" },
    ],
  },
  {
    key: "calc",
    href:  "/calculators",
    iconName: "calc",
    gradient: ["#fcd34d", "#d97706"],
    featured: [
      { label: "Percentage Calculator",    href: "/percentage-calculator" },
      { label: "BMI Calculator",           href: "/bmi-calculator" },
      { label: "Age Calculator",           href: "/age-calculator" },
    ],
  },
];

// Globe icon for the language switcher
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-4.8-3.8c.6-1.1 1.4-2.6 2-4.4l.2-.6c-1.5-.3-2.9-.3-4.4 0 .5 1.9 1.2 3.6 2.2 5ZM10 16.5c-1-.7-2.2-2.6-2.9-5.3-.1-.5-.2-1-.3-1.5h6.4c-.1.5-.2 1-.3 1.5-.7 2.7-1.9 4.6-2.9 5.3Zm4.8-1.3c1-1.4 1.7-3.1 2.2-5-1.5-.3-2.9-.3-4.4 0l.2.6c.6 1.8 1.4 3.3 2 4.4ZM4.2 8.5c1.9-.4 3.8-.4 5.8-.4s3.9 0 5.8.4a6.5 6.5 0 0 0 0-3A6.51 6.51 0 0 0 4.2 8.5Zm1.6-4.3c-.6 1.1-1 2.2-1.3 3.3 1.5-.3 3-.4 4.5-.4-.3-1-.7-2-1.2-2.9h-2Zm8.4 0h-2c-.5.9-.9 1.9-1.2 2.9 1.5 0 3 .1 4.5.4-.3-1.1-.7-2.2-1.3-3.3Z" clipRule="evenodd" />
  </svg>
);

// ── Language switcher ─────────────────────────────────────────────────────────

function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open ]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex items-center gap-1 rounded-md px-2 py-1.5 text-sm transition hover-text-primary"
        style={{ color: "var(--text-muted)" }}
        aria-label={t("language")}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <GlobeIcon />
        <span className="hidden lg:inline">{localeNames[locale]}</span>
        <ChevronDown open={open} />
      </button>
      {open && (
        <div
          className="anim-menu-in absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border shadow-2xl"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          role="menu"
        >
          {locales.map((l) => (
            <Link
              key={l}
              href={pathname}
              locale={l}
              onClick={() => setOpen(false)}
              role="menuitem"
              aria-current={l === locale ? "true" : undefined}
              className="focus-ring flex items-center justify-between px-3.5 py-2 text-sm transition"
              style={{
                color: l === locale ? "var(--accent-text)" : "var(--text-secondary)",
                backgroundColor: l === locale ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
                fontWeight: l === locale ? 600 : 400,
              }}
            >
              {localeNames[l]}
              {l === locale && <span aria-hidden="true">✓</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
);

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-3.5 w-3.5 shrink-0 transition-transform duration-200"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    aria-hidden="true"
  >
    <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z" clipRule="evenodd" />
  </svg>
);

// ── Mega menu panel ───────────────────────────────────────────────────────────

function MegaMenu({ onClose, cats }: {
  onClose: () => void;
  cats: { key: string; label: string; href: string; iconName: CategoryIconName; gradient: [string, string]; description: string; featured: { label: string; href: string }[] }[];
}) {
  const t = useTranslations("nav");
  return (
    <div
      className="absolute left-0 right-0 top-full z-40 border-b shadow-2xl"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-surface)",
        boxShadow: "0 16px 48px color-mix(in srgb, #000 40%, transparent)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Header row */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              {t("megaTitle")}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-subtle)" }}>
              {t("megaSubtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-md p-1.5 transition hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
            aria-label={t("closeDialog")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Category grid - compact tiles: 6 cols = 2 rows on desktop, scrollable on small screens */}
        <div className="grid max-h-[62vh] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-6">
          {cats.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              onClick={onClose}
              className="focus-ring group flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_-12px_rgba(251,191,36,0.4)]"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl shadow transition-transform group-hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${cat.gradient[0]}, ${cat.gradient[1]})`, color: "#1a1207" }}
                aria-hidden="true"
              >
                <CategoryIcon name={cat.iconName} className="h-5 w-5" />
              </span>
              <span
                className="text-xs font-semibold leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {cat.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Footer strip */}
        <div
          className="mt-4 flex items-center justify-between rounded-lg border px-4 py-2.5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            {t("megaFootnote")}
          </p>
          <Link
            href="/all-tools"
            onClick={onClose}
            className="focus-ring rounded-md px-3 py-1.5 text-xs font-medium transition hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          >
            {t("browseAll")}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const t = useTranslations("nav");
  const tr = (key: string) => t(key as never) as unknown as string;
  const cats = TOOL_CATEGORY_DEFS.map((d) => ({
    ...d,
    label: tr(`categories.${d.key}.label`),
    description: tr(`categories.${d.key}.description`),
  }));
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [megaOpen,    setMegaOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);

  const openSearch  = useCallback(() => setSearchOpen(true),  []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMega   = useCallback(() => setMegaOpen(false),   []);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
      if (e.key === "Escape") { setMegaOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Click outside closes mega menu
  useEffect(() => {
    if (!megaOpen) return;
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [megaOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        ref={megaRef}
        style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-page) 90%, transparent)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link href="/" className="focus-ring flex items-center gap-2 rounded">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold shadow"
              style={{ background: "linear-gradient(135deg, #fcd34d, #d97706)", color: "#1a1207" }}
              aria-hidden="true"
            >
              B
            </span>
            <span className="font-display text-base font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              BeYourTools
            </span>
          </Link>

          {/* ── Desktop nav ──────────────────────────────────────────────── */}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">

            {/* Home */}
            <Link
              href="/"
              className="focus-ring rounded-md px-3 py-1.5 text-sm transition hover-text-primary"
              style={{ color: "var(--text-muted)" }}
            >
              {t("home")}
            </Link>

            {/* All Tools - mega menu trigger */}
            <button
              type="button"
              onClick={() => setMegaOpen((v) => !v)}
              className="focus-ring flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition hover-text-primary"
              style={{ color: megaOpen ? "var(--text-primary)" : "var(--text-muted)" }}
              aria-expanded={megaOpen}
              aria-haspopup="true"
            >
              <GridIcon />
              {t("allTools")}
              <ChevronDown open={megaOpen} />
            </button>

            {/* Blog */}
            <Link
              href="/blog"
              className="focus-ring rounded-md px-3 py-1.5 text-sm transition hover-text-primary"
              style={{ color: "var(--text-muted)" }}
            >
              {t("blog")}
            </Link>

            {/* About */}
            <Link
              href="/about"
              className="focus-ring rounded-md px-3 py-1.5 text-sm transition hover-text-primary"
              style={{ color: "var(--text-muted)" }}
            >
              {t("about")}
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className="focus-ring rounded-md px-3 py-1.5 text-sm transition hover-text-primary"
              style={{ color: "var(--text-muted)" }}
            >
              {t("contact")}
            </Link>

          </nav>

          {/* ── Right side ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-0.5">

            {/* Search - desktop */}
            <button
              type="button"
              onClick={openSearch}
              aria-label={t("searchAria")}
              className="focus-ring hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition hover-text-primary md:flex"
              style={{ color: "var(--text-muted)" }}
            >
              <SearchIcon />
              <span>{t("search")}</span>
              <kbd
                className="ml-0.5 rounded px-1 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-subtle)",
                  border: "1px solid var(--border)",
                }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Search - mobile icon */}
            <button
              type="button"
              onClick={openSearch}
              aria-label={t("searchAriaMobile")}
              className="focus-ring flex items-center justify-center rounded-md p-1.5 transition hover-text-primary md:hidden"
              style={{ color: "var(--text-muted)" }}
            >
              <SearchIcon />
            </button>

            <div className="mx-1 hidden h-4 w-px md:block" style={{ backgroundColor: "var(--border-strong)" }} aria-hidden="true" />
            <LanguageSwitcher />
            <ThemeToggle />
            <div className="mx-1 h-4 w-px md:hidden" style={{ backgroundColor: "var(--border-strong)" }} aria-hidden="true" />

            {/* Hamburger - mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="focus-ring flex items-center justify-center rounded-md p-1.5 md:hidden"
              style={{ color: "var(--text-muted)" }}
              aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 2 10Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Desktop Mega Menu Panel ───────────────────────────────────── */}
        {megaOpen && <MegaMenu onClose={closeMega} cats={cats} />}

        {/* ── Mobile dropdown ──────────────────────────────────────────── */}
        {menuOpen && (
          <nav
            className="anim-menu-in border-t md:hidden"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            aria-label="Mobile navigation"
          >
            {/* Page links */}
            <div className="border-b px-2 py-2" style={{ borderColor: "var(--border)" }}>
              {[
                { href: "/",        label: t("home")    },
                { href: "/all-tools", label: t("allTools") },
                { href: "/blog",    label: t("blog")    },
                { href: "/about",   label: t("about")   },
                { href: "/contact", label: t("contact") },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="focus-ring block rounded-md px-3 py-2 text-sm font-medium transition"
                  style={{ color: "var(--text-muted)" }}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Tool category parent links */}
            <div className="px-2 py-2">
              <p
                className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--text-subtle)" }}
              >
                {t("toolsSection")}
              </p>
              {cats.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  onClick={() => setMenuOpen(false)}
                  className="focus-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${cat.gradient[0]}, ${cat.gradient[1]})`, color: "#1a1207" }}
                    aria-hidden="true"
                  >
                    <CategoryIcon name={cat.iconName} className="h-3.5 w-3.5" />
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>{cat.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </>
  );
}
