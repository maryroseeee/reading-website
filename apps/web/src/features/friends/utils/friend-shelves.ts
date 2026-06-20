import type { Book } from "@/features/books/types/book";
import {
  READ_SHELF_SORT_OPTIONS,
  WANT_TO_READ_SORT_OPTIONS,
  type ShelfSort,
} from "@/features/books/utils/shelf-books";

export const FRIEND_SHELF_PAGE_SIZE = 20;

export type FriendShelfType = "read" | "currently-reading" | "want-to-read";

export const FRIEND_SHELF_LABELS: Record<
  FriendShelfType,
  { title: string; empty: string }
> = {
  read: {
    title: "Read Books",
    empty: "No read books",
  },
  "currently-reading": {
    title: "Currently Reading",
    empty: "No current reads",
  },
  "want-to-read": {
    title: "Want To Read",
    empty: "No want-to-read books",
  },
};

export function getFriendShelfType(shelf?: string): FriendShelfType {
  if (shelf === "currently-reading" || shelf === "want-to-read") {
    return shelf;
  }

  return "read";
}

export function getFriendShelfBooks(books: Book[], shelf: FriendShelfType) {
  if (shelf === "currently-reading") {
    return books.filter((book) => book.currentlyReading);
  }

  if (shelf === "want-to-read") {
    return books.filter((book) => book.wantToRead);
  }

  return books
    .filter(
      (book) => book.completedDate && !book.currentlyReading && !book.wantToRead,
    )
    .sort((a, b) => {
      const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
      const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
      return dateB - dateA;
    });
}

export function getFriendShelfDefaultSort(shelf: FriendShelfType): ShelfSort {
  return shelf === "read" ? "dateReadDesc" : "titleAsc";
}

export function getFriendShelfSortOptions(shelf: FriendShelfType) {
  return shelf === "read" ? READ_SHELF_SORT_OPTIONS : WANT_TO_READ_SORT_OPTIONS;
}

export function getFriendShelfProgressValue(book: Book) {
  if (!book.pageCount) return 0;

  return Math.min(
    100,
    Math.round(((book.currentPage ?? 0) / book.pageCount) * 100),
  );
}
