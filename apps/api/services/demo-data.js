import { randomUUID } from "crypto";

import Book from "../models/Book.js";
import User from "../models/User.js";

const DEMO_USER_PREFIX = "demo-recruiter-reader";
const DEMO_FRIEND_PREFIX = "demo-recruiter-friend";
const DEMO_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export function isDemoUserId(userId) {
  return (
    userId === DEMO_USER_PREFIX ||
    userId === DEMO_FRIEND_PREFIX ||
    userId?.startsWith(`${DEMO_USER_PREFIX}:`) ||
    userId?.startsWith(`${DEMO_FRIEND_PREFIX}:`)
  );
}

const demoUsers = {
  main: {
    email: "demo.reader@reading-tracker.local",
    name: "Maya Hart",
    bio: "A recruiter-safe demo profile with populated shelves, reading progress, friends, and comparison data.",
    profilePicture: "https://api.dicebear.com/9.x/initials/svg?seed=Maya%20Hart",
    themeColor: "pink",
  },
  friend: {
    email: "jamie.demo@reading-tracker.local",
    name: "Jamie Brooks",
    bio: "Demo friend profile used to show friend shelves and comparison charts.",
    profilePicture: "https://api.dicebear.com/9.x/initials/svg?seed=Jamie%20Brooks",
    themeColor: "navy",
  },
};

function createDemoIds(sessionId) {
  return {
    userId: `${DEMO_USER_PREFIX}:${sessionId}`,
    friendId: `${DEMO_FRIEND_PREFIX}:${sessionId}`,
  };
}

function createDemoUser(baseUser, googleId, username, sessionId, expiresAt) {
  return {
    ...baseUser,
    googleId,
    username,
    demoSessionId: sessionId,
    demoExpiresAt: expiresAt,
  };
}

function cover(isbn) {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

function withBookDefaults(userId, book) {
  const pageCount = book.pageCount ?? 0;

  return {
    userId,
    googleId: `demo:${userId}:${book.slug}`,
    title: book.title,
    authors: book.authors,
    pageCount,
    publishedYear: book.publishedYear,
    categories: book.categories,
    thumbnail: book.thumbnail,
    points: Number((pageCount / 100).toFixed(2)),
    completedDate: book.completedDate ? new Date(book.completedDate) : undefined,
    shelfAddedAt: new Date(book.shelfAddedAt),
    currentlyReading: Boolean(book.currentlyReading),
    wantToRead: Boolean(book.wantToRead),
    currentPage: book.currentPage ?? 0,
  };
}

const demoBooks = {
  main: [
    {
      slug: "pride-and-prejudice",
      title: "Pride and Prejudice",
      authors: ["Jane Austen"],
      pageCount: 279,
      publishedYear: 1813,
      categories: ["Classic", "Romance"],
      thumbnail: cover("9780141439518"),
      completedDate: "2026-01-12T00:00:00.000Z",
      shelfAddedAt: "2026-01-12T12:00:00.000Z",
    },
    {
      slug: "jane-eyre",
      title: "Jane Eyre",
      authors: ["Charlotte Bronte"],
      pageCount: 532,
      publishedYear: 1847,
      categories: ["Classic", "Gothic"],
      thumbnail: cover("9780141441146"),
      completedDate: "2026-02-08T00:00:00.000Z",
      shelfAddedAt: "2026-02-08T12:00:00.000Z",
    },
    {
      slug: "the-great-gatsby",
      title: "The Great Gatsby",
      authors: ["F. Scott Fitzgerald"],
      pageCount: 180,
      publishedYear: 1925,
      categories: ["Classic"],
      thumbnail: cover("9780743273565"),
      completedDate: "2026-03-02T00:00:00.000Z",
      shelfAddedAt: "2026-03-02T12:00:00.000Z",
    },
    {
      slug: "frankenstein",
      title: "Frankenstein",
      authors: ["Mary Shelley"],
      pageCount: 280,
      publishedYear: 1818,
      categories: ["Classic", "Science Fiction"],
      thumbnail: cover("9780141439471"),
      completedDate: "2026-04-16T00:00:00.000Z",
      shelfAddedAt: "2026-04-16T12:00:00.000Z",
    },
    {
      slug: "the-odyssey",
      title: "The Odyssey",
      authors: ["Homer"],
      pageCount: 541,
      publishedYear: -700,
      categories: ["Epic", "Classic"],
      thumbnail: cover("9780140268867"),
      completedDate: "2025-11-21T00:00:00.000Z",
      shelfAddedAt: "2025-11-21T12:00:00.000Z",
    },
    {
      slug: "moby-dick",
      title: "Moby-Dick",
      authors: ["Herman Melville"],
      pageCount: 720,
      publishedYear: 1851,
      categories: ["Classic", "Adventure"],
      thumbnail: cover("9780142437247"),
      shelfAddedAt: "2026-05-01T12:00:00.000Z",
      currentlyReading: true,
      currentPage: 248,
    },
    {
      slug: "wuthering-heights",
      title: "Wuthering Heights",
      authors: ["Emily Bronte"],
      pageCount: 416,
      publishedYear: 1847,
      categories: ["Classic", "Gothic"],
      thumbnail: cover("9780141439556"),
      shelfAddedAt: "2026-05-18T12:00:00.000Z",
      currentlyReading: true,
      currentPage: 96,
    },
    {
      slug: "their-eyes-were-watching-god",
      title: "Their Eyes Were Watching God",
      authors: ["Zora Neale Hurston"],
      pageCount: 219,
      publishedYear: 1937,
      categories: ["Classic", "Literary Fiction"],
      thumbnail: cover("9780061120060"),
      shelfAddedAt: "2026-04-26T12:00:00.000Z",
      wantToRead: true,
    },
    {
      slug: "the-count-of-monte-cristo",
      title: "The Count of Monte Cristo",
      authors: ["Alexandre Dumas"],
      pageCount: 1276,
      publishedYear: 1844,
      categories: ["Classic", "Adventure"],
      thumbnail: cover("9780140449266"),
      shelfAddedAt: "2026-05-05T12:00:00.000Z",
      wantToRead: true,
    },
    {
      slug: "invisible-man",
      title: "Invisible Man",
      authors: ["Ralph Ellison"],
      pageCount: 581,
      publishedYear: 1952,
      categories: ["Classic", "Literary Fiction"],
      thumbnail: cover("9780679732761"),
      shelfAddedAt: "2026-05-30T12:00:00.000Z",
      wantToRead: true,
    },
  ],
  friend: [
    {
      slug: "little-women",
      title: "Little Women",
      authors: ["Louisa May Alcott"],
      pageCount: 449,
      publishedYear: 1868,
      categories: ["Classic", "Coming of Age"],
      thumbnail: cover("9780147514011"),
      completedDate: "2026-01-19T00:00:00.000Z",
      shelfAddedAt: "2026-01-19T12:00:00.000Z",
    },
    {
      slug: "dracula",
      title: "Dracula",
      authors: ["Bram Stoker"],
      pageCount: 418,
      publishedYear: 1897,
      categories: ["Classic", "Horror"],
      thumbnail: cover("9780141439846"),
      completedDate: "2026-02-23T00:00:00.000Z",
      shelfAddedAt: "2026-02-23T12:00:00.000Z",
    },
    {
      slug: "things-fall-apart",
      title: "Things Fall Apart",
      authors: ["Chinua Achebe"],
      pageCount: 209,
      publishedYear: 1958,
      categories: ["Classic", "Historical Fiction"],
      thumbnail: cover("9780385474542"),
      completedDate: "2026-03-14T00:00:00.000Z",
      shelfAddedAt: "2026-03-14T12:00:00.000Z",
    },
    {
      slug: "east-of-eden",
      title: "East of Eden",
      authors: ["John Steinbeck"],
      pageCount: 601,
      publishedYear: 1952,
      categories: ["Classic", "Family Saga"],
      thumbnail: cover("9780140186390"),
      completedDate: "2025-09-10T00:00:00.000Z",
      shelfAddedAt: "2025-09-10T12:00:00.000Z",
    },
    {
      slug: "the-bell-jar",
      title: "The Bell Jar",
      authors: ["Sylvia Plath"],
      pageCount: 244,
      publishedYear: 1963,
      categories: ["Classic", "Literary Fiction"],
      thumbnail: cover("9780060837020"),
      completedDate: "2025-12-04T00:00:00.000Z",
      shelfAddedAt: "2025-12-04T12:00:00.000Z",
    },
    {
      slug: "crime-and-punishment",
      title: "Crime and Punishment",
      authors: ["Fyodor Dostoevsky"],
      pageCount: 671,
      publishedYear: 1866,
      categories: ["Classic", "Philosophical Fiction"],
      thumbnail: cover("9780140449136"),
      shelfAddedAt: "2026-04-28T12:00:00.000Z",
      currentlyReading: true,
      currentPage: 312,
    },
    {
      slug: "middlemarch",
      title: "Middlemarch",
      authors: ["George Eliot"],
      pageCount: 904,
      publishedYear: 1871,
      categories: ["Classic", "Literary Fiction"],
      thumbnail: cover("9780141439549"),
      shelfAddedAt: "2026-05-09T12:00:00.000Z",
      wantToRead: true,
    },
    {
      slug: "the-picture-of-dorian-gray",
      title: "The Picture of Dorian Gray",
      authors: ["Oscar Wilde"],
      pageCount: 254,
      publishedYear: 1890,
      categories: ["Classic", "Gothic"],
      thumbnail: cover("9780141439570"),
      shelfAddedAt: "2026-05-22T12:00:00.000Z",
      wantToRead: true,
    },
  ],
};

async function cleanupExpiredDemoSessions() {
  const expiredUsers = await User.find({
    demoExpiresAt: { $lt: new Date() },
  })
    .select("googleId demoSessionId")
    .lean();
  const expiredUserIds = expiredUsers.map((user) => user.googleId);
  const expiredSessionIds = [
    ...new Set(expiredUsers.map((user) => user.demoSessionId).filter(Boolean)),
  ];

  await Promise.all([
    expiredUserIds.length
      ? Book.deleteMany({ userId: { $in: expiredUserIds } })
      : Promise.resolve(),
    expiredSessionIds.length
      ? User.deleteMany({ demoSessionId: { $in: expiredSessionIds } })
      : Promise.resolve(),
    Book.deleteMany({ userId: { $in: [DEMO_USER_PREFIX, DEMO_FRIEND_PREFIX] } }),
    User.deleteMany({ googleId: { $in: [DEMO_USER_PREFIX, DEMO_FRIEND_PREFIX] } }),
  ]);
}

export async function deleteDemoSession({ sessionId, uid } = {}) {
  if (!sessionId && !isDemoUserId(uid)) return;

  const userQuery = sessionId ? { demoSessionId: sessionId } : { googleId: uid };
  const demoSessionUsers = await User.find(userQuery).select("googleId").lean();
  const userIds = demoSessionUsers.map((user) => user.googleId);

  await Promise.all([
    userIds.length
      ? Book.deleteMany({ userId: { $in: userIds } })
      : Promise.resolve(),
    User.deleteMany(userQuery),
  ]);
}

export async function seedDemoAccount() {
  await cleanupExpiredDemoSessions();

  const sessionId = randomUUID().replace(/-/g, "");
  const expiresAt = new Date(Date.now() + DEMO_SESSION_TTL_MS);
  const { userId, friendId } = createDemoIds(sessionId);
  const demoUserData = createDemoUser(
    demoUsers.main,
    userId,
    `recruiter_demo_${sessionId.slice(0, 8)}`,
    sessionId,
    expiresAt,
  );
  const demoFriendData = createDemoUser(
    demoUsers.friend,
    friendId,
    `jamie_demo_${sessionId.slice(0, 8)}`,
    sessionId,
    expiresAt,
  );

  const [demoUser, demoFriend] = await Promise.all([
    User.findOneAndUpdate(
      { googleId: userId },
      { $set: demoUserData },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ),
    User.findOneAndUpdate(
      { googleId: friendId },
      { $set: demoFriendData },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ),
  ]);

  await Promise.all([
    User.updateOne(
      { _id: demoUser._id },
      { $set: { friends: [demoFriend._id], friendRequests: [] } },
    ),
    User.updateOne(
      { _id: demoFriend._id },
      { $set: { friends: [demoUser._id], friendRequests: [] } },
    ),
    Book.deleteMany({ userId: { $in: [userId, friendId] } }),
  ]);

  await Book.insertMany(
    [
      ...demoBooks.main.map((book) => withBookDefaults(userId, book)),
      ...demoBooks.friend.map((book) => withBookDefaults(friendId, book)),
    ],
  );

  return {
    sessionId,
    user: {
      googleId: userId,
      email: demoUser.email,
      name: demoUser.name,
      username: demoUser.username,
      themeColor: demoUser.themeColor,
    },
  };
}
