import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/account/Login.jsx';
import Home from './pages/Home';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </BrowserRouter>
);
}