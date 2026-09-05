"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Btn from "@/components/Btn";

type Consent = "accepted" | "declined" | null;

export default function CookieBanner() {
  const [consent,  setConsent]  = useState<Consent>(null);
  const [visible,  setVisible]  = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cookie_consent") as Consent;
      if (!stored) {
        // Small delay so the banner slides in after first paint
        const t = setTimeout(() => setVisible(true), 600);
        return () => clearTimeout(t);
      }
      setConsent(stored);
    } catch {
      setVisible(true);
    }
    setMounted(true);
  }, []);

  // Trigger slide-in transition after mount
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(t);
    }
    setMounted(false);
  }, [visible]);

  const save = (choice: "accepted" | "declined") => {
    try { localStorage.setItem("cookie_consent", choice); } catch { /* ignore */ }
    setMounted(false);
    // Wait for slide-out before unmounting
    setTimeout(() => { setConsent(choice); setVisible(false); }, 300);
  };

  if (!visible || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[200]"
      style={{
        transform: mounted ? "translateY(0)" : "translateY(100%)",
        transition: "transform 300ms ease",
      }}
    >
      <div
        className="flex w-full flex-col gap-4 border-t p-5 sm:flex-row sm:items-center"
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
          </Link>
          {" · "}
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
          <Btn variant="secondary" size="md" onClick={() => save("declined")}>
            Decline
          </Btn>
          <Btn variant="primary" size="md" onClick={() => save("accepted")}>
            Accept all
          </Btn>
        </div>
      </div>
    </div>
  );
}
