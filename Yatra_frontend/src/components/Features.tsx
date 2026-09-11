import { motion } from "framer-motion";
import {
  Clock3,
  House,
  MapPin,
  Route,
  Sparkles,
  Star,
  UserRound,
  WalletCards,
} from "lucide-react";
import data from "../data.json";

const icons = [
  House,
  Route,
  Clock3,
  WalletCards,
  Sparkles,
  Star,
  MapPin,
  UserRound,
];

const Features = () => (
  <section
    id="features"
    className="bg-[#f2f0e9] px-5 py-16 sm:px-8"
  >
    <div className="mx-auto max-w-7xl">
      <div className="mb-9 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#98631f]">
          What YATRA does
        </p>

        <h2 className="mt-2 font-serif text-3xl text-[#182e44] md:text-4xl">
          Everything connected in one journey.
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.features.map((feature, index) => {
          const Icon = icons[index];

          return (
            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              whileHover={{
                y: -5,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.04,
              }}
              className="rounded-2xl border border-[#16294a]/10 bg-white p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f0f1] text-[#286783]">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-[#182e44]">
                {feature.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Features;