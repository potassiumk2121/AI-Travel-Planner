import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export const Profile = () => {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    name: user?.name || "",
    favoriteDestinations: user?.favoriteDestinations?.join(", ") || "",
    defaultBudget: user?.preferences?.defaultBudget || "",
    favoriteTravelMode: user?.preferences?.favoriteTravelMode || "",
    preferredHotelType: user?.preferences?.preferredHotelType || ""
  });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch("/users/profile", {
        name: form.name,
        favoriteDestinations: form.favoriteDestinations
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        preferences: {
          defaultBudget: form.defaultBudget,
          favoriteTravelMode: form.favoriteTravelMode,
          preferredHotelType: form.preferredHotelType
        }
      });
      setUser(data.user);
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Profile update failed", error.userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-5">
      <section className="glass rounded-lg p-5">
        <h1 className="text-3xl font-bold tracking-normal">Profile</h1>
        <p className="mt-2 text-muted-foreground">Keep preferences ready for faster itinerary planning.</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{user?.email}</CardTitle>
          <CardDescription>Role: {user?.role}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="favoriteDestinations">Favorite destinations</Label>
              <Input
                id="favoriteDestinations"
                value={form.favoriteDestinations}
                onChange={(event) => setForm({ ...form, favoriteDestinations: event.target.value })}
                placeholder="Tokyo, Lisbon, Bali"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="defaultBudget">Default budget</Label>
              <Input id="defaultBudget" value={form.defaultBudget} onChange={(event) => setForm({ ...form, defaultBudget: event.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="favoriteTravelMode">Favorite travel mode</Label>
              <Input
                id="favoriteTravelMode"
                value={form.favoriteTravelMode}
                onChange={(event) => setForm({ ...form, favoriteTravelMode: event.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preferredHotelType">Preferred hotel type</Label>
              <Input
                id="preferredHotelType"
                value={form.preferredHotelType}
                onChange={(event) => setForm({ ...form, preferredHotelType: event.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
