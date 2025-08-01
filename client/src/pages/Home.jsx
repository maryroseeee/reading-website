import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/auth/me', { withCredentials: true })
      .then((res) => setEmail(res.data.email))
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <h1>Welcome {email}</h1>
    </div>
  );
}