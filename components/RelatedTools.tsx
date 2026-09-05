import Btn from "@/components/Btn";
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
          <Btn key={t.slug} variant="pill" href={`/${t.slug}`}>
            {t.name}
          </Btn>
        ))}
      </div>
    </div>
  );
}
