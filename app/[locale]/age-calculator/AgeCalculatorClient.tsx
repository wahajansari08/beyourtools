"use client";

import { useEffect, useMemo, useState } from "react";
import Btn from "@/components/Btn";

const inputCls = "focus-ring w-full rounded-lg border px-3 py-2 text-sm";
const inputStyle = {
  borderColor: "var(--border-strong)",
  backgroundColor: "var(--bg-elevated)",
  color: "var(--text-primary)",
} as const;
const cardStyle = {
  borderColor: "var(--border)",
  backgroundColor: "var(--bg-surface)",
} as const;
const labelStyle = { color: "var(--text-muted)" } as const;
const statBoxStyle = {
  borderColor: "var(--border)",
  backgroundColor: "var(--bg-elevated)",
} as const;

function toISODate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Parse "YYYY-MM-DD" into a local Date, or null if invalid. */
function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (
    d.getFullYear() !== Number(m[1]) ||
    d.getMonth() !== Number(m[2]) - 1 ||
    d.getDate() !== Number(m[3])
  )
    return null;
  return d;
}

/** Calendar-correct age: full years, then months, then days (leap-year safe). */
function calcExactAge(from: Date, to: Date): { years: number; months: number; days: number } {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) {
    months -= 1;
    // days in the month preceding `to`
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AgeCalculatorClient() {
  const [dob, setDob] = useState("");
  const [asOf, setAsOf] = useState(() => toISODate(new Date()));
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const dobDate = useMemo(() => parseISODate(dob), [dob]);
  const asOfDate = useMemo(() => parseISODate(asOf), [asOf]);

  const error = useMemo(() => {
    if (!dob) return "";
    if (!dobDate) return "Enter a valid date of birth.";
    if (!asOfDate) return "Enter a valid “as of” date.";
    if (dobDate.getTime() > asOfDate.getTime())
      return "Date of birth can't be in the future. Pick a date on or before the “as of” date.";
    return "";
  }, [dob, dobDate, asOfDate]);

  const result = useMemo(() => {
    if (error || !dobDate || !asOfDate) return null;
    const age = calcExactAge(dobDate, asOfDate);
    const diffMs = asOfDate.getTime() - dobDate.getTime();
    const totalDays = Math.floor(diffMs / 86_400_000);
    return {
      age,
      totalMonths: age.years * 12 + age.months,
      totalWeeks: Math.floor(totalDays / 7),
      totalDays,
      totalHours: Math.floor(diffMs / 3_600_000),
      weekdayBorn: WEEKDAYS[dobDate.getDay()],
    };
  }, [error, dobDate, asOfDate]);

  const countdown = useMemo(() => {
    if (!dobDate) return null;
    const today = new Date(now);
    const isBirthdayToday =
      today.getMonth() === dobDate.getMonth() && today.getDate() === dobDate.getDate();
    if (isBirthdayToday) return { today: true, days: 0, hours: 0, mins: 0, secs: 0 };
    let year = today.getFullYear();
    let next = new Date(year, dobDate.getMonth(), dobDate.getDate());
    // Feb 29 birthdays roll to Mar 1 in non-leap years
    if (next.getMonth() !== dobDate.getMonth()) next = new Date(year, 2, 1);
    const startOfToday = new Date(year, today.getMonth(), today.getDate());
    if (next < startOfToday) {
      year += 1;
      next = new Date(year, dobDate.getMonth(), dobDate.getDate());
      if (next.getMonth() !== dobDate.getMonth()) next = new Date(year, 2, 1);
    }
    const ms = Math.max(0, next.getTime() - now);
    return {
      today: false,
      days: Math.floor(ms / 86_400_000),
      hours: Math.floor((ms / 3_600_000) % 24),
      mins: Math.floor((ms / 60_000) % 60),
      secs: Math.floor((ms / 1000) % 60),
    };
  }, [dobDate, now]);

  function reset() {
    setDob("");
    setAsOf(toISODate(new Date()));
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-5" style={cardStyle}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="age-dob" className="mb-1 block text-xs font-medium" style={labelStyle}>
              Date of birth
            </label>
            <input
              id="age-dob"
              type="date"
              value={dob}
              max={toISODate(new Date())}
              onChange={(e) => setDob(e.target.value)}
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="age-asof" className="mb-1 block text-xs font-medium" style={labelStyle}>
              Age as of <span className="font-normal">(defaults to today)</span>
            </label>
            <input
              id="age-asof"
              type="date"
              value={asOf}
              onChange={(e) => setAsOf(e.target.value)}
              className={inputCls}
              style={inputStyle}
            />
          </div>
        </div>
        <div className="mt-4">
          <Btn variant="ghost" size="sm" onClick={reset}>
            Reset
          </Btn>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium" style={{ color: "var(--coral)" }}>
          {error}
        </p>
      )}

      {!dob && !error && (
        <p className="text-sm" style={{ color: "var(--text-subtle)" }}>
          Pick your date of birth above to see your exact age.
        </p>
      )}

      {result && (
        <>
          <div className="rounded-xl border p-5 text-center" style={cardStyle}>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Your exact age
            </p>
            <p className="mt-2 text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              {result.age.years}{" "}
              <span className="text-lg font-medium" style={{ color: "var(--text-muted)" }}>years</span>{" "}
              {result.age.months}{" "}
              <span className="text-lg font-medium" style={{ color: "var(--text-muted)" }}>months</span>{" "}
              {result.age.days}{" "}
              <span className="text-lg font-medium" style={{ color: "var(--text-muted)" }}>days</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Months lived", value: result.totalMonths.toLocaleString("en-US") },
              { label: "Weeks lived", value: result.totalWeeks.toLocaleString("en-US") },
              { label: "Days lived", value: result.totalDays.toLocaleString("en-US") },
              { label: "Hours lived", value: result.totalHours.toLocaleString("en-US") },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border p-4 text-center" style={statBoxStyle}>
                <p className="text-xl font-bold" style={{ color: "var(--accent-text)" }}>
                  {s.value}
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border p-5" style={cardStyle}>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Born on a
            </p>
            <p className="mt-1 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              {result.weekdayBorn}
            </p>
          </div>

          {countdown && (
            <div className="rounded-xl border p-5" style={cardStyle}>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
                Next birthday countdown
              </p>
              {countdown.today ? (
                <p className="mt-2 text-lg font-semibold" style={{ color: "var(--accent-text)" }}>
                  Happy birthday, it&apos;s today!
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  {[
                    { v: countdown.days, l: "days" },
                    { v: countdown.hours, l: "hours" },
                    { v: countdown.mins, l: "mins" },
                    { v: countdown.secs, l: "secs" },
                  ].map((u) => (
                    <div key={u.l} className="rounded-lg border px-2 py-3" style={statBoxStyle}>
                      <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
                        {u.v}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {u.l}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
