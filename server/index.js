import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  const { id_token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();        

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

app.listen(4000, () => console.log('API listening on :4000'));
