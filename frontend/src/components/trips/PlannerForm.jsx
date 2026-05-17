import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Select } from "@/components/ui/input";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { cn } from "@/lib/utils";

const interestOptions = ["Food", "Museums", "Nature", "Shopping", "Nightlife", "Adventure", "History", "Family", "Luxury", "Wellness"];

const initialForm = {
  currentCity: "",
  destination: "",
  budget: "Moderate",
  duration: 4,
  people: 2,
  travelMode: "Flight",
  hotelPreference: "Boutique hotel",
  interests: ["Food", "History"]
};

export const PlannerForm = ({ onGenerate, loading }) => {
  const [form, setForm] = useState(initialForm);
  const [voiceText, setVoiceText] = useState("");
  const [error, setError] = useState("");

  const selectedInterests = useMemo(() => new Set(form.interests), [form.interests]);

  const voice = useVoiceInput({
    onResult: (transcript) => {
      setVoiceText(transcript);
      if (!form.destination && transcript) {
        setForm((current) => ({ ...current, destination: transcript.split(" ").slice(-3).join(" ") }));
      }
    }
  });

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleInterest = (interest) => {
    setForm((current) => {
      const next = current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest];
      return { ...current, interests: next };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.currentCity || !form.destination || !form.interests.length) {
      setError("Add your origin, destination, and at least one interest.");
      return;
    }

    onGenerate({
      ...form,
      duration: Number(form.duration),
      people: Number(form.people)
    });
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>AI Travel Planner</CardTitle>
            <CardDescription>Generate a day-wise itinerary with costs, food, safety, weather, and packing guidance.</CardDescription>
          </div>
          <Button type="button" variant={voice.listening ? "destructive" : "outline"} onClick={voice.listening ? voice.stop : voice.start}>
            {voice.listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {voice.listening ? "Stop" : "Voice"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          {voiceText ? (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="rounded-md border bg-background/60 p-3 text-sm">
              {voiceText}
            </motion.div>
          ) : null}
          {voice.error ? <p className="text-sm text-destructive">{voice.error}</p> : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="currentCity">Current city</Label>
              <Input id="currentCity" value={form.currentCity} onChange={(event) => update("currentCity", event.target.value)} placeholder="New York" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" value={form.destination} onChange={(event) => update("destination", event.target.value)} placeholder="Tokyo" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget</Label>
              <Select id="budget" value={form.budget} onChange={(event) => update("budget", event.target.value)}>
                <option>Economy</option>
                <option>Moderate</option>
                <option>Premium</option>
                <option>Luxury</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="duration">Days</Label>
                <Input id="duration" min="1" max="60" type="number" value={form.duration} onChange={(event) => update("duration", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="people">People</Label>
                <Input id="people" min="1" max="50" type="number" value={form.people} onChange={(event) => update("people", event.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="travelMode">Travel mode</Label>
              <Select id="travelMode" value={form.travelMode} onChange={(event) => update("travelMode", event.target.value)}>
                <option>Flight</option>
                <option>Train</option>
                <option>Road trip</option>
                <option>Bus</option>
                <option>Cruise</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hotelPreference">Hotel preference</Label>
              <Select id="hotelPreference" value={form.hotelPreference} onChange={(event) => update("hotelPreference", event.target.value)}>
                <option>Budget hotel</option>
                <option>Boutique hotel</option>
                <option>Family apartment</option>
                <option>Luxury resort</option>
                <option>Hostel</option>
              </Select>
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium transition",
                    selectedInterests.has(interest) ? "border-primary bg-primary text-primary-foreground" : "bg-background/70 hover:bg-muted"
                  )}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {form.interests.map((interest) => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
            <Sparkles className="h-4 w-4" />
            {loading ? "Generating..." : "Generate itinerary"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
