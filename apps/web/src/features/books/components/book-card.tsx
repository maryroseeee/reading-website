import { type ReactNode } from "react";

import type { Book } from "../types/book";

interface BookCardProps {
  book: Book;
  action?: ReactNode;
}

export default function BookCard({ book, action }: BookCardProps) {
  const pageCount = book.pageCount ?? 0;
  const before = 1+(pageCount / 100);
  const points = before.toFixed(2);
  return (
    <div>
    <div className="overflow-hidden rounded-base border-2 border-border bg-main shadow-shadow text-center">
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
          {book.categories}
          {book.categories && book.pageCount ? " · " : ""}
          {book.pageCount ? `${book.pageCount} pages` : ""}
        </div>
        <div className="text-[10px] opacity-80">
          {points} pts
        </div>
    </div>

    {action && <div className="mt-2">{action}</div>}
    </div>
    
  );
}
