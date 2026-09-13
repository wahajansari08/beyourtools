"use client";

import { useState, type FormEvent } from "react";
import Btn from "@/components/Btn";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const subjectLabels: Record<string, string> = {
    general: "General enquiry",
    bug: "Bug / Formula report",
    feature: "Tool feature request",
    privacy: "Privacy / GDPR request",
    ads: "Advertising / Partnership enquiry",
    other: "Other feedback",
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const mailSubject = encodeURIComponent(`[BeYourTools - ${subjectLabels[subject] || "Contact"}] from ${name}`);
    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nSubject: ${subjectLabels[subject] || subject}\n\nMessage:\n${message}\n`
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
          style={{ borderColor: "var(--teal)", backgroundColor: "var(--bg-surface)" }}
        >
          <div className="text-3xl" aria-hidden="true">✉️</div>
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Thank You for Contacting Us
          </h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
            Your message has been prepared for your email client. If your email application did not launch automatically, you can send your note directly to:
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <code
              className="rounded px-2.5 py-1 text-xs font-mono font-medium"
              style={{ backgroundColor: "var(--bg-elevated)", color: "var(--teal)" }}
            >
              beyourtools@gmail.com
            </code>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="focus-ring rounded-md px-2.5 py-1 text-xs font-medium border transition hover:opacity-80"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <p className="text-xs pt-2" style={{ color: "var(--text-subtle)" }}>
            Our engineering and editorial team typically responds within 24–48 hours.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs font-medium underline pt-2"
            style={{ color: "var(--text-muted)" }}
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form">
          <div>
            <label
              htmlFor="contact-name"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Your Name
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
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
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              Inquiry Subject
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
              <option value="general">General enquiry</option>
              <option value="bug">Bug or formula report</option>
              <option value="feature">Tool feature request</option>
              <option value="privacy">Privacy or GDPR request</option>
              <option value="ads">Advertising or partnership</option>
              <option value="other">Other topic</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your inquiry, report, or suggestion in detail..."
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
              Send Message →
            </Btn>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="focus-ring text-xs text-muted hover-text-primary transition underline"
            >
              {copied ? "✓ Copied beyourtools@gmail.com" : "Copy email address"}
            </button>
          </div>
        </form>
      )}

      {/* Response time SLA banner */}
      <div
        className="rounded-lg border p-3 text-xs flex flex-wrap items-center justify-between gap-2"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-subtle)" }}
      >
        <span>⏱️ Standard response SLA: 24–48 hours</span>
        <span>Dedicated engineering &amp; editorial support</span>
      </div>
    </div>
  );
}
