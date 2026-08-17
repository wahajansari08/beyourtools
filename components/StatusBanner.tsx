import clsx from "clsx";

export default function StatusBanner({
  type,
  message,
}: {
  type: "error" | "success" | "info";
  message: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-start gap-2 rounded-md border px-3 py-2 text-[13px] font-mono",
        type === "error" && "border-coral-400/30 bg-coral-400/10 text-coral-400",
        type === "success" && "border-teal-400/30 bg-teal-400/10 text-teal-400",
        type === "info" && "border-amber-400/30 bg-amber-400/10 text-amber-400"
      )}
    >
      <span className="mt-0.5 shrink-0">
        {type === "error" ? "✕" : type === "success" ? "✓" : "i"}
      </span>
      <span className="break-words">{message}</span>
    </div>
  );
}
