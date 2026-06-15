// src/components/ReadingTable.tsx
import type { Book } from "../types/book";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ReadingTableProps = {
  books: Book[];
  caption?: string;
  year?: number;
};

function toRow(b: Book) {
  const title = b.title ?? "";
  const pages = Number(b.pageCount ?? 0);
  const author = (b.authors && b.authors[0]) || "Unknown";
  const genre = (b.categories && b.categories[0]) || "";
  const points = 1 + (pages / 100); 
  return { title, pages, author, points, genre };
}

export default function ReadingTable({ books, year }: ReadingTableProps) {
    const selectedYear = year ?? new Date().getFullYear();
  const rows = books
    .filter(
      (b) =>
        b.completedDate &&
        new Date(b.completedDate).getFullYear() === selectedYear
    )
    .sort((a, b) => {
      const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
      const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
      return dateB - dateA;
    })
    .map(toRow);


  const count = rows.length; // =COUNT
  const pagesTotal = rows.reduce((s, r) => s + r.pages, 0);
  const pointsSum = rows.reduce((s, r) => s + r.points, 0);

  return (
    <div>
      <Table>
       

        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%] text-center">Books Read</TableHead>
            <TableHead className="w-[10%] text-center">Pages</TableHead>
            <TableHead className="w-[30%] text-center">Author</TableHead>
            <TableHead className="w-[10%] text-center">Points</TableHead>
            <TableHead className="w-[10%] text-center">Genre</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((r, idx) => (
            <TableRow key={`${r.title}-${idx}`}>
              <TableCell className="truncate text-center font-base" title={r.title}>
                {r.title}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {r.pages}
              </TableCell>
              <TableCell className="truncate text-center" title={r.author}>
                {r.author}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {r.points.toFixed(2)}
              </TableCell>
              <TableCell className="truncate text-center" title={r.genre}>
                {r.genre}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell className="text-center text-lg font-heading">Total: {count}</TableCell>
            <TableCell className="text-center text-lg font-heading tabular-nums">
              {pagesTotal}
            </TableCell>
            <TableCell />
            <TableCell className="text-center text-2xl font-heading tabular-nums">
              {pointsSum.toFixed(2)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
