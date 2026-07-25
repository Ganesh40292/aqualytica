import { motion } from "framer-motion";

function DashboardHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-10 rounded-3xl p-8 bg-slate-900/20 border border-slate-800/40 shadow-2xl backdrop-blur-3xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div>
          <p className="text-slate-350 text-base tracking-wide leading-relaxed">
            Real-time water diagnostics network and safety classification diagnostics.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

export default DashboardHero;