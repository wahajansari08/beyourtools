"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import dynamic from "next/dynamic";

const SearchOverlay = dynamic(() => import("./SearchOverlay"), { ssr: false });

// ── Mega menu data ────────────────────────────────────────────────────────────

const TOOL_CATEGORIES = [
  {
    label: "JSON Tools",
    href:  "/json-tools",
    icon:  "{ }",
    iconStyle: { color: "var(--teal)", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "13px" },
    description: "Format, validate, diff & convert",
    featured: [
      { label: "JSON Formatter",        href: "/json-formatter"        },
      { label: "JSON Validator",        href: "/json-validator"        },
      { label: "JSON Diff",             href: "/json-diff"             },
      { label: "JWT Decoder",           href: "/jwt-decoder"           },
      { label: "JSON Schema Generator", href: "/json-schema-generator" },
    ],
  },
  {
    label: "Image Converter",
    href:  "/image-converter",
    icon:  "🖼",
    description: "Convert between JPG, PNG, WebP, SVG…",
    featured: [
      { label: "JPG to PNG",   href: "/image-converter/jpg-to-png"  },
      { label: "PNG to JPG",   href: "/image-converter/png-to-jpg"  },
      { label: "JPG to WebP",  href: "/image-converter/jpg-to-webp" },
      { label: "JPG to PDF",   href: "/image-converter/jpg-to-pdf"  },
      { label: "SVG to PNG",   href: "/image-converter/svg-to-png"  },
    ],
  },
  {
    label: "PDF Tools",
    href:  "/pdf-tools",
    icon:  "📄",
    description: "Merge, split, compress & protect PDFs",
    featured: [
      { label: "Merge PDF",      href: "/pdf-tools/merge-pdf"       },
      { label: "Split PDF",      href: "/pdf-tools/split-pdf"       },
      { label: "PDF to JPG",     href: "/pdf-tools/pdf-to-jpg"      },
      { label: "Compress PDF",   href: "/pdf-tools/pdf-compressor"  },
      { label: "Protect PDF",    href: "/pdf-tools/protect-pdf"     },
    ],
  },
  {
    label: "QR & Barcodes",
    href:  "/qr-barcode-tools",
    icon:  "▦",
    iconStyle: { fontSize: "18px" },
    description: "Generate and scan QR codes & barcodes",
    featured: [
      { label: "QR Code Generator",  href: "/qr-code-generator"      },
      { label: "WiFi QR Generator",  href: "/wifi-qr-code-generator" },
      { label: "Barcode Generator",  href: "/barcode-generator"      },
      { label: "QR Code Scanner",    href: "/qr-code-scanner"        },
      { label: "Barcode Scanner",    href: "/barcode-scanner"        },
    ],
  },
  {
    label: "Audio Tools",
    href:  "/audio-tools",
    icon:  "🎵",
    description: "Convert, cut, compress & record audio",
    featured: [
      { label: "MP3 Converter",   href: "/mp3-converter"    },
      { label: "MP3 Cutter",      href: "/mp3-cutter"       },
      { label: "MP4 to MP3",      href: "/mp4-to-mp3"       },
      { label: "MP3 Compressor",  href: "/mp3-compressor"   },
      { label: "Audio Recorder",  href: "/audio-recorder"   },
    ],
  },
  {
    label: "Video Tools",
    href:  "/video-tools",
    icon:  "🎬",
    description: "Compress, convert, trim & extract video",
    featured: [
      { label: "Video Compressor",  href: "/video-compressor"          },
      { label: "Video Cutter",      href: "/video-cutter"              },
      { label: "Video Converter",   href: "/video-converter"           },
      { label: "Video to GIF",      href: "/video-to-gif"              },
      { label: "Thumbnail Maker",   href: "/video-thumbnail-generator" },
    ],
  },
  {
    label: "Finance Tools",
    href:  "/finance-tools",
    icon:  "💰",
    description: "Calculators for loans, margins, savings & more",
    featured: [
      { label: "Loan Payment",       href: "/loan-payment-calculator"   },
      { label: "Profit Margin",      href: "/profit-margin-calculator"  },
      { label: "Savings Calculator", href: "/savings-calculator"        },
      { label: "ROI Calculator",     href: "/roi-calculator"            },
      { label: "Debt Snowball",      href: "/debt-snowball-calculator"  },
    ],
  },
  {
    label: "Developer Tools",
    href:  "/json-tools",
    icon:  "⚡",
    description: "Base64, JWT, diff, schema & utility tools",
    featured: [
      { label: "Base64 Encode/Decode", href: "/base64"              },
      { label: "JWT Decoder",          href: "/jwt-decoder"         },
      { label: "JSON to CSV",          href: "/json-to-csv"         },
      { label: "JSON to TypeScript",   href: "/json-to-typescript"  },
      { label: "CSV to JSON",          href: "/csv-to-json"         },
    ],
  },
];

// Simplified top-level nav links (no tool categories here)
const TOP_NAV = [
  { href: "/",       label: "Home"    },
  { href: "/blog",   label: "Blog"    },
  { href: "/about",  label: "About"   },
  { href: "/contact",label: "Contact" },
];

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

function MegaMenu({ onClose }: { onClose: () => void }) {
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
              All Tools
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-subtle)" }}>
              200+ free browser-based tools — nothing leaves your device
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-md p-1.5 transition hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Category grid — 4 cols on large, 2 on md */}
        <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-4">
          {TOOL_CATEGORIES.map((cat) => (
            <div key={cat.href} className="rounded-xl p-3 transition"
              style={{ backgroundColor: "var(--bg-elevated)" }}>
              {/* Category header */}
              <Link
                href={cat.href}
                onClick={onClose}
                className="focus-ring group mb-2.5 flex items-center gap-2.5 rounded-lg"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base"
                  style={{
                    backgroundColor: "color-mix(in srgb,var(--teal) 12%,transparent)",
                    border: "1px solid color-mix(in srgb,var(--teal) 25%,transparent)",
                    ...cat.iconStyle,
                  }}
                  aria-hidden="true"
                >
                  {cat.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-tight group-hover:underline"
                    style={{ color: "var(--text-primary)" }}>
                    {cat.label}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] leading-tight"
                    style={{ color: "var(--text-subtle)" }}>
                    {cat.description}
                  </p>
                </div>
              </Link>

              {/* Featured links */}
              <ul className="space-y-0.5">
                {cat.featured.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="focus-ring flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] transition hover:opacity-90"
                      style={{
                        color: "var(--text-muted)",
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-surface)";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                      }}
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: "var(--border-strong)" }} aria-hidden="true" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer strip */}
        <div
          className="mt-4 flex items-center justify-between rounded-lg border px-4 py-2.5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            All tools are 100% free · No sign-up · Files never leave your browser
          </p>
          <Link
            href="/json-tools"
            onClick={onClose}
            className="focus-ring rounded-md px-3 py-1.5 text-xs font-medium transition hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          >
            Browse all →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────

export default function Navbar() {
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
            <span className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
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
              Home
            </Link>

            {/* All Tools — mega menu trigger */}
            <button
              type="button"
              onClick={() => setMegaOpen((v) => !v)}
              className="focus-ring flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition hover-text-primary"
              style={{ color: megaOpen ? "var(--text-primary)" : "var(--text-muted)" }}
              aria-expanded={megaOpen}
              aria-haspopup="true"
            >
              <GridIcon />
              All Tools
              <ChevronDown open={megaOpen} />
            </button>

            {/* Blog */}
            <Link
              href="/blog"
              className="focus-ring rounded-md px-3 py-1.5 text-sm transition hover-text-primary"
              style={{ color: "var(--text-muted)" }}
            >
              Blog
            </Link>

            {/* About */}
            <Link
              href="/about"
              className="focus-ring rounded-md px-3 py-1.5 text-sm transition hover-text-primary"
              style={{ color: "var(--text-muted)" }}
            >
              About
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className="focus-ring rounded-md px-3 py-1.5 text-sm transition hover-text-primary"
              style={{ color: "var(--text-muted)" }}
            >
              Contact
            </Link>

          </nav>

          {/* ── Right side ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-0.5">

            {/* Search — desktop */}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search tools (⌘K)"
              className="focus-ring hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition hover-text-primary md:flex"
              style={{ color: "var(--text-muted)" }}
            >
              <SearchIcon />
              <span>Search</span>
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

            {/* Search — mobile icon */}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search tools"
              className="focus-ring flex items-center justify-center rounded-md p-1.5 transition hover-text-primary md:hidden"
              style={{ color: "var(--text-muted)" }}
            >
              <SearchIcon />
            </button>

            <div className="mx-1 hidden h-4 w-px md:block" style={{ backgroundColor: "var(--border-strong)" }} aria-hidden="true" />
            <ThemeToggle />
            <div className="mx-1 h-4 w-px md:hidden" style={{ backgroundColor: "var(--border-strong)" }} aria-hidden="true" />

            {/* Hamburger — mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="focus-ring flex items-center justify-center rounded-md p-1.5 md:hidden"
              style={{ color: "var(--text-muted)" }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
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
        {megaOpen && <MegaMenu onClose={closeMega} />}

        {/* ── Mobile dropdown ──────────────────────────────────────────── */}
        {menuOpen && (
          <nav
            className="border-t md:hidden"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            aria-label="Mobile navigation"
          >
            {/* Page links */}
            <div className="border-b px-2 py-2" style={{ borderColor: "var(--border)" }}>
              {[
                { href: "/",        label: "Home"    },
                { href: "/blog",    label: "Blog"    },
                { href: "/about",   label: "About"   },
                { href: "/contact", label: "Contact" },
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
                Tools
              </p>
              {TOOL_CATEGORIES.filter((cat) => cat.label !== "Developer Tools").map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMenuOpen(false)}
                  className="focus-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      border: "1px solid var(--border-strong)",
                      ...cat.iconStyle,
                    }}
                    aria-hidden="true"
                  >
                    {cat.icon}
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
