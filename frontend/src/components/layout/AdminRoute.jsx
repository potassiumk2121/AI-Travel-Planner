import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

export const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner className="min-h-screen" label="Checking access" />;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};
