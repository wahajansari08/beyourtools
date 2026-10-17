/**
 * Tiny stroke SVG icons (no emojis). Inherit currentColor.
 */

function base(className: string) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };
}

export function LockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BoltIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <path d="M13 2.5 4.5 13.5H11L10 21.5 19.5 10H13z" />
    </svg>
  );
}

export function BadgeCheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <path d="M12 2.8 14.7 5l3.4-.5.9 3.3 3 1.7-1.4 3.1 1.4 3.1-3 1.7-.9 3.3-3.4-.5L12 22.4 9.3 20.2l-3.4.5-.9-3.3-3-1.7L3.4 12.6 2 9.5l3-1.7.9-3.3 3.4.5z" />
      <path d="m9 12.2 2.2 2.2L15.5 10" />
    </svg>
  );
}

export function GlobeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
    </svg>
  );
}
