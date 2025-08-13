import type { Book } from "@/components/ShelfCard";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CURRENT_YEAR = new Date().getFullYear();

export default function ReadingChart({ books }: { books: Book[] }) {
  const counts = Array(12).fill(0);
  for (const b of books) {
    if (!b.completedDate) continue;
    const d = new Date(b.completedDate);
    if (d.getFullYear() === CURRENT_YEAR) {
      counts[d.getMonth()] += 1;
    }
  }
  const max = Math.max(...counts, 1);
  return (
    <div className="rounded-base border-2 border-border bg-main shadow-shadow p-4">
      <div className="flex items-end h-40 gap-2">
        {counts.map((c, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-background rounded-t-sm"
              style={{ height: `${(c / max) * 100}%` }}
            />
            <span className="mt-1 text-xs opacity-80">{MONTHS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}