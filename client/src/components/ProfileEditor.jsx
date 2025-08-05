import { useState } from 'react';
import axios from 'axios';

export default function ProfileEditor({ profile, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: profile.name || '',
    username: profile.username || '',
    twitter: profile.socials?.twitter || '',
    facebook: profile.socials?.facebook || '',
    instagram: profile.socials?.instagram || '',
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append('profilePicture', file);
    const res = await axios.put('http://localhost:4000/api/profile', data, {
      withCredentials: true,
    });
    onUpdated(res.data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        className="border p-1 w-full"
      />
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        className="border p-1 w-full"
      />
      <input
        name="twitter"
        value={form.twitter}
        onChange={handleChange}
        placeholder="Twitter URL"
        className="border p-1 w-full"
      />
      <input
        name="facebook"
        value={form.facebook}
        onChange={handleChange}
        placeholder="Facebook URL"
        className="border p-1 w-full"
      />
      <input
        name="instagram"
        value={form.instagram}
        onChange={handleChange}
        placeholder="Instagram URL"
        className="border p-1 w-full"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <div className="flex gap-2">
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}