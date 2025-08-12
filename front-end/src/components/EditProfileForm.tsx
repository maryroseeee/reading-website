import { useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";

interface ProfileData {
  name: string;
  username: string;
  bio: string;
  profilePicture: string;
}

export default function EditProfileForm({ onSuccess }: { onSuccess: (data: ProfileData) => void }) {
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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size
        );
        const dataUrl = canvas.toDataURL('image/png');
        setForm((prev) => ({ ...prev, profilePicture: dataUrl }));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:4000/api/auth/me', form, {
        withCredentials: true,
      });
      setMessage('Profile updated');
      onSuccess(form);
    } catch {
      setMessage('Update failed');
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
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
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="border p-2"
      />
      <Button type="submit" className="bg-main text-white p-2">Save</Button>
      {message && <p>{message}</p>}
    </form>
  );
}
