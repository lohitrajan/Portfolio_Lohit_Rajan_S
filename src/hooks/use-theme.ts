import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "ls-theme";

/** Runs before hydration (see __root head) so the saved theme applies without a flash. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
