import { cn } from "@/lib/utils";

export const Card = ({ className, ...props }) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-panel", className)} {...props} />
);

export const CardHeader = ({ className, ...props }) => <div className={cn("p-5 pb-3", className)} {...props} />;

export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-lg font-semibold leading-tight", className)} {...props} />
);

export const CardDescription = ({ className, ...props }) => (
  <p className={cn("mt-1 text-sm text-muted-foreground", className)} {...props} />
);

export const CardContent = ({ className, ...props }) => <div className={cn("p-5 pt-3", className)} {...props} />;

export const CardFooter = ({ className, ...props }) => <div className={cn("p-5 pt-3", className)} {...props} />;
