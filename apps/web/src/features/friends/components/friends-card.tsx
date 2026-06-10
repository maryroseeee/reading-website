import AddFriendCombobox from "./add-friend-combobox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Friend } from "../types/friend";

interface FriendsCardProps {
  friends: Friend[];
}

export default function FriendsCard({ friends }: FriendsCardProps) {
  const navigate = useNavigate();
  const [openFriendId, setOpenFriendId] = useState<string>();
  const closeTimer = useRef<number | undefined>(undefined);

  const openMenu = (id: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenFriendId(id);
  };

  const closeMenu = () => {
    closeTimer.current = window.setTimeout(() => setOpenFriendId(undefined), 100);
  };

  return (
    <div className="rounded-base border-2 border-border bg-main p-6 shadow-shadow text-main-foreground">
      <h3 className="text-center mb-4">Friends</h3>

      {friends.length === 0 ? (
        <p className="text-sm text-center opacity-90">No friends yet</p>
      ) : (
        <Carousel opts={{ align: "start" }} className="w-full px-6 pt-1">
          <CarouselContent className="-ml-2 py-2">
            {friends.map((f) => (
              <CarouselItem key={f._id} className="pl-2 basis-[80px]">
                <Popover
                  open={openFriendId === f._id}
                  onOpenChange={(open) =>
                    setOpenFriendId(open ? f._id : undefined)
                  }
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full flex-col items-center"
                      onMouseEnter={() => openMenu(f._id)}
                      onMouseLeave={closeMenu}
                      onFocus={() => openMenu(f._id)}
                      onBlur={closeMenu}
                    >
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={f.profilePicture || "/default-avatar.png"}
                          alt={f.name || f.username || "Friend"}
                        />
                        <AvatarFallback>
                          {(f.name || f.username || "?").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="mt-1 text-xs break-all text-center">
                        {f.name || f.username}
                      </span>
                      {f.username && (
                        <span className="text-[10px] break-all text-center opacity-80">
                          @{f.username}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  {f.username && (
                    <PopoverContent
                      className="w-32 p-1"
                      onMouseEnter={() => openMenu(f._id)}
                      onMouseLeave={closeMenu}
                    >
                      <button
                        type="button"
                        className="block w-full rounded-sm px-2 py-1 text-left text-xs hover:bg-main hover:text-main-foreground"
                        onClick={() => navigate(`/compare/${encodeURIComponent(f.username!)}`)}
                      >
                        Compare
                      </button>
                      <button
                        type="button"
                        className="block w-full rounded-sm px-2 py-1 text-left text-xs hover:bg-main hover:text-main-foreground"
                        onClick={() => navigate(`/friends/${encodeURIComponent(f.username!)}`)}
                      >
                        Check profile
                      </button>
                    </PopoverContent>
                  )}
                </Popover>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      )}

<div className="mt-4 flex flex-col gap-2">
        <AddFriendCombobox />
        <Button
          className="w-full bg-background"
          onClick={() => navigate("/friends")}
        >
          View Friends
        </Button>
      </div>
    </div>
  );
}
