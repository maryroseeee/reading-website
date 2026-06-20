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
  completedDate: Date,
  shelfAddedAt: Date,
  currentlyReading: { type: Boolean, default: false },
  wantToRead: { type: Boolean, default: false },
  currentPage: { type: Number, default: 0 },
}, { timestamps: true });

bookSchema.index({ userId: 1, googleId: 1 }, { unique: true });

export default mongoose.model('Book', bookSchema);
