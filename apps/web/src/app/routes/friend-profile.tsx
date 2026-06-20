import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PageError } from "@/components/page-state";
import { FriendProfilePageSkeleton } from "@/components/page-skeletons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CurrentlyReadingCard from "@/features/books/components/currently-reading-card";
import FriendBookAddActions from "@/features/books/components/friend-book-add-actions";
import ScoreChart from "@/features/books/components/score-chart";
import ShelfCard from "@/features/books/components/shelf-card";
import { getBooks } from "@/features/books/api/books-api";
import type { Book } from "@/features/books/types/book";
import {
  getFriendBooks,
  getFriendFriends,
} from "@/features/friends/api/friends-api";
import type { Friend } from "@/features/friends/types/friend";
import { useTemporaryThemeColor } from "@/lib/use-temporary-theme-color";

function getYears(books: Book[], selectedYear: number) {
  const years = Array.from(
    new Set(
      books
        .filter((book) => book.completedDate)
        .map((book) => new Date(book.completedDate!).getFullYear()),
    ),
  ).sort((a, b) => b - a);

  if (!years.includes(selectedYear)) {
    years.push(selectedYear);
    years.sort((a, b) => b - a);
  }

  return years;
}

export default function FriendProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [friend, setFriend] = useState<Friend>();
  const [friendFriends, setFriendFriends] = useState<Friend[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [chartYear, setChartYear] = useState(new Date().getFullYear());

  const loadFriendProfile = useCallback(async () => {
    setIsLoading(true);
    setError("");

    if (!username) {
      setError("Could not find this friend's profile.");
      setIsLoading(false);
      return;
    }

    const [friendBooksResult, friendFriendsResult, myBooksResult] =
      await Promise.allSettled([
        getFriendBooks(username),
        getFriendFriends(username),
        getBooks(),
      ]);

    if (friendBooksResult.status === "fulfilled") {
      setFriend(friendBooksResult.value.friend);
      setBooks(friendBooksResult.value.books);
    } else {
      setError("Could not load this friend's profile.");
    }

    if (friendFriendsResult.status === "fulfilled") {
      setFriendFriends(friendFriendsResult.value);
    }

    if (myBooksResult.status === "fulfilled") {
      setMyBooks(myBooksResult.value);
    }

    setIsLoading(false);
  }, [username]);

  useEffect(() => {
    void loadFriendProfile();
  }, [loadFriendProfile]);

  useTemporaryThemeColor(friend?.themeColor);

  const years = useMemo(
    () => getYears(books, chartYear),
    [books, chartYear],
  );
  const currentlyReadingBooks = useMemo(
    () => books.filter((book) => book.currentlyReading),
    [books],
  );
  const wantToReadBooks = useMemo(
    () => books.filter((book) => book.wantToRead),
    [books],
  );
  const friendProfileKey = friend?.username ?? username;
  const getFriendShelfPath = (shelf: string) =>
    friendProfileKey
      ? `/friends/${encodeURIComponent(friendProfileKey)}/books/${shelf}`
      : "";
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
  const renderFriendBookActions = (book: Book, variant?: "compact") => (
    <FriendBookAddActions
      book={book}
      existingBooks={myBooks}
      onBookAdded={handleMyBookAdded}
      compact={variant === "compact"}
    />
  );

  if (isLoading) {
    return <FriendProfilePageSkeleton />;
  }

  if (error) {
    return (
      <PageError
        title="Could not load friend profile"
        message={error}
        onRetry={loadFriendProfile}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
      }}
      className="gap-8 p-6 items-start"
    >
      <div className="min-w-0 flex flex-col gap-4">
        <button onClick={() => navigate("/friends")} className="self-start text-xl">
          ←
        </button>
        <div className="rounded-base border-2 border-border bg-main p-6 shadow-shadow text-main-foreground">
          <div className="mb-4 rounded-base border-2 border-border bg-background shadow-shadow p-3">
            <div className="rounded-base border-2 border-border bg-background flex items-center justify-center h-52">
              <Avatar className="h-44 w-44">
                <AvatarImage src={friend?.profilePicture || "/default-avatar.png"} />
                <AvatarFallback>
                  {(friend?.name || friend?.username || "?").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <p className="break-all opacity-90 text-lg text-center">
            {friend?.name || "Friend"}
          </p>
          {friend?.username && (
            <p className="break-all opacity-90 text-sm text-center">
              @{friend.username}
            </p>
          )}
        </div>
        <CurrentlyReadingCard
          books={currentlyReadingBooks}
          renderBookOverlay={renderFriendBookActions}
        />

        <div className="rounded-base border-2 border-border bg-main p-4 shadow-shadow text-main-foreground">
          <h2 className="mb-3 text-center text-lg">Friends</h2>
          {friendFriends.length === 0 ? (
            <p className="text-center text-sm opacity-80">No friends to show</p>
          ) : (
            <Carousel opts={{ align: "start" }} className="w-full px-6 pt-1">
              <CarouselContent className="-ml-2 py-2">
              {friendFriends.map((f) => (
                <CarouselItem key={f._id} className="pl-2 basis-[92px]">
                  <button
                    type="button"
                    className="flex w-[84px] min-w-0 flex-col items-center"
                    onClick={() =>
                      f.username && navigate(`/friends/${encodeURIComponent(f.username)}`)
                    }
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={f.profilePicture || "/default-avatar.png"} />
                      <AvatarFallback>
                        {(f.name || f.username || "?").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className="mt-1 block h-8 w-full overflow-hidden text-center text-[11px] leading-4"
                      title={f.name || f.username}
                    >
                      {f.name || f.username}
                    </span>
                  </button>
                </CarouselItem>
              ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          )}
        </div>
      </div>

      <div className="min-w-0 flex flex-col gap-4">
        <ScoreChart
          books={books}
          year={chartYear}
          years={years}
          onYearChange={setChartYear}
        />
        <ShelfCard
          books={books}
          className="min-w-0"
          nextOffsetClassName="right-3"
          emptyMessage="No read books"
          renderBookOverlay={renderFriendBookActions}
        />
        <div className="flex justify-end -mt-1">
          <Button
            onClick={() => navigate(getFriendShelfPath("read"))}
            disabled={!friendProfileKey}
            className="rounded-base border-2 border-border bg-main shadow-shadow px-4 py-2 text-sm"
          >
            Go to "read books"
          </Button>
        </div>
        <ShelfCard
          books={wantToReadBooks}
          className="min-w-0"
          title="Want To Read"
          includeUndated
          nextOffsetClassName="right-3"
          emptyMessage="No want-to-read books"
          renderBookOverlay={renderFriendBookActions}
        />
        <div className="flex justify-end -mt-1">
          <Button
            onClick={() => navigate(getFriendShelfPath("want-to-read"))}
            disabled={!friendProfileKey}
            className="rounded-base border-2 border-border bg-main shadow-shadow px-4 py-2 text-sm"
          >
            Go to "want to read"
          </Button>
        </div>
      </div>
    </div>
  );
}
