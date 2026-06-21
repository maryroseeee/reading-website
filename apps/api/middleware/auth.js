import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export function auth(req, res, next) {
  const { rc_token } = req.cookies;
  if (!rc_token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(rc_token, env.jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export function requireWritableSession(req, res, next) {
  if (req.user?.demo) {
    return res.status(403).json({ error: "Demo mode cannot change friends" });
  }

  next();
}
