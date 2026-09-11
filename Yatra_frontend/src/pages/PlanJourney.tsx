import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CarFront,
  MapPin,
  TrainFront,
  Plane,
  Bus,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { planCompleteJourney } from "../utils/API";
import JourneyMap from "../components/JourneyMap";

type JourneyLeg = {
  mode: string;
  from: string;
  to: string;
  duration: string;
  departure: string;
  arrival: string;
};

type JourneyOption = {
  cost: number;
  duration: string;
  transfers: number;
  legs: JourneyLeg[];
};

type JourneyOptions = {
  best_overall: JourneyOption;
  cheapest: JourneyOption;
  fastest: JourneyOption;
  convenient: JourneyOption;
};

type SavedTrip = {
  id: string;
  title: string;
  origin: string;
  destination: string;
  option: string;
  optionKey: keyof JourneyOptions;
  cost: number;
  duration: string;
  transfers: number;
  query: string;
  legs: JourneyLeg[];
  savedAt: string;
};

const optionLabels = [
  {
    key: "best_overall",
    title: "Best Overall",
    score: "Best balance",
  },
  {
    key: "fastest",
    title: "Fastest",
    score: "Quickest journey",
  },
  {
    key: "cheapest",
    title: "Cheapest",
    score: "Lowest cost",
  },
  {
    key: "convenient",
    title: "Most Convenient",
    score: "Fewer changes",
  },
] as const;

const getIcon = (mode: string) => {
  const lower = mode.toLowerCase();

  if (lower.includes("flight")) return Plane;
  if (lower.includes("bus")) return Bus;
  if (lower.includes("train") || lower.includes("express")) {
    return TrainFront;
  }
  if (lower.includes("cab") || lower.includes("car")) {
    return CarFront;
  }

  return MapPin;
};

const PlanJourney = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    query?: string;
    tripType?: string;
    passengers?: string;
    preference?: string;
    transportMode?: string;
  } | null;

  const query = state?.query || "";

  const [data, setData] = useState<any>(null);
  const [selected, setSelected] =
    useState<keyof JourneyOptions>("best_overall");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadSavedJourney = () => {
      try {
        const savedJourney = localStorage.getItem("yatra_latest_journey");

        if (!savedJourney) return false;

        const savedResult = JSON.parse(savedJourney);

        if (!savedResult?.success || !savedResult?.journey_details) {
          return false;
        }

        console.log("Restoring latest YATRA journey from localStorage.");

        setData(savedResult);

        const recommendedOption =
          savedResult?.journey_details?.recommended_option;

        if (
          recommendedOption === "best_overall" ||
          recommendedOption === "fastest" ||
          recommendedOption === "cheapest" ||
          recommendedOption === "convenient"
        ) {
          setSelected(recommendedOption);
        } else {
          setSelected("best_overall");
        }

        setSaved(false);
        setError("");
        setLoading(false);
        return true;
      } catch (storageError) {
        console.error("Could not restore saved journey:", storageError);
        return false;
      }
    };

    // Compare -> Back to journey may return to /plan without
    // React Router state. Restore the last successful plan instead
    // of making a new request with an empty query.
    if (!query.trim()) {
      if (!loadSavedJourney()) {
        setError("Please enter a journey request first.");
        setLoading(false);
      }
      return;
    }

    const fetchJourney = async () => {
      try {
        setLoading(true);
        setError("");
        setSaved(false);

        console.log("YATRA query:", query);

        const result = await planCompleteJourney({
          query,
          preferences: {
            preference: state?.preference || "Balanced",
            transport: state?.transportMode || "Any mode",
            passengers: state?.passengers || "1 Passenger",
            tripType: state?.tripType || "One way",
          },
        });

        console.log("YATRA backend response:", result);

        if (!result.success) {
          throw new Error(
            result.error || "Could not plan this journey."
          );
        }

        setData(result);

        const recommendedOption =
          result?.journey_details?.recommended_option;

        if (
          recommendedOption === "best_overall" ||
          recommendedOption === "fastest" ||
          recommendedOption === "cheapest" ||
          recommendedOption === "convenient"
        ) {
          setSelected(recommendedOption);
        } else {
          setSelected("best_overall");
        }

        // Keep the latest successful journey available to Compare
        // and to restore Plan Journey after navigation.
        localStorage.setItem(
          "yatra_latest_journey",
          JSON.stringify({
            ...result,
            original_preferences: {
              preference: state?.preference || "Balanced",
              transport: state?.transportMode || "Any mode",
              passengers: state?.passengers || "1 Passenger",
              tripType: state?.tripType || "One way",
            },
          })
        );
      } catch (err) {
        console.error("Journey planning failed:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to connect to YATRA backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, [query]);

  const saveTrip = (optionKey: keyof JourneyOptions) => {
    if (!data?.journey_details?.options?.[optionKey]) return;

    const route: JourneyOption =
      data.journey_details.options[optionKey];

    const origin =
      data?.parsed_route?.origin || "Starting point";
    const destination =
      data?.parsed_route?.destination || "Destination";

    const trip: SavedTrip = {
      id: `${Date.now()}-${optionKey}`,
      title: `${origin} → ${destination}`,
      origin,
      destination,
      option:
        optionLabels.find((item) => item.key === optionKey)?.title ||
        optionKey,
      optionKey,
      cost: route.cost,
      duration: route.duration,
      transfers: route.transfers,
      query,
      legs: route.legs,
      savedAt: new Date().toISOString(),
    };

    try {
      const existing: SavedTrip[] = JSON.parse(
        localStorage.getItem("yatra_saved_trips") || "[]"
      );

      localStorage.setItem(
        "yatra_saved_trips",
        JSON.stringify([trip, ...existing].slice(0, 20))
      );

      setSaved(true);
    } catch (storageError) {
      console.error("Could not save trip:", storageError);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f3eb] text-[#172d43]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#3678a6]" />
          <h2 className="text-xl font-semibold">
            Planning your journey...
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            YATRA is finding the best travel options.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f3eb] px-6 text-[#172d43]">
        <div className="max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg">
          <h2 className="text-xl font-semibold">
            Couldn't plan this journey
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={() => window.history.back()}
            className="mt-6 rounded-xl bg-[#102942] px-5 py-3 text-sm font-semibold text-white"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const options: JourneyOptions =
    data?.journey_details?.options;

  const route = options?.[selected];

  const parsedOrigin =
    data?.parsed_route?.origin || "Your starting point";

  const parsedDestination =
    data?.parsed_route?.destination || "Your destination";

  if (!route) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f3eb]">
        <p className="text-slate-500">
          No journey options were returned.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3eb] text-[#172d43] mt-10">
      <section className="mx-auto max-w-7xl p-6 md:p-10">

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#3678a6]">
            YATRA AI
          </p>

          <h1 className="mt-2 text-2xl font-semibold">
            {parsedOrigin} → {parsedDestination}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            "{query}"
          </p>
        </div>

        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-500">
              4 journeys found
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Choose your route
            </h2>
          </div>

          <button
            onClick={() => navigate("/compare")}
            className="hidden text-sm text-slate-500 md:block"
          >
            Compare options →
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">

          <div className="space-y-3">
            {optionLabels.map((option) => {
              const routeData = options[option.key];

              return (
                <motion.button
                  key={option.key}
                  onClick={() => {
                    setSelected(option.key);
                    setSaved(false);
                  }}
                  whileHover={{ y: -2 }}
                  className={`w-full rounded-2xl border p-5 text-left transition ${
                    selected === option.key
                      ? "border-[#3678a6] bg-white shadow-lg"
                      : "border-slate-200 bg-white/60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#3678a6]">
                        {option.title}
                      </span>

                      <h3 className="mt-2 text-xl font-semibold">
                        {routeData.duration}
                      </h3>
                    </div>

                    {data?.journey_details?.recommended_option ===
                      option.key && (
                      <span className="rounded-full bg-[#e7f1f0] px-3 py-1 text-[11px] text-[#3678a6]">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span>
                      ₹{routeData.cost.toLocaleString("en-IN")}
                    </span>

                    <span>
                      {routeData.transfers}{" "}
                      {routeData.transfers === 1
                        ? "transfer"
                        : "transfers"}
                    </span>

                    <span>
                      {option.score}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-sm font-medium">
                    View journey
                    <ArrowRight size={15} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          <Journey
            route={route}
            from={parsedOrigin}
            to={parsedDestination}
            onSave={() => saveTrip(selected)}
            onContinue={() => navigate("/compare")}
            saved={saved}
          />

        </div>

        <div className="mt-8">
          <JourneyMap
            routeGeometry={data?.map_details?.route_geometry}
            origin={parsedOrigin}
            destination={parsedDestination}
          />
        </div>
      </section>
    </main>
  );
};

const Journey = ({
  route,
  from,
  to,
  onSave,
  onContinue,
  saved,
}: {
  route: JourneyOption;
  from: string;
  to: string;
  onSave: () => void;
  onContinue: () => void;
  saved: boolean;
}) => (
  <motion.div
    key={`${from}-${to}-${route.duration}`}
    initial={{ opacity: 0, x: 15 }}
    animate={{ opacity: 1, x: 0 }}
    className="rounded-2xl border border-slate-200 bg-white p-6"
  >
    <div className="flex items-center justify-between border-b border-slate-100 pb-5">
      <div>
        <p className="text-xs text-slate-400">
          SELECTED JOURNEY
        </p>

        <h2 className="mt-1 text-xl font-semibold">
          {from} → {to}
        </h2>
      </div>

      <div className="text-right">
        <p className="text-lg font-semibold">
          ₹{route.cost.toLocaleString("en-IN")}
        </p>

        <p className="text-xs text-slate-400">
          {route.duration}
        </p>
      </div>
    </div>

    <div className="py-6">
      {route.legs.map((leg, i) => {
        const Icon = getIcon(leg.mode);

        return (
          <div
            key={`${leg.from}-${leg.to}-${i}`}
            className="relative flex gap-4 pb-7 last:pb-0"
          >
            {i < route.legs.length - 1 && (
              <span className="absolute left-2.75 top-7 h-full w-px bg-slate-200" />
            )}

            <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e7f1f0] text-[#3678a6]">
              <Icon size={13} />
            </span>

            <div className="flex-1">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">
                    {leg.from} → {leg.to}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {leg.mode} · {leg.duration}
                  </p>
                </div>

                <time className="text-xs text-slate-400">
                  {leg.departure}
                </time>
              </div>

              <p className="mt-1 text-[11px] text-slate-300">
                Arrival: {leg.arrival}
              </p>
            </div>
          </div>
        );
      })}
    </div>

    <div className="flex gap-3 border-t border-slate-100 pt-5">
      <button
        onClick={onSave}
        className="flex-1 rounded-xl border border-slate-200 p-3 text-sm"
      >
        {saved ? "Trip Saved ✓" : "Save Trip"}
      </button>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="flex-1 rounded-xl bg-[#102942] p-3 text-sm font-semibold text-white"
      >
        Compare
        <ArrowRight
          className="ml-1 inline"
          size={15}
        />
      </motion.button>
    </div>
  </motion.div>
);

export default PlanJourney;
