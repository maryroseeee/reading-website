import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';


const router = Router();
const client = new OAuth2Client(env.googleClientId);
const isSecureClientOrigin = env.clientOrigin.startsWith('https://');
const authCookieOptions = {
  httpOnly: true,
  sameSite: isSecureClientOrigin ? 'none' : 'lax',
  secure: isSecureClientOrigin,
};

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

    const token = jwt.sign(
      { uid: payload.sub, email: payload.email },
      env.jwtSecret,
      { expiresIn: '7d' }
    );
    res
      .cookie('rc_token', token, authCookieOptions)
      .json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: 'Invalid token' });
  }
});


router.get('/me', async (req, res) => {
  const { rc_token } = req.cookies;
  if (!rc_token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const data = jwt.verify(rc_token, env.jwtSecret);
    const user = await User.findOne({ googleId: data.uid }).select(
      'email name username bio profilePicture themeColor'
    );
    res.json(user);
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

router.post('/logout', (req, res) => {
  res.clearCookie('rc_token', authCookieOptions).json({ ok: true });
});

export default router;
