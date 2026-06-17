import { normalizeText } from "@/utils/text";

import type { Book } from "../types/book";

export const BOOKS_PAGE_SIZE = 20;

export type BookShelf = "read" | "wantToRead";

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
