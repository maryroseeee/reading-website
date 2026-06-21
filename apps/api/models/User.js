import mongoose from 'mongoose';

const themeColorNames = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'navy',
  'black',
];

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: String,
  name: String,
  username: { type: String, unique: true, sparse: true },
  bio: String,
  profilePicture: String,
  themeColor: { type: String, enum: themeColorNames, default: 'pink' },
  demoSessionId: String,
  demoExpiresAt: Date,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('User', userSchema);
