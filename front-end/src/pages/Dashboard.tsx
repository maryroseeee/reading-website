import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/auth/me", { withCredentials: true })
      .then((res) => setEmail(res.data.email))
      .catch(() => {});
    axios
      .get("http://localhost:4000/api/books", { withCredentials: true })
      .then((res) => setBooks(res.data));
  }, []);

  return (
    <div
      className="
        h-screen
        grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]
        gap-x-6 gap-y-4 p-6 items-start
      "
    >
      {/* col 1, row 1: profile picture */}
      <div className="col-start-1 row-start-1">
        <Avatar className="h-32 w-32">
          <AvatarImage src="/public/default-avatar.png" alt="Default avatar" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
      </div>

      {/* col 1, row 2: email */}
      <div className="col-start-1 row-start-2 mt-1 text-sm text-muted-foreground break-all">
        {email}
      </div>

      {/* col 2, row 1: search bar */}
      <div className="col-start-2 row-start-1 min-w-0">
        <Input
          placeholder="Search books"
          onFocus={() => navigate("/search")}
          readOnly
          className="w-full"
        />
      </div>

      {/* col 2, row 2: shelf */}
      <ScrollArea className="col-start-2 row-start-2 min-w-0">
        <h2 className="mb-2 text-center text-lg font-semibold">Your Books</h2>
        <ul className="space-y-3">
          {books.map((b) => (
            <li key={b._id} className="flex items-center gap-3">
              {b.thumbnail && (
                <img
                  src={b.thumbnail}
                  alt={b.title}
                  className="w-16 h-24 object-cover"
                />
              )}
              <div className="min-w-0">
                <div className="truncate">{b.title}</div>
                <div className="truncate text-sm text-muted-foreground">
                  {(b.authors || []).join(", ")} • {b.publishedYear} • {b.pageCount} pages
                </div>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
