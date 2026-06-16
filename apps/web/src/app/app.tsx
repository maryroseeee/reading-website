import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './routes/dashboard';
import Compare from './routes/compare';
import FriendBooks from './routes/friend-books';
import FriendProfile from './routes/friend-profile';
import Friends from './routes/friends';
import Login from './routes/login';
import Profile from './routes/profile';
import Read from './routes/read';
import Search from './routes/search';
import WantToRead from './routes/want-to-read';
import ProtectedRoute from '@/features/auth/components/protected-route';
import '../App.css';

function protectedPage(page: React.ReactNode) {
  return <ProtectedRoute>{page}</ProtectedRoute>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={protectedPage(<Dashboard />)} />
        <Route path="/search" element={protectedPage(<Search />)} />
        <Route path="/read" element={protectedPage(<Read />)} />
        <Route path="/want-to-read" element={protectedPage(<WantToRead />)} />
        <Route path="/profile" element={protectedPage(<Profile />)} />
        <Route path="/friends" element={protectedPage(<Friends />)} />
        <Route path="/friends/:username" element={protectedPage(<FriendProfile />)} />
        <Route path="/friends/:username/books/:shelf" element={protectedPage(<FriendBooks />)} />
        <Route path="/compare/:username" element={protectedPage(<Compare />)} />
      </Routes>
    </BrowserRouter>
  );
}
