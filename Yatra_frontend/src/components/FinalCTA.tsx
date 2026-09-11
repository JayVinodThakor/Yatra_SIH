import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTA = () => (
  <section className="bg-[#f7f4ec] px-5 py-16 sm:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#102942] px-6 py-12 text-center text-white md:px-12"
    >
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#3678a6]/20 blur-3xl"
      />

      <div className="relative">
        <Sparkles className="mx-auto h-6 w-6 text-[#79b4ca]" />

        <h2 className="mt-5 font-serif text-3xl md:text-5xl">
          Ready to plan the complete journey?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm text-white/55">
          Tell YATRA where you want to go and let it connect
          every step.
        </p>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            to="/plan"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#102942]"
          >
            Plan Journey
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  </section>
);

export default FinalCTA;