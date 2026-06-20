import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PageError } from "@/components/page-state";
import { ComparePageSkeleton } from "@/components/page-skeletons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import type { UserProfile } from "@/features/auth/types/user";
import { getBooks } from "@/features/books/api/books-api";
import ScoreChart from "@/features/books/components/score-chart";
import type { Book } from "@/features/books/types/book";
import { getFriendBooks } from "@/features/friends/api/friends-api";
import type { Friend } from "@/features/friends/types/friend";
import { getThemeColorCssVars } from "@/lib/theme-colors";

function getYears(...bookLists: Book[][]) {
  return Array.from(
    new Set(
      bookLists
        .flat()
        .filter((book) => book.completedDate)
        .map((book) => new Date(book.completedDate!).getFullYear()),
    ),
  ).sort((a, b) => b - a);
}

export default function Compare() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<UserProfile>();
  const [friendBooks, setFriendBooks] = useState<Book[]>([]);
  const [friend, setFriend] = useState<Friend>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  const loadCompare = useCallback(async () => {
    setIsLoading(true);
    setError("");

    if (!username) {
      setError("Could not find this friend.");
      setIsLoading(false);
      return;
    }

    try {
      const [books, currentUser, friendData] = await Promise.all([
        getBooks(),
        getCurrentUser(),
        getFriendBooks(username),
      ]);
      setMyBooks(books);
      setUser(currentUser);
      setFriend(friendData.friend);
      setFriendBooks(friendData.books);
    } catch {
      setError("Could not load the compare charts.");
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    void loadCompare();
  }, [loadCompare]);

  const years = useMemo(() => {
    const availableYears = getYears(myBooks, friendBooks);
    if (!availableYears.includes(year)) {
      return [year, ...availableYears].sort((a, b) => b - a);
    }
    return availableYears;
  }, [friendBooks, myBooks, year]);

  if (isLoading) {
    return <ComparePageSkeleton />;
  }

  if (error) {
    return (
      <PageError
        title="Could not load compare"
        message={error}
        onRetry={loadCompare}
      />
    );
  }

  return (
    <div className="min-h-screen space-y-6 p-4">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => navigate("/dashboard")} className="text-xl">
          ←
        </button>
      </div>

      <section className="space-y-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profilePicture || "/default-avatar.png"} />
            <AvatarFallback>
              {(user?.name || "ME").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-left text-xl">Your Score Chart</h1>
        </div>
        <div style={getThemeColorCssVars(user?.themeColor)}>
          <ScoreChart books={myBooks} year={year} years={years} onYearChange={setYear} />
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={friend?.profilePicture || "/default-avatar.png"} />
            <AvatarFallback>
              {(friend?.name || friend?.username || "?").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-left text-xl">
            {friend?.name || friend?.username || "Friend"}'s Score Chart
          </h2>
        </div>
        <div style={getThemeColorCssVars(friend?.themeColor)}>
          <ScoreChart
            books={friendBooks}
            year={year}
            years={years}
            onYearChange={setYear}
          />
        </div>
      </section>
    </div>
  );
}
