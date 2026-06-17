import { normalizeText } from "@/utils/text";

import type { FriendWithStats } from "../types/friend";

export function matchesFriendSearch(friend: FriendWithStats, query: string) {
  const normalizedQuery = normalizeText(query.trim());
  if (!normalizedQuery) return true;

  const searchText = [
    friend.name,
    friend.username,
    friend.points2025.toFixed(2),
    `${friend.booksThisYear} books`,
  ]
    .filter(Boolean)
    .join(" ");

  return normalizeText(searchText).includes(normalizedQuery);
}

export function filterFriendsBySearch(
  friends: FriendWithStats[],
  query: string,
) {
  return friends.filter((friend) => matchesFriendSearch(friend, query));
}
