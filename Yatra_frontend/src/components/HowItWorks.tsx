import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  Star,
  WalletCards,
} from "lucide-react";
import data from "../data.json";

const icons = [
  Sparkles,
  Search,
  WalletCards,
  Star,
];

const HowItWorks = () => (
  <section
    id="how-it-works"
    className="bg-[#102942] px-5 py-16 text-white sm:px-8"
  >
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[#79b4ca]">
          Simple by design
        </p>

        <h2 className="mt-2 font-serif text-3xl md:text-4xl">
          How YATRA works
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.howItWorks.map((step, index) => {
          const Icon = icons[index];

          return (
            <motion.div
              key={step.number}
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
              }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-white/15">
                  {step.number}
                </span>

                <Icon className="h-5 w-5 text-[#79b4ca]" />
              </div>

              <h3 className="mt-8 font-serif text-xl">
                {step.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-white/50">
                {step.description}
              </p>

              {index < 3 && (
                <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-white/20 lg:block" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowItWorks;