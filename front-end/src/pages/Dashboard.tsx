import { useEffect, useState } from "react";
import axios from "axios";
import '../index.css'
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:4000/api/auth/me", { withCredentials: true })
      .then(res => setEmail(res.data.email))
      .catch(() => {});
    axios.get("http://localhost:4000/api/books", { withCredentials: true })
      .then(res => setBooks(res.data));
  }, []);

  return (
    <div
      style={{ height: "100vh", display: "grid", gridTemplateColumns: "1fr 2fr" }}
      className="gap-8 p-6 items-start"
    >
      {/* LEFT 1/3: avatar + email */}
      <div className="rounded-base border-2 border-border bg-main p-6 shadow-shadow text-main-foreground">
        <div className="mb-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src="/public/default-avatar.png" alt="Default avatar" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </div>
        <p className="break-all opacity-90">{email}</p>
      </div>

      {/* RIGHT 2/3: search + shelf */}
      <div className="rounded-base border-2 border-border bg-main p-6 shadow-shadow text-main-foreground min-w-0">
        <div className="mb-4">
          <Input
            placeholder="Search books"
            onFocus={() => navigate("/search")}
            readOnly
            className="w-full"
          />
        </div>

        <h2 className="text-center font-semibold mb-3">Your Books</h2>

        <ScrollArea className="h-[calc(100vh-220px)] pr-2">
          <ul className="space-y-3">
            {books.map((b) => (
              <li key={b._id} className="rounded-base border-2 border-border bg-main p-3 shadow-shadow">
                <div className="flex items-center gap-3">
                  {b.thumbnail && (
                    <img
                      src={b.thumbnail}
                      alt={b.title}
                      className="w-16 h-24 object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-medium">{b.title}</div>
                    <div className="truncate text-sm opacity-80">
                      {(b.authors || []).join(", ")} • {b.publishedYear} • {b.pageCount} pages
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
}
