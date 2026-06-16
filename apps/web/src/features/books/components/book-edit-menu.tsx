import { type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type BookEditMenuProps = {
  children: ReactNode;
};

export default function BookEditMenu({ children }: BookEditMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" className="w-full bg-main">
          Edit
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 space-y-2 bg-background text-foreground">
        {children}
      </PopoverContent>
    </Popover>
  );
}
