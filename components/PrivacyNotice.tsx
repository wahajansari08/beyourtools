import { LockIcon } from "@/components/icons";

export default function PrivacyNotice({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-center gap-1.5 text-[11px] ${className}`}
      style={{ color: "var(--text-subtle)" }}
    >
      <LockIcon className="h-3.5 w-3.5 shrink-0" />
      Your files are processed directly in your browser and are never uploaded to our servers.
    </p>
  );
}
