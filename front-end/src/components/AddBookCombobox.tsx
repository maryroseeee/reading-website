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
import CompletionDatePicker from "@/components/CompletionDatePicker";
import type { Book } from "@/components/ShelfCard";

interface GroupedResult {
  versions: Book[];
  selected: Book;
  completedDate?: Date;
}


interface AddBookComboboxProps {
  onBookAdded: (book: Book) => void;
  books?: Book[];      
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
        ).map((versions) => ({ versions, selected: versions[0], completedDate: undefined }));
      setResults(grouped);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const addBook = async (item: Book, completedDate?: Date) => {
    const payload = { ...item, completedDate: completedDate?.toISOString() };
    const res = await axios.post<Book>("http://localhost:4000/api/books", payload, {
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
            {results.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {results.slice(0, 5).map((item, idx) => (
             
              <CommandItem
                key={item.selected.googleId || idx}
                value={`${item.selected.title} ${(item.selected.authors || []).join(" ")}`}
              >
                <div className="flex gap-2 w-full">
                  {item.selected.thumbnail && (
                    <img
                      src={item.selected.thumbnail}
                      alt={item.selected.title}
                      className="w-10 h-14 object-cover flex-none rounded-sm"
                    />
                  )}
                  <div className="flex flex-col gap-1 w-full">
                    <div className="font-medium leading-tight">{item.selected.title}</div>
                    <div className="text-xs opacity-80">
                      {(item.selected.authors || []).join(", ")}
                    </div>
                    <div className="flex gap-2 mt-1 items-center">

                    <CompletionDatePicker
                        date={item.completedDate}
                        onChange={(d) =>
                          setResults((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, completedDate: d } : r,
                            ),
                          )
                        }
                      />

                      <Button
                        size="sm"
                        className="h-6 px-2"
                        disabled={!item.completedDate}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (item.completedDate) {
                            addBook(item.selected, item.completedDate);
                          }
                        }}
                      >
                        Add
                      </Button>
                      <VersionSelect
                        versions={item.versions}
                        selected={item.selected}
                        onChange={(book) =>
                          setResults((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, selected: book } : r,
                            ),
                          )
                        }
                      />
                    </div>
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