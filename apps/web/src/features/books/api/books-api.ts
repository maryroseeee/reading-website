import { apiClient } from "@/lib/api-client";

import type { Book } from "../types/book";

export async function getBooks() {
  const res = await apiClient.get<Book[]>("/books");
  return res.data;
}

export async function searchBooks(query: string) {
  const res = await apiClient.get<Book[]>("/books/search", {
    params: { q: query },
  });
  return res.data;
}

export async function addBook(book: Book) {
  const res = await apiClient.post<Book>("/books", book);
  return res.data;
}

export async function updateBook(id: string, book: Book) {
  const res = await apiClient.put<Book>(`/books/${id}`, book);
  return res.data;
}

export async function deleteBook(id: string) {
  await apiClient.delete(`/books/${id}`);
}
