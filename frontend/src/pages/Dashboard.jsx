import { useEffect, useState } from "react";
import { BarChart3, BookmarkCheck, Heart, Plane } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { TripCard } from "@/components/trips/TripCard";
import { exportItineraryPdf } from "@/lib/pdf";

const Stat = ({ icon: Icon, label, value }) => (
  <Card>
    <CardContent className="flex items-center gap-4 p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/12 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/dashboard")
      .then(({ data: response }) => setData(response))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="min-h-[70vh]" label="Loading dashboard" />;

  return (
    <div className="grid gap-5">
      <section className="glass rounded-lg p-5">
        <p className="text-sm font-semibold text-primary">Workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">Welcome, {data?.profile?.name}</h1>
        <p className="mt-2 text-muted-foreground">Generate, save, export, and revisit your travel plans from here.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={Plane} label="Trips generated" value={data?.stats?.totalTrips || 0} />
        <Stat icon={BookmarkCheck} label="Saved itineraries" value={data?.stats?.savedCount || 0} />
        <Stat icon={Heart} label="Favorites" value={data?.stats?.favoriteCount || 0} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <section className="grid gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Recent Trips</h2>
          </div>
          {data?.recentTrips?.length ? (
            data.recentTrips.map((trip) => <TripCard key={trip._id} trip={trip} onExport={exportItineraryPdf} />)
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">No trips yet. Generate your first itinerary from the planner.</CardContent>
            </Card>
          )}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Top destinations</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {data?.topDestinations?.length ? (
              data.topDestinations.map((item) => (
                <div key={item._id} className="flex items-center justify-between rounded-md border bg-background/60 px-3 py-2 text-sm">
                  <span>{item.destination}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Searches will appear after itinerary generation.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
