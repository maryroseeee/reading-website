import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { updateBook } from "../api/books-api";
import type { Book } from "../types/book";
import CompletionDatePicker from "./completion-date-picker";

type ShelfTarget = "wantToRead" | "currentlyReading" | "read";

type BookShelfChangeButtonProps = {
  book: Book;
  onBookUpdated?: (book: Book) => void;
};

const TARGET_LABELS: Record<ShelfTarget, string> = {
  wantToRead: "want to read",
  currentlyReading: "currently reading",
  read: "read books",
};

const ALREADY_LABELS: Record<ShelfTarget, string> = {
  wantToRead: "Already want to read",
  currentlyReading: "Already current",
  read: "Already read",
};

function getShelfTarget(book: Book): ShelfTarget | undefined {
  if (book.wantToRead) return "wantToRead";
  if (book.currentlyReading) return "currentlyReading";
  if (book.completedDate) return "read";
  return undefined;
}

function getShelfPayload(book: Book, target: ShelfTarget, completedDate?: Date): Book {
  return {
    ...book,
    completedDate: target === "read" ? completedDate?.toISOString() : undefined,
    currentlyReading: target === "currentlyReading",
    wantToRead: target === "wantToRead",
    currentPage: target === "currentlyReading" ? book.currentPage ?? 0 : 0,
  };
}

export default function BookShelfChangeButton({
  book,
  onBookUpdated,
}: BookShelfChangeButtonProps) {
  const [open, setOpen] = useState(false);
  const [completedDate, setCompletedDate] = useState<Date | undefined>(
    book.completedDate ? new Date(book.completedDate) : undefined,
  );
  const [currentBook, setCurrentBook] = useState(book);
  const [updatingTarget, setUpdatingTarget] = useState<ShelfTarget>();
  const [message, setMessage] = useState("");
  const currentTarget = getShelfTarget(currentBook);

  const handleChangeShelf = async (target: ShelfTarget) => {
    if (!book._id || currentTarget === target) return;

    if (target === "read" && !completedDate) {
      setMessage("Choose a read date");
      return;
    }

    setUpdatingTarget(target);
    setMessage("");

    try {
      const updated = await updateBook(
        book._id,
        getShelfPayload(currentBook, target, completedDate),
      );
      setCurrentBook(updated);
      onBookUpdated?.(updated);
      setMessage(`Moved to ${TARGET_LABELS[target]}`);
    } catch {
      setMessage("Could not move book");
    } finally {
      setUpdatingTarget(undefined);
    }
  };

  const buttonClassName = "h-8 w-full px-2 text-xs";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" disabled={!book._id}>
          Change shelf
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Shelf</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <p className="font-heading leading-tight">{currentBook.title}</p>
            <p className="text-sm opacity-80">
              by {(currentBook.authors || [])[0] || "Unknown"}
            </p>
          </div>
          <div className="grid gap-2">
            <Button
              type="button"
              size="sm"
              className={buttonClassName}
              disabled={Boolean(updatingTarget) || currentTarget === "wantToRead"}
              onClick={() => void handleChangeShelf("wantToRead")}
            >
              {currentTarget === "wantToRead"
                ? ALREADY_LABELS.wantToRead
                : updatingTarget === "wantToRead"
                  ? "Moving..."
                  : "Want to read"}
            </Button>
            <Button
              type="button"
              size="sm"
              className={buttonClassName}
              disabled={
                Boolean(updatingTarget) || currentTarget === "currentlyReading"
              }
              onClick={() => void handleChangeShelf("currentlyReading")}
            >
              {currentTarget === "currentlyReading"
                ? ALREADY_LABELS.currentlyReading
                : updatingTarget === "currentlyReading"
                  ? "Moving..."
                  : "Currently reading"}
            </Button>
            <CompletionDatePicker date={completedDate} onChange={setCompletedDate} />
            <Button
              type="button"
              size="sm"
              className={buttonClassName}
              disabled={
                Boolean(updatingTarget) || currentTarget === "read" || !completedDate
              }
              onClick={() => void handleChangeShelf("read")}
            >
              {currentTarget === "read"
                ? ALREADY_LABELS.read
                : updatingTarget === "read"
                  ? "Moving..."
                  : "Read"}
            </Button>
          </div>
          {message && <p className="text-sm font-heading">{message}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
