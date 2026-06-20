import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  logout,
  updateThemeColor,
} from "@/features/auth/api/auth-api";
import type { UserProfile } from "@/features/auth/types/user";
import { deleteBook, getBooks, updateBook } from "@/features/books/api/books-api";
import FriendBookAddActions from "@/features/books/components/friend-book-add-actions";
import type { Book } from "@/features/books/types/book";
import { getFriendRequests, getFriends } from "@/features/friends/api/friends-api";
import type { Friend } from "@/features/friends/types/friend";
import { applyThemeColor } from "@/lib/theme-colors";

function getChartYears(books: Book[], chartYear: number) {
  const years = Array.from(
    new Set(
      books
        .filter((book) => book.completedDate)
        .map((book) => new Date(book.completedDate!).getFullYear()),
    ),
  ).sort((a, b) => b - a);

  if (!years.includes(chartYear)) {
    years.push(chartYear);
    years.sort((a, b) => b - a);
  }

  return years;
}

export function useDashboardPage() {
  const [user, setUser] = useState<UserProfile>({ email: "" });
  const [books, setBooks] = useState<Book[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [chartYear, setChartYear] = useState(new Date().getFullYear());
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const [friendsResult, requestsResult, userResult, booksResult] =
      await Promise.allSettled([
        getFriends(),
        getFriendRequests(),
        getCurrentUser(),
        getBooks(),
      ]);

    if (friendsResult.status === "fulfilled") {
      setFriends(friendsResult.value);
    }

    if (requestsResult.status === "fulfilled") {
      setRequests(requestsResult.value);
    }

    if (userResult.status === "fulfilled") {
      setUser(userResult.value);
      applyThemeColor(userResult.value.themeColor ?? "pink", false);
    }

    if (booksResult.status === "fulfilled") {
      setBooks(booksResult.value);
    }

    if (userResult.status === "rejected" || booksResult.status === "rejected") {
      setError("Could not load your dashboard.");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleThemeColorChange = async (themeColor: string) => {
    setUser((current) => ({ ...current, themeColor }));
    try {
      const updated = await updateThemeColor(themeColor);
      setUser((current) => ({ ...current, themeColor: updated.themeColor }));
    } catch {
      // Keep the immediate visual selection; refresh will use the saved profile value.
    }
  };

  const handleProfileUpdated = (data: Partial<UserProfile>) => {
    setUser((current) => ({ ...current, ...data }));
    setProfileOpen(false);
  };

  const handleCurrentPageChange = async (book: Book, currentPage: number) => {
    if (!book._id) return;
    const updated = await updateBook(book._id, {
      ...book,
      currentPage,
      currentlyReading: true,
      completedDate: undefined,
    });
    setBooks((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
  };

  const handleRemoveCurrentlyReading = async (book: Book) => {
    if (!book._id) return;
    const updated = await updateBook(book._id, {
      ...book,
      currentlyReading: false,
      currentPage: 0,
      completedDate: undefined,
    });
    setBooks((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
  };

  const handleBookMoved = (book: Book) => {
    setBooks((prev) => prev.map((b) => (b._id === book._id ? book : b)));
  };

  const handleBookDeleted = async (book: Book) => {
    if (!book._id) return;
    await deleteBook(book._id);
    setBooks((prev) => prev.filter((b) => b._id !== book._id));
  };

  const handleBookAdded = (book: Book) => {
    setBooks((prev) => [
      ...prev.filter((existing) => existing.googleId !== book.googleId),
      book,
    ]);
  };

  const handleFriendRemoved = (username: string) => {
    setFriends((prev) => prev.filter((friend) => friend.username !== username));
  };

  const handleFriendRequestAccepted = (friend: Friend) => {
    setFriends((prev) => [...prev, friend]);
    setRequests((prev) => prev.filter((request) => request._id !== friend._id));
  };

  const handleFriendRequestRejected = (id: string) => {
    setRequests((prev) => prev.filter((request) => request._id !== id));
  };

  const renderBookMoveActions = (book: Book, variant?: "compact") => (
    <FriendBookAddActions
      book={book}
      mode="update"
      onBookAdded={handleBookMoved}
      onBookDeleted={handleBookDeleted}
      compact={variant === "compact"}
      showEditionEdit
    />
  );

  return {
    books,
    chartYear,
    currentlyReadingBooks: books.filter((book) => book.currentlyReading),
    friends,
    goToReadShelf: () => navigate("/read"),
    goToWantToReadShelf: () => navigate("/want-to-read"),
    handleBookAdded,
    handleCurrentPageChange,
    handleFriendRemoved,
    handleFriendRequestAccepted,
    handleFriendRequestRejected,
    handleLogout,
    handleProfileUpdated,
    handleRemoveCurrentlyReading,
    handleThemeColorChange,
    isLoading,
    error,
    profileOpen,
    renderBookMoveActions,
    requests,
    reload: loadDashboard,
    setChartYear,
    setProfileOpen,
    user,
    wantToReadBooks: books.filter((book) => book.wantToRead),
    years: getChartYears(books, chartYear),
  };
}
