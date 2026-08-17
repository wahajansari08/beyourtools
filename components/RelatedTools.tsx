import Link from "next/link";
import { toolsByCategory, type ToolCategory } from "@/lib/tools-config";

export default function RelatedTools({ category, currentSlug }: { category: ToolCategory; currentSlug: string }) {
  const related = toolsByCategory(category).filter((t) => t.slug !== currentSlug);
  if (related.length === 0) return null;

  return (
    <div className="mt-12 border-t border-ink-700 pt-6">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mist-400">
        More in {category}
      </h2>
      <div className="flex flex-wrap gap-2">
        {related.map((t) => (
          <Link
            key={t.slug}
            href={`/${t.slug}`}
            className="focus-ring rounded-md border border-ink-700 bg-ink-900 px-3 py-1.5 text-xs text-mist-300 transition hover:border-ink-500 hover:text-mist-50"
          >
            {t.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
