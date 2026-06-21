import { Router } from "express";
import Book from "../models/Book.js";
import User from "../models/User.js";
import { auth, requireWritableSession } from "../middleware/auth.js";

const router = Router();
router.use(auth);

router.get("/requests", async (req, res) => {
  const current = await User.findOne({ googleId: req.user.uid }).populate(
    "friendRequests",
    "name username profilePicture"
  );
  res.json(current?.friendRequests || []);
});

router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json([]);
  }
  const current = await User.findOne({
    googleId: req.user.uid,
  }).select("friendRequests");
  const regex = new RegExp(q, "i");
  const users = await User.find({
    _id: { $ne: current._id },
    $or: [{ username: regex }, { name: regex }],
    friends: { $ne: current._id },
  })
    .select("name username profilePicture friendRequests")
    .limit(5)
    .lean();

  const results = users.map((u) => {
    let status = "none";
    if (u.friendRequests.some((id) => id.equals(current._id))) {
      status = "sent";
    } else if (current.friendRequests.some((id) => id.equals(u._id))) {
      status = "incoming";
    }
    return {
      _id: u._id,
      name: u.name,
      username: u.username,
      profilePicture: u.profilePicture,
      status,
    };
  });

  res.json(results);
});

router.get("/", async (req, res) => {
  const current = await User.findOne({ googleId: req.user.uid }).populate(
    "friends",
    "name username profilePicture googleId themeColor"
    );
    if (!current?.friends) return res.json([]);
  
    const start2025 = new Date("2025-01-01");
    const start2026 = new Date("2026-01-01");
    const currentYear = new Date().getFullYear();
    const startCurrentYear = new Date(`${currentYear}-01-01`);
    const startNextYear = new Date(`${currentYear + 1}-01-01`);
  
    const friends = await Promise.all(
      current.friends.map(async (f) => {
        const [points2025Agg, booksThisYear] = await Promise.all([
          Book.aggregate([
            {
              $match: {
                userId: f.googleId,
                completedDate: { $gte: start2025, $lt: start2026 },
              },
            },
            { $group: { _id: null, total: { $sum: "$points" } } },
          ]),
          Book.countDocuments({
            userId: f.googleId,
            completedDate: { $gte: startCurrentYear, $lt: startNextYear },
          }),
        ]);
  
        return {
          _id: f._id,
          name: f.name,
          username: f.username,
          profilePicture: f.profilePicture,
          themeColor: f.themeColor,
          points2025: points2025Agg[0]?.total || 0,
          booksThisYear,
        };
      })
  ); 
  res.json(friends);
});

router.get("/:username/books", async (req, res) => {
  const { username } = req.params;
  const current = await User.findOne({ googleId: req.user.uid });
  const friendQuery = username.match(/^[a-f\d]{24}$/i)
    ? { $or: [{ username }, { _id: username }] }
    : { username };
  const friend = await User.findOne(friendQuery).select(
    "name username profilePicture googleId themeColor",
  );

  if (!current || !friend) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!current.friends?.some((id) => id.equals(friend._id))) {
    return res.status(403).json({ error: "You can only compare with friends" });
  }

  const books = await Book.find({ userId: friend.googleId });
  res.json({
    friend: {
      _id: friend._id,
      name: friend.name,
      username: friend.username,
      profilePicture: friend.profilePicture,
      themeColor: friend.themeColor,
    },
    books,
  });
});

router.get("/:username/friends", async (req, res) => {
  const { username } = req.params;
  const current = await User.findOne({ googleId: req.user.uid });
  const friendQuery = username.match(/^[a-f\d]{24}$/i)
    ? { $or: [{ username }, { _id: username }] }
    : { username };
  const friend = await User.findOne(friendQuery).populate(
    "friends",
    "name username profilePicture",
  );

  if (!current || !friend) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!current.friends?.some((id) => id.equals(friend._id))) {
    return res.status(403).json({ error: "You can only view friends of friends" });
  }

  res.json(friend.friends || []);
});

router.post("/", requireWritableSession, async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });
  const [current, friend] = await Promise.all([
    User.findOne({ googleId: req.user.uid }),
    User.findOne({ username }),
  ]);
  if (!current || !friend) {
    return res.status(404).json({ error: "User not found" });
  }
  if (!current.username) {
    return res.status(400).json({ error: "Set your username before sending friend requests" });
  }
  if (current._id.equals(friend._id)) {
    return res.status(400).json({ error: "Cannot add yourself" });
  }
  if (current.friends.some((id) => id.equals(friend._id))) {
    return res.status(400).json({ error: "Already friends" });
  }
  if (friend.friendRequests.some((id) => id.equals(current._id))) {
    return res.status(400).json({ error: "Request already sent" });
  }
  if (current.friendRequests.some((id) => id.equals(friend._id))) {
    return res.status(400).json({ error: "User has already requested you" });
  }
  await User.updateOne(
    { _id: friend._id },
    { $addToSet: { friendRequests: current._id } }
  );
  res.json({ success: true });
});

router.post("/accept", requireWritableSession, async (req, res) => {
  const { username, id } = req.body;
  if (!username && !id) {
    return res.status(400).json({ error: "User identifier required" });
  }
  const [current, friend] = await Promise.all([
    User.findOne({ googleId: req.user.uid }),
    username ? User.findOne({ username }) : User.findById(id),
  ]);
  if (!current || !friend) {
    return res.status(404).json({ error: "User not found" });
  }
  if (!current.friendRequests.some((id) => id.equals(friend._id))) {
    return res.status(400).json({ error: "No friend request from this user" });
  }
  await Promise.all([
    User.updateOne(
      { _id: current._id },
      {
        $pull: { friendRequests: friend._id },
        $addToSet: { friends: friend._id },
      }
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

router.post("/reject", requireWritableSession, async (req, res) => {
  const { username, id } = req.body;
  if (!username && !id) {
    return res.status(400).json({ error: "User identifier required" });
  }
  const [current, friend] = await Promise.all([
    User.findOne({ googleId: req.user.uid }),
    username ? User.findOne({ username }) : User.findById(id),
  ]);
  if (!current || !friend) {
    return res.status(404).json({ error: "User not found" });
  }
  await User.updateOne(
    { _id: current._id },
    { $pull: { friendRequests: friend._id } }
  );
  res.json({ success: true });
});

router.delete("/:username", requireWritableSession, async (req, res) => {
  const { username } = req.params;
  const [current, friend] = await Promise.all([
    User.findOne({ googleId: req.user.uid }),
    User.findOne({ username }),
  ]);
  if (!current || !friend) {
    return res.status(404).json({ error: "User not found" });
  }
  await Promise.all([
    User.updateOne({ _id: current._id }, { $pull: { friends: friend._id } }),
    User.updateOne({ _id: friend._id }, { $pull: { friends: current._id } }),
  ]);
  res.json({ success: true });
});

export default router;
