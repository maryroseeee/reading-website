import * as React from "react";
import { cn } from "@/lib/utils"; // if you don't have cn, remove and inline className joins
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
  title?: string;
  books: Book[];
  className?: string;
  /** show the left arrow; the goal image hides it */
  showPrev?: boolean;
  /** place the next arrow tight to the right edge like the mock */
  nextOffsetClassName?: string; // e.g. "right-3"
}

/**
 * Neobrutalist Shelf using the library's Card + Carousel assets.
 * Matches the reference mock: orange card, horizontal book cards, right arrow.
 */
export default function ShelfCard({
  title,
  books,
  className,
  showPrev = false,
  nextOffsetClassName = "right-3",
}: ShelfCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>=
      </CardHeader>
      <CardContent>
        
      <Carousel className="w-full max-w-[200px]">
      <CarouselContent className="-ml-4">
          {books.length === 0 && (
            <div className="p-3 text-sm opacity-80">No books yet.</div>
          )}
          {books.map((b) => (
            <CarouselItem
              key={b._id ?? b.title}
              className="pl-4 basis-48 sm:basis-56 md:basis-64 lg:basis-72"
            >
              <Card className="rounded-base border-2 border-border bg-main shadow-shadow">
                <CardContent className="p-3">
                  {b.thumbnail && (
                    <img
                      src={b.thumbnail}
                      alt={b.title}
                      className="w-full h-40 sm:h-48 object-cover rounded-sm mb-2 border-2 border-border"
                    />
                  )}
                  <div className="text-sm font-medium leading-tight line-clamp-2">
                    {b.title}
                  </div>
                  <div className="text-xs opacity-80 line-clamp-1">
                    by {(b.authors || [])[0] || "Unknown"}
                  </div>
                  <div className="text-[11px] opacity-80 mt-1">
                    {(b.categories || [])[0] ? (
                      <span>{(b.categories || [])[0]}</span>
                    ) : null}
                    {((b.categories || [])[0] && b.pageCount) ? " · " : ""}
                    {b.pageCount ? <span>{b.pageCount}</span> : null}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>

      </CardContent>
      
    </Card>
  )}