import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.JWT_SECRET = "test-secret";

const { deleteDemoSession, isDemoUserId, seedDemoAccount, userModel } = vi.hoisted(() => ({
  deleteDemoSession: vi.fn(),
  isDemoUserId: vi.fn((userId) =>
    String(userId || "").startsWith("demo-recruiter-reader:"),
  ),
  seedDemoAccount: vi.fn(),
  userModel: {
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock("../models/User.js", () => ({
  default: userModel,
}));

vi.mock("../services/demo-data.js", () => ({
  deleteDemoSession,
  isDemoUserId,
  seedDemoAccount,
}));

let app;

function authCookie(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return `rc_token=${token}`;
}

function mockUserLookup(user) {
  const lean = vi.fn().mockResolvedValue(user);
  const select = vi.fn().mockReturnValue({ lean });
  userModel.findOne.mockReturnValue({ select });
  return { lean, select };
}

beforeAll(async () => {
  const { createApp } = await import("../app.js");
  app = createApp();
});

beforeEach(() => {
  vi.clearAllMocks();
  seedDemoAccount.mockResolvedValue({
    sessionId: "session-1",
    user: {
      googleId: "demo-recruiter-reader:session-1",
      email: "demo.reader@reading-tracker.local",
    },
  });
});

describe("auth API", () => {
  it("starts a recruiter demo session", async () => {
    const response = await request(app).post("/api/auth/demo");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(seedDemoAccount).toHaveBeenCalledOnce();

    const cookie = response.headers["set-cookie"][0];
    const token = cookie.match(/rc_token=([^;]+)/)?.[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    expect(payload).toEqual(
      expect.objectContaining({
        uid: "demo-recruiter-reader:session-1",
        email: "demo.reader@reading-tracker.local",
        demo: true,
        demoSessionId: "session-1",
      }),
    );
  });

  it("marks the current user as demo when the session is demo-only", async () => {
    mockUserLookup({
      email: "demo.reader@reading-tracker.local",
      name: "Maya Hart",
      username: "recruiter_demo",
      themeColor: "pink",
    });

    const response = await request(app)
      .get("/api/auth/me")
      .set(
        "Cookie",
        authCookie({
          uid: "demo-recruiter-reader:session-1",
          email: "demo.reader@reading-tracker.local",
          demo: true,
          demoSessionId: "session-1",
        }),
      );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        email: "demo.reader@reading-tracker.local",
        username: "recruiter_demo",
        isDemo: true,
      }),
    );
  });

  it("deletes a temporary demo session on logout", async () => {
    const response = await request(app)
      .post("/api/auth/logout")
      .set(
        "Cookie",
        authCookie({
          uid: "demo-recruiter-reader:session-1",
          email: "demo.reader@reading-tracker.local",
          demo: true,
          demoSessionId: "session-1",
        }),
      );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(deleteDemoSession).toHaveBeenCalledWith({
      sessionId: "session-1",
      uid: "demo-recruiter-reader:session-1",
    });
  });
});
