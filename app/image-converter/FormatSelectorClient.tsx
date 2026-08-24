"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formats, conversionRoutes } from "@/lib/image-tools-config";
import type { ImageFormat } from "@/lib/image-tools-config";

export default function FormatSelectorClient() {
  const router = useRouter();

  const [from, setFrom] = useState<ImageFormat>("jpg");
  const [to, setTo] = useState<ImageFormat>("png");

  // Formats that have at least one conversion route as the source
  const sourceFmts = useMemo(
    () => formats.filter((f) => conversionRoutes.some((r) => r.from === f.id)),
    []
  );

  // Target formats available for the selected source
  const targetFmts = useMemo(
    () =>
      formats.filter(
        (f) =>
          f.id !== from &&
          conversionRoutes.some((r) => r.from === from && r.to === f.id)
      ),
    [from]
  );

  // When source changes, reset target to the first available option
  function handleFromChange(val: ImageFormat) {
    setFrom(val);
    const firstTarget = formats.find(
      (f) =>
        f.id !== val &&
        conversionRoutes.some((r) => r.from === val && r.to === f.id)
    );
    if (firstTarget) setTo(firstTarget.id);
  }

  // Check whether the current pair is a valid route
  const isValid = conversionRoutes.some((r) => r.from === from && r.to === to);

  function handleConvert() {
    if (!isValid) return;
    router.push(`/image-converter/${from}-to-${to}`);
  }

  return (
    <div
      className="mb-10 rounded-xl border p-5 sm:p-6"
      style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-surface)" }}
    >
      <p className="mb-4 text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
        Quick convert -pick your formats
      </p>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {/* From */}
        <div className="flex flex-1 flex-col gap-1">
          <label
            htmlFor="fmt-from"
            className="text-[11px] font-medium uppercase tracking-wide"
            style={{ color: "var(--text-subtle)" }}
          >
            From
          </label>
          <select
            id="fmt-from"
            value={from}
            onChange={(e) => handleFromChange(e.target.value as ImageFormat)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm font-medium outline-none focus:ring-2"
            style={{
              borderColor: "var(--border-strong)",
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-primary)",
            }}
          >
            {sourceFmts.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Arrow */}
        <div
          className="flex items-end justify-center pb-1 text-xl sm:mt-5"
          style={{ color: "var(--text-subtle)" }}
          aria-hidden="true"
        >
          →
        </div>

        {/* To */}
        <div className="flex flex-1 flex-col gap-1">
          <label
            htmlFor="fmt-to"
            className="text-[11px] font-medium uppercase tracking-wide"
            style={{ color: "var(--text-subtle)" }}
          >
            To
          </label>
          <select
            id="fmt-to"
            value={to}
            onChange={(e) => setTo(e.target.value as ImageFormat)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm font-medium outline-none focus:ring-2"
            style={{
              borderColor: "var(--border-strong)",
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-primary)",
            }}
          >
            {targetFmts.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Go button */}
        <div className="flex flex-col gap-1 sm:mt-0">
          <span className="hidden text-[11px] sm:block" aria-hidden="true">&nbsp;</span>
          <button
            type="button"
            onClick={handleConvert}
            disabled={!isValid}
            className="focus-ring rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-fg)",
            }}
          >
            Convert
          </button>
        </div>
      </div>

      {/* Live slug preview */}
      {isValid && (
        <p className="mt-3 text-[11px]" style={{ color: "var(--text-subtle)" }}>
          Goes to{" "}
          <span className="font-mono" style={{ color: "var(--teal)" }}>
            /image-converter/{from}-to-{to}
          </span>
        </p>
      )}
    </div>
  );
}
