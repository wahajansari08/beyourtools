"use client";

import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function BlogPagination({ currentPage, totalPages }: Props) {
  const href = (page: number) => (page === 1 ? "/blog" : `/blog?page=${page}`);

  // Build page number list with ellipsis
  function pageNumbers(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (currentPage > 3) pages.push("…");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-12 flex items-center justify-center gap-1.5"
    >
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition hover:-translate-y-0.5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
          aria-label="Previous page"
        >
          ←
        </Link>
      ) : (
        <span
          className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border text-sm opacity-40"
          style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}
          aria-disabled="true"
        >
          ←
        </span>
      )}

      {/* Page numbers */}
      {pageNumbers().map((item, i) =>
        item === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-sm"
            style={{ color: "var(--text-subtle)" }}
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition hover:-translate-y-0.5"
            style={
              item === currentPage
                ? { backgroundColor: "var(--accent)", color: "var(--accent-fg)", borderColor: "var(--accent)" }
                : { borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }
            }
            aria-label={`Page ${item}`}
            aria-current={item === currentPage ? "page" : undefined}
          >
            {item}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition hover:-translate-y-0.5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
          aria-label="Next page"
        >
          →
        </Link>
      ) : (
        <span
          className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border text-sm opacity-40"
          style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}
          aria-disabled="true"
        >
          →
        </span>
      )}
    </nav>
  );
}
