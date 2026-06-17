import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { addBook, updateBook } from "../api/books-api";
import BookEditionEditButton from "./book-edition-edit-button";
import CompletionDatePicker from "./completion-date-picker";
import type { Book } from "../types/book";
import {
  getShelfPayload,
  getShelfTarget,
  SHELF_BUTTON_LABELS,
  SHELF_RESULT_LABELS,
  type ShelfTarget,
} from "../utils/shelf-actions";

type FriendBookAddActionsProps = {
  book: Book;
  existingBooks?: Book[];
  onBookAdded?: (book: Book) => void;
  mode?: "copy" | "update";
  compact?: boolean;
  className?: string;
  showEditionEdit?: boolean;
};

function getCopyGoogleId(book: Book) {
  return (
    book.googleId ??
    `friend-copy:${book._id ?? `${book.title}:${(book.authors || []).join(",")}`}`
  );
}

export default function FriendBookAddActions({
  book,
  existingBooks = [],
  onBookAdded,
  mode = "copy",
  compact = false,
  className,
  showEditionEdit = false,
}: FriendBookAddActionsProps) {
  const [addingTarget, setAddingTarget] = useState<ShelfTarget>();
  const [message, setMessage] = useState("");
  const [completedDate, setCompletedDate] = useState<Date>();
  const [localBook, setLocalBook] = useState<Book>();
  const copyGoogleId = getCopyGoogleId(book);
  const existingBook =
    localBook ??
    (mode === "update"
      ? book
      : existingBooks.find((existing) => existing.googleId === copyGoogleId));
  const currentTarget = getShelfTarget(existingBook);
  const buttonClassName = compact
    ? "h-6 w-full px-1 text-[10px]"
    : "h-7 w-full px-2 text-[11px]";

  const handleAdd = async (target: ShelfTarget) => {
    if (currentTarget === target) return;

    if (target === "read" && !completedDate) {
      setMessage("Choose a read date");
      return;
    }

    setAddingTarget(target);
    setMessage("");

    try {
      const payload = getShelfPayload(
        book,
        target,
        completedDate,
        { googleId: mode === "update" ? book.googleId : copyGoogleId },
      );
      const addedBook =
        mode === "update" && book._id
          ? await updateBook(book._id, payload)
          : await addBook(payload);
      setLocalBook(addedBook);
      onBookAdded?.(addedBook);
      setMessage(`Added to ${SHELF_RESULT_LABELS[target]}`);
    } catch {
      setMessage("Could not add");
    } finally {
      setAddingTarget(undefined);
    }
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center rounded-base bg-background/95 text-foreground opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100",
        compact ? "gap-1 p-1" : "gap-2 p-2",
        className,
      )}
      onClick={(event) => event.stopPropagation()}
    >
      {showEditionEdit && mode === "update" && (
        <BookEditionEditButton
          book={existingBook ?? book}
          onBookUpdated={(updatedBook) => {
            setLocalBook(updatedBook);
            onBookAdded?.(updatedBook);
          }}
          compact={compact}
        />
      )}
      <Button
        type="button"
        size="sm"
        className={buttonClassName}
        disabled={Boolean(addingTarget) || currentTarget === "wantToRead"}
        onClick={() => void handleAdd("wantToRead")}
      >
        {addingTarget === "wantToRead"
            ? "Adding..."
            : SHELF_BUTTON_LABELS.wantToRead}
      </Button>
      <Button
        type="button"
        size="sm"
        className={buttonClassName}
        disabled={Boolean(addingTarget) || currentTarget === "currentlyReading"}
        onClick={() => void handleAdd("currentlyReading")}
      >
        {addingTarget === "currentlyReading"
            ? "Adding..."
            : SHELF_BUTTON_LABELS.currentlyReading}
      </Button>
      <div className="flex w-full flex-col gap-1">
        <CompletionDatePicker
          date={completedDate}
          onChange={setCompletedDate}
        />
      </div>
      <Button
        type="button"
        size="sm"
        className={buttonClassName}
        disabled={Boolean(addingTarget) || currentTarget === "read" || !completedDate}
        onClick={() => void handleAdd("read")}
      >
        {addingTarget === "read"
            ? "Adding..."
            : SHELF_BUTTON_LABELS.read}
      </Button>
      {message && <p className="text-center text-[11px] font-heading">{message}</p>}
    </div>
  );
}
