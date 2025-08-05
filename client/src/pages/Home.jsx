import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [books, setBooks] = useState([]);
  const shelfRef = useRef(null);

  const fetchBooks = () => {
    axios
      .get('http://localhost:4000/api/books', { withCredentials: true })
      .then((res) => setBooks(res.data));
  };

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/auth/me', { withCredentials: true })
      .then((res) => setEmail(res.data.email))
      .catch(() => {});
    fetchBooks();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    const res = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
    );
    setResults(res.data.items || []);
  };

  const addBook = async (item) => {
    const info = item.volumeInfo || {};
    await axios.post(
      'http://localhost:4000/api/books',
      {
        googleId: item.id,
        title: info.title,
        authors: info.authors || [],
        pageCount: info.pageCount,
        publishedYear: info.publishedDate
          ? parseInt(info.publishedDate.split('-')[0], 10)
          : undefined,
        categories: info.categories || [],
        thumbnail: info.imageLinks?.thumbnail,
      },
      { withCredentials: true }
    );
    fetchBooks();
    shelfRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="p-4 space-y-4">
      <h1>Welcome {email}</h1>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books"
          className="border p-2 flex-1"
        />
        <button type="submit" className="border px-4">
          Search
        </button>
      </form>
      <button
        onClick={() => shelfRef.current?.scrollIntoView({ behavior: 'smooth' })}
        className="border px-4"
      >
        My Shelf
      </button>
      <div className="space-y-2">
        {results.map((item) => {
          const info = item.volumeInfo || {};
          return (
            <div key={item.id} className="flex gap-2 items-center">
              {info.imageLinks?.thumbnail && (
                <img
                  src={info.imageLinks.thumbnail}
                  alt={info.title}
                  className="w-16"
                />
              )}
              <div className="flex-1">
                <div>{info.title}</div>
                <div className="text-sm text-gray-500">
                  {info.authors?.join(', ')}
                </div>
              </div>
              <button
                onClick={() => addBook(item)}
                className="border px-2 py-1"
              >
                Add
              </button>
            </div>
          );
        })}
      </div>
      <h2 ref={shelfRef} className="text-xl">Your Books</h2>
      <div className="space-y-2">
        {books.map((b) => (
          <div key={b._id} className="flex gap-2 items-center">
            {b.thumbnail && (
              <img src={b.thumbnail} alt={b.title} className="w-16" />
            )}
            <div>
              <div>{b.title}</div>
              <div className="text-sm text-gray-500">
              {(b.authors || []).join(', ')} • {b.publishedYear} • {b.pageCount} pages
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}