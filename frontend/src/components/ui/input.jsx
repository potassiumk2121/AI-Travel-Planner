import React from "react";
import { cn } from "@/lib/utils";

export const Label = ({ className, ...props }) => (
  <label className={cn("text-sm font-medium text-foreground", className)} {...props} />
);

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-md border bg-background/80 px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-28 w-full resize-y rounded-md border bg-background/80 px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";

export const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-11 w-full rounded-md border bg-background/80 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
      className
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = "Select";
