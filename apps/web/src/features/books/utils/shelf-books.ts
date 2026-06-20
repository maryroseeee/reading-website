import { normalizeText } from "@/utils/text";

import type { Book } from "../types/book";

export const BOOKS_PAGE_SIZE = 20;

export type BookShelf = "read" | "wantToRead";
export type ShelfSort =
  | "shelfAddedDesc"
  | "shelfAddedAsc"
  | "dateReadDesc"
  | "dateReadAsc"
  | "titleAsc"
  | "titleDesc"
  | "authorAsc"
  | "authorDesc"
  | "pagesDesc"
  | "pagesAsc"
  | "pointsDesc"
  | "pointsAsc";

export const READ_SHELF_SORT_OPTIONS: ShelfSort[] = [
  "shelfAddedDesc",
  "shelfAddedAsc",
  "dateReadDesc",
  "dateReadAsc",
  "titleAsc",
  "titleDesc",
  "authorAsc",
  "authorDesc",
  "pagesDesc",
  "pagesAsc",
  "pointsDesc",
  "pointsAsc",
];

export const WANT_TO_READ_SORT_OPTIONS: ShelfSort[] = [
  "shelfAddedDesc",
  "shelfAddedAsc",
  "titleAsc",
  "titleDesc",
  "authorAsc",
  "authorDesc",
  "pagesDesc",
  "pagesAsc",
  "pointsDesc",
  "pointsAsc",
];

export const SHELF_SORT_LABELS: Record<ShelfSort, string> = {
  shelfAddedDesc: "Added to shelf: newest",
  shelfAddedAsc: "Added to shelf: oldest",
  dateReadDesc: "Date read: newest",
  dateReadAsc: "Date read: oldest",
  titleAsc: "Title: A-Z",
  titleDesc: "Title: Z-A",
  authorAsc: "Author: A-Z",
  authorDesc: "Author: Z-A",
  pagesDesc: "Pages: high to low",
  pagesAsc: "Pages: low to high",
  pointsDesc: "Points: high to low",
  pointsAsc: "Points: low to high",
};

export function isReadShelfBook(book: Book) {
  return Boolean(book.completedDate) && !book.currentlyReading && !book.wantToRead;
}

export function isWantToReadShelfBook(book: Book) {
  return Boolean(book.wantToRead);
}

function sortReadBooks(books: Book[]) {
  return [...books].sort((a, b) => {
    const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
    const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
    return dateB - dateA;
  });
}

function compareText(a: string | undefined, b: string | undefined) {
  return (a || "").localeCompare(b || "", undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function getAuthor(book: Book) {
  return book.authors?.[0] || "";
}

function getPoints(book: Book) {
  return book.points ?? (book.pageCount ? book.pageCount / 100 : undefined);
}

function compareNumberDesc(a?: number, b?: number) {
  const valueA = a ?? Number.NEGATIVE_INFINITY;
  const valueB = b ?? Number.NEGATIVE_INFINITY;
  return valueA === valueB ? 0 : valueB - valueA;
}

function compareNumberAsc(a?: number, b?: number) {
  const valueA = a ?? Number.POSITIVE_INFINITY;
  const valueB = b ?? Number.POSITIVE_INFINITY;
  return valueA === valueB ? 0 : valueA - valueB;
}

function compareDateDesc(a?: string, b?: string) {
  return (
    (b ? new Date(b).getTime() : Number.NEGATIVE_INFINITY) -
    (a ? new Date(a).getTime() : Number.NEGATIVE_INFINITY)
  );
}

function compareDateAsc(a?: string, b?: string) {
  return (
    (a ? new Date(a).getTime() : Number.POSITIVE_INFINITY) -
    (b ? new Date(b).getTime() : Number.POSITIVE_INFINITY)
  );
}

function getObjectIdTime(id?: string) {
  if (!id || !/^[0-9a-f]{24}$/i.test(id)) return undefined;
  return parseInt(id.slice(0, 8), 16) * 1000;
}

function getDateTime(value?: string) {
  if (!value) return undefined;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : undefined;
}

function getShelfAddedTime(book: Book) {
  return (
    getDateTime(book.shelfAddedAt) ??
    getDateTime(book.createdAt) ??
    getObjectIdTime(book._id) ??
    getDateTime(book.completedDate) ??
    getDateTime(book.updatedAt)
  );
}

function tieBreakByTitle(a: Book, b: Book) {
  return compareText(a.title, b.title);
}

export function sortShelfBooks(books: Book[], sort: ShelfSort) {
  return [...books].sort((a, b) => {
    let result = 0;

    switch (sort) {
      case "shelfAddedDesc":
        result = compareNumberDesc(getShelfAddedTime(a), getShelfAddedTime(b));
        break;
      case "shelfAddedAsc":
        result = compareNumberAsc(getShelfAddedTime(a), getShelfAddedTime(b));
        break;
      case "dateReadDesc":
        result = compareDateDesc(a.completedDate, b.completedDate);
        break;
      case "dateReadAsc":
        result = compareDateAsc(a.completedDate, b.completedDate);
        break;
      case "titleAsc":
        result = compareText(a.title, b.title);
        break;
      case "titleDesc":
        result = compareText(b.title, a.title);
        break;
      case "authorAsc":
        result = compareText(getAuthor(a), getAuthor(b));
        break;
      case "authorDesc":
        result = compareText(getAuthor(b), getAuthor(a));
        break;
      case "pagesDesc":
        result = compareNumberDesc(a.pageCount, b.pageCount);
        break;
      case "pagesAsc":
        result = compareNumberAsc(a.pageCount, b.pageCount);
        break;
      case "pointsDesc":
        result = compareNumberDesc(getPoints(a), getPoints(b));
        break;
      case "pointsAsc":
        result = compareNumberAsc(getPoints(a), getPoints(b));
        break;
    }

    return result || tieBreakByTitle(a, b);
  });
}

export function filterBooksForShelf(books: Book[], shelf: BookShelf) {
  const filteredBooks =
    shelf === "read"
      ? books.filter(isReadShelfBook)
      : books.filter(isWantToReadShelfBook);

  return shelf === "read" ? sortReadBooks(filteredBooks) : filteredBooks;
}

export function shouldKeepBookOnShelf(book: Book, shelf: BookShelf) {
  return shelf === "read" ? isReadShelfBook(book) : isWantToReadShelfBook(book);
}

function getBookKey(book: Book) {
  return book._id ?? book.googleId;
}

export function upsertBook(books: Book[], book: Book) {
  const key = getBookKey(book);
  if (!key) return [book, ...books];

  const existingBook = books.some((candidate) => getBookKey(candidate) === key);
  if (!existingBook) return [book, ...books];

  return books.map((candidate) => (getBookKey(candidate) === key ? book : candidate));
}

export function reconcileBookForShelf(
  books: Book[],
  book: Book,
  shelf: BookShelf,
) {
  return filterBooksForShelf(upsertBook(books, book), shelf);
}

export function matchesBookSearch(book: Book, query: string) {
  const normalizedQuery = normalizeText(query.trim());
  if (!normalizedQuery) return true;

  const searchText = [
    book.title,
    ...(book.authors || []),
    ...(book.categories || []),
    book.pageCount ? `${book.pageCount} pages` : "",
  ].join(" ");

  return normalizeText(searchText).includes(normalizedQuery);
}

export function filterBooksBySearch(books: Book[], query: string) {
  return books.filter((book) => matchesBookSearch(book, query));
}

export function paginateBooks(
  books: Book[],
  page: number,
  pageSize = BOOKS_PAGE_SIZE,
) {
  const start = (page - 1) * pageSize;
  return books.slice(start, start + pageSize);
}
