import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Check,
  MapPin,
  Radio,
  ShieldAlert,
  Smartphone,
  WifiOff,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SOS() {
  const navigate = useNavigate();

  const [activated, setActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [transmitted, setTransmitted] = useState(false);

  useEffect(() => {
    if (!activated || transmitted) return;

    if (countdown === 0) {
      setTransmitted(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activated, countdown, transmitted]);

  const activateSOS = () => {
    setActivated(true);
    setCountdown(5);
    setTransmitted(false);
  };

  const cancelSOS = () => {
    setActivated(false);
    setCountdown(5);
    setTransmitted(false);
  };

  return (
    <main className="min-h-screen bg-[#070d18] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <button
            onClick={() => navigate("/")}
            className="text-xl font-semibold"
          >
            YATRA
          </button>

          <div className="flex items-center gap-2 text-xs text-white/40">
            <WifiOff size={14} />
            Offline Mode
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-center">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-medium text-orange-300">
            <ShieldAlert size={14} />
            Zero-Network Safety
          </div>

          <h1 className="mt-7 text-4xl font-semibold md:text-6xl">
            YATRA SOS
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/45 md:text-base">
            Emergency assistance designed to work even when conventional
            network connectivity is unavailable.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <AnimatePresence mode="wait">
            {!activated && !transmitted && (
              <motion.section
                key="idle"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-orange-400/20 bg-orange-400/10">
                  <AlertTriangle size={38} className="text-orange-300" />
                </div>

                <h2 className="mt-7 text-2xl font-semibold">
                  Emergency assistance
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/40">
                  YATRA will prepare an emergency packet containing your
                  location and SOS signal.
                </p>

                <button
                  onClick={activateSOS}
                  className="mt-8 w-full rounded-2xl bg-orange-500 py-5 text-sm font-bold text-white transition hover:bg-orange-400"
                >
                  ACTIVATE SOS
                </button>

                <p className="mt-4 text-[11px] text-white/25">
                  Use only in a genuine emergency.
                </p>
              </motion.section>
            )}

            {activated && !transmitted && (
              <motion.section
                key="countdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-[32px] border border-orange-400/20 bg-orange-400/[0.04] p-8 text-center"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
                  SOS activating
                </p>

                <motion.div
                  key={countdown}
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-7 text-8xl font-semibold tabular-nums"
                >
                  {countdown}
                </motion.div>

                <p className="mt-4 text-sm text-white/40">
                  Preparing emergency signal...
                </p>

                <div className="mt-8 space-y-3 text-left">
                  <StatusRow
                    icon={<MapPin size={15} />}
                    text="Location ready"
                  />

                  <StatusRow
                    icon={<Radio size={15} />}
                    text="Offline SOS packet ready"
                  />

                  <StatusRow
                    icon={<Smartphone size={15} />}
                    text="Searching nearby devices"
                  />
                </div>

                <button
                  onClick={cancelSOS}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-white/50 transition hover:bg-white/5"
                >
                  <X size={15} />
                  Cancel
                </button>
              </motion.section>
            )}

            {transmitted && (
              <motion.section
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[32px] border border-emerald-400/20 bg-emerald-400/[0.04] p-8"
              >
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-400/10">
                    <Check size={40} className="text-emerald-400" />
                  </div>

                  <h2 className="mt-7 text-3xl font-semibold">
                    SOS transmitted
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/40">
                    Your emergency packet has been prepared for nearby YATRA
                    devices.
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <StatusRow
                    icon={<Check size={15} />}
                    text="Emergency signal created"
                    success
                  />

                  <StatusRow
                    icon={<MapPin size={15} />}
                    text="Location attached"
                    success
                  />

                  <StatusRow
                    icon={<Radio size={15} />}
                    text="Nearby-device relay activated"
                    success
                  />

                  <StatusRow
                    icon={<Smartphone size={15} />}
                    text="Emergency contacts queued"
                    success
                  />
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-wider text-white/30">
                    Demonstration status
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/60">
                    In the full YATRA system, this packet would be relayed
                    through nearby participating devices when internet or
                    mobile connectivity is unavailable.
                  </p>
                </div>

                <button
                  onClick={cancelSOS}
                  className="mt-6 w-full rounded-xl border border-white/10 py-3 text-sm text-white/50 transition hover:bg-white/5"
                >
                  Return to SOS
                </button>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function StatusRow({
  icon,
  text,
  success = false,
}: {
  icon: React.ReactNode;
  text: string;
  success?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          success
            ? "bg-emerald-400/10 text-emerald-400"
            : "bg-white/5 text-white/50"
        }`}
      >
        {icon}
      </span>

      <span className="text-sm text-white/60">{text}</span>
    </div>
  );
}