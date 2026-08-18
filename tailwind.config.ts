import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark palette (unchanged — used directly in dark mode)
        ink: {
          950: "#0a0d13",
          900: "#0e1218",
          800: "#141a24",
          700: "#1c2432",
          600: "#2a3548",
          500: "#3c4a63",
        },
        mist: {
          400: "#5c6b85",
          300: "#8b96ab",
          200: "#b7c0d1",
          100: "#dde2ec",
          50:  "#f0f3f8",
        },
        // Light palette
        slate: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Accent — same in both modes
        amber: {
          400: "#f2b84b",
          500: "#e8a52f",
        },
        teal: {
          400: "#4fd1c5",
          500: "#38b8ac",
        },
        coral: {
          400: "#ef7d6f",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body:    ["var(--font-body)"],
        mono:    ["var(--font-mono)"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, var(--bg-page)), repeating-linear-gradient(0deg, rgba(139,150,171,0.06) 0px, rgba(139,150,171,0.06) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(139,150,171,0.06) 0px, rgba(139,150,171,0.06) 1px, transparent 1px, transparent 40px)",
      },
    },
  },
  plugins: [],
};
export default config;
