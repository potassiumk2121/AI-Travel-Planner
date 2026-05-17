import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot, ShieldCheck, WandSparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  { title: "Structured itineraries", icon: WandSparkles, text: "Day-wise plans with attractions, costs, food, weather, packing, and safety." },
  { title: "Trip workspace", icon: ShieldCheck, text: "Protected dashboard, saved plans, history, favorites, and admin analytics." },
  { title: "Travel Q&A", icon: Bot, text: "Ask follow-up questions with trip context and Gemini-powered guidance." }
];

export const Home = () => {
  const { user, loading } = useAuth();

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  return (
    <main className="min-h-screen">
      <section className="relative min-h-[82vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=80"
          alt="Mountain lake travel destination"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/82 via-slate-950/40 to-teal-950/45" />
        <div className="relative mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-center px-4 py-20 text-white sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Badge className="bg-white/20 text-white">Gemini + LangChain travel intelligence</Badge>
            <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-normal sm:text-7xl">TravelForge AI</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/84">
              Build realistic itineraries, save trip history, email plans, export PDFs, and monitor usage from one modern SaaS-style workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start planning <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20" asChild>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto -mt-14 grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {features.map((feature) => (
          <Card key={feature.title} className="glass">
            <CardContent className="p-5">
              <feature.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
};
