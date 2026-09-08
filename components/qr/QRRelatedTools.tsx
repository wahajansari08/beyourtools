import Btn from "@/components/Btn";
import { relatedQRBarcodeTools } from "@/lib/qr-barcode-config";

export default function QRRelatedTools({ currentSlug }: { currentSlug: string }) {
  const related = relatedQRBarcodeTools(currentSlug);
  const isBarcode = currentSlug.includes("barcode");

  return (
    <>
      {/* Symbology Standards & Production Guide */}
      <section className="mt-12 space-y-4 rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          {isBarcode ? "1D Barcode Symbologies & Scanning Standards" : "2D QR Matrix Standards & Printing Guidelines"}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {isBarcode
            ? "Linear 1D barcodes encode alphanumeric data using alternating parallel lines and spaces with standardized width ratios. Choosing the appropriate symbology-such as Code 128 for variable-length logistics labels, EAN-13 for global retail products, or UPC-A for North American point-of-sale systems-ensures seamless optical recognition across laser scanners, CCD readers, and camera-based mobile apps."
            : "Quick Response (QR) codes are two-dimensional matrix symbologies standardized under ISO/IEC 18004. Equipped with Reed-Solomon error correction (ranging from Level L at 7% recovery up to Level H at 30% recovery), QR codes allow reliable scanning even if portions of the printed matrix suffer physical abrasion, smudging, or partial obstruction by custom logos."}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
            <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
              {isBarcode ? "Quiet Zones & Contrast" : "Quiet Zone & Contrast Ratios"}
            </h3>
            <p>
              {isBarcode
                ? "Maintain a solid unprinted margin (the quiet zone) of at least 10 times the narrowest bar width on both ends. Ensure high optical contrast-dark bars on a clean white background-to prevent scanner read failures under warehouse and retail lighting."
                : "Always preserve a quiet zone border of at least 4 modules around the outer edge of the QR code. Avoid low-contrast color combinations (such as yellow on white); dark modules on light backgrounds deliver the fastest camera decode speeds."}
            </p>
          </div>
          <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
            <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
              Vector Print &amp; Privacy Security
            </h3>
            <p>
              Export your finished code in SVG vector format for crisp, infinite scalability on large signage, product packaging, and business cards without pixelation. 
              All generation and camera decoding executes 100% locally in your browser memory-no private credentials, URLs, or scans are ever uploaded to a server.
            </p>
          </div>
        </div>
      </section>

      {/* Additional FAQ */}
      <section className="mt-10 space-y-4">
        <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Additional Technical FAQs
        </h2>
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            What is the minimum recommended print size for reliable scanning?
          </p>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            For standard smartphone camera scanning at close range (0.3–0.5 meters), print QR codes at a minimum size of 2 x 2 cm (0.8 x 0.8 inches). For posters and billboards, use a 10:1 distance-to-size ratio (e.g., a code scanned from 2 meters away should be at least 20 cm wide).
          </p>
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Are generated codes permanent, and do they ever expire?
          </p>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            All codes generated on BeYourTools are static and permanent. The encoded data (such as your URL, text, or barcode number) is directly baked into the graphical modules with zero server redirection, meaning they will function forever without expiration.
          </p>
        </div>
      </section>

      {related.length > 0 && (
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
      )}
    </>
  );
}
