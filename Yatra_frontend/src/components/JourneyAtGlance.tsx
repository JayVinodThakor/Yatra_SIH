import { motion } from "framer-motion";
import {
  ArrowRight,
  CarFront,
  Check,
  Clock3,
  Home,
  MapPin,
  Route,
  TrainFront,
  WalletCards,
} from "lucide-react";
import data from "../data.json";

const JourneyAtGlance = () => {
  const timeline = data.journey.timeline;

  return (
    <section
      id="journey"
      className="bg-[#f7f4ec] px-5 py-16 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#98631f]">
            Example journey
          </p>

          <h2 className="mt-2 font-serif text-3xl text-[#182e44] md:text-4xl">
            Journey at a Glance
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Plan. Compare. Choose. Travel.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">

          {/* Journey */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[#16294a]/10 bg-white p-5"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl">
                  Complete Journey
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {data.journey.from} → {data.journey.destination}
                </p>
              </div>

              <span className="rounded-full bg-[#e9f2ec] px-3 py-1 text-[9px] font-semibold text-[#4d8b72]">
                Best Overall
              </span>
            </div>

            <div>
              {timeline.map((item, index) => (
                <motion.div
                  key={item.place}
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.12,
                  }}
                  className="flex gap-3"
                >
                  <div className="w-14 pt-2 text-right text-[9px] font-semibold text-slate-400">
                    {item.time}
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        item.type === "cab"
                          ? "bg-[#fff0d9] text-[#c27b1e]"
                          : item.type === "destination"
                            ? "bg-[#f7e7e5] text-[#c65d61]"
                            : "bg-[#e8f0f1] text-[#286783]"
                      }`}
                    >
                      {item.type === "home" && (
                        <Home className="h-4 w-4" />
                      )}

                      {item.type === "cab" && (
                        <CarFront className="h-4 w-4" />
                      )}

                      {item.type === "train" && (
                        <TrainFront className="h-4 w-4" />
                      )}

                      {item.type === "destination" && (
                        <MapPin className="h-4 w-4" />
                      )}
                    </div>

                    {index < timeline.length - 1 && (
                      <motion.div
                        initial={{
                          scaleY: 0,
                        }}
                        whileInView={{
                          scaleY: 1,
                        }}
                        viewport={{ once: true }}
                        className="h-12 w-px origin-top bg-slate-200"
                      />
                    )}
                  </div>

                  <div className="pb-5 pt-1">
                    <p className="text-xs font-semibold text-[#182e44]">
                      {item.place}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-3 border-t border-slate-100 pt-5">
              <Stat
                icon={<Clock3 />}
                value={data.journey.totalDuration}
                label="Duration"
              />

              <Stat
                icon={<WalletCards />}
                value={data.journey.totalFare}
                label="Fare"
              />

              <Stat
                icon={<Route />}
                value={String(data.journey.transfers)}
                label="Transfers"
              />
            </div>
          </motion.div>

          {/* Recommendation */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-[#16294a]/10 bg-white p-5">
              <h3 className="font-serif text-xl">
                Why this recommendation?
              </h3>

              <div className="mt-5 space-y-3">
                {[
                  "Balanced travel time and fare",
                  "Fewer unnecessary transfers",
                  "Transport availability considered",
                  "Buffer between journey steps",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4 text-[#4d8b72]" />

                    <span className="text-xs text-slate-500">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#102942] p-6 text-white">
              <p className="text-xs uppercase tracking-widest text-white/40">
                Your journey
              </p>

              <h3 className="mt-3 font-serif text-2xl">
                One plan.
                <br />
                Every connection.
              </h3>

              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className="mt-6 flex items-center gap-2 text-xs font-semibold cursor-pointer"
              >
                View Full Journey
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <div className="text-center">
    <div className="mb-1 flex justify-center text-[#3678a6]">
      {icon}
    </div>

    <p className="text-xs font-bold text-[#182e44]">
      {value}
    </p>

    <p className="mt-1 text-[9px] text-slate-400">
      {label}
    </p>
  </div>
);

export default JourneyAtGlance;