import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CarFront,
  Check,
  IndianRupee,
  MapPin,
  TrainFront,
  Plane,
  Bus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  fastest: JourneyOption;
  cheapest: JourneyOption;
  convenient: JourneyOption;
};

type LatestJourney = {
  original_query: string;
  parsed_route: {
    origin: string;
    destination: string;
  };
  journey_details: {
    options: JourneyOptions;
    recommended_option?: keyof JourneyOptions;
  };
};

const optionLabels = [
  {
    key: "best_overall",
    name: "Best Overall",
    description: "Best balance of time, price and comfort",
  },
  {
    key: "fastest",
    name: "Fastest",
    description: "Reach your destination sooner",
  },
  {
    key: "cheapest",
    name: "Cheapest",
    description: "Lowest fare for the journey",
  },
  {
    key: "convenient",
    name: "Most Convenient",
    description: "Fewer changes and easier transfers",
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

const Compare = () => {
  const navigate = useNavigate();
  const [latest, setLatest] = useState<LatestJourney | null>(null);
  const [active, setActive] =
    useState<keyof JourneyOptions>("best_overall");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("yatra_latest_journey");

      if (stored) {
        const parsed: LatestJourney = JSON.parse(stored);
        setLatest(parsed);

        const recommended = parsed?.journey_details?.recommended_option;

        if (
          recommended === "best_overall" ||
          recommended === "fastest" ||
          recommended === "cheapest" ||
          recommended === "convenient"
        ) {
          setActive(recommended);
        }
      }
    } catch (error) {
      console.error("Could not load latest journey:", error);
    }
  }, []);

  const journey = latest?.journey_details?.options?.[active];

  const steps = useMemo(() => {
    if (!journey) return [];

    return journey.legs.map((leg) => ({
      title: `${leg.from} → ${leg.to}`,
      subtitle: `${leg.mode} · ${leg.duration}`,
      Icon: getIcon(leg.mode),
      departure: leg.departure,
      arrival: leg.arrival,
    }));
  }, [journey]);

  const saveTrip = () => {
    if (!latest || !journey) return;

    const selectedLabel =
      optionLabels.find((item) => item.key === active)?.name ||
      active;

    const trip = {
      id: `${Date.now()}-${active}`,
      title: `${latest.parsed_route.origin} → ${latest.parsed_route.destination}`,
      origin: latest.parsed_route.origin,
      destination: latest.parsed_route.destination,
      option: selectedLabel,
      optionKey: active,
      cost: journey.cost,
      duration: journey.duration,
      transfers: journey.transfers,
      query: latest.original_query,
      legs: journey.legs,
      savedAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("yatra_saved_trips") || "[]"
      );

      localStorage.setItem(
        "yatra_saved_trips",
        JSON.stringify([trip, ...existing].slice(0, 20))
      );

      setSaved(true);
    } catch (error) {
      console.error("Could not save trip:", error);
    }
  };

  if (!latest || !journey) {
    return (
      <main className="min-h-screen bg-[#f6f3eb] text-[#16294a] p-6 md:p-12 lg:p-16 mt-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#16294a]/10 bg-white p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#3678a6]">
            Compare
          </p>

          <h1 className="mt-2 font-serif text-4xl">
            No journey to compare yet.
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Plan a journey first and YATRA will bring all four options here.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-[#16294a] px-5 py-3 text-sm font-semibold text-white"
          >
            Plan a journey
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3eb] text-[#16294a] p-6 md:p-12 lg:p-16 mt-10">
      <header className="rounded-2xl border-b border-[#16294a]/10 bg-[#fffdf7]">
        <div className="mx-auto max-w-7xl p-6 md:p-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#3678a6]">
                Compare
              </p>

              <h1 className="mt-2 font-serif text-4xl md:text-5xl">
                Find the journey that fits you.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Compare every option by time, fare, transfers and convenience.
              </p>
            </div>

            <div className="rounded-xl border border-[#16294a]/10 bg-white p-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Journey
              </p>
              <p className="mt-1 font-semibold">
                {latest.parsed_route.origin} → {latest.parsed_route.destination}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {latest.original_query}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl p-6 md:p-10">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {optionLabels.map((item) => {
            const option = latest.journey_details.options[item.key];
            const selected = active === item.key;
            const recommended =
              latest.journey_details.recommended_option === item.key;

            return (
              <motion.button
                key={item.key}
                onClick={() => {
                  setActive(item.key);
                  setSaved(false);
                }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-[#3678a6] bg-white shadow-md"
                    : "border-[#16294a]/10 bg-white/60 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3678a6]">
                    {item.name}
                  </span>

                  {recommended && (
                    <span className="rounded-full bg-[#e8f1ef] px-2 py-1 text-[10px] text-[#3678a6]">
                      Recommended
                    </span>
                  )}
                </div>

                <p className="mt-5 text-2xl font-semibold">
                  {option.duration}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1 font-medium">
                    <IndianRupee size={14} />
                    {option.cost.toLocaleString("en-IN")}
                  </span>

                  <span className="text-xs text-slate-400">
                    {option.transfers}{" "}
                    {option.transfers === 1 ? "transfer" : "transfers"}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  {item.description}
                </p>
              </motion.button>
            );
          })}
        </div>

        <motion.section
          key={active}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 overflow-hidden rounded-2xl border border-[#16294a]/10 bg-white"
        >
          <div className="flex flex-col gap-5 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[.18em] text-slate-400">
                Selected journey
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                {optionLabels.find((item) => item.key === active)?.name}
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <Info
                label="Departure"
                value={journey.legs[0]?.departure || "—"}
              />
              <Info
                label="Arrival"
                value={journey.legs[journey.legs.length - 1]?.arrival || "—"}
              />
              <Info
                label="Fare"
                value={`₹${journey.cost.toLocaleString("en-IN")}`}
              />
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="relative">
              <div className="absolute bottom-4 left-3 top-4 w-px bg-slate-200" />

              {steps.map((step, index) => (
                <motion.div
                  key={`${step.title}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative flex gap-5 pb-8 last:pb-0"
                >
                  <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f1ef] text-[#3678a6]">
                    <step.Icon size={13} />
                  </span>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">
                          {step.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {step.subtitle}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-300">
                          Arrival: {step.arrival}
                        </p>
                      </div>

                      <time className="text-xs text-slate-400">
                        {step.departure}
                      </time>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:justify-end">
            <button
              onClick={saveTrip}
              className="rounded-xl border border-slate-200 p-3 text-sm"
            >
              {saved ? "Trip Saved ✓" : "Save Trip"}
            </button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/plan")}
              className="rounded-xl bg-[#16294a] p-3 text-sm font-semibold text-white"
            >
              Back to journey
              <ArrowRight className="ml-2 inline" size={15} />
            </motion.button>
          </div>
        </motion.section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Compare details</h2>
            <span className="text-xs text-slate-400">4 options</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#16294a]/10 bg-white">
            <table className="w-full min-w-[650px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="p-5">Journey</th>
                  <th className="p-5">Duration</th>
                  <th className="p-5">Fare</th>
                  <th className="p-5">Transfers</th>
                  <th className="p-5">Departure</th>
                </tr>
              </thead>

              <tbody>
                {optionLabels.map((item) => {
                  const option = latest.journey_details.options[item.key];

                  return (
                    <tr
                      key={item.key}
                      onClick={() => {
                        setActive(item.key);
                        setSaved(false);
                      }}
                      className={`cursor-pointer border-b border-slate-100 last:border-0 ${
                        active === item.key
                          ? "bg-[#f4f8f7]"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="p-5 font-medium">{item.name}</td>
                      <td className="p-5">{option.duration}</td>
                      <td className="p-5">
                        ₹{option.cost.toLocaleString("en-IN")}
                      </td>
                      <td className="p-5">{option.transfers}</td>
                      <td className="p-5">
                        {option.legs[0]?.departure || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold">{value}</p>
  </div>
);

export default Compare;
