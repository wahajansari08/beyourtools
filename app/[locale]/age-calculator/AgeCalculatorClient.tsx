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

const BIRTHSTONES = [
  "Garnet", "Amethyst", "Aquamarine", "Diamond", "Emerald", "Pearl",
  "Ruby", "Peridot", "Sapphire", "Opal", "Topaz", "Turquoise",
];

/** Standard Western zodiac date ranges (month, day) — inclusive start. */
const ZODIAC: { name: string; startMonth: number; startDay: number }[] = [
  { name: "Aquarius", startMonth: 1, startDay: 20 },
  { name: "Pisces", startMonth: 2, startDay: 19 },
  { name: "Aries", startMonth: 3, startDay: 21 },
  { name: "Taurus", startMonth: 4, startDay: 20 },
  { name: "Gemini", startMonth: 5, startDay: 21 },
  { name: "Cancer", startMonth: 6, startDay: 21 },
  { name: "Leo", startMonth: 7, startDay: 23 },
  { name: "Virgo", startMonth: 8, startDay: 23 },
  { name: "Libra", startMonth: 9, startDay: 23 },
  { name: "Scorpio", startMonth: 10, startDay: 23 },
  { name: "Sagittarius", startMonth: 11, startDay: 22 },
  { name: "Capricorn", startMonth: 12, startDay: 22 },
];

function zodiacFor(d: Date): string {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  // Last range starting on or before this date; Jan 1–19 default to Capricorn.
  let sign = "Capricorn";
  for (const z of ZODIAC) {
    if (m > z.startMonth || (m === z.startMonth && day >= z.startDay)) sign = z.name;
  }
  return sign;
}

const CHINESE_ZODIAC = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
];

/** Chinese zodiac animal: 2024 was the Year of the Dragon. */
function chineseZodiacFor(d: Date): string {
  return CHINESE_ZODIAC[((d.getFullYear() - 4) % 12 + 12) % 12];
}

/** Add months, clamped to the last day of the target month (e.g. Aug 31 + 6 months = Feb 28/29). */
function addMonthsClamped(d: Date, months: number): Date {
  const targetMonth = d.getMonth() + months;
  const year = d.getFullYear() + Math.floor(targetMonth / 12);
  const month = ((targetMonth % 12) + 12) % 12;
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(d.getDate(), lastDay));
}

function isLeapYear(y: number): boolean {
  return y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
}

/** Count Feb 29 days lived between two dates (inclusive of dob, exclusive of asOf). */
function countLeapDays(from: Date, to: Date): number {
  let count = 0;
  for (let y = from.getFullYear(); y <= to.getFullYear(); y++) {
    if (!isLeapYear(y)) continue;
    const feb29 = new Date(y, 1, 29);
    if (feb29 >= from && feb29 < to) count++;
  }
  return count;
}

function formatLongDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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
      totalMinutes: Math.floor(diffMs / 60_000),
      totalSeconds: Math.floor(diffMs / 1000),
      weekdayBorn: WEEKDAYS[dobDate.getDay()],
      zodiac: zodiacFor(dobDate),
      chineseZodiac: chineseZodiacFor(dobDate),
      birthstone: BIRTHSTONES[dobDate.getMonth()],
      leapDays: countLeapDays(dobDate, asOfDate),
      decimalAge: totalDays / 365.2425,
      halfBirthday: addMonthsClamped(dobDate, 6),
      // The 10,000th day of life: a classic milestone (around age 27.4).
      tenThousandthDay: new Date(dobDate.getFullYear(), dobDate.getMonth(), dobDate.getDate() + 10000),
      daysToTenThousand: 10000 - totalDays,
    };
  }, [error, dobDate, asOfDate]);

  const countdown = useMemo(() => {
    if (!dobDate) return null;
    const today = new Date(now);
    const isBirthdayToday =
      today.getMonth() === dobDate.getMonth() && today.getDate() === dobDate.getDate();
    if (isBirthdayToday)
      return {
        today: true,
        days: 0,
        hours: 0,
        mins: 0,
        secs: 0,
        nextDate: formatLongDate(today),
        turningAge: today.getFullYear() - dobDate.getFullYear(),
      };
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
      nextDate: formatLongDate(next),
      turningAge: next.getFullYear() - dobDate.getFullYear(),
    };
  }, [dobDate, now]);

  function reset() {
    setDob("");
    setAsOf(toISODate(new Date()));
  }

  const [summaryCopied, setSummaryCopied] = useState(false);

  async function copySummary() {
    if (!result || !dobDate || !asOfDate) return;
    const summary =
      `My exact age: ${result.age.years} years, ${result.age.months} months, ${result.age.days} days ` +
      `(as of ${formatLongDate(asOfDate)}). Born on a ${result.weekdayBorn}. ` +
      `Zodiac: ${result.zodiac} · Chinese zodiac: ${result.chineseZodiac} · Birthstone: ${result.birthstone}. ` +
      `Total days lived: ${result.totalDays.toLocaleString("en-US")}. ` +
      `Next birthday: ${countdown?.nextDate ?? "—"} (turning ${countdown?.turningAge ?? "—"}).`;
    try {
      await navigator.clipboard.writeText(summary);
      setSummaryCopied(true);
      setTimeout(() => setSummaryCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
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
              max={asOf || toISODate(new Date())}
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
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              Zodiac sign: <strong style={{ color: "var(--text-primary)" }}>{result.zodiac}</strong>
              {" · "}Chinese zodiac: <strong style={{ color: "var(--text-primary)" }}>{result.chineseZodiac}</strong>
              {" · "}Birthstone: <strong style={{ color: "var(--text-primary)" }}>{result.birthstone}</strong>
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              Age in decimal years:{" "}
              <strong style={{ color: "var(--text-primary)" }}>{result.decimalAge.toFixed(2)}</strong>
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              Leap days lived: <strong style={{ color: "var(--text-primary)" }}>{result.leapDays}</strong>
              {" · "}Total minutes lived:{" "}
              <strong style={{ color: "var(--text-primary)" }}>{result.totalMinutes.toLocaleString("en-US")}</strong>
              {" · "}Total seconds lived:{" "}
              <strong style={{ color: "var(--text-primary)" }}>{result.totalSeconds.toLocaleString("en-US")}</strong>
            </p>
          </div>

          <div className="rounded-xl border p-5" style={cardStyle}>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Life milestones
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              Half-birthday:{" "}
              <strong style={{ color: "var(--text-primary)" }}>{formatLongDate(result.halfBirthday)}</strong>
              {" — "}six months after your birthday, celebrated every year.
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              Your 10,000th day:{" "}
              <strong style={{ color: "var(--text-primary)" }}>{formatLongDate(result.tenThousandthDay)}</strong>
              {result.daysToTenThousand > 0 && (
                <>{" — "}in <strong style={{ color: "var(--accent-text)" }}>{result.daysToTenThousand.toLocaleString("en-US")} days</strong></>
              )}
              {result.daysToTenThousand === 0 && (
                <>{" — "}<strong style={{ color: "var(--accent-text)" }}>today!</strong></>
              )}
              {result.daysToTenThousand < 0 && (
                <>{" — "}passed <strong style={{ color: "var(--text-primary)" }}>{Math.abs(result.daysToTenThousand).toLocaleString("en-US")} days ago</strong></>
              )}
            </p>
            <div className="mt-3">
              <Btn variant="secondary" size="sm" onClick={copySummary}>
                {summaryCopied ? "Result copied!" : "Copy result summary"}
              </Btn>
            </div>
          </div>

          {countdown && (
            <div className="rounded-xl border p-5" style={cardStyle}>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
                Next birthday countdown
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                Next birthday: <strong style={{ color: "var(--text-primary)" }}>{countdown.nextDate}</strong>
                {" — "}You&apos;ll turn{" "}
                <strong style={{ color: "var(--accent-text)" }}>{countdown.turningAge}</strong>
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
