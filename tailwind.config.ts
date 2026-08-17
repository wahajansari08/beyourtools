import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
          50: "#f0f3f8",
        },
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
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, rgba(10,13,19,1)), repeating-linear-gradient(0deg, rgba(139,150,171,0.06) 0px, rgba(139,150,171,0.06) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(139,150,171,0.06) 0px, rgba(139,150,171,0.06) 1px, transparent 1px, transparent 40px)",
      },
    },
  },
  plugins: [],
};
export default config;
