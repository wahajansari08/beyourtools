import Link from "next/link";
import { toolsByCategory, type ToolCategory } from "@/lib/tools-config";

export default function RelatedTools({ category, currentSlug }: { category: ToolCategory; currentSlug: string }) {
  const related = toolsByCategory(category).filter((t) => t.slug !== currentSlug);
  if (related.length === 0) return null;

  return (
    <div className="mt-12 border-t pt-6" style={{ borderColor: "var(--border)" }}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
        More in {category}
      </h2>
      <div className="flex flex-wrap gap-2">
        {related.map((t) => (
          <Link
            key={t.slug}
            href={`/${t.slug}`}
            className="focus-ring rounded-md border px-3 py-1.5 text-xs transition hover-text hover-border"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-muted)",
            }}
          >
            {t.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
