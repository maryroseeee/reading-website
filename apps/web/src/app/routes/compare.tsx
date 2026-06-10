import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import type { UserProfile } from "@/features/auth/types/user";
import { getBooks } from "@/features/books/api/books-api";
import ReadingTable from "@/features/books/components/reading-table";
import YearSelect from "@/features/books/components/year-select";
import type { Book } from "@/features/books/types/book";
import { getFriendBooks } from "@/features/friends/api/friends-api";
import type { Friend } from "@/features/friends/types/friend";

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
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!username) return;

    Promise.all([getBooks(), getCurrentUser()])
      .then(([books, currentUser]) => {
        setMyBooks(books);
        setUser(currentUser);
      })
      .catch(() => {
        setError("Could not load your chart.");
      });

    getFriendBooks(username)
      .then((friendData) => {
        setFriend(friendData.friend);
        setFriendBooks(friendData.books);
      })
      .catch(() => {
        setError("Could not load your friend's chart.");
      });
  }, [username]);

  const years = useMemo(() => {
    const availableYears = getYears(myBooks, friendBooks);
    if (!availableYears.includes(year)) {
      return [year, ...availableYears].sort((a, b) => b - a);
    }
    return availableYears;
  }, [friendBooks, myBooks, year]);

  return (
    <div className="min-h-screen space-y-6 p-4">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => navigate("/dashboard")} className="text-xl">
          ←
        </button>
        <YearSelect years={years} selected={year} onChange={setYear} />
      </div>

      {error && <p className="text-sm opacity-80">{error}</p>}

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
        <ReadingTable books={myBooks} year={year} />
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
        <ReadingTable books={friendBooks} year={year} />
      </section>
    </div>
  );
}
