export default function PrivacyNotice({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-center gap-1.5 text-[11px] ${className}`}
      style={{ color: "var(--text-subtle)" }}
    >
      <span aria-hidden="true">🔒</span>
      Your files are processed directly in your browser and are never uploaded to our servers.
    </p>
  );
}
