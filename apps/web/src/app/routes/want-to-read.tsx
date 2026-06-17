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
import BookListSearch from "@/features/books/components/book-list-search";
import ShelfBookEditMenu from "@/features/books/components/shelf-book-edit-menu";
import { deleteBook, getBooks } from "@/features/books/api/books-api";
import type { Book } from "@/features/books/types/book";
import {
  BOOKS_PAGE_SIZE,
  filterBooksBySearch,
  filterBooksForShelf,
  paginateBooks,
  shouldKeepBookOnShelf,
} from "@/features/books/utils/shelf-books";

export default function WantToRead() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getBooks()
      .then((data) => setBooks(filterBooksForShelf(data, "wantToRead")))
      .catch(() => undefined);
  }, []);

  const filteredBooks = filterBooksBySearch(books, searchQuery);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBooks.length / BOOKS_PAGE_SIZE),
  );
  const currentBooks = paginateBooks(filteredBooks, page);

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
    setBooks((prev) => prev.filter((b) => b._id !== id));
  };

  const handleBookUpdated = (updated: Book) => {
    setBooks((prev) =>
      shouldKeepBookOnShelf(updated, "wantToRead")
        ? prev.map((b) => (b._id === updated._id ? updated : b))
        : prev.filter((b) => b._id !== updated._id),
    );
  };

  return (
    <div className="space-y-4 p-4">
      <button onClick={() => navigate("/dashboard")} className="text-xl">
        ←
      </button>
      <h1 className="text-center text-xl">Want To Read</h1>
      <BookListSearch
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        placeholder="Search want to read"
      />
      {filteredBooks.length === 0 ? (
        <p className="text-center text-sm opacity-90">
          {searchQuery
            ? "No want-to-read books match your search"
            : "No want-to-read books yet"}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {currentBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              action={
                <ShelfBookEditMenu
                  book={book}
                  shelf="wantToRead"
                  onBookUpdated={handleBookUpdated}
                  onDelete={handleDeleteBook}
                />
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
