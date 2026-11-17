import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { applyThemeColor } from "./theme-colors";
import { useTemporaryThemeColor } from "./use-temporary-theme-color";

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("style");
  document.documentElement.classList.remove("dark");
});

describe.each([false, true])("theme surfaces with dark mode %s", (isDark) => {
  it("resets input surfaces when switching from Burgundy to Navy", () => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    applyThemeColor("navy", false);
    const navySurface = root.style.getPropertyValue("--secondary-background");

    applyThemeColor("burgundy", false);
    expect(root.style.getPropertyValue("--secondary-background")).not.toBe(navySurface);

    applyThemeColor("navy", false);
    expect(root.style.getPropertyValue("--secondary-background")).toBe(navySurface);
  });

  it("restores Burgundy input surfaces after leaving a friend's profile", () => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    applyThemeColor("burgundy", false);
    const originalStyle = root.getAttribute("style");

    const { unmount } = renderHook(() => useTemporaryThemeColor("navy"));
    expect(root.getAttribute("style")).not.toBe(originalStyle);

    unmount();
    expect(root.getAttribute("style")).toBe(originalStyle);
  });
});
