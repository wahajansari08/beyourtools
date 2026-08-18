"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Consent = "accepted" | "declined" | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cookie_consent") as Consent;
      if (!stored) {
        // Slight delay so banner doesn't flash on first paint
        const t = setTimeout(() => setVisible(true), 600);
        return () => clearTimeout(t);
      }
      setConsent(stored);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (choice: "accepted" | "declined") => {
    try { localStorage.setItem("cookie_consent", choice); } catch { /* ignore */ }
    setConsent(choice);
    setVisible(false);
  };

  if (!visible || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[200] animate-slide-up px-4 pb-4 sm:px-6"
    >
      <div
        className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border p-5 shadow-2xl sm:flex-row sm:items-center"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-strong)",
          boxShadow: "0 -4px 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* Text */}
        <div className="flex-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          <span className="mr-1.5 text-base" aria-hidden="true">🍪</span>
          We use cookies to analyse traffic and show relevant ads.
          Your tool data never leaves your browser.{" "}
          <Link
            href="/cookie-policy"
            className="focus-ring underline underline-offset-2 transition hover-text-primary"
            style={{ color: "var(--teal)" }}
          >
            Cookie Policy
          </Link>{" "}
          ·{" "}
          <Link
            href="/privacy-policy"
            className="focus-ring underline underline-offset-2 transition hover-text-primary"
            style={{ color: "var(--teal)" }}
          >
            Privacy Policy
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => save("declined")}
            className="focus-ring rounded-lg border px-4 py-2 text-sm font-medium transition"
            style={{
              borderColor: "var(--border-strong)",
              color: "var(--text-muted)",
              backgroundColor: "var(--bg-elevated)",
            }}
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => save("accepted")}
            className="focus-ring rounded-lg px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
