import { useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';

interface ProfileData {
  name: string;
  username: string;
  bio: string;
  profilePicture: string;
}

export default function Profile() {
  const [form, setForm] = useState<ProfileData>({
    name: '',
    username: '',
    bio: '',
    profilePicture: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/auth/me', { withCredentials: true })
      .then((res) => {
        setForm({
          name: res.data?.name || '',
          username: res.data?.username || '',
          bio: res.data?.bio || '',
          profilePicture: res.data?.profilePicture || '',
        });
      })
      .catch(() => {});
  }, []);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:4000/api/auth/me', form, {
        withCredentials: true,
      });
      setMessage('Profile updated');
    } catch {
      setMessage('Update failed');
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4">
      <input
        name="name"
        value={form.name}
        onChange={onChange}
        placeholder="Name"
        className="border p-2"
      />
      <input
        name="username"
        value={form.username}
        onChange={onChange}
        placeholder="Username"
        className="border p-2"
      />
      <textarea
        name="bio"
        value={form.bio}
        onChange={onChange}
        placeholder="Bio"
        className="border p-2"
      />
      <input
        name="profilePicture"
        value={form.profilePicture}
        onChange={onChange}
        placeholder="Profile Picture URL"
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">Save</button>
      {message && <p>{message}</p>}
    </form>
  );
}