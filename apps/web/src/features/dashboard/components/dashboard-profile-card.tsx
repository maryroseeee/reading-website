import ThemeColorSelect from "@/components/theme-color-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditProfileForm from "@/features/auth/components/edit-profile-form";
import type { UserProfile } from "@/features/auth/types/user";

type DashboardProfileCardProps = {
  user: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void | Promise<void>;
  onProfileUpdated: (data: Partial<UserProfile>) => void;
  onThemeColorChange: (themeColor: string) => void | Promise<void>;
};

export default function DashboardProfileCard({
  user,
  open,
  onOpenChange,
  onLogout,
  onProfileUpdated,
  onThemeColorChange,
}: DashboardProfileCardProps) {
  return (
    <div className="rounded-base border-2 border-border bg-main p-6 shadow-shadow text-main-foreground">
      <div className="mb-4 rounded-base border-2 border-border bg-background shadow-shadow p-3">
        <div className="rounded-base border-2 border-border bg-background flex items-center justify-center h-52">
          <Avatar className="h-44 w-44">
            <AvatarImage src={user.profilePicture || "/default-avatar.png"} alt="avatar" />
            <AvatarFallback>
              {(user.name || "ME").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <p className="break-all opacity-90 text-lg text-center">
        {user.name || "Your Name"}
      </p>
      <p className="break-all opacity-90 text-sm text-center">
        {user.username ? `@${user.username}` : "@username"}
      </p>
      {user.bio && (
        <p className="break-all opacity-90 text-sm text-center">{user.bio}</p>
      )}

      <div className="flex justify-center mt-4 gap-2">
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button className="rounded-base border-2 border-border bg-background px-4 py-2 text-sm text-foreground shadow-shadow">
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <EditProfileForm onSuccess={onProfileUpdated} />
          </DialogContent>
        </Dialog>

        <Button
          onClick={onLogout}
          className="rounded-base border-2 border-border bg-background px-4 py-2 text-sm text-foreground shadow-shadow"
        >
          Logout
        </Button>
      </div>
      <ThemeColorSelect value={user.themeColor} onChange={onThemeColorChange} />
    </div>
  );
}
