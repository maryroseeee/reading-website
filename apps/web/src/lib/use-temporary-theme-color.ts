import { useEffect, useRef } from "react";

import { applyThemeColor } from "@/lib/theme-colors";

const THEME_VARIABLES = [
  "--background",
  "--foreground",
  "--main",
  "--main-foreground",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
];

export function useTemporaryThemeColor(themeColor?: string) {
  const previousThemeVariables = useRef<Record<string, string> | null>(null);

  useEffect(() => {
    if (!themeColor || typeof document === "undefined") return;

    if (!previousThemeVariables.current) {
      const rootStyle = document.documentElement.style;
      previousThemeVariables.current = Object.fromEntries(
        THEME_VARIABLES.map((name) => [name, rootStyle.getPropertyValue(name)]),
      );
    }

    applyThemeColor(themeColor, false);

    return () => {
      const previous = previousThemeVariables.current;
      if (!previous) return;

      Object.entries(previous).forEach(([name, value]) => {
        if (value) {
          document.documentElement.style.setProperty(name, value);
        } else {
          document.documentElement.style.removeProperty(name);
        }
      });
      previousThemeVariables.current = null;
    };
  }, [themeColor]);
}
