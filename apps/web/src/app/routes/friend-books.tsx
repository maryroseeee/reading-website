import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { getBooks } from "@/features/books/api/books-api";
import BookCard from "@/features/books/components/book-card";
import BookListSearch from "@/features/books/components/book-list-search";
import FriendBookAddActions from "@/features/books/components/friend-book-add-actions";
import ShelfSortSelect from "@/features/books/components/shelf-sort-select";
import type { Book } from "@/features/books/types/book";
import {
  READ_SHELF_SORT_OPTIONS,
  WANT_TO_READ_SORT_OPTIONS,
  filterBooksBySearch,
  sortShelfBooks,
  type ShelfSort,
} from "@/features/books/utils/shelf-books";
import { getFriendBooks } from "@/features/friends/api/friends-api";
import type { Friend } from "@/features/friends/types/friend";
import { useTemporaryThemeColor } from "@/lib/use-temporary-theme-color";

const PAGE_SIZE = 20;

type ShelfType = "read" | "currently-reading" | "want-to-read";

const SHELF_LABELS: Record<ShelfType, { title: string; empty: string }> = {
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

function getShelfType(shelf?: string): ShelfType {
  if (shelf === "currently-reading" || shelf === "want-to-read") {
    return shelf;
  }

  return "read";
}

function getShelfBooks(books: Book[], shelf: ShelfType) {
  if (shelf === "currently-reading") {
    return books.filter((book) => book.currentlyReading);
  }

  if (shelf === "want-to-read") {
    return books.filter((book) => book.wantToRead);
  }

  return books
    .filter((book) => book.completedDate && !book.currentlyReading && !book.wantToRead)
    .sort((a, b) => {
      const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
      const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
      return dateB - dateA;
    });
}

function getDefaultSort(shelf: ShelfType): ShelfSort {
  return shelf === "read" ? "dateReadDesc" : "titleAsc";
}

function getSortOptions(shelf: ShelfType) {
  return shelf === "read" ? READ_SHELF_SORT_OPTIONS : WANT_TO_READ_SORT_OPTIONS;
}

function getProgressValue(book: Book) {
  if (!book.pageCount) return 0;
  return Math.min(
    100,
    Math.round(((book.currentPage ?? 0) / book.pageCount) * 100),
  );
}

export default function FriendBooks() {
  const { username, shelf } = useParams();
  const navigate = useNavigate();
  const [friend, setFriend] = useState<Friend>();
  const [books, setBooks] = useState<Book[]>([]);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<ShelfSort>(() => getDefaultSort(getShelfType(shelf)));
  const shelfType = getShelfType(shelf);
  const shelfCopy = SHELF_LABELS[shelfType];

  useEffect(() => {
    if (!username) return;

    getFriendBooks(username)
      .then((data) => {
        setFriend(data.friend);
        setBooks(data.books);
      })
      .catch(() => {
        setError("Could not load this friend's books.");
      });

    getBooks()
      .then((data) => setMyBooks(data))
      .catch(() => undefined);
  }, [username]);

  useEffect(() => {
    setPage(1);
    setSearchQuery("");
    setSort(getDefaultSort(shelfType));
  }, [shelfType, username]);

  useTemporaryThemeColor(friend?.themeColor);

  const shelfBooks = useMemo(
    () => getShelfBooks(books, shelfType),
    [books, shelfType],
  );
  const filteredBooks = useMemo(
    () =>
      sortShelfBooks(
        filterBooksBySearch(shelfBooks, searchQuery),
        sort,
      ),
    [searchQuery, shelfBooks, sort],
  );
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
  const currentBooks = filteredBooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const friendName = friend?.name || friend?.username || "Friend";
  const handleMyBookAdded = (book: Book) => {
    setMyBooks((current) => {
      if (!book.googleId) {
        return [...current.filter((existing) => existing._id !== book._id), book];
      }

      return [
        ...current.filter((existing) => existing.googleId !== book.googleId),
        book,
      ];
    });
  };

  return (
    <div className="space-y-4 p-4">
      <button
        onClick={() =>
          navigate(`/friends/${encodeURIComponent(friend?.username ?? username ?? "")}`)
        }
        className="text-xl"
      >
        ←
      </button>
      <h1 className="text-center text-xl">
        {friendName}'s {shelfCopy.title}
      </h1>
      <div className="grid items-center gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="lg:col-start-2">
          <BookListSearch
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setPage(1);
            }}
            placeholder={`Search ${shelfCopy.title.toLowerCase()}`}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2 lg:col-start-3 lg:justify-self-end">
          <ShelfSortSelect
            value={sort}
            options={getSortOptions(shelfType)}
            onChange={(value) => {
              setSort(value);
              setPage(1);
            }}
          />
        </div>
      </div>
      {error && <p className="text-center text-sm opacity-80">{error}</p>}
      {currentBooks.length === 0 ? (
        <p className="text-center text-sm opacity-90">
          {shelfBooks.length === 0
            ? shelfCopy.empty
            : "No books match these filters"}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {currentBooks.map((book) => (
            <BookCard
              key={book._id ?? book.googleId ?? book.title}
              book={book}
              hoverAction={
                <FriendBookAddActions
                  book={book}
                  existingBooks={myBooks}
                  onBookAdded={handleMyBookAdded}
                />
              }
              action={
                shelfType === "currently-reading" ? (
                  <div className="space-y-1 rounded-base border-2 border-border bg-background p-2 text-xs text-foreground shadow-shadow">
                    <Progress value={getProgressValue(book)} />
                    <p className="font-heading">
                      {book.currentPage ?? 0}
                      {book.pageCount ? ` / ${book.pageCount}` : ""} pages
                    </p>
                  </div>
                ) : undefined
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
