import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.JWT_SECRET = "test-secret";

const { userModel } = vi.hoisted(() => ({
  userModel: {
    findOne: vi.fn(),
    find: vi.fn(),
  },
}));

vi.mock("../models/User.js", () => ({ default: userModel }));

let app;
let extendedQueryApp;
let current;
let lookupSelect;
let searchSelect;
let limit;
let lean;

function authCookie() {
  return `rc_token=${jwt.sign({ uid: "user-1" }, process.env.JWT_SECRET)}`;
}

function search(query, targetApp = app) {
  return request(targetApp)
    .get("/api/friends/search")
    .query(query)
    .set("Cookie", authCookie());
}

beforeAll(async () => {
  const { createApp } = await import("../app.js");
  app = createApp();
  extendedQueryApp = createApp();
  extendedQueryApp.set("query parser", "extended");
});

beforeEach(() => {
  vi.resetAllMocks();
  current = { _id: new Types.ObjectId(), friendRequests: [] };
  lookupSelect = vi.fn().mockResolvedValue(current);
  userModel.findOne.mockReturnValue({ select: lookupSelect });
  lean = vi.fn().mockResolvedValue([]);
  limit = vi.fn().mockReturnValue({ lean });
  searchSelect = vi.fn().mockReturnValue({ limit });
  userModel.find.mockReturnValue({ select: searchSelect });
});

describe("friends search API", () => {
  it("requires authentication", async () => {
    const response = await request(app).get("/api/friends/search?q=reader");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
    expect(userModel.findOne).not.toHaveBeenCalled();
    expect(userModel.find).not.toHaveBeenCalled();
  });

  it.each([
    ["MaYa", "maya_reader", "Maya Hart"],
    ["reader", "avid_READER_123", "A Reader's Life"],
    ["123", "reader123", "Reader 123"],
    ["true", "true_reader", "True Reader"],
    ["  MaYa \t", "maya_reader", "Maya Hart"],
  ])("searches names and usernames with %j", async (q, username, name) => {
    const response = await search({ q });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    const { $or } = userModel.find.mock.calls[0][0];
    expect($or).toEqual([
      { username: expect.any(RegExp) },
      { name: expect.any(RegExp) },
    ]);
    expect($or[0].username.flags).toBe("i");
    expect($or[0].username.test(username)).toBe(true);
    expect($or[1].name.test(name)).toBe(true);
    expect($or[0].username.test("unrelated")).toBe(false);
  });

  it.each([
    ".", "[", "*", "(", "]", ")", "+", "?", "^", "$", "{", "}", "|", "\\",
    "a.b", "(a+)+$", ".*", "reader[1]",
  ])("treats %j as literal text", async (q) => {
    const response = await search({ q });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    const { $or } = userModel.find.mock.calls[0][0];
    for (const regex of [$or[0].username, $or[1].name]) {
      expect(regex.test(`prefix${q.toUpperCase()}suffix`)).toBe(true);
      expect(regex.test("unrelated reader aXb aaaaa")).toBe(false);
    }
  });

  it.each([{}, { q: "" }, { q: "   " }, { q: "\t\n\r " }])(
    "returns no results without database calls for a blank search: %j",
    async (query) => {
      const response = await search(query);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(userModel.findOne).not.toHaveBeenCalled();
      expect(userModel.find).not.toHaveBeenCalled();
    },
  );

  it("accepts a query at the 100-character limit", async () => {
    const q = "*".repeat(100);
    const response = await search({ q });

    expect(response.status).toBe(200);
    const regex = userModel.find.mock.calls[0][0].$or[0].username;
    expect(regex.test(`prefix${q}suffix`)).toBe(true);
    expect(regex.test("unrelated")).toBe(false);
  });

  it.each(["a".repeat(101), " ".repeat(101), ` ${"a".repeat(100)}`])(
    "rejects oversized queries before trimming or database calls: %j",
    async (q) => {
      const response = await search({ q });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Search query must be at most 100 characters",
      });
      expect(userModel.findOne).not.toHaveBeenCalled();
      expect(userModel.find).not.toHaveBeenCalled();
    },
  );

  it("rejects repeated query parameters with the application's default parser", async () => {
    const response = await search("q=maya&q=reader");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Search query must be a string" });
    expect(userModel.findOne).not.toHaveBeenCalled();
    expect(userModel.find).not.toHaveBeenCalled();
  });

  it.each(["\0", "reader\0name"])(
    "rejects null bytes before MongoDB regex serialization: %j",
    async (q) => {
      const response = await search({ q });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Search query must not contain null bytes",
      });
      expect(userModel.findOne).not.toHaveBeenCalled();
      expect(userModel.find).not.toHaveBeenCalled();
    },
  );

  it.each(["q[]=maya", "q[0]=maya", "q[name]=maya", "q[$ne]=maya"])(
    "rejects array and object queries when parsed as structured values: %s",
    async (query) => {
      const response = await search(query, extendedQueryApp);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Search query must be a string" });
      expect(userModel.findOne).not.toHaveBeenCalled();
      expect(userModel.find).not.toHaveBeenCalled();
    },
  );

  it("returns 404 when the authenticated user no longer exists", async () => {
    lookupSelect.mockResolvedValue(null);

    const response = await search({ q: "reader" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found" });
    expect(userModel.find).not.toHaveBeenCalled();
  });

  it("preserves friend exclusions, the result limit, statuses, and response fields", async () => {
    const users = ["none", "sent", "incoming", "both"].map((status) => ({
      _id: new Types.ObjectId(),
      name: `${status} Reader`,
      username: `${status}_reader`,
      profilePicture: `${status}.png`,
      friendRequests: ["sent", "both"].includes(status) ? [current._id] : [],
    }));
    current.friendRequests = [users[2]._id, users[3]._id];
    lean.mockResolvedValue(users);

    const response = await search({ q: "reader" });

    expect(response.status).toBe(200);
    expect(userModel.findOne).toHaveBeenCalledWith({ googleId: "user-1" });
    expect(lookupSelect).toHaveBeenCalledWith("friendRequests");
    expect(userModel.find).toHaveBeenCalledWith({
      _id: { $ne: current._id },
      $or: [{ username: /reader/i }, { name: /reader/i }],
      friends: { $ne: current._id },
    });
    expect(searchSelect).toHaveBeenCalledWith(
      "name username profilePicture friendRequests",
    );
    expect(limit).toHaveBeenCalledWith(5);
    expect(lean).toHaveBeenCalledOnce();
    expect(response.body).toEqual(
      users.map((user, index) => ({
        _id: user._id.toString(),
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture,
        status: ["none", "sent", "incoming", "sent"][index],
      })),
    );
  });
});
