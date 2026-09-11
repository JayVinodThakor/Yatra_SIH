import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  ShieldAlert,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import ProblemSolution from "../components/ProblemSolution";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import JourneyAtGlance from "../components/JourneyAtGlance";
import JourneyMap from "../components/JourneyMap";
import FinalCTA from "../components/FinalCTA";

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f4ec]">
      <Hero />

      {/* ================= NEW YATRA EXPERIENCES ================= */}
      <section className="bg-[#f7f4ec] px-5 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3678a6]">
              Beyond route planning
            </p>

            <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-[#102942] md:text-5xl">
              Travel smarter.{" "}
              <span className="text-[#3678a6]">
                Even beyond the journey.
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#58708a] md:text-base">
              YATRA goes beyond finding a route — helping you discover places
              that match your mood and stay connected when things go wrong.
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="grid gap-5 lg:grid-cols-2">
            {/* VIBE MATCHER */}
            <motion.button
              type="button"
              onClick={() => navigate("/vibe")}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.99 }}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-[28px] border border-[#dce5e9] bg-white p-7 text-left shadow-sm transition-shadow hover:shadow-xl md:p-9"
            >
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#8dc8e8]/20 blur-3xl transition-all duration-500 group-hover:bg-[#8dc8e8]/30" />

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f3f8] text-[#3678a6]">
                    <Camera className="h-6 w-6" />
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full bg-[#edf6f3] px-3 py-1.5 text-[10px] font-semibold text-[#4d8b72]">
                    <Sparkles className="h-3 w-3" />
                    AI POWERED
                  </div>
                </div>

                <h3 className="mt-8 font-serif text-3xl text-[#102942] md:text-4xl">
                  Vibe Matcher
                </h3>

                <p className="mt-3 max-w-lg text-sm leading-6 text-[#60758a]">
                  Have a picture of a place you love? Upload it and YATRA
                  discovers Indian destinations with a similar atmosphere,
                  scenery and vibe.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {["Nature", "Peaceful", "Scenic", "Adventure"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#dce7eb] bg-[#f7fafb] px-3 py-1.5 text-xs text-[#547086]"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>

                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#3678a6]">
                  Explore your vibe
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </motion.button>

            {/* ZERO NETWORK SOS */}
            <motion.button
              type="button"
              onClick={() => navigate("/sos")}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.99 }}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative overflow-hidden rounded-[28px] bg-[#102942] p-7 text-left shadow-sm transition-shadow hover:shadow-xl md:p-9"
            >
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#d9822b]/10 blur-3xl transition-all duration-500 group-hover:bg-[#d9822b]/20" />

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#f0a45b]">
                    <ShieldAlert className="h-6 w-6" />
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-white/60">
                    <WifiOff className="h-3 w-3" />
                    ZERO-NETWORK
                  </div>
                </div>

                <h3 className="mt-8 font-serif text-3xl text-white md:text-4xl">
                  YATRA SOS
                </h3>

                <p className="mt-3 max-w-lg text-sm leading-6 text-white/55">
                  Emergency assistance designed for situations where mobile
                  or internet connectivity is unavailable.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Offline SOS",
                    "Location Ready",
                    "Nearby Devices",
                    "Emergency Relay",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/55"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#f0a45b]">
                  Open emergency mode
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* EXISTING SECTIONS */}
      <ProblemSolution />

      <Features />

      <HowItWorks />

      <JourneyAtGlance />

      <JourneyMap />

      <FinalCTA />
    </main>
  );
};

export default Index;