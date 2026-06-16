export type Friend = {
  _id: string;
  name?: string;
  username?: string;
  profilePicture?: string;
  themeColor?: string;
};

export type FriendWithStats = Friend & {
  points2025: number;
  booksThisYear: number;
};

export type SearchUser = Friend & {
  status?: "none" | "sent" | "incoming";
};
