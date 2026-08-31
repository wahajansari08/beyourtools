import Link from "next/link";
import { relatedFinanceTools, clusterSlugs } from "@/lib/finance-tools-config";

interface FinanceRelatedToolsProps {
  currentSlug: string;
}

export default function FinanceRelatedTools({ currentSlug }: FinanceRelatedToolsProps) {
  const related = relatedFinanceTools(currentSlug, 8);
  if (related.length === 0) return null;

  return (
    <div className="mt-12 border-t pt-8" style={{ borderColor: "var(--border)" }}>
      <h2
        className="mb-4 text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--text-subtle)" }}
      >
        Related Finance Calculators
      </h2>
      <div className="flex flex-wrap gap-2">
        {related.map((t) => (
          <Link
            key={t.slug}
            href={`/${t.slug}`}
            className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition hover-card"
            style={{
              borderColor: "var(--border-strong)",
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-muted)",
            }}
          >
            <span aria-hidden="true">{t.icon}</span>
            {t.name}
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <Link
          href="/finance-tools"
          className="focus-ring text-xs font-medium hover:underline"
          style={{ color: "var(--accent-text)" }}
        >
          ← All Finance Tools
        </Link>
      </div>
    </div>
  );
}
