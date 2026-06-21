export type UserProfile = {
  email: string;
  name?: string;
  username?: string;
  bio?: string;
  profilePicture?: string;
  themeColor?: string;
  isDemo?: boolean;
};

export type ProfileFormData = {
  name: string;
  username: string;
  bio: string;
  profilePicture: string;
};
