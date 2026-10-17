import Btn from "@/components/Btn";
import { toolsByCategory, type ToolCategory } from "@/lib/tools-config";
import { getTranslations } from "next-intl/server";
import { contentLocale, getTranslatedToolContentAny } from "@/lib/i18n-content";

export default async function RelatedTools({ category, currentSlug }: { category: ToolCategory; currentSlug: string }) {
  const related = toolsByCategory(category).filter((t) => t.slug !== currentSlug);
  if (related.length === 0) return null;

  const locale = await contentLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  const names = await Promise.all(
    related.map(async (tool) => {
      const tc = await getTranslatedToolContentAny(locale, tool.slug);
      return tc?.name ?? tool.name;
    })
  );

  return (
    <div className="mt-12 border-t pt-6" style={{ borderColor: "var(--border)" }}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
        {t("moreIn")} {category}
      </h2>
      <div className="flex flex-wrap gap-2">
        {related.map((tool, i) => (
          <Btn key={tool.slug} variant="pill" href={`/${tool.slug}`}>
            {names[i]}
          </Btn>
        ))}
      </div>
    </div>
  );
}
