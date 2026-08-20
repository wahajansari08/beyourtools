"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { search, type SearchResult } from "@/lib/search-index";

const SECTION_LABELS = {
  json:  "JSON Tools",
  image: "Image Converter",
  pdf:   "PDF Tools",
  video: "Video Tools",
} as const;

const SECTION_COLORS = {
  json:  "var(--teal)",
  image: "var(--accent)",
  pdf:   "var(--coral)",
  video: "var(--teal)",
} as const;

interface Props {
  onClose: () => void;
}

export default function SearchOverlay({ onClose }: Props) {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<SearchResult[]>([]);
  const [active, setActive]     = useState(0);
  const inputRef  = useRef<HTMLInputElement>(null);
  const listRef   = useRef<HTMLUListElement>(null);
  const router    = useRouter();

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Search
  useEffect(() => {
    const res = search(query, 24);
    setResults(res);
    setActive(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter" && results[active]) {
        router.push(results[active].href);
        onClose();
      }
    },
    [results, active, router, onClose]
  );

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // Group results by section for display
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    const key = r.section;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl"
        style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-strong)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Search tools"
      >
        {/* Search input row */}
        <div
          className="flex items-center gap-3 border-b px-4 py-3"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Search icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 shrink-0"
            style={{ color: "var(--text-subtle)" }}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search all tools... (JSON, Image, PDF, Video)"
            className="flex-1 border-0 bg-transparent text-sm outline-none placeholder:opacity-50"
            style={{ color: "var(--text-primary)" }}
            aria-label="Search tools"
            autoComplete="off"
            spellCheck={false}
          />

          {/* Kbd hint */}
          <kbd
            className="hidden rounded border px-1.5 py-0.5 text-[11px] sm:block"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-subtle)", backgroundColor: "var(--bg-elevated)" }}
          >
            ESC
          </kbd>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="focus-ring shrink-0 rounded-md p-1"
            style={{ color: "var(--text-subtle)" }}
            aria-label="Close search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto" role="listbox" aria-label="Search results">
          {query.trim() === "" && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm" style={{ color: "var(--text-subtle)" }}>
                Start typing to search across{" "}
                <span style={{ color: "var(--teal)" }}>JSON</span>,{" "}
                <span style={{ color: "var(--accent)" }}>Image</span>,{" "}
                <span style={{ color: "var(--coral)" }}>PDF</span>, and{" "}
                <span style={{ color: "var(--teal)" }}>Video</span> tools.
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
                ↑ ↓ to navigate · Enter to open · Esc to close
              </p>
            </div>
          )}

          {query.trim() !== "" && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              No tools found for <strong style={{ color: "var(--text-primary)" }}>&ldquo;{query}&rdquo;</strong>
            </div>
          )}

          {results.length > 0 && (
            <ul ref={listRef} className="py-2">
              {results.map((result, i) => {
                const isActive = i === active;
                const sectionColor = SECTION_COLORS[result.section];
                return (
                  <li key={result.href} role="option" aria-selected={isActive}>
                    <Link
                      href={result.href}
                      onClick={onClose}
                      onMouseEnter={() => setActive(i)}
                      className="flex items-center gap-3 px-4 py-2.5 transition"
                      style={{
                        backgroundColor: isActive ? "var(--bg-elevated)" : "transparent",
                      }}
                    >
                      {/* Icon */}
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-bold"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${sectionColor} 15%, transparent)`,
                          color: sectionColor,
                        }}
                        aria-hidden="true"
                      >
                        {result.icon}
                      </span>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {result.name}
                          </span>
                          <span
                            className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium"
                            style={{
                              backgroundColor: `color-mix(in srgb, ${sectionColor} 12%, transparent)`,
                              color: sectionColor,
                            }}
                          >
                            {SECTION_LABELS[result.section]}
                          </span>
                        </div>
                        <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                          {result.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-3.5 w-3.5 shrink-0 opacity-0 transition"
                        style={{
                          color: "var(--text-subtle)",
                          opacity: isActive ? 1 : 0,
                        }}
                        aria-hidden="true"
                      >
                        <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        {results.length > 0 && (
          <div
            className="flex items-center gap-4 border-t px-4 py-2 text-[11px]"
            style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}
          >
            <span>↑↓ navigate</span>
            <span>↵ open</span>
            <span>esc close</span>
            <span className="ml-auto">{results.length} result{results.length !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>
    </div>
  );
}
