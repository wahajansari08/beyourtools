import Link from "next/link";

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
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-1.5 text-xs text-mist-400">
        <Link href="/" className="focus-ring rounded hover:text-mist-100">
          Jsonifyr
        </Link>
        <span>/</span>
        <span className="text-mist-300">{eyebrow}</span>
      </div>
      <h1 className="font-display text-2xl font-semibold text-mist-50 sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-mist-300">{description}</p>
    </div>
  );
}
