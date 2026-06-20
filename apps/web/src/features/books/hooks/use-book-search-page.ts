import { useEffect, useState, type FormEvent } from "react";

import { addBook, deleteBook, getBooks, searchBooks } from "../api/books-api";
import type { Book } from "../types/book";
import { groupBookVersions } from "../utils/group-books";
import { normalizeText } from "@/utils/text";

export type BookSearchResult = {
  versions: Book[];
  selected: Book;
  completedDate?: Date;
  currentlyReading?: boolean;
  wantToRead?: boolean;
};

type SearchResultPatch = Partial<
  Pick<
    BookSearchResult,
    "completedDate" | "currentlyReading" | "wantToRead" | "selected"
  >
>;

export function useBookSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [customOpen, setCustomOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBooks().then((data) => setBooks(data));
  }, []);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query) return;

    try {
      setError("");
      const data = await searchBooks(normalizeText(query));
      setResults(
        groupBookVersions(data).map((group) => ({
          ...group,
          completedDate: undefined,
          currentlyReading: false,
          wantToRead: false,
        })),
      );
    } catch {
      setResults([]);
      setError("Google Books search is unavailable. You can add your version manually.");
    }
  };

  const handleAddBook = async (
    item: Book,
    options: {
      completedDate?: Date;
      currentlyReading?: boolean;
      wantToRead?: boolean;
    } = {},
  ) => {
    try {
      setError("");
      const book = await addBook({
        ...item,
        completedDate: options.currentlyReading || options.wantToRead
          ? undefined
          : options.completedDate?.toISOString() ?? item.completedDate,
        currentlyReading: Boolean(options.currentlyReading),
        wantToRead: Boolean(options.wantToRead),
      });
      setBooks((prev) => [
        ...prev.filter((existing) => existing.googleId !== book.googleId),
        book,
      ]);
    } catch {
      setError("Could not add this book. Make sure you are signed in.");
    }
  };

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
    setBooks((prev) => prev.filter((book) => book._id !== id));
  };

  const updateResult = (index: number, patch: SearchResultPatch) => {
    setResults((prev) =>
      prev.map((result, resultIndex) =>
        resultIndex === index ? { ...result, ...patch } : result,
      ),
    );
  };

  const getAddedBook = (googleId?: string) =>
    books.find((book) => book.googleId === googleId);

  return {
    customOpen,
    error,
    getAddedBook,
    handleAddBook,
    handleDeleteBook,
    handleSearch,
    query,
    results,
    setCustomOpen,
    setQuery,
    updateResult,
  };
}
