"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
}

// ── Canned quick-reply suggestions ───────────────────────────────────────────

const QUICK_REPLIES = [
  "How do I report a bug?",
  "Can you add a new tool?",
  "Are the tools really free?",
  "How is my data handled?",
];

// ── Bot auto-responses ────────────────────────────────────────────────────────

function getBotReply(input: string): string {
  const q = input.toLowerCase();

  if (q.includes("bug") || q.includes("error") || q.includes("broken") || q.includes("not working"))
    return "Sorry to hear that! Please email us at hello@beyourtools.com with the tool name and a short description of the issue — we usually fix bugs within 1–2 days.";

  if (q.includes("new tool") || q.includes("suggest") || q.includes("request") || q.includes("add"))
    return "We love suggestions! Send your idea to hello@beyourtools.com or reach us on Reddit at u/beyourtools and we'll consider it for an upcoming update.";

  if (q.includes("free") || q.includes("cost") || q.includes("price") || q.includes("paid"))
    return "Yes — every tool on BeYourTools is 100% free with no sign-up, no ads, and no usage limits. We plan to keep it that way.";

  if (q.includes("data") || q.includes("privacy") || q.includes("upload") || q.includes("server") || q.includes("safe"))
    return "All processing happens entirely in your browser. Your files and data are never sent to our servers. See our Privacy Policy for full details.";

  if (q.includes("contact") || q.includes("email") || q.includes("reach"))
    return "You can reach us at hello@beyourtools.com or via our Contact page. We typically respond within 2–3 business days.";

  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("howdy"))
    return "Hey there! 👋 How can I help you today? Feel free to ask about our tools, report a bug, or suggest a new feature.";

  if (q.includes("thank"))
    return "You're welcome! Is there anything else I can help you with?";

  // Fallback
  return "Thanks for your message! For the fastest response, email us at hello@beyourtools.com — we reply within 2–3 business days. You can also check our Contact page for more options.";
}

// ── Chat bubble icon ──────────────────────────────────────────────────────────

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.288Z" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────

export default function ChatSupport() {
  const [open,      setOpen]      = useState(false);
  const [input,     setInput]     = useState("");
  const [messages,  setMessages]  = useState<Message[]>([
    {
      id: 0,
      from: "bot",
      text: "Hi there! 👋 I'm the BeYourTools assistant. Ask me anything about our tools, or choose a quick reply below.",
    },
  ]);
  const [typing,    setTyping]    = useState(false);
  const [unread,    setUnread]    = useState(0);
  const [hasOpened, setHasOpened] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const nextId         = useRef(1);

  // Scroll to latest message
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, typing]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setUnread(0);
      setHasOpened(true);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  // Show a nudge bubble after 8s if user hasn't opened it
  useEffect(() => {
    if (hasOpened) return;
    const t = setTimeout(() => {
      if (!hasOpened) setUnread(1);
    }, 8000);
    return () => clearTimeout(t);
  }, [hasOpened]);

  const addMessage = useCallback((from: "bot" | "user", text: string) => {
    setMessages((prev) => [...prev, { id: nextId.current++, from, text }]);
  }, []);

  const handleSend = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    addMessage("user", trimmed);

    // Simulate bot typing delay
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMessage("bot", getBotReply(trimmed));
      if (!open) setUnread((n) => n + 1);
    }, 800 + Math.random() * 400);
  }, [addMessage, open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div
      className="fixed bottom-5 left-5 z-50 flex flex-col items-start"
      style={{ pointerEvents: "none" }}
    >
      {/* ── Chat panel ─────────────────────────────────────────────────── */}
      {open && (
        <div
          className="mb-3 flex flex-col overflow-hidden rounded-2xl border shadow-2xl"
          style={{
            pointerEvents: "all",
            width: "min(340px, calc(100vw - 40px))",
            height: "440px",
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
            boxShadow: "0 20px 60px color-mix(in srgb, #000 50%, transparent)",
          }}
          role="dialog"
          aria-label="Chat support"
          aria-modal="false"
        >
          {/* Header */}
          <div
            className="flex shrink-0 items-center justify-between px-4 py-3"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: "color-mix(in srgb,#000 15%,transparent)" }}
                aria-hidden="true"
              >
                <ChatIcon />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight" style={{ color: "var(--accent-fg)" }}>
                  BeYourTools Support
                </p>
                <p className="text-[11px] opacity-80 leading-tight" style={{ color: "var(--accent-fg)" }}>
                  Typically replies in minutes
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="focus-ring rounded-lg p-1 transition hover:opacity-70"
              style={{ color: "var(--accent-fg)" }}
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.from === "bot" && (
                  <span
                    className="mr-2 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
                    aria-hidden="true"
                  >
                    B
                  </span>
                )}
                <div
                  className="max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed"
                  style={
                    msg.from === "user"
                      ? {
                          backgroundColor: "var(--accent)",
                          color: "var(--accent-fg)",
                          borderBottomRightRadius: "4px",
                        }
                      : {
                          backgroundColor: "var(--bg-elevated)",
                          color: "var(--text-secondary)",
                          borderBottomLeftRadius: "4px",
                          border: "1px solid var(--border)",
                        }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex justify-start">
                <span
                  className="mr-2 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
                  aria-hidden="true"
                >
                  B
                </span>
                <div
                  className="flex items-center gap-1 rounded-2xl px-3 py-2"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderBottomLeftRadius: "4px",
                  }}
                  aria-label="Bot is typing"
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "var(--text-subtle)",
                        animationDelay: `${delay}ms`,
                        animationDuration: "900ms",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies — only show on first message */}
          {messages.length === 1 && !typing && (
            <div className="shrink-0 border-t px-4 py-2" style={{ borderColor: "var(--border)" }}>
              <p className="mb-1.5 text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
                Quick replies
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="focus-ring rounded-full border px-2.5 py-1 text-[11px] font-medium transition hover:opacity-80"
                    style={{
                      borderColor: "var(--accent)",
                      backgroundColor: "color-mix(in srgb,var(--accent) 10%,transparent)",
                      color: "var(--accent-text)",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contact page link */}
          <div
            className="shrink-0 border-t px-4 py-1.5 text-center"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
          >
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="focus-ring text-[11px] hover:underline"
              style={{ color: "var(--teal)" }}
            >
              Open full contact page →
            </Link>
          </div>

          {/* Input */}
          <div
            className="shrink-0 flex items-center gap-2 border-t px-3 py-2.5"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              className="focus-ring min-w-0 flex-1 rounded-full border px-3 py-1.5 text-xs"
              style={{
                borderColor: "var(--border-strong)",
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-primary)",
              }}
              maxLength={500}
              aria-label="Message input"
            />
            <button
              type="button"
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition disabled:opacity-40 hover:opacity-80"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      {/* ── Trigger bubble ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:scale-105 active:scale-95"
        style={{
          pointerEvents: "all",
          backgroundColor: "var(--accent)",
          color: "var(--accent-fg)",
          boxShadow: "0 8px 24px color-mix(in srgb, var(--accent) 45%, transparent)",
          transition: "transform 150ms ease, box-shadow 150ms ease",
        }}
        aria-label={open ? "Close chat" : "Open chat support"}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span
          className="transition-all duration-200"
          style={{ opacity: open ? 0 : 1, transform: open ? "rotate(90deg) scale(0.7)" : "rotate(0deg) scale(1)", position: "absolute" }}
        >
          <ChatIcon />
        </span>
        <span
          className="transition-all duration-200"
          style={{ opacity: open ? 1 : 0, transform: open ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.7)", position: "absolute" }}
        >
          <CloseIcon />
        </span>

        {/* Unread badge */}
        {unread > 0 && !open && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
            style={{ backgroundColor: "var(--coral)", color: "#fff" }}
            aria-label={`${unread} unread message`}
          >
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
