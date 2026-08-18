"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

// ─── Icons ────────────────────────────────────────────────────────────────────

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
    <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06L5.403 4.343a.75.75 0 0 0-1.06 1.06l1.06 1.06Z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
    <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z" clipRule="evenodd" />
  </svg>
);

const MonitorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
    <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v8.5A2.25 2.25 0 0 1 15.75 15h-3.105a3.501 3.501 0 0 1 1.1 1.677A.75.75 0 0 1 13 17.5h-6a.75.75 0 0 1-.745-.823A3.501 3.501 0 0 1 7.355 15H4.25A2.25 2.25 0 0 1 2 12.75v-8.5Zm1.5 0a.75.75 0 0 1 .75-.75h11.5a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75v-7.5Z" clipRule="evenodd" />
  </svg>
);

const OPTIONS = [
  { value: "light"  as const, label: "Light",  Icon: SunIcon    },
  { value: "dark"   as const, label: "Dark",   Icon: MoonIcon   },
  { value: "system" as const, label: "System", Icon: MonitorIcon },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ThemeToggle() {
  const { theme, resolved, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // The trigger icon reflects the current resolved theme (moon in dark, sun in light)
  const TriggerIcon = resolved === "light" ? SunIcon : MoonIcon;

  return (
    <div ref={ref} className="relative">
      {/* Trigger - just an icon button, no box */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="focus-ring flex items-center justify-center rounded-md p-1.5 transition"
        style={{ color: open ? "var(--text-primary)" : "var(--text-muted)" }}
        aria-label="Toggle theme"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <TriggerIcon />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1.5 w-36 overflow-hidden rounded-lg border shadow-xl"
          style={{
            borderColor: "var(--border-strong)",
            backgroundColor: "var(--bg-surface)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          }}
          role="listbox"
          aria-label="Theme options"
        >
          {OPTIONS.map(({ value, label, Icon }) => {
            const isActive = theme === value;
            return (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => { setTheme(value); setOpen(false); }}
                className="focus-ring flex w-full items-center gap-2.5 px-3 py-2 text-sm transition"
                style={{
                  backgroundColor: isActive ? "var(--bg-elevated)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                <Icon />
                <span className="flex-1 text-left">{label}</span>
                {/* Active checkmark */}
                {isActive && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                    className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent)" }} aria-hidden="true">
                    <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
