import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Friend } from "@/components/FriendsCard";

interface FriendWithStats extends Friend {
  points2025: number;
  booksThisYear: number;
}

export default function Friends() {
  const [friends, setFriends] = useState<FriendWithStats[]>([]);

  useEffect(() => {
    axios
      .get<FriendWithStats[]>("http://localhost:4000/api/friends", {
        withCredentials: true,
      })
      .then((res) => setFriends(res.data))
      .catch(() => {
        /* empty */
      });
  }, []);

  const removeFriend = async (username: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/friends/${username}`, {
        withCredentials: true,
      });
      setFriends((prev) => prev.filter((f) => f.username !== username));
    } catch {
      /* empty */
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4 text-center">Friends</h1>
      {friends.length === 0 ? (
        <p className="text-sm text-center opacity-90">No friends yet</p>
      ) : (
        <ul className="space-y-4">
          {friends.map((f) => (
            <li
              key={f._id}
              className="rounded-base border-2 border-border bg-main p-4 shadow-shadow flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={f.profilePicture || "/default-avatar.png"}
                    alt={f.name || f.username || "Friend"}
                  />
                  <AvatarFallback>
                    {(f.name || f.username || "?").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium break-all">{f.name || f.username}</p>
                  {f.username && (
                    <p className="text-sm opacity-80 break-all">@{f.username}</p>
                  )}
                  <p className="text-sm opacity-80">
                    Points in 2025: {f.points2025.toFixed(2)}
                  </p>
                  <p className="text-sm opacity-80">
                    Books read this year: {f.booksThisYear}
                  </p>
                </div>
              </div>
              {f.username && (
                <Button
                  onClick={() => removeFriend(f.username!)}
                  className="rounded-base border-2 border-border bg-background shadow-shadow px-4 py-2 text-sm"
                >
                  Remove
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}