import { useState, useEffect } from "react";

/**
 * Custom hook to manage application color theme (light/dark mode).
 * Persists selection in LocalStorage and applies theme to the document.
 * 
 * @returns {[string, () => void]} Current theme and toggle function.
 */
export default function useDarkMode() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    // Fallback to system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return [theme, toggleTheme];
}
