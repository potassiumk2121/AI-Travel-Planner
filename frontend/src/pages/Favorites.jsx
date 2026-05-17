import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { exportItineraryPdf } from "@/lib/pdf";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { TripCard } from "@/components/trips/TripCard";
import { useToast } from "@/components/ui/toast";

export const Favorites = () => {
  const toast = useToast();
  const [data, setData] = useState({ trips: [], favoriteDestinations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/itineraries/favorites")
      .then(({ data: response }) => setData(response))
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = async (trip) => {
    try {
      const { data: response } = await api.delete(`/itineraries/${trip._id}/favorite`);
      setData((current) => ({
        ...current,
        trips: current.trips.filter((item) => item._id !== trip._id),
        favoriteDestinations: response.user.favoriteDestinations
      }));
      toast.success("Favorite removed");
    } catch (error) {
      toast.error("Favorite failed", error.userMessage);
    }
  };

  if (loading) return <Spinner className="min-h-[70vh]" label="Loading favorites" />;

  return (
    <div className="grid gap-5">
      <section className="glass rounded-lg p-5">
        <h1 className="text-3xl font-bold tracking-normal">Favorites</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {data.favoriteDestinations?.length ? (
            data.favoriteDestinations.map((destination) => <Badge key={destination}>{destination}</Badge>)
          ) : (
            <p className="text-muted-foreground">Favorite destinations will appear here.</p>
          )}
        </div>
      </section>
      {data.trips.length ? (
        data.trips.map((trip) => <TripCard key={trip._id} trip={trip} onFavorite={toggleFavorite} onExport={exportItineraryPdf} />)
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">No favorite trips yet.</CardContent>
        </Card>
      )}
    </div>
  );
};
