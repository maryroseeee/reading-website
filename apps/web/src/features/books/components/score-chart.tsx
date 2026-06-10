import ReadingTable from "./reading-table";
import YearSelect from "./year-select";
import type { Book } from "../types/book";

type ScoreChartProps = {
  books: Book[];
  year: number;
  years: number[];
  onYearChange: (year: number) => void;
};

export default function ScoreChart({
  books,
  year,
  years,
  onYearChange,
}: ScoreChartProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <YearSelect years={years} selected={year} onChange={onYearChange} />
        <h2 className="text-left text-xl">Score</h2>
      </div>
      <ReadingTable books={books} year={year} />
    </div>
  );
}
