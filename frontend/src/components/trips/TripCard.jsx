import { Link } from "react-router-dom";
import { Download, Heart, MapPin, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { compactList, formatCurrency, formatDate } from "@/lib/utils";

export const TripCard = ({ trip, onFavorite, onDelete, onExport }) => {
  const itinerary = trip.itinerary || trip.itinerarySnapshot || {};
  const request = trip.request || trip.trip?.request || {};
  const id = trip.trip?._id || trip.trip || trip._id;

  return (
    <Card className="transition hover:-translate-y-0.5 hover:shadow-glow">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{request.destination || trip.destination || itinerary.destination}</Badge>
              {trip.createdAt ? <Badge variant="outline">{formatDate(trip.createdAt)}</Badge> : null}
            </div>
            <h3 className="mt-3 text-lg font-semibold">{itinerary.title || trip.title || "Saved itinerary"}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{itinerary.summary || "A saved AI travel plan."}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {compactList([request.currentCity, request.travelMode, request.hotelPreference]) || "Trip details"}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {onFavorite ? (
              <Button variant={trip.isFavorite ? "secondary" : "outline"} size="icon" onClick={() => onFavorite(trip)} aria-label="Toggle favorite">
                <Heart className="h-4 w-4" />
              </Button>
            ) : null}
            {onExport ? (
              <Button variant="outline" size="icon" onClick={() => onExport(trip)} aria-label="Export PDF">
                <Download className="h-4 w-4" />
              </Button>
            ) : null}
            {onDelete ? (
              <Button variant="ghost" size="icon" onClick={() => onDelete(trip)} aria-label="Delete trip">
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm">
          <span className="text-muted-foreground">
            {request.duration || itinerary.durationDays || 0} days | {request.people || itinerary.travelers || 1} traveler(s)
          </span>
          <span className="font-semibold">
            {formatCurrency(itinerary.budgetOverview?.totalEstimate || trip.totalEstimatedCost, itinerary.budgetOverview?.currency || "USD")}
          </span>
          {id ? (
            <Button asChild variant="outline" size="sm">
              <Link to={`/trips/${id}`}>Open</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
