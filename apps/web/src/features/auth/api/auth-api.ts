import { apiClient } from "@/lib/api-client";

import type { ProfileFormData, UserProfile } from "../types/user";

export async function loginWithGoogle(idToken: string) {
  await apiClient.post("/auth/google", { id_token: idToken });
}

export async function getCurrentUser() {
  const res = await apiClient.get<UserProfile>("/auth/me");
  return res.data;
}

export async function updateCurrentUser(profile: ProfileFormData) {
  const res = await apiClient.put<ProfileFormData>("/auth/me", profile);
  return res.data;
}

export async function logout() {
  await apiClient.post("/auth/logout");
}
