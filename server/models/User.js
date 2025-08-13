import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: String,
  name: String,
  username: { type: String, unique: true, sparse: true },
  bio: String,
  profilePicture: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('User', userSchema);
