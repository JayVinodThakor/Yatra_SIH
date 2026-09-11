import { motion } from "framer-motion";
import { AlertCircle, Route } from "lucide-react";

const ProblemSolution = () => {
  return (
    <section className="bg-[#f7f4ec] px-5 py-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">

        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-[#16294a]/10 bg-[#fffdf8] p-7 md:p-9"
        >
          <AlertCircle className="h-6 w-6 text-[#d18a2d]" />

          <h2 className="mt-5 font-serif text-3xl text-[#182e44]">
            The problem
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            Travelers manually figure out trains, flights,
            buses, cabs and local transport separately. They
            also calculate timings, fares, transfers and when
            they need to leave.
          </p>

          <div className="mt-6 border-l-2 border-[#d18a2d] pl-4">
            <p className="font-serif text-lg italic text-[#34485a]">
              “I just want to go from my home to my destination.
              Not plan every step of the journey.”
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-[#102942] p-7 text-white md:p-9"
        >
          <Route className="h-6 w-6 text-[#79b4ca]" />

          <h2 className="mt-5 font-serif text-3xl">
            The solution
          </h2>

          <p className="mt-4 text-sm leading-7 text-white/65">
            YATRA combines multiple transportation modes into
            one intelligent door-to-door journey - from your
            current location to your final destination.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-2">
            {[
              "Door-to-Door",
              "Multimodal",
              "Smart Timing",
              "Recommendations",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-white/10 p-3 text-xs text-white/80"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolution;