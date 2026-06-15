import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import BookCard from "@/features/books/components/book-card";
import DeleteButton from "@/features/books/components/delete-button";
import { deleteBook, getBooks } from "@/features/books/api/books-api";
import type { Book } from "@/features/books/types/book";

const PAGE_SIZE = 20;

export default function WantToRead() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getBooks()
      .then((data) => setBooks(data.filter((book) => book.wantToRead)))
      .catch(() => undefined);
  }, []);

  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  const currentBooks = books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
    setBooks((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <div className="space-y-4 p-4">
      <button onClick={() => navigate("/dashboard")} className="text-xl">
        ←
      </button>
      <h1 className="text-center text-xl">Want To Read</h1>
      {currentBooks.length === 0 ? (
        <p className="text-center text-sm opacity-90">No want-to-read books yet</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {currentBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              action={
                book._id && (
                  <DeleteButton onConfirm={() => handleDeleteBook(book._id!)} />
                )
              }
            />
          ))}
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={page === i + 1}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className={
                page === totalPages ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
