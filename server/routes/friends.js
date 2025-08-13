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

router.get('/requests', async (req, res) => {
    const current = await User.findOne({ googleId: req.user.uid })
      .populate('friendRequests', 'name username profilePicture');
    res.json(current?.friendRequests || []);
  });

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
  if (current.friends.some((id) => id.equals(friend._id))) {
    return res.status(400).json({ error: 'Already friends' });
  }
  if (friend.friendRequests.some((id) => id.equals(current._id))) {
    return res.status(400).json({ error: 'Request already sent' });
  }
  if (current.friendRequests.some((id) => id.equals(friend._id))) {
    return res.status(400).json({ error: 'User has already requested you' });
  }
  await User.updateOne(
    { _id: friend._id },
    { $addToSet: { friendRequests: current._id } }
  );
  res.json({ success: true });
});

router.post('/accept', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  const [current, friend] = await Promise.all([
    User.findOne({ googleId: req.user.uid }),
    User.findOne({ username }),
  ]);
  if (!current || !friend) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (!current.friendRequests.some((id) => id.equals(friend._id))) {
    return res.status(400).json({ error: 'No friend request from this user' });
  }
  await Promise.all([ 
    User.updateOne(
    { _id: current._id },
    { $pull: { friendRequests: friend._id }, $addToSet: { friends: friend._id } }
  ),
  User.updateOne(
    { _id: friend._id },
    { $addToSet: { friends: current._id } }
  ),
  ]);
  res.json({
    _id: friend._id,
    name: friend.name,
    username: friend.username,
    profilePicture: friend.profilePicture,
  });
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