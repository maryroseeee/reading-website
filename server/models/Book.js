import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  googleId: { type: String, required: true },
  title: String,
  authors: [String],
  pageCount: Number,
  publishedYear: Number,
  categories: [String],
  thumbnail: String,
  points: Number,
});

bookSchema.index({ userId: 1, googleId: 1 }, { unique: true });

export default mongoose.model('Book', bookSchema);