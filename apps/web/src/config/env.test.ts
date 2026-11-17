import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("API routing", () => {
  it("keeps production authentication on the website origin despite a deployed API URL override", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_API_URL", "https://reading-website.onrender.com/api");

    const { env } = await import("./env");

    expect(env.apiUrl).toBe("/api");
  });

  it("preserves a custom API URL in local development", async () => {
    vi.stubEnv("PROD", false);
    vi.stubEnv("VITE_API_URL", "http://localhost:4500/api");

    const { env } = await import("./env");

    expect(env.apiUrl).toBe("http://localhost:4500/api");
  });

  it("uses the local Express API by default in development", async () => {
    vi.stubEnv("PROD", false);
    vi.stubEnv("VITE_API_URL", undefined);

    const { env } = await import("./env");

    expect(env.apiUrl).toBe("http://localhost:4000/api");
  });
});
