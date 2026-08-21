"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import dynamic from "next/dynamic";
import Image from "next/image";

const SearchOverlay = dynamic(() => import("./SearchOverlay"), { ssr: false });

const NAV_LINKS = [
  { href: "/json-tools",        label: "JSON Tools"        },
  { href: "/image-converter",   label: "Image Converter"   },
  { href: "/pdf-tools",         label: "PDF Tools"         },
  { href: "/qr-barcode-tools",  label: "QR & Barcodes"     },
  { href: "/audio-tools",       label: "Audio Tools"       },
  { href: "/video-tools",       label: "Video Tools"       },
  { href: "/blog",              label: "Blog"              },
  { href: "/about",             label: "About"             },
];

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
);

export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch  = useCallback(() => setSearchOpen(true),  []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-page) 90%, transparent)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link href="/" className="focus-ring flex items-center gap-2 rounded">
            {/* <span
              className="flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              aria-hidden="true"
            >
              B
            </span> */}
            {/* <Image
              src="/public/images/logo.png"
              alt="Logo"
              width={60}
              height={70}
            /> */}
            <span className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              BeYourTools
            </span>
          </Link>

          {/* ── Desktop nav ───────────────────────────────────────────────── */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="focus-ring rounded-md px-3 py-1.5 text-sm transition hover-text-primary"
                style={{ color: "var(--text-muted)" }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Right side ────────────────────────────────────────────────── */}
          {/*
              Layout (desktop, left→right):
                [Search icon + "Search" text + ⌘K hint] [Moon/Sun icon] [Hamburger mobile-only]
              All items are plain icon/text buttons - no border boxes.
          */}
          <div className="flex items-center gap-0.5">

            {/* Search - desktop: icon + label + kbd hint, no box */}
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

            {/* Search - mobile: icon only, no box */}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search tools"
              className="focus-ring flex items-center justify-center rounded-md p-1.5 transition hover-text-primary md:hidden"
              style={{ color: "var(--text-muted)" }}
            >
              <SearchIcon />
            </button>

            {/* Divider */}
            <div className="mx-1 hidden h-4 w-px md:block" style={{ backgroundColor: "var(--border-strong)" }} aria-hidden="true" />

            {/* Theme toggle - moon/sun icon that opens dropdown */}
            <ThemeToggle />

            {/* Divider - mobile only (between theme and hamburger) */}
            <div className="mx-1 h-4 w-px md:hidden" style={{ backgroundColor: "var(--border-strong)" }} aria-hidden="true" />

            {/* Hamburger - mobile only */}
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

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav
            className="border-t px-4 pb-4 pt-2 md:hidden"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="focus-ring block rounded-md px-3 py-2.5 text-sm font-medium transition"
                style={{ color: "var(--text-muted)" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </>
  );
}
