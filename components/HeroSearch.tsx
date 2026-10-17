"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { search, type SearchResult } from "@/lib/search-index";

/**
 * HeroSearch: Pixelied-style oversized search for the homepage hero.
 * Live dropdown results powered by the existing lib/search-index.
 * Styled for the dark hero band (hardcoded dark colors, theme-independent).
 */
export default function HeroSearch() {
  const t = useTranslations("search");
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen]       = useState(false);
  const [active, setActive]   = useState(0);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  useEffect(() => {
    const q = query.trim();
    setResults(q ? search(q, 8) : []);
    setActive(0);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      if (results[active]) go(results[active].href);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showDropdown = open && query.trim() !== "";

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-2xl">
      <div
        className="flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl transition"
        style={{
          backgroundColor: "rgba(255,255,255,0.07)",
          borderColor: open ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.16)",
          boxShadow: open
            ? "0 0 0 4px rgba(251,191,36,0.20), 0 24px 64px rgba(0,0,0,0.5)"
            : "0 24px 64px rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 shrink-0"
          style={{ color: "rgba(255,255,255,0.55)" }}
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={t("placeholder")}
          className="w-full bg-transparent text-base outline-none"
          style={{ color: "#ffffff" }}
          aria-label={t("placeholder")}
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="hero-search-results"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="shrink-0 rounded-full px-2 py-0.5 text-sm transition hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.55)" }}
            aria-label={t("clearSearch")}
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          id="hero-search-results"
          role="listbox"
          aria-label="Search results"
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border text-left shadow-2xl"
          style={{
            backgroundColor: "#12161f",
            borderColor: "rgba(255,255,255,0.12)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          }}
        >
          {results.length === 0 ? (
            <p className="px-5 py-6 text-center text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              No tools found for &ldquo;{query.trim()}&rdquo;. Try another keyword.
            </p>
          ) : (
            <ul className="max-h-[320px] overflow-y-auto py-2">
              {results.map((r, i) => (
                <li key={r.href} role="option" aria-selected={i === active}>
                  <Link
                    href={r.href}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActive(i)}
                    className="flex items-center gap-3 px-4 py-2.5 transition"
                    style={{ backgroundColor: i === active ? "rgba(251,191,36,0.16)" : "transparent" }}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                      style={{
                        background: "linear-gradient(135deg, rgba(251,191,36,0.25), rgba(217,119,6,0.28))",
                        color: "#fde68a",
                        border: "1px solid rgba(251,191,36,0.35)",
                      }}
                      aria-hidden="true"
                    >
                      {r.section === "json" ? "{ }" : r.section.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium" style={{ color: "#f0f3f8" }}>
                        {r.name}
                      </span>
                      <span className="block truncate text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                        {r.category}
                      </span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0" style={{ color: "rgba(255,255,255,0.35)", opacity: i === active ? 1 : 0 }} aria-hidden="true">
                      <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
