import { Router } from 'express';
import Book from '../models/Book.js';
import { auth } from '../middleware/auth.js';
import { env } from '../config/env.js';

const router = Router();

function normalize(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function tokenize(str) {
  return normalize(str.toLowerCase()).split(/\s+/).filter(Boolean);
}

async function fetchGoogleBooks(query) {
  const url = new URL('https://www.googleapis.com/books/v1/volumes');
  url.searchParams.set('q', query);
  url.searchParams.set('maxResults', '40');
  if (env.googleBooksApiKey) {
    url.searchParams.set('key', env.googleBooksApiKey);
  }

  const resp = await fetch(url);
  const data = await resp.json();
  if (!resp.ok) {
    throw { status: resp.status, message: data.error?.message };
  }
  return data.items || [];
}

function matchesQuery(info, queryTerms) {
  const titleTerms = tokenize(info.title || '');
  const authorTerms = tokenize((info.authors || []).join(' '));
  const allTerms = [...titleTerms, ...authorTerms];

  return queryTerms.every((term) =>
    allTerms.some((candidate) => candidate.startsWith(term) || candidate.includes(term)),
  );
}

router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const query = String(q).trim();
  const queryTerms = tokenize(query);
  const completePrefix = queryTerms.slice(0, -1).join(' ');
  const googleQueries = [
    `intitle:${query}`,
    query,
    ...(completePrefix ? [`intitle:${completePrefix}`, completePrefix] : []),
  ];

  try {
    const googleResults = await Promise.all(googleQueries.map(fetchGoogleBooks));
    const uniqueItems = Array.from(
      new Map(googleResults.flat().map((item) => [item.id, item])).values(),
    );
    const matchedItems = uniqueItems.filter((item) => {
      const info = item.volumeInfo || {};
      return matchesQuery(info, queryTerms);
    });
    const sourceItems = matchedItems.length > 0 ? matchedItems : uniqueItems;
    const items = sourceItems
      .filter((item) => {
        const info = item.volumeInfo || {};
        return info.title;
      })
    .sort(
      (a, b) =>
        (b.volumeInfo?.ratingsCount || 0) -
        (a.volumeInfo?.ratingsCount || 0)
    )
    .map((item) => {
    const info = item.volumeInfo;
    const publishedYear = info.publishedDate
      ? parseInt(info.publishedDate.split('-')[0], 10)
      : undefined;
      const pageCount = info.pageCount;
    return {
      googleId: item.id,
      title: info.title,
      authors: info.authors || [],
      pageCount,
      publishedYear,
      categories: info.categories || [],
      thumbnail: info.imageLinks?.thumbnail,
      points: pageCount ? 1 + (pageCount / 100) : 0,
    };
  });
  res.json(items);
  } catch (error) {
    res.status(error.status || 502).json({
      error: error.message || 'Unable to reach Google Books',
    });
  }
});


router.use(auth);

router.get('/', async (req, res) => {
  const books = await Book.find({ userId: req.user.uid });
  res.json(books);
});

router.delete('/:id', async (req, res) => {
  await Book.deleteOne({ _id: req.params.id, userId: req.user.uid });
  res.json({ success: true });
});

router.post('/', async (req, res) => {
  const data = { ...req.body, userId: req.user.uid };
  const pageCount = req.body.pageCount;
  data.points = pageCount ? pageCount / 100 : 0;
  data.currentlyReading = Boolean(req.body.currentlyReading);
  data.wantToRead = Boolean(req.body.wantToRead);
  data.currentPage = Math.max(0, Number(req.body.currentPage || 0));
  if (data.currentlyReading || data.wantToRead || !req.body.completedDate) {
    delete data.completedDate;
  }
  if (data.completedDate) {
    data.currentlyReading = false;
    data.wantToRead = false;
  }
  if (data.currentlyReading) {
    data.wantToRead = false;
  }
  const unset = data.completedDate ? {} : { completedDate: "" };
  const book = await Book.findOneAndUpdate(
    { userId: req.user.uid, googleId: req.body.googleId },
    Object.keys(unset).length
      ? { $set: data, $unset: unset }
      : { $set: data },
    { upsert: true, new: true }
  );
  res.json(book);
});

router.put('/:id', async (req, res) => {
  const data = { ...req.body, userId: req.user.uid };
  const pageCount = req.body.pageCount;
  data.points = pageCount ? pageCount / 100 : 0;
  data.currentlyReading = Boolean(req.body.currentlyReading);
  data.wantToRead = Boolean(req.body.wantToRead);
  data.currentPage = Math.max(0, Number(req.body.currentPage || 0));
  if (data.currentlyReading || data.wantToRead || !req.body.completedDate) {
    delete data.completedDate;
  }
  if (data.completedDate) {
    data.currentlyReading = false;
    data.wantToRead = false;
  }
  if (data.currentlyReading) {
    data.wantToRead = false;
  }
  const unset = data.completedDate ? {} : { completedDate: "" };
  const book = await Book.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.uid },
    Object.keys(unset).length
      ? { $set: data, $unset: unset }
      : { $set: data },
    { new: true }
  );
  res.json(book);
});

export default router;
