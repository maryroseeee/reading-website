import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import type { Book } from "../types/book";

interface ShelfCardProps {
  books: Book[];
  className?: string;
  title?: string;
  showPrev?: boolean;
  nextOffsetClassName?: string;
}

export default function ShelfCard({
  books,
  className = "",
  title = "All Read Books",
  showPrev = true,
  nextOffsetClassName = "right-3",
}: ShelfCardProps) {
    const sortedBooks = React.useMemo(
        () =>
          [...books].sort((a, b) => {
            const dateA = a.completedDate
              ? new Date(a.completedDate).getTime()
              : 0;
            const dateB = b.completedDate
              ? new Date(b.completedDate).getTime()
              : 0;
            return dateB - dateA;
          }),
        [books]
      );
  return (
    <div className={className}>
      <h2 className="mb-2 text-left text-xl">{title}</h2>
      <div className="rounded-base border-2 border-border bg-main shadow-shadow text-main-foreground p-2 relative">

      <Carousel opts={{ align: "start" }} className="w-full px-10">
        <CarouselContent className="-ml-2">
          {sortedBooks.map((b) => (
            <CarouselItem
              key={b._id ?? b.title}
              className="pl-2 basis-1/2 md:basis-1/3 xl:basis-1/4"
            >
              {/* FIXED HEIGHT CARD so all are equal */}
              <div className="rounded-base border-2 border-border bg-background shadow-shadow p-2 h-[280px] overflow-hidden flex flex-col">
                {/* Cover: uniform 2:3, capped so text fits */}
                <div
                  className="w-full border-2 border-border rounded-sm overflow-hidden bg-background flex-none"
                  style={{ aspectRatio: "2 / 3", maxHeight: 196 }}
                >
                  {b.thumbnail && (
                    <img
                      src={b.thumbnail}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="mt-2 min-h-0">
                  <div className="text-[13px] font-medium leading-tight line-clamp-2" title={b.title}>
                    {b.title}
                  </div>
                  <div className="text-[11px] opacity-80 line-clamp-2" title={(b.authors || []).join(", ")}> 
                    by {(b.authors || [])[0] || "Unknown"}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className={showPrev ? "left-3" : "hidden"} />
        <CarouselNext className={nextOffsetClassName + " !right-3"} />
      </Carousel>
      </div>
    </div>
  );
}
