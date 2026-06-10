import { apiClient } from "@/lib/api-client";
import type { Book } from "@/features/books/types/book";

import type { Friend, FriendWithStats, SearchUser } from "../types/friend";

export async function getFriends() {
  const res = await apiClient.get<FriendWithStats[]>("/friends");
  return res.data;
}

export async function getFriendRequests() {
  const res = await apiClient.get<Friend[]>("/friends/requests");
  return res.data;
}

export async function searchUsers(query: string) {
  const res = await apiClient.get<SearchUser[]>("/friends/search", {
    params: { q: query },
  });
  return res.data;
}

export async function sendFriendRequest(username: string) {
  await apiClient.post("/friends", { username });
}

export async function acceptFriendRequest(input: { username?: string; id?: string }) {
  const res = await apiClient.post<Friend>("/friends/accept", input);
  return res.data;
}

export async function rejectFriendRequest(input: { username?: string; id?: string }) {
  await apiClient.post("/friends/reject", input);
}

export async function removeFriend(username: string) {
  await apiClient.delete(`/friends/${username}`);
}

export async function getFriendBooks(username: string) {
  const res = await apiClient.get<{ friend: Friend; books: Book[] }>(
    `/friends/${encodeURIComponent(username)}/books`,
  );
  return res.data;
}

export async function getFriendFriends(username: string) {
  const res = await apiClient.get<Friend[]>(
    `/friends/${encodeURIComponent(username)}/friends`,
  );
  return res.data;
}
