import { useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import DeleteButton from "@/components/DeleteButton";
import BookCard from '@/components/BookCard';
import type { Book } from '@/components/ShelfCard';
import VersionSelect from '@/components/VersionSelect';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ versions: Book[]; selected: Book }[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    axios
      .get<Book[]>('http://localhost:4000/api/books', { withCredentials: true })
      .then((res) => setBooks(res.data));
  }, []);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;
    const res = await axios.get<Book[]>(
      'http://localhost:4000/api/books/search',
      {
        params: { q: query },
      },
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
  };

  const addBook = async (item: Book) => {
    const res = await axios.post<Book>('http://localhost:4000/api/books', item, {
      withCredentials: true,
    });
    setBooks((prev) => [...prev, res.data]);
  };

  const deleteBook = async (id: string) => {
    await axios.delete(`http://localhost:4000/api/books/${id}`, {
      withCredentials: true,
    });
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
                    deleteBook(
                      books.find((b) => b.googleId === item.selected.googleId)!._id!
                    )
                  }
                >
                  Added
                </Button>
                ) : (
                  <Button onClick={() => addBook(item.selected)} className="bg-main">
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
    </div>
  );
}