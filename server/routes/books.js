import { Router } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Book from '../models/Book.js';

const router = Router();

function authenticate(req, res, next) {
  const { rc_token } = req.cookies;
  if (!rc_token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(rc_token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

router.get('/', authenticate, async (req, res) => {
  const books = await Book.find({ userId: req.user.uid });
  res.json(books);
});

router.post('/', authenticate, async (req, res) => {
  const { bookId } = req.body;
  if (!bookId) return res.status(400).json({ error: 'bookId required' });
  try {
    const { data } = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
    const info = data.volumeInfo || {};
    const book = await Book.create({
      userId: req.user.uid,
      googleId: bookId,
      title: info.title || '',
      authors: info.authors || [],
      cover: info.imageLinks?.thumbnail || '',
      publishedYear: info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : undefined,
      pageCount: info.pageCount,
      categories: info.categories || [],
    });
    res.json(book);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

export default router;
