import { useEffect, useMemo, useState } from "react";

import { getBooks } from "@/features/books/api/books-api";
import type { Book } from "@/features/books/types/book";
import {
  filterBooksBySearch,
  sortShelfBooks,
  type ShelfSort,
} from "@/features/books/utils/shelf-books";
import { getFriendBooks } from "@/features/friends/api/friends-api";
import type { Friend } from "@/features/friends/types/friend";
import { useTemporaryThemeColor } from "@/lib/use-temporary-theme-color";

import {
  FRIEND_SHELF_LABELS,
  FRIEND_SHELF_PAGE_SIZE,
  getFriendShelfBooks,
  getFriendShelfDefaultSort,
  getFriendShelfType,
} from "../utils/friend-shelves";

export function useFriendShelfPage(username?: string, shelf?: string) {
  const [friend, setFriend] = useState<Friend>();
  const [books, setBooks] = useState<Book[]>([]);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<ShelfSort>(() =>
    getFriendShelfDefaultSort(getFriendShelfType(shelf)),
  );
  const shelfType = getFriendShelfType(shelf);
  const shelfCopy = FRIEND_SHELF_LABELS[shelfType];

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
    setSort(getFriendShelfDefaultSort(shelfType));
  }, [shelfType, username]);

  useTemporaryThemeColor(friend?.themeColor);

  const shelfBooks = useMemo(
    () => getFriendShelfBooks(books, shelfType),
    [books, shelfType],
  );
  const filteredBooks = useMemo(
    () => sortShelfBooks(filterBooksBySearch(shelfBooks, searchQuery), sort),
    [searchQuery, shelfBooks, sort],
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBooks.length / FRIEND_SHELF_PAGE_SIZE),
  );
  const currentBooks = filteredBooks.slice(
    (page - 1) * FRIEND_SHELF_PAGE_SIZE,
    page * FRIEND_SHELF_PAGE_SIZE,
  );
  const friendName = friend?.name || friend?.username || "Friend";
  const friendProfilePath = `/friends/${encodeURIComponent(
    friend?.username ?? username ?? "",
  )}`;

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

  return {
    currentBooks,
    error,
    friend,
    friendName,
    friendProfilePath,
    handleMyBookAdded,
    myBooks,
    page,
    searchQuery,
    setPage,
    setSearchQuery,
    setSort,
    shelfBooks,
    shelfCopy,
    shelfType,
    sort,
    totalPages,
  };
}
