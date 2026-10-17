"use client";

import { useEffect, useMemo, useState } from "react";
import Btn from "@/components/Btn";

const TIME_ZONES: { label: string; zone: string }[] = [
  { label: "Los Angeles (PT)", zone: "America/Los_Angeles" },
  { label: "Denver (MT)", zone: "America/Denver" },
  { label: "Chicago (CT)", zone: "America/Chicago" },
  { label: "New York (ET)", zone: "America/New_York" },
  { label: "São Paulo", zone: "America/Sao_Paulo" },
  { label: "London", zone: "Europe/London" },
  { label: "Paris / Berlin", zone: "Europe/Paris" },
  { label: "Moscow", zone: "Europe/Moscow" },
  { label: "Dubai", zone: "Asia/Dubai" },
  { label: "Karachi", zone: "Asia/Karachi" },
  { label: "Mumbai / Delhi", zone: "Asia/Kolkata" },
  { label: "Bangkok", zone: "Asia/Bangkok" },
  { label: "Singapore", zone: "Asia/Singapore" },
  { label: "Hong Kong", zone: "Asia/Hong_Kong" },
  { label: "Tokyo", zone: "Asia/Tokyo" },
  { label: "Sydney", zone: "Australia/Sydney" },
  { label: "Auckland", zone: "Pacific/Auckland" },
  { label: "UTC", zone: "UTC" },
];

const WORLD_CLOCK: { label: string; zone: string }[] = [
  { label: "Los Angeles", zone: "America/Los_Angeles" },
  { label: "New York", zone: "America/New_York" },
  { label: "São Paulo", zone: "America/Sao_Paulo" },
  { label: "London", zone: "Europe/London" },
  { label: "Paris", zone: "Europe/Paris" },
  { label: "Dubai", zone: "Asia/Dubai" },
  { label: "Karachi", zone: "Asia/Karachi" },
  { label: "Mumbai", zone: "Asia/Kolkata" },
  { label: "Singapore", zone: "Asia/Singapore" },
  { label: "Tokyo", zone: "Asia/Tokyo" },
  { label: "Sydney", zone: "Australia/Sydney" },
  { label: "Auckland", zone: "Pacific/Auckland" },
];

function toLocalInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Interpret a "YYYY-MM-DDTHH:mm" wall time in the given IANA zone and
 * return the corresponding UTC instant. Iterates to converge on the
 * correct offset, so DST transitions are handled.
 */
function zonedWallTimeToUtc(input: string, timeZone: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(input);
  if (!m) return null;
  const [, ys, mos, ds, hs, mis] = m;
  const y = +ys, mo = +mos, d = +ds, h = +hs, mi = +mis;
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59) return null;
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  let utc = Date.UTC(y, mo - 1, d, h, mi);
  for (let i = 0; i < 4; i++) {
    const parts = Object.fromEntries(dtf.formatToParts(new Date(utc)).map((p) => [p.type, p.value]));
    if (!parts.year) return null;
    const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour % 24, +parts.minute, +parts.second);
    const target = Date.UTC(y, mo - 1, d, h, mi);
    const diff = asUtc - target;
    if (diff === 0) break;
    utc -= diff;
  }
  return new Date(utc);
}

function formatInZone(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(instant);
}

function formatClock(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);
}

export default function TimezoneConverterClient() {
  const [input, setInput] = useState("");
  const [sourceZone, setSourceZone] = useState("UTC");
  const [targets, setTargets] = useState<string[]>(["America/New_York", "Europe/London", "Asia/Dubai", "Asia/Tokyo"]);
  const [zoneToAdd, setZoneToAdd] = useState("America/Los_Angeles");
  const [now, setNow] = useState<Date | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setInput(toLocalInputValue(new Date()));
    try {
      setSourceZone(Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC");
    } catch {
      /* keep UTC */
    }
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const instant = useMemo(() => {
    if (!input) return null;
    return zonedWallTimeToUtc(input, sourceZone);
  }, [input, sourceZone]);

  useEffect(() => {
    if (input && instant === null) setError("Enter a valid date and time.");
    else setError("");
  }, [input, instant]);

  const sourceLabel = TIME_ZONES.find((z) => z.zone === sourceZone)?.label ?? sourceZone;

  function addZone() {
    if (!targets.includes(zoneToAdd)) setTargets((t) => [...t, zoneToAdd]);
  }

  function removeZone(zone: string) {
    setTargets((t) => t.filter((z) => z !== zone));
  }

  return (
    <div className="space-y-5">
      {/* Converter */}
      <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="tz-datetime" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Date and time
            </label>
            <input
              id="tz-datetime"
              type="datetime-local"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            />
          </div>
          <div>
            <label htmlFor="tz-source" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Source time zone
            </label>
            <select
              id="tz-source"
              value={sourceZone}
              onChange={(e) => setSourceZone(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            >
              {TIME_ZONES.map((z) => (
                <option key={z.zone} value={z.zone}>
                  {z.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm" role="alert" style={{ color: "var(--color-danger, #e5484d)" }}>
            {error}
          </p>
        )}

        {instant && (
          <div className="mt-4 rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }} aria-live="polite">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Interpreted as local time in {sourceLabel}
            </p>
            <p className="mt-1 font-mono text-lg tabular-nums" style={{ color: "var(--text-primary)" }}>
              {formatInZone(instant, sourceZone)}
            </p>
          </div>
        )}

        {/* Target zones */}
        <div className="mt-4 flex flex-wrap items-end gap-2">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="tz-add" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Add a target zone
            </label>
            <select
              id="tz-add"
              value={zoneToAdd}
              onChange={(e) => setZoneToAdd(e.target.value)}
              className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            >
              {TIME_ZONES.map((z) => (
                <option key={z.zone} value={z.zone}>
                  {z.label}
                </option>
              ))}
            </select>
          </div>
          <Btn variant="secondary" size="sm" onClick={addZone}>
            Add zone
          </Btn>
        </div>

        {instant && (
          <ul className="mt-3 space-y-2">
            {targets.map((zone) => {
              const label = TIME_ZONES.find((z) => z.zone === zone)?.label ?? zone;
              return (
                <li
                  key={zone}
                  className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {label}
                    </p>
                    <p className="font-mono text-sm tabular-nums" style={{ color: "var(--text-secondary)" }}>
                      {formatInZone(instant, zone)}
                    </p>
                  </div>
                  <Btn variant="ghost" size="sm" onClick={() => removeZone(zone)} aria-label={`Remove ${label}`}>
                    ✕
                  </Btn>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* World clock */}
      <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <h2 className="mb-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          World clock
        </h2>
        <p className="mb-3 text-xs" style={{ color: "var(--text-subtle)" }}>
          Current local time in major cities, updating every second.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {WORLD_CLOCK.map((c) => (
            <div
              key={c.zone}
              className="rounded-lg border px-3 py-2.5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {c.label}
              </p>
              <p className="font-mono text-base tabular-nums" style={{ color: "var(--text-primary)" }}>
                {now ? formatClock(now, c.zone) : "--:--:--"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
