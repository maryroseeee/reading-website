import { describe, expect, it } from "vitest";

import { sortShelfBooks } from "./shelf-books";
import type { Book } from "../types/book";

const books: Book[] = [
  {
    _id: "64ad00000000000000000003",
    title: "Moby-Dick",
    authors: ["Herman Melville"],
    pageCount: 635,
    points: 6.35,
    completedDate: "2026-03-01T00:00:00.000Z",
    shelfAddedAt: "2026-03-02T00:00:00.000Z",
  },
  {
    _id: "64ad00000000000000000002",
    title: "Jane Eyre",
    authors: ["Charlotte Bronte"],
    pageCount: 532,
    points: 5.32,
    completedDate: "2026-05-01T00:00:00.000Z",
    shelfAddedAt: "2026-05-02T00:00:00.000Z",
  },
  {
    _id: "64ad00000000000000000001",
    title: "Pride and Prejudice",
    authors: ["Jane Austen"],
    pageCount: 432,
    points: 4.32,
    completedDate: "2026-01-01T00:00:00.000Z",
    shelfAddedAt: "2026-01-02T00:00:00.000Z",
  },
];

describe("sortShelfBooks", () => {
  it("sorts read books by completion date", () => {
    expect(sortShelfBooks(books, "dateReadDesc").map((book) => book.title)).toEqual([
      "Jane Eyre",
      "Moby-Dick",
      "Pride and Prejudice",
    ]);
  });

  it("sorts books by title and numeric fields", () => {
    expect(sortShelfBooks(books, "titleAsc").map((book) => book.title)).toEqual([
      "Jane Eyre",
      "Moby-Dick",
      "Pride and Prejudice",
    ]);
    expect(sortShelfBooks(books, "pagesDesc").map((book) => book.title)).toEqual([
      "Moby-Dick",
      "Jane Eyre",
      "Pride and Prejudice",
    ]);
  });

  it("sorts books by when they were added to the shelf", () => {
    expect(sortShelfBooks(books, "shelfAddedDesc").map((book) => book.title)).toEqual([
      "Jane Eyre",
      "Moby-Dick",
      "Pride and Prejudice",
    ]);
  });
});
