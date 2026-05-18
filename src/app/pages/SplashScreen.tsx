import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";


export function SplashScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase("hold"), 100);
    const exitTimer = setTimeout(() => setPhase("exit"), 2800);
    const navTimer = setTimeout(() => navigate("/home", { replace: true }), 3500);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#F5FCEF] overflow-y-auto overflow-x-hidden items-center justify-center relative">
      {/* Decorative background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-48 h-48 bg-amber-400/8 rounded-full blur-2xl" />
      </div>

      {/* Logo + Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={
          phase === "exit"
            ? { opacity: 0, scale: 1.1, y: -30 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={
          phase === "exit"
            ? { duration: 0.6, ease: "easeIn" }
            : { duration: 0.8, ease: "easeOut" }
        }
        className="relative flex flex-col items-center"
      >
        {/* Logo Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="w-52 h-52 -mb-12 relative"
        >
          <img
            src="/logo.png"
            alt="SiPanen Logo"
            className="w-full h-full object-contain scale-110"
          />
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="relative z-10 text-[32px] font-bold text-zinc-900 tracking-tight font-[Poppins,sans-serif]"
        >
          SiPanen
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
          className="text-emerald-600 text-xs font-medium mt-1 tracking-wide"
        >
          Masa Depan Pangan dalam Satu Genggaman
        </motion.p>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-10 flex items-center gap-1.5"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom version */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "exit" ? 0 : 0.4 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 text-zinc-400 text-[10px]"
      >
        v2.1.0
      </motion.p>
    </div>
  );
}
