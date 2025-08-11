import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/account/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Search from './pages/Search.tsx';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}