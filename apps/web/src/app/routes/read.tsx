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
import { deleteBook, getBooks, updateBook } from "@/features/books/api/books-api";
import type { Book } from "@/features/books/types/book";
import {
  BOOKS_PAGE_SIZE,
  filterBooksBySearch,
  filterBooksForShelf,
  paginateBooks,
  shouldKeepBookOnShelf,
} from "@/features/books/utils/shelf-books";

export default function Read() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getBooks()
      .then((data) => setBooks(filterBooksForShelf(data, "read")))
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
  const changeDate = async (id: string, date?: Date) => {
    const target = books.find((b) => b._id === id);
    if (!target) return;
    const updated = await updateBook(id, {
      ...target,
      completedDate: date ? date.toISOString() : undefined,
      currentlyReading: false,
      wantToRead: false,
    });
    setBooks((prev) => prev.map((b) => (b._id === id ? updated : b)));
  };

  const handleBookUpdated = (updated: Book) => {
    setBooks((prev) =>
      shouldKeepBookOnShelf(updated, "read")
        ? prev.map((b) => (b._id === updated._id ? updated : b))
        : prev.filter((b) => b._id !== updated._id),
    );
  };

  return (
    <div className="p-4 space-y-4">
      <button onClick={() => navigate("/dashboard")} className="text-xl">
        ←
      </button>
      <BookListSearch
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        placeholder="Search read books"
      />
      {filteredBooks.length === 0 ? (
        <p className="text-center text-sm opacity-90">
          {searchQuery ? "No read books match your search" : "No read books yet"}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {currentBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              action={
                <ShelfBookEditMenu
                  book={book}
                  shelf="read"
                  onBookUpdated={handleBookUpdated}
                  onDelete={handleDeleteBook}
                  onReadDateChange={changeDate}
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
