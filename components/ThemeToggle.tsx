"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("pickupdxb-theme") as Theme | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const nextTheme = saved === "dark" || saved === "light" ? saved : preferred;
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("pickupdxb-theme", nextTheme);
  }

  return (
    <button
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
    >
      <span aria-hidden="true" className="theme-dot" />
      {theme === "light" ? "Light" : "Dark"}
    </button>
  );
}
