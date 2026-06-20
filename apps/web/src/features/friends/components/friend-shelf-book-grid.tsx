import { Progress } from "@/components/ui/progress";
import BookCard from "@/features/books/components/book-card";
import FriendBookAddActions from "@/features/books/components/friend-book-add-actions";
import type { Book } from "@/features/books/types/book";

import {
  getFriendShelfProgressValue,
  type FriendShelfType,
} from "../utils/friend-shelves";

type FriendShelfBookGridProps = {
  books: Book[];
  myBooks: Book[];
  shelfType: FriendShelfType;
  onBookAdded: (book: Book) => void;
};

export default function FriendShelfBookGrid({
  books,
  myBooks,
  shelfType,
  onBookAdded,
}: FriendShelfBookGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {books.map((book) => (
        <BookCard
          key={book._id ?? book.googleId ?? book.title}
          book={book}
          hoverAction={
            <FriendBookAddActions
              book={book}
              existingBooks={myBooks}
              onBookAdded={onBookAdded}
            />
          }
          action={
            shelfType === "currently-reading" ? (
              <div className="space-y-1 rounded-base border-2 border-border bg-background p-2 text-xs text-foreground shadow-shadow">
                <Progress value={getFriendShelfProgressValue(book)} />
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
  );
}
