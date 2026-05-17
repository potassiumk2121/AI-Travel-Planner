import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NotFound = () => (
  <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
    <h1 className="text-5xl font-bold">404</h1>
    <p className="mt-3 text-muted-foreground">That route is not on the map.</p>
    <Button className="mt-6" asChild>
      <Link to="/dashboard">Back to dashboard</Link>
    </Button>
  </main>
);
