import DeleteButton from "./DeleteButton";
import type { Book } from "@/components/ShelfCard";

interface BookCardProps {
  book: Book;
  onDelete: (id: string) => void;
}

export default function BookCard({ book, onDelete }: BookCardProps) {
  return (
    <div
      className="overflow-hidden rounded-base border-2 border-border bg-main shadow-shadow text-center"
    >
      {book.thumbnail && (
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full aspect-[2/3] object-cover"
        />
      )}
      <div className="text-[13px] font-medium leading-tight line-clamp-2">
        {book.title}
      </div>
      <div className="text-[11px] opacity-80 line-clamp-1">
        by {(book.authors || [])[0] || "Unknown"}
      </div>
      <div className="text-[10px] opacity-80 mt-0.5">
        {(book.categories || [])[0] ?? ""}
        {((book.categories || [])[0] && book.pageCount) ? " · " : ""}
        {book.pageCount ?? ""}
      </div>
      <div className="mt-2">
        <DeleteButton onConfirm={() => onDelete(book._id!)} />
      </div>
    </div>
  );
}