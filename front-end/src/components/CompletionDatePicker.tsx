import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface CompletionDatePickerProps {
  date?: Date;
  onChange: (date: Date | undefined) => void;
}

export default function CompletionDatePicker({ date, onChange }: CompletionDatePickerProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button  className="h-6 px-2 text-xs justify-start">
          <CalendarIcon className="mr-1 h-4 w-4" />
          {date ? format(date, "MMM d, yyyy") : "Set date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 pb-0">
          <Input
            type="date"
            value={date ? format(date, "yyyy-MM-dd") : ""}
            onChange={(e) => {
              const value = e.target.value;
              onChange(value ? new Date(value) : undefined);
            }}
          />
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            onChange(d);
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}