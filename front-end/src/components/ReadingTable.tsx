// src/components/ReadingTable.tsx
import type { Book } from "@/components/ShelfCard";
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
};

// helper: safely pull fields from your Book API
function toRow(b: Book) {
  const title = b.title ?? "";
  const pages = Number(b.pageCount ?? 0);
  const author = (b.authors && b.authors[0]) || "Unknown";
  const genre = (b.categories && b.categories[0]) || "";
  const points = 1 + (pages / 100); 
  return { title, pages, author, points, genre };
}

export default function ReadingTable({
  books,
}: ReadingTableProps) {
  const rows = books.map(toRow);

  const count = rows.length; // =COUNT
  const pagesTotal = rows.reduce((s, r) => s + r.pages, 0);
  const pagesHundreds = pagesTotal / 100; // =SUM(Pages)/100
  const pointsSum = rows.reduce((s, r) => s + r.points, 0); // =SUM(Points)

  return (
    <div>
      <Table>
       

        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">BOOKS READ</TableHead>
            <TableHead className="w-[10%] text-right">Pages</TableHead>
            <TableHead className="w-[30%]">Author</TableHead>
            <TableHead className="w-[10%] text-right">Points</TableHead>
            <TableHead className="w-[10%]">genre</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((r, idx) => (
            <TableRow key={`${r.title}-${idx}`}>
              <TableCell className="font-base truncate" title={r.title}>
                {r.title}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {r.pages}
              </TableCell>
              <TableCell className="truncate" title={r.author}>
                {r.author}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {r.points.toFixed(2)}
              </TableCell>
              <TableCell className="truncate" title={r.genre}>
                {r.genre}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell className="font-medium">Total: {count}</TableCell>
            <TableCell className="text-right tabular-nums">
              {pagesHundreds.toFixed(2)}
            </TableCell>
            <TableCell />
            <TableCell className="text-right tabular-nums">
              {pointsSum.toFixed(2)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
