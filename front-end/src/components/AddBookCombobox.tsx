import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import VersionSelect from "@/components/VersionSelect";
import type { Book } from "@/components/ShelfCard";

interface GroupedResult {
  versions: Book[];
  selected: Book;
}

interface AddBookComboboxProps {
  onBookAdded: (book: Book) => void;
}

export default function AddBookCombobox({ onBookAdded }: AddBookComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GroupedResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const handler = setTimeout(async () => {
      const res = await axios.get<Book[]>(
        "http://localhost:4000/api/books/search",
        { params: { q: query } },
      );
      const grouped = Object.values(
        res.data.reduce((acc, book) => {
          const key = `${book.title.toLowerCase()}|${(book.authors || []).join(',').toLowerCase()}`;
          acc[key] = acc[key] || [];
          acc[key].push(book);
          return acc;
        }, {} as Record<string, Book[]>)
      ).map((versions) => ({ versions, selected: versions[0] }));
      setResults(grouped);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const addBook = async (item: Book) => {
    const res = await axios.post<Book>("http://localhost:4000/api/books", item, {
      withCredentials: true,
    });
    onBookAdded(res.data);
    setOpen(false);
    setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-64">Add Books</Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[350px]">
        <Command>
          <CommandInput
            placeholder="Search books"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {results.slice(0, 5).map((item, idx) => (
              <CommandItem key={item.selected.googleId || idx} value={item.selected.title}>
                <div className="flex flex-col gap-1 w-full">
                  <div className="font-medium leading-tight">{item.selected.title}</div>
                  <div className="text-xs opacity-80">{(item.selected.authors || []).join(", ")}</div>
                  <div className="flex gap-2 mt-1 items-center">
                    <Button
                      size="sm"
                      className="h-6 px-2"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addBook(item.selected);
                      }}
                    >
                      Add
                    </Button>
                    <VersionSelect
                      versions={item.versions}
                      selected={item.selected}
                      onChange={(book) =>
                        setResults((prev) =>
                          prev.map((r, i) => (i === idx ? { ...r, selected: book } : r)),
                        )
                      }
                    />
                  </div>
                </div>
              </CommandItem>
            ))}
            {query && (
              <CommandItem
                value="more-options"
                onSelect={() => {
                  setOpen(false);
                  navigate("/search");
                }}
              >
                More Options →
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}