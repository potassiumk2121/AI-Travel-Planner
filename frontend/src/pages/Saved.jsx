import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { exportItineraryPdf } from "@/lib/pdf";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { TripCard } from "@/components/trips/TripCard";

export const Saved = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/itineraries/saved")
      .then(({ data }) => setItems(data.saved))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="min-h-[70vh]" label="Loading saved itineraries" />;

  return (
    <div className="grid gap-5">
      <section className="glass rounded-lg p-5">
        <h1 className="text-3xl font-bold tracking-normal">Saved Itineraries</h1>
        <p className="mt-2 text-muted-foreground">Curated trips you marked for later planning and booking.</p>
      </section>
      {items.length ? (
        <div className="grid gap-4">
          {items.map((item) => <TripCard key={item._id} trip={item} onExport={() => exportItineraryPdf(item)} />)}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">Saved itineraries will appear here.</CardContent>
        </Card>
      )}
    </div>
  );
};
