import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface YearSelectProps {
  years: number[];
  selected: number;
  onChange: (year: number) => void;
}

export default function YearSelect({ years, selected, onChange }: YearSelectProps) {
  return (
    <Select value={selected.toString()} onValueChange={(val) => onChange(Number(val))}>
      <SelectTrigger className="w-[100px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}