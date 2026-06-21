import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.JWT_SECRET = 'test-secret';

const { bookModel } = vi.hoisted(() => ({
  bookModel: {
    deleteOne: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock('../models/Book.js', () => ({
  default: bookModel,
}));

let app;

function authCookie(payload = { uid: 'user-1' }) {
  const token = jwt.sign(
    typeof payload === 'string' ? { uid: payload } : payload,
    process.env.JWT_SECRET,
  );
  return `rc_token=${token}`;
}

beforeAll(async () => {
  const { createApp } = await import('../app.js');
  app = createApp();
});

beforeEach(() => {
  vi.clearAllMocks();
  bookModel.findOne.mockResolvedValue(null);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('books API', () => {
  it('rejects unauthenticated book requests', async () => {
    const response = await request(app).get('/api/books');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });

  it('returns books for the signed-in user', async () => {
    const savedBooks = [
      {
        _id: 'book-1',
        title: 'Pride and Prejudice',
        userId: 'user-1',
      },
    ];
    bookModel.find.mockResolvedValue(savedBooks);

    const response = await request(app)
      .get('/api/books')
      .set('Cookie', authCookie());

    expect(response.status).toBe(200);
    expect(response.body).toEqual(savedBooks);
    expect(bookModel.find).toHaveBeenCalledWith({ userId: 'user-1' });
  });

  it('allows demo write requests against the temporary demo user', async () => {
    const savedBook = {
      _id: 'book-1',
      googleId: 'google-1',
      title: 'Jane Eyre',
      userId: 'demo-recruiter-reader:session-1',
    };
    bookModel.findOneAndUpdate.mockResolvedValue(savedBook);

    const response = await request(app)
      .post('/api/books')
      .set(
        'Cookie',
        authCookie({
          uid: 'demo-recruiter-reader:session-1',
          demo: true,
          demoSessionId: 'session-1',
        }),
      )
      .send({
        googleId: 'google-1',
        title: 'Jane Eyre',
        pageCount: 412,
        completedDate: '2026-01-05T00:00:00.000Z',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(savedBook);
    expect(bookModel.findOneAndUpdate).toHaveBeenCalledWith(
      {
        userId: 'demo-recruiter-reader:session-1',
        googleId: 'google-1',
      },
      {
        $set: expect.objectContaining({
          title: 'Jane Eyre',
          userId: 'demo-recruiter-reader:session-1',
        }),
      },
      { upsert: true, new: true },
    );
  });

  it('returns the highest quality available Google Books cover', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'google-1',
              volumeInfo: {
                title: 'The Hobbit',
                authors: ['J.R.R. Tolkien'],
                pageCount: 310,
                imageLinks: {
                  thumbnail:
                    'http://books.google.com/books/content?id=small&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
                  large:
                    'http://books.google.com/books/content?id=large&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
                },
              },
            },
          ],
        }),
      }),
    );

    const response = await request(app).get('/api/books/search?q=hobbit');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    const thumbnail = new URL(response.body[0].thumbnail);
    expect(thumbnail.protocol).toBe('https:');
    expect(thumbnail.searchParams.get('id')).toBe('large');
    expect(thumbnail.searchParams.get('zoom')).toBe('0');
    expect(thumbnail.searchParams.has('edge')).toBe(false);
  });

  it('keeps search results when one Google Books query fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          json: async () => ({
            error: { message: 'Quota exceeded for this query' },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            items: [
              {
                id: 'google-1',
                volumeInfo: {
                  title: 'The Hobbit',
                  authors: ['J.R.R. Tolkien'],
                  pageCount: 310,
                },
              },
            ],
          }),
        }),
    );

    const response = await request(app).get('/api/books/search?q=hobbit');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        googleId: 'google-1',
        title: 'The Hobbit',
      }),
    ]);
  });

  it('adds a read book with a shelf-added timestamp', async () => {
    const savedBook = {
      _id: 'book-1',
      googleId: 'google-1',
      title: 'Jane Eyre',
      completedDate: '2026-01-05T00:00:00.000Z',
      currentlyReading: false,
      wantToRead: false,
    };
    bookModel.findOne.mockResolvedValue(null);
    bookModel.findOneAndUpdate.mockResolvedValue(savedBook);

    const response = await request(app)
      .post('/api/books')
      .set('Cookie', authCookie())
      .send({
        googleId: 'google-1',
        title: 'Jane Eyre',
        pageCount: 412,
        completedDate: '2026-01-05T00:00:00.000Z',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(savedBook);
    expect(bookModel.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: 'user-1', googleId: 'google-1' },
      {
        $set: expect.objectContaining({
          googleId: 'google-1',
          title: 'Jane Eyre',
          completedDate: '2026-01-05T00:00:00.000Z',
          currentlyReading: false,
          wantToRead: false,
          shelfAddedAt: expect.any(Date),
        }),
      },
      { upsert: true, new: true },
    );
  });

  it('normalizes shelf flags and points when updating a book', async () => {
    const existingBook = {
      _id: 'book-1',
      googleId: 'google-1',
      title: 'Jane Eyre',
      completedDate: '2026-01-01T00:00:00.000Z',
      shelfAddedAt: '2026-01-01T12:00:00.000Z',
    };
    const updatedBook = {
      _id: 'book-1',
      googleId: 'google-1',
      title: 'Jane Eyre',
      points: 4.12,
      currentlyReading: true,
      wantToRead: false,
    };
    bookModel.findOne.mockResolvedValue(existingBook);
    bookModel.findOneAndUpdate.mockResolvedValue(updatedBook);

    const response = await request(app)
      .put('/api/books/book-1')
      .set('Cookie', authCookie())
      .send({
        googleId: 'google-1',
        title: 'Jane Eyre',
        pageCount: 412,
        completedDate: '2026-01-05T00:00:00.000Z',
        currentlyReading: true,
        wantToRead: false,
        currentPage: 120,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedBook);
    expect(bookModel.findOne).toHaveBeenCalledWith({
      _id: 'book-1',
      userId: 'user-1',
    });
    expect(bookModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'book-1', userId: 'user-1' },
      {
        $set: expect.objectContaining({
          googleId: 'google-1',
          title: 'Jane Eyre',
          pageCount: 412,
          points: 4.12,
          userId: 'user-1',
          currentlyReading: true,
          wantToRead: false,
          currentPage: 120,
          shelfAddedAt: expect.any(Date),
        }),
        $unset: { completedDate: '' },
      },
      { new: true },
    );
  });
});
