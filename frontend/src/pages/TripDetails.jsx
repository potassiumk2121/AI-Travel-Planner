import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { exportItineraryPdf } from "@/lib/pdf";
import { ItineraryView } from "@/components/trips/ItineraryView";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";

export const TripDetails = () => {
  const { id } = useParams();
  const toast = useToast();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailing, setEmailing] = useState(false);

  useEffect(() => {
    api
      .get(`/itineraries/${id}`)
      .then(({ data }) => setTrip(data.trip))
      .finally(() => setLoading(false));
  }, [id]);

  const favorite = async () => {
    try {
      const endpoint = `/itineraries/${trip._id}/favorite`;
      const { data } = trip.isFavorite ? await api.delete(endpoint) : await api.post(endpoint);
      setTrip(data.trip);
    } catch (error) {
      toast.error("Favorite failed", error.userMessage);
    }
  };

  const email = async () => {
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

  if (loading) return <Spinner className="min-h-[70vh]" label="Opening itinerary" />;

  return <ItineraryView trip={trip} onFavorite={favorite} onEmail={email} onExport={() => exportItineraryPdf(trip)} emailing={emailing} />;
};
