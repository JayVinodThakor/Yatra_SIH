import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  Sparkles,
  TrainFront,
} from "lucide-react";

import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.avif";
import hero3 from "../assets/hero3.jpeg";

const images = [hero1, hero2, hero3];

const ease = [0.22, 1, 0.36, 1] as const;

const Hero = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [tripType, setTripType] = useState("One way");
const [passengers, setPassengers] = useState("1 Passenger");
const [preference, setPreference] = useState("Balanced");
const [transportMode, setTransportMode] = useState("Any mode");



  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="planner"
      className="relative isolate min-h-screen w-full overflow-hidden bg-[#081d30] text-white"
    >
      <div className="absolute inset-0 -z-20">
        <AnimatePresence mode="sync">
          <motion.img
            key={images[active]}
            src={images[active]}
            alt=""
            initial={{
              opacity: 0,
              scale: 1.08,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              opacity: {
                duration: 1.4,
                ease: "easeInOut",
              },
              scale: {
                duration: 6,
                ease: "linear",
              },
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 -z-10 bg-[#071b2d]/60" />

      <div className="absolute inset-0 -z-10 bg-linear-to-b from-[#061a2b]/80 via-[#0a2135]/45 to-[#061827]/95" />

      <motion.svg
        viewBox="0 0 1000 500"
        fill="none"
        className="pointer-events-none absolute right-0 top-0 -z-5 h-full w-full opacity-25"
      >
        <motion.path
          d="M-50 430 C150 180 260 470 450 270 C610 100 760 330 1050 70"
          stroke="white"
          strokeWidth="1"
          strokeDasharray="7 10"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 3.5,
            ease,
          }}
        />
      </motion.svg>

      {/* content */}
      <div className="relative z-10 flex min-h-screen w-full flex-col pt-32 sm:pt-36 md:pt-40">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease,
          }}
          className="w-full p-6 md:p-14 lg:p-20 xl:p-24"
        >
          <h1 className="font-serif text-4xl md:text-7xl">
            Where do you want to go?
          </h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease,
            }}
            className="mt-6 max-w-2xl text-sm leading-6 text-white/70 sm:text-base md:text-lg"
          >
            Tell us your destination and we'll plan the complete journey across
            trains, flights, buses, metros and cabs.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
            duration: 0.8,
            ease,
          }}
          className="w-full"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.35,
              duration: 0.8,
              ease,
            }}
            className="w-full"
          >
            <motion.div
  whileHover={{
    y: -3,
    boxShadow: "0 30px 80px rgba(0,0,0,.25)",
  }}
  transition={{ duration: 0.3 }}
  className="mx-auto w-[calc(100%-3rem)] max-w-7xl rounded-[28px] border border-white/30 bg-white/95 p-4 shadow-2xl backdrop-blur-xl md:p-6"
>
  {/* AI HEADER */}
  <div className="mb-3 flex items-center gap-2 px-2">
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8f1f5]">
      <Sparkles className="h-4 w-4 text-[#3678a6]" />
    </div>

    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#3678a6]">
        YATRA AI
      </p>

      <p className="text-[10px] text-slate-400">
        Describe your journey naturally
      </p>
    </div>
  </div>

  {/* NATURAL LANGUAGE INPUT */}
  <div className="flex min-h-[68px] items-center rounded-2xl border border-slate-200 bg-[#f8fafb] px-4 transition focus-within:border-[#3678a6] focus-within:ring-4 focus-within:ring-[#3678a6]/10">
    <Sparkles className="mr-3 h-5 w-5 shrink-0 text-[#3678a6]" />

    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="I need to reach Delhi tomorrow around 6 PM"
      className="w-full bg-transparent text-base font-medium text-[#172d43] outline-none placeholder:text-slate-400 sm:text-lg"
    />
  </div>

  {/* TRAVEL OPTIONS */}
  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">

   {/* TRIP TYPE */}
<div className="relative">
  <label className="flex min-h-[60px] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-[#3678a6]/50">
    <CalendarDays className="h-5 w-5 shrink-0 text-[#3678a6]" />

    <div className="min-w-0 flex-1">
      <span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
        Trip type
      </span>

      <select
        value={tripType}
        onChange={(e) => setTripType(e.target.value)}
        className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-[#172d43] outline-none"
      >
        <option>One way</option>
        <option>Round trip</option>
      </select>
    </div>

    <span className="pointer-events-none text-xs text-slate-400">
     ⌄
    </span>
  </label>
</div>


{/* PASSENGERS */}
<div className="relative">
  <label className="flex min-h-[60px] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-[#3678a6]/50">
    <MapPin className="h-5 w-5 shrink-0 text-[#3678a6]" />

    <div className="min-w-0 flex-1">
      <span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
        Passengers
      </span>

      <select
        value={passengers}
        onChange={(e) => setPassengers(e.target.value)}
        className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-[#172d43] outline-none"
      >
        <option>1 Passenger</option>
        <option>2 Passengers</option>
        <option>3 Passengers</option>
        <option>4 Passengers</option>
        <option>5 Passengers</option>
        <option>6 Passengers</option>
      </select>
    </div>

    <span className="pointer-events-none text-xs text-slate-400">
     ⌄
    </span>
  </label>
</div>



{/* PREFERENCES */}
<div className="relative">
  <label className="flex min-h-[60px] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-[#3678a6]/50">
    <Clock3 className="h-5 w-5 shrink-0 text-[#3678a6]" />

    <div className="min-w-0 flex-1">
      <span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
        Preferences
      </span>

      <select
        value={preference}
        onChange={(e) => setPreference(e.target.value)}
        className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-[#172d43] outline-none"
      >
        <option>Balanced</option>
        <option>Fastest</option>
        <option>Cheapest</option>
        <option>Most Convenient</option>
      </select>
    </div>

    <span className="pointer-events-none text-xs text-slate-400">
     ⌄
    </span>
  </label>
</div>
{/* TRANSPORT MODE */}
<div className="relative">
  <label className="flex min-h-[60px] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-[#3678a6]/50">
    <TrainFront className="h-5 w-5 shrink-0 text-[#3678a6]" />

    <div className="min-w-0 flex-1">
      <span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
        Transport
      </span>

      <select
        value={transportMode}
        onChange={(e) => setTransportMode(e.target.value)}
        className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-[#172d43] outline-none"
      >
        <option>Any mode</option>
        <option>Train</option>
        <option>Flight</option>
        <option>Bus</option>
        <option>Metro</option>
        <option>Cab</option>
      </select>
    </div>

    <span className="pointer-events-none text-xs text-slate-400">
      ⌄
    </span>
  </label>
</div>

    {/* PLAN BUTTON */}
   <motion.button
  whileHover={{
    scale: 1.02,
    boxShadow: "0 12px 30px rgba(16,41,66,0.25)",
  }}
  whileTap={{ scale: 0.97 }}
  
  onClick={() =>
  navigate("/plan", {
    state: {
      query,
      tripType,
      passengers,
      preference,
      transportMode,
    },
  })
}
  className="flex min-h-[60px] items-center justify-center gap-2 rounded-xl bg-[#102942] px-7 font-semibold text-white transition hover:bg-[#163754] cursor-pointer"
>
  <Search className="h-5 w-5" />

  <span>Plan Journey</span>

  <ArrowRight className="h-4 w-4" />
</motion.button>
  </div>

  {/* FOOTER */}
  <div className="mt-3 flex items-center justify-between px-2">
    <p className="text-[10px] text-slate-400 sm:text-xs">
      YATRA combines trains, flights, buses, metros, cabs & walking.
    </p>

    <span className="hidden items-center gap-1.5 text-[10px] font-medium text-[#4d8b72] sm:flex">
      <span className="h-1.5 w-1.5 rounded-full bg-[#4d8b72]" />
      Smart planning
    </span>
  </div>
</motion.div>
          </motion.div>
        </motion.div>

        {/* Image Indicators */}
        <div className="flex justify-center gap-2 py-6">
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setActive(index)}
              animate={{
                width: active === index ? 32 : 7,
                opacity: active === index ? 1 : 0.45,
              }}
              transition={{
                duration: 0.3,
              }}
              className="h-1.5 rounded-full bg-white"
              aria-label={`Travel scene ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
