import { formatBytes } from "@/lib/audio/ffmpeg";

interface AudioFileInfoProps {
  name: string;
  size: number;
  duration?: number | null;
  mime?: string;
  extra?: { label: string; value: string }[];
}

function fmtDur(sec: number | null | undefined): string {
  if (!sec || !isFinite(sec)) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function AudioFileInfo({ name, size, duration, mime, extra }: AudioFileInfoProps) {
  const rows = [
    { label: "File",     value: name },
    { label: "Size",     value: formatBytes(size) },
    { label: "Duration", value: fmtDur(duration) },
    mime ? { label: "Type", value: mime } : null,
    ...(extra ?? []),
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="rounded-lg border px-4 py-3"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      <dl className="flex flex-wrap gap-x-6 gap-y-1.5">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex flex-col">
            <dt className="text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--text-subtle)" }}>{label}</dt>
            <dd className="max-w-[200px] truncate text-xs font-medium"
              style={{ color: "var(--text-secondary)" }} title={value}>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
