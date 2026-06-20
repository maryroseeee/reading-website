import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageError } from "@/components/page-state";
import { FriendsPageSkeleton } from "@/components/page-skeletons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFriends, removeFriend } from "@/features/friends/api/friends-api";
import RemoveFriendButton from "@/features/friends/components/remove-friend-button";
import type { FriendWithStats } from "@/features/friends/types/friend";
import { filterFriendsBySearch } from "@/features/friends/utils/search-friends";
import { getThemeColorCssVars } from "@/lib/theme-colors";

export default function Friends() {
  const [friends, setFriends] = useState<FriendWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadFriends = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getFriends();
      setFriends(data);
    } catch {
      setError("Could not load your friends.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFriends();
  }, [loadFriends]);

  const handleRemoveFriend = async (username: string) => {
    try {
      await removeFriend(username);
      setFriends((prev) => prev.filter((f) => f.username !== username));
    } catch {
      // Keep the existing UI behavior: failed removals leave the list unchanged.
    }
  };

  const filteredFriends = filterFriendsBySearch(friends, searchQuery);

  if (isLoading) {
    return <FriendsPageSkeleton />;
  }

  if (error) {
    return (
      <PageError
        title="Could not load friends"
        message={error}
        onRetry={loadFriends}
      />
    );
  }

  return (
    <div className="p-4">
      <button onClick={() => navigate('/dashboard')} className="text-xl">
        ←
      </button>
      <h1 className="text-xl mb-4 text-center">Friends</h1>
      <div className="mx-auto mb-4 max-w-md">
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search friends"
          className="bg-background"
        />
      </div>
      {filteredFriends.length === 0 ? (
        <p className="text-sm text-center opacity-90">
          {searchQuery ? "No friends match your search" : "No friends yet"}
        </p>
      ) : (
        <ul className="space-y-4">
          {filteredFriends.map((f) => (
            <li
              key={f._id}
              style={getThemeColorCssVars(f.themeColor)}
              className="flex items-center justify-between gap-4 rounded-base border-2 border-border bg-main p-4 text-main-foreground shadow-shadow"
            >
              <div className="min-w-0 flex flex-1 items-center gap-4">
                <Avatar className="h-16 w-16 flex-none">
                  <AvatarImage
                    src={f.profilePicture || "/default-avatar.png"}
                    alt={f.name || f.username || "Friend"}
                  />
                  <AvatarFallback>
                    {(f.name || f.username || "?").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 text-left">
                  <p className="break-all font-medium">{f.name || f.username}</p>
                  {f.username && (
                    <p className="break-all text-sm opacity-80">@{f.username}</p>
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
                <div className="flex flex-none gap-2">
                  <Button
                    onClick={() => navigate(`/compare/${encodeURIComponent(f.username!)}`)}
                    className="rounded-base border-2 border-border bg-background px-4 py-2 text-sm text-foreground shadow-shadow"
                  >
                    Compare
                  </Button>
                  <Button
                    onClick={() => navigate(`/friends/${encodeURIComponent(f.username!)}`)}
                    className="rounded-base border-2 border-border bg-background px-4 py-2 text-sm text-foreground shadow-shadow"
                  >
                    Profile
                  </Button>
                  <RemoveFriendButton
                    friendName={f.name || f.username}
                    onConfirm={() => handleRemoveFriend(f.username!)}
                    className="rounded-base border-2 border-border bg-background px-4 py-2 text-sm text-foreground shadow-shadow"
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
