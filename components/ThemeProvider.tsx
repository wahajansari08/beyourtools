"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolved: "dark" | "light";
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolved: "dark",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"dark" | "light">("dark");

  // On mount: read saved preference or default to system
  useEffect(() => {
    const saved = localStorage.getItem("byt-theme") as Theme | null;
    if (saved === "dark" || saved === "light" || saved === "system") {
      setThemeState(saved);
    }
  }, []);

  // Apply class to <html> whenever theme or system preference changes
  useEffect(() => {
    const root = document.documentElement;

    function apply(t: Theme) {
      let actual: "dark" | "light";
      if (t === "system") {
        actual = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } else {
        actual = t;
      }
      root.classList.remove("dark", "light");
      root.classList.add(actual);
      setResolved(actual);
    }

    apply(theme);

    // Watch system changes when in "system" mode
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => { if (theme === "system") apply("system"); };
    mq.addEventListener("change", onSystem);
    return () => mq.removeEventListener("change", onSystem);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("byt-theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
