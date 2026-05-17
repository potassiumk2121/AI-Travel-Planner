import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookmarkCheck,
  Bot,
  Compass,
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  Map,
  Shield,
  Sparkles,
  UserRound
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planner", label: "Planner", icon: Compass },
  { to: "/saved", label: "Saved", icon: BookmarkCheck },
  { to: "/history", label: "History", icon: History },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/chat", label: "AI Chat", icon: Bot },
  { to: "/profile", label: "Profile", icon: UserRound }
];

const ShellLink = ({ item }) => (
  <NavLink
    to={item.to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-muted",
        isActive ? "bg-primary text-primary-foreground shadow-glow hover:bg-primary" : "text-muted-foreground"
      )
    }
  >
    <item.icon className="h-4 w-4" />
    <span>{item.label}</span>
  </NavLink>
);

export const AppShell = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const links = user?.role === "admin" ? [...navItems, { to: "/admin", label: "Admin", icon: Shield }] : navItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-4 py-4 lg:flex-row lg:px-6">
        <aside className="glass sticky top-4 z-30 h-auto rounded-lg p-3 lg:h-[calc(100vh-2rem)] lg:w-72">
          <div className="flex items-center justify-between gap-3 px-2 py-2 lg:block">
            <NavLink to="/dashboard" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-foreground text-background">
                <Map className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold">TravelForge AI</span>
                <span className="block text-xs text-muted-foreground">Planner workspace</span>
              </span>
            </NavLink>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleTheme} aria-label="Toggle theme">
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>

          <nav className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {links.map((item) => (
              <ShellLink key={item.to} item={item} />
            ))}
          </nav>

          <div className="mt-4 hidden rounded-lg border bg-background/60 p-4 lg:block">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{user?.email}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleTheme} className="flex-1">
                {theme === "dark" ? "Light" : "Dark"}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
