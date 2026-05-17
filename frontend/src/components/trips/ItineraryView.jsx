import { Download, Heart, Mail, Save, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const ListSection = ({ title, items = [] }) => {
  if (!items.length) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 text-sm text-muted-foreground">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="rounded-md bg-muted/60 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export const ItineraryView = ({ trip, onSave, onEmail, onFavorite, onExport, saving, emailing }) => {
  if (!trip) return null;

  const itinerary = trip.itinerary || trip.itinerarySnapshot || {};
  const budget = itinerary.budgetOverview || {};
  const currency = budget.currency || "USD";

  return (
    <div className="grid gap-5">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg p-5"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge>{itinerary.destination}</Badge>
              <Badge variant="secondary">{itinerary.durationDays || trip.request?.duration} days</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-normal sm:text-4xl">{itinerary.title}</h1>
            <p className="mt-3 text-muted-foreground">{itinerary.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {onSave ? (
              <Button variant="outline" onClick={onSave} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? "Saving" : "Save"}
              </Button>
            ) : null}
            {onFavorite ? (
              <Button variant={trip.isFavorite ? "secondary" : "outline"} onClick={onFavorite}>
                <Heart className="h-4 w-4" />
                {trip.isFavorite ? "Favorited" : "Favorite"}
              </Button>
            ) : null}
            {onEmail ? (
              <Button variant="outline" onClick={onEmail} disabled={emailing}>
                <Mail className="h-4 w-4" />
                {emailing ? "Sending" : "Email"}
              </Button>
            ) : null}
            {onExport ? (
              <Button onClick={onExport}>
                <Download className="h-4 w-4" />
                PDF
              </Button>
            ) : null}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total estimate</p>
            <p className="mt-2 text-2xl font-bold">{formatCurrency(budget.totalEstimate || trip.totalEstimatedCost, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Per person</p>
            <p className="mt-2 text-2xl font-bold">{formatCurrency(budget.perPersonEstimate, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Travelers</p>
            <p className="mt-2 text-2xl font-bold">{itinerary.travelers || trip.request?.people || 1}</p>
          </CardContent>
        </Card>
      </div>

      <section className="grid gap-4">
        {(itinerary.days || []).map((day) => (
          <Card key={day.day}>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>
                  Day {day.day}: {day.title}
                </CardTitle>
                <Badge variant="outline">{day.theme}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-3 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Morning:</span> {day.morning}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Afternoon:</span> {day.afternoon}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Evening:</span> {day.evening}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/45 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Utensils className="h-4 w-4 text-accent" />
                  Food and movement
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{day.food}</p>
                <p className="mt-3 text-sm text-muted-foreground">{day.transportNotes}</p>
                <p className="mt-3 text-sm font-semibold">{formatCurrency(day.costEstimate, currency)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tourist Attractions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {(itinerary.attractions || []).map((item) => (
              <div key={item.name} className="rounded-md border bg-background/60 p-3">
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.whyVisit}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.estimatedTime} | {formatCurrency(item.estimatedCost, currency)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Food Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {(itinerary.foodRecommendations || []).map((item) => (
              <div key={`${item.name}-${item.dish}`} className="rounded-md border bg-background/60 p-3">
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.dish} in {item.area}
                </p>
                <Badge className="mt-2" variant="outline">
                  {item.budget}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ListSection title="Packing Tips" items={itinerary.packingTips} />
        <ListSection title="Weather Advice" items={itinerary.weatherAdvice} />
        <ListSection title="Safety Tips" items={itinerary.safetyTips} />
        <ListSection title="Booking Tips" items={itinerary.bookingTips} />
      </div>
    </div>
  );
};
