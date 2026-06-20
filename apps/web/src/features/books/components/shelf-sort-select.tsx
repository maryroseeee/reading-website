import { useId } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  SHELF_SORT_LABELS,
  type ShelfSort,
} from "../utils/shelf-books";

type ShelfSortSelectProps = {
  value: ShelfSort;
  options: ShelfSort[];
  onChange: (sort: ShelfSort) => void;
};

export default function ShelfSortSelect({
  value,
  options,
  onChange,
}: ShelfSortSelectProps) {
  const id = useId();

  return (
    <div className="mx-auto flex w-full max-w-md items-center gap-2 sm:mx-0 sm:w-auto">
      <label htmlFor={id} className="shrink-0 text-sm font-heading">
        Sort
      </label>
      <Select value={value} onValueChange={(sort) => onChange(sort as ShelfSort)}>
        <SelectTrigger id={id} className="min-w-48 bg-background text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background text-foreground">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {SHELF_SORT_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
