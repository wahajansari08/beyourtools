import Link from "next/link";
import Btn from "@/components/Btn";
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
          <Btn key={t.slug} variant="pill" href={`/${t.slug}`}>
            <span aria-hidden="true">{t.icon}</span>
            {t.name}
          </Btn>
        ))}
      </div>
      <div className="mt-4">
        <Btn variant="ghost" size="sm" href="/finance-tools">
          ← All Finance Tools
        </Btn>
      </div>
    </div>
  );
}
