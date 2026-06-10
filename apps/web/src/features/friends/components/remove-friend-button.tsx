import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type RemoveFriendButtonProps = {
  friendName: string;
  onConfirm: () => void;
  className?: string;
  compact?: boolean;
  triggerClassName?: string;
};

export default function RemoveFriendButton({
  friendName,
  onConfirm,
  className,
  compact = false,
  triggerClassName,
}: RemoveFriendButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {triggerClassName ? (
          <button type="button" className={triggerClassName}>
            Remove
          </button>
        ) : (
          <Button className={className} size={compact ? "sm" : "default"}>
            Remove
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {friendName}?</AlertDialogTitle>
          <AlertDialogDescription>
            They will no longer appear in your friends list, and you can send a new
            friend request later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onConfirm}>Remove</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
