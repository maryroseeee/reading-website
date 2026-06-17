import type { Book } from "../types/book";

export type ShelfTarget = "wantToRead" | "currentlyReading" | "read";

export const SHELF_BUTTON_LABELS: Record<ShelfTarget, string> = {
  wantToRead: "Want to read",
  currentlyReading: "Currently reading",
  read: "Read",
};

export const SHELF_RESULT_LABELS: Record<ShelfTarget, string> = {
  wantToRead: "want to read",
  currentlyReading: "currently reading",
  read: "read books",
};

type ShelfPayloadOptions = {
  googleId?: string;
  includeExistingFields?: boolean;
  preserveCurrentPage?: boolean;
};

export function getShelfTarget(book?: Book): ShelfTarget | undefined {
  if (!book) return undefined;
  if (book.wantToRead) return "wantToRead";
  if (book.currentlyReading) return "currentlyReading";
  if (book.completedDate) return "read";
  return undefined;
}

export function getShelfPayload(
  book: Book,
  target: ShelfTarget,
  completedDate?: Date,
  options: ShelfPayloadOptions = {},
): Book {
  const baseBook = options.includeExistingFields
    ? { ...book }
    : {
        googleId: options.googleId ?? book.googleId,
        title: book.title,
        authors: book.authors,
        pageCount: book.pageCount,
        categories: book.categories,
        thumbnail: book.thumbnail,
        points: book.points,
      };

  return {
    ...baseBook,
    googleId: options.googleId ?? book.googleId,
    completedDate: target === "read" ? completedDate?.toISOString() : undefined,
    currentlyReading: target === "currentlyReading",
    wantToRead: target === "wantToRead",
    currentPage:
      target === "currentlyReading" && options.preserveCurrentPage
        ? book.currentPage ?? 0
        : 0,
  };
}
