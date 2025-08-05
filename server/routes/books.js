import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Book from '../models/Book.js';

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

router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const url = new URL('https://www.googleapis.com/books/v1/volumes');
  url.searchParams.set('q', q);
  url.searchParams.set('maxResults', '10');
  if (process.env.GOOGLE_BOOKS_API_KEY) {
    url.searchParams.set('key', process.env.GOOGLE_BOOKS_API_KEY);
  }
  const resp = await fetch(url);
  const data = await resp.json();
  const items = (data.items || []).map((item) => {
    const info = item.volumeInfo;
    const publishedYear = info.publishedDate
      ? parseInt(info.publishedDate.split('-')[0], 10)
      : undefined;
    return {
      googleId: item.id,
      title: info.title,
      authors: info.authors || [],
      pageCount: info.pageCount,
      publishedYear,
      categories: info.categories || [],
      thumbnail: info.imageLinks?.thumbnail,
    };
  });
  res.json(items);
});

router.use(auth);

router.get('/', async (req, res) => {
  const books = await Book.find({ userId: req.user.uid });
  res.json(books);
});

router.post('/', async (req, res) => {
  const book = await Book.findOneAndUpdate(
    { userId: req.user.uid, googleId: req.body.googleId },
    { ...req.body, userId: req.user.uid },
    { upsert: true, new: true }
  );
  res.json(book);
});

export default router;