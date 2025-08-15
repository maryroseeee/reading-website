import { useState } from "react";
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

interface FriendRequestsComboboxProps {
  requests: Friend[];
  onAccept: (friend: Friend) => void;
  onReject: (id: string) => void;
}

export default function FriendRequestsCombobox({
  requests,
  onAccept,
  onReject,
}: FriendRequestsComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const accept = async (id: string) => {
    try {
      const res = await axios.post<Friend>(
        "http://localhost:4000/api/friends/accept",
        { id },
        { withCredentials: true }
      );
      onAccept(res.data);
    } catch {
    }
  };

  const reject = async (id: string) => {
    try {
      await axios.post(
        "http://localhost:4000/api/friends/reject",
        { id },
        { withCredentials: true }
      );
      onReject(id);
    } catch {
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full">Friend Requests</Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-64">
        <Command>
          <CommandInput
            placeholder="Search requests..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {requests.length === 0 && <CommandEmpty>No requests.</CommandEmpty>}
            {requests.map((r) => (
              <CommandItem
                key={r._id}
                value={`${r.name || ""} ${r.username || ""}`}
              >
                <div className="flex items-center gap-2 flex-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={r.profilePicture || "/default-avatar.png"}
                      alt={r.name || r.username || "Request"}
                    />
                    <AvatarFallback>
                      {(r.name || r.username || "?")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs break-all">{r.name || r.username}</p>
                </div>
                <Button
                 onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    accept(r._id!);
                  }}
                  className="rounded-base border-2 border-border bg-background shadow-shadow px-2 py-1 text-xs"
                >
                  Accept
                </Button>
                <Button
                 onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    reject(r._id!);
                  }}
                  className="rounded-base border-2 border-border bg-background shadow-shadow px-2 py-1 text-xs ml-2"
                >
                  Reject
                </Button>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}