import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  MapPin,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Place = {
  name: string;
  area: string;
  distance: string;
  match: number;
  description: string;
  tags: string[];
  image: string;
};

const placesByDestination: Record<string, Place[]> = {
  Delhi: [
    {
      name: "Lodhi Garden",
      area: "New Delhi",
      distance: "6 km",
      match: 94,
      description:
        "Peaceful gardens, greenery and historic architecture in the heart of Delhi.",
      tags: ["Green", "Peaceful", "Heritage"],
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Humayun's Tomb",
      area: "Nizamuddin",
      distance: "9 km",
      match: 88,
      description:
        "A calm heritage complex surrounded by gardens and Mughal architecture.",
      tags: ["Heritage", "Calm", "Scenic"],
      image:
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Sunder Nursery",
      area: "Nizamuddin",
      distance: "10 km",
      match: 91,
      description:
        "Landscape gardens, monuments and quiet green spaces close to central Delhi.",
      tags: ["Nature", "Relaxed", "Scenic"],
      image:
        "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80",
    },
  ],

  Mumbai: [
    {
      name: "Sanjay Gandhi National Park",
      area: "Borivali",
      distance: "18 km",
      match: 93,
      description:
        "A large green escape inside Mumbai with forests, trails and peaceful spaces.",
      tags: ["Nature", "Green", "Peaceful"],
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Marine Drive",
      area: "South Mumbai",
      distance: "4 km",
      match: 82,
      description:
        "Open sea views and a relaxed urban atmosphere along Mumbai's coast.",
      tags: ["Sea", "Scenic", "Relaxed"],
      image:
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Bandra Fort",
      area: "Bandra",
      distance: "8 km",
      match: 86,
      description:
        "Historic coastal surroundings with greenery and views across the Arabian Sea.",
      tags: ["Heritage", "Sea", "Scenic"],
      image:
        "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1200&q=80",
    },
  ],

  Jaipur: [
    {
      name: "Amber Fort",
      area: "Amer",
      distance: "11 km",
      match: 95,
      description:
        "Grand heritage architecture surrounded by hills and dramatic landscapes.",
      tags: ["Heritage", "Scenic", "Architecture"],
      image:
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Jal Mahal",
      area: "Amer Road",
      distance: "7 km",
      match: 89,
      description:
        "A peaceful palace rising from Man Sagar Lake with beautiful surroundings.",
      tags: ["Water", "Heritage", "Calm"],
      image:
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "City Palace",
      area: "Old Jaipur",
      distance: "3 km",
      match: 87,
      description:
        "Historic courtyards, architecture and colorful streets in central Jaipur.",
      tags: ["Heritage", "Culture", "Architecture"],
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    },
  ],

  Bengaluru: [
    {
      name: "Lalbagh Botanical Garden",
      area: "South Bengaluru",
      distance: "5 km",
      match: 94,
      description:
        "A huge botanical garden offering greenery and a peaceful break from the city.",
      tags: ["Nature", "Green", "Peaceful"],
      image:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Cubbon Park",
      area: "Central Bengaluru",
      distance: "3 km",
      match: 91,
      description:
        "Large tree-lined paths and open green spaces in the center of Bengaluru.",
      tags: ["Green", "Calm", "Relaxed"],
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Bangalore Palace",
      area: "Vasanth Nagar",
      distance: "6 km",
      match: 84,
      description:
        "Historic architecture and landscaped grounds within the city.",
      tags: ["Heritage", "Architecture", "Scenic"],
      image:
        "https://images.unsplash.com/photo-1600093779194-e9f4a6d2f7f7?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

const fallbackPlaces: Place[] = [
  {
    name: "Lodhi Garden",
    area: "Delhi",
    distance: "Nearby",
    match: 90,
    description:
      "A peaceful green space with historic architecture and scenic surroundings.",
    tags: ["Green", "Peaceful", "Heritage"],
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Sunder Nursery",
    area: "Delhi",
    distance: "Nearby",
    match: 87,
    description:
      "Beautiful gardens and heritage structures for a relaxed escape.",
    tags: ["Nature", "Relaxed", "Scenic"],
    image:
      "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80",
  },
];

const vibes = ["Nature", "Peaceful", "Scenic", "Relaxed"];

export default function VibeMatcher() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const places =
    placesByDestination[destination.trim()] ?? fallbackPlaces;

  const handleImage = (file?: File) => {
    if (!file) return;

    const url = URL.createObjectURL(file);

    setImage(url);
    setAnalyzing(true);
    setAnalyzed(false);

    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2500);
  };

  const clearImage = () => {
    setImage(null);
    setAnalyzed(false);
    setAnalyzing(false);
  };

  const analyzeVibe = () => {
    if (!image) {
      document.getElementById("vibe-upload")?.click();
      return;
    }

    setAnalyzing(true);
    setAnalyzed(false);

    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-[#071426] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#071426]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to YATRA
          </button>

          <div className="text-xl font-semibold tracking-tight">
            YATRA
          </div>

          <button
            onClick={() => navigate("/plan")}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition hover:bg-white/10"
          >
            Plan Journey
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* HERO */}
        <section className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-medium text-sky-300">
              <Sparkles size={14} />
              YATRA Vibe Matcher
            </div>

            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
              Find places that{" "}
              <span className="text-sky-300">feel like your picture.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/45 md:text-base">
              Tell YATRA where you're travelling and upload a photo of the
              kind of place you're looking for.
            </p>
          </motion.div>
        </section>

        {/* INPUT AREA */}
        <section className="mx-auto mt-12 max-w-4xl">
          <div className="grid gap-5 md:grid-cols-2">
            {/* DESTINATION */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                    Step 01
                  </p>
                  <h2 className="mt-1 font-medium">
                    Where are you travelling?
                  </h2>
                </div>
              </div>

              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Delhi"
                className="mt-6 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-sky-400/50"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {["Delhi", "Mumbai", "Jaipur", "Bengaluru"].map((city) => (
                  <button
                    key={city}
                    onClick={() => setDestination(city)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      destination === city
                        ? "border-sky-400/40 bg-sky-400/10 text-sky-300"
                        : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* PHOTO */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                  <Camera size={20} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                    Step 02
                  </p>
                  <h2 className="mt-1 font-medium">
                    Show us your inspiration
                  </h2>
                </div>
              </div>

              <div className="mt-6">
                {!image ? (
                  <button
                    onClick={() =>
                      document.getElementById("vibe-upload")?.click()
                    }
                    className="flex min-h-[125px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/10 transition hover:border-sky-400/40 hover:bg-sky-400/[0.03]"
                  >
                    <Upload className="text-sky-300" size={23} />

                    <span className="mt-3 text-sm font-medium">
                      Upload a photo
                    </span>

                    <span className="mt-1 text-xs text-white/30">
                      JPG, PNG or WEBP
                    </span>
                  </button>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={image}
                      alt="Travel inspiration"
                      className="h-[125px] w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/25" />

                    <button
                      onClick={clearImage}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60"
                    >
                      <X size={15} />
                    </button>

                    <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1.5 text-xs backdrop-blur">
                      Inspiration uploaded
                    </div>
                  </div>
                )}
              </div>

              <input
                id="vibe-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e.target.files?.[0])}
              />
            </motion.div>
          </div>

          {/* ANALYZE */}
          <motion.button
            onClick={analyzeVibe}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={analyzing}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-sky-500 py-4 font-semibold text-white transition hover:bg-sky-400 disabled:cursor-wait disabled:opacity-70"
          >
            <Sparkles size={18} />

            {analyzing
              ? "Understanding your vibe..."
              : "Find similar places"}

            {!analyzing && <ArrowRight size={17} />}
          </motion.button>
        </section>

        {/* ANALYSIS */}
        <AnimatePresence>
          {analyzing && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-10 max-w-4xl rounded-3xl border border-sky-400/20 bg-sky-400/[0.04] p-8 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "linear",
                }}
                className="mx-auto h-10 w-10 rounded-full border-2 border-white/10 border-t-sky-300"
              />

              <h2 className="mt-5 text-xl font-semibold">
                Understanding your vibe...
              </h2>

              <div className="mx-auto mt-5 flex max-w-md justify-center gap-2">
                {["Colors", "Scenery", "Atmosphere", "Architecture"].map(
                  (item, index) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0.25 }}
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{
                        duration: 1.4,
                        delay: index * 0.2,
                        repeat: Infinity,
                      }}
                      className="rounded-full bg-white/5 px-3 py-1.5 text-[11px] text-white/50"
                    >
                      {item}
                    </motion.span>
                  )
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* RESULTS */}
        <AnimatePresence>
          {analyzed && !analyzing && (
            <motion.section
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-14"
            >
              <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                    {destination
                      ? `Matches around ${destination}`
                      : "Nearby matches"}
                  </p>

                  <h2 className="mt-2 font-serif text-3xl md:text-4xl">
                    Places that feel like this.
                  </h2>

                  <p className="mt-2 text-sm text-white/40">
                    YATRA matched your inspiration with places near your
                    destination.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {vibes.map((vibe) => (
                    <span
                      key={vibe}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50"
                    >
                      {vibe}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {places.map((place, index) => (
                  <motion.article
                    key={place.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.12 }}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
                  >
                    <div className="relative h-56">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-transparent to-transparent" />

                      <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur">
                        {place.match}% match
                      </div>

                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-semibold">
                          {place.name}
                        </h3>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
                          <MapPin size={12} />
                          {place.area} · {place.distance}
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-sm leading-6 text-white/50">
                        {place.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {place.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2 text-xs text-emerald-300">
                          <Check size={14} />
                          Similar scenery & atmosphere
                        </div>

                        <button
                          onClick={() =>
                            navigate("/plan", {
                              state: {
                                query: `I want to visit ${place.name} near ${
                                  destination || "my destination"
                                }`,
                              },
                            })
                          }
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-[#071426] transition hover:bg-sky-100"
                        >
                          Plan this trip
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}