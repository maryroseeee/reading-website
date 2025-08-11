import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import type { Book } from "@/components/ShelfCard";

interface VersionSelectProps {
  versions: Book[];
  selected: Book;
  onChange: (book: Book) => void;
}

export default function VersionSelect({ versions, selected, onChange }: VersionSelectProps) {
  return (
    <Select value={selected.googleId} onValueChange={(val) => {
      const found = versions.find((v) => v.googleId === val);
      if (found) onChange(found);
    }}>
      <SelectTrigger className="w-[140px]">
        <span>Change version</span>
      </SelectTrigger>
      <SelectContent>
        {versions.map((v) => (
          <SelectItem key={v.googleId} value={v.googleId!}>
            <div className="flex items-center gap-2">
              {v.thumbnail && (
                <img src={v.thumbnail} alt="" className="w-8 h-12 object-cover" />
              )}
              <span className="text-left">
                {v.pageCount ?? "?"} pages
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}