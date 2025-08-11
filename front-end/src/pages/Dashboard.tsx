import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ShelfCard, { type Book } from "@/components/ShelfCard";

export default function Dashboard() {
  console.log("Dashboard SHELF MODE ✅");

  const [email, setEmail] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
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
      style={{ height: "100vh", display: "grid", gridTemplateColumns: "1fr 2fr" }}
      className="gap-8 p-6 items-start"
    >
      {/* LEFT 1/3: avatar + email (chunky card) */}
      <div className="rounded-base border-2 border-border bg-main p-6 shadow-shadow text-main-foreground">
        <div className="mb-4 rounded-base border-2 border-border bg-background shadow-shadow p-3">
          <div className="rounded-base border-2 border-border bg-background flex items-center justify-center h-52">
            <Avatar className="h-44 w-44">
              {/* Vite public assets */}
              <AvatarImage src="/default-avatar.png" alt="Default avatar" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <p className="break-all opacity-90 text-lg text-center">
          {email || "name@email.com"}
        </p>
      </div>

      {/* RIGHT 2/3: search + shelf (separate cards, like the mock) */}
      <div className="min-w-0 flex flex-col gap-4">
        {/* Top-right search */}
        <div className="flex justify-end">
          <Input
            placeholder="Search"
            onFocus={() => navigate("/search")}
            readOnly
            className="w-64 rounded-base border-2 border-border bg-main shadow-shadow text-main-foreground"
          />
        </div>

        {/* Shelf card with neobrutalist carousel + only right arrow */}
        <ShelfCard
          books={books}
          className="min-w-0"
          // showPrev // keep hidden to match the goal
          nextOffsetClassName="right-3"
        />

        {/* Separate neobrutalist button to the right, like the mock */}
        <div className="flex justify-end -mt-1">
          <button
            onClick={() => navigate("/read")}
            className="rounded-base border-2 border-border bg-main shadow-shadow px-4 py-2 text-sm"
          >
            Go to read
          </button>
        </div>

        {/* Optional: lower wide orange panel (placeholder) */}
        <div className="rounded-base border-2 border-border bg-main shadow-shadow h-48" />
      </div>
    </div>
  );
}
