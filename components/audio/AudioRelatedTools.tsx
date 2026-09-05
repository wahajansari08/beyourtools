import Btn from "@/components/Btn";
import { relatedAudioTools } from "@/lib/audio-tools-config";

export default function AudioRelatedTools({ currentSlug }: { currentSlug: string }) {
  const related = relatedAudioTools(currentSlug, 5);
  return (
    <div className="mt-12 border-t pt-6" style={{ borderColor: "var(--border)" }}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--text-subtle)" }}>Related tools</h2>
      <div className="flex flex-wrap gap-2">
        {related.map((t) => (
          <Btn key={t.slug} variant="pill" href={`/${t.slug}`}>
            <span aria-hidden="true">{t.icon}</span>
            {t.name}
          </Btn>
        ))}
        <Btn variant="pill" href="/audio-tools">
          All Audio Tools →
        </Btn>
      </div>
    </div>
  );
}
