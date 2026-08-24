"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
  className?: string;
}

export default function FaqAccordion({ faqs, className = "" }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <dl className={`space-y-2 ${className}`}>
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="rounded-lg border overflow-hidden"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <dt>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
                className="focus-ring flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium transition hover:opacity-80"
                style={{ color: "var(--text-primary)" }}
              >
                <span>{faq.question}</span>
                <span
                  className="shrink-0 transition-transform duration-200"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: "var(--text-subtle)" }}
                  aria-hidden="true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
            </dt>
            <dd
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
              hidden={!isOpen}
              className="border-t px-4 py-3 text-sm leading-relaxed"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--bg-elevated)" }}
            >
              {faq.answer}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
