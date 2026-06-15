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
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import type { Friend } from "../types/friend";
import { removeFriend } from "../api/friends-api";
import RemoveFriendButton from "./remove-friend-button";

interface FriendsCardProps {
  friends: Friend[];
  currentUsername?: string;
  onFriendRemoved?: (username: string) => void;
}

export default function FriendsCard({
  friends,
  currentUsername,
  onFriendRemoved,
}: FriendsCardProps) {
  const navigate = useNavigate();
  const [activeFriend, setActiveFriend] = useState<Friend>();
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });
  const closeTimer = useRef<number | undefined>(undefined);

  const openMenu = (friend: Friend, trigger: HTMLElement) => {
    window.clearTimeout(closeTimer.current);
    const rect = trigger.getBoundingClientRect();
    setMenuPosition({
      left: rect.left + rect.width / 2,
      top: rect.bottom + 4,
    });
    setActiveFriend(friend);
  };

  const keepMenuOpen = () => {
    window.clearTimeout(closeTimer.current);
  };

  const closeMenu = () => {
    closeTimer.current = window.setTimeout(() => setActiveFriend(undefined), 100);
  };

  const handleRemoveFriend = async (username: string) => {
    await removeFriend(username);
    onFriendRemoved?.(username);
    setActiveFriend(undefined);
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
                <button
                  type="button"
                  className="flex w-full flex-col items-center"
                  onMouseEnter={(e) => openMenu(f, e.currentTarget)}
                  onMouseLeave={closeMenu}
                  onFocus={(e) => openMenu(f, e.currentTarget)}
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      )}

<div className="mt-4 flex flex-col gap-2">
        <AddFriendCombobox canSendFriendRequests={Boolean(currentUsername)} />
        <Button
          className="w-full bg-background"
          onClick={() => navigate("/friends")}
        >
          View Friends
        </Button>
      </div>
      {activeFriend?.username &&
        createPortal(
          <div
            className="fixed z-50 w-32 -translate-x-1/2 rounded-base border-2 border-border bg-background p-1 text-foreground shadow-shadow"
            style={{ left: menuPosition.left, top: menuPosition.top }}
            onMouseEnter={keepMenuOpen}
            onMouseLeave={closeMenu}
          >
            <button
              type="button"
              className="block w-full rounded-sm px-2 py-1 text-left text-xs hover:bg-main hover:text-main-foreground"
              onClick={() =>
                navigate(`/compare/${encodeURIComponent(activeFriend.username!)}`)
              }
            >
              Compare
            </button>
            <button
              type="button"
              className="block w-full rounded-sm px-2 py-1 text-left text-xs hover:bg-main hover:text-main-foreground"
              onClick={() =>
                navigate(`/friends/${encodeURIComponent(activeFriend.username!)}`)
              }
            >
              Check profile
            </button>
            <RemoveFriendButton
              compact
              friendName={activeFriend.name || activeFriend.username}
              triggerClassName="block w-full rounded-sm px-2 py-1 text-left text-xs hover:bg-main hover:text-main-foreground"
              onConfirm={() => handleRemoveFriend(activeFriend.username!)}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
