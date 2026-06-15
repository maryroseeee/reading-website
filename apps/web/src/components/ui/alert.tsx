import * as React from "react";

import { cn } from "@/lib/utils";

function Alert({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        "relative grid w-full grid-cols-[0_1fr] gap-x-3 rounded-base border-2 border-border bg-background p-4 text-foreground shadow-shadow [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current",
        "has-[>svg]:grid-cols-[auto_1fr]",
        className,
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 font-heading leading-none", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 mt-1 text-sm font-base leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
