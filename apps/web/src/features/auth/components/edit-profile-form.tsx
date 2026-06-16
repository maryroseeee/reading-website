import { useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";

import { getCurrentUser, updateCurrentUser } from "../api/auth-api";
import type { ProfileFormData, UserProfile } from "../types/user";

export default function EditProfileForm({ onSuccess }: { onSuccess: (data: UserProfile) => void }) {
  const [form, setForm] = useState<ProfileFormData>({
    name: '',
    username: '',
    bio: '',
    profilePicture: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setForm({
          name: data?.name || '',
          username: data?.username || '',
          bio: data?.bio || '',
          profilePicture: data?.profilePicture || '',
        });
      })
      .catch(() => undefined);
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
        const mimeType =
          file.type && file.type.startsWith('image/')
            ? file.type
            : 'image/png';
        const dataUrl = canvas.toDataURL(mimeType);
        setForm((prev) => ({ ...prev, profilePicture: dataUrl }));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateCurrentUser(form);
      setMessage('Profile updated');
      onSuccess(updated);
    
    } catch (error) {
        const errMessage =
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : 'Update failed';
        setMessage(errMessage);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <input
        name="name"
        value={form.name}
        onChange={onChange}
        placeholder="Display name"
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
