import { useEffect, useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import BookCard from '@/features/books/components/book-card';
import VersionSelect from '@/features/books/components/version-select';
import CompletionDatePicker from '@/features/books/components/completion-date-picker';
import { addBook, deleteBook, getBooks, searchBooks } from '@/features/books/api/books-api';
import type { Book } from '@/features/books/types/book';
import { normalizeText } from '@/utils/text';
import CustomBookDialog from '@/features/books/components/custom-book-dialog';
import { groupBookVersions } from '@/features/books/utils/group-books';

type SearchResult = {
  versions: Book[];
  selected: Book;
  completedDate?: Date;
  currentlyReading?: boolean;
};

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [customOpen, setCustomOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    getBooks().then((data) => setBooks(data));
  }, []);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;
    try {
      setError('');
      const data = await searchBooks(normalizeText(query));
      setResults(
        groupBookVersions(data).map((group) => ({
          ...group,
          completedDate: undefined,
          currentlyReading: false,
        })),
      );
    } catch {
      setResults([]);
      setError('Google Books search is unavailable. You can add your version manually.');
    }
  };

  const handleAddBook = async (
    item: Book,
    options: { completedDate?: Date; currentlyReading?: boolean } = {},
  ) => {
    try {
      setError('');
      const book = await addBook({
        ...item,
        completedDate: options.currentlyReading
          ? undefined
          : options.completedDate?.toISOString() ?? item.completedDate,
        currentlyReading: Boolean(options.currentlyReading),
      });
      setBooks((prev) => [
        ...prev.filter((existing) => existing.googleId !== book.googleId),
        book,
      ]);
    } catch {
      setError('Could not add this book. Make sure you are signed in.');
    }
  };

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
    setBooks((prev) => prev.filter((b) => b._id !== id));
  };

  const isAdded = (googleId: string) =>
    books.some((b) => b.googleId === googleId);

  return (
    <div className="p-4 space-y-4">
      <button onClick={() => navigate('/dashboard')} className="text-xl">
        ←
      </button>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books"
          className="border p-2 flex-1"
        />
        <Button type="submit" className="border px-4">
          Search
        </Button>
      </form>
      {error && <p className="text-sm opacity-80">{error}</p>}
      {query && (
        <Button type="button" onClick={() => setCustomOpen(true)} className="bg-main">
          Add your version
        </Button>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {results.map((item, idx) => (
          <BookCard
            key={item.selected.googleId}
            book={item.selected}
            action={
              <div className="flex gap-2">
                {isAdded(item.selected.googleId!) ? (
                  <Button
                  type="button"
                  className="bg-green-500 text-white"
                  onClick={() =>
                    handleDeleteBook(
                      books.find((b) => b.googleId === item.selected.googleId)!._id!
                    )
                  }
                >
                  Added
                </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <CompletionDatePicker
                      date={item.completedDate}
                      onChange={(date) =>
                        setResults((prev) =>
                          prev.map((result, resultIndex) =>
                            resultIndex === idx
                              ? {
                                  ...result,
                                  completedDate: date,
                                  currentlyReading: false,
                                }
                              : result,
                          ),
                        )
                      }
                    />
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={Boolean(item.currentlyReading)}
                        onChange={(e) =>
                          setResults((prev) =>
                            prev.map((result, resultIndex) =>
                              resultIndex === idx
                                ? {
                                    ...result,
                                    completedDate: undefined,
                                    currentlyReading: e.target.checked,
                                  }
                                : result,
                            ),
                          )
                        }
                      />
                      Currently reading
                    </label>
                    <Button
                      type="button"
                      disabled={!item.completedDate && !item.currentlyReading}
                      onClick={() => {
                        if (item.completedDate || item.currentlyReading) {
                          handleAddBook(item.selected, {
                            completedDate: item.completedDate,
                            currentlyReading: item.currentlyReading,
                          });
                        }
                      }}
                      className="bg-main"
                    >
                      Add
                    </Button>
                  </div>
                )}
                <VersionSelect
                  versions={item.versions}
                  selected={item.selected}
                  onChange={(book) =>
                    setResults((prev) =>
                      prev.map((r, i) => (i === idx ? { ...r, selected: book } : r))
                    )
                  }
                />
              </div>
            }
            />
        ))}
      </div>
      <CustomBookDialog
        open={customOpen}
        initialTitle={query}
        onOpenChange={setCustomOpen}
        onSave={handleAddBook}
      />
    </div>
  );
}
