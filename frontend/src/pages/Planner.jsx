import { useState } from "react";
import { api } from "@/lib/api";
import { exportItineraryPdf } from "@/lib/pdf";
import { PlannerForm } from "@/components/trips/PlannerForm";
import { ItineraryView } from "@/components/trips/ItineraryView";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";

export const Planner = () => {
  const toast = useToast();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [emailing, setEmailing] = useState(false);

  const generate = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/itineraries/generate", payload);
      setTrip(data.trip);
      toast.success("Itinerary generated", `${data.trip.request.destination} is ready.`);
    } catch (error) {
      toast.error("Generation failed", error.userMessage);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!trip) return;
    setSaving(true);
    try {
      await api.post("/itineraries/save", { tripId: trip._id, title: trip.itinerary.title });
      toast.success("Saved", "This itinerary was added to your saved trips.");
    } catch (error) {
      toast.error("Save failed", error.userMessage);
    } finally {
      setSaving(false);
    }
  };

  const email = async () => {
    if (!trip) return;
    setEmailing(true);
    try {
      const { data } = await api.post(`/itineraries/${trip._id}/email`, {});
      toast.success("Email sent", data.message);
    } catch (error) {
      toast.error("Email failed", error.userMessage);
    } finally {
      setEmailing(false);
    }
  };

  const favorite = async () => {
    if (!trip) return;
    try {
      const endpoint = `/itineraries/${trip._id}/favorite`;
      const { data } = trip.isFavorite ? await api.delete(endpoint) : await api.post(endpoint);
      setTrip(data.trip);
      toast.success(trip.isFavorite ? "Favorite removed" : "Favorite added");
    } catch (error) {
      toast.error("Favorite failed", error.userMessage);
    }
  };

  return (
    <div className="grid gap-5">
      <PlannerForm onGenerate={generate} loading={loading} />
      {loading ? <Spinner className="rounded-lg border bg-card p-10" label="Asking Gemini for a practical route" /> : null}
      <ItineraryView
        trip={trip}
        onSave={save}
        onEmail={email}
        onFavorite={favorite}
        onExport={() => exportItineraryPdf(trip)}
        saving={saving}
        emailing={emailing}
      />
    </div>
  );
};
