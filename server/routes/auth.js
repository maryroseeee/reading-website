import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { id_token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    await User.findOneAndUpdate(
      { googleId: payload.sub },
      { email: payload.email },
      { upsert: true }
    );

    const token = jwt.sign(
      { uid: payload.sub, email: payload.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res
      .cookie('rc_token', token, { httpOnly: true, sameSite: 'lax' })
      .json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.get('/me', (req, res) => {
  const { rc_token } = req.cookies;
  if (!rc_token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const data = jwt.verify(rc_token, process.env.JWT_SECRET);
    res.json({ email: data.email });
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;