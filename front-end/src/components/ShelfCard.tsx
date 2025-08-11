import * as React from "react";
// NOTE: avoiding cn() to keep this file drop‑in simple.
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type Book = {
  _id?: string;
  title: string;
  authors?: string[];
  pageCount?: number;
  categories?: string[];
  thumbnail?: string;
};

interface ShelfCardProps {
  books: Book[];
  className?: string;
  showPrev?: boolean; // hidden by default to match the mock
  nextOffsetClassName?: string; // e.g. "right-3"
}

/**
 * Neobrutalist shelf card using the library's Carousel asset.
 * Matches the reference mock: big orange card, horizontal items, right arrow only.
 */
export default function ShelfCard({
  books,
  className = "",
  showPrev = true, // show back arrow by default
  nextOffsetClassName = "right-3",
}: ShelfCardProps) {
  return (
    <div
      className={
        "rounded-base border-2 border-border bg-main shadow-shadow text-main-foreground p-2 relative " +
        className
      }
    >
      <Carousel opts={{ align: "start" }} className="w-full">
        {/* tighter spacing so the shelf is shorter and cleaner */}
        <CarouselContent className="-ml-2">
          {books.map((b) => (
            <CarouselItem
              key={b._id ?? b.title}
              className="pl-2 basis-[150px]"
            >
              <div className="rounded-base border-2 border-border bg-background shadow-shadow p-1">
                {/* Fixed 2:3 ratio; smaller to reduce shelf height */}
                <div
                  className="w-full mb-1 border-2 border-border rounded-sm overflow-hidden bg-background"
                  style={{ aspectRatio: "1 / 1.5" }}
                >
                  {b.thumbnail && (
                    <img
                      src={b.thumbnail}
                      alt={b.title}
                      className="w-[128px] h-[192px] mb-1 border-2 border-border rounded-sm overflow-hidden bg-background"
                    />
                  )}
                </div>

                <div className="text-[13px] font-medium leading-tight line-clamp-2">
                  {b.title}
                </div>
                <div className="text-[11px] opacity-80 line-clamp-1">
                  by {(b.authors || [])[0] || "Unknown"}
                </div>
                <div className="text-[10px] opacity-80 mt-0.5">
                  {(b.categories || [])[0] ?? ""}
                  {((b.categories || [])[0] && b.pageCount) ? " · " : ""}
                  {b.pageCount ?? ""}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* arrows on both sides, positioned close to edges */}
        <CarouselPrevious className={showPrev ? "left-3" : "hidden"} />
        <CarouselNext className={nextOffsetClassName + " !right-3"} />
      </Carousel>
    </div>
  );
}
