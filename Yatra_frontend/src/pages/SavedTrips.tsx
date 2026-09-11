import { useEffect, useState } from "react";
import { Bookmark, MapPin, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

type JourneyLeg = {
  mode: string;
  from: string;
  to: string;
  duration: string;
  departure: string;
  arrival: string;
};

type SavedTrip = {
  id: string;
  title: string;
  origin: string;
  destination: string;
  option: string;
  optionKey?: string;
  cost: number;
  duration: string;
  transfers: number;
  query?: string;
  legs?: JourneyLeg[];
  savedAt: string;
};

const formatSavedDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Saved trip";

  return `Saved ${date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
};

const SavedTrips = () => {
  const [trips, setTrips] = useState<SavedTrip[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("yatra_saved_trips") || "[]"
      );

      if (Array.isArray(stored)) {
        setTrips(stored);
      }
    } catch (error) {
      console.error("Could not load saved trips:", error);
    }
  }, []);

  const removeTrip = (id: string) => {
    const updated = trips.filter((trip) => trip.id !== id);
    setTrips(updated);
    localStorage.setItem(
      "yatra_saved_trips",
      JSON.stringify(updated)
    );
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f4f7fb] p-6 sm:p-8 md:p-12 lg:p-16 mt-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Your library
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0f172a]">
          Saved trips
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Keep itineraries handy and return to journeys you actually saved.
        </p>

        {trips.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-[#3678a6]">
              <Bookmark className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No saved trips yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Plan a journey and tap “Save Trip” to keep it here.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white"
            >
              Plan a journey
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {trips.map((trip) => (
              <article
                key={trip.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex min-w-0 gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[#f97316]">
                    <MapPin className="h-4 w-4" />
                  </span>

                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900">
                      {trip.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {trip.option} · {trip.duration} · ₹
                      {trip.cost.toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {trip.transfers}{" "}
                      {trip.transfers === 1 ? "transfer" : "transfers"} ·{" "}
                      {formatSavedDate(trip.savedAt)}
                    </p>

                    {trip.query && (
                      <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                        "{trip.query}"
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeTrip(trip.id)}
                  title="Remove trip"
                  className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}

        <Link
          to="/"
          className="mt-8 inline-flex rounded-xl bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white"
        >
          Plan another journey
        </Link>
      </div>
    </main>
  );
};

export default SavedTrips;
