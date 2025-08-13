import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type Friend = {
  _id: string;
  name?: string;
  username?: string;
  profilePicture?: string;
};

export default function FriendsCard() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/friends", { withCredentials: true })
      .then((res) => setFriends(res.data))
      .catch(() => {});
  }, []);

  const addFriend = async () => {
    if (!username.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:4000/api/friends",
        { username },
        { withCredentials: true }
      );
      setFriends((prev) => [...prev, res.data]);
      setUsername("");
    } catch {
      // ignore errors
    }
  };

  return (
    <div className="rounded-base border-2 border-border bg-main p-6 shadow-shadow text-main-foreground">
      <h3 className="text-center mb-4">Friends</h3>
      {friends.length === 0 ? (
        <p className="text-sm text-center opacity-90">No friends yet</p>
      ) : (
        <Carousel opts={{ align: "start" }} className="w-full px-6">
          <CarouselContent className="-ml-2">
            {friends.map((f) => (
              <CarouselItem key={f._id} className="pl-2 basis-[80px]">
                <div className="flex flex-col items-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={f.profilePicture || "/default-avatar.png"}
                      alt={f.name || f.username || "Friend"}
                    />
                    <AvatarFallback>
                      {(f.name || f.username || "?").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="mt-1 text-xs break-all text-center">
                    {f.name || f.username}
                  </p>
                  {f.username && (
                    <p className="text-[10px] break-all text-center opacity-80">
                      @{f.username}
                    </p>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      )}
      <div className="mt-4 flex gap-2">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Add friend by username"
          className="h-8 text-xs"
        />
        <Button
          onClick={addFriend}
          className="rounded-base border-2 border-border bg-background shadow-shadow px-3 py-1 text-xs"
        >
          Add
        </Button>
      </div>
    </div>
  );
}