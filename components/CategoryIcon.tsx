/**
 * CategoryIcon: small inline SVG glyphs for the seven tool categories.
 * Stroke-based, inherits currentColor. No emojis.
 */

export type CategoryIconName =
  | "json"
  | "image"
  | "pdf"
  | "video"
  | "audio"
  | "qr"
  | "finance"
  | "text"
  | "dev"
  | "calc";

const PATHS: Record<CategoryIconName, React.ReactNode> = {
  json: (
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <circle cx="9" cy="9" r="1.8" />
      <path d="m21 15-4.5-4.5L9 18" />
    </>
  ),
  pdf: (
    <>
      <path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8.5z" />
      <path d="M14 2.5v6h6" />
      <path d="M9 13.5h6M9 17h6" />
    </>
  ),
  video: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="m10.5 9.5 4.5 2.5-4.5 2.5z" fill="currentColor" stroke="none" />
    </>
  ),
  audio: (
    <path d="M4 10v4M8.5 7v10M13 4v16M17.5 8v8M21 10.5v3" />
  ),
  qr: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <path d="M13.5 13.5h2.5v2.5h-2.5zM18 13.5h2.5M13.5 18H16M18 16.5V18H20.5v2.5" />
    </>
  ),
  finance: (
    <>
      <path d="m3.5 16.5 5.5-5.5 3.5 3.5 7.5-7.5" />
      <path d="M15 7h5v5" />
    </>
  ),
  text: (
    <>
      <path d="M5 6.5h14" />
      <path d="M12 6.5V20" />
      <path d="M9 20h6" />
    </>
  ),
  dev: (
    <>
      <path d="m8 8-4.5 4L8 16" />
      <path d="m16 8 4.5 4L16 16" />
      <path d="m13.5 5-3 14" />
    </>
  ),
  calc: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <path d="M8.5 7.5h7" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01" strokeLinecap="round" />
    </>
  ),
};

interface Props {
  name: CategoryIconName;
  className?: string;
}

export default function CategoryIcon({ name, className = "h-5 w-5" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

/**
 * Single-accent icon tiles: every category uses the refined gold ramp.
 * One accent color, used consistently across the whole site.
 */
export const CATEGORY_GRADIENTS: Record<CategoryIconName, { from: string; to: string }> = {
  json:    { from: "#fcd34d", to: "#d97706" },
  image:   { from: "#fcd34d", to: "#d97706" },
  pdf:     { from: "#fcd34d", to: "#d97706" },
  video:   { from: "#fcd34d", to: "#d97706" },
  audio:   { from: "#fcd34d", to: "#d97706" },
  qr:      { from: "#fcd34d", to: "#d97706" },
  finance: { from: "#fcd34d", to: "#d97706" },
  text:    { from: "#fcd34d", to: "#d97706" },
  dev:     { from: "#fcd34d", to: "#d97706" },
  calc:    { from: "#fcd34d", to: "#d97706" },
};
