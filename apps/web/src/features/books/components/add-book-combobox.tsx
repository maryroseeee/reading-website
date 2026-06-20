import { useEffect, useState } from "react";
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
import VersionSelect from "./version-select";
import CompletionDatePicker from "./completion-date-picker";
import { addBook as createBook, searchBooks } from "../api/books-api";
import type { Book } from "../types/book";
import CustomBookDialog from "./custom-book-dialog";
import { groupBookVersions } from "../utils/group-books";
import type { ShelfTarget } from "../utils/shelf-actions";

interface GroupedResult {
  versions: Book[];
  selected: Book;
  completedDate?: Date;
  currentlyReading?: boolean;
  wantToRead?: boolean;
}

interface AddBookComboboxProps {
  onBookAdded: (book: Book) => void;
  books?: Book[];
  defaultShelf?: ShelfTarget;
}

function getDefaultShelfOptions(defaultShelf?: ShelfTarget) {
  return {
    completedDate: defaultShelf === "read" ? new Date() : undefined,
    currentlyReading: defaultShelf === "currentlyReading",
    wantToRead: defaultShelf === "wantToRead",
  };
}

function getAddButtonLabel(defaultShelf?: ShelfTarget) {
  if (defaultShelf === "read") return "Add to read";
  if (defaultShelf === "wantToRead") return "Add to want to read";
  if (defaultShelf === "currentlyReading") return "Add to current reads";
  return "Add";
}

export default function AddBookCombobox({
  onBookAdded,
  defaultShelf,
}: AddBookComboboxProps) {
  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GroupedResult[]>([]);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const addButtonLabel = getAddButtonLabel(defaultShelf);
  const isReadShelfAdd = defaultShelf === "read";

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        setError("");
        setIsSearching(true);
        const books = await searchBooks(query);
        setResults(
          groupBookVersions(books).map((group) => ({
            ...group,
            ...getDefaultShelfOptions(defaultShelf),
          })),
        );
      } catch {
        setResults([]);
        setError("Google Books search is unavailable. You can add your version below.");
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [defaultShelf, query]);

  const addBook = async (
    item: Book,
    options: {
      completedDate?: Date;
      currentlyReading?: boolean;
      wantToRead?: boolean;
    } = {},
  ) => {
    try {
      setError("");
      const payload = {
        ...item,
        completedDate: options.currentlyReading || options.wantToRead
          ? undefined
          : options.completedDate?.toISOString(),
        currentlyReading: Boolean(options.currentlyReading),
        wantToRead: Boolean(options.wantToRead),
      };
      const book = await createBook(payload);
      onBookAdded(book);
      setOpen(false);
      setQuery("");
    } catch {
      setError("Could not add this book. Choose a read date and try again.");
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-64">Add Books</Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[350px]">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search books"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {isSearching && <CommandEmpty>Searching...</CommandEmpty>}
            {!isSearching && results.length === 0 && !error && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {error && <div className="px-3 py-2 text-sm opacity-80">{error}</div>}
            {results.slice(0, 5).map((item, idx) => (
              <CommandItem
                key={item.selected.googleId || idx}
                value={`${item.selected.title} ${(
                  item.selected.authors || []
                ).join(" ")}`}
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
                    <div className="font-medium leading-tight">
                      {item.selected.title}
                    </div>
                    <div className="text-xs opacity-80">
                      {(item.selected.authors || []).join(", ")}
                    </div>
                    <div className="flex gap-2 mt-1 items-start">
                      <div className="flex flex-col gap-2">
                        {isReadShelfAdd && (
                          <p className="text-xs font-heading">Read date</p>
                        )}
                        <CompletionDatePicker
                          date={item.completedDate}
                          onChange={(d) =>
                            setResults((prev) =>
                              prev.map((r, i) =>
                                i === idx
                                  ? {
                                      ...r,
                                      completedDate: d,
                                      currentlyReading: false,
                                      wantToRead: false,
                                    }
                                  : r
                              )
                            )
                          }
                        />
                        {!isReadShelfAdd && (
                          <>
                            <label className="flex items-center gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={Boolean(item.currentlyReading)}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  setResults((prev) =>
                                    prev.map((r, i) =>
                                      i === idx
                                        ? {
                                            ...r,
                                            completedDate: undefined,
                                            currentlyReading: e.target.checked,
                                            wantToRead: false,
                                          }
                                        : r
                                    )
                                  )
                                }
                              />
                              Currently reading
                            </label>
                            <label className="flex items-center gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={Boolean(item.wantToRead)}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  setResults((prev) =>
                                    prev.map((r, i) =>
                                      i === idx
                                        ? {
                                            ...r,
                                            completedDate: undefined,
                                            currentlyReading: false,
                                            wantToRead: e.target.checked,
                                          }
                                        : r
                                    )
                                  )
                                }
                              />
                              Want to read
                            </label>
                          </>
                        )}

                        <Button
                          size="sm"
                          className="h-6 px-2"
                          disabled={
                            !item.completedDate &&
                            !item.currentlyReading &&
                            !item.wantToRead
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (
                              item.completedDate ||
                              item.currentlyReading ||
                              item.wantToRead
                            ) {
                              addBook(item.selected, {
                                completedDate: item.completedDate,
                                currentlyReading: item.currentlyReading,
                                wantToRead: item.wantToRead,
                              });
                            }
                          }}
                        >
                          {addButtonLabel}
                        </Button>
                      </div>
                      <VersionSelect
                        versions={item.versions}
                        selected={item.selected}
                        onChange={(book) =>
                          setResults((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, selected: book } : r
                            )
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
                value="custom-book"
                onSelect={() => {
                  setOpen(false);
                  setCustomOpen(true);
                }}
              >
                Add your version
              </CommandItem>
            )}
            {query && (
              <CommandItem
                value="more-options"
                onSelect={() => {
                  setOpen(false);
                  navigate("/search");
                }}
              >
                More search options
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
      <CustomBookDialog
        open={customOpen}
        initialTitle={query}
        defaultShelf={defaultShelf}
        onOpenChange={setCustomOpen}
        onSave={addBook}
      />
    </>
  );
}
