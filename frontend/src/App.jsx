import { Route, Routes } from "react-router-dom";
import { AdminRoute } from "@/components/layout/AdminRoute";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Admin } from "@/pages/Admin";
import { Chat } from "@/pages/Chat";
import { Dashboard } from "@/pages/Dashboard";
import { Favorites } from "@/pages/Favorites";
import { History } from "@/pages/History";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { NotFound } from "@/pages/NotFound";
import { Planner } from "@/pages/Planner";
import { Profile } from "@/pages/Profile";
import { Saved } from "@/pages/Saved";
import { Signup } from "@/pages/Signup";
import { TripDetails } from "@/pages/TripDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/history" element={<History />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trips/:id" element={<TripDetails />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
