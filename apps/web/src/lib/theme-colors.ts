import type { CSSProperties } from "react";

export type ThemeColor = {
  name: string;
  main: string;
  darkMain: string;
  mainForeground?: string;
  darkMainForeground?: string;
  foreground?: string;
  darkForeground?: string;
  background: string;
  darkBackground: string;
  charts: [string, string, string, string, string];
  darkCharts: [string, string, string, string, string];
};

export const THEME_COLOR_STORAGE_KEY = "readingWebsiteThemeColor";

export const THEME_COLORS: ThemeColor[] = [
  {
    name: "red",
    main: "oklch(67.28% 0.2147 24.22)",
    darkMain: "oklch(70.49% 0.1869 22.23)",
    background: "oklch(93.3% 0.0339 17.77)",
    darkBackground: "oklch(24.95% 0.0491 20.19)",
    charts: ["#FF4D50", "#5294FF", "#FACC00", "#05E17A", "#7A83FF"],
    darkCharts: ["#FF6669", "#5294FF", "#E0B700", "#04C86D", "#7A83FF"],
  },
  {
    name: "orange",
    main: "oklch(72.27% 0.1894 50.19)",
    darkMain: "oklch(67.56% 0.1796 49.61)",
    background: "oklch(95.38% 0.0357 72.89)",
    darkBackground: "oklch(26.86% 0.0327 60.06)",
    charts: ["#FF7A05", "#0099FF", "#FFBF00", "#00D696", "#7A83FF"],
    darkCharts: ["#EB6D00", "#008AE5", "#E5AC00", "#00BD84", "#7A83FF"],
  },
  {
    name: "amber",
    main: "oklch(84.08% 0.1725 84.2)",
    darkMain: "oklch(77.7% 0.1593880864006951 84.38427202675717)",
    background: "oklch(96.22% 0.0569 95.61)",
    darkBackground: "oklch(28.91% 0.0359 90.09)",
    charts: ["#FFBF00", "#0099FF", "#FF7A05", "#00D696", "#7A83FF"],
    darkCharts: ["#E5AC00", "#008AE5", "#EB6D00", "#00BD84", "#7A83FF"],
  },
  {
    name: "yellow",
    main: "oklch(86.03% 0.176 92.36)",
    darkMain: "oklch(79.36% 0.1624 92.49)",
    background: "oklch(96.79% 0.0654 102.26)",
    darkBackground: "oklch(29.28% 0.0373 94.38)",
    charts: ["#FACC00", "#7A83FF", "#FF4D50", "#00D696", "#0099FF"],
    darkCharts: ["#E0B700", "#7A83FF", "#FF6669", "#00BD84", "#008AE5"],
  },
  {
    name: "lime",
    main: "oklch(83.29% 0.2331 132.51)",
    darkMain: "oklch(76.26% 0.21309 132.4002)",
    background: "oklch(95.37% 0.0549 125.19)",
    darkBackground: "oklch(23.1% 0.0346 126.75)",
    charts: ["#8AE500", "#0099FF", "#FF4D50", "#FACC00", "#7A83FF"],
    darkCharts: ["#7ACC00", "#008AE5", "#FF6669", "#E0B700", "#7A83FF"],
  },
  {
    name: "green",
    main: "oklch(79.76% 0.2044 153.08)",
    darkMain: "oklch(73.03% 0.1865 153.23)",
    background: "oklch(96.47% 0.0401 157.79)",
    darkBackground: "oklch(22.45% 0.0316 158.41)",
    charts: ["#00D696", "#FF7A05", "#0099FF", "#FFBF00", "#7A83FF"],
    darkCharts: ["#00BD84", "#EB6D00", "#008AE5", "#E5AC00", "#7A83FF"],
  },
  {
    name: "emerald",
    main: "oklch(77.54% 0.1681 162.78)",
    darkMain: "oklch(70.54% 0.1525 162.97)",
    background: "oklch(95.31% 0.0496 169.04)",
    darkBackground: "oklch(22.71% 0.0252 182.05)",
    charts: ["#00D696", "#7A83FF", "#FACC00", "#FF4D50", "#0099FF"],
    darkCharts: ["#00BD84", "#7A83FF", "#E0B700", "#FF6669", "#008AE5"],
  },
  {
    name: "teal",
    main: "oklch(78.57% 0.1422 180.36)",
    darkMain: "oklch(71.47% 0.129261 180.4742)",
    background: "oklch(95.08% 0.0481 184.07)",
    darkBackground: "oklch(22.65% 0.0236 198.49)",
    charts: ["#00D6BD", "#0099FF", "#7A83FF", "#FF4D50", "#FACC00"],
    darkCharts: ["#00BDA7", "#008AE5", "#7A83FF", "#FF6669", "#E0B700"],
  },
  {
    name: "cyan",
    main: "oklch(76.89% 0.139164 219.13)",
    darkMain: "oklch(64.37% 0.1162 218.75)",
    background: "oklch(94.61% 0.043 211.12)",
    darkBackground: "oklch(27.11% 0.0303 225.38)",
    charts: ["#00C8F0", "#FF7A05", "#7A83FF", "#FF4D50", "#FACC00"],
    darkCharts: ["#009DBD", "#EB6D00", "#7A83FF", "#FF6669", "#E0B700"],
  },
  {
    name: "sky",
    main: "oklch(66.9% 0.18368 248.8066)",
    darkMain: "oklch(61.9% 0.16907 248.5982)",
    background: "oklch(94.27% 0.0268 242.57)",
    darkBackground: "oklch(27.08% 0.0336 240.69)",
    charts: ["#0099FF", "#FF4D50", "#FACC00", "#05E17A", "#7A83FF"],
    darkCharts: ["#008AE5", "#FF6669", "#E0B700", "#04C86D", "#7A83FF"],
  },
  {
    name: "blue",
    main: "oklch(67.47% 0.1726 259.49)",
    darkMain: "oklch(67.47% 0.1726 259.49)",
    background: "oklch(93.46% 0.0305 255.11)",
    darkBackground: "oklch(29.23% 0.0626 270.49)",
    charts: ["#5294FF", "#FF4D50", "#FACC00", "#05E17A", "#7A83FF"],
    darkCharts: ["#5294FF", "#FF6669", "#E0B700", "#04C86D", "#7A83FF"],
  },
  {
    name: "indigo",
    main: "oklch(66.34% 0.1806 277.2)",
    darkMain: "oklch(66.34% 0.1806 277.2)",
    background: "oklch(92.13% 0.0388 282.36)",
    darkBackground: "oklch(26.58% 0.0737 283.96)",
    charts: ["#7A83FF", "#FACC00", "#FF4D50", "#00D696", "#0099FF"],
    darkCharts: ["#7A83FF", "#E0B700", "#FF6669", "#00BD84", "#008AE5"],
  },
  {
    name: "violet",
    main: "oklch(70.28% 0.1753 295.36)",
    darkMain: "oklch(70.28% 0.1753 295.36)",
    background: "oklch(93.88% 0.033 300.19)",
    darkBackground: "oklch(30.14% 0.0826 296.5)",
    charts: ["#A985FF", "#00D696", "#FACC00", "#FF4D50", "#0099FF"],
    darkCharts: ["#A985FF", "#00BD84", "#E0B700", "#FF6669", "#008AE5"],
  },
  {
    name: "purple",
    main: "oklch(71.9% 0.198 310.03)",
    darkMain: "oklch(67.34% 0.2314 309.13)",
    background: "oklch(94.11% 0.036556 308.0303)",
    darkBackground: "oklch(29.68% 0.0791 315.62)",
    charts: ["#CA7AFF", "#FACC00", "#00D696", "#FF7A05", "#0099FF"],
    darkCharts: ["#D494FF", "#E0B700", "#00BD84", "#EB6D00", "#008AE5"],
  },
  {
    name: "fuchsia",
    main: "oklch(73.43% 0.2332 321.41)",
    darkMain: "oklch(60.62% 0.291458 319.6391)",
    background: "oklch(94.79% 0.0407 320.6)",
    darkBackground: "oklch(26.29% 0.0683 327.3)",
    charts: ["#E96BFF", "#FACC00", "#FF7A05", "#FF4D50", "#7A83FF"],
    darkCharts: ["#C700EB", "#E0B700", "#EB6D00", "#FF6669", "#7A83FF"],
  },
  {
    name: "pink",
    main: "oklch(71.5% 0.197 354.23)",
    darkMain: "oklch(65.98% 0.2407 358.64)",
    background: "oklch(95.16% 0.0242 343.23)",
    darkBackground: "oklch(26.3% 0.054 358.23)",
    charts: ["#FC64AB", "#FACC00", "#FF7A05", "#FF4D50", "#7A83FF"],
    darkCharts: ["#FB3290", "#E0B700", "#EB6D00", "#FF6669", "#7A83FF"],
  },
  {
    name: "rose",
    main: "oklch(70.79% 0.1862 16.25)",
    darkMain: "oklch(67.58% 0.2135 18.63)",
    background: "oklch(93.37% 0.0339 12.05)",
    darkBackground: "oklch(25.15% 0.0495 7.54)",
    charts: ["#FF6678", "#7A83FF", "#FACC00", "#00D696", "#5294FF"],
    darkCharts: ["#FF4D61", "#7A83FF", "#E0B700", "#00BD84", "#5294FF"],
  },
  {
    name: "navy",
    main: "oklch(27.4% 0.1116 261.46)",
    darkMain: "oklch(39.1% 0.1372 258.76)",
    mainForeground: "oklch(100% 0 0)",
    darkMainForeground: "oklch(100% 0 0)",
    foreground: "oklch(27.4% 0.1116 261.46)",
    darkForeground: "oklch(94.27% 0.0268 242.57)",
    background: "oklch(94.27% 0.0268 242.57)",
    darkBackground: "oklch(18.53% 0.0438 263.68)",
    charts: ["#102A5C", "#FACC00", "#00D696", "#FF6678", "#7A83FF"],
    darkCharts: ["#2D5BBA", "#E0B700", "#00BD84", "#FF4D61", "#7A83FF"],
  },
  {
    name: "black",
    main: "oklch(0% 0 0)",
    darkMain: "oklch(100% 0 0)",
    mainForeground: "oklch(100% 0 0)",
    darkMainForeground: "oklch(0% 0 0)",
    foreground: "oklch(0% 0 0)",
    darkForeground: "oklch(100% 0 0)",
    background: "oklch(96% 0 0)",
    darkBackground: "oklch(16% 0 0)",
    charts: ["#000000", "#7A83FF", "#FACC00", "#00D696", "#FF4D50"],
    darkCharts: ["#FFFFFF", "#7A83FF", "#E0B700", "#00BD84", "#FF6669"],
  },
];

export function formatThemeColorName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getThemeColor(name: string | null | undefined) {
  return THEME_COLORS.find((color) => color.name === name) ?? THEME_COLORS.find((color) => color.name === "pink")!;
}

export function applyThemeColor(name: string, persist = true) {
  if (typeof document === "undefined") return;

  const color = getThemeColor(name);
  const root = document.documentElement;
  const isDark = root.classList.contains("dark");
  const charts = isDark ? color.darkCharts : color.charts;
  const mainForeground = isDark
    ? color.darkMainForeground ?? "oklch(0% 0 0)"
    : color.mainForeground ?? "oklch(0% 0 0)";
  const foreground = isDark
    ? color.darkForeground ?? "oklch(92.49% 0 0)"
    : color.foreground ?? "oklch(0% 0 0)";

  root.style.setProperty("--background", isDark ? color.darkBackground : color.background);
  root.style.setProperty("--foreground", foreground);
  root.style.setProperty("--main", isDark ? color.darkMain : color.main);
  root.style.setProperty("--main-foreground", mainForeground);
  charts.forEach((chartColor, index) => {
    root.style.setProperty(`--chart-${index + 1}`, chartColor);
  });

  if (persist) {
    localStorage.setItem(THEME_COLOR_STORAGE_KEY, color.name);
  }
}

export function getSavedThemeColorName() {
  if (typeof localStorage === "undefined") return "pink";
  return getThemeColor(localStorage.getItem(THEME_COLOR_STORAGE_KEY)).name;
}

export function applySavedThemeColor() {
  applyThemeColor(getSavedThemeColorName(), false);
}

export function getThemeColorCssVars(name: string | null | undefined) {
  const color = getThemeColor(name);
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const charts = isDark ? color.darkCharts : color.charts;
  const mainForeground = isDark
    ? color.darkMainForeground ?? "oklch(0% 0 0)"
    : color.mainForeground ?? "oklch(0% 0 0)";
  const foreground = isDark
    ? color.darkForeground ?? "oklch(92.49% 0 0)"
    : color.foreground ?? "oklch(0% 0 0)";

  return {
    "--background": isDark ? color.darkBackground : color.background,
    "--foreground": foreground,
    "--main": isDark ? color.darkMain : color.main,
    "--main-foreground": mainForeground,
    "--chart-1": charts[0],
    "--chart-2": charts[1],
    "--chart-3": charts[2],
    "--chart-4": charts[3],
    "--chart-5": charts[4],
  } as CSSProperties;
}
