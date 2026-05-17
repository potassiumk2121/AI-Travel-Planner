import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { exportItineraryPdf } from "@/lib/pdf";
import { TripCard } from "@/components/trips/TripCard";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";

export const History = () => {
  const toast = useToast();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api
      .get("/itineraries/history")
      .then(({ data }) => setTrips(data.trips))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const remove = async (trip) => {
    try {
      await api.delete(`/itineraries/${trip._id}`);
      setTrips((current) => current.filter((item) => item._id !== trip._id));
      toast.success("Trip deleted");
    } catch (error) {
      toast.error("Delete failed", error.userMessage);
    }
  };

  const toggleFavorite = async (trip) => {
    try {
      const endpoint = `/itineraries/${trip._id}/favorite`;
      const { data } = trip.isFavorite ? await api.delete(endpoint) : await api.post(endpoint);
      setTrips((current) => current.map((item) => (item._id === trip._id ? data.trip : item)));
    } catch (error) {
      toast.error("Favorite failed", error.userMessage);
    }
  };

  if (loading) return <Spinner className="min-h-[70vh]" label="Loading trip history" />;

  return (
    <div className="grid gap-5">
      <section className="glass rounded-lg p-5">
        <h1 className="text-3xl font-bold tracking-normal">Trip History</h1>
        <p className="mt-2 text-muted-foreground">Every generated itinerary appears here for review and export.</p>
      </section>
      {trips.length ? (
        <div className="grid gap-4">
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip} onFavorite={toggleFavorite} onDelete={remove} onExport={exportItineraryPdf} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">No generated trips yet.</CardContent>
        </Card>
      )}
    </div>
  );
};
