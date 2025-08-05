import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/books', { withCredentials: true })
      .then((res) => setBooks(res.data));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    const res = await axios.get('http://localhost:4000/api/books/search', {
      params: { q: query },
    });
    setResults(res.data);
  };

  const addBook = async (item) => {
    const res = await axios.post('http://localhost:4000/api/books', item, {
      withCredentials: true,
    });
    setBooks((prev) => [...prev, res.data]);
  };

  const isAdded = (googleId) => books.some((b) => b.googleId === googleId);

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
        <button type="submit" className="border px-4">
          Search
        </button>
      </form>
      <div className="space-y-2">
        {results.map((item) => (
          <div key={item.googleId} className="flex gap-2 items-center">
            {item.thumbnail && (
              <img src={item.thumbnail} alt={item.title} className="w-16" />
            )}
            <div className="flex-1">
              <div>{item.title}</div>
              <div className="text-sm text-gray-500">
                {(item.authors || []).join(', ')}
              </div>
            </div>
            {isAdded(item.googleId) ? (
              <button
                className="border px-2 py-1 bg-green-500 text-white"
                disabled
              >
                Added
              </button>
            ) : (
              <button
                onClick={() => addBook(item)}
                className="border px-2 py-1"
              >
                Add
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}