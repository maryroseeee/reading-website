import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import {
  deleteDemoSession,
  isDemoUserId,
  seedDemoAccount,
} from '../services/demo-data.js';


const router = Router();
const client = new OAuth2Client(env.googleClientId);
const isSecureClientOrigin = env.clientOrigin.startsWith('https://');
const authCookieOptions = {
  httpOnly: true,
  sameSite: isSecureClientOrigin ? 'none' : 'lax',
  secure: isSecureClientOrigin,
};

function signAuthToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });
}

function setAuthCookie(res, token) {
  return res.cookie('rc_token', token, authCookieOptions);
}

function isDemoSession(data) {
  return Boolean(data.demo || isDemoUserId(data.uid));
}

router.post('/google', async (req, res) => {
  const { id_token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: env.googleClientId,
    });
    const payload = ticket.getPayload();

    await User.findOneAndUpdate(
      { googleId: payload.sub },
      {
        $set: {
          email: payload.email,
        },
        $setOnInsert: {
          name: payload.name,
          profilePicture: payload.picture,
        },
      },
      { upsert: true }
    ); 

    const token = signAuthToken(
      { uid: payload.sub, email: payload.email },
    );
    setAuthCookie(res, token).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/demo', async (_req, res) => {
  try {
    const { sessionId, user: demoUser } = await seedDemoAccount();
    const token = signAuthToken({
      uid: demoUser.googleId,
      email: demoUser.email,
      demo: true,
      demoSessionId: sessionId,
    });

    setAuthCookie(res, token).json({ ok: true });
  } catch (error) {
    console.error('Unable to seed demo account', error);
    res.status(500).json({ error: 'Unable to start demo' });
  }
});


router.get('/me', async (req, res) => {
  const { rc_token } = req.cookies;
  if (!rc_token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const data = jwt.verify(rc_token, env.jwtSecret);
    const user = await User.findOne({ googleId: data.uid }).select(
      'email name username bio profilePicture themeColor'
    ).lean();
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ ...user, isDemo: isDemoSession(data) });
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

router.put('/me', async (req, res) => {
  const { rc_token } = req.cookies;
  if (!rc_token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const data = jwt.verify(rc_token, env.jwtSecret);
    const { name, username, bio, profilePicture } = req.body;
    const updated = await User.findOneAndUpdate(
      { googleId: data.uid },
      { name, username, bio, profilePicture },
      { new: true, runValidators: true }
    ).select('email name username bio profilePicture themeColor');
    res.json(updated);
  } catch (e) {
    if (e.code === 11000 && e.keyPattern?.username) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(400).json({ error: 'Unable to update profile' });
  }
});

router.put('/me/theme-color', async (req, res) => {
  const { rc_token } = req.cookies;
  if (!rc_token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const data = jwt.verify(rc_token, env.jwtSecret);
    const { themeColor } = req.body;
    const updated = await User.findOneAndUpdate(
      { googleId: data.uid },
      { themeColor },
      { new: true, runValidators: true }
    ).select('email name username bio profilePicture themeColor');
    res.json(updated);
  } catch {
    res.status(400).json({ error: 'Unable to update theme color' });
  }
});

router.post('/logout', async (req, res) => {
  const { rc_token } = req.cookies;

  if (rc_token) {
    try {
      const data = jwt.verify(rc_token, env.jwtSecret);
      if (isDemoSession(data)) {
        await deleteDemoSession({
          sessionId: data.demoSessionId,
          uid: data.uid,
        });
      }
    } catch {
      // Clearing the cookie is still the correct logout behavior.
    }
  }

  res.clearCookie('rc_token', authCookieOptions).json({ ok: true });
});

export default router;
