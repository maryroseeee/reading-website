import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/account/Login';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
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