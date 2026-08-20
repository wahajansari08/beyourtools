import Link from "next/link";
import { relatedAudioTools } from "@/lib/audio-tools-config";

export default function AudioRelatedTools({ currentSlug }: { currentSlug: string }) {
  const related = relatedAudioTools(currentSlug, 5);
  return (
    <div className="mt-12 border-t pt-6" style={{ borderColor: "var(--border)" }}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--text-subtle)" }}>Related tools</h2>
      <div className="flex flex-wrap gap-2">
        {related.map((t) => (
          <Link key={t.slug} href={`/${t.slug}`}
            className="focus-ring rounded-md border px-3 py-1.5 text-xs transition"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
            {t.icon} {t.name}
          </Link>
        ))}
        <Link href="/audio-tools"
          className="focus-ring rounded-md border px-3 py-1.5 text-xs transition"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
          All Audio Tools →
        </Link>
      </div>
    </div>
  );
}
