import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

function auth(req, res, next) {
  const { rc_token } = req.cookies;
  if (!rc_token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(rc_token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

router.use(auth);

router.get('/', async (req, res) => {
  const current = await User.findOne({ googleId: req.user.uid })
    .populate('friends', 'name username profilePicture');
  res.json(current?.friends || []);
});

router.post('/', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  const [current, friend] = await Promise.all([
    User.findOne({ googleId: req.user.uid }),
    User.findOne({ username }),
  ]);
  if (!current || !friend) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (current._id.equals(friend._id)) {
    return res.status(400).json({ error: 'Cannot add yourself' });
  }
  await Promise.all([
    User.updateOne({ _id: current._id }, { $addToSet: { friends: friend._id } }),
    User.updateOne({ _id: friend._id }, { $addToSet: { friends: current._id } }),
  ]);
  res.json({ success: true });
});

router.delete('/:username', async (req, res) => {
  const { username } = req.params;
  const [current, friend] = await Promise.all([
    User.findOne({ googleId: req.user.uid }),
    User.findOne({ username }),
  ]);
  if (!current || !friend) {
    return res.status(404).json({ error: 'User not found' });
  }
  await Promise.all([
    User.updateOne({ _id: current._id }, { $pull: { friends: friend._id } }),
    User.updateOne({ _id: friend._id }, { $pull: { friends: current._id } }),
  ]);
  res.json({ success: true });
});

export default router;