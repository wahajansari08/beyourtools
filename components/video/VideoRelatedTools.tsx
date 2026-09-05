import Btn from "@/components/Btn";
import { relatedVideoTools } from "@/lib/video-tools-config";

export default function VideoRelatedTools({ currentSlug }: { currentSlug: string }) {
  const related = relatedVideoTools(currentSlug);
  if (related.length === 0) return null;

  return (
    <div className="mt-12 border-t pt-6" style={{ borderColor: "var(--border)" }}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
        Related tools
      </h2>
      <div className="flex flex-wrap gap-2">
        {related.map((tool) => (
          <Btn key={tool.slug} variant="pill" href={`/${tool.slug}`}>
            {tool.name}
          </Btn>
        ))}
      </div>
    </div>
  );
}
