export type UserProfile = {
  email: string;
  name?: string;
  username?: string;
  bio?: string;
  profilePicture?: string;
};

export type ProfileFormData = {
  name: string;
  username: string;
  bio: string;
  profilePicture: string;
};
