"use client";

import { useState, useMemo, useId } from "react";
import { useRouter } from "next/navigation";
import { formats, conversionRoutes } from "@/lib/image-tools-config";
import type { ImageFormat } from "@/lib/image-tools-config";
import Btn from "@/components/Btn";

interface FormatSelectorClientProps {
  initialFrom?: ImageFormat;
  initialTo?: ImageFormat;
}

export default function FormatSelectorClient({
  initialFrom,
  initialTo,
}: FormatSelectorClientProps = {}) {
  const router = useRouter();
  const id = useId();
  const fromId = `fmt-from-${id}`;
  const toId = `fmt-to-${id}`;

  // Formats that have at least one conversion route as the source
  const sourceFmts = useMemo(
    () => formats.filter((f) => conversionRoutes.some((r) => r.from === f.id)),
    []
  );

  const defaultFrom =
    initialFrom && sourceFmts.some((f) => f.id === initialFrom)
      ? initialFrom
      : "jpg";

  const [from, setFrom] = useState<ImageFormat>(defaultFrom);
  const [to, setTo] = useState<ImageFormat>(() => {
    if (
      initialTo &&
      conversionRoutes.some((r) => r.from === defaultFrom && r.to === initialTo)
    ) {
      return initialTo;
    }
    const firstTarget = formats.find(
      (f) =>
        f.id !== defaultFrom &&
        conversionRoutes.some((r) => r.from === defaultFrom && r.to === f.id)
    );
    return firstTarget ? firstTarget.id : "png";
  });

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
        Quick convert - pick your formats
      </p>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {/* From */}
        <div className="flex flex-1 flex-col gap-1">
          <label
            htmlFor={fromId}
            className="text-[11px] font-medium uppercase tracking-wide"
            style={{ color: "var(--text-subtle)" }}
          >
            From
          </label>
          <select
            id={fromId}
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
            htmlFor={toId}
            className="text-[11px] font-medium uppercase tracking-wide"
            style={{ color: "var(--text-subtle)" }}
          >
            To
          </label>
          <select
            id={toId}
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
          <Btn variant="primary" size="lg" onClick={handleConvert} disabled={!isValid}>
          Convert
        </Btn>
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
