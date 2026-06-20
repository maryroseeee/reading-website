import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageError } from "@/components/page-state";
import { ShelfPageSkeleton } from "@/components/page-skeletons";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import AddBookCombobox from "@/features/books/components/add-book-combobox";
import BookCard from "@/features/books/components/book-card";
import BookListSearch from "@/features/books/components/book-list-search";
import ShelfBookEditMenu from "@/features/books/components/shelf-book-edit-menu";
import ShelfSortSelect from "@/features/books/components/shelf-sort-select";
import { deleteBook, getBooks, updateBook } from "@/features/books/api/books-api";
import type { Book } from "@/features/books/types/book";
import {
  BOOKS_PAGE_SIZE,
  READ_SHELF_SORT_OPTIONS,
  filterBooksBySearch,
  filterBooksForShelf,
  paginateBooks,
  reconcileBookForShelf,
  shouldKeepBookOnShelf,
  sortShelfBooks,
  type ShelfSort,
} from "@/features/books/utils/shelf-books";

export default function Read() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<ShelfSort>("dateReadDesc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getBooks();
      setBooks(filterBooksForShelf(data, "read"));
    } catch {
      setError("Could not load your read books.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  const filteredBooks = sortShelfBooks(
    filterBooksBySearch(books, searchQuery),
    sort,
  );
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

  const handleBookAdded = (book: Book) => {
    setBooks((prev) => reconcileBookForShelf(prev, book, "read"));
  };

  if (isLoading) {
    return <ShelfPageSkeleton title="Read Books" />;
  }

  if (error) {
    return (
      <PageError
        title="Could not load read books"
        message={error}
        onRetry={loadBooks}
      />
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <button
          onClick={() => navigate("/dashboard")}
          className="justify-self-start text-xl"
        >
          ←
        </button>
        <h1 className="text-center text-xl sm:col-start-2">Read Books</h1>
        <div className="justify-self-start sm:col-start-3 sm:justify-self-end">
          <AddBookCombobox defaultShelf="read" onBookAdded={handleBookAdded} />
        </div>
      </div>
      <div className="grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="md:col-start-2">
          <BookListSearch
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setPage(1);
            }}
            placeholder="Search read books"
          />
        </div>
        <div className="justify-self-center md:col-start-3 md:justify-self-end">
          <ShelfSortSelect
            value={sort}
            options={READ_SHELF_SORT_OPTIONS}
            onChange={(value) => {
              setSort(value);
              setPage(1);
            }}
          />
        </div>
      </div>
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
