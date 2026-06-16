import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import type { Book } from "../types/book";

type CurrentlyReadingCardProps = {
  books: Book[];
  onPageChange?: (book: Book, currentPage: number) => void;
  onRemove?: (book: Book) => void;
  renderBookOverlay?: (book: Book, variant?: "compact") => React.ReactNode;
};

export default function CurrentlyReadingCard({
  books,
  onPageChange,
  onRemove,
  renderBookOverlay,
}: CurrentlyReadingCardProps) {
  const [pageInputs, setPageInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    setPageInputs((prev) => {
      const next = { ...prev };
      books.forEach((book) => {
        const key = book._id ?? book.googleId ?? book.title;
        if (next[key] === undefined) {
          next[key] = String(book.currentPage ?? 0);
        }
      });
      return next;
    });
  }, [books]);

  return (
    <div className="min-w-0 rounded-base border-2 border-border bg-main p-6 shadow-shadow text-main-foreground">
      <h3 className="mb-4 text-center">Currently Reading</h3>

      {books.length === 0 ? (
        <p className="text-center text-sm opacity-90">No current reads</p>
      ) : (
        <Carousel opts={{ align: "start" }} className="min-w-0 w-full px-8">
          <CarouselContent className="min-w-0">
            {books.map((book) => {
              const key = book._id ?? book.googleId ?? book.title;
              const progressValue = book.pageCount
                ? Math.min(
                    100,
                    Math.round(((book.currentPage ?? 0) / book.pageCount) * 100),
                  )
                : 0;

              return (
                <CarouselItem key={key} className="min-w-0 basis-full">
                  <div className="min-w-0 rounded-base border-2 border-border bg-background p-3 text-foreground shadow-shadow">
                    <div className="group relative flex gap-3 overflow-hidden rounded-base">
                      <div className="h-32 w-20 flex-none overflow-hidden rounded-sm border-2 border-border bg-secondary-background">
                        {book.thumbnail && (
                          <img
                            src={book.thumbnail}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-3 text-base font-heading leading-tight" title={book.title}>
                          {book.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm opacity-80" title={(book.authors || []).join(", ")}>
                          by {(book.authors || [])[0] || "Unknown"}
                        </p>
                        {book.pageCount && (
                          <p className="mt-2 text-xs opacity-80">
                            {book.pageCount} pages
                          </p>
                        )}
                      </div>
                      {renderBookOverlay?.(book, "compact")}
                    </div>
                    <div className="mt-3 space-y-2">
                      {(onPageChange || onRemove) && (
                        <div className="min-w-0 flex items-center gap-2">
                          {onPageChange && (
                            <>
                              <Input
                                type="number"
                                min="0"
                                max={book.pageCount}
                                value={pageInputs[key] ?? ""}
                                onChange={(e) => {
                                  setPageInputs((prev) => ({
                                    ...prev,
                                    [key]: e.target.value,
                                  }));
                                }}
                                placeholder="Page"
                                className="h-9"
                              />
                              <Button
                                size="sm"
                                onClick={() => {
                                  const rawPage = Number(pageInputs[key] || 0);
                                  const currentPage = Math.max(
                                    0,
                                    Math.min(rawPage, book.pageCount ?? rawPage),
                                  );
                                  setPageInputs((prev) => ({
                                    ...prev,
                                    [key]: String(currentPage),
                                  }));
                                  onPageChange(book, currentPage);
                                }}
                              >
                                Save
                              </Button>
                            </>
                          )}
                          {onRemove && (
                            <Button
                              size="sm"
                              variant="neutral"
                              onClick={() => onRemove(book)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      )}
                      <Progress value={progressValue} />
                      <p className="text-xs font-heading">
                        {book.currentPage ?? 0}
                        {book.pageCount ? ` / ${book.pageCount}` : ""} pages
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      )}
    </div>
  );
}
