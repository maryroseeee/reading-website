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
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-4 d-flex flex-column align-items-center py-4">
          <img
            src="/public/default-avatar.png"
            alt="Default avatar"
            className="rounded-circle mb-2"
            style={{ width: '8rem', height: '8rem' }}
          />
          <div>{email}</div>
        </div>
        <div className="col-md-8 py-4">
          <input
            placeholder="Search books"
            onFocus={() => navigate('/search')}
            readOnly
            className="form-control mb-4"
          />
          <h2 className="h5">Your Books</h2>
          <div className="d-flex flex-column gap-2">
            {books.map((b) => (
              <div key={b._id} className="d-flex align-items-center gap-2">
                {b.thumbnail && (
                  <img
                    src={b.thumbnail}
                    alt={b.title}
                    style={{ width: '4rem' }}
                  />
                )}
                <div>
                  <div>{b.title}</div>
                  <div className="text-muted small">
                    {(b.authors || []).join(', ')} • {b.publishedYear} • {b.pageCount} pages
                  </div>
                </div>
              </div>
        ))}
        </div>
      </div>
      </div>
    </div>
  );
}