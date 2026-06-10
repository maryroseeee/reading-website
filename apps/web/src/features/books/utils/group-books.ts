import { normalizeText } from "@/utils/text";

import type { Book } from "../types/book";

function normalizeTitleForGrouping(title: string) {
  return normalizeText(title)
    .replace(/\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/[:;].*$/g, "")
    .replace(/\b(illustrated|edition|paperback|hardcover|ebook|kindle|movie tie in)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeAuthorForGrouping(authors?: string[]) {
  return normalizeText(authors?.[0] ?? "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getBookGroupKey(book: Book) {
  return `${normalizeTitleForGrouping(book.title)}|${normalizeAuthorForGrouping(book.authors)}`;
}

export function groupBookVersions(books: Book[]) {
  return Object.values(
    books.reduce((acc, book) => {
      const key = getBookGroupKey(book);
      acc[key] = acc[key] || [];
      acc[key].push(book);
      return acc;
    }, {} as Record<string, Book[]>),
  ).map((versions) => ({
    versions,
    selected: versions[0],
  }));
}
