import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircleIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import ThemeColorSelect from "@/components/theme-color-select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ShelfCard from "@/features/books/components/shelf-card";
import {Button} from "@/components/ui/button"
import AddBookCombobox from "@/features/books/components/add-book-combobox";
import CurrentlyReadingCard from "@/features/books/components/currently-reading-card";
import FriendBookAddActions from "@/features/books/components/friend-book-add-actions";
import ScoreChart from "@/features/books/components/score-chart";
import FriendsCard from "@/features/friends/components/friends-card";
import FriendRequestsCombobox from "@/features/friends/components/friend-requests-combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getCurrentUser,
  logout,
  updateThemeColor,
} from "@/features/auth/api/auth-api";
import EditProfileForm from "@/features/auth/components/edit-profile-form";
import { getBooks, updateBook } from "@/features/books/api/books-api";
import type { Book } from "@/features/books/types/book";
import { getFriendRequests, getFriends } from "@/features/friends/api/friends-api";
import type { Friend } from "@/features/friends/types/friend";
import type { UserProfile } from "@/features/auth/types/user";
import { applyThemeColor } from "@/lib/theme-colors";

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile>({ email: "" });
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [chartYear, setChartYear] = useState(new Date().getFullYear());
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<Friend[]>([]);

  useEffect(() => {
    getFriends()
      .then((data) => setFriends(data))
      .catch(() => undefined);
    getFriendRequests()
      .then((data) => setRequests(data))
      .catch(() => undefined);
    getCurrentUser()
      .then((data) => {
        setUser(data);
        applyThemeColor(data.themeColor ?? "pink", false);
      })
      .catch(() => undefined);
    getBooks().then((data) => setBooks(data));
  }, []);

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
      // Keep the immediate visual selection; a later refresh will use the saved profile value.
    }
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

  const renderBookMoveActions = (book: Book, variant?: "compact") => (
    <FriendBookAddActions
      book={book}
      mode="update"
      onBookAdded={handleBookMoved}
      compact={variant === "compact"}
      showEditionEdit
    />
  );

  const years = Array.from(
    new Set(
      books
        .filter((b) => b.completedDate)
        .map((b) => new Date(b.completedDate!).getFullYear())
    )
  ).sort((a, b) => b - a);
  if (!years.includes(chartYear)) {
    years.push(chartYear);
    years.sort((a, b) => b - a);
  }

  const currentlyReadingBooks = books.filter((book) => book.currentlyReading);
  const wantToReadBooks = books.filter((book) => book.wantToRead);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
      }}
      className="gap-8 px-6 pt-6 pb-24 items-start"
    >
     <div className="min-w-0 flex flex-col gap-4">
        <div className="rounded-base border-2 border-border bg-main p-6 shadow-shadow text-main-foreground">
        <div className="mb-4 rounded-base border-2 border-border bg-background shadow-shadow p-3">
          <div className="rounded-base border-2 border-border bg-background flex items-center justify-center h-52">
            <Avatar className="h-44 w-44">
            <AvatarImage src={user.profilePicture || "/default-avatar.png"} alt="avatar" />
              <AvatarFallback>
                {(user.name || "ME").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <p className="break-all opacity-90 text-lg text-center">
        
        {user.name || "Your Name"}
        </p>
        <p className="break-all opacity-90 text-sm text-center">
        {user.username ? `@${user.username}` : "@username"}
        </p>
        {user.bio && (
          <p className="break-all opacity-90 text-sm text-center">{user.bio}</p>
        )}
        
        
        <div className="flex justify-center mt-4 gap-2">
        
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-base border-2 border-border bg-background px-4 py-2 text-sm text-foreground shadow-shadow">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <EditProfileForm
                onSuccess={(data) => {
                  setUser((u) => ({ ...u, ...data }));
                  setOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>

           <Button
            onClick={handleLogout}
            className="rounded-base border-2 border-border bg-background px-4 py-2 text-sm text-foreground shadow-shadow"
          >
            Logout
          </Button>
        </div>
        <ThemeColorSelect
          value={user.themeColor}
          onChange={handleThemeColorChange}
        />
        </div>
        <CurrentlyReadingCard
          books={currentlyReadingBooks}
          onPageChange={handleCurrentPageChange}
          onRemove={handleRemoveCurrentlyReading}
          renderBookOverlay={renderBookMoveActions}
        />
        <FriendsCard
          friends={friends}
          currentUsername={user.username}
          onFriendRemoved={(username) =>
            setFriends((prev) => prev.filter((f) => f.username !== username))
          }
          friendRequestsControl={
            <FriendRequestsCombobox
              requests={requests}
              onAccept={(f) => {
                setFriends((prev) => [...prev, f]);
                setRequests((prev) => prev.filter((r) => r._id !== f._id));
              }}
              onReject={(id) =>
                setRequests((prev) => prev.filter((r) => r._id !== id))
              }
            />
          }
        />
      </div>

      <div className="min-w-0 flex flex-col gap-4">
        {user.email && !user.username && (
          <Alert className="bg-main text-main-foreground">
            <AlertCircleIcon />
            <AlertTitle>Set your username</AlertTitle>
            <AlertDescription>
              You will not be able to make friends until you add a username.
              Click Edit Profile to add one.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex justify-end">
          
        <AddBookCombobox
            books={books}
            onBookAdded={(b) =>
              setBooks((prev) => [
                ...prev.filter((book) => book.googleId !== b.googleId),
                b,
              ])
            } />
        </div>

        
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
          renderBookOverlay={renderBookMoveActions}
        />
        <div className="flex justify-end -mt-1">
          <Button
            onClick={() => navigate("/read")}
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
          renderBookOverlay={renderBookMoveActions}
        />
        <div className="flex justify-end -mt-1">
          <Button
            onClick={() => navigate("/want-to-read")}
            className="rounded-base border-2 border-border bg-main shadow-shadow px-4 py-2 text-sm"
          >
            Go to "want to read"
          </Button>
        </div>

        
      </div>
    </div>
  );
}
