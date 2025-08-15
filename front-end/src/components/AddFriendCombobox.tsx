import { useEffect, useState } from "react";
import axios from "axios";
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
import type { Friend } from "@/components/FriendsCard";

export default function AddFriendCombobox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Friend[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        const res = await axios.get<Friend[]>(
          "http://localhost:4000/api/friends/search",
          { params: { q: query }, withCredentials: true }
        );
        setResults(res.data);
      } catch {
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const addFriend = async (username: string) => {
    try {
      await axios.post(
        "http://localhost:4000/api/friends",
        { username },
        { withCredentials: true }
      );
      setOpen(false);
      setQuery("");
    } catch {
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full bg-background">Add Friend</Button>
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
                onSelect={() => addFriend(u.username!)}
              >
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
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}