import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';

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
    <Box
      sx={{
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' }, // col1 auto (avatar/email), col2 flexible
        gridTemplateRows: 'auto 1fr',                       // row1 (avatar/search), row2 (email/shelf)
        columnGap: 3,
        rowGap: 2,
        alignItems: 'start',
        p: 4,
      }}
    >
      {/* col1 / row1: profile picture */}
      <Box sx={{ gridColumn: 1, gridRow: 1 }}>
        <Avatar
          src="/public/default-avatar.png"
          alt="Default avatar"
          sx={{ width: '8rem', height: '8rem' }}
        />
      </Box>

      {/* col1 / row2: email */}
      <Typography sx={{ gridColumn: 1, gridRow: 2, mt: 1 }}>
        {email}
      </Typography>

      {/* col2 / row1: search bar */}
      <Box sx={{ gridColumn: { xs: '1 / -1', md: 2 }, gridRow: 1, minWidth: 0 }}>
        <Input
          placeholder="Search books"
          onFocus={() => navigate('/search')}
          readOnly
          sx={{ width: '100%' }}
        />
      </Box>

      {/* col2 / row2: shelf */}
      <Box sx={{ gridColumn: { xs: '1 / -1', md: 2 }, gridRow: 2, minWidth: 0, overflow: 'auto' }}>
        <Typography level="h2" fontSize="lg" sx={{ mb: 2, textAlign: 'center' }}>
          Your Books
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {books.map((b) => (
            <Box key={b._id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {b.thumbnail && (
                <img src={b.thumbnail} alt={b.title} style={{ width: '4rem' }} />
              )}
              <Box>
                <Typography>{b.title}</Typography>
                <Typography level="body-sm" color="neutral">
                  {(b.authors || []).join(', ')} • {b.publishedYear} • {b.pageCount} pages
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}