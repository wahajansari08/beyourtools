export default function StatusBanner({
  type,
  message,
}: {
  type: "error" | "success" | "info";
  message: string;
}) {
  const styles = {
    error:   { bg: "rgba(239,125,111,0.10)", border: "rgba(239,125,111,0.30)", text: "var(--coral)"  },
    success: { bg: "rgba(79,209,197,0.10)",  border: "rgba(79,209,197,0.30)",  text: "var(--teal)"   },
    info:    { bg: "rgba(242,184,75,0.10)",  border: "rgba(242,184,75,0.30)",  text: "var(--accent)" },
  }[type];

  return (
    <div
      className="flex items-start gap-2 rounded-md border px-3 py-2 text-[13px] font-mono"
      style={{ backgroundColor: styles.bg, borderColor: styles.border, color: styles.text }}
    >
      <span className="mt-0.5 shrink-0">
        {type === "error" ? "✕" : type === "success" ? "✓" : "i"}
      </span>
      <span className="break-words">{message}</span>
    </div>
  );
}
