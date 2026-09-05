/**
 * Btn — unified button/anchor component for BeYourTools.
 *
 * Renders as <button> by default.
 * Pass href="" to render as Next.js <Link> (or <a> for external URLs).
 *
 * Variants:
 *   primary   — amber accent fill. Used for Calculate, Accept, Download, Send.
 *   secondary — outline border + elevated bg. Used for Reset, Decline, Try again.
 *   ghost     — no bg or border, text-only. Used for nav links, inline "← Back" links.
 *   danger    — coral text, no bg. Used for destructive inline actions like "Remove".
 *   toggle    — outline that lights up when selected. Used for mode selectors.
 *   pill      — small bordered chip. Used for quick-links, related tools, popular tools.
 *   chip      — rounded-full accent-tinted. Used for chat quick-reply suggestions.
 *   icon      — square/round icon-only. Used for search, hamburger, close buttons.
 *
 * Size:
 *   sm  — text-xs,  px-3  py-1.5
 *   md  — text-sm,  px-5  py-2.5  (default)
 *   lg  — text-sm,  px-6  py-2.5
 *
 * All variants share the same focus-ring, transition, and aria semantics.
 */

"use client";

import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type BtnVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "toggle"
  | "pill"
  | "chip"
  | "icon";

export type BtnSize = "sm" | "md" | "lg";

export interface BtnProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: BtnVariant;
  size?: BtnSize;
  /** When provided renders as Next.js Link (internal) or <a> (external). */
  href?: string;
  /** Whether this toggle button is currently selected (variant="toggle" only). */
  selected?: boolean;
  /** Extra className merged after variant classes. */
  className?: string;
  children: ReactNode;
}

// ── Style maps ────────────────────────────────────────────────────────────────

const BASE =
  "focus-ring inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition select-none";

const SIZE: Record<BtnSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-2.5 text-sm",
};

/**
 * Returns the className + style object for a given variant/state combination.
 * Toggle returns different values depending on the `selected` prop.
 */
function getStyles(
  variant: BtnVariant,
  size: BtnSize,
  selected?: boolean
): { className: string; style: React.CSSProperties } {
  switch (variant) {
    // ── Primary ──────────────────────────────────────────────────────────────
    case "primary":
      return {
        className: `${BASE} ${SIZE[size]} font-semibold hover:opacity-90 disabled:opacity-40`,
        style: { backgroundColor: "var(--accent)", color: "var(--accent-fg)" },
      };

    // ── Secondary ────────────────────────────────────────────────────────────
    case "secondary":
      return {
        className: `${BASE} ${SIZE[size]} border hover:opacity-80 disabled:opacity-40`,
        style: {
          borderColor: "var(--border-strong)",
          backgroundColor: "var(--bg-elevated)",
          color: "var(--text-muted)",
        },
      };

    // ── Ghost ────────────────────────────────────────────────────────────────
    case "ghost":
      return {
        className: `${BASE} ${SIZE[size]} hover-text-primary`,
        style: { color: "var(--text-muted)" },
      };

    // ── Danger ───────────────────────────────────────────────────────────────
    case "danger":
      return {
        className: "focus-ring inline-flex items-center justify-center rounded text-xs font-medium transition hover:opacity-70",
        style: { color: "var(--coral)" },
      };

    // ── Toggle ───────────────────────────────────────────────────────────────
    case "toggle":
      return {
        className: `${BASE} ${SIZE[size]} border capitalize`,
        style: selected
          ? {
              borderColor: "var(--accent)",
              backgroundColor: "color-mix(in srgb,var(--accent) 12%,transparent)",
              color: "var(--accent)",
            }
          : {
              borderColor: "var(--border-strong)",
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-muted)",
            },
      };

    // ── Pill ─────────────────────────────────────────────────────────────────
    case "pill":
      return {
        className: `${BASE} border px-3 py-1.5 text-xs hover-card`,
        style: {
          borderColor: "var(--border-strong)",
          backgroundColor: "var(--bg-elevated)",
          color: "var(--text-secondary)",
        },
      };

    // ── Chip ─────────────────────────────────────────────────────────────────
    case "chip":
      return {
        className:
          "focus-ring inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-[11px] font-medium transition hover:opacity-80",
        style: {
          borderColor: "var(--accent)",
          backgroundColor: "color-mix(in srgb,var(--accent) 10%,transparent)",
          color: "var(--accent-text)",
        },
      };

    // ── Icon ─────────────────────────────────────────────────────────────────
    case "icon":
      return {
        className:
          "focus-ring inline-flex items-center justify-center rounded-md p-1.5 transition hover-text-primary",
        style: { color: "var(--text-muted)" },
      };

    default:
      return { className: BASE, style: {} };
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

const Btn = forwardRef<HTMLButtonElement, BtnProps>(function Btn(
  {
    variant = "secondary",
    size = "md",
    href,
    selected,
    className: extraClass = "",
    children,
    style: extraStyle,
    ...rest
  },
  ref
) {
  const { className, style } = getStyles(variant, size, selected);
  const mergedClass = `${className} ${extraClass}`.trim();
  const mergedStyle = { ...style, ...extraStyle };

  // Render as Link/anchor when href is provided
  if (href) {
    const isExternal =
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:");

    if (isExternal) {
      return (
        <a
          href={href}
          className={mergedClass}
          style={mergedStyle}
          target="_blank"
          rel="noopener noreferrer"
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={mergedClass}
        style={mergedStyle}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  // Default: <button>
  return (
    <button
      ref={ref}
      type="button"
      className={mergedClass}
      style={mergedStyle}
      aria-pressed={variant === "toggle" ? selected : undefined}
      {...rest}
    >
      {children}
    </button>
  );
});

Btn.displayName = "Btn";
export default Btn;
