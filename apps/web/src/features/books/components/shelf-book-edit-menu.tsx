import type { Book } from "../types/book";
import type { BookShelf } from "../utils/shelf-books";
import BookEditMenu from "./book-edit-menu";
import BookEditionEditButton from "./book-edition-edit-button";
import BookShelfChangeButton from "./book-shelf-change-button";
import CompletionDatePicker from "./completion-date-picker";
import DeleteButton from "./delete-button";

type ShelfBookEditMenuProps = {
  book: Book;
  shelf: BookShelf;
  onBookUpdated: (book: Book) => void;
  onDelete: (id: string) => void;
  onReadDateChange?: (id: string, date?: Date) => void;
};

export default function ShelfBookEditMenu({
  book,
  shelf,
  onBookUpdated,
  onDelete,
  onReadDateChange,
}: ShelfBookEditMenuProps) {
  if (!book._id) return null;

  return (
    <BookEditMenu>
      {shelf === "read" && onReadDateChange && (
        <div className="space-y-1">
          <p className="text-xs font-heading">Read date</p>
          <CompletionDatePicker
            date={book.completedDate ? new Date(book.completedDate) : undefined}
            onChange={(date) => onReadDateChange(book._id!, date)}
          />
        </div>
      )}
      <BookShelfChangeButton book={book} onBookUpdated={onBookUpdated} />
      <BookEditionEditButton book={book} onBookUpdated={onBookUpdated} />
      <DeleteButton onConfirm={() => onDelete(book._id!)} />
    </BookEditMenu>
  );
}
