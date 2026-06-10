import { useEffect, useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import BookCard from '@/features/books/components/book-card';
import VersionSelect from '@/features/books/components/version-select';
import { addBook, deleteBook, getBooks, searchBooks } from '@/features/books/api/books-api';
import type { Book } from '@/features/books/types/book';
import { normalizeText } from '@/utils/text';
import CustomBookDialog from '@/features/books/components/custom-book-dialog';
import { groupBookVersions } from '@/features/books/utils/group-books';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ versions: Book[]; selected: Book }[]>([]);
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
      setResults(groupBookVersions(data));
    } catch {
      setResults([]);
      setError('Google Books search is unavailable. You can add your version manually.');
    }
  };

  const handleAddBook = async (item: Book, completedDate?: Date) => {
    const book = await addBook({
      ...item,
      completedDate: completedDate?.toISOString() ?? item.completedDate,
    });
    setBooks((prev) => [...prev, book]);
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
        <Button onClick={() => setCustomOpen(true)} className="bg-main">
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
                  <Button onClick={() => handleAddBook(item.selected)} className="bg-main">
                    Add
                  </Button>
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
