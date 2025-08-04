import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  googleId: { type: String, required: true },
  title: String,
  authors: [String],
  cover: String,
  publishedYear: Number,
  pageCount: Number,
  categories: [String],
});

export default mongoose.model('Book', bookSchema);
