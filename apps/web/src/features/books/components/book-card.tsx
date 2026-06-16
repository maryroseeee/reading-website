import { type ReactNode } from "react";

import type { Book } from "../types/book";

interface BookCardProps {
  book: Book;
  action?: ReactNode;
  hoverAction?: ReactNode;
}

export default function BookCard({ book, action, hoverAction }: BookCardProps) {
  const pageCount = book.pageCount ?? 0;
  const before = 1+(pageCount / 100);
  const points = before.toFixed(2);
  return (
    <div className="flex h-full flex-col">
    <div className="group relative flex h-[390px] flex-col overflow-hidden rounded-base border-2 border-border bg-main shadow-shadow text-center">
        <div className="min-h-[220px] w-full flex-1 overflow-hidden bg-secondary-background">
          {book.thumbnail && (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="h-full w-full object-cover"
          />
          )}
        </div>
        <div className="flex-none px-2 py-2">
        <div className="text-[13px] font-medium leading-tight line-clamp-4" title={book.title}>
          {book.title}
        </div>
        <div className="text-[11px] opacity-80 line-clamp-2" title={(book.authors || []).join(", ")}>
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
        {hoverAction}
    </div>

    {action && <div className="mt-2">{action}</div>}
    </div>
    
  );
}
