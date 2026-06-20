import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { addBook, updateBook } from "../api/books-api";
import BookEditionEditButton from "./book-edition-edit-button";
import CompletionDatePicker from "./completion-date-picker";
import DeleteButton from "./delete-button";
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
  onBookDeleted?: (book: Book) => void | Promise<void>;
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
  onBookDeleted,
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
    ? "h-6 w-full min-w-0 px-1 text-[10px] leading-none"
    : "h-7 w-full px-2 text-[11px]";
  const loadingLabel = compact ? "Adding" : "Adding...";

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
        "pointer-events-none absolute inset-0 z-10 rounded-base bg-background/95 text-foreground opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100",
        compact
          ? "grid grid-cols-2 content-center items-center gap-1 p-1"
          : "flex flex-col items-center justify-center gap-2 p-2",
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
          className={buttonClassName}
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
          ? loadingLabel
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
          ? loadingLabel
          : SHELF_BUTTON_LABELS.currentlyReading}
      </Button>
      <div
        className={cn(
          "flex min-w-0 w-full flex-col gap-1",
          compact &&
            "[&_[data-slot=button]]:w-full [&_[data-slot=button]]:justify-center",
        )}
      >
        <CompletionDatePicker
          date={completedDate}
          onChange={setCompletedDate}
          buttonClassName={buttonClassName}
          iconClassName={compact ? "h-3 w-3" : undefined}
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
          ? loadingLabel
          : SHELF_BUTTON_LABELS.read}
      </Button>
      {mode === "update" && onBookDeleted && (
        <DeleteButton
          className={buttonClassName}
          onConfirm={() => onBookDeleted(existingBook ?? book)}
        />
      )}
      {message && (
        <p
          className={cn(
            "text-center font-heading",
            compact ? "col-span-2 text-[10px] leading-none" : "text-[11px]",
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}
