import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getFriends, removeFriend } from "@/features/friends/api/friends-api";
import RemoveFriendButton from "@/features/friends/components/remove-friend-button";
import type { FriendWithStats } from "@/features/friends/types/friend";

export default function Friends() {
  const [friends, setFriends] = useState<FriendWithStats[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getFriends()
      .then((data) => setFriends(data))
      .catch(() => undefined);
  }, []);

  const handleRemoveFriend = async (username: string) => {
    try {
      await removeFriend(username);
      setFriends((prev) => prev.filter((f) => f.username !== username));
    } catch {
      // Keep the existing UI behavior: failed removals leave the list unchanged.
    }
  };

  return (
    <div className="p-4">
      <button onClick={() => navigate('/dashboard')} className="text-xl">
        ←
      </button>
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
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/compare/${encodeURIComponent(f.username!)}`)}
                    className="rounded-base border-2 border-border bg-background shadow-shadow px-4 py-2 text-sm"
                  >
                    Compare
                  </Button>
                  <Button
                    onClick={() => navigate(`/friends/${encodeURIComponent(f.username!)}`)}
                    className="rounded-base border-2 border-border bg-background shadow-shadow px-4 py-2 text-sm"
                  >
                    Profile
                  </Button>
                  <RemoveFriendButton
                    friendName={f.name || f.username}
                    onConfirm={() => handleRemoveFriend(f.username!)}
                    className="rounded-base border-2 border-border bg-background shadow-shadow px-4 py-2 text-sm"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
