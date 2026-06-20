import { AlertTriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type PageErrorProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function PageError({
  title = "Something went wrong",
  message = "Try refreshing the page.",
  onRetry,
}: PageErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-base border-2 border-border bg-main p-6 text-center text-main-foreground shadow-shadow">
        <AlertTriangleIcon className="mx-auto mb-3 h-8 w-8" />
        <h1 className="text-lg font-heading">{title}</h1>
        <p className="mt-2 rounded-base border-2 border-border bg-background p-3 text-sm text-foreground shadow-shadow">
          {message}
        </p>
        {onRetry && (
          <Button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-base border-2 border-border bg-background px-4 py-2 text-sm text-foreground shadow-shadow"
          >
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
