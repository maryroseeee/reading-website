import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ShelfCard, { type Book } from "@/components/ShelfCard";
import ReadingTable from "@/components/ReadingTable";
import {Button} from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditProfileForm from "@/components/EditProfileForm";

export default function Dashboard() {
  const [user, setUser] = useState<{
    email: string;
    name?: string;
    bio?: string;
    username?: string;
    profilePicture?: string;
  }>({ email: "" });
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => {});
    axios
      .get("http://localhost:4000/api/books", { withCredentials: true })
      .then((res) => setBooks(res.data));
  }, []);

  const handleLogout = async () => {
    await axios.post("http://localhost:4000/api/auth/logout", {}, { withCredentials: true });
    navigate("/");
  };

  return (
    <div
      style={{ height: "100vh", display: "grid", gridTemplateColumns: "1fr 2fr" }}
      className="gap-8 p-6 items-start"
    >
      <div className="rounded-base border-2 border-border bg-main p-6 shadow-shadow text-main-foreground">
        <div className="mb-4 rounded-base border-2 border-border bg-background shadow-shadow p-3">
          <div className="rounded-base border-2 border-border bg-background flex items-center justify-center h-52">
            <Avatar className="h-44 w-44">
            <AvatarImage src={user.profilePicture || "/default-avatar.png"} alt="avatar" />
              <AvatarFallback>
                {(user.name || "ME").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <p className="break-all opacity-90 text-lg text-center">
        
        {user.name || "Your Name"}
        </p>
        <p className="break-all opacity-90 text-sm text-center">
        {user.username ? `@${user.username}` : "@username"}
        </p>
        {user.bio && (
          <p className="break-all opacity-90 text-sm text-center">{user.bio}</p>
        )}
        
        
        <div className="flex justify-center mt-4 gap-2">
        
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-base border-2 border-border bg-background shadow-shadow px-4 py-2 text-sm">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <EditProfileForm
                onSuccess={(data) => {
                  setUser((u) => ({ ...u, ...data }));
                  setOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>

           <Button
            onClick={handleLogout}
            className="rounded-base border-2 border-border bg-background shadow-shadow px-4 py-2 text-sm"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="min-w-0 flex flex-col gap-4">
        <div className="flex justify-end">
          <Input
            placeholder="Add Books"
            onFocus={() => navigate("/search")}
            readOnly
            className="w-64 rounded-base border-2 border-border bg-main shadow-shadow text-main-foreground"
          />
        </div>

        <ReadingTable 
        books={books}/>
        <ShelfCard
          books={books}
          className="min-w-0"
          nextOffsetClassName="right-3"
        />

        <div className="flex justify-end -mt-1">
          <Button
            onClick={() => navigate("/read")}
            className="rounded-base border-2 border-border bg-main shadow-shadow px-4 py-2 text-sm"
          >
            Go to read books
          </Button>
        </div>

        <div className="rounded-base border-2 border-border bg-main shadow-shadow h-48" />
      </div>
    </div>
  );
}
