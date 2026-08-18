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
    <div className="mb-8">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--teal)" }}>
        {eyebrow}
      </p>
      <h1 className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </div>
  );
}
