import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { updateBook } from "../api/books-api";
import type { Book } from "../types/book";
import {
  getShelfPayload,
  getShelfTarget,
  SHELF_BUTTON_LABELS,
  SHELF_RESULT_LABELS,
  type ShelfTarget,
} from "../utils/shelf-actions";
import CompletionDatePicker from "./completion-date-picker";

type BookShelfChangeButtonProps = {
  book: Book;
  onBookUpdated?: (book: Book) => void;
  className?: string;
};

export default function BookShelfChangeButton({
  book,
  onBookUpdated,
  className,
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
        getShelfPayload(currentBook, target, completedDate, {
          includeExistingFields: true,
          preserveCurrentPage: true,
        }),
      );
      setCurrentBook(updated);
      onBookUpdated?.(updated);
      setMessage(`Moved to ${SHELF_RESULT_LABELS[target]}`);
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
        <Button
          type="button"
          size="sm"
          className={cn("w-full", className)}
          disabled={!book._id}
        >
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
              {updatingTarget === "wantToRead"
                  ? "Moving..."
                  : SHELF_BUTTON_LABELS.wantToRead}
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
              {updatingTarget === "currentlyReading"
                  ? "Moving..."
                  : SHELF_BUTTON_LABELS.currentlyReading}
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
              {updatingTarget === "read"
                  ? "Moving..."
                  : SHELF_BUTTON_LABELS.read}
            </Button>
          </div>
          {message && <p className="text-sm font-heading">{message}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
