"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import Btn from "@/components/Btn";

const SUBJECT_KEYS = ["general", "bug", "feature", "privacy", "ads", "other"] as const;

export default function ContactForm() {
  const t = useTranslations("contact");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<string>("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const subjectLabels = t.raw("subjects") as Record<string, string>;
  const subjectOptions = t.raw("subjectOptions") as Record<string, string>;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const mailSubject = encodeURIComponent(`[BeYourTools - ${subjectLabels[subject] || t("mailFallback")}] from ${name}`);
    const mailBody = encodeURIComponent(
      `${t("mailName")}: ${name}\n${t("mailEmail")}: ${email}\n${t("mailSubject")}: ${subjectLabels[subject] || subject}\n\n${t("mailMessage")}:\n${message}\n`
    );
    window.location.href = `mailto:beyourtools@gmail.com?subject=${mailSubject}&body=${mailBody}`;
    setSubmitted(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("beyourtools@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="mt-8 space-y-6">
      {submitted ? (
        <div
          className="rounded-xl border p-6 text-center space-y-3"
          style={{ borderColor: "var(--accent-text)", backgroundColor: "var(--bg-surface)" }}
        >
          <div className="text-3xl" aria-hidden="true">✉️</div>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {t("successTitle")}
          </h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
            {t("successBody")}
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <code
              className="rounded px-2.5 py-1 text-xs font-mono font-medium"
              style={{ backgroundColor: "var(--bg-elevated)", color: "var(--accent-text)" }}
            >
              beyourtools@gmail.com
            </code>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="focus-ring rounded-md px-2.5 py-1 text-xs font-medium border transition hover:opacity-80"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <p className="text-xs pt-2" style={{ color: "var(--text-subtle)" }}>
            {t("successNote")}
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs font-medium underline pt-2"
            style={{ color: "var(--text-muted)" }}
          >
            {t("sendAnother")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" aria-label={t("ariaLabel")}>
          <div>
            <label
              htmlFor="contact-name"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("nameLabel")}
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="focus-ring w-full rounded-lg border px-4 py-2.5 text-sm"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("emailLabel")}
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="focus-ring w-full rounded-lg border px-4 py-2.5 text-sm"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="contact-subject"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("subjectLabel")}
            </label>
            <select
              id="contact-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="focus-ring w-full rounded-lg border px-4 py-2.5 text-sm"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
              }}
            >
              {SUBJECT_KEYS.map((key) => (
                <option key={key} value={key}>{subjectOptions[key]}</option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("messageLabel")}
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              className="focus-ring w-full rounded-lg border px-4 py-2.5 text-sm resize-none"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-4 pt-1">
            <Btn variant="primary" size="lg">
              {t("submit")}
            </Btn>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="focus-ring text-xs text-muted hover-text-primary transition underline"
            >
              {copied ? t("copiedEmail") : t("copyEmail")}
            </button>
          </div>
        </form>
      )}

      {/* Response time SLA banner */}
      <div
        className="rounded-lg border p-3 text-xs flex flex-wrap items-center justify-between gap-2"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-subtle)" }}
      >
        <span>{t("slaLeft")}</span>
        <span>{t("slaRight")}</span>
      </div>
    </div>
  );
}
