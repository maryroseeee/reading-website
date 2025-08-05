import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [email, setEmail] = useState('');
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/auth/me', { withCredentials: true })
      .then((res) => setEmail(res.data.email))
      .catch(() => {});
    axios
      .get('http://localhost:4000/api/books', { withCredentials: true })
      .then((res) => setBooks(res.data));
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1>Welcome {email}</h1>
      <input
        placeholder="Search books"
        onFocus={() => navigate('/search')}
        readOnly
        className="border p-2 w-full"
      />
      <h2 className="text-xl">Your Books</h2>
      <div className="space-y-2">
        {books.map((b) => (
          <div key={b._id} className="flex gap-2 items-center">
            {b.thumbnail && <img src={b.thumbnail} alt={b.title} className="w-16" />}
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