import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './routes/dashboard';
import Compare from './routes/compare';
import FriendProfile from './routes/friend-profile';
import Friends from './routes/friends';
import Login from './routes/login';
import Profile from './routes/profile';
import Read from './routes/read';
import Search from './routes/search';
import '../App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/read" element={<Read />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/friends/:username" element={<FriendProfile />} />
        <Route path="/compare/:username" element={<Compare />} />
      </Routes>
    </BrowserRouter>
  );
}
