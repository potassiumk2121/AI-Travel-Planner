import { useEffect, useState } from "react";
import { Activity, MapPin, Users } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/utils";

const AdminStat = ({ icon: Icon, label, value }) => (
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

export const Admin = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then(({ data: response }) => setData(response))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="min-h-[70vh]" label="Loading admin panel" />;

  return (
    <div className="grid gap-5">
      <section className="glass rounded-lg p-5">
        <h1 className="text-3xl font-bold tracking-normal">Admin Panel</h1>
        <p className="mt-2 text-muted-foreground">Monitor users, generated itineraries, saved plans, and destination demand.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminStat icon={Users} label="Total users" value={data?.stats?.totalUsers || 0} />
        <AdminStat icon={Activity} label="Itineraries generated" value={data?.stats?.totalTrips || 0} />
        <AdminStat icon={MapPin} label="Saved itineraries" value={data?.stats?.totalSaved || 0} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Most searched destinations</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {data?.mostSearchedDestinations?.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-md border bg-background/60 px-3 py-2 text-sm">
                <span>{item.destination}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent analytics events</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {data?.recentEvents?.map((event) => (
              <div key={event._id} className="rounded-md border bg-background/60 px-3 py-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{event.eventType}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</span>
                </div>
                <p className="mt-1 text-muted-foreground">{event.destination || event.user?.email || "System event"}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
