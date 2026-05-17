import { cn } from "@/lib/utils";

export const Badge = ({ className, variant = "default", ...props }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
      variant === "default" && "bg-primary/12 text-primary",
      variant === "secondary" && "bg-secondary/18 text-secondary-foreground",
      variant === "outline" && "border bg-background/50",
      variant === "accent" && "bg-accent/12 text-accent",
      className
    )}
    {...props}
  />
);
