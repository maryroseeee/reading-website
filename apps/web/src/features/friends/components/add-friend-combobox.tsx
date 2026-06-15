import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  acceptFriendRequest,
  rejectFriendRequest,
  searchUsers,
  sendFriendRequest,
} from "../api/friends-api";
import type { SearchUser } from "../types/friend";

type AddFriendComboboxProps = {
  canSendFriendRequests?: boolean;
};

export default function AddFriendCombobox({
  canSendFriendRequests = true,
}: AddFriendComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        const users = await searchUsers(query);
        setResults(users);
      } catch {
        // Preserve existing behavior: search failures leave the dropdown empty.
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const addFriend = async (username: string) => {
    if (!canSendFriendRequests) return;

    try {
      await sendFriendRequest(username);
      setResults((r) =>
        r.map((u) =>
          u.username === username ? { ...u, status: "sent" } : u
        )
      );
      setOpen(false);
      setQuery("");
    } catch {
      // Preserve existing behavior: failed friend requests do not change UI state.
    }
  };

  const acceptFriend = async (username: string) => {
    try {
      await acceptFriendRequest({ username });
      setResults((r) => r.filter((u) => u.username !== username));
    } catch {
      // Preserve existing behavior: failed accepts leave the search result visible.
    }
  };

  const rejectFriend = async (username: string) => {
    try {
      await rejectFriendRequest({ username });
      setResults((r) => r.filter((u) => u.username !== username));
    } catch {
      // Preserve existing behavior: failed rejects leave the search result visible.
    }
  };

  return (
    <Popover
      open={canSendFriendRequests ? open : false}
      onOpenChange={(nextOpen) => {
        if (!canSendFriendRequests) return;
        setOpen(nextOpen);
      }}
    >
      <PopoverTrigger asChild>
        <span
          className="block w-full"
          title={
            canSendFriendRequests
              ? undefined
              : "Set your username to send friend requests"
          }
        >
          <Button
            className="w-full bg-background"
            disabled={!canSendFriendRequests}
          >
            Add Friend
          </Button>
        </span>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-64">
        <Command>
          <CommandInput
            placeholder="Search users..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {results.length === 0 && <CommandEmpty>No users found.</CommandEmpty>}
            {results.map((u) => (
              <CommandItem
                key={u._id}
                value={`${u.name || ""} ${u.username || ""}`}
                onSelect={() => {}}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={u.profilePicture || "/default-avatar.png"}
                        alt={u.name || u.username || "User"}
                      />
                      <AvatarFallback>
                        {(u.name || u.username || "?")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs break-all">{u.name || u.username}</p>
                  </div>
                  {u.status === "incoming" ? (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          acceptFriend(u.username!);
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="neutral"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          rejectFriend(u.username!);
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : u.status === "sent" ? (
                    <Button size="sm" disabled variant="neutral">
                      Sent
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={!canSendFriendRequests}
                      title={
                        canSendFriendRequests
                          ? undefined
                          : "Set your username to send friend requests"
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addFriend(u.username!);
                      }}
                    >
                      Send
                    </Button>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
