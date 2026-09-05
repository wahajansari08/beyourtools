import Btn from "@/components/Btn";
import { relatedQRBarcodeTools } from "@/lib/qr-barcode-config";

export default function QRRelatedTools({ currentSlug }: { currentSlug: string }) {
  const related = relatedQRBarcodeTools(currentSlug);
  if (related.length === 0) return null;

  return (
    <div className="mt-12 border-t pt-6" style={{ borderColor: "var(--border)" }}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
        Related tools
      </h2>
      <div className="flex flex-wrap gap-2">
        {related.map((t) => (
          <Btn key={t.slug} variant="pill" href={`/${t.slug}`}>
            {t.name}
          </Btn>
        ))}
        <Btn variant="pill" href="/qr-barcode-tools">
          All QR &amp; Barcode Tools →
        </Btn>
      </div>
    </div>
  );
}
