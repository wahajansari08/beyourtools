/**
 * ToolHeader: Pixelied-style dark gradient header band for tool pages.
 * Used by ToolLayout (JSON tools). Dark in both themes, gold accents.
 */
export default function ToolHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="relative mb-8 overflow-hidden rounded-2xl border px-5 py-8 sm:px-8 sm:py-10"
      style={{
        backgroundColor: "#0a0a14",
        borderColor: "rgba(251, 191, 36, 0.3)",
      }}
    >
      {/* gold ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(251, 191, 36, 0.22)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-12 h-56 w-56 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(245, 158, 11, 0.14)" }}
      />
      <div className="relative">
        <p
          className="mb-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest"
          style={{
            borderColor: "rgba(167, 139, 250, 0.35)",
            backgroundColor: "rgba(251, 191, 36, 0.12)",
            color: "#fde68a",
          }}
        >
          {eyebrow}
        </p>
        <h1
          className="font-display text-2xl font-bold tracking-tight sm:text-4xl"
          style={{ color: "#ffffff" }}
        >
          {title}
        </h1>
        <p
          className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base"
          style={{ color: "rgba(226, 232, 240, 0.75)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
